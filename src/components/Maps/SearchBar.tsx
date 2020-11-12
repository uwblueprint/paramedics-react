import React, { useState, useEffect, useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  sidebarOptions: {
    width: '250px',
  },
  sidebarTextField: {
    width: '250px',
    marginLeft: '10px',
  },
  sidebarList: {
    width: '240px',
  },
});

const SearchBar = () => {
  const [address, setAddress] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  let latitude = 0;
  let longitude = 0;
  const styles = useStyles();
  const inputEl = useRef(null);

  const handleChange = (address) => {
    setAddress(address);
  };

  const handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        latitude = latLng.latitude;
        longitude = latLng.longitude;
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
          <TextField
            inputProps={getInputProps({
              placeholder: 'Find Location',
            })}
            ref={inputEl}
            onFocus={() => {
              setMenuOpen(true);
            }}
            className={styles.sidebarTextField}
          />
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
            <List classes={{ root: styles.sidebarList}}>
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => (
                <ListItem
                  key={suggestion.id}
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
