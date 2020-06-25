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


const useStyles = ((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        // backgroundColor: 'blue',
        // maxWidth: 752,
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.text.primary,
    },
    item: {
        padding: '0px',
    }
}));

class Follower extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <List dense={false} className={classes.item}>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <FolderIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={<Link to="/user/R" className={classes.link}>Username</Link>}
                            secondary='ranting text text text '
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </div>
        );
    }
}

export default withStyles(useStyles)(Follower);
