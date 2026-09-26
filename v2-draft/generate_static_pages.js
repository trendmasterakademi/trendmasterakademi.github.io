import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import zlib from 'zlib';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { CATEGORY_DEFS, getDil, getKategori, getCleanTitle, getPagesForLang } from './src/data/categoryMap.js';
import { glossaryTerms, getGlossaryH1, glossaryHubH1 } from './src/data/glossaryData.js';
import { teshisData } from './src/data/teshisData.js';
import { diagnosticLogEnMap } from './src/data/diagnosticLogEnMap.js';
import { postMortems, postMortemDisclosure, getPostMortemH1, postMortemHubH1 } from './src/data/postMortemData.js';
import { triageScenarios, triageH1 } from './src/data/triageData.js';
import { siddetEtiketi } from './src/data/siddetData.js';
import { slaTiers, coreCommitments, slaScope, slaH1 } from './src/data/slaData.js';
import { techStackData, techStackH1 } from './src/data/techStackData.js';
import { ndaData, mutualNdaH1 } from './src/data/ndaData.js';
import { ndaFullAgreementData } from './src/data/ndaFullAgreementData.js';
import { outageSimulatorData, outageSimulatorH1 } from './src/data/outageSimulatorData.js';
import { radarData, radarH1 } from './src/data/radarData.js';
import { codeHealthData, codeHealthH1 } from './src/data/codeHealthData.js';
import { rescueRoiData, rescueRoiH1 } from './src/data/rescueRoiData.js';
import { agencyKitData, agencyKitH1, crashTestH1 } from './src/data/agencyKitData.js';
import { seoData, ogImageAlt } from './src/data/seoData.js';
import { agencyH1, handoverAuditH1, downtimeCostH1, aboutH1, storyH1, salvageabilityH1, teshisCatalogH1, sosH1, privacyH1, tmaiH1 } from './src/data/pageH1Data.js';
import { tmaiData, tmaiYollar, tmaiAraclar } from './src/data/tmaiData.js';
import { agencyGiris } from './src/data/mesajData.js';
import { kesintiYontem, peakPresets } from './src/data/kesintiYontemData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function getGitDates(relativeFilePath) {
  try {
    const mod = execSync(`git log -1 --format=%cI -- "${relativeFilePath}"`, { cwd: repoRoot, encoding: 'utf8' }).trim();
    const pubOut = execSync(`git log --diff-filter=A --format=%cI -- "${relativeFilePath}"`, { cwd: repoRoot, encoding: 'utf8' }).trim();
    const pub = pubOut.split('\n').filter(Boolean).pop() || mod;
    return {
      dateModified: mod || null,
      datePublished: pub || null
    };
  } catch (err) {
    console.warn(`[GIT DATE WARNING] Could not read git dates for ${relativeFilePath}: ${err.message}`);
    return { dateModified: null, datePublished: null };
  }
}

function cleanLogForQuestion(log) {
  if (!log) return '';
  return log.split('←')[0].replace(/\s+/g, ' ').trim();
}

function resolveText(val, lang = 'tr') {
  if (val == null) return '';
  if (typeof val === 'object') {
    return val[lang] || val.tr || val.en || '';
  }
  return String(val);
}

function formatPageTitle(baseTitle) {
  const brandSuffix = ' | Trend Master Akademi';
  const fullTitle = `${baseTitle}${brandSuffix}`;
  if (fullTitle.length <= 60) {
    return fullTitle;
  }
  return baseTitle;
}

const distDir = path.join(__dirname, 'dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('dist/index.html not found! Run vite build first.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

// Teşhis veri bütünlüğünü (A-F) sayfa üretiminden hemen önce doğrula
verifyTeshisIntegrity();

// 2.0 — Kaynak tekilleştirme: Hero.jsx ve FAQ.jsx'ten verileri doğrudan oku
const heroContent = fs.readFileSync(path.join(__dirname, 'src/components/Hero.jsx'), 'utf8');
const heroMatch = heroContent.match(/export const diagnosticLogs = (\[[\s\S]*?\]);\s*\/\//);
const diagnosticLogs = heroMatch ? new Function('return ' + heroMatch[1])() : [];

const faqContent = fs.readFileSync(path.join(__dirname, 'src/components/FAQ.jsx'), 'utf8');
const cleanFaq = faqContent.match(/export const faqData = (\[[\s\S]*?\]);\s*const FAQ/)[1].replace(/icon:\s*[A-Za-z0-9_]+,/g, '');
const faqData = new Function('return ' + cleanFaq)();

// 2.0b — Kaynak tekilleştirme: Agency.jsx, CrashTest.jsx ve DevirKontrolu.jsx'ten verileri doğrudan oku
const agencyContent = fs.readFileSync(path.join(__dirname, 'src/pages/Agency.jsx'), 'utf8');
const capabilitiesMatch = agencyContent.match(/const capabilities = (\[[\s\S]*?\]);\s*const situationQuotes/);
const capabilities = capabilitiesMatch ? new Function('return ' + capabilitiesMatch[1])() : [];

const situationQuotesMatch = agencyContent.match(/const situationQuotes = (\[[\s\S]*?\]);\s*const Agency/);
const situationQuotes = situationQuotesMatch ? new Function('return ' + situationQuotesMatch[1])() : [];

const crashContent = fs.readFileSync(path.join(__dirname, 'src/pages/CrashTest.jsx'), 'utf8');
const scenariosMatch = crashContent.match(/const scenarios = (\[[\s\S]*?\]);\s*function getMatchedDiagnosis/);
const cleanScenarios = scenariosMatch ? scenariosMatch[1].replace(/icon:\s*[A-Za-z0-9_]+,?/g, '') : '';
const scenarios = cleanScenarios ? new Function('return ' + cleanScenarios)() : [];

const devirContent = fs.readFileSync(path.join(__dirname, 'src/pages/DevirKontrolu.jsx'), 'utf8');
const handoverMatch = devirContent.match(/const handoverItems = (\[[\s\S]*?\]);\s*const DevirKontrolu/);
const cleanHandover = handoverMatch ? handoverMatch[1].replace(/icon:\s*[A-Za-z0-9_]+,?/g, '') : '';
const handoverItems = cleanHandover ? new Function('return ' + cleanHandover)() : [];

// 2.0c — Kendini doğrulama (guard)
if (!Array.isArray(situationQuotes) || situationQuotes.length !== 6) {
  console.error(`[HATA] situationQuotes 6 eleman olmalı, bulunan: ${situationQuotes?.length}`);
  process.exit(1);
}
if (!Array.isArray(capabilities) || capabilities.length !== 20) {
  console.error(`[HATA] capabilities 20 eleman olmalı, bulunan: ${capabilities?.length}`);
  process.exit(1);
}
if (!Array.isArray(scenarios) || scenarios.length !== 5) {
  console.error(`[HATA] scenarios 5 eleman olmalı, bulunan: ${scenarios?.length}`);
  process.exit(1);
}
if (!Array.isArray(handoverItems) || handoverItems.length !== 12) {
  console.error(`[HATA] handoverItems 12 eleman olmalı, bulunan: ${handoverItems?.length}`);
  process.exit(1);
}

// 3.4 — HTML Kaçış Fonksiyonu (Yalnızca HTML gövdesi için)
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function unescapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// Ortak Kurumsal JSON-LD Düğümleri
const professionalServiceNode = {
  "@type": "ProfessionalService",
  "@id": "https://trendmasterakademi.com/#organization",
  "name": "Trend Master Akademi",
  "alternateName": "TMA Studio & Labs",
  "legalName": "Mehmet Şahin",
  "taxID": "7930336132",
  "url": "https://trendmasterakademi.com",
  "logo": "https://trendmasterakademi.com/logo-dark.png",
  "image": "https://trendmasterakademi.com/og-image.jpg",
  "description": "Dijital ajanslar, SaaS girişimleri ve teknoloji şirketleri için B2B White-Label Mühendislik Masası, Acil Kod Kurtarma (SWAT), API Entegrasyonu ve Özel Yazılım Geliştirme Stüdyosu.",
  "founder": {
    "@type": "Person",
    "name": "Mehmet Şahin",
    "jobTitle": "Kurucu & Baş Yazılım Mimarı (Lead Architect)",
    "image": "https://trendmasterakademi.com/images/mehmet-sahin-480.jpg",
    "url": "https://trendmasterakademi.com/about/"
  },
  "telephone": "+905343713573",
  "email": "info@trendmasterakademi.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091",
    "addressLocality": "Konak",
    "addressRegion": "İzmir",
    "addressCountry": "TR"
  },
  "priceRange": "$$$",
  "openingHours": "Mo-Su 09:00-24:00",
  "sameAs": [
    "https://www.linkedin.com/in/trendmasterakademi/"
  ],
  "areaServed": {
    "@type": "Country",
    "name": "Türkiye"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "B2B SWAT & Mühendislik Hizmetleri",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Acil Kod Kurtarma & Canlı Sistem Hotfix (Incident SWAT)",
          "description": "HTTP 500 hataları, veritabanı kilitlenmeleri ve ödeme API kopmalarında acil müdahale."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Yarım Kalan Proje Devralma (Abandoned Codebase Takeover)",
          "description": "Önceki geliştiriciden kalan dokümantasyonsuz ve spagetti kod tabanlarının onarılması ve yayına alınması."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "B2B %100 White-Label Mühendislik & Kapasite Takviyesi",
          "description": "Ajansların arka planında görünmez teknik ekip olarak resmi NDA altında proje teslimi."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "SaaS & Özel Web Uygulaması Mimarisi",
          "description": "React, Next.js, Python/FastAPI ve Node.js ile sıfırdan ölçeklenebilir web ve bulut sistemleri."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Yapay Zeka, LLM & Akıllı Otomasyon Entegrasyonları",
          "description": "OpenAI, LLM, RAG ve akıllı agent iş akışlarının şirket içi süreçlere entegrasyonu."
        }
      }
    ]
  }
};

const webSiteNode = {
  "@type": "WebSite",
  "@id": "https://trendmasterakademi.com/#website",
  "url": "https://trendmasterakademi.com",
  "name": "Trend Master Akademi",
  "publisher": {
    "@id": "https://trendmasterakademi.com/#organization"
  },
  "inLanguage": ["tr-TR", "en-US"]
};

// 2.1 — /teshis/ Katalog Hub'ı İçeriği (${teshisData.length} Teşhis)
const teshisHubExtraContent = `
  <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
    <h2 class="text-xl font-bold text-[var(--ink)]">Yayınlanmış arıza kataloğu — ${teshisData.length} teşhis</h2>
    <ul class="space-y-4">
      ${teshisData.map(item => {
        const firstSentence = item.ozet?.tr ? (item.ozet.tr.split('.')[0] + '.') : '';
        return `
        <li class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <a href="/teshis/${escapeHtml(item.slug)}/" class="text-[var(--accent)] font-bold hover:underline font-mono text-base">→ ${escapeHtml(item.no)} · ${escapeHtml(item.baslik?.tr || '')}</a>
            <span class="text-xs font-mono text-[var(--ink-3)]">${escapeHtml(item.aciliyet?.etiket?.tr || '')} · ${escapeHtml(item.kirinti?.tr || '')}</span>
          </div>
          <p class="text-sm text-[var(--ink-3)] leading-relaxed">${escapeHtml(firstSentence)}</p>
        </li>`;
      }).join('\n      ')}
    </ul>
  </section>
`;

const teshisHubExtraContentEn = `
  <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
    <h2 class="text-xl font-bold text-[var(--ink)]">Published Incident Catalog — ${teshisData.length} Diagnoses</h2>
    <ul class="space-y-4">
      ${teshisData.map(item => {
        const firstSentence = item.ozet?.en ? (item.ozet.en.split('.')[0] + '.') : '';
        return `
        <li class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <a href="/diagnostic/${escapeHtml(item.slug)}/" class="text-[var(--accent)] font-bold hover:underline font-mono text-base">→ ${escapeHtml(item.no)} · ${escapeHtml(item.baslik?.en || item.baslik?.tr || '')}</a>
            <span class="text-xs font-mono text-[var(--ink-3)]">${escapeHtml(item.aciliyet?.etiket?.en || '')} · ${escapeHtml(item.kirinti?.en || '')}</span>
          </div>
          <p class="text-sm text-[var(--ink-3)] leading-relaxed">${escapeHtml(firstSentence)}</p>
        </li>`;
      }).join('\n      ')}
    </ul>
  </section>
`;

// 2.2 — /sozluk/ Sözlük Hub'ı İçeriği (12 Terim)
const glossaryHubExtraContent = `
  <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
    <h2 class="text-xl font-bold text-[var(--ink)]">Terim sözlüğü — 12 terim</h2>
    <ul class="space-y-4">
      ${glossaryTerms.map(term => {
        const firstSentence = term.shortDef?.tr ? (term.shortDef.tr.split('.')[0] + '.') : '';
        return `
        <li class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <a href="/sozluk/${escapeHtml(term.slug)}/" class="text-[var(--accent)] font-bold hover:underline font-mono text-base">→ ${escapeHtml(term.title)}</a>
            <span class="text-xs font-mono text-[var(--tint-warn-ink)]">${escapeHtml(term.urgencyLevel || '')}</span>
          </div>
          <p class="text-sm text-[var(--ink-3)] leading-relaxed">${escapeHtml(firstSentence)}</p>
        </li>`;
      }).join('\n      ')}
    </ul>
  </section>
`;

const glossaryHubExtraContentEn = `
  <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
    <h2 class="text-xl font-bold text-[var(--ink)]">Technical Glossary — 12 Terms</h2>
    <ul class="space-y-4">
      ${glossaryTerms.map(term => {
        const firstSentence = term.shortDef?.en ? (term.shortDef.en.split('.')[0] + '.') : '';
        return `
        <li class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <a href="/glossary/${escapeHtml(term.slug)}/" class="text-[var(--accent)] font-bold hover:underline font-mono text-base">→ ${escapeHtml(term.titleEn || term.title)}</a>
            <span class="text-xs font-mono text-[var(--tint-warn-ink)]">${escapeHtml(term.urgencyLevelEn || term.urgencyLevel || '')}</span>
          </div>
          <p class="text-sm text-[var(--ink-3)] leading-relaxed">${escapeHtml(firstSentence)}</p>
        </li>`;
      }).join('\n      ')}
    </ul>
  </section>
`;

// 2.3 — Ana Sayfa Şerit Log Eşleşmeleri ve SSS Bölümü (Hero.jsx ve FAQ.jsx'ten okunan veriler)
const homeFaqHtml = `
  <section class="space-y-4 mt-8 border-t border-[var(--rule)] pt-6">
    <h2 class="text-xl font-bold text-[var(--ink)]">Sıkça Sorulan Sorular</h2>
    <div class="space-y-4">
      ${faqData.map(item => `
        <div class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
          <h3 class="text-lg font-bold text-[var(--accent)]">${escapeHtml(item.question?.tr || '')}</h3>
          <p class="text-[var(--ink-3)] leading-relaxed text-sm sm:text-base">${escapeHtml(item.answer?.tr || '')}</p>
        </div>
      `).join('\n      ')}
    </div>
  </section>
`;

const homeFounderHtml = `
  <section class="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-4 mt-8">
    <h3 class="text-xl font-bold text-[var(--ink)]">Mehmet Şahin</h3>
    <p class="text-xs font-mono text-[var(--accent)] font-medium">Kurucu & Baş Yazılım Mimarı (Lead Architect)</p>
    <picture class="flex-shrink-0 block">
      <source type="image/avif" srcset="/images/mehmet-sahin-320.avif 1x, /images/mehmet-sahin-480.avif 2x" />
      <source type="image/webp" srcset="/images/mehmet-sahin-320.webp 1x, /images/mehmet-sahin-480.webp 2x" />
      <img src="/images/mehmet-sahin-320.jpg" srcset="/images/mehmet-sahin-480.jpg 2x" alt="Mehmet Şahin — Kurucu & Baş Yazılım Mimarı" width="260" height="260" loading="lazy" decoding="async" class="w-[160px] h-[160px] md:w-[200px] md:h-[200px] lg:w-[260px] lg:h-[260px] rounded-[var(--r-panel)] border border-[var(--rule)] object-cover shadow-sm" />
    </picture>
    <p class="text-[var(--ink-3)] leading-relaxed text-sm sm:text-base">Yirmi yılı aşkın süredir finansal piyasaların, on yılı aşkın süredir de algoritmik yazılımların ve yüksek erişilebilirlikli sunucu altyapılarının içindeyim. Yıllarca yalnızca kendi sistemlerimi yazdım, kendi mimarimi koda döktüm ve kendi hatalarımı ayıkladım.</p>
  </section>
`;

const homePageExtraContent = `
  <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
    <h2 class="text-xl font-bold text-[var(--ink)]">Sisteminizde bu satırları görüyorsanız</h2>
    <ul class="space-y-3">
      ${diagnosticLogs.map(entry => {
        const slug = entry.href.replace(/^\/teshis\/|\/$/g, '');
        const item = teshisData.find(d => d.slug === slug);
        const titleText = item ? `${item.no} · ${item.baslik.tr}` : (entry.title?.tr || slug);
        return `
        <li class="p-3 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-1 font-mono text-sm">
          <div class="text-[var(--ink-3)]"><code>${escapeHtml(entry.log)}</code></div>
          <div><a href="/teshis/${escapeHtml(slug)}/" class="text-[var(--accent)] hover:underline font-bold">→ ${escapeHtml(titleText)}</a></div>
        </li>`;
      }).join('\n      ')}
    </ul>
    <p class="pt-2">
      <a href="/teshis/" class="text-[var(--accent)] hover:underline font-bold">Tüm teşhis kataloğunu inceleyin (${teshisData.length} belirti) →</a>
    </p>
  </section>
  ${homeFounderHtml}
  ${homeFaqHtml}
`;

const homeDirectoryHtml = `
  <section class="space-y-8 mt-10 border-t border-[var(--rule)] pt-8">
    <div class="space-y-2">
      <span class="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">Tüm Sayfalar</span>
      <h2 class="text-2xl sm:text-3xl font-bold font-serif text-[var(--ink)] tracking-tight">Tüm sayfalar</h2>
    </div>
    ${CATEGORY_DEFS.map(cat => {
      const catPages = getPagesForLang('tr').filter(p => p.kategori === cat.id);
      return `
      <section class="space-y-4">
        <h2 class="text-xl font-bold font-serif text-[var(--ink)]">${escapeHtml(cat.tr)}</h2>
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${catPages.map(page => `
            <li class="p-3 rounded-xl bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--rule-strong)] transition-colors">
              <a href="${escapeHtml(page.url)}" class="text-[var(--accent)] hover:underline font-medium block">
                ${escapeHtml(page.baslik)}
              </a>
            </li>
          `).join('\n          ')}
        </ul>
      </section>`;
    }).join('\n    ')}
  </section>
`;

const overviewPageExtraContent = `
  <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
    <h2 class="text-xl font-bold text-[var(--ink)]">If you see these lines in your system</h2>
    <ul class="space-y-3">
      ${diagnosticLogs.map(entry => {
        const slug = entry.href.replace(/^\/teshis\/|\/$/g, '');
        const item = teshisData.find(d => d.slug === slug);
        const titleText = item ? `${item.no} · ${item.baslik.en || item.baslik.tr}` : (entry.title?.en || entry.title?.tr || slug);
        return `
        <li class="p-3 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-1 font-mono text-sm">
          <div class="text-[var(--ink-3)]"><code>${escapeHtml(entry.log)}</code></div>
          <div><a href="/diagnostic/${escapeHtml(slug)}/" class="text-[var(--accent)] hover:underline font-bold">→ ${escapeHtml(titleText)}</a></div>
        </li>`;
      }).join('\n      ')}
    </ul>
    <p class="pt-2">
      <a href="/diagnostic/" class="text-[var(--accent)] hover:underline font-bold">Browse the complete diagnostic catalog (${teshisData.length} symptoms) →</a>
    </p>
  </section>
  <section class="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-4 mt-8">
    <h3 class="text-xl font-bold text-[var(--ink)]">Mehmet Şahin</h3>
    <p class="text-xs font-mono text-[var(--accent)] font-medium">Founder & Lead Software Architect</p>
    <picture class="flex-shrink-0 block">
      <source type="image/avif" srcset="/images/mehmet-sahin-320.avif 1x, /images/mehmet-sahin-480.avif 2x" />
      <source type="image/webp" srcset="/images/mehmet-sahin-320.webp 1x, /images/mehmet-sahin-480.webp 2x" />
      <img src="/images/mehmet-sahin-320.jpg" srcset="/images/mehmet-sahin-480.jpg 2x" alt="Mehmet Şahin — Founder & Lead Software Architect" width="260" height="260" loading="lazy" decoding="async" class="w-[160px] h-[160px] md:w-[200px] md:h-[200px] lg:w-[260px] lg:h-[260px] rounded-[var(--r-panel)] border border-[var(--rule)] object-cover shadow-sm" />
    </picture>
    <p class="text-[var(--ink-3)] leading-relaxed text-sm sm:text-base">I have spent over two decades in financial markets and more than a decade architecting algorithmic software and high-availability server infrastructures. For years, I exclusively built my own systems, translated my own architecture into code, and resolved my own failures.</p>
  </section>
  <section class="space-y-4 mt-8 border-t border-[var(--rule)] pt-6">
    <h2 class="text-xl font-bold text-[var(--ink)]">Frequently Asked Questions</h2>
    <div class="space-y-4">
      ${faqData.map(item => `
        <div class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
          <h3 class="text-lg font-bold text-[var(--accent)]">${escapeHtml(item.question?.en || item.question?.tr || '')}</h3>
          <p class="text-[var(--ink-3)] leading-relaxed text-sm sm:text-base">${escapeHtml(item.answer?.en || item.answer?.tr || '')}</p>
        </div>
      `).join('\n      ')}
    </div>
  </section>
`;

const aboutExtraContent = `
  <section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6">
    <h2 class="text-2xl font-bold text-[var(--ink)] tracking-tight">Altı Temel Taahhüdümüz</h2>
    <p class="text-[var(--ink-3)] leading-relaxed">Ajanslarla çalışırken taviz vermediğimiz altı kural:</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
      ${coreCommitments.map(c => `
      <div class="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-lg font-bold text-[var(--accent)]">${escapeHtml(c.no)} · ${escapeHtml(c.title?.tr || '')}</h3>
        <p class="text-[var(--ink-3)] text-sm leading-relaxed">${escapeHtml(c.desc?.tr || '')}</p>
        ${c.no === '02' ? '<p class="pt-2"><a href="/nda/" class="text-[var(--accent)] hover:underline font-bold font-mono text-xs">Sözleşmeyi okuyun →</a></p>' : ''}
      </div>`).join('\n      ')}
    </div>
    <p class="text-[var(--ink-3)] text-sm pt-2">
      Trend Master Akademi adı nereden geliyor? <a href="/hikayemiz/" class="text-[var(--accent)] hover:underline font-bold">Kuruluş hikâyemizi okuyun →</a>
    </p>
  </section>
`;

const storyExtraContent = `
  <section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6 text-[var(--ink-3)] leading-relaxed">
    <h2 class="text-2xl font-bold text-[var(--ink)] tracking-tight">Kuruluş Hikâyemiz ve Vizyonumuz</h2>
    <p>Aslında bu iş fikri bir online derste doğdu.</p>
    <p>Yirmi yıldır finansal piyasaların içerisindeydim. Yazılım hep işimin ayrılmaz bir parçasıydı ama uzun süre yalnızca kendim için: kendi sistemlerimi yazdım, kendi fikirlerimi koda döktüm, kendi hatalarımı kendim ayıkladım. Dışarıya iş yapmıyordum, yapmak da istemiyordum. Yirmi yıl boyunca bunun tek kişilik bir iş olduğunu, ancak kendime yetebileceğimi sanıyordum.</p>
    <p>2020'de, COVID salgınında her şeyin durduğu ve herkesin kıtlık konuştuğu dönemde bildiklerimi anlatmaya başladım. Yaklaşık elli kişi eğittim. Öğretmek beni değiştirdi: yirmi yıldır sezgiyle yaptığım her şeyi başkalarının anlayabileceği hâle getirmek her şeyi sistemleştirdi.</p>
    <p class="font-bold text-[var(--ink)]">Trend Master Akademi fikri o online derslerde doğdu. Adımız oradan geliyor ve değiştirmedik.</p>
    <p>Kursiyerlerden biriyle ortak olduktan sonra asıl ihtiyacın sınıfta değil sahada olduğunu gördük. Özellikle pandemiden sonra dijital ajanslarda ciddi bir nitelikli yazılımcı darboğazı oluşmuştu. Yarım kalmış projeler, kaybolmuş erişimler, geçmiş teslim tarihleri ve krizler... Bu projeleri devralıp tek tek ayağa kaldırdık.</p>
    <p>Bugün yaptığımız iş bu: biz bir son kullanıcı ajansı değiliz. Dijital ajansların, yazılım evlerinin ve girişimlerin arka planında krizleri çözen, karmaşık mimarileri kuran ve %100 White-Label çalışan kıdemli bir mühendislik masasıyız.</p>
    <p>Adımız hâlâ "Akademi" — çünkü bir sistemi kurtarmak, onu anlatabilecek kadar anlamayı gerektirir. Sitemizdeki <a href="/sozluk/" class="text-[var(--accent)] hover:underline">Teknik Terim Sözlüğü</a> ve <a href="/teshis/" class="text-[var(--accent)] hover:underline">Teşhis Kataloğu</a> da bu anlayışla yayındadır.</p>
  </section>
`;

const storyExtraContentEn = `
  <section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6 text-[var(--ink-3)] leading-relaxed">
    <h2 class="text-2xl font-bold text-[var(--ink)] tracking-tight">Our Story & Founding Origins</h2>
    <p>This business actually started in an online class.</p>
    <p>I spent twenty years inside financial markets. Software was always inseparable from that work — but for a long time only for myself: I wrote my own systems, turned my own ideas into code, debugged my own mistakes. I didn't work for anyone else, and I didn't want to. For twenty years I believed this was a one-person job, that I only ever needed to be enough for myself.</p>
    <p>In 2020, when COVID stopped everything and everyone was talking about scarcity, I started teaching what I knew. I ended up training around fifty people. Teaching changed me: having to turn twenty years of instinct into something another person could follow changed everything, bringing discipline to what had been scattered.</p>
    <p class="font-bold text-[var(--ink)]">The idea for Trend Master Akademi was born in those online classes. That is where our name comes from, and we never changed it.</p>
    <p>After partnering with one of those students, we both saw that the real need was in the field, not the classroom. Digital agencies were facing a severe bottleneck of qualified software engineers. Abandoned codebases, lost credentials, missed delivery deadlines, and escalating crises... We took over these troubled projects and brought them to completion one by one.</p>
    <p>That is what we do today: we are not an end-client agency. We are a senior engineering back-office operating 100% white-label behind digital agencies, software houses, and startups to resolve production crises and build resilient architectures.</p>
    <p>Our name remains "Akademi" — because rescuing a system requires understanding it deeply enough to explain it. Our <a href="/glossary/" class="text-[var(--accent)] hover:underline">Technical Glossary</a> and <a href="/diagnostic/" class="text-[var(--accent)] hover:underline">Diagnostic Catalog</a> are published with this exact philosophy.</p>
  </section>
`;

// Kesinti maliyeti — ön-render yöntem metni tek kaynaktan (src/data/kesintiYontemData.js). Adım 81.
const renderKesintiExtra = (lang) => {
  const y = kesintiYontem[lang];
  const carpan = (f) => (lang === 'en' ? `${f.toFixed(1)}×` : `${f.toFixed(1).replace('.', ',')}×`);
  return `
<section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6">
<h2 class="text-2xl font-bold text-[var(--ink)] tracking-tight">${escapeHtml(y.baslik)}</h2>
<div class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] font-mono text-sm text-[var(--accent)]">
<p>${escapeHtml(y.formul)}</p>
</div>
<ul class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
${peakPresets.map(p => `<li class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-sm"><strong class="text-[var(--ink)]">${escapeHtml(p.label[lang])}</strong> · ${carpan(p.factor)}</li>`).join('\n')}
</ul>
${y.paragraflar.map(t => `<p class="text-[var(--ink-3)] text-sm leading-relaxed">${escapeHtml(t)}</p>`).join('\n')}
</section>
`;
};
const kesintiExtraContent = renderKesintiExtra('tr');
const kesintiExtraContentEn = renderKesintiExtra('en');

const sosPageExtraContent = `
  <section class="space-y-6">
    <div class="p-4 rounded-xl bg-[var(--tint-warn-bg)] border border-[var(--tint-warn-rule)] text-[var(--tint-warn-ink)] text-sm">
      <span>Kriz hattı her gün 09:00 – 24:00 açık · canlı kesintilerde ilk yanıt taahhüdü 15 dakika.</span>
    </div>
    <div class="flex flex-wrap gap-4 text-sm font-semibold">
      <a href="tel:+905343713573" class="text-[var(--accent)] hover:underline">+90 534 371 35 73</a>
      <a href="https://wa.me/905343713573" target="_blank" rel="noopener" class="text-[var(--tint-ok-ink)] hover:underline">WhatsApp'tan yaz</a>
    </div>
    <div class="space-y-3">
      <h2 class="text-xl font-bold text-[var(--ink)]">Yazarken şunları ekleyin</h2>
      <ol class="list-decimal list-inside space-y-2 text-[var(--ink-3)]">
        <li>Ajans adı ve size ulaşılacak numara</li>
        <li>Ne oldu: hata ekranı, hata satırı ya da sistemin davranışı</li>
        <li>Ne zaman başladı ve o sırada ne değişti (yayın, güncelleme, ödeme sağlayıcı)</li>
        <li>Erişim var mı: sunucu, repo, panel — yoksa da yazın, teşhis için şart değil</li>
      </ol>
      <p class="text-sm text-[var(--ink-3)] italic">İlk teşhis için şifre ya da repo erişimi istemiyoruz.</p>
    </div>
    <div class="space-y-3 pt-4 border-t border-[var(--rule)]">
      <h2 class="text-xl font-bold text-[var(--ink)]">Aciliyet yoksa</h2>
      <ul class="space-y-2 text-[var(--ink-3)]">
        <li><a href="/crash-test/" class="text-[var(--accent)] hover:underline">60 saniyelik Agency Crash Test ile durumu kendiniz teşhis edin</a></li>
        <li><a href="/teshis/" class="text-[var(--accent)] hover:underline">${teshisData.length} arızanın belgelenmiş teşhis kataloğu</a></li>
      </ul>
    </div>
  </section>
`;

const agencyExtraContent = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-[var(--ink)]">Ajansların bize geldiği altı durum</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${situationQuotes.map(sq => `
        <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
          <h3 class="text-base font-bold text-[var(--accent)] font-mono">${escapeHtml(sq.tag?.tr || '')}</h3>
          <p class="text-[var(--ink-3)] text-sm leading-relaxed">${escapeHtml(sq.quote?.tr || '')}</p>
        </article>`).join('\n        ')}
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="text-xl font-bold text-[var(--ink)]">Teknik yetkinlikler</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${capabilities.map(cap => `
        <article class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-1">
          <h3 class="text-sm font-bold text-[var(--accent)] font-mono">${escapeHtml(cap.title?.tr || '')} · ${escapeHtml(cap.cat || '')}</h3>
          <p class="text-[var(--ink-3)] text-xs leading-relaxed">${escapeHtml(cap.desc?.tr || '')}</p>
        </article>`).join('\n        ')}
      </div>
    </div>
  </section>
`;

const crashTestExtraContent = `
  <section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-3)] font-mono">
      <div><strong class="text-[var(--ink)] block text-sm">60 Saniye</strong> Ortalama test süresi</div>
      <div><strong class="text-[var(--tint-ok-ink)] block text-sm">0 Erişim</strong> Şifre veya repo erişimi istemez</div>
      <div><strong class="text-[var(--accent)] block text-sm">1 Teşhis</strong> Doğrudan arıza kataloğu eşleşmesi ve eylem reçetesi</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Testin kapsadığı beş kriz senaryosu</h2>
    <div class="space-y-4">
      ${scenarios.map(sc => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span class="text-[var(--accent)] font-bold">${escapeHtml(sc.tag?.tr || '')}</span>
          <span class="text-[var(--ink-3)]">${escapeHtml(sc.code || '')}</span>
        </div>
        <h3 class="text-lg font-bold text-[var(--ink)]">${escapeHtml(sc.title?.tr || '')}</h3>
        <p class="text-[var(--ink-3)] text-sm leading-relaxed">${escapeHtml(sc.subtitle?.tr || '')}</p>
        <div class="space-y-1 pt-1 border-t border-[var(--rule)]">
          <p class="text-xs font-semibold text-[var(--ink-3)] font-mono">Senaryoda değerlendirilen sorular:</p>
          <ul class="list-disc list-inside space-y-1 text-xs text-[var(--ink-3)] font-mono">
            ${(sc.questions || []).map(q => `
            <li>${escapeHtml(q.label?.tr || '')}</li>`).join('\n            ')}
          </ul>
        </div>
      </article>`).join('\n      ')}
    </div>
  </section>
