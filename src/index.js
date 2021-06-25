import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga'
import rootSaga from 'sagas'

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import "./index.scss";
import App from "./App";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import config from "custom/config";
import { gtagInit } from "gtag.js";

import { firebaseInit } from "features/firebase/firebaseInit";
import { dbFirebase } from "features/firebase";
import { GeolocationContextProvider } from "store/GeolocationContext";

let resolveNewVersionAvailable = () => { };
const newVersionAvailable = new Promise((resolve) => {
  resolveNewVersionAvailable = resolve;
});

function onSuccess(registration) {
  // TODO: needed ?
}
function onUpdate(registration) {
  const waitingServiceWorker = registration.waiting;

  if (waitingServiceWorker) {
    waitingServiceWorker.addEventListener("statechange", (event) => {
      if (event.target.state === "activated") {
        // TODO: pass it to react
        // if (window.confirm("There is a new version of the app ready. Please reload to update.")) {
        //   window.location.reload();
        // }
        resolveNewVersionAvailable();
      }
    });
    waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
  }
}
serviceWorkerRegistration.register({onSuccess, onUpdate});

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
  user: null,
  online: false,
  geojson: null
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user
      }
    case "SET_ONLINE":
      return {
        ...state,
        online: Boolean(action.payload.online)
      }
    case "SET_GEOJSON":
      return {
        ...state,
        geojson: action.payload.geojson
      }
    default:
      return state;
  } 
}
const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga)

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
            <GeolocationContextProvider>
              <App newVersionAvailable={ newVersionAvailable }/>
            </GeolocationContextProvider>
          </MuiThemeProvider>
        </Router>
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );
};

startApp();
