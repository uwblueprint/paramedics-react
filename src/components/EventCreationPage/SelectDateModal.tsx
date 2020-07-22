import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
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
    height: '30rem',
    margin: 'auto',
    outline: 0,
  },
  text: {
    color: 'black',
    textAlign: 'left',
    marginLeft: '2rem',
    marginTop: '3rem',
  },
  buttonContainer: {
    marginTop: '2rem',
  },
  cancelButton: {
    position: 'absolute',
  },
});

const datePickerTheme = createMuiTheme({
  overrides: {
    MuiPickersBasePicker: {
      container: {
        alignItems: 'center',
      },
    },
    MuiPickersSlideTransition: {
      transitionContainer: {
        color: 'black',
      },
    },
  },
});

const SelectDateModal: React.FC<{
  open: boolean;
  handleClose: () => void;
  eventDate: Date | null;
  setEventDate: (date: Date | null) => void;
}> = ({
  open,
  handleClose,
  eventDate,
  setEventDate,
}: {
  open: boolean;
  handleClose: () => void;
  eventDate: Date | null;
  setEventDate: (date: Date | null) => void;
}) => {
  const classes = useModalStyles();
  const [date, setDate] = useState<Date | null>(eventDate);
  return (
    <Modal open={open} onClose={handleClose}>
      <Container classes={{ root: classes.root }}>
        <Typography variant="h6" classes={{ root: classes.text }}>
          Select Event Date:
        </Typography>
        <ThemeProvider theme={datePickerTheme}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              disableToolbar
              variant="static"
              format="yyyy/mm/dd"
              margin="normal"
              id="date-picker-inline"
              label="Date picker inline"
              value={date}
              onChange={setDate}
              fullWidth
            />
          </MuiPickersUtilsProvider>
        </ThemeProvider>
        <Grid container alignItems="center" justify="center" spacing={8}>
          <Grid item>
            <Button variant="outlined" color="primary" onClick={handleClose}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setEventDate(date);
                handleClose();
              }}
            >
              Confirm
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Modal>
  );
};

export default SelectDateModal;
