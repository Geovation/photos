import React from "react";

import "./FirstSlide.scss";
import utils from "../../../../../../../../utils";

const FirstSlide = () => (
  <div className="FirstSlide__container">
    <img
      src={utils.customiseString("welcome", "logo.png")}
      className="FirstSlide__logo"
      alt=""
    />
    <p className="FirstSlide__welcomeText">
      {utils.customiseString(
        "welcome",
        "Welcome to the global movement to take photos around the planet"
      )}
    </p>
    <img
      src={utils.customiseString("welcome", "globe.png")}
      className="FirstSlide__globe"
      alt=""
    ></img>
    <p className="FirstSlide__bottomText">
      {utils.customiseString("welcome", "photos on the map")}
    </p>
  </div>
);

export default FirstSlide;
