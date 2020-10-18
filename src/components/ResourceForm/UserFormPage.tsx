import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from 'react-apollo';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { Typography, makeStyles } from '@material-ui/core';
import FormField from '../common/FormField';
import BackLink from '../common/BackLink';
import CancelButton from './CancelButton';
import DoneButton from './DoneButton';
import AccessLevelSelector from './AccessLevelSelector';
import { Colours } from '../../styles/Constants';
import { ADD_USER, EDIT_USER } from '../../graphql/mutations/users';
import {
  User,
  AccessLevel,
  GET_ALL_USERS,
  GET_USER_BY_ID,
} from '../../graphql/queries/users';

const useStyles = makeStyles({
  resourceWrapper: {
    backgroundColor: Colours.White,
  },
  resourceCreationTopSection: {
    margin: '48px 30px 0px 30px',
    backgroundColor: Colours.White,
    borderBottom: `1px solid ${Colours.BorderLightGray}`,
  },
  resourceHeader: {
    display: 'flex',
    padding: '16px 0px',
  },
  resourceForm: {
    padding: '30px',
  },
  caption: {
    marginBottom: '16px',
  },
});

const UserFormPage = ({
  match: {
    params: { mode, userId },
  },
}: {
  match: { params: { mode: string; userId?: string } };
}) => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const { data, loading } = useQuery(
    mode === 'edit' && userId ? GET_USER_BY_ID(userId) : GET_ALL_USERS
  );

  const users: Array<User> = data ? data.users : [];

  const [addUser] = useMutation(ADD_USER, {
    update(cache, { data: { addUser } }) {
      cache.writeQuery({
        query: GET_ALL_USERS,
        data: { users: users.concat([addUser]) },
      });
    },
    onCompleted() {
      enqueueSnackbar('Team member added.');
      history.replace('/manage/members');
    },
  });
  const [editUser] = useMutation(EDIT_USER, {
    onCompleted() {
      enqueueSnackbar('Team member edited.');
      history.replace('/manage/members');
    },
  });

  const [memberName, setMemberName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<AccessLevel>(AccessLevel.SUPERVISOR);

  useEffect(() => {
    if (!loading && mode === 'edit') {
      const {
        name,
        email,
        accessLevel,
      }: {
        name: string;
        email: string;
        accessLevel: AccessLevel;
      } = data.user;
      setMemberName(name);
      setEmail(email);
      setRole(accessLevel);
    }
  }, [data, loading, mode]);

  useEffect(() => {
    if (!loading) {
      ValidatorForm.addValidationRule('isUniqueEmail', () => {
        const isUnique = users
          ? users.filter((user) => user.email === email).length === 0
          : true;
        return isUnique;
      });
    }
  }, [email, users, loading]);

  const handleNameChange = (e: any) => {
    setMemberName(e.target.value);
  };

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handleRoleChange = (e: any) => {
    setRole(e.target.value);
  };

  const handleComplete = () => {
    if (mode === 'new') {
      addUser({
        variables: {
          name: memberName,
          email,
          password: 'password',
          accessLevel: role,
          emergencyContact: '1234567890',
        },
      });
    } else if (mode === 'edit') {
      editUser({
        variables: {
          id: userId,
          name: memberName,
          email,
          accessLevel: role,
        },
      });
    }
  };

  const classes = useStyles();

  return (
    <div className={classes.resourceWrapper}>
      <div className={classes.resourceCreationTopSection}>
        <BackLink to="/manage/members" />
        <div className={classes.resourceHeader}>
          <Typography variant="h4">
            {mode === 'new' ? 'Add a new team member' : 'Edit team member'}
          </Typography>
        </div>
        {mode === 'new' ? (
          <div className={classes.caption}>
            <Typography
              variant="caption"
              style={{ color: Colours.SecondaryGray, marginBottom: '16px' }}
            >
              New team members will receive sign up instructions via email.
            </Typography>
          </div>
        ) : (
          ''
        )}
      </div>
      <ValidatorForm onSubmit={handleComplete}>
        <div className={classes.resourceForm}>
          <FormField
            label="*Team Member Name:"
            isValidated={false}
            onChange={handleNameChange}
            value={memberName}
          />
          <FormField
            label="*Email:"
            isValidated
            disabled={mode === 'edit'}
            validators={['required', 'isEmail', 'isUniqueEmail']}
            errorMessages={[
              'This is a mandatory field',
              'Invalid email',
              'Email is already in use',
            ]}
            onChange={handleEmailChange}
            value={email}
          />
          <AccessLevelSelector
            currentValue={role}
            handleChange={handleRoleChange}
          />
          <Typography
            variant="caption"
            style={{ color: Colours.SecondaryGray }}
          >
            *Denotes a required field
          </Typography>
        </div>
        <DoneButton disabled={memberName === '' || email === ''} />
      </ValidatorForm>
      <CancelButton to="/manage/members" />
    </div>
  );
};

export default UserFormPage;
