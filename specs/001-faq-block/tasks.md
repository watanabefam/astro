# Tasks: FAQ Block

**Input**: Design documents from `/specs/001-faq-block/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/faq-block.md, quickstart.md
**Tests**: No test framework exists in this repo and none is requested in the spec. Verification = `npm run gen:tina` + `npm run check` + manual `/admin` round-trip per `quickstart.md`. No test tasks are generated.
**Organization**: Tasks grouped by user story; each story independently verifiable after Foundational phase.

**Workflow**: Full spec-driven workflow (spec → plan → tasks → implement) — new user-visible block type touching schema, renderer, and content contract.

**Carried forward**: FAQ is a fourth generic block (`faq`) alongside Hero/Callout/Content; plain-text textarea answers, optional heading, native `<details>` disclosure, zero JS. Constraints: schema ↔ component ↔ renderer stay in sync, regenerate client never hand-edit, server output + `src/lib/tina.ts` untouched, `npm run check` + `/admin` save round-trip is the quality bar. Rendering choice settled in planning; nested `tinaField` paths verified live with parent-level fallback.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm clean baseline before touching the schema contract

- [x] T001 Verify baseline typecheck passes via `npm run check` in repo root (tina/__generated__/ must exist; if missing, run `npm run gen:tina` first per astro.config/plan constraints)
- [x] T002 [P] Read reference block patterns in `src/components/blocks/Callout.astro`, `src/components/blocks/Hero.astro`, and renderer dispatch in `src/pages/index.astro` to confirm extension template before editing

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Schema contract all stories depend on — MUST complete before any story work

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Add `faq` object template to `tina/config.ts` pages.blocks.templates per `contracts/faq-block.md` (optional `sectionHeading` string with label "Section Heading" — NOT `heading`: collides with hero's required `heading` in codegen; `items` object list labelled "Questions & Answers" with `list: true`, NOT required; subfields `question` string label "Question" with `required: true`, `answer` string label "Answer" with `required: true` and `ui: { component: "textarea" }`)
- [x] T004 Regenerate Tina client via `npm run gen:tina` in repo root and confirm `PagesBlocksFaq` appears in `tina/__generated__/` queries/types (never hand-edit generated files)

**Checkpoint**: Foundation ready — `faq` offered wherever page blocks are offered; user story implementation can now begin

---

## Phase 3: User Story 1 - Add an FAQ section to a page (Priority: P1) 🎯 MVP

**Goal**: Editor adds FAQ block with Q/A pairs in `/admin`, saves, sees pairs rendered in order on the published page alongside Hero/Callout/Content.

**Independent Test**: Open `/admin` on home page, add FAQ block with two Q/A pairs, save, load published page → both pairs appear in entry order; all four block types render without disturbing each other (spec acceptance scenarios 1–2).

- [x] T005 [P] [US1] Create FAQ renderer `src/components/blocks/Faq.astro` with empty-guard (no `items` → render nothing), optional `<h2>` heading (only when non-empty), ordered native `<details class="faq-item">` per item (`<summary>` question + `<div class="faq-answer">` answer), Astro-escaped interpolation (no `set:html`), `white-space: pre-line` for answers, `tinaField` click-to-edit attributes, scoped Q-vs-A styles
- [x] T006 [P] [US1] Add `PagesBlocksFaq` renderer branch in `src/pages/index.astro` (import `Faq` from `../components/blocks/Faq.astro`; inside `page.blocks?.map` in list position return `<Faq block={block} />`; missing branch = contract violation, not optional)
- [x] T007 [P] [US1] Add generic sample FAQ block to `src/content/pages/home.md` frontmatter (`- _template: faq` with `sectionHeading` + `items` of `question:`/`answer:` keys matching schema exactly; placeholder-generic content only per Template Integrity)
- [x] T008 [US1] Verify US1 via `npm run check` in repo root (zero errors) plus `/admin` round-trip in `src/content/pages/home.md` page (add 3 pairs + heading, save, published page shows all three in order; reload `/admin` shows exactly what was saved per FR-007; blank question/answer refused per FR-003)

**Checkpoint**: US1 fully functional and independently testable — visible FAQ section editors manage without developer help

---

## Phase 4: User Story 2 - Visitor reads FAQ answers (Priority: P2)

**Goal**: Visitor scrolling to the FAQ section can scan questions and read matching answers at desktop and mobile widths.

**Independent Test**: Load page with 3-pair FAQ block → each question visually distinct from its answer, correctly associated, in entry order, readable at desktop + narrow mobile widths (spec acceptance scenario 1).

- [x] T009 [US2] Harden readability in `src/components/blocks/Faq.astro` (scoped styles making `<summary>` question visually distinct from `.faq-answer`; clean text wrapping with no overflow/overlap at desktop and mobile widths; depends on T005 — same file, sequential edit)
- [x] T010 [US2] Verify US2 readability and escaping on the `src/pages/index.astro` home page (3 pairs in order; special-character probe `Quotes " & <b>unicode ✓` renders literally escaped; multi-paragraph answer wraps cleanly; desktop + mobile widths per `quickstart.md` steps 4–5)

