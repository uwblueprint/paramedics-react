import React from "react";
import Button from "@material-ui/core/Button";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const CancelButton = ({
    to,
}: {
    to: string;
}) => {
    const classes = useCancelButtonStyles();
    return (
        <Button
            color="secondary"
            classes={{
                root: classes.root,
            }}
            component={NavLink}
            to={to}
        >
            Cancel
        </Button>
    );
};

const useCancelButtonStyles = makeStyles({
    root: {
        minWidth: "160px",
        minHeight: "40px",
        fontSize: "18px",
    },
});

export default CancelButton;
