// see https://firebase.google.com/docs/web/setup
import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/database';
// import 'firebase/firestore';
// import 'firebase/messaging';
// import 'firebase/functions';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyBkuZPVStg_zRfUaxLJ-mP4xxdFv8GzdZw",
  authDomain: "photos-demo-d4b14.firebaseapp.com",
  databaseURL: "https://photos-demo-d4b14.firebaseio.com",
  projectId: "photos-demo-d4b14",
  storageBucket: "photos-demo-d4b14.appspot.com",
  messagingSenderId: "639308065605"
};
firebase.initializeApp(config);

// debugger
