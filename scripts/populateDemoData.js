#!/usr/bin/env node

/**
 * This script just populate the DB with demo data. The ID's are prefixed with "test_" for make it easy to find them and
 * eventually delete them.
 */
const admin = require('firebase-admin');
const randomLocation = require('random-location');
const Jimp = require('jimp');

const serviceAccount = require('./serviceAccountKey.json');
const LONDON_COORDS = {
  latitude: 51.509865,
  longitude: -0.118092
};
const R = 20 * 1000;

let image;
let font;
const fileNameGeovation = 'geovation.jpg';
let bucket;
let db;

async function addMetaDataSync(id) {
  const rndLocation = randomLocation.randomCirclePoint(LONDON_COORDS, R);
  const location = new admin.firestore.GeoPoint(rndLocation.latitude, rndLocation.longitude);
  const data = {
    updated: admin.firestore.FieldValue.serverTimestamp(),
    location: location,
    description: `${id} some text here`
  };

  console.log(`Adding ${id} with data:`, data);

  return await db.collection('photos').doc(id).set(data);
}

async function addPhotoSync(id) {
  console.log(`Uploading ${id}`);

  // upload it as "original"
  return await bucket.upload('tmp.jpg', { destination: `photos/${id}/original.jpg` });
}

async function run(num) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "photos-demo-d4b14.appspot.com"
  });
  bucket = admin.storage().bucket();
  db = admin.firestore();
  const settings = {timestampsInSnapshots: true};
  db.settings(settings);

  image = await Jimp.read(fileNameGeovation);
  font = await Jimp.loadFont(Jimp.FONT_SANS_128_BLACK);

  for (let i=0; i< num; i++) {
    const id = `test_${i}`;
    // watermark it with id

    image.print(font, 0, 0, id).write('tmp.jpg');

    await addPhotoSync(id);
    await addMetaDataSync(id);
  }
}

run(100)
  .then(_ => {
    console.log("END");
    process.exit(0);
  })
  .catch( e => {
    console.error(e);
    process.exit(1);
  });
