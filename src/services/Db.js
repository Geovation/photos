import {firestore} from '../firebaseInit.js';

class Db {
  async fetchPhotos() {
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
}

export default Db;
