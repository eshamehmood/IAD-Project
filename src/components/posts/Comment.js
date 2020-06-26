import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { deleteComment } from '../../store/actions/dataActions';
import moment from 'moment';


const useStyles = ((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        // maxWidth: 752,
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.text.primary,
    },
    item: {
        padding: '0px',
    },
    createdAt: {
        color: theme.palette.text.disabled,
        marginLeft: '8px',
    },
}));

class Comment extends Component {
    state = {
        disable: false
    }
    handleDeleteClick = (e) => {
        const comment = this.props.comment;
        this.setState({ disable: true })
        this.props.deleteComment(comment.postId, comment.commentId);
    }
    render() {
        const { classes, comment: { body, createdAt, authorId, authorUsername, authorImageUrl }, user: { credentials: { id } } } = this.props;
        return (
            <div className={classes.root}>
                <List dense={false} className={classes.item}>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar src={authorImageUrl}>
                                <FolderIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={<><Link to="/user/R" className={classes.link}>
                                {authorUsername}
                            </Link>
                                <small className={classes.createdAt}>{moment(createdAt).fromNow()}</small></>}
                            secondary={body}
                        />
                        {
                            id && id === authorId &&
                            <ListItemSecondaryAction>
                                <IconButton disabled={this.state.disable} aria-label="delete" onClick={this.handleDeleteClick}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        }
                    </ListItem>
                </List>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
})

const mapDispatchToProps = {
    deleteComment
}


export default connect(mapStateToProps, mapDispatchToProps)
    (withStyles(useStyles)(Comment)
    );
