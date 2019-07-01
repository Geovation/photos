#!/bin/sh

set -x;

cp src/custom/config.json functions/

VERSION_MAYOR=$(echo $npm_package_version| cut -d'.' -f 1)
VERSION_MINOR=$(echo $npm_package_version| cut -d'.' -f 2)

export REACT_APP_BUILD_NUMBER=${TRAVIS_BUILD_NUMBER:-"0"}
export REACT_APP_VERSION="$VERSION_MAYOR.$VERSION_MINOR.$REACT_APP_BUILD_NUMBER"
export REACT_APP_TITLE=$npm_package_title

eval $@
set +x;
