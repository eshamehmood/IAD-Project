import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './App.css';
import Navbar from './components/layout/Navbar';
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import Setting from './components/home/Setting'
import Home from './components/home/Home'
import UserPage from './components/home/UserPage';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Navbar />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/signin" component={SignIn} />
                    <Route path="/signup" component={SignUp} />
                    <Route path="/setting" component={Setting} />
                    <Route path="/:user_id" component={UserPage} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
