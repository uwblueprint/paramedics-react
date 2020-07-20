import React from "react";
import { Colours } from "../../styles/Constants";
import { Box, Tabs, Tab, makeStyles } from "@material-ui/core";
import { RouteComponentProps } from "react-router";
import { useAllPatients } from "../../graphql/queries/hooks/patients";
import { useQuery } from "@apollo/react-hooks";
import {
  FETCH_ALL_PATIENTS,
  Patient,
  Status,
} from "../../graphql/queries/patients";
import { PatientOverview } from "./PatientOverview";
import { HospitalOverview } from "./HospitalOverview";
import LoadingState from "../common/LoadingState";

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
  className?: string;
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    background: Colours.BackgroundGray,
  },
  tabPanel: {
    paddingLeft: "56px",
    paddingRight: "56px",
  },
  tabs: {
    background: Colours.White,
    padding: "0 56px",
  },
  fullHeightGridItem: {
    display: "flex",
    alignSelf: "stretch",
  },
  card: {
    padding: "24px",
    marginTop: "16px",
    marginRight: "24px",
    height: "100%",
  },
  categoryTableCard: {
    display: "flex",
    alignItems: "center",
    paddingRight: "44px",
    paddingLeft: "44px",
    marginTop: "16px",
  },
  lightBorder: {
    borderColor: Colours.BackgroundGray,
  },
  noBorder: {
    border: 0,
  },
  cellWithIcon: {
    display: "flex",
    alignItems: "center",
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
  // Should switch to fetching patients from cache
  const { data, loading } = useQuery(FETCH_ALL_PATIENTS);
  const allPatients: Array<Patient> = data ? data.patients : [];
  const patients = React.useMemo(
    () =>
      allPatients.filter(
        (patient: Patient) => patient.collectionPointId.id === ccpId
      ),
    [allPatients, ccpId]
  );

  const [tab, setTab] = React.useState(TabOptions.PatientOverview);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: TabOptions) => {
    setTab(newValue);
  };

  const transportPatients = React.useMemo(
    () =>
      patients.filter(
        (patient: Patient) => patient.status === Status.TRANSPORTED
      ),
    [patients]
  );

  if (loading) {
    return <LoadingState />;
  } else {
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
        <TabPanel
          value={tab}
          index={TabOptions.PatientOverview}
          className={classes.tabPanel}
        >
          <PatientOverview
            eventId={eventId}
            ccpId={ccpId}
            patients={patients}
          />
        </TabPanel>
        <TabPanel
          value={tab}
          index={TabOptions.Hospital}
          className={classes.tabPanel}
        >
          <HospitalOverview
            eventId={eventId}
            ccpId={ccpId}
            patients={transportPatients}
          />
        </TabPanel>
      </Box>
    );
  }
};

export default CCPDashboardPage;
