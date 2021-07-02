import firebase from "firebase/app";
import _ from "lodash";
 
import * as localforage from "localforage";

import config from "custom/config";
import { getFirebaseApp, getFCMToken } from "./firebaseInit.js";

import * as axios from "axios";

const firebaseApp = getFirebaseApp();
const firestore = firebase.firestore();
const storageRef = firebase.storage().ref();
const uploadsQueueStore = localforage.createInstance({ name: "uploadsQueue" });

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

/**
 * Get the last photos in real time from the given date. If fromDate is not given, then it get the newest 100 photos.
 *
 * @param {*} addedFn
 * @param {*} modifiedFn
 * @param {*} removedFn
 * @param {*} errorFn
 * @param {*} fromDate
 */
function publishedPhotosRT(addedFn, modifiedFn, removedFn, errorFn, fromDate) {
  const publishedPhotosRef = firestore
    .collection("photos")
    .where("published", "==", true);
  let newPublishedRef;
  if (fromDate) {
    newPublishedRef = publishedPhotosRef.where(
      "updated",
      ">",
      firebase.firestore.Timestamp.fromDate(fromDate)
    );
  }

  // any published photo
  return photosFromRefRT(
    newPublishedRef,
    addedFn,
    modifiedFn,
    removedFn,
    errorFn
  );
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
  return fetch(config.FIREBASE.apiURL + "/stats", {
    mode: "cors",
  }).then((response) => response.json());
}

/**
 * Open reload all the photos using the REST API. In this way it will laverage CDN caching saving firestore quota.
 *
 * @param {*} fromAPI if true it will get it from the API which is very usefull for caching.
 */
async function fetchPhotos(fromAPI = true, sinceDate = new Date(null)) {
  let photos = {};
  if (fromAPI) {
    const photosResponse = await axios.get(
      config.FIREBASE.apiURL + "/photos.json"
    );
    photos = photosResponse.data.photos;
  } else {
    // Without caching:
    const querySnapshot = await firestore
      .collection("photos")
      .where("published", "==", true)
      .where("updated", ">", sinceDate)
      .get();
    querySnapshot.forEach((doc) => {
      photos[doc.id] = convertFirebaseTimestampFieldsIntoDate(doc.data());
    });
  }

  const rtnPhotos = _.map(photos, (data, id) => extractPhoto(data, id));
  console.debug(`New photos: ${JSON.stringify(rtnPhotos)}`);

  return rtnPhotos;
}

function convertFirebaseTimestampFieldsIntoDate(photo) {
  const newPhoto = _.cloneDeep(photo);
  _.forEach(newPhoto, (value, field) => {
    if (value.toDate) {
      newPhoto[field] = value.toDate();
    }
  });
  return newPhoto;
}

function fetchFeedbacks(isShowAll) {
  let query = firestore
    .collection("feedbacks")
    .orderBy("updated", "desc")
    .limit((config.FEEDBACKS && config.FEEDBACKS.MAX) || 50);
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
  _.forEach(config.PHOTO_FIELDS, (field) => fieldsToSave.push(field.name));

  return firestore.collection("photos").add(_.pick(data, fieldsToSave));

}

/**
 * It add ann image and its metadata to a queue to then be uploaded to the DB.
 * 
 * @param {*} param0 TODO
 */
async function scheduleUpload({ location, imgSrc, fieldsValues, onProgress = () => {} } = {}) {
  // add to queue
  const key = String(Date.now());
  await uploadsQueueStore.setItem(key, { location, imgSrc, fieldsValues });
  return processScheduledUpload(key, onProgress);

  // TODO: upload to all the photos in the queue when the app starts
}

async function processScheduledUploads(onProgress) {
  return uploadsQueueStore.iterate((value, key, iterationNumber) => {
    console.debug([key, value, iterationNumber]);
    processScheduledUpload(key, onProgress);
  })
}

async function processScheduledUpload(key, onProgress) {
  const { location, imgSrc, fieldsValues } = await uploadsQueueStore.getItem(key);

  // TODO: upload it
  const fieldsJustValues = _.reduce(
    fieldsValues,
    (a, v, k) => {
      a[k] = v.value;
      return a;
    },
    {}
  );

  let filteredFields = {};
  Object.entries(fieldsJustValues).forEach(([key, value]) => {
    if (value) {
      filteredFields[key] = typeof value === "string" ? value.trim() : value;

      const fieldDefinition = config.PHOTO_FIELDS[key];
      if (fieldDefinition.sanitize) {
        fieldDefinition.sanitize(value);
      }
    }
  });

  const data = { ...location, ...filteredFields };
  const { promise, cancel} = uploadPhoto(data, imgSrc, onProgress);

  const promiseUploadedAndKeyDeleted = promise.then(() => {
    // debugger
    return uploadsQueueStore.removeItem(key);
  });

  return { promise: promiseUploadedAndKeyDeleted, cancel };
}

