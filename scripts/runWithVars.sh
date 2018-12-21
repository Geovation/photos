#!/bin/sh

export REACT_APP_BUILD_NUMBER=${TRAVIS_BUILD_NUMBER:-"0123456789"}
export REACT_APP_VERSION=$npm_package_version
export REACT_APP_TITLE=$npm_package_title

set -x;
eval $@
set +x;
