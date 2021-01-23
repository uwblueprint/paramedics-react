import React from 'react';
import {
  makeStyles,
  Box,
  Card,
  Grid,
  Typography,
  Select,
  MenuItem,
} from '@material-ui/core';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@material-ui/icons/ExpandLessRounded';
import { Patient } from '../../graphql/queries/patients';
import { TriageCard } from './TriageCard';
import { PatientInfoTable } from './PatientInfoTable';
import { ScanPatientButton } from './ScanPatientButton';
import { CCPDashboardTabOptions, CCPDashboardTabMap } from './CCPDashboardPage';

interface HospitalOverviewProps {
  eventId: string;
  ccpId: string;
  patients: Patient[];
  patientId?: string;
  lastUpdatedPatient: string | null;
}

const useStyles = makeStyles({
  card: {
    padding: '24px',
    marginTop: '16px',
    marginRight: '24px',
    height: '100%',
  },
  select: {
    minWidth: '240px',
  },
  menuItem: {
    boxSizing: 'border-box',
    height: '48px',
  },
  icon: {
    marginRight: '24px',
  },
  patientTableCard: {
    marginTop: '24px',
    marginBottom: '145px',
    width: '100%',
  },
  remainingWidthGridItem: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
});

export const HospitalOverview = (props: HospitalOverviewProps) => {
  const { patients, eventId, ccpId, patientId, lastUpdatedPatient } = props;
  const classes = useStyles();

  const [selectedHospital, setSelectedHospital] = React.useState<string>(
    'All Hospitals'
  );
  const [filteredPatients, setFilteredPatients] = React.useState<Patient[]>(
    patients
  );
  const [isSelectOpen, setIsSelectOpen] = React.useState<boolean>(false);

  const hospitals = React.useMemo(() => {
    const allHospitals: string[] = patients.reduce(
      (hospitals: string[], patient: Patient) => {
        const { hospitalId } = patient;
        if (hospitalId) {
          hospitals.push(hospitalId.name);
        }
        return hospitals;
      },
      []
    );
    return [...Array.from(new Set(allHospitals)), 'All Hospitals'].sort();
  }, [patients]);

  const filterPatients = React.useCallback(() => {
    if (selectedHospital === 'All Hospitals') {
      setFilteredPatients(patients);
    } else {
      setFilteredPatients(
        patients.filter(
          (patient: Patient) => patient.hospitalId?.name === selectedHospital
        )
      );
    }
  }, [selectedHospital, patients]);

  React.useEffect(() => {
    filterPatients();
  }, [filterPatients, selectedHospital]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedHospital(event.target.value as string);
  };

  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      style={{ marginTop: '52px' }}
    >
      <Grid>
        <Card variant="outlined" className={classes.card}>
          <Select
            variant="outlined"
            value={selectedHospital}
            onChange={handleChange}
            className={classes.select}
            IconComponent={() => {
              return isSelectOpen ? (
                <ExpandLessRoundedIcon className={classes.icon} />
              ) : (
                <ExpandMoreRoundedIcon className={classes.icon} />
              );
            }}
            onOpen={() => setIsSelectOpen(true)}
            onClose={() => setIsSelectOpen(false)}
          >
            {hospitals.map((hospital) => (
              <MenuItem
                key={hospital}
                value={hospital}
                className={classes.menuItem}
              >
                {hospital}
              </MenuItem>
            ))}
          </Select>
          <Box display="flex" alignItems="baseline">
            <Typography
              variant="h4"
              color="textPrimary"
              style={{ marginTop: '24px', marginRight: '16px' }}
            >
              {filteredPatients.length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              total patients
            </Typography>
          </Box>
        </Card>
      </Grid>
      <Grid className={classes.remainingWidthGridItem}>
        <TriageCard patients={filteredPatients} />
      </Grid>
      <Card variant="outlined" className={classes.patientTableCard}>
        <PatientInfoTable
          patients={filteredPatients}
          type={CCPDashboardTabOptions.Hospital}
          eventId={eventId}
          ccpId={ccpId}
          patientId={patientId}
          lastUpdatedPatient={lastUpdatedPatient}
        />
      </Card>
      <ScanPatientButton
        eventId={eventId}
        ccpId={ccpId}
        from={CCPDashboardTabMap[CCPDashboardTabOptions.Hospital]}
      />
    </Grid>
  );
};
