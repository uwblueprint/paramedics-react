import React from 'react';
import { Box, Tabs, Tab, makeStyles } from '@material-ui/core';
import { RouteComponentProps } from 'react-router';
import { useAllPatients } from '../../graphql/queries/hooks/patients';
import { PatientOverview } from './PatientOverview';
import { Colours } from '../../styles/Constants';

interface TParams {
  eventId: string;
  ccpId: string;
}

export enum TabOptions {
  PatientOverview = 0,
  Hospital = 1,
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
    padding: '32px 56px 0 56px',
    maxWidth: 'none',
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
  const { eventId, ccpId } = match.params;
  // TO DO: error handling when eventId or ccpId does not exist in database
  // Fetch events from backend
  useAllPatients();

  const [tab, setTab] = React.useState(TabOptions.PatientOverview);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: TabOptions) => {
    setTab(newValue);
  };

  return (
    <Box className={classes.root}>
      <Tabs
        className={classes.tabs}
        value={tab}
        onChange={handleChange}
        textColor="secondary"
      >
        <Tab
          label="Patient Overview"
          id={`tab-${TabOptions.PatientOverview}`}
        />
        <Tab label="Hospital" id={`tab-${TabOptions.Hospital}`} />
      </Tabs>
      <TabPanel value={tab} index={TabOptions.PatientOverview}>
        <PatientOverview eventId={eventId} ccpId={ccpId} />
      </TabPanel>
      <TabPanel value={tab} index={TabOptions.Hospital} />
    </Box>
  );
};

export default CCPDashboardPage;