import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  makeStyles,
  Typography,
  IconButton,
  Badge,
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { RouteComponentProps } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import gql from 'graphql-tag';
import { useAllPatients } from '../../graphql/queries/hooks/patients';
import { GET_CCP_BY_ID } from '../../graphql/queries/ccps';
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
import {
  PATIENT_ADDED,
  PATIENT_UPDATED,
} from '../../graphql/subscriptions/patients';

interface TParams {
  eventId: string;
  ccpId: string;
  patientId?: string;
}

export enum CCPDashboardTabOptions {
  PatientOverview = 0,
  Hospital = 1,
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: CCPDashboardTabOptions;
  className?: string;
}

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    background: Colours.BackgroundGray,
  },
  tabPanel: {
    paddingLeft: '56px',
    paddingRight: '56px',
  },
  tabs: {
    background: Colours.White,
    padding: '0 165px',
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

type LocationState = { numUpdates: number };

const CCPDashboardPage = ({ match }: RouteComponentProps<TParams>) => {
  const classes = useStyles();
  const location = useLocation<LocationState>();

  const { eventId, ccpId, patientId } = match.params;
  const { numUpdates } = location.state || { numUpdates: 0 };

  const [lastNumUpdates, setLastNumUpdates] = React.useState(numUpdates);
  const [lastUpdatedPatient, setLastUpdatedPatient] = React.useState("");
  // TO DO: error handling when eventId or ccpId does not exist in database
  // Fetch events from backend
  useAllPatients();
  // Should switch to fetching patients from cache

  window.history.pushState(
    {
      ...location.state,
      numUpdates: 0,
    },
    ''
  );

  const { data, loading } = useQuery(GET_ALL_PATIENTS);
  const { loading: ccpLoading, data: ccpInfo } = useQuery(GET_CCP_BY_ID, {
    variables: { id: ccpId },
  });

  const allPatients: Array<Patient> = data ? data.patients : [];
  const patients = React.useMemo(
    () =>
      allPatients.filter(
        (patient: Patient) => patient.collectionPointId.id === ccpId
      ),
    [allPatients, ccpId]
  );

  useSubscription(PATIENT_UPDATED, {
    variables: { collectionPointId: ccpId },
    onSubscriptionData: ({ client, subscriptionData: { data } }) => {
      setLastNumUpdates(lastNumUpdates + 1);
      setLastUpdatedPatient(data.patientUpdated.id);
      client.writeFragment({
        id: `Patient:${data.patientUpdated.id}`,
        fragment: gql`
          fragment NewPatient on Patient {
            gender
            age
            runNumber
            barcodeValue
            triageLevel
            status
            notes
            updatedAt
            transportTime
            hospitalId {
              id
              name
            }
            ambulanceId {
              id
              vehicleNumber
            }
          }
        `,
        data: data.patientUpdated,
      });
    },
  });

  useSubscription(PATIENT_ADDED, {
    variables: { collectionPointId: ccpId },
    onSubscriptionData: ({ client, subscriptionData: { data } }) => {
      setLastNumUpdates(lastNumUpdates + 1);
      setLastUpdatedPatient(data.patientAdded.id);
      client.writeQuery({
        query: GET_ALL_PATIENTS,
        data: {
          patients: [...patients, data.patientAdded],
        },
      });
    },
  });

  const [tab, setTab] = React.useState(CCPDashboardTabOptions.PatientOverview);

  const handleChange = (
    event: React.ChangeEvent<{}>,
    newValue: CCPDashboardTabOptions
  ) => {
    setTab(newValue);
  };

  const transportPatients = React.useMemo(
    () =>
      patients.filter(
        (patient: Patient) => patient.status === Status.TRANSPORTED
      ),
    [patients]
  );

  if (loading || ccpLoading) {
    return <LoadingState />;
  }

  const currentCcp = ccpInfo.collectionPoint;

  const menuBarTitle = (
    <>
      {currentCcp.name}
      <div className={classes.menuBarTitle}>
        <LocationOnOutlinedIcon className={classes.locationIcon} />
        <Typography variant="caption" className={classes.menuBarTitle}>
          100 University
        </Typography>
        <IconButton
          className={classes.refreshButton}
          onClick={() => {
            window.location.reload();
          }}
        >
          <Badge
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            badgeContent={lastNumUpdates}
            color="error"
          >
            <RefreshIcon style={{ color: Colours.White }} />
          </Badge>
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
        value={tab}
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
        value={tab}
        index={CCPDashboardTabOptions.PatientOverview}
        className={classes.tabPanel}
      >
        <PatientOverview
          eventId={eventId}
          ccpId={ccpId}
          patients={patients}
          lastUpdatedPatient={lastUpdatedPatient}
          patientId={patientId}
          numUpdates={lastNumUpdates}
        />
      </TabPanel>
      <TabPanel
        value={tab}
        index={CCPDashboardTabOptions.Hospital}
        className={classes.tabPanel}
      >
        <HospitalOverview
          eventId={eventId}
          ccpId={ccpId}
          patients={transportPatients}
          lastUpdatedPatient={lastUpdatedPatient}
          patientId={patientId}
          numUpdates={lastNumUpdates}
        />
      </TabPanel>
    </Box>
  );
};

export default CCPDashboardPage;
