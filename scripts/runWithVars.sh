#!/bin/sh

VERSION_MAYOR=$(echo $npm_package_version| cut -d'.' -f 1)
VERSION_MINOR=$(echo $npm_package_version| cut -d'.' -f 2)

export REACT_APP_BUILD_NUMBER=${TRAVIS_BUILD_NUMBER:-"0123456789"}
export REACT_APP_VERSION="$VERSION_MAYOR.$VERSION_MINOR.$REACT_APP_BUILD_NUMBER"
export REACT_APP_TITLE=$npm_package_title

set -x;
eval $@
set +x;
