import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import ReactGA from 'react-ga';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import config from './custom/config';
import store from "./store";

serviceWorker.register();

if (process.env.NODE_ENV !== 'development' && !localStorage.getItem("debug")) {
    console.log =
    console.info =
    console.trace =
    console.warn =
    console.error =
    console.debug = _ => {};
}

ReactGA.initialize(config.GA_TRACKING_ID);
const theme = createMuiTheme(config.THEME);

const startApp = () => {
  ReactDOM.render((
    <Provider store={store}>
      <Router>
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </Router>
    </Provider>
    )
    , document.getElementById('root'));
}

ReactGA.event({
  category: 'Tech',
  action: "app version",
  label: process.env.REACT_APP_VERSION,
  nonInteraction: true
});

ReactGA.event({
  category: 'Tech',
  action: "build number",
  label: process.env.REACT_APP_BUILD_NUMBER,
  nonInteraction: true
});

if (!window.cordova) {
  ReactGA.event({
    category: 'Tech',
    action: "type",
    label: 'web',
    nonInteraction: true
  });
  startApp();
} else {
  ReactGA.event({
    category: 'Tech',
    action: "type",
    label: 'mobile',
    nonInteraction: true
  });
  document.addEventListener('deviceready', startApp, false);
}
