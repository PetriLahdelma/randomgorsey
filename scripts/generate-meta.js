// Auto-generate sitemap.xml and llms.txt based on your routes/pages
// Run: node scripts/generate-meta.js

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// --- CONFIG ---
const SITE_URL = 'https://randomgorsey.com';
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');
const LLMS_PATH = path.join(__dirname, '../llms.txt');
const LLMS_FULL_PATH = path.join(__dirname, '../llms-full.txt');
const ROUTES = [
  { path: '/', label: 'Home', priority: 1.0, changefreq: 'weekly' },
  { path: '/about', label: 'About', priority: 0.8, changefreq: 'monthly' },
  { path: '/contact', label: 'Contact', priority: 0.7, changefreq: 'monthly' },
  { path: '/gallery', label: 'Gallery', priority: 0.7, changefreq: 'monthly' },
  { path: '/listen', label: 'Listen', priority: 0.7, changefreq: 'monthly' },
  { path: '/discography', label: 'Discography', priority: 0.7, changefreq: 'monthly' },
];
const today = new Date().toISOString().slice(0, 10);

// --- SITEMAP GENERATION ---
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n${ROUTES.map(r => `  <url>\n    <loc>${SITE_URL}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${r.priority}</priority>\n    <changefreq>${r.changefreq}</changefreq>\n  </url>`).join('\n')}\n</urlset>\n`;

fs.writeFileSync(SITEMAP_PATH, sitemap);
console.log('sitemap.xml updated!');

// --- SITEMAP PARSING ---
function parseSitemap(xml) {
  const urls = [];
  const regex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

// --- llms.txt GENERATION ---
async function fetchPageMeta(url) {
  try {
    const { data } = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(data);
    const title = $('title').text().trim();
    const metaDesc = $('meta[name="description"]').attr('content') || '';
    const lang = $('html').attr('lang') || 'en';
    const canonical = $('link[rel="canonical"]').attr('href') || url;
    // Headings
    const headings = [];
    for (let i = 1; i <= 6; i++) {
      $(`h${i}`).each((_, el) => headings.push('- ' + $(el).text().trim()));
    }
    // Main content (fallback: body text)
    let mainContent = '';
    if ($('main').length) {
      mainContent = $('main').text().replace(/\s+/g, ' ').trim();
    } else {
      mainContent = $('body').text().replace(/\s+/g, ' ').trim();
    }
    return { title, metaDesc, lang, canonical, headings, mainContent };
  } catch (e) {
    return { error: true };
  }
}

(async () => {
  // Write sitemap.xml as before
  fs.writeFileSync(SITEMAP_PATH, sitemap);
  console.log('sitemap.xml updated!');

  // Parse URLs from sitemap.xml
  const sitemapXml = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  const urls = parseSitemap(sitemapXml);

  // --- llms-full.txt GENERATION ---
  let llmsFull = `# llms-full.txt - Website Content Structure\n`;
  llmsFull += `# Generated: ${new Date().toISOString()}\n`;
  llmsFull += `# Source: ${SITE_URL}/sitemap.xml\n`;
  llmsFull += `# Total Pages: ${urls.length}\n`;

  llmsFull += `\n## Site Metadata\n`;
  llmsFull += `Site URL: ${SITE_URL}\n`;
  llmsFull += `Extraction Date: ${today}\n`;
  llmsFull += `Total Pages Processed: ${urls.length}\n`;

  let success = 0;
  let failed = 0;
  for (const url of urls) {
    llmsFull += `\n---\n\n### Page: ${url}\n`;
    try {
      const meta = await fetchPageMeta(url);
      if (meta.error) throw new Error('Fetch error');
      success++;
      llmsFull += `Title: ${meta.title}\n`;
      llmsFull += `Meta Description: ${meta.metaDesc}\n`;
      llmsFull += `Language: ${meta.lang}\n`;
      llmsFull += `Canonical URL: ${meta.canonical}\n`;
      llmsFull += `\n## Headings Structure:\n`;
      if (meta.headings.length) {
        llmsFull += meta.headings.join('\n') + '\n';
      } else {
        llmsFull += 'No headings found\n';
      }
      llmsFull += `\n## Main Content:\n`;
      llmsFull += meta.mainContent ? meta.mainContent : 'No content found';
      llmsFull += `\n`;
    } catch (e) {
      failed++;
      llmsFull += `Could not fetch page.\nError: ${(e && e.message) || e}\n`;
    }
  }

  llmsFull += `\n---\n`;
  llmsFull += `# Success Rate: ${(success / urls.length * 100).toFixed(1)}%\n`;
  llmsFull += `# Failed Pages: ${failed}\n`;

  fs.writeFileSync(LLMS_FULL_PATH, llmsFull);
  const publicFullPath = path.join(__dirname, '../public/llms-full.txt');
  fs.writeFileSync(publicFullPath, llmsFull);
  console.log(`llms-full.txt updated! Success: ${success}, Failed: ${failed}`);

  // --- llms.txt GENERATION ---
  let llms = `# Random Gorsey\n`;
  llms += `> Explore Random Gorsey's music and visuals.\n\n`;
  llms += `## Pages\n`;
  for (const r of ROUTES) {
    llms += `- [${r.label}](${r.path})\n`;
  }

  fs.writeFileSync(LLMS_PATH, llms);
  const publicLLMsPath = path.join(__dirname, '../public/llms.txt');
  fs.writeFileSync(publicLLMsPath, llms);
  console.log('llms.txt updated!');
})();
