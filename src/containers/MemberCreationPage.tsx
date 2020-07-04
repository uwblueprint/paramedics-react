import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../styles/ResourceCreationPage.css";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import FormField from "../components/common/FormField";
import { NavLink } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { useQuery } from "react-apollo";
// import { ADD_USER } from "../graphql/mutations/templates/users";
// import { UserType, GET_ALL_USERS } from "../graphql/queries/templates/users";

const MemberCreationPage = () => {
    // const history = useHistory();

    // const { data } = useQuery(GET_ALL_USERS);
    // const users: Array<UserType> = data ? data.users : [];

    // const [addUser] = useMutation(ADD_USER,
    //   {
    //     update(cache, { data: { addUser } }) {
    //       cache.writeQuery({
    //         query: GET_ALL_USERS,
    //         data: { users: users.concat([addUser]) },
    //       });
    //     }
    //   }
    // );

    const [memberName, setMemberName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [role, setRole] = useState<string>("");


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
        // addUser({
        //   variables: {
        //     firstName: memberName,
        //     lastName: memberName,
        //     email,
        //     password: "password",
        //     accessLevel: role,
        //     emergencyContact: "1234567890"
        //   }
        // });
        // history.replace("/management/members");
    };

    return (
        <div className="resource-add-wrapper">
            <div className="event-creation-top-section">
                <Link
                    component={NavLink}
                    to="/management/members"
                >
                    &#60; Back
                </Link>
                <div className="landing-top-bar">
                    <Typography variant="h3">Add a new team member</Typography>
                </div>
            </div>
            <div className="event-form">
                <form>
                    <FormField
                        label="Team Member Name:"
                        required
                        onChange={handleNameChange}
                        value={memberName}
                    />
                    <FormField
                        label="Email:"
                        required
                        onChange={handleEmailChange}
                        value={email}
                    />
                </form>
              <div className="caption">
          <Typography variant="body2" style={{ color: "#676767" }}>*Denotes a required field</Typography>
        </div>
            </div>
            <div className="done-container">
        <Button
          color="primary"
          variant="contained"
          onClick={handleComplete}
          disabled={memberName === "" || email === "" }
          style={
            {
              minWidth: "10rem",
              minHeight: "2.5rem",
              fontSize: "18px",
            }
          }
        >
          Done
        </Button>
      </div>
      <div className="cancel-container">
        <Button
          color="primary"
          component={NavLink}
          to="/management/hospitals"
          style={
            {
              minWidth: "10rem",
              minHeight: "2.5rem",
              fontSize: "18px",
            }
          }
        >
          Cancel
        </Button>
      </div>
        </div>
    );
};

export default MemberCreationPage;
