import React from "react";

import LocationOn from "@material-ui/icons/LocationOn";
import CameraAlt from "@material-ui/icons/CameraAlt";
import CloudUpload from "@material-ui/icons/CloudUpload";
import Icon from "@material-ui/core/Icon";

import utils from "utils";

export default {
  1: {
    topImg: (
      <img
        src={utils.customiseString("welcome", "logo.svg")}
        width="200px"
        alt=""
      />
    ),
    title: utils.customiseString(
      "welcome",
      "Welcome to the global movement to take photos around the planet"
    ),
    img: (
      <img
        src={utils.customiseString("welcome", "globe.png")}
        width="200px"
        alt=""
      />
    ),
    bottomText: utils.customiseString("welcome", "photos on the map"),
  },
  2: {
    topImg: <CloudUpload />,
    title: "title 2",
    topText: utils.customiseString(
      "tutorial",
      "Write info about the photos and upload it to the cloud"
    ),
  },
  3: {
    topImg: <LocationOn />,
    title: "title 3",
    topText: utils.customiseString(
      "tutorial",
      "View your images in our interactive map"
    ),
  },
  4: {
    topImg: <LocationOn />,
    title: "title 4",
    topText: utils.customiseString(
      "tutorial",
      "View your images in our interactive map"
    ),
  },
};
