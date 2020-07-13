import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import MenuTabs from '../components/common/MenuTabs';
import AddEventButton from '../components/HomeLandingPage/AddEventButton';
import EventCard from '../components/HomeLandingPage/EventCard';
import useAllEvents from '../graphql/queries/hooks/events';
import { EventType, GET_ALL_EVENTS } from '../graphql/queries/templates/events';
import '../styles/HomeLandingPage.css';

const HomeLandingPage = (): JSX.Element => {
  const [selectedTab, setTab] = useState(0);
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
  const events: Array<EventType> = data ? data.events : [];

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
            <AccountCircleIcon fontSize="large" color="primary" />
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
          {events.map((event: EventType) => (
            <Grid item>
              <EventCard
                key={event.name}
                date={event.eventDate}
                eventTitle={event.name}
                address="N/A"
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
