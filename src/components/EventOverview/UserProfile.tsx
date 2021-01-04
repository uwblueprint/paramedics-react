import React, { useState } from 'react';
import { useHistory } from 'react-router';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { makeStyles } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles({
  iconWrapper: {
    display: 'flex',
    marginLeft: 'auto',
    alignSelf: 'center',
    cursor: 'pointer',
  },
});

const UserProfile = () => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };
  const handleResourceManagementClick = (event) => {
    event.stopPropagation();
    history.replace('/manage/members');
  };
  const handleLogoutClick = (event) => {
    event.stopPropagation();
    // TODO: Logout
  };

  const classes = useStyles();
  return (
    <div
      className={classes.iconWrapper}
      onKeyDown={handleClick}
      onClick={handleClick}
      tabIndex={0}
      role="button"
    >
      <Typography variant="h6" align="right" style={{ marginRight: '10px' }}>
        Joe Li
      </Typography>
      <AccountCircleIcon fontSize="large" color="secondary" />
      <Menu
        id="user-profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={handleResourceManagementClick}>
          Resource management
        </MenuItem>
        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default UserProfile;
