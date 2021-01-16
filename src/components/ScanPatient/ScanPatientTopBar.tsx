import React from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Colours } from '../../styles/Constants';
import {
  CCPDashboardTabOptions,
  CCPDashboardTabMap,
} from '../CCPDashboard/CCPDashboardPage';

type LocationState = { from: 'patientOverview' | 'hospital' | null };

const useScanPatientTopBarStyles = makeStyles(() =>
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

const ScanPatientTopBar = () => {
  const classes = useScanPatientTopBarStyles();
  const history = useHistory();
  const location = useLocation<LocationState>();
  const { pathname } = history.location;
  const { from } = location.state || {
    from: CCPDashboardTabMap[CCPDashboardTabOptions.PatientOverview],
  };

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
            to={`${pathname.split('scan')[0]}${from}`}
          >
            <ArrowBackIcon />
          </IconButton>
          <Button
            color="inherit"
            className={classes.enterCodeText}
            component={NavLink}
            to={{
              pathname: `${pathname.split('scan')[0]}manual`,
              state: { from },
            }}
          >
            <Typography variant="h6">Enter code manually</Typography>
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default ScanPatientTopBar;