`;

const devirExtraContent = `
  <section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6">
    <p class="text-sm text-[var(--ink-2)]"><a href="${tmaiYollar.tr}" class="text-[var(--accent)] hover:underline">${escapeHtml(tmaiAraclar.secenek.tr)} →</a></p>
    <h2 class="text-xl font-bold text-[var(--ink)]">Kontrol edilen 12 kalem</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${handoverItems.map(item => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">${escapeHtml(item.title?.tr || '')}</h3>
        <p class="text-[var(--ink-3)] text-sm leading-relaxed">${escapeHtml(item.desc?.tr || '')}</p>
        <p class="text-xs font-mono text-[var(--ink-3)]">Ağırlık: ${escapeHtml(item.weight)} puan</p>
      </article>`).join('\n      ')}
    </div>
  </section>
`;

const devirExtraContentEn = `
  <section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6">
    <p class="text-sm text-[var(--ink-2)]"><a href="${tmaiYollar.en}" class="text-[var(--accent)] hover:underline">${escapeHtml(tmaiAraclar.secenek.en)} →</a></p>
    <h2 class="text-xl font-bold text-[var(--ink)]">12 Critical Checkpoints Audited</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${handoverItems.map(item => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">${escapeHtml(item.title?.en || item.title?.tr || '')}</h3>
        <p class="text-[var(--ink-3)] text-sm leading-relaxed">${escapeHtml(item.desc?.en || item.desc?.tr || '')}</p>
        <p class="text-xs font-mono text-[var(--ink-3)]">Weight: ${escapeHtml(item.weight)} points</p>
      </article>`).join('\n      ')}
    </div>
  </section>
`;

const DOT_LINE_64 = '.'.repeat(64);

const ndaExtraContent = `
  <section class="space-y-12 mt-8 border-t border-[var(--rule)] pt-8">
    <!-- Section 1 -->
    <section class="space-y-6">
      <h2 class="text-2xl font-serif font-semibold text-[var(--ink)] border-b border-[var(--rule)] pb-4">
        ${escapeHtml(ndaFullAgreementData.whatItGivesYou.title.tr)}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${ndaFullAgreementData.whatItGivesYou.items.map(item => `
          <div class="p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
            <h3 class="text-base font-semibold font-serif text-[var(--ink)]">${escapeHtml(item.title.tr)}</h3>
            <p class="text-xs sm:text-sm text-[var(--ink-3)] leading-relaxed">${escapeHtml(item.desc.tr)}</p>
          </div>
        `).join('\n        ')}
      </div>
    </section>

    <!-- Section 2 -->
    <section class="space-y-6">
      <div class="border-b border-[var(--rule)] pb-4 mb-6">
        <h2 class="text-2xl font-serif font-semibold text-[var(--ink)]">
          ${escapeHtml(ndaFullAgreementData.protectsUsToo.title.tr)}
        </h2>
        <p class="text-[var(--ink-3)] text-xs sm:text-sm mt-2 leading-relaxed">
          ${escapeHtml(ndaFullAgreementData.protectsUsToo.lead.tr)}
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${ndaFullAgreementData.protectsUsToo.items.map(item => `
          <div class="p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
            <h3 class="text-base font-semibold font-serif text-[var(--ink)]">${escapeHtml(item.title.tr)}</h3>
            <p class="text-xs sm:text-sm text-[var(--ink-3)] leading-relaxed">${escapeHtml(item.desc.tr)}</p>
          </div>
        `).join('\n        ')}
      </div>
    </section>

    <!-- Section 3 -->
    <section class="space-y-4 p-8 rounded-xl bg-[var(--paper)] border border-[var(--rule)] shadow-sm">
      <h2 class="text-2xl font-serif font-semibold text-[var(--ink)]">
        ${escapeHtml(ndaFullAgreementData.canItBeChanged.title.tr)}
      </h2>
      <div class="space-y-2 text-sm sm:text-base text-[var(--ink)] leading-relaxed">
        <p>${escapeHtml(ndaFullAgreementData.canItBeChanged.paragraphs[0].tr)}</p>
        <p class="text-xs sm:text-sm text-[var(--ink-3)] font-mono">
          ${escapeHtml(ndaFullAgreementData.canItBeChanged.paragraphs[1].tr)}
        </p>
      </div>
    </section>

    <!-- Section 4 -->
    <section class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--rule)] pb-6 mb-8">
        <div>
          <h2 class="text-2xl font-serif font-semibold text-[var(--ink)]">
            ${escapeHtml(ndaFullAgreementData.fullAgreementHeader.title.tr)}
          </h2>
          <p class="text-xs sm:text-sm text-[var(--ink-3)] mt-1 font-mono">
            ${escapeHtml(ndaFullAgreementData.fullAgreementHeader.subtitle.tr)}
          </p>
        </div>
        <a href="${escapeHtml(ndaFullAgreementData.fullAgreementHeader.pdfHref)}" download="${escapeHtml(ndaFullAgreementData.fullAgreementHeader.pdfDownloadName)}" class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--on-accent)] font-semibold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer flex-shrink-0 min-h-[44px]">
          <span>${escapeHtml(ndaFullAgreementData.fullAgreementHeader.pdfButton.tr)}</span>
        </a>
      </div>

      <div class="p-6 sm:p-10 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink)] space-y-8 text-xs sm:text-sm leading-relaxed font-sans shadow-sm">
        <div class="text-center pb-6 border-b border-[var(--rule)] space-y-2">
          <div class="text-base sm:text-lg font-bold font-serif text-[var(--ink)] tracking-wide">
            ${escapeHtml(ndaFullAgreementData.fullAgreementHeader.documentTitle)}
          </div>
          <p class="text-[var(--ink-3)] text-xs font-mono">${escapeHtml(ndaFullAgreementData.fullAgreementHeader.documentSubtitle)}</p>
        </div>

        <div class="space-y-6 text-sm text-[var(--ink-3)] leading-relaxed">
          ${ndaFullAgreementData.clauses.map(clause => {
          if (clause.num === 1) {
            return `
          <article class="p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-3" data-clause="${clause.num}">
            <h3 class="text-base font-bold text-[var(--ink)] font-serif">${escapeHtml(clause.title)}</h3>
            <p class="leading-relaxed">${escapeHtml(clause.intro)}</p>
            <div class="p-4 rounded bg-[var(--paper)] border border-[var(--rule)] space-y-1 font-mono text-xs">
              <p class="text-[var(--ink)] font-bold">${escapeHtml(clause.serviceProvider.title)}</p>
              ${clause.serviceProvider.lines.map(line => `<p>${escapeHtml(line)}</p>`).join('\n              ')}
              <p class="text-[var(--ink-3)] italic">${escapeHtml(clause.serviceProvider.suffix)}</p>
            </div>
            <div class="p-4 rounded bg-[var(--paper)] border border-[var(--rule)] space-y-1.5 font-mono text-xs overflow-hidden">
              <p class="text-[var(--ink)] font-bold">${escapeHtml(clause.client.title)}</p>
              ${clause.client.fields.map(field => `<p class="flex items-baseline gap-1 overflow-hidden"><span class="shrink-0">${escapeHtml(field.label)}</span><span class="overflow-hidden whitespace-nowrap text-[var(--ink-3)] select-none">${DOT_LINE_64}</span></p>`).join('\n              ')}
              <p class="text-[var(--ink-3)] italic pt-0.5">${escapeHtml(clause.client.suffix)}</p>
            </div>
            <p class="leading-relaxed">${escapeHtml(clause.outro)}</p>
          </article>`;
          }

          if (clause.num === 3) {
            return `
          <article class="p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-3" data-clause="${clause.num}">
            <h3 class="text-base font-bold text-[var(--ink)] font-serif">${escapeHtml(clause.title)}</h3>
            <p class="leading-relaxed">${escapeHtml(clause.lead1)}</p>
            <ul class="list-none space-y-1 pl-4">
              ${clause.list1.map(item => `<li>${escapeHtml(item)}</li>`).join('\n              ')}
            </ul>
            <p class="leading-relaxed">${escapeHtml(clause.lead2)}</p>
            <ul class="list-none space-y-1 pl-4">
              ${clause.list2.map(item => `<li>${escapeHtml(item)}</li>`).join('\n              ')}
            </ul>
          </article>`;
          }

          if (clause.num === 8) {
            return `
          <article class="p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-3" data-clause="${clause.num}">
            <h3 class="text-base font-bold text-[var(--ink)] font-serif">${escapeHtml(clause.title)}</h3>
            ${clause.paragraphs.map(p => `<p class="leading-relaxed">${escapeHtml(p)}</p>`).join('\n            ')}
            <ul class="list-none space-y-1 pl-4">
              ${clause.list.map(item => `<li>${escapeHtml(item)}</li>`).join('\n              ')}
            </ul>
            ${clause.postParagraphs.map(p => `<p class="leading-relaxed">${escapeHtml(p)}</p>`).join('\n            ')}
          </article>`;
          }

          if (clause.num === 9) {
            return `
          <article class="p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-3" data-clause="${clause.num}">
            <h3 class="text-base font-bold text-[var(--ink)] font-serif">${escapeHtml(clause.title)}</h3>
            ${clause.paragraphs.map(p => `<p class="leading-relaxed">${escapeHtml(p)}</p>`).join('\n            ')}
            <ul class="list-none space-y-1 pl-4">
              ${clause.list.map(item => `<li>${escapeHtml(item)}</li>`).join('\n              ')}
            </ul>
            ${clause.postParagraphs.map(p => `<p class="leading-relaxed">${escapeHtml(p)}</p>`).join('\n            ')}
          </article>`;
          }

          return `
          <article class="p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-3" data-clause="${clause.num}">
            <h3 class="text-base font-bold text-[var(--ink)] font-serif">${escapeHtml(clause.title)}</h3>
            ${clause.paragraphs.map(p => `<p class="leading-relaxed">${escapeHtml(p)}</p>`).join('\n            ')}
          </article>`;
        }).join('\n        ')}        </div>

        <!-- Section: İMZA -->
        <div class="pt-6 border-t border-[var(--rule)] space-y-4">
          <h3 class="font-semibold font-serif text-[var(--ink)] text-sm sm:text-base">${escapeHtml(ndaFullAgreementData.signatures.title)}</h3>
          <p class="text-xs sm:text-sm text-[var(--ink-3)]">${escapeHtml(ndaFullAgreementData.signatures.intro)}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 font-mono text-xs text-[var(--ink)]">
            <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-2 overflow-hidden">
              <p class="font-bold">${escapeHtml(ndaFullAgreementData.signatures.tma.title)}</p>
              ${ndaFullAgreementData.signatures.tma.lines.map(line => `<p>${escapeHtml(line)}</p>`).join('\n          ')}
              <div class="pt-2 space-y-1.5">
                ${ndaFullAgreementData.signatures.tma.fields.map(field => `<p class="flex items-baseline gap-1 overflow-hidden"><span class="shrink-0">${escapeHtml(field.label)}</span><span class="overflow-hidden whitespace-nowrap text-[var(--ink-3)] select-none">${DOT_LINE_64}</span></p>`).join('\n            ')}
              </div>
            </div>
            <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-2 overflow-hidden">
              <p class="font-bold">${escapeHtml(ndaFullAgreementData.signatures.ajans.title)}</p>
              ${ndaFullAgreementData.signatures.ajans.fields.slice(0, 3).map(field => `<p class="flex items-baseline gap-1 overflow-hidden"><span class="shrink-0">${escapeHtml(field.label)}</span><span class="overflow-hidden whitespace-nowrap text-[var(--ink-3)] select-none">${DOT_LINE_64}</span></p>`).join('\n            ')}
              <div class="pt-2 space-y-1.5">
                ${ndaFullAgreementData.signatures.ajans.fields.slice(3).map(field => `<p class="flex items-baseline gap-1 overflow-hidden"><span class="shrink-0">${escapeHtml(field.label)}</span><span class="overflow-hidden whitespace-nowrap text-[var(--ink-3)] select-none">${DOT_LINE_64}</span></p>`).join('\n            ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section: Öncelik Kaydı -->
    <div class="p-6 rounded-xl bg-[var(--tint-warn-bg)] border-2 border-[var(--tint-warn-rule)] text-[var(--tint-warn-ink)] text-xs sm:text-sm leading-relaxed space-y-2">
      <strong class="text-[var(--tint-warn-ink)] font-semibold block uppercase">${escapeHtml(ndaFullAgreementData.precedenceNotice.title.tr)}</strong>
      <p>${escapeHtml(ndaFullAgreementData.precedenceNotice.text)}</p>
    </div>
  </section>
`;

// Adım 82 — Kit slaytları ön-render'da kargoyla giden kitin metniyle çizilir (tek kaynak: agencyKitData.js)
const renderKitSlidesPre = (lang) => agencyKitData[lang].responseKit.slides.map(slide => {
  const satirlar = [
    ...(slide.points || []),
    ...[...(slide.items || []), ...(slide.cards || []), ...(slide.solutions || []), ...(slide.steps || [])].map(x => `${x.title} — ${x.desc}`),
    ...(slide.models || []).map(x => `${x.name} — ${x.desc}`),
    ...(slide.stats || []).map(x => `${x.value} ${x.label} — ${x.desc}`)
  ];
  const iletisim = [slide.phone, slide.email, slide.website].filter(Boolean).join(' · ');
  return `
          <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
            <span class="font-mono text-xs text-[var(--ink-3)] block">${lang === 'tr' ? 'SLAYT' : 'SLIDE'} ${escapeHtml(slide.slideNo)} // ${escapeHtml(slide.tag)}</span>
            <h3 class="text-sm font-semibold text-[var(--ink)]">${escapeHtml(slide.title)}</h3>${slide.desc ? `
            <p class="text-xs text-[var(--ink-3)] leading-relaxed">${escapeHtml(slide.desc)}</p>` : ''}${satirlar.length ? `
            <ul class="text-xs text-[var(--ink-3)] leading-relaxed space-y-1">${satirlar.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>` : ''}${slide.highlight ? `
            <p class="text-xs font-mono font-semibold text-[var(--ink)]">${escapeHtml(slide.highlight)}</p>` : ''}${slide.techStack ? `
            <p class="text-xs font-mono text-[var(--ink-3)]">${escapeHtml(slide.techStack)}</p>` : ''}${iletisim ? `
            <p class="text-xs font-mono text-[var(--ink-3)]">${escapeHtml(iletisim)}</p>` : ''}
          </div>`;
}).join('\n        ');

const kitExtraContentTr = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-8">
    <div class="space-y-4 max-w-3xl">
      <p class="text-base text-[var(--ink)] leading-relaxed">
        ${escapeHtml(agencyKitData.tr.responseKit.subtitle)}
      </p>
      <p class="text-base text-[var(--ink)] leading-relaxed">
        ${escapeHtml(agencyKitData.tr.crashTest.description)}
      </p>
    </div>

    <!-- 3 Kriz Senaryosu & Sorular -->
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-[var(--ink)] font-serif">Kriz Senaryoları & Hazırlık Denetimi</h2>
      <p class="text-xs sm:text-sm text-[var(--ink-3)]">
        ${escapeHtml(agencyKitData.tr.crashTest.notice.security)}
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${agencyKitData.tr.crashTest.scenarios.map(sc => `
          <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-mono text-[var(--accent)] font-semibold text-xs">${escapeHtml(sc.no)}</span>
              <span class="font-mono text-xs text-[var(--accent)] bg-[var(--accent-wash)] px-2 py-0.5 rounded border border-[var(--accent)]/20">${escapeHtml(sc.tag)}</span>
            </div>
            <h3 class="text-sm font-semibold text-[var(--ink)]">${escapeHtml(sc.title)}</h3>
            <p class="text-xs text-[var(--ink-3)] leading-relaxed">${escapeHtml(sc.desc)}</p>
          </div>
        `).join('\n        ')}
      </div>
    </div>

    <!-- 8 Slaytlık Kılavuz -->
    <div class="space-y-4 pt-4 border-t border-[var(--rule)]">
      <h2 class="text-xl font-bold text-[var(--ink)] font-serif">${escapeHtml(agencyKitData.tr.responseKit.title)} (8 Slayt)</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        ${renderKitSlidesPre('tr')}
      </div>
    </div>

    <!-- İndirme Linkleri (Sözleşme PDF yok!) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--rule)]">
      <a href="/agency-kit/tma-agency-response-kit.pdf" download="TMA-Agency-Response-Kit.pdf" class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--accent)] transition-colors block text-center space-y-2 min-h-[44px]">
        <strong class="text-sm font-semibold text-[var(--ink)] block">TMA Agency Response Kit (PDF)</strong>
        <span class="text-xs text-[var(--accent)] font-mono">İndir (PDF) →</span>
      </a>
      <a href="/agency-kit/tma-agency-crash-test-500.pdf" download="TMA-Agency-Crash-Test-500.pdf" class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--accent)] transition-colors block text-center space-y-2 min-h-[44px]">
        <strong class="text-sm font-semibold text-[var(--ink)] block">Crash Test 500 (PDF)</strong>
        <span class="text-xs text-[var(--accent)] font-mono">İndir (PDF) →</span>
      </a>
      <a href="/agency-kit/crash-test-500-poster.png" download="TMA-Crash-Test-500-Poster.png" class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--accent)] transition-colors block text-center space-y-2 min-h-[44px]">
        <strong class="text-sm font-semibold text-[var(--ink)] block">Crash Test 500 Posteri (PNG)</strong>
        <span class="text-xs text-[var(--accent)] font-mono">İndir (PNG) →</span>
      </a>
    </div>
  </section>
`;

const kitExtraContentEn = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-8">
    <div class="space-y-4 max-w-3xl">
      <p class="text-base text-[var(--ink)] leading-relaxed">
        ${escapeHtml(agencyKitData.en.responseKit.subtitle)}
      </p>
      <p class="text-base text-[var(--ink)] leading-relaxed">
        ${escapeHtml(agencyKitData.en.crashTest.description)}
      </p>
      <p class="text-xs font-mono text-[var(--ink-3)] bg-[var(--surface)] border border-[var(--rule)] py-1.5 px-3 rounded inline-block">
        The slides and the poster are currently available in Turkish.
      </p>
    </div>

    <!-- 3 Crisis Scenarios & Readiness -->
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-[var(--ink)] font-serif">Crisis Scenarios & Readiness Audit</h2>
      <p class="text-xs sm:text-sm text-[var(--ink-3)]">
        ${escapeHtml(agencyKitData.en.crashTest.notice.security)}
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${agencyKitData.en.crashTest.scenarios.map(sc => `
          <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-mono text-[var(--accent)] font-semibold text-xs">${escapeHtml(sc.no)}</span>
              <span class="font-mono text-xs text-[var(--accent)] bg-[var(--accent-wash)] px-2 py-0.5 rounded border border-[var(--accent)]/20">${escapeHtml(sc.tag)}</span>
            </div>
            <h3 class="text-sm font-semibold text-[var(--ink)]">${escapeHtml(sc.title)}</h3>
            <p class="text-xs text-[var(--ink-3)] leading-relaxed">${escapeHtml(sc.desc)}</p>
          </div>
        `).join('\n        ')}
      </div>
    </div>

    <!-- 8-Slide Guide -->
    <div class="space-y-4 pt-4 border-t border-[var(--rule)]">
      <h2 class="text-xl font-bold text-[var(--ink)] font-serif">${escapeHtml(agencyKitData.en.responseKit.title)} (8 Slides)</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        ${renderKitSlidesPre('en')}
      </div>
    </div>

    <!-- Download Links (No contract PDF!) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--rule)]">
      <a href="/agency-kit/tma-agency-response-kit.pdf" download="TMA-Agency-Response-Kit.pdf" class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--accent)] transition-colors block text-center space-y-2 min-h-[44px]">
        <strong class="text-sm font-semibold text-[var(--ink)] block">TMA Agency Response Kit (PDF)</strong>
        <span class="text-xs text-[var(--accent)] font-mono">Download (PDF) →</span>
      </a>
      <a href="/agency-kit/tma-agency-crash-test-500.pdf" download="TMA-Agency-Crash-Test-500.pdf" class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--accent)] transition-colors block text-center space-y-2 min-h-[44px]">
        <strong class="text-sm font-semibold text-[var(--ink)] block">Crash Test 500 (PDF)</strong>
        <span class="text-xs text-[var(--accent)] font-mono">Download (PDF) →</span>
      </a>
      <a href="/agency-kit/crash-test-500-poster.png" download="TMA-Crash-Test-500-Poster.png" class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--accent)] transition-colors block text-center space-y-2 min-h-[44px]">
        <strong class="text-sm font-semibold text-[var(--ink)] block">Crash Test 500 Poster (PNG)</strong>
        <span class="text-xs text-[var(--accent)] font-mono">Download (PNG) →</span>
      </a>
    </div>
  </section>
`;

const salvageabilityExtraContentTr = `
  <section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6">
    <p class="text-sm text-[var(--ink-2)]"><a href="${tmaiYollar.tr}" class="text-[var(--accent)] hover:underline">${escapeHtml(tmaiAraclar.secenek.tr)} →</a></p>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-3)] font-mono">
      <div><strong class="text-[var(--ink)] block text-sm">5 Boyutlu Risk</strong> Mimari, Test, Veritabanı, Trafik, Teknik Borç</div>
      <div><strong class="text-[var(--tint-ok-ink)] block text-sm">0 Erişim</strong> Şifre veya repo istemez</div>
      <div><strong class="text-[var(--accent)] block text-sm">3 Stratejik Karar</strong> kurtarma, kademeli geçiş (Strangler Fig) veya sıfırdan yazım</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Değerlendirilen 5 Kritik Boyut</h2>
    <div class="space-y-4">
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">1. Mimari Bağımlılık & Spagetti Yoğunluğu</h3>
        <p class="text-[var(--ink-3)] text-sm leading-relaxed">Bir modüldeki değişiklik alakasız yerleri patlatıyor mu? Monolitik düğümler ve kontrolsüz bağımlılıklar.</p>
      </article>
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">2. Test Kapsamı & Alan Bilgisi (Domain Knowledge)</h3>
        <p class="text-[var(--ink-3)] text-sm leading-relaxed">Sistemi yazan kişi ayrıldı mı? Otomatik unit/entegrasyon testi var mı yoksa canlı ortamda mı test ediliyor?</p>
      </article>
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">3. Veritabanı Bütünlüğü & Şema Karmaşası</h3>
        <p class="text-[var(--ink-3)] text-sm leading-relaxed">Foreign key, constraint veya migrasyon disiplini var mı yoksa veritabanı kilitlenme veya tutarsızlık içinde mi?</p>
      </article>
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">4. Canlı Trafik Baskısı & Teslimat Süresi</h3>
        <p class="text-[var(--ink-3)] text-sm leading-relaxed">Sistem şu an aktif ciro üretiyor mu ve acil bir lansman/sözleşme tarihi var mı?</p>
      </article>
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">5. Teknik Borç / Bakım Maliyeti Oranı</h3>
        <p class="text-[var(--ink-3)] text-sm leading-relaxed">Yeni bir özellik eklemek kaç gün sürüyor? Bakım maliyeti ciro ve geliştirme hızını kilitliyor mu?</p>
      </article>
    </div>
  </section>
`;

const salvageabilityExtraContentEn = `
  <section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6">
    <p class="text-sm text-[var(--ink-2)]"><a href="${tmaiYollar.en}" class="text-[var(--accent)] hover:underline">${escapeHtml(tmaiAraclar.secenek.en)} →</a></p>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-3)] font-mono">
      <div><strong class="text-[var(--ink)] block text-sm">5 Risk Dimensions</strong> Architecture, Tests, Database, Traffic, Debt Drag</div>
      <div><strong class="text-[var(--tint-ok-ink)] block text-sm">Zero Access</strong> No credentials or repo access needed</div>
      <div><strong class="text-[var(--accent)] block text-sm">3 Strategic Paths</strong> SWAT Rescue, Strangler Fig, or Clean Slate</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">5 Critical Dimensions Evaluated</h2>
    <div class="space-y-4">
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">1. Architectural Coupling & Spaghetti Density</h3>
        <p class="text-[var(--ink-3)] text-sm leading-relaxed">Does changing one module break unrelated endpoints? Monolithic tangles and hidden dependencies.</p>
      </article>
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">2. Test Coverage & Domain Knowledge</h3>
        <p class="text-[var(--ink-3)] text-sm leading-relaxed">Did the original developers vanish? Are automated test suites nonexistent, leaving code untested until production?</p>
      </article>
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">3. Database Integrity & Schema Hygiene</h3>
        <p class="text-[var(--ink-3)] text-sm leading-relaxed">Are foreign keys and constraints intact, or is the schema fraught with deadlocks and orphaned data?</p>
      </article>
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">4. Live Traffic Pressure & Deadline Urgency</h3>
        <p class="text-[var(--ink-3)] text-sm leading-relaxed">Is the system currently processing real revenue with tight contractual delivery milestones?</p>
      </article>
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">5. Technical Debt Drag Ratio</h3>
        <p class="text-[var(--ink-3)] text-sm leading-relaxed">Does shipping a minor feature take weeks instead of hours due to crippling maintenance overhead?</p>
      </article>
    </div>
  </section>
`;

const postMortemHubExtraContentTr = `
  <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
    <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-3)] leading-relaxed font-mono">
      ${escapeHtml(postMortemDisclosure.index.tr)}
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Yayınlanmış Post-Mortem Vakaları</h2>
    <ul class="space-y-4">
      ${postMortems.map(item => `
        <li class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <a href="/post-mortem/${escapeHtml(item.slug)}/" class="text-[var(--accent)] font-bold hover:underline font-mono text-base">→ ${escapeHtml(item.no)} · ${escapeHtml(item.title?.tr || '')}</a>
            <span class="text-xs font-mono text-[var(--tint-warn-ink)]">${escapeHtml(siddetEtiketi(item.severity, 'tr'))} · ${escapeHtml(item.category?.tr || '')}</span>
          </div>
          <p class="text-sm text-[var(--ink-3)] leading-relaxed">${escapeHtml(item.summary?.tr || '')}</p>
          <div class="text-xs font-mono text-[var(--ink-3)]">Süre: ${escapeHtml(item.duration?.tr || '')} · Etki: ${escapeHtml(item.impact?.tr || '')}</div>
        </li>
      `).join('\n      ')}
    </ul>
  </section>
`;

const postMortemHubExtraContentEn = `
  <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
    <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-3)] leading-relaxed font-mono">
      ${escapeHtml(postMortemDisclosure.index.en)}
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Published Incident Post-Mortems</h2>
    <ul class="space-y-4">
      ${postMortems.map(item => `
        <li class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <a href="/post-mortems/${escapeHtml(item.slug)}/" class="text-[var(--accent)] font-bold hover:underline font-mono text-base">→ ${escapeHtml(item.no)} · ${escapeHtml(item.title?.en || item.title?.tr || '')}</a>
            <span class="text-xs font-mono text-[var(--tint-warn-ink)]">${escapeHtml(item.severity)} · ${escapeHtml(item.category?.en || '')}</span>
          </div>
          <p class="text-sm text-[var(--ink-3)] leading-relaxed">${escapeHtml(item.summary?.en || item.summary?.tr || '')}</p>
          <div class="text-xs font-mono text-[var(--ink-3)]">Duration: ${escapeHtml(item.duration?.en || '')} · Impact: ${escapeHtml(item.impact?.en || '')}</div>
        </li>
      `).join('\n      ')}
    </ul>
  </section>
