import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useTextFieldStyles = makeStyles({
  root: {
    border: '1px solid #E8E8E8',
    boxSizing: 'border-box',
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
    padding: '20px',
    marginBottom: '10px',
    height: '120px',
    width: '100%',
    '& .MuiInput-formControl': {
      marginTop: 'auto',
    },
    '& label': {
      fontWeight: 'bold',
      margin: '20px',
      color: 'black',
      fontSize: '18px',
    },
    '& label.Mui-focused': {
      color: '#2E5584',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#2E5584',
    },
  },
  eventForm: {
    padding: '30px',
  },
});

const FormField = ({
  label,
  placeholder,
  onChange,
  value,
  handleFocus,
}: {
  label: string;
  placeholder: string;
  onChange: (e: any) => any;
  value: string;
  handleFocus?: () => any;
}) => {
  const classes = useTextFieldStyles();

  return (
    <TextField
      label={label}
      placeholder={placeholder}
      InputLabelProps={{
        shrink: true,
      }}
      className={classes.root}
      margin="normal"
      onChange={onChange}
      value={value}
      onFocus={handleFocus}
    />
  );
};

export default FormField;
