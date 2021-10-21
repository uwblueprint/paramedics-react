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
    minWidth: '485px',
    height: '280px',
  },
  dialogContent: {
    paddingLeft: '24px',
    paddingTop: '24px',
    paddingRight: '24px',
  },
  dialogTitle: {
    paddingLeft: '24px',
    paddingTop: '24px',
    paddingRight: '24px',
    paddingBottom: '0px',
    fontWeight: 500,
    fontSize: '20px',
  },
  dialogDelete: {
    color: Colours.Danger,
    height: '48px',
    width: '107px',
  },
  dialogConfirm: {
    color: Colours.Secondary,
    height: '48px',
    width: '107px',
  },
  dialogButton: {
    color: Colours.Secondary,
    height: '48px',
    minWidth: '107px',
  },
  dialogActionSpacing: {
    paddingBottom: '8px',
    paddingLeft: '16px',
    paddingRight: '16px',
  },
});

const ConfirmModal = ({
  open,
  isActionDelete = false,
  handleClickCancel,
  handleClickAction,
  title,
  body,
  actionLabel,
}: {
  title: string;
  body: string | JSX.Element;
  actionLabel: string;
  open: boolean;
  isActionDelete?: boolean;
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
          classes={{ root: dialogStyle.dialogButton }}
          onClick={(event) => {
            event.stopPropagation();
            handleClickCancel();
          }}
        >
          <Typography variant="body1">Cancel</Typography>
        </Button>
        <Button
          classes={{
            root: isActionDelete
              ? dialogStyle.dialogDelete
              : dialogStyle.dialogButton,
          }}
          onClick={(event) => {
            event.stopPropagation();
            handleClickAction();
            // TODO: fix later
            // handleClickCancel();
          }}
        >
          <Typography variant="body1">{actionLabel}</Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
