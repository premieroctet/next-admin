const SUPPORTED_IMG_EXTENSIONS = [
  ".apng",
  ".avif",
  ".png",
  ".gif",
  ".jpg",
  ".jpeg",
  ".jfif",
  ".pjpeg",
  ".pjp",
  ".png",
  ".svg",
  ".webp",
  ".bmp",
  ".ico",
  ".cur",
  ".tif",
  ".tiff",
];

export function isBase64Url(url: string) {
  return url.startsWith("data:");
}

export function getFilenameAndExtensionFromUrl(url: string) {
  const regex = /([\w-]+)(\.[\w-]+)+(?!.*\/)/gm;
  const match = regex.exec(url);
  if (match && match.length > 2) {
    return {
      fileName: `${match[1]}${match[2]}`,
      extension: match[2],
    };
  } else {
    return {
      fileName: undefined,
      extension: undefined,
    };
  }
}

export function isImageType(url: string) {
  if (isBase64Url(url)) {
    return url.split(":")[1].split(";")[0].includes("image");
  } else {
    const { extension } = getFilenameAndExtensionFromUrl(url);
    if (!!extension) {
      return SUPPORTED_IMG_EXTENSIONS.includes(extension);
    } else {
      return false;
    }
  }
}

export function getFilenameFromUrl(url: string) {
  if (isBase64Url(url)) {
    return undefined;
  } else {
    const { fileName } = getFilenameAndExtensionFromUrl(url);
    return fileName;
  }
}
