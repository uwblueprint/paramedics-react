import React from 'react';
import {
  DialogContent,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from '@material-ui/core';
import { Colours } from '../../styles/Constants';

const DeletePatientDialog = ({
  open,
  onClose,
  handleConfirm,
}: {
  open: boolean;
  onClose: () => void;
  handleConfirm: () => void;
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>You are about to delete a patient</DialogTitle>
      <DialogContent>
        Deleting a patient will remove all records of the patient.
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button style={{ color: Colours.Danger }} onClick={handleConfirm}>
          Confirm Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePatientDialog;
