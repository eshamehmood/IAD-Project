import React, { Component } from 'react';
import { fade, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { search } from '../../store/actions/dataActions'
import { withRouter } from 'react-router-dom';

import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = ((theme) => ({
    search: {
        flexGrow: 2,
        maxWidth: '500px',
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    iconButton: {
        padding: 10,
    },
}))

class SearchBar extends Component {
    state = {
        searchText: '',
    }
    handleSearchSubmit = (e) => {
        this.props.search(this.state.searchText.toLowerCase());
    }
    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.handleSearchSubmit();
            this.setState({
                searchText: '',
            })
            this.props.history.push("/search");
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.search}>
                <div className={classes.searchIcon}>
                    <SearchIcon />
                </div>
                <InputBase
                    placeholder="Search Users…"
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                    name="searchText"
                    id="searchText"
                    value={this.state.searchText}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                />
            </div>
        );
    }
}

const mapDispatchToProps = {
    search
}

export default withRouter(connect(null, mapDispatchToProps)(withStyles(useStyles)(SearchBar)));
