import React from 'react';
import {
  Typography,
  Box,
  makeStyles,
  DialogContent,
  IconButton,
  TextField,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Colours } from '../../styles/Constants';
import { Patient } from '../../graphql/queries/patients';
import { capitalize } from '../../utils/format';

const useStyles = makeStyles({
  label: {
    marginRight: '16px',
  },
  closeButton: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    color: Colours.Black,
  },
  editButton: {
    marginRight: '14px',
    marginBottom: '12px',
  },
  detailsDialog: {
    width: '662px',
  },
});

interface PatientDetail {
  label: string;
  value: string | number;
  styles?: object;
}

interface PatientDetailsDialogProps {
  patient: Patient;
  handleCloseDetails: () => void;
  runNumber: number | null;
  updateRunNumber: (runNumber: number) => void;
}

export const PatientDetailsDialog = (props: PatientDetailsDialogProps) => {
  const { patient, runNumber, updateRunNumber, handleCloseDetails } = props;

  const classes = useStyles();

  const patientDetails: PatientDetail[] = [
    { label: 'Barcode Number', value: patient.barcodeValue },
    {
      label: 'Triage',
      value: patient.triageLevel,
      styles: {
        color: Colours[`Triage${capitalize(patient.triageLevel)}`],
      },
    },
    { label: 'Run Number', value: patient.runNumber },
    { label: 'Hospital', value: patient.hospitalId?.name },
    { label: 'CCP', value: patient.collectionPointId.name },
    { label: 'Status', value: patient.status },
    { label: 'Gender', value: patient.gender },
    { label: 'Age', value: patient.age },
  ];

  return (
    <DialogContent
      style={{
        borderLeft: `16px solid ${
          Colours[`Triage${capitalize(patient.triageLevel)}`]
        }`,
      }}
    >
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={handleCloseDetails}
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
          {d.label === 'Run Number' ? (
            <TextField
              type="number"
              onChange={(e: any) => updateRunNumber(e.target.value)}
              value={runNumber === null ? '' : runNumber}
            />
          ) : (
            <Typography variant="body1" style={d.styles}>
              {d.value}
            </Typography>
          )}
        </Box>
      ))}
      <Box display="flex" flexDirection="column" marginBottom="12px">
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
