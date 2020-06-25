import React from "react";

import CameraRearTwoToneIcon from "@material-ui/icons/CameraRearTwoTone";
import welcome_logo_svg from "custom/assets/images/logo.svg";
import welcome_badge_png from "custom/assets/images/badge.png";
import welcome_globe_png from "custom/assets/images/globe.png";
import welcome_chart_png from "custom/assets/images/chart.png";
import welcome_croud_png from "custom/assets/images/croud.png";

export const CUSTOM_STRING = {
  drawer: {
    "photos published so far!": "photos published so far!",
  },
  tutorial: {
    "Walk around the city and take photos":
      "Walk around the city and take photos",
    "Write info about the photos and upload it to the cloud":
      "Write info about the photos and upload it to the cloud",
    "View your images in our interactive map":
      "View your images in our interactive map",
  },
  about: {
    "We are Geovation and we Geovate":
      "Backed by years of industry experience and a network that reaches far and wide, we are a community of location-data and proptech collaborators looking to make positive change happen.\n\nSince its inception in 2009 Geovation has become a leading proponent of the value of open innovation in the public sector. After opening its first space in summer 2015, Geovation has grown to support a community of more than 1,200 entrepreneurs, investors, developers, academics, students and corporate innovators.\n\nOur accelerators provide startups up to £20,000 in grant funding, access to data, experienced product development capabilities, geospatial expertise from Ordnance Survey and land and property insight from HM Land Registry, as well as business mentorship and coaching to help prepare for presenting to investors from the wider team and our partners. To date, our accelerator has supported 79 technology start-ups, and we’ve seen nearly £20M raised in investment funding.",
  },
  writeFeedback: {
    "admin@geovation.uk": "it@geovation.uk",
  },
  termsAndConditions: {
    "Welcome to App": "Welcome to PHOTOS",
    "Please read our ": "Please read our ",
    "Terms and Conditions": "Terms and Conditions ",
    " and ": " and ",
    "Privacy Policy": "Privacy Policy ",
    "T&C link": " https://geovation.uk/terms-conditions/",
    "Privacy Policy Link": "https://geovation.uk/privacy-policy/",
  },
  tweetMessage: "Check out this #photo ",
  welcome: {
    "logo.svg": welcome_logo_svg,
    "badge.png": welcome_badge_png,
    "globe.png": welcome_globe_png,
    "chart.png": welcome_chart_png,
    "croud.png": welcome_croud_png,
    camera_icon: (
      <CameraRearTwoToneIcon style={{ fontSize: 200, margin: 40 }} />
    ),
  },
};
