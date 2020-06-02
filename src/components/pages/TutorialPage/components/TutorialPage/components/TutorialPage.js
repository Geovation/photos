import React, { useRef, useState } from "react";
import ReactSwipe from "react-swipe";

import PageWrapper from "components/PageWrapper";
import NavDots from "components/common/NavDots";
import TutorialItem from "../../TutorialItem";
import { tutorialSteps } from "../static";
import "./TutorialPage.scss";

const swipeConfig = { continuous: false, widthOfSiblingSlidePreview: 15 };

const TutorialPage = ({ handleClose, label }) => {
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
    <PageWrapper label={label} handleClose={handleClose} hasLogo>
      <ReactSwipe
        swipeOptions={{
          ...swipeConfig,
          callback: onSwipe,
          startSlide: navDotActiveIndex
        }}
        ref={el => (reactSwipeEl.current = el)}
      >
        {Object.values(tutorialSteps).map((value, index) => (
          <div key={index}>
            <TutorialItem
              stepNumber={index + 1}
              text={value.text}
              photo={value.photo}
            />
          </div>
        ))}
      </ReactSwipe>
      <NavDots
        numberOfDots={Object.values(tutorialSteps).length}
        onClick={handleNavdotClick}
        activeIndex={navDotActiveIndex}
      />
    </PageWrapper>
  );
};

export default React.memo(TutorialPage);
