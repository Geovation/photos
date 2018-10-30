[![Build Status](https://travis-ci.org/Geovation/photos.svg?branch=master)](https://travis-ci.org/Geovation/photos)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FGeovation%2Fphotos.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FGeovation%2Fphotos?ref=badge_shield)
[![dependencies Status](https://david-dm.org/geovation/photos/status.svg)](https://david-dm.org/geovation/photos)
[![Maintainability](https://api.codeclimate.com/v1/badges/f18dd7329321d93cbabb/maintainability)](https://codeclimate.com/github/Geovation/photos/maintainability)

# Geovation photos
Many people in our [Geovation Hub](https://geovation.uk/hub) are asking for a simple tool to upload images into a map. It must be free, and easy to extend and white label. It also must work as mobiles app as well as web apps. An example of this is [Plastic Patrol](https://www.plasticpatrol.co.uk/). They needed an app to capture plastic pollution around UK.
The idea Geovation Photos is to be a skeleton for those types of apps.

# Getting started
You can simple copy it and then modify it with
```
curl -L https://github.com/Geovation/photos/archive/master.zip | tar -xvf -
mv photos-master myProject && cd myProject
git init
npm install
git add . && git commit -m "kick off"
```

Alternatively, if you plan to keep Geovation Photos updates in your project:
```
mkdir myProject && cd myProject
git init
npm init -y
npm install geovation-photos -D
./node_modules/.bin/geovation-photos-update
npm install
git add . && git commit -m "kick off"
```

done !. Now you can start the server with ```npm start```

# Update it
Currently it implies some manual work but with the help of a good git IDE it should not be too painful. First of all check if there is a new version with ```npm outdated```. If there is a new version you can simple run
```
npm install geovation-photos@latest -D
./node_modules/.bin/geovation-photos-update
```
And now just merge the changes by hand. If you kept your customisations outside Geovation photos folders, the merge should be not too bad.
