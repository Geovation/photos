#!/bin/sh

set -x;


# config used in cloud functions and service worker
if [[ "$NODE_ENV" = "production" ]]; then
  CONFIG_FILE="src/custom/config.prod.json"
else
  CONFIG_FILE="src/custom/config.dev.json"
fi

# the service worker need to import the config without using fetch
echo $CONFIG_FILE
cp $CONFIG_FILE public/config.json
cp $CONFIG_FILE functions/config.json

configText=`cat public/config.json`

echo "const config = $configText;" > public/config.js

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
