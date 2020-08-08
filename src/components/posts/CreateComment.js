import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import { connect } from 'react-redux';
import { createComment } from '../../store/actions/dataActions';

const useStyles = ((theme) => ({
    root: {
        margin: '3px 0px'
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
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
    avatar: {
        marginLeft: '10px'
    }
}));

class CreateComment extends Component {
    state = {
        body: '',
        errors: {},
    }
    handleSend = () => {
        this.setState({ postId: this.props.postId });
        if (this.state.body.toString().trim() === '') {
            this.setState({ errors: { body: 'Must not be empty' } })
        }
        else {
            this.setState({ errors: {} })
            this.props.createComment(this.props.postId, { body: this.state.body });
            this.setState({ body: '' });
        }
    }
    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.handleSend();
        }
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    };
    render() {
        const { classes, user: { credentials: { imageUrl } } } = this.props;
        return (
            <div className={classes.root}>
                <Paper elevation={0} className={classes.paper}>
                    <Avatar className={classes.avatar} src={imageUrl}>
                    </Avatar>
                    <TextField
                        variant="outlined"
                        color="secondary"
                        className={classes.input}
                        id='body'
                        value={this.state.body}
                        placeholder="Write a comment"
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown}
                        required
                        size="small"
                        fullWidth
                        autoComplete="off"
                    />
                    <IconButton color="secondary" className={classes.iconButton} aria-label="directions" onClick={this.handleSend} >
                        <SendIcon />
                    </IconButton>
                </Paper>
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    user: state.user,
})

const mapDispatchToProps = {
    createComment
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(CreateComment));
