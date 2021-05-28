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

VERSION_MAYOR=$(echo $npm_package_version| cut -d'.' -f 1)
VERSION_MINOR=$(echo $npm_package_version| cut -d'.' -f 2)

export REACT_APP_BUILD_NUMBER=${TRAVIS_BUILD_NUMBER:-"0"}
export REACT_APP_VERSION="$VERSION_MAYOR.$VERSION_MINOR.$REACT_APP_BUILD_NUMBER"
export REACT_APP_TITLE=$npm_package_title

# TODO:
# need to copy the pollifill from the library
#  node_modules/web-vitals/dist/polyfill.js
# sed  's/<script id="web-vitals">/,/<\/script>/\<\/bla>/g;' public/index.html > public/index.html

eval $@
set +x;
ls public
