import React from 'react';
import {
  Typography,
  makeStyles,
  Button,
  Dialog,
  AppBar,
  Toolbar,
} from '@material-ui/core';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import HospitalTransportSelector from './HospitalTransportSelector';
import AmbulanceTransportSelector from './AmbulanceTransportSelector';
import { Colours } from '../../styles/Constants';
import { Hospital } from '../../graphql/queries/hospitals';
import { Ambulance } from '../../graphql/queries/ambulances';
import { CCP } from '../../graphql/queries/ccps';

const useStyles = makeStyles({
  resourceWrapper: {
    backgroundColor: Colours.White,
  },
  resourceCreationTopSection: {
    margin: '48px 30px 0px 30px',
    backgroundColor: Colours.White,
    borderBottom: `1px solid ${Colours.BorderLightGray}`,
  },
  resourceHeader: {
    display: 'flex',
    padding: '16px 0px',
    justifyContent: 'space-between',
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
    right: '30px',
  },
  cancelButton: {
    minWidth: '228px',
    fontSize: '18px',
    alignSelf: 'center',
  },
  appBarText: {
    marginLeft: '15px',
  },
  appBar: {
    backgroundColor: Colours.SecondaryHover,
  },
  icon: {
    fontSize: '18px',
    padding: '0px 5px 0px 20px',
  },
});

const PatientTransportPage = ({
  open,
  patientBarcode,
  ccp,
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
  patientBarcode: string | null;
  ccp: CCP;
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
    <Dialog fullScreen open={open} onClose={handleClose} disableBackdropClick>
      <AppBar position="relative" className={classes.appBar}>
        <Toolbar variant="dense">
          <Typography variant="h6" className={classes.appBarText}>
            {ccp.name}
          </Typography>
          <LocationOnOutlinedIcon className={classes.icon} />
          <Typography variant="caption">
            Ezra Street l1j3j4, Waterloo Canada
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.resourceWrapper}>
        <div className={classes.resourceCreationTopSection}>
          <div className={classes.resourceHeader}>
            <Typography variant="h4">Patient Transport</Typography>
            <Button
              color="secondary"
              variant="outlined"
              onClick={handleClose}
              className={classes.cancelButton}
            >
              Cancel
            </Button>
          </div>
          <div className={classes.caption}>
            <Typography
              variant="caption"
              style={{ color: Colours.SecondaryGray }}
            >
              Choose a hospital and an ambulance from the list below to
              transport patient
              {patientBarcode ? ` ${patientBarcode} ` : ' '}
              to.
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
