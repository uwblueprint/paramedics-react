import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Colours } from '../../styles/Constants';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import { useQuery } from '@apollo/react-hooks';
import { ScanIcon } from './ScanIcon';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import { GET_CCPS_BY_EVENT_ID } from '../../graphql/queries/ccps';
import { GET_EVENT_BY_ID } from '../../graphql/queries/events';
import { useHistory } from 'react-router-dom';

interface MenuAppBarProps {
  eventId: string;
  pageTitle: string;
}

const useStyles = makeStyles({
  menuButton: {
    marginRight: '23px',
  },
  title: {
    flexGrow: 1,
  },
  list: {
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
  link: {
    textDecoration: 'none',
  },
});

export default function MenuAppBar(props: MenuAppBarProps) {
  const { pageTitle, eventId } = props;
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
              >
                <ListItemIcon>
                  <RoomOutlinedIcon />
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
