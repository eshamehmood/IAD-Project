import axios from 'axios'

export const getPostForHome = () => {
    return (dispatch, getState) => {
        dispatch({ type: 'LOADING_POST', loading: true })
        axios.get('https://jsonplaceholder.typicode.com/posts')
            .then(res => {
                dispatch({ type: 'GET_POSTS_HOME', posts: res.data });
            })
    }
}


// export const getPostForHome = () => {
//     return (dispatch, getState, { getFirebase, getFirestore }) => {
//         //make async call to database
//         dispatch({ type: 'LOADING_POST', loading: true })
//         const firestore = getFirestore();
//         const userId = getState().firebase.auth.uid;
//         firestore.collection('posts').orderBy('createdAt', 'desc').get()
//             .then((data) => {
//                 let posts = [];
//                 let liked = false;
//                 data.forEach((doc) => {
//                     firestore.collection('posts').doc(doc.id).collection('likes').doc(userId).get().then(userLike => {
//                         if (userLike.exists) {
//                             liked = true;
//                         }
//                         else {
//                             liked = false;
//                         }
//                     }).then(() => {
//                         posts.push({
//                             postId: doc.id,
//                             body: doc.data().body,
//                             authorName: doc.data().authorName,
//                             authorId: doc.data().authorId,
//                             // createdAt: moment(doc.data().createdAt.toDate()).calendar(),
//                             createdAt: doc.data().createdAt,
//                             commentCount: doc.data().commentCount,
//                             likeCount: doc.data().likeCount,
//                             imageName: doc.data().imageName,
//                             liked: liked,
//                         });
//                     }).catch(err => {
//                         dispatch({ type: 'GET_POSTS_HOME_ERROR', err })
//                     })
//                 })
//                 dispatch({ type: 'GET_POSTS_HOME', posts: posts, loading: false })
//             }).catch((err) => {
//                 dispatch({ type: 'GET_POSTS_HOME_ERROR', err })
//             })
//     }
// }

export const createPost = (post) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        //make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;
        const authorEmail = getState().firebase.auth.email;
        firestore.collection('posts').add({
            ...post,
            authorId: authorId,
            authorName: profile.firstName + ' ' + profile.lastName,
            commentCount: 0,
            likeCount: 0,
            createdAt: new Date(),
        }).then(() => {
            dispatch({ type: 'CREATE_POST' });
        }).catch((err) => {
            dispatch({ type: 'CREATE_POST_ERROR', err })
        })
    }
};

export const createComment = (comment) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        //make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;
        const authorEmail = getState().firebase.auth.email;
        firestore.collection('comments').add({
            ...comment,
            authorId: authorId,
            authorName: profile.firstName + ' ' + profile.lastName,
            createdAt: new Date(),
        }).then(() => {
            dispatch({ type: 'CREATE_COMMENT', comment });
        }).catch((err) => {
            dispatch({ type: 'CREATE_COMMENT_ERROR', err })
        });
    }
}

export const likeButtonAction = (post) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        const userId = getState().firebase.auth.uid;
        firestore.collection('posts').doc(post.id).collection('likes').doc(userId).get().then(doc => {
            if (doc.exists) {
                dispatch({ type: 'GET_LIKED_SUCCESS', post, liked: true });
                firestore.collection('posts').doc(post.id).collection('likes').doc(userId).delete().then(() => {
                    dispatch({ type: 'UNLIKE_POST', post, liked: false });
                }).catch(function (err) {
                    dispatch({ type: 'UNLIKE_POST_ERROR', err })
                });
            } else {
                dispatch({ type: 'GET_LIKED_SUCCESS', post, liked: false });

                firestore.collection('posts').doc(post.id).collection('likes').doc(userId).set({ liked: true }).then(() => {
                    dispatch({ type: 'LIKE_POST', post, liked: true, });
                }).catch((err) => {
                    dispatch({ type: 'LIKE_POST_ERROR', err })
                });
            }
        }).catch(function (err) {
            dispatch({ type: 'GET_LIKED_ERROR', err });
        });
    }
}

export const likePost = (post) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        const userId = getState().firebase.auth.uid;
        firestore.collection('posts').doc(post.postId).collection('likes').doc(userId).set({ liked: true }).then(() => {
            let pst = { ...post, liked: true };
            dispatch({ type: 'LIKE_POST', pst });
        }).catch((err) => {
            dispatch({ type: 'LIKE_POST_ERROR', err })
        });
    }
}

export const unLikePost = (post) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        const userId = getState().firebase.auth.uid;
        firestore.collection('posts').doc(post.postId).collection('likes').doc(userId).delete().then(() => {
            let pst = { ...post, liked: false };
            dispatch({ type: 'UNLIKE_POST', pst });
        }).then(() => {

        }).catch(function (err) {
            dispatch({ type: 'UNLIKE_POST_ERROR', err })
        });
    }
}