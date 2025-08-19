import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/blog" }),
  schema: () =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      excerpt: z.string()
    })
});

const essays = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/essays" }),
  schema: () =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date(),
      excerpt: z.string()
    })
});

const info = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/info" }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date()
    })
});

export const collections = { blog, essays, info };
