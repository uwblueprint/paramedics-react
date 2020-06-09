import React from "react";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
// import {
//   MuiPickersUtilsProvider,
//   KeyboardDatePicker,
// } from '@material-ui/pickers';
import Typography from "@material-ui/core/Typography";

const SelectDateModal = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => any;
}) => {
  const classes = useModalStyles();
  const handleCancel = () => { };
  return (
    <Modal open={open} onClose={handleClose}>
      <Container classes={{ root: classes.root }}>
        <Typography classes={{ root: classes.text }}>
          Select Event Date:
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

const useModalStyles = makeStyles({
  root: {
    position: "absolute",
    left: "0%",
    right: "0%",
    top: "0%",
    bottom: "0%",
    color: "#FFFFFF",

    background: "#FFFFFF",
    border: "1.35101px solid #C4C4C4",
    boxSizing: "border-box",
    borderRadius: "5px",
    width: "30rem",
    height: "15rem",
    margin: "auto",
    outline: 0,
  },
  text: {
    color: "black",
    textAlign: "center",
    marginTop: "3rem",
  },
  buttonContainer: {
    marginTop: "2rem",
  },
});

export default SelectDateModal;