import firebase from 'firebase/app';

import firebaseApp from './firebaseInit.js';

const firestore = firebase.firestore();
const storageRef = firebase.storage().ref();

function extractPhoto(doc) {
  const prefix = `https://storage.googleapis.com/${storageRef.location.bucket}/photos/${doc.id}`;
  const photo = doc.data();
  photo.thumbnail = `${prefix}/thumbnail.jpg`;
  photo.main = `${prefix}/1024.jpg`;
  photo.id = doc.id;

  return photo;
}

async function fetchPhotos() {

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
          "properties": {
            "id": doc.id,
            "description": photo.description,
            "thumbnail": photo.thumbnail,
            "main": photo.main,
            "updated": photo.updated.toDate(),
          }
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
    const docs = sn.docs.map(extractPhoto);
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

function onConnectionStateChanged(fn){

  const conRef = firebase.database().ref('.info/connected');

  function connectedCallBack(snapshot) {
    fn(Boolean(snapshot.val()));
  }
  conRef.on('value', connectedCallBack);

  return async () => conRef.off('value', connectedCallBack);
}

export default {
  onConnectionStateChanged,
  fetchPhotos,
  getUser,
  uploadPhoto,
  onPhotosToModerate,
  rejectPhoto,
  approvePhoto,
  disconnect
};
