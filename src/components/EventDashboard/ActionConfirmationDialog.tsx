import React from 'react';
import {
  makeStyles,
  Button,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { Colours } from '../../styles/Constants';
import { TabOptions } from './EventDashboardPage';
import { ResourceData, HospitalData, AmbulanceData } from './ResourceTabPanel';

interface ActionConfirmationDialogProps {
  open: boolean;
  type: TabOptions.Hospital | TabOptions.Ambulance;
  handleClose: () => void;
  handleAdd: () => void;
  handleDelete: () => void;
  includeOrExclude: 'include' | 'exclude' | null;
  selected: ResourceData[];
}

const useStyles = makeStyles({
  list: { marginLeft: '56px' },
  listItem: {
    display: 'list-item',
    listStyle: 'disc outside none',
  },
  listItemText: {
    color: Colours.Secondary,
  },
  dialogActions: { padding: '24px' },
});

export const ActionConfirmationDialog = (
  props: ActionConfirmationDialogProps
) => {
  const {
    open,
    type,
    handleClose,
    handleAdd,
    handleDelete,
    includeOrExclude,
    selected,
  } = props;

  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {`${includeOrExclude === 'include' ? 'Include' : 'Exclude'} ${
          type === TabOptions.Hospital ? 'Hospitals' : 'Ambulances'
        }`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          variant="body2"
          color="textPrimary"
        >
          {`Are you sure you want to ${includeOrExclude} the following ${
            type === TabOptions.Hospital ? 'hospital' : 'ambulance'
          }${selected.length > 1 ? 's' : ''}?`}
        </DialogContentText>
      </DialogContent>
      <List dense className={classes.list}>
        {type === TabOptions.Hospital &&
          (selected as HospitalData[]).map((resource: HospitalData) => (
            <ListItem className={classes.listItem}>
              <ListItemText
                primary={resource.name}
                primaryTypographyProps={{ variant: 'body1' }}
                className={classes.listItemText}
              />
            </ListItem>
          ))}
        {type === TabOptions.Ambulance &&
          (selected as AmbulanceData[]).map((resource: AmbulanceData) => (
            <ListItem className={classes.listItem}>
              <ListItemText
                primary={resource.vehicleNumber}
                primaryTypographyProps={{ variant: 'body1' }}
                className={classes.listItemText}
              />
            </ListItem>
          ))}
      </List>
      <DialogActions className={classes.dialogActions}>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={includeOrExclude === 'include' ? handleAdd : handleDelete}
          color="primary"
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
