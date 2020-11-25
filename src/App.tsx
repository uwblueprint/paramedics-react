import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import EventsPage from './components/EventOverview/EventsPage';
import EventCreationPage from './components/EventCreation/EventCreationPage';
import EventDashboardPage from './components/EventDashboard/EventDashboardPage';
import ScanPatientPage from './components/ScanPatient/ScanPatientPage';
import EnterBarcodePage from './components/EnterBarcode/EnterBarcodePage';
import CCPDashboardPage from './components/CCPDashboard/CCPDashboardPage';
import PatientProfilePage from './components/PatientProfile/PatientProfilePage';
import CCPFormPage from './components/CCPForm/CCPFormPage';
import ResourceOverviewPage from './components/ResourceOverview/ResourceOverviewPage';
import HospitalFormPage from './components/ResourceForm/HospitalFormPage';
import AmbulanceFormPage from './components/ResourceForm/AmbulanceFormPage';
import UserFormPage from './components/ResourceForm/UserFormPage';
import MapPage from './components/Maps/MapPage';

function App() {
  return (
    <Switch>
      <Route exact path="/events" component={EventsPage} />
      <Route
        exact
        path="/events/new"
        component={(props) => <EventCreationPage mode="new" {...props} />}
      />
      <Route
        exact
        path="/events/:eventId/ccps/new"
        component={(props) => <CCPFormPage mode="new" {...props} />}
      />
      <Route
        exact
        path="/events/:eventId/ccps/:ccpId/edit"
        component={(props) => <CCPFormPage mode="edit" {...props} />}
      />
      <Route exact path="/events/:eventId" component={EventDashboardPage} />
      <Route
        exact
        path="/events/:eventId/edit"
        component={(props) => <EventCreationPage mode="edit" {...props} />}
      />
      <Route exact path="/manage/:resource" component={ResourceOverviewPage} />
      <Route exact path="/manage/">
        <Redirect to="/manage/members" />
      </Route>
      <Route
        exact
        path="/manage/hospitals/:mode/:hospitalId?"
        component={HospitalFormPage}
      />
      <Route
        exact
        path="/manage/ambulances/:mode/:ambulanceId?"
        component={AmbulanceFormPage}
      />
      <Route
        exact
        path="/manage/members/:mode/:userId?"
        component={UserFormPage}
      />
      <Route
        exact
        path="/events/:eventId/ccps/:ccpId/scan"
        component={ScanPatientPage}
      />
      <Route
        exact
        path="/events/:eventId/ccps/:ccpId/manual"
        component={EnterBarcodePage}
      />
      <Route
        exact
        path="/events/:eventId/ccps/:ccpId"
        component={CCPDashboardPage}
      />
      <Route
        exact
        path="/events/:eventId/ccps/:ccpId/open/:patientId"
        component={(props) => <CCPDashboardPage {...props} />}
      />
      <Route
        exact
        path="/events/:eventId/ccps/:ccpId/patients/new/:barcodeValue?"
        component={(props) => <PatientProfilePage mode="new" {...props} />}
      />
      <Route
        exact
        path="/events/:eventId/ccps/:ccpId/patients/:patientId"
        component={(props) => <PatientProfilePage mode="edit" {...props} />}
      />
      <Route exact path="/events/:eventId/map" component={MapPage} />
      <Route path="/">
        <Redirect to="/events" />
      </Route>
    </Switch>
  );
}

export default App;
