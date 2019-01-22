'use strict';

const functions = require('firebase-functions');
const mkdirp = require('mkdirp-promise');
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore()
firestore.settings({ timestampsInSnapshots: true });
const path = require('path');
const os = require('os');
const fs = require('fs');
const gm = require('gm').subClass({imageMagick: true});

const THUMB_MAX_SIZE = 50;
const THUMB_NAME = 'thumbnail.jpg';

const MAIN_MAX_SIZE = 1014;
const MAIN_NAME = '1024.jpg';

const cors = require('cors')({
  origin: true,
});

/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 * After the thumbnail has been generated and uploaded to Cloud Storage,
 * we write the public URL to the Firebase Realtime Database.
 */
exports.generateThumbnail = functions.storage.object().onFinalize(async (object) => {
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
    return console.log('This is not an image.', filePath);
  }

  // Exit if the image is already a thumbnail.
  if (fileName !== "original.jpg") {
    return console.log("I won't create a thumbnail for ",filePath);
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
  console.log('The file has been downloaded to', tempLocalFile);
  // Generate a thumbnail using ImageMagick.
  await resize(tempLocalFile, tempLocalThumbFile, THUMB_MAX_SIZE);
  console.log('Thumbnail created at', tempLocalThumbFile);
  await resize(tempLocalFile, tempLocalMainFile, MAIN_MAX_SIZE);
  console.log('Main created at', tempLocalMainFile);

  // Uploading the Thumbnail.
  const uploadThumb = bucket.upload(tempLocalThumbFile, {destination: thumbFilePath, metadata: metadata})
    .then( _ => bucket.makePublic());
  const uploadMain = bucket.upload(tempLocalMainFile, {destination: mainFilePath, metadata: metadata})
    .then( _ => bucket.makePublic());

  await Promise.all([uploadMain, uploadThumb]);
  console.log('Thumbnail uploaded to Storage at', thumbFilePath);
  console.log('Main uploaded to Storage at', mainFilePath);

  // Once the image has been uploaded delete the local files to free up disk space.
  fs.unlinkSync(tempLocalFile);
  fs.unlinkSync(tempLocalThumbFile);
  fs.unlinkSync(tempLocalMainFile);

  return console.log(`Photos are public now`);
});

async function resize(inFile, outFile, maxSize) {
  return new Promise( (resolve, reject) => {
    gm(inFile).resize(maxSize,maxSize).write(outFile, (err) => {
      if (err) reject(err); else resolve();
    });
  });
}

exports.stats = functions.https.onRequest((req, res) => {
  if (req.method !== 'GET') {
    return res.status(403).send('Forbidden!');
  }

  // set cache so it won't be calculated again: 1 day (in seconds)
  const AGE = 1 * 24 * 60 * 60;
  res.set('Cache-Control', `public, max-age=${AGE}, s-maxage=${AGE * 2}`);

  return cors(req, res, async () => {
    const stats = {
      totalUploaded: 0,
      moderated: 0,
      published: 0,
      pieces: 0
    };

    const querySnapshot = await firestore.collection("photos").get();

    querySnapshot.forEach( doc => {
      const data = doc.data();
      stats.totalUploaded++;

      if (data.moderated) stats.moderated++;

      if (data.published) {
        stats.published++;

        const pieces = Number(data.pieces);
        if (!isNaN(pieces) && pieces > 0 ) stats.pieces += pieces;
      }
    });

    res.json(stats);
  });
});
