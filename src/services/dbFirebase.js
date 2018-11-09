import firebaseApp from './firebaseInit.js';

const db = firebaseApp.firestore();

async function fetchPhotos() {
  const geojson = {
    "type": "FeatureCollection",
    "features": []
  };

  const querySnapshot = await db.collection("photos").get();

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

async function getUser(id) {
  const fbUser = await db.collection("users").doc(id).get();
debugger
  return fbUser.exists ? fbUser.data() : null;
}

export default {fetchPhotos, getUser};
