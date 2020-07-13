import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { Switch, Route, Redirect } from 'react-router-dom';
import HomeLandingPage from './HomeLandingPage';
import EventCreationPage from './EventCreationPage';
import PatientProfilePage from './PatientProfilePage';
import Theme from '../styles/Theme';
import '../styles/App.css';

function App(): JSX.Element {
  return (
    <ThemeProvider theme={Theme}>
      <Switch>
        <Route exact path="/events" component={HomeLandingPage} />
        <Route exact path="/events/new" component={EventCreationPage} />
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
