import React from "react";
import { Colours } from "../../styles/Constants";
import {
  Typography,
  Box,
  makeStyles,
  Dialog,
  DialogContent,
} from "@material-ui/core";
import {
  Patient,
  TriageLevel,
  Status,
} from "../../graphql/queries/templates/patients";

export const PatientDetailsDialog = ({ patient }) => {
  return (
    <DialogContent>
      <Box>
        <Typography variant="body2">Barcode Number:</Typography>
        <Typography variant="body1">{patient.barcodeValue}</Typography>
      </Box>
      <Typography variant="body2">Triage:</Typography>
      <Typography variant="body1">{patient.triageLevel}</Typography>
    </DialogContent>
  );
};
