# Contract: FAQ Block

**Feature**: `001-faq-block` | **Date**: 2026-10-03

This template project exposes no HTTP APIs; its contracts are the Tina content schema, the renderer dispatch, the stored frontmatter shape, and the emitted HTML. All four MUST stay in sync (constitution §II).

## 1. Tina schema contract (`tina/config.ts`)

Template appended to the `pages` collection's `blocks` templates list:

```ts
{
  name: "faq",
  label: "FAQ",
  fields: [
    // NOTE: the heading field is named `sectionHeading` (not `heading`)
    // because the existing hero template already declares a REQUIRED
    // `heading: String!`, and Tina's generated `frags.gql` selects both in
    // one scope — same name with different nullability fails codegen
    // validation ("Fields heading conflict ... String! and String").
    { type: "string", name: "sectionHeading", label: "Section Heading" },
    {
      type: "object",
      name: "items",
      label: "Questions & Answers",
      list: true,
      fields: [
        { type: "string", name: "question", label: "Question", required: true },
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
```

Rules: field names (`sectionHeading`, `items`, `question`, `answer`) are stable identifiers — renaming any of them requires updating the component, sample content, and regenerated client together. `question`/`answer` stay `required`; `items` stays non-required (empty-safe).

## 2. Renderer contract (`src/pages/index.astro`)

```astro
import Faq from "../components/blocks/Faq.astro";
// inside page.blocks?.map, in list position:
if (block.__typename === "PagesBlocksFaq") return <Faq block={block} />;
```

`__typename` value `PagesBlocksFaq` is confirmed against the regenerated client (`tina/__generated__/`). A missing branch renders `null` — that is a contract violation, not an acceptable fallback.

## 3. Stored-content contract (`src/content/pages/*.md`)

```yaml
blocks:
  - _template: faq
    sectionHeading: "Frequently asked questions"   # optional; omit or leave empty for no heading
    items:
      - question: "What is this site?"
        answer: "A template for content-managed Astro sites."
      - question: "How do I edit content?"
        answer: "Open /admin in your browser."
```

An empty block is `items: []` (or omitted `items`) — valid content that MUST render as nothing (section omitted entirely).

Fifth sync point (found during implementation): `src/content.config.ts` — the Astro content-collection schema's `pages.blocks` `_template` enum MUST also list `"faq"`, otherwise `npm run check` rejects FAQ content (`Invalid enum value ... received 'faq'`).

## 4. Rendered-HTML contract (`Faq.astro` output)

Populated block:

```html
<section class="faq" data-tina-field="...">
  <h2 data-tina-field="...">Frequently asked questions</h2>  <!-- only when heading non-empty -->
  <details class="faq-item">
    <summary>What is this site?</summary>
    <div class="faq-answer">A template for content-managed Astro sites.</div>
  </details>
  <!-- one <details> per item, in editor order -->
</section>
```

Empty block: **no element emitted** (component returns nothing), so surrounding layout is byte-identical to a page without the block. All interpolated text is Astro-escaped; no `set:html` is used anywhere in this contract.
