import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter} from "react-router-dom";
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
      <HashRouter>
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </HashRouter>
    </Provider>
    )
    , document.getElementById('root'));
}

if (!window.cordova) {
  startApp();
} else {
  document.addEventListener('deviceready', startApp, false);
}
