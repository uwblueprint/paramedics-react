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
    maxWidth: '345px',
    marginLeft: '5px',
    width: '446px',
    height: '200px',
    marginTop: '50px',
    overflow: 'hidden',
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
  flexContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

const InfoWindow = ({
  title,
  address,
  open,
  handleClose,
}: {
  title: string;
  address: string;
  open: boolean;
  handleClose: () => void;
}) => {
  const infoStyles = useStyles();

  return (
    <Dialog
      classes={{ root: infoStyles.root }}
      open={open}
      onClose={handleClose}
      BackdropProps={{ style: { backgroundColor: 'transparent' } }}
    >
      <Container classes={{ root: infoStyles.flexContainer }}>
        <DialogContent style={{ overflow: 'hidden', paddingLeft: '0px' }}>
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
        <CloseIcon onClick={handleClose} classes={{ root: infoStyles.closeButton }}/>
      </Container>
      <DialogActions style = {{ padding: '0px'}}>
        <Container classes={{ root: infoStyles.flexContainer }}>
          <Button size="small" style={{ color: Colours.Danger }}>
            Delete
          </Button>
          <Button size="small" style={{ color: Colours.Secondary }}>
            Edit
          </Button>
        </Container>
      </DialogActions>
    </Dialog>
  );
};

export default InfoWindow;