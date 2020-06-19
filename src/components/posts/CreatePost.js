import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CardHeader from '@material-ui/core/CardHeader';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { connect } from 'react-redux';
import { createPost } from '../../store/actions/postActions';

const useStyles = ((theme) => ({
    root: {
        margin: '0px 5%',
        maxWidth: 645,
        width: '100%',
        minWidth: 200,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    header: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        padding: '8px 10px',
        textAlign: 'center',
    },
    input: {
        display: 'none',
    },
    iconPadding: {
        paddingLeft: '10px',
    },
    cardAction: {
        backgroundColor: theme.palette.background.default,
    },
    form: {
        margin: theme.spacing(1),
        width: '25ch',
    },
    uploadButton: {
        marginLeft: 'auto',
        marginRight: '8px',
    },
    noOutline: {
        outline: 'none',
    },
    mobileItem: {
        [theme.breakpoints.up("sm")]: {
            display: "none"
        },
    },
    desktopItem: {
        margin: 0,
        height: '4em',
        [theme.breakpoints.down("xs")]: {
            display: "none"
        },
    },
}));


class CreatePost extends Component {
    state = {
        open: false,
        imageName: '',
        body: '',
        errors: {}
    };

    handleOpen = () => {
        this.setState({ open: true });
    };
    handleClose = () => {
        // this.props.clearErrors();
        this.setState({ open: false, errors: {} });
    };
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    };

    handleUpload = (e) => {
        e.preventDefault();
        const postSubmit = {
            imageName: this.state.imageName, body: this.state.body
        }
        this.props.createPost(postSubmit)
        this.setState({ open: false, errors: {} });
    }

    render() {
        const { classes } = this.props;
        return (
            <>
                <IconButton className={classes.mobileItem} color="inherit" onClick={this.handleOpen}>
                    <AddCircleOutlineIcon />
                </IconButton>
                <Button color="inherit" size="large" className={classes.button + ' ' + classes.desktopItem} onClick={this.handleOpen}>
                    Post+
                </Button>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={this.state.open}
                    onClose={this.handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={this.state.open} className={classes.noOutline + ' ' + classes.root}>
                        <Card>
                            <CardHeader
                                className={classes.header}
                                title="Post" />
                            <CardContent>
                                <Grid
                                    container
                                    spacing={2}
                                    alignItems="center"
                                    justify="center"
                                >
                                    <Grid item xs={12}>
                                        <input
                                            accept="image/*"
                                            className={classes.input}
                                            id="imageName"
                                            multiple
                                            type="file"
                                            onChange={this.handleChange}
                                        />
                                        <label htmlFor="imageName">
                                            <Button variant="contained" color="primary" component="span">
                                                Select Image
                                            <PhotoCamera className={classes.iconPadding} />
                                            </Button>
                                        </label>
                                    </Grid>
                                    <Grid item xs={12}>
                                        Preview window somehow
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="body"
                                            label="description"
                                            multiline
                                            rowsMax={5}
                                            placeholder="Type Description"
                                            variant="outlined"
                                            fullWidth
                                            onChange={this.handleChange}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <CardActions className={classes.cardAction}>
                                <Button className={classes.uploadButton} variant="contained" color="secondary" onClick={this.handleUpload}>Upload</Button>
                            </CardActions>
                        </Card>
                    </Fade>
                </Modal>
            </>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createPost: (post) => dispatch(createPost(post))
    }
}

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(CreatePost));

