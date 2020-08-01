import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../styles/EventCreationPage.css";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core"
import Button from "@material-ui/core/Button";
import CancelModal from "../components/EventCreationPage/CancelModal";
import Map from "../components/EventCreationPage/Map";
import NextButton from "../components/EventCreationPage/NextButton";
import BackButton from "../components/EventCreationPage/BackButton";
import FormField from "../components/EventCreationPage/FormField";
import Stepper from "../components/EventCreationPage/Stepper";
import SelectDateModal from "../components/EventCreationPage/SelectDateModal";
import { useMutation } from "@apollo/react-hooks";
import { useQuery } from "react-apollo";
import { ADD_EVENT } from "../graphql/mutations/templates/events";
import { EventType, GET_ALL_EVENTS } from "../graphql/queries/templates/events";

const CCPFormPage = () => {

  const useStyles = makeStyles({
    ccpWrapper: {
      backgroundColor: 'white',
    },
    ccpFormTopSection: {
      margin: '48px 30px 0px 30px',
      backgroundColor: 'white',
      borderBottom: '1px solid #c4c4c4',
    },
    ccpHeader: {
      display: 'flex',
      padding: '16px 0px',
    },
    ccpForm: {
      padding: '30px',
    },
  });

  const classes = useStyles();
  const history = useHistory();

  const { data } = useQuery(GET_ALL_EVENTS);
  const events: Array<EventType> = data ? data.events : [];

  const [addEvent] = useMutation(ADD_EVENT,
    {
      update(cache, { data: { addEvent } }) {
        cache.writeQuery({
          query: GET_ALL_EVENTS,
          data: { events: events.concat([addEvent]) },
        });
      }
    }
  );

  const [openCancelModal, setOpenHandleModal] = useState(false);
  const [openDateModal, setOpenDateModal] = useState(false);

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

  const handleComplete = () => {

  };

  const content = (
        <form>
          <FormField
            label="Name:"
            placeholder="Create A Name"
            onChange={handleLocationChange}
            value={eventLocation}
          />
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
    <div className={classes.ccpWrapper}>
      <div className={classes.ccpFormTopSection}>
        <div className={classes.ccpHeader}>
          <Typography variant="h3">Create a CCP</Typography>
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
      <div className={classes.ccpForm}>
          {content}
      </div>

    </div>
  );
};

export default CCPFormPage;
