import React from 'react';
import {
  DialogContent,
  Button,
  DialogActions,
  DialogTitle
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Colours } from '../../styles/Constants';
import { Patient } from '../../graphql/queries/patients';


const PatientTransportDialog = ({
  handleClose,
  handleConfirmTransport
}: {
  handleClose: () => void;
  handleConfirmTransport: () => void;
}) => {
  return (
    <div>
      <DialogTitle>
        You are about to transport a patient to a hospital
      </DialogTitle>
      <DialogContent>
        Transporting a patient will:
        <ul>
          <li>Move a patient on scene to a selected hospital and ambulance.</li>
          <li>All transported patients can be found in the hospital tab.</li>
          <li>A run number needs to be manually added to transported patients.</li>
        </ul>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirmTransport}
        >
          Continue to transport
        </Button>
      </DialogActions>
    </div>
  );
};

export default PatientTransportDialog;