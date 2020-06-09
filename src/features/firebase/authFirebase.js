import firebase from "firebase/app";
import md5 from "md5";

import config from "custom/config";
import User from "types/User";
import { gtagEvent, gtagSetId } from "gtag.js";

import dbFirebase from "./dbFirebase";

/**
 * When the user login call fn
 * @param fn
 */

let currentUser;

const onAuthStateChanged = (fn) => {
  const firebaseStatusChange = (user) => {
    currentUser = user;
    if (config.USER.ENABLE_GRAVATAR_PROFILES && currentUser) {
      gtagSetId(user.uid);
      gtagEvent("Logged in", "User", user.uid);

      // still to fix it. Sometimes (facebook) the email is null.
      const md5UserEmail = md5(user.email || "");
      const gravatarURL = "https://www.gravatar.com/" + md5UserEmail + ".json";
      const photoURL =
        user.photoURL || "https://www.gravatar.com/avatar/" + md5UserEmail;

      const emailVerified =
        user.emailVerified ||
        (user.providerData &&
          user.providerData[0] &&
          user.providerData[0].providerId !==
            firebase.auth.EmailAuthProvider.PROVIDER_ID);

      currentUser = new User(
        user.uid,
        user.displayName,
        false,
        user.email,
        emailVerified,
        user.isAnonymous,
        user.phoneNumber,
        photoURL,
        null,
        null,
        null
      );

      // this has to be global to be found by the jsonp
      window.userFromGravatar = (profile) => {
        const info = profile.entry[0];
        currentUser.description = info.aboutMe;
        currentUser.location = info.currentLocation;
        currentUser.profileURL = info.profileUrl;
        currentUser.displayName = info.name
          ? info.name.formatted
          : currentUser.displayName;
      };

      // add a script node to the dom. The browser will run it but we don't know when.
      const script = document.createElement("script");
      script.src = `${gravatarURL}?callback=userFromGravatar`;
      document.head.append(script);

      dbFirebase.getUser(user.uid).then((fbUser) => {
        currentUser.isModerator = fbUser ? fbUser.isModerator : false;
        fn(currentUser);
      });
    }
    fn(currentUser);
  };
  return firebase.auth().onAuthStateChanged(firebaseStatusChange);
};

const signOut = () => {
  firebase.auth().signOut();
};

const sendEmailVerification = () => {
  return firebase
    .auth()
    .currentUser.sendEmailVerification()
    .then(() => {
      const message = {
        title: "Notification",
        body:
          "A verification link has been sent to email account: " +
          firebase.auth().currentUser.email,
      };
      return message;
    })
    .catch((error) => {
      const message = {
        title: "Warning",
        body: error.message,
      };
      return message;
    });
};

const reloadUser = async () => {
  await firebase.auth().currentUser.reload();
  return firebase.auth().currentUser;
};

export default {
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  reloadUser,
};
