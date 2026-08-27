// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import tina from "@tinacms/astro/integration";
import { tinaAdminDevRedirect } from "@tinacms/astro/vite";

// https://astro.build/config
export default defineConfig({
  // Workers + Tina live editing require server output + the Cloudflare adapter.
  // For a fully static site with form-only editing, switch to output: "static"
  // and drop the adapter — but you lose Tina's in-context click-to-edit.
  output: "server",
  adapter: cloudflare(),
  site: "https://example.com", // override with SITE_URL at build (see wrangler.jsonc / CF vars)
  integrations: [mdx(), sitemap(), tailwind(), tina()],
  vite: {
    plugins: [tinaAdminDevRedirect()],
    ssr: {
      noExternal: ["@tinacms/astro", "@tinacms/bridge"],
    },
  },
});
