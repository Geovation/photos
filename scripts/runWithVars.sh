#!/bin/sh

set -x;


# config used in cloud functions and service worker
if [[ "$NODE_ENV" = "production" ]]; then
  cp src/custom/config.prod.json functions/config.json
  cp src/custom/config.prod.json public/config.json
else
  cp src/custom/config.dev.json functions/config.json
  cp src/custom/config.dev.json public/config.json
fi

# any better way ???? it muast be inserted in the HEAD as first thing
cp node_modules/first-input-delay/dist/first-input-delay.min.js  public/

VERSION_MAYOR=$(echo $npm_package_version| cut -d'.' -f 1)
VERSION_MINOR=$(echo $npm_package_version| cut -d'.' -f 2)

export REACT_APP_BUILD_NUMBER=${TRAVIS_BUILD_NUMBER:-"0"}
export REACT_APP_VERSION="$VERSION_MAYOR.$VERSION_MINOR.$REACT_APP_BUILD_NUMBER"
export REACT_APP_TITLE=$npm_package_title

eval $@
set +x;
ls public
