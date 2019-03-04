'use strict';

const functions = require('firebase-functions');
const mkdirp = require('mkdirp-promise');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const {PubSub} = require('@google-cloud/pubsub');
const path = require('path');
const os = require('os');
const fs = require('fs');
const gm = require('gm').subClass({imageMagick: true});
const express = require('express');

const THUMB_MAX_SIZE = 50;
const THUMB_NAME = 'thumbnail.jpg';

const MAIN_MAX_SIZE = 1014;
const MAIN_NAME = '1024.jpg';

const TOPIC = "update-stats";
const DB_CACHE_AGE_MS = 1000 * 60 * 60 * 24 * 1; // 1 day
const WEB_CACHE_AGE_S =    1 * 60 * 60 * 24 * 1; // 1day

admin.initializeApp();
const firestore = admin.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

const pubsub = new PubSub();
const app = express();
app.use(cors);

async function resize(inFile, outFile, maxSize) {
  return new Promise( (resolve, reject) => {
    gm(inFile).resize(maxSize,maxSize).write(outFile, (err) => {
      if (err) reject(err); else resolve();
    });
  });
}

/**
 * It publish a message indicating to recalculate the stats if the data doesn't have the field "updated".
 *
 * @param doc "/sys/stats" doc coming from firebase
 *
 * @returns {Promise<boolean>}
 */
async function pubIfNecessary(doc) {
  let recalculate = true;

  try {
    const updatedTimestamp = doc.data().updated.toDate().getTime();
    const age = new Date().getTime() - updatedTimestamp;
    recalculate = age > DB_CACHE_AGE_MS;
    console.info(`States is ${age / 1000 / 60 / 60 } hours old`);
  } catch(e) {
    console.info("states is corrupted. It will be re calculated: ", e);
  }

  if (recalculate) {
    console.info("Need to recreate stats");

    try {
      await pubsub.createTopic(TOPIC);
    } catch(e) {
      console.debug("topic already created");
    }

    const messageId = await pubsub.topic(TOPIC).publish(Buffer.from("Recreate the stats"));
    console.info(`Message ${messageId} published.`);
  }

  return true;
}

/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 * After the thumbnail has been generated and uploaded to Cloud Storage,
 * we write the public URL to the Firebase Realtime Database.
 */
const generateThumbnail = functions.storage.object().onFinalize(async (object) => {
  // File and directory paths.
  const filePath = object.name;
  const contentType = object.contentType; // This is the image MIME type
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_NAME}`));
  const mainFilePath = path.normalize(path.join(fileDir, `${MAIN_NAME}`));
  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);
  const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);
  const tempLocalMainFile = path.join(os.tmpdir(), mainFilePath);

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    return console.info('This is not an image.', filePath);
  }

  // Exit if the image is already a thumbnail.
  if (fileName !== "original.jpg") {
    return console.info(`I won't create a thumbnail for ${filePath} as it is not called "original.jpg"`);
  }

  // Cloud Storage files.
  const bucket = admin.storage().bucket(object.bucket);
  const file = bucket.file(filePath);

  const metadata = {
    contentType: contentType,
    // To enable Client-side caching you can set the Cache-Control headers here. Uncomment below.
    'Cache-Control': 'public,max-age=3600',
  };

  // Create the temp directory where the storage file will be downloaded.
  await mkdirp(tempLocalDir);
  // Download file from bucket.
  await file.download({destination: tempLocalFile});
  console.info('The file has been downloaded to', tempLocalFile);
  // Generate a thumbnail using ImageMagick.
  await resize(tempLocalFile, tempLocalThumbFile, THUMB_MAX_SIZE);
  console.info('Thumbnail created at', tempLocalThumbFile);
  await resize(tempLocalFile, tempLocalMainFile, MAIN_MAX_SIZE);
  console.info('Main created at', tempLocalMainFile);

  // Uploading the Thumbnail.
  const uploadThumb = bucket.upload(tempLocalThumbFile, {destination: thumbFilePath, metadata: metadata})
    .then( _ => bucket.makePublic());
  const uploadMain = bucket.upload(tempLocalMainFile, {destination: mainFilePath, metadata: metadata})
    .then( _ => bucket.makePublic());

  await Promise.all([uploadMain, uploadThumb]);
  console.info('Thumbnail uploaded to Storage at', thumbFilePath);
  console.info('Main uploaded to Storage at', mainFilePath);

  // Once the image has been uploaded delete the local files to free up disk space.
  fs.unlinkSync(tempLocalFile);
  fs.unlinkSync(tempLocalThumbFile);
  fs.unlinkSync(tempLocalMainFile);

  return console.info(`Photos are public now`);
});

app.get('/api/stats', async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(403).send('Forbidden!');
  }

  res.set('Cache-Control', `public, max-age=${WEB_CACHE_AGE_S}, s-maxage=${WEB_CACHE_AGE_S * 2}`);

  try {
    const doc = await firestore.collection('sys').doc('stats').get();
    if (doc.exists) {
      const data = doc.data();
      data.updated = data.updated.toDate();
      data.serverTime = new Date();
      res.json(data);
      pubIfNecessary(doc);
      console.debug(data);
      return true;
    } else {
      throw new Error("/sys/stats doesn't exist");
    }
  } catch (e) {
    pubIfNecessary();
    console.info(e);
    return res.status(503).send('stats not ready yet');
  }
});

/**
 * recalculate the stats and save them in the DB
 *
 * @type {CloudFunction<Message>}
 */
const updateStats = functions.pubsub.topic(TOPIC).onPublish( async (message, context) => {
  const stats = {
    totalUploaded: 0,
    moderated: 0,
    published: 0,
    rejected: 0,
    pieces: 0,
    updated: admin.firestore.FieldValue.serverTimestamp()
  };

  const querySnapshot = await firestore.collection("photos").get();

  querySnapshot.forEach( doc => {
    const data = doc.data();
    stats.totalUploaded++;

    // has the upload been reviewed by a moderator ?
    if (data.moderated) {
      stats.moderated++;

      // has it been approved ?
      if (data.published) {
        stats.published++;

        const pieces = Number(data.pieces);
        if (!isNaN(pieces) && pieces > 0 ) stats.pieces += pieces;
      } else {
        stats.rejected++;
      }
    }

  });

  return await firestore.collection('sys').doc('stats').set(stats);
});

module.exports = {
  api: functions.https.onRequest(app),
  generateThumbnail,
  updateStats
};
