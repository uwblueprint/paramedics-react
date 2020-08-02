import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

type CardOptions = ({ eventId: string }) => JSX.Element;

const useCardOptionsStyles = makeStyles({
  iconButtonRoot: {
    padding: 'unset',
  },
});

const CardOptions: CardOptions = ({ eventId }: { eventId: string }) => {
  const classes = useCardOptionsStyles();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEditEvent = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    event.stopPropagation();
    console.log('CLICKED!');
    history.replace(`/events/edit/${eventId}`);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        classes={{ root: classes.iconButtonRoot }}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Archive</MenuItem>
        <MenuItem onClick={handleEditEvent}>Edit</MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
    </>
  );
};

export default CardOptions;
