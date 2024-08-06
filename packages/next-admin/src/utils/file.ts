export function isImageMimeType(mimeType: string) {
  if (mimeType.startsWith("image")) {
    return true;
  } else if (
    [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "webp",
      "svg",
      "ico",
      "tiff",
      "tif",
    ].includes(mimeType)
  ) {
    return true;
  } else {
    return false;
  }
}

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
      fileName: "",
      extension: "",
    };
  }
}

export function getMimeTypeFromUrl(url: string) {
  if (isBase64Url(url)) {
    return url.split(":")[1].split(";")[0];
  } else {
    const { extension } = getFilenameAndExtensionFromUrl(url);
    if (!!extension) {
      return extension.replace(".", "");
    } else {
      return undefined;
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