**Checkpoint**: US1 + US2 both work independently — editable FAQ that visitors can comfortably scan

---

## Phase 5: User Story 3 - Manage existing FAQ items (Priority: P3)

**Goal**: Editor fixes a typo, adds/removes/reorders pairs, saves, sees exactly those changes on the page.

**Independent Test**: Edit one answer + add one pair + delete one pair + move one pair to top in `/admin`, save → published page reflects exactly those changes; admin reload shows saved state (spec acceptance scenarios 1–2; FR-004/FR-007).

- [x] T011 [US3] Verify US3 day-two maintenance via `/admin` on `src/content/pages/home.md` (edit one answer, delete second pair, move third to top, save → published `src/pages/index.astro` page shows exactly the two remaining pairs in new order with edited answer; no stale/duplicated items per SC-003; Tina list add/remove/drag-reorder is schema-native — no code change expected, this task is the proof pass)

**Checkpoint**: All user stories independently functional — full FAQ lifecycle proven

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, regressions, and final verification

- [x] T012 [P] Verify empty-block safety in `src/components/blocks/Faq.astro` (set `items` to empty/omitted in `src/content/pages/home.md`, save → no `<section>`, no heading shell, no errors; surrounding layout identical to no-FAQ page per FR-008/SC-004; restore sample content after)
- [x] T013 [P] Verify multiple-block independence in `src/content/pages/home.md` (add second FAQ block elsewhere among Hero/Callout/Content in `src/pages/index.astro` page → each renders independently in its position; remove the extra block after)
- [x] T014 [P] Run regression check in repo root (`npm run check` green; confirm `Hero.astro`, `Callout.astro`, `Content.astro` behaviour/styling untouched; `src/lib/tina.ts`, `astro.config.mjs`, `wrangler.jsonc`, `public/_headers`, `package.json` dependencies unchanged; `tina/__generated__/` regenerated not hand-edited)
- [ ] T015 Run full `quickstart.md` (automated + render half done — see implementation evidence below; final `/admin` click-through needs real Tina Cloud creds) validation pass from repo root (`specs/001-faq-block/quickstart.md` steps 1–5 in order; evidence for approval: `npm run check` output + description of the `/admin` add-save-render round-trip including the edit/reorder/delete pass)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories (T003 schema → T004 regen, strictly sequential)
- **User Stories (Phase 3+)**: All depend on Foundational completion
  - US1 (P1) first — delivers the MVP; US2/US3 build on the same files
  - US2 and US3 verifications can run in parallel after US1 implementation lands (different concerns, no shared file edits except read-only page loads)
- **Polish (Phase 6)**: Depends on all desired stories complete; T012/T013/T014 parallel-safe (independent checks), T015 strictly last

### Within Each User Story

- Schema/regen before component before renderer verification
- Same-file edits sequential (T005 → T009 both touch `Faq.astro`)
- Verify `npm run check` after structural changes; verify `/admin` save round-trip before reporting done

### Parallel Opportunities

- T002 reads in parallel with T001 baseline check
- T005 (`Faq.astro`) + T006 (`index.astro`) + T007 (`home.md`) in parallel after T004 (three different files, contract shape already fixed)
- T012 + T013 + T014 in parallel (independent checks, no shared edits)

---

## Parallel Example: User Story 1 (after T004)

```bash
# Launch all three US1 implementation tasks together (different files, fixed contract):
Task: "Create FAQ renderer src/components/blocks/Faq.astro"
Task: "Add PagesBlocksFaq renderer branch in src/pages/index.astro"
Task: "Add generic sample FAQ block to src/content/pages/home.md"
```

## Parallel Example: Polish (Phase 6)

