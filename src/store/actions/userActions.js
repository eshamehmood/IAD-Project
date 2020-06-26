import {
    SET_USER,
    SET_ERRORS,
    CLEAR_ERRORS,
    LOADING_UI,
    SET_UNAUTHENTICATED,
    LOADING_USER,
    FOLLOW_USER,
    UNFOLLOW_USER,
    STOP_LOADING_UI,
} from '../types';
import axios from 'axios';

export const getUserData = () => (dispatch) => {
    dispatch({ type: LOADING_USER })
    axios.get('/user')
        .then(res => {
            dispatch({
                type: SET_USER,
                payload: res.data,
            })
            dispatch({ type: STOP_LOADING_UI });
            dispatch({ type: CLEAR_ERRORS });
        })
        .catch(err => console.log(err))
}

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/login', userData)
        .then(res => {
            setAuthorizationHeader(res.data.token);
            dispatch(getUserData());
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
}

export const signupUser = (newUserData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/signup', newUserData)
        .then(res => {
            setAuthorizationHeader(res.data.token);
            dispatch(getUserData());
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
}

const setAuthorizationHeader = (token) => {
    const FBIdToken = `Bearer ${token}`;
    localStorage.setItem('FBIdToken', token);
    axios.defaults.headers.common['Authorization'] = FBIdToken;
}

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('FBIdToken');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: SET_UNAUTHENTICATED });
}

export const uploadImage = (formData) => (dispatch) => {
    dispatch({ type: LOADING_USER })
    axios.post('/user/image', formData)
        .then(() => {
            dispatch(getUserData());
        })
        .catch(err => console.log(err));
}

export const editUserDetails = (userDetails) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.post('/user', userDetails)
        .then(() => {
            dispatch(getUserData());
        })
        .catch(err => console.log(err));
}

export const followUser = (userId) => dispatch => {
    axios.get(`/user/${userId}/follow`)
        .then(res => {
            dispatch({ type: FOLLOW_USER, payload: res.data })
        })
        .catch(err => console.log(err))
};

export const unfollowUser = (userId) => dispatch => {
    axios.get(`/user/${userId}/unfollow`)
        .then(res => {
            dispatch({ type: UNFOLLOW_USER, payload: res.data })
        })
        .catch(err => console.log(err))
};