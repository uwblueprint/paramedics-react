import React from "react";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Status } from "../../graphql/queries/patients";

const StatusPills = ({
  currentStatus,
  handleChange,
}: {
  currentStatus: Status | null;
  handleChange: (e: React.MouseEvent<HTMLElement>, newStatus: Status) => any;
}) => {
  const classes = useCompletePatientButtonStyles();
  const statuses = [
    { val: Status.ON_SITE, description: "On Site" },
    { val: Status.RELEASED, description: "Released" },
    { val: Status.TRANSPORTED, description: "Transport" },
    { val: Status.DELETED, description: "Deleted" },
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
              selected: classes.selectedPill,
            }}
            key={status.description}
          >
            <Typography variant="body2">{status.description}</Typography>
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
    color: "#2E5584",
    border: "#2E5584 solid 1px",
    marginRight: "20px",
    borderRadius: "4px",
  },
  selectedPill: {
    backgroundColor: "#C6D7EB !important",
    color: "#2E5584 !important",
    fontWeight: "bold",
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
