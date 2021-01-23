import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  makeStyles,
  Typography,
  IconButton,
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { useHistory, useLocation } from 'react-router-dom';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import { useAllPatients } from '../../graphql/queries/hooks/patients';
import { Colours } from '../../styles/Constants';
import {
  GET_ALL_PATIENTS,
  Patient,
  Status,
} from '../../graphql/queries/patients';
import { PatientOverview } from './PatientOverview';
import { HospitalOverview } from './HospitalOverview';
import LoadingState from '../common/LoadingState';
import MenuAppBar from '../common/MenuAppBar';
import { GET_PINS_BY_EVENT_ID, PinType } from '../../graphql/queries/maps';
import {
  PATIENT_ADDED,
  PATIENT_UPDATED,
  PATIENT_DELETED,
} from '../../graphql/subscriptions/patients';
import { GET_CCPS_BY_EVENT_ID } from '../../graphql/queries/ccps';
import { GET_NETWORK_STATUS } from '../../graphql/apollo/client';
import {
  SUBSCRIPTION_UPDATE_PATIENT,
  SUBSCRIPTION_DELETE_PATIENT,
} from '../../graphql/fragments/patients';

export enum CCPDashboardTabOptions {
  PatientOverview = 0,
  Hospital = 1,
}

export const CCPDashboardTabMap = {
  [CCPDashboardTabOptions.PatientOverview]: 'patientOverview',
  [CCPDashboardTabOptions.Hospital]: 'hospital',
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: CCPDashboardTabOptions;
  className?: string;
}
type LocationState = { userUpdatedPatientId: string | null };

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    background: Colours.BackgroundGray,
  },
  tabPanel: {
    padding: '0 56px',
  },
  tabs: {
    background: Colours.White,
    padding: '0 56px',
  },
  fullHeightGridItem: {
    display: 'flex',
    alignSelf: 'stretch',
  },
  card: {
    padding: '24px',
    marginTop: '16px',
    marginRight: '24px',
    height: '100%',
  },
  categoryTableCard: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: '44px',
    paddingLeft: '44px',
    marginTop: '16px',
  },
  connected: {
    position: 'absolute',
    right: '80px',
  },
  lightBorder: {
    borderColor: Colours.BackgroundGray,
  },
  noBorder: {
    border: 0,
  },
  cellWithIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  menuBarTitle: {
    display: 'inline-block',
  },
  locationIcon: {
    fontSize: '20px',
    verticalAlign: 'middle',
    marginLeft: '16px',
  },
  refreshButton: {
    position: 'absolute',
    right: '16px',
    padding: 0,
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

const CCPDashboardPage = ({
  match,
  tab,
}: {
  match: {
    params: {
      eventId: string;
      ccpId: string;
      patientId?: string;
    };
  };
  tab: CCPDashboardTabOptions;
}) => {
  const classes = useStyles();
  const history = useHistory();
  const highlightDuration = 5000; // seconds
  const { eventId, ccpId, patientId } = match.params;
  const location = useLocation<LocationState>();
  const { userUpdatedPatientId } = location.state || {
    userUpdatedPatientId: '',
  };
  const [lastUpdatedPatient, setLastUpdatedPatient] = React.useState('');
  const [
    lastUpdatedPatientTimeout,
    setLastUpdatedPatientTimeout,
  ] = React.useState<NodeJS.Timeout>(setTimeout(() => {}, 0));
  const [ccpAddress, setCCPAddress] = React.useState('');

  const { data: connectionData } = useQuery(GET_NETWORK_STATUS);

  // TO DO: error handling when eventId or ccpId does not exist in database
  // Fetch events from backend
  useAllPatients(eventId, connectionData.networkStatus);

  // Clear the userUpdatedPatientId in location state now that it's been used
  window.history.pushState(
    {
      ...location.state,
      userUpdatedPatientId: null,
    },
    ''
  );

  // Should switch to fetching patients from cache

  const { data, loading } = useQuery(GET_ALL_PATIENTS);

  const { data: ccpInfo, loading: ccpLoading } = useQuery(
    GET_CCPS_BY_EVENT_ID,
    {
      variables: { eventId },
    }
  );

  const allPatients: Array<Patient> = data ? data.patients : [];
  const patients = React.useMemo(
    () =>
      allPatients.filter(
        (patient: Patient) => patient.collectionPointId.id === ccpId
      ),
    [allPatients, ccpId]
  );

  const { data: pinsInfo, loading: pinsLoading } = useQuery(
    GET_PINS_BY_EVENT_ID,
    {
      variables: { eventId },
    }
  );

  const highlightPatient = React.useCallback((id) => {
    setLastUpdatedPatient(id);
    const highlightTimeout = setTimeout(() => {
      setLastUpdatedPatient('');
    }, highlightDuration);
    setLastUpdatedPatientTimeout(highlightTimeout);
  }, []);

  // If a new update is detected, cleans up old highlight
  React.useEffect(() => {
    return () => {
      clearTimeout(lastUpdatedPatientTimeout);
    };
  }, [lastUpdatedPatientTimeout]);

  // First highlight if coming from Add/Edit Patient page
  React.useEffect(() => {
    if (userUpdatedPatientId) highlightPatient(userUpdatedPatientId);
  }, [userUpdatedPatientId, highlightPatient]);

  React.useEffect(() => {
    if (!pinsLoading) {
      const ccpPin = pinsInfo.pinsForEvent.filter(
        (pin) => pin.pinType === PinType.CCP && pin.ccpId.id === ccpId
      )[0];
      if (ccpPin) {
        setCCPAddress(ccpPin.address);
      } else {
        setCCPAddress('N/A');
      }
    }
  }, [pinsInfo, ccpId, pinsLoading]);

  useSubscription(PATIENT_UPDATED, {
    variables: { eventId },
    onSubscriptionData: ({ client, subscriptionData: { data } }) => {
      highlightPatient(data.patientUpdated.id);
      client.writeFragment({
        id: `Patient:${data.patientUpdated.id}`,
        fragment: SUBSCRIPTION_UPDATE_PATIENT,
        data: data.patientUpdated,
      });
    },
  });

  useSubscription(PATIENT_ADDED, {
    variables: { eventId },
    onSubscriptionData: ({ client, subscriptionData: { data } }) => {
      highlightPatient(data.patientAdded.id);
      client.writeQuery({
        query: GET_ALL_PATIENTS,
        data: {
          patients: [...allPatients, data.patientAdded],
        },
      });
    },
  });

  useSubscription(PATIENT_DELETED, {
    variables: { eventId },
    onSubscriptionData: ({ client, subscriptionData: { data } }) => {
      highlightPatient(data.patientDeleted.id);
      client.writeFragment({
        id: `Patient:${data.patientDeleted.id}`,
        fragment: SUBSCRIPTION_DELETE_PATIENT,
        data: data.patientDeleted,
      });
    },
  });

  const [selectedTab, setSelectedTab] = React.useState(
    tab || CCPDashboardTabOptions.PatientOverview
  );

  const handleChange = (
    event: React.ChangeEvent<{}>,
    newValue: CCPDashboardTabOptions
  ) => {
    history.push(
      `/events/${eventId}/ccps/${ccpId}/${CCPDashboardTabMap[newValue]}`
    );
    setSelectedTab(newValue);
  };

  const transportPatients = React.useMemo(
    () =>
      patients.filter(
        (patient: Patient) => patient.status === Status.TRANSPORTED
      ),
    [patients]
  );

  if (loading || ccpLoading || pinsLoading) {
    return <LoadingState />;
  }

  const currentCcp = ccpInfo.collectionPointsByEvent.find(
    (x) => x.id === ccpId
  );

  const menuBarTitle = (
    <>
      {currentCcp.name}
      <div className={classes.menuBarTitle}>
        <LocationOnOutlinedIcon className={classes.locationIcon} />
        <Typography variant="caption" className={classes.menuBarTitle}>
          {ccpAddress}
        </Typography>
        <Typography variant="caption" className={classes.connected}>
          {connectionData.networkStatus}
        </Typography>
        <IconButton
          className={classes.refreshButton}
          onClick={() => {
            window.location.reload();
          }}
        >
          <RefreshIcon style={{ color: Colours.White }} />
        </IconButton>
      </div>
    </>
  );

  return (
    <Box className={classes.root}>
      <MenuAppBar
        pageTitle={menuBarTitle}
        eventId={eventId}
        selectedCcp={ccpId}
      />
      <Tabs
        className={classes.tabs}
        value={selectedTab}
        onChange={handleChange}
        textColor="secondary"
      >
        <Tab
          label="Patient Overview"
          id={`tab-${CCPDashboardTabOptions.PatientOverview}`}
        />
        <Tab label="Hospital" id={`tab-${CCPDashboardTabOptions.Hospital}`} />
      </Tabs>
      <TabPanel
        value={selectedTab}
        index={CCPDashboardTabOptions.PatientOverview}
        className={classes.tabPanel}
      >
        <PatientOverview
          eventId={eventId}
          ccpId={ccpId}
          patients={patients}
          lastUpdatedPatient={lastUpdatedPatient}
          patientId={patientId}
        />
      </TabPanel>
      <TabPanel
        value={selectedTab}
        index={CCPDashboardTabOptions.Hospital}
        className={classes.tabPanel}
      >
        <HospitalOverview
          eventId={eventId}
          ccpId={ccpId}
          patients={transportPatients}
          lastUpdatedPatient={lastUpdatedPatient}
          patientId={patientId}
        />
      </TabPanel>
    </Box>
  );
};

export default CCPDashboardPage;
