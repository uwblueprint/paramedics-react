import React from 'react';
import moment from 'moment';
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
import { useMutation } from '@apollo/react-hooks';
import { MoreHoriz } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import { Colours } from '../../styles/Constants';
import {
  Patient,
  TriageLevel,
  Status,
  GET_ALL_PATIENTS,
} from '../../graphql/queries/patients';
import { Order, stableSort, getComparator } from '../../utils/sort';
import ConfirmModal from '../common/ConfirmModal';
import { CCPDashboardTabOptions } from './CCPDashboardPage';
import { EDIT_PATIENT, DELETE_PATIENT } from '../../graphql/mutations/patients';
import { PatientDetailsDialog } from './PatientDetailsDialog';
import { capitalize } from '../../utils/format';

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
  type: CCPDashboardTabOptions;
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
  const { classes, order, orderBy, onRequestSort, type } = props;

  const createSortHandler = (property: string) => (event: React.MouseEvent) => {
    onRequestSort(event, property);
  };

  const headCells: HeadCell[] = [
    { headerId: 'triageLevel', label: 'Triage', width: '78px' },
    { headerId: 'barcodeValue', label: 'Barcode', width: '94px' },
    { headerId: 'gender', label: 'Gender', width: '72px' },
    { headerId: 'age', label: 'Age', width: '34px' },
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

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell
            key={headCell.headerId}
            sortDirection={orderBy === headCell.headerId ? order : false}
            width={headCell.width}
            style={{
              minWidth: headCell.width,
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
  const [selectedPatient, setSelectedPatient] = React.useState(
    patients.find((x) => x.id === patientId)
  );
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [runNumber, setRunNumber] = React.useState<number | null>(
    selectedPatient ? selectedPatient.runNumber : null
  );
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const [deletePatient] = useMutation(DELETE_PATIENT, {});

  const [editPatient] = useMutation(EDIT_PATIENT, {
    update(cache): void {
      const patientId = ((selectedPatient as unknown) as Patient).id;
      const { patients } = cache.readQuery<any>({
        query: GET_ALL_PATIENTS,
      });
      setSelectedPatient(patients.find((x) => x.id === patientId));
    },
  });

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

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClickEdit = () => {
    history.push(
      `/events/${eventId}/ccps/${ccpId}/patients/${
        ((selectedPatient as unknown) as Patient).id
      }`
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
      history.push(`/events/${eventId}/ccps/${ccpId}`);
    } else {
      setOpenDetails(false);
    }
  };

  const handleCancelDeletePatient = () => {
    setOpenDeletePatient(false);
  };

  const handleRunNumber = (newRunNumber) => {
    const convertedRunNumber = newRunNumber ? parseInt(newRunNumber) : null;
    setRunNumber(convertedRunNumber);
  };

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

  const tableRows = stableSort(patients, getComparator(order, orderBy)).map(
    (patient: Patient) => {
      const triageLevels = {
        [TriageLevel.GREEN]: {
          colour: Colours.TriageGreen,
          triageLevel: TriageLevel.GREEN,
          label: 'Green',
        },
        [TriageLevel.YELLOW]: {
          colour: Colours.TriageYellow,
          triageLevel: TriageLevel.YELLOW,
          label: 'Yellow',
        },
        [TriageLevel.RED]: {
          colour: Colours.TriageRed,
          triageLevel: TriageLevel.RED,
          label: 'Red',
        },
        [TriageLevel.BLACK]: {
          colour: Colours.Black,
          triageLevel: TriageLevel.BLACK,
          label: 'Black',
        },
        [TriageLevel.WHITE]: {
          colour: Colours.BorderLightGray,
          triageLevel: TriageLevel.WHITE,
          label: 'White',
        },
      };

      const statusLabels = {
        [Status.ON_SITE]: 'On Scene',
        [Status.TRANSPORTED]: 'Transported',
        [Status.RELEASED]: 'Released',
        [Status.DELETED]: 'Omitted/Deleted',
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
          <TableCell
            className={classes.tableCell}
            style={{
              width: '78px',
              maxWidth: '78px',
              borderLeft: `16px solid ${
                triageLevels[patient.triageLevel].colour
              }`,
            }}
          >
            {triageLevels[patient.triageLevel].label}
          </TableCell>
          <TableCell
            className={classes.tableCell}
            width="94px"
            style={{ maxWidth: '94px' }}
          >
            {patient.barcodeValue}
          </TableCell>
          <TableCell
            className={classes.tableCell}
            width="72px"
            style={{ maxWidth: '72px' }}
          >
            {patient.gender}
          </TableCell>
          <TableCell
            className={classes.tableCell}
            width="34px"
            style={{ maxWidth: '34px' }}
          >
            {patient.age}
          </TableCell>
          <TableCell
            className={classes.tableCell}
            width="104px"
            style={{ maxWidth: '104px' }}
          >
            {statusLabels[patient.status]}
          </TableCell>
          {type === CCPDashboardTabOptions.PatientOverview && (
            <>
              <TableCell
                className={classes.tableCell}
                width="128px"
                style={{ maxWidth: '128px' }}
              >
                {patient.hospitalId?.name}
              </TableCell>
              <TableCell
                className={classes.tableCell}
                width="192px"
                style={{ maxWidth: '192px' }}
              >
                {moment(patient.updatedAt).format('MMM D YYYY, h:mm A')}
              </TableCell>
            </>
          )}
          {type === CCPDashboardTabOptions.Hospital && (
            <>
              <TableCell
                className={classes.tableCell}
                width="132px"
                style={{ maxWidth: '132px' }}
              >
                {patient.runNumber}
              </TableCell>
              <TableCell
                className={classes.tableCell}
                width="192px"
                style={{ maxWidth: '192px' }}
              >
                {moment(patient.transportTime).format('MMM D YYYY, h:mm A')}
              </TableCell>
            </>
          )}
          <TableCell width="48px" style={{ maxWidth: '48px' }}>
            <IconButton
              color="inherit"
              onClick={(e) => handleClickOptions(e, patient)}
            >
              <MoreHoriz />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    }
  );

  return (
    <Table>
      <EnhancedTableHead
        classes={classes}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        type={type}
      />
      <TableBody>{tableRows}</TableBody>
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
                onClick={() => {
                  history.push(
                    `/events/${eventId}/ccps/${ccpId}/patients/${
                      ((selectedPatient as unknown) as Patient).id
                    }`
                  );
                }}
                color="secondary"
                className={classes.editButton}
              >
                Edit
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
      <ConfirmModal
        open={openDeletePatient}
        isActionDelete
        title="You are about to delete a patient"
        body="Deleting a patient will remove all records of the patient."
        actionLabel="Delete"
        handleClickAction={handleConfirmDeletePatient}
        handleClickCancel={handleCancelDeletePatient}
      />
    </Table>
  );
};
//
