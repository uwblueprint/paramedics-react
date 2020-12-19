import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListSubheader,
  Divider,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import MapOutlinedIcon from '@material-ui/icons/MapOutlined';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import { useQuery } from '@apollo/react-hooks';
import { NavLink, useHistory } from 'react-router-dom';
import { ScanIcon } from './ScanIcon';
import { GET_CCPS_BY_EVENT_ID } from '../../graphql/queries/ccps';
import { GET_EVENT_BY_ID } from '../../graphql/queries/events';
import { Colours } from '../../styles/Constants';

interface MenuAppBarProps {
  eventId: string;
  pageTitle: string | React.ReactNode;
  selectedDirectory?: boolean;
  selectedMaps?: boolean;
  selectedCcp?: string;
}

const useStyles = makeStyles({
  menuButton: {
    marginRight: '23px',
  },
  title: {
    flexGrow: 1,
  },
  list: {
    height: '100%',
    width: '250px',
  },
  fullList: {
    width: 'auto',
  },
  eventName: {
    paddingTop: '111px',
  },
  active: {
    backgroundColor: 'red',
  },
  viewEventsLink: {
    padding: '16px',
    position: 'absolute',
    top: '24px',
    zIndex: 10,
  },
  activeIcon: {
    color: Colours.White,
    backgroundColor: Colours.Secondary,
    '&:hover': {
      backgroundColor: Colours.Secondary,
    },
  },
  activeRow: {
    color: Colours.White,
    backgroundColor: Colours.Secondary,
    '&:hover': {
      backgroundColor: Colours.Secondary,
    },
    padding: '12px 16px',
  },
  sidebarIcon: {
    minWidth: '40px',
    color: Colours.Black,
  },
  sidebarRow: {
    padding: '12px 16px',
  },
});

export default function MenuAppBar(props: MenuAppBarProps) {
  const { pageTitle, eventId, selectedDirectory, selectedMaps, selectedCcp } = props;
  const history = useHistory();
  const classes = useStyles();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { loading: ccpLoading, data: ccpInfo } = useQuery(
    GET_CCPS_BY_EVENT_ID,
    { variables: { eventId } }
  );
  const { loading: eventLoading, data: eventInfo } = useQuery(GET_EVENT_BY_ID, {
    variables: { eventId },
  });
  if (ccpLoading || eventLoading) return null;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDirectoryClick = () => {
    history.push(`/events/${eventId}`);
  };

  const handleCCPClick = (ccpId) => {
    history.push(`/events/${eventId}/ccps/${ccpId}`);
  };

  const handleMapClick = () => {
    history.push(`/events/${eventId}/map`);
  };

  return (
    <>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={toggleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {pageTitle}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={isMenuOpen}
        onClose={toggleMenu}
        disableScrollLock
      >
        <div
          className={classes.list}
          role="presentation"
          onClick={toggleMenu}
          onKeyDown={toggleMenu}
        >
          <Link
            color="secondary"
            variant="body2"
            component={NavLink}
            to="/events"
            className={classes.viewEventsLink}
          >
            &larr; Home
          </Link>
          <List>
            <ListItem key={eventInfo.event.name}>
              <Typography variant="h6" className={classes.eventName}>
                {eventInfo.event.name}
              </Typography>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem
              button
              key="directory"
              onClick={handleDirectoryClick}
              className={selectedDirectory ? classes.activeRow : classes.sidebarRow}
            >
              <ListItemIcon className={classes.sidebarIcon}>
                <ScanIcon colour={selectedDirectory ? Colours.White : Colours.Black} />
              </ListItemIcon>
              <Typography variant="body2">Directory</Typography>
            </ListItem>
            <ListItem
              button
              key="maps"
              onClick={handleMapClick}
              className={selectedMaps ? classes.activeRow : classes.sidebarRow}
            >
              <ListItemIcon className={classes.sidebarIcon}>
                <MapOutlinedIcon
                  className={selectedMaps ? classes.activeIcon : ''}
                />
              </ListItemIcon>
              <Typography variant="body2">Map</Typography>
            </ListItem>
          </List>
          <Divider />
          <List
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                CCP
              </ListSubheader>
            }
          >
            {ccpInfo.collectionPointsByEvent.map((ccp) => (
              <ListItem
                button
                key={ccp.name}
                onClick={() => handleCCPClick(ccp.id)}
                className={
                  selectedCcp && selectedCcp === ccp.id
                    ? classes.activeRow
                    : classes.sidebarRow
                }
              >
                <ListItemIcon className={classes.sidebarIcon}>
                  <RoomOutlinedIcon
                    className={
                      selectedCcp && selectedCcp === ccp.id
                        ? classes.activeIcon
                        : ''
                    }
                  />
                </ListItemIcon>
                <Typography variant="body2">{ccp.name}</Typography>
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </>
  );
}
