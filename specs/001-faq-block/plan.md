# Implementation Plan: FAQ Block

**Branch**: `001-faq-block` | **Date**: 2026-10-03 | **Spec**: `specs/001-faq-block/spec.md`

**Input**: Feature specification from `/specs/001-faq-block/spec.md` — "add a repeatable FAQ block (a list of question/answer pairs) as a fourth Tina block type alongside the existing Hero, Callout and Content blocks".

## Summary

Add a generic, reusable FAQ block to this Astro + Tina + Cloudflare Workers template. Editors add an FAQ section (optional heading + ordered list of required question/required answer pairs) anywhere page blocks are allowed; visitors see a readable, zero-JavaScript section rendered in place. Technically: one new Tina object template (`faq`) in `tina/config.ts`, one new server-rendered component (`src/components/blocks/Faq.astro`) using native `<details>/<summary>` disclosure, one new renderer branch in `src/pages/index.astro` (`PagesBlocksFaq`), regeneration of the Tina client (`npm run gen:tina`), and a generic sample FAQ in `src/content/pages/home.md`. No changes to Hero/Callout/Content, no new collections, no client JS, no secrets or config changes.

## Technical Context

**Language/Version**: TypeScript 5.8 + Astro 5.7 components (`.astro`), Node ≥ 22.12

**Primary Dependencies**: `astro`, `@astrojs/cloudflare` (server output), `tinacms` 3.x + `@tinacms/astro` 0.4 (schema, admin, `tinaField`), `@astrojs/tailwind` + `tailwindcss` 3.4 (scoped block styles)

**Storage**: Git-backed Markdown files in `src/content/pages/` (`format: "md"`); block data lives in page frontmatter (`blocks:` list with `_template` discriminators). N/A database.

**Testing**: `npm run check` (`astro check` — type/schema errors) + manual `/admin` open-and-save round-trip (add / edit / reorder / delete FAQ items; published page shows expected result at desktop and mobile widths; empty FAQ renders cleanly). No unit-test framework exists in this repo; no new harness is introduced for this feature.

**Target Platform**: Cloudflare Workers via `@astrojs/cloudflare`, `output: 'server'` (required for Tina live visual editing).

**Project Type**: Web template — server-rendered Astro site with TinaCMS content management.

**Performance Goals**: No added client-side JavaScript (native disclosure only); page stays fully server-rendered; negligible HTML growth per FAQ item.

**Constraints**: (1) `tina/config.ts` ↔ `src/components/blocks/**` ↔ page renderer MUST stay in sync; `tina/__generated__/` MUST be regenerated, never hand-edited. (2) `output: 'server'` + Cloudflare adapter MUST NOT change. (3) Data loading MUST go through `src/lib/tina.ts`, not inline page queries. (4) No secrets committed; no CSP/script changes (`public/_headers` untouched — no new scripts). (5) Answers are plain text (textarea, Callout pattern); rich text is out of scope.

**Scale/Scope**: One new block type; ~4 files changed + regenerated client + sample content. List supports at least 20 pairs (Tina object lists have no practical fixed limit at this scale).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Template Integrity (Fork-Per-Site)**: PASS — the FAQ block is fully generic (heading + Q/A pairs, no site-specific content); sample `home.md` items are placeholder-generic. No branding or domain logic added.
- **II. Schema Is the Contract (NON-NEGOTIABLE)**: PASS by design — plan changes schema, component, and renderer together and mandates `npm run gen:tina`; generated files are never hand-edited. A missed registration is defined as a defect caught by the `/admin` verification.
- **III. Live Editing Requires Server Output**: PASS — no change to `astro.config.mjs` (`output: 'server'` + Cloudflare adapter retained); data flows through `src/lib/tina.ts` unchanged; component uses `tinaField` for click-to-edit like existing blocks.
- **IV. Secrets, Headers & Deployment Discipline**: PASS — no secrets touched, no KV/wrangler changes, no new scripts so `public/_headers` CSP is unchanged; no vendored code (no third-party reference code copied).
- **V. Simplicity & Git-Backed Content**: PASS — smallest solution following existing block patterns; content stays in `src/content/**` Markdown; YAGNI respected (no search/filter/structured-data/accordion-JS); verification is `npm run check` + `/admin` round-trip.

*Post-Phase-1 re-check: design introduces no new dependencies, no config changes, no contract drift — all gates remain PASS. No Complexity Tracking entry required (no violations to justify).*

## Project Structure

### Documentation (this feature)

