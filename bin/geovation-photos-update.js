#!/usr/bin/env node

/**
 * After updating geovation-photos package, use this script to update your project. It will overwrite some of your
 * files so you may need to merge the differences.
 */
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const ncp = require("ncp").ncp;

const geovationPhotoFolder = path.join(path.dirname(__filename), "..");

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

function copySrc() {
  ncp(path.join(geovationPhotoFolder, "src"), "src", errFunc);
  ncp(path.join(geovationPhotoFolder, "cordova-app"), "cordova-app", errFunc);
  ncp(path.join(geovationPhotoFolder, "public"), "public", errFunc);
  // see https://github.com/atlassubbed/atlas-npm-init/issues/1
  ncp(path.join(geovationPhotoFolder, "gitignore"), ".gitignore", { clobber : false }, errFunc);
}

function errFunc(err) {
    if (err) {
      return console.error(err);
    }
}

mergePackages();
copySrc();

console.log("done!. Now finish the merge by hand. ");
