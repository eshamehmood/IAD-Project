import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import Post from '../posts/Post';
import Follower from './Follower';

const useStyles = ((theme) => ({
    root: {
        margin: '2% 0%',
    },
    uploadBadge: {
        color: 'rgba(255, 255, 255, 0.54)',
        border: `2px solid ${theme.palette.background.paper}`,
        backgroundColor: 'rgba(0,0,0,0.3)',
        '&:hover': {
            color: 'rgba(255, 255, 255, 1)',
            backgroundColor: 'rgba(0,0,0,0.7)',
        },
    },
    avatarLarge: {
        width: theme.spacing(20),
        height: theme.spacing(20),
        margin: 'auto',
        border: '2px solid #656565'
    },
    size: {
        width: '645px',
        // maxWidth: 645,
        minWidth: 345,
    },

    followButtonText: {
        textTransform: 'capitalize',
    },
    followButton: {
        boxShadow: 'none',
        '&:hover': {
            boxShadow: 'none',
        }
    },
}));

class UserPage extends Component {
    state = {
        followers: 100,
        followed: false,
        id: null,
    }

    handleFollowClick = (e) => {
        e.preventDefault();
        const followed = !this.state.followed;
        this.setState({
            ...this.state,
            followed,
        });
    }
    componentDidMount() {
        let id = this.props.match.params.user_id;
        this.setState({
            id: id
        })
    }

    render() {
        const { classes } = this.props;

        const followed = this.state.followed ? (

            <Button classes={{ contained: classes.followButton }}
                className={classes.followButtonText} size="large" variant="contained" color="secondary" onClick={this.handleFollowClick} >
                Following <LibraryAddCheckIcon className={classes.iconMargin} />
            </Button>
        ) : (

                <Button className={classes.followButtonText} size="large" variant="outlined" color="secondary" onClick={this.handleFollowClick}>
                    Follow <LibraryAddIcon className={classes.iconMargin} />
                </Button>
            );

        return (

            <Grid
                container
                spacing={4}
                alignItems="center"
                justify="center"
                direction="column"
                style={{ maxWidth: '100vw', marginTop: '1%' }}
            >
                <Grid
                    item
                    container
                    justify="center"
                >
                    <Grid item xs={10}>
                        <Badge
                            overlap="circle"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            badgeContent={
                                <IconButton aria-label="Upload" className={classes.uploadBadge}>
                                    <AddAPhotoIcon />
                                </IconButton>
                            }
                        >
                            <Avatar className={classes.avatarLarge} />
                        </Badge>
                        <Typography component="h1" variant="h3" align="center" color="textPrimary" gutterBottom>
                            User Name
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            Description
                        </Typography>
                        {followed}
                    </Grid>
                </Grid>
                <Grid
                    container
                    alignItems="center"
                    justify="center"
                    item xs={10}
                >
                    <div className={classes.size}>
                        <ButtonGroup variant="outlined" color="primary" fullWidth={true}>
                            <Button>Post</Button>
                            <Button>64 Followers</Button>
                        </ButtonGroup>
                    </div>
                </Grid>
                {/* //Posts */}
                <Grid
                    container
                    alignItems="center"
                    justify="center"
                    item xs={10}>
                    <Post />
                </Grid>
                <Grid
                    container
                    alignItems="center"
                    justify="center"
                    item xs={10}>
                    <Post />
                </Grid>
                {/* //Followers */}

                <Grid
                    container
                    spacing={4}
                    alignItems="center"
                    justify="center"
                    direction="column"
                    item xs={10}>
                    <Grid item xs={12} className={classes.size}>
                        <Follower />
                    </Grid>
                    <Grid item xs={12} className={classes.size}>
                        <Follower />
                    </Grid>
                    <Grid item xs={12} className={classes.size}>
                        <Follower />
                    </Grid>
                    <Grid item xs={12} className={classes.size}>
                        <Follower />
                    </Grid>
                    <Grid item xs={12} className={classes.size}>
                        <Follower />
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(useStyles)(UserPage);
