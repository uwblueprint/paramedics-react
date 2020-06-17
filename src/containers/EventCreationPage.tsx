import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../styles/EventCreationPage.css";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CancelModal from "../components/EventCreationPage/CancelModal";
import Map from "../components/EventCreationPage/Map";
import NextButton from "../components/EventCreationPage/NextButton";
import BackButton from "../components/EventCreationPage/BackButton";
import FormField from "../components/EventCreationPage/FormField";
import Stepper from "../components/EventCreationPage/Stepper";
import SelectDateModal from "../components/EventCreationPage/SelectDateModal";
import { useEventMutation } from "../graphql/mutations/hooks/events";

const EventCreationPage = () => {
  const history = useHistory();

  const [openCancelModal, setOpenHandleModal] = useState(false);
  const [openDateModal, setOpenDateModal] = useState(false);
  const [complete, setComplete] = useState(false);

  const [eventName, setEventName] = useState<string>("");
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [eventLocation, setEventLocation] = useState<string>("");

  const [activeStep, setActiveStep] = useState<number>(0);

  const handleOpenCancelModal = () => setOpenHandleModal(true);
  const handleCloseCancelModal = () => setOpenHandleModal(false);

  const handleOpenDateModal = () => setOpenDateModal(true);
  const handleCloseDateModal = () => setOpenDateModal(false);

  const handleNameChange = (e: any) => {
    setEventName(e.target.value);
  };
  const handleDateChange = (e: any) => {
    setEventDate(e.target.value);
  };
  const handleLocationChange = (e: any) => {
    setEventLocation(e.target.value);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  useEventMutation(
    {
      name: eventName,
      eventDate: eventDate || new Date(),
      createdBy: 1,
      isActive: true,
    },
    complete,
    setComplete
  );

  const handleComplete = () => {
    setComplete(true);
    history.push("/events");
  };

  const dateParts: {
    year?: string;
    month?: string;
    day?: string;
    literal?: string;
  } = eventDate
    ? new Intl.DateTimeFormat().formatToParts(eventDate).reduce(
        (obj, currentPart) => ({
          ...obj,
          [currentPart.type]: currentPart.value,
        }),
        {}
      )
    : {};
  const content =
    activeStep === 0 ? (
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
          value={
            eventDate
              ? `${dateParts.year}:${dateParts.month}:${dateParts.day}`
              : ""
          }
          handleFocus={handleOpenDateModal}
        />
      </form>
    ) : (
      <form>
        <FormField
          label="Event Location:"
          placeholder="Enter Location Here"
          onChange={handleLocationChange}
          value={eventLocation}
        />
        <Map />
      </form>
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
              style={{
                minWidth: "18rem",
                minHeight: "2.5rem",
                fontSize: "18px",
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
      <div className="event-form">{content}</div>
      <CancelModal
        open={openCancelModal}
        handleClose={handleCloseCancelModal}
      />
      <SelectDateModal
        open={openDateModal}
        handleClose={handleCloseDateModal}
        eventDate={eventDate}
        setEventDate={setEventDate}
      />
      <Stepper
        activeStep={activeStep}
        nextButton={
          <div className="next-container">
            <NextButton
              handleClick={activeStep < 1 ? handleNext : handleComplete}
              disabled={eventName === "" || eventDate === null}
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
