import { Decimal } from "@prisma/client/runtime/library";
import { describe, expect, it } from "vitest";
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
  it("should convert BigInt values to strings to preserve precision", () => {
    const largeBigInt = BigInt("6302764515981008896");
    const obj = { id: largeBigInt, count: BigInt(123) };
    expect(extractSerializable(obj)).toEqual({
      id: "6302764515981008896",
      count: "123",
    });
  });
  it("should convert Prisma Decimal values to strings to preserve precision", () => {
    const largeDecimal = new Decimal("6302764515981008896");
    const smallDecimal = new Decimal("5.25");
    const obj = { id: largeDecimal, rate: smallDecimal };
    expect(extractSerializable(obj)).toEqual({
      id: "6302764515981008896",
      rate: "5.25",
    });
  });
  it("should handle nested objects with BigInt and Decimal values", () => {
    const obj = {
      user: {
        id: BigInt("9223372036854775807"),
        balance: new Decimal("1234567890.123456789"),
      },
      items: [
        { id: BigInt(1), price: new Decimal("99.99") },
        { id: BigInt(2), price: new Decimal("149.99") },
      ],
    };
    expect(extractSerializable(obj)).toEqual({
      user: {
        id: "9223372036854775807",
        balance: "1234567890.123456789",
      },
      items: [
        { id: "1", price: "99.99" },
        { id: "2", price: "149.99" },
      ],
    });
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
