import React from "react";
import { Box, Typography, makeStyles, Card } from "@material-ui/core";

const useStyles = makeStyles({
  card: {
    padding: "24px",
    marginTop: "16px",
    marginRight: "24px",
    height: "100%",
  },
});

export const TotalPatientCard = ({ numPatients }: { numPatients: number }) => {
  const classes = useStyles();

  return (
    <Card variant="outlined" className={classes.card}>
      <Box display="flex" alignItems="baseline">
        <Typography
          variant="h3"
          color="textPrimary"
          style={{ marginRight: "16px" }}
        >
          {numPatients}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          total patients
        </Typography>
      </Box>
    </Card>
  );
};
