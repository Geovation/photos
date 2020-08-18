import firebase from "firebase/app";
import _ from "lodash";

import * as localforage from "localforage";

import appConfig from "custom/config";
import { getFirebaseApp, getFCMToken } from "./firebaseInit.js";

const firebaseApp = getFirebaseApp();
const firestore = firebase.firestore();
const storageRef = firebase.storage().ref();

// TODO: add caching

function extractPhoto(data, id) {
  
  // some data from Firebase cannot be stringified into json, so we need to convert it into other format first.
  const photo = _.mapValues(data, (fieldValue, fieldKey, doc) => {
    if (fieldValue instanceof firebase.firestore.DocumentReference) {
      return fieldValue.path;
    } else {
      return fieldValue;
    }
  });

  photo.thumbnail = buildStorageUrl(`photos/${id}/thumbnail.jpg`);
  photo.main = buildStorageUrl(`photos/${id}/1024.jpg`);
  photo.id = id;

  photo.updated =
    photo.updated instanceof firebase.firestore.Timestamp
      ? photo.updated.toDate()
      : new Date(photo.updated);

  photo.moderated =
    photo.moderated instanceof firebase.firestore.Timestamp
      ? photo.moderated.toDate()
      : new Date(photo.moderated);

  if (!(photo.location instanceof firebase.firestore.GeoPoint)) {
    // when comming from json, it looses the type
    photo.location = new firebase.firestore.GeoPoint(
      Number(photo.location._latitude) || 0,
      Number(photo.location._longitude) || 0
    );
  }

  return photo;
}

function photosRT(addedFn, modifiedFn, removedFn, errorFn) {
  const photosRef = firestore.collection("photos");

  let publishedRef = photosRef
    .orderBy("moderated", "desc")
    .limit(100)
    .where("published", "==", true);

  // get also the photos that belong to the current user even if not published yet.

  if (firebase.auth().currentUser) {
    const userId = firebase.auth().currentUser.uid;

    photosFromRefRT(
      photosRef.where("owner_id", "==", userId),
      addedFn,
      removedFn,
      addedFn,
      errorFn
    );
  }

  // any published photo
  photosFromRefRT(publishedRef, addedFn, removedFn, addedFn, errorFn);
}

const configObserver = (onNext, onError) => {
  localforage.getItem("config").then(onNext).catch(console.log);

  return firestore
    .collection("sys")
    .doc("config")
    .onSnapshot((snapshot) => {
      const config = snapshot.data();
      localforage.setItem("config", config);
      onNext(config);
    }, onError);
};

async function fetchStats() {
  return fetch(appConfig.FIREBASE.apiURL + "/stats", {
    mode: "cors",
  }).then((response) => response.json());
}

async function fetchPhotos() {
  const photosResponse = await fetch(
    appConfig.FIREBASE.apiURL + "/photos.json",
    {
      mode: "cors",
    }
  );
  const photosJson = await photosResponse.json();
  const photos = photosJson.photos;

  return _.map(photos, (data, id) => extractPhoto(data, id));
}

function fetchFeedbacks(isShowAll) {
  let query = firestore
    .collection("feedbacks")
    .orderBy("updated", "desc")
    .limit((appConfig.FEEDBACKS && appConfig.FEEDBACKS.MAX) || 50);
  return query
    .get()
    .then((sn) =>
      sn.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      })
    )
    .then((feedbacks) =>
      feedbacks.filter((feedback) => !feedback.resolved || isShowAll)
    );
}

function saveMetadata(data) {
  data.location = new firebase.firestore.GeoPoint(
    Number(data.latitude) || 0,
    Number(data.longitude) || 0
  );
  delete data.latitude;
  delete data.longitude;

  if (firebase.auth().currentUser) {
    data.owner_id = firebase.auth().currentUser.uid;
  }
  data.updated = firebase.firestore.FieldValue.serverTimestamp();
  data.moderated = null;

  let fieldsToSave = ["moderated", "updated", "location", "owner_id"];
  _.forEach(appConfig.PHOTO_FIELDS, (field) => fieldsToSave.push(field.name));

  return firestore.collection("photos").add(_.pick(data, fieldsToSave));
}

/**
 *
 * @param id
 * @param base64 image in base64 format
 * @returns {firebase.storage.UploadTask}
 */
function savePhoto(id, base64) {
  const originalJpgRef = storageRef
    .child("photos")
    .child(id)
    .child("original.jpg");
  return originalJpgRef.putString(base64, "base64", {
    contentType: "image/jpeg",
  });
}

async function saveProfilePhoto(uid, base64) {
  const originalJpgRef = storageRef
    .child("users")
    .child(uid)
    .child("avatar.jpg");

  const uploadTask = await originalJpgRef.putString(base64, "base64", {
    contentType: "image/jpeg",
  });

  await firestore.collection("users").doc(uid).update({ hasAvatar: true });
  const AvatarUrl = buildStorageUrl(uploadTask.ref.location.path)
  return AvatarUrl;
}

