import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

const FormField = ({
    label,
    placeholder,
    onChange,
    value,
}: {
    label: string;
    placeholder: string;
    onChange: (e: any) => any;
    value: string;
}) => {
    const classes = useTextFieldStyles();

    return (
        <TextField
            label={<Typography className={classes.label}>
                {label}
            </Typography>}
            placeholder={placeholder}
            InputLabelProps={{
                shrink: true,
            }}
            className={classes.root}
            margin="normal"
        // onClick={classes}
        />
    )
}

const useTextFieldStyles = makeStyles({
    root: {
        border: "1px solid #E8E8E8",
        boxSizing: "border-box",
        borderRadius: "10px",
        backgroundColor: "#FFFFFF",
        padding: "20px",
        marginBottom: "10px",
        width: "100%",
    },
    rootClicked: {
        border: "1px solid #E8E8E8",
        boxSizing: "border-box",
        borderRadius: "10px",
        backgroundColor: "",
        padding: "20px",
        marginBottom: "10px",
        width: "100%",
    },
    label: {
        color: "black",
        margin: "20px",
        fontWeight: "bold",
    },
    eventForm: {
        padding: "30px"
    }
});

export default FormField;