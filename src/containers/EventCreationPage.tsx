import React, { useState } from "react";
import "../styles/EventCreationPage.css";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Modal from "@material-ui/core/Modal";
import CancelModal from "../components/EventCreationPage/CancelModal";

const EventCreationPage = () => {
  const [open, setOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const classes = useTextFieldStyles();

  return (
    <div className="landing-wrapper">
      <div className="event-creation-top-section">
        <div className="landing-top-bar">
          <Typography variant="h3">Create New Event</Typography>
          <div className="user-icon">
            <Button variant="outlined" color="primary" onClick={handleOpen}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
      <CancelModal open={open} handleClose={handleClose} />
      <div className="event-form">
        <form>
          <TextField
            id="event-name"
            label="Event Name:"
            placeholder="Event Name Here"
            InputLabelProps={{
              shrink: true,
            }}
            className={classes.root}
            // value={values.name}
            // onChange={handleChange("name")}
            fullWidth
            margin="normal"
            variant="filled"
          />
          <TextField
            id="event-date"
            label="Date of Event:"
            placeholder="YYYY:MM:DD"
            InputLabelProps={{
              shrink: true,
            }}
            className={classes.root}
            fullWidth
            margin="normal"
            variant="filled"
          />
        </form>
      </div>
    </div>
  );
};

const useTextFieldStyles = makeStyles({
  root: {
    background: "#FFFFFF",
  },
});

export default EventCreationPage;
