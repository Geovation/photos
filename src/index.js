import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

const startApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'));
  serviceWorker.register();
}

if (!window.cordova) {
  startApp();
} else {
  document.addEventListener('deviceready', startApp, false);
}

serviceWorker.register();
