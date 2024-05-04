import { getCollection } from "astro:content";
import { setImageProviderParams } from "./setImageProviderParams";

export const allPosts = await getCollection("posts", ({ data }) => {
  const queryParams = {
    w: 600,
    q: 50,
    fit: "crop",
    auto: "format",
    fm: "avif",
  };
  const imageUrl = setImageProviderParams(data.image.url, [
    [
      // https://unsplash.com/documentation#supported-parameters
      "images.unsplash.com",
      queryParams,
    ],
    ["images.pexels.com", queryParams],
  ]);

  data.image.url = imageUrl;

  return import.meta.env.PROD ? data.draft !== true : true;
});

export const allProjects = await getCollection("projects");
