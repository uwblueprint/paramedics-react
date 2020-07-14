import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "../styles/ResourceCreationPage.css";
import Typography from "@material-ui/core/Typography";
import FormField from "../components/common/FormField";
import BackLink from "../components/ResourceCreationPage/BackLink";
import CancelButton from "../components/ResourceCreationPage/CancelButton";
import DoneButton from "../components/ResourceCreationPage/DoneButton";
import AccessLevelSelector from "../components/ResourceCreationPage/AccessLevelSelector";
import { Colours } from '../styles/Constants';
import { useMutation } from "@apollo/react-hooks";
import { useQuery } from "react-apollo";
import { ADD_USER, EDIT_USER } from "../graphql/mutations/users";
import { UserType, accessLevel, GET_ALL_USERS, GET_USER_BY_ID } from "../graphql/queries/users";
import { ValidatorForm } from "react-material-ui-form-validator";

const MemberCreationPage = ({
  match: {
    params: { mode, userId },
  },
}: {
  match: { params: { mode: string; userId?: string; } };
}) => {
  const history = useHistory();

  const { data, loading, error } = useQuery(
    mode === "edit" && userId
      ? GET_USER_BY_ID(userId)
      : GET_ALL_USERS
  );

  const users: Array<UserType> = data ? data.users : [];

  const [addUser] = useMutation(ADD_USER,
    {
      update(cache, { data: { addUser } }) {
        cache.writeQuery({
          query: GET_ALL_USERS,
          data: { users: users.concat([addUser]) },
        });
      }
    }
  );
  const [editUser] = useMutation(EDIT_USER);

  const [memberName, setMemberName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<accessLevel>(accessLevel.SUPERVISOR);

  useEffect(() => {
    if (!loading && mode === "edit") {
      const {
        firstName,
        lastName,
        email,
        accessLevel,
      }: {
        firstName: string;
        lastName: string;
        email: string;
        accessLevel: accessLevel;
      } = data.user;
      setMemberName(firstName);
      setEmail(email);
      setRole(accessLevel);
    }
  }, [data]);

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
    if (mode === "new") {
      addUser({
        variables: {
          firstName: memberName,
          lastName: memberName,
          email,
          password: "password",
          accessLevel: role,
          emergencyContact: "1234567890"
        }
      });

    } else if (mode === "edit") {
      editUser({
        variables: {
          id: userId,
          firstName: memberName,
          lastName: memberName,
          email,
          accessLevel: role,
        }
      });
    }
    history.replace("/manage/members");
  };

  return (
    <div className="resource-add-wrapper">
      <div className="resource-creation-top-section">
        <BackLink to="/manage/members" />
        <div className="resource-header">
          <Typography variant="h4">
            {mode === "new" ? "Add a new team member" : "Edit team member"}
          </Typography>
        </div>
        {mode === "new" ?
          <div className="top-bar-link">
            <Typography variant="caption" style={{ color: Colours.SecondaryGray }}>New team members will receive sign up instructions via email.</Typography>
          </div>
          : ""}
      </div>
      <ValidatorForm onSubmit={handleComplete}>
        <div className="event-form">
          <FormField
            label="Team Member Name:"
            required
            isValidated={false}
            onChange={handleNameChange}
            value={memberName}
          />
          <FormField
            label="Email:"
            required
            isValidated={true}
            validators={["required", "isEmail"]}
            errorMessages={["This is a mandatory field", "Invalid email"]}
            onChange={handleEmailChange}
            value={email}
          />
          <AccessLevelSelector
            currentValue={role}
            handleChange={handleRoleChange}
          />
          <div className="caption">
            <Typography variant="caption" style={{ color: Colours.SecondaryGray }}>*Denotes a required field</Typography>
          </div>
        </div>
        <div className="done-container">
          <DoneButton
            handleClick={handleComplete}
            disabled={memberName === "" || email === ""}
          />
        </div>
      </ValidatorForm>
      <div className="cancel-container">
        <CancelButton to="/manage/members" />
      </div>
    </div>
  );
};

export default MemberCreationPage;