```text
specs/001-faq-block/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── faq-block.md     # Tina schema + renderer + HTML contract
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

Single-project template layout (Option 1; Options 2/3 deleted as inapplicable):

```text
tina/
├── config.ts                    # ADD faq template to pages.blocks.templates
└── __generated__/               # REGENERATED via npm run gen:tina (never hand-edited)

src/
├── components/blocks/
│   ├── Hero.astro               # untouched
│   ├── Callout.astro            # untouched
│   ├── Content.astro            # untouched
│   └── Faq.astro                # NEW - FAQ section renderer
├── pages/
│   └── index.astro              # ADD PagesBlocksFaq renderer branch
├── lib/tina.ts                  # untouched (read-only glue)
└── content/pages/
    └── home.md                  # ADD generic sample FAQ block
```

**Structure Decision**: Follow the existing single-project template layout. The FAQ block reuses the established extension points exactly: schema template → block component → renderer branch → sample content. No new directories, collections, or routes.

## Complexity Tracking

> No constitution violations — table not applicable.

---

## Carried Forward

### Confirmed Decisions

- FAQ is a fourth block type alongside Hero, Callout, Content; repeatable Q/A pairs with required question + required answer (from spec).
- Plain-text answers for v1 (Callout-style `textarea`); optional section heading, absent heading renders no heading element (from spec).
- Rendering choice (left open by spec, settled in `research.md`): native `<details>/<summary>` disclosure per item — zero JS, accessible, satisfies the no-heavy-JS budget; a static readable list is the graceful baseline it degrades to.

### Constraints

- Template Integrity: block MUST be generic and reusable, not site-specific content.
- Schema Is the Contract: schema + renderer stay in sync; generated client regenerated, never hand-edited.
- Live editing requires server output; data loading through `src/lib/tina.ts`, not inline page queries.
- No heavy client JS (Workers performance budget); content stays Git-backed Markdown/MDX.
- Quality bar: `npm run check` passes; `/admin` opens and an edit saves before reporting done.

### Assumptions

- Existing block patterns (Hero/Callout/Content + `index.astro` renderer + `home.md` sample content) are the correct extension template — verified by reading `tina/config.ts`, `src/components/blocks/`, `src/pages/index.astro`, `src/content/pages/home.md`, `src/lib/tina.ts`, `astro.config.mjs`, `package.json`.
- Tina object-list semantics: `required: true` on item subfields enforces per-item completeness; leaving the list itself non-required keeps an empty block saveable (FR-008). Verified against `navLinks`/`socialLinks` list patterns in the same schema file; final behaviour confirmed during `/admin` verification.
- Tina `__typename` for the new template follows the established convention: `PagesBlocksFaq` (collection `pages` + `blocks` + template `faq`), matching `PagesBlocksHero/Callout/Content`. Confirmed after `npm run gen:tina` during implementation.

### Risks

- If answers later need rich formatting, the plain-text field choice forces a schema migration (documented as Future Work in spec; not mitigated further in v1).
- If renderer registration is missed, the block renders as a placeholder — caught by the `/admin` open-and-save verification (contract check).

### Open Questions

- None blocking. Nested `tinaField` path form for list items (question/answer click-to-edit targets) is verified live in devtools during implementation, with parent-level `tinaField(block)` as the guaranteed fallback.

## Scope Confirmation

### In Scope

- `faq` Tina object template (optional `sectionHeading`, repeatable `items` of required `question` + required `answer`) available wherever page blocks are offered.
- `Faq.astro` server-rendered component (native disclosure, scoped styles, `tinaField` integration, empty-list guard).
- `index.astro` renderer branch for `PagesBlocksFaq`.
- Regenerated Tina client + generic sample FAQ content in `home.md`.
- Verification: `npm run check` + `/admin` round-trip (add/edit/reorder/delete, desktop + mobile, empty block).

### Out of Scope

- Rich-text answers, FAQ structured-data/SEO markup, search/filter, animated/JS accordion (spec Future Work — MUST NOT be implemented without approval).
- Changes to Hero, Callout, Content behaviour; new collections, navigation, or admin workflows.
- Test-harness introduction, wrangler/KV/header changes, dependency additions.

### Requirements Affected

- FR-001 (add FAQ alongside existing blocks), FR-002 (repeatable list, ≥20), FR-003 (both fields required), FR-004 (add/remove/edit/reorder), FR-005 (optional heading), FR-006 (readable in-position render), FR-007 (persist + round-trip), FR-008 (empty renders cleanly) — all addressed; see Requirement-to-Design Traceability.

## Repository Findings

### Relevant Components

- `tina/config.ts` — `pages` collection, `blocks` object list with `templates: [hero, callout, content]`; `navLinks`/`socialLinks` demonstrate the object-list pattern this feature reuses.
- `src/components/blocks/{Hero,Callout,Content}.astro` — one `.astro` per block, `Props { block: Record<string, any> }`, `tinaField` click-to-edit attributes, `<style>`-scoped presentation.
- `src/pages/index.astro` — `getPage("home.md")` + `getSiteConfig()` via `src/lib/tina.ts`; `page.blocks?.map` switching on `block.__typename` (`PagesBlocksHero`, …); only page in the template (no `[slug]` route).
- `src/lib/tina.ts` — read-only glue (`requestWithMetadata` stamping `_content_source`); MUST NOT be modified for this feature.
- `src/content/pages/home.md` — frontmatter `blocks:` with `_template` discriminators; sample-content pattern to extend.
- `astro.config.mjs` (`output: 'server'` + Cloudflare), `package.json` scripts (`check`, `gen:tina`, `dev`, `build`).

### Existing Behavior

- Editors manage Hero/Callout/Content through `/admin`; content commits to Git; Cloudflare rebuilds; server renderer maps each saved block to its component by `__typename`.
- Only `index.astro` renders blocks today; any block type missing a renderer branch renders `null` (silent gap) — the placeholder/contract failure mode the spec calls out.

### Existing Tests

- No unit/integration test suite exists. Coverage for this area = `npm run check` (Astro type check, catches Tina field typos per AGENTS.md) + manual `/admin` verification. Nothing covers FAQ yet because it does not exist.

### Project Conventions

- One `.astro` per block in `src/components/blocks/`; register in BOTH `tina/config.ts` templates AND the page renderer (`AGENTS.md` rule 2).
- Read `tina/config.ts` + `src/components/blocks/` before editing content structures (done).
- `npm run check` after changes; verify `/admin` opens and an edit saves before reporting done.
- Plain-text long fields use `ui: { component: "textarea" }` (Callout `text`, Hero `lead`); required fields use `required: true`.
- Astro auto-escapes `{expr}` output — editor text renders as text, never raw HTML.

### Constraints Discovered

- The repo has a single content route (`index.astro` → `home.md`); there is no `[slug]` page to update — renderer work is confined to `index.astro`. (If a `[slug]` renderer is added later, it MUST also handle `PagesBlocksFaq`.)
- `tina/__generated__/` does not exist until `npm run gen:tina` runs; `src/lib/tina.ts` `@ts-ignore`s its import, so `astro check` on a fresh clone expects generation first.
- `home.md` uses `format: "md"` frontmatter blocks; FAQ sample content MUST use `_template: faq` with `question`/`answer` keys matching the schema exactly.

## Architecture Overview

The solution is a fourth instance of the template's existing block pattern, not a new architecture. Data flows exactly as today: Tina schema defines the shape → Tina admin writes frontmatter → generated client types it → `src/lib/tina.ts` loads it server-side → `index.astro` dispatches on `__typename` → `Faq.astro` renders HTML with `tinaField` hooks for live editing. The only new idea is the presentation: each FAQ item is a native `<details>` disclosure (`<summary>` = question, body = answer), which delivers the spec's "expand/collapse via native accessible disclosure" assumption with zero client JavaScript and degrades to a readable static list in every browser.

## Major Components

- **Schema template (`tina/config.ts`, +~25 lines)**: `faq` template — `sectionHeading` (optional string; named to avoid collision with hero's required `heading` — see contracts/faq-block.md), `items` (object list; `question` required string, `answer` required string with textarea UI). Makes the block offerable wherever page blocks are offered (FR-001/002/003/004/005).
- **`Faq.astro` (new, ~60 lines)**: guards empty/missing `items` → renders nothing; optional `<h2>` heading; ordered `<details>` items with scoped styles, multiline preservation (`white-space: pre-line`), and `tinaField` attributes (FR-005/006/008).
- **Renderer branch (`index.astro`, +2 lines)**: import + `PagesBlocksFaq` → `<Faq>` mapping in position (FR-001/006).
- **Sample content (`home.md`, +~10 lines)**: one generic FAQ block proving the round-trip (FR-007, verification fixture).
- **Regenerated client (`tina/__generated__/`, generated)**: picks up `PagesBlocksFaq` types/queries; never hand-edited (FR-007 enabler).

## Data Flow

1. **Edit**: editor adds FAQ block in `/admin` → Tina form (heading input + repeatable item rows with add/remove/drag-reorder) → validation (question + answer both required per item; list itself may be empty).
2. **Store**: save writes `src/content/pages/<page>.md` frontmatter (`- _template: faq`, `sectionHeading:`, `items: [{question, answer}]`) → Git commit → Cloudflare rebuild.
3. **Load** (per request, server): `getPage()` → generated `client.queries.pages` → `requestWithMetadata` stamps `_content_source` → `page.blocks[]` with `__typename: "PagesBlocksFaq"` in editor order.
4. **Render**: `index.astro` maps blocks in order → `<Faq block>` → `<section>` + heading + `<details>` per item → Astro-escaped text HTML with `data-tina-field` attributes for click-to-edit overlay.

## Interfaces and Contracts

- **Tina schema contract** (`tina/config.ts`): template `name: "faq"`, `label: "FAQ"`; fields as specified in `contracts/faq-block.md`. Any rename MUST update the component, renderer, sample content, and regenerated client together.
- **Renderer contract** (`index.astro`): `block.__typename === "PagesBlocksFaq"` → `<Faq block={block} />`, in list position. Missing branch = silent `null` = contract violation.
- **Content contract** (`home.md` frontmatter): `- _template: faq` items with `question:`/`answer:` keys; see `contracts/faq-block.md` for the exact YAML shape.
- **HTML contract**: `<section class="faq">` → optional `<h2>` → `<details class="faq-item">` × N → `<summary>` + `<div class="faq-answer">`; empty items → no section element. Full detail in `contracts/faq-block.md`.
- **No external APIs, events, or function signatures** are introduced; `src/lib/tina.ts` types (`Block = Record<string, any>`) already accommodate the new block without change.

## Dependencies

None. No new packages, no version bumps. (Rationale: native disclosure + scoped styles + existing Tina primitives cover every requirement; adding an accordion/JS dependency would violate the Workers no-heavy-JS budget and constitution §V.)

## Error Handling

| Failure | Surface | User sees |
| --- | --- | --- |
| FAQ item missing question or answer | Tina admin validation blocks save (FR-003) | Editor sees required-field error in the form; nothing broken on the page |
| FAQ list empty (`items: []` or absent) | `Faq.astro` guard returns nothing | No section, no heading shell, no layout shift; other blocks unaffected (FR-008) |
| Multiple FAQ blocks on one page | Each renders independently in its position | Correct repeated sections (spec edge case) |
| Special chars / unicode / quotes in Q/A | Astro `{expr}` escaping | Displayed exactly as entered; markup never breaks |
| Very long Q/A text | Wrapping + `pre-line` multiline | Clean wrap at desktop and mobile widths, no overflow |
| Schema changed without `gen:tina` | Admin lacks FAQ block / types stale | Caught by procedure: generation is a mandatory implementation step |
| Component missing but schema present | Page renders gap (`null`) | Contract violation; caught by `/admin` render verification |

## Security and Privacy

No elevated risk. FAQ text is editor-authored plain text rendered via Astro's escaped interpolation (no `set:html`, no raw-HTML pipeline) — equivalent to existing Callout/Hero text handling. No PII flows, no auth changes, no secrets touched, no new network calls, no CSP impact (no scripts added). Verification includes entering markup-looking input (`<b>`, `&`, quotes) and confirming it renders as literal text.

## Performance and Reliability

Not applicable beyond the standing budget, which this design respects: zero client JS added, fully server-rendered HTML, per-item markup is a few elements (20+ pairs remain trivial DOM). Reliability inherits the existing Git-backed + Workers-rebuild path; no new failure domains. No load testing warranted for a static-content block.

## Validation Strategy

Per the spec's Validation Plan (automated + manual + data + security + performance), executed in `quickstart.md` order:

1. `npm run gen:tina` succeeds; `PagesBlocksFaq` present in generated client.
2. `npm run check` passes with zero type/schema errors.
3. `npm run dev` + `/admin` opens; add FAQ block with 3 pairs → save → published page shows all three in order; edit one answer, reorder, delete one → re-save → page reflects exactly that; reload admin shows exactly what was saved (round-trip).
4. Empty FAQ block page and no-FAQ page both render without errors and with identical surrounding layout.
5. Desktop + mobile widths: Q distinguishable from A, wrapping clean, no overflow.
6. Special-character probe renders as literal text.
7. Existing Hero/Callout/Content blocks render unchanged.

## Alternatives Considered

| Option | Advantages | Disadvantages | Decision |
| --- | --- | --- | --- |
| Native `<details>/<summary>` accordion per item | Zero JS; accessible disclosure built in; keyboard/screen-reader support free; matches spec's native-disclosure assumption | Browsers style `details` minimally — needs scoped CSS (trivial) | **Selected** |
| Static definition list (`<dl>/<dt>/<dd>`) | Simplest markup; semantic Q/A association | No collapse for long FAQs; weaker scannability at 20 items; less interactive payoff for P2 readability | Rejected |
| Custom JS accordion (state + animation) | Animated transitions; single-open behaviour | Violates no-heavy-JS budget; CSP/script review; state/SSR hydration complexity; overkill for v1 | Rejected |
| `rich-text` answer field instead of plain textarea | Future-proof for bold/links/lists | Forces TinaMarkdown pipeline + escaping review now; explicitly out of scope (spec Non-Goals); migration deferred deliberately | Rejected for v1 |
| Separate `faqs` collection with references | Reuse items across pages | New collection + reference UI + loader changes; spec says items live inside the block; YAGNI violation | Rejected |

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Nested `tinaField` paths for list items don't resolve to per-field edit targets | Medium | Low (editing still works via form) | Parent-level `tinaField(block)` guaranteed; verify nested paths live in devtools, fall back to parent-only |
| `required` semantics on Tina list subfields differ from assumption | Low | Medium (FR-003 enforcement) | Spec edge case already demands it; verify in `/admin` (attempt save with blank answer); adjust field flags if Tina needs `required` at a different level |
| `__typename` naming differs from `PagesBlocksFaq` convention | Low | Low | Read generated client after `gen:tina`; use the actual emitted name in the renderer branch |
| Sample FAQ in `home.md` conflicts with fork owners' content expectations | Low | Low | Keep items unmistakably generic/placeholder; forks already own their content |

## Requirement-to-Design Traceability

| Requirement | Design Decision | Reason |
| --- | --- | --- |
| FR-001 | `faq` template in `pages.blocks.templates` + renderer branch | Block offered wherever Hero/Callout/Content are; all four render |
| FR-002 | `items` object list, no maxLength, ≥20 supported | Repeatable pairs with no editor-facing cap |
| FR-003 | `required: true` on `question` + `answer` subfields | Pair missing either cannot save; verified in admin |
| FR-004 | Tina list semantics (add/remove/edit/drag-reorder) with order-preserving render | Day-two maintenance via the same UI editors know; `map` preserves order |
| FR-005 | Optional `sectionHeading` string; `<h2>` rendered only when non-empty | Labelled sections supported; absent heading renders no empty space |
| FR-006 | `<details>/<summary>` per item, in-position, scoped Q-vs-A styling | Questions visually distinct, order = editor order, position = block position |
| FR-007 | Frontmatter persistence + regenerated client + `requestWithMetadata` path unchanged | Round-trip identical to existing blocks |
| FR-008 | Empty-guard in `Faq.astro` (no section when no items) | Empty block is a clean no-op; page unaffected |

## Implementation Boundaries

### Must Change

- `tina/config.ts` (add `faq` template)
- `src/content.config.ts` (add `"faq"` to the `pages.blocks` `_template` enum — missed in the first draft; `npm run check` fails on FAQ content without it)
- `src/components/blocks/Faq.astro` (new)
- `src/pages/index.astro` (import + `PagesBlocksFaq` branch)
- `tina/__generated__/` via `npm run gen:tina` (regeneration step, not hand-edit)
- `src/content/pages/home.md` (generic sample FAQ)

### Must Not Change

- `Hero.astro`, `Callout.astro`, `Content.astro` behaviour or styling
- `src/lib/tina.ts` (read-only glue; no inline queries anywhere)
- `astro.config.mjs` (`output: 'server'` + Cloudflare adapter), `wrangler.jsonc`, `public/_headers`
- `.env` / secrets handling; `package.json` dependencies; `tina/__generated__/` by hand

## What Changed / What Remains Open

- **Changed from the spec:** Rendering choice settled (native `<details>` accordion within the no-JS budget); `__typename` convention (`PagesBlocksFaq`) and list-requiredness semantics assumed from repo patterns, flagged for live verification.
- **Still open:** Nested `tinaField` path form for list items — resolved live in devtools during implementation (parent-level fallback guaranteed).
- **Needs approval:** This plan itself (scope, approach, zero-dependency stance) before `/speckit.tasks` breaks it into tasks.
