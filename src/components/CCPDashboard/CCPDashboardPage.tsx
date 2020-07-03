import React from "react";
import clsx from "clsx";
import MenuAppBar from "../common/MenuAppBar";
import { Colours } from "../../styles/Constants";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  makeStyles,
  Card,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
} from "@material-ui/core";
import {
  AddLocationOutlined,
  AirportShuttleOutlined,
  ArrowForwardOutlined,
} from "@material-ui/icons";
import { RouteComponentProps } from "react-router";
import { useQuery } from "@apollo/react-hooks";
import { useAllPatients } from "../../graphql/queries/hooks/patients";
import {
  GET_ALL_PATIENTS,
  Patient,
  TriageLevel,
  Status,
} from "../../graphql/queries/templates/patients";

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

interface TriageTagProps {
  colour: Colours;
  triageLevel: TriageLevel;
  label: string;
  count: number;
}

interface TableRow {
  icon: React.ReactChild;
  category: string;
  count: number;
  ratio: number;
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
  tableCard: {
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
    marginRight: "12px",
  },
});

const useTriageTagStyles = makeStyles({
  root: {
    boxSizing: "border-box",
    backgroundColor: Colours.BackgroundGray,
    borderRadius: "0 8px 8px 0",
    height: "96px",
    width: "88px",
    marginRight: "25px",
    "&:last-child": { marginRight: 0 },
    padding: "16px",
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

const TriageTag = (props: TriageTagProps) => {
  const classes = useTriageTagStyles();
  const { colour, triageLevel, count, label } = props;

  return (
    <Box className={classes.root} style={{ borderLeft: `8px solid ${colour}` }}>
      <Typography variant="body2" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="h4">{count}</Typography>
    </Box>
  );
};

const CCPDashboardPage = ({ match }: RouteComponentProps<TParams>) => {
  const classes = useStyles();
  const { eventId, ccpId } = match.params;
  // TO DO: error handling when eventId or ccpId does not exist in database
  // Fetch events from backend
  useAllPatients();

  // Fetch events from cache
  const { data } = useQuery(GET_ALL_PATIENTS);
  const allPatients: Array<Patient> = data ? data.patients : [];
  const patients = allPatients.filter(
    (patient: Patient) => patient.collectionPointId.id == parseInt(ccpId)
  );

  const [tab, setTab] = React.useState(TabOptions.PatientOverview);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: TabOptions) => {
    setTab(newValue);
  };

  const createCategoryData = (
    icon: React.ReactChild,
    category: string,
    status: Status
  ): TableRow => {
    const count = patients.filter(
      (patient: Patient) => patient.status === status
    ).length;
    const ratio = (count / patients.length) * 100;
    return {
      icon,
      category,
      count,
      ratio,
    };
  };

  const categoryTableRows: TableRow[] = [
    createCategoryData(
      <AddLocationOutlined className={classes.icon} />,
      "On Scene",
      Status.ON_SITE
    ),
    createCategoryData(
      <AirportShuttleOutlined className={classes.icon} />,
      "Transported",
      Status.TRANSPORTED
    ),
    createCategoryData(
      <ArrowForwardOutlined className={classes.icon} />,
      "Released",
      Status.RELEASED
    ),
    createCategoryData(
      <AddLocationOutlined className={classes.icon} />,
      "Omitted/Deleted",
      Status.RELEASED
    ),
  ];

  const triageLevels = [
    {
      colour: Colours.TriageGreen,
      triageLevel: TriageLevel.GREEN,
      label: "Green",
    },
    {
      colour: Colours.TriageYellow,
      triageLevel: TriageLevel.YELLOW,
      label: "Yellow",
    },
    { colour: Colours.TriageRed, triageLevel: TriageLevel.RED, label: "Red" },
    { colour: Colours.Black, triageLevel: TriageLevel.BLACK, label: "Black" },
    {
      colour: Colours.BorderLightGray,
      triageLevel: TriageLevel.WHITE,
      label: "White",
    },
  ];

  const noBorderLastRow = (index) =>
    clsx({
      [classes.lightBorder]: true,
      [classes.noBorder]: index === categoryTableRows.length - 1,
    });

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
      <TabPanel value={tab} index={TabOptions.PatientOverview}></TabPanel>
      <TabPanel value={tab} index={TabOptions.Hospital}></TabPanel>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid direction="column">
          <Grid item>
            <Card variant="outlined" className={classes.card}>
              <Box display="flex" alignItems="baseline">
                <Typography
                  variant="h3"
                  color="textPrimary"
                  style={{ marginRight: "16px" }}
                >
                  {patients.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  total patients
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item>
            <Card variant="outlined" className={classes.card}>
              <Typography variant="body1" style={{ marginBottom: "16px" }}>
                CCP triage:
              </Typography>
              <Grid container direction="row">
                {triageLevels.map((level) => {
                  const count = patients.filter(
                    (patient: Patient) =>
                      patient.triageLevel === level.triageLevel
                  ).length;
                  return (
                    <TriageTag
                      key={level.triageLevel}
                      colour={level.colour}
                      triageLevel={level.triageLevel}
                      label={level.label}
                      count={count}
                    />
                  );
                })}
              </Grid>
            </Card>
          </Grid>
        </Grid>
        <Grid item className={classes.fullHeightGridItem}>
          <Card variant="outlined" className={classes.tableCard}>
            <Typography variant="body1">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1" color="textSecondary">
                        Category
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" color="textSecondary">
                        Count
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" color="textSecondary">
                        Ratio
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                {categoryTableRows.map((row: TableRow, index) => (
                  <TableRow key={row.category}>
                    <TableCell
                      className={clsx({
                        [classes.cellWithIcon]: true,
                        [classes.lightBorder]: true,
                        [classes.noBorder]:
                          index === categoryTableRows.length - 1,
                      })}
                      component="th"
                      scope="row"
                    >
                      {row.icon}
                      <Typography variant="body2" color="textPrimary">
                        {row.category}
                      </Typography>
                    </TableCell>
                    <TableCell className={noBorderLastRow(index)} align="right">
                      <Typography variant="body1" color="textPrimary">
                        {row.count}
                      </Typography>
                    </TableCell>
                    <TableCell className={noBorderLastRow(index)} align="right">
                      <Typography
                        variant="body1"
                        color="textSecondary"
                      >{`${row.ratio}%`}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CCPDashboardPage;
