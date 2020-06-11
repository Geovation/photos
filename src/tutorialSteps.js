import React from "react";

import LocationOn from "@material-ui/icons/LocationOn";
import CameraAlt from "@material-ui/icons/CameraAlt";
import CloudUpload from "@material-ui/icons/CloudUpload";

import utils from "utils";

export const tutorialSteps = {
  1: {
    photo: <CameraAlt />,
    text: utils.customiseString(
      "tutorial",
      "Walk around the city and take photos"
    ),
  },
  2: {
    photo: <CloudUpload />,
    text: utils.customiseString(
      "tutorial",
      "Write info about the photos and upload it to the cloud"
    ),
  },
  3: {
    photo: <LocationOn />,
    text: utils.customiseString(
      "tutorial",
      "View your images in our interactive map"
    ),
  },
};
