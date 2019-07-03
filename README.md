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
You can simple copy it and then modify it as you wish with
```
curl -L https://github.com/Geovation/photos/archive/master.zip | tar -xvf -
mv photos-master myProject && cd myProject
git init
npm install
npm install geovation-photos -D
git add . && git commit -m "kick off"
```

done !. Now you can start the server with ```npm start```


# Update it
If you plan to keep Geovation Photos updates in your project:
```
npm install geovation-photos@latest -D
```

Currently it implies some manual work but if you kept your changes in a a single place and with the help of a good git IDE it should not be too painful. First of all check if there is a new version with ```npm outdated```. If there is a new version you can simple run
```
npm install geovation-photos@latest -D
npm run geovation-photos-update
```
And now just merge the changes by hand. Good luck !!!

# Demo

Demo PWA/Mobile app done from Geovation Photos. See a [PWA demo live](https://photos-demo-d4b14.web.app)

See more (Documentation)[doc/]
