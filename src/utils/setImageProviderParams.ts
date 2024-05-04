export function setImageProviderParams(
  url: string,
  providers: [string, Record<string, string | number>][],
) {
  const imageUrl = new URL(url);

  for (const [provider, queryParams] of providers) {
    if (imageUrl.host !== provider) continue;

    if (queryParams) {
      for (const [key, _] of [...imageUrl.searchParams]) {
        imageUrl.searchParams.delete(key);
      }

      Object.entries(queryParams).forEach(([key, value]) => {
        imageUrl.searchParams.set(key, value.toString());
      });
    }
  }

  return imageUrl.toString();
}
