import { makeStyles } from '@material-ui/core/styles';

const navButtons = makeStyles((theme) => ({
    desktopItem: {
        flexGrow: 1,
        [theme.breakpoints.down("sm")]: {
            display: "none"
        },
    },
    mobileItem: {
        minWidth: '96px',
        flexGrow: 1,
        [theme.breakpoints.up("md")]: {
            display: "none"
        },
    },
    button: {
        margin: 0,
        height: '4em',
    }
}));

export default navButtons