import User from "../types/User";
import firebaseApp from "./firebaseInit";

let currentUser;

/**
 * When the user login call fn
 * @param fn
 */
const onAuthStateChanged = async (fn) => {
  const firebaseStatusChange = (user) => {
    currentUser = user;
    debugger
    if (currentUser) {
      // TODO: get user info
      // ...
      // TODO: return the user info
      // ...
      const groups = [];

      debugger

      currentUser = new User(currentUser.uid, currentUser.displayName, groups, currentUser.email, currentUser.emailVerified, currentUser.isAnonymous, currentUser.phoneNumber, currentUser.photoURL);
    }
    fn(currentUser);
  };

  return firebaseApp.auth().onAuthStateChanged(firebaseStatusChange);
};

const signOut = () => {
  firebaseApp.auth().signOut();
};

const getCurrentUser = () => currentUser;

export default { onAuthStateChanged, signOut, getCurrentUser }
