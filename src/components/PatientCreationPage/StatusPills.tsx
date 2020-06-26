import React from "react";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { status } from "../../graphql/queries/templates/patients";

const StatusPills = ({
  currentStatus,
  handleChange,
}: {
  currentStatus: status | null;
  handleChange: (e: React.MouseEvent<HTMLElement>, newStatus: status) => any;
}) => {
  const classes = useCompletePatientButtonStyles();
  //const statuses = ["Transport", "Release", "Omit", "Delete"];
  const statuses = [
    { val: status.ON_SITE, description: "On Site" },
    { val: status.RELEASED, description: "Released" },
    { val: status.TRANSPORTED, description: "Transport" },
  ];
  return (
    <Container className={classes.root}>
      <Typography className={classes.label}>Status:</Typography>

      <ToggleButtonGroup
        value={currentStatus}
        exclusive
        onChange={handleChange}
        aria-label="text alignment"
        classes={{
          groupedHorizontal: classes.buttonGroup,
        }}
      >
        {statuses.map((status) => (
          <ToggleButton
            value={status.val}
            classes={{
              root: classes.statusPill,
            }}
          >
            {status.description}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Container>
  );
};

const useCompletePatientButtonStyles = makeStyles({
  root: {
    border: "1px solid #E8E8E8",
    boxSizing: "border-box",
    borderRadius: "10px",
    backgroundColor: "#FFFFFF",
    padding: "0",
    marginBottom: "10px",
    maxHeight: "15vh",
    width: "100%",
    maxWidth: "100%",
    "& .MuiInput-formControl": {
      marginTop: "auto",
    },
  },
  label: {
    fontWeight: "bold",
    margin: "20px",
    color: "black",
    fontSize: "18px",
    display: "inline-block",
    transform: "translate(0, 1.5px) scale(0.75)",
  },
  statusPill: {
    color: "#3f51b5",
    border: "#3f51b5 solid 1px",
    marginRight: "20px",
    borderRadius: "4px",
  },
  buttonGroup: {
    "&:not(:first-child)": {
      border: "#3f51b5 solid 1px",
      borderRadius: "4px",
    },
    "&:not(:last-child)": {
      borderRadius: "4px",
    },
  },
});

export default StatusPills;
