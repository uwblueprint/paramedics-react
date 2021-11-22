import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { NativeSelect, Typography } from '@material-ui/core';

const useTextFieldStyles = makeStyles({
  root: {
    boxSizing: 'border-box',
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
    marginTop: '0px',
    marginBottom: '20px',
    minHeight: '44px',
    width: '100%',
    '& label.Mui-focused': {
      color: '#2E5584',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#2E5584',
    },
  },
  wrapper: {
    border: '1px solid #E8E8E8',
    boxSizing: 'border-box',
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
    padding: '20px',
    marginTop: '0px',
    marginBottom: '20px',
    minHeight: '120px',
    width: '100%',
  },
});

const DropdownField = ({
  options,
  defaultText,
  actionText,
  label,
  optionValue,
  optionLabel,
  selected,
  onChange,
}: {
  onChangeAction?: (any) => void;
  options: any[];
  defaultText: string;
  actionText: string;
  label: string;
  selected: string;
  optionValue: string;
  optionLabel: string;
  onChange: (any) => void;
}) => {
  const classes = useTextFieldStyles();

  return (
    <div className={classes.wrapper}>
      <Typography
        variant="body1"
        style={{
          fontWeight: 'bold',
          marginBottom: '20px',
          transform: 'scale(0.75)',
          transformOrigin: 'left',
        }}
      >
        {label}
      </Typography>
      <NativeSelect
        value={selected.length === 0 ? defaultText : selected}
        onChange={onChange}
        className={classes.root}
      >
        <option>{defaultText}</option>
        {options.map((option) => {
          return <option value={option[optionValue as string]}>{option[optionLabel as string]}</option>;
        })}
        <option>{actionText}</option>
      </NativeSelect>
    </div>
  );
};

export default DropdownField;
