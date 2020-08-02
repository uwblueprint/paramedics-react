import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { Theme } from '../styles/Theme';
import '../styles/App.css';
import HomeLandingPage from './HomeLandingPage';
import EventCreationPage from './EventCreationPage';
import CCPDashboardPage from '../components/CCPDashboard/CCPDashboardPage';
import PatientTransportPage from '../components/TransportFlow/PatientTransportPage';
import PatientProfilePage from './PatientProfilePage';

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <Switch>
        <Route exact path="/events" component={HomeLandingPage} />
        <Route exact path="/events/new" component={EventCreationPage} />
        <Route
          exact
          path="/events/:eventId/ccps/:ccpId"
          component={CCPDashboardPage}
        />
        <Route
          exact
          path="/events/:eventId/ccps/:ccpId/patients/:mode/:patientId?"
          component={PatientProfilePage}
        />
        <Route
          exact
          path="/events/:eventId/ccps/:ccpId/patients/:patientId/transport"
          component={PatientTransportPage}
        />
        <Route path="/">
          <Redirect to="/events" />
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

export default App;
