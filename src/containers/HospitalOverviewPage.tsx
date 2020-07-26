import React from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, IconButton } from '@material-ui/core';
import Popper from '@material-ui/core/Popper';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from 'react-apollo';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddResourceButton from '../components/ResourceOverviewPage/AddResourceButton';
import { GET_ALL_HOSPITALS } from '../graphql/queries/hospitals';
import { DELETE_HOSPITAL } from '../graphql/mutations/hospitals';
import { Colours } from '../styles/Constants';

const pStyles = makeStyles({
  body2: {
    marginTop: 18,
    color: Colours.SecondaryGray,
  },
});

const tableStyles = makeStyles({
  root: {
    backgroundColor: Colours.White,
    marginTop: 24,
    border: '1px solid #CCCCCC',
  },
});

const headerRow = makeStyles({
  root: {
    color: 'black',
    fontWeight: 600,
    fontSize: 14,
    paddingTop: 17,
    paddingBottom: 17,
    paddingLeft: 32,
    paddingRight: 32,
  },
});

const dataRow = makeStyles({
  root: {
    color: 'black',
    fontWeight: 400,
    fontSize: 14,
    paddingTop: 16.5,
    paddingBottom: 16.5,
    paddingLeft: 32,
    paddingRight: 32,
  },
});

const options = makeStyles({
  root: {
    textAlign: 'right',
  },
  menuCell: {
    borderBottom: 0,
  },
  menuHover: {
    borderRadius: '4px 4px 4px 4px',
  },
  menuDelete: {
    color: '#9B2F2F',
  },
});

const HospitalOverviewPage: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedHospital, selectHospital] = React.useState<number>(-1);

  const { data, loading } = useQuery(GET_ALL_HOSPITALS);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const classes = pStyles();
  const hRow = headerRow();
  const table = tableStyles();
  const dRow = dataRow();
  const optionBtn = options();

  //  Writing to cache when deleting user
  const [deleteHospital] = useMutation(DELETE_HOSPITAL, {
    update(cache) {
      let { hospitals } = cache.readQuery<null | any>({
        query: GET_ALL_HOSPITALS,
      });

      setAnchorEl(null);

      const filtered = hospitals.filter(
        (hospital) => hospital.id !== selectedHospital
      );
      hospitals = filtered;
      cache.writeQuery({
        query: GET_ALL_HOSPITALS,
        data: { hospitals },
      });
    },
  });

  const handleClickOptions = (event) => {
    selectHospital(event.currentTarget.getAttribute('data-id'));
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const history = useHistory();
  const handleClickEdit = () => {
    const hospitalId = selectedHospital;
    history.replace(`/manage/hospitals/edit/${hospitalId}`);
  };

  const handleClickDelete = () => {
    const hospitalId = selectedHospital;
    deleteHospital({ variables: { id: hospitalId } });
  };

  let cells;
  if (loading === false && data !== undefined && data) {
    cells = data.hospitals.map((hospital) => {
      return (
        <TableRow>
          <TableCell classes={{ root: dRow.root }}>{hospital.name}</TableCell>
          <TableCell classes={{ root: optionBtn.root }}>
            <IconButton data-id={hospital.id} onClick={handleClickOptions}>
              <MoreHorizIcon style={{ color: Colours.Black }} />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
  }

  return (
    <div className="member-wrapper">
      <Typography variant="h5">Hospital Overview</Typography>
      <Typography variant="body2" classes={{ body2: classes.body2 }}>
        A list of all hospitals that can be added to an event.
      </Typography>

      <TableContainer>
        <Table classes={{ root: table.root }}>
          <TableHead>
            <TableRow>
              <TableCell classes={{ root: hRow.root }}>Hospital Name</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {cells}
            <Popper
              id={id}
              open={open}
              popperOptions={{
                modifiers: { offset: { enabled: true, offset: '-69.5,0' } },
              }}
              anchorEl={anchorEl}
            >
              <div>
                <Table className="table-popper">
                  <TableBody>
                    <TableRow
                      hover
                      classes={{ hover: optionBtn.menuHover }}
                      onClick={handleClickEdit}
                    >
                      <TableCell classes={{ root: optionBtn.menuCell }}>
                        <Typography variant="body2">Edit</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow hover onClick={handleClickDelete}>
                      <TableCell classes={{ root: optionBtn.menuDelete }}>
                        <Typography variant="body2">Delete</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Popper>
          </TableBody>
        </Table>
      </TableContainer>
      <div className="add-event-container">
        <AddResourceButton label="Add Hospital" route="/manage/hospitals/new" />
      </div>
    </div>
  );
};

export default HospitalOverviewPage;
