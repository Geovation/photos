import React from "react";

import "./TutorialItem.scss";

const TutorialItem = ({ stepNumber, photo, text }) => (
  <div className="TutorialItem__container">
    <div className={"TutorialItem__photo"}>{photo}</div>
    <h3>Step {stepNumber}</h3>
    <p className={"TutorialItem__text"}>{text}</p>
  </div>
);

export default TutorialItem;
