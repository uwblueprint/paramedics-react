import React from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import {
  makeStyles,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  Button,
} from '@material-ui/core';
import { useMutation, useSubscription } from '@apollo/react-hooks';
import { MoreHoriz } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import {
  PATIENT_UPDATED,
  PATIENT_DELETED,
} from '../../graphql/subscriptions/patients';
import { Colours } from '../../styles/Constants';
import {
  Patient,
  TriageLevel,
  Status,
  GET_ALL_PATIENTS,
} from '../../graphql/queries/patients';
import { Order, stableSort, getComparator } from '../../utils/sort';
import ConfirmModal from '../common/ConfirmModal';
import { CCPDashboardTabOptions, CCPDashboardTabMap } from './CCPDashboardPage';
import { EDIT_PATIENT, DELETE_PATIENT } from '../../graphql/mutations/patients';
import { PatientDetailsDialog } from './PatientDetailsDialog';
import { capitalize, formatLastUpdated } from '../../utils/format';

const useStyles = makeStyles({
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
  tableCell: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  deletedTableCell: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: `${Colours.InactiveGrey}`,
  },
  editButton: {
    marginRight: '14px',
    marginBottom: '12px',
  },
  detailsDialog: {
    width: '662px',
  },
  highlighted: {
    backgroundColor: Colours.Blue,
  },
});

interface HeadCell {
  headerId: string;
  label: string;
  width: string;
}

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (event: React.MouseEvent, property: string) => void;
  order: Order;
  orderBy: string;
  headCells: HeadCell[];
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
  const { classes, order, orderBy, onRequestSort, headCells } = props;

  const createSortHandler = (property: string) => (event: React.MouseEvent) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell
            key={headCell.headerId}
            sortDirection={orderBy === headCell.headerId ? order : false}
            width={headCell.width}
            style={{
              width: headCell.width,
              maxWidth: headCell.width,
              ...(index === 0 && { borderLeft: '16px hidden' }),
            }}
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
        <TableCell style={{ width: '36px', minWidth: '36px' }} />
      </TableRow>
    </TableHead>
  );
};

export const statusLabels = {
  [Status.ON_SITE]: 'On Scene',
  [Status.TRANSPORTED]: 'Transported',
  [Status.RELEASED]: 'Released',
  [Status.DELETED]: 'Deleted',
};

