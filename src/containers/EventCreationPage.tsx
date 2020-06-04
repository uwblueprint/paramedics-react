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


  const useTextFieldStyles = makeStyles({
    root: {
      border: "1px solid #E8E8E8",
      boxSizing: "border-box",
      borderRadius: "10px",
      backgroundColor: "#FFFFFF",
      padding: "20px",
      marginBottom: "30px",
      width: "100%",
    },
    label: {
      color: "black",
      margin: "20px",
      fontWeight: "bold",
    },
    eventForm: {
      padding: "30px"
    }
  });

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
      <div className={classes.eventForm}>
        <form>
          <TextField
            id="event-name"
            label={<Typography className={classes.label}>
              Event Name:
          </Typography>}
            placeholder="Event Name Here"
            InputLabelProps={{
              shrink: true,
            }}
            className={classes.root}
            // value={values.name}
            // onChange={handleChange("name")}
            margin="normal"
          />
          <TextField
            id="event-date"
            label={<Typography className={classes.label}>
              Date of Event:
            </Typography>}
            placeholder="YYYY:MM:DD"
            InputLabelProps={{
              shrink: true,
            }}
            className={classes.root}
            margin="normal"
          />
        </form>
      </div>
    </div>
  );
};



export default EventCreationPage;
