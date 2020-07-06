import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useEventButtonStyles = makeStyles({
  root: {
    minWidth: '15rem',
    minHeight: '2.5rem',
    fontSize: '18px',
  },
});

const BackButton = ({ handleClick }: { handleClick: () => any | null }) => {
  const classes = useEventButtonStyles();
  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={handleClick}
      classes={{
        root: classes.root,
      }}
    >
      Back
    </Button>
  );
};

export default BackButton;
