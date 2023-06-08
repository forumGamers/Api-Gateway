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
