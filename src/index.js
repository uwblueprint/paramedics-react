import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import "./styles/index.css";
import App from "./containers/App.tsx";
import * as serviceWorker from "./serviceWorker";
import { initStore } from "./redux/store";

ReactDOM.render(
  <BrowserRouter>
    <Provider store={initStore()}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
