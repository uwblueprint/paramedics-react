import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Colours } from "../styles/Constants";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { IconButton } from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import AddResourceButton from "../components/ResourceOverviewPage/AddResourceButton";
import Popper from "@material-ui/core/Popper";
import { useQuery } from "react-apollo";
import { useMutation } from "@apollo/react-hooks";
import { GET_ALL_AMBULANCES } from "../graphql/queries/ambulances";
import { DELETE_AMBULANCE } from "../graphql/mutations/ambulances";

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
    border: "1px solid #CCCCCC",
  },
});

const cellStyles = makeStyles({
  alignLeft: {
    display: "flex",
  },
});

const headerRow = makeStyles({
  root: {
    color: "black",
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
    color: "black",
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
    textAlign: "right",
  },
  menuCell: {
    borderBottom: 0,
  },
  menuHover: {
    borderRadius: "4px 4px 4px 4px",
  },
  menuDelete: {
    color: "#9B2F2F",
  },
});

const AmbulanceOverviewPage: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedAmbulance, selectAmbulance] = React.useState<number>(-1);

  //Writing to cache when deleting user
  const [deleteAmbulance] = useMutation(DELETE_AMBULANCE, {
    update(cache, { data: { deleteAmbulance } }) {
      let { ambulances } = cache.readQuery<null | any>({
        query: GET_ALL_AMBULANCES,
      });

      setAnchorEl(null);

      let filtered = ambulances.filter(
        (ambulance) => ambulance.id !== selectedAmbulance
      );
      ambulances = filtered;
      cache.writeQuery({
        query: GET_ALL_AMBULANCES,
        data: { ambulances: ambulances },
      });
    },
  });

  const handleClickOptions = (event) => {
    selectAmbulance(event.currentTarget.getAttribute("data-id"));
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const history = useHistory();
  const handleClickEdit = (event) => {
    let ambulanceId = selectedAmbulance;
    history.replace(`/manage/ambulances/edit/${ambulanceId}`);
  };

  const handleClickDelete = (event) => {
    {
      let ambulanceId = selectedAmbulance;
      deleteAmbulance({ variables: { id: ambulanceId } });
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  const { data, loading, error } = useQuery(GET_ALL_AMBULANCES);

  const classes = pStyles();
  const hRow = headerRow();
  const table = tableStyles();
  const dRow = dataRow();
  const optionBtn = options();

  let cells;

  if (loading === false) {
    cells = data.ambulances.map((ambulance) => {
      return (
        <TableRow>
          <TableCell classes={{ root: dRow.root }}>
            #{ambulance.vehicleNumber}
          </TableCell>
          <TableCell classes={{ root: optionBtn.root }}>
            <IconButton data-id={ambulance.id} onClick={handleClickOptions}>
              <MoreHorizIcon style={{ color: Colours.Black }} />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
  }

  return (
    <div className="member-wrapper">
      <Typography variant="h5">Ambulance Overview</Typography>
      <Typography variant="body2" classes={{ body2: classes.body2 }}>
        A list of all ambulances that can be added to an event.
      </Typography>
      <TableContainer>
        <Table classes={{ root: table.root }}>
          <TableHead>
            <TableRow>
              <TableCell classes={{ root: hRow.root }}>
                Ambulance number
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cells}
            <Popper
              id={id}
              open={open}
              popperOptions={{
                modifiers: { offset: { enabled: true, offset: "-69.5,0" } },
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
        <AddResourceButton
          label="Add Ambulance"
          route="/manage/ambulances/new"
        />
      </div>
    </div>
  );
};

export default AmbulanceOverviewPage;
