import React, { Component } from 'react';
import SignedOutLinks from './SignedOutLinks'
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import SignedInLinks from './SignedInLinks';
import { connect } from 'react-redux';
import SearchBar from './SearchBar'

const useStyles = ((theme) => ({
    title: {
        flexGrow: 1,
        textAlign: 'left',
        marginRight: '10px',
    },
    appBar: {
        minWidth: '280px',
    },
}));

class Navbar extends Component {
    render() {
        const { classes, user: { authenticated, credentials: { firstName, id } }, UI: { loading } } = this.props;
        const links = authenticated ? <SignedInLinks firstName={firstName} id={id} /> : <SignedOutLinks />;
        const searchBar = firstName && <SearchBar />;
        return (
            <div>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" color="inherit" className={classes.title} >
                            Photos
                        </Typography>
                        {searchBar}
                        {links}
                    </Toolbar>
                </AppBar>
                <Toolbar />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    user: state.user,
    UI: state.UI,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(Navbar));
