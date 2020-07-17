import React from "react";
import { Colours } from "../../styles/Constants";
import { makeStyles, Card, Grid, Typography } from "@material-ui/core";
import { Patient, TriageLevel } from "../../graphql/queries/patients";
import { TriageTag } from "./TriageTag";

const useStyles = makeStyles({
  card: {
    padding: "24px",
    marginTop: "16px",
    marginRight: "24px",
    height: "100%",
  },
});

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

export const TriageCard = ({ patients }: { patients: Patient[] }) => {
  const classes = useStyles();
  return (
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
            (patient: Patient) => patient.triageLevel === level.triageLevel
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
  );
};
