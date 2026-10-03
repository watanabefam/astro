# Quickstart: FAQ Block Validation

**Feature**: `001-faq-block` | **Date**: 2026-10-03

Runnable proof that the feature works end-to-end. No implementation code lives here — see `contracts/faq-block.md` and `data-model.md` for shapes. All commands run from the repo root.

## Prerequisites

- Node ≥ 22.12, dependencies installed (`npm install`).
- Tina build credentials available the same way they are today (no new secrets for this feature).

## Steps

### 1. Regenerate the Tina client

```sh
npm run gen:tina
```

Expected: succeeds; `PagesBlocksFaq` appears in `tina/__generated__/` queries/types. (If the FAQ template is absent from the admin afterwards, regeneration was skipped — redo this step.)

### 2. Typecheck

```sh
npm run check
```

Expected: passes with zero errors (catches Tina field-name typos).

### 3. Admin round-trip (core acceptance)

```sh
npm run dev
```

1. Open `/admin` on the home page.
2. Add an **FAQ** block with three Q/A pairs + heading "Frequently asked questions"; save.
3. Load the published page → all three pairs appear in entry order; each question is visually distinct from its answer; heading shown.
4. In `/admin`: edit one answer, move the third pair to the top, delete the second pair; save.
5. Reload the page → exactly the two remaining pairs in the new order with the edited answer. Reload `/admin` → form shows exactly what was saved (round-trip, FR-007).
6. Attempt to save a pair with a blank question or blank answer → admin refuses (FR-003).

### 4. Edge cases

- Set the FAQ `items` to empty (or remove all pairs) and save → page renders with no FAQ section, no heading shell, no errors; surrounding Hero/Callout/Content layout identical to a page without the block (FR-008 / SC-004).
- Add a second FAQ block elsewhere on the page → each renders independently in its position.
- Enter `Quotes " & <b>unicode ✓` in a question and multi-paragraph text in an answer → displayed exactly as entered (escaped, no markup breakage), wrapping cleanly.

### 5. Viewport check

Repeat step 3's page load at desktop and narrow mobile widths → all pairs readable in order, no overflow or overlap.

## Pass criteria

- `npm run check` green; `/admin` opens; add → save → render → edit/reorder/delete → re-save all reflected exactly (SC-001/002/003); empty block and no-block pages render identically clean (SC-004); existing Hero/Callout/Content blocks unchanged.
