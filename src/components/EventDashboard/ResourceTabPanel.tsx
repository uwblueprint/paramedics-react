import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery, useMutation } from 'react-apollo';
import {
  Box,
  Typography,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Toolbar,
} from '@material-ui/core';
import { FiberManualRecord, Add, Remove } from '@material-ui/icons';
import { Order, stableSort, getComparator } from '../../utils/sort';
import { GET_EVENT_BY_ID } from '../../graphql/queries/events';
import { GET_ALL_AMBULANCES } from '../../graphql/queries/ambulances';
import { GET_ALL_HOSPITALS } from '../../graphql/queries/hospitals';
import { Colours } from '../../styles/Constants';
import { TabOptions } from './EventDashboardPage';
import {
  ADD_HOSPITALS_TO_EVENT,
  ADD_AMBULANCES_TO_EVENT,
  DELETE_HOSPITALS_FROM_EVENT,
  DELETE_AMBULANCES_FROM_EVENT,
} from '../../graphql/mutations/events';
import { ActionConfirmationDialog } from './ActionConfirmationDialog';

const useStyles = makeStyles({
  root: {
    padding: '0 56px 145px 56px',
  },
  tableContainer: {
    background: Colours.White,
    border: `1px solid ${Colours.BorderLightGray}`,
    borderRadius: '4px',
  },
  active: {
    color: Colours.ActiveGreen,
  },
  activeIcon: {
    fontSize: '12px',
    marginRight: '8px',
  },
  inactive: {
    color: Colours.InactiveGrey,
  },
  buttonIcon: {
    marginRight: '13px',
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
    padding: '0 0 0 4px',
  },
  addButton: {
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    borderRadius: '2000px',
    position: 'fixed',
    bottom: '56px',
    right: '56px',
    padding: '12px 26px',
  },
  buttonCell: {
    paddingTop: 0,
    paddingBottom: 0,
  },
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

export interface HospitalData extends Hospital {
  isActive: boolean;
}

export interface AmbulanceData extends Ambulance {
  isActive: boolean;
}

export type ResourceData = HospitalData | AmbulanceData;

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
    { headerId: 'isActive', label: 'Status' },
  ];

  const ambulanceHeadCells = [
    { headerId: 'vehicleNumber', label: 'Digit' },
    { headerId: 'isActive', label: 'Status' },
  ];

  const headCells: HeadCell[] =
    type === TabOptions.Hospital ? hospitalHeadCells : ambulanceHeadCells;

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

interface EnhancedTableToolbarProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
  handleIncludeClick: () => void;
  handleExcludeClick: () => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const {
    numSelected,
    onSelectAllClick,
    rowCount,
    handleIncludeClick,
    handleExcludeClick,
  } = props;
  const classes = useStyles();

  return (
    <Toolbar className={classes.toolbar} disableGutters>
      <Checkbox
        indeterminate={numSelected > 0 && numSelected < rowCount}
        checked={rowCount > 0 && numSelected === rowCount}
        onChange={onSelectAllClick}
      />
      <Typography variant="body1" color="secondary">
        Select all
      </Typography>
      {numSelected > 0 && (
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          flexGrow={1}
        >
          <Typography
            variant="body2"
            color="textSecondary"
            component="div"
            style={{ marginRight: '16px' }}
          >
            {`${numSelected} selected`}
          </Typography>
          <Button color="secondary" onClick={handleIncludeClick}>
            <Add className={classes.buttonIcon} />
            Include
          </Button>
          <Button color="secondary" onClick={handleExcludeClick}>
            <Remove className={classes.buttonIcon} />
            Exclude
          </Button>
        </Box>
      )}
    </Toolbar>
  );
};

