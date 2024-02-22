import { z, defineCollection } from "astro:content";

const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string().min(200),
    author: z.string().default("Billy Le"),
    image: z.object({
      url: z.string(),
      alt: z.string(),
      className: z.string().optional(),
    }),
    tags: z.array(z.string()).nonempty(),
    draft: z.boolean(),
  }),
});

export const collections = {
  posts: postsCollection,
};
