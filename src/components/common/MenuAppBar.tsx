import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import { useQuery } from '@apollo/react-hooks';
import { GET_ALL_CCPS } from '../../graphql/queries/templates/ccps';
import { GET_EVENT_INFO } from '../../graphql/queries/templates/events';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import WebOutlinedIcon from '@material-ui/icons/WebOutlined';

interface MenuAppBarProps {
  eventId: string;
  pageTitle: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    },
    event: {
      paddingTop: '111px',
    },
    active: {
      backgroundColor: "red"
    }
  }),
);

export default function MenuAppBar(props: MenuAppBarProps) {
  const { pageTitle, eventId } = props;
  const classes = useStyles();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { loading: ccpLoading, error, data:ccpInfo } = useQuery(GET_ALL_CCPS);
  const { loading: eventLoading, data: eventInfo } = useQuery(GET_EVENT_INFO, {
      variables: { eventId },
  });
  if (ccpLoading || eventLoading) return null;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" 
            onClick={toggleMenu}>
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
          <ListItem button key={ eventInfo.event.name } classes={{ selected: classes.active }}>
            <Typography style={{ fontWeight: "bold" }}  className={ classes.event }>
            { eventInfo.event.name }
            </Typography>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button key={ pageTitle }>
            <ListItemIcon><WebOutlinedIcon /></ListItemIcon>
            <Typography >
              { pageTitle }
            </Typography>
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
          
          {ccpInfo.collectionPoints.map((ccp) => (
            <ListItem button key={ccp.name}>
              <ListItemIcon><RoomOutlinedIcon /></ListItemIcon>
              <Typography >
                { ccp.name }
            </Typography>
            </ListItem>
          ))}
        </List>
      </div>
      </Drawer>
    </>
  );
}