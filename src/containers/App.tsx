import React from "react";
import "../styles/App.css";

import { Switch, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <div>
        <Switch>
          <h1>Hello world hello</h1>
          {/* <Route exact path="/viewHospitals" component={HospitalTable} />
            <Route exact path="/createHospital" component={CreateHospital} />
            <Route exact path="/editHospital" component={EditHospital} /> */}
        </Switch>
      </div>
    </div>
  );
}

export default App;
