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
  }
});