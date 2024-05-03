import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { allPosts } from "@utils/getCollection";
import { parse as htmlParser } from "node-html-parser";

import type { AstroGlobal } from "astro";
import type { RSSFeedItem } from "@astrojs/rss";
const markdownParser = new MarkdownIt();

const imagesGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/content/posts/_images/**/*.{jpeg,jpg,png,gif}",
);

export async function GET(context: AstroGlobal) {
  if (!context.site) {
    throw Error("site not set");
  }

  const feed: RSSFeedItem[] = [];

  for (const post of allPosts) {
    const body = markdownParser.render(post.body);
    const html = htmlParser.parse(body);
    const images = html.querySelectorAll("img");

    for (const img of images) {
      const src = img.getAttribute("src")!;

      // Relative paths will be optimized by Astro build
      if (src.startsWith("./")) {
        const prefixRemoved = src.replace("./", "");
        const imagePrefix = `/src/content/posts/${prefixRemoved}`;
        const imagePath = await imagesGlob[imagePrefix]?.()?.then(
          (res) => res.default,
        );

        if (imagePath) {
          img.setAttribute(
            "src",
            context.site + imagePath.src.replace("/", ""),
          );
        }
      } else if (src.startsWith("/images")) {
        // images starting with `/images/` is the public dir
        img.setAttribute("src", context.site + src.replace("/", ""));
      } else {
        throw Error("src unknown");
      }
    }

    feed.push({
      title: post.data.title,
      description: post.data.description,
      author: `${post.data.author.email} (${post.data.author.name})`,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: `/posts/${post.slug}`,
      content: sanitizeHtml(html.toString(), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
    });
  }

  return rss({
    title: "Billy Le | Blog",
    description:
      "My creative outlet is a reflection of the experiences I've encountered—whether in learning, facing setbacks, or achieving success—as a software developer.",
    site: context.site,
    items: feed,
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
