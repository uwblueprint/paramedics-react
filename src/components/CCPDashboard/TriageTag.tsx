import React from 'react';
import { Colours } from "../../styles/Constants";
import {
  Box,
  Typography,
  makeStyles,
} from "@material-ui/core";
import {
  TriageLevel,
} from "../../graphql/queries/templates/patients";

interface TriageTagProps {
  colour: Colours;
  triageLevel: TriageLevel;
  label: string;
  count: number;
}

const useTriageTagStyles = makeStyles({
  root: {
    boxSizing: "border-box",
    backgroundColor: Colours.BackgroundGray,
    borderRadius: "0 8px 8px 0",
    height: "96px",
    width: "88px",
    marginRight: "25px",
    "&:last-child": { marginRight: 0 },
    padding: "16px",
  },
});

export const TriageTag = (props: TriageTagProps) => {
  const classes = useTriageTagStyles();
  const { colour, triageLevel, count, label } = props;

  return (
    <Box className={classes.root} style={{ borderLeft: `8px solid ${colour}` }}>
      <Typography variant="body2" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="h4">{count}</Typography>
    </Box>
  );
};