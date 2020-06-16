import React from "react";
import "../styles/App.css";

import { Switch, Route, Redirect } from "react-router-dom";
import HomeLandingPage from "./HomeLandingPage";
import EventCreationPage from "./EventCreationPage";
import { EventDashboardPage } from "../components/EventDashboard/EventDashboardPage";

function App() {
  return (
    <div>
      <div>
        <Switch>
          <Route exact path="/events" component={HomeLandingPage} />
          <Route exact path="/events/new" component={EventCreationPage} />
          <Route exact path="/events/:eventId" component={EventDashboardPage} />
          <Route path="/">
            <Redirect to="/events" />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
