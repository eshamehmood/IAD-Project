import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FolderIcon from '@material-ui/icons/Folder';
import SendIcon from '@material-ui/icons/Send';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';


import { connect } from 'react-redux';
import { createComment } from '../../store/actions/postActions';

const useStyles = ((theme) => ({
    root: {
        padding: '0% 2%',
    },
    list: {
        borderTop: '1px solid',
        borderColor: theme.palette.secondary.light,
    },
    paper: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

class CreateComment extends Component {
    state = {
        body: '',
        postId: '',
    }
    handleSend = (e) => {
        e.preventDefault();
        this.setState({ postId: this.props.postId });
        this.props.createComment(this.state);
        this.setState({ body: '' });
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    };
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <List dense={false}>
                    <Paper component="form" className={classes.paper}>
                        <Avatar>
                            <FolderIcon />
                        </Avatar>
                        <InputBase
                            className={classes.input}
                            id='body'
                            value={this.state.body}
                            placeholder="Write a comment"
                            onChange={this.handleChange}
                            required
                            autoComplete="comment"
                        />
                        <Divider className={classes.divider} orientation="vertical" />
                        <IconButton color="secondary" className={classes.iconButton} aria-label="directions" onClick={this.handleSend} >
                            <SendIcon />
                        </IconButton>
                    </Paper>
                </List>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createComment: (comment) => dispatch(createComment(comment))
    }
}


export default connect(null, mapDispatchToProps)(withStyles(useStyles)(CreateComment));
