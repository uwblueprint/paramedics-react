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

const useStyles = makeStyles({
  root: {
    paddingLeft: '56px',
    paddingRight: '56px',
  },
  tableContainer: {
    background: Colors.White
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
            {type === TabOptions.Hospital && hospitals.map((row:Hospital) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">-</TableCell>
              </TableRow>
            ))}
            {type === TabOptions.Ambulance && ambulances.map((row:Ambulance) => (
              <TableRow key={row.vehicleNumber}>
                <TableCell component="th" scope="row">
                  {row.vehicleNumber}
                </TableCell>
                <TableCell align="right">-</TableCell>
              </TableRow>
            ))}            
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ResourceTabPanel;