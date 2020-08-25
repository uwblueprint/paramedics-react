import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import { makeStyles, Button, Box, Grid, Typography } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useHistory, useLocation, NavLink } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import MenuTabs from '../common/MenuTabs';
import EventCard from './EventCard';
import useAllEvents from '../../graphql/queries/hooks/events';
import { Event, GET_ALL_EVENTS } from '../../graphql/queries/events';
import { Colours } from '../../styles/Constants';

const useStyles = makeStyles({
  root: {
    backgroundColor: Colours.BackgroundGray,
    minHeight: '100vh',
  },
  topSection: {
    padding: '56px 56px 0 56px',
    backgroundColor: Colours.White,
  },
  topBar: {
    display: 'flex',
    paddingBottom: '36px',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    borderRadius: '2000px',
    position: 'fixed',
    bottom: '56px',
    right: '56px',
    padding: '12px 26px',
  },
});

type LocationState = { addedEventId: string | null };

const EventsPage = () => {
  const history = useHistory();
  const classes = useStyles();
  const location = useLocation<LocationState>();
  const { addedEventId } = location.state || { addedEventId: null };
  const [selectedTab, setTab] = useState(0);

  // Clear the addedEventId in location state now that it's been used
  window.history.pushState(
    {
      ...location.state,
      addedEventId: null,
    },
    ''
  );

  const handleChange = (
    event: React.ChangeEvent<unknown>,
    newValue: number
  ) => {
    setTab(newValue);
  };

  const tabLabels = ['Current Events', 'Archived Events'];

  // Fetch events from backend
  useAllEvents();

  // Fetch events from cache
  const { data } = useQuery(GET_ALL_EVENTS);
  const events: Array<Event> = data ? data.events : [];

  return (
    <Box className={classes.root}>
      <Box className={classes.topSection}>
        <Box className={classes.topBar}>
          <Typography variant="h3">Mass Casualty Events</Typography>
          <Box display="flex" alignItems="center">
            <Typography
              variant="h6"
              align="right"
              style={{ marginRight: '16px' }}
            >
              Joe Li
            </Typography>
            <AccountCircleIcon fontSize="large" color="secondary" />
          </Box>
        </Box>
        <MenuTabs
          handleChange={handleChange}
          currentTab={selectedTab}
          tabLabels={tabLabels}
        />
      </Box>
      <Box padding="70px 56px 168px 56px">
        <Grid container direction="row" alignItems="center" spacing={3}>
          {events.map((event: Event) => (
            <Grid item key={event.id}>
              <EventCard
                key={event.id}
                date={event.eventDate}
                eventTitle={event.name}
                isNew={event.id === addedEventId}
                address="N/A"
                handleClick={() => history.push(`/events/${event.id}`)}
              />
            </Grid>
          ))}
        </Grid>
        <Button
          component={NavLink}
          to="/events/new"
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          className={classes.addButton}
        >
          Add New Event
        </Button>
      </Box>
    </Box>
  );
};

export default EventsPage;
