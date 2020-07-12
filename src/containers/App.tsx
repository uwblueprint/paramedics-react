import React from "react";
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from "../styles/Theme";
import "../styles/App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import HomeLandingPage from "./HomeLandingPage";
import ResourceOverviewPage from './ResourceOverviewPage';
import TeamMemberOverviewPage from './TeamMemberOverviewPage';
import EventCreationPage from "./EventCreationPage";
import HospitalCreationPage from "./HospitalCreationPage";
import AmbulanceCreationPage from "./AmbulanceCreationPage";
import MemberCreationPage from "./MemberCreationPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path="/events" component={HomeLandingPage} />
        <Route exact path="/events/new" component={EventCreationPage} />
        <Route exact path="/manage/" component={ResourceOverviewPage} />
        <Route exact path="/manage/members" component={TeamMemberOverviewPage} />
        <Route exact path="/manage/hospitals/new" component={HospitalCreationPage} />
        <Route exact path="/manage/ambulances/new" component={AmbulanceCreationPage} />
        <Route exact path="/manage/members/new" component={MemberCreationPage} />
        <Route path="/">
          <Redirect to="/events" />
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

export default App;