const ResourceTabPanel = ({
  eventId,
  type,
  hospitals = [],
  ambulances = [],
}: ResourceTabPanelProps) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<string>(
    type === TabOptions.Hospital ? 'name' : 'vehicleNumber'
  );
  const [selected, setSelected] = React.useState<ResourceData[]>([]);
  const [
    singleSelected,
    setSingleSelected,
  ] = React.useState<ResourceData | null>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const [includeOrExclude, setIncludeOrExclude] = React.useState<
    'include' | 'exclude' | null
  >(null);

  // Have to refetch GET_EVENT_BY_ID because only the list
  // of all events in the cache is automatically updated
  const mutationOptions = {
    refetchQueries: [
      {
        query: GET_EVENT_BY_ID,
        variables: { eventId },
      },
    ],
  };

  const [addHospitalsToEvent] = useMutation(
    ADD_HOSPITALS_TO_EVENT,
    mutationOptions
  );
  const [addAmbulancesToEvent] = useMutation(
    ADD_AMBULANCES_TO_EVENT,
    mutationOptions
  );
  const [deleteHospitalsFromEvent] = useMutation(
    DELETE_HOSPITALS_FROM_EVENT,
    mutationOptions
  );
  const [deleteAmbulancesFromEvent] = useMutation(
    DELETE_AMBULANCES_FROM_EVENT,
    mutationOptions
  );

  const handleClose = () => {
    setSelected([]);
    setSingleSelected(null);
    setOpen(false);
    setIncludeOrExclude(null);
  };

  const handleIncludeClick = () => {
    setIncludeOrExclude('include');
    setOpen(true);
  };

  const handleExcludeClick = () => {
    setIncludeOrExclude('exclude');
    setOpen(true);
  };

  const convertSelected = (selected) =>
    selected.map((resource: ResourceData) => ({
      id: resource.id,
    }));

  const handleAddHospitals = (selected: HospitalData[]) => {
    addHospitalsToEvent({
      variables: { eventId, hospitals: convertSelected(selected) },
    });
  };

  const handleAddAmbulances = (selected: AmbulanceData[]) => {
    addAmbulancesToEvent({
      variables: { eventId, ambulances: convertSelected(selected) },
    });
  };

  const handleAddResources = () => {
    const resourcesToAdd = singleSelected
      ? ([singleSelected] as ResourceData[])
      : selected;

    if (type === TabOptions.Hospital) {
      handleAddHospitals(resourcesToAdd as HospitalData[]);
    } else {
      handleAddAmbulances(resourcesToAdd as AmbulanceData[]);
    }

    handleClose();
  };

  const handleSingleIncludeClick = (row: ResourceData) => {
    setSingleSelected(row);
    setIncludeOrExclude('include');
    setOpen(true);
  };

  const handleDeleteHospitals = (selected: HospitalData[]) => {
    deleteHospitalsFromEvent({
      variables: { eventId, hospitals: convertSelected(selected) },
    });
  };

  const handleDeleteAmbulances = (selected: AmbulanceData[]) => {
    deleteAmbulancesFromEvent({
      variables: { eventId, ambulances: convertSelected(selected) },
    });
  };

  const handleDeleteResources = () => {
    const resourcesToDelete = singleSelected
      ? ([singleSelected] as ResourceData[])
      : selected;

    if (type === TabOptions.Hospital) {
      handleDeleteHospitals(resourcesToDelete as HospitalData[]);
    } else {
      handleDeleteAmbulances(resourcesToDelete as AmbulanceData[]);
    }

    handleClose();
  };

  const handleSingleExcludeClick = (row: ResourceData) => {
    setSingleSelected(row);
    setIncludeOrExclude('exclude');
    setOpen(true);
  };

  const createHospitalData = (allHospitals: Hospital[]): HospitalData[] => {
    return allHospitals.map((h) => ({
      id: h.id,
      name: h.name,
      isActive: hospitals.filter((hospital) => hospital.id === h.id).length > 0,
    }));
  };

  const createAmbulanceData = (allAmbulances: Ambulance[]): AmbulanceData[] => {
    return allAmbulances.map((a) => ({
      id: a.id,
      vehicleNumber: a.vehicleNumber,
      isActive:
        ambulances.filter((ambulance) => ambulance.id === a.id).length > 0,
    }));
  };

  const query =
    type === TabOptions.Hospital ? GET_ALL_HOSPITALS : GET_ALL_AMBULANCES;

  const { data } = useQuery(query);

  const rows = data
    ? type === TabOptions.Hospital
      ? createHospitalData(data.hospitals)
      : createAmbulanceData(data.ambulances)
    : [];

  const handleRequestSort = (event: React.MouseEvent, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(rows);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent, row: ResourceData) => {
    const selectedIndex = selected.findIndex((r) => r.id === row.id);
    let newSelected: ResourceData[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id: string) =>
    selected.findIndex((row) => row.id === id) !== -1;

  const tableRows = stableSort(
    rows as ResourceData[],
    getComparator(order, orderBy)
  ).map((row: ResourceData, index) => {
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
            onClick={(event) => handleClick(event, row)}
          />
        </TableCell>
        <TableCell component="th" id={labelId} scope="row">
          {type === TabOptions.Hospital
            ? (row as HospitalData).name
            : (row as AmbulanceData).vehicleNumber}
        </TableCell>
        <TableCell align="left">
          {row.isActive ? (
            <Typography variant="button" className={classes.active}>
              <FiberManualRecord className={classes.activeIcon} />
              Active
            </Typography>
          ) : (
            <Typography variant="button" className={classes.inactive}>
              Inactive
            </Typography>
          )}
        </TableCell>
        <TableCell align="right" className={classes.buttonCell}>
          {row.isActive ? (
            <Button
              color="secondary"
              disabled={selected.length > 0}
              onClick={() => {
                handleSingleExcludeClick(row);
              }}
            >
              <Remove className={classes.buttonIcon} />
              Exclude
            </Button>
          ) : (
            <Button
              color="secondary"
              disabled={selected.length > 0}
              onClick={() => {
                handleSingleIncludeClick(row);
              }}
            >
              <Add className={classes.buttonIcon} />
              Include
            </Button>
          )}
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
        handleIncludeClick={handleIncludeClick}
        handleExcludeClick={handleExcludeClick}
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
          <TableBody>{tableRows}</TableBody>
        </Table>
      </TableContainer>
      <Button
        className={classes.addButton}
        variant="contained"
        color="secondary"
      >
        <Add className={classes.buttonIcon} />
        {`Add ${type === TabOptions.Hospital ? 'Hospital' : 'Ambulance'}`}
      </Button>
      <ActionConfirmationDialog
        open={open}
        type={type}
        handleClose={handleClose}
        handleAdd={handleAddResources}
        handleDelete={handleDeleteResources}
        includeOrExclude={includeOrExclude}
        selected={
          singleSelected ? ([singleSelected] as ResourceData[]) : selected
        }
      />
    </Box>
  );
};

export default ResourceTabPanel;
