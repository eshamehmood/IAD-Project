const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/fbAuth')

const cors = require('cors');
app.use(cors());

const { db } = require('./util/admin')

const { getAllPosts,
    createPost,
    getPost,
    commentOnPost,
    likePost,
    unlikePost,
    getUserPosts,
    deletePost,
    getComments,
    deleteComment,
} = require('./handlers/posts');
const { signup,
    login,
    uploadImage,
    addUserDetails,
    getAuthenticatedUser,
    getUserDetails,
    followUser,
    unfollowUser,
    searchUsers
} = require('./handlers/users');

//Posts routes

//get all home post
app.get('/posts', FBAuth, getAllPosts);
//get one user all post
app.get('/posts/:userId', FBAuth, getUserPosts)
//create a post
app.post('/post', FBAuth, createPost);
//get a post? HOW
app.get('/post/:postId', FBAuth, getPost);
//get all comments of a post
app.get('/post/comments/:postId', FBAuth, getComments);
//comment on a post
app.post('/post/:postId/comment', FBAuth, commentOnPost)
//Like a Post
app.get('/post/:postId/like', FBAuth, likePost)
//Unlike a Post
app.get('/post/:postId/unlike', FBAuth, unlikePost)
//Delete a Post
app.delete('/post/:postId', FBAuth, deletePost)
//Delet a comment
app.delete('/comment/:commentId', FBAuth, deleteComment)

//Users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:userId', FBAuth, getUserDetails);
app.get('/user/:userId/follow', FBAuth, followUser)
app.get('/user/:userId/unfollow', FBAuth, unfollowUser)
//search user
app.get('/search/:searchName', FBAuth, searchUsers)

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
                    return db.collection('comments').where('authorId', '==', change.before.id).get()
                })
                .then(data => {
                    data.forEach(doc => {
                        const comment = db.collection('comments').doc(doc.id);
                        batch.update(comment, { authorImageUrl: change.after.data().imageUrl })
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
        return db.collection('comments').where("postId", "==", postId).get()
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/comments/${doc.id}`))
                })
                return batch.commit();
            })
            .catch(err => console.error(err))
    })