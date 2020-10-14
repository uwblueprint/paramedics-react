import React from 'react';
import { Typography, IconButton } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
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
import AddResourceButton from './AddResourceButton';
import ConfirmModal from '../common/ConfirmModal';
import OptionPopper, { Option } from '../common/OptionPopper';

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
    color: Colours.Black,
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
    color: Colours.Black,
    fontWeight: 400,
    fontSize: 14,
    paddingTop: 16.5,
    paddingBottom: 16.5,
    paddingLeft: 32,
    paddingRight: 32,
  },
});

const optionStyles = makeStyles({
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
    color: Colours.DangerHover,
  },
});

const useLayout = makeStyles({
  wrapper: {
    backgroundColor: '#f0f0f0',
    padding: '56px',
    paddingTop: '180px',
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

const HospitalOverviewPage: React.FC = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedHospital, selectHospital] = React.useState<number>(-1);

  // Update cache
  useAllHospitals();

  // Read newly updated cache
  const { data } = useQuery(GET_ALL_HOSPITALS);

  const hospitals: Array<Hospital> = data ? data.hospitals : [];

  const open = Boolean(anchorEl);

  const paraStyle = pStyles();
  const classes = useLayout();
  const hRow = headerRow();
  const table = tableStyles();
  const dRow = dataRow();
  const optionStyle = optionStyles();

  const handleCloseConfirmDelete = () => {
    setAnchorEl(null);
    setOpenModal(false);
  };

  //  Writing to cache when deleting user
  const [deleteHospital] = useMutation(DELETE_HOSPITAL, {
    update(cache, { data: { deleteHospital } }) {
      if (!deleteHospital) {
        return;
      }
      let { hospitals } = cache.readQuery<null | any>({
        query: GET_ALL_HOSPITALS,
      });

      setAnchorEl(null);

      const filtered = hospitals.filter(
        (hospital) => hospital.id !== deleteHospital
      );
      hospitals = filtered;
      cache.writeQuery({
        query: GET_ALL_HOSPITALS,
        data: { hospitals },
      });
    },
    onCompleted() {
      handleCloseConfirmDelete();
      enqueueSnackbar('Hospital deleted.');
    },
  });

  const handleClickOptions = (event) => {
    selectHospital(event.currentTarget.getAttribute('data-id'));
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickEdit = () => {
    const hospitalId = selectedHospital;
    history.replace(`/manage/hospitals/edit/${hospitalId}`);
  };

  const handleClickDelete = () => {
    const hospitalId = selectedHospital;
    deleteHospital({ variables: { id: hospitalId } });
  };

  const handleDeleteOption = () => {
    setOpenModal(true);
  };

  const options: Array<Option> = [
    {
      styles: optionStyle.menuCell,
      onClick: handleClickEdit,
      name: 'Edit',
    },
    {
      styles: optionStyle.menuDelete,
      onClick: handleDeleteOption,
      name: 'Delete',
    },
  ];

  const cells = hospitals.map((hospital: Hospital) => {
    return (
      <TableRow key={hospital.id}>
        <TableCell classes={{ root: dRow.root }}>{hospital.name}</TableCell>
        <TableCell classes={{ root: optionStyle.root }}>
          <IconButton data-id={hospital.id} onClick={handleClickOptions}>
            <MoreHorizIcon style={{ color: Colours.Black }} />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  });

  return (
    <div className={classes.wrapper}>
      <Typography variant="h5">Hospital Overview</Typography>
      <Typography variant="body2" classes={{ body2: paraStyle.body2 }}>
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
            <OptionPopper
              id={String(selectedHospital)}
              open={open}
              anchorEl={anchorEl}
              onClickAway={() => {
                setAnchorEl(null);
              }}
              options={options}
            />
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmModal
        open={openModal}
        isActionDelete
        title="You are about to delete a hospital."
        body="Supervisors will no longer be able to transport patients at CCPS connected to this hospital."
        actionLabel="Delete"
        handleClickAction={handleClickDelete}
        handleClickCancel={handleCloseConfirmDelete}
      />
      <div className={classes.addResourceContainer}>
        <AddResourceButton label="Add Hospital" route="/manage/hospitals/new" />
      </div>
    </div>
  );
};

export default HospitalOverviewPage;
