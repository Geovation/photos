#!/bin/sh

set -x;


# config used in cloud functions and service worker
if [ "$NODE_ENV" == "production" ]; then
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

export REACT_APP_BUILD_NUMBER=${GITHUB_RUN_NUMBER:-"0"}
export REACT_APP_VERSION="$VERSION_MAYOR.$VERSION_MINOR.$REACT_APP_BUILD_NUMBER"
export REACT_APP_TITLE=$npm_package_title

# Copy web-vitals polyfill script from node_modules/web-vitals/dist/polyfill.js to public/index.html
SCRIPT=`cat node_modules/web-vitals/dist/polyfill.js`
SCRIPT=$(echo "$SCRIPT" | sed -e 's/&/\\\&/g' )
sed -i "" "s#<script id=\"web-vitals\">.*</script>#<script id=\"web-vitals\">$SCRIPT</script>#" public/index.html

eval $@
EXIT_CODE=$?
set +x;
# ls public

if [ $EXIT_CODE -eq 0 ]
then
  echo "Successfully built"
  exit $EXIT_CODE
else
  echo "The build failed"
  exit $EXIT_CODE
fi
