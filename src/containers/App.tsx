import React from "react";
import "../styles/App.css";

import { Switch, Route, Redirect } from "react-router-dom";
import HomeLandingPage from "./HomeLandingPage";
import EventCreationPage from "./EventCreationPage";
import HospitalCreationPage from "./HospitalCreationPage";
import AmbulanceCreationPage from "./AmbulanceCreationPage";
import MemberCreationPage from "./MemberCreationPage";

function App() {
  return (
    <div>
      <div>
        <Switch>
          <Route exact path="/events" component={HomeLandingPage} />
          <Route exact path="/events/new" component={EventCreationPage} />
          <Route exact path="/management/hospitals/new" component={HospitalCreationPage} />
          <Route exact path="/management/ambulances/new" component={AmbulanceCreationPage} />
          <Route exact path="/management/members/new" component={MemberCreationPage} />
          <Route path="/">
            <Redirect to="/events" />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
