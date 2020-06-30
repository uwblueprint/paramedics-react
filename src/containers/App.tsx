import React from "react";
import "../styles/App.css";

import { Switch, Route, Redirect } from "react-router-dom";
import HomeLandingPage from "./HomeLandingPage";
import EventCreationPage from "./EventCreationPage";
import PatientCreationPage from "./PatientCreationPage";
import PatientEditPage from "./PatientEditPage";

function App() {
  return (
    <div>
      <div>
        <Switch>
          <Route exact path="/events" component={HomeLandingPage} />
          <Route exact path="/events/new" component={EventCreationPage} />
          <Route exact path="/patients/new" component={PatientCreationPage} />
          <Route exact path="/patients/:id/edit" component={PatientEditPage} />
          <Route path="/">
            <Redirect to="/patients/new" />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
