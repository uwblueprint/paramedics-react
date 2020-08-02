import { useMutation } from '@apollo/react-hooks';
import { useQuery } from 'react-apollo';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/EventCreationPage.css';
import { ValidatorForm } from 'react-material-ui-form-validator';
import Typography from '@material-ui/core/Typography';
import { Colours } from '../styles/Constants';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import NextButton from '../components/CCPForm/NextButton';
import Map from '../components/EventCreationPage/Map';
import FormField from '../components/common/FormField';

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
      padding: '56px 56px 37px 56px',
    },
    ccpCompleteDiv: {
      marginBottom: 71,
      margin: '0px 56px',
      display: 'flex',
      justifyContent: 'flex-end',
    },
    ccpCancelBtn: {
      minWidth: '107px',
      minHeight: '48px',
      fontSize: '18px',
      fontWeight: 500,
      color: Colours.Secondary,
    }
  });

  const classes = useStyles();
  const history = useHistory();

  const [eventName, setEventName] = useState<string>('');
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [eventLocation, setEventLocation] = useState<string>('');

  const handleNameChange = (e: any) => {
    setEventName(e.target.value);
  };
  const handleDateChange = (e: any) => {
    setEventDate(e.target.value);
  };
  const handleLocationChange = (e: any) => {
    setEventLocation(e.target.value);
  };

  const handleComplete = () => {};

  const content = (
    <ValidatorForm>
      <FormField
        label="Name:"
        placeholder="Create A Name"
        isValidated
        onChange={handleLocationChange}
        value={eventLocation}
      />
      <FormField
        label="Event Location:"
        placeholder="Enter Location Here"
        isValidated
        onChange={handleLocationChange}
        value={eventLocation}
      />
      <Map />
    </ValidatorForm>
  );

  return (
    <div className={classes.ccpWrapper}>
      <div className={classes.ccpFormTopSection}>
        <div className={classes.ccpHeader}>
          <Typography variant="h3">Create a CCP</Typography>
          <div className="user-icon">
            <Button
              color="primary"
              style={{
                minWidth: '107px',
                minHeight: '48px',
                fontSize: '18px',
                fontWeight: 500,
                color: Colours.Secondary,
                fontWeight: 500,
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
      <div className={classes.ccpForm}>{content}</div>
      <div className={classes.ccpCompleteDiv}>
        <NextButton
          handleClick={handleComplete}
          disabled={false}
          buttonText="Complete"
        />
      </div>
    </div>
  );
};

export default CCPFormPage;
