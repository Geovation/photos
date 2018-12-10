// see https://firebase.google.com/docs/web/setup
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
// import 'firebase/messaging';
// import 'firebase/functions';
import 'firebase/storage';


// Initialize Firebase
const config = {
  apiKey: "AIzaSyBkuZPVStg_zRfUaxLJ-mP4xxdFv8GzdZw",
  authDomain: "photos-demo-d4b14.firebaseapp.com",
  databaseURL: "https://photos-demo-d4b14.firebaseio.com",
  projectId: "photos-demo-d4b14",
  storageBucket: "photos-demo-d4b14.appspot.com",
  messagingSenderId: "639308065605"
};

const firebaseApp = firebase.initializeApp(config);
const firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });

firestore.enablePersistence()
  .catch(function(err) {
    if (err.code === 'failed-precondition') {
      console.error("Multiple tabs open, persistence can only be enabled in one tab at a a time.");
    } else if (err.code === 'unimplemented') {
      console.error("The current browser does not support all of the features required to enable persistence  ...");
    }
  });

export default firebaseApp;
