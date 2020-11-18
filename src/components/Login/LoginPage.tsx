import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import { makeStyles, Button, Box, Grid, Typography } from '@material-ui/core';
import { useHistory, useLocation, NavLink } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import MenuTabs from '../common/MenuTabs';
import useAllEvents from '../../graphql/queries/hooks/events';
import { Event, GET_ALL_EVENTS } from '../../graphql/queries/events';
import { EDIT_EVENT, DELETE_EVENT } from '../../graphql/mutations/events';
import LoginButton from './LoginButton';
import { Colours } from '../../styles/Constants';

import paramedicsLogo from '../../paramedicsLogo.png';
import paramedicsBackground from '../../paramedicsBackground.png';

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
    backgroundImage: `url(${paramedicsBackground})`,
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
    paddingTop: '16px',
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

const EventsPage = () => {
  const classes = useStyles();

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
          <LoginButton />
          <Typography variant="body1" className={classes.loginText}>
            Log in using your ROWPS account
          </Typography>
        </Box>
      </Box>
      <Box width="50%" className={classes.rightColumn}>
        <Typography variant="h3">STAT</Typography>
        <Typography variant="h5" className={classes.appNameText}>
          Mass Casualty Tracking Application
        </Typography>
        <img src={paramedicsLogo} className={classes.paramedicsLogo} />
        <Typography variant="body1" className={classes.paramedicsText}>
          Region of Waterloo Paramedic Services
        </Typography>
      </Box>
    </Box>
  );
};

export default EventsPage;
