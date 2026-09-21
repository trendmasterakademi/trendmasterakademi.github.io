import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { glossaryTerms } from './src/data/glossaryData.js';
import { teshisData } from './src/data/teshisData.js';
import { postMortems, postMortemDisclosure } from './src/data/postMortemData.js';
import { triageScenarios } from './src/data/triageData.js';
import { slaTiers, coreCommitments, slaScope, slaMetaDesc } from './src/data/slaData.js';
import { techStackData } from './src/data/techStackData.js';
import { ndaData } from './src/data/ndaData.js';
import { ndaFullAgreementData } from './src/data/ndaFullAgreementData.js';
import { outageSimulatorData } from './src/data/outageSimulatorData.js';
import { radarData } from './src/data/radarData.js';
import { codeHealthData } from './src/data/codeHealthData.js';
import { rescueRoiData } from './src/data/rescueRoiData.js';
import { seoData } from './src/data/seoData.js';

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

// 3.5 — Veri Kaynağı Sapma Kontrolü (teshisData.js vs src/data/teshis/<slug>.js)
for (const item of teshisData) {
  const singleFilePath = path.join(__dirname, 'src', 'data', 'teshis', `${item.slug}.js`);
  if (fs.existsSync(singleFilePath)) {
    try {
      const singleModule = await import(`./src/data/teshis/${item.slug}.js`);
      const singleData = singleModule.default;
      const diffFields = [];
      const keys = Array.from(new Set([...Object.keys(item), ...Object.keys(singleData)]));
      for (const k of keys) {
        if (JSON.stringify(item[k]) !== JSON.stringify(singleData[k])) {
          diffFields.push(k);
        }
      }
      if (diffFields.length > 0) {
        console.warn(`UYARI: teshisData.js ile src/data/teshis/${item.slug}.js farklı — alanlar: ${diffFields.join(', ')}`);
      }
    } catch (err) {
      console.warn(`UYARI: src/data/teshis/${item.slug}.js yüklenemedi: ${err.message}`);
    }
  }
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
    "jobTitle": "Founder & Lead Engineer",
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
  "inLanguage": ["tr-TR"]
};

// 2.1 — /teshis/ Katalog Hub'ı İçeriği (20 Teşhis)
const teshisHubExtraContent = `
  <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
    <h2 class="text-xl font-bold text-[var(--ink)]">Yayınlanmış arıza kataloğu — 20 teşhis</h2>
    <ul class="space-y-4">
      ${teshisData.map(item => {
        const firstSentence = item.ozet?.tr ? (item.ozet.tr.split('.')[0] + '.') : '';
        return `
        <li class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <a href="/teshis/${escapeHtml(item.slug)}/" class="text-[var(--accent)] font-bold hover:underline font-mono text-base">→ ${escapeHtml(item.no)} · ${escapeHtml(item.baslik?.tr || '')}</a>
            <span class="text-xs font-mono text-[var(--ink-muted)]">${escapeHtml(item.aciliyet?.etiket?.tr || '')} · ${escapeHtml(item.kirinti?.tr || '')}</span>
          </div>
          <p class="text-sm text-[var(--ink-muted)] leading-relaxed">${escapeHtml(firstSentence)}</p>
        </li>`;
      }).join('\n      ')}
    </ul>
  </section>
`;

const teshisHubExtraContentEn = `
  <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
    <h2 class="text-xl font-bold text-[var(--ink)]">Published Incident Catalog — 20 Diagnoses</h2>
    <ul class="space-y-4">
      ${teshisData.map(item => {
        const firstSentence = item.ozet?.en ? (item.ozet.en.split('.')[0] + '.') : '';
        return `
        <li class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <a href="/diagnostic/${escapeHtml(item.slug)}/" class="text-[var(--accent)] font-bold hover:underline font-mono text-base">→ ${escapeHtml(item.no)} · ${escapeHtml(item.baslik?.en || item.baslik?.tr || '')}</a>
            <span class="text-xs font-mono text-[var(--ink-muted)]">${escapeHtml(item.aciliyet?.etiket?.en || '')} · ${escapeHtml(item.kirinti?.en || '')}</span>
          </div>
          <p class="text-sm text-[var(--ink-muted)] leading-relaxed">${escapeHtml(firstSentence)}</p>
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
            <span class="text-xs font-mono text-amber-700">${escapeHtml(term.urgencyLevel || '')}</span>
          </div>
          <p class="text-sm text-[var(--ink-muted)] leading-relaxed">${escapeHtml(firstSentence)}</p>
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
            <span class="text-xs font-mono text-amber-700">${escapeHtml(term.urgencyLevelEn || term.urgencyLevel || '')}</span>
          </div>
          <p class="text-sm text-[var(--ink-muted)] leading-relaxed">${escapeHtml(firstSentence)}</p>
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
          <p class="text-[var(--ink-muted)] leading-relaxed text-sm sm:text-base">${escapeHtml(item.answer?.tr || '')}</p>
        </div>
      `).join('\n      ')}
    </div>
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
          <div class="text-[var(--ink-muted)]"><code>${escapeHtml(entry.log)}</code></div>
          <div><a href="/teshis/${escapeHtml(slug)}/" class="text-[var(--accent)] hover:underline font-bold">→ ${escapeHtml(titleText)}</a></div>
        </li>`;
      }).join('\n      ')}
    </ul>
    <p class="pt-2">
      <a href="/teshis/" class="text-[var(--accent)] hover:underline font-bold">Tüm teşhis kataloğunu inceleyin (20 belirti) →</a>
    </p>
  </section>
  ${homeFaqHtml}
`;

const aboutExtraContent = `
  <section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6">
    <h2 class="text-2xl font-bold text-[var(--ink)] tracking-tight">Altı Temel Taahhüdümüz</h2>
    <p class="text-[var(--ink-muted)] leading-relaxed">Ajanslarla çalışırken taviz vermediğimiz altı kural:</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
      ${coreCommitments.map(c => `
      <div class="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-lg font-bold text-[var(--accent)]">${escapeHtml(c.no)} · ${escapeHtml(c.title?.tr || '')}</h3>
        <p class="text-[var(--ink-muted)] text-sm leading-relaxed">${escapeHtml(c.desc?.tr || '')}</p>
        ${c.no === '02' ? '<p class="pt-2"><a href="/nda/" class="text-[var(--accent)] hover:underline font-bold font-mono text-xs">Sözleşmeyi okuyun →</a></p>' : ''}
      </div>`).join('\n      ')}
    </div>
    <p class="text-[var(--ink-muted)] text-sm pt-2">
      Trend Master Akademi adı nereden geliyor? <a href="/hikayemiz/" class="text-[var(--accent)] hover:underline font-bold">Kuruluş hikâyemizi okuyun →</a>
    </p>
  </section>
`;

const storyExtraContent = `
  <section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6 text-[var(--ink-muted)] leading-relaxed">
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
  <section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6 text-[var(--ink-muted)] leading-relaxed">
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

const kesintiExtraContent = `
  <section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6">
    <h2 class="text-2xl font-bold text-[var(--ink)] tracking-tight">Kesinti Maliyeti Nasıl Hesaplanır?</h2>
    <p class="text-[var(--ink-muted)] leading-relaxed">Bir web sitesi veya e-ticaret altyapısı çöktüğünde oluşan doğrudan ciro kaybı şeffaf bir matematiksel formüle dayanır:</p>
    
    <div class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] font-mono text-sm text-[var(--accent)] space-y-2">
      <p>Saatlik Ciro Kaybı = (Aylık Ciro / 720 Saat) × Zaman Çarpanı</p>
      <p>Toplam Kesinti Maliyeti = Saatlik Kayıp × Kesinti Süresi (Saat)</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
      <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)]">
        <h3 class="text-sm font-bold text-[var(--ink)]">Zirve Saat (Peak)</h3>
        <p class="text-xs text-[var(--ink-muted)] mt-1">2.0x Çarpan · Kampanya veya yoğun ziyaret saatleri.</p>
      </div>
      <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)]">
        <h3 class="text-sm font-bold text-[var(--ink)]">Normal Saat</h3>
        <p class="text-xs text-[var(--ink-muted)] mt-1">1.0x Çarpan · Günlük standart trafik akışı.</p>
      </div>
      <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)]">
        <h3 class="text-sm font-bold text-[var(--ink)]">Gece Saati</h3>
        <p class="text-xs text-[var(--ink-muted)] mt-1">0.5x Çarpan · Düşük trafik ve işlem hacmi.</p>
      </div>
    </div>

    <p class="text-[var(--ink-muted)] text-sm leading-relaxed">Doğrudan kayba ek olarak; Google reklam bütçesi israfı, arama motoru sıralama kaybı (SERP cezası) ve müşteri güven kaybı gibi dolaylı maliyetler genellikle doğrudan ciro kaybının 2 ila 3 katına ulaşır.</p>
  </section>
`;

const kesintiExtraContentEn = `
  <section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6">
    <h2 class="text-2xl font-bold text-[var(--ink)] tracking-tight">How Downtime Cost is Calculated</h2>
    <p class="text-[var(--ink-muted)] leading-relaxed">When an e-commerce platform or client API experiences an outage, direct lost revenue follows a transparent mathematical formula:</p>
    
    <div class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] font-mono text-sm text-[var(--accent)] space-y-2">
      <p>Hourly Revenue Loss = (Monthly Revenue / 720 Hours) x Traffic Multiplier</p>
      <p>Total Downtime Cost = Hourly Loss x Outage Duration (Hours)</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
      <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)]">
        <h3 class="text-sm font-bold text-[var(--ink)]">Peak Hours</h3>
        <p class="text-xs text-[var(--ink-muted)] mt-1">2.0x Multiplier · Campaign blasts or peak user checkout traffic.</p>
      </div>
      <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)]">
        <h3 class="text-sm font-bold text-[var(--ink)]">Standard Hours</h3>
        <p class="text-xs text-[var(--ink-muted)] mt-1">1.0x Multiplier · Regular daytime business operations.</p>
      </div>
      <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)]">
        <h3 class="text-sm font-bold text-[var(--ink)]">Off-Peak / Night</h3>
        <p class="text-xs text-[var(--ink-muted)] mt-1">0.5x Multiplier · Low traffic volume and background processing.</p>
      </div>
    </div>

    <p class="text-[var(--ink-muted)] text-sm leading-relaxed">Beyond direct checkout losses; burned advertising spend, search engine ranking degradation (SERP penalties), and damaged client trust often total 2x to 3x the direct revenue loss.</p>
  </section>
`;

const sosPageExtraContent = `
  <section class="space-y-6">
    <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
      <span>Kriz hattı her gün 09:00 – 24:00 açık · canlı kesintilerde ilk yanıt taahhüdü 15 dakika.</span>
    </div>
    <div class="flex flex-wrap gap-4 text-sm font-semibold">
      <a href="tel:+905343713573" class="text-[var(--accent)] hover:underline">+90 534 371 35 73</a>
      <a href="https://wa.me/905343713573" target="_blank" rel="noopener" class="text-emerald-700 hover:underline">WhatsApp'tan yaz</a>
    </div>
    <div class="space-y-3">
      <h2 class="text-xl font-bold text-[var(--ink)]">Yazarken şunları ekleyin</h2>
      <ol class="list-decimal list-inside space-y-2 text-[var(--ink-muted)]">
        <li>Ajans adı ve size ulaşılacak numara</li>
        <li>Ne oldu: hata ekranı, hata satırı ya da sistemin davranışı</li>
        <li>Ne zaman başladı ve o sırada ne değişti (yayın, güncelleme, ödeme sağlayıcı)</li>
        <li>Erişim var mı: sunucu, repo, panel — yoksa da yazın, teşhis için şart değil</li>
      </ol>
      <p class="text-sm text-[var(--ink-muted)] italic">İlk teşhis için şifre ya da repo erişimi istemiyoruz.</p>
    </div>
    <div class="space-y-3 pt-4 border-t border-[var(--rule)]">
      <h2 class="text-xl font-bold text-[var(--ink)]">Aciliyet yoksa</h2>
      <ul class="space-y-2 text-[var(--ink-muted)]">
        <li><a href="/crash-test/" class="text-[var(--accent)] hover:underline">60 saniyelik Agency Crash Test ile durumu kendiniz teşhis edin</a></li>
        <li><a href="/teshis/" class="text-[var(--accent)] hover:underline">20 arızanın belgelenmiş teşhis kataloğu</a></li>
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
          <p class="text-[var(--ink-muted)] text-sm leading-relaxed">${escapeHtml(sq.quote?.tr || '')}</p>
        </article>`).join('\n        ')}
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="text-xl font-bold text-[var(--ink)]">Teknik yetkinlikler</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${capabilities.map(cap => `
        <article class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-1">
          <h3 class="text-sm font-bold text-[var(--accent)] font-mono">${escapeHtml(cap.title?.tr || '')} · ${escapeHtml(cap.cat || '')}</h3>
          <p class="text-[var(--ink-muted)] text-xs leading-relaxed">${escapeHtml(cap.desc?.tr || '')}</p>
        </article>`).join('\n        ')}
      </div>
    </div>
  </section>
