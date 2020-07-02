import React from "react";
import "../styles/App.css";

import { Switch, Route, Redirect } from "react-router-dom";
import HomeLandingPage from "./HomeLandingPage";
import EventCreationPage from "./EventCreationPage";
import PatientProfilePage from "./PatientProfilePage";

function App() {
  return (
    <div>
      <div>
        <Switch>
          <Route exact path="/events" component={HomeLandingPage} />
          <Route exact path="/events/new" component={EventCreationPage} />
          <Route
            exact
            path="/patients/:mode/:ccpId/:patientId?"
            component={PatientProfilePage}
          />
          <Route path="/">
            <Redirect to="/patients/" />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
