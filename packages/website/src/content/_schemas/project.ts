import { z, defineCollection } from "astro:content";

const project = z.object({
  name: z.string(),
  description: z.string(),
  link: z.string().url(),
  images: z
    .array(
      z.object({
        src: z.string(),
        alt: z.string(),
      }),
    )
    .optional()
    .default([]),
  sourceCode: z.array(z.object({ link: z.string().url(), host: z.string() })),
  tags: z.array(z.string()).default([]),
});

export const projectCollections = defineCollection({
  type: "data",
  schema: project,
});

export type Project = z.infer<typeof project>;
