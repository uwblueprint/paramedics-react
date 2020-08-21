import { createMuiTheme } from '@material-ui/core/styles';
import { Colours } from './Constants';

export const Theme = createMuiTheme({
  palette: {
    primary: {
      main: Colours.Primary,
    },
    secondary: {
      main: Colours.Secondary,
    },
    error: {
      main: Colours.Danger,
    },
    text: {
      primary: Colours.Black,
      secondary: Colours.SecondaryGray,
    },
  },
  typography: {
    h3: {
      fontSize: '48px',
      letterSpacing: 0,
      lineHeight: '72px',
      fontWeight: 'normal',
    },
    h4: {
      fontSize: '34px',
      letterSpacing: '0.25px',
      lineHeight: '51px',
      fontWeight: 'normal',
    },
    h5: {
      fontSize: '24px',
      letterSpacing: 0,
      lineHeight: '36px',
      fontWeight: 'normal',
    },
    h6: {
      fontSize: '20px',
      letterSpacing: '0.25px',
      lineHeight: '30px',
      fontWeight: 500,
    },
    body1: {
      fontSize: '18px',
      letterSpacing: '0.5px',
      lineHeight: '24px',
      fontWeight: 500,
    },
    body2: {
      fontSize: '18px',
      letterSpacing: '0.5px',
      lineHeight: '24px',
      fontWeight: 'normal',
    },
    button: {
      fontSize: '18px',
      letterSpacing: '1.25px',
      lineHeight: '24px',
      fontWeight: 500,
      textTransform: 'uppercase',
    },
    caption: {
      fontSize: '16px',
      letterSpacing: '0.5px',
      lineHeight: '20px',
      fontWeight: 'normal',
    },
  },
  overrides: {
    MuiTableCell: {
      root: {
        borderBottom: `1px solid ${Colours.BorderLightGray}`,
      },
    },
    // Remove bottom border on last row of tables to avoid duplicating borders
    MuiTableRow: {
      root: {
        'tbody &:last-child td, tbody &:last-child th': {
          borderBottom: 0,
        },
      },
    },
    MuiCard: {
      root: {
        borderColor: Colours.BorderLightGray,
      },
    },
    MuiTab: {
      wrapper: { textTransform: 'none' },
    },
    MuiSnackbarContent: {
      root: {
        minWidth: 'unset !important',
        justifyContent: 'center',
        borderRadius: 0,
        padding: '16px 24px',
      },
      message: {
        fontSize: '18px',
        letterSpacing: '0.5px',
        lineHeight: '24px',
        fontWeight: 'normal',
      },
    },
  },
});
