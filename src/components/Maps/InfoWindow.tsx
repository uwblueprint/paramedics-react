import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Container from '@material-ui/core/Container';

import { Colours } from '../../styles/Constants';

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    top: '24px',
    maxWidth: '450px',
    marginLeft: '5px',
    width: '446px',
    height: '225px',
    marginTop: '50px',
    overflow: 'hidden',
    boxShadow: 'none',
  },
  closeButton: {
    color: Colours.Black,
    float: 'right',
    paddingTop: '15px',
    marginRight: '5px',
    marginLeft: 'auto',
    height: '24px',
    width: '24px',
  },
  flexContainerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: '10px',
  },
  flexContainerButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 18px 15px 18px',
  },
});

const InfoWindow = ({
  title,
  address,
  open,
  handleEditClick,
  handleClose,
  handleDeleteClicked,
}: {
  title: string;
  address: string;
  open: boolean;
  handleEditClick: () => void;
  handleClose: () => void;
  handleDeleteClicked: () => void;
}) => {
  const infoStyles = useStyles();

  return (
    <Dialog
      classes={{ root: infoStyles.root }}
      open={open}
      onClose={handleClose}
      PaperProps={{
        elevation: 6,
      }}
      hideBackdrop
      disableEnforceFocus
      disableScrollLock
    >
      <Container classes={{ root: infoStyles.flexContainerContent }}>
        <DialogContent
          style={{ overflow: 'hidden', paddingLeft: '0px', boxShadow: 'none' }}
        >
          <Typography variant="body1" color="textSecondary">
            Name:
            <span
              style={{ display: 'inline', color: Colours.Black }}
              color="textPrimary"
            >
              {` ${title} `}
            </span>
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Location:
            <span
              style={{ display: 'inline', color: Colours.Black }}
              color="textPrimary"
            >
              {` ${address} `}
            </span>
          </Typography>
        </DialogContent>
        <CloseIcon
          onClick={handleClose}
          classes={{ root: infoStyles.closeButton }}
        />
      </Container>
      <DialogActions style={{ padding: '0px', boxShadow: 'none' }}>
        <Container classes={{ root: infoStyles.flexContainerButtons }}>
          <Button size="small" style={{ color: Colours.Danger }} onClick={handleDeleteClicked}>
            Delete
          </Button>
          <Button
            size="small"
            style={{ color: Colours.Secondary }}
            onClick={handleEditClick}
          >
            Edit
          </Button>
        </Container>
      </DialogActions>
    </Dialog>
  );
};

export default InfoWindow;
