//@flow

import * as React from "react";
import classNames from "classnames";

import "./NavDots.scss";

const NavDots = props => {
  const {
    numberOfDots,
    activeIndex,
    onClick,
    wrapperClass,
    navDotClass,
    navDotActiveClass
  } = props;

  return (
    <div className={classNames("NavDots", wrapperClass)}>
      {Array(numberOfDots)
        .fill()
        .map((_, index) => (
          <NavDot
            key={index}
            id={index}
            active={index === activeIndex}
            onClick={onClick}
            navDotClass={navDotClass}
            navDotActiveClass={navDotActiveClass}
          />
        ))}
    </div>
  );
};

const NavDot = ({ id, active, onClick, navDotActiveClass, navDotClass }) => {
  const handleClick = () => onClick && onClick(id);

  return (
    <div
      className={classNames("NavDot", navDotClass, {
        "NavDot--clickable": onClick,
        [navDotActiveClass]: active
      })}
      onClick={handleClick}
    >
      <div
        className={classNames("NavDot__inner", {
          [navDotActiveClass || "NavDot__inner--active"]: active
        })}
      />
    </div>
  );
};

export default NavDots;
