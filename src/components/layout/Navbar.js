import React from 'react';
import SignedOutLinks from './SignedOutLinks'
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import SignedInLinks from './SignedInLinks';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
        textAlign: 'left',
    },
    appBar: {
        minWidth: '280px',
    },
}));

const Navbar = (props) => {
    const classes = useStyles();
    const { auth, profile } = props;
    const links = auth.uid ? <SignedInLinks profile={profile} /> : <SignedOutLinks />
    return (
        <div>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" color="inherit" className={classes.title} >
                        Photos
                    </Typography>
                    {links}
                </Toolbar>
            </AppBar>
            <Toolbar />
        </div>
    );
}

const mapStateToProps = (state) => {
    console.log(state);
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile,
    }
}

export default connect(mapStateToProps)(Navbar);
