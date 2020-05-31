import React from "react";
import "../styles/App.css";

import { Switch, Route, Redirect } from "react-router-dom";
import HomeLandingPage from "./HomeLandingPage";

function App() {
  return (
    <div>
      <div>
        <Switch>
          <Route exact path="/home" component={HomeLandingPage} />
          <Route path="/">
            <Redirect to="/home" />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
