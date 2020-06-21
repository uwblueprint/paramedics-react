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

const useStyles = makeStyles({
  root: {
    paddingLeft: '56px',
    paddingRight: '56px',
  },
  tableContainer: {
    background: Colors.White
  }
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
    </Box>
  )
}

export default CCPTabPanel;