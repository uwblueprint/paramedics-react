import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
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
import { Colours } from '../../styles/Constants';
import { Order, stableSort, getComparator } from '../../utils/sort';
import { CCP, GET_CCPS_BY_EVENT_ID } from '../../graphql/queries/ccps';
import { DELETE_CCP } from '../../graphql/mutations/ccps';
import ConfirmModal from '../common/ConfirmModal';

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
  const { data } = useQuery(GET_CCPS_BY_EVENT_ID, { variables: { eventId } });

  const rows = data ? data.collectionPointsByEvent : [];

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedCCP(null);
  };

  const handleCloseConfirmDelete = () => {
    handleCloseMenu();
    setOpenConfirmDelete(false);
  };

  //  Writing to cache when deleting ccp
  const [deleteCCP] = useMutation(DELETE_CCP, {
    update(cache, { data: { deleteCollectionPoint } }) {
      if (!deleteCollectionPoint) {
        return;
      }
      let { collectionPointsByEvent } = cache.readQuery<any>({
        query: GET_CCPS_BY_EVENT_ID,
        variables: { eventId },
      });

      const filtered = collectionPointsByEvent.filter(
        (ccp) => ccp.id !== (selectedCCP as CCP).id
      );
      collectionPointsByEvent = filtered;
      cache.writeQuery({
        query: GET_CCPS_BY_EVENT_ID,
        variables: { eventId },
        data: { collectionPointsByEvent },
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

  const handleOpenConfirmDelete = () => {
    setOpenConfirmDelete(true);
  };

  const handleClickDelete = () => {
    const ccpId = (selectedCCP as CCP).id;
    deleteCCP({ variables: { id: ccpId } });
  };

  const tableRows = stableSort(
    rows as CCP[],
    getComparator(order, orderBy)
  ).map((row: CCP) => {
    return (
      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
        <TableCell padding="checkbox" />
        <TableCell component="th" scope="row">
          {(row as CCP).name}
        </TableCell>
        <TableCell component="th" scope="row">
          -
        </TableCell>
        <TableCell
          width="48px"
          style={{ maxWidth: '48px', paddingTop: 0, paddingBottom: 0 }}
        >
          <IconButton
            data-id={row.id}
            color="inherit"
            onClick={(event) => {
              handleClickOptions(event, row);
            }}
          >
            <MoreHoriz />
          </IconButton>
          <Menu
            id="ccp-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={() => {}}>Edit</MenuItem>
            <MenuItem
              style={{ color: Colours.Danger }}
              onClick={handleOpenConfirmDelete}
            >
              Delete
            </MenuItem>
          </Menu>
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
        variant="contained"
        color="secondary"
      >
        <Add className={classes.buttonIcon} />
        Add CCP
      </Button>
      {selectedCCP && (
        <ConfirmModal
          open={openConfirmDelete}
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
          handleClickAction={handleClickDelete}
          handleClickCancel={handleCloseConfirmDelete}
        />
      )}
    </Box>
  );
};

export default CCPTabPanel;