`;

const crashTestExtraContent = `
  <section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono">
      <div><strong class="text-[var(--ink)] block text-sm">60 Saniye</strong> Ortalama test süresi</div>
      <div><strong class="text-emerald-700 block text-sm">0 Erişim</strong> Şifre veya repo erişimi istemez</div>
      <div><strong class="text-[var(--accent)] block text-sm">1 Teşhis</strong> Doğrudan arıza kataloğu eşleşmesi ve eylem reçetesi</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Testin kapsadığı beş kriz senaryosu</h2>
    <div class="space-y-4">
      ${scenarios.map(sc => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span class="text-[var(--accent)] font-bold">${escapeHtml(sc.tag?.tr || '')}</span>
          <span class="text-[var(--ink-muted)]">${escapeHtml(sc.code || '')}</span>
        </div>
        <h3 class="text-lg font-bold text-[var(--ink)]">${escapeHtml(sc.title?.tr || '')}</h3>
        <p class="text-[var(--ink-muted)] text-sm leading-relaxed">${escapeHtml(sc.subtitle?.tr || '')}</p>
        <div class="space-y-1 pt-1 border-t border-[var(--rule)]">
          <p class="text-xs font-semibold text-[var(--ink-muted)] font-mono">Senaryoda değerlendirilen sorular:</p>
          <ul class="list-disc list-inside space-y-1 text-xs text-[var(--ink-muted)] font-mono">
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
    <h2 class="text-xl font-bold text-[var(--ink)]">Kontrol edilen 12 kalem</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${handoverItems.map(item => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">${escapeHtml(item.title?.tr || '')}</h3>
        <p class="text-[var(--ink-muted)] text-sm leading-relaxed">${escapeHtml(item.desc?.tr || '')}</p>
        <p class="text-xs font-mono text-[var(--ink-muted)]">Ağırlık: ${escapeHtml(item.weight)} puan</p>
      </article>`).join('\n      ')}
    </div>
  </section>
`;

const devirExtraContentEn = `
  <section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6">
    <h2 class="text-xl font-bold text-[var(--ink)]">12 Critical Checkpoints Audited</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${handoverItems.map(item => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">${escapeHtml(item.title?.en || item.title?.tr || '')}</h3>
        <p class="text-[var(--ink-muted)] text-sm leading-relaxed">${escapeHtml(item.desc?.en || item.desc?.tr || '')}</p>
        <p class="text-xs font-mono text-[var(--ink-muted)]">Weight: ${escapeHtml(item.weight)} points</p>
      </article>`).join('\n      ')}
    </div>
  </section>
`;

const ndaExtraContent = `
  <section class="space-y-12 mt-8 border-t border-[var(--rule)] pt-8">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--rule)]">
      <div>
        <h2 class="text-xl font-bold text-[var(--ink)] font-serif">Gizlilik ve Çalışma Sözleşmesi (16 Madde)</h2>
        <p class="text-xs text-[var(--ink-muted)] font-mono mt-1">Resmi B2B Karşılıklı Gizlilik ve Çalışma Sözleşmesi Tam Metni</p>
      </div>
      <a href="/sozlesme/tma-gizlilik-ve-calisma-sozlesmesi.pdf" download="tma-gizlilik-ve-calisma-sozlesmesi.pdf" class="inline-flex items-center justify-center px-4 py-2.5 rounded bg-[var(--accent)] text-white font-semibold text-xs hover:opacity-90 transition-opacity">
        Sözleşmeyi PDF Olarak İndir
      </a>
    </div>

    <!-- Bölüm 1: Size ne sağlıyor -->
    <section class="space-y-6">
      <h2 class="text-2xl font-serif font-semibold text-[var(--ink)] border-b border-[var(--rule)] pb-4">
        Size Ne Sağlıyor?
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${ndaFullAgreementData.whatItGivesYou.map(item => `
          <div class="p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
            <h3 class="text-base font-semibold font-serif text-[var(--ink)]">${escapeHtml(item.title.tr)}</h3>
            <p class="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">${escapeHtml(item.desc.tr)}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Bölüm 2: Bizi ne koruyor -->
    <section class="space-y-6">
      <h2 class="text-2xl font-serif font-semibold text-[var(--ink)] border-b border-[var(--rule)] pb-4">
        Bizi Ne Koruyor?
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${ndaFullAgreementData.protectsUsToo.map(item => `
          <div class="p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
            <h3 class="text-base font-semibold font-serif text-[var(--ink)]">${escapeHtml(item.title.tr)}</h3>
            <p class="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">${escapeHtml(item.desc.tr)}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Bölüm 3: 16 Maddelik Sözleşme Metni -->
    <section class="space-y-6">
      <h2 class="text-2xl font-serif font-semibold text-[var(--ink)] border-b border-[var(--rule)] pb-4">
        Sözleşme Maddeleri (16 Madde)
      </h2>
      <div class="space-y-6 text-sm text-[var(--ink-muted)] leading-relaxed">
        ${ndaFullAgreementData.clauses.map(clause => `
          <article class="p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-3">
            <h3 class="text-base font-bold text-[var(--ink)] font-serif">${escapeHtml(clause.title)}</h3>
            ${clause.paragraphs.map(p => `<p class="leading-relaxed">${escapeHtml(p)}</p>`).join('')}
          </article>
        `).join('')}
      </div>
    </section>

    <!-- Öncelik Kaydı -->
    <div class="p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-2 text-xs font-mono text-[var(--ink-muted)] leading-relaxed">
      <strong class="text-[var(--ink)] block uppercase">${escapeHtml(ndaFullAgreementData.precedenceNotice.title.tr)}</strong>
      <p>${escapeHtml(ndaFullAgreementData.precedenceNotice.text)}</p>
    </div>
  </section>
`;

const kitExtraContentTr = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-8">
    <div class="space-y-4 max-w-3xl">
      <p class="text-base text-[var(--ink)] leading-relaxed">
        TMA Ajans Kiti, dijital ajansların ve yazılım evlerinin kritik üretim kesintilerinde, beklenmedik veri kaybı veya devir krizlerinde başvurabileceği kıdemli mühendislik masası kılavuzudur.
      </p>
      <p class="text-base text-[var(--ink)] leading-relaxed">
        8 slaytlık görsel sunum seti ile 60 saniyelik Crash Test 500 posteri, teknik borç ve sistem risklerinizi dakikalar içinde tespit etmenizi sağlar.
      </p>
      <p class="text-base text-[var(--ink)] leading-relaxed">
        Tüm materyaller doğrudan indirilebilir, ekibinizle paylaşılabilir ve acil durumlarda başvuru kaynağı olarak kullanılabilir.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
      <a href="/agency-kit/tma-agency-response-kit.pdf" download="tma-agency-response-kit.pdf" class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--accent)] transition-colors block text-center space-y-2">
        <strong class="text-sm font-semibold text-[var(--ink)] block">TMA Ajans Kiti (PDF)</strong>
        <span class="text-xs text-[var(--accent)] font-mono">İndir (PDF) →</span>
      </a>
      <a href="/agency-kit/tma-agency-crash-test-500.pdf" download="tma-agency-crash-test-500.pdf" class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--accent)] transition-colors block text-center space-y-2">
        <strong class="text-sm font-semibold text-[var(--ink)] block">Crash Test 500 (PDF)</strong>
        <span class="text-xs text-[var(--accent)] font-mono">İndir (PDF) →</span>
      </a>
      <a href="/sozlesme/tma-gizlilik-ve-calisma-sozlesmesi.pdf" download="tma-gizlilik-ve-calisma-sozlesmesi.pdf" class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--accent)] transition-colors block text-center space-y-2">
        <strong class="text-sm font-semibold text-[var(--ink)] block">Gizlilik Sözleşmesi (PDF)</strong>
        <span class="text-xs text-[var(--accent)] font-mono">İndir (PDF) →</span>
      </a>
    </div>
  </section>
`;

const kitExtraContentEn = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-8">
    <div class="space-y-4 max-w-3xl">
      <p class="text-base text-[var(--ink)] leading-relaxed">
        The TMA Agency Kit is an executive engineering guide designed for digital agencies facing critical production outages, unforeseen data loss, or complex codebase handovers.
      </p>
      <p class="text-base text-[var(--ink)] leading-relaxed">
        The 8-slide visual response deck and the 60-Second Crash Test 500 poster empower your team to diagnose systemic vulnerabilities and technical debt in minutes.
      </p>
      <p class="text-base text-[var(--ink)] leading-relaxed">
        All assets are readily downloadable, distributable across your engineering leadership, and serve as an immediate protocol in emergency scenarios.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
      <a href="/agency-kit/tma-agency-response-kit.pdf" download="tma-agency-response-kit.pdf" class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--accent)] transition-colors block text-center space-y-2">
        <strong class="text-sm font-semibold text-[var(--ink)] block">TMA Agency Kit (PDF)</strong>
        <span class="text-xs text-[var(--accent)] font-mono">Download (PDF) →</span>
      </a>
      <a href="/agency-kit/tma-agency-crash-test-500.pdf" download="tma-agency-crash-test-500.pdf" class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--accent)] transition-colors block text-center space-y-2">
        <strong class="text-sm font-semibold text-[var(--ink)] block">Crash Test 500 (PDF)</strong>
        <span class="text-xs text-[var(--accent)] font-mono">Download (PDF) →</span>
      </a>
      <a href="/sozlesme/tma-gizlilik-ve-calisma-sozlesmesi.pdf" download="tma-gizlilik-ve-calisma-sozlesmesi.pdf" class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--accent)] transition-colors block text-center space-y-2">
        <strong class="text-sm font-semibold text-[var(--ink)] block">Mutual Agreement (PDF)</strong>
        <span class="text-xs text-[var(--accent)] font-mono">Download (PDF) →</span>
      </a>
    </div>
  </section>
`;

const salvageabilityExtraContentTr = `
  <section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono">
      <div><strong class="text-[var(--ink)] block text-sm">5 Boyutlu Risk</strong> Mimari, Test, Veritabanı, Trafik, Teknik Borç</div>
      <div><strong class="text-emerald-700 block text-sm">0 Erişim</strong> Şifre veya repo istemez</div>
      <div><strong class="text-[var(--accent)] block text-sm">3 Stratejik Karar</strong> SWAT Rescue, Strangler Fig veya Clean Slate</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Değerlendirilen 5 Kritik Boyut</h2>
    <div class="space-y-4">
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">1. Mimari Bağımlılık & Spagetti Yoğunluğu</h3>
        <p class="text-[var(--ink-muted)] text-sm leading-relaxed">Bir modüldeki değişiklik alakasız yerleri patlatıyor mu? Monolitik düğümler ve kontrolsüz bağımlılıklar.</p>
      </article>
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">2. Test Kapsamı & Alan Bilgisi (Domain Knowledge)</h3>
        <p class="text-[var(--ink-muted)] text-sm leading-relaxed">Sistemi yazan kişi ayrıldı mı? Otomatik unit/entegrasyon testi var mı yoksa canlı ortamda mı test ediliyor?</p>
      </article>
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">3. Veritabanı Bütünlüğü & Şema Karmaşası</h3>
        <p class="text-[var(--ink-muted)] text-sm leading-relaxed">Foreign key, constraint veya migrasyon disiplini var mı yoksa veritabanı kilitlenme veya tutarsızlık içinde mi?</p>
      </article>
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">4. Canlı Trafik Baskısı & Teslimat Süresi</h3>
        <p class="text-[var(--ink-muted)] text-sm leading-relaxed">Sistem şu an aktif ciro üretiyor mu ve acil bir lansman/sözleşme tarihi var mı?</p>
      </article>
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">5. Teknik Borç / Bakım Maliyeti Oranı</h3>
        <p class="text-[var(--ink-muted)] text-sm leading-relaxed">Yeni bir özellik eklemek kaç gün sürüyor? Bakım maliyeti ciro ve geliştirme hızını kilitliyor mu?</p>
      </article>
    </div>
  </section>
