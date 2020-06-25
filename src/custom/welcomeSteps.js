import React from "react";

import utils from "utils";

export default [
  {

    // Landing page

    topImg: (
      <img 
      src={utils.customiseString("welcome", "logo.svg")} 
      alt="logo"
      />
    ),

    img: (
      <img
        src={utils.customiseString("welcome", "badge.png")}
        width="200px"
        alt="badge"

      />
    ),    
    bottomText: utils.customiseString(
      "welcome",
      "We predict bushfires"
    ),
  },
  {

    // Second Page

    img: (
      <img
        src={utils.customiseString("welcome", "home.svg")}
        width="200px"
        alt=""
      />
    ),
    bottomText: utils.customiseString(
      "welcome",
      "Protect you community"
    ),
  },
  {
    // Third page

    img: (
      <img
        src={utils.customiseString("welcome", "tree.svg")}
        width="200px"
        alt=""
      />
    ),
    bottomText: utils.customiseString("welcome",
      "Upload photos of vegetation"
    ),
  },
  {

    // Forth page

    img: (
    <img
      src={utils.customiseString("welcome", "map.svg")}
      width="200px"
      alt="map"
    />
    ),
    bottomText: utils.customiseString("welcome", 
      "Map bushfire risk together"
    ),
  },
];
