import React, { useState } from "react";
import ResourceMenuTabs from "../components/common/resourceMenuTabs";
import "../styles/HomeLandingPage.css";
import "../styles/ResourceOverviewPage.css";
import TeamMemberOverviewPage from "./TeamMemberOverviewPage";
import HospitalOverviewPage from "./HospitalOverviewPage";
import AmbulanceOverviewPage from "./AmbulanceOverviewPage";
import Typography from "@material-ui/core/Typography";
import RefreshIcon from '@material-ui/icons/Refresh';
import { IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Colours } from '../styles/Constants';
import { useHistory } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';

 const ResourceOverviewPage: React.FC = () => {

  const [selectedTab, setTab] = useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };



  const BackButton = withStyles({

    root: {
      marginRight: 33.5,
      padding: 0,
    }

  })(IconButton)

  const RefreshButton = withStyles({

    root: {
      marginLeft: "77%",
      padding: 0,
    }
    
  })(IconButton)

  const tabLabels = ["Team Members", "Hospitals", "Ambulances"];

  var overview;


  if (tabLabels[selectedTab] === "Team Members") {
    overview = <TeamMemberOverviewPage/>;
  } else if (tabLabels[selectedTab] === "Hospitals") {
    overview = <HospitalOverviewPage/>;
  } else if (tabLabels[selectedTab] === "Ambulances") {
    overview = <AmbulanceOverviewPage/>
  }

return (

        <div className="landing-wrapper"> 
        <span className="title-bar">
          <BackButton>
            <ArrowBackIcon style={{color: Colours.White}}/>
          </BackButton>
          <Typography variant="h6">Resource Management</Typography>
  
          <RefreshButton>
            <RefreshIcon onClick={() => {window.location.reload();}}style={{color: Colours.White}}/>
          </RefreshButton>
        </span>
          <div className="landing-top-section-resource">
              <div className="landing-top-bar-resource">
              </div>
              <ResourceMenuTabs
                handleChange={handleChange}
                currentTab={selectedTab}
                tabLabels={tabLabels}
              />
          </div>
          {overview}
    </div> 

)


}

export default ResourceOverviewPage;