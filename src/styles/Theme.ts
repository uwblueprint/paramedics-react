import { createMuiTheme } from '@material-ui/core/styles';
import { Colors } from './Constants'

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: Colors.Primary
    },
    secondary: {
      main: Colors.Secondary
    },
    error: {
      main: Colors.Danger
    }
  },
  typography: {
    h3: {
      fontSize: '48px',
      letterSpacing: 0,
      lineHeight: '72px',
    },
    h4: {
      fontSize: '34px',
      letterSpacing: '0.25px',
      lineHeight: '51px'
    },
    h5: {
      fontSize: '24px',
      letterSpacing: 0,
      lineHeight: '36px'
    },
    h6: {
      fontSize: '20px',
      letterSpacing: '0.25px',
      lineHeight: '30px'
    },
    body1: {
      fontSize: '18px',
      letterSpacing: '0.5px',
      lineHeight: '24px'
    },
    body2: {
      fontSize: '18px',
      letterSpacing: '0.5px',
      lineHeight: '24px'
    },
    button: {
      fontSize: '18px',
      letterSpacing: '1.25px',
      lineHeight: '24px'
    },
  },
});