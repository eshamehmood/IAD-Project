import {
    SET_POSTS,
    LOADING_DATA,
    LIKE_POST,
    UNLIKE_POST,
    DELETE_POST,
    LOADING_UI,
    CREATE_POST,
    CLEAR_ERRORS,
    SET_ERRORS,
    SET_USERDATA,
    LOADING_USERDATA,
    CLEAR_USERDATA,
    CLEAR_POSTS,
    SET_USERPOSTS,
    SET_COMMENTS,
    SUBMIT_COMMENT,
    DELETE_COMMENT,
    SEARCH_USER,
    MYPAGE,
    NOT_MYPAGE
} from '../types';
import axios from 'axios';

export const getPostForHome = () => dispatch => {
    dispatch({ type: LOADING_DATA })
    axios.get('/posts')
        .then(res => {
            dispatch({ type: SET_POSTS, payload: res.data })
        })
        .catch(err => {
            dispatch({ type: SET_POSTS, payload: [] })
        })
};

export const getPostsForUserpage = (userId) => dispatch => {
    dispatch({ type: LOADING_DATA })
    axios.get(`/posts/${userId}`)
        .then(res => {
            dispatch({ type: SET_POSTS, payload: res.data })
        })
        .catch(err => {
            dispatch({ type: SET_POSTS, payload: [] })
        })
}

export const getOtherUserInfo = (userId) => dispatch => {
    dispatch({ type: LOADING_USERDATA })
    axios.get(`/user/${userId}`)
        .then(res => {
            dispatch({ type: SET_USERDATA, payload: res.data })
        })
        .catch(err => {
            dispatch({ type: SET_USERDATA, payload: [] })
        })
}

export const likePost = (postId, myUserId) => dispatch => {
    axios.get(`/post/${postId}/like`)
        .then(res => {
            dispatch({ type: LIKE_POST, payload: res.data, myUserId })
        })
        .catch(err => console.log(err))
};

export const unlikePost = (postId, myUserId) => dispatch => {
    axios.get(`/post/${postId}/unlike`)
        .then(res => {
            dispatch({ type: UNLIKE_POST, payload: res.data, myUserId })
        })
        .catch(err => console.log(err))
};

export const deletePost = (postId) => dispatch => {
    axios.delete(`/post/${postId}`)
        .then(() => {
            dispatch({ type: DELETE_POST, payload: postId });
        })
        .catch(err => console.log(err))
};

export const createPost = (newPost, fromPage) => dispatch => {
    dispatch({ type: LOADING_UI });
    axios.post('/post', newPost)
        .then(res => {
            dispatch({ type: CREATE_POST, payload: res.data, fromPage });
            dispatch({ type: CLEAR_ERRORS });
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS
            })
        })
};

export const clearUser = () => dispatch => {
    dispatch({ type: CLEAR_USERDATA });
}

export const clearPosts = () => dispatch => {
    dispatch({ type: CLEAR_POSTS });
}

export const createComment = (postId, commentData) => dispatch => {
    axios.post(`/post/${postId}/comment`, commentData)
        .then(res => {
            dispatch({ type: SUBMIT_COMMENT, payload: res.data });
            dispatch({ type: CLEAR_ERRORS });
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
}

export const deleteComment = (postId, commentId) => dispatch => {
    axios.delete(`/comment/${commentId}`)
        .then(() => {
            dispatch({ type: DELETE_COMMENT, payload: { postId, commentId } });
        })
        .catch(err => console.log(err))
}

export const getComments = (postId) => dispatch => {
    axios.get(`/post/comments/${postId}`)
        .then(res => {
            dispatch({ type: SET_COMMENTS, payload: res.data });
        })
        .catch(err => console.log(err))
}

export const search = (username) => dispatch => {
    axios.get(`/search/${username}`)
        .then(res => {
            dispatch({ type: SEARCH_USER, payload: res.data })
        })
        .catch(err => console.log(err))
}

export const atMyPage = () => dispatch => {
    dispatch({ type: MYPAGE })
}

export const notAtMyPage = () => dispatch => {
    dispatch({ type: NOT_MYPAGE })
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
// // }


// export const createComment = (comment) => {
//     return (dispatch, getState, { getFirebase, getFirestore }) => {
//         //make async call to database
//         const firestore = getFirestore();
//         const profile = getState().firebase.profile;
//         const authorId = getState().firebase.auth.uid;
//         firestore.collection('comments').add({
//             ...comment,
//             authorId: authorId,
//             authorName: profile.firstName + ' ' + profile.lastName,
//             createdAt: new Date(),
//         }).then(() => {
//             dispatch({ type: 'CREATE_COMMENT', comment });
//         }).catch((err) => {
//             dispatch({ type: 'CREATE_COMMENT_ERROR', err })
//         });
//     }
// }