import { extractSerializable } from "../utils/tools";

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
    expect(extractSerializable(obj)).toEqual({});
  });
  it("should return the object with empty arrays and objects", () => {
    const obj = { a: [], b: {} };
    expect(extractSerializable(obj)).toEqual({ a: [], b: {} });
  });
  it("should return the objet with null and undefined values", () => {
    const obj = { a: null, b: undefined };
    expect(extractSerializable(obj)).toEqual({ a: null, b: undefined });
  });
});
