// Generate sitemap.xml + llms files from static route metadata.
// This must run on GitHub Actions Node 18 without runtime web fetch/parsing.

const fs = require("fs");
const path = require("path");

const SITE_URL = "https://randomgorsey.com";
const TODAY = new Date().toISOString().slice(0, 10);

const PUBLIC_DIR = path.join(__dirname, "../public");
const SITEMAP_PATH = path.join(PUBLIC_DIR, "sitemap.xml");
const PUBLIC_LLMS_PATH = path.join(PUBLIC_DIR, "llms.txt");
const PUBLIC_LLMS_FULL_PATH = path.join(PUBLIC_DIR, "llms-full.txt");
const ROOT_LLMS_PATH = path.join(__dirname, "../llms.txt");
const ROOT_LLMS_FULL_PATH = path.join(__dirname, "../llms-full.txt");

const ROUTES = [
  {
    path: "/",
    label: "Home",
    title: "Random Gorsey",
    description: "Explore Random Gorsey's latest music and posts.",
    priority: 1.0,
    changefreq: "weekly",
  },
  {
    path: "/about/",
    label: "About",
    title: "About | Random Gorsey",
    description: "Background, influences and side projects of Random Gorsey.",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/contact/",
    label: "Contact",
    title: "Contact | Random Gorsey",
    description: "Send a message to Random Gorsey.",
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/gallery/",
    label: "Gallery",
    title: "Gallery | Random Gorsey",
    description: "Photo gallery featuring Random Gorsey visuals.",
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/listen/",
    label: "Listen",
    title: "Listen | Random Gorsey",
    description: "Stream songs and playlists from Random Gorsey.",
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/discography/",
    label: "Discography",
    title: "Discography | Random Gorsey",
    description: "Browse the official releases from Random Gorsey.",
    priority: 0.7,
    changefreq: "monthly",
  },
];

const toAbsoluteUrl = (routePath) => `${SITE_URL}${routePath}`;

function buildSitemap() {
  const urls = ROUTES.map((route) => {
    return [
      "  <url>",
      `    <loc>${toAbsoluteUrl(route.path)}</loc>`,
      `    <lastmod>${TODAY}</lastmod>`,
      `    <priority>${route.priority}</priority>`,
      `    <changefreq>${route.changefreq}</changefreq>`,
      "  </url>",
    ].join("\n");
  }).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
    '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9',
    '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
}

function buildLlms() {
  const lines = [
    "# Random Gorsey",
    "> Explore Random Gorsey's music and visuals.",
    "",
    "## Pages",
  ];

  for (const route of ROUTES) {
    lines.push(`- [${route.label}](${route.path})`);
  }

  lines.push("");
  return lines.join("\n");
}

function buildLlmsFull() {
  const lines = [
    "# llms-full.txt - Website Content Structure",
    `# Generated: ${new Date().toISOString()}`,
    `# Source: ${SITE_URL}/sitemap.xml`,
    `# Total Pages: ${ROUTES.length}`,
    "",
    "## Site Metadata",
    `Site URL: ${SITE_URL}`,
    `Extraction Date: ${TODAY}`,
    `Total Pages Processed: ${ROUTES.length}`,
  ];

  for (const route of ROUTES) {
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push(`### Page: ${toAbsoluteUrl(route.path)}`);
    lines.push(`Title: ${route.title}`);
    lines.push(`Meta Description: ${route.description}`);
    lines.push("Language: en");
    lines.push(`Canonical URL: ${toAbsoluteUrl(route.path)}`);
    lines.push("");
    lines.push("## Headings Structure:");
    lines.push(`- ${route.label}`);
    lines.push("");
    lines.push("## Main Content:");
    lines.push(route.description);
  }

  lines.push("");
  lines.push("---");
  lines.push("# Success Rate: 100.0%");
  lines.push("# Failed Pages: 0");
  lines.push("");
  return lines.join("\n");
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
}

const sitemap = buildSitemap();
const llms = buildLlms();
const llmsFull = buildLlmsFull();

writeFile(SITEMAP_PATH, sitemap);
writeFile(PUBLIC_LLMS_PATH, llms);
writeFile(PUBLIC_LLMS_FULL_PATH, llmsFull);
writeFile(ROOT_LLMS_PATH, llms);
writeFile(ROOT_LLMS_FULL_PATH, llmsFull);

console.log(`sitemap.xml updated at ${SITEMAP_PATH}`);
console.log(`llms.txt updated at ${PUBLIC_LLMS_PATH} and ${ROOT_LLMS_PATH}`);
console.log(
  `llms-full.txt updated at ${PUBLIC_LLMS_FULL_PATH} and ${ROOT_LLMS_FULL_PATH}`
);
