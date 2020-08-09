import React from 'react';
import {
  Button,
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
} from '@material-ui/core';
import { Colours } from '../../styles/Constants';

interface ConfirmationDialogProps {
  open: boolean;
  setOpen: (boolean) => void;
  dialogTitle: string;
  closeTitle: string;
  okTitle: string;
  okTitleStatus?: 'normal' | 'danger';
  dialogContentText: string;
  okAction: () => void;
}

const useStyles = makeStyles({
  dangerButton: {
    color: Colours.Danger,
  },
  okButton: {
    color: Colours.Secondary,
  },
});

const ConfirmationDialog = ({
  open,
  setOpen,
  dialogTitle,
  closeTitle,
  okTitle,
  dialogContentText,
  okAction,
  okTitleStatus = 'normal',
}: ConfirmationDialogProps) => {
  const classes = useStyles();
  const handleClose = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
          event.stopPropagation()
        }
      >
        <DialogTitle>
          <Typography variant="h6">
            <Box fontWeight="fontWeightBold">{dialogTitle}</Box>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">{dialogContentText}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            {closeTitle}
          </Button>
          <Button
            onClick={(
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              okAction();
              handleClose(event);
            }}
            className={
              okTitleStatus === 'danger'
                ? classes.dangerButton
                : classes.okButton
            }
            autoFocus
          >
            {okTitle}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default ConfirmationDialog;
