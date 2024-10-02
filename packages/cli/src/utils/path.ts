import path from "path";

export const getRelativePath = (from: string, to: string) => {
  return path.join(
    path.relative(path.dirname(from), path.dirname(to)),
    path.basename(to)
  );
};
