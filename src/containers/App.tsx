import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { ThemeProvider } from '@material-ui/core/styles';
import { Theme } from '../styles/Theme';
import HomeLandingPage from '../components/HomeLandingPage/HomeLandingPage';
import EventCreationPage from './EventCreationPage';
import EventDashboardPage from '../components/EventDashboard/EventDashboardPage';
import ScanPatientPage from '../components/ScanPatientPage/ScanPatientPage';
import EnterBarcodePage from '../components/EnterBarcodePage/EnterBarcodePage';
import CCPDashboardPage from '../components/CCPDashboard/CCPDashboardPage';
import PatientProfilePage from './PatientProfilePage';

import '../styles/App.css';

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <Switch>
        <Route exact path="/events" component={HomeLandingPage} />
        <Route exact path="/events/new" component={EventCreationPage} />
        <Route exact path="/events/:eventId" component={EventDashboardPage} />
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
          path="/patients/edit/:ccpId/:patientId"
          component={(props) => <PatientProfilePage mode="edit" {...props} />}
        />
        <Route
          exact
          path="/patients/new/:ccpId/:barcodeValue?"
          component={(props) => <PatientProfilePage mode="new" {...props} />}
        />
        <Route path="/">
          <Redirect to="/events" />
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

export default App;
