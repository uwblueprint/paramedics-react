import React, { useState, useRef } from 'react';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { TextValidator } from 'react-material-ui-form-validator';
import { makeStyles } from '@material-ui/core/styles';
import { Colours } from '../../styles/Constants';

const useStyles = makeStyles({
  sidebarOptions: {
    width: '334px',
    '&:hover': {
      backgroundColor: Colours.BackgroundGray,
    },
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
  editAddress,
  onComplete,
  onAutocompleteClick,
}: {
  editAddress?: string;
  onComplete: ({ latitude, longitude, address }) => void;
  onAutocompleteClick: () => void;
}) => {
  const [address, setAddress] = useState(editAddress || '');
  const [menuOpen, setMenuOpen] = useState(false);
  const styles = useStyles();
  const inputEl = useRef(null);

  const searchOptions = {
    componentRestrictions: {
      country: ['CA'],
    },
  };

  const handleChange = (address) => {
    setAddress(address);
  };

  const handleError = (status, clearSuggestions) => {
    clearSuggestions();
  };

  const handleSelect = (selectedAddress) => {
    geocodeByAddress(selectedAddress)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        onComplete({
          latitude: latLng.lat,
          longitude: latLng.lng,
          address: selectedAddress,
        });
      })
      .catch((e) => { // eslint-disable-line
        // handle errors
      });
    setMenuOpen(false);
    setAddress(selectedAddress);
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
      searchOptions={searchOptions}
      onError={handleError}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <div ref={inputEl}>
            <TextValidator
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {address ? (
                      <IconButton
                        onClick={() => {
                          setAddress('');
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    ) : (
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
                inputProps: getInputProps({
                  placeholder: 'Find Location',
                }),
              }}
              onFocus={() => {
                setMenuOpen(true);
              }}
              onClick={onAutocompleteClick}
              value={address}
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
              {!loading &&
                suggestions.map((suggestion) => (
                  <ListItem
                    key={suggestion.description}
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
