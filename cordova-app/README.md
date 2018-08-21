# Create Cordova App

Make sure to install cordova beforehand:
```
$ sudo npm install -g cordova
```

**Always** go to root `photos` folder and run this command **first** to build your latest React app:
```
$ npm run build
```

**All subsequent commands** need to be run within the `cordova-app` directory:

Add the platform that you want to target your app - 'android' in this case:
```
$ cordova platform add android
```

Install geolocation and camera plugins:
```
$ cordova plugin add cordova-plugin-geolocation
$ cordova plugin add cordova-plugin-camera
```

After, run this command to build the project to specific platform:
```
$ cordova build android
```

Run the following command to test and view the app within a specific platform's emulator:
```
$ cordova emulate android
```

Alternately, you can test the app directly on a real device:
```
$ cordova run android
```
