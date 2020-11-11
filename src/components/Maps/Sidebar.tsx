import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';

import FormField from '../common/FormField';
import SearchBar from './SearchBar';

const useStyles = makeStyles({
  root: {
    width: '300px',
  },
});

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
  const styles = useStyles();

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
    <Drawer
      open={open}
      onClose={onClose}
      PaperProps={{ style: { width: '300px' } }}
    >
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
