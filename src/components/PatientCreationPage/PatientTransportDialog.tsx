import React from 'react';
import {
  DialogContent,
  Button,
  Dialog,
  DialogActions,
  DialogTitle
} from '@material-ui/core';

const PatientTransportDialog = ({
  open,
  handleClose,
  confirmTransportLink
}: {
  open: boolean;
  handleClose: () => void;
  confirmTransportLink: string;
}) => {
  return (
    <Dialog open={open}>
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
          color="secondary"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          color="secondary"
          href={confirmTransportLink}
        >
          Continue to transport
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientTransportDialog;