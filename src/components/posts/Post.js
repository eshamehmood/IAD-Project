import React, { Component } from 'react';
import { Card, CardContent, CardHeader, Typography, CardMedia, Avatar, IconButton, CardActions, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Comment from './Comment';
import CreateComment from './CreateComment';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import CommentIcon from '@material-ui/icons/Comment';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import { connect } from 'react-redux';
import { likePost, unLikePost } from '../../store/actions/postActions';

const useStyles = ((theme) => ({
    root: {
        maxWidth: 645,
        minWidth: 345,
    },
    media: {
        // height: 0,
        // paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
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
    title: {
        backgroundColor: theme.palette.background.default,
    },
    like: {
        color: theme.palette.secondary.main,
    },
    leftAlignCommentAction: {
        flexGrow: '1',
    },
}));


class Post extends Component {
    state = {
        liked: null,
        followed: false,
    }
    componentDidMount = () => {
        this.setState({ liked: this.props.post.liked });
    }

    likesSymbol = (like) => {
        if (like > 1000000000) {
            return (like / 1000000000).toFixed(1) + 'B';
        }
        else if (like > 1000000) {
            return (like / 1000000).toFixed(1) + 'M';
        }
        else if (like > 1000) {
            return (like / 1000).toFixed(1) + 'K';
        }
        return like;
    }

    handleLikeClick = (e) => {
        e.preventDefault();
        console.log(this.props)
        // this.props.likeButtonAction(this.props.post);
        this.setState({ liked: !this.state.liked });
        let l = this.props.likeCount;
        if (!this.state.liked) {
            this.props.likePost(this.props.post);
        }
        if (this.state.liked) {
            this.props.unLikePost(this.props.post);
        }
    }
    handleFollowClick = (e) => {
        e.preventDefault();
        this.setState({ followed: !this.state.followed });
    }
    render() {
        const { post, classes } = this.props;
        let liked = this.state.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />;
        let likes = this.likesSymbol(post.likeCount);
        let followed = this.state.followed;
        followed = this.state.followed ? (

            <Button classes={{ contained: classes.followButton }}
                className={classes.followButtonText}
                size="large"
                variant="contained"
                color="secondary"
                onClick={this.handleFollowClick} >
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
            <div>
                <Card className={classes.root}>
                    <CardHeader classes={{ action: classes.followButtonPosition }}
                        avatar={
                            <Avatar component={NavLink} to={"/user/" + post.authorEmail} aria-label="recipe" className={classes.avatar}>
                                {post.postId}
                            </Avatar>
                        }
                        action={
                            <span>
                                {followed}
                            </span>
                        }
                        title={<NavLink to={"/user/" + post.authorEmail} className={classes.link}>{post.authorName}</NavLink>}
                        // subheader={
                        //     post.createdAt
                        //         ? moment(post.createdAt.toDate()).calendar()
                        //         : ""}
                        className={classes.header}
                    />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {post.body}
                        </Typography>
                    </CardContent>
                    <CardMedia
                        component={'img'}
                        src={require('../../img/FB_UI.png')}
                        title={post.imageName}
                        style={{ height: "100%", width: "100%" }}
                    />
                    <CardActions disableSpacing>
                        <IconButton aria-label="Like" className={classes.like} onClick={this.handleLikeClick}>
                            {liked}
                        </IconButton>
                        <Typography style={{ flexGrow: '1', textAlign: 'left' }} color="secondary" variant="subtitle1" >
                            {likes}
                        </Typography>
                        <CommentIcon color="inherit" />
                        <Typography style={{ margin: '0% 2%', }} color="inherit" variant="subtitle1" >
                            {post.commentCount}
                        </Typography>
                    </CardActions>
                    <Typography color="inherit" variant="subtitle2" >
                        Comments
            </Typography>
                    {/* {post.comments && post.comments.map(comment => {
                return (
                    <Comment comment={comment} key={comment.id} />
                )
            })} */}
                    <CreateComment />
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        likePost: (post) => dispatch(likePost(post)),
        unLikePost: (post) => dispatch(unLikePost(post)),
    }
}

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(Post));


/*
class Post extends Component {
    state = {
        id: null,
        by: '',
        date: '',
        followed: false,
        description: '',
        imageTitle: '',
        comments: [],
        liked: false,
        likes: 100,
    }
    constructor(props) {
        super(props);
        this.state = { ...this.state, dimensions: {} };
        // this.onImgLoad = this.onImgLoad.bind(this);
    }
    // onImgLoad({ target: img }) {
    //     this.setState({
    //         dimensions: {
    //             height: img.offsetHeight,
    //             width: img.offsetWidth
    //         }
    //     });
    // }
    handleLikeClick = (e) => {
        e.preventDefault();
        const liked = !this.state.liked;
        const likes = this.state.liked ? this.state.likes - 1 : this.state.likes + 1;
        this.setState({
            ...this.state,
            liked: liked,
            likes: likes,
        });
    }
    handleFollowClick = (e) => {
        e.preventDefault();
        const followed = !this.state.followed;
        this.setState({
            ...this.state,
            followed,
        });
    }

    render() {
        const { classes, posts } = this.props;
        // const { width, height } = this.state.dimensions;
        const liked = this.state.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />;
        const likes = this.state.likes;
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
            <Card className={classes.root}>
                <CardHeader classes={{ action: classes.followButtonPosition }}
                    avatar={
                        <Avatar component={NavLink} to="/user/R" aria-label="recipe" className={classes.avatar}>
                            R
                        </Avatar>
                    }
                    action={
                        // <IconButton aria-label="Follow">
                        // <Button size="large" variant="outlined" color="secondary" onClick={this.handleFollowClick}>
                        <span>
                            {followed}
                        </span>
                        // </Button>
                        // </IconButton>
                    }
                    title={<NavLink to="/user/R" className={classes.link}>Shrimp and Chorizo Paella</NavLink>}
                    subheader="September 14, 2016"
                    className={classes.header}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        This impressive paella is a perfect party dish and a fun meal to cook together with your
                        guests. Add 1 cup of frozen peas along with the mussels, if you like.
                     </Typography>
                </CardContent>
                <CardMedia
                    // className={classes.media}
                    // image={require('../../img/Fushimi_Mugshot.png')}
                    component={'img'}
                    src={require('../../img/dad.PNG')}
                    // onLoad={this.onImgLoad}
                    title="Fushimi"
                    style={{ height: "100%", width: "100%" }}
                />
                <CardActions disableSpacing>
                    <IconButton aria-label="Like" className={classes.like} onClick={this.handleLikeClick}>
                        {liked}
                    </IconButton>
                    <Typography style={{ flexGrow: '1', textAlign: 'left' }} color="secondary" variant="subtitle1" >
                        {likes}
                    </Typography>
                    <CommentIcon color="inherit" />
                    <Typography style={{ margin: '0% 2%', }} color="inherit" variant="subtitle1" >
                        24
                    </Typography>
                </CardActions>
                <Typography color="inherit" variant="subtitle2" >
                    Comments
                </Typography>
                <Comment />
                <CreateComment />
            </Card>
        );
    }
}

export default withStyles(useStyles)(Post);
*/


