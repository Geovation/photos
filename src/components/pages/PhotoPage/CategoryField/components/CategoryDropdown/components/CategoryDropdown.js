import React, { useRef } from "react";
import Select, { components } from "react-select";

import MenuItem from "@material-ui/core/MenuItem";

import { data } from "custom/categories";

import FieldLabel from "../FieldLabel";

import { customFilterOption, getDropdownOptions } from "../utils";
import "./CategoryDropdown.scss";

function Control(props) {
  return <components.Control {...props} className="Dropdown__control" />;
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Menu(props) {
  return <components.Menu {...props} className="Dropdown__menu" />;
}

function NoOptionsMessage(props) {
  return <p className={"Dropdown__noOptionsMessage"}>{props.children}</p>;
}

function Placeholder(props) {
  return (
    <p className={"Dropdown__placeHolder"} {...props.innerProps}>
      {props.children}
    </p>
  );
}

function ValueContainer(props) {
  return <div className="Dropdown__valueContainer">{props.children}</div>;
}

function DropdownIndicator(props) {
  return null;
}

function IndicatorSeparator(props) {
  return null;
}

function ClearIndicator(props) {
  return null;
}

const customComponents = {
  Control,
  Option,
  Menu,
  NoOptionsMessage,
  Placeholder,
  ValueContainer,
  DropdownIndicator,
  IndicatorSeparator,
  ClearIndicator
};

const FieldLabelWithDropdowns = ({
  placeholder,
  value,
  setValue,
  ...fieldLabelProps
}) => {
  const dropdownOptionsRef = useRef(getDropdownOptions(data));

  return (
    <FieldLabel {...fieldLabelProps}>
      <Select
        components={customComponents}
        placeholder={placeholder}
        options={dropdownOptionsRef.current}
        filterOption={customFilterOption}
        onChange={value => setValue(value)}
        value={value}
        isClearable
      />
    </FieldLabel>
  );
};

export default FieldLabelWithDropdowns;
