#!/usr/bin/env node

/**
 * After updating geovation-photos package, use this script to update your project. It will overwrite some of your
 * files so you may need to merge the differences.
 */
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const rimraf = util.promisify(require("rimraf"));
const ncp = util.promisify(require("ncp").ncp);

const geovationPhotoFolder = path.join(path.dirname(__filename), "..");

console.log(`geovationPhotoFolder: ${geovationPhotoFolder}`);

function mergePackages() {
  // read current project package.json
  const currentPackage = JSON.parse(fs.readFileSync("package.json"));

// if it is geovation-photos then do nothing
  if (currentPackage.name === "geovation-photos") {
    console.error("This is the geovation photo it self");
    process.exit(1);
  }

// read geovation package.json
// Do Ineed realpathSync? console.log(path.join(path.dirname(fs.realpathSync(__filename)), "../package.json"));
  const geovationPhotosPackageFileName = path.join(geovationPhotoFolder, "package.json");
  const geovationPhotosPackage = JSON.parse(fs.readFileSync(geovationPhotosPackageFileName));

  console.log(currentPackage.name + " package.json : " , currentPackage, "\n");
  console.log(geovationPhotosPackage.name + " package.json : " , geovationPhotosPackage, "\n");

  const mergedPackage = _.merge(currentPackage, _.pick(geovationPhotosPackage, ["dependencies", "devDependencies", "scripts"]));
  console.log("merged version:", mergedPackage );

  fs.writeFileSync("package.json", JSON.stringify(mergedPackage, null, 2));
}

async function copySrc() {
  try {
    const pathToCopy = ["src", "cordova-app", "public", "functions", "firebase.json", "firestore.indexes.json", "firestore.rules", "storage.rules"];

    for (dstIdx in pathToCopy) {
      const dst = pathToCopy[dstIdx];
      const photosPath = path.join(geovationPhotoFolder, dst);

      await rimraf(dst);
      console.log(`${dst} deleted`);

      await ncp(photosPath, dst);
      console.log(`... ${photosPath} copied to ${dst}\n`)
    }

    // see https://github.com/atlassubbed/atlas-npm-init/issues/1
    await ncp(path.join(geovationPhotoFolder, "gitignore"), ".gitignore", {clobber: false});

    await exec('git add -A');
  } catch (e) {
    console.log(e)
  }
}

mergePackages();
copySrc();

console.log("done!. Now finish the merge by hand. ");
