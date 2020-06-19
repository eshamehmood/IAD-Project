import React from 'react';
import { NavLink } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import navButtons from '../../styles/navButtons'

const SignedOutLinks = () => {
    const classes = navButtons();
    return (
        <div>
            <Button color="inherit" size="large" className={classes.button} component={NavLink} to="/signup">
                Sign Up
            </Button>
            <Button color="inherit" size="large" className={classes.button} component={NavLink} to="/signin" >
                Login
            </Button>
        </div>
    );
}

export default SignedOutLinks;
