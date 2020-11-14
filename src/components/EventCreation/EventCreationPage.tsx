import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Typography, makeStyles } from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from 'react-apollo';
import CancelModal from './CancelModal';
import Map from './Map';
import NextButton from './NextButton';
import { BackButton } from '../common/BackLink';
import FormField from '../common/FormField';
import Stepper from './Stepper';
import SelectDateModal from './SelectDateModal';
import { ADD_EVENT, EDIT_EVENT } from '../../graphql/mutations/events';
import {
  Event,
  GET_ALL_EVENTS,
  GET_EVENT_BY_ID,
} from '../../graphql/queries/events';
import { Colours } from '../../styles/Constants';

enum EventModes {
  New = 'new',
  Edit = 'edit',
}

const useStyles = makeStyles({
  eventCancelBtn: {
    minWidth: '228px',
    alignSelf: 'center',
    display: 'flex',
  },
});

const EventCreationPage = ({
  match: {
    params: { eventId },
  },
  mode,
}: {
  match: { params: { eventId?: string } };
  mode: string;
}) => {
  const classes = useStyles();
  const history = useHistory();

  const { data, loading } = useQuery(
    mode === EventModes.Edit && eventId ? GET_EVENT_BY_ID : GET_ALL_EVENTS,
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
    onCompleted({ addEvent }) {
      history.replace('/events', { addedEventId: addEvent.id });
    },
    onError() {
      history.replace('/events');
    },
  });
  const [editEvent] = useMutation(EDIT_EVENT, {
    onCompleted() {
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
    if (mode === EventModes.New) {
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
    } else if (mode === EventModes.Edit && eventId) {
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
  };

  useEffect(() => {
    if (!loading && mode === EventModes.Edit) {
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
  }, [data, loading, mode]);

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
        <Typography variant="h4">
          {mode === EventModes.New ? 'Add New Event' : 'Edit Event'}
        </Typography>
        <Button
          color="secondary"
          variant="outlined"
          className={classes.eventCancelBtn}
          onClick={handleOpenCancelModal}
        >
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
      <Box padding="0 56px">
        <Stepper
          activeStep={activeStep}
          nextButton={
            <NextButton
              handleClick={activeStep < 1 ? handleNext : handleComplete}
              disabled={eventName === '' || eventDate === null}
              buttonText={
                activeStep < 1
                  ? 'Next'
                  : mode === EventModes.New
                  ? 'Complete'
                  : 'Save'
              }
            />
          }
        />
      </Box>
    </Box>
  );
};

export default EventCreationPage;
