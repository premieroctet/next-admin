import assert from "node:assert";
import { readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const BASE_URL = "https://next-admin-docs.vercel.app";
const docsRoot = path.join(import.meta.dirname, "..");
const pagesDir = path.join(docsRoot, "pages");

// v4 pages stay reachable but are left out so search engines favor the current docs
const routes = readdirSync(pagesDir, { recursive: true })
  .filter((file) => /\.mdx?$/.test(file) && !file.startsWith("v4/"))
  .map((file) => `/${file.replace(/\.mdx?$/, "").replace(/(^|\/)index$/, "")}`)
  .sort();

assert(routes.includes("/") && routes.includes("/docs"), "index pages must map to their folder route");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${BASE_URL}${route}</loc></url>`).join("\n")}
</urlset>
`;

writeFileSync(path.join(docsRoot, "public", "sitemap.xml"), sitemap);
console.log(`Generated sitemap.xml with ${routes.length} URLs`);
