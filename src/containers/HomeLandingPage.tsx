import MenuTabs from "../components/common/MenuTabs";
import React, { useState } from "react";
import "../styles/HomeLandingPage.css";
import Typography from "@material-ui/core/Typography";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import EventCard from "../components/HomeLandingPage/EventCard";
import AddEventButton from "../components/HomeLandingPage/AddEventButton";

const HomeLandingPage = () => {
  const [selectedTab, setTab] = useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };
  const tabLabels = ["Current Events", "Archived Events"];

  return (
    <div className="landing-wrapper">
      <div className="landing-top-section">
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
        <MenuTabs
          handleChange={handleChange}
          currentTab={selectedTab}
          tabLabels={tabLabels}
        />
      </div>
      <EventCard
        date="2020-02-28"
        eventTitle="St. Patrick's Day"
        address="Ezra Street L123XA, Ontario Canada"
      />
      <div className="add-event-container">
        <AddEventButton />
      </div>
    </div>
  );
};

export default HomeLandingPage;
