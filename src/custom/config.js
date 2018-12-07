import authFirebase from './authFirebase'
import LoginFirebase from "./components/LoginFirebase";
import dbFirebase from "./dbFirebase";
import AnonymousPage from "./components/AnonymousPage";
import SignedinPage from "./components/SignedinPage";
import ModeratorPage from "../components/ModeratorPage";
import EverybodyPage from "./components/EverybodyPage";

import styles from './config.scss';
const primaryColor = styles.primary;
const secondaryColor = styles.secondary;

export default {
  uploadPhoto: dbFirebase.uploadPhoto,
  loginComponent: LoginFirebase,
  authModule: authFirebase,
  dbModule: dbFirebase,
  AnonymousPage: AnonymousPage,
  SignedinPage: SignedinPage,
  ModeratorPage: ModeratorPage,
  EverybodyPage: EverybodyPage,
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
  MAPBOX_TOKEN: "pk.eyJ1Ijoic2ViYXN0aWFub3ZpZGVnZW92YXRpb251ayIsImEiOiJjanA4ZWwwbTkxdDNxM2twZTgyMGdqOXB5In0.MrWFt3rABCo7n7MBbVRaNw"
}
