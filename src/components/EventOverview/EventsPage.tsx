import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import { makeStyles, Button, Box, Grid, Typography } from '@material-ui/core';
import { useHistory, useLocation, NavLink } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import MenuTabs from '../common/MenuTabs';
import EventCard from './EventCard';
import UserProfile from './UserProfile';
import useAllEvents from '../../graphql/queries/hooks/events';
import { Event, GET_ALL_EVENTS } from '../../graphql/queries/events';
import { EDIT_EVENT, DELETE_EVENT } from '../../graphql/mutations/events';
import { GET_ALL_PINS, PinType } from '../../graphql/queries/maps';
import { Colours } from '../../styles/Constants';

const useStyles = makeStyles({
  root: {
    backgroundColor: Colours.BackgroundGray,
    minHeight: '100vh',
  },
  topSection: {
    padding: '35px 64px 0',
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
    bottom: '38px',
    right: '64px',
    padding: '12px 26px',
  },
});

type LocationState = { addedEventId: string | null };

const EventsPage = () => {
  const history = useHistory();
  const classes = useStyles();
  const location = useLocation<LocationState>();
  const { addedEventId } = location.state || { addedEventId: null };
  const [lastUpdatedEventId, setLastUpdatedEventId] = useState(addedEventId);
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
    setLastUpdatedEventId(null);
    setTab(newValue);
  };

  const tabLabels = ['Current Events', 'Archived Events'];

  // Fetch events from backend
  useAllEvents();

  // Fetch events from cache
  const { data } = useQuery(GET_ALL_EVENTS);
  const { data: pinData } = useQuery(GET_ALL_PINS);
  const pins = pinData ? pinData.pins : [];
  const [editEvent] = useMutation(EDIT_EVENT);
  const [deleteEvent] = useMutation(DELETE_EVENT, {
    update(cache, { data: { deleteEvent } }) {
      if (!deleteEvent) {
        return;
      }
      let { events } = cache.readQuery<any>({
        query: GET_ALL_EVENTS,
      });

      events = events.filter((event) => event.id !== deleteEvent);

      cache.writeQuery({
        query: GET_ALL_EVENTS,
        data: { events },
      });
    },
  });
  const events: Array<Event> = data ? data.events : [];

  const handleArchiveEvent = async (event: Event) => {
    await editEvent({
      variables: {
        id: event.id,
        name: event.name,
        eventDate: event.eventDate,
        createdBy: event.createdBy.id,
        isActive: false,
      },
    });
    setLastUpdatedEventId(event.id);
    setTab(1);
  };

  const handleUnarchiveEvent = async (event: Event) => {
    await editEvent({
      variables: {
        id: event.id,
        name: event.name,
        eventDate: event.eventDate,
        createdBy: event.createdBy.id,
        isActive: true,
      },
    });
    setLastUpdatedEventId(event.id);
    setTab(0);
  };

  const handleDeleteEvent = (event: Event) => {
    deleteEvent({
      variables: {
        id: event.id,
      },
    });
  };

  const eventAddress = (event: Event) => {
    const pinOfInterest = pins.filter(
      (pin) => pin.pinType === PinType.EVENT && pin.eventId.id === event.id
    );
    if (pinOfInterest && pinOfInterest.length > 0) {
      return pinOfInterest[0].address;
    }
    return 'N/A';
  };

  // Filters for inactive or active events
  const filteredEvents = React.useMemo(
    () =>
      events
        .filter((event) => event.isActive === (selectedTab === 0))
        .sort((a, b) => {
          const aUpdatedAt = new Date(a.updatedAt);
          const bUpdatedAt = new Date(b.updatedAt);
          return bUpdatedAt.getTime() - aUpdatedAt.getTime(); // Sort by recently updated
        }),
    [events, selectedTab]
  );

  return (
    <Box className={classes.root}>
      <Box className={classes.topSection}>
        <Box className={classes.topBar}>
          <Typography variant="h3">Mass Casualty Events</Typography>
          <UserProfile />
        </Box>
        <MenuTabs
          handleChange={handleChange}
          currentTab={selectedTab}
          tabLabels={tabLabels}
        />
      </Box>
      <Box padding="53px 51px 114px">
        <Grid container direction="row" alignItems="center" spacing={1}>
          {filteredEvents.map((event: Event) => (
            <Grid item key={event.id}>
              <EventCard
                key={event.id}
                eventId={event.id}
                date={event.eventDate}
                eventTitle={event.name}
                isActive={event.isActive}
                isNew={event.id === lastUpdatedEventId}
                address={eventAddress(event)}
                handleClick={() => history.push(`/events/${event.id}`)}
                handleArchiveEvent={() => handleArchiveEvent(event)}
                handleUnarchiveEvent={() => handleUnarchiveEvent(event)}
                handleDeleteEvent={() => handleDeleteEvent(event)}
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
