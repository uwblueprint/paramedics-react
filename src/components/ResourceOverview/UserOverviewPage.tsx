import React from 'react';
import { Typography, IconButton } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useQuery } from 'react-apollo';
import { useMutation } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddResourceButton from './AddResourceButton';
import ConfirmModal from '../common/ConfirmModal';
import OptionPopper, { Option } from '../common/OptionPopper';

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

const optionStyles = makeStyles({
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
    color: Colours.DangerHover,
  },
});

const useLayout = makeStyles({
  wrapper: {
    backgroundColor: '#f0f0f0',
    padding: '56px',
    minHeight: '100vh',
  },
  tablePopper: {
    minWidth: '159px',
    height: '112px',
    backgroundColor: Colours.White,
    borderRadius: '4px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
  },
  addResourceContainer: {
    position: 'fixed',
    right: '48px',
    bottom: '48px',
  },
});

const UserOverviewPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

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
    update(cache, { data: { deleteUser } }) {
      if (!deleteUser) {
        return;
      }
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

  const handleClickDelete = () => {
    const memberId = selectedMember;
    deleteUser({ variables: { id: memberId } });
    setOpenModal(false);
    setAnchorEl(null);
    enqueueSnackbar('Team member deleted.');
  };

  const handleDeleteOption = () => {
    setOpenModal(true);
  }

  const handleClickCancel = () => {
    setAnchorEl(null);
    setOpenModal(false);
  };

  const paraStyle = pStyles();
  const classes = useLayout();
  const hRow = headerRow();
  const table = tableStyles();
  const dRow = dataRow();
  const optionStyle = optionStyles();

  const options: Array<Option> = [
    {
      styles: optionStyle.menuCell,
      onClick: handleClickEdit,
      name: 'Edit',
    },
    {
      styles: optionStyle.menuDelete,
      onClick: handleDeleteOption,
      name: 'Delete',
    },
  ];

  const cells = members.map((member: User) => {
    return (
      <TableRow key={member.id}>
        <TableCell classes={{ root: dRow.root }}>{member.name}</TableCell>
        <TableCell classes={{ root: dRow.root }}>{member.email}</TableCell>
        <TableCell classes={{ root: dRow.root }}>
          {member.accessLevel
            ? member.accessLevel.charAt(0).toUpperCase() +
              member.accessLevel.substring(1).toLowerCase()
            : null}
        </TableCell>
        <TableCell classes={{ root: optionStyle.root }}>
          <IconButton data-id={member.id} onClick={handleClickOptions}>
            <MoreHorizIcon style={{ color: Colours.Black }} />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  });

  return (
    <div className={classes.wrapper}>
      <Typography variant="h5">Team Member Overview</Typography>
      <Typography variant="body2" classes={{ body2: paraStyle.body2 }}>
        A list of all team members that can be added to an event.
      </Typography>

      <TableContainer>
        <Table classes={{ root: table.root }}>
          <TableHead>
            <TableRow>
              <TableCell classes={{ root: hRow.root }}>Name</TableCell>
              <TableCell classes={{ root: hRow.root }}>Email</TableCell>
              <TableCell classes={{ root: hRow.root }}>Role</TableCell>
              <TableCell classes={{ root: optionStyle.root }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {cells}
            <OptionPopper
              id={String(selectedMember)}
              open={open}
              anchorEl={anchorEl}
              onClickAway={() => {
                setAnchorEl(null);
              }}
              options={options}
            />
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmModal
        open={openModal}
        title="You are about to delete a team member."
        body="Deleted team members will no longer have access to any casualty collection points."
        actionLabel="Delete"
        handleClickAction={handleClickDelete}
        handleClickCancel={handleClickCancel}
      />
      <div className={classes.addResourceContainer}>
        <AddResourceButton
          label="Add Team Member"
          route="/manage/members/new"
        />
      </div>
    </div>
  );
};

export default UserOverviewPage;
