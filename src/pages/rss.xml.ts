import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { allPosts } from "@utils/getCollection";
import { parse as htmlParser } from "node-html-parser";
import { getImage } from "astro:assets";

import type { AstroGlobal } from "astro";
import type { RSSFeedItem } from "@astrojs/rss";
const markdownParser = new MarkdownIt();

// get dynamic import of images as a map collection
const imagesGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/content/posts/_images/**/*.{jpeg,jpg,png,gif}", // add more image formats if needed
);

export async function GET(context: AstroGlobal) {
  if (!context.site) {
    throw Error("site not set");
  }

  const feed: RSSFeedItem[] = [];

  for (const post of allPosts) {
    // convert markdown to html string
    const body = markdownParser.render(post.body);
    // convert html string to DOM-like structure
    const html = htmlParser.parse(body);
    // hold all img tags in variable images
    const images = html.querySelectorAll("img");

    for (const img of images) {
      const src = img.getAttribute("src")!;

      // Relative paths that are optimized by Astro build
      if (src.startsWith("./")) {
        // remove prefix of `./`
        const prefixRemoved = src.replace("./", "");
        // create prefix absolute path from root dir
        const imagePathPrefix = `/src/content/posts/${prefixRemoved}`;

        // call the dynamic import and return the module
        const imagePath = await imagesGlob[imagePathPrefix]?.()?.then(
          (res) => res.default,
        );

        if (imagePath) {
          const optimizedImg = await getImage({ src: imagePath });
          // set the correct path to the optimized image
          img.setAttribute(
            "src",
            context.site + optimizedImg.src.replace("/", ""),
          );
        }
      } else if (src.startsWith("/images")) {
        // images starting with `/images` is the public dir
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
      // sanitize the new html string with corrected image paths
      content: sanitizeHtml(html.toString(), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
      customData: `<media:content
      medium="image"
      url="${post.data.image.url}" />
  `,
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
      media: "http://search.yahoo.com/mrss/",
    },
    customData: [
      "<language>en-us</language>",
      `<atom:link href="${new URL("rss.xml", context.site)}" rel="self" type="application/rss+xml" />`,
    ].join(""),
    trailingSlash: false,
  });
}
