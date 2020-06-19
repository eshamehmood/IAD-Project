const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/fbAuth')

const { db } = require('./util/admin')

const { getAllPosts, createPost, getPost, commentOnPost, likePost, unlikePost, deletePost } = require('./handlers/posts');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserDetails, followUser, unfollowUser } = require('./handlers/users');

//Posts routes
app.get('/posts', getAllPosts);
app.post('/post', FBAuth, createPost);
app.get('/post/:postId', getPost);
app.post('/post/comment', FBAuth, commentOnPost)
app.get('/post/:postId/like', FBAuth, likePost)
app.get('/post/:postId/unlike', FBAuth, unlikePost)
app.delete('/post/:postId', FBAuth, deletePost)

//Users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:userId', getUserDetails);
app.get('/user/:userId/follow', FBAuth, followUser)
app.get('/user/:userId/unfollow', FBAuth, unfollowUser)
app.get('/user/:userId', getUserDetails);


exports.api = functions.https.onRequest(app);

exports.onUserImageChange = functions.firestore.document('/users/{userId}')
    .onUpdate(change => {
        if (change.before.data().imageUrl !== change.after.data().imageUrl) {
            const batch = db.batch();
            return db.collection('posts').where('authorId', '==', change.before.id).get()
                .then(data => {
                    data.forEach(doc => {
                        const post = db.collection('posts').doc(doc.id);
                        batch.update(post, { authorImageUrl: change.after.data().imageUrl });
                    })
                    return batch.commit();
                })
        }
        else if ((change.before.data().firstName !== change.after.data().firstName) || (change.before.data().lastName !== change.after.data().lastName)) {
            const batch = db.batch();
            return db.collection('posts').where('authorId', '==', change.before.id).get()
                .then(data => {
                    data.forEach(doc => {
                        const post = db.collection('posts').doc(doc.id);
                        batch.update(post, { authorUsername: change.after.data().firstName + ' ' + change.after.data().lastName });
                    })
                    return batch.commit();
                })
        }
        else return true;
    })

exports.onPostDelete = functions.firestore.document('/posts/{postId}')
    .onDelete((snapshot, context) => {
        const postId = context.params.postId
        const batch = db.batch();
        return db.collection('posts').doc(postId).collection('comments').get()
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/posts/${postId}/comments/${doc.id}`))
                })
                return db.collection('posts').doc(postId).collection('likes').get()
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/posts/${postId}/likes/${doc.id}`))
                })
                return batch.commit();
            })
            .catch(err => console.error(err))
    })