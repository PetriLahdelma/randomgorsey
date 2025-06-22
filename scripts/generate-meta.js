// Auto-generate sitemap.xml and LLMs.txt based on your routes/pages
// Run: node scripts/generate-meta.js

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// --- CONFIG ---
const SITE_URL = 'https://randomgorsey.com';
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');
const LLMS_PATH = path.join(__dirname, '../LLMs.txt');
const ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/about', priority: 0.8, changefreq: 'monthly' },
  { path: '/contact', priority: 0.7, changefreq: 'monthly' },
  { path: '/gallery', priority: 0.7, changefreq: 'monthly' },
  { path: '/listen', priority: 0.7, changefreq: 'monthly' },
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

// --- LLMs.txt GENERATION ---
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

  // --- LLMs.txt GENERATION ---
  let llms = `# LLM.txt - Website Content Structure\n`;
  llms += `# Generated: ${new Date().toISOString()}\n`;
  llms += `# Source: ${SITE_URL}/sitemap.xml\n`;
  llms += `# Total Pages: ${urls.length}\n`;

  llms += `\n## Site Metadata\n`;
  llms += `Site URL: ${SITE_URL}\n`;
  llms += `Extraction Date: ${today}\n`;
  llms += `Total Pages Processed: ${urls.length}\n`;

  let success = 0;
  let failed = 0;
  for (const url of urls) {
    llms += `\n---\n\n### Page: ${url}\n`;
    try {
      const meta = await fetchPageMeta(url);
      if (meta.error) throw new Error('Fetch error');
      success++;
      llms += `Title: ${meta.title}\n`;
      llms += `Meta Description: ${meta.metaDesc}\n`;
      llms += `Language: ${meta.lang}\n`;
      llms += `Canonical URL: ${meta.canonical}\n`;
      llms += `\n## Headings Structure:\n`;
      if (meta.headings.length) {
        llms += meta.headings.join('\n') + '\n';
      } else {
        llms += 'No headings found\n';
      }
      llms += `\n## Main Content:\n`;
      llms += meta.mainContent ? meta.mainContent : 'No content found';
      llms += `\n`;
    } catch (e) {
      failed++;
      llms += `Could not fetch page.\nError: ${(e && e.message) || e}\n`;
    }
  }
  llms += `\n---\n`;
  llms += `# Success Rate: ${(success / urls.length * 100).toFixed(1)}%\n`;
  llms += `# Failed Pages: ${failed}\n`;
  fs.writeFileSync(LLMS_PATH, llms);
  // Also copy to public/LLMs.txt for deployment
  const publicLLMsPath = path.join(__dirname, '../public/LLMs.txt');
  fs.writeFileSync(publicLLMsPath, llms);
  console.log(`LLMs.txt updated! Success: ${success}, Failed: ${failed}`);
})();
