import React from "react";
import clsx from "clsx";
import { Colours } from "../../styles/Constants";
import {
  Box,
  Typography,
  makeStyles,
  Card,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { useQuery } from "@apollo/react-hooks";
import {
  FETCH_ALL_PATIENTS,
  Patient,
  TriageLevel,
  Status,
} from "../../graphql/queries/patients";
import { TriageTag } from "./TriageTag";
import { PatientInfoTable } from "./PatientInfoTable";
import { ScanPatientButton } from "./ScanPatientButton";
import LoadingState from "../common/LoadingState";

interface PatientOverviewProps {
  eventId: string;
  ccpId: string;
}

interface TableRowData {
  category: string;
  count: number;
  ratio: number;
}

const useStyles = makeStyles({
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

export const PatientOverview = (props: PatientOverviewProps) => {
  const classes = useStyles();

  const { ccpId } = props;

  // Should switch to fetching patients from cache
  const { data, loading } = useQuery(FETCH_ALL_PATIENTS);
  const allPatients: Array<Patient> = data ? data.patients : [];
  const patients = allPatients.filter(
    (patient: Patient) => patient.collectionPointId.id === ccpId
  );

  const createCategoryData = (
    category: string,
    status: Status
  ): TableRowData => {
    const count = patients.filter(
      (patient: Patient) => patient.status === status
    ).length;
    const ratio = Math.round((count / patients.length) * 100) || 0;
    return {
      category,
      count,
      ratio,
    };
  };

  const categoryTableRows: TableRowData[] = [
    createCategoryData("On Scene", Status.ON_SITE),
    createCategoryData("Transported", Status.TRANSPORTED),
    createCategoryData("Released", Status.RELEASED),
    createCategoryData("Omitted/Deleted", Status.DELETED),
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
      colour: Colours.TriageWhite,
      triageLevel: TriageLevel.WHITE,
      label: "White",
    },
  ];

  const noBorderLastRow = (index) =>
    clsx({
      [classes.lightBorder]: true,
      [classes.noBorder]: index === categoryTableRows.length - 1,
    });

  if (loading) {
    return <LoadingState />;
  } else {
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid>
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
              <Typography
                variant="body1"
                color="textSecondary"
                style={{ marginBottom: "16px" }}
              >
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
          <Card variant="outlined" className={classes.categoryTableCard}>
            <TableContainer>
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
                <TableBody>
                  {categoryTableRows.map((row: TableRowData, index) => (
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
                        <Typography variant="body2" color="textPrimary">
                          {row.category}
                        </Typography>
                      </TableCell>
                      <TableCell
                        className={noBorderLastRow(index)}
                        align="right"
                      >
                        <Typography variant="body1" color="textPrimary">
                          {row.count}
                        </Typography>
                      </TableCell>
                      <TableCell
                        className={noBorderLastRow(index)}
                        align="right"
                      >
                        <Typography
                          variant="body1"
                          color="textSecondary"
                        >{`${row.ratio}%`}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
        <Card variant="outlined" className={classes.patientTableCard}>
          <PatientInfoTable patients={patients} />
        </Card>
        <ScanPatientButton />
      </Grid>
    );
  }
};
