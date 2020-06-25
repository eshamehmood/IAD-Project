import userReducer from './userReducer';
import dataReducer from './dataReducer';
import uiReducer from './uiReducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    user: userReducer,
    data: dataReducer,
    UI: uiReducer,
})

export default rootReducer;