import firebase from "firebase/app";
import ReactGA from 'react-ga';

import User from "./types/User";
import dbFirebase from "./dbFirebase";
import md5 from 'md5';

let currentUser;

/**
 * When the user login call fn
 * @param fn
 */
const onAuthStateChanged = (fn) => {
  const firebaseStatusChange = async (user) => {
    currentUser = user;
    if (currentUser) {
      ReactGA.set({userId:user.uid});
      ReactGA.event({
        category: 'User',
        action: 'Logged in',
        label: user.uid
      });

      const fbUser = await dbFirebase.getUser(user.uid);
      const isModerator = fbUser ? fbUser.isModerator : false;
      currentUser = new User(currentUser.uid, currentUser.displayName, isModerator, currentUser.email, currentUser.emailVerified, currentUser.isAnonymous, currentUser.phoneNumber, currentUser.photoURL || "https://www.gravatar.com/avatar/" + md5(user.email));
    }
    fn(currentUser);
  };

  return firebase.auth().onAuthStateChanged(firebaseStatusChange);
};

const signOut = () => {
  firebase.auth().signOut();
};

export default { onAuthStateChanged, signOut }
