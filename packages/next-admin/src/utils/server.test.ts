import {
  getParamsFromUrl,
  getResourceFromParams,
  getResourceFromUrl,
  getResourceIdFromParam,
  getResourceIdFromUrl,
} from "./server";

describe("Server utils", () => {
  describe("getResourceFromUrl", () => {
    it("should return a resource with /admin/User", () => {
      expect(getResourceFromUrl("/admin/User", ["User"])).toEqual("User");
    });

    it("should return a resource with /admin/User/1", () => {
      expect(getResourceFromUrl("/admin/User/1", ["User"])).toEqual("User");
    });

    it("should not return a resource with /admin/Post", () => {
      expect(getResourceFromUrl("/admin/Post", ["User"])).toEqual(undefined);
    });
  });

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
      expect(getResourceFromParams(["Post"], ["User"])).toEqual(undefined);
    });
  });

  describe("getResourceIdFromUrl", () => {
    it("should get the id from /admin/User/1", () => {
      expect(getResourceIdFromUrl("/admin/User/1", "User")).toEqual(1);
    });

    it("should not return an id from /admin/User/new", () => {
      expect(getResourceIdFromUrl("/admin/User/new", "User")).toEqual(
        undefined
      );
    });

    it("should not return an id from /admin/Dummy/--__", () => {
      expect(getResourceIdFromUrl("/admin/Dummy/--__", "User")).toEqual(
        undefined
      );
    });
  });

  describe("getResourceIdFromParam", () => {
    it("should get the id from /admin/User/1", () => {
      expect(getResourceIdFromParam("1", "User")).toEqual(1);
    });

    it("should not return an id from /admin/User/new", () => {
      expect(getResourceIdFromParam("new", "User")).toEqual(undefined);
    });

    it("should not return an id from /admin/Dummy/--__", () => {
      expect(getResourceIdFromParam("--__", "User")).toEqual(undefined);
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
});
