import React from "react";

import LocationOn from "@material-ui/icons/LocationOn";
import CameraAlt from "@material-ui/icons/CameraAlt";
import CloudUpload from "@material-ui/icons/CloudUpload";

export const tutorialSteps = {
  1: {
    photo: <CameraAlt />,
    text: "Get outside and photograph rubbish"
  },
  2: {
    photo: <CloudUpload />,
    text: "Categorise the rubbish by amount, type and brand"
  },
  3: {
    photo: <LocationOn />,
    text: "Upload your photograph and see how you’ve helped fight the crisis"
  }
};
