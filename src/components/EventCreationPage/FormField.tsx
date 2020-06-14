import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const FormField = ({
  label,
  placeholder,
  onChange,
  value,
  handleClick,
}: {
  label: string;
  placeholder: string;
  onChange: (e: any) => any;
  value: string;
  handleClick?: () => any;
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
      onClick={handleClick}
    />
  );
};

const useTextFieldStyles = makeStyles({
  root: {
    border: "1px solid #E8E8E8",
    boxSizing: "border-box",
    borderRadius: "10px",
    backgroundColor: "#FFFFFF",
    padding: "20px",
    marginBottom: "10px",
    height: "15vh",
    width: "100%",
    '& .MuiInput-formControl': {
      marginTop: "auto"
    },
    '& label': {
      fontWeight: "bold",
      margin: "20px",
      color: "black",
      fontSize: "18px"
    },
    '& label.Mui-focused': {
      color: '#2E5584',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#2E5584',
    },
  },
  eventForm: {
    padding: "30px",
  },
});

export default FormField;
