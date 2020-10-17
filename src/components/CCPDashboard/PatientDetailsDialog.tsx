import React, { useEffect } from 'react';
import {
  Typography,
  Box,
  makeStyles,
  DialogContent,
  IconButton,
  Dialog,
  DialogActions,
  Button,
  CircularProgress,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { Close } from '@material-ui/icons';
import { Colours } from '../../styles/Constants';
import { Patient, GET_PATIENT_BY_ID } from '../../graphql/queries/patients';
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

export const PatientDetailsDialog = ({
  match: {
    params: { eventId, patientId, ccpId },
  },
}: {
  match: {
    params: {
      eventId: string;
      patientId?: string;
      ccpId: string;
    };
  };
}) => {
  const [openDetails, setOpenDetails] = React.useState(true);

  const history = useHistory();
  const classes = useStyles();

  const { data, loading } = useQuery(GET_PATIENT_BY_ID(patientId as string));

  const [patient, setPatient] = React.useState({} as Patient);
  const [patientDetails, setPatientDetails] = React.useState(
    [] as PatientDetail[]
  );

  useEffect(() => {
    if (data) setPatient(data.patient);
    if (!loading && patient) {
      setPatientDetails([
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
      ] as PatientDetail[]);
    }
  });

  const handleCloseDetails = () => {
    setOpenDetails(false);
    history.push(`/events/${eventId}/ccps/${ccpId}`);
  };

  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : (
        <Dialog
          open={openDetails}
          onClose={handleCloseDetails}
          PaperProps={{ className: classes.detailsDialog }}
        >
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
                <Typography variant="body1" style={d.styles}>
                  {d.value}
                </Typography>
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
          <DialogActions
            style={{
              borderLeft: `16px solid ${
                Colours[`Triage${capitalize(patient.triageLevel)}`]
              }`,
            }}
          >
            <Button
              onClick={() => {
                history.push(
                  `/events/${eventId}/ccps/${ccpId}/patients/${patientId}`
                );
              }}
              color="secondary"
              className={classes.editButton}
            >
              Edit
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};
