import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // Résumé « En bref » affiché en tête d'article (pyramide inversée : problème puis solution).
    summary: z
      .array(z.object({ label: z.string(), text: z.string() }))
      .optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
