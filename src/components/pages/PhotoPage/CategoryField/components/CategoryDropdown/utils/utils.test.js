import { customFilterOption, labelWordContainsInputWord } from ".";

describe("categoryDropdown/utils", () => {
  describe("customFilterOption", () => {
    it("returns true if there is no user input", () => {
      const option = {
        label: "ring"
      };
      expect(customFilterOption(option, "")).toEqual(true);
    });

    it("returns false if there's no label (and there is user input)", () => {
      expect(customFilterOption({}, "input")).toEqual(false);
    });

    it("real app test case", () => {
      const option = {
        label: "4/6 pack plastic rings"
      };
      expect(customFilterOption(option, "ring")).toEqual(true);
    });
  });

  describe("labelWordContainsInputWord", () => {
    it("returns true if the input is the same as the label", () => {
      expect(labelWordContainsInputWord("the", "the")).toEqual(true);
    });

    it("returns false if the input is not contained in the label", () => {
      expect(labelWordContainsInputWord("the", "and")).toEqual(false);
    });

    it("returns true for a partial match of input word to label", () => {
      expect(labelWordContainsInputWord("the", "th")).toEqual(true);
    });

    it("returns false for the input word containing the label", () => {
      expect(labelWordContainsInputWord("th", "the")).toEqual(false);
    });
  });
});
