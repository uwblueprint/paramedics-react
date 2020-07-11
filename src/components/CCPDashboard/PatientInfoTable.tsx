import React from "react";
import moment from "moment";
import { Colours } from "../../styles/Constants";
import {
  makeStyles,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  Toolbar,
  Button,
  Dialog,
  DialogActions,
  Popover,
  Grid,
  Box,
  Typography,
  Checkbox,
  IconButton,
  Chip,
} from "@material-ui/core";
import { Close, MoreHoriz } from "@material-ui/icons";
import { FilterIcon } from "../common/FilterIcon";
import {
  Patient,
  TriageLevel,
  Status,
} from "../../graphql/queries/templates/patients";
import { Order, stableSort, getComparator } from "../../utils/sort";
import { PatientDetailsDialog } from "./PatientDetailsDialog";
import { capitalize } from "../../utils/format";

const useStyles = makeStyles({
  root: {
    padding: "0 56px 145px 56px",
  },
  tableContainer: {
    background: Colours.White,
    border: `1px solid ${Colours.BorderLightGray}`,
    borderRadius: "4px",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  tableCell: {
    maxWidth: "190px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  icon: {
    marginRight: "10px",
  },
  editButton: {
    marginRight: "14px",
    marginBottom: "12px",
  },
  detailsDialog: {
    width: "662px",
  },
  popover: {
    padding: "24px",
  },
  filterOption: {
    display: "flex",
    alignItems: "center",
  },
  filterCategory: {
    marginRight: "58px",
  },
  applyButton: {
    padding: "12px 16px",
  },
  closeButton: {
    position: "absolute",
    top: "6px",
    right: "6px",
  },
  filterChipsContainer: {
    padding: "0 16px",
  },
  filterChip: {
    color: Colours.Black,
    fontSize: "16px",
    marginRight: "12px",
  },
  deleteChipIcon: {
    color: Colours.Black,
    fontSize: 9,
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
    { headerId: "triageLevel", label: "Triage" },
    { headerId: "barcodeValue", label: "Barcode" },
    { headerId: "gender", label: "Gender" },
    { headerId: "age", label: "Age" },
    { headerId: "status", label: "Status" },
    { headerId: "hospital", label: "Hospital" },
    { headerId: "transportTime", label: "Time" },
  ];

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell
            key={headCell.headerId}
            align={index === headCells.length - 1 ? "right" : "left"}
            sortDirection={orderBy === headCell.headerId ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.headerId}
              direction={orderBy === headCell.headerId ? order : "asc"}
              onClick={createSortHandler(headCell.headerId)}
            >
              {headCell.label}
              {orderBy === headCell.headerId ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  );
};

interface FilterOption {
  label: string;
  value: any;
  selected: boolean;
}

interface FilterOptionObject {
  [key: string]: FilterOption;
}

enum FilterCategory {
  Triage = "triage",
  Status = "status",
  Hospital = "hospital",
}

const triageFilters: FilterOptionObject = {
  Green: {
    label: "Green",
    value: TriageLevel.GREEN,
    selected: false,
  },
  Yellow: {
    label: "Yellow",
    value: TriageLevel.YELLOW,
    selected: false,
  },
  Red: {
    label: "Red",
    value: TriageLevel.RED,
    selected: false,
  },
  Black: {
    label: "Black",
    value: TriageLevel.BLACK,
    selected: false,
  },
  White: {
    label: "White",
    value: TriageLevel.WHITE,
    selected: false,
  },
};

const statusFilters: FilterOptionObject = {
  "On Scene": {
    label: "On Scene",
    value: Status.ON_SITE,
    selected: false,
  },
  Transport: {
    label: "Transport",
    value: Status.TRANSPORTED,
    selected: false,
  },
  Release: {
    label: "Released",
    value: Status.RELEASED,
    selected: false,
  },
  Omit: {
    label: "Omit",
    value: Status.DELETED,
    selected: false,
  },
};

export const PatientInfoTable = ({ patients }: { patients: Patient[] }) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<string>("transportTime");
  const [openDetails, setOpenDetails] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const initialFilters = {
    triage: triageFilters,
    status: statusFilters,
  };
  const [selectedFilters, setSelectedFilters] = React.useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = React.useState(initialFilters);
  const [filteredPatients, setFilteredPatients] = React.useState(patients);

  const handleRequestSort = (event: React.MouseEvent, property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleOpenDetails = (patient) => {
    setSelectedPatient(patient);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  const open = Boolean(anchorEl);

  const filterPatients = React.useCallback(() => {
    const appliedTriageFilters = Object.values(appliedFilters.triage).filter(
      (filter: FilterOption) => filter.selected === true
    );
    const appliedStatusFilters = Object.values(appliedFilters.status).filter(
      (filter: FilterOption) => filter.selected === true
    );

    let triageFilteredPatients: Patient[] = [];
    let statusFilteredPatients: Patient[] = [];

    // apply selected and confirmed filters
    if (appliedTriageFilters.length > 0) {
      for (let i = 0; i < appliedTriageFilters.length; i++) {
        triageFilteredPatients.push(
          ...patients.filter(
            (p: Patient) => p.triageLevel === appliedTriageFilters[i].value
          )
        );
      }
    } else {
      triageFilteredPatients = patients;
    }

    if (appliedStatusFilters.length > 0) {
      for (let i = 0; i < appliedStatusFilters.length; i++) {
        statusFilteredPatients.push(
          ...triageFilteredPatients.filter(
            (p: Patient) => p.status === appliedStatusFilters[i].value
          )
        );
      }
    } else {
      statusFilteredPatients = triageFilteredPatients;
    }

    setFilteredPatients(statusFilteredPatients);
  }, [appliedFilters]);

  React.useEffect(() => {
    filterPatients();
  }, [filterPatients, appliedFilters]);

  const handleOpenFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closePopover = () => {
    setAnchorEl(null);
  };

  const handleCloseFilters = () => {
    closePopover();
    resetFilters();
  };

  const resetFilters = () => {
    setSelectedFilters(appliedFilters);
  };

  const clearFilters = () => {
    setSelectedFilters(initialFilters);
  };

  const handleApplyFilters = () => {
    closePopover();
    setAppliedFilters(selectedFilters);
  };

  const removeFilter = (filterKey, category) => {
    const updatedFilters = {
      ...appliedFilters,
      [category]: { ...appliedFilters[category], [filterKey]: false },
    };
    setAppliedFilters(updatedFilters);
    setSelectedFilters(updatedFilters);
  };

  const handleCheckboxChange = (
    filterOption: FilterOption,
    category: FilterCategory,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedFilters({
      ...selectedFilters,
      [category]: {
        ...selectedFilters[category],
        [event?.target.name]: {
          ...filterOption,
          selected: event?.target.checked,
        },
      },
    });
  };

  const tableRows = stableSort(
    filteredPatients,
    getComparator(order, orderBy)
  ).map((patient: Patient) => {
    const triageLevels = {
      [TriageLevel.GREEN]: {
        colour: Colours.TriageGreen,
        triageLevel: TriageLevel.GREEN,
        label: "Green",
      },
      [TriageLevel.YELLOW]: {
        colour: Colours.TriageYellow,
        triageLevel: TriageLevel.YELLOW,
        label: "Yellow",
      },
      [TriageLevel.RED]: {
        colour: Colours.TriageRed,
        triageLevel: TriageLevel.RED,
        label: "Red",
      },
      [TriageLevel.BLACK]: {
        colour: Colours.Black,
        triageLevel: TriageLevel.BLACK,
        label: "Black",
      },
      [TriageLevel.WHITE]: {
        colour: Colours.BorderLightGray,
        triageLevel: TriageLevel.WHITE,
        label: "White",
      },
    };

    const statusLabels = {
      [Status.ON_SITE]: "On Scene",
      [Status.TRANSPORTED]: "Transported",
      [Status.RELEASED]: "Released",
      [Status.DELETED]: "Omitted/Deleted",
    };

    return (
      <TableRow
        hover
        key={patient.id}
        onClick={() => handleOpenDetails(patient)}
      >
        <TableCell
          className={classes.tableCell}
          style={{
            borderLeft: `8px solid ${triageLevels[patient.triageLevel].colour}`,
          }}
        >
          {triageLevels[patient.triageLevel].label}
        </TableCell>
        <TableCell className={classes.tableCell}>
          {patient.barcodeValue}
        </TableCell>
        <TableCell className={classes.tableCell}>{patient.gender}</TableCell>
        <TableCell className={classes.tableCell}>{patient.age}</TableCell>
        <TableCell className={classes.tableCell}>
          {statusLabels[patient.status]}
        </TableCell>
        {/* Add overflow tooltip? */}
        <TableCell className={classes.tableCell}>
          Hospital Name Placeholder
        </TableCell>
        <TableCell align="right" className={classes.tableCell}>
          {moment(patient.transportTime).format("MMM D YYYY, h:mm A")}
        </TableCell>
        <TableCell>
          <Button>
            <MoreHoriz />
          </Button>
        </TableCell>
      </TableRow>
    );
  });

  const filterOption = (
    filterOption: FilterOption,
    category: FilterCategory
  ) => (
    <Box className={classes.filterOption} key={filterOption.value}>
      <Checkbox
        checked={
          selectedFilters[category][filterOption.label]?.selected || false
        }
        onChange={(e) => handleCheckboxChange(filterOption, category, e)}
        color="secondary"
        name={filterOption.label}
      />
      <Typography variant="body2">{filterOption.label}</Typography>
    </Box>
  );

  return (
    <TableContainer>
      <Toolbar>
        <Button color="secondary" onClick={handleOpenFilters}>
          <FilterIcon colour={Colours.Secondary} classes={classes.icon} />
          Filters
        </Button>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleCloseFilters}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          PaperProps={{ className: classes.popover }}
        >
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleCloseFilters}
          >
            <Close />
          </IconButton>
          <Grid container direction="row">
            <Grid item className={classes.filterCategory}>
              <Typography variant="body1">Triage</Typography>
              {Object.values(triageFilters).map((triage) =>
                filterOption(triage, FilterCategory.Triage)
              )}
            </Grid>
            <Grid item className={classes.filterCategory}>
              <Typography variant="body1">Status</Typography>
              {Object.values(statusFilters).map((status) =>
                filterOption(status, FilterCategory.Status)
              )}
            </Grid>
            <Grid item className={classes.filterCategory}>
              <Typography variant="body1">Hospital</Typography>
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="space-between" marginTop="24px">
            <Button color="secondary" onClick={clearFilters}>
              Clear Filter
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className={classes.applyButton}
              onClick={handleApplyFilters}
            >
              Apply Filter
            </Button>
          </Box>
        </Popover>
        <Box className={classes.filterChipsContainer}>
          {Object.values(appliedFilters.triage)
            .filter((filter) => filter.selected === true)
            .map((filter) => (
              <Chip
                key={filter.label}
                label={filter.label}
                variant="outlined"
                color="secondary"
                onDelete={() =>
                  removeFilter(filter.label, FilterCategory.Triage)
                }
                deleteIcon={
                  <Close fontSize="small" className={classes.deleteChipIcon} />
                }
                className={classes.filterChip}
              />
            ))}
          {Object.values(appliedFilters.status)
            .filter((filter) => filter.selected === true)
            .map((filter) => (
              <Chip
                key={filter.label}
                label={filter.label}
                variant="outlined"
                color="secondary"
                onDelete={() =>
                  removeFilter(filter.label, FilterCategory.Status)
                }
                deleteIcon={
                  <Close fontSize="small" className={classes.deleteChipIcon} />
                }
                className={classes.filterChip}
              />
            ))}
        </Box>
      </Toolbar>
      <Table>
        <EnhancedTableHead
          classes={classes}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
        />
        <TableBody>{tableRows}</TableBody>
      </Table>
      {selectedPatient && (
        <Dialog
          open={openDetails}
          onClose={handleCloseDetails}
          PaperProps={{ className: classes.detailsDialog }}
        >
          <PatientDetailsDialog
            patient={(selectedPatient as unknown) as Patient}
            onClose={handleCloseDetails}
          />
          <DialogActions
            style={{
              borderLeft: `16px solid ${
                Colours[
                  `Triage${capitalize(
                    ((selectedPatient as unknown) as Patient).triageLevel
                  )}`
                ]
              }`,
            }}
          >
            <Button
              onClick={() => {}}
              color="secondary"
              className={classes.editButton}
            >
              Edit
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </TableContainer>
  );
};
