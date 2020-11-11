import React, { useState, useEffect, useRef } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

const loadScript = (url, callback) => {
  if (!document.querySelectorAll(`[src="${url}"]`).length) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = () => callback();
    script.src = url;
    document.querySelector('body')?.insertAdjacentElement('beforeend', script);
    console.log(document.getElementsByTagName('script'));
  } else {
    callback();
  }
};

const SearchBar = () => {
  const [loaded, setLoaded] = useState(false);
  const [address, setAddress] = useState('');

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GMAPS}&libraries=places`,
      () => setLoaded(true)
    );
  }, []);

  const handleChange = (address) => {
    setAddress(address);
  };

  const handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => console.log(latLng));
  };

  if (loaded) {
    return (
      <PlacesAutocomplete
        value={address}
        onChange={handleChange}
      >
        {({ getInputProps, suggestions, loading }) => (
          <div>
            <TextField
              inputProps={getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                <MenuItem onClick={(suggestion) => handleSelect(suggestion.description)}>
                  <Typography noWrap={true}>
                    {' '}
                    {suggestion.description}
                    {' '}
                  </Typography>
                </MenuItem>
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  } else {
    return <div> Loading ... </div>;
  }
};

export default SearchBar;
