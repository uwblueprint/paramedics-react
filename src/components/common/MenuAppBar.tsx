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
  activeCcp: {
    color: Colours.White,
    backgroundColor: Colours.Secondary,
    '&:hover': {
      backgroundColor: Colours.Secondary,
    },
  },
  viewEventsLink: {
    position: 'absolute',
    bottom: 0,
    padding: '24px',
  },
  activeMap: {
    color: Colours.White,
    backgroundColor: Colours.Secondary,
    '&:hover': {
      backgroundColor: Colours.Secondary,
    },
  },
});

export default function MenuAppBar(props: MenuAppBarProps) {
  const { pageTitle, eventId, selectedMaps, selectedCcp } = props;
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
      <Drawer anchor="left" open={isMenuOpen} onClose={toggleMenu}>
        <div
          className={classes.list}
          role="presentation"
          onClick={toggleMenu}
          onKeyDown={toggleMenu}
        >
          <List>
            <ListItem key={eventInfo.event.name}>
              <Typography variant="h6" className={classes.eventName}>
                {eventInfo.event.name}
              </Typography>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button key="directory" onClick={handleDirectoryClick}>
              <ListItemIcon>
                <ScanIcon colour={Colours.Black} />
              </ListItemIcon>
              <Typography variant="body2">Directory</Typography>
            </ListItem>
            <ListItem
              button
              key="maps"
              onClick={handleMapClick}
              className={selectedMaps ? classes.activeMap : ''}
            >
              <ListItemIcon>
                <MapOutlinedIcon
                  style={{ color: Colours.Black }}
                  className={selectedMaps ? classes.activeMap : ''}
                />
              </ListItemIcon>
              <Typography variant="body2">Maps</Typography>
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
                  selectedCcp && selectedCcp === ccp.id ? classes.activeCcp : ''
                }
              >
                <ListItemIcon>
                  <RoomOutlinedIcon
                    className={
                      selectedCcp && selectedCcp === ccp.id
                        ? classes.activeCcp
                        : ''
                    }
                  />
                </ListItemIcon>
                <Typography variant="body2">{ccp.name}</Typography>
              </ListItem>
            ))}
          </List>
          <Link
            color="secondary"
            variant="body2"
            component={NavLink}
            to="/events"
            className={classes.viewEventsLink}
          >
            View other events
          </Link>
        </div>
      </Drawer>
    </>
  );
}
