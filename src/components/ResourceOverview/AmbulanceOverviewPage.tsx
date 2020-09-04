import React from 'react';
import { Typography, IconButton } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useQuery } from 'react-apollo';
import { useMutation } from '@apollo/react-hooks';
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
  const { enqueueSnackbar } = useSnackbar();
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
    update(cache, { data: { deleteAmbulance } }) {
      if (!deleteAmbulance) {
        return;
      }
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
    setAnchorEl(null);
    setOpenModal(false);
    enqueueSnackbar('Ambulance deleted.');
  };

  const handleDeleteOption = () => {
    setOpenModal(true);
  };

  const handleClickCancel = () => {
    setAnchorEl(null);
    setOpenModal(false);
  };

  const open = Boolean(anchorEl);
  const paraStyle = pStyles();
  const classes = useLayout();
  const hRow = headerRow();
  const table = tableStyles();
  const dRow = dataRow();
  const optionStyle = optionStyles();

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

  const cells = ambulances.map((ambulance: Ambulance) => {
    return (
      <TableRow key={ambulance.id}>
        <TableCell classes={{ root: dRow.root }}>
          {`#${ambulance.vehicleNumber}`}
        </TableCell>
        <TableCell classes={{ root: optionStyle.root }}>
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
            <OptionPopper
              id={String(selectedAmbulance)}
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
        isDeleteConfirmation
        title="You are about to delete an ambulance."
        body="Supervisors will no longer be able to transport patients at CCPs using this vehicle."
        actionLabel="Delete"
        handleClickAction={handleClickDelete}
        handleClickCancel={handleClickCancel}
      />
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
