const { admin, db } = require('../util/admin');

const config = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(config);

const { validateSignupData, validateloginData, reduceUserDetails } = require('../util/validators')

exports.signup = (req, res) => {
    const newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    }

    const { valid, errors } = validateSignupData(newUser);

    if (!valid) return res.status(400).json(errors);

    const noImg = 'no-img.png';

    let token;
    let userId;
    firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password, )
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(idToken => {
            token = idToken;
            db.collection('users').doc(userId).set({
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
                followersCount: 0,
                followingCount: 0,
            })
                .then(() => res.status(201).json({ token }))
        }).catch(err => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                return res.status(400).json({ email: 'Email already in use' })
            }
            else if (err.code === 'auth/weak-password') {
                return res.status(400).json({ password: 'Weak Password' })
            }
            else {
                return res.status(500).json({ general: 'Something went wrong, please try again' })
            }
        });
}
exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    const { valid, errors } = validateloginData(user);

    if (!valid) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => data.user.getIdToken())
        .then(token => res.json({ token }))
        .catch(err => {
            console.error(err);
            // if (err.code === 'auth/wrong-password') {
            //     return res.status(400).json({ password: 'Incorrect password' })
            // }
            // else if (err.code === 'auth/user-not-found') {
            //     return res.status(400).json({ email: `User doesn't exist` })
            // }
            // else {
            return res.status(500).json({ general: 'Wrong credentials, please try again' })
        })

}

exports.uploadImage = (req, res) => {
    const BusBoy = require("busboy");
    const path = require("path");
    const os = require("os");
    const fs = require("fs");

    const busboy = new BusBoy({ headers: req.headers });

    let imageToBeUploaded = {};
    let imageFileName;

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        console.log(fieldname, file, filename, encoding, mimetype);
        if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
            return res.status(400).json({ error: "Wrong file type submitted" });
        }
        // my.image.png => ['my', 'image', 'png']
        const imageExtension = filename.split(".")[filename.split(".").length - 1];
        // 32756238461724837.png
        imageFileName = `${Math.round(
            Math.random() * 1000000000000
        ).toString()}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filepath, mimetype };
        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on("finish", () => {
        admin
            .storage()
            .bucket()
            .upload(imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype,
                    },
                },
            })
            .then(() => {
                // Append token to url
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
                return db.doc(`/users/${req.user.uid}`).update({ imageUrl });
            })
            .then(() => {
                return res.json({ message: "image uploaded successfully" });
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({ error: "something went wrong" });
            });
    });
    busboy.end(req.rawBody);
}

exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body);
    db.doc(`/users/${req.user.uid}`).update(userDetails)
        .then(() => {
            return res.json({ message: 'Details added succesfully' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}

exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.uid}`).get()
        .then(doc => {
            if (doc.exists) {
                userData.credentials = doc.data();
                return res.json(userData);
            }
        }).catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}

exports.getUserDetails = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.params.userId}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                userData.user = doc.data();
                return db
                    .collection("posts")
                    .where("authorId", "==", req.params.userId)
                    .orderBy("createdAt", "desc")
                    .get();
            } else {
                return res.status(404).json({ errror: "User not found" });
            }
        })
        .then((data) => {
            userData.posts = [];
            data.forEach((doc) => {
                userData.posts.push({
                    body: doc.data().body,
                    imageUrl: doc.data().imageUrl,
                    authorId: doc.data().authorId,
                    authorImageUrl: doc.data().authorImageUrl,
                    createdAt: doc.data().createdAt,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount,
                    postId: doc.id,
                });
            });
            return res.json(userData);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
}

exports.followUser = (req, res) => {
    const userDocument = db.collection('users').doc(req.user.uid);
    const followingDocument = userDocument.collection('following').doc(req.params.userId);

    let userData;

    userDocument
        .get()
        .then((doc) => {
            if (doc.exists) {
                userData = doc.data();
                userData.userId = doc.id;
                return followingDocument.get()
            } else {
                return res.status(404).json({ error: 'User not found' });
            }
        })
        .then((followDoc) => {
            if (!followDoc.exists) {
                followingDocument
                    .set({
                        follow: true,
                    })
                    .then(() => {
                        userData.followingCount++;
                        userDocument.update({ followingCount: userData.followingCount });
                        db.collection('users').doc(req.params.userId).get()
                            .then(doc => {
                                const followersCount = doc.data().followersCount + 1;
                                doc.ref.update({
                                    followersCount
                                })
                            })
                    })
                    .then(() => {
                        return res.json(userData);
                    });
            } else {
                return res.status(400).json({ error: 'User already followed' });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
}

exports.unfollowUser = (req, res) => {
    const userDocument = db.collection('users').doc(req.user.uid);
    const followingDocument = userDocument.collection('following').doc(req.params.userId);

    let userData;

    userDocument
        .get()
        .then((doc) => {
            if (doc.exists) {
                userData = doc.data();
                userData.userId = doc.id;
                return followingDocument.get()
            } else {
                return res.status(404).json({ error: 'User not found' });
            }
        })
        .then((followDoc) => {
            if (followDoc.exists) {
                followingDocument
                    .delete()
                    .then(() => {
                        userData.followingCount--;
                        userDocument.update({ followingCount: userData.followingCount });
                        db.collection('users').doc(req.params.userId).get()
                            .then(doc => {
                                const followersCount = doc.data().followersCount - 1;
                                doc.ref.update({
                                    followersCount
                                })
                            })
                    })
                    .then(() => {
                        return res.json(userData);
                    });
            } else {
                return res.status(400).json({ error: 'user not followed' });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
}