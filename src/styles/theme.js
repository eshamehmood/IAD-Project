import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    "palette": {
        "common": {
            "black": "#000",
            "white": "#fff"
        },
        "background": {
            "paper": "#fff",
            "default": "#fafafa"
        },
        "primary": {
            "light": "rgba(155, 155, 155, 1)",
            "main": "rgba(74, 74, 74, 1)",
            "dark": "rgba(43, 43, 43, 1)",
            "contrastText": "#fff"
        },
        "secondary": {
            "light": "#ff4081",
            "main": "#f50057",
            "dark": "#c51162",
            "contrastText": "#fff"
        },
        "error": {
            "light": "#e57373",
            "main": "#f44336",
            "dark": "#d32f2f",
            "contrastText": "#fff"
        },
        "text": {
            "primary": "rgba(0, 0, 0, 0.87)",
            "secondary": "rgba(0, 0, 0, 0.54)",
            "disabled": "rgba(0, 0, 0, 0.38)",
            "hint": "rgba(0, 0, 0, 0.38)"
        }
    },
    overrides: {
        // Style sheet name ⚛️
        MuiButton: {
            // Name of the rule
            root: {
                textTransform: 'capitalize',
            },
        },
        MuiCard: {
            root: {
                maxWidth: 645,
                minWidth: 345,
            }
        },
        MuiToolbar: {
            gutters: {
                paddingLeft: '8%',
                paddingRight: '2%',
                '@media (min-width: 600px)': {
                    paddingLeft: '10%',
                    paddingRight: '10%',
                }
            }
        },
    },
});

export default theme;