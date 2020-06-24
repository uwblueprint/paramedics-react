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
import { useQuery } from '@apollo/react-hooks';
import { GET_ALL_CCPS } from '../../graphql/queries/templates/ccps';
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';

const useStyles = makeStyles({
  root: {
    padding: '56px'
  },
  tableContainer: {
    background: Colors.White,
    border: `1px solid ${Colors.BorderLightGray}`,
    borderRadius: '4px',
  },
  addButton: {
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    borderRadius: '2000px',
    position: 'fixed',
    bottom: '56px',
    right: '56px',
    padding: '12px 26px'
  },
  buttonIcon: {
    marginRight: '13px'
  },
});

interface CCP {
  id: string;
  name: string;
  eventId: { id: string };
}

const CCPTabPanel = ({eventId}: {eventId: string}) => {
  const classes = useStyles();

  const { loading, error, data } = useQuery(GET_ALL_CCPS);

  const rows = data ? data.collectionPoints.filter((ccp:CCP) => ccp.eventId.id === eventId) : [];

  return (
    <Box className={classes.root}>
      <TableContainer className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>CCP Name</TableCell>
              <TableCell align="right">Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row:CCP) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">-</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button className={classes.addButton} variant="contained" color="secondary">
          <Add className={classes.buttonIcon}/>Add CCP
        </Button>
    </Box>
  )
}

export default CCPTabPanel;
