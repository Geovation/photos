/**
 * This script just populate the DB with demo data. The ID's are prefixed with "test_" for make it easy to find them and
 * eventually delete them.
 */

const admin = require('firebase-admin');

const randomLocation = require('random-location');

const serviceAccount = require('./serviceAccountKey.json');
const LONDON_COORDS = {
  latitude: 51.509865,
  longitude: -0.118092
};
const R = 20 * 1000;

async function addMetaDataSync(id) {

  const rndLocation = randomLocation.randomCirclePoint(LONDON_COORDS, R);
  const location = new admin.firestore.GeoPoint(rndLocation.latitude, rndLocation.longitude);
  const data = {
    updated: FieldValue.serverTimestamp(),
    location: location,
    description: `${id} some text here`
  };

  console.log(`Adding ${id} with data: ${data}`);

  await photosCol.doc(id).set(data).catch(e => {
    console.error(e);
  });
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;
const photosCol = db.collection('photos');

for (let i=0; i< 100; i++) {
  addMetaDataSync(`test_${i}`);
}
