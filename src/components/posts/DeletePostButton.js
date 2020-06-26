import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { deletePost } from '../../store/actions/dataActions';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';


const useStyles = ((theme) => ({
    dialogTitle: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: '10px 24px',
    },
    dialogText: {
        padding: '10px 24px 0 24px',
        marginBottom: 0,
        textAlign: 'center',
        color: theme.palette.text.primary,
    },
}));

class DeletePostButton extends Component {
    state = {
        open: false
    }
    handleOpen = () => {
        this.setState({
            open: true
        })
    }
    handleClose = () => {
        this.setState({
            open: false
        })
    }
    handleDeletePost = () => {
        this.props.deletePost(this.props.postId);
        this.setState({
            open: false
        })
    }
    render() {
        const { classes } = this.props;
        return (
            <>
                <IconButton aria-label="Delete" onClick={this.handleOpen}>
                    <DeleteIcon />
                </IconButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle className={classes.dialogTitle} >
                        Confirm
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText className={classes.dialogText}>
                            Are you sure you want to delete this post?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleDeletePost} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

const mapDispatchToProps = {
    deletePost
}

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(DeletePostButton));
