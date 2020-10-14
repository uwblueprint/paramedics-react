import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Colours } from '../../styles/Constants';

const useMapTopBarStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },

    enterCodeText: {
      marginLeft: 'auto',
      textTransform: 'none',
    },
    topBar: {
      backgroundColor: Colours.SecondaryHover,
    },
  })
);

const MapTopBar = () => {
  const classes = useMapTopBarStyles();
  const history = useHistory();
  const { pathname } = history.location;

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        color="secondary"
        classes={{ colorSecondary: classes.topBar }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            component={NavLink}
            to={pathname.split('/map')[0]}
          >
            <ArrowBackIcon />
          </IconButton>
          <Button
            color="inherit"
            className={classes.enterCodeText}
            component={NavLink}
            to={`${pathname.split('map')[0]}manual`}
          >
            <Typography variant="h6">Map</Typography>
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default MapTopBar;