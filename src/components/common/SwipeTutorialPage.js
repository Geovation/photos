import React, { useRef, useState } from "react";
import ReactSwipe from "react-swipe";

import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import PageWrapper from "components/PageWrapper";
import NavDots from "components/common/NavDots";

const swipeConfig = { continuous: false, widthOfSiblingSlidePreview: 0 };

const useStyles = makeStyles({
  card: {
    border: "none !important",
  },
  cardContent: {
    color: "rgba(0, 0, 0, 0.54)",
    textAlign: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: "8px",
    margin: "50px 10px",
    padding: "15px",
    boxShadow: "0 0 8px #cccccc",
  },
});

const TutorialPage = ({ steps, handleClose, label, hasLogo }) => {
  const reactSwipeEl = useRef();
  const [navDotActiveIndex, setNavDotActiveIndex] = useState(0);

  const handleNavdotClick = (index) => {
    setNavDotActiveIndex(index);
    reactSwipeEl.current && reactSwipeEl.current.slide(index);
  };

  const onSwipe = (index) => {
    setNavDotActiveIndex(index);
  };

  const classes = useStyles();
  return (
    <PageWrapper label={label} handleClose={handleClose} hasLogo={hasLogo}>
      <ReactSwipe
        swipeOptions={{
          ...swipeConfig,
          callback: onSwipe,
          startSlide: navDotActiveIndex,
        }}
        ref={(el) => (reactSwipeEl.current = el)}
      >
        {Object.values(steps).map((value, index) => (
          <div key={index}>
            <Card variant="outlined" classes={{ root: classes.card }}>
              <CardContent classes={{ root: classes.cardContent }}>
                {value.topImg && <div>{value.topImg}</div>}
                {value.title && <h3>{value.title}</h3>}
                {value.topText && <p>{value.topText}</p>}
                {value.img && <div>{value.img}</div>}
                {value.bottomText && <p>{value.bottomText}</p>}
              </CardContent>
            </Card>
          </div>
        ))}
      </ReactSwipe>
      <NavDots
        numberOfDots={Object.values(steps).length}
        onClick={handleNavdotClick}
        activeIndex={navDotActiveIndex}
      />
    </PageWrapper>
  );
};

export default React.memo(TutorialPage);
