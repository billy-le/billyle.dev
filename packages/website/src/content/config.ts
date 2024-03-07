import { z, defineCollection } from "astro:content";

const validTags = [
  "blogging",
  "content creation",
  "devops",
  "golang",
  "javascript",
  "learn-along",
  "paas",
  "self-hosting",
  "tutorial",
  "mobile development",
  "iOS",
];

const postSchema = z.object({
  title: z.string(),
  pubDate: z.date(),
  description: z.string().min(200),
  author: z.string().default("Billy Le"),
  image: z.object({
    url: z.string(),
    alt: z.string(),
    className: z.string().optional(),
  }),
  tags: z
    .array(
      z.string().refine(
        (tag) => validTags.includes(tag),
        (tag) => ({ message: `'${tag}' is not a valid tag` }),
      ),
    )
    .nonempty(),
  draft: z.boolean(),
});

export type Post = z.infer<typeof postSchema>;

const postsCollection = defineCollection({
  type: "content",
  schema: postSchema,
});

export const collections = {
  posts: postsCollection,
};
