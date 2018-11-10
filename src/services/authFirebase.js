import User from "../types/User";
import firebaseApp from "./firebaseInit";
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

  return firebaseApp.auth().onAuthStateChanged(firebaseStatusChange);
};

const signOut = () => {
  firebaseApp.auth().signOut();
};

const getCurrentUser = () => currentUser;

export default { onAuthStateChanged, signOut, getCurrentUser }
