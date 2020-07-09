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
const storageBucket = require("../public/config.json").FIREBASE.config
  .storageBucket;
const argv = require("yargs")
  .usage("Usage: $0 [options]")
  .describe("n", "Number of photos")
  .alias("n", "number")
  .demandOption(["n"])
  .number("n")
  .describe("s", "Storage")
  .alias("s", "storage")
  .default("s", storageBucket)
  .example("$0 -n 100", `Upload 100 photos to ${storageBucket}`)
  .help("h")
  .alias("h", "help").argv;

const LONDON_COORDS = {
  latitude: 51.509865,
  longitude: -0.118092,
};
const R = 50 * 1000;
const publishedProbability = 1;

const fileNameGeovation = "geovation.jpg";
let bucket;
let db;

async function addMetaDataSync(id) {
  const published = Math.random() <= publishedProbability ? true : null;

  const rndLocation = randomLocation.randomCirclePoint(LONDON_COORDS, R);
  const location = new admin.firestore.GeoPoint(
    rndLocation.latitude,
    rndLocation.longitude
  );
  const data = {
    updated: admin.firestore.FieldValue.serverTimestamp(),
    location: location,
    description: `${id} some text here`,
    moderated: published ? admin.firestore.FieldValue.serverTimestamp() : null,
    published: published,
    test: true,
  };

  console.log(`Adding ${id} with data:`, data);

  return await db.collection("photos").doc(id).set(data);
}

async function addPhotoSync(id) {
  console.log(`Uploading ${id}`);

  // upload it as "original"
  return await bucket.upload("tmp.jpg", {
    destination: `photos/${id}/original.jpg`,
  });
}

async function run(num, storage) {
  console.log(`Will upload ${num} photos to ${storage}`);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: storage,
  });
  bucket = admin.storage().bucket();
  db = admin.firestore();

  const image = await Jimp.read(fileNameGeovation);
  const fontBlack = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
  const fontWhite = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);

  const maxHeight = image.getHeight();
  const maxWidth = image.getWidth();
  const digits = 12;

  for (let i = 0; i < num; i++) {
    console.log(`processing photo ${i + 1}/${num}`);

    const id = `test_${(Math.floor(Math.random() * 10 ** digits) + "").padStart(
      digits,
      "0"
    )}`;

    // watermark it with id
    const text = {
      text: id,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
    };
    const newImage = image.clone();
    newImage.print(fontWhite, 5, 0, text, maxWidth, maxHeight);
    newImage.print(fontBlack, 0, 0, text, maxWidth, maxHeight);
    await newImage.writeAsync("tmp.jpg");

    await Promise.all([addPhotoSync(id), addMetaDataSync(id)]);
  }
}

run(argv.number, argv.storage)
  .then(() => {
    console.log("The End ;)");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