`;

const salvageabilityExtraContentEn = `
  <section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono">
      <div><strong class="text-[var(--ink)] block text-sm">5 Risk Dimensions</strong> Architecture, Tests, Database, Traffic, Debt Drag</div>
      <div><strong class="text-emerald-700 block text-sm">Zero Access</strong> No credentials or repo access needed</div>
      <div><strong class="text-[var(--accent)] block text-sm">3 Strategic Paths</strong> SWAT Rescue, Strangler Fig, or Clean Slate</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">5 Critical Dimensions Evaluated</h2>
    <div class="space-y-4">
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">1. Architectural Coupling & Spaghetti Density</h3>
        <p class="text-[var(--ink-muted)] text-sm leading-relaxed">Does changing one module break unrelated endpoints? Monolithic tangles and hidden dependencies.</p>
      </article>
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">2. Test Coverage & Domain Knowledge</h3>
        <p class="text-[var(--ink-muted)] text-sm leading-relaxed">Did the original developers vanish? Are automated test suites nonexistent, leaving code untested until production?</p>
      </article>
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">3. Database Integrity & Schema Hygiene</h3>
        <p class="text-[var(--ink-muted)] text-sm leading-relaxed">Are foreign keys and constraints intact, or is the schema fraught with deadlocks and orphaned data?</p>
      </article>
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">4. Live Traffic Pressure & Deadline Urgency</h3>
        <p class="text-[var(--ink-muted)] text-sm leading-relaxed">Is the system currently processing real revenue with tight contractual delivery milestones?</p>
      </article>
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <h3 class="text-base font-bold text-[var(--accent)]">5. Technical Debt Drag Ratio</h3>
        <p class="text-[var(--ink-muted)] text-sm leading-relaxed">Does shipping a minor feature take weeks instead of hours due to crippling maintenance overhead?</p>
      </article>
    </div>
  </section>
`;

const postMortemHubExtraContentTr = `
  <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
    <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] leading-relaxed font-mono">
      ${escapeHtml(postMortemDisclosure.index.tr)}
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Yayınlanmış Post-Mortem Vakaları</h2>
    <ul class="space-y-4">
      ${postMortems.map(item => `
        <li class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <a href="/post-mortem/${escapeHtml(item.slug)}/" class="text-[var(--accent)] font-bold hover:underline font-mono text-base">→ ${escapeHtml(item.no)} · ${escapeHtml(item.title?.tr || '')}</a>
            <span class="text-xs font-mono text-amber-700">${escapeHtml(item.severity)} · ${escapeHtml(item.category?.tr || '')}</span>
          </div>
          <p class="text-sm text-[var(--ink-muted)] leading-relaxed">${escapeHtml(item.summary?.tr || '')}</p>
          <div class="text-xs font-mono text-[var(--ink-muted)]">Süre: ${escapeHtml(item.duration?.tr || '')} · Etki: ${escapeHtml(item.impact?.tr || '')}</div>
        </li>
      `).join('\n      ')}
    </ul>
  </section>
`;

const postMortemHubExtraContentEn = `
  <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
    <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] leading-relaxed font-mono">
      ${escapeHtml(postMortemDisclosure.index.en)}
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Published Incident Post-Mortems</h2>
    <ul class="space-y-4">
      ${postMortems.map(item => `
        <li class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <a href="/post-mortems/${escapeHtml(item.slug)}/" class="text-[var(--accent)] font-bold hover:underline font-mono text-base">→ ${escapeHtml(item.no)} · ${escapeHtml(item.title?.en || item.title?.tr || '')}</a>
            <span class="text-xs font-mono text-amber-700">${escapeHtml(item.severity)} · ${escapeHtml(item.category?.en || '')}</span>
          </div>
          <p class="text-sm text-[var(--ink-muted)] leading-relaxed">${escapeHtml(item.summary?.en || item.summary?.tr || '')}</p>
          <div class="text-xs font-mono text-[var(--ink-muted)]">Duration: ${escapeHtml(item.duration?.en || '')} · Impact: ${escapeHtml(item.impact?.en || '')}</div>
        </li>
      `).join('\n      ')}
    </ul>
  </section>
