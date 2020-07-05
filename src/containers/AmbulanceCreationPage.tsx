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
// import { ADD_AMBULANCE } from "../graphql/mutations/templates/ambulances";
// import { AmbulanceType, GET_ALL_AMBULANCES } from "../graphql/queries/templates/ambulances";

const AmbulanceCreationPage = () => {
  // const history = useHistory();

  // const { data } = useQuery(GET_ALL_AMBULANCES);
  // const ambulances: Array<AmbulanceType> = data ? data.ambulances : [];

  // const [addAmbulance] = useMutation(ADD_AMBULANCE,
  //   {
  //     update(cache, { data: { addAmbulance } }) {
  //       cache.writeQuery({
  //         query: GET_ALL_AMBULANCES,
  //         data: { ambulances: ambulances.concat([addAmbulance]) },
  //       });
  //     }
  //   }
  // );

  const [ambulanceNumber, setAmbulanceNumber] = useState<number>(0);

  const handleNumberChange = (e: any) => {
    setAmbulanceNumber(e.target.value);
  };

  const handleComplete = () => {
    // addAmbulance({
    //   variables: {
    //     vehicleNumber: ambulanceNumber,
    //   }
    // });
    // history.replace("/management/ambulances");
  };

  return (
    <div className="resource-add-wrapper">
      <div className="event-creation-top-section">
        <div className="top-bar-link">
          <Link
            component={NavLink}
            variant="h6"
            to="/management/ambulances"
          >
            &#60; Back
        </Link>
        </div>
        <div className="landing-top-bar">
          <Typography variant="h3">Add a new ambulance</Typography>
        </div>
      </div>
      <div className="event-form">
        <form>
          <FormField
            label="Ambulance Number:"
            required
            onChange={handleNumberChange}
            value={ambulanceNumber}
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
          disabled={ambulanceNumber === 0}
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
          to="/management/ambulances"
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

export default AmbulanceCreationPage;
