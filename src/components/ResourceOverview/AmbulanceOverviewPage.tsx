import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-apollo';
import { useMutation } from '@apollo/react-hooks';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddResourceButton from './AddResourceButton';
import { useAllAmbulances } from '../../graphql/queries/hooks/ambulances';
import {
  GET_ALL_AMBULANCES,
  Ambulance,
} from '../../graphql/queries/ambulances';
import { DELETE_AMBULANCE } from '../../graphql/mutations/ambulances';
import { Colours } from '../../styles/Constants';

const pStyles = makeStyles({
  body2: {
    marginTop: 18,
    color: Colours.SecondaryGray,
  },
});

const tableStyles = makeStyles({
  root: {
    backgroundColor: Colours.White,
    marginTop: 24,
    border: '1px solid #CCCCCC',
  },
});

const headerRow = makeStyles({
  root: {
    color: 'black',
    fontWeight: 600,
    fontSize: 14,
    paddingTop: 17,
    paddingBottom: 17,
    paddingLeft: 32,
    paddingRight: 32,
  },
});

const dataRow = makeStyles({
  root: {
    color: 'black',
    fontWeight: 400,
    fontSize: 14,
    paddingTop: 16.5,
    paddingBottom: 16.5,
    paddingLeft: 32,
    paddingRight: 32,
  },
});

const options = makeStyles({
  root: {
    textAlign: 'right',
  },
  menuCell: {
    borderBottom: 0,
  },
  menuHover: {
    borderRadius: '4px 4px 4px 4px',
  },
  menuDelete: {
    color: '#9B2F2F',
  },
});

const dialogStyles = makeStyles({
  paper: {
    width: 485,
    height: 280,
  },
  dialogContent: {
    paddingLeft: 24,
    paddingTop: 24,
    paddingRight: 24,
  },
  dialogTitle: {
    paddingLeft: 24,
    paddingTop: 24,
    paddingRight: 24,
    paddingBottom: 0,
  },
  dialogCancel: {
    color: Colours.Secondary,
    height: 48,
    width: 107,
  },
  dialogDelete: {
    color: Colours.Danger,
    height: 48,
    width: 107,
  },
  dialogActionSpacing: {
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
});

const useLayout = makeStyles({
  wrapper: {
    backgroundColor: '#f0f0f0',
    padding: '56px',
    minHeight: '100vh',
  },
  tablePopper: {
    minWidth: '159px',
    height: '112px',
    backgroundColor: Colours.White,
    borderRadius: '4px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
  },
  addResourceContainer: {
    position: 'fixed',
    right: '48px',
    bottom: '48px',
  },
});

const AmbulanceOverviewPage: React.FC = () => {
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedAmbulance, selectAmbulance] = React.useState<number>(-1);

  // Update cache
  useAllAmbulances();

  // Read newly updated cache
  const { data } = useQuery(GET_ALL_AMBULANCES);

  const ambulances: Array<Ambulance> = data ? data.ambulances : [];

  //  Writing to cache when deleting user
  const [deleteAmbulance] = useMutation(DELETE_AMBULANCE, {
    update(cache) {
      let { ambulances } = cache.readQuery<any>({
        query: GET_ALL_AMBULANCES,
      });

      setAnchorEl(null);

      const filtered = ambulances.filter(
        (ambulance) => ambulance.id !== selectedAmbulance
      );
      ambulances = filtered;
      cache.writeQuery({
        query: GET_ALL_AMBULANCES,
        data: { ambulances },
      });
    },
  });

  const handleClickOptions = (event) => {
    selectAmbulance(event.currentTarget.getAttribute('data-id'));
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const history = useHistory();
  const handleClickEdit = () => {
    const ambulanceId = selectedAmbulance;
    history.replace(`/manage/ambulances/edit/${ambulanceId}`);
  };

  const handleClickDelete = () => {
    const ambulanceId = selectedAmbulance;
    deleteAmbulance({ variables: { id: ambulanceId } });
    setOpenModal(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const paraStyle = pStyles();
  const classes = useLayout();
  const hRow = headerRow();
  const table = tableStyles();
  const dRow = dataRow();
  const optionBtn = options();
  const dialogStyle = dialogStyles();

  const cells = ambulances.map((ambulance: Ambulance) => {
    return (
      <TableRow key={ambulance.id}>
        <TableCell classes={{ root: dRow.root }}>
          {`#${ambulance.vehicleNumber}`}
        </TableCell>
        <TableCell classes={{ root: optionBtn.root }}>
          <IconButton data-id={ambulance.id} onClick={handleClickOptions}>
            <MoreHorizIcon style={{ color: Colours.Black }} />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  });

  return (
    <div className={classes.wrapper}>
      <Typography variant="h5">Ambulance Overview</Typography>
      <Typography variant="body2" classes={{ body2: paraStyle.body2 }}>
        A list of all ambulances that can be added to an event.
      </Typography>
      <TableContainer>
        <Table classes={{ root: table.root }}>
          <TableHead>
            <TableRow>
              <TableCell classes={{ root: hRow.root }}>
                Ambulance number
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {cells}
            <Popper
              id={id}
              open={open}
              popperOptions={{
                modifiers: { offset: { enabled: true, offset: '-69.5,0' } },
              }}
              anchorEl={anchorEl}
            >
              <div>
                <Table className={classes.tablePopper}>
                  <TableBody>
                    <TableRow
                      hover
                      classes={{ hover: optionBtn.menuHover }}
                      onClick={handleClickEdit}
                    >
                      <TableCell classes={{ root: optionBtn.menuCell }}>
                        <Typography variant="body2">Edit</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow hover onClick={() => setOpenModal(true)}>
                      <TableCell classes={{ root: optionBtn.menuDelete }}>
                        <Typography variant="body2">Delete</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Popper>
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog classes={{ paper: dialogStyle.paper }} open={openModal}>
        <DialogTitle classes={{ root: dialogStyle.dialogTitle }}>
          <Typography variant="h6">
            <strong>You are about to delete a team member.</strong>
          </Typography>
        </DialogTitle>
        <DialogContent classes={{ root: dialogStyle.dialogContent }}>
          <Typography variant="body2">
            Deleted team members will no longer have access to any casualty
            collection points.
          </Typography>
        </DialogContent>
        <DialogActions classes={{ spacing: dialogStyle.dialogActionSpacing }}>
          <Button
            classes={{ root: dialogStyle.dialogCancel }}
            onClick={() => setOpenModal(false)}
          >
            <Typography variant="body1">Cancel</Typography>
          </Button>
          <Button
            classes={{ root: dialogStyle.dialogDelete }}
            onClick={handleClickDelete}
          >
            <Typography variant="body1">Delete</Typography>
          </Button>
        </DialogActions>
      </Dialog>
      <div className={classes.addResourceContainer}>
        <AddResourceButton
          label="Add Ambulance"
          route="/manage/ambulances/new"
        />
      </div>
    </div>
  );
};

export default AmbulanceOverviewPage;
