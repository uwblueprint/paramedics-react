import React, { useState } from "react";
import "../styles/EventCreationPage.css";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CancelModal from "../components/EventCreationPage/CancelModal";
import NextButton from "../components/EventCreationPage/NextButton";
import BackButton from "../components/EventCreationPage/BackButton";
import FormField from "../components/EventCreationPage/FormField";
import Stepper from "../components/EventCreationPage/Stepper";
import SelectDateModal from "../components/EventCreationPage/SelectDateModal";

const EventCreationPage = () => {
  const [openCancelModal, setOpenHandleModal] = useState(false);
  const [openDateModal, setOpenDateModal] = useState(false);

  const [eventName, setEventName] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [eventLocation, setLocation] = useState<string>("");
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleOpenCancelModal = () => setOpenHandleModal(true);
  const handleCloseCancelModal = () => setOpenHandleModal(false);

  const handleOpenDateModal = () => setOpenHandleModal(true);
  const handleCloseDateModal = () => setOpenHandleModal(false);

  const handleNameChange = (e: any) => {
    setEventName(e.target.value);
  };
  const handleDateChange = (e: any) => {
    setEventDate(e.target.value);
  };
  const handleLocationChange = (e: any) => {
    setEventDate(e.target.value);
  };
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  const handleComplete = () => {};

  const content =
    activeStep === 0 ? (
      <div className="event-form">
        <form>
          <FormField
            label="Event Name:"
            placeholder="Event Name Here"
            onChange={handleNameChange}
            value={eventName}
          />
          <FormField
            label="Date of Event:"
            placeholder="YYYY:MM:DD"
            onChange={handleDateChange}
            value={eventLocation}
            handleClick={handleOpenDateModal}
          />
        </form>
      </div>
    ) : (
      <FormField
        label="Event Location:"
        placeholder="Enter Location Here"
        onChange={handleLocationChange}
        value={eventLocation}
      />
    );

  return (
    <div className="landing-wrapper">
      <div className="event-creation-top-section">
        <div className="landing-top-bar">
          <Typography variant="h3">Create New Event</Typography>
          <div className="user-icon">
            <Button
              variant="outlined"
              color="primary"
              onClick={handleOpenCancelModal}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
      {content}
      <CancelModal
        open={openCancelModal}
        handleClose={handleCloseCancelModal}
      />
      <SelectDateModal open={openDateModal} handleClose={handleOpenDateModal} />
      <Stepper
        activeStep={activeStep}
        nextButton={
          <div className="next-container">
            <NextButton
              handleClick={activeStep < 1 ? handleNext : handleComplete}
            />
          </div>
        }
        backButton={
          activeStep === 1 ? (
            <div className="back-container">
              <BackButton handleClick={handleBack} />
            </div>
          ) : null
        }
      />
    </div>
  );
};

export default EventCreationPage;
