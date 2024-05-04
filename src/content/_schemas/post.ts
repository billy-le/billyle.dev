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
  "android",
  "node",
  "bun",
  "astro",
  "startup",
  "docker",
];

const postSchema = z.object({
  title: z.string(),
  pubDate: z.date(),
  description: z.string().min(200),
  author: z
    .object({
      name: z.string(),
      email: z.string().email(),
    })
    .default({
      name: "Billy Le",
      email: "hi@billyle.dev",
    }),
  image: z.object({
    url: z.string(),
    alt: z.string(),
    className: z.string().optional(),
  }),
  tags: z
    .array(
      z.string().refine(
        (tag) => validTags.includes(tag),
        (tag) => ({
          message: `'${tag}' is not a valid tag.\nAllowed tags are [ ${validTags.join(", ")} ]\nYou can add more tags in ${import.meta.filename}`,
        }),
      ),
    )
    .nonempty(),
  draft: z.boolean(),
});

export const postsCollection = defineCollection({
  type: "content",
  schema: postSchema,
});

export type Post = z.infer<typeof postSchema> & {
  readingTime: string;
  lastDateModified: string;
};
