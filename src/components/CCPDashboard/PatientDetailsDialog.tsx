import React from 'react';
import {
  Typography,
  Box,
  Grid,
  makeStyles,
  DialogContent,
  IconButton,
  TextField,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Colours } from '../../styles/Constants';
import { statusLabels } from './PatientInfoTable';
import { Patient } from '../../graphql/queries/patients';
import { capitalize, formatLastUpdated } from '../../utils/format';

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
    { label: 'Status', value: statusLabels[patient.status] },
    {
      label: 'Triage',
      value: patient.triageLevel,
    },
    {
      label: 'CTAS',
      value: patient.ctas,
    },
    { label: 'Run Number', value: patient.runNumber },
    { label: 'Hospital', value: patient.hospitalId?.name },
    { label: 'Ambulance Number', value: patient.ambulanceId?.vehicleNumber },
    { label: 'CCP', value: patient.collectionPointId.name },
    { label: 'Gender', value: patient.gender },
    { label: 'Age', value: patient.age },
    {
      label: 'Last Edited',
      value: formatLastUpdated(patient.updatedAt, true),
    },
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
      <Grid container>
        {patientDetails.map((d: PatientDetail) => (
          <Grid container direction="row" key={d.label}>
            <Grid item xs={5} style={{ marginBottom: '24px' }}>
              <Typography
                variant="body2"
                color="textSecondary"
                className={classes.label}
              >
                {`${d.label}:`}
              </Typography>
            </Grid>
            <Grid item xs={7}>
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
            </Grid>
          </Grid>
        ))}
      </Grid>
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
