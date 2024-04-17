import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";

import type { RemarkPlugins } from "astro";

export const remarkReadingTime: RemarkPlugins[number] = function () {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    // @ts-ignore
    data.astro.frontmatter.readingTime = readingTime.text;
  };
};
