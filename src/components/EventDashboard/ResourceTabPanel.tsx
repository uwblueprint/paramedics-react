import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import { makeStyles } from "@material-ui/core/styles";
import { Colors } from '../../styles/Constants';
import { TabOptions } from './EventDashboardPage';
import { useQuery } from '@apollo/react-hooks';
import { GET_ALL_HOSPITALS } from '../../graphql/queries/hospitals';
import { GET_ALL_AMBULANCES } from '../../graphql/queries/ambulances';
import { Typography } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles({
  root: {
    paddingLeft: '56px',
    paddingRight: '56px',
  },
  tableContainer: {
    background: Colors.White
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
  }
});

interface ResourceTabPanelProps {
  eventId: string;
  type: TabOptions.Hospital | TabOptions.Ambulance;
  hospitals?: Hospital[];
  ambulances?: Ambulance[];
}

interface Hospital {
  id: number;
  name: string;
}

interface Ambulance {
  id: number;
  vehicleNumber: number;
}

const ResourceTabPanel = ({eventId, type, hospitals = [], ambulances = []}: ResourceTabPanelProps) => {
  const classes = useStyles();

  const query = type === TabOptions.Hospital ? GET_ALL_HOSPITALS : GET_ALL_AMBULANCES;

  const { data } = useQuery(query);

  const rows = data ? ( data.hospitals || data.ambulances ) : [];

  return (
    <Box className={classes.root}>
      <TableContainer className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{type === TabOptions.Hospital ? 'Hospital Name' : 'Digit'}</TableCell>
              <TableCell align="right">Activity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {type === TabOptions.Hospital && rows.map((row:Hospital) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">
                  {(hospitals.filter(h => h.id === row.id).length > 0) ? 
                    <Typography variant="button" className={classes.active}><FiberManualRecordIcon className={classes.activeIcon}/>Active</Typography> : 
                    <Typography variant="button" className={classes.inactive}>Inactive</Typography>
                  }
                </TableCell>
              </TableRow>
            ))}
            {type === TabOptions.Ambulance && rows.map((row:Ambulance) => (
              <TableRow key={row.vehicleNumber}>
                <TableCell component="th" scope="row">
                  {row.vehicleNumber}
                </TableCell>
                <TableCell align="right">
                  {(ambulances.filter(a => a.id === row.id).length > 0) ? 
                    <Typography variant="button" className={classes.active}><FiberManualRecordIcon className={classes.activeIcon}/>Active</Typography> : 
                    <Typography variant="button" className={classes.inactive}>Inactive</Typography>
                  }
                  </TableCell>
              </TableRow>
            ))}            
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ResourceTabPanel;