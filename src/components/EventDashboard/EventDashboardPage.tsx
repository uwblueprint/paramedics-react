import React from 'react';
import Box from '@material-ui/core/Box';
import {
  Typography,
  Container,
  Tabs,
  Tab,
  makeStyles,
} from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { RouteComponentProps } from 'react-router';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import CCPTabPanel from './CCPTabPanel';
import MenuAppBar from '../common/MenuAppBar';
import { Colours } from '../../styles/Constants';
import { GET_EVENT_BY_ID } from '../../graphql/queries/events';
import ResourceTabPanel from './ResourceTabPanel';
import { formatDate } from '../../utils/format';
import LoadingState from '../common/LoadingState';

type TParams = { eventId: string };

export enum TabOptions {
  CCP = 0,
  Hospital = 1,
  Ambulance = 2,
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: TabOptions;
}

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    background: Colours.BackgroundGray,
  },
  container: {
    background: Colours.White,
    padding: '32px 56px',
    maxWidth: 'none',
  },
  tabs: {
    background: Colours.White,
    padding: '0 56px',
  },
});

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {children}
    </div>
  );
};

const EventDashboardPage = ({ match }: RouteComponentProps<TParams>) => {
  const classes = useStyles();
  const { eventId } = match.params;
  // TO DO: error handling when eventId does not exist in database
  const { loading: eventLoading, data: eventInfo } = useQuery(GET_EVENT_BY_ID, {
    variables: { eventId },
  });

  const [tab, setTab] = React.useState(TabOptions.CCP);

  if (eventLoading) {
    return <LoadingState />;
  }

  const { event } = eventInfo;

  const handleChange = (event: React.ChangeEvent<{}>, newValue: TabOptions) => {
    setTab(newValue);
  };

  return (
    <Box className={classes.root}>
      <MenuAppBar pageTitle="Directory" eventId={eventId} />
      <Container className={classes.container}>
        <Typography variant="h3">{event.name}</Typography>
        <Typography
          variant="body1"
          style={{
            color: Colours.SecondaryGray,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <LocationOnOutlinedIcon
            style={{ fontSize: '18px', paddingRight: '10px' }}
          />
          <Typography variant="body1" style={{ paddingRight: '52px' }}>
            Ezra Street l1j3j4, Waterloo Canada
          </Typography>
          <CalendarTodayOutlinedIcon
            style={{ fontSize: '18px', paddingRight: '10px' }}
          />
          {formatDate(event.eventDate)}
        </Typography>
      </Container>
      <Tabs
        textColor="secondary"
        className={classes.tabs}
        value={tab}
        onChange={handleChange}
      >
        <Tab label="CCP" id={`tab-${TabOptions.CCP}`} />
        <Tab label="Hospital" id={`tab-${TabOptions.Hospital}`} />
        <Tab label="Ambulance" id={`tab-${TabOptions.Ambulance}`} />
      </Tabs>
      <TabPanel value={tab} index={TabOptions.CCP}>
        <CCPTabPanel eventId={eventId} />
      </TabPanel>
      <TabPanel value={tab} index={TabOptions.Hospital}>
        <ResourceTabPanel
          eventId={eventId}
          type={TabOptions.Hospital}
          hospitals={event.hospitals}
        />
      </TabPanel>
      <TabPanel value={tab} index={TabOptions.Ambulance}>
        <ResourceTabPanel
          eventId={eventId}
          type={TabOptions.Ambulance}
          ambulances={event.ambulances}
        />
      </TabPanel>
    </Box>
  );
};

export default EventDashboardPage;
