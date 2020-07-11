import React from "react";
import MenuAppBar from "../common/MenuAppBar";
import { Colours } from "../../styles/Constants";
import { Box, Tabs, Tab, makeStyles, Button } from "@material-ui/core";
import { RouteComponentProps } from "react-router";
import { useAllPatients } from "../../graphql/queries/hooks/patients";
import { PatientOverview } from "./PatientOverview";
import { ScanIcon } from "../common/ScanIcon";

type TParams = { eventId: string; ccpId: string };

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
    minHeight: "100vh",
    background: Colours.BackgroundGray,
  },
  container: {
    background: Colours.White,
    padding: "32px 56px 0 56px",
    maxWidth: "none",
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
  icon: {
    marginRight: "9px",
  },
  patientTableCard: {
    marginTop: "24px",
    marginBottom: "145px",
  },
  scanButton: {
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
    borderRadius: "2000px",
    position: "fixed",
    bottom: "56px",
    right: "56px",
    padding: "12px 26px",
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
      <MenuAppBar pageTitle="Directory" eventId={eventId} />
      <Tabs className={classes.tabs} value={tab} onChange={handleChange}>
        <Tab
          label="Patient Overview"
          id={`tab-${TabOptions.PatientOverview}`}
        />
        <Tab label="Hospital" id={`tab-${TabOptions.Hospital}`} />
      </Tabs>
      <TabPanel value={tab} index={TabOptions.PatientOverview}>
        <PatientOverview eventId={eventId} ccpId={ccpId} />
      </TabPanel>
      <TabPanel value={tab} index={TabOptions.Hospital}></TabPanel>

      <Button
        className={classes.scanButton}
        variant="contained"
        color="secondary"
      >
        <ScanIcon colour={Colours.White} classes={classes.icon} />
        Scan Patient
      </Button>
    </Box>
  );
};

export default CCPDashboardPage;
