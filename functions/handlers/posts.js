const { db, admin } = require('../util/admin');
const config = require('../util/config');

exports.getAllPosts = (req, res) => {
    db.collection('posts')
        .orderBy('createdAt', 'desc')
        .get()
        .then((data) => {
            let posts = [];
            data.forEach((doc) => {
                posts.push({
                    postId: doc.id,
                    authorId: doc.data().authorId,
                    authorImageUrl: doc.data().authorImageUrl,
                    authorUsername: doc.data().authorUsername,
                    body: doc.data().body,
                    commentCount: doc.data().commentCount,
                    createdAt: doc.data().createdAt,
                    imageUrl: doc.data().imageUrl,
                    likeCount: doc.data().likeCount,
                });
            });
            return res.json(posts);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
}

exports.createPost = (req, res) => {

    const BusBoy = require("busboy");
    const path = require("path");
    const os = require("os");
    const fs = require("fs");

    const busboy = new BusBoy({ headers: req.headers });

    let imageToBeUploaded = {};
    let imageFileName;


    let formData = new Map();
    busboy.on('field', (fieldname, val) => {
        formData.set(fieldname, val);
    });


    if (formData.get('body').trim() === '') {
        return res.status(400).json({ body: 'Body must not be empty' });
    }

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        console.log(fieldname, file, filename, encoding, mimetype);
        if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
            return res.status(400).json({ error: "Wrong file type submitted" });
        }
        const imageExtension = filename.split(".")[filename.split(".").length - 1];
        imageFileName = `post-${Math.round(
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
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
                return db.collection('posts').add({
                    imageUrl,
                    body: formData.get('body'),
                    authorId: req.user.uid,
                    authorUsername: req.user.username,
                    authorImageUrl: req.user.imageUrl,
                    createdAt: new Date().toISOString(),
                    likeCount: 0,
                    commentCount: 0,
                });
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
};

exports.getPost = (req, res) => {
    let postData = {};
    db.doc(`/posts/${req.params.postId}`).get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Post not found' })
            }
            postData = doc.data();
            postData.postId = doc.id;
            return db.collection('posts').doc(postData.postId).collection('comments')
                .orderBy('createdAt', 'desc')
                .get()
        })
        .then(data => {
            postData.comments = [];
            data.forEach(doc => {
                postData.comments.push(doc.data())
            });
            return res.json(postData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code })
        })
}

exports.commentOnPost = (req, res) => {
    if (req.body.body.trim() === '') return res.status(400).json({ comment: 'Must not be empty' });
    const newComment = {
        body: req.body.body,
        authorId: req.user.uid,
        authorUsername: req.user.username,
        authorImageUrl: req.user.imageUrl,
        createdAt: new Date().toISOString(),
    };

    db.collection('posts').doc(req.body.postId).get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Post not found' })
            }
            return doc.ref.update({ commentCount: doc.data().commentCount + 1 })
        })
        .then(() => {
            return db.collection('posts').doc(req.body.postId).collection('comments').add(newComment);
        })
        .then(() => {
            return res.json(newComment);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}

exports.likePost = (req, res) => {

    const postDocument = db.collection('posts').doc(req.params.postId);

    const likeDocument = postDocument.collection('likes').doc(req.user.uid);

    let postData;

    postDocument
        .get()
        .then((doc) => {
            if (doc.exists) {
                postData = doc.data();
                postData.postId = doc.id;
                return likeDocument.get()
            } else {
                return res.status(404).json({ error: 'Post not found' });
            }
        })
        .then((likeDoc) => {
            if (!likeDoc.exists) {
                likeDocument
                    .set({
                        liked: true,
                    })
                    .then(() => {
                        postData.likeCount++;
                        postDocument.update({ likeCount: postData.likeCount });
                    })
                    .then(() => {
                        return res.json(postData);
                    });
            } else {
                return res.status(400).json({ error: 'Post already liked' });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });

}

exports.unlikePost = (req, res) => {

    const postDocument = db.collection('posts').doc(req.params.postId);
    const likeDocument = postDocument.collection('likes').doc(req.user.uid);

    let postData;

    postDocument
        .get()
        .then((doc) => {
            if (doc.exists) {
                postData = doc.data();
                postData.postId = doc.id;
                return likeDocument.get()
            } else {
                return res.status(404).json({ error: 'Post not found' });
            }
        })
        .then((likeDoc) => {
            if (!likeDoc.exists) {
                return res.status(400).json({ error: 'Post not liked' });
            } else {
                likeDocument
                    .delete()
                    .then(() => {
                        postData.likeCount--;
                        postDocument.update({ likeCount: postData.likeCount });
                    })
                    .then(() => {
                        return res.json(postData);
                    });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
}

exports.deletePost = (req, res) => {
    const postDocument = db.collection('posts').doc(req.params.postId);
    postDocument
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Post not found' });
            }
            if (doc.data().authorId !== req.user.uid) {
                return res.status(403).json({ error: 'Unauthorized' });
            } else {
                return postDocument.delete();
            }
        })
        .then(() => {
            res.json({ message: 'Post deleted successfully' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
}