import React, { useState, useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { TextValidator } from 'react-material-ui-form-validator';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  sidebarOptions: {
    width: '334px',
  },
  sidebarTextField: {
    width: '334px',
    marginLeft: '16px',
  },
  sidebarList: {
    width: '324px',
  },
});

const SearchBar = ({
  onComplete,
}: {
  onComplete: ({ latitude, longitude, address }) => void;
}) => {
  const [address, setAddress] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const styles = useStyles();
  const inputEl = useRef(null);

  const handleChange = (address) => {
    setAddress(address);
  };

  const handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        onComplete({
          latitude: latLng.lat,
          longitude: latLng.lng,
          address,
        });
      });
    setMenuOpen(false);
    setAddress(address);
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <div ref={inputEl}> 
            <TextValidator
              inputProps={getInputProps({
                placeholder: 'Find Location',
              })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onFocus={() => {
                setMenuOpen(true);
              }}
              className={styles.sidebarTextField}
              validators={['required']}
              errorMessages={['An address is required']}
            />
          </div>
          <Popover
            open={menuOpen && suggestions.length > 0}
            onClose={() => setMenuOpen(false)}
            anchorEl={inputEl.current}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            disableAutoFocus
            disableEnforceFocus
          >
            <List classes={{ root: styles.sidebarList }}>
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => (
                <ListItem
                  key={suggestion.description}
                  onClick={(event: React.MouseEvent<HTMLElement>) =>
                    handleSelect(suggestion.description)
                  }
                  classes={{ root: styles.sidebarOptions }}
                >
                  <div {...getSuggestionItemProps(suggestion)}>
                    <Typography>{suggestion.description}</Typography>
                  </div>
                </ListItem>
              ))}
            </List>
          </Popover>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default SearchBar;
