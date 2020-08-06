import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Colours } from '../../styles/Constants';

const useEventButtonStyles = makeStyles({
  root: {
    minWidth: '228px',
    minHeight: '48px',
    fontSize: '18px',
    color: Colours.White,
    backgroundColor: Colours.Secondary,
  },
  disabled: {
    cursor: 'not-allowed !important',
    'pointer-events': 'all !important',
  },
});

const NextButton: React.FC<{
  handleClick: () => void;
  disabled: boolean;
  buttonText: string;
}> = ({
  handleClick,
  disabled,
  buttonText,
}: {
  handleClick: () => void;
  disabled: boolean;
  buttonText: string;
}) => {
  const classes = useEventButtonStyles();
  return (
    <Button
      variant="contained"
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
