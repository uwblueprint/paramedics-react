import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Typography } from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from 'react-apollo';
import CancelModal from './CancelModal';
import Map from './Map';
import NextButton from './NextButton';
import { BackButton } from '../common/BackLink';
import FormField from '../common/FormField';
import Stepper from './Stepper';
import SelectDateModal from './SelectDateModal';
import { ADD_EVENT } from '../../graphql/mutations/events';
import { Event, GET_ALL_EVENTS } from '../../graphql/queries/events';
import { Colours } from '../../styles/Constants';

const EventCreationPage = () => {
  const history = useHistory();

  const { data } = useQuery(GET_ALL_EVENTS);
  const events: Array<Event> = data ? data.events : [];

  const [addEvent] = useMutation(ADD_EVENT, {
    update(cache, { data: { addEvent } }) {
      cache.writeQuery({
        query: GET_ALL_EVENTS,
        data: { events: events.concat([addEvent]) },
      });
    },
    onCompleted({ addEvent }) {
      history.replace('/events', { addedEventId: addEvent.id });
    },
    onError() {
      history.replace('/events');
    },
  });

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
        createdBy: 1,
        isActive: true,
      },
    });
  };

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
    <Box minHeight="100vh">
      <Box
        display="flex"
        justifyContent="space-between"
        padding="56px 56px 36px 56px"
        borderBottom={`1px solid ${Colours.BorderLightGray}`}
      >
        <Typography variant="h4">Create New Event</Typography>
        <Button color="secondary" onClick={handleOpenCancelModal}>
          Cancel
        </Button>
      </Box>

      <Box padding="56px">{content}</Box>
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
          <NextButton
            handleClick={activeStep < 1 ? handleNext : handleComplete}
            disabled={eventName === '' || eventDate === null}
            buttonText={activeStep < 1 ? 'Next' : 'Create'}
          />
        }
      />
      {activeStep === 1 && (
        <Box position="absolute" top="24px" left="56px">
          <BackButton onClick={handleBack} />
        </Box>
      )}
    </Box>
  );
};

export default EventCreationPage;
