import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import config from './custom/config';
import store from "./store";
import { isIphoneAndCordova } from './utils';
import { gtagInit } from './gtag.js';

serviceWorker.register();

if (isIphoneAndCordova) {
  window.StatusBar.styleDefault();
}

if (process.env.NODE_ENV !== 'development' && !localStorage.getItem("debug")) {
    console.log =
    console.info =
    console.trace =
    console.warn =
    console.error =
    console.debug = _ => {};
}

const theme = createMuiTheme(config.THEME);


const startApp = () => {
  gtagInit();

  ReactDOM.render((
    <Provider store={store}>
      <Router>
        <MuiThemeProvider theme={theme}>
          <App fields={Object.values(config.PHOTO_FIELDS)} config={config}/>
        </MuiThemeProvider>
      </Router>
    </Provider>
    )
    , document.getElementById('root'));
}

if (!window.cordova) {
  startApp();
} else {
  document.addEventListener('deviceready', startApp, false);
}
