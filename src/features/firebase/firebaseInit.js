// see https://firebase.google.com/docs/web/setup
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/messaging";
// import 'firebase/functions';
import "firebase/storage";
import "firebase/analytics";
import "firebase/performance";

import config from "custom/config";

let firebaseApp;
let fcmToken;
let perf;

let _callBackFunctionFCMTokenChange;

function firebaseInit(callBackFunctionFCMTokenChange) {
  // Initialize Firebase
  if (!firebaseApp) {
    console.debug(config.FIREBASE.config);
    firebaseApp = !firebase.apps.length
      ? firebase.initializeApp(config.FIREBASE.config)
      : firebase.app();

    // https://firebase.google.com/docs/perf-mon/get-started-web#using-module-bundler
    perf = firebase.performance();
    console.debug(perf);

    _callBackFunctionFCMTokenChange = (token) => {
      fcmToken = token;
      console.log(`FCM token changed to ${token}.`);
      callBackFunctionFCMTokenChange && callBackFunctionFCMTokenChange(token);
    };

    const firestore = firebase.firestore();

    function isInIframe() {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    }

    // iFrames may break things for security policies. We found it happens at least in safari.
    // more info in https://firebase.google.com/docs/firestore/manage-data/enable-offline
    if (!isInIframe()) {
      firestore.enablePersistence().catch(function (err) {
        if (err.code === "failed-precondition") {
          console.error(
            "Multiple tabs open, persistence can only be enabled in one tab at a a time."
          );
        } else if (err.code === "unimplemented") {
          console.error(
            "The current browser does not support all of the features required to enable persistence  ..."
          );
        } else {
          console.error("Error firestore.enablePersistence(); didn't work");
        }
      });
    } else {
      console.log("Cannot enable persistence inside an iframe");
    }

    // just in case it is not supported by the browserß
    try {
      // see https://firebase.google.com/docs/cloud-messaging/js/client
      const messaging = firebase.messaging();
      messaging.usePublicVapidKey(config.FIREBASE.publicVapidKey);

      messaging
        .requestPermission()
        .then(() => messaging.getToken())
        .then(_callBackFunctionFCMTokenChange)
        .catch((e) => {
          console.error(e);
          // alert("enable notifications");
        });

      // Callback fired if Instance ID token is updated.
      messaging.onTokenRefresh(() => {
        messaging
          .getToken()
          .then(_callBackFunctionFCMTokenChange)
          .catch((err) => {
            console.log("Unable to retrieve refreshed token ", err);
          });
      });

      messaging.onMessage((payload) => {
        console.log("Message received. ", payload);
        // TODO
      });
    } catch (error) {
      // console.debug(error);
    }
  }

  return firebaseApp;
}

function getFirebaseApp(callBackFunctionFCMTokenChange) {
  return firebaseApp || firebaseInit(callBackFunctionFCMTokenChange);
}

function getFCMToken() {
  return fcmToken;
}

export { firebaseInit, getFirebaseApp, getFCMToken };
