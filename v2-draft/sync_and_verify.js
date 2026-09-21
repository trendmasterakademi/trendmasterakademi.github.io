import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');
const repoRoot = path.resolve(__dirname, '..');
const baselinePath = path.join(repoRoot, 'scratchpad/taban-2026-09-21.txt');

console.log('=== TMA V2 SYNC & VERIFICATION SCRIPT ===');

// 1. SYNC
console.log('\n--- 1. SYNCING v2-draft/dist to repo root ---');

const preservedRootItems = new Set([
  '.git',
  '.agents',
  '.gitignore',
  'CNAME',
  'scratchpad',
  'v1-vanilla-backup',
  'v2-draft',
  'tma_google_post_banner.jpg',
  'sync_and_verify.js'
]);

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Clear root assets directory first
const rootAssetsDir = path.join(repoRoot, 'assets');
if (fs.existsSync(rootAssetsDir)) {
  fs.rmSync(rootAssetsDir, { recursive: true, force: true });
}

// Copy everything from dist
const distItems = fs.readdirSync(distDir);
let copiedCount = 0;
for (const item of distItems) {
  const srcPath = path.join(distDir, item);
  const destPath = path.join(repoRoot, item);
  copyRecursiveSync(srcPath, destPath);
  copiedCount++;
}
console.log(`Synced ${copiedCount} items from dist to repo root.`);

// 2. VERIFICATION
console.log('\n--- 2. VERIFYING AGAINST BASELINE ---');

if (!fs.existsSync(baselinePath)) {
  console.error(`Baseline file not found at ${baselinePath}`);
  process.exit(1);
}

const baselineContent = fs.readFileSync(baselinePath, 'utf8');

// Parse baseline details
const baselinePages = {};
const pageRegex = /---\s+(https:\/\/trendmasterakademi\.com\/[^\s]*)\s+\([^)]+\)\s+---\r?\nKelime:\s*(\d+)\s*\|\s*Sema:\s*(\d+)\r?\nTitle:\s*([^\r\n]*)\r?\nDesc:\s*([^\r\n]*)/g;

let match;
while ((match = pageRegex.exec(baselineContent)) !== null) {
  const url = match[1].trim();
  baselinePages[url] = {
    words: parseInt(match[2], 10),
    schemas: parseInt(match[3], 10),
    title: match[4].trim(),
    desc: match[5].trim()
  };
}

console.log(`Parsed ${Object.keys(baselinePages).length} baseline pages.`);

// Read sitemap from repo root
const sitemapPath = path.join(repoRoot, 'sitemap.xml');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
const locMatches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].trim());

console.log(`Sitemap contains ${locMatches.length} URLs.`);

function extractHtmlDetails(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : html;
  const text = body.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                   .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                   .replace(/<[^>]+>/g, ' ')
                   .replace(/\s+/g, ' ')
                   .trim();
  const words = text ? text.split(/\s+/).length : 0;

  const schemas = (html.match(/<script type="application\/ld\+json">/g) || []).length;
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/i);

  return {
    words,
    schemas,
    title: titleMatch ? titleMatch[1].trim() : '',
    desc: descMatch ? descMatch[1].trim() : ''
  };
}

let mismatchedPages = 0;
let missingPages = 0;
const pageDiffs = [];

