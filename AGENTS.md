<AGENTS>
  What this repo is: a reusable template for Astro + Tina CMS sites deployed to
  Cloudflare Workers (Tina live visual editing). It is the content-managed site
  builder — distinct from the bespoke 3D cinematic pipeline in premium-site-crafter.
</AGENTS>

## Layout & rules
<LAYOUT>

| Path | What it is | Rules |
|---|---|---|
| `tina/config.ts` | Tina content schema (collections + blocks) | Edit to add fields/blocks. Regenerate client after changes. |
| `src/content/**` | Markdown/MDX content edited via Tina | Source of truth for all site content. Don't hand-edit unless regenerating. |
| `src/components/blocks/**` | Editable page blocks (Hero, Callout, Content…) | One .astro per block. Register new blocks in both `tina/config.ts` and `index.astro`. |
| `src/lib/tina.ts` | Data loader (Tina client + requestWithMetadata) | Read-only glue. Don't inline Tina queries in pages. |
| `wrangler.jsonc` | Cloudflare Workers config + KV binding | Pin SESSION KV id after first deploy. |
| `public/_headers` | Cloudflare security headers | Keep CSP up to date when adding scripts. |
| `tina/__generated__/` | Generated GraphQL client | NEVER edit by hand; `npm run gen:tina`. Gitignored. |
</LAYOUT>

## Non-negotiables
<NON_NEGOTIABLES>

1. **Never commit secrets.** `.env` is gitignored. Build-time Tina creds (`PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`) go in Cloudflare dashboard Variables & Secrets, not the repo.
2. **Regenerate the Tina client after any schema change.** `npm run gen:tina` (or `tinacms build`). Pages import from `tina/__generated__/client` — it will not exist until generated.
3. **Live editing requires Workers + server output.** `astro.config.mjs` uses `output: 'server'` + `@astrojs/cloudflare`. Do not switch to `output: 'static'` and expect click-to-edit; static = forms only.
4. **Pin the SESSION KV namespace** in `wrangler.jsonc` after the first deploy, or the second editor save fails.
5. **License-aware vendoring.** Study `phucbm/folio-2026` (MIT) as a reference. Do not vendor code with no/unclear license into a public or commercial template.
6. **Schema is the contract.** The Tina `tina/config.ts` schema and the block components must stay in sync — a block listed in the schema but missing a component renders a placeholder.
</NON_NEGOTIABLES>

## Human gates (borrowed from premium-site-crafter)
<GATES>
  This template ships with the same governance discipline as premium-site-crafter:
  - **Gate A (design approval):** before scaffolding a new site from this template, get the design/structure
    approved. Don't build into the template repo — fork/copy it per site.
  - **Gate B (publish approval):** before connecting a custom domain + going live, confirm content + headers.
  - **Git-as-gate:** tag immutable build checkpoints (`build/0N`) so deploys are client-verifiable.
  - **Audit before trust:** any third-party "web design" skill added here must be audited before use.
</GATES>

## Agent operating rules
<AGENT_RULES>
  1. Read `tina/config.ts` and `src/components/blocks/` before adding/editing content structures.
  2. When adding a block: create the component, register it in `tina/config.ts` templates, and render it in `index.astro` (or the relevant `[slug]` page).
  3. Run `npm run check` after changes (astro check catches Tina field typos).
  4. Prefer `opencode` delegation for scaffold/build; verify `/admin` opens and an edit saves before reporting done.
</AGENT_RULES>

<!-- SPECKIT-BRIDGE START -->
# Spec-Driven Development (Spec Kit)

This project uses Spec Kit. Requirements are written down before code is written, and the
artifacts under `specs/` are the source of truth.

**Load the `spec-driven-development` skill before specifying, planning, or implementing.**
It carries the workflow, approval gates, traceability and verification rules.

## If you cannot invoke `/speckit.*` commands

Agents that do not read `.opencode/commands/` (e.g. Freebuff/Codebuff) can run each step by
reading the command prompt directly and following it as instructions:

| Step | File |
| --- | --- |
| constitution | `.opencode/commands/speckit.constitution.md` |
| specify | `.opencode/commands/speckit.specify.md` |
| plan | `.opencode/commands/speckit.plan.md` |
| tasks | `.opencode/commands/speckit.tasks.md` |
| implement | `.opencode/commands/speckit.implement.md` |
| converge | `.opencode/commands/speckit.converge.md` |
| clarify | `.opencode/commands/speckit.clarify.md` |
| analyze | `.opencode/commands/speckit.analyze.md` |
| checklist | `.opencode/commands/speckit.checklist.md` |

Substitute the user's feature description wherever the prompt expects `$ARGUMENTS`.
<!-- SPECKIT-BRIDGE END -->

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->
