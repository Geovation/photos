// see https://firebase.google.com/docs/web/setup
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
// import 'firebase/messaging';
// import 'firebase/functions';
import 'firebase/storage';

import config from './custom/config'
// Initialize Firebase
const firebaseApp = firebase.initializeApp(config.FIREBASE);
const firestore = firebase.firestore();

function isInIframe () {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

firestore.settings({ timestampsInSnapshots: true });

// iFrames may break things for security policies. We found it happens at least in safari.
// more info in https://firebase.google.com/docs/firestore/manage-data/enable-offline
if (!isInIframe()) {
  firestore.enablePersistence()
  .catch(function(err) {
    if (err.code === 'failed-precondition') {
      console.error("Multiple tabs open, persistence can only be enabled in one tab at a a time.");
    } else if (err.code === 'unimplemented') {
      console.error("The current browser does not support all of the features required to enable persistence  ...");
    } else {
      console.error("Error firestore.enablePersistence(); didn't work" );
    }
  });
} else {
  console.log("Cannot enable persistence inside an iframe")
}


export default firebaseApp;
