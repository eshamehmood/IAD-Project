import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';

import { followUser, unfollowUser } from '../../store/actions/userActions';

const useStyles = ((theme) => ({
    root: {
        maxWidth: 645,
    },
    avatar: {
        textDecoration: 'none',
    },
    header: {
        textAlign: 'left',
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.text.primary,
    },
    followButtonPosition: {
        marginTop: '0px',
        marginRight: '0px',
    },
    followButton: {
        boxShadow: 'none',
        '&:hover': {
            boxShadow: 'none',
        }
    },
    iconMargin: {
        marginLeft: '8%',
    },
}));

class SearchedUser extends Component {

    handleFollowClick = (e) => {
        e.preventDefault();
        this.props.followUser(this.props.user.userId)
    }
    handleUnFollowClick = (e) => {
        e.preventDefault();
        this.props.unfollowUser(this.props.user.userId)
    }
    render() {
        const { classes, user, currentUser: { authenticated, credentials: { id, following } } } = this.props;
        const topButtonMarkup = authenticated && id && id === user.userId ? (
            <></>
        ) : following && following.includes(user.userId) ? (
            <Button classes={{ contained: classes.followButton }}
                className={classes.followButtonText}
                size="large"
                variant="contained"
                color="secondary"
                onClick={this.handleUnFollowClick} >
                Following <LibraryAddCheckIcon className={classes.iconMargin} />
            </Button>
        ) : (
                    <Button className={classes.followButtonText}
                        size="large" variant="outlined"
                        color="secondary"
                        onClick={this.handleFollowClick}>
                        Follow <LibraryAddIcon className={classes.iconMargin} />
                    </Button>
                );

        return (
            <Card className={classes.root}>
                <CardHeader classes={{ action: classes.followButtonPosition }}
                    avatar={
                        <Avatar component={Link} to={`/users/${user.userId}`}
                            aria-label="avatar"
                            src={user.imageUrl}
                            className={classes.avatar}>
                        </Avatar>
                    }
                    action={
                        <span>
                            {topButtonMarkup}
                        </span>
                    }
                    title={<Link to={`/users/${user.userId}`} className={classes.link}>{user.firstName + ' ' + user.lastName}</Link>}
                    subheader={user.bio}
                    className={classes.header}
                />
            </Card>
        );
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.user
})

const mapDispatchToProps = {
    followUser, unfollowUser
}

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(useStyles)(
        SearchedUser
    )
);
