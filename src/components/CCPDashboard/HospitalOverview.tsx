import React from "react";
import { makeStyles, Card, Grid } from "@material-ui/core";
import { Patient, TriageLevel, Status } from "../../graphql/queries/patients";
import { PatientInfoTable } from "./PatientInfoTable";
import { TotalPatientCard } from "./TotalPatientCard";
import { TriageCard } from "./TriageCard";

interface HospitalOverviewProps {
  eventId: string;
  ccpId: string;
  patients: Patient[];
}

const useStyles = makeStyles({
  patientTableCard: {
    marginTop: "24px",
    marginBottom: "145px",
  },
});

export const HospitalOverview = (props: HospitalOverviewProps) => {
  const { patients } = props;
  const classes = useStyles();

  return (
    <>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item>
          <TotalPatientCard numPatients={patients.length} />
        </Grid>
        <Grid item>
          <TriageCard patients={patients} />
        </Grid>
      </Grid>
      <Card variant="outlined" className={classes.patientTableCard}>
        <PatientInfoTable patients={patients} />
      </Card>
    </>
  );
};
