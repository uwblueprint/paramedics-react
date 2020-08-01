import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Typography, IconButton } from '@material-ui/core';
import Popper from '@material-ui/core/Popper';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from 'react-apollo';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddResourceButton from '../ResourceOverview/AddResourceButton';
import { useAllHospitals } from '../../graphql/queries/hooks/hospitals';
import { GET_ALL_HOSPITALS, Hospital } from '../../graphql/queries/hospitals';
import { DELETE_HOSPITAL } from '../../graphql/mutations/hospitals';
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

const HospitalOverviewPage: React.FC = () => {
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedHospital, selectHospital] = React.useState<number>(-1);

  // Update cache
  useAllHospitals();

  // Read newly updated cache
  const { data } = useQuery(GET_ALL_HOSPITALS);

  const hospitals: Array<Hospital> = data ? data.hospitals : [];

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const classes = pStyles();
  const hRow = headerRow();
  const table = tableStyles();
  const dRow = dataRow();
  const optionBtn = options();
  const dialogStyle = dialogStyles();

  //  Writing to cache when deleting user
  const [deleteHospital] = useMutation(DELETE_HOSPITAL, {
    update(cache) {
      let { hospitals } = cache.readQuery<null | any>({
        query: GET_ALL_HOSPITALS,
      });

      setAnchorEl(null);

      const filtered = hospitals.filter(
        (hospital) => hospital.id !== selectedHospital
      );
      hospitals = filtered;
      cache.writeQuery({
        query: GET_ALL_HOSPITALS,
        data: { hospitals },
      });
    },
  });

  const handleClickOptions = (event) => {
    selectHospital(event.currentTarget.getAttribute('data-id'));
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const history = useHistory();
  const handleClickEdit = () => {
    const hospitalId = selectedHospital;
    history.replace(`/manage/hospitals/edit/${hospitalId}`);
  };

  const handleClickDelete = () => {
    const hospitalId = selectedHospital;
    deleteHospital({ variables: { id: hospitalId } });
    setOpenModal(false);

  };

  let cells;
  cells = hospitals.map((hospital: Hospital) => {
    return (
      <TableRow>
        <TableCell classes={{ root: dRow.root }}>{hospital.name}</TableCell>
        <TableCell classes={{ root: optionBtn.root }}>
          <IconButton data-id={hospital.id} onClick={handleClickOptions}>
            <MoreHorizIcon style={{ color: Colours.Black }} />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  });

  return (
    <div className="member-wrapper">
      <Typography variant="h5">Hospital Overview</Typography>
      <Typography variant="body2" classes={{ body2: classes.body2 }}>
        A list of all hospitals that can be added to an event.
      </Typography>

      <TableContainer>
        <Table classes={{ root: table.root }}>
          <TableHead>
            <TableRow>
              <TableCell classes={{ root: hRow.root }}>Hospital Name</TableCell>
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
                <Table className="table-popper">
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
      <div className="add-resource-container">
        <AddResourceButton label="Add Hospital" route="/manage/hospitals/new" />
      </div>
    </div>
  );
};

export default HospitalOverviewPage;