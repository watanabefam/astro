# Feature Specification: FAQ Block

**Feature Branch**: `001-faq-block`

**Created**: 2026-10-03

**Status**: Draft

**Input**: User description: "add a repeatable FAQ block (a list of question/answer pairs) as a fourth Tina block type alongside the existing Hero, Callout and Content blocks"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add an FAQ section to a page (Priority: P1)

A content editor, working in the site admin, adds a new FAQ block to a page, enters several question/answer pairs, saves, and sees the FAQ section rendered on the published page alongside the existing Hero, Callout, and Content blocks.

**Why this priority**: This is the core value — without it the feature does not exist. It covers block availability, repeatable Q/A entry, save round-trip, and rendering.

**Independent Test**: Can be fully tested by opening the admin on a page, adding an FAQ block with two Q/A pairs, saving, and loading the page to confirm both pairs appear in order. Delivers a visible FAQ section editors can manage without developer help.

**Acceptance Scenarios**:

1. **Given** a page being edited in the admin, **When** the editor adds an FAQ block and saves with two question/answer pairs, **Then** both pairs appear on the published page in the order entered.
2. **Given** a page with Hero, Callout, and Content blocks, **When** the editor adds an FAQ block among them, **Then** all four block types render and the FAQ does not disturb the other blocks.

---

### User Story 2 - Visitor reads FAQ answers (Priority: P2)

A site visitor lands on a page containing an FAQ section and reads through the questions and answers to find the information they need.

**Why this priority**: Readability is the visitor-facing payoff; an FAQ editors can add but visitors cannot comfortably scan delivers little value.

**Independent Test**: Can be fully tested by loading a page with an FAQ block containing several pairs and confirming each question is visually distinguishable from its answer and all pairs are readable on desktop and mobile widths.

**Acceptance Scenarios**:

1. **Given** a published page with an FAQ block of three pairs, **When** a visitor scrolls to the FAQ section, **Then** each question and its matching answer are clearly associated and readable in entry order.

---

### User Story 3 - Manage existing FAQ items (Priority: P3)

A content editor revisits a page with an FAQ block to fix a typo in an answer, add a new pair, remove an outdated pair, and reorder pairs so the most-asked question comes first, then saves.

**Why this priority**: Day-two maintenance keeps FAQs accurate; it depends on US1 existing but is independently valuable once FAQs live on pages.

**Independent Test**: Can be fully tested by editing an existing FAQ block (change one answer, add one pair, delete one pair, move one pair to the top), saving, and confirming the published page reflects exactly those changes.

**Acceptance Scenarios**:

1. **Given** a page with a saved FAQ block, **When** the editor edits an answer and saves, **Then** the published page shows the updated answer.
2. **Given** a page with a saved FAQ block of three pairs, **When** the editor deletes the second pair and moves the third to the top, **Then** the published page shows the two remaining pairs in the new order.

---

### Edge Cases

- What happens when an FAQ block has zero items? The section renders nothing (no empty heading shell, no broken layout) and the rest of the page is unaffected.
- How does the page handle an answer left empty? Empty answers are not permitted — an item requires both a question and an answer before it can be saved.
- What happens with very long questions or answers (several paragraphs)? Text wraps cleanly within the page layout with no overflow or overlap at desktop and mobile widths.
- How does the page handle multiple FAQ blocks on one page? Each block renders independently in its position among the other blocks.
- What happens when question text contains special characters (quotes, ampersands, unicode)? They display exactly as entered with no markup breakage.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Content editors MUST be able to add an FAQ block to a page wherever Hero, Callout, and Content blocks can be added.
- **FR-002**: Each FAQ block MUST hold a repeatable list of question/answer pairs with no fixed upper limit imposed on editors in the normal range (at least 20 pairs supported).
- **FR-003**: Each pair MUST require a question and MUST require an answer; a pair missing either MUST NOT be saveable.
- **FR-004**: Editors MUST be able to add, remove, edit, and reorder pairs within an FAQ block.
- **FR-005**: FAQ blocks MUST support an optional section heading so editors can label the section (e.g. "Frequently asked questions"); when no heading is given, no empty heading space is rendered.
- **FR-006**: Site visitors MUST see each question visually distinguishable from its answer, pairs in the editor-defined order, rendered in the block's position on the page.
- **FR-007**: FAQ content MUST persist and round-trip (reload in the admin exactly as saved) the same way existing block content does.
- **FR-008**: A page containing an FAQ block MUST remain fully renderable when the FAQ list is empty — no error, no broken layout, other blocks unaffected.

### Key Entities *(include if feature involves data)*

- **FAQ block**: A page section holding an optional heading plus an ordered list of FAQ items; sits alongside Hero, Callout, and Content blocks in the page's block list.
- **FAQ item**: One question (short text, required) paired with one answer (longer plain text, required); order within the block is significant.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A content editor can add an FAQ block with three question/answer pairs to a page and see all three rendered in order within 5 minutes of opening the admin, on the first attempt.
- **SC-002**: 100% of saved FAQ pairs appear on the published page in the editor-defined order with question and answer correctly associated (zero mismatched or dropped pairs).
- **SC-003**: Editing, reordering, or deleting FAQ items and re-saving is reflected on the published page with zero stale or duplicated items.
- **SC-004**: A page with an empty FAQ block and a page with no FAQ block both render without errors and with identical surrounding layout.

## Assumptions

