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
import { LocalHospitalOutlined } from "@material-ui/icons";
// import { ADD_HOSPITAL, EDIT_HOSPITAL } from "../graphql/mutations/hospitals";
// import { HospitalType, GET_ALL_HOSPITALS } from "../graphql/queries/hospitals";

const HospitalCreationPage = () => {
  // const history = useHistory();

  // const { data } = useQuery(GET_ALL_HOSPITALS);
  // const ambulances: Array<HospitalType> = data ? data.hospitals : [];

  // const [addHospital] = useMutation(ADD_HOSPITAL,
  //   {
  //     update(cache, { data: { addHospital } }) {
  //       cache.writeQuery({
  //         query: GET_ALL_HOSPITALS,
  //         data: { hospitals: hospitals.concat([addHospital]) },
  //       });
  //     }
  //   }
  // );

  // const [editHospital] = useMutation(EDIT_HOSPITAL);

  const [hospitalName, setHospitalName] = useState<string>("");

  const handleNameChange = (e: any) => {
    setHospitalName(e.target.value);
  };

  const handleComplete = () => {
    // if (mode === "new") {
    //   addHospital({
    //     variables: {
    //       name: hospitalName,
    //     }
    //   });
    // } else if (mode === "edit") {
    //   editHospital({
    //     variables: {
    //       id: hospitalId,
    //       name: hospitalName,
    //     }
    //   });
    // }

    // history.replace("/manage/hospitals");
  };

  return (
    <div className="resource-add-wrapper">
      <div className="resource-creation-top-section">
        <div className="top-bar-link">
          <Link
            color="secondary"
            variant="body2"
            component={NavLink}
            to="/manage/hospitals"
          >
            &#60; Back
        </Link>
        </div>
        <div className="landing-top-bar">
          <Typography variant="h3">Add a new hospital</Typography>
        </div>
      </div>
      <div className="event-form">
        <form>
          <FormField
            label="Hospital Name:"
            required
            onChange={handleNameChange}
            value={hospitalName}
          />
        </form>
        <div className="caption">
          <Typography variant="caption" style={{ color: "#676767" }}>*Denotes a required field</Typography>
        </div>
      </div>
      <div className="done-container">
        <Button
          color="primary"
          variant="contained"
          onClick={handleComplete}
          disabled={hospitalName === ""}
          style={
            {
              minWidth: "160px",
              minHeight: "40px",
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
          to="/manage/hospitals"
          style={
            {
              minWidth: "160px",
              minHeight: "40px",
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

export default HospitalCreationPage;
