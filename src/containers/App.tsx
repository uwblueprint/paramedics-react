import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "../styles/Theme";
import "../styles/App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import HomeLandingPage from "./HomeLandingPage";
import EventCreationPage from "./EventCreationPage";
import ScanPatientPage from "./ScanPatientPage";
import EnterBarcodePage from "./EnterBarcodePage";
import CCPDashboardPage from "../components/CCPDashboard/CCPDashboardPage";
import PatientProfilePage from "./PatientProfilePage";

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
          path="/events/:eventID/ccps/:ccpID/scan/manual"
          component={EnterBarcodePage}
        />
        <Route
          exact
          path="/events/:eventId/ccps/:ccpId"
          component={CCPDashboardPage}
        />
        <Route
          exact
          path="/patients/:mode/:ccpId/:patientId?"
          component={PatientProfilePage}
        />
        <Route path="/">
          <Redirect to="/events" />
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

export default App;