- Answers are plain text (multi-line textarea, matching the existing Callout pattern); rich formatting (bold, links, lists) inside answers is out of scope for v1.
- Expand/collapse interaction, if any, uses native accessible disclosure without custom client-side scripting, keeping with the template's no-heavy-JS budget; a static readable list is an acceptable v1 rendering.
- Multiple FAQ blocks per page are allowed and render independently.
- Item order defined by the editor is preserved exactly on the page.
- Styling follows the existing block conventions (server-rendered markup plus scoped styles); no new global design system is introduced.
- The content-schema definition and the page renderer stay in sync per the repo's schema-is-the-contract rule (a block in one without the other is a defect).

---

<!-- Appended by the spec-driven-development preset (strategy: append). -->

## Carried Forward

### Confirmed Decisions

- FAQ is a fourth block type alongside Hero, Callout, and Content (per user request); repeatable Q/A pairs with required question and required answer.
- Plain-text answers for v1 (Callout-style textarea), optional section heading.

### Constraints

- Template Integrity (fork-per-site): the FAQ block MUST be generic and reusable, not site-specific content.
- Schema Is the Contract: schema definition and block renderer MUST stay in sync; generated client artifacts MUST be regenerated, never hand-edited.
- Live editing requires server output; data loading goes through the shared Tina loader, not inline page queries.
- No heavy client JS by default (Workers performance budget); content stays Git-backed Markdown/MDX.
- Quality bar: `npm run check` passes; `/admin` opens and an edit saves before reporting done.

### Assumptions

- Existing block patterns (Hero/Callout/Content + `index.astro` renderer + `home.md` sample content) are the correct extension template; verified by reading `tina/config.ts`, `src/components/blocks/`, `src/pages/index.astro`, `src/content/pages/home.md`.

### Risks

- If answers later need rich formatting, the plain-text field choice forces a schema migration (mitigated by documenting rich-text as Future Work).
- If the renderer registration is missed, the block renders as a placeholder — a contract violation caught by the `/admin` open-and-save verification.

### Open Questions

- None blocking this spec. (Rendering choice — static list vs. native disclosure accordion — is left to planning within the no-heavy-JS constraint.)

## Problem / Opportunity

Pages built from this template have Hero, Callout, and Rich Content blocks but no structured way to present question/answer content. Editors needing an FAQ must misuse generic blocks, producing inconsistent, hard-to-maintain pages. A dedicated repeatable FAQ block closes that gap with the same edit-save-render loop editors already use.

## Goals

- Editors can add, edit, reorder, and remove Q/A pairs on any page through the admin with no developer involvement.
- Visitors get a consistently readable FAQ presentation matching the template's existing block quality.
- The template gains a reusable fourth block that stays consistent across forked sites.

## Non-Goals

- Rich-text answers, search/filter within FAQs, and FAQ structured-data markup are explicitly NOT in this feature (see Future Work).
- No changes to Hero, Callout, or Content block behaviour.
- No new content collections, navigation, or admin workflows beyond the FAQ block itself.

## Dependencies and External Contracts

- Page content schema and block renderer MUST change together; if either changes without the other, pages render placeholders or fail verification.
- Generated Tina client artifacts depend on the schema — regeneration is required after the schema change; if regeneration is skipped, the admin will not offer the FAQ block.
- Sample page content (`home.md`-style fixtures) depends on the new block shape; existing pages without FAQ blocks MUST continue to load unchanged.

## MVP Scope

The smallest slice delivering value is User Story 1: add an FAQ block with Q/A pairs via the admin, save, and see it rendered in order on the page — verified by `npm run check` plus an `/admin` open-and-save round-trip.

## Future Work

Deliberately deferred; NOT part of this feature's acceptance criteria; MUST NOT be implemented without explicit approval.

- Rich-text answers (formatted text, links, lists).
- FAQ structured-data markup for search engines.
- Search, filter, or animated accordion behaviour beyond native disclosure.
- Import/export or reuse of FAQ items across pages.

## Validation Plan

How this feature will be proven, before implementation starts.

- **Automated tests** — `npm run check` passes with no type/schema errors after the change.
- **Manual checks** — `/admin` opens; an FAQ block can be added with Q/A pairs, saved, reordered, deleted; the published page shows the expected result at desktop and mobile widths; a page with an empty FAQ block renders cleanly.
- **Data or migration checks** — Existing pages without FAQ blocks load unchanged; FAQ content round-trips (reload shows exactly what was saved).
- **Security / privacy checks** — Question/answer text is rendered as text (no raw HTML injection from editor input); no secrets touched.
- **Performance checks** — No added client-side JavaScript bundle; page remains server-rendered.
- **Evidence required for approval** — `npm run check` output + description (or screenshot) of the `/admin` add-save-render round-trip including an edit/reorder/delete pass.

## Requirement Traceability

Fill in as the work progresses. A requirement with no task is unbuilt; a task with no requirement is scope creep.

| Requirement | User Story | Acceptance Criteria | Planned Design Area | Task |
| --- | --- | --- | --- | --- |
| FR-001 | US1 | Add FAQ alongside existing blocks; all four render |  |  |
| FR-002 | US1 | Save N pairs; all render |  |  |
| FR-003 | US1, Edge | Item missing Q or A cannot save |  |  |
| FR-004 | US3 | Edit/add/delete/reorder reflected after save |  |  |
| FR-005 | US1, US2 | Optional heading; absent = no empty heading |  |  |
| FR-006 | US2 | Q distinguishable from A; order preserved; in-position render |  |  |
| FR-007 | US1, US3 | Reload shows exactly what was saved |  |  |
| FR-008 | Edge | Empty FAQ renders nothing; page unaffected |  |  |
