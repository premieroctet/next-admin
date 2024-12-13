import {
  getParamsFromUrl,
  getResourceFromParams,
  getResourceIdFromParam,
} from "./server";

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
