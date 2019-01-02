import styles from './config.scss';
import enums from '../types/enums';

const primaryColor = styles.primary;
const secondaryColor = styles.secondary;

const CUSTOM_STRING = {
  tutorial: {
    "Walk around the city and take photos": "Walk around the city and take photos",
    "Write info about the photos and upload it to the cloud": "Write info about the photos and upload it to the cloud",
    "View your images in our interactive map": "View your images in our interactive map"
  },
  about: {
    "We are Geovation and we Geovate": "Backed by years of industry experience and a network that reaches far and wide, we are a community of location-data and proptech collaborators looking to make positive change happen.\n" +
    "\n" +
    "Since its inception in 2009 Geovation has become a leading proponent of the value of open innovation in the public sector. After opening its first space in summer 2015, Geovation has grown to support a community of more than 1,200 entrepreneurs, investors, developers, academics, students and corporate innovators.\n" +
    "\n" +
    "Our accelerators provide startups up to £20,000 in grant funding, access to data, experienced product development capabilities, geospatial expertise from Ordnance Survey and land and property insight from HM Land Registry, as well as business mentorship and coaching to help prepare for presenting to investors from the wider team and our partners. To date, our accelerator has supported 79 technology start-ups, and we’ve seen nearly £20M raised in investment funding."
  }
};

const PAGES = {
  map: {
    path: "/",
    label: "Map"
  },
  embeddable: {
    path: "/embeddable",
    label: "Map"
  },
  photos: {
    path: "/photo",
    label: "Photo"
  },
  moderator: {
    path: "/moderator",
    label: "Photo Approval"
  },
  account: {
    path: "/account",
    label: "Account"
  },
  about: {
    path: "/about",
    label: "About"
  },
  tutorial: {
    path: "/tutorial",
    label: "Tutorial"
  },
};

const customiseString = (page, key) => (CUSTOM_STRING[page][key] || key);

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
    spacing: {
      unit: 10
    }
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
  GA_TRACKING_ID: "UA-128504979-1",
  PHOTO_ZOOMED_FIELDS: {
    "updated": s => new Date(s).toDateString(),
    "description": s => s
  },
  PHOTO_FIELD: {
    name: 'description',
    title: 'Description',
    type: enums.TYPES.string,
    placeholder: 'eg. whatever'
  },
  PAGES,
  customiseString
}
