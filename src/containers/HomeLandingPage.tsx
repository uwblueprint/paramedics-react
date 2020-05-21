import React, { useState } from "react";
import "../styles/HomeLandingPage.css";
import Typography from "@material-ui/core/Typography";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const HomeLandingPage = () => {
  const [selectedTab, setTab] = useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  return (
    <div className="landing-wrapper">
      <div className="landing-top-bar">
        <Typography variant="h3">Mass Casualty Events</Typography>
        <div className="user-icon">
          <Typography
            variant="h6"
            align="right"
            style={{ marginRight: "0.5em" }}
          >
            Joe Li
          </Typography>
          <AccountCircleIcon fontSize="large" color="primary" />
        </div>
      </div>

      <Tabs
        value={selectedTab}
        indicatorColor="primary"
        textColor="inherit"
        onChange={handleChange}
      >
        <Tab className="tab-label" label={"Current Events"} />
        <Tab className="tab-label" label="Archived Events" />
      </Tabs>
    </div>
  );
};

export default HomeLandingPage;
