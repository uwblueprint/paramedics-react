import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "../styles/ResourceCreationPage.css";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import FormField from "../components/common/FormField";
import { NavLink } from "react-router-dom";
import { Colours } from "../styles/Constants";
import { useMutation } from "@apollo/react-hooks";
import { useQuery } from "react-apollo";
import { ADD_AMBULANCE, EDIT_AMBULANCE } from "../graphql/mutations/ambulances";
import { AmbulanceType, GET_ALL_AMBULANCES, GET_AMBULANCE_BY_ID } from "../graphql/queries/ambulances";

const AmbulanceCreationPage = ({
  match: {
    params: { mode, ambulanceId },
  },
}: {
  match: { params: { mode: string; ambulanceId?: string; } };
}) => {
  const history = useHistory();
  const { data, loading, error } = useQuery(
    mode === "edit" && ambulanceId
      ? GET_AMBULANCE_BY_ID(ambulanceId)
      : GET_ALL_AMBULANCES
  );

  const ambulances: Array<AmbulanceType> = data ? data.ambulances : [];
  const [addAmbulance] = useMutation(ADD_AMBULANCE,
    {
      update(cache, { data: { addAmbulance } }) {
        cache.writeQuery({
          query: GET_ALL_AMBULANCES,
          data: { ambulances: ambulances.concat([addAmbulance]) },
        });
      }
    }
  );
  const [editAmbulance] = useMutation(EDIT_AMBULANCE);

  const [ambulanceNumber, setAmbulanceNumber] = useState<number>(0);

  useEffect(() => {
    if (!loading && mode === "edit") {
      const {
        vehicleNumber
      }: {
        vehicleNumber: number;
      } = data.ambulance;
      setAmbulanceNumber(vehicleNumber);
    }
  }, [data]);

  const handleNumberChange = (e: any) => {
    setAmbulanceNumber(e.target.value);
  };

  const handleComplete = () => {
    if (mode === "new") {
      addAmbulance({
        variables: {
          vehicleNumber: ambulanceNumber,
        }
      });
    } else if (mode === "edit") {
      editAmbulance({
        variables: {
          id: ambulanceId,
          vehicleNumber: ambulanceNumber,
        }
      });
    }

    history.replace("/manage/ambulances");
  };

  return (
    <div className="resource-add-wrapper">
      <div className="resource-creation-top-section">
        <div className="top-bar-link">
          <Link
            color="secondary"
            variant="body2"
            component={NavLink}
            to="/manage/ambulances"
          >
            &#60; Back
        </Link>
        </div>
        <div className="resource-header">
          <Typography variant="h4">
            {mode === "new" ? "Add a new ambulance" : "Edit Ambulance"}
          </Typography>
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
          <Typography variant="caption" style={{ color: Colours.SecondaryGray }}>*Denotes a required field</Typography>
        </div>
      </div>
      <div className="done-container">
        <Button
          color="secondary"
          variant="contained"
          onClick={handleComplete}
          disabled={ambulanceNumber === 0}
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
          color="secondary"
          component={NavLink}
          to="/manage/ambulances"
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

export default AmbulanceCreationPage;
