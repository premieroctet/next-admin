const SUPPORTED_IMG_EXTENSIONS = [
  "apng",
  "avif",
  "png",
  "gif",
  "jpg",
  "jpeg",
  "jfif",
  "pjpeg",
  "pjp",
  "png",
  "svg",
  "webp",
  "bmp",
  "ico",
  "cur",
  "tif",
  "tiff",
];

/**
 * Check if the url is a base64 url
 */
export function isBase64Url(url: string) {
  return url.startsWith("data:");
}

/*
 * Get the filename and extension from a file url, does not work with base64 urls.
 */
export function getFilenameAndExtensionFromUrl(url: string) {
  const cleanUrl = url.split("?")[0].split("#")[0];
  const fullFilename = cleanUrl.split("/").pop();
  if (!fullFilename) {
    return {
      fileName: undefined,
      extension: undefined,
    };
  }
  const [_, extension] = fullFilename.split(".");

  return {
    fileName: fullFilename,
    extension,
  };
}

/**
 * Check if the url points to a file of type image
 */
export function isImageType(url: string) {
  if (isBase64Url(url)) {
    return url.split(":")[1].split(";")[0].includes("image");
  } else {
    const { extension } = getFilenameAndExtensionFromUrl(url);
    if (!!extension) {
      return SUPPORTED_IMG_EXTENSIONS.includes(extension.toLocaleLowerCase());
    } else {
      return false;
    }
  }
}

/**
 * Get the filename from a file url
 */
export function getFilenameFromUrl(url: string) {
  if (isBase64Url(url)) {
    return undefined;
  } else {
    const { fileName } = getFilenameAndExtensionFromUrl(url);
    return fileName;
  }
}
