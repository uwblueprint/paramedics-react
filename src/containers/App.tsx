import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "../styles/Theme";
import "../styles/App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import HomeLandingPage from "./HomeLandingPage";
import EventCreationPage from "./EventCreationPage";
import ScanPatientPage from "./ScanPatientPage";
import EnterBarcodePage from "./EnterBarcodePage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path="/events" component={HomeLandingPage} />
        <Route exact path="/events/new" component={EventCreationPage} />
        <Route
          exact
          path="/events/:eventID/ccps/:ccpID/scan"
          component={ScanPatientPage}
        />
        <Route
          exact
          path="/events/:eventID/ccps/:ccpID/scan/manual/:barcode?"
          component={EnterBarcodePage}
        />
        <Route path="/">
          <Redirect to="/events" />
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

export default App;
