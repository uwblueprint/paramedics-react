import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/EventCreationPage.css';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from 'react-apollo';
import CancelModal from '../components/EventCreationPage/CancelModal';
import Map from '../components/EventCreationPage/Map';
import NextButton from '../components/EventCreationPage/NextButton';
import BackButton from '../components/EventCreationPage/BackButton';
import FormField from '../components/common/FormField';
import Stepper from '../components/EventCreationPage/Stepper';
import SelectDateModal from '../components/EventCreationPage/SelectDateModal';
import { ADD_EVENT, EDIT_EVENT } from '../graphql/mutations/events';
import {
  Event,
  GET_ALL_EVENTS,
  GET_EVENT_BY_ID,
} from '../graphql/queries/events';

const EventCreationPage = ({
  match: {
    params: { eventId },
  },
  mode,
}: {
  match: { params: { eventId?: string } };
  mode: string;
}) => {
  const history = useHistory();

  const { data, loading } = useQuery(
    mode === 'edit' && eventId ? GET_EVENT_BY_ID : GET_ALL_EVENTS,
    {
      variables: {
        eventId,
      },
    }
  );
  const events: Array<Event> = data ? data.events : [];

  const [addEvent] = useMutation(ADD_EVENT, {
    update(cache, { data: { addEvent } }) {
      cache.writeQuery({
        query: GET_ALL_EVENTS,
        data: { events: events.concat([addEvent]) },
      });
    },
  });
  const [editEvent] = useMutation(EDIT_EVENT);

  const [openCancelModal, setOpenHandleModal] = useState(false);
  const [openDateModal, setOpenDateModal] = useState(false);

  const [eventName, setEventName] = useState<string>('');
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [eventLocation, setEventLocation] = useState<string>('');

  const [activeStep, setActiveStep] = useState<number>(0);

  const handleOpenCancelModal = () => setOpenHandleModal(true);
  const handleCloseCancelModal = () => setOpenHandleModal(false);

  const handleOpenDateModal = () => setOpenDateModal(true);
  const handleCloseDateModal = () => setOpenDateModal(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLElement>) => {
    const target = e.target as HTMLInputElement;
    setEventName(target.value);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateChange = (e: any) => {
    setEventDate(e.target.value);
  };
  const handleLocationChange = (e: React.ChangeEvent<HTMLElement>) => {
    const target = e.target as HTMLInputElement;
    setEventLocation(target.value);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    return null;
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
    if (mode === 'new') {
      addEvent({
        variables: {
          name: eventName,
          eventDate:
            dateParts.year &&
            dateParts.month &&
            dateParts.day &&
            `${dateParts.year}-${dateParts.month.padStart(
              2,
              '0'
            )}-${dateParts.day.padStart(2, '0')}`,
          createdBy: 1, // TODO: change this to proper user
          isActive: true,
        },
      });
    } else if (mode === 'edit' && eventId) {
      editEvent({
        variables: {
          id: eventId,
          name: eventName,
          eventDate:
            dateParts.year &&
            dateParts.month &&
            dateParts.day &&
            `${dateParts.year}-${dateParts.month.padStart(
              2,
              '0'
            )}-${dateParts.day.padStart(2, '0')}`,
          createdBy: 1,
          isActive: true,
        },
      });
    }
    history.replace('/events');
  };

  useEffect(() => {
    if (!loading && mode === 'edit') {
      const {
        name,
        eventDate,
      }: {
        name: string;
        eventDate: string;
        id: string;
      } = data.event;

      setEventName(name);
      setEventDate(new Date(eventDate));
    }
  }, [data]);

  const content =
    activeStep === 0 ? (
      <form>
        <FormField
          label="Event Name:"
          placeholder="Event Name Here"
          onChange={handleNameChange}
          value={eventName}
          isValidated={false}
        />
        <FormField
          label="Date of Event:"
          placeholder="YYYY:MM:DD"
          onChange={handleDateChange}
          value={
            eventDate
              ? `${dateParts.year}:${dateParts.month}:${dateParts.day}`
              : ''
          }
          handleFocus={handleOpenDateModal}
          isValidated={false}
        />
      </form>
    ) : (
      <form>
        <FormField
          label="Event Location:"
          placeholder="Enter Location Here"
          onChange={handleLocationChange}
          value={eventLocation}
          isValidated={false}
        />
        <Map />
      </form>
    );

  return (
    <div className="landing-wrapper">
      <div className="event-creation-top-section">
        <div className="landing-top-bar">
          <Typography variant="h3">
            {mode === 'new' ? 'Create New Event' : 'Edit Event'}
          </Typography>
          <div className="user-icon">
            <Button
              variant="outlined"
              color="primary"
              onClick={handleOpenCancelModal}
              style={{
                minWidth: '18rem',
                minHeight: '2.5rem',
                fontSize: '18px',
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
              disabled={eventName === '' || eventDate === null}
              buttonText={activeStep < 1 ? 'Next' : 'Create'}
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
