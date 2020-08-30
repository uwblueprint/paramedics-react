import React, { useState, useEffect } from 'react';

import { useQuery, useMutation } from 'react-apollo';
import { Grid, Typography } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import MenuTabs from '../common/MenuTabs';
import AddEventButton from './AddEventButton';
import EventCard from './EventCard';
import UserProfile from './UserProfile';
import useAllEvents from '../../graphql/queries/hooks/events';
import { Event, FETCH_ALL_EVENTS } from '../../graphql/queries/events';
import { EDIT_EVENT, DELETE_EVENT } from '../../graphql/mutations/events';
import '../../styles/HomeLandingPage.css';

type LocationState = { addedEventId: string | null };

const HomeLandingPage = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const { addedEventId } = location.state || { addedEventId: null };
  const [selectedTab, setTab] = useState(0);
  const [eventToBeDeleted, setEventToBeDeleted] = useState<Event | null>(null);

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
  const { data } = useQuery(FETCH_ALL_EVENTS);
  const [editEvent] = useMutation(EDIT_EVENT);
  const [deleteEvent] = useMutation(DELETE_EVENT, {
    update(cache, { data: { deleteEvent } }) {
      if (!deleteEvent) {
        return;
      }
      let { events } = cache.readQuery<any>({
        query: FETCH_ALL_EVENTS,
      });

      events = events.filter((event) => event.id !== eventToBeDeleted?.id);

      cache.writeQuery({
        query: FETCH_ALL_EVENTS,
        data: { events },
      });
    },
  });
  const events: Array<Event> = data ? data.events : [];

  const handleArchiveEvent = (event: Event) => {
    editEvent({
      variables: {
        id: event.id,
        name: event.name,
        eventDate: event.eventDate,
        createdBy: event.createdBy.id,
        isActive: false,
      },
    });
  };
  const handleUnarchiveEvent = (event: Event) => {
    editEvent({
      variables: {
        id: event.id,
        name: event.name,
        eventDate: event.eventDate,
        createdBy: event.createdBy.id,
        isActive: true,
      },
    });
  };

  const handleDeleteEvent = async (event: Event) => {
    await setEventToBeDeleted(event);
    deleteEvent({
      variables: {
        id: event.id,
      },
    });
  };

  // Filters for inactive or active events
  const filteredEvents = React.useMemo(
    () => events.filter((event) => event.isActive === (selectedTab === 0)),
    [events, selectedTab]
  );

  return (
    <div className="landing-wrapper">
      <div className="landing-top-section">
        <div className="landing-top-bar">
          <Typography variant="h3">Mass Casualty Events</Typography>
          <UserProfile />
        </div>
        <MenuTabs
          handleChange={handleChange}
          currentTab={selectedTab}
          tabLabels={tabLabels}
        />
      </div>
      <div className="landing-body">
        <Grid container direction="row" alignItems="center" spacing={3}>
          {filteredEvents.map((event: Event) => (
            <Grid item key={event.id}>
              <EventCard
                key={event.id}
                eventId={event.id}
                date={event.eventDate}
                eventTitle={event.name}
                isActive={event.isActive}
                isNew={event.id === addedEventId}
                address="N/A"
                handleClick={() => history.push(`/events/${event.id}`)}
                handleArchiveEvent={() => handleArchiveEvent(event)}
                handleUnarchiveEvent={() => handleUnarchiveEvent(event)}
                handleDeleteEvent={() => handleDeleteEvent(event)}
              />
            </Grid>
          ))}
        </Grid>
        <div className="add-event-container">
          <AddEventButton />
        </div>
      </div>
    </div>
  );
};

export default HomeLandingPage;
