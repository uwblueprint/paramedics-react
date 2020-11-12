import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import SearchBar from './SearchBar';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
  root: {
    width: '400px',
  },
  pinLabelField: {
    width: '250px',
    marginLeft: '10px',
  }
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
      <Typography> Name:  </Typography>
      <TextField
        placeholder="Pin name here"
        onChange={handleLabelChange}
        value={label}
        className={styles.pinLabelField}
      />
      <Typography> Pin Location:</Typography>
      <SearchBar />
    </Drawer>
  );
};

export default Sidebar;
