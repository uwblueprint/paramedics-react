import React from 'react';
import { Box, Tabs, Tab, makeStyles, Typography } from '@material-ui/core';
import { RouteComponentProps } from 'react-router';
import { useQuery } from '@apollo/react-hooks';
import { useAllPatients } from '../../graphql/queries/hooks/patients';
import { GET_CCP_BY_ID } from '../../graphql/queries/ccps';
import { Colours } from '../../styles/Constants';
import {
  GET_ALL_PATIENTS,
  Patient,
  Status,
} from '../../graphql/queries/patients';
import { CCPRealtime } from './CCPRealtime';
import { PatientOverview } from './PatientOverview';
import { HospitalOverview } from './HospitalOverview';
import LoadingState from '../common/LoadingState';
import MenuAppBar from '../common/MenuAppBar';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';

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

const CCPDashboardPage = ({ match }: RouteComponentProps<TParams>) => {
  const classes = useStyles();
  const { eventId, ccpId, patientId } = match.params;
  // TO DO: error handling when eventId or ccpId does not exist in database
  // Fetch events from backend
  useAllPatients();
  // Should switch to fetching patients from cache

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
      <CCPRealtime collectionPointId={ccpId} />

      <TabPanel
        value={tab}
        index={CCPDashboardTabOptions.PatientOverview}
        className={classes.tabPanel}
      >
        <PatientOverview
          eventId={eventId}
          ccpId={ccpId}
          patients={patients}
          patientId={patientId}
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
          patientId={patientId}
        />
      </TabPanel>
    </Box>
  );
};

export default CCPDashboardPage;
