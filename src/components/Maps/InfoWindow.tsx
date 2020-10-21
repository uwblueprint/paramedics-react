import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Colours } from '../../styles/Constants';

const useStyles = makeStyles({
  root: {
    maxWidth: '345px',
    marginLeft: '5px',
    width: '446px',
    height: '200px',
    marginTop: '50px',
  },
  dialogDelete: {
    color: Colours.Danger,
    height: '48px',
    width: '107px',
  },
  dialogButton: {
    color: Colours.Secondary,
    height: '48px',
    minWidth: '107px',
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
    <Dialog classes={{root: infoStyles.root}} open={open} onClose={handleClose} BackdropProps={{ style: { backgroundColor: "transparent" } }}>
      <DialogContent style={{overflow: "hidden"}}>
        <Typography variant="body1" color="textSecondary">
          Name:
          <Typography display="inline" color="textPrimary">
            {' '}
            {title}{' '}
          </Typography>
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Location:
          <Typography display="inline" color="textPrimary">
            {' '}
            {address}{' '}
          </Typography>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button size="small" classes={{ root: infoStyles.dialogDelete }}>
          Delete
        </Button>
        <Button size="small" classes={{ root: infoStyles.dialogButton }}>
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoWindow;
