import styles from './config.scss';

const primaryColor = styles.primary;
const secondaryColor = styles.secondary;

export default {
  MAX_IMAGE_SIZE: 2048,
  THEME: {
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: { main: primaryColor },
      secondary: { main: secondaryColor },
    },
  },
  // MAP_SOURCE: "mapbox://styles/mapbox/streets-v10",
  MAP_SOURCE: "https://s3-eu-west-1.amazonaws.com/tiles.os.uk/styles/open-zoomstack-outdoor/style.json",
  MAP_ATTRIBUTION: "Contains OS data &copy; Crown copyright and database rights 2018",
  MAPBOX_TOKEN: "pk.eyJ1Ijoic2ViYXN0aWFub3ZpZGVnZW92YXRpb251ayIsImEiOiJjanA4ZWwwbTkxdDNxM2twZTgyMGdqOXB5In0.MrWFt3rABCo7n7MBbVRaNw",
  FIREBASE: {
    apiKey: "AIzaSyBkuZPVStg_zRfUaxLJ-mP4xxdFv8GzdZw",
    authDomain: "photos-demo-d4b14.firebaseapp.com",
    databaseURL: "https://photos-demo-d4b14.firebaseio.com",
    projectId: "photos-demo-d4b14",
    storageBucket: "photos-demo-d4b14.appspot.com",
    messagingSenderId: "639308065605"
  },
  GA_TRACKING_ID: "UA-128504979-1"
}
