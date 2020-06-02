import React, { useState, useEffect } from "react";
import classnames from "classnames";

import FieldLabel from "./FieldLabel";

import "./FieldLabelWithInput.scss";

const FieldLabelWithInput = ({
  validationFn,
  value,
  setValue,
  placeholder,
  ...fieldLabelProps
}) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof validationFn === "function") {
      setError(!validationFn(value));
    }
  }, [value, validationFn]);

  return (
    <FieldLabel {...fieldLabelProps}>
      <input
        placeholder={placeholder}
        className={classnames("FieldLabelWithInput", {
          FieldLabelWithInput__Error: error
        })}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </FieldLabel>
  );
};

export default FieldLabelWithInput;
