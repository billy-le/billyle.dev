import { z, defineCollection } from "astro:content";
import type { ImageFunction } from "astro:content";

const project = ({ image }: { image: ImageFunction }) => {
	return z.object({
		name: z.string(),
		description: z.string(),
		link: z.string().url().nullable(),
		images: z
			.array(
				z.object({
					src: image(),
					alt: z.string(),
				}),
			)
			.optional()
			.default([]),
		sourceCode: z.array(z.object({ link: z.string().url(), host: z.string() })),
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
	type: "data",
	schema: project,
});

export type Project = z.infer<ReturnType<typeof project>>;
