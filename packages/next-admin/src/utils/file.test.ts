import {
  getFilenameAndExtensionFromUrl,
  getFilenameFromUrl,
  isBase64Url,
  isImageType,
} from "./file";

describe("File utils", () => {
  describe("isBase64Url", () => {
    const base64Data =
      "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=";
    it("should return true for full base64 url", () => {
      expect(isBase64Url(`data:image/png;base64,${base64Data}`)).toBeTruthy();
    });

    it("should return false for website urls ", () => {
      expect(isBase64Url("https://example.com/image.png")).toBeFalsy();
    });

    it("should return false for relative urls", () => {
      expect(isBase64Url("/image.png")).toBeFalsy();
    });

    it("should return false for empty strings", () => {
      expect(isBase64Url("")).toBeFalsy();
    });

    it("should return false for base64 strings without prefix", () => {
      expect(isBase64Url(base64Data)).toBeFalsy();
    });
  });

  describe("isImageType", () => {
    it("should return true for image urls", () => {
      expect(isImageType("https://example.com/image.png")).toBeTruthy();
    });

    it("should return true for image urls with query parameters", () => {
      expect(
        isImageType("https://example.com/image.jpg?width=100&height=100")
      ).toBeTruthy();
    });

    it("should return true for base64 image urls", () => {
      expect(
        isImageType(
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
        )
      ).toBeTruthy();
    });

    it("should return false for non-image urls", () => {
      expect(isImageType("https://example.com/document.pdf")).toBeFalsy();
    });

    it("should return false for urls without extensions", () => {
      expect(isImageType("https://example.com/no-extension")).toBeFalsy();
    });

    it("should return false for empty strings", () => {
      expect(isImageType("")).toBeFalsy();
    });

    it("should return true for image urls with uppercase extensions", () => {
      expect(isImageType("https://example.com/image.PNG")).toBeTruthy();
    });

    it("should return true for image urls with anchor tags", () => {
      expect(isImageType("https://example.com/image.png#anchor")).toBeTruthy();
    });
  });

  describe("getFilenameAndExtensionFromUrl", () => {
    it("should return filename and extension for a simple url", () => {
      expect(
        getFilenameAndExtensionFromUrl("https://example.com/image.jpg")
      ).toEqual({
        fileName: "image.jpg",
        extension: "jpg",
      });
    });

    it("should handle urls with query parameters", () => {
      expect(
        getFilenameAndExtensionFromUrl(
          "https://example.com/document.pdf?version=1"
        )
      ).toEqual({
        fileName: "document.pdf",
        extension: "pdf",
      });
    });

    it("should handle urls with hash", () => {
      expect(
        getFilenameAndExtensionFromUrl("https://example.com/page.html#section1")
      ).toEqual({
        fileName: "page.html",
        extension: "html",
      });
    });

    it("should return undefined for urls without filename", () => {
      expect(getFilenameAndExtensionFromUrl("https://example.com/")).toEqual({
        fileName: undefined,
        extension: undefined,
      });
    });
  });

  describe("getFilenameFromUrl", () => {
    it("should return filename for a simple url", () => {
      expect(getFilenameFromUrl("https://example.com/image.jpg")).toBe(
        "image.jpg"
      );
    });

    it("should handle urls with query parameters", () => {
      expect(
        getFilenameFromUrl("https://example.com/document.pdf?version=1")
      ).toBe("document.pdf");
    });

    it("should return undefined for base64 urls", () => {
      expect(
        getFilenameFromUrl(
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
        )
      ).toBeUndefined();
    });

    it("should return undefined for urls without filename", () => {
      expect(getFilenameFromUrl("https://example.com/")).toBeUndefined();
    });
  });
});
