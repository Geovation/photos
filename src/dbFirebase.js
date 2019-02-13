import firebase from 'firebase/app';
import * as _ from 'lodash'

import firebaseApp from './firebaseInit.js';
import config from "./custom/config";
import enums from './types/enums';

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
    return await promise;
  } else {
    return geojson;
  }
}

async function saveMetadata(data) {
  if (firebase.auth().currentUser) {
    data.owner_id = firebase.auth().currentUser.uid;
  }
  data.updated = firebase.firestore.FieldValue.serverTimestamp();
  data.moderated = null;

  const fieldsToSave = [config.PHOTO_FIELD.name, "moderated", "updated", "location", "owner_id"];
  return await firestore.collection('photos').add(_.pick(data, fieldsToSave));
}

async function savePhoto(id, base64) {
  const originalJpgRef = storageRef.child("photos").child(id).child("original.jpg");
  return await originalJpgRef.putString(base64, "base64", {contentType:"image/jpeg"});
}

async function uploadPhoto(data) {
  const photoRef = await saveMetadata({
    location: new firebase.firestore.GeoPoint(data.latitude, data.longitude),
    [config.PHOTO_FIELD.name]: config.PHOTO_FIELD.type === enums.TYPES.number ? Number(data.field) : data.field
  });

  return await savePhoto(photoRef.id, data.base64);
}

async function getUser(id) {
  const fbUser = await firestore.collection("users").doc(id).get();
  return fbUser.exists ? fbUser.data() : null;
}

function onPhotosToModerate(fn) {
  return firestore.collection('photos').where("moderated", "==", null ).onSnapshot((sn) => {
    const docs = sn.docs.map(extractPhoto);
    fn(docs);
  });
}

async function rejectPhoto(photoId,userId) {
  return await firestore.collection('photos').doc(photoId).update({
    moderated: firebase.firestore.FieldValue.serverTimestamp(),
    published: false,
    moderator_id: userId
  });
}

async function approvePhoto(photoId,userId) {
  return await firestore.collection('photos').doc(photoId).update({
    moderated: firebase.firestore.FieldValue.serverTimestamp(),
    published: true,
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

export default {
  onConnectionStateChanged,
  fetchPhotos,
  getUser,
  uploadPhoto,
  onPhotosToModerate,
  rejectPhoto,
  approvePhoto,
  disconnect,
  writeFeedback,
};
