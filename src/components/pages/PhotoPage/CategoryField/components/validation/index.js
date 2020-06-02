export const validateString = value => value && value.trim().length > 0;

export const validateIsPositiveNumber = value =>
  Number.isInteger(Number(value)) && Number(value) > 0;
