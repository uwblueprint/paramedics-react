import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import { Theme } from './styles/Theme';
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
import { PatientDetailsDialog } from './components/CCPDashboard/PatientDetailsDialog';

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <SnackbarProvider
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      >
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
          <Route
            exact
            path="/manage/:resource"
            component={ResourceOverviewPage}
          />
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
            path="/events/:eventId/ccps/:ccpId/:patientId/view"
            component={(props) => <PatientDetailsDialog {...props} />}
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

          <Route path="/">
            <Redirect to="/events" />
          </Route>
        </Switch>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
