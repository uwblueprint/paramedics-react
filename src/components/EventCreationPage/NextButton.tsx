import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useEventButtonStyles = makeStyles({
  root: {
    minWidth: '15rem',
    minHeight: '2.5rem',
    fontSize: '18px',
  },
  disabled: {
    cursor: 'not-allowed !important',
    'pointer-events': 'all !important',
  },
});

const NextButton = ({
  handleClick,
  disabled,
  buttonText,
}: {
  handleClick: () => any | null;
  disabled: boolean;
  buttonText: string;
}) => {
  const classes = useEventButtonStyles();
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      classes={{
        root: classes.root,
        disabled: classes.disabled,
      }}
      disabled={disabled}
    >
      {buttonText}
    </Button>
  );
};

export default NextButton;
