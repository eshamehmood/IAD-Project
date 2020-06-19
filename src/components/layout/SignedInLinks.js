import React from 'react';
import { NavLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import navButtons from '../../styles/navButtons';
import CreatePost from '../posts/CreatePost';
import { connect } from 'react-redux';
import { logout } from '../../store/actions/authActions';

import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';

const SignedInLinks = (props) => {
    const classes = navButtons();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const mobileView =
        <div className={classes.mobileItem}>
            <CreatePost />
            <IconButton onClick={handleMenuClick}
                color="inherit"
            >
                <MoreIcon />
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem component={NavLink} to="/">Home</MenuItem>
                <MenuItem component={NavLink} to="/:user_id">My Account</MenuItem>
                <MenuItem component={NavLink} to="/setting">Settings</MenuItem>
                <MenuItem onClick={props.logout}>Logout</MenuItem>
            </Menu>

        </div>
    if (props.profile.firstName) {
        return (
            <>
                <div className={classes.desktopItem}>
                    <Button color="inherit" size="large" className={classes.button} component={NavLink} to="/">
                        Home
                    </Button>
                    <CreatePost />
                    <Button color="inherit" size="large" className={classes.button} component={NavLink} to="/:user_id">
                        {/* Link to={'/' + user.id} */}
                        {props.profile.firstName}
                    </Button>
                    <Button color="inherit" size="large" className={classes.button} component={NavLink} to="/setting">
                        Settings
                    </Button>
                    <Button color="inherit" size="large" className={classes.button} onClick={props.logout}>
                        Log Out
                    </Button>
                </div>
                {mobileView}
            </>
        );
    }
    else {
        return (
            <div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout())
    }
}

export default connect(null, mapDispatchToProps)(SignedInLinks);
