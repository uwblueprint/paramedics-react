import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Colours } from '../../styles/Constants';

const useEventButtonStyles = makeStyles({
  root: {
    minWidth: '228px',
    margin: '10px 0',
    fontSize: '18px',
    color: Colours.White,
    backgroundColor: Colours.Secondary,
  },
  disabled: {
    cursor: 'not-allowed !important',
    'pointer-events': 'all !important',
  },
});

const CompleteButton: React.FC<{
  disabled: boolean;
  buttonText: string;
}> = ({ disabled, buttonText }: { disabled: boolean; buttonText: string }) => {
  const classes = useEventButtonStyles();
  return (
    <Button
      variant="contained"
      classes={{
        root: classes.root,
        disabled: classes.disabled,
      }}
      disabled={disabled}
      type="submit"
    >
      {buttonText}
    </Button>
  );
};

export default CompleteButton;
