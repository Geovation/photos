import React from "react";
import Button from "@material-ui/core/Button";

import handPrint from "assets/images/intro/handPrint.PNG";

import "./FinalSlide.scss";

const FinalSlide = ({ onButtonClick }) => {
  return (
    <div className="FinalSlide__container">
      <div className="FinalSlide__title">Ready to make your mark?</div>
      <img src={handPrint} className="FinalSlide__image" alt="" />
      <Button className="FinalSlide__button" onClick={onButtonClick}>
        Get started
      </Button>
    </div>
  );
};

export default FinalSlide;
