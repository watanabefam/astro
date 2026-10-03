# Research: FAQ Block

**Feature**: `001-faq-block` | **Date**: 2026-10-03

All Technical Context unknowns were resolvable from the repository itself; no external research was required. The one design decision the spec deferred (static list vs. native disclosure) is settled below.

## Decision 1: Rendering — native `<details>/<summary>` accordion

- **Decision**: Each FAQ item renders as `<details class="faq-item"><summary>{question}</summary><div class="faq-answer">{answer}</div></details>`, with an optional `<h2>` heading and scoped CSS. Zero client-side JavaScript.
- **Rationale**: The spec's Assumptions explicitly allow "expand/collapse interaction … uses native accessible disclosure without custom client-side scripting" and accept "a static readable list" as the baseline. Native disclosure is strictly better than a static list within the same budget: free keyboard/screen-reader semantics, free collapse for long (20-pair) FAQs improving P2 scannability, and it degrades to readable content in any browser. It keeps the Workers no-heavy-JS budget and avoids any CSP/`_headers` change.
- **Alternatives considered**: static `<dl>` (simpler but no collapse, weaker scanning at 20 items — rejected); custom JS accordion (animated but violates the JS budget and adds hydration complexity — rejected). See plan.md Alternatives table.

## Decision 2: Schema shape — object list reusing `navLinks` pattern

- **Decision**: `faq` object template with `sectionHeading` (optional string) + `items` (object, `list: true`) where each item has `question` (string, `required: true`) and `answer` (string, `required: true`, `ui: { component: "textarea" }`). The `items` list itself is NOT `required`, so an empty block remains saveable (FR-008). (Implementation repair: first drafted as `heading`, but codegen fails — hero's required `heading: String!` conflicts with an optional same-named field in the shared `blocks` fragment scope; `sectionHeading` avoids the collision. See contracts/faq-block.md.)
- **Rationale**: Verified against `tina/config.ts`: `navLinks`/`socialLinks` already use object-lists with per-field `required`; Callout's `text` and Hero's `lead` establish the plain-textarea convention for longer text (spec mandates Callout-pattern textarea). Per-item `required` enforces FR-003; non-required list preserves FR-008. `__typename` follows the observed convention (`PagesBlocksHero` ← collection `pages` + `blocks` + template `hero`), giving `PagesBlocksFaq` — confirmed against the regenerated client during implementation.
- **Alternatives considered**: `rich-text` answer (deferred to Future Work per spec — rejected for v1); separate `faqs` collection with references (YAGNI violation, spec says items live in the block — rejected).

## Decision 3: Click-to-edit — parent `tinaField` guaranteed, nested paths verified live

- **Decision**: `Faq.astro` stamps `data-tina-field={tinaField(block)}` on the section and per-field targets on heading/question/answer. Parent-level attribution is the guaranteed fallback (block remains editable via the form regardless); the exact nested path form for list items is confirmed in devtools during implementation.
- **Rationale**: Existing blocks (`Hero`, `Callout`, `Content`) all follow the `tinaField(block[, field])` pattern; list-item nesting is the only unobserved variant, so it carries a live-verification step rather than an assumption.

## Decision 4: Multiline + escaping — `pre-line` CSS on escaped output

- **Decision**: Answers render via Astro `{block.items[i].answer}` interpolation (auto-escaped — special characters display literally, no HTML injection) with `white-space: pre-line` preserving editor line breaks without markup.
- **Rationale**: Matches the security requirement (render as text) and the long-answer edge case (clean wrapping) with no pipeline changes.

## Decision 5: Verification without a test harness

- **Decision**: No test framework is introduced. Verification = `npm run gen:tina` + `npm run check` + `npm run dev` with the `/admin` round-trip documented in `quickstart.md`.
- **Rationale**: The repo has no unit/integration harness (`package.json` offers `check`, `lint`, dev/build scripts only); constitution §V and the spec's Validation Plan both define `npm run check` + `/admin` open-and-save as the quality bar for this change class. Introducing a harness for one static block would be disproportionate process.
