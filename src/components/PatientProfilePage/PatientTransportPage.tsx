import React from 'react';
import {
  Typography,
  makeStyles,
  Button,
  Dialog,
  Link,
} from '@material-ui/core';
import HospitalTransportSelector from './HospitalTransportSelector';
import AmbulanceTransportSelector from './AmbulanceTransportSelector';
import { Colours } from '../../styles/Constants';
import { Patient } from '../../graphql/queries/patients';
import { Hospital } from '../../graphql/queries/hospitals';
import { Ambulance } from '../../graphql/queries/ambulances';

const useStyles = makeStyles({
  resourceWrapper: {
    backgroundColor: 'white',
  },
  resourceCreationTopSection: {
    margin: '48px 30px 0px 30px',
    backgroundColor: 'white',
    borderBottom: '1px solid #c4c4c4',
  },
  resourceHeader: {
    display: 'flex',
    padding: '16px 0px',
  },
  resourceForm: {
    padding: '30px',
  },
  caption: {
    marginBottom: '16px',
  },
  confirmButton: {
    minWidth: '160px',
    minHeight: '40px',
    fontSize: '18px',
    margin: '10px 0px 60px 0px',
    position: 'absolute',
    right: '56px',
  },
  cancelButton: {
    minWidth: '160px',
    minHeight: '40px',
    fontSize: '18px',
    marginTop: '90px',
    position: 'absolute',
    right: '56px',
  },
});

const PatientTransportPage = ({
  open,
  patient,
  handleClose,
  handleComplete,
  hospitals,
  ambulances,
  selectedHospital,
  selectedAmbulance,
  handleHospitalChange,
  handleAmbulanceChange,
}: {
  open: boolean;
  patient?: Patient;
  handleClose: () => void;
  handleComplete: () => void;
  hospitals: Array<Hospital>;
  ambulances: Array<Ambulance>;
  selectedHospital: string;
  selectedAmbulance: string;
  handleHospitalChange: (e: React.ChangeEvent<HTMLElement>) => void;
  handleAmbulanceChange: (e: React.ChangeEvent<HTMLElement>) => void;
}) => {
  const classes = useStyles();

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <div className={classes.resourceWrapper}>
        <Button
          color="secondary"
          onClick={handleClose}
          className={classes.cancelButton}
        >
          Cancel
        </Button>
        <div className={classes.resourceCreationTopSection}>
          <Link
            component="button"
            onClick={handleClose}
            color="secondary"
            variant="body2"
          >
            &#60; Back
          </Link>
          <div className={classes.resourceHeader}>
            <Typography variant="h4">Patient Transport</Typography>
          </div>
          <div className={classes.caption}>
            <Typography
              variant="caption"
              style={{ color: Colours.SecondaryGray }}
            >
              Choose a hospital and an ambulance from the list below to
              transport patient to.
            </Typography>
          </div>
        </div>
        <div className={classes.resourceForm}>
          <HospitalTransportSelector
            options={hospitals}
            currentValue={selectedHospital}
            handleChange={handleHospitalChange}
          />
          <AmbulanceTransportSelector
            options={ambulances}
            currentValue={selectedAmbulance}
            handleChange={handleAmbulanceChange}
          />
        </div>
        <Button
          className={classes.confirmButton}
          onClick={handleComplete}
          color="secondary"
          variant="contained"
          disabled={!selectedAmbulance || !selectedHospital}
        >
          Confirm Transport
        </Button>
      </div>
    </Dialog>
  );
};

export default PatientTransportPage;
