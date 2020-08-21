import React, { useState } from 'react';

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
  const { data, refetch } = useQuery(FETCH_ALL_EVENTS);
  const [editEvent] = useMutation(EDIT_EVENT);
  const [deleteEvent] = useMutation(DELETE_EVENT);
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
    // Force re-render
    refetch();
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
    // Force re-render
    refetch();
  };

  const handleDeleteEvent = async (event: Event) => {
    await deleteEvent({
      variables: {
        id: event.id,
      },
    });
    // Force re-render
    refetch();
  };

  // Filters for inactive or active events
  const filteredEvents = events.filter(
    (event) => event.isActive === (selectedTab === 0)
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
