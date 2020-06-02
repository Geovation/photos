import React, { useRef, useState } from "react";
import ReactSwipe from "react-swipe";

import NavDots from "components/common/NavDots";

import chart from "assets/images/intro/chart.PNG";
import seeItSnapItMapIt from "assets/images/intro/seeItSnapItMapIt.PNG";

import { FirstSlide, MiddleSlide, FinalSlide } from "../../Slides";

import "./WelcomePage.scss";

const globalResearchSlideProps = {
  topText: "Global research",
  imgSrc: chart,
  bottomText:
    "Data you collect helps develop solutions to stop pollution at the source"
};

const seeItSnapItSlideProps = {
  topText: "Be part of the solution",
  imgSrc: seeItSnapItMapIt,
  bottomText: "Photograph and document rubbish you find - it's simple"
};

const carouselStyle = {
  wrapper: { height: "100vh", display: "flex" }
};

// TODO: in a separate PR clean up duplicate logic betweedn here and the tutorial
// Give slides better names, include counter slide

const WelcomePage = ({ handleClose }) => {
  const reactSwipeEl = useRef();
  const [navDotActiveIndex, setNavDotActiveIndex] = useState(0);

  const handleNavdotClick = index => {
    setNavDotActiveIndex(index);
    reactSwipeEl.current && reactSwipeEl.current.slide(index);
  };

  const onSwipe = index => {
    setNavDotActiveIndex(index);
  };

  return (
    <div className="WelcomePage__container">
      <ReactSwipe
        style={{ ...carouselStyle }}
        ref={el => (reactSwipeEl.current = el)}
        swipeOptions={{
          startSlide: navDotActiveIndex,
          callback: onSwipe,
          continuous: false,
          widthOfSiblingSlidePreview: 0
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
