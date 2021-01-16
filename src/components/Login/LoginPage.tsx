import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { UserContext } from '../../utils/userProvider';
import { makeStyles, Box, Typography } from '@material-ui/core';
import LoginButton from './LoginButton';
import InvalidUserMessage from './InvalidUserMessage';
import { Colours } from '../../styles/Constants';

import paramedicsLogo from '../../assets/paramedicsLogo.png';
import loginBackground from '../../assets/loginBackground.png';
import logoAndName from '../../assets/logoAndName.png';

const useStyles = makeStyles({
  root: {
    backgroundColor: Colours.White,
    height: '100vh',
    display: 'flex',
  },
  leftColumn: {
    paddingTop: '207px',
  },
  rightColumn: {
    textAlign: 'center',
    paddingTop: '207px',
    color: Colours.White,
    backgroundColor: Colours.Secondary,
    backgroundImage: `url(${loginBackground})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
  boldText: {
    fontWeight: 'bold',
    paddingTop: '40px',
  },
  adminAccessText: {
    width: '329px',
    paddingBottom: '40px',
  },
  loginText: {
    color: Colours.SecondaryGray,
    paddingTop: '20px',
  },
  appNameText: {
    margin: 'auto',
    width: '366px',
  },
  paramedicsText: {
    paddingTop: '16px',
    margin: 'auto',
    width: '220px',
  },
  paramedicsLogo: {
    paddingTop: '16px',
  },
});

const LoginPage = ({ invalidUser }: { invalidUser: Boolean }) => {
  const classes = useStyles();

  // If the user is logged in, redirect to home page
  const user = useContext(UserContext);
  console.log(Object.keys(user).length);
  if (Object.keys(user).length > 0) {
    return <Redirect to="/events" />;
  }

  return (
    <Box className={classes.root}>
      <Box width="50%" className={classes.leftColumn}>
        <Box paddingLeft="122px">
          <Typography variant="h3">Welcome</Typography>
          <Typography variant="body1" className={classes.boldText}>
            First time here?
          </Typography>
          <Typography variant="body1" className={classes.adminAccessText}>
            Check that your administrator has granted you access before logging
            in
          </Typography>
          {invalidUser && <InvalidUserMessage />}
          <LoginButton />
          <Typography variant="body1" className={classes.loginText}>
            Log in using your ROWPS account
          </Typography>
        </Box>
      </Box>
      <Box width="50%" className={classes.rightColumn}>
        <img
          src={logoAndName}
          alt="STAT App Logo"
        />
        <Typography variant="h5" className={classes.appNameText}>
          Mass casualty patient tracking made easy.
        </Typography>
        <img
          src={paramedicsLogo}
          className={classes.paramedicsLogo}
          alt="Paramedics Logo"
        />
        <Typography variant="body1" className={classes.paramedicsText}>
          Region of Waterloo Paramedic Services
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
