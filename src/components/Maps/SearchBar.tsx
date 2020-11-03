import React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

const SearchBar = () => {
    const [address, setAddress] = React.useState('');

    const handleChange = (address) => {
        setAddress(address);
    };

    const handleSelect = (address) => {
        geocodeByAddress(address).then(results => getLatLng(results[0])).then(latLng => )
    }


};

export default SearchBar;