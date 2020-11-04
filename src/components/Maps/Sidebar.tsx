import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';

import FormField from '../common/FormField';
import SearchBar from './SearchBar';

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
  const [label, setLabel] = React.useState('');

  // const handleAddressChange = (address) => {
  //   setAddress(address);
  // };

  // const handleAddressSelect = (address) => {
  //   geocodeByAddress(address).then((results) => getLatLng(results[0]));
  // };

  const handleLabelChange = (e: React.ChangeEvent<HTMLElement>) => {
    setLabel((e.target as HTMLInputElement).value);
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <Typography>{title}</Typography>
      {/* <FormField
        label="Pin Label: "
        placeholder="Enter label"
        onChange={handleLabelChange}
        value={title || ''}
        isValidated={false}
      /> */}
      <SearchBar />
    </Drawer>
  );
};

export default Sidebar;
