import {
    SET_POSTS,
    LIKE_POST,
    UNLIKE_POST,
    LOADING_DATA,
    DELETE_POST,
    SUBMIT_COMMENT,
    CREATE_POST,
    SET_USERDATA,
    LOADING_USERDATA,
    CLEAR_USERDATA,
    FOLLOW_USER,
    UNFOLLOW_USER,
    SET_COMMENTS,
    DELETE_COMMENT,
    SEARCH_USER,
    CLEAR_POSTS,
    MYPAGE,
    NOT_MYPAGE
} from '../types';

const initialState = {
    posts: [],
    searchUsers: [],
    user: {},
    userLoading: false,
    loading: false,
    mypage: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            };
        case SET_POSTS:
            return {
                ...state,
                posts: action.payload,
                loading: false
            };
        case LIKE_POST:
            return {
                ...state,
                posts: state.posts.map(
                    (post) => post.postId === action.payload.postId ? {
                        ...post,
                        likedBy: [...post.likedBy, action.myUserId],
                        likeCount: action.payload.likeCount
                    } : post
                )
            };
        case UNLIKE_POST:
            return {
                ...state,
                posts: state.posts.map(
                    (post) => post.postId === action.payload.postId ? {
                        ...post,
                        likedBy: post.likedBy.filter(userId => userId !== action.myUserId),
                        likeCount: action.payload.likeCount
                    } : post
                )
            };
        case CREATE_POST:
            if (state.mypage) {
                return {
                    ...state,
                    posts: [action.payload, ...state.posts]
                };
            }
            return {
                ...state
            };
        case DELETE_POST:
            const index = state.posts.findIndex(
                (post) => post.postId === action.payload
            );
            state.posts.splice(index, 1);
            return {
                ...state
            };
        case CLEAR_POSTS:
            return {
                ...state,
                posts: []
            }
        case LOADING_USERDATA:
            return {
                ...state,
                userLoading: true
            };
        case SET_USERDATA:
            return {
                ...state,
                user: action.payload,
                userLoading: false
            };
        case CLEAR_USERDATA:
            return {
                ...state,
                user: {},
                userLoading: false,
                loading: false
            };
        case SET_COMMENTS:
            return {
                ...state,
                posts: state.posts.map(
                    (post) => post.postId === action.payload.postId ? {
                        ...post,
                        comments: action.payload.comments
                    } : post
                )
            };
        case SUBMIT_COMMENT:
            return {
                ...state,
                posts: state.posts.map(
                    (post) => post.postId === action.payload.postId ? {
                        ...post,
                        comments: [...post.comments, action.payload],
                        commentCount: post.commentCount + 1
                    } : post
                )
            };
        case DELETE_COMMENT:
            return {
                ...state,
                posts: state.posts ? state.posts.map(
                    (post) => post.postId === action.payload.postId ? {
                        ...post,
                        comments: post.comments.filter(comment => comment.commentId !== action.payload.commentId),
                        commentCount: post.commentCount - 1
                    } : post
                ) : []
            };
        case SEARCH_USER:
            return {
                ...state,
                searchUsers: action.payload
            };
        case FOLLOW_USER:
            if (state.user.followersCount !== undefined) {
                return {
                    ...state,
                    user: {
                        ...state.user,
                        followersCount: state.user.followersCount + 1
                    }
                }
            }
            return {
                ...state,
            };
        case UNFOLLOW_USER:

            if (state.user.followersCount !== undefined) {
                return {
                    ...state,
                    user: {
                        ...state.user,
                        followersCount: state.user.followersCount - 1
                    }
                }
            }
            return {
                ...state
            };
        case MYPAGE:
            return {
                ...state,
                mypage: true,
            }
        case NOT_MYPAGE:
            return {
                ...state,
                mypage: false,
            }
        default:
            return state;
    }
}