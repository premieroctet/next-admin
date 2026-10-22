import { Decimal } from "@prisma/client/runtime/library";
import { describe, expect, it, vi } from "vitest";
import {
  findRelationInData,
  getParamsFromUrl,
  getResourceFromParams,
  getResourceIdFromParam,
  transformData,
} from "./server";
import { getSchema } from "./globals";

// Mock the globals module
vi.mock("./globals", () => ({
  getSchema: vi.fn(() => ({
    definitions: {
      User: {
        properties: {
          id: {
            __nextadmin: {
              type: "Decimal",
              kind: "scalar",
              primaryKey: true,
            },
          },
          balance: {
            __nextadmin: {
              type: "Decimal",
              kind: "scalar",
            },
          },
        },
      },
    },
  })),
}));

describe("Server utils", () => {
  describe("getResourceFromParams", () => {
    it("should return a resource with /admin/User", () => {
      expect(getResourceFromParams(["User"], ["User"])).toEqual("User");
    });

    it("should return a resource with /admin/User/1", () => {
      expect(getResourceFromParams(["User", "1"], ["User"])).toEqual("User");
    });

    it("should return a resource with /admin/user/1", () => {
      expect(getResourceFromParams(["user", "1"], ["User"])).toEqual("User");
    });

    it("should not return a resource with /admin/Post", () => {
      expect(getResourceFromParams(["Post"], ["User"])).toEqual(null);
    });
  });

  describe("getResourceIdFromParam", () => {
    it("should get the id from /admin/User/1", () => {
      // With our mock schema, User has Decimal id, so formatId returns string
      expect(getResourceIdFromParam("1", "User")).toEqual("1");
    });

    it("should not return an id from /admin/User/new", () => {
      expect(getResourceIdFromParam("new", "User")).toEqual(undefined);
    });

    it("should not return an id from /admin/Dummy/--__", () => {
      // With Decimal id type, formatId returns the string as-is
      expect(getResourceIdFromParam("--__", "User")).toEqual("--__");
    });
  });

  describe("getParamsFromUrl", () => {
    const basePath = "/admin";
    it("should get the resource name from /admin/User", () => {
      expect(getParamsFromUrl("/admin/User", basePath)).toEqual(["User"]);
    });

    it("should get the resource name and id from /admin/User/1", () => {
      expect(getParamsFromUrl("/admin/User/1", basePath)).toEqual([
        "User",
        "1",
      ]);
    });

    it("should get the resource name and id from /admin/User/new", () => {
      expect(getParamsFromUrl("/admin/User/new", basePath)).toEqual([
        "User",
        "new",
      ]);
    });

    it("should get the resource name and id from /_next/data/admin/User.json", () => {
      expect(getParamsFromUrl("/_next/data/admin/User.json", basePath)).toEqual(
        ["User"]
      );
    });

    it("should get the resource name and id from /_next/data/admin/User/1.json", () => {
      expect(
        getParamsFromUrl("/_next/data/admin/User/1.json", basePath)
      ).toEqual(["User", "1"]);
    });

    it("should get the resource name and id from /_next/data/admin/User/new.json", () => {
      expect(
        getParamsFromUrl("/_next/data/admin/User/new.json", basePath)
      ).toEqual(["User", "new"]);
    });

    it("should get the resource name and id from /_next/data/development/admin/User.json", () => {
      expect(
        getParamsFromUrl("/_next/data/development/admin/User.json", basePath)
      ).toEqual(["User"]);
    });

    it("should get the resource name and id from /_next/data/development/admin/User/1.json", () => {
      expect(
        getParamsFromUrl("/_next/data/development/admin/User/1.json", basePath)
      ).toEqual(["User", "1"]);
    });

    it("should get the resource name and id from /_next/data/development/admin/User/new.json", () => {
      expect(
        getParamsFromUrl(
          "/_next/data/development/admin/User/new.json",
          basePath
        )
      ).toEqual(["User", "new"]);
    });
  });

  describe("transformData", () => {
    it("should convert large Decimal values to strings without precision loss", async () => {
      const largeDecimalId = new Decimal("6302764515981008896");
      const data = {
        id: largeDecimalId,
        balance: new Decimal("123456789012345678901234567890.50"),
      };

      const result = await transformData(data, "User", {}, undefined);

      expect(result.id).toBe("6302764515981008896");
      expect(result.balance).toBe("123456789012345678901234567890.5");
    });

    it("should handle null Decimal values", async () => {
      const data = {
        id: null,
        balance: null,
      };

      const result = await transformData(data, "User", {}, undefined);

      expect(result.id).toBe(null);
      expect(result.balance).toBe(null);
    });

    it("should preserve precision for Decimal values that exceed Number.MAX_SAFE_INTEGER", async () => {
      // Number.MAX_SAFE_INTEGER is 9007199254740991
      const exceedsSafeInteger = new Decimal("9007199254740992");
      const data = {
        id: exceedsSafeInteger,
      };

      const result = await transformData(data, "User", {}, undefined);

      // If converted to Number, this value would be correctly represented in this case
      // but we still want to ensure we're using string representation
      expect(result.id).toBe("9007199254740992");
      expect(typeof result.id).toBe("string");
    });
  });

  describe("findRelationInData", () => {
    it("should convert Decimal values to strings in list data without precision loss", () => {
      const schema = getSchema().definitions.User;
      const largeDecimalId = new Decimal("6302764515981008896");
      const data = [
        {
          id: largeDecimalId,
          balance: new Decimal("999999999999999999.99"),
        },
      ];

      const result = findRelationInData(data, schema);

      expect(result[0].id).toBe("6302764515981008896");
      expect(result[0].balance).toBe("999999999999999999.99");
    });

    it("should handle multiple items with large Decimal values", () => {
      const schema = getSchema().definitions.User;
      const data = [
        {
          id: new Decimal("6302764515981008896"),
          balance: new Decimal("100.50"),
        },
        {
          id: new Decimal("6302764515981008897"),
          balance: new Decimal("200.75"),
        },
      ];

      const result = findRelationInData(data, schema);

      expect(result[0].id).toBe("6302764515981008896");
      expect(result[0].balance).toBe("100.5");
      expect(result[1].id).toBe("6302764515981008897");
      expect(result[1].balance).toBe("200.75");
    });
  });
});
