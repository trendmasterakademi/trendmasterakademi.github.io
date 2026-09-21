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
  const stripped = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
                       .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
                       .replace(/<[^>]+>/g, ' ')
                       .replace(/\s+/g, ' ')
                       .trim();
  const words = stripped ? stripped.split(/\s+/).length : 0;

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : html;

  // Content words (excluding common pre-render nav bar)
  const contentHtml = body.replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '');
  const contentText = contentHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                                 .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                                 .replace(/<[^>]+>/g, ' ')
                                 .replace(/\s+/g, ' ')
                                 .trim();
  const contentWords = contentText ? contentText.split(/\s+/).length : 0;

  const schemas = (html.match(/<script type="application\/ld\+json">/g) || []).length;
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/i);

  return {
    words,
    contentWords,
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

const approvedHexes = new Set([
  '#f5f6f7', '#ffffff', '#dce0e5', '#b8bfc8', '#7e8794',
  '#14181f', '#4a5461', '#68727f', '#c02430', '#8e1a23',
  '#fbeff0', '#0e1116', '#c7ceda', '#6f7b8c',
  '#e4636c', '#a85b12', '#5a6472',
  '#1f7a4d', '#25d366'
]);

const unapprovedHexes = new Map();

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

  // Find all 6-digit hex codes
  const hexMatches = cssContent.match(/#[0-9a-fA-F]{6}\b/gi) || [];
  for (const h of hexMatches) {
    const lower = h.toLowerCase();
    if (!approvedHexes.has(lower)) {
      unapprovedHexes.set(lower, (unapprovedHexes.get(lower) || 0) + 1);
    }
  }
}

console.log(`CSS Cyan Count: ${cyanCount}`);
console.log(`CSS font-weight: 900 Count: ${fontBlackCount}`);
console.log(`CSS text-clip Count: ${gradientTextCount}`);
console.log(`Unapproved 6-Digit Hex Count: ${unapprovedHexes.size}`);
if (unapprovedHexes.size > 0) {
  console.log('Unapproved Hexes found:', Object.fromEntries(unapprovedHexes));
}

// 5. Check 15 Anchor Pages Word Count (Adım 53: <body> içi, <script> ve <style> çıkarılmış, 1 karakterden uzun kelimeler)
console.log('\n--- 5. CHECKING 15 ANCHOR PAGES WORD COUNT ---');

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function extractBodyWords(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : html;
  const decoded = decodeEntities(body);
  const stripped = decoded
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .trim();
  const words = stripped.split(/\s+/).filter(w => w.length > 1);
  return words.length;
}

const anchorUrls = [
  { url: 'https://trendmasterakademi.com/', target: 506 },
  { url: 'https://trendmasterakademi.com/agency/', target: 525 },
  { url: 'https://trendmasterakademi.com/sos/', target: 189 },
  { url: 'https://trendmasterakademi.com/kit/', target: 103 },
  { url: 'https://trendmasterakademi.com/crash-test/', target: 313 },
  { url: 'https://trendmasterakademi.com/teshis/', target: 591 },
  { url: 'https://trendmasterakademi.com/teshis/ayni-stok-iki-musteriye-satildi/', target: 464 },
  { url: 'https://trendmasterakademi.com/sozluk/', target: 341 },
  { url: 'https://trendmasterakademi.com/sozluk/deadlock/', target: 208 },
  { url: 'https://trendmasterakademi.com/post-mortem/', target: 399 },
  { url: 'https://trendmasterakademi.com/about/', target: 249 },
  { url: 'https://trendmasterakademi.com/privacy/', target: 96 },
  { url: 'https://trendmasterakademi.com/sla/', target: 400 },
  { url: 'https://trendmasterakademi.com/radar/', target: 227 },
  { url: 'https://trendmasterakademi.com/triyaj/', target: 405 }
];

let anchorDeviations = 0;
for (const item of anchorUrls) {
  const rel = item.url.replace('https://trendmasterakademi.com/', '').replace(/\/$/, '');
  const htmlPath = rel === '' ? path.join(repoRoot, 'index.html') : path.join(repoRoot, rel, 'index.html');
  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, 'utf8');
    const bodyWords = extractBodyWords(html);
    const diff = bodyWords - item.target;
    if (diff !== 0) {
      anchorDeviations++;
      console.log(`ANCHOR DIFF: ${item.url} -> actual: ${bodyWords}, target: ${item.target} (diff: ${diff})`);
    } else {
      console.log(`ANCHOR OK: ${item.url} -> ${bodyWords} words (diff: 0)`);
    }
  } else {
    console.error(`ANCHOR MISSING: ${item.url}`);
    anchorDeviations++;
  }
}
console.log(`Anchor Pages Total Deviations: ${anchorDeviations}`);

// 6. Check Untouchable 3 Sections
console.log('\n--- 6. VERIFYING UNTOUCHABLE 3 SECTIONS ---');
const rootHtml = fs.readFileSync(path.join(repoRoot, 'index.html'), 'utf8');
const hasPreRenderTokens = rootHtml.includes('id="pre-render-tokens"');
console.log(`Pre-render tokens present: ${hasPreRenderTokens}`);

let hasFocusVisible = false;
let hasReducedMotion = false;
for (const cssFile of cssFiles) {
  const cssContent = fs.readFileSync(path.join(repoRoot, 'assets', cssFile), 'utf8');
  if (cssContent.includes(':focus-visible')) hasFocusVisible = true;
  if (cssContent.includes('prefers-reduced-motion')) hasReducedMotion = true;
}
console.log(`:focus-visible present: ${hasFocusVisible}`);
console.log(`prefers-reduced-motion present: ${hasReducedMotion}`);

// 7. Check Adım 53 Specific Criteria
console.log('\n--- 7. ADIM 53 CHECKS ---');

// 7.1 Text below 12px in source components
const srcDir = path.join(__dirname, 'src');
let textBelow12Count = 0;
function scanForSmallText(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanForSmallText(fullPath);
    } else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.js') || entry.name.endsWith('.css')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const matches = content.match(/text-\[(?:10|11)px\]|font-size:\s*(?:10|11)px/g) || [];
      if (matches.length > 0) {
        console.log(`Small text (<12px) in ${entry.name}: ${matches.length} matches`);
        textBelow12Count += matches.length;
      }
    }
  }
}
scanForSmallText(srcDir);
console.log(`Text below 12px count: ${textBelow12Count}`);

// 7.2 Pill Badges (rounded-full)
let pillCount = 0;
function scanForPills(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanForPills(fullPath);
    } else if (entry.name.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      // Look for badge-like rounded-full (excluding avatar circles or radio/check circles if any)
      const matches = content.match(/rounded-full/g) || [];
      // Count instances in badges/buttons
      pillCount += matches.length;
    }
  }
}
scanForPills(srcDir);
console.log(`Pill badges (rounded-full) in source: ${pillCount}`);

console.log('\n=== VERIFICATION COMPLETED ===');
process.exit(0);
