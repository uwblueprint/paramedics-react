import React from 'react';
import '../styles/App.css';
import Header from './Header'
import { Switch, Route } from 'react-router-dom';
import HospitalTable from "./HospitalTable";
import CreateHospital from "./CreateHospital";
import EditHospital from "./EditHospital";

function App() {
  return (
      <div className="center w85">
        <Header />
        <div className="ph3 pv1 background-gray">
          <Switch>
            <Route exact path="/viewHospitals" component={HospitalTable} />
            <Route exact path="/createHospital" component={CreateHospital} />
            <Route exact path="/editHospital" component={EditHospital} />
          </Switch>
        </div>
      </div>
  );
}

export default App;
