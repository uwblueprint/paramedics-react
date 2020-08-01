import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Colours } from '../../styles/Constants';

const useSnackbarStyle = makeStyles({
  content: {
    minWidth: 0,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 24,
    paddingRight: 24,
  },
  anchorOriginBottomCenter: {
    backgroundColor: Colours.Black,
    borderRadius: 0,
    minWidth: 0,
  },
});

const ResourceSnackbars = () => {
  const classes = useSnackbarStyle();

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClick}>Open simple snackbar</Button>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={open}
        classes={{ root: classes.anchorOriginBottomCenter }}
        onClose={handleClose}
        key="hospital_added"
      >
        <SnackbarContent
          message="Hospital Added."
          classes={{ root: classes.content }}
        />
      </Snackbar>
    </div>
  );
};

export default ResourceSnackbars;
