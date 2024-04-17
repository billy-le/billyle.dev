import { getCollection } from "astro:content";

export const allPosts = await getCollection("posts", ({ data }) => {
  return import.meta.env.PROD ? data.draft !== true : true;
});

export const allProjects = await getCollection("projects");
