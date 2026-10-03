import { defineCollection, z } from "astro:content";

// Content collections. Tina manages the Markdown inside these folders via the
// admin UI; these schemas keep Astro's content layer typed and explicit
// (avoids the deprecated auto-generation warning).

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    blocks: z
      .array(
        z.object({
          _template: z.enum(["hero", "callout", "content", "faq"]),
        }),
      )
      .optional(),
  }),
});

const config = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    navLinks: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .optional(),
    socialLinks: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .optional(),
  }),
});

export const collections = { pages, config };
