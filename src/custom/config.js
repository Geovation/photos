import React from "react";

import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import SchoolIcon from "@material-ui/icons/School";
import DashboardIcon from "@material-ui/icons/Dashboard";
import HelpIcon from "@material-ui/icons/Help";
import FeedbackIcon from "@material-ui/icons/Feedback";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";

import _ from "lodash";

import styles from "./config.scss";
import enums from "../types/enums";

import TitleTextField from "../components/pages/PhotoPage/AdminApproval/TitleTextField";
import MultiFields from "../components/pages/PhotoPage/AdminApproval/MultiFields";

import { data } from "./categories";
import { CUSTOM_STRING } from "./strings.js";

const primaryColor = styles.primary;
const secondaryColor = styles.secondary;

const PAGES = {
  map: {
    path: "/",
    label: "Map",
  },
  embeddable: {
    path: "/embeddable",
    label: "Map",
  },
  photos: {
    path: "/photo",
    label: "Photo",
  },
  moderator: {
    path: "/moderator",
    label: "Photo Approval",
    icon: <CheckCircleIcon />,
    visible: (user, online) => user && user.isModerator,
  },
  account: {
    path: "/account",
    label: "Account",
    icon: <AccountCircleIcon />,
    visible: (user, online) => user,
  },
  about: {
    path: "/about",
    label: "About",
    visible: (user, online) => true,
    icon: <HelpIcon />,
  },
  tutorial: {
    path: "/tutorial",
    label: "Tutorial",
    visible: (user, online) => true,
    icon: <SchoolIcon />,
  },
  writeFeedback: {
    path: "/write-feedback",
    label: "Feedback",
    visible: (user, online) => true,
    icon: <FeedbackIcon />,
  },
  leaderboard: {
    path: "/leaderboard",
    label: "Leaderboard",
    visible: (user, online) => true,
    icon: <DashboardIcon />,
  },
  feedbackReports: {
    path: "/feedback-reports",
    label: "Feedback Reports",
    icon: <LibraryBooksIcon />,
    visible: (user, online) => user && user.isModerator,
  },
  feedbackDetails: {
    path: "/feedback-details",
    label: "Feedback Details",
  },
  displayPhoto: {
    path: "/photos",
    label: "photos",
  },
};

const getStats = (geojson, dbStats) => {
  return (dbStats && dbStats.published) || 0;
};

const STATIC_CONFIG = require("./config.json");

export default {
  ...STATIC_CONFIG,
  CUSTOM_STRING,
  MAX_IMAGE_SIZE: 2048,
  THEME: {
    palette: {
      primary: { main: primaryColor },
      secondary: { main: secondaryColor },
    },
    spacing: 10,
  },
  MAP_SOURCE:
    "https://s3-eu-west-1.amazonaws.com/tiles.os.uk/styles/open-zoomstack-outdoor/style.json",
  MAP_ATTRIBUTION:
    "Contains OS data &copy; Crown copyright and database rights 2018",
  MAPBOX_TOKEN:
    "pk.eyJ1Ijoic2ViYXN0aWFub3ZpZGVnZW92YXRpb251ayIsImEiOiJjanA4ZWwwbTkxdDNxM2twZTgyMGdqOXB5In0.MrWFt3rABCo7n7MBbVRaNw",
  PHOTO_ZOOMED_FIELDS: {
    updated: (s) => new Date(s).toDateString(),
    description: (s) => s,
    notes: (s) => s,
  },
  ZOOM: 5,
  ZOOM_FLYTO: 15,
  CENTER: [-2, 55],
  PHOTO_FIELDS: {
    description: {
      component: TitleTextField,
      name: "description",
      title: "Description",
      type: enums.TYPES.string,
      placeholder: "eg. whatever",
      regexValidation: "^([ ]*\\w+[ ]*)+$",
    },
    number: {
      component: TitleTextField,
      inputProps: { min: 0, step: 1 },
      name: "number",
      title: "Number",
      type: enums.TYPES.number,
      placeholder: "eg. 1",
      regexValidation: "^[0-9]+",
    },
    multicategories: {
      component: MultiFields.MultiFieldsWithStyles,
      nakedComponent: MultiFields.MultiFieldsOriginal,
      name: "multicategories",
      placeholder: "Add photo categories",
      data: data,
      noOptionsMessage: "No more categories",
      sanitize: (value) => {
        _.forEach(value, (category) => {
          category.brand =
            category.brand.replace &&
            category.brand.replace(/\s+/g, " ").trim();
        });
        return value;
      },

      subfields: {
        pieces: {
          component: TitleTextField,
          inputProps: { min: 0, step: 1 },
          name: "number",
          title: "Number",
          type: enums.TYPES.number,
          placeholder: "eg. 1",
          regexValidation: "^[0-9]+",
        },
        brand: {
          component: TitleTextField,
          name: "brand",
          title: "Brand",
          type: enums.TYPES.string,
          placeholder: "eg. whatever",
          regexValidation: ".+",
        },
      },
    },
  },
  PAGES,
  CUSTOM_PAGES: [],
  getStats,
  ENABLE_GRAVATAR_PROFILES: true, //To update user-profile from Gravatar, value: true or false.
  SECURITY: {
    UPLOAD_REQUIRES_LOGIN: true,
  },
  MODERATING_PHOTOS: 15,
  LEADERBOARD_FIELD: {
    label: "Uploads",
    field: "uploaded",
    displayedUsers: 20,
  },
};
