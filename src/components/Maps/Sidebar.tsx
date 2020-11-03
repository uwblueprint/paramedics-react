import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

import FormField from '../common/FormField';

const Sidebar = ({
  open,
  title,
  onClose,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
}) => {
  const [address, setAddress] = React.useState('');
  const [title, setTitle] = React.useState('');

  const handleAddressChange = (address) => {
    setAddress(address);
  };

  const handleAddressSelect = (address) => {
    geocodeByAddress(address).then((results) => getLatLng(results[0]));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLElement>) => {
    setTitle((e.target as HTMLInputElement).value);
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <Typography>{title}</Typography>
      <FormField
        label="Pin Label: "
        placeholder="Enter label"
        onChange={handleTitleChange}
        value={title || ''}
        isValidated={true}
      />
    </Drawer>
  );
};

export default Sidebar;
