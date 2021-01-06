import React, { useEffect } from 'react';
import {
  Box,
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
import { GET_PINS_BY_EVENT_ID, PinType } from '../../graphql/queries/maps';

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
  icon: { fontSize: '18px', paddingRight: '10px' },
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
  const { loading: pinsLoading, data: pinsInfo } = useQuery(
    GET_PINS_BY_EVENT_ID,
    {
      variables: { eventId },
    }
  );
  const [tab, setTab] = React.useState(TabOptions.CCP);
  const [eventAddress, setEventAddress] = React.useState('');

  useEffect(() => {
    if (!pinsLoading) {
      const eventPin = pinsInfo.pinsForEvent.filter(
        (pin) => pin.pinType === PinType.EVENT && pin.eventId.id === eventId
      );
      if (eventPin && eventPin.length > 0) {
        setEventAddress(eventPin[0].address);
      } else {
        setEventAddress('N/A');
      }
    }
  }, [pinsInfo, eventId, pinsLoading]);

  if (eventLoading || pinsLoading) {
    return <LoadingState />;
  }

  const { event } = eventInfo;

  const handleChange = (event: React.ChangeEvent<{}>, newValue: TabOptions) => {
    setTab(newValue);
  };

  return (
    <Box className={classes.root}>
      <MenuAppBar pageTitle="Directory" eventId={eventId} selectedDirectory />
      <Container className={classes.container}>
        <Typography variant="h3">{event.name}</Typography>
        <Box
          display="flex"
          alignItems="center"
          style={{
            color: Colours.SecondaryGray,
          }}
        >
          <CalendarTodayOutlinedIcon className={classes.icon} />
          <Typography variant="body1" style={{ paddingRight: '52px' }}>
            {formatDate(event.eventDate)}
          </Typography>
          <LocationOnOutlinedIcon className={classes.icon} />
          <Typography variant="body1">{eventAddress}</Typography>
        </Box>
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
