import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './App.css';
import Navbar from './components/layout/Navbar';
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import Setting from './components/pages/Setting'
import Home from './components/pages/Home'
import UserPage from './components/pages/UserPage';
import { Provider } from 'react-redux';
import jwtDecode from 'jwt-decode';
import store from './store/store';
import { logoutUser, getUserData } from './store/actions/userActions';
import { SET_AUTHENTICATED } from './store/types';
import axios from 'axios';
import SearchResult from './components/pages/SearchResult';


const token = localStorage.FBIdToken;
if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
        store.dispatch(logoutUser());
        window.location.href = '/signin'
    } else {
        store.dispatch({ type: SET_AUTHENTICATED });
        axios.defaults.headers.common['Authorization'] = token;
        store.dispatch(getUserData());
    }
}

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <div className="App">
                    <Navbar />
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/signin" component={SignIn} />
                        <Route path="/signup" component={SignUp} />
                        {/* <Route path="/setting" component={Setting} /> */}
                        <Route path="/search" component={SearchResult} />
                        <Route path="/users/:userId" component={UserPage} />
                    </Switch>
                </div>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
