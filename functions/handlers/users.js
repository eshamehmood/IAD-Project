const {
    admin,
    db
} = require('../util/admin');

const config = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(config);

const { validateSignupData, validateloginData, reduceUserDetails } = require('../util/validators')

exports.signup = (req, res) => {
    const newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        name: [req.body.firstName, req.body.lastName],
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
                name: newUser.name,
                bio: 'No bio',
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
                followersCount: 0,
                followingCount: 0,
                following: [],
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
    let userData = {
        credentials: {},
    };
    db.collection('users').doc(req.user.uid)
        .get()
        .then(doc => {
            if (doc.exists) {
                userData.credentials = doc.data();
                userData.credentials.id = doc.id;
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
                userData = doc.data();
                return res.json(userData);
            } else {
                return res.status(404).json({ errror: "User not found" });
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.message });
        });
}
exports.searchUsers = (req, res) => {
    db.collection('users')
        .where('name', 'array-contains', req.params.searchName)
        .get()
        .then((data) => {
            let users = [];
            data.forEach((doc) => {
                users.push({
                    userId: doc.id,
                    bio: doc.data().bio,
                    firstName: doc.data().firstName,
                    lastName: doc.data().lastName,
                    imageUrl: doc.data().imageUrl,
                });
            })
            return res.json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
}

exports.followUser = (req, res) => {
    const userDocument = db.collection('users').doc(req.user.uid);
    const followUserDocument = db.collection('users').doc(req.params.userId)
    userDocument
        .get()
        .then((doc) => {
            if (doc.data().following.includes(req.params.userId)) {
                return res.json({ error: 'Already following this user' });
            }
            else {
                doc.ref.update({
                    followingCount: admin.firestore.FieldValue.increment(1),
                    following: admin.firestore.FieldValue.arrayUnion(req.params.userId)
                })
                    .then(() => {
                        followUserDocument.update({
                            followersCount: admin.firestore.FieldValue.increment(1),
                        })
                        return res.json({ userId: req.params.userId });
                    })
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });;
}

exports.unfollowUser = (req, res) => {

    const userDocument = db.collection('users').doc(req.user.uid);
    const followUserDocument = db.collection('users').doc(req.params.userId)
    userDocument
        .get()
        .then((doc) => {
            if (!doc.data().following.includes(req.params.userId)) {
                return res.json({ error: 'Not following this user' });
            }
            else {
                doc.ref.update({
                    followingCount: admin.firestore.FieldValue.increment(-1),
                    following: admin.firestore.FieldValue.arrayRemove(req.params.userId)
                })
                    .then(() => {
                        followUserDocument.update({
                            followersCount: admin.firestore.FieldValue.increment(-1),
                        })
                        return res.json({ userId: req.params.userId });
                    })
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });;
}