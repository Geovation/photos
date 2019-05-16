import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from "react-router-dom";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import config from './custom/config';
import { isIphoneAndCordova } from './utils';
import { gtagInit } from './gtag.js';

serviceWorker.register();

if (isIphoneAndCordova) {
  window.StatusBar.styleDefault();
}

if (process.env.NODE_ENV !== 'development' && localStorage.getItem("debug") !== "true") {
    console.log =
    console.info =
    console.trace =
    console.warn =
    console.error =
    console.debug = _ => {};
}
// it must set to fals (not enough to be absent)
const devDissableDebugLog = localStorage.getItem("debug") === "false";
if (devDissableDebugLog) {
  console.debug = _ => {}
}

const theme = createMuiTheme(config.THEME);


const startApp = () => {
  gtagInit();

  ReactDOM.render((
    <Router>
      <MuiThemeProvider theme={theme}>
        <App fields={Object.values(config.PHOTO_FIELDS)} config={config}/>
      </MuiThemeProvider>
    </Router>
    )
    , document.getElementById('root')
  );
}

if (!window.cordova) {
  startApp();
} else {
  document.addEventListener('deviceready', startApp, false);
}
