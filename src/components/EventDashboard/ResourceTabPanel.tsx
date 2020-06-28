import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import { TabOptions } from './EventDashboardPage';
import { Colors } from '../../styles/Constants';
import { useQuery } from 'react-apollo';
import { GET_ALL_HOSPITALS } from '../../graphql/queries/hospitals';
import { GET_ALL_AMBULANCES } from '../../graphql/queries/ambulances';
import { Box, Typography, Button, Checkbox } from '@material-ui/core';
import { FiberManualRecord, Add, Remove } from '@material-ui/icons';
import { Order, stableSort, getComparator } from '../../utils/sort';

const useStyles = makeStyles({
  root: {
    padding: '0 56px 56px 56px'
  },
  tableContainer: {
    background: Colors.White,
    border: `1px solid ${Colors.BorderLightGray}`,
    borderRadius: '4px'
  },
  active: {
    color: Colors.ActiveGreen
  },
  activeIcon: {
    fontSize: '12px',
    marginRight: '8px'
  },
  inactive: {
    color: Colors.InactiveGrey
  },
  buttonIcon: {
    marginRight: '13px'
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
  toolbar: {
    padding: '0 0 0 4px'
  },
  addButton: {
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    borderRadius: '2000px',
    position: 'fixed',
    bottom: '56px',
    right: '56px',
    padding: '12px 26px'
  }
});

interface Hospital {
  id: string;
  name: string;
}

interface Ambulance {
  id: string;
  vehicleNumber: number;
}

interface ResourceTabPanelProps {
  eventId: string;
  type: TabOptions.Hospital | TabOptions.Ambulance;
  hospitals?: Hospital[];
  ambulances?: Ambulance[];
}

interface HospitalData extends Hospital {
  isActive: boolean;
}

interface AmbulanceData extends Ambulance {
  isActive: boolean;
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
  type: TabOptions.Hospital | TabOptions.Ambulance;
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
  const { classes, order, orderBy, onRequestSort, type } = props;
  const createSortHandler = (property: string) => (event: React.MouseEvent) => {
    onRequestSort(event, property);
  };
  const hospitalHeadCells = [
    { headerId: 'name', label: 'Hospital Name' },
    { headerId: 'isActive', label: 'Activity' },
  ];
  
  const ambulanceHeadCells = [
    { headerId: 'vehicleNumber', label: 'Digit' },
    { headerId: 'isActive', label: 'Activity' },
  ];
  
  const headCells: HeadCell[] = type === TabOptions.Hospital ? hospitalHeadCells : ambulanceHeadCells;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
        </TableCell>
        {headCells.map((headCell, index) => (
          <TableCell
            key={headCell.headerId}
            align={index === 0 ? 'left' : 'right'}
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
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected, onSelectAllClick, rowCount } = props;
  const classes = useStyles();

  return (
    <Toolbar className={classes.toolbar} disableGutters>
      <Checkbox
        indeterminate={numSelected > 0 && numSelected < rowCount}
        checked={rowCount > 0 && numSelected === rowCount}
        onChange={onSelectAllClick}
      />
      <Typography variant="body1" color="secondary">Select all</Typography>
      {numSelected > 0 && (
        <Box display="flex" justifyContent="flex-end" alignItems="center" flexGrow={1}>
          <Typography variant="body2" component="div" style={{ marginRight: '16px' }}>
            {numSelected} selected
          </Typography>
          <Button color="secondary"><Remove className={classes.buttonIcon}/>Exclude</Button>
          <Button color="secondary"><Add className={classes.buttonIcon}/>Include</Button>
        </Box>
      )}
    </Toolbar>
  );
};

const ResourceTabPanel = ({eventId, type, hospitals = [], ambulances = []}: ResourceTabPanelProps) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<string>(type === TabOptions.Hospital ? 'name' : 'vehicleNumber');
  const [selected, setSelected] = React.useState<string[]>([]);
  
  const createHospitalData = (
    allHospitals: Hospital[]
  ): HospitalData[] => {
    return allHospitals.map(h => ({ id: h.id, name: h.name, isActive: hospitals.filter(hospital => hospital.id === h.id).length > 0 })); 
  }
  
  const createAmbulanceData = (
    allAmbulances: Ambulance[]
  ): AmbulanceData[] => {
    return allAmbulances.map(a => ({ id: a.id, vehicleNumber: a.vehicleNumber, isActive: ambulances.filter(ambulance => ambulance.id === a.id).length > 0 })); 
  }

  const query = type === TabOptions.Hospital ? GET_ALL_HOSPITALS : GET_ALL_AMBULANCES;

  const { data } = useQuery(query);

  const rows = data ? ( type === TabOptions.Hospital ? createHospitalData(data.hospitals) : createAmbulanceData(data.ambulances) ) : [];

  const handleRequestSort = (event: React.MouseEvent, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = (rows as (HospitalData | AmbulanceData)[]).map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const tableRows = stableSort(rows as (HospitalData | AmbulanceData)[], getComparator(order, orderBy))
  .map((row: HospitalData | AmbulanceData, index) => {
    const isItemSelected = isSelected(row.id);
    const labelId = `enhanced-table-checkbox-${index}`;

    return (
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        selected={isItemSelected}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={isItemSelected}
            inputProps={{ 'aria-labelledby': labelId }}
            onClick={(event) => handleClick(event, row.id)}
          />
        </TableCell>
        <TableCell component="th" id={labelId} scope="row">
          {type === TabOptions.Hospital ? (row as HospitalData).name : (row as AmbulanceData).vehicleNumber}
        </TableCell>
        <TableCell align="right">
        {row.isActive ? 
          <Typography variant="button" className={classes.active}><FiberManualRecord className={classes.activeIcon}/>Active</Typography> : 
          <Typography variant="button" className={classes.inactive}>Inactive</Typography>
        }
        </TableCell>
        <TableCell align="right">
          {row.isActive ? 
            <Button color="secondary" disabled={selected.length > 0}><Remove className={classes.buttonIcon}/>Exclude</Button> : 
            <Button color="secondary" disabled={selected.length > 0}><Add className={classes.buttonIcon}/>Include</Button>
          }
        </TableCell>
      </TableRow>
    );
  });

  return (
    <Box className={classes.root}>
        <EnhancedTableToolbar 
          numSelected={selected.length}
          onSelectAllClick={handleSelectAllClick}
          rowCount={rows.length}
        />
        <TableContainer className={classes.tableContainer}>
          <Table>
            <EnhancedTableHead
              type={type}
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {tableRows}
            </TableBody>
          </Table>
        </TableContainer>
        <Button className={classes.addButton} variant="contained" color="secondary">
          <Add className={classes.buttonIcon}/>{`Add ${type === TabOptions.Hospital ? 'Hospital' : 'Ambulance'}`}
        </Button>
    </Box>
  );
}

export default ResourceTabPanel;