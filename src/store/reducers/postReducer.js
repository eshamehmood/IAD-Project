const initState = {
    posts: [
    ],
    loading: true,
}

const postReducer = (state = initState, action) => {
    switch (action.type) {
        case 'LOADING_POST':
            console.log('Loading Posts for home succefully')
            return {
                ...state,
                loading: action.loading
            }
        case 'GET_POSTS_HOME':
            console.log('Got Posts for home succefully')
            return {
                ...state,
                posts: action.posts,
                loading: action.loading
            }

        case 'GET_POSTS_HOME_ERROR':
            console.log('Got Posts for home failed', action.err)
            return state;
        case 'CREATE_POST':
            console.log('Created Post');
            return state
        case 'CREATE_POST_ERROR':
            console.log('create post error', action.err);
            return state;
        case 'GET_LIKE_STATUS_SUCCESS':
            console.log('got like status successfully', action.liked);
            return state;
        case 'GET_LIKE_STATUS_ERROR':
            console.log('create post error', action.err);
            return state;
        case 'LIKE_POST':
            console.log('Liked successfully', action.pst);
            // console.log('from liked reducer', action)
            state.posts.push(post => {
                if (post.postId === action.pst.postId) {
                    post.liked = true;
                }
            })
            return state;
        case 'LIKE_POST_ERROR':
            console.log('Liked error', action.err);
            return state;
        case 'UNLIKE_POST':
            console.log('UNLiked successfully', action.pst);
            state.posts.push(post => {
                if (post.postId === action.pst.postId) {
                    post.liked = false;
                }
            })
            return state;
        case 'UNLIKE_POST_ERROR':
            console.log('UNLiked error', action.err);
            return state;
        default:
            return state;
    }
}

export default postReducer;