import React, { useState, useEffect, useRef } from 'react';
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
  
  if(loaded) {
    return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <input
            {...getInputProps({
              placeholder: 'Search Places ...',
              className: 'location-search-input',
            })}
          />
          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion) => {
              const className = suggestion.active
                ? 'suggestion-item--active'
                : 'suggestion-item';
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                : { backgroundColor: '#ffffff', cursor: 'pointer' };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
  }
  else 
  {
    return (<div> Loading ... </div>);
  }
};

export default SearchBar;