import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Colours } from '../../styles/Constants';
import { Order, stableSort, getComparator } from '../../utils/sort';
import { GET_ALL_CCPS } from '../../graphql/queries/ccps';

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

interface CCP {
  id: string;
  name: string;
  eventId: { id: string };
}

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
      </TableRow>
    </TableHead>
  );
};

const CCPTabPanel = ({ eventId }: { eventId: string }) => {
  const [orderBy, setOrderBy] = React.useState<string>('name');
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const { data } = useQuery(GET_ALL_CCPS);

  const rows = data
    ? data.collectionPoints.filter((ccp: CCP) => ccp.eventId.id === eventId)
    : [];

  const handleRequestSort = (event: React.MouseEvent, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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
      </TableRow>
    );
  });

  return (
    <Box className={classes.root}>
      <TableContainer className={classes.tableContainer}>
        <Table>
          <EnhancedTableHead
            // type={type}
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
    </Box>
  );
};

export default CCPTabPanel;
