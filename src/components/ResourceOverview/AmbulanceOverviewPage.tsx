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
import TableSortLabel from '@material-ui/core/TableSortLabel';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddResourceButton from './AddResourceButton';
import ConfirmModal from '../common/ConfirmModal';
import OptionPopper, { Option } from '../common/OptionPopper';
import { Order, stableSort, getComparator } from '../../utils/sort';
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
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
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

const AmbulanceOverviewPage: React.FC = () => {
  const [order, setOrder] = React.useState<Order>('asc');
  const orderBy = 'vehicleNumber';
  const { enqueueSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedAmbulance, setSelectedAmbulance] = React.useState<
    number | null
  >(null);

  // Update cache
  useAllAmbulances();

  // Read newly updated cache
  const { data } = useQuery(GET_ALL_AMBULANCES);

  const ambulances: Array<Ambulance> = data ? data.ambulances : [];

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedAmbulance(null);
  };

  const handleCloseConfirmDelete = () => {
    handleCloseMenu();
    setOpenModal(false);
  };

  //  Writing to cache when deleting user
  const [deleteAmbulance] = useMutation(DELETE_AMBULANCE, {
    update(cache, { data: { deleteAmbulance } }) {
      if (!deleteAmbulance) {
        return;
      }
      let { ambulances } = cache.readQuery<any>({
        query: GET_ALL_AMBULANCES,
      });

      const filtered = ambulances.filter(
        (ambulance) => ambulance.id !== deleteAmbulance
      );
      ambulances = filtered;
      cache.writeQuery({
        query: GET_ALL_AMBULANCES,
        data: { ambulances },
      });
    },
    onCompleted() {
      handleCloseConfirmDelete();
      enqueueSnackbar('Ambulance deleted.');
    },
  });

  const handleClickOptions = (event) => {
    setSelectedAmbulance(event.currentTarget.getAttribute('data-id'));
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const history = useHistory();
  const handleClickEdit = () => {
    const ambulanceId = selectedAmbulance;
    history.replace(`/manage/ambulances/edit/${ambulanceId}`);
  };

  const handleConfirmDelete = () => {
    const ambulanceId = selectedAmbulance;
    deleteAmbulance({ variables: { id: ambulanceId } });
  };

  const handleClickDelete = () => {
    setOpenModal(true);
    setAnchorEl(null);
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
      onClick: handleClickDelete,
      name: 'Delete',
    },
  ];

  const cells = stableSort(ambulances, getComparator(order, orderBy)).map(
    (ambulance: Ambulance) => {
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
    }
  );

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
              <TableCell
                classes={{ root: hRow.root }}
                sortDirection={order}
                colSpan={2}
              >
                <TableSortLabel
                  active
                  direction={order}
                  onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                >
                  Ambulance Number
                  <span className={table.visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </span>
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cells}
            <OptionPopper
              id={String(selectedAmbulance)}
              open={open}
              anchorEl={anchorEl}
              onClickAway={handleCloseMenu}
              options={options}
            />
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmModal
        open={openModal}
        isActionDelete
        title="You are about to delete an ambulance."
        body="Supervisors will no longer be able to transport patients at CCPs using this vehicle."
        actionLabel="Delete"
        handleClickAction={handleConfirmDelete}
        handleClickCancel={handleCloseConfirmDelete}
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
