import React from 'react';
import clsx from 'clsx';
import {
  Typography,
  makeStyles,
  Card,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';
import { Colours } from '../../styles/Constants';
import { Patient, Status } from '../../graphql/queries/patients';
import { TotalPatientCard } from './TotalPatientCard';
import { TriageCard } from './TriageCard';
import { PatientInfoTableWithFilters } from './PatientInfoTableWithFilters';
import { ScanPatientButton } from './ScanPatientButton';

interface PatientOverviewProps {
  // eslint-disable-next-line react/no-unused-prop-types
  eventId: string;
  // eslint-disable-next-line react/no-unused-prop-types
  ccpId: string;
  patients: Patient[];
  patientId?: string;
  lastUpdatedPatient?: string;
}

interface TableRowData {
  category: string;
  count: number;
  ratio: number;
}

const useStyles = makeStyles({
  fullHeightGridItem: {
    display: 'flex',
    alignSelf: 'stretch',
  },
  categoryTableCard: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: '44px',
    paddingLeft: '44px',
    marginTop: '16px',
  },
  lightBorder: {
    borderColor: Colours.BackgroundGray,
  },
  noBorder: {
    border: 0,
  },
  cellWithIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  patientTableCard: {
    marginTop: '24px',
    marginBottom: '145px',
  },
  scanButton: {
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    borderRadius: '2000px',
    position: 'fixed',
    bottom: '56px',
    right: '56px',
    padding: '12px 26px',
  },
});

export const PatientOverview = (props: PatientOverviewProps) => {
  const classes = useStyles();

  const { patients, eventId, ccpId, patientId, lastUpdatedPatient } = props;

  const createCategoryData = (
    category: string,
    status: Status
  ): TableRowData => {
    const count = patients.filter(
      (patient: Patient) => patient.status === status
    ).length;
    const ratio = Math.round((count / patients.length) * 100) || 0;
    return {
      category,
      count,
      ratio,
    };
  };

  const categoryTableRows: TableRowData[] = [
    createCategoryData('On Scene', Status.ON_SITE),
    createCategoryData('Transported', Status.TRANSPORTED),
    createCategoryData('Released', Status.RELEASED),
    createCategoryData('Omitted/Deleted', Status.DELETED),
  ];

  const noBorderLastRow = (index) =>
    clsx({
      [classes.lightBorder]: true,
      [classes.noBorder]: index === categoryTableRows.length - 1,
    });

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid>
        <Grid item>
          <TotalPatientCard numPatients={patients.length} />
        </Grid>
        <Grid item>
          <TriageCard patients={patients} styles={{ marginRight: '24px' }} />
        </Grid>
      </Grid>
      <Grid item className={classes.fullHeightGridItem}>
        <Card variant="outlined" className={classes.categoryTableCard}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" color="textSecondary">
                      Category
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" color="textSecondary">
                      Count
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" color="textSecondary">
                      Ratio
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoryTableRows.map((row: TableRowData, index) => (
                  <TableRow key={row.category}>
                    <TableCell
                      className={clsx({
                        [classes.cellWithIcon]: true,
                        [classes.lightBorder]: true,
                        [classes.noBorder]:
                          index === categoryTableRows.length - 1,
                      })}
                      component="th"
                      scope="row"
                    >
                      <Typography variant="body2" color="textPrimary">
                        {row.category}
                      </Typography>
                    </TableCell>
                    <TableCell className={noBorderLastRow(index)} align="right">
                      <Typography variant="body1" color="textPrimary">
                        {row.count}
                      </Typography>
                    </TableCell>
                    <TableCell className={noBorderLastRow(index)} align="right">
                      <Typography variant="body1" color="textSecondary">
                        {`${row.ratio}%`}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
      <Card variant="outlined" className={classes.patientTableCard}>
        <PatientInfoTableWithFilters
          patients={patients}
          eventId={eventId}
          ccpId={ccpId}
          patientId={patientId}
          lastUpdatedPatient={lastUpdatedPatient}
        />
      </Card>
      <ScanPatientButton />
    </Grid>
  );
};
