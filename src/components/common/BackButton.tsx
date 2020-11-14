import React from 'react';
import { Button, makeStyles } from '@material-ui/core';

const useBackButtonStyles = makeStyles({
  root: {
    minWidth: '228px',
    fontSize: '18px',
    marginRight: '30px',
  },
});

const BackButton = ({ onClick }: { onClick: () => void }) => {
  const classes = useBackButtonStyles();
  return (
    <Button
      classes={{
        root: classes.root,
      }}
      color="secondary"
      variant="outlined"
      onClick={onClick}
    >
      Back
    </Button>
  );
};

export default BackButton;
