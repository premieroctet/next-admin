import { extractSerializable, formatLabel } from "../utils/tools";

describe("extractSerializable", () => {
  it("should return the object with all the nested objects and arrays serialized", () => {
    const obj = [1, 2, 3, { a: 1, b: 2, c: [1, 2, 3] }];
    expect(extractSerializable(obj)).toEqual([
      1,
      2,
      3,
      { a: 1, b: 2, c: [1, 2, 3] },
    ]);
  });
  it("should return the object with all the nested objects and arrays serialized", () => {
    const obj = { a: 1, b: 2, c: [1, 2, 3], d: { e: 1, f: 2, g: [1, 2, 3] } };
    expect(extractSerializable(obj)).toEqual({
      a: 1,
      b: 2,
      c: [1, 2, 3],
      d: { e: 1, f: 2, g: [1, 2, 3] },
    });
  });
  it("should return the object without function properties", () => {
    const obj = { f: () => {} };
    expect(extractSerializable(obj)).toEqual({
      f: null,
    });
  });
  it("should return the object with empty arrays and objects", () => {
    const obj = { a: [], b: {} };
    expect(extractSerializable(obj)).toEqual({ a: [], b: {} });
  });
  it("should return the objet with null and undefined values", () => {
    const obj = { a: null, b: undefined };
    expect(extractSerializable(obj)).toEqual({ a: null, b: null });
  });
});

describe("formatLabel", () => {
  it("should handle snake case", () => {
    const label = "created_at";
    expect(formatLabel(label)).toBe("Created at");
  });

  it("should handle camel case", () => {
    const label = "createdAt";
    expect(formatLabel(label)).toBe("Created at");
  });

  it("should handle pascal case", () => {
    const label = "CreatedAt";
    expect(formatLabel(label)).toBe("Created at");
  });

  it("should return the label capitalized", () => {
    const label = "content";
    expect(formatLabel(label)).toBe("Content");
  });
});
