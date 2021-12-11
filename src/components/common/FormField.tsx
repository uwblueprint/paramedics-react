import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

const useTextFieldStyles = makeStyles({
  root: {
    border: '1px solid #E8E8E8',
    boxSizing: 'border-box',
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
    padding: '20px',
    marginTop: '0px',
    marginBottom: '20px',
    minHeight: '120px',
    width: '100%',
    '& .MuiInput-formControl': {
      marginTop: 'auto',
    },
    '& .MuiInputBase-multiline': {
      marginTop: '43.625px',
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

const FormField: React.FC<{
  label: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLElement>) => void;
  value: string;
  handleFocus?: () => void;
  isValidated: boolean;
  validators?: Array<string>;
  errorMessages?: Array<string>;
  readOnly?: boolean;
  disabled?: boolean;
  numeric?: boolean;
  onValid?: (boolean) => void;
  isMultiline?: boolean;
}> = ({
  label,
  placeholder,
  onChange,
  value,
  handleFocus,
  isValidated,
  validators,
  errorMessages,
  readOnly,
  disabled,
  numeric,
  onValid,
  isMultiline,
}: {
  label: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLElement>) => void;
  value: string | number | null;
  handleFocus?: () => void;
  isValidated: boolean;
  validators?: Array<string>;
  errorMessages?: Array<string>;
  readOnly?: boolean;
  disabled?: boolean;
  numeric?: boolean;
  onValid?: (boolean) => void;
  isMultiline?: boolean;
}) => {
  const classes = useTextFieldStyles();
  if (isValidated) {
    return (
      <ValidatorForm>
        <TextValidator
          label={label}
          placeholder={placeholder}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            readOnly,
          }}
          disabled={disabled}
          className={classes.root}
          margin="normal"
          onChange={onChange}
          value={value}
          onFocus={handleFocus}
          validators={validators}
          errorMessages={errorMessages}
          validatorListener={onValid}
          multiline={isMultiline}
        />
      </ValidatorForm>
    );
  }
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{
        readOnly,
        inputMode: numeric ? 'numeric' : 'text',
      }}
      disabled={disabled}
      className={classes.root}
      margin="normal"
      onChange={onChange}
      value={value}
      onFocus={handleFocus}
      multiline={isMultiline}
    />
  );
};

export default FormField;
