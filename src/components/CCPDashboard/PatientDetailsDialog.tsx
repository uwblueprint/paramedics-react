import React from "react";
import { Colours } from "../../styles/Constants";
import {
  Typography,
  Box,
  makeStyles,
  DialogContent,
  IconButton,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Patient } from "../../graphql/queries/templates/patients";
import { capitalize } from "../../utils/format";

const useStyles = makeStyles({
  label: {
    marginRight: "16px",
  },
  detailsDialog: {
    width: "662px",
  },
  closeButton: {
    position: "absolute",
    top: "6px",
    right: "6px",
    color: Colours.Black,
  },
});

interface PatientDetailsDialogProps {
  patient: Patient;
  onClose: () => void;
}

interface PatientDetail {
  label: string;
  value: string | number;
  styles?: object;
}

export const PatientDetailsDialog = (props: PatientDetailsDialogProps) => {
  const { patient, onClose } = props;
  const classes = useStyles();
  const patientDetails: PatientDetail[] = [
    { label: "Barcode Number", value: patient.barcodeValue },
    {
      label: "Triage",
      value: patient.triageLevel,
      styles: { color: Colours[`Triage${capitalize(patient.triageLevel)}`] },
    },
    { label: "Run Number", value: patient.runNumber },
    { label: "Status", value: patient.status },
    {
      label: "Casualty Collection Point",
      value: patient.collectionPointId.name,
    },
  ];

  return (
    <DialogContent
      className={classes.detailsDialog}
      style={{
        borderLeft: `16px solid ${
          Colours[`Triage${capitalize(patient.triageLevel)}`]
        }`,
      }}
    >
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={onClose}
      >
        <Close />
      </IconButton>
      {patientDetails.map((d: PatientDetail) => (
        <Box display="flex" marginBottom="24px" key={d.label}>
          <Typography
            variant="body2"
            color="textSecondary"
            className={classes.label}
          >
            {`${d.label}:`}
          </Typography>
          <Typography variant="body1" style={d.styles}>
            {d.value}
          </Typography>
        </Box>
      ))}
      <Box display="flex" marginBottom="24px">
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.label}
        >
          Gender:
        </Typography>
        <Typography variant="body2" style={{ marginRight: "56px" }}>
          {patient.gender}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.label}
        >
          Age:
        </Typography>
        <Typography variant="body2">{patient.age}</Typography>
      </Box>
      <Box display="flex" marginBottom="24px">
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.label}
        >
          Notes:
        </Typography>
        <Typography variant="body2">{patient.notes}</Typography>
      </Box>
    </DialogContent>
  );
};
