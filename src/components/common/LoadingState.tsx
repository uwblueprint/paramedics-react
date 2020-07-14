import React from "react";
import { Box, Typography, makeStyles } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles({
  center: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
});

const LoadingState = () => {
  const classes = useStyles();

  return (
    <Box className={classes.center} flexWrap="wrap">
      <Box display="flex" justifyContent="center" marginBottom="15px">
        <CircularProgress color="secondary" />
      </Box>
      <Typography variant="body2" color="textSecondary">
        Loading content...
      </Typography>
    </Box>
  );
};

export default LoadingState;
