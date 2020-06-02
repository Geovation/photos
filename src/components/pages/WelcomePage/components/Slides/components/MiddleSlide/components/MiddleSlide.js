import React from "react";

import "./MiddleSlide.scss";

const MiddleSlide = ({ topText, imgSrc, bottomText }) => (
  <div className="MiddleSlide__container">
    <p className="MiddleSlide__topText"> {topText}</p>
    <img src={imgSrc} alt="" className="MiddleSlide__image" />
    <p className="MiddleSlide__bottomText">{bottomText}</p>
  </div>
);

export default MiddleSlide;
