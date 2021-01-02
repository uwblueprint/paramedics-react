import React from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

const useModalStyles = makeStyles({
  root: {
    position: 'absolute',
    left: '0%',
    right: '0%',
    top: '0%',
    bottom: '0%',
    color: '#FFFFFF',

    background: '#FFFFFF',
    border: '1.35101px solid #C4C4C4',
    boxSizing: 'border-box',
    borderRadius: '5px',
    width: '30rem',
    height: '15rem',
    margin: 'auto',
    outline: 0,
  },
  text: {
    color: 'black',
    textAlign: 'center',
    marginTop: '3rem',
  },
  buttonContainer: {
    marginTop: '2rem',
  },
});

const CancelModal: React.FC<{
  open: boolean;
  handleClose: () => void;
}> = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
  const classes = useModalStyles();
  return (
    <Modal open={open} onClose={handleClose} disableBackdropClick>
      <Container classes={{ root: classes.root }}>
        <Typography classes={{ root: classes.text }}>
          Are you sure you want to cancel this event?
        </Typography>
        <Grid
          container
          justify="center"
          alignItems="center"
          classes={{ root: classes.buttonContainer }}
          spacing={3}
        >
          <Grid item xs={3}>
            <Button variant="outlined" color="primary" onClick={handleClose}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              component={NavLink}
              to="/events"
              variant="contained"
              color="primary"
            >
              Confirm
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Modal>
  );
};

export default CancelModal;
