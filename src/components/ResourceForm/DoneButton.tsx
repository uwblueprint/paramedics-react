import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useDoneButtonStyles = makeStyles({
  root: {
    minWidth: '228px',
    fontSize: '18px',
    marginTop: '10px',
    position: 'absolute',
    right: '30px',
  },
  disabled: {
    cursor: 'not-allowed !important',
    'pointer-events': 'all !important',
  },
});

const DoneButton = ({
  handleClick,
  disabled,
}: {
  handleClick?: () => void;
  disabled?: boolean;
}) => {
  const classes = useDoneButtonStyles();
  return (
    <Button
      color="secondary"
      variant="contained"
      onClick={handleClick}
      disabled={disabled}
      type="submit"
      classes={{
        root: classes.root,
        disabled: classes.disabled,
      }}
    >
      Done
    </Button>
  );
};

export default DoneButton;
