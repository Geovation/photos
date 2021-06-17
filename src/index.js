import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import "./index.scss";
import App from "./App";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import config from "custom/config";
import { gtagInit } from "gtag.js";

import { firebaseInit } from "features/firebase/firebaseInit";
import { dbFirebase } from "features/firebase";

serviceWorkerRegistration.register();

if (
  process.env.NODE_ENV !== "development" &&
  localStorage.getItem("debug") !== "true"
) {
  console.log = console.info = console.trace = console.warn = console.error = console.debug = () => {};
}
// it must set to fals (not enough to be absent)
const devDissableDebugLog = localStorage.getItem("debug") === "false";
if (devDissableDebugLog) {
  console.debug = () => {};
}

const theme = createMuiTheme(config.THEME);

const initialState = {
  user: null
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'user/set':
      return {
        ...state,
        user: action.payload
      }
    default:
      return state;
  } 
}
const store = createStore(reducer);

const startApp = () => {
  gtagInit();

  firebaseInit(() => {
    dbFirebase.updateUserFCMToken();
  });

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <Router>
          <MuiThemeProvider theme={theme}>
            <App/>
          </MuiThemeProvider>
        </Router>
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );
};

startApp();
