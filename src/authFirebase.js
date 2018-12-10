import firebase from "firebase/app";

import User from "./types/User";
import dbFirebase from "./dbFirebase";

let currentUser;

/**
 * When the user login call fn
 * @param fn
 */
const onAuthStateChanged = (fn) => {
  const firebaseStatusChange = async (user) => {
    currentUser = user;
    if (currentUser) {
      const fbUser = await dbFirebase.getUser(user.uid);
      const isModerator = fbUser ? fbUser.isModerator : false;
      currentUser = new User(currentUser.uid, currentUser.displayName, isModerator, currentUser.email, currentUser.emailVerified, currentUser.isAnonymous, currentUser.phoneNumber, currentUser.photoURL);
    }
    fn(currentUser);
  };

  return firebase.auth().onAuthStateChanged(firebaseStatusChange);
};

const signOut = () => {
  firebase.auth().signOut();
};

const getCurrentUser = () => currentUser;

const isModerator = () => currentUser && currentUser.isModerator;

export default { onAuthStateChanged, signOut, getCurrentUser, isModerator }
