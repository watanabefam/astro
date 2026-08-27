# Astro + Tina CMS + Cloudflare Workers template

A reusable template for content-managed websites: edit pages visually through
the **Tina CMS** admin, commit to Git, deploy to **Cloudflare Workers**. Built
on **Astro** (server output).

## What you get
- Visual editing via Tina (`/admin`) — click text on the page, edit in the sidebar.
- Git-backed content (Markdown in `src/content/`) — no database, version-controlled.
- Block-based pages (Hero, Callout, Rich Content) defined in `tina/config.ts`.
- Cloudflare Workers deploy with one command / one push.

## Prerequisites
- Node ≥ 22.12
- A Tina Cloud account (free) → project Client ID + content token
- A Cloudflare account (Workers)

## Setup
```bash
npm install
cp .env.example .env        # fill PUBLIC_TINA_CLIENT_ID, TINA_TOKEN, SITE_URL
npm run dev                 # opens Astro dev + Tina admin at /admin
```
Visit `http://localhost:4321/admin` to edit. Save commits to the repo.

> Local mode reads the filesystem; for cloud editing (production) create a Tina
> Cloud project and set the credentials above.

## Build & deploy
```bash
npm run build               # tinacms build && astro build
npm run deploy             # build + wrangler deploy
```
Or push to `main` — GitHub Actions builds and deploys to Workers.

### Cloudflare setup
1. Create a Workers project connected to this repo.
2. Add build vars/secrets: `PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`, `SITE_URL`.
3. After the first deploy, **pin the SESSION KV namespace ID** in `wrangler.jsonc`
   (Workers & Pages → KV) or the second editor save fails.

## Adding a block
1. Create `src/components/blocks/MyBlock.astro`.
2. Register it as a template in `tina/config.ts` → `pages.blocks.templates`.
3. Render it in `src/pages/index.astro` (switch on `block.block`).
4. `npm run gen:tina` to regenerate the client.

## Governance
See `AGENTS.md` — includes human gates and the audit-before-trust rule borrowed
from the premium-site-crafter pipeline.

## License
MIT.
