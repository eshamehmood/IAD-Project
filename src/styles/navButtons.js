import { makeStyles } from '@material-ui/core/styles';

const navButtons = makeStyles((theme) => ({
    desktopItem: {
        [theme.breakpoints.down("xs")]: {
            display: "none"
        },
    },
    mobileItem: {
        [theme.breakpoints.up("sm")]: {
            display: "none"
        },
    },
    button: {
        margin: 0,
        height: '4em',
    }
}));

export default navButtons