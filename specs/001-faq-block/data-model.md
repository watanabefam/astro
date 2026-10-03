# Data Model: FAQ Block

**Feature**: `001-faq-block` | **Date**: 2026-10-03

Persistence: page frontmatter in `src/content/pages/*.md` (`format: "md"`), inside the existing `blocks:` list. No new collections, no migrations; existing pages without FAQ blocks load unchanged.

## Entity: FAQ block

A page section holding an optional heading plus an ordered list of FAQ items. Sits alongside Hero, Callout, and Content entries in the page's `blocks` list, discriminated by `_template: faq` in content and `__typename: "PagesBlocksFaq"` at runtime.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `sectionHeading` | string | No | Section label (e.g. "Frequently asked questions"). Absent/empty → no `<h2>` rendered, no empty space. (Named `sectionHeading`, not `heading`: the hero template's required `heading` collides with an optional same-named field in Tina codegen — see contracts/faq-block.md.) |
| `items` | FAQ item[] (ordered) | No (list itself optional) | Editor-defined order is significant and preserved exactly. No upper limit (≥20 supported). Absent or empty → block renders nothing. |

## Entity: FAQ item

One question paired with one answer. Order within `items` is significant.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `question` | string (short, single-line input) | **Yes** | A pair missing a question MUST NOT be saveable (FR-003). Special characters/unicode stored verbatim, rendered escaped. |
| `answer` | string (plain text, multiline textarea, Callout pattern) | **Yes** | A pair missing an answer MUST NOT be saveable (FR-003). Plain text only — no bold/links/lists in v1. Line breaks preserved via `white-space: pre-line`. |

## Relationships

- `Page 1—* FAQ block`: a page holds zero or more FAQ blocks interleaved with other block types in one ordered `blocks` list.
- `FAQ block 0—* FAQ item`: items belong to exactly one block; no cross-page reuse or references in v1.
- No relations to `config` collection, navigation, or media.

## State transitions

No lifecycle states. The only order-sensitive operation is editor reorder (drag/add/remove in the Tina list UI), which rewrites the `items` array in place; the renderer maps the array in stored order, so what is saved is what renders. Empty ↔ populated transitions are both valid and render-safe.

## Validation summary (from requirements)

- FR-003: item requires both `question` and `answer` (schema `required: true` on both subfields; admin blocks save otherwise).
- FR-005: `heading` optional; renderer omits the heading element when empty.
- FR-008: `items` optional/empty-safe; renderer emits no section element when there are no items.
- FR-002: no `maxLength`/cap on the list; 20-pair pages verified in the `/admin` round-trip.
