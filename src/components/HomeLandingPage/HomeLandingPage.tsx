import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { useHistory } from 'react-router-dom';
import MenuTabs from '../common/MenuTabs';
import AddEventButton from './AddEventButton';
import EventCard from './EventCard';
import useAllEvents from '../../graphql/queries/hooks/events';
import { Event, FETCH_ALL_EVENTS } from '../../graphql/queries/events';
import { EDIT_EVENT, DELETE_EVENT } from '../../graphql/mutations/events';
import '../../styles/HomeLandingPage.css';

const HomeLandingPage = () => {
  const [selectedTab, setTab] = useState(0);
  const handleChange = (
    event: React.ChangeEvent<unknown>,
    newValue: number
  ) => {
    setTab(newValue);
  };
  const history = useHistory();

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
          <div className="user-icon">
            <Typography
              variant="h6"
              align="right"
              style={{ marginRight: '0.5em' }}
            >
              Joe Li
            </Typography>
            <AccountCircleIcon fontSize="large" color="secondary" />
          </div>
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
                address="N/A"
                handleClick={() => history.push(`/events/${event.id}`)}
                handleArchiveEvent={() => handleArchiveEvent(event)}
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
