import React from 'react';
import { Typography, IconButton } from '@material-ui/core';
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
import AddResourceButton from '../components/ResourceOverviewPage/AddResourceButton';
import { GET_ALL_USERS, AccessLevel } from '../graphql/queries/users';
import { DELETE_USER } from '../graphql/mutations/users';
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

interface Member {
  name: string;
  email: string;
  accessLevel: AccessLevel;
  id: string;
}

const TeamMemberOverviewPage: React.FC = () => {
  const { data, loading } = useQuery(GET_ALL_USERS);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedMember, selectMember] = React.useState<number>(-1);

  //  Writing to cache when deleting user
  const [deleteUser] = useMutation(DELETE_USER, {
    update(cache) {
      let { users } = cache.readQuery<Member[] | null | any>({
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
  };

  const classes = pStyles();
  const hRow = headerRow();
  const table = tableStyles();
  const dRow = dataRow();
  const optionBtn = options();

  let cells;

  if (loading === false && data && data !== undefined) {
    cells = data.users.map((member) => {
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
  }

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
          label="Add Team Member"
          route="/manage/members/new"
        />
      </div>
    </div>
  );
};

export default TeamMemberOverviewPage;
