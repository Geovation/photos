import firebase from "firebase/app";
import md5 from 'md5';

import User from "./types/User";
import dbFirebase from "./dbFirebase";
import { gtagEvent,gtagSetId } from './gtag.js';
import config from './custom/config'

/**
 * When the user login call fn
 * @param fn
 */
const onAuthStateChanged = (fn) => {
  const firebaseStatusChange = async (user) => {
    let currentUser = user;
    if (config.ENABLE_GRAVATAR_PROFILES && currentUser) {
      gtagSetId(user.uid)
      gtagEvent('Logged in','User',user.uid)

      const fbUser = await dbFirebase.getUser(user.uid);
      const isModerator = fbUser ? fbUser.isModerator : false;

      const gravatarURL = "https://www.gravatar.com/" + md5(user.email) + ".json";
      const photoURL = user.photoURL || "https://www.gravatar.com/avatar/" + md5(user.email);
      currentUser = new User(user.uid, user.displayName, isModerator, user.email, user.emailVerified, user.isAnonymous, user.phoneNumber, photoURL, null, null, null);

      // this has to be global to be found by the jsonp
      window.userFromGravatar = (profile) => {
          const info = profile.entry[0];
          currentUser.description = info.aboutMe;
          currentUser.location = info.currentLocation;
          currentUser.profileURL = info.profileUrl;
          currentUser.displayName = info.name ? info.name.formatted : currentUser.displayName;
      };

      // add a script node to the dom. The browser will run it but we don't know when.
      const script= document.createElement('script');
      script.src=`${gravatarURL}?callback=userFromGravatar`;
      document.head.append(script);
	  }
	  fn(currentUser);
  };
  return firebase.auth().onAuthStateChanged(firebaseStatusChange);
};

const signOut = () => {
  firebase.auth().signOut();
};

const sendEmailVerification = () => {
  firebase.auth().currentUser.sendEmailVerification()
    .then( () => {
      console.log('email sent');
    })
    .catch( error => {
      console.log(console.error());
    });
};

const reloadUser = async () => {
  await firebase.auth().currentUser.reload();
  return firebase.auth().currentUser;
};

export default { onAuthStateChanged, signOut, sendEmailVerification, reloadUser }
