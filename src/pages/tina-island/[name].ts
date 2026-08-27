// Tina live-editing island route. MUST stay prerendered=false so the Cloudflare
// Worker renders it on demand per keystroke during visual editing. The
// @tinacms/astro integration wires the real handler; this file pins `prerender`.
export const prerender = false;

import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  return new Response("Tina island endpoint", { status: 200 });
};
