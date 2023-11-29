import {
  getResourceFromParams,
  getResourceFromUrl,
  getResourceIdFromParam,
  getResourceIdFromUrl,
} from "./server";

describe("Server utils", () => {
  describe("getResourceFromUrl", () => {
    it("should return a resource with /api/User", () => {
      expect(getResourceFromUrl("/api/User", ["User"])).toEqual("User");
    });

    it("should return a resource with /api/User/1", () => {
      expect(getResourceFromUrl("/api/User/1", ["User"])).toEqual("User");
    });

    it("should not return a resource with /api/Post", () => {
      expect(getResourceFromUrl("/api/Post", ["User"])).toEqual(undefined);
    });
  });

  describe("getResourceFromParams", () => {
    it("should return a resource with /api/User", () => {
      expect(getResourceFromParams(["User"], ["User"])).toEqual("User");
    });

    it("should return a resource with /api/User/1", () => {
      expect(getResourceFromParams(["User", "1"], ["User"])).toEqual("User");
    });

    it("should not return a resource with /api/Post", () => {
      expect(getResourceFromParams(["Post"], ["User"])).toEqual(undefined);
    });
  });

  describe("getResourceIdFromUrl", () => {
    it("should get the id from /api/User/1", () => {
      expect(getResourceIdFromUrl("/api/User/1", "User")).toEqual(1);
    });

    it("should not return an id from /api/User/new", () => {
      expect(getResourceIdFromUrl("/api/User/new", "User")).toEqual(undefined);
    });

    it("should not return an id from /api/Dummy/--__", () => {
      expect(getResourceIdFromUrl("/api/Dummy/--__", "User")).toEqual(
        undefined
      );
    });
  });

  describe("getResourceIdFromParam", () => {
    it("should get the id from /api/User/1", () => {
      expect(getResourceIdFromParam("1", "User")).toEqual(1);
    });

    it("should not return an id from /api/User/new", () => {
      expect(getResourceIdFromParam("new", "User")).toEqual(undefined);
    });

    it("should not return an id from /api/Dummy/--__", () => {
      expect(getResourceIdFromParam("--__", "User")).toEqual(NaN);
    });
  });
});
