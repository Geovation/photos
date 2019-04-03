import styles from './config.scss';
import enums from '../types/enums';
import TitleTextField from '../components/PhotoPage/TitleTextField';
import MultiFields from '../components/PhotoPage/MultiFields';
// import SelectControlWrapper from '../components/PhotoPage/SelectControlWrapper';
// import SelectControlNumbered from '../components/PhotoPage/SelectControlNumbered';
// import MultipleSelectControlNumbered from '../components/PhotoPage/MultipleSelectControlNumbered';
// import MultipleSelectControlTextFields from '../components/PhotoPage/MultipleSelectControlTextFields';

import { data } from './categories';

const primaryColor = styles.primary;
const secondaryColor = styles.secondary;

const CUSTOM_STRING = {
  drawer: {
    "photos published so far!": "photos published so far!"
  },
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
  },
  writeFeedback: {
    "admin@geovation.uk": "it@geovation.uk"
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
  writeFeedback: {
    path: "/write-feedback",
    label: "Feedback"
  }
};

const customiseString = (page, key) => (CUSTOM_STRING[page][key] || key);

const getStats = async (photos) => {
  const photoObj = await photos;
  return Object.keys(photoObj.features).length;
}

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
    "description": s => s,
    "notes": s => s
  },
  ZOOM: 5,
  CENTER: [-2, 55],
  PHOTO_FIELDS : {
    description: {
      component : TitleTextField,
      name: 'description',
      title: 'Description',
      type: enums.TYPES.string,
      placeholder: 'eg. whatever',
      regexValidation: '^\\w+( \\w+)*$'
    },
    notes: {
      component : TitleTextField,
      inputProps: { min: 0, step: 1},
      name: 'notes',
      title: 'Notes',
      type: enums.TYPES.number,
      placeholder: 'eg. 1',
      regexValidation: '^[0-9]+'
    },
    // categories: {
    //   component: SelectControlWrapper,
    //   name: 'categories',
    //   placeholder: 'Search photo categories',
    //   data: data,
    //   noOptionsMessage: 'No more categories',
    //   // regexValidation: '.*'
    // },
    multicategories: {
      component: MultiFields,
      name: 'multicategories',
      inputProps: { min: 0, step: 1},
      type: enums.TYPES.number,

      placeholder: 'Add photo categories',
      data: data,
      noOptionsMessage: 'No more categories',
      leafKey: 'leafKey',

      subfields: {
        pieces: {
          component : TitleTextField,
          inputProps: { min: 0, step: 1},
          name: 'number',
          title: 'Number',
          type: enums.TYPES.number,
          placeholder: 'eg. 1',
          regexValidation: '^[0-9]+'
        },
        brand: {
          component : TitleTextField,
          name: 'brand',
          title: 'Brand',
          type: enums.TYPES.string,
          placeholder: 'eg. whatever',
          regexValidation: '^\\w+( \\w+)*$'
        },
      }
    },
    // categories2: {
    //   component: SelectControlNumbered,
    //   name: 'categories2',
    //
    //   inputProps: { min: 0, step: 1},
    //   type: enums.TYPES.number,
    //
    //   placeholder: 'Search multiple photo categories',
    //   data: data,
    //   noOptionsMessage: 'No more categories',
    // },
    // categories3: {
    //   component: MultipleSelectControlNumbered,
    //   name: 'categories3',
    //
    //   inputProps: { min: 0, step: 1},
    //   type: enums.TYPES.number,
    //
    //   placeholder: 'Search multiple photo categories',
    //   data: data,
    //   noOptionsMessage: 'No more categories',
    // },
    // categories4: {
    //   component: MultipleSelectControlTextFields,
    //   name: 'categories4',
    //
    //   inputProps: { min: 0, step: 1},
    //   type: enums.TYPES.number,
    //
    //   placeholder: 'Search multiple photo categories',
    //   data: data,
    //   noOptionsMessage: 'No more categories',
    // },
  },
  // PHOTO_FIELD: {
  //   name: 'pieces',
  //   title: 'Number of pieces collected',
  //   type: enums.TYPES.number,
  //   placeholder: 'eg. 123',
  //   inputProps: { min: 0, step: 1},
  //   regexValidation: '^[0-9]+'
  // },
  PAGES,
  CUSTOM_PAGES:[],
  customiseString,
  getStats
}