for (const url of locMatches) {
  const rel = url.replace('https://trendmasterakademi.com/', '').replace(/\/$/, '');
  const htmlPath = rel === '' ? path.join(repoRoot, 'index.html') : path.join(repoRoot, rel, 'index.html');

  if (!fs.existsSync(htmlPath)) {
    console.error(`MISSING HTML: ${htmlPath} for ${url}`);
    missingPages++;
    continue;
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const actual = extractHtmlDetails(html);
  const base = baselinePages[url] || baselinePages[url.replace(/\/$/, '')] || baselinePages[url + '/'];

  if (!base) {
    console.warn(`No baseline found for: ${url}`);
    continue;
  }

  const wordDiff = actual.words - base.words;
  const schemaDiff = actual.schemas - base.schemas;
  const titleDiff = actual.title !== base.title;
  const descDiff = actual.desc !== base.desc;

  if (wordDiff !== 0 || schemaDiff !== 0 || titleDiff || descDiff) {
    mismatchedPages++;
    pageDiffs.push({
      url,
      wordDiff,
      actualWords: actual.words,
      baseWords: base.words,
      schemaDiff,
      titleDiff: titleDiff ? { actual: actual.title, base: base.title } : null,
      descDiff: descDiff ? { actual: actual.desc, base: base.desc } : null
    });
  }
}

console.log(`\nURL Verification Summary:`);
console.log(`Total URLs: ${locMatches.length}`);
console.log(`Missing pages: ${missingPages}`);
console.log(`Mismatched pages: ${mismatchedPages}`);

if (pageDiffs.length > 0) {
  console.log(`\nPage Diffs:`);
  for (const diff of pageDiffs) {
    console.log(`- ${diff.url}:`);
    if (diff.wordDiff !== 0) console.log(`  Word count: actual ${diff.actualWords}, base ${diff.baseWords} (diff: ${diff.wordDiff})`);
    if (diff.schemaDiff !== 0) console.log(`  Schema diff: ${diff.schemaDiff}`);
    if (diff.titleDiff) console.log(`  Title diff: actual "${diff.titleDiff.actual}" vs base "${diff.titleDiff.base}"`);
    if (diff.descDiff) console.log(`  Desc diff: actual "${diff.descDiff.actual}" vs base "${diff.descDiff.base}"`);
  }
}

// Check PDFs SHA-256
console.log('\n--- 3. VERIFYING PDF SHA-256 HASHES ---');
const expectedPdfs = {
  'agency-kit/tma-agency-crash-test-500.pdf': '700ed063f84766b4ae875aaf1f6b60973309e1f97db4d771f4bc22063c5ebb3e',
  'agency-kit/tma-agency-response-kit.pdf': '2b7379cbd6b0a1f3f2acec38fbb92cef87ae9bd4bf5ebf8eaa1e62af3348f681',
  'sozlesme/tma-gizlilik-ve-calisma-sozlesmesi.pdf': '282805cfbabaf2ff91fa65fbd870b71e319c9c085e8dbc87bbf356e1e120c3c2'
};

let pdfErrors = 0;
for (const [relPath, expectedHash] of Object.entries(expectedPdfs)) {
  const fullPath = path.join(repoRoot, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`PDF missing: ${relPath}`);
    pdfErrors++;
    continue;
  }
  const buf = fs.readFileSync(fullPath);
  const actualHash = crypto.createHash('sha256').update(buf).digest('hex');
  if (actualHash !== expectedHash) {
    console.error(`PDF hash mismatch for ${relPath}: expected ${expectedHash}, got ${actualHash}`);
    pdfErrors++;
  } else {
    console.log(`PDF OK (${relPath}): ${actualHash}`);
  }
}

// Check CSS & HTML design criteria
console.log('\n--- 4. VERIFYING DESIGN SYSTEM TOKENS & FORBIDDEN STYLES ---');
const cssFiles = fs.readdirSync(path.join(repoRoot, 'assets')).filter(f => f.endsWith('.css'));
let cyanCount = 0;
let fontBlackCount = 0;
let gradientTextCount = 0;

for (const cssFile of cssFiles) {
  const cssContent = fs.readFileSync(path.join(repoRoot, 'assets', cssFile), 'utf8');
  
  // Check cyan
  const cyanMatches = cssContent.match(/#00e5ff|#22d3ee|#06b6d4|#0891b2|cyan/gi) || [];
  cyanCount += cyanMatches.length;

  // Check font-weight 900
  const fwMatches = cssContent.match(/font-weight:\s*900|font-black/gi) || [];
  fontBlackCount += fwMatches.length;

  // Check gradient text clipping
  const bctMatches = cssContent.match(/background-clip:\s*text|-webkit-background-clip:\s*text/gi) || [];
  gradientTextCount += bctMatches.length;
}

console.log(`CSS Cyan Count: ${cyanCount}`);
console.log(`CSS font-weight: 900 Count: ${fontBlackCount}`);
console.log(`CSS text-clip Count: ${gradientTextCount}`);

console.log('\n=== VERIFICATION COMPLETED ===');
process.exit(0);
