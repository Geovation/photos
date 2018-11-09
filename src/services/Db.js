import {firebaseApp} from './firebaseInit.js';

async function fetchPhotos() {
  const geojson = {
    "type": "FeatureCollection",
    "features": []
  };

  const querySnapshot = await firebaseApp.firestore().collection("photos").get();

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

/**
 * When the user login call fn
 * @param fn
 */
const onAuthStateChanged = (fn) => {
  return firebaseApp.auth().onAuthStateChanged(fn);
};

const signOut = () => {
  firebaseApp.auth().signOut();
};

const currentUser = () => {
  return firebaseApp.auth().currentUser;
};

export default {fetchPhotos, onAuthStateChanged, signOut, currentUser};
