import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import CreateComment from './CreateComment';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import CommentIcon from '@material-ui/icons/Comment';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { likePost, unlikePost, createComment, getComments } from '../../store/actions/dataActions';
import { followUser, unfollowUser } from '../../store/actions/userActions';
import DeletePostButton from './DeletePostButton'
import Comment from './Comment';

import Divider from '@material-ui/core/Divider';

const useStyles = ((theme) => ({
    root: {
        maxWidth: 645,
        width: '80vw',
        // minWidth: 345,
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
    leftAlignCommentAction: {
        flexGrow: '1',
    },
    likeDisableButton: {
        color: theme.palette.secondary.main,
        "&$likeButtonDisabled": {
            color: theme.palette.secondary.main,
        }
    },
    likeButtonDisabled: {},
    postImg: {
        maxHeight: '600px',
        maxWidth: '645px',
        objectFit: 'contain',
    },
}));


class Post extends Component {
    state = {
        likeDisable: false,
    }
    constructor(props) {
        super(props);
        this.state = { ...this.state, dimensions: {} };
    }
    componentDidMount = () => {
        this.props.getComments(this.props.post.postId);
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
    handleLikeClick = () => {
        this.setState({ likeDisable: true })
        this.props.likePost(this.props.post.postId, this.props.user.credentials.id);
        setTimeout(() => this.setState({ likeDisable: false }), 500);
    }
    handleUnlikeClick = () => {
        this.setState({ likeDisable: true })
        this.props.unlikePost(this.props.post.postId, this.props.user.credentials.id);
        setTimeout(() => this.setState({ likeDisable: false }), 500);
    }
    handleFollowClick = (e) => {
        e.preventDefault();
        this.props.followUser(this.props.post.authorId)
    }
    handleUnFollowClick = (e) => {
        e.preventDefault();
        this.props.unfollowUser(this.props.post.authorId)
    }
    render() {
        const { post, post: { comments }, classes, user: { authenticated, credentials: { id, following } }, loading } = this.props;

        let liked = id && post.likedBy && post.likedBy.includes(id) ?
            <IconButton classes={{ root: classes.likeDisableButton, disabled: classes.likeButtonDisabled }}
                disabled={this.state.likeDisable}
                aria-label="Like"
                onClick={this.handleUnlikeClick}>
                <FavoriteIcon />
            </IconButton> :
            <IconButton classes={{ root: classes.likeDisableButton, disabled: classes.likeButtonDisabled }}
                disabled={this.state.likeDisable}
                aria-label="Like"
                onClick={this.handleLikeClick}>
                <FavoriteBorderIcon />
            </IconButton>;
        let likes = this.likesSymbol(post.likeCount);
        const topButtonMarkup = authenticated && !loading && id === post.authorId ? (
            <DeletePostButton postId={post.postId} />
        ) : following && following.includes(post.authorId) ? (
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
            <div>
                <Card className={classes.root}>
                    <CardHeader classes={{ action: classes.followButtonPosition }}
                        avatar={
                            <Avatar component={Link} to={`/users/${post.authorId}`}
                                aria-label="avatar"
                                src={post.authorImageUrl}
                                className={classes.avatar}>
                            </Avatar>
                        }
                        action={
                            <span>
                                {topButtonMarkup}
                            </span>
                        }
                        title={<Link to={`/users/${post.authorId}`} className={classes.link}>{post.authorUsername}</Link>}
                        subheader={
                            post.createdAt
                                ? moment(post.createdAt).calendar()
                                : ""
                        }
                        className={classes.header}
                    />
                    {
                        post.body !== '' && (
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {post.body}
                                </Typography>
                            </CardContent>
                        )
                    }
                    <CardMedia
                        component={'img'}
                        src={post.imageUrl}
                        title='image'
                        className={classes.postImg}
                    />
                    <CardActions disableSpacing>
                        {liked}
                        <Typography style={{ flexGrow: '1', textAlign: 'left' }} color="secondary" variant="subtitle1" >
                            {likes}
                        </Typography>
                        <CommentIcon style={{ color: 'grey' }} />
                        <Typography style={{ margin: '0% 2%' }} color="inherit" variant="subtitle1" >
                            {post.commentCount}
                        </Typography>
                    </CardActions>
                    <Divider />
                    {comments && comments.map(
                        comment => <Fragment key={comment.commentId}>
                            <Comment comment={comment} />
                            <Divider />
                        </Fragment>)
                    }
                    <CreateComment postId={post.postId} />
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    loading: state.data.loading
})

const mapDispatchToProps = {
    likePost, unlikePost, followUser, unfollowUser, createComment, getComments
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(Post));