`;

const triageExtraContentTr = `
  <section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-3)] font-mono">
      <div><strong class="text-[var(--ink)] block text-sm">6 Kriz Tipi</strong> Veritabanı, Ödeme, Bellek, Deploy, 429, Devir</div>
      <div><strong class="text-[var(--tint-ok-ink)] block text-sm">İlk 15 Dk</strong> Kritik "Ne Yapma!" kuralları ve CLI komutları</div>
      <div><strong class="text-[var(--accent)] block text-sm">Ücretsiz Triyaj</strong> Masaya doğrudan kıdemli mühendis bağlanır</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Canlı Kriz Simülatöründe Kapsanan Senaryolar</h2>
    <div class="space-y-4">
      ${triageScenarios.map(sc => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-bold text-[var(--accent)] font-mono">${escapeHtml(sc.category?.tr || '')}</h3>
          <span class="text-xs font-mono text-[var(--tint-warn-ink)]">${escapeHtml(siddetEtiketi(sc.severity, 'tr'))} · İlk Yanıt: ${escapeHtml(sc.firstResponseTime?.tr || '')}</span>
        </div>
        <p class="text-[var(--ink-3)] text-sm leading-relaxed">${escapeHtml(sc.symptom?.tr || '')}</p>
        <div class="pt-2 text-xs font-mono text-[var(--tint-danger-ink)]">
          <strong>Önemli:</strong> ${escapeHtml(sc.doNot?.[0]?.tr || '')}
        </div>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const triageExtraContentEn = `
  <section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-3)] font-mono">
      <div><strong class="text-[var(--ink)] block text-sm">6 Outage Types</strong> Database, Payment, Memory, Deploy, 429, Handover</div>
      <div><strong class="text-[var(--tint-ok-ink)] block text-sm">First 15 Mins</strong> Critical DO NOTs and diagnostic CLI commands</div>
      <div><strong class="text-[var(--accent)] block text-sm">Free Triage</strong> Senior engineering desk engages directly</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Scenarios Covered in the Emergency Simulator</h2>
    <div class="space-y-4">
      ${triageScenarios.map(sc => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-bold text-[var(--accent)] font-mono">${escapeHtml(sc.category?.en || '')}</h3>
          <span class="text-xs font-mono text-[var(--tint-warn-ink)]">${escapeHtml(sc.severity)} · MTTA: ${escapeHtml(sc.firstResponseTime?.en || '')}</span>
        </div>
        <p class="text-[var(--ink-3)] text-sm leading-relaxed">${escapeHtml(sc.symptom?.en || '')}</p>
        <div class="pt-2 text-xs font-mono text-[var(--tint-danger-ink)]">
          <strong>Caution:</strong> ${escapeHtml(sc.doNot?.[0]?.en || '')}
        </div>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const slaExtraContentTr = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-3)] font-mono">
      <div><strong class="text-[var(--tint-danger-ink)] block text-sm">SEV-0</strong> ≤ 15 Dk MTTA</div>
      <div><strong class="text-[var(--tint-warn-ink)] block text-sm">SEV-1</strong> ≤ 30 Dk MTTA</div>
      <div><strong class="text-[var(--tint-info-ink)] block text-sm">SEV-2</strong> ≤ 2 Saat MTTA</div>
      <div><strong class="text-[var(--tint-info-ink)] block text-sm">SEV-3</strong> ≤ 4 Saat MTTA</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Hizmet Seviyesi Taahhütleri (SLA Seviyeleri)</h2>
    <div class="space-y-4">
      ${slaTiers.map(tier => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-bold text-[var(--ink)] font-mono">${escapeHtml(tier.level)} · ${escapeHtml(tier.title?.tr || '')}</h3>
          <span class="text-xs font-mono text-[var(--accent)]">İlk Yanıt: ${escapeHtml(tier.mtta?.tr || '')} · Masaya Oturma: ${escapeHtml(tier.timeToTable?.tr || '')}</span>
        </div>
        <p class="text-[var(--ink-3)] text-sm leading-relaxed">${escapeHtml(tier.definition?.tr || '')}</p>
        <p class="text-xs font-mono text-[var(--ink-3)]">Rapor Sıklığı: ${escapeHtml(tier.updateCadence?.tr || '')}</p>
      </article>
      `).join('\n      ')}
    </div>

    <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-3)] font-mono">
      <strong>Kapsam:</strong> ${escapeHtml(slaScope.tr)}
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)] pt-4">Altı Temel Taahhüdümüz</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${coreCommitments.map(c => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-base font-bold font-mono text-[var(--accent)]">${escapeHtml(c.no)}</span>
          <h3 class="text-sm font-bold text-[var(--ink)]">${escapeHtml(c.title?.tr || '')}</h3>
        </div>
        <p class="text-[var(--ink-3)] text-xs leading-relaxed">${escapeHtml(c.desc?.tr || '')}</p>
        ${c.no === '02' ? '<p class="pt-2"><a href="/nda/" class="text-[var(--accent)] hover:underline font-bold font-mono text-xs">Sözleşmeyi okuyun →</a></p>' : ''}
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const slaExtraContentEn = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-3)] font-mono">
      <div><strong class="text-[var(--tint-danger-ink)] block text-sm">SEV-0</strong> ≤ 15 Mins MTTA</div>
      <div><strong class="text-[var(--tint-warn-ink)] block text-sm">SEV-1</strong> ≤ 30 Mins MTTA</div>
      <div><strong class="text-[var(--tint-info-ink)] block text-sm">SEV-2</strong> ≤ 2 Hours MTTA</div>
      <div><strong class="text-[var(--tint-info-ink)] block text-sm">SEV-3</strong> ≤ 4 Hours MTTA</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Service Level Agreements (SLA Tiers)</h2>
    <div class="space-y-4">
      ${slaTiers.map(tier => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-bold text-[var(--ink)] font-mono">${escapeHtml(tier.level)} · ${escapeHtml(tier.title?.en || tier.title?.tr || '')}</h3>
          <span class="text-xs font-mono text-[var(--accent)]">MTTA: ${escapeHtml(tier.mtta?.en || '')} · Table: ${escapeHtml(tier.timeToTable?.en || '')}</span>
        </div>
        <p class="text-[var(--ink-3)] text-sm leading-relaxed">${escapeHtml(tier.definition?.en || '')}</p>
        <p class="text-xs font-mono text-[var(--ink-3)]">Cadence: ${escapeHtml(tier.updateCadence?.en || '')}</p>
      </article>
      `).join('\n      ')}
    </div>

    <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-3)] font-mono">
      <strong>Scope:</strong> ${escapeHtml(slaScope.en)}
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)] pt-4">Six Core Non-Negotiable Commitments</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${coreCommitments.map(c => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-base font-bold font-mono text-[var(--accent)]">${escapeHtml(c.no)}</span>
          <h3 class="text-sm font-bold text-[var(--ink)]">${escapeHtml(c.title?.en || c.title?.tr || '')}</h3>
        </div>
        <p class="text-[var(--ink-3)] text-xs leading-relaxed">${escapeHtml(c.desc?.en || c.desc?.tr || '')}</p>
        ${c.no === '02' ? '<p class="pt-2"><a href="/nda/" class="text-[var(--accent)] hover:underline font-bold font-mono text-xs">Read the agreement →</a></p>' : ''}
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const techCategoriesTr = techStackData.tr.categories.filter(c => c.id !== 'all');
const techCategoriesEn = techStackData.en.categories.filter(c => c.id !== 'all');
const sev0MttaTr = slaTiers.find(s => s.level === 'SEV-0')?.mtta.tr || '≤ 15 Dakika';
const sev0MttaEn = slaTiers.find(s => s.level === 'SEV-0')?.mtta.en || '≤ 15 Minutes';

const techMatrixExtraContentTr = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-3)] font-mono">
      <div><strong class="text-[var(--tint-ok-ink)] block text-sm">${techCategoriesTr.length} Kategori</strong> Backend, Frontend, DB, Infra</div>
      <div><strong class="text-[var(--ink)] block text-sm">${techStackData.tr.items.length} Bileşen</strong> ${techCategoriesTr.map(c => escapeHtml(c.label)).join(' · ')}</div>
      <div><strong class="text-[var(--accent)] block text-sm">${escapeHtml(sev0MttaTr)}</strong> SEV-0 Anında SWAT Triyajı</div>
      <div><strong class="text-[var(--tint-warn-ink)] block text-sm">%100</strong> Müdahale Öncesi Snapshot Kuralı</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Desteklenen Teknolojiler & Cerrahi Müdahale Derinliği</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${techStackData.tr.items.map(tech => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-bold text-[var(--ink)] font-mono">${escapeHtml(tech.name)}</h3>
          <span class="text-xs font-mono text-[var(--tint-ok-ink)]">${escapeHtml(tech.supportLevel)}</span>
        </div>
        <p class="text-xs font-mono text-[var(--ink-3)]">Hazırbulunuşluk: ${escapeHtml(tech.readiness)}</p>
        <div class="pt-1">
          <p class="text-xs font-semibold text-[var(--tint-warn-ink)] font-mono">Kritik Arıza Noktaları:</p>
          <ul class="list-disc list-inside space-y-0.5 text-xs text-[var(--ink-3)]">
            ${tech.commonIncidents.slice(0, 2).map(inc => `<li>${escapeHtml(inc)}</li>`).join('\n            ')}
          </ul>
        </div>
        <p class="text-xs text-[var(--ink-3)] pt-1"><strong class="text-[var(--accent)]">TMA SWAT:</strong> ${escapeHtml(tech.rescueCapability)}</p>
        ${tech.interventionLimit ? `<p class="text-xs text-[var(--ink-2)] pt-1"><strong class="text-[var(--ink)]">Müdahale sınırı:</strong> ${escapeHtml(tech.interventionLimit)}</p>` : ''}
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const techMatrixExtraContentEn = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-3)] font-mono">
      <div><strong class="text-[var(--tint-ok-ink)] block text-sm">${techCategoriesEn.length} Categories</strong> Backend, Frontend, DB, Infra</div>
      <div><strong class="text-[var(--ink)] block text-sm">${techStackData.en.items.length} Stacks</strong> ${techCategoriesEn.map(c => escapeHtml(c.label)).join(' · ')}</div>
      <div><strong class="text-[var(--accent)] block text-sm">${escapeHtml(sev0MttaEn)}</strong> SEV-0 Immediate SWAT Triage</div>
      <div><strong class="text-[var(--tint-warn-ink)] block text-sm">100%</strong> Pre-Intervention Snapshot Rule</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Supported Technologies & Surgical Rescue Depth</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${techStackData.en.items.map(tech => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-bold text-[var(--ink)] font-mono">${escapeHtml(tech.name)}</h3>
          <span class="text-xs font-mono text-[var(--tint-ok-ink)]">${escapeHtml(tech.supportLevel)}</span>
        </div>
        <p class="text-xs font-mono text-[var(--ink-3)]">Readiness: ${escapeHtml(tech.readiness)}</p>
        <div class="pt-1">
          <p class="text-xs font-semibold text-[var(--tint-warn-ink)] font-mono">Outage Vectors:</p>
          <ul class="list-disc list-inside space-y-0.5 text-xs text-[var(--ink-3)]">
            ${tech.commonIncidents.slice(0, 2).map(inc => `<li>${escapeHtml(inc)}</li>`).join('\n            ')}
          </ul>
        </div>
        <p class="text-xs text-[var(--ink-3)] pt-1"><strong class="text-[var(--accent)]">TMA SWAT:</strong> ${escapeHtml(tech.rescueCapability)}</p>
        ${tech.interventionLimit ? `<p class="text-xs text-[var(--ink-2)] pt-1"><strong class="text-[var(--ink)]">Scope of intervention:</strong> ${escapeHtml(tech.interventionLimit)}</p>` : ''}
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const ndaGeneratorExtraContentTr = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-3)] font-mono">
      <div><strong class="text-[var(--tint-ok-ink)] block text-sm">%100 IP Koruma</strong> Kod ve mimari tamamen müşteriye aittir</div>
      <div><strong class="text-[var(--ink)] block text-sm">White-Label</strong> Müşterinizin adı ve arızası asla yayınlanmaz</div>
      <div><strong class="text-[var(--accent)] block text-sm">Anında PDF / Yazdır</strong> 30 saniyede resmi sözleşme çıktısı</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Sözleşmede Yer Alan 7 Temel Hukuki ve Mühendislik Maddesi</h2>
    <div class="space-y-4">
      ${ndaData.tr.clauses.map(clause => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-1.5">
        <h3 class="text-sm font-bold text-[var(--ink)] font-mono uppercase">MADDE ${escapeHtml(clause.num)}. ${escapeHtml(clause.title)}</h3>
        <p class="text-[var(--ink-3)] text-xs sm:text-sm leading-relaxed">${escapeHtml(clause.content)}</p>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const ndaGeneratorExtraContentEn = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-3)] font-mono">
      <div><strong class="text-[var(--tint-ok-ink)] block text-sm">100% IP Ownership</strong> All code & architecture belongs to client</div>
      <div><strong class="text-[var(--ink)] block text-sm">Ghost Delivery</strong> Client identity and incident history strictly confidential</div>
      <div><strong class="text-[var(--accent)] block text-sm">Instant Print / PDF</strong> Official executive agreement in 30 seconds</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">7 Core Legal & Engineering Clauses</h2>
    <div class="space-y-4">
      ${ndaData.en.clauses.map(clause => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-1.5">
        <h3 class="text-sm font-bold text-[var(--ink)] font-mono uppercase">SECTION ${escapeHtml(clause.num)}. ${escapeHtml(clause.title)}</h3>
        <p class="text-[var(--ink-3)] text-xs sm:text-sm leading-relaxed">${escapeHtml(clause.content)}</p>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

// Kesinti ve itibar zararı hesabı — ön-render içeriği tek kaynaktan (src/data/outageSimulatorData.js). Adım 80.
const renderOutageExtra = (lang) => {
  const d = outageSimulatorData[lang];
  return `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <p class="text-sm text-[var(--ink-2)]">${escapeHtml(d.hero.notice)}</p>
    <h2 class="text-xl font-bold text-[var(--ink)]">${escapeHtml(d.labels.methodTitle)}</h2>
    <div class="space-y-4">
      ${d.dimensions.map(dim => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-1.5">
        <h3 class="text-base font-bold text-[var(--ink)] font-mono">${escapeHtml(dim.title)}</h3>
        <p class="text-[var(--ink-3)] text-sm leading-relaxed">${escapeHtml(dim.desc)}</p>
        <p class="font-mono text-xs text-[var(--ink)]">${escapeHtml(dim.formula)}</p>
      </article>
      `).join('\n      ')}
    </div>
    <p class="text-xs text-[var(--ink-3)]">${escapeHtml(d.labels.methodNote)}</p>
  </section>
`;
};
const outageSimulatorExtraContentTr = renderOutageExtra('tr');
const outageSimulatorExtraContentEn = renderOutageExtra('en');

// Adım 82 — Radar ön-render'ı sayfanın kendi verisinden çizilir (tek kaynak: radarData.js).
// /radar/ tek adresli; ön-render yalnız Türkçe üretilir.
const renderRadarExtra = (lang) => {
  const t = radarData[lang];
  const tr = lang === 'tr';
  const yuzde = (p) => (tr ? `%${p}` : `${p}%`);
  return `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <h2 class="text-xl font-bold text-[var(--ink)]">${escapeHtml(t.telemetry90Days.title)}</h2>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-3)] font-mono">
      ${t.telemetry90Days.metrics.map(m => `<div><span class="block">${escapeHtml(m.label)}</span><strong class="text-[var(--ink)] block text-sm">${escapeHtml(m.value)}</strong><span class="block">${escapeHtml(m.sub)}</span></div>`).join('\n      ')}
    </div>

    <p class="text-xs text-[var(--ink-3)] font-mono">
      ${escapeHtml(t.telemetry90Days.sourceNote)} <a href="/sla/" class="text-[var(--accent)] hover:underline font-bold">${escapeHtml(t.telemetry90Days.slaLinkText)}</a>
    </p>

    <h2 class="text-xl font-bold text-[var(--ink)]">${escapeHtml(t.incidentDistribution.title)}</h2>
    <ul class="text-xs text-[var(--ink-3)] font-mono space-y-1">
      ${t.incidentDistribution.categories.map(c => `<li>${escapeHtml(c.label)}: ${yuzde(c.percentage)} (${c.count} ${tr ? 'vaka' : 'cases'})</li>`).join('\n      ')}
    </ul>

    <h2 class="text-xl font-bold text-[var(--ink)]">${tr ? 'Mühendislik Masaları & Altyapı · Nöbet saatlerinde erişilebilirlik (09:00–24:00)' : 'Service Desks & Infrastructure · Availability during duty hours (09:00–24:00)'}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${t.components.map(comp => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-bold text-[var(--ink)] font-mono">${escapeHtml(comp.name)}</h3>
          ${comp.metric ? (comp.metricLink ? `<a href="${comp.metricLink}" class="text-xs font-mono text-[var(--ink-2)] hover:underline inline-flex items-center min-h-[44px] py-[13.5px] -my-[13.5px]">${escapeHtml(comp.metric)}</a>` : `<span class="text-xs font-mono text-[var(--ink-2)]">${escapeHtml(comp.metric)}</span>`) : ''}
        </div>
        <p class="text-[var(--ink-3)] text-xs leading-relaxed">${escapeHtml(comp.desc)}</p>
        <p class="text-xs font-mono text-[var(--accent)] pt-1">${escapeHtml(comp.latencyLabel)}: ${escapeHtml(comp.latency)}</p>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;
};
const radarExtraContentTr = renderRadarExtra('tr');

const codeHealthExtraContentTr = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-3)] font-mono">
      <div><strong class="text-[var(--tint-danger-ink)] block text-sm">4 Kritik Boyut</strong> Mimari, DB, Güvenlik, Borç</div>
      <div><strong class="text-[var(--ink)] block text-sm">20 Parametre</strong> Ağırlıklı risk değerlendirme kriteri</div>
      <div><strong class="text-[var(--tint-warn-ink)] block text-sm">Yangın Riski</strong> İlk 3 acil müdahale noktası tespiti</div>
      <div><strong class="text-[var(--tint-ok-ink)] block text-sm">Anında Rapor</strong> CTO & Yönetim Kurulu için Markdown çıktısı</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">4 Boyutlu Kod Sağlığı ve Teknik Borç Denetim Kapsamı</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${codeHealthData.tr.categories.map(cat => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-3">
        <div class="border-b border-[var(--rule)] pb-2">
          <h3 class="text-base font-bold text-[var(--ink)] font-mono">${escapeHtml(cat.title)}</h3>
          <p class="text-xs text-[var(--ink-3)]">${escapeHtml(cat.desc)}</p>
        </div>
        <ul class="space-y-2 text-xs text-[var(--ink-3)]">
          ${cat.items.slice(0, 3).map(item => `
          <li class="flex items-start gap-2">
            <span class="text-[var(--tint-warn-ink)] font-mono font-bold">•</span>
            <div>
              <span class="text-[var(--ink)] font-medium">${escapeHtml(item.text)}</span>
              <p class="text-xs text-[var(--tint-danger-ink)] font-mono">${escapeHtml(item.risk)}</p>
            </div>
          </li>
          `).join('\n          ')}
        </ul>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const codeHealthExtraContentEn = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-3)] font-mono">
      <div><strong class="text-[var(--tint-danger-ink)] block text-sm">4 Critical Vectors</strong> Architecture, DB, Security, Debt</div>
      <div><strong class="text-[var(--ink)] block text-sm">20 Checkpoints</strong> Weighted risk assessment criteria</div>
      <div><strong class="text-[var(--tint-warn-ink)] block text-sm">Fire Hazards</strong> Top 3 urgent triage vectors</div>
      <div><strong class="text-[var(--tint-ok-ink)] block text-sm">Instant Brief</strong> Copyable executive Markdown report</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">4-Dimensional Codebase Health & Technical Debt Scope</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${codeHealthData.en.categories.map(cat => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-3">
        <div class="border-b border-[var(--rule)] pb-2">
          <h3 class="text-base font-bold text-[var(--ink)] font-mono">${escapeHtml(cat.title)}</h3>
          <p class="text-xs text-[var(--ink-3)]">${escapeHtml(cat.desc)}</p>
        </div>
        <ul class="space-y-2 text-xs text-[var(--ink-3)]">
          ${cat.items.slice(0, 3).map(item => `
          <li class="flex items-start gap-2">
            <span class="text-[var(--tint-warn-ink)] font-mono font-bold">•</span>
            <div>
              <span class="text-[var(--ink)] font-medium">${escapeHtml(item.text)}</span>
              <p class="text-xs text-[var(--tint-danger-ink)] font-mono">${escapeHtml(item.risk)}</p>
            </div>
          </li>
          `).join('\n          ')}
        </ul>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

// Kurtarma mı, sıfırdan yazım mı? — ön-render içeriği tek kaynaktan (src/data/rescueRoiData.js). Adım 79.
const renderRescueExtra = (lang) => {
  const d = rescueRoiData[lang];
  return `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <p class="text-sm text-[var(--ink-2)]">${escapeHtml(d.hero.notice)}</p>
    <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
      <h2 class="text-xl font-bold text-[var(--ink)]">${escapeHtml(d.labels.formulaTitle)}</h2>
      <p class="font-mono text-xs text-[var(--ink)]">${escapeHtml(d.labels.formula)}</p>
      <p class="text-xs text-[var(--ink-3)]">${escapeHtml(d.labels.excluded)}</p>
      <p class="text-xs text-[var(--ink-3)] font-mono">${escapeHtml(d.labels.sourceNote)}</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <article class="p-5 rounded-2xl bg-[var(--tint-danger-bg)] border border-[var(--tint-danger-rule)] space-y-3">
        <h3 class="text-base font-bold text-[var(--tint-danger-ink)] font-mono">${escapeHtml(d.labels.rebuildBreakdown)}</h3>
        <ul class="space-y-2 text-xs text-[var(--ink-3)]">
          ${d.rebuildItems.map(item => `<li class="flex items-start gap-2"><span class="text-[var(--tint-danger-ink)] font-mono font-bold">✕</span><span>${escapeHtml(item)}</span></li>`).join('\n          ')}
        </ul>
      </article>
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-3">
        <h3 class="text-base font-bold text-[var(--ink)] font-mono">${escapeHtml(d.labels.rescueBreakdown)}</h3>
        <ul class="space-y-2 text-xs text-[var(--ink-3)]">
          ${d.rescueItems.map(item => `<li class="flex items-start gap-2"><span class="text-[var(--ink)] font-mono font-bold">•</span><span>${escapeHtml(item)}</span></li>`).join('\n          ')}
        </ul>
      </article>
    </div>
  </section>
`;
};
const rescueRoiExtraContentTr = renderRescueExtra('tr');
const rescueRoiExtraContentEn = renderRescueExtra('en');

function renderTmaiContent(lang) {
  const d = tmaiData[lang];
  const isTr = lang === 'tr';
  const checkLabel = isTr ? 'Bakılan:' : 'What we check:';

  return `
    <div class="space-y-12">
      <!-- 1. Rozet & Giris -->
      <section class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--r-control)] bg-[var(--accent-wash)] border border-[var(--accent)] text-[var(--accent)] text-xs font-mono font-semibold tracking-wider">
          ${escapeHtml(d.rozet)}
        </div>
        <p class="text-base sm:text-lg text-[var(--ink-2)] leading-relaxed">
          ${escapeHtml(d.giris)}
        </p>
      </section>

      <!-- 2. Ne Zaman -->
      <section class="space-y-4">
        <h2 class="text-2xl sm:text-3xl font-semibold font-serif text-[var(--ink)] tracking-tight">
          ${escapeHtml(d.neZaman.baslik)}
        </h2>
        <ul class="space-y-3">
          ${d.neZaman.maddeler.map(m => `
            <li class="flex items-start gap-3 text-base text-[var(--ink-2)]">
              <span class="text-[var(--accent)] font-mono font-bold mt-0.5">•</span>
              <span>${escapeHtml(m)}</span>
            </li>
          `).join('')}
        </ul>
      </section>

      <!-- 3. Kontroller -->
      <section class="space-y-4">
        <h2 class="text-2xl sm:text-3xl font-semibold font-serif text-[var(--ink)] tracking-tight">
          ${escapeHtml(d.kontroller.baslik)}
        </h2>
        <p class="text-base text-[var(--ink-2)] leading-relaxed">
          ${escapeHtml(d.kontroller.giris)}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          ${d.kontroller.maddeler.map(kart => `
            <article class="p-6 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] space-y-3">
              <h3 class="text-lg font-semibold font-serif text-[var(--ink)]">
                ${escapeHtml(kart.baslik)}
              </h3>
              <p class="text-sm text-[var(--ink-2)] leading-relaxed">
                ${escapeHtml(kart.neden)}
              </p>
              <div class="text-xs font-mono text-[var(--ink-3)] pt-2 border-t border-[var(--rule)]">
                <strong class="text-[var(--accent)] font-semibold">${checkLabel}</strong> ${escapeHtml(kart.bakilan)}
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <!-- 4. Surec -->
      <section class="space-y-4">
        <h2 class="text-2xl sm:text-3xl font-semibold font-serif text-[var(--ink)] tracking-tight">
          ${escapeHtml(d.surec.baslik)}
        </h2>
        <div class="space-y-4 pt-2">
          ${d.surec.adimlar.map((adim, idx) => `
            <div class="p-6 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] flex flex-col sm:flex-row items-start gap-4">
              <div class="w-8 h-8 rounded-[var(--r-control)] bg-[var(--accent-wash)] border border-[var(--accent)] text-[var(--accent)] font-mono font-bold text-sm flex items-center justify-center flex-shrink-0">
                ${idx + 1}
              </div>
              <div class="space-y-1.5 flex-1">
                ${adim.link ? `
                  <a href="${adim.link}" class="text-base sm:text-lg font-semibold font-serif text-[var(--ink)] hover:text-[var(--accent)] hover:underline inline-flex items-center gap-1.5 transition-colors relative after:absolute after:inset-[-10px_0] after:content-['']">
                    <span>${escapeHtml(adim.baslik)}</span> →
                  </a>
                ` : `
                  <h3 class="text-base sm:text-lg font-semibold font-serif text-[var(--ink)]">
                    ${escapeHtml(adim.baslik)}
                  </h3>
                `}
                <p class="text-sm text-[var(--ink-2)] leading-relaxed">
                  ${escapeHtml(adim.metin)}
                </p>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- 5. Sinir -->
      <section class="p-6 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h2 class="text-xl font-semibold font-serif text-[var(--ink)]">
          ${escapeHtml(d.sinir.baslik)}
        </h2>
        <p class="text-sm sm:text-base text-[var(--ink-2)] leading-relaxed">
          ${escapeHtml(d.sinir.metin)}
        </p>
      </section>

      <!-- 6. Arac Notu -->
      <p class="text-xs text-[var(--ink-3)] font-mono leading-relaxed">
        ${escapeHtml(d.aracNotu)}
      </p>

      <!-- 7. CTA -->
      <section class="p-6 sm:p-8 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] space-y-4 text-left">
        <h2 class="text-2xl font-semibold font-serif text-[var(--ink)]">
          ${escapeHtml(d.cta.baslik)}
        </h2>
        <p class="text-sm sm:text-base text-[var(--ink-2)] leading-relaxed">
          ${escapeHtml(d.cta.metin)}
        </p>
        <div class="flex flex-wrap items-center gap-3 pt-2">
          <a href="${d.cta.birincil.link}" class="btn-primary">
            <span>${escapeHtml(d.cta.birincil.etiket)}</span> →
          </a>
          <a href="${d.cta.ikincil.link}" class="btn-secondary">
            <span>${escapeHtml(d.cta.ikincil.etiket)}</span>
          </a>
        </div>
      </section>
    </div>
  `;
}

const trLocale = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'src/locales/tr.json'), 'utf8'));
const enLocale = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'src/locales/en.json'), 'utf8'));
const homeH1 = `${trLocale['hero-title-line1']} ${trLocale['hero-title-line2']} ${trLocale['hero-title-highlight']}`;
const homeH1New = trLocale['home-h1'];
const overviewH1 = `${enLocale['hero-title-line1']} ${enLocale['hero-title-line2']} ${enLocale['hero-title-highlight']}`;

const basePages = [
  {
    dir: '',
    title: 'Trend Master Akademi | Ajansların İmdat Butonu',
    h1: homeH1New,
    description: 'Dijital ajansların imdat butonu: B2B White-Label mühendislik masası, acil kod kurtarma (SWAT), SaaS mimarisi ve kriz çözüm stüdyosu.',
    canonical: 'https://trendmasterakademi.com/',
    ogUrl: 'https://trendmasterakademi.com/',
    heading: '',
    subheading: trLocale['home-slogan'],
    extraContent: homeDirectoryHtml,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode
      ]
    }
  },
  {
    dir: 'tanitim',
    title: formatPageTitle(seoData['/tanitim/'].tr.title),
    h1: homeH1,
    description: seoData['/tanitim/'].tr.desc,
    canonical: 'https://trendmasterakademi.com/tanitim/',
    ogUrl: 'https://trendmasterakademi.com/tanitim/',
    hreflangTr: 'https://trendmasterakademi.com/tanitim/',
    hreflangEn: 'https://trendmasterakademi.com/overview/',
    heading: 'Teknik olarak projesi tıkanmış ajanslar için: Kodu Devralır, Ajansınız Adına Teslim Ederiz.',
    subheading: 'Dijital ajansların imdat butonu. Teknik olarak tıkanan projeler için B2B White-Label mühendislik masası, acil kod kurtarma (SWAT), PostgreSQL deadlock onarımı, SaaS mimarisi ve kriz çözüm stüdyosu.',
    extraContent: homePageExtraContent,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "FAQPage",
          "@id": "https://trendmasterakademi.com/tanitim/#faq",
          "mainEntity": faqData.map(f => ({
            "@type": "Question",
            "name": f.question.tr,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.answer.tr
            }
          }))
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Hizmetler ve Çalışma Modeli", "item": "https://trendmasterakademi.com/tanitim/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'overview',
    lang: 'en',
    title: formatPageTitle(seoData['/overview/'].en.title),
    h1: overviewH1,
    description: seoData['/overview/'].en.desc,
    canonical: 'https://trendmasterakademi.com/overview/',
    ogUrl: 'https://trendmasterakademi.com/overview/',
    hreflangTr: 'https://trendmasterakademi.com/tanitim/',
    hreflangEn: 'https://trendmasterakademi.com/overview/',
    heading: 'For agencies with stalled projects: We take over the code and deliver on your behalf.',
    subheading: 'The agency emergency button. Senior White-Label technical desk, emergency SWAT triage, PostgreSQL deadlock recovery, SaaS architecture, and incident mitigation for digital agencies.',
    extraContent: overviewPageExtraContent,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "FAQPage",
          "@id": "https://trendmasterakademi.com/overview/#faq",
          "mainEntity": faqData.map(f => ({
            "@type": "Question",
            "name": f.question.en || f.question.tr,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.answer.en || f.answer.tr
            }
          }))
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Services & Engagement Model", "item": "https://trendmasterakademi.com/overview/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'agency',
    title: 'Ajanslar İçin White-Label Mühendislik | Trend Master Akademi',
    h1: agencyH1.tr.full,
    description: 'Dijital ajansların görünmez teknik gücü: %100 White-Label, resmi NDA güvencesi, 20+ teknik yetkinlik, acil kriz masası ve kıdemli mühendislik takviyesi.',
    canonical: 'https://trendmasterakademi.com/agency/',
    ogUrl: 'https://trendmasterakademi.com/agency/',
    heading: 'Ajansınızın Yerine Değil, Ajansınızın Yanında Güvenilir Mühendislik Masası.',
    subheading: agencyGiris.tr,
    extraContent: agencyExtraContent,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Ajans Çözümleri & B2B Mühendislik Masası", "item": "https://trendmasterakademi.com/agency/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'kit',
    title: 'TMA Agency Response Kit & Crash Test 500 | Trend Master Akademi',
    h1: agencyKitH1.tr.full,
    description: 'Dijital ajansların görünmeyen kıdemli teknik masası: 8 Slaytlık Response Kit ve 60 Saniyelik Crash Test 500 posteri ile teknik kriz protokollerinizi şimdi güvenceye alın.',
    canonical: 'https://trendmasterakademi.com/kit/',
    ogUrl: 'https://trendmasterakademi.com/kit/',
    hreflangTr: 'https://trendmasterakademi.com/kit/',
    hreflangEn: 'https://trendmasterakademi.com/agency-kit/',
    heading: 'TMA Agency Kit // 8 Slaytlık Görsel Kılavuz & Crash Test 500',
    subheading: 'Ajansınız teknik bir krize hazır mı? Yüksek çözünürlüklü slaytlar, poster vitrini ve resmi PDF indirme alanı.',
    extraContent: kitExtraContentTr,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "TMA Agency Kit", "item": "https://trendmasterakademi.com/kit/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'agency-kit',
    lang: 'en',
    title: 'TMA Agency Response Kit & Crash Test 500 | Trend Master Akademi',
    h1: agencyKitH1.en.full,
    description: 'The invisible senior engineering desk for digital agencies: 8-Slide Response Kit and 60-Second Crash Test 500 poster to fortify your technical crisis protocols.',
    canonical: 'https://trendmasterakademi.com/agency-kit/',
    ogUrl: 'https://trendmasterakademi.com/agency-kit/',
    hreflangTr: 'https://trendmasterakademi.com/kit/',
    hreflangEn: 'https://trendmasterakademi.com/agency-kit/',
    heading: 'TMA Agency Kit // 8-Slide Visual Guide & Crash Test 500',
    subheading: 'Is your agency prepared for a technical outage? High-resolution slides, poster showcase, and official PDF download.',
    extraContent: kitExtraContentEn,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "TMA Agency Kit", "item": "https://trendmasterakademi.com/agency-kit/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'crash-test',
    title: 'Agency Crash Test (60 sn) | Trend Master Akademi',
    h1: crashTestH1.tr.full,
    description: 'Ajansınız teknik bir krize hazır mı? HTTP 500, yazılımcı ayrılığı veya lansman darboğazı için 60 saniyede kriz risk skorunuzu ve eylem planınızı görün.',
    canonical: 'https://trendmasterakademi.com/crash-test/',
    ogUrl: 'https://trendmasterakademi.com/crash-test/',
    heading: 'Agency Crash Test // 60 Saniyede Ajans Kriz Dayanıklılık Skoru',
    subheading: 'Kritik kod kilitlenmeleri, devir süreçleri tıkanmış projeler veya yaklaşan teslimat baskısı altında ajansınızın risk puanını ölçün.',
    extraContent: crashTestExtraContent,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Agency Crash Test (60sn)", "item": "https://trendmasterakademi.com/crash-test/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'devir-kontrolu',
    title: 'Devir Hazırlık Kontrolü (12 Kalem) | Trend Master Akademi',
    h1: handoverAuditH1.tr,
    description: 'Yazılımcınız ayrılıyor veya ayrıldı mı? 12 kritik kalemi kontrol edin, devir risk skorunuzu ve eksik envanterinizi 60 saniyede ücretsiz analiz edin.',
    canonical: 'https://trendmasterakademi.com/devir-kontrolu/',
    ogUrl: 'https://trendmasterakademi.com/devir-kontrolu/',
    hreflangTr: 'https://trendmasterakademi.com/devir-kontrolu/',
    hreflangEn: 'https://trendmasterakademi.com/handover-audit/',
    heading: 'Devir Hazırlık Kontrolü // 12 Kalemlik Geliştirici Ayrılık Denetimi',
    subheading: 'Git repo, ortam değişkenleri, DNS ve ödeme anahtarlarınızı ayrılan geliştiriciden eksiksiz devralıp almadığınızı test edin.',
    extraContent: devirExtraContent,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Devir Hazırlık Kontrolü", "item": "https://trendmasterakademi.com/devir-kontrolu/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'handover-audit',
    lang: 'en',
    title: 'Developer Handover Readiness Audit (12 Checkpoints) | Trend Master Akademi',
    h1: handoverAuditH1.en,
    description: 'Is your developer leaving or already left? Check 12 mission-critical items, get your handover risk score and missing inventory in 60 seconds.',
    canonical: 'https://trendmasterakademi.com/handover-audit/',
    ogUrl: 'https://trendmasterakademi.com/handover-audit/',
    hreflangTr: 'https://trendmasterakademi.com/devir-kontrolu/',
    hreflangEn: 'https://trendmasterakademi.com/handover-audit/',
    heading: 'Developer Handover Readiness Audit // 12-Point Transition Checklist',
    subheading: 'Test whether you have fully received the Git repo, environment variables, DNS and payment keys from the departing developer.',
    extraContent: devirExtraContentEn,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Handover Audit", "item": "https://trendmasterakademi.com/handover-audit/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'sozluk',
    title: 'Teknik Terim Sözlüğü | Trend Master Akademi',
    h1: glossaryHubH1.tr,
    description: 'Yazılımcınız teknik bir bahane sunduğunda ne anlama geldiğini öğrenin. Deadlock, N+1, Race Condition, Webhook ve 12 temel terimin iş etkisi ve çözümü.',
    canonical: 'https://trendmasterakademi.com/sozluk/',
    ogUrl: 'https://trendmasterakademi.com/sozluk/',
    hreflangTr: 'https://trendmasterakademi.com/sozluk/',
    hreflangEn: 'https://trendmasterakademi.com/glossary/',
    heading: 'Yazılımcı Dili → Ajans Dili Terim Sözlüğü',
    subheading: 'Teknik jargonu ajans patronunun diline çeviren pratik rehber.',
    extraContent: glossaryHubExtraContent,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "name": "Teknik Terim Sözlüğü",
          "description": "Yazılımcınız teknik bir bahane sunduğunda ne anlama geldiğini öğrenin. Deadlock, N+1, Race Condition, Webhook ve 12 temel terimin iş etkisi ve çözümü.",
          "url": "https://trendmasterakademi.com/sozluk/"
        },
        {
          "@type": "ItemList",
          "numberOfItems": glossaryTerms.length,
          "itemListElement": glossaryTerms.map((term, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": term.title,
            "url": `https://trendmasterakademi.com/sozluk/${term.slug}/`
          }))
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Teknik Terim Sözlüğü", "item": "https://trendmasterakademi.com/sozluk/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'glossary',
    lang: 'en',
    title: 'Developer-to-Agency Tech Glossary | Trend Master Akademi',
    h1: glossaryHubH1.en,
    description: 'Understand technical explanations from developers. Deadlock, N+1, Race Condition, Webhook, and 12 core concepts translated into business impact.',
    canonical: 'https://trendmasterakademi.com/glossary/',
    ogUrl: 'https://trendmasterakademi.com/glossary/',
    hreflangTr: 'https://trendmasterakademi.com/sozluk/',
    hreflangEn: 'https://trendmasterakademi.com/glossary/',
    heading: 'Developer-to-Agency Tech Glossary',
    subheading: 'A practical translation guide bridging technical jargon with business operations.',
    extraContent: glossaryHubExtraContentEn,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "name": "Developer-to-Agency Tech Glossary",
          "description": "Understand technical explanations from developers. Deadlock, N+1, Race Condition, Webhook, and 12 core concepts translated into business impact.",
          "url": "https://trendmasterakademi.com/glossary/"
        },
        {
          "@type": "ItemList",
          "numberOfItems": glossaryTerms.length,
          "itemListElement": glossaryTerms.map((term, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": term.titleEn || term.title,
            "url": `https://trendmasterakademi.com/glossary/${term.slug}/`
          }))
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Technical Glossary", "item": "https://trendmasterakademi.com/glossary/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'kesinti-maliyeti',
    title: seoData['/kesinti-maliyeti/'].tr.title,
    h1: downtimeCostH1.tr,
    description: seoData['/kesinti-maliyeti/'].tr.desc,
    canonical: 'https://trendmasterakademi.com/kesinti-maliyeti/',
    ogUrl: 'https://trendmasterakademi.com/kesinti-maliyeti/',
    hreflangTr: 'https://trendmasterakademi.com/kesinti-maliyeti/',
    hreflangEn: 'https://trendmasterakademi.com/downtime-calc/',
    heading: '',
    subheading: kesintiYontem.tr.altBaslik,
    extraContent: kesintiExtraContent,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Kesinti Maliyeti Hesaplayıcı", "item": "https://trendmasterakademi.com/kesinti-maliyeti/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'downtime-calc',
    lang: 'en',
    title: seoData['/downtime-calc/'].en.title,
    h1: downtimeCostH1.en,
    description: seoData['/downtime-calc/'].en.desc,
    canonical: 'https://trendmasterakademi.com/downtime-calc/',
    ogUrl: 'https://trendmasterakademi.com/downtime-calc/',
    hreflangTr: 'https://trendmasterakademi.com/kesinti-maliyeti/',
    hreflangEn: 'https://trendmasterakademi.com/downtime-calc/',
    heading: '',
    subheading: kesintiYontem.en.altBaslik,
    extraContent: kesintiExtraContentEn,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Downtime Calculator", "item": "https://trendmasterakademi.com/downtime-calc/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'about',
    title: 'Mühendislik Standartlarımız | Trend Master Akademi',
    h1: aboutH1.tr,
    description: 'Trend Master Akademi mühendislik standartları, 4 temel prensip ve B2B SWAT vizyonu.',
    canonical: 'https://trendmasterakademi.com/about/',
    ogUrl: 'https://trendmasterakademi.com/about/',
    heading: 'Ajansların Güvendiği Arka Plan Mühendislik Masası',
    subheading: 'Modern web, SaaS, API mimarileri ve acil kod kurtarma (SWAT) stüdyosu.',
    extraContent: aboutExtraContent,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Mühendislik Standartlarımız & Hakkımızda", "item": "https://trendmasterakademi.com/about/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'hikayemiz',
    title: 'Hikâyemiz & Kuruluş Anlatısı | Trend Master Akademi',
    h1: storyH1.tr,
    description: seoData['/hikayemiz/'].tr.desc,
    canonical: 'https://trendmasterakademi.com/hikayemiz/',
    ogUrl: 'https://trendmasterakademi.com/hikayemiz/',
    hreflangTr: 'https://trendmasterakademi.com/hikayemiz/',
    hreflangEn: 'https://trendmasterakademi.com/story/',
    subheading: 'Aslında bu iş fikri bir online derste doğdu.',
    extraContent: storyExtraContent,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Trend Master Akademi'nin hikâyesi", "item": "https://trendmasterakademi.com/hikayemiz/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'story',
    lang: 'en',
    title: 'Our Story & Founding Origins | Trend Master Akademi',
    h1: storyH1.en,
    description: seoData['/story/'].en.desc,
    canonical: 'https://trendmasterakademi.com/story/',
    ogUrl: 'https://trendmasterakademi.com/story/',
    hreflangTr: 'https://trendmasterakademi.com/hikayemiz/',
    hreflangEn: 'https://trendmasterakademi.com/story/',
    subheading: 'In truth, this concept originated in an online live class.',
    extraContent: storyExtraContentEn,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Our Story", "item": "https://trendmasterakademi.com/story/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'privacy',
    title: 'KVKK & Gizlilik Politikası | Trend Master Akademi',
    h1: privacyH1.tr,
    description: 'Trend Master Akademi KVKK aydınlatma metni, veri sorumlusu taahhüdü, resmi NDA ve %100 White-Label gizlilik standartları.',
    canonical: 'https://trendmasterakademi.com/privacy/',
    ogUrl: 'https://trendmasterakademi.com/privacy/',
    heading: 'KVKK Aydınlatma Metni & Gizlilik Politikası',
    subheading: '6698 sayılı KVKK kapsamında veri sorumlusu taahhüdü, resmi NDA ve %100 White-Label gizlilik ilkeleri.',
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "KVKK Aydınlatma Metni & Gizlilik Politikası", "item": "https://trendmasterakademi.com/privacy/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'gizlilik',
    title: 'KVKK & Gizlilik Politikası | Trend Master Akademi',
    h1: privacyH1.tr,
    description: 'Trend Master Akademi KVKK aydınlatma metni, veri sorumlusu taahhüdü, resmi NDA ve %100 White-Label gizlilik standartları.',
    canonical: 'https://trendmasterakademi.com/privacy/',
    ogUrl: 'https://trendmasterakademi.com/privacy/',
    heading: 'KVKK Aydınlatma Metni & Gizlilik Politikası',
    subheading: '6698 sayılı KVKK kapsamında veri sorumlusu taahhüdü, resmi NDA ve %100 White-Label gizlilik ilkeleri.',
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "KVKK Aydınlatma Metni & Gizlilik Politikası", "item": "https://trendmasterakademi.com/privacy/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'nda',
    title: 'Gizlilik ve Çalışma Sözleşmesi | Trend Master Akademi',
    h1: ndaFullAgreementData.pageHeader.h1.tr,
    description: 'Çalışmaya başlamadan önce imzaladığımız karşılıklı gizlilik ve çalışma sözleşmesinin tam metni ve sade dilli özeti.',
    canonical: 'https://trendmasterakademi.com/nda/',
    ogUrl: 'https://trendmasterakademi.com/nda/',
    subheading: ndaFullAgreementData.pageHeader.lead.tr,
    extraContent: ndaExtraContent,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Gizlilik ve Çalışma Sözleşmesi", "item": "https://trendmasterakademi.com/nda/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'teshis',
    title: 'Teşhis Kataloğu | Trend Master Akademi',
    h1: teshisCatalogH1.tr,
    description: 'Belirtiden nedene: yazılım arızalarının ajans diliyle teşhis rehberi.',
    canonical: 'https://trendmasterakademi.com/teshis/',
    ogUrl: 'https://trendmasterakademi.com/teshis/',
    hreflangTr: 'https://trendmasterakademi.com/teshis/',
    hreflangEn: 'https://trendmasterakademi.com/diagnostic/',
    heading: 'Teşhis Kataloğu',
    subheading: 'Belirtiyi görüyorsunuz ama nedenini bilmiyorsunuz. Buradaki her teşhis bir belirtiyle başlar, aynı belirtiyi üretebilecek nedenleri ayırır ve hangisiyle karşı karşıya olduğunuzu nasıl anlayacağınızı gösterir.',
    extraContent: teshisHubExtraContent,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "name": "Teşhis Kataloğu",
          "description": "Belirtiden nedene: yazılım arızalarının ajans diliyle teşhis rehberi.",
          "url": "https://trendmasterakademi.com/teshis/"
        },
        {
          "@type": "ItemList",
          "numberOfItems": teshisData.length,
          "itemListElement": teshisData.map((item, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": `${item.no} · ${item.baslik.tr}`,
            "url": `https://trendmasterakademi.com/teshis/${item.slug}/`
          }))
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Teşhis Kataloğu", "item": "https://trendmasterakademi.com/teshis/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'diagnostic',
    lang: 'en',
    title: 'Diagnostic Catalog // 20 Documented Outage Symptoms | Trend Master Akademi',
    h1: teshisCatalogH1.en,
    description: 'From symptom to root cause: technical diagnosis guide for agency leaders and engineering managers.',
    canonical: 'https://trendmasterakademi.com/diagnostic/',
    ogUrl: 'https://trendmasterakademi.com/diagnostic/',
    hreflangTr: 'https://trendmasterakademi.com/teshis/',
    hreflangEn: 'https://trendmasterakademi.com/diagnostic/',
    heading: 'Diagnostic Catalog',
    subheading: 'You see the symptom but not the cause. Each diagnosis begins with an observable failure, isolates potential causes, and outlines triage protocols.',
    extraContent: teshisHubExtraContentEn,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "name": "Diagnostic Catalog",
          "description": "From symptom to root cause: technical diagnosis guide for agency leaders and engineering managers.",
          "url": "https://trendmasterakademi.com/diagnostic/"
        },
        {
          "@type": "ItemList",
          "numberOfItems": teshisData.length,
          "itemListElement": teshisData.map((item, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": `${item.no} · ${item.baslik.en || item.baslik.tr}`,
            "url": `https://trendmasterakademi.com/diagnostic/${item.slug}/`
          }))
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Diagnostic Catalog", "item": "https://trendmasterakademi.com/diagnostic/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'sos',
    title: 'Acil Teknik Destek (SOS) | Trend Master Akademi',
    h1: sosH1.tr,
    description: 'Ajansınızın canlı sistemi durduysa, teslim tarihi yanıyorsa ya da devraldığınız kod açılmıyorsa kriz hattı: her gün 09:00 – 24:00, ilk teşhis ücretsiz.',
    canonical: 'https://trendmasterakademi.com/sos/',
    ogUrl: 'https://trendmasterakademi.com/sos/',
    subheading: 'Burası ajansların imdat butonu. Ajansınızın canlı sistemi durduysa, teslim tarihi yanıyorsa ya da devraldığınız kod açılmıyorsa doğrudan buraya yazın. İlk teşhis ücretsizdir.',
    extraContent: sosPageExtraContent,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Acil Teknik Destek", "item": "https://trendmasterakademi.com/sos/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'kurtarilabilirlik',
    title: 'Kurtarılabilirlik İndeksi (Refactor vs Rebuild) | Trend Master Akademi',
    h1: salvageabilityH1.tr,
    description: 'Mevcut spagetti veya dokümantasyonsuz kodu kurtarmalı mı, boğmalı mı, yoksa sıfırdan mı yazmalı? 5 boyutlu objektif CTO karar matrisi.',
    canonical: 'https://trendmasterakademi.com/kurtarilabilirlik/',
    ogUrl: 'https://trendmasterakademi.com/kurtarilabilirlik/',
    hreflangTr: 'https://trendmasterakademi.com/kurtarilabilirlik/',
    hreflangEn: 'https://trendmasterakademi.com/salvageability/',
    heading: '',
    subheading: 'Mevcut kodu kurtarmaya değer mi, boğma stratejisi mi uygulanmalı, yoksa temiz sayfa mı açılmalı? 5 boyutlu objektif risk puanlaması ve anlık karar raporu.',
    extraContent: salvageabilityExtraContentTr,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Kurtarılabilirlik İndeksi", "item": "https://trendmasterakademi.com/kurtarilabilirlik/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'salvageability',
    lang: 'en',
    title: 'Salvageability Index (Refactor vs Rebuild Matrix) | Trend Master Akademi',
    h1: salvageabilityH1.en,
    description: 'Should you rescue, strangle, or scrap legacy code? 5-dimensional objective risk analysis and actionable CTO decision matrix.',
    canonical: 'https://trendmasterakademi.com/salvageability/',
    ogUrl: 'https://trendmasterakademi.com/salvageability/',
    hreflangTr: 'https://trendmasterakademi.com/kurtarilabilirlik/',
    hreflangEn: 'https://trendmasterakademi.com/salvageability/',
    heading: 'Salvageability Index // Refactor vs Rebuild Decision Matrix',
    subheading: 'Is the legacy codebase worth saving? 5-dimensional objective risk analysis and actionable CTO decision matrix.',
    extraContent: salvageabilityExtraContentEn,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Salvageability Index", "item": "https://trendmasterakademi.com/salvageability/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'post-mortem',
    title: 'Incident Post-Mortem & Kök Neden (RCA) Kütüphanesi | Trend Master Akademi',
    h1: postMortemHubH1.tr,
    description: 'Gerçek üretim kesintileri, PostgreSQL deadlock, ödeme race condition vakaları ve uygulanan kalıcı mühendislik çözümleri.',
    canonical: 'https://trendmasterakademi.com/post-mortem/',
    ogUrl: 'https://trendmasterakademi.com/post-mortem/',
    hreflangTr: 'https://trendmasterakademi.com/post-mortem/',
    hreflangEn: 'https://trendmasterakademi.com/post-mortems/',
    heading: '',
    subheading: 'Sahada yaşanmış gerçek krizler, kronolojik hata akışları, kök neden analizleri ve uygulanan kalıcı mühendislik çözümleri.',
    extraContent: postMortemHubExtraContentTr,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Post-Mortem Kütüphanesi", "item": "https://trendmasterakademi.com/post-mortem/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'post-mortems',
    lang: 'en',
    title: 'Public Incident Post-Mortems & RCA Library | Trend Master Akademi',
    h1: postMortemHubH1.en,
    description: 'Real-world production outages, PostgreSQL deadlocks, payment race conditions, and permanent engineering mitigations.',
    canonical: 'https://trendmasterakademi.com/post-mortems/',
    ogUrl: 'https://trendmasterakademi.com/post-mortems/',
    hreflangTr: 'https://trendmasterakademi.com/post-mortem/',
    hreflangEn: 'https://trendmasterakademi.com/post-mortems/',
    heading: 'Public Incident Post-Mortems & RCA Library',
    subheading: 'Real-world production outages, incident chronology, root cause analyses, and permanent engineering mitigations.',
    extraContent: postMortemHubExtraContentEn,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Post-Mortems", "item": "https://trendmasterakademi.com/post-mortems/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'triyaj',
    title: 'Canlı Kriz & Triyaj Simülatörü // İlk 15 Dakika Protokolü | Trend Master Akademi',
    h1: triageH1.tr,
    description: 'Canlı sisteminiz krizde mi? Belirtiyi seçin, ilk 15 dakikada ne yapmamanız gerektiğini, çekilecek log komutlarını ve acil müdahale adımlarını anında görün.',
    canonical: 'https://trendmasterakademi.com/triyaj/',
    ogUrl: 'https://trendmasterakademi.com/triyaj/',
    hreflangTr: 'https://trendmasterakademi.com/triyaj/',
    hreflangEn: 'https://trendmasterakademi.com/triage/',
    heading: 'Canlı Kriz & Triyaj Simülatörü // İlk 15 Dakika Protokolü',
    subheading: 'Canlı sisteminiz çöktüğünde veya kilitlendiğinde ilk panikle yapılan hamleler kesinti süresini saatlerce uzatır. Belirtinizi seçin, kanıt toplayın ve soğukkanlı eylem planını uygulayın.',
    extraContent: triageExtraContentTr,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Kriz Triyaj Simülatörü", "item": "https://trendmasterakademi.com/triyaj/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'triage',
    lang: 'en',
    title: 'Emergency Triage & Incident Simulator // First 15-Min Protocol | Trend Master Akademi',
    h1: triageH1.en,
    description: 'Is your production system down? Select your symptom, discover what NOT to do in the first 15 minutes, extract critical logs, and get immediate triage steps.',
    canonical: 'https://trendmasterakademi.com/triage/',
    ogUrl: 'https://trendmasterakademi.com/triage/',
    hreflangTr: 'https://trendmasterakademi.com/triyaj/',
    hreflangEn: 'https://trendmasterakademi.com/triage/',
    heading: 'Emergency Triage & Incident Simulator // First 15-Minute Protocol',
    subheading: 'When production fails, panicked initial responses multiply downtime tenfold. Select your symptom, gather hard evidence, and execute disciplined incident protocols.',
    extraContent: triageExtraContentEn,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Emergency Triage Simulator", "item": "https://trendmasterakademi.com/triage/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'sla',
    title: 'Şeffaf Mühendislik SLA & Yanıt Taahhütleri | Trend Master Akademi',
    h1: slaH1.tr,
    description: seoData['/sla/'].tr.desc,
    canonical: 'https://trendmasterakademi.com/sla/',
    ogUrl: 'https://trendmasterakademi.com/sla/',
    heading: 'Şeffaf Mühendislik SLA & Yanıt Süresi Matrisi',
    subheading: 'Ajanslar ve kurumsal şirketler için muğlak "en kısa sürede inceleriz" sözleri yerine; dakikalarla tanımlanmış mühendislik masası taahhütleri.',
    extraContent: slaExtraContentTr,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Mühendislik SLA & Taahhütler", "item": "https://trendmasterakademi.com/sla/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'teknoloji-uyumluluk',
    title: 'Teknoloji Yığını & Kurtarma Matrisi | Trend Master Akademi',
    h1: techStackH1.tr,
    description: 'Sisteminizin dilleri, veritabanları ve bulut altyapısı ne olursa olsun: TMA cerrahi müdahale derinliği, bilinen darboğazlar ve SWAT hazırbulunuşluk süreleri.',
    canonical: 'https://trendmasterakademi.com/teknoloji-uyumluluk/',
    ogUrl: 'https://trendmasterakademi.com/teknoloji-uyumluluk/',
    hreflangTr: 'https://trendmasterakademi.com/teknoloji-uyumluluk/',
    hreflangEn: 'https://trendmasterakademi.com/tech-matrix/',
    heading: 'Teknoloji Yığını & Kurtarma Matrisi',
    subheading: 'Node.js, Go, Python, PostgreSQL, Redis, Kubernetes ve AWS... Sisteminizin stack kombinasyonunu seçin; TMA’nın bu teknolojilerdeki cerrahi kurtarma derinliğini ve risk noktalarını inceleyin.',
    extraContent: techMatrixExtraContentTr,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Teknoloji Uyumluluk Matrisi", "item": "https://trendmasterakademi.com/teknoloji-uyumluluk/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'tech-matrix',
    lang: 'en',
    title: 'Tech Stack Compatibility & Rescue Matrix | Trend Master Akademi',
    h1: techStackH1.en,
    description: 'Inspect TMA surgical rescue depth, known mission-critical bottlenecks, and operational readiness times across your languages, databases, and cloud infrastructure.',
    canonical: 'https://trendmasterakademi.com/tech-matrix/',
    ogUrl: 'https://trendmasterakademi.com/tech-matrix/',
    hreflangTr: 'https://trendmasterakademi.com/teknoloji-uyumluluk/',
    hreflangEn: 'https://trendmasterakademi.com/tech-matrix/',
    heading: 'Tech Stack Compatibility & Rescue Matrix',
    subheading: 'Node.js, Go, Python, PostgreSQL, Redis, Kubernetes, and AWS... Select your stack components to evaluate TMA’s surgical rescue capabilities, known failure vectors, and SWAT response times.',
    extraContent: techMatrixExtraContentEn,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Tech Compatibility Matrix", "item": "https://trendmasterakademi.com/tech-matrix/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'gizlilik-sozlesmesi',
    title: 'İki Taraflı Gizlilik ve Fikri Mülkiyet Sözleşmesi (Mutual NDA) | Trend Master Akademi',
    h1: mutualNdaH1.tr,
    description: 'Tek bir satır koda dokunmadan önce karşılıklı bağlayıcı gizlilik ve %100 fikri mülkiyet koruma taahhütnamenizi 30 saniyede oluşturun, yazdırın veya indirin.',
    canonical: 'https://trendmasterakademi.com/gizlilik-sozlesmesi/',
    ogUrl: 'https://trendmasterakademi.com/gizlilik-sozlesmesi/',
    hreflangTr: 'https://trendmasterakademi.com/gizlilik-sozlesmesi/',
    hreflangEn: 'https://trendmasterakademi.com/mutual-nda/',
    heading: 'İki Taraflı Gizlilik ve Fikri Mülkiyet Sözleşmesi (Mutual NDA)',
    subheading: 'Tek bir satır kaynak koda, veritabanı şemasına veya sunucu erişimine dokunmadan önce; karşılıklı bağlayıcı kurumsal gizlilik ve %100 fikri mülkiyet koruma taahhütnamenizi anında oluşturun.',
    extraContent: ndaGeneratorExtraContentTr,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Gizlilik Sözleşmesi (Mutual NDA)", "item": "https://trendmasterakademi.com/gizlilik-sozlesmesi/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'mutual-nda',
    lang: 'en',
    title: 'Mutual Non-Disclosure & IP Protection Agreement (NDA) | Trend Master Akademi',
    h1: mutualNdaH1.en,
    description: 'Generate, print, or download your binding bilateral confidentiality and 100% intellectual property protection agreement in 30 seconds before sharing code.',
    canonical: 'https://trendmasterakademi.com/mutual-nda/',
    ogUrl: 'https://trendmasterakademi.com/mutual-nda/',
    hreflangTr: 'https://trendmasterakademi.com/gizlilik-sozlesmesi/',
    hreflangEn: 'https://trendmasterakademi.com/mutual-nda/',
    heading: 'Mutual Non-Disclosure & IP Protection Agreement (NDA)',
    subheading: 'Before touching a single line of source code, database schema, or infrastructure credential; generate your binding bilateral confidentiality and 100% intellectual property protection agreement instantly.',
    extraContent: ndaGeneratorExtraContentEn,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Mutual NDA & IP Agreement", "item": "https://trendmasterakademi.com/mutual-nda/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'hasar-tespiti',
    title: seoData['/hasar-tespiti/'].tr.title,
    h1: outageSimulatorH1.tr,
    description: seoData['/hasar-tespiti/'].tr.desc,
    canonical: 'https://trendmasterakademi.com/hasar-tespiti/',
    ogUrl: 'https://trendmasterakademi.com/hasar-tespiti/',
    hreflangTr: 'https://trendmasterakademi.com/hasar-tespiti/',
    hreflangEn: 'https://trendmasterakademi.com/outage-simulator/',
    heading: '',
    subheading: outageSimulatorData.tr.hero.subtitle,
    extraContent: outageSimulatorExtraContentTr,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": outageSimulatorH1.tr, "item": "https://trendmasterakademi.com/hasar-tespiti/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'outage-simulator',
    lang: 'en',
    title: seoData['/outage-simulator/'].en.title,
    h1: outageSimulatorH1.en,
    description: seoData['/outage-simulator/'].en.desc,
    canonical: 'https://trendmasterakademi.com/outage-simulator/',
    ogUrl: 'https://trendmasterakademi.com/outage-simulator/',
    hreflangTr: 'https://trendmasterakademi.com/hasar-tespiti/',
    hreflangEn: 'https://trendmasterakademi.com/outage-simulator/',
    heading: '',
    subheading: outageSimulatorData.en.hero.subtitle,
    extraContent: outageSimulatorExtraContentEn,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": outageSimulatorH1.en, "item": "https://trendmasterakademi.com/outage-simulator/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'radar',
    title: seoData['/radar/'].tr.title,
    h1: radarH1.tr,
    description: seoData['/radar/'].tr.desc,
    canonical: 'https://trendmasterakademi.com/radar/',
    ogUrl: 'https://trendmasterakademi.com/radar/',
    heading: '',
    subheading: radarData.tr.hero.subtitle,
    extraContent: radarExtraContentTr,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": radarH1.tr, "item": "https://trendmasterakademi.com/radar/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'kod-sagligi',
    title: 'Kod Sağlığı & Teknik Borç Denetim Listesi | Trend Master Akademi',
    h1: codeHealthH1.tr,
    description: '20 kritik kontrol noktasıyla kod tabanınızın yangın riskini ölçün: mimari, veritabanı kilitleri, güvenlik açıkları ve teknik borç puanı.',
    canonical: 'https://trendmasterakademi.com/kod-sagligi/',
    ogUrl: 'https://trendmasterakademi.com/kod-sagligi/',
    hreflangTr: 'https://trendmasterakademi.com/kod-sagligi/',
    hreflangEn: 'https://trendmasterakademi.com/codebase-health/',
    heading: 'Kod Sağlığı & Teknik Borç Denetim Listesi',
    subheading: '20 kritik ağırlıklı kontrol noktasıyla kod tabanınızın yangın riskini ölçün. İlk 3 acil müdahale noktanızı tespit edin ve yönetim kuruluna sunulabilir Markdown raporunuzu anında alın.',
    extraContent: codeHealthExtraContentTr,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Kod Sağlığı Denetimi", "item": "https://trendmasterakademi.com/kod-sagligi/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'codebase-health',
    lang: 'en',
    title: 'Codebase Health & Technical Debt Audit Checklist | Trend Master Akademi',
    h1: codeHealthH1.en,
    description: 'Score your codebase across 20 weighted checkpoints: architectural debt, database lock risks, security vulnerabilities, and get an instant audit report.',
    canonical: 'https://trendmasterakademi.com/codebase-health/',
    ogUrl: 'https://trendmasterakademi.com/codebase-health/',
    hreflangTr: 'https://trendmasterakademi.com/kod-sagligi/',
    hreflangEn: 'https://trendmasterakademi.com/codebase-health/',
    heading: 'Codebase Health & Technical Debt Audit Checklist',
    subheading: 'Quantify your technical debt across 20 weighted criteria. Identify your top 3 fire hazards and export an executive Markdown brief in seconds.',
    extraContent: codeHealthExtraContentEn,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "Codebase Health Audit", "item": "https://trendmasterakademi.com/codebase-health/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'kurtarma-maliyeti',
    title: seoData['/kurtarma-maliyeti/'].tr.title,
    h1: rescueRoiH1.tr,
    description: seoData['/kurtarma-maliyeti/'].tr.desc,
    canonical: 'https://trendmasterakademi.com/kurtarma-maliyeti/',
    ogUrl: 'https://trendmasterakademi.com/kurtarma-maliyeti/',
    hreflangTr: 'https://trendmasterakademi.com/kurtarma-maliyeti/',
    hreflangEn: 'https://trendmasterakademi.com/rescue-roi/',
    heading: '',
    subheading: rescueRoiData.tr.hero.subtitle,
    extraContent: rescueRoiExtraContentTr,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": rescueRoiH1.tr, "item": "https://trendmasterakademi.com/kurtarma-maliyeti/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'rescue-roi',
    lang: 'en',
    title: seoData['/rescue-roi/'].en.title,
    h1: rescueRoiH1.en,
    description: seoData['/rescue-roi/'].en.desc,
    canonical: 'https://trendmasterakademi.com/rescue-roi/',
    ogUrl: 'https://trendmasterakademi.com/rescue-roi/',
    hreflangTr: 'https://trendmasterakademi.com/kurtarma-maliyeti/',
    hreflangEn: 'https://trendmasterakademi.com/rescue-roi/',
    heading: '',
    subheading: rescueRoiData.en.hero.subtitle,
    extraContent: rescueRoiExtraContentEn,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": rescueRoiH1.en, "item": "https://trendmasterakademi.com/rescue-roi/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'tmai',
    title: seoData['/tmai/'].tr.title,
    h1: tmaiH1.tr,
    description: seoData['/tmai/'].tr.desc,
    canonical: 'https://trendmasterakademi.com/tmai/',
    ogUrl: 'https://trendmasterakademi.com/tmai/',
    hreflangTr: 'https://trendmasterakademi.com/tmai/',
    hreflangEn: 'https://trendmasterakademi.com/ai-code-takeover/',
    heading: tmaiH1.tr,
    subheading: tmaiData.tr.giris,
    extraContent: renderTmaiContent('tr'),
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "Service",
          "name": "tmai",
          "serviceType": "Yapay zekâyla yazılmış kodun devralınması",
          "description": seoData['/tmai/'].tr.desc,
          "provider": {
            "@id": "https://trendmasterakademi.com/#organization"
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "tmai", "item": "https://trendmasterakademi.com/tmai/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'ai-code-takeover',
    lang: 'en',
    title: seoData['/ai-code-takeover/'].en.title,
    h1: tmaiH1.en,
    description: seoData['/ai-code-takeover/'].en.desc,
    canonical: 'https://trendmasterakademi.com/ai-code-takeover/',
    ogUrl: 'https://trendmasterakademi.com/ai-code-takeover/',
    hreflangTr: 'https://trendmasterakademi.com/tmai/',
    hreflangEn: 'https://trendmasterakademi.com/ai-code-takeover/',
    heading: tmaiH1.en,
    subheading: tmaiData.en.giris,
    extraContent: renderTmaiContent('en'),
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        webSiteNode,
        {
          "@type": "Service",
          "name": "tmai",
          "serviceType": "AI-generated code takeover",
          "description": seoData['/ai-code-takeover/'].en.desc,
          "provider": {
            "@id": "https://trendmasterakademi.com/#organization"
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trendmasterakademi.com/" },
            { "@type": "ListItem", "position": 2, "name": "tmai", "item": "https://trendmasterakademi.com/ai-code-takeover/" }
          ]
        }
      ]
    }
  }
];

