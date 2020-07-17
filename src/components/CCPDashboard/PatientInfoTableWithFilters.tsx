import React from "react";
import { Colours } from "../../styles/Constants";
import {
  makeStyles,
  TableContainer,
  Toolbar,
  Button,
  Popover,
  Grid,
  Box,
  Typography,
  Checkbox,
  IconButton,
  Chip,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { FilterIcon } from "../common/FilterIcon";
import { Patient, TriageLevel, Status } from "../../graphql/queries/patients";
import { PatientInfoTable } from "./PatientInfoTable";

const useStyles = makeStyles({
  icon: {
    marginRight: "10px",
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

export const PatientInfoTableWithFilters = ({
  patients,
}: {
  patients: Patient[];
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const hospitalFilters: FilterOptionObject = React.useMemo(
    () =>
      patients.reduce((allHospitals, patient) => {
        const { hospitalId } = patient;
        if (hospitalId) {
          return {
            ...allHospitals,
            [hospitalId.name]: {
              label: hospitalId.name,
              value: hospitalId.name,
              selected: false,
            },
          };
        } else {
          return allHospitals;
        }
      }, {} as FilterOptionObject),
    [patients]
  );
  const initialFilters = {
    triage: triageFilters,
    status: statusFilters,
    hospital: hospitalFilters,
  };
  const [selectedFilters, setSelectedFilters] = React.useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = React.useState(initialFilters);
  const [filteredPatients, setFilteredPatients] = React.useState(patients);

  const open = Boolean(anchorEl);

  const filterPatients = React.useCallback(() => {
    const appliedTriageFilters = Object.values(appliedFilters.triage).filter(
      (filter: FilterOption) => filter.selected === true
    );
    const appliedStatusFilters = Object.values(appliedFilters.status).filter(
      (filter: FilterOption) => filter.selected === true
    );
    const appliedHospitalFilters = Object.values(
      appliedFilters.hospital
    ).filter((filter: FilterOption) => filter.selected === true);

    let triageFilteredPatients: Patient[] = [];
    let statusFilteredPatients: Patient[] = [];
    let hospitalFilteredPatients: Patient[] = [];

    // Apply selected and confirmed filters
    // If no filters are selected for a given category, the patients are not filtered by that category
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

    if (appliedHospitalFilters.length > 0) {
      for (let i = 0; i < appliedHospitalFilters.length; i++) {
        hospitalFilteredPatients.push(
          ...statusFilteredPatients.filter(
            (p: Patient) =>
              p.hospitalId?.name === appliedHospitalFilters[i].value
          )
        );
      }
    } else {
      hospitalFilteredPatients = statusFilteredPatients;
    }

    setFilteredPatients(hospitalFilteredPatients);
  }, [appliedFilters, patients]);

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
              {Object.entries(hospitalFilters)
                .sort()
                .map((hospital) =>
                  filterOption(hospital[1], FilterCategory.Hospital)
                )}
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
          {Object.values(appliedFilters.hospital)
            .filter((filter) => filter.selected === true)
            .map((filter) => (
              <Chip
                key={filter.label}
                label={filter.label}
                variant="outlined"
                color="secondary"
                onDelete={() =>
                  removeFilter(filter.label, FilterCategory.Hospital)
                }
                deleteIcon={
                  <Close fontSize="small" className={classes.deleteChipIcon} />
                }
                className={classes.filterChip}
              />
            ))}
        </Box>
      </Toolbar>

      <PatientInfoTable patients={filteredPatients} />
    </TableContainer>
  );
};
