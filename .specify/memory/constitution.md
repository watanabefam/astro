<!--
Sync Impact Report (scratch — remove before commit):
- Version change: [unversioned placeholder] → 1.0.0 (initial ratification)
- Modified principles: [PRINCIPLE_1..5 placeholders] → I–V concrete (see below)
- Added sections: Technology & Operational Constraints; Development Workflow & Quality Gates
- Removed sections: none (placeholders replaced)
- Follow-up TODOs: none — all placeholders resolved. Confirm RATIFICATION_DATE 2026-10-03 with maintainers.
-->

# Astro Tina Cloudflare Template Constitution

## Core Principles

### I. Template Integrity — Fork-Per-Site

Every change to this repo MUST keep it reusable as a template; site-specific
content, branding, or domain logic MUST NOT land in the template repo — fork or
copy per site instead. New capabilities MUST be generic (configurable block,
collection, or documented extension point) unless explicitly approved as a
template concern.

### II. Schema Is the Contract (NON-NEGOTIABLE)

`tina/config.ts` and `src/components/blocks/**` MUST stay in sync: one `.astro`
file per block, registered in both `tina/config.ts` templates and the page
renderer (`index.astro` / `[slug]`). Any schema change MUST be followed by
`npm run gen:tina` (or `tinacms build`); `tina/__generated__/` MUST NEVER be
hand-edited. A block present in the schema without a component (renders a
placeholder) is a contract violation.

### III. Live Editing Requires Server Output

`astro.config.mjs` MUST use `output: 'server'` + `@astrojs/cloudflare` for
Tina live visual editing. Switching to `output: 'static'` is permitted only
when click-to-edit is explicitly abandoned (forms-only editing). Data loading
MUST go through `src/lib/tina.ts`; pages MUST NOT inline Tina queries.

### IV. Secrets, Headers & Deployment Discipline

Secrets MUST NEVER be committed: `.env` stays gitignored; `PUBLIC_TINA_CLIENT_ID`,
`TINA_TOKEN`, and `SITE_URL` live in Cloudflare dashboard Variables & Secrets /
build vars only. `wrangler.jsonc` MUST pin the SESSION KV namespace ID after
first deploy. `public/_headers` MUST be kept current (CSP updated when scripts
change). License-aware vendoring is mandatory: reference designs (e.g.
`phucbm/folio-2026`, MIT) MUST NOT introduce unlicensed or unclear-licensed code
into this public/commercial template.

### V. Simplicity & Git-Backed Content

Content stays in `src/content/**` (Markdown/MDX, Git-backed, no database) as the
source of truth; hand-edits there MUST be followed by regeneration/verification,
not silent drift. Prefer the smallest solution that satisfies the need (YAGNI):
no unapproved blocks, integrations, or refactors. Every feature MUST be
independently understandable, documented in README/AGENTS.md when it changes
contributor workflow, and verifiable via `npm run check` + `/admin` open-and-save.

## Technology & Operational Constraints

Stack: Astro 5 (server output) + TinaCMS + Tailwind + Cloudflare Workers via
`@astrojs/cloudflare`; Node ≥ 22.12. Build is `tinacms build && astro build`;
deploy is build + `wrangler deploy` (or GitHub Actions push to `main`).
Performance budget: server-rendered pages MUST stay fast on Workers (no heavy
client JS by default; Tailwind purged; MDX/sitemap only as configured).
Observability: Workers logs + Tina edit-save round-trip are the debuggability
contract — any new integration MUST preserve a reproducible local path
(`npm run dev`, `/admin` reachable) and a documented production path.

## Development Workflow & Quality Gates

Workflow: spec-first for material changes (spec → plan → tasks → implement);
small well-understood fixes get a short path (cause → change → verify) with the
workflow choice stated in one line. Quality gates: `npm run check` MUST pass
after structural changes; `/admin` MUST open and an edit MUST save before
reporting done; `tina/config.ts` + `src/components/blocks/` MUST be read before
editing content structures. Human gates (borrowed discipline): Gate A — design /
structure approved before scaffolding a site from this template; Gate B — content
+ headers confirmed before custom-domain go-live; Git-as-gate — tag immutable
build checkpoints (`build/0N`); audit-before-trust — any third-party design
skill MUST be audited before use. Reviews MUST verify constitution compliance;
complexity MUST be justified.

## Governance

This constitution supersedes all other practices in this repo; `AGENTS.md`,
README, and specs defer to it on conflict. Amendments require: a documented
proposal, maintainer approval, a version bump per semver below, and a migration
plan when behaviour or contracts change. Versioning: MAJOR — incompatible
governance/principle removal or redefinition; MINOR — new principle or materially
expanded guidance; PATCH — clarifications, wording, typo fixes. Compliance review:
every PR/spec/plan MUST assert the principles followed or justify exceptions;
violations MUST be repaired at the earliest affected artifact, not patched
downstream. Use `AGENTS.md` for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2026-10-03 | **Last Amended**: 2026-10-03

---

## Delivery Principles

### I. Product Intent and Scope

Every material change must identify the user or system problem it addresses, its goals, its
non-goals, and its intended scope.

### II. Evidence Before Implementation

When product behaviour or feasibility is uncertain, investigate the repository, the relevant
evidence, and available solution patterns before selecting an approach.

### III. Explicit Assumptions

Assumptions that could affect behaviour, scope, architecture, security, data, cost, or
validation must be recorded.

### IV. Verifiable Outcomes

Requirements must be testable or otherwise verifiable. Acceptance criteria must describe
observable outcomes.

### V. Traceable Delivery

Each implementation task must trace to an approved requirement or design decision.

### VI. Controlled Change

Material changes to approved behaviour, scope, architecture, security, data, or cost require
explicit review.

### VII. Artifact Consistency

When a later discovery contradicts an earlier artifact, repair the earliest affected
artifact and re-check the artifacts that depend on it.

### VIII. Proportional Process

Use enough process to control risk, but do not apply full product discovery to routine
maintenance or small, well-understood fixes.
