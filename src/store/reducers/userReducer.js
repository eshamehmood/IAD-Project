import { SET_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED, LOADING_USER, FOLLOW_USER, UNFOLLOW_USER } from '../types'

const initState = {
    authenticated: false,
    credentials: {},
    loading: false,
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true,
            };
        case SET_UNAUTHENTICATED:
            return initState;
        case SET_USER:
            return {
                authenticated: true,
                loading: false,
                ...action.payload,
            };
        case LOADING_USER:
            return {
                ...state,
                loading: true
            }
        case FOLLOW_USER:
            return {
                ...state,
                credentials: {
                    ...state.credentials,
                    following: [...state.credentials.following,
                    action.payload.userId]
                }
            }
        case UNFOLLOW_USER:
            const index = state.credentials.following.findIndex(
                (user) => user === action.payload.userId
            );
            state.credentials.following.splice(index, 1);
            return {
                ...state
            };
        default:
            return state;
    }
}

export default authReducer;