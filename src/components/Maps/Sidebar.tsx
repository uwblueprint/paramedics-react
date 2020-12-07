import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import SearchBar from './SearchBar';
import { Colours } from '../../styles/Constants';

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
});

const Sidebar = ({
  open,
  title,
  clickedAddress,
  onSuggestionTempMarkerSet,
  onClose,
  onComplete,
}: {
  open: boolean;
  title: string;
  clickedAddress?: string;
  onSuggestionTempMarkerSet: ({ lat, lng }) => void;
  onClose: () => void;
  onComplete: ({ label, latitude, longitude, address }) => void;
}) => {
  const [address, setAddress] = React.useState('');
  const [latitude, setLatitude] = React.useState(0);
  const [longitude, setLongitude] = React.useState(0);
  const [label, setLabel] = React.useState('');
  const styles = useStyles();

  useEffect(() => {
    if(clickedAddress) {
      setAddress(clickedAddress);
    }
  },[clickedAddress]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLElement>) => {
    setLabel((e.target as HTMLInputElement).value);
  };

  const handleGeocodeSelection = ({ lat, lng, address }) => {
    setLatitude(lat);
    setLongitude(lng);
    setAddress(address);
    onSuggestionTempMarkerSet({lat, lng});
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      style={{ position: 'initial' }}
      PaperProps={{ style: { width: '400px' }, elevation: 6, }}
      hideBackdrop
      disableEnforceFocus
      disableScrollLock
    >
      <Typography variant="h4" classes={{ root: styles.title }}>
        {title}
      </Typography>
      <ValidatorForm
        onSubmit={(e) => {
          onComplete({
            label,
            latitude,
            longitude,
            address,
          });
          setAddress('');
          setLabel('');
          e.preventDefault();
        }}
      >
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
        />
        <Container classes={{ root: styles.buttonContainer }}>
          <Button
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
      </ValidatorForm>
    </Drawer>
  );
};

export default Sidebar;
