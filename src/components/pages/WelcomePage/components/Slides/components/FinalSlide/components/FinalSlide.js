import React from "react";
import Button from "@material-ui/core/Button";

import utils from "../../../../../../../../utils";

import "./FinalSlide.scss";

const FinalSlide = ({ onButtonClick }) => {
  return (
    <div className="FinalSlide__container">
      <div className="FinalSlide__title">
        {utils.customiseString("welcome", "Ready to make your mark?")}
      </div>
      {utils.customiseString("welcome", "camera_icon")}
      <Button className="FinalSlide__button" onClick={onButtonClick}>
        {utils.customiseString("welcome", "Get started")}
      </Button>
    </div>
  );
};

export default FinalSlide;
