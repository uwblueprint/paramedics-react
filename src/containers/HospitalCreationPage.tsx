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
import { ADD_HOSPITAL, EDIT_HOSPITAL } from "../graphql/mutations/hospitals";
import { HospitalType, GET_ALL_HOSPITALS, GET_HOSPITAL_BY_ID } from "../graphql/queries/hospitals";

const HospitalCreationPage = ({
  match: {
    params: { mode, hospitalId },
  },
}: {
  match: { params: { mode: string; hospitalId?: string; } };
}) => {
  const history = useHistory();

  const { data, loading, error } = useQuery(
    mode === "edit" && hospitalId
      ? GET_HOSPITAL_BY_ID(hospitalId)
      : GET_ALL_HOSPITALS
  );

  const hospitals: Array<HospitalType> = data ? data.hospitals : [];
  const [addHospital] = useMutation(ADD_HOSPITAL,
    {
      update(cache, { data: { addHospital } }) {
        cache.writeQuery({
          query: GET_ALL_HOSPITALS,
          data: { hospitals: hospitals.concat([addHospital]) },
        });
      }
    }
  );
  const [editHospital] = useMutation(EDIT_HOSPITAL);

  const [hospitalName, setHospitalName] = useState<string>("");

  useEffect(() => {
    if (!loading && mode === "edit") {
      const {
        name
      }: {
        name: string;
      } = data.hospital;
      setHospitalName(name);
    }
  }, [data]);

  const handleNameChange = (e: any) => {
    setHospitalName(e.target.value);
  };

  const handleComplete = () => {
    if (mode === "new") {
      addHospital({
        variables: {
          name: hospitalName,
        }
      });
    } else if (mode === "edit") {
      editHospital({
        variables: {
          id: hospitalId,
          name: hospitalName,
        }
      });
    }

    history.replace("/manage/hospitals");
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
        <div className="resource-header">
          <Typography variant="h4">
            {mode === "new" ? "Add a new hospital" : "Edit Hospital"}
          </Typography>
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
          <Typography variant="caption" style={{ color: Colours.SecondaryGray }}>*Denotes a required field</Typography>
        </div>
      </div>
      <div className="done-container">
        <Button
          color="secondary"
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
          color="secondary"
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