export const PatientInfoTable = ({
  patients,
  type,
  eventId,
  ccpId,
  patientId,
  lastUpdatedPatient,
}: {
  patients: Patient[];
  type: CCPDashboardTabOptions;
  eventId: string;
  ccpId: string;
  patientId?: string;
  lastUpdatedPatient: string | null;
}) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<string>(
    type === CCPDashboardTabOptions.Hospital ? 'transportTime' : 'updatedAt'
  );
  const [openDetails, setOpenDetails] = React.useState(!!patientId);
  const [openDeletePatient, setOpenDeletePatient] = React.useState(false);
  const [openRestorePatient, setOpenRestorePatient] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState(
    patients.find((x) => x.id === patientId)
  );
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElRestore, setAnchorElRestore] = React.useState(null);

  const [runNumber, setRunNumber] = React.useState<number | null>(
    selectedPatient ? selectedPatient.runNumber : null
  );
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [deletePatient] = useMutation(DELETE_PATIENT, {});

  const triageLevels = {
    [TriageLevel.GREEN]: {
      colour: Colours.TriageGreen,
      label: 'Green',
    },
    [TriageLevel.YELLOW]: {
      colour: Colours.TriageYellow,
      label: 'Yellow',
    },
    [TriageLevel.RED]: {
      colour: Colours.TriageRed,
      label: 'Red',
    },
    [TriageLevel.BLACK]: {
      colour: Colours.Black,
      label: 'Black',
    },
    [TriageLevel.WHITE]: {
      colour: Colours.BorderLightGray,
      label: 'White',
    },
  };

  const [editPatient] = useMutation(EDIT_PATIENT, {
    update(cache): void {
      const patientId = ((selectedPatient as unknown) as Patient).id;
      const { patients } = cache.readQuery<any>({
        query: GET_ALL_PATIENTS,
      });
      setSelectedPatient(patients.find((x) => x.id === patientId));
    },
  });

  const deletedPatients: Patient[] = [];
  const activePatients: Patient[] = [];

  const headCells: HeadCell[] = [
    { headerId: 'triageLevel', label: 'Triage', width: '78px' },
    { headerId: 'barcodeValue', label: 'Barcode', width: '94px' },
    { headerId: 'gender', label: 'Gender', width: '62px' },
    { headerId: 'age', label: 'Age', width: '34px' },
    { headerId: 'ctas', label: 'CTAS', width: '46px' },
    { headerId: 'status', label: 'Status', width: '104px' },
    ...(type === CCPDashboardTabOptions.PatientOverview
      ? [
          { headerId: 'hospitalId.name', label: 'Hospital', width: '128px' },
          { headerId: 'updatedAt', label: 'Last Edited', width: '192px' },
        ]
      : []),
    ...(type === CCPDashboardTabOptions.Hospital
      ? [
          { headerId: 'runNumber', label: 'Run Number', width: '132px' },
          {
            headerId: 'transportTime',
            label: 'Transported Time',
            width: '192px',
          },
        ]
      : []),
  ];

  patients.forEach((patient) => {
    if (patient.status === Status.DELETED) {
      deletedPatients.push(patient);
    } else {
      activePatients.push(patient);
    }
  });

  useSubscription(PATIENT_UPDATED, {
    variables: { eventId },
    onSubscriptionData: () => {
      if (selectedPatient) {
        if (selectedPatient.id === lastUpdatedPatient) {
          const newPatient = patients.find((x) => x.id === lastUpdatedPatient);
          setSelectedPatient(newPatient);
          setRunNumber(newPatient ? newPatient.runNumber : runNumber);
        }
      }
    },
  });

  useSubscription(PATIENT_DELETED, {
    variables: { eventId },
    onSubscriptionData: () => {
      if (selectedPatient) {
        if (selectedPatient.id === lastUpdatedPatient) {
          setSelectedPatient(patients.find((x) => x.id === lastUpdatedPatient));
        }
      }
    },
  });

  const handleClickSave = () => {
    editPatient({
      variables: {
        id: ((selectedPatient as unknown) as Patient).id,
        runNumber,
        collectionPointId: ccpId,
      },
    });
    setSelectedPatient(undefined);
    setOpenDetails(false);
    enqueueSnackbar(`Patient ${selectedPatient?.barcodeValue} edited.`);
  };

  const handleRunNumber = (newRunNumber) => {
    const convertedRunNumber = newRunNumber ? parseInt(newRunNumber) : null;
    setRunNumber(convertedRunNumber);
  };

  const handleOpenDetails = (patient) => {
    if (!patientId) {
      setSelectedPatient(patients.find((x) => x.id === patient.id));
      setRunNumber(patient.runNumber);
      setOpenDetails(true);
    }
  };

  const handleClickOptions = (event, patient) => {
    setSelectedPatient(patient);
    event.stopPropagation();
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickRestoreMenu = (event, patient) => {
    setSelectedPatient(patient);
    event.stopPropagation();
    setAnchorElRestore(anchorElRestore ? null : event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleCloseRestoreMenu = () => {
    setAnchorElRestore(null);
  };

  const handleClickEdit = () => {
    history.push(
      `/events/${eventId}/ccps/${ccpId}/patients/${
        ((selectedPatient as unknown) as Patient).id
      }`,
      { from: CCPDashboardTabMap[type] }
    );
  };

  const handleClickDelete = () => {
    setAnchorEl(null);
    setOpenDeletePatient(true);
  };

  const handleConfirmDeletePatient = () => {
    deletePatient({
      variables: {
        id: ((selectedPatient as unknown) as Patient).id,
      },
    });
    setOpenDeletePatient(false);
  };

  const handleRequestSort = (event: React.MouseEvent, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleCloseDetails = () => {
    if (patientId) {
      history.push(
        `/events/${eventId}/ccps/${ccpId}/${CCPDashboardTabMap[type]}`
      );
    } else {
      setOpenDetails(false);
    }
  };

  const handleCancelDeletePatient = () => {
    setOpenDeletePatient(false);
  };

  const handleConfirmRestorePatient = () => {
    history.push(
      `/events/${eventId}/ccps/${ccpId}/patients/${
        ((selectedPatient as unknown) as Patient).id
      }`
    );
    setOpenRestorePatient(false);
  };

  const handleCancelRestorePatient = () => {
    setOpenRestorePatient(false);
  };

  const handleClickRestore = () => {
    setAnchorElRestore(null);
    setOpenRestorePatient(true);
  };

  const handleRestoreDialogBtn = () => {
    if (
      selectedPatient !== undefined &&
      selectedPatient.status === Status.DELETED
    ) {
      setOpenRestorePatient(true);
    } else {
      history.push(
        `/events/${eventId}/ccps/${ccpId}/patients/${
          ((selectedPatient as unknown) as Patient).id
        }`,
        { from: CCPDashboardTabMap[type] }
      );
    }
  };

  const getTableRows = (isActive: Boolean, patients: Patient[]) => {
    return stableSort(patients, getComparator(order, orderBy)).map(
      (patient: Patient) => {
        const style = isActive ? classes.tableCell : classes.deletedTableCell;
        const renderTableCell = (style, width, value) => {
          let content = patient[value];
          let border = {};

          switch (value) {
            case 'triageLevel':
              content = triageLevels[content].label;
              border = {
                borderLeft: `16px solid ${
                  isActive
                    ? triageLevels[patient.triageLevel].colour
                    : Colours.White
                }`,
              };
              break;
            case 'hospitalId.name':
              content = patient.hospitalId?.name;
              break;
            case 'updatedAt':
            case 'transportTime':
              content = formatLastUpdated(patient[value], false);
              break;
            case 'status':
              content = statusLabels[patient[value]];
              break;
            default:
              break;
          }

          return (
            <TableCell
              className={style}
              key={value}
              width={width}
              style={{ maxWidth: `${width}`, ...border }}
            >
              {content}
            </TableCell>
          );
        };

        return (
          <TableRow
            hover
            key={patient.id}
            className={clsx({
              [classes.highlighted]: patient.id === lastUpdatedPatient,
            })}
            onClick={() => handleOpenDetails(patient)}
          >
            {headCells.map((cell) =>
              renderTableCell(style, cell.width, cell.headerId)
            )}
            <TableCell width="48px" style={{ maxWidth: '48px' }}>
              <IconButton
                color="inherit"
                onClick={
                  isActive
                    ? (e) => handleClickOptions(e, patient)
                    : (e) => handleClickRestoreMenu(e, patient)
                }
              >
                <MoreHoriz />
              </IconButton>
            </TableCell>
          </TableRow>
        );
      }
    );
  };

  return (
    <Table>
      <EnhancedTableHead
        classes={classes}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        headCells={headCells}
      />
      <TableBody>
        {getTableRows(true, activePatients)}
        {getTableRows(false, deletedPatients)}
      </TableBody>
      {selectedPatient && (
        <Dialog
          open={openDetails}
          onClose={handleCloseDetails}
          PaperProps={{ className: classes.detailsDialog }}
        >
          <PatientDetailsDialog
            handleCloseDetails={handleCloseDetails}
            patient={(selectedPatient as unknown) as Patient}
            runNumber={runNumber}
            updateRunNumber={handleRunNumber}
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
            {runNumber !== selectedPatient?.runNumber ? (
              <Button
                onClick={handleClickSave}
                color="secondary"
                className={classes.editButton}
              >
                Save Changes
              </Button>
            ) : (
              <Button
                onClick={handleRestoreDialogBtn}
                color="secondary"
                className={classes.editButton}
              >
                {selectedPatient.status === Status.DELETED ? 'Restore' : 'Edit'}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleClickEdit}>Edit patient</MenuItem>
        <MenuItem style={{ color: Colours.Danger }} onClick={handleClickDelete}>
          Delete patient
        </MenuItem>
      </Menu>
      <Menu
        id="simple-menu"
        anchorEl={anchorElRestore}
        keepMounted
        open={Boolean(anchorElRestore)}
        onClose={handleCloseRestoreMenu}
      >
        <MenuItem style={{ color: Colours.Black }} onClick={handleClickRestore}>
          Restore patient
        </MenuItem>
      </Menu>
      <ConfirmModal
        open={openDeletePatient}
        isActionDelete
        title="You are about to delete a patient"
        body="Deleting a patient will remove all records of the patient."
        actionLabel="Delete"
        handleClickAction={handleConfirmDeletePatient}
        handleClickCancel={handleCancelDeletePatient}
      />
      <ConfirmModal
        open={openRestorePatient}
        title="You are about to restore a patient"
        body={`Are you sure you want to restore patient #${
          selectedPatient !== undefined ? selectedPatient.barcodeValue : ''
        }`}
        actionLabel="Confirm Restore"
        handleClickAction={handleConfirmRestorePatient}
        handleClickCancel={handleCancelRestorePatient}
      />
    </Table>
  );
};
