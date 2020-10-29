import React from "react";

import LocationOn from "@material-ui/icons/LocationOn";
import CameraAlt from "@material-ui/icons/CameraAlt";
import CloudUpload from "@material-ui/icons/CloudUpload";

import utils from "utils";

const rtn = [
  {
    topImg: <CameraAlt />,
    title: "Step 1",
    topText: utils.customiseString(
      "tutorial",
      "Walk around the city and take photos"
    ),
  },
  {
    topImg: <CloudUpload />,
    title: "Step 2",
    topText: utils.customiseString(
      "tutorial",
      "Write info about the photos and upload it to the cloud"
    ),
  },
  {
    topImg: <LocationOn />,
    title: "Step 3",
    topText: utils.customiseString(
      "tutorial",
      "View your images in our interactive map"
    ),
  },
];

export default rtn;