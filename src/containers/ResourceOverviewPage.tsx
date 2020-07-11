import React, { useState } from "react";
import MenuTabs from "../components/common/MenuTabs";
import "../styles/HomeLandingPage.css";
import "../styles/ResourceOverviewPage.css";
import Typography from "@material-ui/core/Typography";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import EventCard from "../components/HomeLandingPage/EventCard";
import AddEventButton from "../components/HomeLandingPage/AddEventButton";
import Grid from "@material-ui/core/Grid";

 const ResourceOverviewPage: React.FC = () => {

  const [selectedTab, setTab] = useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  const tabLabels = ["Team Members", "Hospitals", "Ambulances"];

return (

        <div className="landing-wrapper"> 
        <div className="title-bar">
          <Typography variant="h5">Resource Management</Typography>
        </div>
          <div className="landing-top-section">
              <div className="landing-top-bar">
              </div>
              <MenuTabs
                handleChange={handleChange}
                currentTab={selectedTab}
                tabLabels={tabLabels}
              />
          </div>
    </div> 

)


}

export default ResourceOverviewPage;