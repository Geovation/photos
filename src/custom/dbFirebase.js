import firebase from 'firebase/app';

import firebaseApp from './firebaseInit.js';

const firestore = firebaseApp.firestore();
const storageRef = firebaseApp.storage().ref();

async function fetchPhotos() {
  const geojson = {
    "type": "FeatureCollection",
    "features": []
  };

  const querySnapshot = await firestore.collection("photos").get();

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
  const photoRef = await firestore.collection('photos').add(data);

  return photoRef
}

async function savePhoto(id, base64) {
  const originalJpgRef = storageRef.child("photos").child(id).child("original.jpg");
  console.log(base64)
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

export default {fetchPhotos, getUser, uploadPhoto};
