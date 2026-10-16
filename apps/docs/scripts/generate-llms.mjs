import assert from "node:assert";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const BASE_URL = "https://next-admin-docs.vercel.app";
const docsRoot = path.join(import.meta.dirname, "..");
const pagesDir = path.join(docsRoot, "pages");
const publicDir = path.join(docsRoot, "public");

// shortcut: evaluates _meta files as plain JS, breaks if they gain TS syntax; switch to a TS loader then
const readMeta = (dir) => {
  const file = ["_meta.ts", "_meta.js"].map((name) => path.join(dir, name)).find(existsSync);
  if (!file) return {};
  return new Function(readFileSync(file, "utf8").replace("export default", "return"))();
};

const metaTitle = (value) => (typeof value === "string" ? value : value?.title);

const collectSections = (dir, sectionTitle) => {
  const meta = readMeta(dir);
  const names = readdirSync(dir)
    .filter((name) => !name.startsWith("_"))
    .map((name) => name.replace(/\.mdx?$/, ""));
  const ordered = [...Object.keys(meta), ...names.filter((name) => !(name in meta)).sort()];

  const pages = [];
  const subSections = [];
  for (const name of ordered) {
    if (meta[name]?.href) continue;
    const subDir = path.join(dir, name);
    if (existsSync(subDir)) {
      subSections.push(...collectSections(subDir, metaTitle(meta[name]) ?? name));
      continue;
    }
    const file = [`${subDir}.mdx`, `${subDir}.md`].find(existsSync);
    assert(file, `_meta entry "${name}" in ${dir} has no matching page`);
    const content = readFileSync(file, "utf8");
    const route = path.relative(pagesDir, subDir).replace(/(^|\/)index$/, "");
    pages.push({
      title: content.match(/^# (.+)$/m)?.[1].trim() ?? metaTitle(meta[name]) ?? name.replaceAll("-", " "),
      url: `${BASE_URL}/${route}`,
      content,
    });
  }
  return [{ title: sectionTitle, pages }, ...subSections];
};

const toMarkdown = (content) =>
  content
    .replace(/^---\n[\s\S]*?\n---\n\s*/, "")
    .replace(/^(?:import[\s\S]*?from\s+["'][^"']+["'];?\s*)+/, "")
    .replaceAll("](/", `](${BASE_URL}/`)
    .trim();

const sections = collectSections(path.join(pagesDir, "docs"), "Docs");
const pages = sections.flatMap((section) => section.pages);

const llmsTxt = [
  "# Next Admin",
  "",
  "> Next-Admin provides a customizable and turnkey admin dashboard for applications built with Next.js and powered by the Prisma ORM.",
  "",
  ...sections.flatMap((section) => [
    `## ${section.title}`,
    "",
    ...section.pages.map((page) => `- [${page.title}](${page.url})`),
    "",
  ]),
  "## Optional",
  "",
  `- [Changelog](${BASE_URL}/changelog)`,
  `- [Full documentation in one file](${BASE_URL}/llms-full.txt)`,
  "",
].join("\n");

const llmsFullTxt = pages
  .map((page) => `<!-- Source: ${page.url} -->\n\n${toMarkdown(page.content)}\n`)
  .join("\n---\n\n");

const mdxFileCount = readdirSync(path.join(pagesDir, "docs"), { recursive: true }).filter((file) =>
  /\.mdx?$/.test(file)
).length;
assert.equal(pages.length, mdxFileCount, "every docs page must end up in llms-full.txt");
assert(
  pages.every((page) => !toMarkdown(page.content).startsWith("import ")),
  "top-level imports must be stripped"
);

writeFileSync(path.join(publicDir, "llms.txt"), llmsTxt);
writeFileSync(path.join(publicDir, "llms-full.txt"), llmsFullTxt);
console.log(`Generated llms.txt and llms-full.txt from ${pages.length} pages`);
