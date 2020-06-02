import React, { useRef, useState } from "react";
import ReactSwipe from "react-swipe";

import utils from "../../../../../../utils";

import NavDots from "components/common/NavDots";

import { FirstSlide, MiddleSlide, FinalSlide } from "../../Slides";

import "./WelcomePage.scss";

const globalResearchSlideProps = {
  topText: utils.customiseString("welcome", "Global research"),
  imgSrc: utils.customiseString("welcome", "chart.png"),
  bottomText: utils.customiseString(
    "welcome",
    "Data you collect helps develop solutions for a better world"
  ),
};

const seeItSnapItSlideProps = {
  topText: utils.customiseString("welcome", "Be part of the solution"),
  imgSrc: utils.customiseString("welcome", "croud.png"),
  bottomText: utils.customiseString(
    "welcome",
    "Photograph and document - it is simple"
  ),
};

const carouselStyle = {
  wrapper: { height: "100vh", display: "flex" },
};

// TODO: in a separate PR clean up duplicate logic betweedn here and the tutorial
// Give slides better names, include counter slide

const WelcomePage = ({ handleClose }) => {
  const reactSwipeEl = useRef();
  const [navDotActiveIndex, setNavDotActiveIndex] = useState(0);

  const handleNavdotClick = (index) => {
    setNavDotActiveIndex(index);
    reactSwipeEl.current && reactSwipeEl.current.slide(index);
  };

  const onSwipe = (index) => {
    setNavDotActiveIndex(index);
  };

  return (
    <div className="WelcomePage__container">
      <ReactSwipe
        style={{ ...carouselStyle }}
        ref={(el) => (reactSwipeEl.current = el)}
        swipeOptions={{
          startSlide: navDotActiveIndex,
          callback: onSwipe,
          continuous: false,
          widthOfSiblingSlidePreview: 0,
        }}
      >
        <FirstSlide />
        <MiddleSlide {...globalResearchSlideProps} />
        <MiddleSlide {...seeItSnapItSlideProps} />
        <FinalSlide onButtonClick={handleClose} />
      </ReactSwipe>
      <NavDots
        numberOfDots={4}
        wrapperClass="WelcomePage__navDotsWrapper"
        navDotActiveClass="WelcomePage__navDotActive"
        navDotClass="WelcomePage__navDot"
        activeIndex={navDotActiveIndex}
        onClick={handleNavdotClick}
      />
    </div>
  );
};

export default WelcomePage;