// 3.3 — Add each glossary term page dynamically with extraContent and schema
const glossaryPages = glossaryTerms.flatMap(term => {
  const matching = teshisData.filter(d => d.ilgiliTerimler && d.ilgiliTerimler.includes(term.slug));
  const visible = matching.slice(0, 4);
  const remaining = matching.length - 4;
  
  let reverseBlockTr = '';
  let reverseBlockEn = '';
  if (matching.length > 0) {
    reverseBlockTr = `
      <section class="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-3 mt-6">
        <h2 class="text-xl font-bold text-[var(--ink)]">Bu terim şu belirtilerde çıkar</h2>
        <ul class="space-y-2 font-mono text-sm text-[var(--accent)]">
          ${visible.map(d => `<li><a href="/teshis/${escapeHtml(d.slug)}/" class="hover:underline">→ ${escapeHtml(d.no)} · ${escapeHtml(d.baslik.tr)}</a></li>`).join('\n          ')}
        </ul>
        ${remaining > 0 ? `<p class="text-xs text-[var(--ink-3)] pt-1"><a href="/teshis/" class="text-[var(--accent)] hover:underline">ve ${remaining} teşhis daha →</a></p>` : ''}
      </section>
    `;
    reverseBlockEn = `
      <section class="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-3 mt-6">
        <h2 class="text-xl font-bold text-[var(--ink)]">This concept appears in these incident symptoms</h2>
        <ul class="space-y-2 font-mono text-sm text-[var(--accent)]">
          ${visible.map(d => `<li><a href="/diagnostic/${escapeHtml(d.slug)}/" class="hover:underline">→ ${escapeHtml(d.no)} · ${escapeHtml(d.baslik.en || d.baslik.tr)}</a></li>`).join('\n          ')}
        </ul>
        ${remaining > 0 ? `<p class="text-xs text-[var(--ink-3)] pt-1"><a href="/diagnostic/" class="text-[var(--accent)] hover:underline">and ${remaining} more diagnoses →</a></p>` : ''}
      </section>
    `;
  }

  const relatedTermsHtmlTr = term.relatedTerms && term.relatedTerms.length > 0
    ? `
      <ul class="space-y-1 font-mono text-sm text-[var(--accent)] my-3">
        ${term.relatedTerms.map(rSlug => {
          const rObj = glossaryTerms.find(g => g.slug === rSlug);
          const rTitle = rObj ? rObj.title : rSlug;
          return `<li><a href="/sozluk/${escapeHtml(rSlug)}/" class="hover:underline">→ ${escapeHtml(rTitle)}</a></li>`;
        }).join('\n        ')}
      </ul>
    `
    : '';

  const relatedTermsHtmlEn = term.relatedTerms && term.relatedTerms.length > 0
    ? `
      <ul class="space-y-1 font-mono text-sm text-[var(--accent)] my-3">
        ${term.relatedTerms.map(rSlug => {
          const rObj = glossaryTerms.find(g => g.slug === rSlug);
          const rTitle = rObj ? (rObj.titleEn || rObj.title) : rSlug;
          return `<li><a href="/glossary/${escapeHtml(rSlug)}/" class="hover:underline">→ ${escapeHtml(rTitle)}</a></li>`;
        }).join('\n        ')}
      </ul>
    `
    : '';

  const relatedServiceHtmlTr = term.relatedService
    ? `<p class="pt-2"><a href="${escapeHtml(term.relatedService.link)}" class="text-[var(--accent)] hover:underline font-bold">→ ${escapeHtml(typeof term.relatedService.title === 'object' ? (term.relatedService.title.tr || '') : term.relatedService.title)}</a></p>`
    : '';

  const relatedServiceHtmlEn = term.relatedService
    ? `<p class="pt-2"><a href="${escapeHtml(term.relatedService.link)}" class="text-[var(--accent)] hover:underline font-bold">→ ${escapeHtml(typeof term.relatedService.title === 'object' ? (term.relatedService.title.en || term.relatedService.title.tr || '') : term.relatedService.title)}</a></p>`
    : '';

  const trExtraContent = `
    <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
      ${term.urgencyLevel ? `<p class="text-sm font-mono text-[var(--accent)]">Aciliyet: ${escapeHtml(term.urgencyLevel)}</p>` : ''}

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Tanım</h2>
        <p class="text-[var(--ink-3)] leading-relaxed">${escapeHtml(term.shortDef?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Ajans için ne anlama gelir</h2>
        <p class="text-[var(--ink-3)] leading-relaxed">${escapeHtml(term.agencyImpact?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Kim çözer</h2>
        <p class="text-[var(--ink-3)] leading-relaxed">${escapeHtml(term.whoSolves?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">İlgili terimler</h2>
        ${relatedTermsHtmlTr}
        ${relatedServiceHtmlTr}
      </section>
    </section>
    ${reverseBlockTr}
  `;

  const enExtraContent = `
    <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
      ${(term.urgencyLevelEn || term.urgencyLevel) ? `<p class="text-sm font-mono text-[var(--accent)]">Urgency: ${escapeHtml(term.urgencyLevelEn || term.urgencyLevel)}</p>` : ''}

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Definition</h2>
        <p class="text-[var(--ink-3)] leading-relaxed">${escapeHtml(term.shortDef?.en || term.shortDef?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">What It Means for Agencies</h2>
        <p class="text-[var(--ink-3)] leading-relaxed">${escapeHtml(term.agencyImpact?.en || term.agencyImpact?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Resolution Path</h2>
        <p class="text-[var(--ink-3)] leading-relaxed">${escapeHtml(term.whoSolves?.en || term.whoSolves?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Related Concepts</h2>
        ${relatedTermsHtmlEn}
        ${relatedServiceHtmlEn}
      </section>
    </section>
    ${reverseBlockEn}
  `;

  const glossaryDates = getGitDates('v2-draft/src/data/glossaryData.js');

  const definedTermNode = {
    "@type": "DefinedTerm",
    "name": term.title,
    "description": term.shortDef.tr,
    "inDefinedTermSet": {
      "@type": "DefinedTermSet",
      "name": "Teknik Terim Sözlüğü",
      "url": "https://trendmasterakademi.com/sozluk/"
    },
    "url": `https://trendmasterakademi.com/sozluk/${term.slug}/`,
    "inLanguage": "tr-TR"
  };

  if (glossaryDates.dateModified) {
    definedTermNode.dateModified = glossaryDates.dateModified;
  }

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      definedTermNode,
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
          { "@type": "ListItem", "position": 2, "name": "Teknik Terim Sözlüğü", "item": "https://trendmasterakademi.com/sozluk/" },
          { "@type": "ListItem", "position": 3, "name": term.title, "item": `https://trendmasterakademi.com/sozluk/${term.slug}/` }
        ]
      }
    ]
  };

  // Adım 89 — İngilizce sayfanın kendi yapısal verisi (Türkçe şema İngilizce sayfada kullanılmaz)
  const definedTermNodeEn = {
    ...definedTermNode,
    "name": term.titleEn || term.title,
    "description": term.shortDef.en || term.shortDef.tr,
    "inDefinedTermSet": {
      "@type": "DefinedTermSet",
      "name": "Technical Glossary",
      "url": "https://trendmasterakademi.com/glossary/"
    },
    "url": `https://trendmasterakademi.com/glossary/${term.slug}/`,
    "inLanguage": "en-US"
  };

  const schemaEn = {
    "@context": "https://schema.org",
    "@graph": [
      definedTermNodeEn,
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trendmasterakademi.com/" },
          { "@type": "ListItem", "position": 2, "name": "Technical Glossary", "item": "https://trendmasterakademi.com/glossary/" },
          { "@type": "ListItem", "position": 3, "name": term.titleEn || term.title, "item": `https://trendmasterakademi.com/glossary/${term.slug}/` }
        ]
      }
    ]
  };

  const trPage = {
    dir: `sozluk/${term.slug}`,
    title: formatPageTitle(`${term.title} Nedir?`),
    h1: getGlossaryH1(term, 'tr'),
    description: `${term.title.split(' (')[0]}: ${term.shortDef.tr}`,
    canonical: `https://trendmasterakademi.com/sozluk/${term.slug}/`,
    ogUrl: `https://trendmasterakademi.com/sozluk/${term.slug}/`,
    hreflangTr: `https://trendmasterakademi.com/sozluk/${term.slug}/`,
    hreflangEn: `https://trendmasterakademi.com/glossary/${term.slug}/`,
    heading: term.title,
    subheading: `${term.shortDef.tr} ${term.agencyImpact.tr}`,
    extraContent: trExtraContent,
    schema
  };

  const enPage = {
    dir: `glossary/${term.slug}`,
    lang: 'en',
    title: formatPageTitle(`What is ${term.titleEn || term.title}?`),
    h1: getGlossaryH1(term, 'en'),
    description: `${(term.titleEn || term.title).split(' (')[0]}: ${term.shortDef.en || term.shortDef.tr}`,
    canonical: `https://trendmasterakademi.com/glossary/${term.slug}/`,
    ogUrl: `https://trendmasterakademi.com/glossary/${term.slug}/`,
    hreflangTr: `https://trendmasterakademi.com/sozluk/${term.slug}/`,
    hreflangEn: `https://trendmasterakademi.com/glossary/${term.slug}/`,
    heading: term.titleEn || term.title,
    subheading: `${term.shortDef.en || term.shortDef.tr} ${term.agencyImpact?.en || term.agencyImpact?.tr || ''}`,
    extraContent: enExtraContent,
    schema: schemaEn
  };

  return [trPage, enPage];
});


