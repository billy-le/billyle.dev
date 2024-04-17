import fs from "node:fs/promises";

import type { RemarkPlugins } from "astro";

export const remarkLastDateModified: RemarkPlugins[number] = function () {
  return async function (_, file) {
    const data = await fs.stat(file.path);
    // @ts-ignore
    file.data.astro.frontmatter.lastDateModified = data.mtime;
  };
};