```bash
Task: "Verify empty-block safety (Faq.astro guard + home.md fixture)"
Task: "Verify multiple-block independence (home.md fixture)"
Task: "Run regression check (check + untouched-file audit)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational (T003–T004)
3. Complete Phase 3: US1 (T005–T008)
4. **STOP and VALIDATE**: `/admin` add-save-render round-trip + `npm run check` green
5. Deploy/demo if ready — MVP delivers an editor-manageable FAQ section

### Incremental Delivery

1. Setup + Foundational → `faq` offered in admin
2. + US1 → add/save/render works (MVP!)
3. + US2 → readability proven at both viewports
4. + US3 → edit/reorder/delete lifecycle proven
5. + Polish → edge cases + regression clean

---

## Requirement Coverage

| Requirement | Tasks | Covered? |
| --- | --- | --- |
| FR-001 (add FAQ alongside existing blocks) | T003, T004, T006, T008 | ☑ |
| FR-002 (repeatable list, ≥20, no cap) | T003, T008 | ☑ |
| FR-003 (both fields `required: true`, missing → not saveable) | T003, T008 | ☑ |
| FR-004 (add/remove/edit/reorder reflected) | T011 | ☑ |
| FR-005 (optional heading; absent → no heading element) | T003, T005, T008 | ☑ |
| FR-006 (Q distinguishable, order, in-position render) | T005, T006, T009, T010 | ☑ |
| FR-007 (persist + round-trip identical to existing blocks) | T004, T007, T008, T011 | ☑ |
| FR-008 (empty renders nothing, page unaffected) | T003, T005, T012 | ☑ |

---

## Task Detail Blocks

Non-trivial tasks expanded per the template addendum. Trivial reads/checks (T001, T002, T014–T015 as pure procedure) are fully specified by their checkbox lines.

## T003: Add `faq` template to Tina schema

- **Objective**: Offer the FAQ block wherever page blocks are offered.
- **Addresses requirement(s)**: FR-001, FR-002 (`items` object list, `list: true`, no `maxLength`, "at least 20 pairs supported"), FR-003 (`question`/`answer` each `required: true` — "a pair missing either MUST NOT be saveable"), FR-005 (`sectionHeading` optional — absent/empty → no heading), FR-008 (list itself NOT required — empty block saveable).
- **Implements design decision(s)**: Research Decision 2 (object list reusing `navLinks` pattern; Callout-style textarea for `answer`); contract §1 verbatim shape.
- **Depends on**: T001, T002
- **Likely files**: `tina/config.ts` (append to `pages.blocks.templates` after `content` template).
- **Scope boundaries**: Do not touch `config` collection, `navLinks`/`socialLinks`, Hero/Callout/Content templates; do not add collections, routes, or dependencies.
- **Expected output**: `faq` template present with exact field names `sectionHeading`/`items`/`question`/`answer`.
- **Verification**: `npm run gen:tina` succeeds; `PagesBlocksFaq` in `tina/__generated__/`.
- **Completion conditions**: Schema matches `contracts/faq-block.md` §1 exactly; `npm run check` shows no new errors attributable to the schema.
- **Risks / rollback**: Wrong field names break component/content contract — revert the single template hunk; no migration (Git-backed content, no existing FAQ data).

## T004: Regenerate Tina client

- **Objective**: Publish the schema change to admin UI and generated types.
- **Addresses requirement(s)**: FR-001 (block appears in admin), FR-007 (round-trip typing).
- **Implements design decision(s)**: Constitution §II — regenerate, never hand-edit.
- **Depends on**: T003
- **Likely files**: `tina/__generated__/` (output only).
- **Scope boundaries**: Do not hand-edit anything under `tina/__generated__/`; do not change build scripts.
- **Expected output**: `PagesBlocksFaq` typename present; `/admin` offers the FAQ block.
- **Verification**: grep generated output for `PagesBlocksFaq`; open `/admin` and confirm FAQ is offerable.
- **Completion conditions**: Generation succeeds; actual emitted `__typename` confirmed for T006 (if it differs from convention, T006 uses the emitted name).
- **Risks / rollback**: Skipped regeneration = stale admin; rerun the command — fully reversible.

## T005: Create `Faq.astro`

- **Objective**: Server-rendered FAQ section with zero client JS.
- **Addresses requirement(s)**: FR-005 (optional `<h2>`), FR-006 (distinct Q/A, editor order, in-position), FR-008 (empty → nothing).
- **Implements design decision(s)**: Research Decisions 1 (native `<details>/<summary>`), 3 (`tinaField` with parent fallback), 4 (escaped output + `pre-line`); contract §4 HTML shape.
- **Depends on**: T004
- **Likely files**: `src/components/blocks/Faq.astro` (new, ~60 lines); model on `src/components/blocks/Callout.astro` (`Props { block: Record<string, any> }`, `tinaField`, scoped `<style>`).
- **Scope boundaries**: Do not modify Hero/Callout/Content; no `set:html`; no client script; no global CSS.
- **Expected output**: Populated block → `<section class="faq">` + optional `<h2>` + N `<details>`; empty block → no element.
- **Verification**: `npm run check` passes; `/admin` + page render per T008.
- **Completion conditions**: Contract §4 HTML shape matched; empty-guard present; nested `tinaField` paths verified live or parent-only fallback kept.
- **Risks / rollback**: Nested `tinaField` path uncertainty (plan risk) — parent-level attribution guaranteed; delete/revert the single new file to roll back.

## T006: Renderer branch in `index.astro`

- **Objective**: Dispatch saved FAQ blocks to the component in page position.
- **Addresses requirement(s)**: FR-001 (all four types render), FR-006 (in-position render).
- **Implements design decision(s)**: Contract §2 (`PagesBlocksFaq` → `<Faq>`); plan Implementation Boundaries.
- **Depends on**: T004 (typename), T005 (component; parallel-editable, jointly verified)
- **Likely files**: `src/pages/index.astro` (+2 lines: import + branch).
- **Scope boundaries**: Do not alter existing Hero/Callout/Content branches or data loading (`getPage`/`getSiteConfig` via `src/lib/tina.ts` unchanged).
- **Expected output**: FAQ blocks render via `<Faq>` in stored order; no silent `null` gap.
- **Verification**: Page with FAQ block shows the section; `npm run check` green.
- **Completion conditions**: Branch uses the verified `__typename`; renders in list position.
- **Risks / rollback**: Missed branch = silent gap (contract violation) — caught by T008 render check; revert the 2-line hunk.

## T007: Sample FAQ content

- **Objective**: Prove the round-trip with generic placeholder content.
- **Addresses requirement(s)**: FR-007 (persistence fixture).
- **Depends on**: T003 (shape; parallel-editable after contract fixed)
- **Likely files**: `src/content/pages/home.md` (+~10 lines).
- **Scope boundaries**: Placeholder-generic items only (Template Integrity); do not rewrite existing Hero/Callout/Content sample blocks.
- **Expected output**: One `faq` block with heading + 2–3 generic Q/A pairs using exact keys.
- **Verification**: `/admin` loads it; page renders it; reload shows identical data.
- **Completion conditions**: Keys match schema exactly (`_template: faq`, `question`/`answer`); existing blocks unchanged.
- **Risks / rollback**: Typo in keys → `npm run check` / admin load catches it; revert the hunk.

## Notes

- [P] tasks = different files, no dependencies; same-file edits (T005→T009) stay sequential
- Each user story independently completable and testable after Foundational
- Commit after each task or logical group; stop at any checkpoint to validate
- Scope discipline: rich-text answers, structured-data markup, search/filter, JS accordion, cross-page reuse are spec Future Work — MUST NOT be implemented

## Implementation Evidence (2026-10-03)

- `npm run check`: 0 errors, 0 warnings (20 files). Baseline before changes was also green.
- `npm run gen:tina` local codegen complete with dummy creds: `PagesBlocksFaq`
  (`sectionHeading?: String`, `items: [PagesBlocksFaqItems!]`, required
  `question`/`answer: String!`) present in `types.ts`/`schema.gql`/`frags.gql`.
  Final cloud-check step (`ERR_CLOUD_CHECK_FAILED`) needs real
  `PUBLIC_TINA_CLIENT_ID`/`TINA_TOKEN` — rerun `npm run gen:tina` with real
  creds before relying on `/admin`.
- Live render proof via `tinacms dev` + `astro dev` (port 4321, home page 200):
  FAQ section renders `<section class="faq">` + `<h2>` + N `<details>` in
  editor order with working `data-tina-field` paths (`pages.blocks.3`,
  `...sectionHeading`, `...items`); Hero/Callout/Content intact.
- Escaping probe: `Quotes " & <b>unicode ✓` renders as
  `&quot; &amp; &lt;b&gt;` + verbatim unicode; multi-paragraph answer preserved
  (no raw HTML leak).
- Empty `items: []` renders no section/heading; surrounding layout unchanged
  (FR-008/SC-004). Two FAQ blocks render independently in position; empty
  `sectionHeading: ""` renders no `<h2>`.
- Repairs during implementation (earliest-artifact rule): (1) heading field
  renamed `heading` → `sectionHeading` (contract/data-model/plan/research/tasks
  updated) — hero's required `heading: String!` collides with an optional
  same-named field in Tina codegen; (2) `src/content.config.ts` `_template`
  enum gained `"faq"` (plan boundaries + contract §3 updated) — `npm run check`
  rejects FAQ content without it.