async function getUser(id) {
  const fbUser = await firestore.collection("users").doc(id).get();
  return fbUser.exists ? fbUser.data() : null;
}

async function updateUserFCMToken() {
  const userID = firebase.auth().currentUser && firebase.auth().currentUser.uid;
  const fcmToken = getFCMToken();

  if (userID) {
    return firestore
      .collection("users")
      .doc(userID)
      .set({ fcmToken: fcmToken || null }, { merge: true });
  }
}

async function getFeedbackByID(id) {
  const fbFeedback = await firestore.collection("feedbacks").doc(id).get();
  return fbFeedback.exists ? { id, ...fbFeedback.data() } : null;
}

async function getPhotoByID(id) {
  const fbPhoto = await firestore.collection("photos").doc(id).get();
  const photo = extractPhoto(fbPhoto.data(), fbPhoto.id);
  if (fbPhoto.exists) {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [photo.location.longitude, photo.location.latitude],
      },
      properties: photo,
    };
  }
  return null;
}

/**
 *
 * @param howMany
 * @param photos object to keep up to date
 * @returns {() => void}
 */
function photosToModerateRT(
  howMany,
  updatePhotoToModerate,
  removePhotoToModerate
) {
  const photosRef = firestore
    .collection("photos")
    .where("moderated", "==", null)
    .orderBy("updated", "desc")
    .limit(howMany);

  return photosFromRefRT(
    photosRef,
    updatePhotoToModerate,
    removePhotoToModerate
  );
}

function photosFromRefRT(photosRef, onUpdate, onRemove, onAdd, onError) {
  return photosRef.onSnapshot(
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const photo = extractPhoto(change.doc.data(), change.doc.id);
        if (change.type === "modified") {
          onUpdate(photo);
        } else if (change.type === "added") {
          onAdd ? onAdd(photo) : onUpdate(photo);
        } else if (change.type === "removed") {
          onRemove(photo);
        } else {
          console.error(`the photo ${photo.id} as type ${change.type}`);
          onError && onError(`the photo ${photo.id} as type ${change.type}`);
        }
      });
    },
    (e) => onError(e) || console.error(e)
  );
}

function ownPhotosRT(updatePhotoToModerate, removePhotoToModerate) {
  if (firebase.auth().currentUser) {
    const photosRef = firestore
      .collection("photos")
      .where("owner_id", "==", firebase.auth().currentUser.uid);

    return photosFromRefRT(
      photosRef,
      updatePhotoToModerate,
      removePhotoToModerate
    );
  }
  return () => {};
}

function writeModeration(photoId, userId, published) {
  console.log(`The photo ${photoId} will have field published = ${published}`);

  if (typeof published !== "boolean") {
    throw new Error("Only boolean pls");
  }
  return firestore.collection("photos").doc(photoId).update({
    moderated: firebase.firestore.FieldValue.serverTimestamp(),
    published: published,
    moderator_id: userId,
  });
}

async function disconnect() {
  return firebaseApp.delete();
}

function onConnectionStateChanged(fn) {
  const conRef = firebase.database().ref(".info/connected");

  function connectedCallBack(snapshot) {
    fn(Boolean(snapshot.val()));
  }
  conRef.on("value", connectedCallBack);

  return async () => conRef.off("value", connectedCallBack);
}

async function writeFeedback(data) {
  if (firebase.auth().currentUser) {
    data.owner_id = firebase.auth().currentUser.uid;
  }
  data.updated = firebase.firestore.FieldValue.serverTimestamp();
  if (data.latitude && data.longitude) {
    data.location = new firebase.firestore.GeoPoint(
      Number(data.latitude) || 0,
      Number(data.longitude) || 0
    );
  }

  delete data.latitude;
  delete data.longitude;

  return await firestore.collection("feedbacks").add(data);
}

async function toggleUnreadFeedback(id, resolved, userId) {
  return await firestore.collection("feedbacks").doc(id).update({
    resolved: !resolved,
    customerSupport_id: userId,
    updated: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

function buildStorageUrl(path) {
  // see https://firebase.google.com/docs/storage/web/download-files
  const PREFIX = `${appConfig.FIREBASE.storageApiURL}/b/${appConfig.FIREBASE.config.storageBucket}/o/`;
  return `${PREFIX}${encodeURIComponent(path)}?alt=media`;
}

export default {
  onConnectionStateChanged,
  photosRT,
  fetchStats,
  fetchFeedbacks,
  fetchPhotos,
  getUser,
  getFeedbackByID,
  getPhotoByID,
  savePhoto,
  saveProfilePhoto,
  saveMetadata,
  photosToModerateRT,
  ownPhotosRT,
  rejectPhoto: (photoId, userId) => writeModeration(photoId, userId, false),
  approvePhoto: (photoId, userId) => writeModeration(photoId, userId, true),
  disconnect,
  writeFeedback,
  toggleUnreadFeedback,
  configObserver,
  updateUserFCMToken,
  buildStorageUrl,
};
