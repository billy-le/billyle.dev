declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"posts": {
"adding-github-pull-request-preview-deployments-with-coolify.md": {
	id: "adding-github-pull-request-preview-deployments-with-coolify.md";
  slug: "adding-github-pull-request-preview-deployments-with-coolify";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"adding-rss-feed-content-and-fixing-markdown-image-paths-in-astro.md": {
	id: "adding-rss-feed-content-and-fixing-markdown-image-paths-in-astro.md";
  slug: "adding-rss-feed-content-and-fixing-markdown-image-paths-in-astro";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"catching-up-with-artificial-intelligence-and-life.md": {
	id: "catching-up-with-artificial-intelligence-and-life.md";
  slug: "catching-up-with-artificial-intelligence-and-life";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"common-errors-for-new-flutter-developers-tips-and-fixes.md": {
	id: "common-errors-for-new-flutter-developers-tips-and-fixes.md";
  slug: "common-errors-for-new-flutter-developers-tips-and-fixes";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"configure-a-contact-form-email-server-with-resend-for-your-website.md": {
	id: "configure-a-contact-form-email-server-with-resend-for-your-website.md";
  slug: "configure-a-contact-form-email-server-with-resend-for-your-website";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"creating-custom-table-of-contents-for-astro-content-collections.md": {
	id: "creating-custom-table-of-contents-for-astro-content-collections.md";
  slug: "creating-custom-table-of-contents-for-astro-content-collections";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"diving-head-first-into-the-startup-unknowns.md": {
	id: "diving-head-first-into-the-startup-unknowns.md";
  slug: "diving-head-first-into-the-startup-unknowns";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"enabling-developer-mode-on-ios-17_3_1.md": {
	id: "enabling-developer-mode-on-ios-17_3_1.md";
  slug: "enabling-developer-mode-on-ios-17_3_1";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"fix-missing-404-pages-for-coolify-static-site-deployments.md": {
	id: "fix-missing-404-pages-for-coolify-static-site-deployments.md";
  slug: "fix-missing-404-pages-for-coolify-static-site-deployments";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"highlight-table-of-content-items-using-intersection-observer.md": {
	id: "highlight-table-of-content-items-using-intersection-observer.md";
  slug: "highlight-table-of-content-items-using-intersection-observer";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"how-docker-breathes-new-life-into-my-workflow.md": {
	id: "how-docker-breathes-new-life-into-my-workflow.md";
  slug: "how-docker-breathes-new-life-into-my-workflow";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"keep-astro-content-collection-types-in-sync-on-git-commit.md": {
	id: "keep-astro-content-collection-types-in-sync-on-git-commit.md";
  slug: "keep-astro-content-collection-types-in-sync-on-git-commit";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"my-content-creation-in-its-infancy.md": {
	id: "my-content-creation-in-its-infancy.md";
  slug: "my-content-creation-in-its-infancy";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"registering-for-apple-and-google-developer-accounts.md": {
	id: "registering-for-apple-and-google-developer-accounts.md";
  slug: "registering-for-apple-and-google-developer-accounts";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"self-hosting-your-website-with-coolify-v4-a-step-by-step-guide.md": {
	id: "self-hosting-your-website-with-coolify-v4-a-step-by-step-guide.md";
  slug: "self-hosting-your-website-with-coolify-v4-a-step-by-step-guide";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"use-husky-and-node-to-unstage-draft-posts-from-git.md": {
	id: "use-husky-and-node-to-unstage-draft-posts-from-git.md";
  slug: "use-husky-and-node-to-unstage-draft-posts-from-git";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		"_schemas": {
};
"projects": {
"clearbank": {
	id: "clearbank";
  collection: "projects";
  data: InferEntrySchema<"projects">
};
"converse": {
	id: "converse";
  collection: "projects";
  data: InferEntrySchema<"projects">
};
"eventlulu": {
	id: "eventlulu";
  collection: "projects";
  data: InferEntrySchema<"projects">
};
"soil-life": {
	id: "soil-life";
  collection: "projects";
  data: InferEntrySchema<"projects">
};
};

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../src/content/config.js");
}