`;

const triageExtraContentTr = `
  <section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono">
      <div><strong class="text-[var(--ink)] block text-sm">6 Kriz Tipi</strong> Veritabanı, Ödeme, Bellek, Deploy, 429, Devir</div>
      <div><strong class="text-emerald-700 block text-sm">İlk 15 Dk</strong> Kritik "Ne Yapma!" kuralları ve CLI komutları</div>
      <div><strong class="text-[var(--accent)] block text-sm">Ücretsiz Triyaj</strong> Masaya doğrudan kıdemli mühendis bağlanır</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Canlı Kriz Simülatöründe Kapsanan Senaryolar</h2>
    <div class="space-y-4">
      ${triageScenarios.map(sc => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-bold text-[var(--accent)] font-mono">${escapeHtml(sc.category?.tr || '')}</h3>
          <span class="text-xs font-mono text-amber-700">${escapeHtml(sc.severity)} · İlk Yanıt: ${escapeHtml(sc.firstResponseTime?.tr || '')}</span>
        </div>
        <p class="text-[var(--ink-muted)] text-sm leading-relaxed">${escapeHtml(sc.symptom?.tr || '')}</p>
        <div class="pt-2 text-xs font-mono text-rose-700">
          <strong>Önemli:</strong> ${escapeHtml(sc.doNot?.[0]?.tr || '')}
        </div>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const triageExtraContentEn = `
  <section class="space-y-6 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono">
      <div><strong class="text-[var(--ink)] block text-sm">6 Outage Types</strong> Database, Payment, Memory, Deploy, 429, Handover</div>
      <div><strong class="text-emerald-700 block text-sm">First 15 Mins</strong> Critical DO NOTs and diagnostic CLI commands</div>
      <div><strong class="text-[var(--accent)] block text-sm">Free Triage</strong> Senior engineering desk engages directly</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Scenarios Covered in the Emergency Simulator</h2>
    <div class="space-y-4">
      ${triageScenarios.map(sc => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-bold text-[var(--accent)] font-mono">${escapeHtml(sc.category?.en || '')}</h3>
          <span class="text-xs font-mono text-amber-700">${escapeHtml(sc.severity)} · MTTA: ${escapeHtml(sc.firstResponseTime?.en || '')}</span>
        </div>
        <p class="text-[var(--ink-muted)] text-sm leading-relaxed">${escapeHtml(sc.symptom?.en || '')}</p>
        <div class="pt-2 text-xs font-mono text-rose-700">
          <strong>Caution:</strong> ${escapeHtml(sc.doNot?.[0]?.en || '')}
        </div>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const slaExtraContentTr = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono">
      <div><strong class="text-rose-700 block text-sm">SEV-0</strong> ≤ 15 Dk MTTA</div>
      <div><strong class="text-amber-700 block text-sm">SEV-1</strong> ≤ 30 Dk MTTA</div>
      <div><strong class="text-blue-700 block text-sm">SEV-2</strong> ≤ 2 Saat MTTA</div>
      <div><strong class="text-purple-700 block text-sm">SEV-3</strong> ≤ 4 Saat MTTA</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Hizmet Seviyesi Taahhütleri (SLA Seviyeleri)</h2>
    <div class="space-y-4">
      ${slaTiers.map(tier => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-bold text-[var(--ink)] font-mono">${escapeHtml(tier.level)} · ${escapeHtml(tier.title?.tr || '')}</h3>
          <span class="text-xs font-mono text-[var(--accent)]">İlk Yanıt: ${escapeHtml(tier.mtta?.tr || '')} · Masaya Oturma: ${escapeHtml(tier.timeToTable?.tr || '')}</span>
        </div>
        <p class="text-[var(--ink-muted)] text-sm leading-relaxed">${escapeHtml(tier.definition?.tr || '')}</p>
        <p class="text-xs font-mono text-[var(--ink-muted)]">Rapor Sıklığı: ${escapeHtml(tier.updateCadence?.tr || '')}</p>
      </article>
      `).join('\n      ')}
    </div>

    <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono">
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
        <p class="text-[var(--ink-muted)] text-xs leading-relaxed">${escapeHtml(c.desc?.tr || '')}</p>
        ${c.no === '02' ? '<p class="pt-2"><a href="/nda/" class="text-[var(--accent)] hover:underline font-bold font-mono text-xs">Sözleşmeyi okuyun →</a></p>' : ''}
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const slaExtraContentEn = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono">
      <div><strong class="text-rose-700 block text-sm">SEV-0</strong> ≤ 15 Mins MTTA</div>
      <div><strong class="text-amber-700 block text-sm">SEV-1</strong> ≤ 30 Mins MTTA</div>
      <div><strong class="text-blue-700 block text-sm">SEV-2</strong> ≤ 2 Hours MTTA</div>
      <div><strong class="text-purple-700 block text-sm">SEV-3</strong> ≤ 4 Hours MTTA</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Service Level Agreements (SLA Tiers)</h2>
    <div class="space-y-4">
      ${slaTiers.map(tier => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-bold text-[var(--ink)] font-mono">${escapeHtml(tier.level)} · ${escapeHtml(tier.title?.en || tier.title?.tr || '')}</h3>
          <span class="text-xs font-mono text-[var(--accent)]">MTTA: ${escapeHtml(tier.mtta?.en || '')} · Table: ${escapeHtml(tier.timeToTable?.en || '')}</span>
        </div>
        <p class="text-[var(--ink-muted)] text-sm leading-relaxed">${escapeHtml(tier.definition?.en || '')}</p>
        <p class="text-xs font-mono text-[var(--ink-muted)]">Cadence: ${escapeHtml(tier.updateCadence?.en || '')}</p>
      </article>
      `).join('\n      ')}
    </div>

    <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono">
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
        <p class="text-[var(--ink-muted)] text-xs leading-relaxed">${escapeHtml(c.desc?.en || c.desc?.tr || '')}</p>
        ${c.no === '02' ? '<p class="pt-2"><a href="/nda/" class="text-[var(--accent)] hover:underline font-bold font-mono text-xs">Read the agreement →</a></p>' : ''}
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const techMatrixExtraContentTr = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono">
      <div><strong class="text-emerald-700 block text-sm">4 Kategori</strong> Backend, Frontend, DB, Infra</div>
      <div><strong class="text-[var(--ink)] block text-sm">15+ Bileşen</strong> Node, Go, Python, Postgres, K8s</div>
      <div><strong class="text-[var(--accent)] block text-sm">≤ 15 Dk</strong> SEV-0 Anında SWAT Triyajı</div>
      <div><strong class="text-amber-700 block text-sm">%100</strong> Müdahale Öncesi Snapshot Kuralı</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Desteklenen Teknolojiler & Cerrahi Müdahale Derinliği</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${techStackData.tr.items.map(tech => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-bold text-[var(--ink)] font-mono">${escapeHtml(tech.name)}</h3>
          <span class="text-xs font-mono text-emerald-700">${escapeHtml(tech.supportLevel)}</span>
        </div>
        <p class="text-xs font-mono text-[var(--ink-muted)]">Hazırbulunuşluk: ${escapeHtml(tech.readiness)}</p>
        <div class="pt-1">
          <p class="text-xs font-semibold text-amber-700 font-mono">Kritik Arıza Noktaları:</p>
          <ul class="list-disc list-inside space-y-0.5 text-xs text-[var(--ink-muted)]">
            ${tech.commonIncidents.slice(0, 2).map(inc => `<li>${escapeHtml(inc)}</li>`).join('\n            ')}
          </ul>
        </div>
        <p class="text-xs text-[var(--ink-muted)] pt-1"><strong class="text-[var(--accent)]">TMA SWAT:</strong> ${escapeHtml(tech.rescueCapability)}</p>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const techMatrixExtraContentEn = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono">
      <div><strong class="text-emerald-700 block text-sm">4 Categories</strong> Backend, Frontend, DB, Infra</div>
      <div><strong class="text-[var(--ink)] block text-sm">15+ Stacks</strong> Node, Go, Python, Postgres, K8s</div>
      <div><strong class="text-[var(--accent)] block text-sm">≤ 15 Mins</strong> SEV-0 Immediate SWAT Triage</div>
      <div><strong class="text-amber-700 block text-sm">100%</strong> Pre-Intervention Snapshot Rule</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Supported Technologies & Surgical Rescue Depth</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${techStackData.en.items.map(tech => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-bold text-[var(--ink)] font-mono">${escapeHtml(tech.name)}</h3>
          <span class="text-xs font-mono text-emerald-700">${escapeHtml(tech.supportLevel)}</span>
        </div>
        <p class="text-xs font-mono text-[var(--ink-muted)]">Readiness: ${escapeHtml(tech.readiness)}</p>
        <div class="pt-1">
          <p class="text-xs font-semibold text-amber-700 font-mono">Outage Vectors:</p>
          <ul class="list-disc list-inside space-y-0.5 text-xs text-[var(--ink-muted)]">
            ${tech.commonIncidents.slice(0, 2).map(inc => `<li>${escapeHtml(inc)}</li>`).join('\n            ')}
          </ul>
        </div>
        <p class="text-xs text-[var(--ink-muted)] pt-1"><strong class="text-[var(--accent)]">TMA SWAT:</strong> ${escapeHtml(tech.rescueCapability)}</p>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const ndaGeneratorExtraContentTr = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono">
      <div><strong class="text-emerald-700 block text-sm">%100 IP Koruma</strong> Kod ve mimari tamamen müşteriye aittir</div>
      <div><strong class="text-[var(--ink)] block text-sm">White-Label</strong> Müşterinizin adı ve arızası asla yayınlanmaz</div>
      <div><strong class="text-[var(--accent)] block text-sm">Anında PDF / Yazdır</strong> 30 saniyede resmi sözleşme çıktısı</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Sözleşmede Yer Alan 7 Temel Hukuki ve Mühendislik Maddesi</h2>
    <div class="space-y-4">
      ${ndaData.tr.clauses.map(clause => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-1.5">
        <h3 class="text-sm font-bold text-[var(--ink)] font-mono uppercase">MADDE ${escapeHtml(clause.num)}. ${escapeHtml(clause.title)}</h3>
        <p class="text-[var(--ink-muted)] text-xs sm:text-sm leading-relaxed">${escapeHtml(clause.content)}</p>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const ndaGeneratorExtraContentEn = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono">
      <div><strong class="text-emerald-700 block text-sm">100% IP Ownership</strong> All code & architecture belongs to client</div>
      <div><strong class="text-[var(--ink)] block text-sm">Ghost Delivery</strong> Client identity and incident history strictly confidential</div>
      <div><strong class="text-[var(--accent)] block text-sm">Instant Print / PDF</strong> Official executive agreement in 30 seconds</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">7 Core Legal & Engineering Clauses</h2>
    <div class="space-y-4">
      ${ndaData.en.clauses.map(clause => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-1.5">
        <h3 class="text-sm font-bold text-[var(--ink)] font-mono uppercase">SECTION ${escapeHtml(clause.num)}. ${escapeHtml(clause.title)}</h3>
        <p class="text-[var(--ink-muted)] text-xs sm:text-sm leading-relaxed">${escapeHtml(clause.content)}</p>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const outageSimulatorExtraContentTr = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono">
      <div><strong class="text-rose-700 block text-sm">5 Boyutlu Zarar</strong> Ciro, Reklam, SLA, Churn, Mühendislik</div>
      <div><strong class="text-[var(--ink)] block text-sm">TCOD Motoru</strong> True Cost of Downtime hesaplaması</div>
      <div><strong class="text-amber-700 block text-sm">Gizli Maliyet</strong> Ciro kaybının 2x - 4x katı teminat riski</div>
      <div><strong class="text-emerald-700 block text-sm">≤ 15 Dk</strong> Masaya bağlanarak hasarı durdurma</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">Hesaplanan 5 Kurumsal Hasar Kalemi (TCOD)</h2>
    <div class="space-y-4">
      ${outageSimulatorData.tr.dimensions.map(dim => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-1.5">
        <h3 class="text-base font-bold text-[var(--ink)] font-mono">${escapeHtml(dim.title)}</h3>
        <p class="text-[var(--ink-muted)] text-sm leading-relaxed">${escapeHtml(dim.desc)}</p>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const outageSimulatorExtraContentEn = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono">
      <div><strong class="text-rose-700 block text-sm">5 Damage Vectors</strong> Revenue, Ads, SLA, Churn, Engineering</div>
      <div><strong class="text-[var(--ink)] block text-sm">TCOD Engine</strong> True Cost of Downtime arithmetic</div>
      <div><strong class="text-amber-700 block text-sm">Hidden Drag</strong> 2x to 4x direct lost checkout sales</div>
      <div><strong class="text-emerald-700 block text-sm">≤ 15 Mins</strong> Stop bleeding via instant senior triage</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">5 Modeled Damage Components (TCOD)</h2>
    <div class="space-y-4">
      ${outageSimulatorData.en.dimensions.map(dim => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-1.5">
        <h3 class="text-base font-bold text-[var(--ink)] font-mono">${escapeHtml(dim.title)}</h3>
        <p class="text-[var(--ink-muted)] text-sm leading-relaxed">${escapeHtml(dim.desc)}</p>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const radarExtraContentTr = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono">
      <div><strong class="text-[var(--ink)] block text-sm">8,4 Dk MTTA</strong> Son 90 Gün Masaya Oturma Ortalaması</div>
      <div><strong class="text-[var(--accent)] block text-sm">3,2 Saat TTR</strong> Ortalama Kalıcı Çözüm Süresi</div>
      <div><strong class="text-purple-700 block text-sm">34</strong> Çözülen Vaka · 90 günlük dönem</div>
    </div>

    <p class="text-xs text-[var(--ink-muted)] font-mono">
      Bu değerler 90 günlük dönemde kaydedilen 34 müdahaleden hesaplanmıştır. Son güncelleme: 21 Eylül 2026. Taahhüt edilen süreler için: <a href="/sla/" class="text-[var(--accent)] hover:underline font-bold">SLA ve Yanıt Taahhütleri →</a>
    </p>

    <h2 class="text-xl font-bold text-[var(--ink)]">NÖBET SAATLERİNDE ERİŞİLEBİLİRLİK (09:00–24:00)</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${radarData.tr.components.map(comp => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-bold text-[var(--ink)] font-mono">${escapeHtml(comp.name)}</h3>
          <span class="text-xs font-mono text-emerald-700">${escapeHtml(comp.uptime)}</span>
        </div>
        <p class="text-[var(--ink-muted)] text-xs leading-relaxed">${escapeHtml(comp.desc)}</p>
        <p class="text-xs font-mono text-[var(--accent)] pt-1">${escapeHtml(comp.latencyLabel)}: ${escapeHtml(comp.latency)}</p>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const radarExtraContentEn = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono">
      <div><strong class="text-[var(--ink)] block text-sm">8.4 Min MTTA</strong> 90-Day Average Time to Table</div>
      <div><strong class="text-[var(--accent)] block text-sm">3.2 Hr TTR</strong> 90-Day Mean Time to Recovery</div>
      <div><strong class="text-purple-700 block text-sm">34</strong> Resolved Incidents · 90-day period</div>
    </div>

    <p class="text-xs text-[var(--ink-muted)] font-mono">
      Calculated from 34 recorded interventions over a 90-day window. Last updated: September 21, 2026. For contractual response times: <a href="/sla/" class="text-[var(--accent)] hover:underline font-bold">SLA & Response Commitments →</a>
    </p>

    <h2 class="text-xl font-bold text-[var(--ink)]">DUTY HOURS AVAILABILITY (09:00–24:00)</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${radarData.en.components.map(comp => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-bold text-[var(--ink)] font-mono">${escapeHtml(comp.name)}</h3>
          <span class="text-xs font-mono text-emerald-700">${escapeHtml(comp.uptime)}</span>
        </div>
        <p class="text-[var(--ink-muted)] text-xs leading-relaxed">${escapeHtml(comp.desc)}</p>
        <p class="text-xs font-mono text-[var(--accent)] pt-1">${escapeHtml(comp.latencyLabel)}: ${escapeHtml(comp.latency)}</p>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const codeHealthExtraContentTr = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono">
      <div><strong class="text-rose-700 block text-sm">4 Kritik Boyut</strong> Mimari, DB, Güvenlik, Borç</div>
      <div><strong class="text-[var(--ink)] block text-sm">20 Parametre</strong> Ağırlıklı risk değerlendirme kriteri</div>
      <div><strong class="text-amber-700 block text-sm">Yangın Riski</strong> İlk 3 acil müdahale noktası tespiti</div>
      <div><strong class="text-emerald-700 block text-sm">Anında Rapor</strong> CTO & Yönetim Kurulu için Markdown çıktısı</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">4 Boyutlu Kod Sağlığı ve Teknik Borç Denetim Kapsamı</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${codeHealthData.tr.categories.map(cat => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-3">
        <div class="border-b border-[var(--rule)] pb-2">
          <h3 class="text-base font-bold text-[var(--ink)] font-mono">${escapeHtml(cat.title)}</h3>
          <p class="text-xs text-[var(--ink-muted)]">${escapeHtml(cat.desc)}</p>
        </div>
        <ul class="space-y-2 text-xs text-[var(--ink-muted)]">
          ${cat.items.slice(0, 3).map(item => `
          <li class="flex items-start gap-2">
            <span class="text-amber-700 font-mono font-bold">•</span>
            <div>
              <span class="text-[var(--ink)] font-medium">${escapeHtml(item.text)}</span>
              <p class="text-xs text-rose-700 font-mono">${escapeHtml(item.risk)}</p>
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
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono">
      <div><strong class="text-rose-700 block text-sm">4 Critical Vectors</strong> Architecture, DB, Security, Debt</div>
      <div><strong class="text-[var(--ink)] block text-sm">20 Checkpoints</strong> Weighted risk assessment criteria</div>
      <div><strong class="text-amber-700 block text-sm">Fire Hazards</strong> Top 3 urgent triage vectors</div>
      <div><strong class="text-emerald-700 block text-sm">Instant Brief</strong> Copyable executive Markdown report</div>
    </div>

    <h2 class="text-xl font-bold text-[var(--ink)]">4-Dimensional Codebase Health & Technical Debt Scope</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${codeHealthData.en.categories.map(cat => `
      <article class="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-3">
        <div class="border-b border-[var(--rule)] pb-2">
          <h3 class="text-base font-bold text-[var(--ink)] font-mono">${escapeHtml(cat.title)}</h3>
          <p class="text-xs text-[var(--ink-muted)]">${escapeHtml(cat.desc)}</p>
        </div>
        <ul class="space-y-2 text-xs text-[var(--ink-muted)]">
          ${cat.items.slice(0, 3).map(item => `
          <li class="flex items-start gap-2">
            <span class="text-amber-700 font-mono font-bold">•</span>
            <div>
              <span class="text-[var(--ink)] font-medium">${escapeHtml(item.text)}</span>
              <p class="text-xs text-rose-700 font-mono">${escapeHtml(item.risk)}</p>
            </div>
          </li>
          `).join('\n          ')}
        </ul>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const rescueRoiExtraContentTr = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono">
      <div><strong class="text-emerald-700 block text-sm">%60 - %80</strong> Korunan Sermaye & Bütçe</div>
      <div><strong class="text-[var(--ink)] block text-sm">4x - 10x ROI</strong> Cerrahi Kurtarma Çarpanı</div>
      <div><strong class="text-[var(--accent)] block text-sm">4 - 8 Ay</strong> Kazanılan Pazar Süresi</div>
      <div><strong class="text-amber-700 block text-sm">Zero-Rebuild Risk</strong> Sıfırdan yazım tuzaklarını bertaraf</div>
    </div>

    <p class="text-xs text-[var(--ink-muted)] font-mono">
      Aralıklar sektör verilerinin ortalamasıdır; tek bir TMA projesinin sonucu değildir.
    </p>

    <h2 class="text-xl font-bold text-[var(--ink)]">Sıfırdan Yazım Riskleri vs. TMA SWAT Kurtarma Modeli</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <article class="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
        <h3 class="text-base font-bold text-rose-700 font-mono">Sıfırdan Yazım (Rebuild) Maliyet & Risk Kalemleri</h3>
        <ul class="space-y-2 text-xs text-[var(--ink-muted)]">
          ${rescueRoiData.tr.rebuildItems.map(item => `
          <li class="flex items-start gap-2">
            <span class="text-rose-700 font-mono font-bold">✕</span>
            <span>${escapeHtml(item)}</span>
          </li>
          `).join('\n          ')}
        </ul>
      </article>
      <article class="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
        <h3 class="text-base font-bold text-emerald-700 font-mono">TMA SWAT Kurtarma (Rescue) Avantajları</h3>
        <ul class="space-y-2 text-xs text-[var(--ink-muted)]">
          ${rescueRoiData.tr.rescueItems.map(item => `
          <li class="flex items-start gap-2">
            <span class="text-emerald-700 font-mono font-bold">✓</span>
            <span>${escapeHtml(item)}</span>
          </li>
          `).join('\n          ')}
        </ul>
      </article>
    </div>
  </section>
`;

const rescueRoiExtraContentEn = `
  <section class="space-y-8 mt-8 border-t border-[var(--rule)] pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono">
      <div><strong class="text-emerald-700 block text-sm">60% - 80%</strong> Capital Preserved</div>
      <div><strong class="text-[var(--ink)] block text-sm">4x - 10x ROI</strong> Surgical Rescue Multiplier</div>
      <div><strong class="text-[var(--accent)] block text-sm">4 - 8 Months</strong> Time to Market Saved</div>
      <div><strong class="text-amber-700 block text-sm">Zero-Rebuild Trap</strong> Eliminates ground-up rewrite failure risk</div>
    </div>

    <p class="text-xs text-[var(--ink-muted)] font-mono">
      Ranges are industry averages, not the result of a single TMA project.
    </p>

    <h2 class="text-xl font-bold text-[var(--ink)]">Rebuild Liabilities vs. TMA SWAT Rescue Advantages</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <article class="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
        <h3 class="text-base font-bold text-rose-700 font-mono">Ground-Up Rebuild Liabilities</h3>
        <ul class="space-y-2 text-xs text-[var(--ink-muted)]">
          ${rescueRoiData.en.rebuildItems.map(item => `
          <li class="flex items-start gap-2">
            <span class="text-rose-700 font-mono font-bold">✕</span>
            <span>${escapeHtml(item)}</span>
          </li>
          `).join('\n          ')}
        </ul>
      </article>
      <article class="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
        <h3 class="text-base font-bold text-emerald-700 font-mono">TMA SWAT Rescue Advantages</h3>
        <ul class="space-y-2 text-xs text-[var(--ink-muted)]">
          ${rescueRoiData.en.rescueItems.map(item => `
          <li class="flex items-start gap-2">
            <span class="text-emerald-700 font-mono font-bold">✓</span>
            <span>${escapeHtml(item)}</span>
          </li>
          `).join('\n          ')}
        </ul>
      </article>
    </div>
  </section>
`;

const basePages = [
  {
    dir: '',
    title: 'Trend Master Akademi | Ajansların İmdat Butonu',
    h1: 'Trend Master Akademi - B2B Technical SWAT & White-Label Engineering Studio',
    description: 'Dijital ajansların imdat butonu: B2B White-Label mühendislik masası, acil kod kurtarma (SWAT), SaaS mimarisi ve kriz çözüm stüdyosu.',
    canonical: 'https://trendmasterakademi.com/',
    ogUrl: 'https://trendmasterakademi.com/',
    heading: 'Teknik olarak projesi tıkanmış ajanslar için: Kodu Devralır, Ajansınız Adına Eksiksiz Teslim Ederiz.',
    subheading: 'Dijital ajansların imdat butonu. Teknik olarak tıkanan projeler için B2B White-Label mühendislik masası, acil kod kurtarma (SWAT), PostgreSQL deadlock onarımı, SaaS mimarisi ve kriz çözüm stüdyosu.',
    extraContent: homePageExtraContent,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        professionalServiceNode,
        {
          "@type": "FAQPage",
          "@id": "https://trendmasterakademi.com/#faq",
          "mainEntity": faqData.map(f => ({
            "@type": "Question",
            "name": f.question.tr,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.answer.tr
            }
          }))
        },
        webSiteNode
      ]
    }
  },
  {
    dir: 'agency',
    title: 'Ajanslar İçin White-Label Mühendislik | Trend Master Akademi',
    h1: 'Ajans Çözümleri & B2B Mühendislik Masası',
    description: 'Dijital ajansların görünmez teknik gücü: %100 White-Label, resmi NDA güvencesi, 20+ teknik yetkinlik, acil kriz masası ve kıdemli mühendislik takviyesi.',
    canonical: 'https://trendmasterakademi.com/agency/',
    ogUrl: 'https://trendmasterakademi.com/agency/',
    heading: 'Ajansınızın Yerine Değil, Ajansınızın Yanında Güvenilir Mühendislik Masası.',
    subheading: 'Bir projede teknik olarak tıkandığınızda, teslim tarihi yaklaştığında veya ekibinizin kapasitesi dolduğunda: %100 White-Label, resmi NDA ve doğrudan kıdemli mühendislik desteği.',
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
    h1: 'TMA Agency Response & Readiness Kit',
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
    h1: 'TMA Agency Response & Readiness Kit',
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
    h1: 'Agency Crash Test (60sn)',
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
    h1: 'Devir Hazırlık Kontrolü',
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
    h1: 'Developer Handover Readiness Audit',
    description: 'Is your developer leaving or already left? Check 12 mission-critical items, get your handover risk score and missing inventory in 60 seconds.',
    canonical: 'https://trendmasterakademi.com/handover-audit/',
    ogUrl: 'https://trendmasterakademi.com/handover-audit/',
    hreflangTr: 'https://trendmasterakademi.com/devir-kontrolu/',
    hreflangEn: 'https://trendmasterakademi.com/handover-audit/',
    heading: 'Developer Handover Readiness Audit // 12-Point Transition Checklist',
    subheading: 'Audit Git repos, environment variables, DNS, and payment keys to ensure zero project blockage during engineer transitions.',
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
    h1: 'Teknik Terim Sözlüğü',
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
    h1: 'Developer-to-Agency Tech Glossary',
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
    title: 'Kesinti Maliyeti Hesaplayıcı | Trend Master Akademi',
    h1: 'Kesinti Maliyeti Hesaplayıcı',
    description: 'Sunucu çökmesi veya HTTP 500 kesintisinde saatlik ve toplam tahmini ciro kaybınızı hesaplayın. Şeffaf matematik ve kurtarma ROI analizi.',
    canonical: 'https://trendmasterakademi.com/kesinti-maliyeti/',
    ogUrl: 'https://trendmasterakademi.com/kesinti-maliyeti/',
    hreflangTr: 'https://trendmasterakademi.com/kesinti-maliyeti/',
    hreflangEn: 'https://trendmasterakademi.com/downtime-calc/',
    heading: 'Web Sitesi & API Kesinti Maliyeti Hesaplayıcı',
    subheading: 'Sistem çöktüğünde geçen her dakikanın ajansınıza ve müşterinize gerçek finansal ve itibar maliyetini hesaplayın.',
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
    title: 'Downtime Loss Calculator | Trend Master Akademi',
    h1: 'Downtime Loss Calculator',
    description: 'Calculate hourly and total estimated revenue loss during server crashes or HTTP 500 outages. Transparent math and recovery ROI analysis.',
    canonical: 'https://trendmasterakademi.com/downtime-calc/',
    ogUrl: 'https://trendmasterakademi.com/downtime-calc/',
    hreflangTr: 'https://trendmasterakademi.com/kesinti-maliyeti/',
    hreflangEn: 'https://trendmasterakademi.com/downtime-calc/',
    heading: 'Website & API Downtime Loss Calculator',
    subheading: 'Calculate the true financial and reputational cost of every minute your client systems remain offline.',
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
    h1: 'Mühendislik Standartlarımız & Hakkımızda',
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
    h1: "Trend Master Akademi'nin hikâyesi",
    description: '20 yıllık finansal yazılım tecrübesi, online eğitimden doğan isim ve B2B mühendislik masası vizyonumuz.',
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
    h1: "The Story of Trend Master Akademi",
    description: '20 years of financial software expertise, a name born in online education, and our B2B engineering desk vision.',
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
    h1: 'KVKK Aydınlatma Metni & Gizlilik Politikası',
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
    h1: 'KVKK Aydınlatma Metni & Gizlilik Politikası',
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
    h1: 'Gizlilik ve Çalışma Sözleşmesi',
    description: 'Çalışmaya başlamadan önce imzaladığımız karşılıklı gizlilik ve çalışma sözleşmesinin tam metni ve sade dilli özeti.',
    canonical: 'https://trendmasterakademi.com/nda/',
    ogUrl: 'https://trendmasterakademi.com/nda/',
    subheading: 'Çalışmaya başlamadan önce karşılıklı bir gizlilik ve çalışma sözleşmesi imzalıyoruz. Ne imzalayacağınızı önceden bilmeniz için sözleşmenin ne dediğini burada sade dille anlattık.',
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
    h1: 'Teşhis Kataloğu',
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
    h1: 'Diagnostic Catalog',
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
    h1: 'Acil Teknik Destek — Kriz Hattı',
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
    h1: 'Kurtarılabilirlik İndeksi — Refactor vs Rebuild Karar Matrisi',
    description: 'Mevcut spagetti veya dokümantasyonsuz kodu kurtarmalı mı, boğmalı mı, yoksa sıfırdan mı yazmalı? 5 boyutlu objektif CTO karar matrisi.',
    canonical: 'https://trendmasterakademi.com/kurtarilabilirlik/',
    ogUrl: 'https://trendmasterakademi.com/kurtarilabilirlik/',
    hreflangTr: 'https://trendmasterakademi.com/kurtarilabilirlik/',
    hreflangEn: 'https://trendmasterakademi.com/salvageability/',
    heading: 'Kurtarılabilirlik İndeksi // Refactor vs Rebuild Karar Matrisi',
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
    h1: 'Salvageability Index — Refactor vs Rebuild Decision Matrix',
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
    h1: 'Incident Post-Mortem & RCA Kütüphanesi',
    description: 'Gerçek üretim kesintileri, PostgreSQL deadlock, ödeme race condition vakaları ve uygulanan kalıcı mühendislik çözümleri.',
    canonical: 'https://trendmasterakademi.com/post-mortem/',
    ogUrl: 'https://trendmasterakademi.com/post-mortem/',
    hreflangTr: 'https://trendmasterakademi.com/post-mortem/',
    hreflangEn: 'https://trendmasterakademi.com/post-mortems/',
    heading: 'Incident Post-Mortem & RCA Kütüphanesi',
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
    h1: 'Public Incident Post-Mortems & RCA Library',
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
    h1: 'Canlı Kriz & Triyaj Simülatörü',
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
    h1: 'Emergency Triage & Incident Simulator',
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
    h1: 'Şeffaf Mühendislik SLA & Yanıt Süresi Matrisi',
    description: slaMetaDesc.tr,
    canonical: 'https://trendmasterakademi.com/sla/',
    ogUrl: 'https://trendmasterakademi.com/sla/',
    heading: 'Şeffaf Mühendislik SLA & Yanıt Süresi Matrisi',
    subheading: 'Ajanslar ve kurumsal şirketler için muğlak "en kısa sürede inceleriz" sözleri yerine; dakikalarla tanımlanmış, bağlayıcı mühendislik masası taahhütleri.',
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
    h1: 'Teknoloji Yığını & Kurtarma Matrisi',
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
    h1: 'Tech Stack Compatibility & Rescue Matrix',
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
    h1: 'İki Taraflı Gizlilik ve Fikri Mülkiyet Sözleşmesi (Mutual NDA)',
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
    h1: 'Mutual Non-Disclosure & IP Protection Agreement (NDA)',
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
    title: 'Gelişmiş Kesinti & İtibar Zararı Simülatörü | Trend Master Akademi',
    h1: 'Gelişmiş Kesinti & İtibar Zararı Simülatörü (TCOD)',
    description: 'Buzdağının görünmeyen yüzü: doğrudan sepet kaybı, yanan reklam bütçesi, sözleşmesel SLA cezaları, churn ve mühendislik maliyeti hesaplayıcı.',
    canonical: 'https://trendmasterakademi.com/hasar-tespiti/',
    ogUrl: 'https://trendmasterakademi.com/hasar-tespiti/',
    hreflangTr: 'https://trendmasterakademi.com/hasar-tespiti/',
    hreflangEn: 'https://trendmasterakademi.com/outage-simulator/',
    heading: 'Gelişmiş Kesinti & İtibar Zararı Simülatörü (TCOD)',
    subheading: 'Bir üretim arızasında doğrudan sepet kaybı toplam hasarın sadece küçük bir kısmıdır. Yanan reklamları, SLA cezalarını, müşteri terkini ve mühendislik fırsat maliyetini simüle edin.',
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
            { "@type": "ListItem", "position": 2, "name": "Hasar Tespiti Simülatörü", "item": "https://trendmasterakademi.com/hasar-tespiti/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'outage-simulator',
    lang: 'en',
    title: 'Outage & Reputational Damage Simulator (TCOD) | Trend Master Akademi',
    h1: 'Outage & Reputational Damage Simulator (TCOD)',
    description: 'Calculate the true total cost of downtime: direct revenue loss, burned advertising budgets, contractual SLA penalties, churn, and developer drag.',
    canonical: 'https://trendmasterakademi.com/outage-simulator/',
    ogUrl: 'https://trendmasterakademi.com/outage-simulator/',
    hreflangTr: 'https://trendmasterakademi.com/hasar-tespiti/',
    hreflangEn: 'https://trendmasterakademi.com/outage-simulator/',
    heading: 'Outage & Reputational Damage Simulator (TCOD)',
    subheading: 'Lost sales are only the tip of the iceberg. Quantify wasted ad spend, contractual penalties, customer churn, and engineering opportunity drag in real time.',
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
            { "@type": "ListItem", "position": 2, "name": "Outage Damage Simulator", "item": "https://trendmasterakademi.com/outage-simulator/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'radar',
    title: 'SWAT Hazırbulunuşluk & Olay Radarı | Trend Master Akademi',
    h1: 'SWAT Hazırbulunuşluk & Olay Radarı',
    description: 'TMA mühendislik masası hazırbulunuşluğu, nöbet saatleri, 90 günlük SLA telemetrisi ve vaka dağılım özeti.',
    canonical: 'https://trendmasterakademi.com/radar/',
    ogUrl: 'https://trendmasterakademi.com/radar/',
    heading: 'SWAT Hazırbulunuşluk & Olay Radarı',
    subheading: 'Operasyonel hazırbulunuşluk, nöbet saatleri, son 90 günlük masaya oturma süreleri (MTTA) ve çözülen krizlerin kategori dağılımı.',
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
            { "@type": "ListItem", "position": 2, "name": "Sistem Durumu ve Güvenilirlik Raporu", "item": "https://trendmasterakademi.com/radar/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'kod-sagligi',
    title: 'Kod Sağlığı & Teknik Borç Denetim Listesi | Trend Master Akademi',
    h1: 'Kod Sağlığı & Teknik Borç Denetim Listesi',
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
    h1: 'Codebase Health & Technical Debt Audit Checklist',
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
    title: 'Kurtarma vs Yeniden Yazım Finansal ROI Hesaplayıcı | Trend Master Akademi',
    h1: 'Kurtarma vs Yeniden Yazım Finansal ROI Hesaplayıcı',
    description: 'Spagetti kod tabanını sıfırdan yazmak mı, TMA SWAT cerrahi müdahalesiyle kurtarmak mı? Korunan sermaye, kazanılan aylar ve net ROI hesaplayıcı.',
    canonical: 'https://trendmasterakademi.com/kurtarma-maliyeti/',
    ogUrl: 'https://trendmasterakademi.com/kurtarma-maliyeti/',
    hreflangTr: 'https://trendmasterakademi.com/kurtarma-maliyeti/',
    hreflangEn: 'https://trendmasterakademi.com/rescue-roi/',
    heading: 'Kurtarma vs Yeniden Yazım Finansal ROI Hesaplayıcı',
    subheading: 'Sıfırdan yazım (rebuild) maliyeti, fırsat kaybı ve riskleri ile TMA cerrahi kurtarma modelini karşılaştırın. Korunan sermaye ve yatırım geri dönüşünü anında simüle edin.',
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
            { "@type": "ListItem", "position": 2, "name": "Kurtarma ROI Hesaplayıcı", "item": "https://trendmasterakademi.com/kurtarma-maliyeti/" }
          ]
        }
      ]
    }
  },
  {
    dir: 'rescue-roi',
    lang: 'en',
    title: 'SWAT Rescue vs Rebuild Financial ROI Calculator | Trend Master Akademi',
    h1: 'SWAT Rescue vs Rebuild Financial ROI Calculator',
    description: 'Ground-up rewrite vs surgical rescue: calculate preserved capital, months saved to market, developer drag, and clear financial ROI multiplier.',
    canonical: 'https://trendmasterakademi.com/rescue-roi/',
    ogUrl: 'https://trendmasterakademi.com/rescue-roi/',
    hreflangTr: 'https://trendmasterakademi.com/kurtarma-maliyeti/',
    hreflangEn: 'https://trendmasterakademi.com/rescue-roi/',
    heading: 'SWAT Rescue vs Rebuild Financial ROI Calculator',
    subheading: 'Compare ground-up rewrite costs, engineering drag, and catastrophic failure risks against TMA surgical stabilization. Simulate preserved capital and ROI multiplier in real time.',
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
            { "@type": "ListItem", "position": 2, "name": "Rescue vs Rebuild ROI", "item": "https://trendmasterakademi.com/rescue-roi/" }
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
        ${remaining > 0 ? `<p class="text-xs text-[var(--ink-muted)] pt-1"><a href="/teshis/" class="text-[var(--accent)] hover:underline">ve ${remaining} teşhis daha →</a></p>` : ''}
      </section>
    `;
    reverseBlockEn = `
      <section class="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-3 mt-6">
        <h2 class="text-xl font-bold text-[var(--ink)]">This concept appears in these incident symptoms</h2>
        <ul class="space-y-2 font-mono text-sm text-[var(--accent)]">
          ${visible.map(d => `<li><a href="/diagnostic/${escapeHtml(d.slug)}/" class="hover:underline">→ ${escapeHtml(d.no)} · ${escapeHtml(d.baslik.en || d.baslik.tr)}</a></li>`).join('\n          ')}
        </ul>
        ${remaining > 0 ? `<p class="text-xs text-[var(--ink-muted)] pt-1"><a href="/diagnostic/" class="text-[var(--accent)] hover:underline">and ${remaining} more diagnoses →</a></p>` : ''}
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
        <p class="text-[var(--ink-muted)] leading-relaxed">${escapeHtml(term.shortDef?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Ajans için ne anlama gelir</h2>
        <p class="text-[var(--ink-muted)] leading-relaxed">${escapeHtml(term.agencyImpact?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Kim çözer</h2>
        <p class="text-[var(--ink-muted)] leading-relaxed">${escapeHtml(term.whoSolves?.tr || '')}</p>
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
        <p class="text-[var(--ink-muted)] leading-relaxed">${escapeHtml(term.shortDef?.en || term.shortDef?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">What It Means for Agencies</h2>
        <p class="text-[var(--ink-muted)] leading-relaxed">${escapeHtml(term.agencyImpact?.en || term.agencyImpact?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Resolution Path</h2>
        <p class="text-[var(--ink-muted)] leading-relaxed">${escapeHtml(term.whoSolves?.en || term.whoSolves?.tr || '')}</p>
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

  const trPage = {
    dir: `sozluk/${term.slug}`,
    title: formatPageTitle(`${term.title} Nedir?`),
    h1: `${term.title} Nedir?`,
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
    h1: `What is ${term.titleEn || term.title}?`,
    description: `${(term.titleEn || term.title).split(' (')[0]}: ${term.shortDef.en || term.shortDef.tr}`,
    canonical: `https://trendmasterakademi.com/glossary/${term.slug}/`,
    ogUrl: `https://trendmasterakademi.com/glossary/${term.slug}/`,
    hreflangTr: `https://trendmasterakademi.com/sozluk/${term.slug}/`,
    hreflangEn: `https://trendmasterakademi.com/glossary/${term.slug}/`,
    heading: term.titleEn || term.title,
    subheading: `${term.shortDef.en || term.shortDef.tr} ${term.agencyImpact?.en || term.agencyImpact?.tr || ''}`,
    extraContent: enExtraContent,
    schema
  };

  return [trPage, enPage];
});

const diagnosticLogEnMap = {
  // ayni-stok-iki-musteriye-satildi
  "UPDATE products SET stock = stock - 1  ← kontrol ve yazma ayrı": "UPDATE products SET stock = stock - 1  <- check and write separated",
  
  // odeme-alindi-siparis-olusmadi
  "Webhook adresi: 404 / 500 / zaman aşımı": "Webhook endpoint: 404 / 500 / timeout",
  "Ödeme sağlayıcı paneli: callback failed · retry 3/3": "Payment gateway panel: callback failed · retry 3/3",
  "Uygulama log'unda ödeme referansı hiç geçmiyor": "App logs contain no trace of payment reference",
  "HTTP 302 — bildirim yönlendirmeyi takip etmiyor": "HTTP 302 - notification fails to follow redirect",

  // odeme-iki-kez-alindi
  "Aynı ödeme referansıyla iki başarılı işlem": "Two successful charges with identical payment reference",
  "Bildirim log'u: aynı olay kimliği iki kez işlenmiş": "Webhook logs: identical event ID processed twice",
  "Uygulama log'u: iki gönderim, aynı saniye, aynı oturum": "App logs: two submissions, same second, same session",
  "Sağlayıcı panelinde 'duplicate transaction' uyarısı yok": "Payment gateway dashboard shows no duplicate transaction alert",

  // islemler-kilitlendi-sayfa-donuyor
  "Veritabanında uzun süredir açık işlem (idle in transaction)": "Database holds long-running idle in transaction locks",
  "Uygulama log'u: aynı saniyede iki toplu güncelleme": "App logs: two concurrent batch updates in same second",

  // guncelleme-sonrasi-veri-kayboldu
  "Göç log'u: rolled back veya yarıda kesilmiş": "Migration logs: rolled back or interrupted mid-execution",
  "Kayıt sayısı: tablodaki satır sayısı hâlâ eski değerde mi?": "Row count: does table row count still match previous value?",
  "Durum veya silme alanı toplu güncellenmiş mi?": "Were status or soft-delete flags updated in bulk?",

  // deploy-sonrasi-site-bozuldu
  "Yayın kaydı: hangi sürüm, ne zaman, kim tarafından?": "Deployment log: which version, timestamp, deployed by whom?",
  "Yeni hata mesajları yayın saatinde mi başlıyor?": "Do new error signatures correlate with deploy timestamp?",
  "Statik dosyalar eski sürümde kalmış (önbellek)": "Static assets served from stale cache version",
  "Veritabanı göçü yayınla birlikte çalıştı mı?": "Did database migrations execute alongside deploy?",

  // site-500-veriyor-dun-calisiyordu
  "PHP Fatal error / Uncaught Error        ← uygulama log'u": "PHP Fatal error / Uncaught Error        <- application logs",

  // bulut-hesabi-askiya-alindi
  "403 Forbidden  /  sağlayıcının bakım veya askı sayfası": "403 Forbidden / provider maintenance or suspension page",
  "E-posta kutusu: 'Payment failed' · 'Final notice' · 'Account suspended'": "Inbox: 'Payment failed' · 'Final notice' · 'Account suspended'",
  "DNS çözülüyor ama: Connection refused / 502 Bad Gateway": "DNS resolves but: Connection refused / 502 Bad Gateway",

  // yedek-var-sanildi-yedek-yok
  "Yedek klasöründeki son dosyanın tarihi   ← aylar öncesi mi?": "Last backup file timestamp in directory <- months outdated?",
  "Yedek dosya boyutu 0 byte / birkaç KB": "Backup archive size 0 bytes / empty archive",
  "Depolama sağlayıcısı: quota exceeded": "Storage provider: quota exceeded",

  // ssl-suresi-doldu
  "NET::ERR_CERT_DATE_INVALID              ← süre doldu": "NET::ERR_CERT_DATE_INVALID              <- certificate expired",
  "NET::ERR_CERT_COMMON_NAME_INVALID       ← alan adı eşleşmiyor": "NET::ERR_CERT_COMMON_NAME_INVALID       <- hostname mismatch",

  // site-yavasladi-sunucu-bos
  "Sayfa başına veritabanı sorgu sayısı: yüzlerce": "Database queries per page load: hundreds of queries",
  "Yavaş sorgu log'u: aynı sorgu defalarca tekrarlıyor": "Slow query log: identical query repeated dozens of times",
  "Harici servis çağrısı: 2–8 saniye bekleme": "External 3rd-party API call: 2-8s blocking latency",
  "İlk bayt süresi yüksek, indirme hızlı": "Time to First Byte (TTFB) high, download payload fast",

  // entegrasyon-429-veriyor
  "Sağlayıcı paneli: quota exceeded for this period": "Provider dashboard: quota exceeded for this period",

  // sunucu-her-gun-yeniden-baslatiliyor
  "Bellek kullanımı zamanla artıyor, hiç düşmüyor": "Memory consumption climbs steadily without dropping",
  "Süreç yöneticisi: yeniden başlatma sayısı her gün artıyor": "Process manager (PM2): daily restart count increasing",
  "Yanıt süreleri gün içinde giderek uzuyor": "Response latencies degrade progressively during peak hours",

  // testte-calisiyor-canlida-calismiyor
  "Yalnız canlıda 500, testte 200": "Fails with 500 only on production, passes 200 on staging",
  "Kütüphane sürümleri: kilit dosyası var mı, uyuşuyor mu?": "Dependency versions: lockfile present and synchronized?",
  "Permission denied — dosya izni veya yol hatası": "Permission denied - file permissions or path mismatch",

  // her-yeni-ozellik-oncekini-bozuyor
  "Aynı hata kaydının aylar içinde tekrar açılması": "Regression: identical bug ticket reopened across sprints",
  "Test yok, ya da var ama çalıştırılmıyor": "No automated test coverage, or tests skipped in CI",
  "Tek bir dosyanın binlerce satır olması": "God class anti-pattern: single source file spans thousands of lines",
  "Aynı mantığın üç ayrı yerde kopyalanmış olması": "Duplicate logic copy-pasted across multiple modules",

  // yazilimci-gitti-koda-girilemiyor
  "git log -1 --format=%cd            ← son commit ne zaman?": "git log -1 --format=%cd            <- timestamp of last commit?",
  "git log --format='%an' | sort -u   ← koda kaç kişi dokunmuş?": "git log --format='%an' | sort -u   <- how many contributors touched code?",
  "~/.ssh/authorized_keys             ← sunucuya kimin anahtarı var?": "~/.ssh/authorized_keys             <- who has SSH keys to production?",
  "WHOIS + hosting hesabı             ← hangi e-postaya kayıtlı?": "WHOIS + cloud account             <- registered to which email?",

  // domain-hosting-erisimi-yok
  "WHOIS sorgusu → kayıt sahibi e-postası kim?": "WHOIS lookup -> who is registrant contact email?",
  "Hosting / bulut faturası hangi adrese gidiyor?": "Hosting / cloud invoice billed to which address?",
  "DNS kayıtları hangi sağlayıcıda tutuluyor?": "DNS zone authoritative name servers and provider?",
  "Alan adının son kullanma tarihi": "Domain registration expiration date",

  // form-gonderiliyor-mail-gelmiyor
  "Mail kuyruğu: deferred / stuck": "Mail queue: deferred / stuck",
  "Uygulama log'u: 'mail sent'    ← ama teslim edilmedi": "App logs: 'mail sent'    <- but never delivered by MTA",

  // site-aramalarda-gorunmez-oldu
  "Sunucu yanıtı: 5xx veya çok yavaş ilk bayt süresi": "Server response: 5xx errors or excessively slow TTFB",
  "Yönlendirme zinciri: 302 → 302 → 200": "Redirect chain loop: 302 -> 302 -> 200",

  // kucuk-degisiklik-gunler-suruyor
  "Görev süresi: tahmin 2 saat, gerçekleşen 2 gün": "Task duration: 2h estimated, 2 days actual delivery",
  "Kurulum: yeni bir geliştirici projeyi kaç günde çalıştırıyor?": "Onboarding: how many days for new engineer to boot project?",
  "Belge var mı: kurulum notu, mimari şeması, karar kaydı": "Documentation exists: setup guide, architecture schema, ADRs?",
  "Yayın sıklığı: haftada kaç kez canlıya çıkılabiliyor?": "Deploy cadence: how many production releases per week?"
};

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
          ? `\n            <p class="text-[var(--ink-muted)] text-sm"><strong class="text-[var(--ink)]">Sık yapılan yanlış düzeltme:</strong> ${escapeHtml(n.yanlisDuzeltme.tr)}</p>`
          : '';
        return `
          <div class="space-y-2 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] my-4">
            <h3 class="text-lg font-bold text-[var(--accent)]">${escapeHtml(n.harf)} · ${escapeHtml(n.ad?.tr || '')}</h3>
            <p class="text-[var(--ink-muted)] leading-relaxed">${escapeHtml(n.aciklama?.tr || '')}</p>
            <p class="text-[var(--ink-muted)] text-sm"><strong class="text-[var(--ink)]">Ayırt edici test:</strong> ${escapeHtml(testStr)}</p>
            <p class="text-[var(--ink-muted)] text-sm"><strong class="text-[var(--ink)]">Kanıt:</strong> ${escapeHtml(n.kanit?.tr || '')}</p>
            <p class="text-[var(--ink-muted)] text-sm"><strong class="text-[var(--ink)]">Çözüm:</strong> ${escapeHtml(cozumStr)}</p>${yanlisDuzeltmeHtml}
          </div>
        `;
      }).join('\n')
    : '';

  const nedenlerHtmlEn = item.nedenler && item.nedenler.length > 0
    ? item.nedenler.map(n => {
        const testStr = Array.isArray(n.diyagramTest?.en) ? n.diyagramTest.en.join(' ') : (n.diyagramTest?.en || Array.isArray(n.diyagramTest?.tr) ? n.diyagramTest.tr.join(' ') : (n.diyagramTest?.tr || ''));
        const cozumStr = Array.isArray(n.diyagramCozum?.en) ? n.diyagramCozum.en.join(' ') : (n.diyagramCozum?.en || Array.isArray(n.diyagramCozum?.tr) ? n.diyagramCozum.tr.join(' ') : (n.diyagramCozum?.tr || ''));
        const yanlisDuzeltmeHtml = (n.yanlisDuzeltme?.en || n.yanlisDuzeltme?.tr)
          ? `\n            <p class="text-[var(--ink-muted)] text-sm"><strong class="text-[var(--ink)]">Common anti-pattern fix:</strong> ${escapeHtml(n.yanlisDuzeltme.en || n.yanlisDuzeltme.tr)}</p>`
          : '';
        return `
          <div class="space-y-2 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] my-4">
            <h3 class="text-lg font-bold text-[var(--accent)]">${escapeHtml(n.harf)} · ${escapeHtml(n.ad?.en || n.ad?.tr || '')}</h3>
            <p class="text-[var(--ink-muted)] leading-relaxed">${escapeHtml(n.aciklama?.en || n.aciklama?.tr || '')}</p>
            <p class="text-[var(--ink-muted)] text-sm"><strong class="text-[var(--ink)]">Differential test:</strong> ${escapeHtml(testStr)}</p>
            <p class="text-[var(--ink-muted)] text-sm"><strong class="text-[var(--ink)]">Evidence:</strong> ${escapeHtml(n.kanit?.en || n.kanit?.tr || '')}</p>
            <p class="text-[var(--ink-muted)] text-sm"><strong class="text-[var(--ink)]">Resolution:</strong> ${escapeHtml(cozumStr)}</p>${yanlisDuzeltmeHtml}
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
        <p class="text-[var(--ink-muted)] leading-relaxed">${escapeHtml(item.sahadaNasilGorunur.tr)}</p>
      </section>
    `
    : '';

  const sahadaHtmlEn = (item.sahadaNasilGorunur?.en || item.sahadaNasilGorunur?.tr)
    ? `
      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Field Observations</h2>
        <p class="text-[var(--ink-muted)] leading-relaxed">${escapeHtml(item.sahadaNasilGorunur.en || item.sahadaNasilGorunur.tr)}</p>
      </section>
    `
    : '';

  const trExtraContent = `
    <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
      <p class="text-sm font-mono text-[var(--accent)]">Aciliyet: ${escapeHtml(item.aciliyet?.etiket?.tr || '')} · Kategori: ${escapeHtml(item.kirinti?.tr || '')}</p>
${sahadaHtmlTr}
      <section class="space-y-3">
        <h2 class="text-xl font-bold text-[var(--ink)]">Sisteminizde bu satırları görüyorsanız</h2>
        ${logRowsHtmlTr}
        ${item.logNotu?.tr ? `<p class="text-[var(--ink-muted)] text-sm">${escapeHtml(item.logNotu.tr)}</p>` : ''}
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-bold text-[var(--ink)]">Üç olası neden ve ayırt edici testleri</h2>
        ${nedenlerHtmlTr}
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Kim çözer, ne kadar sürer</h2>
        <p class="text-[var(--ink-muted)] leading-relaxed">${escapeHtml(item.kimCozer?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Çözülmezse ne olur</h2>
        <p class="text-[var(--ink-muted)] leading-relaxed">${escapeHtml(item.cozulmezse?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">İlgili terimler ve hizmet</h2>
        ${termsHtmlTr}
        ${serviceHtmlTr}
      </section>
    </section>
  `;

  const enExtraContent = `
    <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
      <p class="text-sm font-mono text-[var(--accent)]">Urgency: ${escapeHtml(item.aciliyet?.etiket?.en || item.aciliyet?.etiket?.tr || '')} · Category: ${escapeHtml(item.kirinti?.en || item.kirinti?.tr || '')}</p>
${sahadaHtmlEn}
      <section class="space-y-3">
        <h2 class="text-xl font-bold text-[var(--ink)]">Observed System Error Signatures</h2>
        ${logRowsHtmlEn}
        ${item.logNotu?.en ? `<p class="text-[var(--ink-muted)] text-sm">${escapeHtml(item.logNotu.en)}</p>` : ''}
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-bold text-[var(--ink)]">Three Potential Root Causes & Differential Tests</h2>
        ${nedenlerHtmlEn}
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Resolution Path & Time to Fix</h2>
        <p class="text-[var(--ink-muted)] leading-relaxed">${escapeHtml(item.kimCozer?.en || item.kimCozer?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Impact If Left Unresolved</h2>
        <p class="text-[var(--ink-muted)] leading-relaxed">${escapeHtml(item.cozulmezse?.en || item.cozulmezse?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Related Concepts & Services</h2>
        ${termsHtmlEn}
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

  const schema = {
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
    schema
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
    schema
  };

  return [trPage, enPage];
});

const postMortemPages = postMortems.flatMap(item => {
  const trExtraContent = `
    <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
      <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] font-mono text-xs text-[var(--ink-muted)] grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><span class="text-[var(--ink-subtle)] block">SEVERITY</span><strong class="text-amber-700">${escapeHtml(item.severity)}</strong></div>
        <div><span class="text-[var(--ink-subtle)] block">KATEGORİ</span><strong class="text-[var(--ink)]">${escapeHtml(item.category?.tr || '')}</strong></div>
        <div><span class="text-[var(--ink-subtle)] block">KESİNTİ SÜRESİ</span><strong class="text-emerald-700">${escapeHtml(item.duration?.tr || '')}</strong></div>
        <div><span class="text-[var(--ink-subtle)] block">TARİH</span><strong class="text-[var(--accent)]">${escapeHtml(resolveText(item.date, 'tr'))}</strong></div>
      </div>

      <div class="p-4 rounded-xl bg-[var(--paper)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] leading-relaxed font-mono">
        <p>${escapeHtml(postMortemDisclosure.detail.tr)}</p>
      </div>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Olay Özeti</h2>
        <p class="text-[var(--ink-muted)] leading-relaxed">${escapeHtml(item.summary?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Etki & Kayıp</h2>
        <p class="text-[var(--ink-muted)] leading-relaxed">${escapeHtml(item.impact?.tr || '')}</p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-bold text-[var(--ink)]">Kronolojik Olay Akışı</h2>
        <ul class="space-y-2 font-mono text-sm bg-[var(--surface)] p-4 rounded-xl border border-[var(--rule)]">
          ${(item.timeline || []).map(t => `
            <li><span class="text-[var(--accent)] font-bold">${escapeHtml(t.time)}</span> · <span class="text-[var(--ink)]">${escapeHtml(t.title?.tr || '')}</span> — <span class="text-[var(--ink-muted)]">${escapeHtml(t.desc?.tr || '')}</span></li>
          `).join('\n          ')}
        </ul>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Kök Neden (5 Whys)</h2>
        <p class="text-[var(--ink-muted)] leading-relaxed whitespace-pre-line">${escapeHtml(item.rootCause?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Uygulanan SWAT Müdahalesi & Hotfix</h2>
        <p class="text-[var(--ink-muted)] leading-relaxed whitespace-pre-line">${escapeHtml(item.tmaHotfix?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Kalıcı Önleyici Tedbirler</h2>
        <p class="text-[var(--ink-muted)] leading-relaxed whitespace-pre-line">${escapeHtml(item.permanentMitigation?.tr || '')}</p>
      </section>

      <div class="mt-8 p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-center space-y-2">
        <p class="text-xs text-[var(--ink-muted)]">
          Tüm teknik incelemeler ve müdahaleler <a href="/nda/" class="text-[var(--accent)] underline hover:text-[var(--accent-hover)]">Gizlilik ve Çalışma Sözleşmesi (NDA)</a> kapsamındadır.
        </p>
      </div>
    </section>
  `;

  const enExtraContent = `
    <section class="space-y-6 mt-6 border-t border-[var(--rule)] pt-6">
      <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] font-mono text-xs text-[var(--ink-muted)] grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><span class="text-[var(--ink-subtle)] block">SEVERITY</span><strong class="text-amber-700">${escapeHtml(item.severity)}</strong></div>
        <div><span class="text-[var(--ink-subtle)] block">CATEGORY</span><strong class="text-[var(--ink)]">${escapeHtml(item.category?.en || '')}</strong></div>
        <div><span class="text-[var(--ink-subtle)] block">DURATION</span><strong class="text-emerald-700">${escapeHtml(item.duration?.en || '')}</strong></div>
        <div><span class="text-[var(--ink-subtle)] block">DATE</span><strong class="text-[var(--accent)]">${escapeHtml(resolveText(item.date, 'en'))}</strong></div>
      </div>

      <div class="p-4 rounded-xl bg-[var(--paper)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] leading-relaxed font-mono">
        <p>${escapeHtml(postMortemDisclosure.detail.en)}</p>
      </div>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Incident Summary</h2>
        <p class="text-[var(--ink-muted)] leading-relaxed">${escapeHtml(item.summary?.en || item.summary?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Business & Technical Impact</h2>
        <p class="text-[var(--ink-muted)] leading-relaxed">${escapeHtml(item.impact?.en || item.impact?.tr || '')}</p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-bold text-[var(--ink)]">Incident Timeline</h2>
        <ul class="space-y-2 font-mono text-sm bg-[var(--surface)] p-4 rounded-xl border border-[var(--rule)]">
          ${(item.timeline || []).map(t => `
            <li><span class="text-[var(--accent)] font-bold">${escapeHtml(t.time)}</span> · <span class="text-[var(--ink)]">${escapeHtml(t.title?.en || t.title?.tr || '')}</span> — <span class="text-[var(--ink-muted)]">${escapeHtml(t.desc?.en || t.desc?.tr || '')}</span></li>
          `).join('\n          ')}
        </ul>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Root Cause Analysis (5 Whys)</h2>
        <p class="text-[var(--ink-muted)] leading-relaxed whitespace-pre-line">${escapeHtml(item.rootCause?.en || item.rootCause?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">TMA SWAT Resolution & Hotfix</h2>
        <p class="text-[var(--ink-muted)] leading-relaxed whitespace-pre-line">${escapeHtml(item.tmaHotfix?.en || item.tmaHotfix?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-[var(--ink)]">Permanent Mitigations</h2>
        <p class="text-[var(--ink-muted)] leading-relaxed whitespace-pre-line">${escapeHtml(item.permanentMitigation?.en || item.permanentMitigation?.tr || '')}</p>
      </section>

      <div class="mt-8 p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-center space-y-2">
        <p class="text-xs text-[var(--ink-muted)]">
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
    h1: `${item.no} · ${item.title?.tr}`,
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
    h1: `${item.no} · ${item.title?.en || item.title?.tr}`,
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
        <nav class="flex flex-wrap gap-4 text-sm font-mono text-[var(--accent)]">
          <a href="/" class="hover:underline">${page.lang === 'en' ? 'Home' : 'Ana Sayfa'}</a>
          <a href="/agency/" class="hover:underline">${page.lang === 'en' ? 'Capacity & Infrastructure' : 'Kapasite & Altyapı'}</a>
          <a href="${page.lang === 'en' ? '/agency-kit/' : '/kit/'}" class="hover:underline">${page.lang === 'en' ? 'Agency Kit' : 'Ajans Kiti'}</a>
          <a href="/crash-test/" class="hover:underline">${page.lang === 'en' ? 'Crash Test (60s)' : 'Crash Test (60sn)'}</a>
          <a href="${page.lang === 'en' ? '/handover-audit/' : '/devir-kontrolu/'}" class="hover:underline">${page.lang === 'en' ? 'Handover Audit' : 'Devir Kontrolü'}</a>
          <a href="${page.lang === 'en' ? '/diagnostic/' : '/teshis/'}" class="hover:underline">${page.lang === 'en' ? 'Diagnostic Catalog' : 'Teşhis Kataloğu'}</a>
          <a href="${page.lang === 'en' ? '/salvageability/' : '/kurtarilabilirlik/'}" class="hover:underline">${page.lang === 'en' ? 'Salvageability Index' : 'Kurtarılabilirlik İndeksi'}</a>
          <a href="${page.lang === 'en' ? '/post-mortems/' : '/post-mortem/'}" class="hover:underline">${page.lang === 'en' ? 'Post-Mortem & RCA' : 'Post-Mortem & RCA'}</a>
          <a href="${page.lang === 'en' ? '/triage/' : '/triyaj/'}" class="hover:underline">${page.lang === 'en' ? 'Triage Simulator' : 'Triyaj Simülatörü'}</a>
          <a href="/sla/" class="hover:underline">${page.lang === 'en' ? 'SLA & Commitments' : 'SLA & Taahhütler'}</a>
          <a href="${page.lang === 'en' ? '/tech-matrix/' : '/teknoloji-uyumluluk/'}" class="hover:underline">${page.lang === 'en' ? 'Tech Matrix' : 'Teknoloji Matrisi'}</a>
          <a href="${page.lang === 'en' ? '/mutual-nda/' : '/gizlilik-sozlesmesi/'}" class="hover:underline">${page.lang === 'en' ? 'Mutual NDA' : 'Gizlilik Sözleşmesi'}</a>
          <a href="/nda/" class="hover:underline">${page.lang === 'en' ? 'Confidentiality and Engagement Agreement' : 'Gizlilik ve Çalışma Sözleşmesi'}</a>
          <a href="${page.lang === 'en' ? '/outage-simulator/' : '/hasar-tespiti/'}" class="hover:underline">${page.lang === 'en' ? 'Damage Simulator' : 'Hasar Simülatörü'}</a>
          <a href="/radar/" class="hover:underline">${page.lang === 'en' ? 'Status Radar' : 'SWAT Radarı'}</a>
          <a href="${page.lang === 'en' ? '/codebase-health/' : '/kod-sagligi/'}" class="hover:underline">${page.lang === 'en' ? 'Codebase Health' : 'Kod Sağlığı'}</a>
          <a href="${page.lang === 'en' ? '/rescue-roi/' : '/kurtarma-maliyeti/'}" class="hover:underline">${page.lang === 'en' ? 'Rescue ROI' : 'Kurtarma ROI'}</a>
          <a href="${page.lang === 'en' ? '/downtime-calc/' : '/kesinti-maliyeti/'}" class="hover:underline">${page.lang === 'en' ? 'Downtime Calculator' : 'Kesinti Maliyeti'}</a>
          <a href="${page.lang === 'en' ? '/glossary/' : '/sozluk/'}" class="hover:underline">${page.lang === 'en' ? 'Technical Glossary' : 'Teknik Sözlük'}</a>
          <a href="${page.lang === 'en' ? '/story/' : '/hikayemiz/'}" class="hover:underline">${page.lang === 'en' ? 'Our Story' : 'Hikayemiz'}</a>
          <a href="/sos/" class="hover:underline">${page.lang === 'en' ? 'Emergency Support' : 'Acil Teknik Destek'}</a>
          <a href="/about/" class="hover:underline">${page.lang === 'en' ? 'About Us' : 'Hakkımızda'}</a>
          <a href="/privacy/" class="hover:underline">${page.lang === 'en' ? 'Privacy Policy' : 'KVKK & Gizlilik'}</a>
        </nav>
      </header>
      <main class="space-y-6">
        ${page.heading ? `<h2 class="text-2xl font-bold text-[var(--ink)]">${page.heading}</h2>` : ''}
        <p class="text-[var(--ink-muted)] text-lg leading-relaxed">${page.subheading}</p>
        ${page.extraContent || ''}
        <section class="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-2 mt-6">
          <h3 class="text-base font-bold text-[var(--accent)]">Trend Master Akademi Studio & Labs</h3>
          <p class="text-sm text-[var(--ink-muted)]">${page.lang === 'en' ? 'B2B White-Label Engineering Desk' : 'B2B White-Label Mühendislik Masası'} | Tel: <a href="tel:+905343713573" class="text-[var(--ink)]">+90 534 371 35 73</a> | ${page.lang === 'en' ? 'Email:' : 'E-posta:'} <a href="mailto:info@trendmasterakademi.com" class="text-[var(--ink)]">info@trendmasterakademi.com</a></p>
          <p class="text-xs text-[var(--ink-muted)]">${page.lang === 'en' ? 'Address: Akdeniz Mah. Sehit Fethibey Cad. Heris Tower No: 55 Ic Kapi No: 091 Konak / Izmir' : 'Adres: Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091 Konak / İzmir'}</p>
        </section>
      </main>
    </div>
  `;

  html = html.replace(/<div id="root">[\s\S]*?<\/body>/i, `<div id="root">${semanticBlock}</div>\n  </body>`);

  const destFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(destFile, html, 'utf8');
  console.log(`Generated: ${page.dir}/index.html (200 OK static page ready)`);
});

console.log(`All ${pages.length} static sub-pages generated successfully!`);

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

// Build guard: SEO & HTML integrity verification
function verifySeoAndHtmlIntegrity() {
  const forbidden = ['[object Object]', 'undefined', 'NaN', '>null<', '{tr', '{en'];
  let errors = [];

  const canonicalPages = pages.filter(p => p.dir !== 'gizlilik');
  const seenTitles = new Map();
  const seenDescs = new Map();

  if (canonicalPages.length !== 109) {
    errors.push(`Expected exactly 109 canonical pages, found ${canonicalPages.length}`);
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
      if (seenTitles.has(title)) {
        errors.push(`Duplicate title "${title}" found in ${page.canonical} and ${seenTitles.get(title)}`);
      } else {
        seenTitles.set(title, page.canonical);
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
        // Strip company name, founder name, address
        contentToCheck = contentToCheck
          .replace(/Trend Master Akademi/g, '')
          .replace(/Mehmet Şahin/g, '')
          .replace(/Akdeniz Mah\..*?İzmir/g, '')
          .replace(/Akdeniz Mah\..*?Izmir/g, '')
          .replace(/Şehit Fethibey/g, '')
          .replace(/İç Kapı/g, '')
          .replace(/İzmir/g, '');

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

  console.log(`[BUILD GUARD] All 109 pages passed SEO & HTML integrity verification!`);
}

verifySeoAndHtmlIntegrity();


