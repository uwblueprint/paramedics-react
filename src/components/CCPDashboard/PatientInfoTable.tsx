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
} from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
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
    maxWidth: "150px",
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

export const PatientInfoTable = ({ patients }: { patients: Patient[] }) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<string>("transportTime");
  const [openDetails, setOpenDetails] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState(null);

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

  const tableRows = stableSort(patients, getComparator(order, orderBy)).map(
    (patient: Patient, index) => {
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
        [Status.ON_SITE]: "On Site",
        [Status.TRANSPORTED]: "Transported",
        [Status.RELEASED]: "Released",
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
              borderLeft: `8px solid ${
                triageLevels[patient.triageLevel].colour
              }`,
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
              <MoreHorizIcon />
            </Button>
          </TableCell>
        </TableRow>
      );
    }
  );

  return (
    <TableContainer>
      <Toolbar>
        <Button color="secondary">
          <FilterIcon colour={Colours.Secondary} classes={classes.icon} />
          Filters
        </Button>
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
