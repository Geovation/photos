import React from "react";

import utils from "utils";

export default [
  {
    topImg: <img src={utils.customiseString("welcome", "logo.svg")} alt="" />,

    img: (
      <img
        src={utils.customiseString("welcome", "badge.png")}
        width="200px"
        alt=""
      />
    )
  },
  {
    title: utils.customiseString("welcome", "Global research"),
    img: (
      <img
        src={utils.customiseString("welcome", "chart.png")}
        width="200px"
        alt=""
      />
    ),
    bottomText: utils.customiseString(
      "welcome",
      "Data you collect helps develop solutions for a better world"
    ),
  },
  {
    title: utils.customiseString("welcome", "Be part of the solution"),
    img: (
      <img
        src={utils.customiseString("welcome", "croud.png")}
        width="200px"
        alt=""
      />
    ),
    bottomText: utils.customiseString(
      "welcome",
      "Photograph and document - it is simple"
    ),
  },
  {
    title: utils.customiseString("welcome", "Ready to make your mark?"),
    img: utils.customiseString("welcome", "camera_icon"),
    bottomText: utils.customiseString("welcome", "Get started"),
  },
];
