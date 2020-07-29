import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useCompleteBarcodeButtonStyles = makeStyles({
  root: {
    minWidth: '15rem',
    position: 'absolute',
    bottom: '2em',
    right: '3em',
  },
});

const CompleteBarcodeButton = ({
  handleClick,
}: {
  handleClick: () => any | null;
}) => {
  const classes = useCompleteBarcodeButtonStyles();
  return (
    <Button
      variant="contained"
      color="secondary"
      classes={{
        root: classes.root,
      }}
      type="submit"
      onClick={handleClick}
    >
      Next
    </Button>
  );
};

export default CompleteBarcodeButton;
