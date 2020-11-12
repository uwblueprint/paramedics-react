import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

import SearchBar from './SearchBar';
import { Colours } from '../../styles/Constants';

const useStyles = makeStyles({
  pinLabelField: {
    width: '334px',
    marginLeft: '16px',
    marginBottom: '30px',
  },
  label: {
    marginLeft: '16px',
    marginBottom: '16px',
  },
  title: {
    margin: '20px 0px 10px 16px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '30px',
    padding: '0px 30px 0px 16px',
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

  const handleLabelChange = (e: React.ChangeEvent<HTMLElement>) => {
    setLabel((e.target as HTMLInputElement).value);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      PaperProps={{ style: { width: '400px' } }}
    >
      <Typography variant="h4" classes={{ root: styles.title }}>
        {title}
      </Typography>
      <Typography variant="body1" classes={{ root: styles.label }}>
        {' '}
        Name:
      </Typography>
      <TextField
        placeholder="Pin name here"
        onChange={handleLabelChange}
        value={label}
        className={styles.pinLabelField}
        required
      />
      <Typography variant="body1" classes={{ root: styles.label }}>
        {' '}
        Pin Location:
      </Typography>
      <SearchBar />
      <Container classes={{ root: styles.buttonContainer }}>
        <Button style={{ color: Colours.Secondary }}> Cancel </Button>
        <Button variant="contained" color="secondary">Complete</Button>
      </Container>
    </Drawer>
  );
};

export default Sidebar;
