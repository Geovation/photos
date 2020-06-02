import React, { useState, useCallback } from "react";
import classnames from "classnames";
import Button from "@material-ui/core/Button";

import useOnOutsideClick from "hooks/useOnOutsideClick";

import CategoryField from "../../CategoryField";
import { FieldLabelWithInput } from "../../CategoryField/components/CategoryDropdown/FieldLabel";
import { validateIsPositiveNumber } from "../../CategoryField/components/validation";

import "./Fields.scss";

const INITIAL_CATEGORY_VALUES = [{ keyIndex: 0, values: { error: false } }];

const Fields = ({ imgSrc, handleChange, handleTotalCountChange }) => {
  const [categoryValues, setCategoryValues] = useState(INITIAL_CATEGORY_VALUES);
  const [childIndex, setNextChildIndex] = useState(categoryValues.length);
  const [totalCount, setTotalCount] = useState(null);
  const [anyCategoryErrors, setAnyCategoryErrors] = useState(false);
  const [totalCountErrors, setTotalCountErrors] = useState(true);
  const [photoEnlarged, setPhotoEnlarged] = useState(false);

  const handleSetTotalCount = newTotalCount => {
    const countError = !validateIsPositiveNumber(newTotalCount);

    setTotalCount(newTotalCount);
    setTotalCountErrors(countError);
    handleTotalCountChange(countError || anyCategoryErrors, newTotalCount);
  };

  const handleClickAdd = categoryValues => {
    categoryValues.push({ keyIndex: childIndex, values: {} });
    setNextChildIndex(childIndex + 1);
    setCategoryValues(categoryValues);
    setAnyCategoryErrors(true);
    handleChange(true, categoryValues);
  };

  const handleCategoryChange = index => newValue => {
    let error = false;
    const updatedCategoryValues = categoryValues.map(categoryValue => {
      const { keyIndex } = categoryValue;

      if (newValue.error) error = true;

      if (index === keyIndex) {
        return { keyIndex, values: newValue };
      }

      return categoryValue;
    });

    setAnyCategoryErrors(error);
    handleChange(totalCountErrors || error, updatedCategoryValues);
    setCategoryValues(updatedCategoryValues);
  };

  const handleClickRemove = useCallback(
    index => e => {
      if (categoryValues.length <= 1) return;

      const filteredCategoryValues = categoryValues.filter(
        ({ keyIndex }) => index !== keyIndex
      );

      let anyErrors = false;
      filteredCategoryValues.forEach(({ values: { error } }) => {
        if (error) anyErrors = true;
      });

      setCategoryValues(filteredCategoryValues);
      setAnyCategoryErrors(anyErrors);
      handleChange(totalCountErrors || anyErrors, filteredCategoryValues);
    },
    [categoryValues, handleChange, totalCountErrors]
  );

  const imgRef = useOnOutsideClick(() => setPhotoEnlarged(false));

  return (
    <>
      <div className="Fields__container">
        <div className="Fields__pictureThumbnailContainer">
          <img
            src={imgSrc}
            alt={""}
            className={classnames("Fields__pictureThumbnail", {
              Fields__pictureThumbnailEnlarged: photoEnlarged
            })}
            ref={imgRef}
            onClick={() => setPhotoEnlarged(!photoEnlarged)}
          />
        </div>
        <FieldLabelWithInput
          label="Total number of pieces in photo:"
          placeholder="e.g. 0"
          value={totalCount}
          setValue={handleSetTotalCount}
          validationFn={validateIsPositiveNumber}
          className="Fields__numberOfPieces"
        />
      </div>
      <div className="Fields__instruction">
        Identify each piece of rubbish in the photo
      </div>
      {categoryValues.map(({ keyIndex }) => {
        return (
          <div key={keyIndex} className="Fields__category">
            <CategoryField
              handleClickRemove={handleClickRemove(keyIndex)}
              handleChange={handleCategoryChange(keyIndex)}
            />
          </div>
        );
      })}
      <div className="Fields__button">
        <Button
          disabled={anyCategoryErrors}
          fullWidth
          variant="outlined"
          onClick={() => handleClickAdd(categoryValues)}
        >
          add another category
        </Button>
      </div>
    </>
  );
};

export default Fields;
