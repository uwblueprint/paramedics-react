import React from "react";
import { makeStyles, Button } from "@material-ui/core";
import { Colours } from "../../styles/Constants";
import { ScanIcon } from "../common/ScanIcon";
import { NavLink, useHistory } from "react-router-dom";

const useStyles = makeStyles({
  icon: {
    marginRight: "9px",
  },
  scanButton: {
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
    borderRadius: "2000px",
    position: "fixed",
    bottom: "56px",
    right: "56px",
    padding: "12px 26px",
  },
});

export const ScanPatientButton = () => {
  const classes = useStyles();
  const history = useHistory();
  const { pathname } = history.location;

  return (
    <Button
      className={classes.scanButton}
      variant="contained"
      color="secondary"
      component={NavLink}
      to={`${pathname}/scan`}
    >
      <ScanIcon colour={Colours.White} classes={classes.icon} />
      Scan Patient
    </Button>
  );
};
