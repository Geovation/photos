#!/usr/bin/env node

/**
 * This script just populate the DB with demo data. The ID's are prefixed with "test_" for make it easy to find them and
 * eventually delete them.
 * Run it from this folder.
 */
const admin = require("firebase-admin");
const randomLocation = require("random-location");
const Jimp = require("jimp");
const serviceAccount = require("./serviceAccountKey.json");
const storageBucket = require("../public/config.json").FIREBASE.config.storageBucket;
const path = require('path');
const _ = require('lodash');
const turf = require('@turf/turf');
const Queue = require('queue-promise');

const fs = require('fs');
const os = require('os');
const fsPromises = fs.promises;

const LOCATIONS = {
  "Global": {},
  "London": {
    center: {
      latitude: 51.509865,
      longitude: -0.118092,
    },
    radius: 50 * 1000
  },
};

const argv = require("yargs")
  .usage("Usage: $0 [options]")
  .describe("n", "Number of photos")
  .alias("n", "number")
  .demandOption(["n"])
  .number("n")
  .describe("l", "Location")
  .alias("l", "location")
  .default("l", "Global")
  .choices("l", _.keys(LOCATIONS))
  .describe("s", "Storage")
  .alias("s", "storage")
  .default("s", storageBucket)
  .example("$0 -n 100", `Upload 100 photos to ${storageBucket}`)
  .help("h")
  .alias("h", "help").argv;

const publishedProbability = 1;

const fileNameGeovation = "geovation.jpg";
let bucket;
let db;

async function addMetaDataSync(id, locationName) {
  const published = Math.random() <= publishedProbability ? true : null;

  let location;
  if (LOCATIONS[locationName].center) {
    const rndLocation = randomLocation.randomCirclePoint(LOCATIONS[locationName].center, LOCATIONS[locationName].radius);
    location = new admin.firestore.GeoPoint(
      rndLocation.latitude,
      rndLocation.longitude
    );
  } else {
    const longLat = turf.randomPosition();
    location = new admin.firestore.GeoPoint(longLat[1], longLat[0]);
  }

  const lastYear = new Date();
  lastYear.setMonth(lastYear.getMonth() - 12);
  const now = new Date();
  const rndDate = new Date(lastYear.getTime() + Math.random() * (now.getTime() - lastYear.getTime()));

  const data = {
    updated: rndDate,
    location,
    description: `${id} some text here ${locationName}`,
    moderated: published ? rndDate : null,
    published,
    test: true,
    number: Math.round(Math.random()*10)
  };

  const rtn = await db.collection("photos").doc(id).set(data);
  console.log(`Added ${id} with data:`, data);
  return rtn;
}

async function addPhotoSync(id, filePath) {
  // upload it as "original"
  const rtn = await bucket.upload(filePath, { destination: `photos/${id}/original.jpg`, });
  console.log(`Uploaded ${filePath}`);
  return rtn;
}

async function run(num, storage, location) {
  console.log(`Will upload ${num} photos to ${storage} in ${location}`);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: storage,
  });
  bucket = admin.storage().bucket();
  db = admin.firestore();

  const image = await Jimp.read(path.join( path.dirname(__filename), fileNameGeovation));
  const fontBlack = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
  const fontWhite = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);

  const maxHeight = image.getHeight();
  const maxWidth = image.getWidth();
  const digits = 12;

  const queue = new Queue({
    concurrent: 10,
    interval: 10
  });
  
  queue.on("end", () => console.log("The end"));
  queue.on("resolve", data => console.log(`Resolved ${data}`));
  queue.on("reject", error => console.error(error));
  const tempDir = os.tmpdir();

  for (let i = 0; i < num; i++) {
    console.log(`Enqueuing photo ${i + 1}/${num}`);

    const id = `test_${(Math.floor(Math.random() * 10 ** digits) + "").padStart(
      digits,
      "0"
    )}`;
    const tmpFilePath = path.join(tempDir, `${id}.jpg`);

    queue.enqueue(() => uploadPhoto(image, tmpFilePath, id, location, i, num, fontWhite, fontBlack, maxWidth, maxHeight)); 
  }
  // await Promise.all(queue);
  while (queue.shouldRun) {
    const data = await queue.dequeue();
  }
}

async function uploadPhoto(image, tmpFilePath, id, location, i, num, fontWhite, fontBlack, maxWidth, maxHeight) {
        // watermark it with id
    const text = {
      text: id,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
    };
    const newImage = image.clone();
    newImage.print(fontWhite, 5, 0, text, maxWidth, maxHeight);
    newImage.print(fontBlack, 0, 0, text, maxWidth, maxHeight);
  
    await newImage.writeAsync(tmpFilePath);
    await addMetaDataSync(id, location);
    await addPhotoSync(id, tmpFilePath);
    await fsPromises.unlink(tmpFilePath);
    console.log(`Completed photo ${i + 1}/${num}`);
};

run(argv.number, argv.storage, argv.location)
  .then(() => {
    console.log("The End ;)");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
