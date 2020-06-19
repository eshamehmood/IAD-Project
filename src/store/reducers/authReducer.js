const initState = {
    'authError': null,
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case 'LOGIN_ERROR':
            console.log('Login Error');
            return {
                ...state,
                'authError': action.err.message,
            }
        case 'LOGIN_SUCCESS':
            console.log('Login success');
            return {
                ...state,
                'authError': null,
            }
        case 'SIGNOUT_SUCESS':
            console.log('SignOut Success');
            return state;

        case 'SIGNUP_SUCCESS':
            console.log('SignUp Success');
            return {
                ...state,
                authError: null,
            }
        case 'SIGNUP_ERROR':
            console.log('SignUp Failed');
            return {
                ...state,
                authError: action.err.message,
            }
        case 'RESET_ERROR':
            return {
                ...state,
                authError: null,
            }
        default:
            return state;
    }
}

export default authReducer;