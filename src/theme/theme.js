import { createTheme } from "@mui/material/styles";

const { palette } = createTheme();

const theme = createTheme({
    palette:{
        primary:{
            main:'#262626',
            darker:'#1e1f1e',
            font:'#fafafa',
            fontdull:'#b5b5b5'
        },
        secondary:{
            main:'#37a3fe'
        },
        highlight:{
            main:'#00ffbf'
        }
    }
});


export default theme;