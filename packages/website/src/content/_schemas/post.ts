import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

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
  "android",
  "node",
  "bun",
  "astro",
  "startup",
  "docker",
  "flutter",
  "case study",
] as const;

const postSchema = z.object({
  title: z.string(),
  pubDate: z.date(),
  lastModifiedDate: z.date().nullable(),
  description: z.string().min(200),
  author: z
    .object({
      name: z.string(),
      email: z.email(),
    })
    .default({
      name: "Billy Le",
      email: "hi@billyle.dev",
    }),
  image: z.object({
    url: z.url(),
    alt: z.string(),
    className: z.string().optional(),
  }),
  tags: z.array(z.enum(validTags)).nonempty(),
  draft: z.boolean(),
});

export const postsCollection = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/posts" }),
  schema: postSchema,
});

export type Post = z.infer<typeof postSchema> & {
  readingTime: string;
};
