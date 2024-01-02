export const queryPath = (
  path: string,
  query: { name: string; value: string }
): string =>
  path.includes("?")
    ? `${path}&${query.name}=${query.value}`
    : `${path}?${query.name}=${query.value}`;

export const urlBuilder = (
  basePath: string,
  query: Record<string, string>
): string => {
  let path = basePath;
  for (const key in query)
    path = queryPath(path, { name: key, value: query[key] });

  return path;
};

export const base64ToBlob = (
  base64: string,
  filename: string
): { file: Blob; filename: string; type: string } | null => {
  const match = base64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) return null;

  const [, type, imgStr] = match;

  return {
    file: new Blob([Buffer.from(imgStr, "base64")], { type }),
    type,
    filename: `${filename}.${type.split("/")[1]}`,
  };
};
