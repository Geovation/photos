import firebase from 'firebase/app';
import * as _ from 'lodash'

import firebaseApp from './firebaseInit.js';
import config from "./custom/config";

const firestore = firebase.firestore();
const storageRef = firebase.storage().ref();

function extractPhoto(doc) {
  const prefix = `https://storage.googleapis.com/${storageRef.location.bucket}/photos/${doc.id}`;

  // some data from Firebase cannot be stringified into json, so we need to convert it into other format first.
  const photo = _.mapValues(doc.data(), (fieldValue, fieldKey, doc) => {
    if (fieldValue instanceof firebase.firestore.DocumentReference) {
      return fieldValue.path;
    } else {
      return fieldValue;
    }}
  );

  photo.thumbnail = `${prefix}/thumbnail.jpg`;
  photo.main = `${prefix}/1024.jpg`;
  photo.id = doc.id;
  photo.updated = photo.updated && photo.updated.toDate();
  photo.moderated = photo.moderated && photo.moderated.toDate();

  return photo;
}

/**
 *
 * @returns {Promise<{geojson}>}
 */
async function fetchPhotos() {

  // for making it realtime: https://firebase.google.com/docs/firestore/query-data/listen
  const promise = firestore.collection("photos").where("published", "==", true).get()
    .then(querySnapshot => {
      const geojson = {
        "type": "FeatureCollection",
        "features": []
      };

      querySnapshot.forEach( doc => {
        const photo = extractPhoto(doc);
        console.debug(`${doc.id} =>`, photo);

        const feature = {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              photo.location.longitude,
              photo.location.latitude
            ]
          },
          "properties": photo
        };

        geojson.features.push(feature);
      });

      localStorage.setItem("cachedGeoJson", JSON.stringify(geojson));

      return geojson;
    });

  // get features from local storage
  let geojson;
  try {
    geojson = JSON.parse(localStorage.getItem("cachedGeoJson"));
  } catch (e) {
    console.log(e);
  }

  if (!geojson) {
    geojson = await promise;
  }
  return geojson;
}

async function fetchStats() {
  return fetch(config.API.URL + "/stats", {mode: "cors"})
    .then(response => response.json());
}

async function fetchUsers() {
  return fetch(config.API.URL + "/stats", {mode: "cors"})
    .then(response => response.json())
    // .then(userstats => console.log('users from Firebase:', userstats.users));
}

function fetchFeedbacks(isShowAll) {
  let query = firestore.collection('feedbacks');
  query = !isShowAll ? query.where('resolved', '==', false) : query;
  return query.get()
    .then(sn => sn.docs.map(doc => {
      return ({...doc.data(), id: doc.id});
    }));
}

function saveMetadata(data) {
  data.location = new firebase.firestore.GeoPoint(data.latitude, data.longitude);
  delete data.latitude;
  delete data.longitude;

  if (firebase.auth().currentUser) {
    data.owner_id = firebase.auth().currentUser.uid;
  }
  data.updated = firebase.firestore.FieldValue.serverTimestamp();
  data.moderated = null;

  let fieldsToSave = ["moderated", "updated", "location", "owner_id"];
  _.forEach(config.PHOTO_FIELDS,field => fieldsToSave.push(field.name));

  return firestore.collection('photos').add(_.pick(data, fieldsToSave));
}

/**
 *
 * @param id
 * @param base64 image in base64 format
 * @returns {firebase.storage.UploadTask}
 */
function savePhoto(id, base64) {
  const originalJpgRef = storageRef.child("photos").child(id).child("original.jpg");
  return originalJpgRef.putString(base64, "base64", {contentType:"image/jpeg"});
}

async function getUser(id) {
  const fbUser = await firestore.collection("users").doc(id).get();
  return fbUser.exists ? fbUser.data() : null;
}

function photosToModerate() {
  return firestore.collection('photos').where('moderated', "==", null).get()
  .then(sn => sn.docs.map(extractPhoto));
}


async function writeModeration(photoId,userId, published) {
  if (typeof published !== "boolean") {
    throw new Error("Only boolean pls")
  }
  return await firestore.collection('photos').doc(photoId).update({
    moderated: firebase.firestore.FieldValue.serverTimestamp(),
    published: published,
    moderator_id: userId
  });
}


async function disconnect() {
  return firebaseApp.delete();
}

function onConnectionStateChanged(fn){

  const conRef = firebase.database().ref('.info/connected');

  function connectedCallBack(snapshot) {
    fn(Boolean(snapshot.val()));
  }
  conRef.on('value', connectedCallBack);

  return async () => conRef.off('value', connectedCallBack);
}

async function writeFeedback(data) {
  if (firebase.auth().currentUser) {
    data.owner_id = firebase.auth().currentUser.uid;
  }
  data.updated = firebase.firestore.FieldValue.serverTimestamp();
  if (data.latitude && data.longitude) {
    data.location = new firebase.firestore.GeoPoint(data.latitude, data.longitude);
  }

  delete data.latitude;
  delete data.longitude;

  return await firestore.collection('feedbacks').add(data);
}

async function toggleUnreadFeedback(id, resolved, userId) {
  return await firestore.collection('feedbacks').doc(id).update({
    resolved: !resolved,
    customerSupport_id: userId,
    updated: firebase.firestore.FieldValue.serverTimestamp()
  });
}

export default {
  onConnectionStateChanged,
  fetchPhotos,
  fetchStats,
  fetchUsers,
  fetchFeedbacks,
  getUser,
  savePhoto,
  saveMetadata,
  photosToModerate,
  rejectPhoto: (photoId, userId) => writeModeration(photoId, userId, false),
  approvePhoto: (photoId, userId) => writeModeration(photoId, userId, true),
  disconnect,
  writeFeedback,
  toggleUnreadFeedback
};
