import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from '../styles/Theme';
import '../styles/App.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import HomeLandingPage from './HomeLandingPage';
import EventCreationPage from './EventCreationPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path="/events" component={HomeLandingPage} />
        <Route exact path="/events/new" component={EventCreationPage} />
        <Route path="/">
          <Redirect to="/events" />
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

export default App;
