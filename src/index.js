import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import gtag from './gtag.js';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import config from './custom/config';
import store from "./store";
import { isIphoneWithNotchAndCordova } from './utils';

serviceWorker.register();

if (isIphoneWithNotchAndCordova() && window.StatusBar){
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

const script = document.createElement('script');
script.type = 'text/javascript';
script.src = `https://www.googletagmanager.com/gtag/js?id=${config.GA_TRACKING_ID}`;
document.body.appendChild(script);

gtag('js', new Date());
gtag('config',config.GA_TRACKING_ID);

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

gtag('event', 'app version', {
  'event_category' : 'Tech',
  'event_label' : process.env.REACT_APP_VERSION,
  'non_interaction': true
});

gtag('event', 'build number', {
  'event_category' : 'Tech',
  'event_label' : process.env.REACT_APP_BUILD_NUMBER,
  'non_interaction': true
});

if (!window.cordova) {
  gtag('event', 'type', {
    'event_category' : 'Tech',
    'event_label' : 'web',
    'non_interaction': true
  });
  startApp();
} else {
  gtag('event', 'type', {
    'event_category' : 'Tech',
    'event_label' : 'mobile',
    'non_interaction': true
  });
  document.addEventListener('deviceready', startApp, false);
}
