import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter} from "react-router-dom";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import config from './custom/config';

const theme = createMuiTheme(config.THEME);

const startApp = () => {
  ReactDOM.render((
    <HashRouter>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </HashRouter>
    )
    , document.getElementById('root'));
  serviceWorker.register();
}

if (!window.cordova) {
  startApp();
} else {
  document.addEventListener('deviceready', startApp, false);
}

serviceWorker.register();
