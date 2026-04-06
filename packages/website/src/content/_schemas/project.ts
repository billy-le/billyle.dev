import { defineCollection } from "astro:content";
import type { ImageFunction } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const project = ({ image }: { image: ImageFunction }) => {
  return z.object({
    name: z.string(),
    description: z.string(),
    link: z.url().nullable(),
    images: z
      .array(
        z.object({
          src: image(),
          alt: z.string(),
        }),
      )
      .optional()
      .default([]),
    sourceCode: z.array(z.object({ link: z.url(), host: z.string() })),
    tags: z.array(z.string()).default([]),
    ranking: z
      .string()
      .refine(
        (value) => ["high", "mid", "low"].includes(value),
        'ranking must be one of ["high", "mid", "low"]',
      ),
  });
};

export const projectCollections = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/projects" }),
  schema: project,
});

export type Project = z.infer<ReturnType<typeof project>>;
