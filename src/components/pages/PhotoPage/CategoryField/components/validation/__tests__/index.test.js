import { validateString, validateIsPositiveNumber } from "../";

describe("Categories validation", () => {
  describe("validateString", () => {
    it("returns true if a valid string is passed to it", () => {
      const string = "a valid string";
      expect(validateString(string)).toEqual(true);
    });

    it("allows punctuation", () => {
      const stringWithPunctuation = "!?,.'\"\\/:;";
      expect(validateString(stringWithPunctuation)).toEqual(true);
    });
  });

  describe("validateIsPositiveNumber", () => {
    it("returns true if passed a positive number", () => {
      expect(validateIsPositiveNumber(1)).toEqual(true);
    });

    it("returns true if passed a positive number as a string", () => {
      expect(validateIsPositiveNumber("1000")).toEqual(true);
    });

    it("returns false if passed a negative number", () => {
      expect(validateIsPositiveNumber(-1)).toEqual(false);
    });

    it("returns false if passed a string containing letters", () => {
      expect(validateIsPositiveNumber("string 100")).toEqual(false);
    });

    it("returns false if passed zero", () => {
      expect(validateIsPositiveNumber(0)).toEqual(false);
    });
  });
});
