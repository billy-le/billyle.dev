import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { allPosts } from "@utils/getCollection";
import type { AstroGlobal } from "astro";

const parser = new MarkdownIt();

export function GET(context: AstroGlobal) {
  if (!context.site) {
    throw Error("site not set");
  }

  allPosts;

  return rss({
    title: "Billy Le | Blog",
    description:
      "My creative outlet is a reflection of the experiences I've encountered—whether in learning, facing setbacks, or achieving success—as a software developer.",
    site: context.site,
    items: allPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      author: `${post.data.author.email} (${post.data.author.name})`,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: `/posts/${post.slug}`,
    })),
    stylesheet: "/pretty-feed-v3.xsl",
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
    customData: [
      "<language>en-us</language>",
      `<atom:link href="${new URL("rss.xml", context.site)}" rel="self" type="application/rss+xml" />`,
    ].join(""),
    trailingSlash: false,
  });
}
