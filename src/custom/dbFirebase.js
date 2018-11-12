import firebase from 'firebase/app';

import firebaseApp from './firebaseInit.js';

const firestore = firebaseApp.firestore();
const storageRef = firebaseApp.storage().ref();

async function fetchPhotos() {
  const geojson = {
    "type": "FeatureCollection",
    "features": []
  };

  const querySnapshot = await firestore.collection("photos").where("published", "==", true).get();

  querySnapshot.forEach( doc => {
      console.log(`${doc.id} =>`, doc.data());

      const feature = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            doc.data().location.longitude,
            doc.data().location.latitude
          ]
        },
        "properties": {
          "id": doc.id,
          "description": doc.data().description,
          "thumbnail": doc.data().thumbnail
        }
      };

      geojson.features.push(feature);
  });

  return geojson;
}

async function saveMetadata(data) {
  if (firebase.auth().currentUser) {
    data.owner_id = firebase.auth().currentUser.uid;
  }
  data.updated = firebase.firestore.FieldValue.serverTimestamp();
  data.moderated = null;

  return await firestore.collection('photos').add(data);
}

async function savePhoto(id, base64) {
  const originalJpgRef = storageRef.child("photos").child(id).child("original.jpg");
  return await originalJpgRef.putString(base64, "base64", {contentType:"image/jpeg"});
}

async function uploadPhoto(data) {
  const photoRef = await saveMetadata({location: new firebase.firestore.GeoPoint(data.latitude, data.longitude), description: data.text  });
  return await savePhoto(photoRef.id, data.base64);
}

async function getUser(id) {
  const fbUser = await firestore.collection("users").doc(id).get();
  return fbUser.exists ? fbUser.data() : null;
}

function onPhotosToModerate(fn) {
  return firestore.collection('photos').where("moderated", "==", null ).onSnapshot((sn) => {
    const docs = sn.docs.map( doc => {
      const photo = doc.data();
      photo.id = doc.id;
      return photo;
    } );
    fn(docs);
  });
}

async function rejectPhoto(photoId) {
  return await firestore.collection('photos').doc(photoId).update({
    moderated: firebase.firestore.FieldValue.serverTimestamp(),
    published: false
  });
}

async function approvePhoto(photoId) {
  return await firestore.collection('photos').doc(photoId).update({
    moderated: firebase.firestore.FieldValue.serverTimestamp(),
    published: true
  });
}

async function disconnect() {
  return firebaseApp.delete();
}

export default {
  fetchPhotos,
  getUser,
  uploadPhoto,
  onPhotosToModerate,
  rejectPhoto,
  approvePhoto,
  disconnect
};
