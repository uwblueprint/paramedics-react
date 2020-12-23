import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import SearchBar from './SearchBar';
import { Colours } from '../../styles/Constants';
import { MapModes } from '../../graphql/queries/maps';

const useStyles = makeStyles({
  pinLabelField: {
    width: '334px',
    marginLeft: '16px',
    marginBottom: '30px',
  },
  label: {
    marginLeft: '16px',
    marginBottom: '16px',
  },
  title: {
    margin: '20px 0px 10px 16px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '30px',
    padding: '0px 30px 0px 16px',
  },
  autocompleteBackContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    padding: '0px 30px 10px 16px',
  },
});

const formatDateToString = (date: Date | null) => {
  if (!date) {
    return '';
  }
  const dateParts: {
    year?: string;
    month?: string;
    day?: string;
  } = new Intl.DateTimeFormat().formatToParts(date).reduce(
    (obj, currentPart) => ({
      ...obj,
      [currentPart.type]: currentPart.value,
    }),
    {}
  );

  if (dateParts && dateParts.year && dateParts.month && dateParts.day) {
    return dateParts.year.concat('-', dateParts.month, '-', dateParts.day);
  }

  return '';
};

const Sidebar = ({
  open,
  title,
  mode,
  clickedLocation,
  clickedAddress,
  onSuggestionTempMarkerSet,
  setTempMarkerClick,
  editLabel,
  editAddress,
  editLocation,
  onClose,
  onComplete,
  onEventCCPComplete,
}: {
  open: boolean;
  title: string;
  mode: MapModes;
  clickedLocation?: { lat: number; lng: number };
  clickedAddress?: string;
  onSuggestionTempMarkerSet: ({ lat, lng, address }) => void;
  setTempMarkerClick: () => void;
  editLabel?: string;
  editAddress?: string;
  editLocation?: { lat: number; lng: number };
  onClose: () => void;
  onComplete: ({ label, latitude, longitude, address }) => void;
  onEventCCPComplete: ({ name, eventDate, lat, lng, address }) => void;
}) => {
  const [address, setAddress] = React.useState('');
  const [latitude, setLatitude] = React.useState(0);
  const [longitude, setLongitude] = React.useState(0);
  const [label, setLabel] = React.useState('');
  const [isAutocompleteClicked, setIsAutocompleteClicked] = React.useState(
    false
  );
  const [date, setDate] = React.useState(new Date(''));
  const [eventDate, setEventDate] = React.useState('');
  const styles = useStyles();

  useEffect(() => {
    if (clickedAddress) {
      setAddress(clickedAddress);
    }

    if (clickedLocation) {
      setLatitude(clickedLocation.lat);
      setLongitude(clickedLocation.lng);
    }

    if (editLabel) {
      setLabel(editLabel);
    }

    if (editAddress && editLocation && address === '') {
      setAddress(editAddress);
      setLatitude(editLocation.lat);
      setLongitude(editLocation.lng);
    }
  }, [
    clickedAddress,
    clickedLocation,
    editLabel,
    editAddress,
    editLocation,
    address,
  ]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLElement>) => {
    setLabel((e.target as HTMLInputElement).value);
  };

  const handleGeocodeSelection = ({ lat, lng, address }) => {
    setLatitude(lat);
    setLongitude(lng);
    setAddress(address);
    setTempMarkerClick();
    onSuggestionTempMarkerSet({ lat, lng, address });
  };

  const handleAutocompleteClicked = () => {
    setIsAutocompleteClicked(true);
  };

  const handleBackClicked = () => {
    setIsAutocompleteClicked(false);
  };

  const onSubmit = (e) => {
    if (mode === MapModes.Map) {
      onComplete({
        label,
        latitude,
        longitude,
        address,
      });
    } else {
      onEventCCPComplete({
        name: label,
        eventDate,
        lat: latitude,
        lng: longitude,
        address,
      });
    }
    setAddress('');
    setLabel('');
    e.preventDefault();
  };

  const handleDateChange = (date) => {
    setEventDate(formatDateToString(date));
    setDate(date);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      style={{ position: 'initial' }}
      PaperProps={{ style: { width: '400px' }, elevation: 6 }}
      hideBackdrop
      disableEnforceFocus
      disableScrollLock
    >
      <Collapse in={!isAutocompleteClicked}>
        <Typography variant="h4" classes={{ root: styles.title }}>
          {title}
        </Typography>
      </Collapse>
      {(mode === MapModes.NewEvent || mode === MapModes.EditEvent) && (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Date picker inline"
            value={date}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
      )}
      <ValidatorForm
        onSubmit={(e) => onSubmit(e)}
      >
        <Collapse in={!isAutocompleteClicked}>
          <Typography variant="body1" classes={{ root: styles.label }}>
            Name:
          </Typography>
          <TextValidator
            placeholder="Pin name"
            onChange={handleLabelChange}
            value={label}
            validators={['required']}
            errorMessages={['A pin name is required']}
            className={styles.pinLabelField}
          />
        </Collapse>
        <Collapse in={isAutocompleteClicked}>
          <Container classes={{ root: styles.autocompleteBackContainer }}>
            <Button
              onClick={handleBackClicked}
              style={{ color: Colours.Secondary }}
              startIcon={<KeyboardBackspaceIcon />}
            >
              Back
            </Button>
          </Container>
        </Collapse>
        <Typography variant="body1" classes={{ root: styles.label }}>
          Pin Location:
        </Typography>
        <SearchBar
          existingAddress={address}
          onComplete={({ latitude, longitude, address }) =>
            handleGeocodeSelection({
              lat: latitude,
              lng: longitude,
              address,
            })
          }
          onAutocompleteClick={handleAutocompleteClicked}
        />
        <Collapse in={!isAutocompleteClicked}>
          <Container classes={{ root: styles.buttonContainer }}>
            <Button
              variant="outlined"
              style={{ color: Colours.Secondary }}
              onClick={() => {
                setLabel('');
                setAddress('');
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" color="secondary" type="submit">
              Complete
            </Button>
          </Container>
        </Collapse>
      </ValidatorForm>
    </Drawer>
  );
};

export default Sidebar;
