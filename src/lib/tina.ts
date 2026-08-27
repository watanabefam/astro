import { requestWithMetadata } from "@tinacms/astro";

// Fetches a page's content through the Tina client and returns the data object
// stamped with `_content_source` metadata (this is what `tinaField()` reads for
// click-to-edit). Run on every request (server output) so edits made in the admin
// appear immediately after a Cloudflare rebuild.
//
// NOTE: `tina/__generated__/client` is produced by `npm run gen:tina` (tinacms
// build) or `tinacms dev` and is gitignored. The generated query names match the
// collection names in `tina/config.ts` (e.g. collection "pages" -> queries.pages).

type Block = Record<string, any>;

type Page = {
  title: string;
  blocks?: Block[];
};

type Config = {
  name: string;
  title: string;
  description: string;
  navLinks?: Array<{ label: string; href: string }>;
  socialLinks?: Array<{ label: string; href: string }>;
};

export async function getPage(relativePath: string): Promise<Page> {
  // @ts-ignore - generated client present after `tinacms build` / `tinacms dev`
  const tina = await import("../../tina/__generated__/client");
  // requestWithMetadata stamps `_content_source` onto the returned data.
  // @ts-ignore - generated query name is `pages` (matches the collection name)
  const data: any = await requestWithMetadata(
    tina.client.queries.pages({ relativePath })
  );
  return data.data.pages as Page;
}

export async function getSiteConfig(): Promise<Config> {
  // @ts-ignore - generated client present after `tinacms build` / `tinacms dev`
  const tina = await import("../../tina/__generated__/client");
  // @ts-ignore - generated query name is `config`
  const data: any = await requestWithMetadata(
    tina.client.queries.config({ relativePath: "index.md" })
  );
  return data.data.config as Config;
}
