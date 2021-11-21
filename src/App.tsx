import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import UserProvider from './utils/userProvider';
import { Theme } from './styles/Theme';
import EventsPage from './components/EventOverview/EventsPage';
import EventDashboardPage from './components/EventDashboard/EventDashboardPage';
import ScanPatientPage from './components/ScanPatient/ScanPatientPage';
import EnterBarcodePage from './components/EnterBarcode/EnterBarcodePage';
import CCPDashboardPage, {
  CCPDashboardTabOptions,
} from './components/CCPDashboard/CCPDashboardPage';
import PatientProfilePage from './components/PatientProfile/PatientProfilePage';
import ResourceOverviewPage from './components/ResourceOverview/ResourceOverviewPage';
import HospitalFormPage from './components/ResourceForm/HospitalFormPage';
import AmbulanceFormPage from './components/ResourceForm/AmbulanceFormPage';
import UserFormPage from './components/ResourceForm/UserFormPage';
import LoginPage from './components/Login/LoginPage';
import MapPage from './components/Maps/MapPage';
import { MapModes } from './graphql/queries/maps';
import { capitalize } from './utils/format';

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <SnackbarProvider
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      >
        <UserProvider>
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <Route
              exact
              path="/unauth"
              component={(props) => <LoginPage invalidUser {...props} />}
            />
            <Route exact path="/events" component={EventsPage} />
            <Route
              exact
              path="/events/new"
              component={(props) => (
                <MapPage mode={MapModes.NewEvent} {...props} />
              )}
            />
            <Route
              exact
              path="/events/:eventId/ccps/new"
              component={(props) => (
                <MapPage mode={MapModes.NewCCP} {...props} />
              )}
            />
            <Route
              exact
              path="/events/:eventId/ccps/:ccpId/edit"
              component={(props) => (
                <MapPage mode={MapModes.EditCCP} {...props} />
              )}
            />
            <Route
              exact
              path="/events/:eventId"
              component={EventDashboardPage}
            />
            <Route
              exact
              path="/events/:eventId/edit"
              component={(props) => (
                <MapPage mode={MapModes.EditEvent} {...props} />
              )}
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
              path="/events/:eventId/ccps/:ccpId/:tab"
              component={(props) => (
                <CCPDashboardPage
                  tab={
                    CCPDashboardTabOptions[capitalize(props.match.params.tab)]
                  }
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/events/:eventId/ccps/:ccpId/:tab/open/:patientId"
              component={(props) => (
                <CCPDashboardPage
                  tab={
                    CCPDashboardTabOptions[capitalize(props.match.params.tab)]
                  }
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/events/:eventId/ccps/:ccpId/patients/new/:barcodeValue?"
              component={(props) => (
                <PatientProfilePage mode="new" {...props} />
              )}
            />
            <Route
              exact
              path="/events/:eventId/ccps/:ccpId/patients/:patientId"
              component={(props) => (
                <PatientProfilePage mode="edit" {...props} />
              )}
            />
            <Route
              exact
              path="/events/:eventId/ccps/:ccpId"
              render={(props: {
                match: {
                  params: {
                    eventId: string;
                    ccpId: string;
                  };
                };
              }) => (
                <Redirect
                  to={`/events/${props.match.params.eventId}/ccps/${props.match.params.ccpId}/patientOverview`}
                />
              )}
            />
            <Route
              exact
              path="/events/:eventId/map"
              component={(props) => <MapPage mode={MapModes.Map} {...props} />}
            />
            <Route path="/">
              <Redirect to="/events" />
            </Route>
          </Switch>
        </UserProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