// 3.1 & 3.2 — Add each diagnostic page dynamically with full extraContent and schema
const teshisPages = teshisData.flatMap(item => {
  const logRowsHtmlTr = item.logSatirlari && item.logSatirlari.length > 0
    ? `
      <ul class="space-y-2 font-mono text-sm bg-[var(--surface)] p-4 rounded-xl border border-[var(--rule)] my-3">
        ${item.logSatirlari.map((log, idx) => {
          const eslesme = item.logEslesme?.find(e => e.satir === idx && e.harf);
          const neden = eslesme ? item.nedenler?.find(n => n.harf === eslesme.harf) : null;
          const badgeHtml = neden ? ` <span>→ ${escapeHtml(eslesme.harf)} · ${escapeHtml(neden.ad?.tr || '')}</span>` : '';
          return `<li><code>${escapeHtml(log)}</code>${badgeHtml}</li>`;
        }).join('\n        ')}
      </ul>
    `
    : '';

  const logRowsHtmlEn = item.logSatirlari && item.logSatirlari.length > 0
    ? `
      <ul class="space-y-2 font-mono text-sm bg-[var(--surface)] p-4 rounded-xl border border-[var(--rule)] my-3">
        ${item.logSatirlari.map((log, idx) => {
          const enLog = diagnosticLogEnMap[log] || log;
          const eslesme = item.logEslesme?.find(e => e.satir === idx && e.harf);
          const neden = eslesme ? item.nedenler?.find(n => n.harf === eslesme.harf) : null;
          const badgeHtml = neden ? ` <span>→ ${escapeHtml(eslesme.harf)} · ${escapeHtml(neden.ad?.en || neden.ad?.tr || '')}</span>` : '';
          return `<li><code>${escapeHtml(enLog)}</code>${badgeHtml}</li>`;
        }).join('\n        ')}
      </ul>
    `
    : '';

  const nedenlerHtmlTr = item.nedenler && item.nedenler.length > 0
    ? item.nedenler.map(n => {
        const testStr = Array.isArray(n.diyagramTest?.tr) ? n.diyagramTest.tr.join(' ') : (n.diyagramTest?.tr || '');
        const cozumStr = Array.isArray(n.diyagramCozum?.tr) ? n.diyagramCozum.tr.join(' ') : (n.diyagramCozum?.tr || '');
        const yanlisDuzeltmeHtml = n.yanlisDuzeltme?.tr
          ? `\n            <p class="text-[var(--ink-3)] text-sm"><strong class="text-[var(--ink)]">Sık yapılan yanlış düzeltme:</strong> ${escapeHtml(n.yanlisDuzeltme.tr)}</p>`
          : '';
        return `
          <div class="space-y-2 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] my-4">
            <h3 class="text-lg font-bold text-[var(--accent)]">${escapeHtml(n.harf)} · ${escapeHtml(n.ad?.tr || '')}</h3>
            <p class="text-[var(--ink-3)] leading-relaxed">${escapeHtml(n.aciklama?.tr || '')}</p>
            <p class="text-[var(--ink-3)] text-sm"><strong class="text-[var(--ink)]">Ayırt edici test:</strong> ${escapeHtml(testStr)}</p>
            <p class="text-[var(--ink-3)] text-sm"><strong class="text-[var(--ink)]">Kanıt:</strong> ${escapeHtml(n.kanit?.tr || '')}</p>
            <p class="text-[var(--ink-3)] text-sm"><strong class="text-[var(--ink)]">Çözüm:</strong> ${escapeHtml(cozumStr)}</p>${yanlisDuzeltmeHtml}
          </div>
        `;
      }).join('\n')
    : '';

  const nedenlerHtmlEn = item.nedenler && item.nedenler.length > 0
    ? item.nedenler.map(n => {
        const testStr = Array.isArray(n.diyagramTest?.en) ? n.diyagramTest.en.join(' ') : (n.diyagramTest?.en || Array.isArray(n.diyagramTest?.tr) ? n.diyagramTest.tr.join(' ') : (n.diyagramTest?.tr || ''));
        const cozumStr = Array.isArray(n.diyagramCozum?.en) ? n.diyagramCozum.en.join(' ') : (n.diyagramCozum?.en || Array.isArray(n.diyagramCozum?.tr) ? n.diyagramCozum.tr.join(' ') : (n.diyagramCozum?.tr || ''));
        const yanlisDuzeltmeHtml = (n.yanlisDuzeltme?.en || n.yanlisDuzeltme?.tr)
          ? `\n            <p class="text-[var(--ink-3)] text-sm"><strong class="text-[var(--ink)]">Common anti-pattern fix:</strong> ${escapeHtml(n.yanlisDuzeltme.en || n.yanlisDuzeltme.tr)}</p>`
          : '';
        return `
          <div class="space-y-2 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] my-4">
            <h3 class="text-lg font-bold text-[var(--accent)]">${escapeHtml(n.harf)} · ${escapeHtml(n.ad?.en || n.ad?.tr || '')}</h3>
            <p class="text-[var(--ink-3)] leading-relaxed">${escapeHtml(n.aciklama?.en || n.aciklama?.tr || '')}</p>
            <p class="text-[var(--ink-3)] text-sm"><strong class="text-[var(--ink)]">Differential test:</strong> ${escapeHtml(testStr)}</p>
            <p class="text-[var(--ink-3)] text-sm"><strong class="text-[var(--ink)]">Evidence:</strong> ${escapeHtml(n.kanit?.en || n.kanit?.tr || '')}</p>
            <p class="text-[var(--ink-3)] text-sm"><strong class="text-[var(--ink)]">Resolution:</strong> ${escapeHtml(cozumStr)}</p>${yanlisDuzeltmeHtml}
          </div>
        `;
      }).join('\n')
    : '';

  const termsHtmlTr = item.ilgiliTerimler && item.ilgiliTerimler.length > 0
    ? `
      <ul class="space-y-1 font-mono text-sm text-[var(--accent)] my-3">
        ${item.ilgiliTerimler.map(tSlug => {
          const tObj = glossaryTerms.find(g => g.slug === tSlug);
          const tTitle = tObj ? tObj.title : tSlug;
          return `<li><a href="/sozluk/${escapeHtml(tSlug)}/" class="hover:underline">→ ${escapeHtml(tTitle)}</a></li>`;
        }).join('\n        ')}
      </ul>
    `
    : '';

  const termsHtmlEn = item.ilgiliTerimler && item.ilgiliTerimler.length > 0
    ? `
      <ul class="space-y-1 font-mono text-sm text-[var(--accent)] my-3">
        ${item.ilgiliTerimler.map(tSlug => {
          const tObj = glossaryTerms.find(g => g.slug === tSlug);
          const tTitle = tObj ? (tObj.titleEn || tObj.title) : tSlug;
          return `<li><a href="/glossary/${escapeHtml(tSlug)}/" class="hover:underline">→ ${escapeHtml(tTitle)}</a></li>`;
        }).join('\n        ')}
      </ul>
    `
    : '';

  const serviceHtmlTr = item.ilgiliHizmet
    ? `<p class="pt-2"><a href="${escapeHtml(item.ilgiliHizmet.link)}" class="text-[var(--accent)] hover:underline font-bold">→ ${escapeHtml(item.ilgiliHizmet.baslik?.tr || '')}</a></p>`
    : '';

  const serviceHtmlEn = item.ilgiliHizmet
    ? `<p class="pt-2"><a href="${escapeHtml(item.ilgiliHizmet.link)}" class="text-[var(--accent)] hover:underline font-bold">→ ${escapeHtml(item.ilgiliHizmet.baslik?.en || item.ilgiliHizmet.baslik?.tr || '')}</a></p>`
    : '';

  const sahadaHtmlTr = item.sahadaNasilGorunur?.tr
    ? `
      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Sahada nasıl görünür</h2>
        <p class="text-[var(--ink-3)] leading-relaxed">${escapeHtml(item.sahadaNasilGorunur.tr)}</p>
      </section>
    `
    : '';

  const sahadaHtmlEn = (item.sahadaNasilGorunur?.en || item.sahadaNasilGorunur?.tr)
    ? `
      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Field Observations</h2>
        <p class="text-[var(--ink-3)] leading-relaxed">${escapeHtml(item.sahadaNasilGorunur.en || item.sahadaNasilGorunur.tr)}</p>
      </section>
    `
    : '';

  const hataMetinleriHtmlTr = item.hataMetinleri && item.hataMetinleri.length > 0
    ? `
      <section class="space-y-3">
        <h2 class="text-xl font-bold text-[var(--ink)]">Ekranda gördüğünüz metin</h2>
        <div class="space-y-2">
          ${item.hataMetinleri.map(hm => `
            <div class="space-y-1">
              <div class="p-3 rounded-xl bg-[var(--surface)] border border-[var(--rule)] font-mono text-sm text-[var(--ink)] overflow-x-auto">
                <code>${escapeHtml(hm.metin?.tr || '')}</code>
              </div>
              ${hm.nerede?.tr ? `<p class="text-xs text-[var(--ink-3)]">${escapeHtml(hm.nerede.tr)}</p>` : ''}
            </div>
          `).join('\n          ')}
        </div>
      </section>
    `
    : '';

  const hataMetinleriHtmlEn = item.hataMetinleri && item.hataMetinleri.length > 0
    ? `
      <section class="space-y-3">
        <h2 class="text-xl font-bold text-[var(--ink)]">What you see on screen</h2>
        <div class="space-y-2">
          ${item.hataMetinleri.map(hm => `
            <div class="space-y-1">
              <div class="p-3 rounded-xl bg-[var(--surface)] border border-[var(--rule)] font-mono text-sm text-[var(--ink)] overflow-x-auto">
                <code>${escapeHtml(hm.metin?.en || hm.metin?.tr || '')}</code>
              </div>
              ${(hm.nerede?.en || hm.nerede?.tr) ? `<p class="text-xs text-[var(--ink-3)]">${escapeHtml(hm.nerede?.en || hm.nerede?.tr || '')}</p>` : ''}
            </div>
          `).join('\n          ')}
        </div>
      </section>
    `
    : '';

  const kontrolAdimlariHtmlTr = item.kontrolAdimlari?.tr && item.kontrolAdimlari.tr.length > 0
    ? `
      <section class="space-y-3">
        <h2 class="text-xl font-bold text-[var(--ink)]">İlk 10 dakikada kendiniz kontrol edin</h2>
        <ol class="list-decimal list-inside space-y-2 text-[var(--ink-3)] text-sm">
          ${item.kontrolAdimlari.tr.map(step => `<li>${escapeHtml(step)}</li>`).join('\n          ')}
        </ol>
      </section>
    `
    : '';

  const kontrolAdimlariHtmlEn = (item.kontrolAdimlari?.en || item.kontrolAdimlari?.tr) && (item.kontrolAdimlari.en || item.kontrolAdimlari.tr).length > 0
    ? `
      <section class="space-y-3">
        <h2 class="text-xl font-bold text-[var(--ink)]">Check it yourself in the first 10 minutes</h2>
        <ol class="list-decimal list-inside space-y-2 text-[var(--ink-3)] text-sm">
          ${(item.kontrolAdimlari.en || item.kontrolAdimlari.tr).map(step => `<li>${escapeHtml(step)}</li>`).join('\n          ')}
        </ol>
      </section>
    `
    : '';

  const devirNoktasiHtmlTr = item.devirNoktasi?.tr
    ? `
      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Ne zaman devretmeli?</h2>
        <p class="text-[var(--ink-3)] leading-relaxed">${escapeHtml(item.devirNoktasi.tr)}</p>
      </section>
    `
    : '';

  const devirNoktasiHtmlEn = (item.devirNoktasi?.en || item.devirNoktasi?.tr)
    ? `
      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">When to hand it over</h2>
        <p class="text-[var(--ink-3)] leading-relaxed">${escapeHtml(item.devirNoktasi.en || item.devirNoktasi.tr)}</p>
      </section>
    `
    : '';

  const resmiKaynaklarHtmlTr = item.resmiKaynaklar && item.resmiKaynaklar.length > 0
    ? `
      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Resmî dokümanlar</h2>
        <ul class="font-mono text-sm text-[var(--accent)]">
          ${item.resmiKaynaklar.map(rk => `<li><a href="${escapeHtml(rk.url?.tr || rk.url)}" target="_blank" rel="noopener noreferrer" class="hover:underline flex items-center min-h-[44px] py-1">→ ${escapeHtml(rk.ad?.tr || '')}</a></li>`).join('\n          ')}
        </ul>
      </section>
    `
    : '';

  const resmiKaynaklarHtmlEn = item.resmiKaynaklar && item.resmiKaynaklar.length > 0
    ? `
      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Official documentation</h2>
        <ul class="font-mono text-sm text-[var(--accent)]">
          ${item.resmiKaynaklar.map(rk => `<li><a href="${escapeHtml(rk.url?.en || rk.url?.tr || rk.url)}" target="_blank" rel="noopener noreferrer" class="hover:underline flex items-center min-h-[44px] py-1">→ ${escapeHtml(rk.ad?.en || rk.ad?.tr || '')}</a></li>`).join('\n          ')}
        </ul>
      </section>
    `
    : '';

  const ilgiliTeshislerHtmlTr = item.ilgiliTeshisler && item.ilgiliTeshisler.length > 0
    ? `
      <div class="pt-2">
        <h3 class="text-sm font-mono font-semibold uppercase tracking-wider text-[var(--accent)] mb-2">İlgili teşhisler</h3>
        <ul class="space-y-1 font-mono text-sm text-[var(--accent)]">
          ${item.ilgiliTeshisler.map(tSlug => {
            const target = teshisData.find(d => d.slug === tSlug);
            const title = target ? target.baslik?.tr : tSlug;
            return `<li><a href="/teshis/${escapeHtml(tSlug)}/" class="hover:underline">→ ${escapeHtml(title)}</a></li>`;
          }).join('\n          ')}
        </ul>
      </div>
    `
    : '';

  const ilgiliTeshislerHtmlEn = item.ilgiliTeshisler && item.ilgiliTeshisler.length > 0
    ? `
      <div class="pt-2">
        <h3 class="text-sm font-mono font-semibold uppercase tracking-wider text-[var(--accent)] mb-2">Related diagnostics</h3>
        <ul class="space-y-1 font-mono text-sm text-[var(--accent)]">
          ${item.ilgiliTeshisler.map(tSlug => {
            const target = teshisData.find(d => d.slug === tSlug);
            const title = target ? (target.baslik?.en || target.baslik?.tr) : tSlug;
            return `<li><a href="/diagnostic/${escapeHtml(tSlug)}/" class="hover:underline">→ ${escapeHtml(title)}</a></li>`;
          }).join('\n          ')}
        </ul>
      </div>
    `
    : '';

  const trExtraContent = `
    <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
      <p class="text-sm font-mono text-[var(--accent)]">Aciliyet: ${escapeHtml(item.aciliyet?.etiket?.tr || '')} · Kategori: ${escapeHtml(item.kirinti?.tr || '')}</p>
${sahadaHtmlTr}
${hataMetinleriHtmlTr}
      <section class="space-y-3">
        <h2 class="text-xl font-bold text-[var(--ink)]">Sisteminizde bu satırları görüyorsanız</h2>
        ${logRowsHtmlTr}
        ${item.logNotu?.tr ? `<p class="text-[var(--ink-3)] text-sm">${escapeHtml(item.logNotu.tr)}</p>` : ''}
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-bold text-[var(--ink)]">Üç olası neden ve ayırt edici testleri</h2>
        ${nedenlerHtmlTr}
      </section>
${kontrolAdimlariHtmlTr}
${devirNoktasiHtmlTr}
      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Kim çözer</h2>
        <p class="text-[var(--ink-3)] leading-relaxed">${escapeHtml(item.kimCozer?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Çözülmezse ne olur</h2>
        <p class="text-[var(--ink-3)] leading-relaxed">${escapeHtml(item.cozulmezse?.tr || '')}</p>
      </section>
${resmiKaynaklarHtmlTr}
      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">İlgili terimler ve hizmet</h2>
        ${termsHtmlTr}
        ${ilgiliTeshislerHtmlTr}
        ${serviceHtmlTr}
      </section>
    </section>
  `;

  const enExtraContent = `
    <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
      <p class="text-sm font-mono text-[var(--accent)]">Urgency: ${escapeHtml(item.aciliyet?.etiket?.en || item.aciliyet?.etiket?.tr || '')} · Category: ${escapeHtml(item.kirinti?.en || item.kirinti?.tr || '')}</p>
${sahadaHtmlEn}
${hataMetinleriHtmlEn}
      <section class="space-y-3">
        <h2 class="text-xl font-bold text-[var(--ink)]">Observed System Error Signatures</h2>
        ${logRowsHtmlEn}
        ${item.logNotu?.en ? `<p class="text-[var(--ink-3)] text-sm">${escapeHtml(item.logNotu.en)}</p>` : ''}
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-bold text-[var(--ink)]">Three Potential Root Causes & Differential Tests</h2>
        ${nedenlerHtmlEn}
      </section>
${kontrolAdimlariHtmlEn}
${devirNoktasiHtmlEn}
      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Who resolves it</h2>
        <p class="text-[var(--ink-3)] leading-relaxed">${escapeHtml(item.kimCozer?.en || item.kimCozer?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Impact If Left Unresolved</h2>
        <p class="text-[var(--ink-3)] leading-relaxed">${escapeHtml(item.cozulmezse?.en || item.cozulmezse?.tr || '')}</p>
      </section>
${resmiKaynaklarHtmlEn}
      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Related Concepts & Services</h2>
        ${termsHtmlEn}
        ${ilgiliTeshislerHtmlEn}
        ${serviceHtmlEn}
      </section>
    </section>
  `;

  const faqQuestions = (item.nedenler || []).map(n => {
    const testStr = Array.isArray(n.diyagramTest?.tr) ? n.diyagramTest.tr.join(' ') : (n.diyagramTest?.tr || '');
    const cozumStr = Array.isArray(n.diyagramCozum?.tr) ? n.diyagramCozum.tr.join(' ') : (n.diyagramCozum?.tr || '');
    return {
      "@type": "Question",
      "name": testStr,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `${n.ad.tr} — ${n.aciklama.tr} Kanıt: ${n.kanit.tr} Çözüm: ${cozumStr}`
      }
    };
  });

  if (item.logEslesme && item.logEslesme.length > 0) {
    for (const eslesme of item.logEslesme) {
      if (!eslesme.harf) continue;
      const logSatiri = item.logSatirlari[eslesme.satir];
      const neden = (item.nedenler || []).find(n => n.harf === eslesme.harf);
      if (logSatiri && neden) {
        const cozumStr = Array.isArray(neden.diyagramCozum?.tr) ? neden.diyagramCozum.tr.join(' ') : (neden.diyagramCozum?.tr || '');
        faqQuestions.push({
          "@type": "Question",
          "name": `«${cleanLogForQuestion(logSatiri)}» görüyorsam nedeni ne?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `${neden.harf} · ${neden.ad.tr} — ${neden.aciklama.tr} Çözüm: ${cozumStr}`
          }
        });
      }
    }
  }

  // Adım 89 — İngilizce sayfanın SSS yapısal verisi İngilizce alanlardan kurulur
  const faqQuestionsEn = (item.nedenler || []).map(n => {
    const testStr = [].concat(n.diyagramTest?.en || n.diyagramTest?.tr || []).join(' ');
    const cozumStr = [].concat(n.diyagramCozum?.en || n.diyagramCozum?.tr || []).join(' ');
    return {
      "@type": "Question",
      "name": testStr,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `${n.ad.en || n.ad.tr} — ${n.aciklama.en || n.aciklama.tr} Evidence: ${n.kanit.en || n.kanit.tr} Fix: ${cozumStr}`
      }
    };
  });

  if (item.logEslesme && item.logEslesme.length > 0) {
    for (const eslesme of item.logEslesme) {
      if (!eslesme.harf) continue;
      const logSatiri = item.logSatirlari[eslesme.satir];
      const neden = (item.nedenler || []).find(n => n.harf === eslesme.harf);
      if (logSatiri && neden) {
        const cozumStr = [].concat(neden.diyagramCozum?.en || neden.diyagramCozum?.tr || []).join(' ');
        faqQuestionsEn.push({
          "@type": "Question",
          "name": `What causes «${cleanLogForQuestion(diagnosticLogEnMap[logSatiri] || logSatiri)}»?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `${neden.harf} · ${neden.ad.en || neden.ad.tr} — ${neden.aciklama.en || neden.aciklama.tr} Fix: ${cozumStr}`
          }
        });
      }
    }
  }

  const teshisDates = getGitDates(`v2-draft/src/data/teshis/${item.slug}.js`);

  const techArticleNode = {
    "@type": "TechArticle",
    "headline": item.baslik.tr,
    "description": item.ozet.tr,
    "url": `https://trendmasterakademi.com/teshis/${item.slug}/`,
    "mainEntityOfPage": `https://trendmasterakademi.com/teshis/${item.slug}/`,
    "inLanguage": "tr-TR",
    "about": item.kirinti.tr,
    "publisher": {
      "@type": "Organization",
      "name": "Trend Master Akademi",
      "url": "https://trendmasterakademi.com"
    }
  };

  if (teshisDates.datePublished) {
    techArticleNode.datePublished = teshisDates.datePublished;
  }
  if (teshisDates.dateModified) {
    techArticleNode.dateModified = teshisDates.dateModified;
  }
  if (item.resmiKaynaklar && item.resmiKaynaklar.length > 0) {
    techArticleNode.citation = item.resmiKaynaklar.map(rk => rk.url?.tr || rk.url);
  }

  const techArticleNodeEn = {
    ...techArticleNode,
    headline: item.baslik.en || item.baslik.tr,
    description: item.ozet.en || item.ozet.tr,
    url: `https://trendmasterakademi.com/diagnostic/${item.slug}/`,
    mainEntityOfPage: `https://trendmasterakademi.com/diagnostic/${item.slug}/`,
    inLanguage: "en-US",
    about: item.kirinti.en || item.kirinti.tr
  };
  if (item.resmiKaynaklar && item.resmiKaynaklar.length > 0) {
    techArticleNodeEn.citation = item.resmiKaynaklar.map(rk => rk.url?.en || rk.url?.tr || rk.url);
  }

  const schemaTr = {
    "@context": "https://schema.org",
    "@graph": [
      techArticleNode,
      {
        "@type": "FAQPage",
        "mainEntity": faqQuestions
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
          { "@type": "ListItem", "position": 2, "name": "Teşhis Kataloğu", "item": "https://trendmasterakademi.com/teshis/" },
          { "@type": "ListItem", "position": 3, "name": item.baslik.tr, "item": `https://trendmasterakademi.com/teshis/${item.slug}/` }
        ]
      }
    ]
  };

  const schemaEn = {
    "@context": "https://schema.org",
    "@graph": [
      techArticleNodeEn,
      {
        "@type": "FAQPage",
        "mainEntity": faqQuestionsEn
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trendmasterakademi.com/" },
          { "@type": "ListItem", "position": 2, "name": "Diagnostic Catalog", "item": "https://trendmasterakademi.com/diagnostic/" },
          { "@type": "ListItem", "position": 3, "name": item.baslik.en || item.baslik.tr, "item": `https://trendmasterakademi.com/diagnostic/${item.slug}/` }
        ]
      }
    ]
  };

  const sentences = item.ozet.tr.split(/(?<=\.)\s+/);
  let teshisDesc = sentences[0];
  if (teshisDesc.length < 80 && sentences[1]) {
    teshisDesc = teshisDesc + ' ' + sentences[1];
  }
  if (teshisDesc.length > 160) {
    teshisDesc = teshisDesc.slice(0, 157) + '...';
  }

  const trPage = {
    dir: `teshis/${item.slug}`,
    title: formatPageTitle(item.baslik.tr),
    h1: item.baslik.tr,
    description: teshisDesc,
    canonical: `https://trendmasterakademi.com/teshis/${item.slug}/`,
    ogUrl: `https://trendmasterakademi.com/teshis/${item.slug}/`,
    hreflangTr: `https://trendmasterakademi.com/teshis/${item.slug}/`,
    hreflangEn: `https://trendmasterakademi.com/diagnostic/${item.slug}/`,
    subheading: item.ozet.tr,
    extraContent: trExtraContent,
    schema: schemaTr
  };

  const enPage = {
    dir: `diagnostic/${item.slug}`,
    lang: 'en',
    title: formatPageTitle(item.baslik.en || item.baslik.tr),
    h1: item.baslik.en || item.baslik.tr,
    description: item.ozet.en || teshisDesc,
    canonical: `https://trendmasterakademi.com/diagnostic/${item.slug}/`,
    ogUrl: `https://trendmasterakademi.com/diagnostic/${item.slug}/`,
    hreflangTr: `https://trendmasterakademi.com/teshis/${item.slug}/`,
    hreflangEn: `https://trendmasterakademi.com/diagnostic/${item.slug}/`,
    subheading: item.ozet.en || item.ozet.tr,
    extraContent: enExtraContent,
    schema: schemaEn
  };

  return [trPage, enPage];
});

const postMortemPages = postMortems.flatMap(item => {
  const trExtraContent = `
    <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
      <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] font-mono text-xs text-[var(--ink-3)] grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><span class="text-[var(--ink-3)] block">ŞİDDET</span><strong class="text-[var(--tint-warn-ink)]">${escapeHtml(siddetEtiketi(item.severity, 'tr'))}</strong></div>
        <div><span class="text-[var(--ink-3)] block">KATEGORİ</span><strong class="text-[var(--ink)]">${escapeHtml(item.category?.tr || '')}</strong></div>
        <div><span class="text-[var(--ink-3)] block">KESİNTİ SÜRESİ</span><strong class="text-[var(--tint-ok-ink)]">${escapeHtml(item.duration?.tr || '')}</strong></div>
        <div><span class="text-[var(--ink-3)] block">TARİH</span><strong class="text-[var(--accent)]">${escapeHtml(resolveText(item.date, 'tr'))}</strong></div>
      </div>

      <div class="p-4 rounded-xl bg-[var(--paper)] border border-[var(--rule)] text-xs text-[var(--ink-3)] leading-relaxed font-mono">
        <p>${escapeHtml(postMortemDisclosure.detail.tr)}</p>
      </div>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Olay Özeti</h2>
        <p class="text-[var(--ink-3)] leading-relaxed">${escapeHtml(item.summary?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Etki & Kayıp</h2>
        <p class="text-[var(--ink-3)] leading-relaxed">${escapeHtml(item.impact?.tr || '')}</p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-bold text-[var(--ink)]">Kronolojik Olay Akışı</h2>
        <ul class="space-y-2 font-mono text-sm bg-[var(--surface)] p-4 rounded-xl border border-[var(--rule)]">
          ${(item.timeline || []).map(t => `
            <li><span class="text-[var(--accent)] font-bold">${escapeHtml(t.time)}</span> · <span class="text-[var(--ink)]">${escapeHtml(t.title?.tr || '')}</span> — <span class="text-[var(--ink-3)]">${escapeHtml(t.desc?.tr || '')}</span></li>
          `).join('\n          ')}
        </ul>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Kök Neden (5 Whys)</h2>
        <p class="text-[var(--ink-3)] leading-relaxed whitespace-pre-line">${escapeHtml(item.rootCause?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Uygulanan SWAT Müdahalesi & Hotfix</h2>
        <p class="text-[var(--ink-3)] leading-relaxed whitespace-pre-line">${escapeHtml(item.tmaHotfix?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Kalıcı Önleyici Tedbirler</h2>
        <p class="text-[var(--ink-3)] leading-relaxed whitespace-pre-line">${escapeHtml(item.permanentMitigation?.tr || '')}</p>
      </section>

      <div class="mt-8 p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-center space-y-2">
        <p class="text-xs text-[var(--ink-3)]">
          Tüm teknik incelemeler ve müdahaleler <a href="/nda/" class="text-[var(--accent)] underline hover:text-[var(--accent-hover)]">Gizlilik ve Çalışma Sözleşmesi (NDA)</a> kapsamındadır.
        </p>
      </div>
    </section>
  `;

  const enExtraContent = `
    <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
      <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] font-mono text-xs text-[var(--ink-3)] grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><span class="text-[var(--ink-3)] block">SEVERITY</span><strong class="text-[var(--tint-warn-ink)]">${escapeHtml(item.severity)}</strong></div>
        <div><span class="text-[var(--ink-3)] block">CATEGORY</span><strong class="text-[var(--ink)]">${escapeHtml(item.category?.en || '')}</strong></div>
        <div><span class="text-[var(--ink-3)] block">DURATION</span><strong class="text-[var(--tint-ok-ink)]">${escapeHtml(item.duration?.en || '')}</strong></div>
        <div><span class="text-[var(--ink-3)] block">DATE</span><strong class="text-[var(--accent)]">${escapeHtml(resolveText(item.date, 'en'))}</strong></div>
      </div>

      <div class="p-4 rounded-xl bg-[var(--paper)] border border-[var(--rule)] text-xs text-[var(--ink-3)] leading-relaxed font-mono">
        <p>${escapeHtml(postMortemDisclosure.detail.en)}</p>
      </div>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Incident Summary</h2>
        <p class="text-[var(--ink-3)] leading-relaxed">${escapeHtml(item.summary?.en || item.summary?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Business & Technical Impact</h2>
        <p class="text-[var(--ink-3)] leading-relaxed">${escapeHtml(item.impact?.en || item.impact?.tr || '')}</p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-bold text-[var(--ink)]">Incident Timeline</h2>
        <ul class="space-y-2 font-mono text-sm bg-[var(--surface)] p-4 rounded-xl border border-[var(--rule)]">
          ${(item.timeline || []).map(t => `
            <li><span class="text-[var(--accent)] font-bold">${escapeHtml(t.time)}</span> · <span class="text-[var(--ink)]">${escapeHtml(t.title?.en || t.title?.tr || '')}</span> — <span class="text-[var(--ink-3)]">${escapeHtml(t.desc?.en || t.desc?.tr || '')}</span></li>
          `).join('\n          ')}
        </ul>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Root Cause Analysis (5 Whys)</h2>
        <p class="text-[var(--ink-3)] leading-relaxed whitespace-pre-line">${escapeHtml(item.rootCause?.en || item.rootCause?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">TMA SWAT Resolution & Hotfix</h2>
        <p class="text-[var(--ink-3)] leading-relaxed whitespace-pre-line">${escapeHtml(item.tmaHotfix?.en || item.tmaHotfix?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Permanent Mitigations</h2>
        <p class="text-[var(--ink-3)] leading-relaxed whitespace-pre-line">${escapeHtml(item.permanentMitigation?.en || item.permanentMitigation?.tr || '')}</p>
      </section>

      <div class="mt-8 p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-center space-y-2">
        <p class="text-xs text-[var(--ink-3)]">
          All technical reviews and interventions are covered under our <a href="/nda/" class="text-[var(--accent)] underline hover:text-[var(--accent-hover)]">Confidentiality and Engagement Agreement (NDA)</a>.
        </p>
      </div>
    </section>
  `;

  const trSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "headline": `${item.no}: ${item.title?.tr}`,
        "description": item.summary?.tr,
        "url": `https://trendmasterakademi.com/post-mortem/${item.slug}/`,
        "publisher": {
          "@type": "Organization",
          "name": "Trend Master Akademi",
          "url": "https://trendmasterakademi.com"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://trendmasterakademi.com/" },
          { "@type": "ListItem", "position": 2, "name": "Post-Mortem Kütüphanesi", "item": "https://trendmasterakademi.com/post-mortem/" },
          { "@type": "ListItem", "position": 3, "name": item.title?.tr, "item": `https://trendmasterakademi.com/post-mortem/${item.slug}/` }
        ]
      }
    ]
  };

  const enSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "headline": `${item.no}: ${item.title?.en || item.title?.tr}`,
        "description": item.summary?.en || item.summary?.tr,
        "url": `https://trendmasterakademi.com/post-mortems/${item.slug}/`,
        "publisher": {
          "@type": "Organization",
          "name": "Trend Master Akademi",
          "url": "https://trendmasterakademi.com"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://trendmasterakademi.com/" },
          { "@type": "ListItem", "position": 2, "name": "Post-Mortems", "item": "https://trendmasterakademi.com/post-mortems/" },
          { "@type": "ListItem", "position": 3, "name": item.title?.en || item.title?.tr, "item": `https://trendmasterakademi.com/post-mortems/${item.slug}/` }
        ]
      }
    ]
  };

  const trPage = {
    dir: `post-mortem/${item.slug}`,
    title: formatPageTitle(`${item.no} Post-Mortem | ${item.title?.tr}`),
    h1: getPostMortemH1(item, 'tr'),
    description: item.summary?.tr,
    canonical: `https://trendmasterakademi.com/post-mortem/${item.slug}/`,
    ogUrl: `https://trendmasterakademi.com/post-mortem/${item.slug}/`,
    hreflangTr: `https://trendmasterakademi.com/post-mortem/${item.slug}/`,
    hreflangEn: `https://trendmasterakademi.com/post-mortems/${item.slug}/`,
    heading: `${item.no} // ${item.category?.tr || ''}`,
    subheading: item.summary?.tr,
    extraContent: trExtraContent,
    schema: trSchema
  };

  const enPage = {
    dir: `post-mortems/${item.slug}`,
    lang: 'en',
    title: formatPageTitle(`${item.no} Post-Mortem | ${item.title?.en || item.title?.tr}`),
    h1: getPostMortemH1(item, 'en'),
    description: item.summary?.en || item.summary?.tr,
    canonical: `https://trendmasterakademi.com/post-mortems/${item.slug}/`,
    ogUrl: `https://trendmasterakademi.com/post-mortems/${item.slug}/`,
    hreflangTr: `https://trendmasterakademi.com/post-mortem/${item.slug}/`,
    hreflangEn: `https://trendmasterakademi.com/post-mortems/${item.slug}/`,
    heading: `${item.no} // ${item.category?.en || ''}`,
    subheading: item.summary?.en || item.summary?.tr,
    extraContent: enExtraContent,
    schema: enSchema
  };

  return [trPage, enPage];
});

