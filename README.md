[![Build Status](https://travis-ci.org/Geovation/photos.svg?branch=master)](https://travis-ci.org/Geovation/photos)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FGeovation%2Fphotos.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FGeovation%2Fphotos?ref=badge_shield)
[![dependencies Status](https://david-dm.org/geovation/photos/status.svg)](https://david-dm.org/geovation/photos)
[![Maintainability](https://api.codeclimate.com/v1/badges/f18dd7329321d93cbabb/maintainability)](https://codeclimate.com/github/Geovation/photos/maintainability)
[![Coverage Status](https://coveralls.io/repos/github/Geovation/photos/badge.svg)](https://coveralls.io/github/Geovation/photos)
[![npm version](https://badge.fury.io/js/geovation-photos.svg)](https://badge.fury.io/js/geovation-photos)

# Geovation photos

Many people in our [Geovation Hub](https://geovation.uk/hub) are asking for a simple tool to upload images into a map. It must be free, and easy to extend and white label. It also must work as mobile app as well as web app. An example of this is [Plastic Patrol](https://www.plasticpatrol.co.uk/). They needed an app to capture plastic pollution around UK.
The idea of Geovation Photos is to be a skeleton for those types of apps.

# Getting started

## Firebase

- install node
- create a project with Blaze account
- create a Cloud Firestore and a Realtime Database
- create a storage
- in google cloude console, make htat storage public readable.

## Code

- Clone it `git clone git@github.com:Geovation/photos.git`
- Install dependencies

```
npm ci
cd functions
npm ci
cd ..
```

- update the file `.firebaserc` with your project information.
- update the files `src/custom/config.dev.json` with your project information.
- update the files `src/custom/config.prod.json` with your project information.
- build it `npm run build`
- deploy it: `npm run deploy`

done !. Hopefully it is running. If not, let me know as we'd may need to update the documentation.

- start the server locally: `npm start`

# Update it

just pull from upstream. Be carefull to do not overwrite the `custom` folders

# Demo

Demo PWA/Mobile app done from Geovation Photos. See a [PWA demo live](https://photos-demo-d4b14.web.app)

See more [Documentation](./doc/).
