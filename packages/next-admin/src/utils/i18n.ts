export const extractTranslations = async (getMessages?: () => Promise<Record<string, string>>) => {
  if (getMessages) {
    const messages = await getMessages();
    const dottedProperty = {} as any;
    const dot = (obj: object, prefix = "") => {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === "object") {
          dot(value, `${prefix}${key}.`);
        } else {
          dottedProperty[`${prefix}${key}`] = value;
        }
      });
    };
    dot(messages as object);
    return dottedProperty;
  }

  return {};
};
