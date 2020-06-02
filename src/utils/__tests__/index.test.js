import { sortArrayByObjectKey } from "../";

describe("sortArrayByObjectKey", () => {
  it("sorts strings into alphabetical order", () => {
    const unsortedFirst = { label: "b" };
    const unsortedSecond = { label: "a" };
    const array = [unsortedFirst, unsortedSecond];

    const sorted = sortArrayByObjectKey(array, "label");

    expect(sorted[0]).toEqual(unsortedSecond);
    expect(sorted[1]).toEqual(unsortedFirst);
  });

  it("sorts numbers into ascending order", () => {
    const unsortedFirst = { label: 16 };
    const unsortedSecond = { label: 18 };
    const unsortedThird = { label: 14 };
    const array = [unsortedFirst, unsortedSecond, unsortedThird];

    const sorted = sortArrayByObjectKey(array, "label");

    expect(sorted[0]).toEqual(unsortedThird);
    expect(sorted[1]).toEqual(unsortedFirst);
    expect(sorted[2]).toEqual(unsortedSecond);
  });
});