/**
 * It upload the metadata and the image itself. It returns an observable so that to beable to track the progress
 * 
 * @param {*} data data to be saved
 * @param {*} imgSrc the image in string format
 * @param {*} onProgress A function that will be called with a number indicating the progress
 * 
 * @returns an object which contains a promise and a cancel function. The
 *  promise will resolves when completed and fails if there are any errors or the cancel function is called. 
 *  if the function cancel is called, the upload will be cancelled, the metadate will be deleted,
 *  and the promise will be rejected.
 */

// TODO: handle error: try again if failed.
// debugger
function uploadPhoto(data, imgSrc, onProgress) {
  const rtn = {};
  let canceled = false;
  let uploadTask;
  let resolve;
  let reject;
  let photoRef;

  rtn.promise = new Promise(async (res, rej) => {
    resolve = res;
    reject = rej;
    onProgress(0);
    try {
      photoRef = await saveMetadata(data);
    } catch (error) {
      reject();

      // exit
      return;
    }
    onProgress(1);
    // upload the image only if the upload has not been cancelled
    if (!canceled) {
      const base64 = imgSrc.split(",")[1];
      uploadTask = savePhoto(photoRef.id, base64);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          const sendingProgress = Math.ceil((snapshot.bytesTransferred / snapshot.totalBytes) * 98 + 1);
          onProgress(sendingProgress);
          console.log(snapshot.state);
        }
      );

      try {
        await uploadTask;
      } catch (error) {
        reject(); 
      }
      
      resolve();
    } else {
      // the user has cancelled it but the metadata upload has succeded. Therefore we need to delete it.
      photoRef.delete();
      reject(); // not necessary but explicit.

      // exit
      return;
    }
  });

  rtn.cancel = () => {
    canceled = true;
    // If there is an uploadTask, that means that the image upload is in progress and therefore the metadata is already in the DB 
    if (uploadTask) {
      uploadTask.cancel();
      photoRef.delete();
    }
    reject();
  };

  return rtn;
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

async function saveProfileAvatar(base64) {
  const user = firebase.auth().currentUser;
  const originalJpgRef = storageRef
    .child("users")
    .child(user.uid)
    .child("avatar.jpg");

  const uploadTask = await originalJpgRef.putString(base64, "base64", {
    contentType: "image/jpeg",
  });
  const AvatarUrl = buildStorageUrl(uploadTask.ref.location.path);
  await updateProfile({ photoURL: AvatarUrl });
  return AvatarUrl;
}

/**
 * // TODO: move it to authFirebase ???
 * It store the user profile in firebase if possible. Otherwise in firestore.
 *
 * @param {*} fields an object with the fields and values to be updated
 */
async function updateProfile(fields) {
  const supportedFields = ["photoURL", "displayName"];
  const user = firebase.auth().currentUser;

  // pick those supported by firebase
  const fieldsSupported = _.pick(fields, supportedFields);
  const updatingProfile = user.updateProfile(fieldsSupported);

  // those not supported will be saved in firestore
  const fieldsNotSupported = _.omit(fields, supportedFields);
  const updatingFirestore = firestore
    .collection("users")
    .doc(user.uid)
    .set(fieldsNotSupported, { merge: true });

  return await Promise.all([updatingFirestore, updatingProfile]);
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
    updatePhotoToModerate,
    removePhotoToModerate
  );
}

function photosFromRefRT(
  photosRef,
  onAdd,
  onUpdate,
  onRemove,
  onError = console.error
) {
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

function ownPhotosRT(addedFn, modifiedFn, removedFn, errorFn) {
  if (firebase.auth().currentUser) {
    // get also the photos that belong to the current user even if not published yet.
    const photosRef = firestore.collection("photos");
    const userId = firebase.auth().currentUser.uid;
    const ownPhotosRef = photosRef.where("owner_id", "==", userId);

    return photosFromRefRT(
      ownPhotosRef,
      addedFn,
      modifiedFn,
      removedFn,
      errorFn
    );
  }

  // if the user is not legged in, then return an emtpy function
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
  const PREFIX = `${config.FIREBASE.storageApiURL}/b/${config.FIREBASE.config.storageBucket}/o/`;
  return `${PREFIX}${encodeURIComponent(path)}?alt=media`;
}

const rtn = {
  onConnectionStateChanged,
  publishedPhotosRT,
  fetchStats,
  fetchFeedbacks,
  fetchPhotos,
  getUser,
  getFeedbackByID,
  getPhotoByID,
  saveProfileAvatar,
  updateProfile,
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
  scheduleUpload,
  processScheduledUploads,
};

export default rtn;