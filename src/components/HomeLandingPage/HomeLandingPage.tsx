import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import { Grid, Typography } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useHistory, useLocation } from 'react-router-dom';
import MenuTabs from '../common/MenuTabs';
import AddEventButton from './AddEventButton';
import EventCard from './EventCard';
import useAllEvents from '../../graphql/queries/hooks/events';
import { Event, GET_ALL_EVENTS } from '../../graphql/queries/events';
import '../../styles/HomeLandingPage.css';

type LocationState = { addedEventId: string | null };

const HomeLandingPage = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const { addedEventId } = location.state || { addEventId: null };
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
        <div className="add-event-container">
          <AddEventButton />
        </div>
      </div>
    </div>
  );
};

export default HomeLandingPage;
