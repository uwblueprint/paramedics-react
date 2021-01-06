import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableSortLabel,
  TableRow,
} from '@material-ui/core';
import { Add, MoreHoriz } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import { Colours } from '../../styles/Constants';
import OptionPopper, { Option } from '../common/OptionPopper';
import { Order, stableSort, getComparator } from '../../utils/sort';
import { CCP, GET_CCPS_BY_EVENT_ID } from '../../graphql/queries/ccps';
import { DELETE_CCP } from '../../graphql/mutations/ccps';
import ConfirmModal from '../common/ConfirmModal';
import { GET_PINS_BY_EVENT_ID, PinType } from '../../graphql/queries/maps';

const useStyles = makeStyles({
  root: {
    padding: '56px 56px 145px 56px',
  },
  tableContainer: {
    background: Colours.White,
    border: `1px solid ${Colours.BorderLightGray}`,
    borderRadius: '4px',
  },
  addButton: {
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    borderRadius: '2000px',
    position: 'fixed',
    bottom: '56px',
    right: '56px',
    padding: '12px 26px',
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
  buttonIcon: {
    marginRight: '13px',
  },
});

const useOptions = makeStyles({
  menuDelete: {
    color: Colours.DangerHover,
  },
});

interface HeadCell {
  headerId: string;
  label: string;
}

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (event: React.MouseEvent, property: string) => void;
  order: Order;
  orderBy: string;
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: string) => (event: React.MouseEvent) => {
    onRequestSort(event, property);
  };

  const headCells: HeadCell[] = [
    { headerId: 'name', label: 'CCP Name' },
    { headerId: 'address', label: 'Address' },
  ];

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" />
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.headerId}
            align="left"
            sortDirection={orderBy === headCell.headerId ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.headerId}
              direction={orderBy === headCell.headerId ? order : 'asc'}
              onClick={createSortHandler(headCell.headerId)}
            >
              {headCell.label}
              {orderBy === headCell.headerId ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell />
      </TableRow>
    </TableHead>
  );
};

