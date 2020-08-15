import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import ConfirmModal from '../common/ConfirmModal';

type CardOptions = ({
  eventId,
  eventTitle,
  handleArchiveEvent,
  handleDeleteEvent,
  isActive,
  handleUnarchiveEvent,
}: {
  eventId: string;
  eventTitle: string;
  handleArchiveEvent: () => void;
  handleDeleteEvent: () => void;
  isActive: boolean;
  handleUnarchiveEvent: () => void;
}) => JSX.Element;

const useCardOptionsStyles = makeStyles({
  iconButtonRoot: {
    padding: 'unset',
  },
});

const CardOptions: CardOptions = ({
  eventId,
  eventTitle,
  handleArchiveEvent,
  handleUnarchiveEvent,
  isActive,
  handleDeleteEvent,
}: {
  eventId: string;
  eventTitle: string;
  handleArchiveEvent: () => void;
  handleUnarchiveEvent: () => void;
  isActive: boolean;
  handleDeleteEvent: () => void;
}) => {
  const classes = useCardOptionsStyles();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [openArchiveDialog, setOpenArchiveDialog] = useState(false);
  const [openUnarchiveDialog, setOpenUnarchiveDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };
  const handleEditEvent = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    event.stopPropagation();
    history.replace(`/events/edit/${eventId}`);
  };
  const handleOpenArchiveDialog = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setOpenArchiveDialog(true);
  };
  const handleOpenUnarchiveDialog = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setOpenUnarchiveDialog(true);
  };
  const handleOpenDeleteDialog = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setOpenDeleteDialog(true);
  };

  if (isActive) {
    return (
      <>
        <ConfirmModal
          open={openArchiveDialog}
          title="Are you sure you want to archive the following event?"
          actionLabel="Archive"
          actionLabelStatus="secondary"
          handleClickAction={handleArchiveEvent}
          handleClickCancel={() => setOpenArchiveDialog(false)}
          body={`${eventTitle} will be moved into the Archived Events tab.`}
        />
        <ConfirmModal
          open={openDeleteDialog}
          title="Are you sure you want to delete the following event?"
          actionLabel="Delete"
          handleClickAction={handleDeleteEvent}
          handleClickCancel={() => setOpenDeleteDialog(false)}
          body={`${eventTitle} cannot be recovered when deleted.`}
        />
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
          <MenuItem onClick={handleOpenArchiveDialog}>Archive</MenuItem>
          <MenuItem onClick={handleEditEvent}>Edit</MenuItem>
          <MenuItem onClick={handleOpenDeleteDialog}>Delete</MenuItem>
        </Menu>
      </>
    );
  } else {
    return (
      <>
        <ConfirmModal
          open={openUnarchiveDialog}
          title="Are you sure you want to unarchive the following event?"
          actionLabel="Unarchive"
          actionLabelStatus="secondary"
          handleClickAction={handleUnarchiveEvent}
          handleClickCancel={() => setOpenUnarchiveDialog(false)}
          body={`${eventTitle} will be moved into the Current Events tab.`}
        />

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
          <MenuItem onClick={handleOpenUnarchiveDialog}>Unarchive</MenuItem>
        </Menu>
      </>
    );
  }
};

export default CardOptions;
