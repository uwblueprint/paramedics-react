import React from 'react';

import { makeStyles, Typography, Box } from '@material-ui/core';
import { Warning } from '@material-ui/icons';

const useStyles = makeStyles({
  outlinedBox: {
    width: '404px',
    height: '104px',
    border: '1px solid #AC3434',
    boxSizing: 'border-box',
    borderRadius: '10px',
    paddingLeft: '26px',
    paddingTop: '17px',
    marginBottom: '61px',
  },
  warningIcon: {
    width: '22.3px',
    height: '19px',
  },
  invalidUserText: {
    display: 'inline-block',
    paddingLeft: '19.7px',
    paddingBottom: '7px',
  },
});

const InvalidUserMessage = () => {
  const classes = useStyles();
  return (
    <Box className={classes.outlinedBox}>
      <Box>
        <Warning color="error" className={classes.warningIcon} />
        <Typography
          color="error"
          className={classes.invalidUserText}
          variant="caption"
        >
          Invalid User
        </Typography>
      </Box>
      <Typography color="error" variant="caption">
        Sorry, you don’t have access to the system yet! Please see administrator
        for access.
      </Typography>
    </Box>
  );
};

export default InvalidUserMessage;