const CCPTabPanel = ({ eventId }: { eventId: string }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [orderBy, setOrderBy] = React.useState<string>('name');
  const [order, setOrder] = React.useState<Order>('asc');
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [openConfirmDelete, setOpenConfirmDelete] = React.useState<boolean>(
    false
  );
  const [selectedCCP, setSelectedCCP] = React.useState<CCP | null>(null);
  const optionStyle = useOptions();

  const { data } = useQuery(GET_CCPS_BY_EVENT_ID, { variables: { eventId } });
  const { data: pinData } = useQuery(GET_PINS_BY_EVENT_ID, {
    variables: { eventId },
  });

  const pins = pinData ? pinData.pinsForEvent : [];
  const rows = data ? data.collectionPointsByEvent : [];
  const open = Boolean(anchorEl);
  const history = useHistory();

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedCCP(null);
  };

  const handleCloseConfirmDelete = () => {
    handleCloseMenu();
    setOpenConfirmDelete(false);
  };

  const getCCPAddress = ({ ccp, pins }) => {
    const ccpPin = pins.filter(
      (pin) => pin.pinType === PinType.CCP && pin.ccpId.id === ccp.id
    );

    if (ccpPin && ccpPin.length > 0) {
      return ccpPin[0].address;
    }

    return '-';
  };

  //  Writing to cache when deleting ccp
  const [deleteCCP] = useMutation(DELETE_CCP, {
    update(cache, { data: { deleteCollectionPoint } }) {
      if (!deleteCollectionPoint) {
        return;
      }

      // Update GET_CCPS_BY_EVENT_ID
      const { collectionPointsByEvent } = cache.readQuery<any>({
        query: GET_CCPS_BY_EVENT_ID,
        variables: { eventId },
      });

      const updatedCCPsList = collectionPointsByEvent.filter(
        (ccp) => ccp.id !== deleteCollectionPoint
      );

      cache.writeQuery({
        query: GET_CCPS_BY_EVENT_ID,
        variables: { eventId },
        data: { collectionPointsByEvent: updatedCCPsList },
      });

      // Update GET_PINS_BY_EVENT_ID
      const { pinsForEvent } = cache.readQuery<any>({
        query: GET_PINS_BY_EVENT_ID,
        variables: { eventId },
      });

      const updatedPinsList = pinsForEvent.filter(
        (pin) =>
          pin.pinType !== PinType.CCP ||
          (pin.pinType === PinType.CCP &&
            pin.ccpId.id !== deleteCollectionPoint)
      );

      cache.writeQuery({
        query: GET_PINS_BY_EVENT_ID,
        variables: { eventId },
        data: { pinsForEvent: updatedPinsList },
      });
    },
    onCompleted() {
      handleCloseConfirmDelete();
      enqueueSnackbar('CCP deleted.');
    },
  });

  const handleRequestSort = (event: React.MouseEvent, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClickOptions = (event, row: CCP) => {
    setSelectedCCP(row);
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickDelete = () => {
    setOpenConfirmDelete(true);
    setAnchorEl(null);
  };

  const handleConfirmDelete = () => {
    const ccpId = (selectedCCP as CCP).id;
    deleteCCP({ variables: { id: ccpId } });
  };

  const handleAdd = () => {
    history.push(`/events/${eventId}/ccps/new`);
  };

  const handleClickEdit = () => {
    history.push(`/events/${eventId}/ccps/${selectedCCP?.id}/edit`);
  };

  const handleClickRow = (row: CCP) => {
    history.push(`/events/${eventId}/ccps/${row.id}`);
  };

  const options: Array<Option> = [
    {
      name: 'Edit',
      onClick: handleClickEdit,
    },
    {
      name: 'Delete',
      onClick: handleClickDelete,
      styles: optionStyle.menuDelete,
    },
  ];

  const tableRows = stableSort(
    rows as CCP[],
    getComparator(order, orderBy)
  ).map((row: CCP) => {
    return (
      <TableRow
        hover
        role="checkbox"
        tabIndex={-1}
        key={row.id}
        onClick={() => handleClickRow(row)}
      >
        <TableCell padding="checkbox" />
        <TableCell component="th" scope="row">
          {(row as CCP).name}
        </TableCell>
        <TableCell component="th" scope="row">
          {getCCPAddress({ ccp: row, pins })}
        </TableCell>
        <TableCell
          width="48px"
          style={{ maxWidth: '48px', paddingTop: 0, paddingBottom: 0 }}
        >
          <IconButton
            data-id={row.id}
            onClick={(event) => {
              event.stopPropagation();
              handleClickOptions(event, row);
            }}
            color="inherit"
          >
            <MoreHoriz />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  });

  return (
    <Box className={classes.root}>
      <TableContainer className={classes.tableContainer}>
        <Table>
          <EnhancedTableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>{tableRows}</TableBody>
        </Table>
      </TableContainer>
      <Button
        className={classes.addButton}
        onClick={handleAdd}
        variant="contained"
        color="secondary"
      >
        <Add className={classes.buttonIcon} />
        Add CCP
      </Button>
      {selectedCCP && (
        <ConfirmModal
          open={openConfirmDelete}
          isActionDelete
          title="Are you sure you want to delete the following CCP?"
          body={
            <>
              <span style={{ color: Colours.Secondary, fontWeight: 500 }}>
                {(selectedCCP as CCP).name}
              </span>
              {' cannot be recovered when deleted.'}
            </>
          }
          actionLabel="Delete"
          handleClickAction={handleConfirmDelete}
          handleClickCancel={handleCloseConfirmDelete}
        />
      )}
      <OptionPopper
        id={selectedCCP?.id || ''}
        open={open}
        anchorEl={anchorEl}
        onClickAway={handleCloseMenu}
        options={options}
      />
    </Box>
  );
};

export default CCPTabPanel;
