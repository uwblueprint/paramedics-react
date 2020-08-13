import React from 'react';
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Colours } from '../../styles/Constants';

const dialogStyles = makeStyles({
  paper: {
    width: 485,
    height: 280,
  },
  dialogContent: {
    paddingLeft: 24,
    paddingTop: 24,
    paddingRight: 24,
  },
  dialogTitle: {
    paddingLeft: 24,
    paddingTop: 24,
    paddingRight: 24,
    paddingBottom: 0,
    fontWeight: 500,
    fontSize: 20,
  },
  dialogCancel: {
    color: Colours.Secondary,
    height: 48,
    width: 107,
  },
  dialogDelete: {
    color: Colours.Danger,
    height: 48,
    width: 107,
  },
  dialogActionSpacing: {
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
});

const ConfirmModal = ({
  open,
  handleClickCancel,
  handleClickAction,
  title,
  body,
  actionLabel,
}: {
  title: string;
  body: string;
  actionLabel: string;
  open: boolean;
  handleClickCancel: () => void;
  handleClickAction: () => void;
}) => {
  const dialogStyle = dialogStyles();

  return (
    <Dialog classes={{ paper: dialogStyle.paper }} open={open}>
      <DialogTitle classes={{ root: dialogStyle.dialogTitle }}>
        {title}
      </DialogTitle>
      <DialogContent classes={{ root: dialogStyle.dialogContent }}>
        <Typography variant="body2">{body}</Typography>
      </DialogContent>
      <DialogActions classes={{ spacing: dialogStyle.dialogActionSpacing }}>
        <Button
          classes={{ root: dialogStyle.dialogCancel }}
          onClick={handleClickCancel}
        >
          <Typography variant="body1">Cancel</Typography>
        </Button>
        <Button
          classes={{ root: dialogStyle.dialogDelete }}
          onClick={handleClickAction}
        >
          <Typography variant="body1">{actionLabel}</Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