const pages = [...basePages, ...glossaryPages, ...teshisPages, ...postMortemPages];

// Adım 92 — her sayfanın kendi kodu (ve teşhis sayfasında teşhis verisi) ana paketle aynı anda insin.
// Eskiden ana paket → sayfa kodu → (teşhiste) veri sırayla iniyor, gerçek içerik geç çiziliyordu.
// Rota → sayfa eşlemesi App.jsx'ten okunur (tek kaynak); paket adları derleme çıktısından bulunur, bağımlılıkları da eklenir.
const assetDosyalari = fs.readdirSync(path.join(distDir, 'assets'));
const paketBul = (ad) => {
  const kacis = ad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const eslesen = assetDosyalari.filter((f) => new RegExp(`^${kacis}-[A-Za-z0-9_-]{8}\\.js$`).test(f));
  if (eslesen.length !== 1) {
    console.error(`[ÖN-YÜKLEME HATA] "${ad}" paketi ${eslesen.length} kez bulundu (1 bekleniyordu).`);
    process.exit(1);
  }
  return `/assets/${eslesen[0]}`;
};
const paketZinciri = (adres, gorulen = new Set()) => {
  if (gorulen.has(adres)) return gorulen;
  gorulen.add(adres);
  const kod = fs.readFileSync(path.join(distDir, adres), 'utf8');
  for (const m of kod.matchAll(/(?:from|import)\s*["'`]\.\/([A-Za-z0-9_.-]+\.js)["'`]/g)) paketZinciri(`/assets/${m[1]}`, gorulen);
  return gorulen;
};
const appKaynak = fs.readFileSync(path.join(__dirname, 'src', 'App.jsx'), 'utf8');
const sayfaDosyasi = Object.fromEntries([...appKaynak.matchAll(/const (\w+) = sayfa\('(\w+)', \(\) => import\('\.\/pages\/(\w+)'\)\);/g)].map((m) => [m[1], m[3]]));
const rotalar = [...appKaynak.matchAll(/<Route path="([^"*]+)" element=\{<(\w+)[\s/>]/g)]
  .filter((m) => sayfaDosyasi[m[2]])
  .map((m) => ({ desen: new RegExp(`^${m[1].replace(/:\w+/g, '[^/]+').replace(/\/$/, '')}/?$`), dosya: sayfaDosyasi[m[2]] }));
const sayfaOnYukleme = (temizYol) => {
  const rota = rotalar.find((r) => r.desen.test(temizYol));
  if (!rota) return [];
  const liste = [...paketZinciri(paketBul(rota.dosya))];
  const teshis = temizYol.match(/^\/(?:teshis|diagnostic)\/([^/]+)\/$/);
  if (teshis) liste.push(paketBul(teshis[1]));
  return liste;
};

pages.forEach(page => {
  const targetDir = path.join(distDir, page.dir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Single-source SEO from seoData.js
  const cleanPath = page.dir ? '/' + page.dir.replace(/\/$/, '') + '/' : '/';
  const pageSeo = seoData[cleanPath] || (cleanPath === '/gizlilik/' ? seoData['/privacy/'] : null);
  if (pageSeo) {
    const langKey = page.lang === 'en' ? 'en' : 'tr';
    const entry = pageSeo[langKey] || pageSeo['tr'];
    if (entry) {
      page.title = entry.title;
      page.description = entry.desc || entry.description;
    }
  }

  let html = template;

  if (page.lang === 'en') {
    html = html.replace(/<html lang="tr">/i, '<html lang="en">');
  }

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
  
  // Replace Meta Description
  html = html.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${escapeHtml(page.description)}" />`);
  
  // Replace Canonical
  html = html.replace(/<link rel="canonical" href=".*?" \/>/i, `<link rel="canonical" href="${escapeHtml(page.canonical)}" />`);
  
  // Replace OpenGraph Title & URL & Locale
  const ogLocale = page.lang === 'en' ? 'en_US' : 'tr_TR';
  html = html.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${escapeHtml(page.title)}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${escapeHtml(page.ogUrl)}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${escapeHtml(page.description)}" />`);
  html = html.replace(/<meta property="og:image" content=".*?" \/>/i, `<meta property="og:image" content="https://trendmasterakademi.com/og-image.jpg" />`);
  const currentOgImageAlt = page.lang === 'en' ? ogImageAlt.en : ogImageAlt.tr;
  html = html.replace(/<meta property="og:image:alt" content=".*?" \/>/i, `<meta property="og:image:alt" content="${escapeHtml(currentOgImageAlt)}" />`);
  html = html.replace(/<meta property="og:locale" content=".*?" \/>/i, `<meta property="og:locale" content="${ogLocale}" />`);

  // Replace Twitter Title & URL
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`);
  html = html.replace(/<meta name="twitter:url" content=".*?" \/>/i, `<meta name="twitter:url" content="${escapeHtml(page.ogUrl)}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`);
  html = html.replace(/<meta name="twitter:image" content=".*?" \/>/i, `<meta name="twitter:image" content="https://trendmasterakademi.com/og-image.jpg" />`);

  // Hreflang handling
  if (page.hreflangTr && page.hreflangEn) {
    html = html.replace(/<link rel="alternate" hreflang="tr" href=".*?" \/>/i, `<link rel="alternate" hreflang="tr" href="${escapeHtml(page.hreflangTr)}" />`);
    html = html.replace(/<link rel="alternate" hreflang="x-default" href=".*?" \/>/i, `<link rel="alternate" hreflang="x-default" href="${escapeHtml(page.hreflangTr)}" />`);
    if (/<link rel="alternate" hreflang="en" href=".*?" \/>/i.test(html)) {
      html = html.replace(/<link rel="alternate" hreflang="en" href=".*?" \/>/i, `<link rel="alternate" hreflang="en" href="${escapeHtml(page.hreflangEn)}" />`);
    } else {
      html = html.replace(/(<link rel="alternate" hreflang="x-default" href=".*?" \/>)/i, `$1\n    <link rel="alternate" hreflang="en" href="${escapeHtml(page.hreflangEn)}" />`);
    }
  } else {
    // Clean Hreflang for this specific page (Self-referencing tr and x-default, NO en)
    html = html.replace(/<link rel="alternate" hreflang="tr" href=".*?" \/>/i, `<link rel="alternate" hreflang="tr" href="${escapeHtml(page.canonical)}" />`);
    html = html.replace(/<link rel="alternate" hreflang="x-default" href=".*?" \/>/i, `<link rel="alternate" hreflang="x-default" href="${escapeHtml(page.canonical)}" />`);
    html = html.replace(/<link rel="alternate" hreflang="en" href=".*?" \/>\s*/i, '');
  }

  // Replace JSON-LD Structured Data for this specific page
  if (page.schema) {
    const jsonLdString = JSON.stringify(page.schema, null, 2).replace(/<\/script>/gi, '<\\/script>');
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, `<script type="application/ld+json">\n${jsonLdString}\n    </script>`);
  }

  // Ensure Pre-rendered Semantic HTML is visible & corporate branded with distinct h1
  const semanticBlock = `
    <div class="ssr-pre-render p-6 sm:p-12 max-w-5xl mx-auto text-[var(--ink)] font-sans">
      <header class="mb-8 border-b border-[var(--rule)] pb-6">
        <h1 class="text-3xl sm:text-4xl font-semibold text-[var(--ink)] mb-3 tracking-tight">${page.h1}</h1>
        ${page.dir === '' ? `<p class="text-base sm:text-lg text-[var(--ink-2)] leading-relaxed mb-4">${escapeHtml(trLocale['home-slogan'])}</p>` : ''}
        <nav class="flex flex-wrap gap-4 text-sm font-mono text-[var(--accent)]">
          <a href="/" class="hover:underline">${page.lang === 'en' ? 'Home' : 'Ana Sayfa'}</a>
          <a href="${page.lang === 'en' ? '/overview/' : '/tanitim/'}" class="hover:underline">${page.lang === 'en' ? 'Services & Engagement Model' : 'Hizmetler ve Çalışma Modeli'}</a>
          <a href="/agency/" class="hover:underline">${page.lang === 'en' ? 'Capacity & Infrastructure' : 'Kapasite & Altyapı'}</a>
          <a href="${page.lang === 'en' ? '/agency-kit/' : '/kit/'}" class="hover:underline">${page.lang === 'en' ? 'Agency Kit' : 'Ajans Kiti'}</a>
          <a href="/crash-test/" class="hover:underline">${page.lang === 'en' ? 'Crash Test (60s)' : 'Crash Test (60sn)'}</a>
          <a href="${page.lang === 'en' ? '/handover-audit/' : '/devir-kontrolu/'}" class="hover:underline">${page.lang === 'en' ? 'Handover Audit' : 'Devir Kontrolü'}</a>
          <a href="${page.lang === 'en' ? tmaiYollar.en : tmaiYollar.tr}" class="hover:underline">tmai</a>
          <a href="${page.lang === 'en' ? '/diagnostic/' : '/teshis/'}" class="hover:underline">${page.lang === 'en' ? 'Diagnostic Catalog' : 'Teşhis Kataloğu'}</a>
          <a href="${page.lang === 'en' ? '/salvageability/' : '/kurtarilabilirlik/'}" class="hover:underline">${page.lang === 'en' ? 'Salvageability Index' : 'Kurtarılabilirlik İndeksi'}</a>
          <a href="${page.lang === 'en' ? '/post-mortems/' : '/post-mortem/'}" class="hover:underline">${page.lang === 'en' ? 'Post-Mortem & RCA' : 'Post-Mortem ve Kök Neden Arşivi'}</a>
          <a href="${page.lang === 'en' ? '/triage/' : '/triyaj/'}" class="hover:underline">${page.lang === 'en' ? 'Triage Simulator' : 'Triyaj Simülatörü'}</a>
          <a href="/sla/" class="hover:underline">${page.lang === 'en' ? 'SLA & Commitments' : 'SLA & Taahhütler'}</a>
          <a href="${page.lang === 'en' ? '/tech-matrix/' : '/teknoloji-uyumluluk/'}" class="hover:underline">${page.lang === 'en' ? 'Tech Matrix' : 'Teknoloji Matrisi'}</a>
          <a href="${page.lang === 'en' ? '/mutual-nda/' : '/gizlilik-sozlesmesi/'}" class="hover:underline">${page.lang === 'en' ? 'Mutual NDA' : 'Gizlilik Sözleşmesi'}</a>
          <a href="/nda/" class="hover:underline">${page.lang === 'en' ? 'Confidentiality and Engagement Agreement' : 'Gizlilik ve Çalışma Sözleşmesi'}</a>
          <a href="${page.lang === 'en' ? '/outage-simulator/' : '/hasar-tespiti/'}" class="hover:underline">${page.lang === 'en' ? 'Damage Simulator' : 'Hasar Simülatörü'}</a>
          <a href="/radar/" class="hover:underline">${page.lang === 'en' ? 'Status Radar' : 'SWAT Radarı'}</a>
          <a href="${page.lang === 'en' ? '/codebase-health/' : '/kod-sagligi/'}" class="hover:underline">${page.lang === 'en' ? 'Codebase Health' : 'Kod Sağlığı'}</a>
          <a href="${page.lang === 'en' ? '/rescue-roi/' : '/kurtarma-maliyeti/'}" class="hover:underline">${page.lang === 'en' ? 'Rescue or Rebuild?' : 'Kurtarma mı, Sıfırdan Yazım mı?'}</a>
          <a href="${page.lang === 'en' ? '/downtime-calc/' : '/kesinti-maliyeti/'}" class="hover:underline">${page.lang === 'en' ? 'Downtime Calculator' : 'Kesinti Maliyeti'}</a>
          <a href="${page.lang === 'en' ? '/glossary/' : '/sozluk/'}" class="hover:underline">${page.lang === 'en' ? 'Technical Glossary' : 'Teknik Sözlük'}</a>
          <a href="${page.lang === 'en' ? '/story/' : '/hikayemiz/'}" class="hover:underline">${page.lang === 'en' ? 'Our Story' : 'Hikayemiz'}</a>
          <a href="/sos/" class="hover:underline">${page.lang === 'en' ? 'Emergency Support' : 'Acil Teknik Destek'}</a>
          <a href="/about/" class="hover:underline">${page.lang === 'en' ? 'About Us' : 'Hakkımızda'}</a>
          <a href="/privacy/" class="hover:underline">${page.lang === 'en' ? 'Privacy Policy' : 'KVKK & Gizlilik'}</a>
        </nav>
      </header>
      <main class="space-y-6">${page.dir === 'nda' ? `
        <div class="mb-6 flex flex-col items-start gap-4">
          <div>
            <a href="/" class="inline-flex items-center gap-2 text-xs sm:text-sm text-[var(--accent)] hover:underline font-mono transition-colors min-h-[44px]">
              &larr; ${escapeHtml(ndaFullAgreementData.pageHeader.backLink.tr)}
            </a>
          </div>
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-[var(--tint-ok-bg)] border border-[var(--tint-ok-rule)] text-[var(--tint-ok-ink)] text-xs font-mono font-semibold uppercase tracking-wider">
            ${escapeHtml(ndaFullAgreementData.pageHeader.badge.tr)}
          </div>
        </div>` : ''}
        ${page.heading ? `<h2 class="text-2xl font-bold text-[var(--ink)]">${page.heading}</h2>` : ''}
        <p class="text-[var(--ink-3)] text-lg leading-relaxed">${page.subheading}</p>
        ${page.extraContent || ''}
        <section class="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2 mt-6">
          <h3 class="text-base font-bold text-[var(--accent)]">Trend Master Akademi Studio & Labs</h3>
          <p class="text-sm text-[var(--ink-3)]">${page.lang === 'en' ? 'B2B White-Label Engineering Desk' : 'B2B White-Label Mühendislik Masası'} | Tel: <a href="tel:+905343713573" class="text-[var(--ink)]">+90 534 371 35 73</a> | ${page.lang === 'en' ? 'Email:' : 'E-posta:'} <a href="mailto:info@trendmasterakademi.com" class="text-[var(--ink)]">info@trendmasterakademi.com</a></p>
          <p class="text-xs text-[var(--ink-3)]">${page.lang === 'en' ? 'Address: Akdeniz Mah. Sehit Fethibey Cad. Heris Tower No: 55 Ic Kapi No: 091 Konak / Izmir' : 'Adres: Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091 Konak / İzmir'}</p>
        </section>
      </main>
    </div>
  `;

  if (page.dir === '') {
    const ssrHomePath = path.join(distDir, 'ssr-home.html');
    let homeRootHtml = '';
    if (fs.existsSync(ssrHomePath)) {
      homeRootHtml = fs.readFileSync(ssrHomePath, 'utf8');
    }
    html = html.replace(/<div id="root">[\s\S]*?<\/body>/i, `<div id="root">${homeRootHtml}</div>\n  </body>`);
    const preloadLinks = [
      `  <link rel="preload" as="image" type="image/avif" media="(orientation: portrait)" imagesrcset="/arka-plan/sahne-1-dikey-720.avif 720w, /arka-plan/sahne-1-dikey-1080.avif 1080w, /arka-plan/sahne-1-dikey-1440.avif 1440w" imagesizes="100vw" fetchpriority="high">`,
      `  <link rel="preload" as="image" type="image/avif" media="(orientation: landscape)" imagesrcset="/arka-plan/sahne-1-1280.avif 1280w, /arka-plan/sahne-1-1920.avif 1920w, /arka-plan/sahne-1-2560.avif 2560w" imagesizes="100vw" fetchpriority="high">`
    ].join('\n');
    html = html.replace('</head>', `${preloadLinks}\n  </head>`);
  } else {
    html = html.replace(/<div id="root">[\s\S]*?<\/body>/i, `<div id="root">${semanticBlock}</div>\n  </body>`);
  }

  const onYukle = sayfaOnYukleme(cleanPath).filter((u) => !html.includes(u));
  if (onYukle.length) {
    html = html.replace('</head>', `${onYukle.map((u) => `  <link rel="modulepreload" crossorigin href="${u}">`).join('\n')}\n  </head>`);
  }

  const destFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(destFile, html, 'utf8');
  console.log(`Generated: ${page.dir}/index.html (200 OK static page ready)`);
});

console.log(`All ${pages.length} static sub-pages generated successfully!`);

// Clean up intermediate ssr-home.html from dist
const ssrHomeTempPath = path.join(distDir, 'ssr-home.html');
if (fs.existsSync(ssrHomeTempPath)) {
  fs.unlinkSync(ssrHomeTempPath);
}

// Sitemap generator & updater with content-hash lastmod dates
function updateSitemapLastmod() {
  const publicSitemapPath = path.join(__dirname, 'public/sitemap.xml');
  const distSitemapPath = path.join(__dirname, 'dist/sitemap.xml');
  const rootSitemapPath = path.join(repoRoot, 'sitemap.xml');
  const pageHashesPath = path.join(__dirname, 'page-hashes.json');

  let pageHashes = {};
  if (fs.existsSync(pageHashesPath)) {
    try {
      pageHashes = JSON.parse(fs.readFileSync(pageHashesPath, 'utf8'));
    } catch (err) {
      console.warn('[SITEMAP WARNING] Could not parse page-hashes.json:', err.message);
    }
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  // Filter canonical pages (exclude /gizlilik/ alias, exactly 109 canonical pages)
  const canonicalPages = pages.filter(p => p.dir !== 'gizlilik');

  let updatedCount = 0;
  let changedCount = 0;
  const changedUrls = [];

  const urlEntries = canonicalPages.map(page => {
    const loc = page.canonical;
    const rel = page.dir ? page.dir.replace(/\/$/, '') : '';
    const htmlFile = path.join(distDir, rel, 'index.html');

    let pageLastmod = pageHashes[loc]?.lastmod || todayStr;

    if (fs.existsSync(htmlFile)) {
      const html = fs.readFileSync(htmlFile, 'utf8');
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      let body = bodyMatch ? bodyMatch[1] : html;

      // Normalize: remove chunk hashes from asset names so rebuilds without changes don't invalidate hash
      body = body.replace(/assets\/([a-zA-Z0-9_-]+)-[a-zA-Z0-9_-]{8}\.(js|css)/g, 'assets/$1.$2');

      const hash = crypto.createHash('sha256').update(body, 'utf8').digest('hex');

      const existing = pageHashes[loc];
      if (!existing || existing.hash !== hash) {
        pageLastmod = todayStr;
        pageHashes[loc] = {
          hash,
          lastmod: todayStr
        };
        changedCount++;
        changedUrls.push(loc);
      } else {
        pageLastmod = existing.lastmod;
      }
    }

    updatedCount++;

    const priority = loc === 'https://trendmasterakademi.com/' ? '1.0' : (page.dir.includes('/') ? '0.8' : '0.9');
    const changefreq = 'weekly';

    let hreflangBlock = '';
    if (page.hreflangTr && page.hreflangEn) {
      hreflangBlock = `    <xhtml:link rel="alternate" hreflang="tr" href="${page.hreflangTr}" />\n    <xhtml:link rel="alternate" hreflang="en" href="${page.hreflangEn}" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${page.hreflangTr}" />`;
    } else {
      hreflangBlock = `    <xhtml:link rel="alternate" hreflang="tr" href="${page.canonical}" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${page.canonical}" />`;
    }

    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${pageLastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n${hreflangBlock}\n  </url>`;
  });

  const content = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urlEntries.join('\n')}\n</urlset>\n`;

  fs.writeFileSync(pageHashesPath, JSON.stringify(pageHashes, null, 2) + '\n', 'utf8');

  fs.writeFileSync(publicSitemapPath, content, 'utf8');
  if (fs.existsSync(distSitemapPath)) {
    fs.writeFileSync(distSitemapPath, content, 'utf8');
  }
  if (fs.existsSync(rootSitemapPath)) {
    fs.writeFileSync(rootSitemapPath, content, 'utf8');
  }
  console.log(`sitemap.xml updated with content-hash lastmod dates (${updatedCount} URLs, ${changedCount} updated: ${changedUrls.join(', ') || 'none'})`);
}

updateSitemapLastmod();

// =========================================================================
// SİTE İÇİ ARAMA DİZİNİ (dist/arama-dizini.json)
// =========================================================================
function generateSearchIndex() {
  const aramaDizini = [];
  const sitemapXml = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8');
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>https:\/\/trendmasterakademi\.com([^<]*)<\/loc>/g)].map(m => m[1]);

  for (const url of sitemapUrls) {
    const relPath = url === '/' ? '' : url.replace(/^\/|\/$/g, '');
    const htmlFile = path.join(distDir, relPath, 'index.html');
    if (!fs.existsSync(htmlFile)) {
      console.error(`[ARAMA DİZİNİ HATA] HTML dosyası bulunamadı: ${htmlFile}`);
      process.exit(1);
    }
    const htmlContent = fs.readFileSync(htmlFile, 'utf8');
    
    // 1. baslik: Sayfanın <title>'ı, sonundaki " | Trend Master Akademi" olmadan
    const titleMatch = htmlContent.match(/<title>([\s\S]*?)<\/title>/i);
    let baslik = titleMatch ? titleMatch[1].replace(/\s*\|\s*Trend Master Akademi$/i, '').trim() : '';
    
    // 2. metin: Sayfanın h1'i, meta açıklaması ve ön-render gövdesinin (<div id="root"> içi) görünen metni
    // Menü: <nav>...</nav> öğeleri çıkarılır (sitenin ortak menü satırı ve yol izleri arama dizinine girmez)
    const rootMatch = htmlContent.match(/<div id="root">([\s\S]*?)<\/div>\s*<\/body>/i);
    const rootHtml = rootMatch ? rootMatch[1] : '';
    
    const withoutNav = rootHtml.replace(/<nav[\s\S]*?<\/nav>/gi, ' ');

    const cleanRootText = withoutNav
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;|&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();
    
    const metaDescMatch = htmlContent.match(/<meta name="description" content="(.*?)"/i);
    const metaDesc = metaDescMatch ? metaDescMatch[1].replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim() : '';
    
    let fullMetin = '';
    if (url === '/') {
      // Ana sayfa: metin = h1 + slogan + meta açıklaması (< 600 karakter, dizin listesi girmez)
      fullMetin = `${homeH1New} ${trLocale['home-slogan']} ${metaDesc}`.replace(/\s+/g, ' ').trim();
    } else {
      fullMetin = `${metaDesc ? metaDesc + ' ' : ''}${cleanRootText}`.replace(/\s+/g, ' ').trim();
    }
    
    const pageDil = getDil(url);
    const pageKategori = getKategori(url);
    
    aramaDizini.push({
      url,
      dil: pageDil,
      kategori: pageKategori,
      baslik,
      metin: fullMetin
    });
  }

  const aramaDiziniJson = JSON.stringify(aramaDizini, null, 2);
  fs.writeFileSync(path.join(distDir, 'arama-dizini.json'), aramaDiziniJson, 'utf8');
  const rawKb = (Buffer.byteLength(aramaDiziniJson, 'utf8') / 1024).toFixed(1);
  const gzipKb = (zlib.gzipSync(Buffer.from(aramaDiziniJson)).length / 1024).toFixed(1);
  console.log(`[ARAMA DİZİNİ] ${aramaDizini.length} sayfa · ${rawKb} KB · gzip ${gzipKb} KB`);

  // Arka plan animasyonu metin verisi (gerçek logSatirlari + terms, <= 10 KB)
  const teshisRaw = fs.readdirSync(path.join(__dirname, 'src', 'data', 'teshis'))
    .filter(f => f.endsWith('.js'))
    .map(f => fs.readFileSync(path.join(__dirname, 'src', 'data', 'teshis', f), 'utf8').replace(/\s+/g, ' ').trim())
    .join('\n');

  const bgLogs = teshisData.flatMap(t => t.logSatirlari || [])
    .map(l => l.replace(/\s+/g, ' ').trim())
    .filter(l => teshisRaw.includes(l))
    .filter(Boolean);
  const bgTerms = glossaryTerms.flatMap(g => [g.title, g.titleEn].filter(Boolean));
  const arkaPlanJson = JSON.stringify({ logs: bgLogs, terms: bgTerms }, null, 2);
  fs.writeFileSync(path.join(distDir, 'arka-plan-metin.json'), arkaPlanJson, 'utf8');
  fs.writeFileSync(path.join(__dirname, 'public', 'arka-plan-metin.json'), arkaPlanJson, 'utf8');
}

generateSearchIndex();

// Build guard: SEO & HTML integrity verification
function verifySeoAndHtmlIntegrity() {
  const forbidden = ['[object Object]', 'undefined', 'NaN', '>null<', '{tr', '{en'];
  let errors = [];

  const canonicalPages = pages.filter(p => p.dir !== 'gizlilik');
  const seenTitles = new Map();
  const seenDescs = new Map();

  const beklenen = 73 + 2 * teshisData.length;   // 73 = teşhis dışındaki sayfalar (Adım 94: /tanitim/ ve /overview/)
  if (canonicalPages.length !== beklenen) {
    errors.push(`Expected exactly ${beklenen} canonical pages, found ${canonicalPages.length}`);
  }

  canonicalPages.forEach(page => {
    const rel = page.dir ? page.dir.replace(/\/$/, '') : '';
    const htmlFile = path.join(distDir, rel, 'index.html');
    if (!fs.existsSync(htmlFile)) {
      errors.push(`Missing HTML file: ${htmlFile}`);
      return;
    }

    const rawHtml = fs.readFileSync(htmlFile, 'utf8');

    // Title checks
    const titleMatch = rawHtml.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? unescapeHtml(titleMatch[1]) : '';
    if (!title) {
      errors.push(`Page ${page.canonical} is missing <title>`);
    } else {
      if (title.length > 60) {
        errors.push(`Page ${page.canonical} title exceeds 60 chars (${title.length}): "${title}"`);
      }
      const titleKey = `${page.lang || 'tr'}:${title}`;
      if (seenTitles.has(titleKey)) {
        errors.push(`Duplicate title "${title}" found in ${page.canonical} and ${seenTitles.get(titleKey)}`);
      } else {
        seenTitles.set(titleKey, page.canonical);
      }
      if (title.includes('Trend Master Academy')) {
        errors.push(`Page ${page.canonical} title contains "Trend Master Academy"`);
      }
    }

    // Description checks
    const descMatch = rawHtml.match(/<meta name="description" content="(.*?)" \/>/i);
    const desc = descMatch ? unescapeHtml(descMatch[1]) : '';
    if (!desc) {
      errors.push(`Page ${page.canonical} is missing meta description`);
    } else {
      if (desc.length < 120 || desc.length > 160) {
        errors.push(`Page ${page.canonical} description length out of range [120, 160] (${desc.length}): "${desc}"`);
      }
      if (seenDescs.has(desc)) {
        errors.push(`Duplicate description found in ${page.canonical} and ${seenDescs.get(desc)}`);
      } else {
        seenDescs.set(desc, page.canonical);
      }
      if (desc.includes('Trend Master Academy')) {
        errors.push(`Page ${page.canonical} description contains "Trend Master Academy"`);
      }
    }

    // English-specific checks (0 Turkish characters in EN titles, descriptions, and pre-render content)
    // Exclude company name, founder name, address
    if (page.lang === 'en') {
      const turkishCharRegex = /[ğüşıöçĞÜŞİÖÇ]/;
      if (turkishCharRegex.test(title)) {
        errors.push(`EN page ${page.canonical} title contains Turkish characters: "${title}"`);
      }
      if (turkishCharRegex.test(desc)) {
        errors.push(`EN page ${page.canonical} description contains Turkish characters: "${desc}"`);
      }

      // Check pre-rendered content (inside <div id="root">...</div>)
      const rootMatch = rawHtml.match(/<div id="root">([\s\S]*?)<\/div>\s*<\/body>/i);
      if (rootMatch) {
        let contentToCheck = rootMatch[1];
        // Strip company name, founder name, address, and Turkish platform proper nouns
        contentToCheck = contentToCheck
          .replace(/Trend Master Akademi/g, '')
          .replace(/Mehmet Şahin/g, '')
          .replace(/Akdeniz Mah\..*?İzmir/g, '')
          .replace(/Akdeniz Mah\..*?Izmir/g, '')
          .replace(/Şehit Fethibey/g, '')
          .replace(/İç Kapı/g, '')
          .replace(/İzmir/g, '')
          .replace(/e-Arşiv/g, '')
          .replace(/GİB/g, '');

        // Also exclude HTML tags
        contentToCheck = contentToCheck.replace(/<[^>]+>/g, ' ');

        const matchTr = contentToCheck.match(/[ğüşıöçĞÜŞİÖÇ]/);
        if (matchTr) {
          errors.push(`EN page ${page.canonical} pre-render content contains Turkish character "${matchTr[0]}" near: "...${contentToCheck.slice(Math.max(0, matchTr.index - 30), matchTr.index + 30)}..."`);
        }
      }
    }

    // Check forbidden strings
    for (const pattern of forbidden) {
      if (rawHtml.includes(pattern)) {
        errors.push(`Page ${page.canonical} contains forbidden string "${pattern}"`);
      }
    }
  });

  // Verify orphan pages incoming links in dist (>= 3)
  const orphanPaths = ['/kit/', '/agency-kit/', '/hikayemiz/', '/nda/'];
  orphanPaths.forEach(orphanPath => {
    let incomingLinks = 0;
    canonicalPages.forEach(p => {
      const rel = p.dir ? p.dir.replace(/\/$/, '') : '';
      const htmlFile = path.join(distDir, rel, 'index.html');
      if (fs.existsSync(htmlFile)) {
        const rawHtml = fs.readFileSync(htmlFile, 'utf8');
        if (rawHtml.includes(`href="${orphanPath}"`)) {
          incomingLinks++;
        }
      }
    });
    if (incomingLinks < 3) {
      errors.push(`Orphan page check failed: ${orphanPath} has only ${incomingLinks} incoming links (required >= 3)`);
    } else {
      console.log(`[BUILD GUARD] Orphan check passed: ${orphanPath} has ${incomingLinks} incoming links (>= 3).`);
    }
  });

  // Verify /nda/index.html word count (>= 1800 words)
  const ndaHtmlFile = path.join(distDir, 'nda', 'index.html');
  if (fs.existsSync(ndaHtmlFile)) {
    const ndaHtml = fs.readFileSync(ndaHtmlFile, 'utf8');
    const textOnly = ndaHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
                            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
                            .replace(/<[^>]+>/g, ' ')
                            .replace(/\s+/g, ' ')
                            .trim();
    const wordCount = textOnly.split(' ').filter(Boolean).length;
    if (wordCount < 1800) {
      errors.push(`/nda/index.html word count check failed: found ${wordCount} words, required >= 1800 words.`);
    } else {
      console.log(`[BUILD GUARD] /nda/index.html word count check passed: ${wordCount} words (>= 1800).`);
    }
  } else {
    errors.push(`/nda/index.html not found in dist!`);
  }

  if (errors.length > 0) {
    console.error(`\n[BUILD GUARD ERROR] Integrity check failed with ${errors.length} errors:`);
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log(`[BUILD GUARD] All ${beklenen} pages passed SEO & HTML integrity verification!`);
}

verifySeoAndHtmlIntegrity();

// 3.7 — Gerçek Derleme Koruması: /nda/ 3 Kontrollü Tek Kaynak ve İçerik Doğrulaması
function verifyNdaIntegrity() {
  console.log('\n[BUILD GUARD /nda/] 3 Kontrollü Gerçek Derleme Koruması Çalıştırılıyor...');

  const ndaJsxPath = path.join(__dirname, 'src/pages/Nda.jsx');
  if (!fs.existsSync(ndaJsxPath)) {
    console.error('[BUILD GUARD HATA] src/pages/Nda.jsx dosyası bulunamadı!');
    process.exit(1);
  }
  const ndaJsxContent = fs.readFileSync(ndaJsxPath, 'utf8');

  // KONTROL A: src/pages/Nda.jsx ndaFullAgreementData'yı içe aktarıyor mu?
  const importRegex = /import\s+[\s\S]*?\bndaFullAgreementData\b[\s\S]*?from/;
  if (!importRegex.test(ndaJsxContent)) {
    console.error('[BUILD GUARD A HATA] src/pages/Nda.jsx ndaFullAgreementData\'yı içe aktarmıyor!');
    process.exit(1);
  }
  console.log('[BUILD GUARD A GEÇTİ] src/pages/Nda.jsx ndaFullAgreementData\'yı içe aktarıyor.');

  // KONTROL B: src/pages/Nda.jsx'te veri dosyasındaki herhangi bir metin (≥ 25 karakter) string olarak geçiyor mu?
  function extractAllStrings(obj, result = []) {
    if (obj == null) return result;
    if (typeof obj === 'string') {
      const trimmed = obj.trim();
      if (trimmed.length >= 25) {
        result.push(trimmed);
      }
    } else if (Array.isArray(obj)) {
      for (const item of obj) {
        extractAllStrings(item, result);
      }
    } else if (typeof obj === 'object') {
      for (const val of Object.values(obj)) {
        extractAllStrings(val, result);
      }
    }
    return result;
  }

  const allNdaStrings = extractAllStrings(ndaFullAgreementData);
  for (const s of allNdaStrings) {
    if (ndaJsxContent.includes(s)) {
      console.error(`[BUILD GUARD B HATA] src/pages/Nda.jsx içinde veri dosyasındaki metin elle yazılmış bulundu (≥ 25 karakter):\n"${s}"`);
      process.exit(1);
    }
  }
  console.log(`[BUILD GUARD B GEÇTİ] src/pages/Nda.jsx içinde veri dosyasından elle yazılmış metin yok (${allNdaStrings.length} metin denetlendi).`);

  // KONTROL C: dist/nda/index.html ana içeriğinde veri dosyasındaki HER metin (özet · maddeler · liste öğeleri · İMZA · öncelik kaydı) geçiyor mu?
  const ndaHtmlFile = path.join(distDir, 'nda', 'index.html');
  if (!fs.existsSync(ndaHtmlFile)) {
    console.error('[BUILD GUARD C HATA] dist/nda/index.html dosyası bulunamadı!');
    process.exit(1);
  }
  const ndaRawHtml = fs.readFileSync(ndaHtmlFile, 'utf8');
  const mainMatch = ndaRawHtml.match(/<main class="space-y-6">([\s\S]*?)<\/main>/i);
  const mainContent = mainMatch ? mainMatch[1] : ndaRawHtml;

  function normalizeText(t) {
    return (t || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const normalizedMain = normalizeText(mainContent);

  // Özet, maddeler, liste öğeleri, İMZA ve öncelik kaydı
  const targetSections = {
    pageHeader: {
      backLink: ndaFullAgreementData.pageHeader.backLink,
      badge: ndaFullAgreementData.pageHeader.badge
    },
    whatItGivesYou: ndaFullAgreementData.whatItGivesYou,
    protectsUsToo: ndaFullAgreementData.protectsUsToo,
    canItBeChanged: ndaFullAgreementData.canItBeChanged,
    fullAgreementHeader: ndaFullAgreementData.fullAgreementHeader,
    clauses: ndaFullAgreementData.clauses,
    signatures: ndaFullAgreementData.signatures,
    precedenceNotice: ndaFullAgreementData.precedenceNotice
  };

  function extractRequiredTrStrings(obj, result = []) {
    if (obj == null) return result;
    if (typeof obj === 'string') {
      const trimmed = obj.trim();
      if (trimmed.length > 0) result.push(trimmed);
    } else if (Array.isArray(obj)) {
      for (const item of obj) {
        extractRequiredTrStrings(item, result);
      }
    } else if (typeof obj === 'object') {
      if ('tr' in obj) {
        if (typeof obj.tr === 'string' && obj.tr.trim().length > 0) {
          result.push(obj.tr.trim());
        }
      } else {
        for (const [key, val] of Object.entries(obj)) {
          if (key === 'en' || key === 'enNotice' || key === 'pdfHref' || key === 'pdfDownloadName') continue;
          extractRequiredTrStrings(val, result);
        }
      }
    }
    return result;
  }

  const requiredTexts = extractRequiredTrStrings(targetSections);
  for (const text of requiredTexts) {
    const normExpected = normalizeText(text);
    if (!normalizedMain.includes(normExpected)) {
      console.error(`[BUILD GUARD C HATA] dist/nda/index.html ana içeriğinde veri dosyasındaki metin eksik:\n"${text}"`);
      process.exit(1);
    }
  }
  console.log(`[BUILD GUARD C GEÇTİ] dist/nda/index.html ana içeriğinde veri dosyasındaki tüm metinler eksiksiz mevcut (${requiredTexts.length} metin doğrulandı).`);
}

verifyNdaIntegrity();

// =========================================================================
// 3.8 — GERÇEK DERLEME KORUMASI: H1 TEK KAYNAK VE BÜTÜNLÜK KORUMASI
// Guard A: generate_static_pages.js basePages içinde elle yazılmış H1 yasağı
// Guard B: JSX dosyalarında elle yazılmış H1 yasağı
// Guard C: dist HTML ön-render H1 ile veri dosyası birebir eşleşme kontrolü
// =========================================================================
function verifyH1Integrity() {
  console.log('\n[BUILD GUARD H1] 3 Seviyeli H1 Gerçek Derleme Koruması Çalıştırılıyor...');

  // -------------------------------------------------------------
  // GUARD A: generate_static_pages.js içinde basePages dizisi kontrolü
  // -------------------------------------------------------------
  const selfContent = fs.readFileSync(__filename, 'utf8');
  const basePagesMatch = selfContent.match(/const\s+basePages\s*=\s*\[([\s\S]*?)\];/);
  if (!basePagesMatch) {
    console.error('[BUILD GUARD H1-A HATA] generate_static_pages.js içinde basePages dizisi bulunamadı!');
    process.exit(1);
  }
  const basePagesCode = basePagesMatch[1];
  const lines = basePagesCode.split('\n');
  const violationsA = [];
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (/^h1:\s*['"`]/.test(trimmed)) {
      violationsA.push({ line: trimmed, lineNum: idx + 1 });
    }
  });
  if (violationsA.length > 0) {
    console.error(`[BUILD GUARD H1-A HATA] generate_static_pages.js basePages dizisinde elle yazılmış dize sabiti H1 tespit edildi:`);
    violationsA.forEach(v => console.error(`  - Satır: ${v.line}`));
    process.exit(1);
  }
  console.log('[BUILD GUARD H1-A GEÇTİ] generate_static_pages.js basePages içinde elle yazılmış H1 dize sabiti yok (tümü tek kaynak değişken/fonksiyon).');

  // -------------------------------------------------------------
  // GUARD B: JSX içinde elle yazılmış H1 yasağı
  // -------------------------------------------------------------
  function getJsxFiles(dir) {
    let files = [];
    if (!fs.existsSync(dir)) return files;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) files = files.concat(getJsxFiles(full));
      else if (ent.name.endsWith('.jsx')) files.push(full);
    }
    return files;
  }

  const jsxFiles = [
    ...getJsxFiles(path.join(__dirname, 'src/pages')),
    ...getJsxFiles(path.join(__dirname, 'src/components'))
  ];

  // H1 tanımları ve ait oldukları sayfa bileşenleri
  const pageH1Bindings = [
    { file: 'About.jsx', h1s: [aboutH1.tr, aboutH1.en] },
    { file: 'Story.jsx', h1s: [storyH1.tr, storyH1.en] },
    { file: 'Agency.jsx', h1s: [agencyH1.tr.full, agencyH1.en.full] },
    { file: 'AgencyKit.jsx', h1s: [agencyKitH1.tr.full, agencyKitH1.en.full] },
    { file: 'CrashTest.jsx', h1s: [crashTestH1.tr.full, crashTestH1.en.full] },
    { file: 'DevirKontrolu.jsx', h1s: [handoverAuditH1.tr, handoverAuditH1.en] },
    { file: 'KesintiMaliyeti.jsx', h1s: [downtimeCostH1.tr, downtimeCostH1.en] },
    { file: 'Salvageability.jsx', h1s: [salvageabilityH1.tr, salvageabilityH1.en] },
    { file: 'Triage.jsx', h1s: [triageH1.tr, triageH1.en] },
    { file: 'TeshisIndex.jsx', h1s: [teshisCatalogH1.tr, teshisCatalogH1.en] },
    { file: 'Sos.jsx', h1s: [sosH1.tr, sosH1.en] },
    { file: 'Privacy.jsx', h1s: [privacyH1.tr, privacyH1.en] },
    { file: 'GlossaryIndex.jsx', h1s: [glossaryHubH1.tr, glossaryHubH1.en] },
    { file: 'PostMortemIndex.jsx', h1s: [postMortemHubH1.tr, postMortemHubH1.en] },
    { file: 'Sla.jsx', h1s: [slaH1.tr, slaH1.en] },
    { file: 'TechMatrix.jsx', h1s: [techStackH1.tr, techStackH1.en] },
    { file: 'OutageSimulator.jsx', h1s: [outageSimulatorH1.tr, outageSimulatorH1.en] },
    { file: 'StatusRadar.jsx', h1s: [radarH1.tr, radarH1.en] },
    { file: 'CodeHealth.jsx', h1s: [codeHealthH1.tr, codeHealthH1.en] },
    { file: 'RescueRoi.jsx', h1s: [rescueRoiH1.tr, rescueRoiH1.en] },
    { file: 'NdaGenerator.jsx', h1s: [mutualNdaH1.tr, mutualNdaH1.en] },
    { file: 'Tmai.jsx', h1s: [tmaiH1.tr, tmaiH1.en] }
  ];

  const violationsB = [];

  // B.1: Sayfa bileşeni içinde kendi H1 dize sabitini elle yazma kontrolü
  for (const binding of pageH1Bindings) {
    const pagePath = path.join(__dirname, 'src/pages', binding.file);
    if (!fs.existsSync(pagePath)) continue;
    const content = fs.readFileSync(pagePath, 'utf8');
    const cleanContent = content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');
    for (const h1Str of binding.h1s) {
      if (typeof h1Str === 'string' && h1Str.length >= 12 && cleanContent.includes(h1Str)) {
        violationsB.push({
          file: `src/pages/${binding.file}`,
          h1: h1Str,
          reason: `Sayfa H1 başlığı dosya içinde dize sabiti olarak elle yazılmış (veri dosyasından import edilmeli)`
        });
      }
    }
  }

  // B.2: Tüm JSX dosyalarında <h1 ...> etiketi içinde ham metin kontrolü
  for (const f of jsxFiles) {
    const rel = path.relative(__dirname, f).replace(/\\/g, '/');
    const content = fs.readFileSync(f, 'utf8');
    const clean = content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');
    const h1TagMatches = clean.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi);
    for (const match of h1TagMatches) {
      const inner = match[1];
      const withoutExpressions = inner.replace(/\{[\s\S]*?\}/g, '').replace(/<[^>]+>/g, '').trim();
      if (withoutExpressions.length >= 12) {
        violationsB.push({
          file: rel,
          h1: withoutExpressions,
          reason: `<h1> etiketi içinde JSX ifadesi ({...}) yerine ham metin yazılmış`
        });
      }
    }
  }

  if (violationsB.length > 0) {
    console.error(`[BUILD GUARD H1-B HATA] JSX dosyalarında elle yazılmış H1 başlığı tespit edildi (${violationsB.length} ihlal):`);
    violationsB.forEach(v => {
      console.error(`  - Dosya: ${v.file}`);
      console.error(`    Başlık: "${v.h1}"`);
      console.error(`    Neden: ${v.reason}`);
    });
    process.exit(1);
  }
  console.log(`[BUILD GUARD H1-B GEÇTİ] src/pages ve src/components içinde elle yazılmış H1 dize sabiti veya ham metin yok (${jsxFiles.length} JSX dosyası denetlendi).`);

  // -------------------------------------------------------------
  // GUARD C: dist HTML ön-render çıktısı H1 kontrolü (tüm 109 sayfa)
  // -------------------------------------------------------------
  function normalizeH1(t) {
    return (t || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const mismatchesC = [];
  pages.forEach(page => {
    const pageDirRel = page.dir ? page.dir.replace(/\/$/, '') : '';
    const htmlPath = path.join(distDir, pageDirRel, 'index.html');
    if (!fs.existsSync(htmlPath)) {
      mismatchesC.push({
        path: htmlPath,
        expected: page.h1,
        found: '[DOSYA YOK]'
      });
      return;
    }
    const html = fs.readFileSync(htmlPath, 'utf8');
    const match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    if (!match) {
      mismatchesC.push({
        path: htmlPath,
        expected: page.h1,
        found: '[H1 BULUNAMADI]'
      });
      return;
    }
    const foundH1 = normalizeH1(match[1]);
    const expectedH1 = normalizeH1(page.h1);
    if (foundH1 !== expectedH1) {
      mismatchesC.push({
        path: htmlPath,
        expected: expectedH1,
        found: foundH1
      });
    }
  });

  if (mismatchesC.length > 0) {
    console.error(`[BUILD GUARD H1-C HATA] ${mismatchesC.length} sayfada dist H1 ile veri dosyası uyuşmazlığı tespit edildi:`);
    mismatchesC.forEach(m => {
      console.error(`  - Dosya: ${m.path}`);
      console.error(`    Beklenen: "${m.expected}"`);
      console.error(`    Bulunan:  "${m.found}"`);
    });
    process.exit(1);
  }
  console.log(`[BUILD GUARD H1-C GEÇTİ] Tüm ${73 + 2 * teshisData.length} sayfanın dist HTML H1 başlığı veri dosyasıyla birebir eşleşiyor (${pages.length} sayfa doğrulandı).`);
}

verifyH1Integrity();

// =========================================================================
// 3.9 — GERÇEK DERLEME KORUMASI: RENK KONTRASTI VE SEMANTİK TOKEN BÜTÜNLÜĞÜ
// Kural A: 22 Tailwind rengi ve 16 önek kombinasyonunda sabit renk sınıfı yasağı
// Kural B: text-white, bg-white vb. doğrudan beyaz sınıfı yasağı (overlay/lightbox istisnaları hariç)
// Kural C: -[#...] formatında keyfi hex kodları yasağı
// Kural D: src/index.css veya index.html içinde tanımlı olmayan var(--...) değişken adları yasağı
// Kural E: index.css içinde zorunlu 21 semantik tokenın eksiksiz tanımlanması
// =========================================================================
function verifyColorIntegrity() {
  console.log('\n[BUILD GUARD RENK] Renk Kontrastı ve Semantik Token Derleme Koruması Çalıştırılıyor...');

  const errors = [];

  // 1. KURAL E: index.css içinde zorunlu semantik token kontrolü
  const cssPath = path.join(__dirname, 'src/index.css');
  if (!fs.existsSync(cssPath)) {
    console.error('[BUILD GUARD RENK HATA] src/index.css dosyası bulunamadı!');
    process.exit(1);
  }
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  const requiredTokens = [
    // Adım 65 Temel Tokenları
    '--paper',
    '--surface',
    '--rule',
    '--rule-strong',
    '--rule-input',
    '--ink',
    '--ink-2',
    '--ink-3',
    '--accent',
    '--accent-ink',
    '--accent-wash',
    '--on-accent',
    '--term-bg',
    '--term-ink',
    '--term-dim',
    '--on-sev-ok',
    // Adım 66 Ekleri
    '--accent-hover',
    '--wa',
    '--on-wa',
    '--wa-logo',
    '--term-warn',
    '--term-bright',
    '--term-diff-add',
    '--term-diff-del',
    // Anlamsal Renk Aileleri
    '--tint-ok-bg',
    '--tint-ok-ink',
    '--tint-ok-rule',
    '--tint-warn-bg',
    '--tint-warn-ink',
    '--tint-warn-rule',
    '--tint-danger-bg',
    '--tint-danger-ink',
    '--tint-danger-rule',
    '--tint-info-bg',
    '--tint-info-ink',
    '--tint-info-rule'
  ];

  for (const token of requiredTokens) {
    if (!cssContent.includes(token + ':')) {
      errors.push(`src/index.css içinde zorunlu token tanımı eksik: ${token}`);
    }
  }

  // 2. Taranacak tüm dosyaların toplanması (src/**/*.{js,jsx,css}, generate_static_pages.js, index.html)
  function getSourceFiles(dir) {
    let files = [];
    if (!fs.existsSync(dir)) return files;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        files = files.concat(getSourceFiles(full));
      } else if (ent.name.endsWith('.js') || ent.name.endsWith('.jsx') || ent.name.endsWith('.css')) {
        files.push(full);
      }
    }
    return files;
  }

  const filesToScan = [
    ...getSourceFiles(path.join(__dirname, 'src')),
    __filename,
    path.join(__dirname, 'index.html')
  ];

  // Tanımlı CSS değişkenlerinin kümesi (src/index.css ve index.html pre-render stilleri)
  const definedVars = new Set();
  const varDefRegex = /--([a-zA-Z0-9_-]+)\s*:/g;
  let defMatch;
  while ((defMatch = varDefRegex.exec(cssContent)) !== null) {
    definedVars.add('--' + defMatch[1]);
  }
  const indexHtmlPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
    while ((defMatch = varDefRegex.exec(indexHtmlContent)) !== null) {
      definedVars.add('--' + defMatch[1]);
    }
  }

  // Kural A Regex: 22 Tailwind rengi + 16 önek
  const twColors = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
  const twPrefixes = 'bg|text|border|ring|outline|divide|fill|stroke|from|via|to|decoration|placeholder|caret|accent|shadow';
  const ruleARegex = new RegExp('(?:^|[^a-zA-Z0-9_-])(?:[a-z0-9:-]+:)?(?:' + twPrefixes + ')-(?:' + twColors + ')-[0-9]+', 'g');

  // Kural B Regex: Beyaz sınıfı yasağı (text-white, bg-white, ring-white, fill-white vb.)
  const ruleBWhiteRegex = /(?:^|[^a-zA-Z0-9_-])(?:[a-z0-9:-]+:)?(?:text|bg|ring|fill|stroke|outline)-white\b/g;

  // Kural C Regex: Keyfi hex kodları yasağı (örn. bg-[#25D366], text-[#fff])
  const ruleCHexRegex = /-(?:\[#[0-9a-fA-F]+\])/g;

  // Kural D Regex: var(--...) kullanımı
  const ruleDVarRegex = /var\((--[a-zA-Z0-9_-]+)\)/g;

  filesToScan.forEach(file => {
    const rel = path.relative(__dirname, file).replace(/\\/g, '/');
    const isCss = file.endsWith('.css');
    let content = fs.readFileSync(file, 'utf8');

    // generate_static_pages.js taranırken koruma fonksiyonunun kendi metnini dışarıda bırakıyoruz
    if (file === __filename) {
      const guardStart = content.indexOf('3.9 — GERÇEK DERLEME KORUMASI: RENK KONTRASTI');
      if (guardStart !== -1) {
        content = content.slice(0, guardStart);
      }
    }

    // Kural A Denetimi (Sabit Tailwind rengi)
    let aMatch;
    while ((aMatch = ruleARegex.exec(content)) !== null) {
      errors.push(`[KURAL A] ${rel} dosyasında yasaklı sabit Tailwind renk sınıfı tespit edildi: ${aMatch[0].trim()}`);
    }

    // Kural B Denetimi (Beyaz sınıfı yasağı, CSS dosyası hariç)
    if (!isCss) {
      let bMatch;
      while ((bMatch = ruleBWhiteRegex.exec(content)) !== null) {
        errors.push(`[KURAL B] ${rel} dosyasında yasaklı doğrudan beyaz sınıfı tespit edildi: ${bMatch[0].trim()}`);
      }
    }

    // Kural C Denetimi (Keyfi hex sınıfı yasağı, CSS dosyası hariç)
    if (!isCss) {
      let cMatch;
      while ((cMatch = ruleCHexRegex.exec(content)) !== null) {
        errors.push(`[KURAL C] ${rel} dosyasında keyfi hex renk sınıfı tespit edildi: ${cMatch[0].trim()}`);
      }
    }

    // Kural D Denetimi (Tanımsız CSS değişkeni yasağı)
    let dMatch;
    while ((dMatch = ruleDVarRegex.exec(content)) !== null) {
      const v = dMatch[1];
      if (!definedVars.has(v) && !v.startsWith('--tw-')) {
        errors.push(`[KURAL D] ${rel} dosyasında tanımsız CSS değişkeni kullanımı tespit edildi: ${v}`);
      }
    }
  });

  if (errors.length > 0) {
    console.error(`\n[BUILD GUARD RENK HATA] Renk kontrast bütünlüğü koruması ${errors.length} hata ile başarısız oldu:`);
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log(`[BUILD GUARD RENK GEÇTİ] Tüm 21 semantik token mevcut, ${filesToScan.length} dosyada 5 seviyeli renk ve kontrast denetimi başarıyla doğrulandı.`);
}

verifyColorIntegrity();

// =============================================================================
// 3.10 — GERÇEK DERLEME KORUMASI: TEŞHİS BÜTÜNLÜĞÜ (verifyTeshisIntegrity)
// =============================================================================
function verifyTeshisIntegrity() {
  console.log('\n[BUILD GUARD TEŞHİS] Teşhis bütünlüğü denetimi başlatılıyor (Kurallar A-F)...');
  const errors = [];

  // ---------------------------------------------------------------------------
  // Kural A: indexSummary.js ve count.js güncel
  // teshisData'dan bellekte yeniden üretilen özet ve sayı, dosyadakiyle aynı değilse → DUR
  // ---------------------------------------------------------------------------
  const dir = path.join(__dirname, 'src/data/teshis');
  const sortedItems = [...teshisData].sort((a, b) => Number(a.no) - Number(b.no));
  const ALANLAR = ['slug', 'no', 'baslik', 'diyagramBaslik', 'kirinti', 'aciliyet', 'ozet', 'ilgiliTerimler', 'nedenler'];
  const expectedSummaries = sortedItems.map((t) =>
    Object.fromEntries(
      ALANLAR.map((k) => [k, k === 'nedenler' ? t.nedenler.map((n) => ({ harf: n.harf, ad: n.ad })) : t[k]])
    )
  );
  const expectedSummariesStr = ('export const teshisSummaries = ' + JSON.stringify(expectedSummaries, null, 2) + ';\n').replace(/\r\n/g, '\n').trim();
  const expectedCountStr = ('export const teshisSayisi = ' + sortedItems.length + ';\n').replace(/\r\n/g, '\n').trim();

  const actualSummariesPath = path.join(dir, 'indexSummary.js');
  const actualCountPath = path.join(dir, 'count.js');

  if (!fs.existsSync(actualSummariesPath)) {
    errors.push('[KURAL A] src/data/teshis/indexSummary.js dosyası bulunamadı.');
  } else {
    const actualSummariesStr = fs.readFileSync(actualSummariesPath, 'utf8').replace(/\r\n/g, '\n').trim();
    if (actualSummariesStr !== expectedSummariesStr) {
      errors.push('[KURAL A] src/data/teshis/indexSummary.js güncel değil! teshisData ile uyuşmuyor.');
    }
  }

  if (!fs.existsSync(actualCountPath)) {
    errors.push('[KURAL A] src/data/teshis/count.js dosyası bulunamadı.');
  } else {
    const actualCountStr = fs.readFileSync(actualCountPath, 'utf8').replace(/\r\n/g, '\n').trim();
    if (actualCountStr !== expectedCountStr) {
      errors.push('[KURAL A] src/data/teshis/count.js güncel değil! teshisData ile uyuşmuyor.');
    }
  }

  // ---------------------------------------------------------------------------
  // Kural B: EN kayıt satırı
  // Her logSatirlari satırının diagnosticLogEnMap'te karşılığı yoksa → DUR
  // (Halihazırda saf İngilizce sistem ve sunucu log satırları hariç)
  // ---------------------------------------------------------------------------
  const trLogRegex = /[çğıöşüÇĞİÖŞÜ«»]|←|\b(ve|veya|için|ile|değil|kullanıcı|oturum|kaydı|sayfası|eklentisi|alanı|yanıtı|isteği|hatası|başarılı|ödeme|sipariş|durum|erişim|kutusu|E-posta)\b/i;

  for (const item of teshisData) {
    if (Array.isArray(item.logSatirlari)) {
      for (const log of item.logSatirlari) {
        const hasEnTranslation = Boolean(diagnosticLogEnMap && diagnosticLogEnMap[log]);
        const needsTranslation = trLogRegex.test(log);
        if (needsTranslation && !hasEnTranslation) {
          errors.push(`[KURAL B] "${item.slug}" teşhisindeki log satırının diagnosticLogEnMap karşılığı yok: "${log}"`);
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Kural C: seoData
  // Her slug için "/teshis/<slug>/".tr ve "/diagnostic/<slug>/".en yoksa,
  // başlık > 60 ya da açıklama 120–160 dışındaysa → DUR
  // ---------------------------------------------------------------------------
  for (const item of teshisData) {
    const trPath = `/teshis/${item.slug}/`;
    const enPath = `/diagnostic/${item.slug}/`;

    const trSeo = seoData?.[trPath]?.tr;
    if (!trSeo) {
      errors.push(`[KURAL C] seoData içinde "${trPath}".tr kaydı eksik.`);
    } else {
      if (!trSeo.title || trSeo.title.length > 60) {
        errors.push(`[KURAL C] "${trPath}" başlık 60 karakterden uzun (${trSeo.title?.length || 0}): "${trSeo.title}"`);
      }
      if (!trSeo.desc || trSeo.desc.length < 120 || trSeo.desc.length > 160) {
        errors.push(`[KURAL C] "${trPath}" açıklama 120-160 karakter aralığında değil (${trSeo.desc?.length || 0}): "${trSeo.desc}"`);
      }
    }

    const enSeo = seoData?.[enPath]?.en;
    if (!enSeo) {
      errors.push(`[KURAL C] seoData içinde "${enPath}".en kaydı eksik.`);
    } else {
      if (!enSeo.title || enSeo.title.length > 60) {
        errors.push(`[KURAL C] "${enPath}" başlık 60 karakterden uzun (${enSeo.title?.length || 0}): "${enSeo.title}"`);
      }
      if (!enSeo.desc || enSeo.desc.length < 120 || enSeo.desc.length > 160) {
        errors.push(`[KURAL C] "${enPath}" açıklama 120-160 karakter aralığında değil (${enSeo.desc?.length || 0}): "${enSeo.desc}"`);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Kural D: ilgiliTeshisler
  // Var olmayan slug ya da tek yönlü bağlantı varsa → DUR
  // ---------------------------------------------------------------------------
  for (const item of teshisData) {
    if (Array.isArray(item.ilgiliTeshisler)) {
      for (const targetSlug of item.ilgiliTeshisler) {
        const target = teshisData.find((d) => d.slug === targetSlug);
        if (!target) {
          errors.push(`[KURAL D] "${item.slug}" içinde var olmayan ilgiliTeshisler slug'ı: "${targetSlug}"`);
        } else {
          if (!Array.isArray(target.ilgiliTeshisler) || !target.ilgiliTeshisler.includes(item.slug)) {
            errors.push(`[KURAL D] "${item.slug}" -> "${targetSlug}" bağlantısı simetrik (karşılıklı) değil! "${targetSlug}" içinde "${item.slug}" listelenmemiş.`);
          }
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Kural E: elle yazılmış teşhis sayısı
  // src/**/*.{js,jsx}, src/locales/*.json ve üretici (korumalar hariç) içinde
  // /\b([2-9]|\d{2,})\s+(Teşhis|teşhis|Belirti|belirti|arıza|belgelenmiş arıza|yaygın yazılım arıza|Diagnos|diagnos|Symptom|symptom|failure pattern|published failure|common software failure)/ → DUR
  // ---------------------------------------------------------------------------
  const hardcodedNumberRegex = /\b([2-9]|\d{2,})\s+(Teşhis|teşhis|Belirti|belirti|arıza|belgelenmiş arıza|yaygın yazılım arıza|Diagnos|diagnos|Symptom|symptom|failure pattern|published failure|common software failure)/;

  function getFilesToScan(dirPath) {
    let results = [];
    if (!fs.existsSync(dirPath)) return results;
    const list = fs.readdirSync(dirPath);
    for (const file of list) {
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        results = results.concat(getFilesToScan(fullPath));
      } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.json')) {
        results.push(fullPath);
      }
    }
    return results;
  }

  const filesForE = [
    ...getFilesToScan(path.join(__dirname, 'src')),
    __filename
  ];

  for (const file of filesForE) {
    let content = fs.readFileSync(file, 'utf8');
    if (file === __filename) {
      const guardIdx = content.indexOf('3.10 — GERÇEK DERLEME KORUMASI: TEŞHİS BÜTÜNLÜĞÜ');
      if (guardIdx !== -1) {
        content = content.slice(0, guardIdx);
      }
    }
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      const m = hardcodedNumberRegex.exec(line);
      if (m) {
        const rel = path.relative(__dirname, file).replace(/\\/g, '/');
        errors.push(`[KURAL E] ${rel}:${idx + 1} dosyasında elle yazılmış teşhis sayısı tespit edildi: "${m[0]}"`);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Kural F: resmiKaynaklar
  // url.tr ya da url.en https:// ile başlamıyorsa → DUR
  // ---------------------------------------------------------------------------
  for (const item of teshisData) {
    if (Array.isArray(item.resmiKaynaklar)) {
      for (const rk of item.resmiKaynaklar) {
        const trUrl = typeof rk.url === 'string' ? rk.url : rk.url?.tr;
        const enUrl = typeof rk.url === 'string' ? rk.url : rk.url?.en;
        if (!trUrl || !trUrl.startsWith('https://')) {
          errors.push(`[KURAL F] "${item.slug}" resmi kaynak Türkçe URL 'https://' ile başlamıyor: "${trUrl}"`);
        }
        if (!enUrl || !enUrl.startsWith('https://')) {
          errors.push(`[KURAL F] "${item.slug}" resmi kaynak İngilizce URL 'https://' ile başlamıyor: "${enUrl}"`);
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error(`\n[BUILD GUARD TEŞHİS HATA] Teşhis bütünlüğü koruması ${errors.length} hata ile başarısız oldu:`);
    errors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log(`[BUILD GUARD TEŞHİS GEÇTİ] ${teshisData.length} teşhis için A-F bütünlük denetimleri (özet, count, log eşleme, seoData, simetrik linkler, sabit rakam taraması, resmi kaynaklar) başarıyla doğrulandı.`);
}

verifyTeshisIntegrity();

// ---------------------------------------------------------------------------
// [BUILD GUARD KİT] Adım 82 — Kit kargoyla fiziksel olarak gönderildi, değiştirilemez.
// public/agency-kit, dist/agency-kit ve (varsa) canlı kökteki agency-kit klasöründeki
// 11 dosya aşağıdaki SHA-256 değerleriyle birebir aynı olmalı. Biri farklıysa → DUR.
// ---------------------------------------------------------------------------
function verifyKitIntegrity() {
  console.log('\n[BUILD GUARD KİT] Kit dosyası bütünlüğü denetleniyor...');
  const kitHashes = {
    'tma-agency-response-kit.pdf': '2b7379cbd6b0a1f3f2acec38fbb92cef87ae9bd4bf5ebf8eaa1e62af3348f681',
    'tma-agency-crash-test-500.pdf': '79d156e6d5694492887fafaec1c64d351e118a188ed99e0c8cb917638160b04f',
    'crash-test-500-poster.png': '35e16d3009329a30999b441238d4f9e3557c20a34841b8a811a03dcf19988b3c',
    'response-kit-slide-1.png': 'da3f2be944fb10abfe59a6fa2f6889f78f7f7437f9d3416eda3d90b44b2fb757',
    'response-kit-slide-2.png': 'daf5e748beb200738c6388073be88a1317e8113dd2b97010042ca700bdf214f8',
    'response-kit-slide-3.png': '140d0c94164c5ce5af8a1d0ceec4d2825fad39aae21253f809c67e9945edb037',
    'response-kit-slide-4.png': '3057ac56dc5be88cd818ef227c418af026df1d98a4c1d27b9d4b741625961aec',
    'response-kit-slide-5.png': '0a4b0bf023e2e8795448cbb070f904135030dbe98f4d203a3025ea9305e97b8e',
    'response-kit-slide-6.png': 'd4c14007378b8aea357f084d732acd6dd04766cb4b4a382cc9244085cfa7f4a2',
    'response-kit-slide-7.png': '14a15f131a1d3d6c9bb686532e8f19d037dde448ce6017e0589020115567a935',
    'response-kit-slide-8.png': '509c796e7c4d6a74b7d1235cf4a177779b3960f7f56515fa8fd9b6eb09c01573',
  };
  const kokKlasor = path.join(__dirname, '..', 'agency-kit');
  const klasorler = [path.join(__dirname, 'public', 'agency-kit'), path.join(__dirname, 'dist', 'agency-kit')];
  if (fs.existsSync(kokKlasor)) klasorler.push(kokKlasor);
  const errors = [];
  for (const klasor of klasorler) {
    for (const [dosya, beklenen] of Object.entries(kitHashes)) {
      const yol = path.join(klasor, dosya);
      if (!fs.existsSync(yol)) { errors.push(`${path.relative(__dirname, yol)} bulunamadı`); continue; }
      const gercek = crypto.createHash('sha256').update(fs.readFileSync(yol)).digest('hex');
      if (gercek !== beklenen) errors.push(`${path.relative(__dirname, yol)} değişmiş (beklenen ${beklenen.slice(0, 16)}, bulunan ${gercek.slice(0, 16)})`);
    }
  }
  if (errors.length > 0) {
    console.error(`\n[BUILD GUARD KİT HATA] Kit dosyaları kargoyla gönderilen kitle aynı değil (${errors.length} hata):`);
    errors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  }
  console.log(`[BUILD GUARD KİT GEÇTİ] ${Object.keys(kitHashes).length} kit dosyası ${klasorler.length} klasörde kargoyla gönderilen kitle birebir aynı.`);
}

verifyKitIntegrity();

// ---------------------------------------------------------------------------
// [BUILD GUARD İÇERİK] Adım 87 — Adım 79–86'da kaldırılan vaat, garanti ve dil kalıntıları geri gelemez.
// A) Aşağıdaki ifadeler src/ ve dist/ içinde geçemez (sözleşme/SLA dışı süre ve garanti, Türkçe sayfada İngilizce etiket).
// B) Teşhis kataloğunda "Kim çözer" metni ve diyagram "Çözüm" kutuları süre içeremez (Adım 85).
// Bir ifade meşru olarak geri gerekiyorsa önce Mehmet'in kararı alınır, sonra bu liste güncellenir.
// ---------------------------------------------------------------------------
function verifyContentRules() {
  console.log('\n[BUILD GUARD İÇERİK] Vaat, garanti ve dil kuralları denetleniyor...');
  const yasakIfadeler = [
    // Adım 79–81 · süre ve sonuç vaatleri
    'deadlock döngüsünü 20 dakikada', 'tamamen dindirir', 'kayıp anahtarları kurtarır', 'hatasız build hattı',
    'ADIM 01 (0 - 24 Saat)', 'STEP 01 (0 - 24 Hours)', '(Aylık Ciro / 720 Saat)', 'veri kaybı riski sıfır',
    // Adım 82 · kit ve radar
    'sıfır kayıplı geri dönüş', 'zero-loss rollback', 'Masaya Oturma Ortalaması', 'Time to Table', 'masaya oturma protokolü',
    // Adım 84 · süre ve Türkçe sayfada İngilizce
    '0-2 saatte', 'within 0-2 hours', '48-72 saatte', 'within 48-72 hours', '3-4 haftalık sprint', '3-4 week sprint',
    'HANDOVER HELL', 'T−48H CRUNCH', 'STRANDED CODEBASE', 'Salvageability Index (Karar Matrisi)', 'Incident Post-Mortem & RCA',
    // Adım 85 · teşhis süreleri
    '2–4 saat', '2–4 hours', 'saatler içinde açılır', 'saatler içinde biter',
    // Adım 86 · garanti dili
    'kesintiyi sıfırlıyoruz', 'Zero out downtime', 'gecikmesiz yakalamanızı', 'zero latency', 'Sorunsuz Canlı Dağıtım', 'Seamless Deployment',
    '%100 Güvenli Analiz', '%100 Gizlilik Güvencesi', 'Confidentiality Guarantee', 'escalated instantly', 'eksiksiz teslim ederiz',
    'Eksiksiz Teslim Ederiz', 'zero project blockage', 'Stres testleri ve güvenlik kontrolleri',
    // Adım 89 · teşhis başlığında süre çağrışımı
    'Kim çözer, ne kadar sürer', 'Time to Fix',
    // Adım 91 · formlar: düğme yazdığı kanalı kullanır, hata metni sebep uydurmaz, eski (geçersiz) anahtar
    'WhatsApp Üzerinden Hemen İletişime Geç', 'Connect Immediately via WhatsApp', 'WhatsApp üzerinden kıdemli mühendislik masamıza aktarıldı',
    'Ağ kesintisi nedeniyle', 'Ağ Kesintisi Nedeniyle', 'Network interruption during', 'Network Interruption During', 'Network timeout prevented',
    'Sunucu Bağlantısı Kurulamadı', 'Server Connection Interrupted', '64ef0cf5-703c-4cfd-92a4-4f0ba65bb2bb',
  ];
  const errors = [];
  const dosyalar = (kok, uzanti) => {
    const o = [];
    if (!fs.existsSync(kok)) return o;
    const gez = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) gez(p); else if (uzanti.test(e.name)) o.push(p); } };
    gez(kok);
    return o;
  };
  const taranan = [...dosyalar(path.join(__dirname, 'src'), /\.(jsx?|json)$/), ...dosyalar(distDir, /\.(html|js)$/)];
  for (const dosya of taranan) {
    const icerik = fs.readFileSync(dosya, 'utf8');
    for (const ifade of yasakIfadeler) if (icerik.includes(ifade)) errors.push(`${path.relative(__dirname, dosya)} → "${ifade}"`);
  }
  const sureTr = /\d+\s*[–-]\s*\d+\s*(saat|dakika|gün|hafta)|\b\d+\s*(saat|dakika|gün|hafta)\b|saatin altında|dakikalar içinde|aynı gün|saatler içinde|ilk haftada|ikinci ayda|günler alır/i;
  const sureEn = /\b\d+\s*[–-]\s*\d+\s*(hours?|minutes?|days?|weeks?)\b|\b\d+\s*(hours?|minutes?|days?|weeks?|months?)\b|under (one|an) hour|in (hours|minutes|days)|month two|\(days\)/i;
  const kutuTr = /saatler içinde|günler içinde|saatin altında|dakikalar içinde|aynı gün/i;
  const kutuEn = /\b(hours?|days?|minutes?|today)\b/i;
  for (const t of teshisData) {
    if (sureTr.test(t.kimCozer?.tr || '')) errors.push(`teşhis "${t.slug}" — "Kim çözer" (TR) süre içeriyor`);
    if (sureEn.test(t.kimCozer?.en || '')) errors.push(`teşhis "${t.slug}" — "Kim çözer" (EN) süre içeriyor`);
    for (const n of t.nedenler || []) {
      if (kutuTr.test([].concat(n.diyagramCozum?.tr || []).join(' '))) errors.push(`teşhis "${t.slug}" ${n.harf} — çözüm kutusu (TR) süre içeriyor`);
      if (kutuEn.test([].concat(n.diyagramCozum?.en || []).join(' '))) errors.push(`teşhis "${t.slug}" ${n.harf} — çözüm kutusu (EN) süre içeriyor`);
    }
  }
  if (errors.length > 0) {
    console.error(`\n[BUILD GUARD İÇERİK HATA] ${errors.length} kural ihlali:`);
    errors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  }
  console.log(`[BUILD GUARD İÇERİK GEÇTİ] ${yasakIfadeler.length} yasak ifade ${taranan.length} dosyada yok; ${teshisData.length} teşhiste "Kim çözer" ve çözüm kutuları süresiz.`);
}

verifyContentRules();

// ---------------------------------------------------------------------------
// [BUILD GUARD ŞEMA] Adım 89 — Yapısal veri (JSON-LD) sayfanın kendisiyle tutarlı olmalı.
// A) Her sayfanın JSON-LD'si ayrıştırılabilir olmalı.
// B) BreadcrumbList'in son öğesi sayfanın kendi adresi (canonical) olmalı.
// C) inLanguage taşıyan her düğüm sayfanın <html lang> diliyle aynı dilde olmalı.
// ---------------------------------------------------------------------------
function verifySchemaConsistency() {
  console.log('\n[BUILD GUARD ŞEMA] Yapısal veri tutarlılığı denetleniyor...');
  const errors = [];
  let sayfaSayisi = 0, dugumSayisi = 0;
  const denetle = (dosya) => {
    const h = fs.readFileSync(dosya, 'utf8');
    const canonical = (h.match(/rel="canonical" href="([^"]+)"/) || [])[1];
    const dil = ((h.match(/<html[^>]*lang="([^"]+)"/) || [])[1] || '').toLowerCase();
    if (!canonical) return;
    sayfaSayisi++;
    const yol = new URL(canonical).pathname;
    for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      let j;
      try { j = JSON.parse(m[1]); } catch (e) { errors.push(`${yol} — JSON-LD ayrıştırılamıyor`); continue; }
      for (const d of (j['@graph'] || [j])) {
        dugumSayisi++;
        if (d['@type'] === 'BreadcrumbList') {
          const liste = d.itemListElement || [];
          const son = liste[liste.length - 1];
          if (son && son.item && new URL(son.item).pathname !== yol) errors.push(`${yol} — breadcrumb son öğesi başka sayfa: ${son.item}`);
        }
        if (d.inLanguage && dil && ![].concat(d.inLanguage).some((x) => String(x).toLowerCase().startsWith(dil))) errors.push(`${yol} — ${d['@type']} inLanguage "${d.inLanguage}" sayfanın dili "${dil}" ile çelişiyor`);
      }
    }
  };
  const gez = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== 'assets') gez(p); } else if (e.name === 'index.html') denetle(p); } };
  gez(distDir);
  if (errors.length > 0) {
    console.error(`\n[BUILD GUARD ŞEMA HATA] ${errors.length} tutarsızlık:`);
    errors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  }
  console.log(`[BUILD GUARD ŞEMA GEÇTİ] ${sayfaSayisi} sayfada ${dugumSayisi} yapısal veri düğümü sayfanın adresi ve diliyle tutarlı.`);
}

verifySchemaConsistency();

// ---------------------------------------------------------------------------
// [BUILD GUARD FORM] Adım 91 — Formlar tek anahtarla gönderir, düğme yazdığı kanalı kullanır.
// A) Web3Forms adresi ve anahtarı yalnız src/utils/web3forms.js'de durur; başka dosya kendi anahtarını yazamaz
//    (eski anahtar 28 Ağustos'tan beri dört formda elle yazılıydı ve geçersizdi, hiçbir form e-posta göndermedi).
// B) Gönder düğmesinin (type="submit") etiketi WhatsApp diyemez: form e-posta gönderir (Mehmet'in kararı, 2026-09-25).
// C) E-posta gönderen işleyici WhatsApp açamaz: WhatsApp yalnız kendi düğmesinden açılır.
// D) Bot tuzağı (botcheck kutusu) olan form onu okumak zorunda (üç formda kutu vardı, hiç okunmuyordu).
// ---------------------------------------------------------------------------
function verifyFormRules() {
  console.log('\n[BUILD GUARD FORM] Form anahtarı ve düğme-kanal eşleşmesi denetleniyor...');
  const errors = [];
  const srcDir = path.join(__dirname, 'src');
  const anahtarDosyasi = path.join(srcDir, 'utils', 'web3forms.js');
  if (!fs.existsSync(anahtarDosyasi)) errors.push('src/utils/web3forms.js yok');
  else if (!/export const WEB3FORMS_KEY = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';/i.test(fs.readFileSync(anahtarDosyasi, 'utf8'))) errors.push('src/utils/web3forms.js — WEB3FORMS_KEY anahtar biçiminde değil');
  const yerel = ['tr', 'en'].map((dil) => JSON.parse(fs.readFileSync(path.join(srcDir, 'locales', `${dil}.json`), 'utf8')));
  const dosyalar = [];
  const gez = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) gez(p); else if (/\.jsx?$/.test(e.name)) dosyalar.push(p); } };
  gez(srcDir);
  let formSayisi = 0, dugmeSayisi = 0, tuzakSayisi = 0;
  for (const dosya of dosyalar) {
    if (dosya === anahtarDosyasi) continue;
    const ad = path.relative(__dirname, dosya);
    const s = fs.readFileSync(dosya, 'utf8');
    if (s.includes('api.web3forms.com')) errors.push(`${ad} — Web3Forms adresi elle yazılmış (WEB3FORMS_URL kullanılmalı)`);
    if (/access_key\s*:\s*['"`]/.test(s)) errors.push(`${ad} — form anahtarı elle yazılmış (WEB3FORMS_KEY kullanılmalı)`);
    for (const m of s.matchAll(/fetch\(WEB3FORMS_URL[\s\S]*?finally\s*\{/g)) {
      formSayisi++;
      if (/window\.open|wa\.me/.test(m[0])) errors.push(`${ad} — e-posta gönderen işleyici WhatsApp açıyor`);
    }
    for (let i = s.indexOf('type="submit"'); i >= 0; i = s.indexOf('type="submit"', i + 1)) {
      const bas = s.lastIndexOf('<button', i), son = s.indexOf('</button>', i);
      if (bas < 0 || son < 0) continue;
      dugmeSayisi++;
      const blok = s.slice(bas, son);
      const etiketler = [...blok.matchAll(/'([^']*)'/g)].map((x) => x[1]);
      for (const k of blok.matchAll(/\bt\(\s*['"]([^'"]+)['"]\s*\)/g)) yerel.forEach((y) => etiketler.push(String(y[k[1]] || '')));
      if (etiketler.some((x) => /whatsapp/i.test(x))) errors.push(`${ad} — gönder düğmesi WhatsApp diyor ama form e-posta gönderiyor`);
    }
    if (s.includes('name="botcheck"')) {
      tuzakSayisi++;
      if (!/(formData|elements)\.botcheck\b/.test(s)) errors.push(`${ad} — bot tuzağı kutusu var ama gönderimde okunmuyor`);
    }
  }
  if (formSayisi === 0) errors.push('Web3Forms ile gönderen form bulunamadı (WEB3FORMS_URL kullanılmıyor)');
  if (errors.length > 0) {
    console.error(`\n[BUILD GUARD FORM HATA] ${errors.length} kural ihlali:`);
    errors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  }
  console.log(`[BUILD GUARD FORM GEÇTİ] ${formSayisi} form tek anahtar dosyasından gönderiyor ve WhatsApp açmıyor; ${dugmeSayisi} gönder düğmesinin hiçbiri WhatsApp demiyor; ${tuzakSayisi} bot tuzağının hepsi okunuyor.`);
}

verifyFormRules();

// ---------------------------------------------------------------------------
// [BUILD GUARD HIZ] Adım 92 — Açılışta sayfa kayması (CLS) geri gelmesin.
// A) Her sayfa kendi kodunu <link rel="modulepreload"> ile ana paketle aynı anda indirir (teşhis sayfası verisini de); dosyalar vardır.
// B) React ilk çizimi sayfanın kodu (ve teşhis verisi) hazır olunca yapar; iskelet → içerik geçişi alt bilgiyi kaydırıyordu.
//    main.jsx ilkSayfayiHazirla()'yı bekler, App.jsx sayfaları sayfa() ile tanımlar, TeshisDetay yükleme iskeleti taşımaz.
// C) Serif ve mono yığınlarında web fontundan hemen sonra ölçüleri eşitlenmiş yedek yüz gelir; derlenmiş CSS'te size-adjust vardır.
// ---------------------------------------------------------------------------
function verifySpeedRules() {
  console.log('\n[BUILD GUARD HIZ] Açılış kayması kuralları denetleniyor...');
  const errors = [];
  let sayfa = 0, tumSayfa = 0;
  const ortak = /\/(rolldown-runtime|vendor-[a-z]+)-[A-Za-z0-9_-]{8}\.js$/;
  const gezHtml = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== 'assets') gezHtml(p); } else if (e.name === 'index.html') {
    const h = fs.readFileSync(p, 'utf8');
    const yol = '/' + path.relative(distDir, path.dirname(p)).split(path.sep).join('/') + '/';
    if (!/rel="canonical"/.test(h)) return;
    tumSayfa++;
    const kendi = [...h.matchAll(/<link rel="modulepreload" crossorigin href="([^"]+)">/g)].map((m) => m[1]).filter((u) => !ortak.test(u));
    if (kendi.length === 0) errors.push(`${yol.replace('//', '/')} — sayfanın kendi kodu ön-yüklenmiyor`);
  } } };
  gezHtml(distDir);
  for (const kok of ['teshis', 'diagnostic']) {
    const d = path.join(distDir, kok);
    if (!fs.existsSync(d)) continue;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      const f = path.join(d, e.name, 'index.html');
      if (!fs.existsSync(f)) continue;
      sayfa++;
      const h = fs.readFileSync(f, 'utf8');
      const onYukle = [...h.matchAll(/<link rel="modulepreload" crossorigin href="([^"]+)">/g)].map((m) => m[1]);
      const kod = onYukle.find((u) => /\/TeshisDetay-[A-Za-z0-9_-]{8}\.js$/.test(u));
      const veri = onYukle.find((u) => new RegExp(`/${e.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-[A-Za-z0-9_-]{8}\\.js$`).test(u));
      if (!kod) errors.push(`/${kok}/${e.name}/ — teşhis sayfa kodu ön-yüklenmiyor`);
      if (!veri) errors.push(`/${kok}/${e.name}/ — teşhis verisi ön-yüklenmiyor`);
      for (const u of onYukle) if (!fs.existsSync(path.join(distDir, u))) errors.push(`/${kok}/${e.name}/ — ön-yüklenen dosya yok: ${u}`);
    }
  }
  if (sayfa !== teshisData.length * 2) errors.push(`teşhis sayfası ${sayfa} (beklenen ${teshisData.length * 2})`);
  const detay = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'TeshisDetay.jsx'), 'utf8');
  if (!detay.includes('use(teshisOku(slug))') || !detay.includes('export const hazirla') || /setLoading\(|useState\(true\)/.test(detay)) errors.push('TeshisDetay.jsx — teşhis verisi Suspense ile okunmuyor ya da yükleme iskeleti geri gelmiş');
  const anaGiris = fs.readFileSync(path.join(__dirname, 'src', 'main.jsx'), 'utf8');
  if (!/ilkSayfayiHazirla\(\)\.then\(\(\) => \{\s*createRoot/.test(anaGiris)) errors.push('main.jsx — React ilk çizimi sayfanın kodunu beklemiyor (ilkSayfayiHazirla)');
  const uygulama = fs.readFileSync(path.join(__dirname, 'src', 'App.jsx'), 'utf8');
  if (/\blazy\(/.test(uygulama) || !/= sayfa\('/.test(uygulama)) errors.push('App.jsx — sayfalar sayfa() yerine doğrudan lazy() ile tanımlanmış');
  const css = fs.readFileSync(path.join(__dirname, 'src', 'index.css'), 'utf8');
  if (!css.includes('--font-serif: "Source Serif 4", "Source Serif 4 Yedek",')) errors.push('index.css — serif yığınında web fontundan sonra "Source Serif 4 Yedek" yok');
  if (!css.includes('--font-mono: "IBM Plex Mono", "IBM Plex Mono Yedek",')) errors.push('index.css — mono yığınında web fontundan sonra "IBM Plex Mono Yedek" yok');
  const derlenmis = fs.readdirSync(path.join(distDir, 'assets')).filter((x) => x.endsWith('.css')).map((x) => fs.readFileSync(path.join(distDir, 'assets', x), 'utf8')).join('\n');
  if (!/Source Serif 4 Yedek/.test(derlenmis) || !/size-adjust/.test(derlenmis)) errors.push('derlenmiş CSS — yedek font yüzü ya da size-adjust yok');
  if (errors.length > 0) {
    console.error(`\n[BUILD GUARD HIZ HATA] ${errors.length} kural ihlali:`);
    errors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  }
  console.log(`[BUILD GUARD HIZ GEÇTİ] ${tumSayfa} sayfa kendi kodunu ön-yüklüyor (${sayfa} teşhis sayfası verisini de); React ilk çizimde sayfanın kodunu bekliyor; yedek font yüzleri yerinde.`);
}

verifySpeedRules();

// ---------------------------------------------------------------------------
// [BUILD GUARD ERİŞİM] Adım 93 — Düğmenin içinde başlık olmaz.
// Düğmenin içeriği ekran okuyucuya tek bir metin olarak okunur; içindeki başlık, başlık listesinde görünmez.
// Başlık gerekiyorsa düğmeyi sarar (SSS akordeonu: <h3><button …>); seçenek kartındaki ad span olur (Adım 90, 93).
// ---------------------------------------------------------------------------
function verifyAccessibilityRules() {
  console.log('\n[BUILD GUARD ERİŞİM] Düğme içi başlık denetleniyor...');
  const errors = [];
  let dugme = 0;
  const gez = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) gez(p); else if (/\.jsx$/.test(e.name)) {
    const s = fs.readFileSync(p, 'utf8');
    for (let i = s.indexOf('<button'); i >= 0; i = s.indexOf('<button', i + 1)) {
      const son = s.indexOf('</button>', i);
      if (son < 0) continue;
      dugme++;
      const m = s.slice(i, son).match(/<h[1-6][\s>]/);
      if (m) errors.push(`${path.relative(__dirname, p)}:${s.slice(0, i).split('\n').length} — düğmenin içinde ${m[0].trim()} başlığı`);
    }
  } } };
  gez(path.join(__dirname, 'src'));
  if (errors.length > 0) {
    console.error(`\n[BUILD GUARD ERİŞİM HATA] ${errors.length} kural ihlali:`);
    errors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  }
  console.log(`[BUILD GUARD ERİŞİM GEÇTİ] ${dugme} düğmenin hiçbirinde başlık yok.`);
}

verifyAccessibilityRules();

// ---------------------------------------------------------------------------
// [BUILD GUARD ANA SAYFA] Adım 94 — Arama dizini, ana sayfa bağlantıları, çapalar ve Tanıtım
// ---------------------------------------------------------------------------
function verifyAnaSayfaGuard() {
  console.log('\n[BUILD GUARD ANA SAYFA] Ana sayfa ve arama dizini kuralları denetleniyor...');
  const errors = [];

  // 1. Arama dizini kontrolü
  const dizinPath = path.join(distDir, 'arama-dizini.json');
  if (!fs.existsSync(dizinPath)) {
    errors.push('dist/arama-dizini.json bulunamadı');
  } else {
    let dizin = [];
    try {
      dizin = JSON.parse(fs.readFileSync(dizinPath, 'utf8'));
    } catch (e) {
      errors.push('dist/arama-dizini.json JSON formatında değil: ' + e.message);
    }

    const smPath = path.join(distDir, 'sitemap.xml');
    const smContent = fs.readFileSync(smPath, 'utf8');
    const smUrls = [...smContent.matchAll(/<loc>https:\/\/trendmasterakademi\.com([^<]*)<\/loc>/g)].map(m => m[1]);

    if (dizin.length !== smUrls.length) {
      errors.push(`Arama dizininde ${dizin.length} sayfa var, site haritasında ${smUrls.length} bekleniyordu`);
    }

    const dizinUrls = new Set(dizin.map(d => d.url));
    if (dizinUrls.size !== dizin.length) {
      errors.push(`Arama dizininde tekrarlanan adresler var (${dizin.length - dizinUrls.size} tekrar)`);
    }

    for (const url of smUrls) {
      if (!dizinUrls.has(url)) {
        errors.push(`Site haritasındaki ${url} arama dizininde yok`);
      }
    }

    const validKategoriler = ['anasayfa', 'acil', 'teshis', 'araclar', 'ajans', 'vaka', 'sozluk', 'kurumsal'];
    for (const d of dizin) {
      if (!d.baslik || typeof d.baslik !== 'string' || d.baslik.trim().length === 0) {
        errors.push(`${d.url} kaydının başlığı boş`);
      }
      if (!d.metin || typeof d.metin !== 'string' || d.metin.trim().length < 20) {
        errors.push(`${d.url} kaydının metni yetersiz (${d.metin ? d.metin.length : 0} karakter)`);
      }
      const beklenenDil = getDil(d.url);
      if (d.dil !== beklenenDil) {
        errors.push(`${d.url} dil alanı '${d.dil}', beklenen '${beklenenDil}'`);
      }
      const beklenenKat = getKategori(d.url);
      if (d.kategori !== beklenenKat || !validKategoriler.includes(d.kategori)) {
        errors.push(`${d.url} kategori alanı '${d.kategori}', beklenen '${beklenenKat}'`);
      }
    }
  }

  // 2. Ana sayfa ön-render bağlantıları kontrolü
  const anaHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(anaHtmlPath)) {
    errors.push('dist/index.html bulunamadı');
  } else {
    const anaHtml = fs.readFileSync(anaHtmlPath, 'utf8');
    const anaLinkler = new Set([...anaHtml.matchAll(/href="(\/[^"#?]*)"/g)].map(m => m[1]));
    const trOrtakPages = getPagesForLang('tr');
    const eksikLinkler = trOrtakPages.filter(p => !anaLinkler.has(p.url));
    if (eksikLinkler.length > 0) {
      errors.push(`Ana sayfa ön-render'ında ${eksikLinkler.length} sayfa bağlantısı eksik: ${eksikLinkler.map(p => p.url).slice(0, 5).join(', ')}`);
    }
  }

  // 3. Eski ana sayfa çapaları kontrolü (/#contact, /#faq, vb.)
  const scanFiles = [];
  const walk = (d) => {
    if (!fs.existsSync(d)) return;
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) {
        if (ent.name !== 'assets' || d === distDir) walk(p);
      } else if (/\.(jsx?|json|html)$/.test(ent.name)) {
        scanFiles.push(p);
      }
    }
  };
  walk(path.join(__dirname, 'src'));
  walk(distDir);

  const capaRegex = /["'`]\/#(contact|faq|services|founder|cases|terminal|hero|agency-preview)["'`]/;
  for (const f of scanFiles) {
    const content = fs.readFileSync(f, 'utf8');
    if (capaRegex.test(content)) {
      errors.push(`${path.relative(__dirname, f)} içinde eski ana sayfa çapası tespit edildi`);
    }
  }

  // 4. Tanıtım sayfası kontrolü
  const tanitimHtmlPath = path.join(distDir, 'tanitim', 'index.html');
  if (!fs.existsSync(tanitimHtmlPath)) {
    errors.push('dist/tanitim/index.html bulunamadı');
  } else {
    const tanitimHtml = fs.readFileSync(tanitimHtmlPath, 'utf8');
    const h1Match = tanitimHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const tanitimH1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
    if (!tanitimH1.includes('Kritik Sistem Kesintileri')) {
      errors.push(`Tanıtım sayfası H1 başlığı eski ana sayfa H1'i ile uyuşmuyor: "${tanitimH1}"`);
    }
  }

  // 5. Adım 95–96: Ana sayfa HTML denetimi (sade şablon ssr-pre-render yok, akış işaretleri yok, combobox var, ilk sahne fotoğrafı var)
  if (fs.existsSync(anaHtmlPath)) {
    const anaHtml = fs.readFileSync(anaHtmlPath, 'utf8');
    if (anaHtml.includes('ssr-pre-render')) {
      errors.push("Ana sayfa HTML'inde sade şablon (ssr-pre-render) bulundu");
    }
    if (anaHtml.includes('<!--$?-->') || anaHtml.includes('hidden id="S:')) {
      errors.push("Ana sayfa HTML'inde React akış işaretleri (<!--$?-->, hidden id=\"S:\") bulundu");
    }
    const mainMatch = (anaHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/) || [, ''])[1];
    if (mainMatch.includes('animate-pulse')) {
      errors.push("Ana sayfa <main> içinde animate-pulse yükleme iskeleti bulundu");
    }
    if (!/role="combobox"/.test(mainMatch)) {
      errors.push("Ana sayfa <main> içinde arama kutusu (role=\"combobox\") bulunamadı");
    }
    if (!/<source[^>]+media="[^"]*(portrait|aspect-ratio)[^"]*"[^>]+dikey-/.test(anaHtml)) {
      errors.push("Ana sayfa HTML'inde dikey fotoğraf media sorgusu bulunamadı");
    }
    if (!/\/arka-plan\/[^"')\s]+\.(avif|webp)/.test(anaHtml)) {
      errors.push("Ana sayfa HTML'inde ilk sahnenin fotoğrafı bulunamadı");
    }
  }

  // 6. Adım 95: Arama dizininde sitenin ortak menü metni bulunmamalı
  if (fs.existsSync(dizinPath)) {
    try {
      const dizin = JSON.parse(fs.readFileSync(dizinPath, 'utf8'));
      const MENU_STRINGS = [
        'Kurtarılabilirlik İndeksi Post-Mortem ve Kök Neden Arşivi Triyaj Simülatörü',
        'Salvageability Index Post-Mortem & RCA Triage Simulator',
        'Ana Sayfa Hizmetler ve Çalışma Modeli Kapasite & Altyapı'
      ];
      for (const d of dizin) {
        for (const m of MENU_STRINGS) {
          if ((d.metin || '').includes(m)) {
            errors.push(`${d.url} arama dizini kaydında sitenin ortak menü metni bulundu: "${m}"`);
          }
        }
      }
    } catch (e) {}
  }

  // 7. Adım 95–96: kaynaklar.json ve stok fotoğraf denetimi (yatay + dikey kırpımlar, 350 KB sınırı)
  const kaynaklarPath = path.join(distDir, 'arka-plan', 'kaynaklar.json');
  if (!fs.existsSync(kaynaklarPath)) {
    errors.push('dist/arka-plan/kaynaklar.json bulunamadı');
  } else {
    let kaynaklar = [];
    try {
      kaynaklar = JSON.parse(fs.readFileSync(kaynaklarPath, 'utf8'));
    } catch (e) {
      errors.push('dist/arka-plan/kaynaklar.json JSON formatında değil: ' + e.message);
    }
    if (kaynaklar.length < 4) {
      errors.push(`kaynaklar.json içinde en az 4 fotoğraf bekleniyor, bulunan: ${kaynaklar.length}`);
    }
    const LISANS = { 'unsplash.com': 'Unsplash License', 'pexels.com': 'Pexels License' };
    const arkaPlanDir = path.join(distDir, 'arka-plan');
    const gorseller = fs.existsSync(arkaPlanDir) ? fs.readdirSync(arkaPlanDir).filter(f => /\.(avif|webp)$/i.test(f)) : [];

    for (const k of kaynaklar) {
      let host = '';
      try { host = new URL(k.kaynak).hostname.replace(/^www\./, ''); } catch (e) {}
      if (!LISANS[host] || k.lisans !== LISANS[host] || !k.fotografci || !k.dosya || !k.sahne) {
        errors.push(`kaynaklar.json kaydı geçersiz veya lisansı uyuşmuyor: ${JSON.stringify(k)}`);
      }
      for (const w of [1280, 1920, 2560]) {
        for (const ext of ['avif', 'webp']) {
          const p = path.join(arkaPlanDir, `${k.dosya}-${w}.${ext}`);
          if (!fs.existsSync(p)) errors.push(`Yatay dosya eksik: ${k.dosya}-${w}.${ext}`);
        }
      }
      for (const w of [720, 1080, 1440]) {
        for (const ext of ['avif', 'webp']) {
          const p = path.join(arkaPlanDir, `${k.dosya}-dikey-${w}.${ext}`);
          if (!fs.existsSync(p)) errors.push(`Dikey dosya eksik: ${k.dosya}-dikey-${w}.${ext}`);
        }
      }
    }

    const buyukDosyalar = gorseller.filter(f => fs.statSync(path.join(arkaPlanDir, f)).size > 350 * 1024);
    if (buyukDosyalar.length > 0) {
      errors.push(`350 KB sınırını aşan arka plan fotoğrafları tespit edildi: ${buyukDosyalar.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    console.error(`\n[BUILD GUARD ANA SAYFA HATA] ${errors.length} kural ihlali:`);
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log('[BUILD GUARD ANA SAYFA GEÇTİ] 125 sayfa arama dizininde ve bir kategoride; ana sayfa 66 sayfaya bağlanıyor; eski ana sayfa çapası yok; sade şablon yok; combobox ve lisanslı stok fotoğraflar doğrulandı.');
}

verifyAnaSayfaGuard();
