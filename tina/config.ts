import { defineConfig } from "tinacms";

// Content model for the site. Editors manage everything below through the
// Tina admin UI (/admin). Changes commit to this repo -> Cloudflare rebuilds.
//
// Branch resolution: Workers Builds sets WORKERS_CI_BRANCH; Pages sets
// CF_PAGES_BRANCH. Reading both lets preview deploys edit the right branch.
const branch =
  process.env.WORKERS_CI_BRANCH || process.env.CF_PAGES_BRANCH || "main";

export default defineConfig({
  branch,
  clientId: process.env.PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "dist",
    publicFolder: "public",
  },
  media: {
    tina: { publicFolder: "public", mediaRoot: "uploads" },
  },
  schema: {
    collections: [
      {
        name: "config",
        label: "Site Config",
        path: "src/content/config",
        format: "md",
        fields: [
          {
            type: "string",
            name: "name",
            label: "Site Name",
            required: true,
          },
          {
            type: "string",
            name: "title",
            label: "Default Page Title",
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Default Description",
            required: true,
            ui: { component: "textarea" },
          },
          {
            type: "object",
            name: "navLinks",
            label: "Navigation Links",
            list: true,
            fields: [
              { type: "string", name: "label", required: true },
              { type: "string", name: "href", required: true },
            ],
          },
          {
            type: "object",
            name: "socialLinks",
            label: "Social Links",
            list: true,
            fields: [
              { type: "string", name: "label", required: true },
              { type: "string", name: "href", required: true },
            ],
          },
        ],
      },
      {
        name: "pages",
        label: "Pages",
        path: "src/content/pages",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Page Title",
            required: true,
          },
          {
            type: "object",
            name: "blocks",
            label: "Page Blocks",
            list: true,
            ui: {
              // @ts-expect-error - Tina's itemProps item type is loose at runtime
              itemProps: (item: any) => ({ label: item?.block || "Block" }),
            },
            templates: [
              {
                name: "hero",
                label: "Hero",
                fields: [
                  { type: "string", name: "eyebrow" },
                  { type: "string", name: "heading", required: true },
                  {
                    type: "string",
                    name: "lead",
                    ui: { component: "textarea" },
                  },
                  { type: "string", name: "ctaLabel" },
                  { type: "string", name: "ctaHref" },
                ],
              },
              {
                name: "callout",
                label: "Callout",
                fields: [
                  { type: "string", name: "label" },
                  {
                    type: "string",
                    name: "text",
                    required: true,
                    ui: { component: "textarea" },
                  },
                ],
              },
              {
                name: "content",
                label: "Rich Content",
                fields: [
                  {
                    type: "rich-text",
                    name: "body",
                    label: "Body",
                    required: true,
                  },
                ],
              },
              {
                name: "faq",
                label: "FAQ",
                fields: [
                  {
                    type: "string",
                    name: "sectionHeading",
                    label: "Section Heading",
                  },
                  {
                    type: "object",
                    name: "items",
                    label: "Questions & Answers",
                    list: true,
                    fields: [
                      {
                        type: "string",
                        name: "question",
                        label: "Question",
                        required: true,
                      },
                      {
                        type: "string",
                        name: "answer",
                        label: "Answer",
                        required: true,
                        ui: { component: "textarea" },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
