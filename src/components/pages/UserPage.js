import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import EditIcon from '@material-ui/icons/Edit';
import Post from '../posts/Post';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { uploadImage, editUserDetails, followUser, unfollowUser } from '../../store/actions/userActions'
import { getPostsForUserpage, getOtherUserInfo, clearPosts, atMyPage, notAtMyPage } from '../../store/actions/dataActions'

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
        marginBottom: '10px',
        border: '2px solid #656565'
    },
    size: {
        width: '645px',
        // maxWidth: 645,
        minWidth: 345,
    },
    input: {
        display: 'none',
    },
    capitalize: {
        textTransform: 'capitalize',
    },
    followButton: {
        boxShadow: 'none',
        '&:hover': {
            boxShadow: 'none',
        }
    },
    iconMargin: {
        marginLeft: '2%',
    },
    bioButton: {
        margin: '20px 5px'
    },
    paper: {
        padding: '20px 12px',
        minWidth: 320,
        // maxWidth: 645,
        // width: '80vw',
    },
    gridstyle: {
        maxWidth: '100%'
    },
}));

class UserPage extends Component {
    state = {
        followed: false,
        userId: this.props.match.params.userId,
        mypage: false,
        bio: '',
        changingBio: false,
    }

    handleFollowClick = (e) => {
        e.preventDefault();
        const followed = !this.state.followed;
        this.setState({
            ...this.state,
            followed,
        });
    }
    handleImageChange = (e) => {
        const image = e.target.files[0];
        const formData = new FormData();
        formData.append('image', image, image.name);
        this.props.uploadImage(formData);
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleEditBioClick = (e) => {
        this.setState({
            changingBio: true,
        })
    }
    handleBioChangeConfirm = (e) => {
        const bio = {
            bio: this.state.bio.toString()
        }
        this.props.editUserDetails(bio);
        this.setState({
            changingBio: false,
        })
    }
    handleBioChangeCancel = (e) => {
        this.setState({
            changingBio: false,
        })
    }
    handleFollowClick = () => {
        this.props.followUser(this.props.match.params.userId)
    }
    handleUnFollowClick = () => {
        this.props.unfollowUser(this.props.match.params.userId)
    }
    componentDidMount() {
        if (this.props.user.credentials.id === this.props.userId) {
            this.props.atMyPage();
        }
        this.props.getOtherUserInfo(this.props.userId);
        this.props.getPostsForUserpage(this.props.userId);
    }
    componentDidUpdate(prevProps) {
        if (this.state.userId !== this.props.match.params.userId) {
            this.setState({
                userId: this.props.match.params.userId
            });
            this.props.getOtherUserInfo(this.props.userId);
            this.props.getPostsForUserpage(this.props.userId);
        }
    }
    componentWillUnmount() {
        if (this.props.user.credentials.id === this.props.userId) {
            this.props.notAtMyPage();
        }
        this.props.clearPosts();
    }
    render() {
        const { classes,
            data: {
                posts, loading, userLoading },
            user: { credentials: { id, following }, authenticated },
            userId,
        } = this.props;
        const meLoading = this.props.user.loading;
        let { data: { user: { firstName, lastName, imageUrl, followersCount, followingCount, bio } } } = this.props;
        if (!authenticated) return <Redirect to='/signin' />

        if (id && id === userId) {
            const tempuser = this.props.user.credentials;
            firstName = tempuser.firstName;
            lastName = tempuser.lastName;
            imageUrl = tempuser.imageUrl;
            followersCount = tempuser.followersCount;
            followingCount = tempuser.followingCount;
            bio = tempuser.bio;
        }



        const followed = id && id !== userId ? following && following.includes(userId) ? (
            <Button classes={{ contained: classes.followButton }}
                className={classes.capitalize}
                size="large"
                variant="contained"
                color="secondary"
                onClick={this.handleUnFollowClick} >
                Following <LibraryAddCheckIcon className={classes.iconMargin} />
            </Button>
        ) : (
                <Button
                    className={classes.capitalize}
                    size="large"
                    variant="outlined"
                    color="secondary"
                    onClick={this.handleFollowClick}>
                    Follow <LibraryAddIcon className={classes.iconMargin} />
                </Button>
            ) : (<div></div>)

        let bioMarkup = userId === id ?
            this.state.changingBio ?
                <>
                    <TextField
                        id="bio"
                        label="Bio"
                        name="bio"
                        multiline
                        rowsMax={5}
                        placeholder="Write About yourself"
                        fullWidth
                        onChange={this.handleChange}
                    />
                    <Button disabled={meLoading} className={classes.bioButton} size='small' onClick={this.handleBioChangeCancel} variant="contained" color="primary">
                        Cancel
                    </Button>
                    <Button disabled={meLoading} className={classes.bioButton} size='small' onClick={this.handleBioChangeConfirm} variant="contained" color="primary">
                        Done
                    {meLoading && (
                            <CircularProgress size={30} className={classes.progress} />
                        )}
                    </Button>
                </> : <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
                    {bio ? bio : 'No bio'}
                    <Tooltip title="Edit your bio" placement="top">
                        <IconButton onClick={this.handleEditBioClick} className={classes.iconMargin} aria-label="Edit" size="small" component="span">
                            <EditIcon fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                </Typography>
            : (<Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
                {bio ? bio : 'No bio'}
            </Typography>)

        let userPostsMarkup = !loading ? posts ? (
            posts.map(post =>
                <Grid
                    container
                    alignItems="center"
                    justify="center"
                    item xs={10}
                    key={post.postId}
                    style={{ maxWidth: '100%' }}>
                    <Post post={post} />
                </Grid>
            )) : (<div>No Post Found</div>)
            : <Grid
                container
                alignItems="center"
                justify="center"
                item xs={10}>
                <CircularProgress
                    style={{
                        margin: '100px 0px'
                    }} />
            </Grid>


        let avatarMarkup = id && id === userId ?
            <Badge
                overlap="circle"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                badgeContent={
                    <>
                        <input
                            accept="image/*"
                            className={classes.input}
                            id="imageName"
                            multiple
                            type="file"
                            onChange={this.handleImageChange}
                        />
                        <label htmlFor="imageName">
                            <Tooltip title="Change profile picture" placement="top">
                                <IconButton aria-label="Upload" className={classes.uploadBadge} component="span">
                                    <AddAPhotoIcon />
                                </IconButton>
                            </Tooltip>
                        </label>
                    </>
                }
            >
                <Avatar className={classes.avatarLarge} src={imageUrl} />
            </Badge>
            :
            <Avatar className={classes.avatarLarge} src={imageUrl} />

        let userInfoMarkup = !meLoading && !userLoading ? (

            <Grid
                container
                alignItems="center"
                justify="center"
                item xs={10}
                style={{ maxWidth: '100%' }}
                className={classes.gridstyle}
            >
                <Grid item xs={4}
                    className={classes.gridstyle}>
                    <Paper className={classes.paper}>
                        {avatarMarkup}
                        <Typography className={classes.capitalize} component="h1" variant="h3" align="center" color="textPrimary" gutterBottom>
                            {firstName + " " + lastName}
                        </Typography>
                        {bioMarkup}
                        <Grid container
                            spacing={1}
                            justify="center"
                            alignItems="center">
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1" align="center" color="textSecondary" paragraph>
                                    Followers: {followersCount}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1" align="center" color="textSecondary" paragraph>
                                    Following: {followingCount}
                                </Typography>
                            </Grid>
                        </Grid>
                        {followed}
                    </Paper>
                </Grid>
            </Grid>
        ) : (<Grid
            item
            container
            justify="center"
        >
            <Grid item xs={4} className={classes.gridstyle}>
                <Paper className={classes.paper}>
                    <CircularProgress
                        style={{
                            margin: '100px 0px'
                        }} />
                </Paper>
            </Grid>
        </Grid>
            )

        return (
            <Grid
                container
                spacing={4}
                alignItems="center"
                justify="center"
                direction="column"
                style={{
                    // maxWidth: '100vw', 
                    marginTop: '1%'
                }}
            >
                {userInfoMarkup}
                {userPostsMarkup}
            </Grid>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    userId: ownProps.match.params.userId,
    user: state.user,
    data: state.data,
})

const mapDispatchToProps = {
    uploadImage,
    editUserDetails,
    getPostsForUserpage,
    getOtherUserInfo,
    followUser,
    unfollowUser,
    clearPosts,
    atMyPage,
    notAtMyPage
}

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(useStyles)(UserPage)
);
