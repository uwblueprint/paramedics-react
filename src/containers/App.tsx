import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { Theme } from '../styles/Theme';
import '../styles/App.css';
import HomeLandingPage from './HomeLandingPage';
import EventCreationPage from './EventCreationPage';
import CCPDashboardPage from '../components/CCPDashboard/CCPDashboardPage';
import PatientProfilePage from './PatientProfilePage';
import ResourceOverviewPage from './ResourceOverviewPage';
import HospitalCreationPage from "./HospitalCreationPage";
import AmbulanceCreationPage from "./AmbulanceCreationPage";
import MemberCreationPage from "./MemberCreationPage";

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <Switch>
        <Route exact path="/events" component={HomeLandingPage} />
        <Route exact path="/events/new" component={EventCreationPage} />
        <Route exact path="/manage/" component={ResourceOverviewPage} />
        <Route exact path="/manage/hospitals/:mode/:hospitalId?" component={HospitalCreationPage} />
        <Route exact path="/manage/ambulances/:mode/:ambulanceId?" component={AmbulanceCreationPage} />
        <Route exact path="/manage/members/:mode/:userId?" component={MemberCreationPage} />
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
