import React from 'react';
import {
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import Popper from '@material-ui/core/Popper';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-apollo';
import { useMutation } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddResourceButton from '../ResourceOverview/AddResourceButton';
import { GET_ALL_USERS, User } from '../../graphql/queries/users';
import { useAllUsers } from '../../graphql/queries/hooks/users';
import { DELETE_USER } from '../../graphql/mutations/users';
import { Colours } from '../../styles/Constants';

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

const dialogStyles = makeStyles({
  paper: {
    width: 485,
    height: 280,
  },
  dialogContent: {
    paddingLeft: 24,
    paddingTop: 24,
    paddingRight: 24,
  },
  dialogTitle: {
    paddingLeft: 24,
    paddingTop: 24,
    paddingRight: 24,
    paddingBottom: 0,
  },
  dialogCancel: {
    color: Colours.Secondary,
    height: 48,
    width: 107,
  },
  dialogDelete: {
    color: Colours.Danger,
    height: 48,
    width: 107,
  },
  dialogActionSpacing: {
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
});

const UserOverviewPage: React.FC = () => {
  // Write new updates to cache
  useAllUsers();

  // Read from newly updated cache
  const { data } = useQuery<any>(GET_ALL_USERS);

  const members: Array<User> = data ? data.users : [];

  // States
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedMember, selectMember] = React.useState<number>(-1);

  //  Writing to cache when deleting user
  const [deleteUser] = useMutation(DELETE_USER, {
    update(cache) {
      let { users } = cache.readQuery<User[] | null | any>({
        query: GET_ALL_USERS,
      });

      setAnchorEl(null);

      const filtered = users.filter((user) => user.id !== selectedMember);
      users = filtered;
      cache.writeQuery({
        query: GET_ALL_USERS,
        data: { users },
      });
    },
  });

  const handleClickOptions = (event) => {
    selectMember(event.currentTarget.getAttribute('data-id'));
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const history = useHistory();
  const handleClickEdit = () => {
    const memberId = selectedMember;
    history.replace(`/manage/members/edit/${memberId}`);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const handleClickDelete = () => {
    const memberId = selectedMember;
    deleteUser({ variables: { id: memberId } });
    setOpenModal(false);
  };

  const classes = pStyles();
  const hRow = headerRow();
  const table = tableStyles();
  const dRow = dataRow();
  const optionBtn = options();
  const dialogStyle = dialogStyles();

  let cells;
  cells = members.map((member: User) => {
    return (
      <TableRow>
        <TableCell classes={{ root: dRow.root }}>{member.name}</TableCell>
        <TableCell classes={{ root: dRow.root }}>{member.email}</TableCell>
        <TableCell classes={{ root: dRow.root }}>
          {member.accessLevel}
        </TableCell>
        <TableCell classes={{ root: optionBtn.root }}>
          <IconButton data-id={member.id} onClick={handleClickOptions}>
            <MoreHorizIcon style={{ color: Colours.Black }} />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  });

  return (
    <div className="member-wrapper">
      <Typography variant="h5">Team Member Overview</Typography>
      <Typography variant="body2" classes={{ body2: classes.body2 }}>
        A list of all team members that can be added to an event.
      </Typography>

      <TableContainer>
        <Table classes={{ root: table.root }}>
          <TableHead>
            <TableRow>
              <TableCell classes={{ root: hRow.root }}>Name</TableCell>
              <TableCell classes={{ root: hRow.root }}>Email</TableCell>
              <TableCell classes={{ root: hRow.root }}>Role</TableCell>
              <TableCell classes={{ root: optionBtn.root }} />
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
                    <TableRow hover onClick={() => setOpenModal(true)}>
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
      <Dialog classes={{ paper: dialogStyle.paper }} open={openModal}>
        <DialogTitle classes={{ root: dialogStyle.dialogTitle }}>
          <Typography variant="h6">
            <strong>You are about to delete a team member.</strong>
          </Typography>
        </DialogTitle>
        <DialogContent classes={{ root: dialogStyle.dialogContent }}>
          <Typography variant="body2">
            Deleted team members will no longer have access to any casualty
            collection points.
          </Typography>
        </DialogContent>
        <DialogActions classes={{ spacing: dialogStyle.dialogActionSpacing }}>
          <Button
            classes={{ root: dialogStyle.dialogCancel }}
            onClick={() => setOpenModal(false)}
          >
            <Typography variant="body1">Cancel</Typography>
          </Button>
          <Button
            classes={{ root: dialogStyle.dialogDelete }}
            onClick={handleClickDelete}
          >
            <Typography variant="body1">Delete</Typography>
          </Button>
        </DialogActions>
      </Dialog>
      <div className="add-resource-container">
        <AddResourceButton
          label="Add Team Member"
          route="/manage/members/new"
        />
      </div>
    </div>
  );
};

export default UserOverviewPage;
