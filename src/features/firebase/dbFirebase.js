import firebase from "firebase/app";
import _ from "lodash";

import * as localforage from "localforage";

import appConfig from "custom/config";
import firebaseApp from "./firebaseInit.js";
import firebaseConfig from "./config";

const firestore = firebase.firestore();
const storageRef = firebase.storage().ref();

// TODO: add caching

function extractPhoto(data, id) {
  const prefix = `https://storage.googleapis.com/${storageRef.location.bucket}/photos/${id}`;

  // some data from Firebase cannot be stringified into json, so we need to convert it into other format first.
  const photo = _.mapValues(data, (fieldValue, fieldKey, doc) => {
    if (fieldValue instanceof firebase.firestore.DocumentReference) {
      return fieldValue.path;
    } else {
      return fieldValue;
    }
  });

  photo.thumbnail = `${prefix}/thumbnail.jpg`;
  photo.main = `${prefix}/1024.jpg`;
  photo.id = id;

  photo.updated =
    photo.updated instanceof firebase.firestore.Timestamp
      ? photo.updated.toDate()
      : new Date(photo.updated);
  photo.moderated =
    photo.moderated instanceof firebase.firestore.Timestamp
      ? photo.moderated.toDate()
      : new Date(photo.moderated);

  // when comming from json, it looses the type
  if (!(photo.location instanceof firebase.firestore.GeoPoint)) {
    photo.location = new firebase.firestore.GeoPoint(
      Number(photo.location._latitude) || 0,
      Number(photo.location._longitude) || 0
    );
  }

  return photo;
}

function photosRT(addedFn, modifiedFn, removedFn, errorFn) {
  firestore
    .collection("photos")
    .where("published", "==", true)
    .orderBy("moderated", "desc")
    .limit(100)
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        const photo = extractPhoto(change.doc.data(), change.doc.id);
        if (change.type === "added") {
          addedFn(photo);
        } else if (change.type === "modified") {
          modifiedFn(photo);
        } else if (change.type === "removed") {
          removedFn(photo);
        } else {
          console.error(`the photo ${photo.id} as type ${change.type}`);
        }
      });
    }, errorFn);
}

const configObserver = (onNext, onError) => {
  localforage
    .getItem("config")
    .then(onNext)
    .catch(console.log);

  return firestore
    .collection("sys")
    .doc("config")
    .onSnapshot(snapshot => {
      const config = snapshot.data();
      localforage.setItem("config", config);
      onNext(config);
    }, onError);
};

async function fetchStats() {
  return fetch(firebaseConfig.apiURL + "/stats", {
    mode: "cors"
  }).then(response => response.json());
}

async function fetchPhotos() {
  const photosResponse = await fetch(firebaseConfig.apiURL + "/photos.json", {
    mode: "cors"
  });
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
    .then(sn =>
      sn.docs.map(doc => {
        return { ...doc.data(), id: doc.id };
      })
    )
    .then(feedbacks =>
      feedbacks.filter(feedback => !feedback.resolved || isShowAll)
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
  _.forEach(appConfig.PHOTO_FIELDS, field => fieldsToSave.push(field.name));

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
    contentType: "image/jpeg"
  });
}

async function getUser(id) {
  const fbUser = await firestore
    .collection("users")
    .doc(id)
    .get();
  return fbUser.exists ? fbUser.data() : null;
}

async function getFeedbackByID(id) {
  const fbFeedback = await firestore
    .collection("feedbacks")
    .doc(id)
    .get();
  return fbFeedback.exists ? { id, ...fbFeedback.data() } : null;
}

async function getPhotoByID(id) {
  const fbPhoto = await firestore
    .collection("photos")
    .doc(id)
    .get();
  const photo = extractPhoto(fbPhoto.data(), fbPhoto.id);
  if (fbPhoto.exists) {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [photo.location.longitude, photo.location.latitude]
      },
      properties: photo
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
  return firestore
    .collection("photos")
    .where("moderated", "==", null)
    .orderBy("updated", "desc")
    .limit(howMany)
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        const photo = extractPhoto(change.doc.data(), change.doc.id);
        if (change.type === "added" || change.type === "modified") {
          updatePhotoToModerate(photo);
        } else if (change.type === "removed") {
          removePhotoToModerate(photo);
        } else {
          console.error(`the photo ${photo.id} as type ${change.type}`);
        }
      });
    });
}

function writeModeration(photoId, userId, published) {
  console.log(`The photo ${photoId} will have field published = ${published}`);

  if (typeof published !== "boolean") {
    throw new Error("Only boolean pls");
  }
  return firestore
    .collection("photos")
    .doc(photoId)
    .update({
      moderated: firebase.firestore.FieldValue.serverTimestamp(),
      published: published,
      moderator_id: userId
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
  return await firestore
    .collection("feedbacks")
    .doc(id)
    .update({
      resolved: !resolved,
      customerSupport_id: userId,
      updated: firebase.firestore.FieldValue.serverTimestamp()
    });
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
  saveMetadata,
  photosToModerateRT,
  rejectPhoto: (photoId, userId) => writeModeration(photoId, userId, false),
  approvePhoto: (photoId, userId) => writeModeration(photoId, userId, true),
  disconnect,
  writeFeedback,
  toggleUnreadFeedback,
  configObserver
};
