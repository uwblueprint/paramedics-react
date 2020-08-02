import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { ThemeProvider } from '@material-ui/core/styles';
import { Theme } from '../styles/Theme';
import HomeLandingPage from '../components/HomeLanding/HomeLandingPage';
import EventCreationPage from '../components/EventCreation/EventCreationPage';
import ScanPatientPage from '../components/ScanPatientPage/ScanPatientPage';
import EnterBarcodePage from '../components/EnterBarcode/EnterBarcodePage';
import CCPDashboardPage from '../components/CCPDashboard/CCPDashboardPage';
import PatientProfilePage from './PatientProfilePage';
import ResourceOverviewPage from '../components/ResourceOverview/ResourceOverviewPage';
import HospitalFormPage from "../components/ResourceForm/HospitalFormPage";
import AmbulanceFormPage from "../components/ResourceForm/AmbulanceFormPage";
import UserFormPage from "../components/ResourceForm/UserFormPage";

import '../styles/App.css';

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <Switch>
        <Route exact path="/events" component={HomeLandingPage} />
        <Route exact path="/events/new" component={EventCreationPage} />
        <Route exact path="/manage/" component={ResourceOverviewPage} />
        <Route exact path="/manage/hospitals/:mode/:hospitalId?" component={HospitalFormPage} />
        <Route exact path="/manage/ambulances/:mode/:ambulanceId?" component={AmbulanceFormPage} />
        <Route exact path="/manage/members/:mode/:userId?" component={UserFormPage} />
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
