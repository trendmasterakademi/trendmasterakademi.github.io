import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { glossaryTerms } from './src/data/glossaryData.js';
import { teshisData } from './src/data/teshisData.js';

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

// 3.4 — HTML Kaçış Fonksiyonu (Yalnızca HTML gövdesi için)
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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
  "logo": "https://trendmasterakademi.com/favicon.svg",
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
          "description": "HTTP 500 hataları, veritabanı kilitlenmeleri ve ödeme API kopmalarında 0-2 saat içinde acil müdahale."
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
  <section class="space-y-6 mt-6 border-t border-white/10 pt-6">
    <h2 class="text-xl font-bold text-white">Yayınlanmış arıza kataloğu — 20 teşhis</h2>
    <ul class="space-y-4">
      ${teshisData.map(item => {
        const firstSentence = item.ozet?.tr ? (item.ozet.tr.split('.')[0] + '.') : '';
        return `
        <li class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <a href="/teshis/${escapeHtml(item.slug)}/" class="text-cyan-300 font-bold hover:underline font-mono text-base">→ ${escapeHtml(item.no)} · ${escapeHtml(item.baslik?.tr || '')}</a>
            <span class="text-xs font-mono text-slate-400">${escapeHtml(item.aciliyet?.etiket?.tr || '')} · ${escapeHtml(item.kirinti?.tr || '')}</span>
          </div>
          <p class="text-sm text-slate-300 leading-relaxed">${escapeHtml(firstSentence)}</p>
        </li>`;
      }).join('\n      ')}
    </ul>
  </section>
`;

// 2.2 — /sozluk/ Sözlük Hub'ı İçeriği (12 Terim)
const glossaryHubExtraContent = `
  <section class="space-y-6 mt-6 border-t border-white/10 pt-6">
    <h2 class="text-xl font-bold text-white">Terim sözlüğü — 12 terim</h2>
    <ul class="space-y-4">
      ${glossaryTerms.map(term => {
        const firstSentence = term.shortDef?.tr ? (term.shortDef.tr.split('.')[0] + '.') : '';
        return `
        <li class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <a href="/sozluk/${escapeHtml(term.slug)}/" class="text-cyan-300 font-bold hover:underline font-mono text-base">→ ${escapeHtml(term.title)}</a>
            <span class="text-xs font-mono text-amber-400">${escapeHtml(term.urgencyLevel || '')}</span>
          </div>
          <p class="text-sm text-slate-300 leading-relaxed">${escapeHtml(firstSentence)}</p>
        </li>`;
      }).join('\n      ')}
    </ul>
  </section>
`;

// 2.3 — Ana Sayfa Şerit Log Eşleşmeleri (Hero.jsx'ten okunan 8 kayıt)
const homePageExtraContent = `
  <section class="space-y-6 mt-6 border-t border-white/10 pt-6">
    <h2 class="text-xl font-bold text-white">Sisteminizde bu satırları görüyorsanız</h2>
    <ul class="space-y-3">
      ${diagnosticLogs.map(entry => {
        const slug = entry.href.replace(/^\/teshis\/|\/$/g, '');
        const item = teshisData.find(d => d.slug === slug);
        const titleText = item ? `${item.no} · ${item.baslik.tr}` : (entry.title?.tr || slug);
        return `
        <li class="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1 font-mono text-sm">
          <div class="text-slate-400"><code>${escapeHtml(entry.log)}</code></div>
          <div><a href="/teshis/${escapeHtml(slug)}/" class="text-cyan-300 hover:underline font-bold">→ ${escapeHtml(titleText)}</a></div>
        </li>`;
      }).join('\n      ')}
    </ul>
    <p class="pt-2">
      <a href="/teshis/" class="text-cyan-400 hover:underline font-bold">Tüm teşhis kataloğunu inceleyin (20 belirti) →</a>
    </p>
  </section>
`;

const basePages = [
  {
    dir: '',
    title: 'Trend Master Akademi | B2B Technical SWAT & White-Label Engineering',
    h1: 'Trend Master Akademi - B2B Technical SWAT & White-Label Engineering Studio',
    description: 'Dijital ajanslar ve teknoloji şirketleri için B2B White-Label Mühendislik Masası, Acil Kod Kurtarma (SWAT), SaaS Mimarisi ve Kriz Çözüm Stüdyosu.',
    canonical: 'https://trendmasterakademi.com/',
    ogUrl: 'https://trendmasterakademi.com/',
    heading: 'Teknik olarak projesi tıkanmış ajanslar için: Kodu Devralır, Ajansınız Adına Eksiksiz Teslim Ederiz.',
    subheading: 'Dijital ajanslar ve teknoloji şirketleri için B2B White-Label Mühendislik Masası, Acil Kod Kurtarma (SWAT), PostgreSQL Deadlock Onarımı, SaaS Mimarisi ve 7/24 Kriz Çözüm Stüdyosu.',
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
    title: 'Ajans Çözümleri & B2B White-Label Mühendislik Masası | Trend Master Akademi',
    h1: 'Ajans Çözümleri & B2B Mühendislik Masası',
    description: 'Dijital ajansların görünmez teknik gücü: %100 White-Label, resmi NDA güvencesi, 20+ teknik yetkinlik, acil kriz masası ve kıdemli mühendislik takviyesi.',
    canonical: 'https://trendmasterakademi.com/agency/',
    ogUrl: 'https://trendmasterakademi.com/agency/',
    heading: 'Ajansınızın Yerine Değil, Ajansınızın Yanında Güvenilir Mühendislik Masası.',
    subheading: 'Bir projede teknik olarak tıkandığınızda, teslim tarihi yaklaştığında veya ekibinizin kapasitesi dolduğunda: %100 White-Label, resmi NDA ve doğrudan kıdemli mühendislik desteği.',
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
    dir: 'crash-test',
    title: 'Agency Crash Test (60sn) - Kriz & Risk Simülatörü | Trend Master Akademi',
    h1: 'Agency Crash Test (60sn)',
    description: 'Ajansınız teknik bir krize hazır mı? HTTP 500 kesintisi, geliştirici ani ayrılığı veya T-48H lansman darboğazı için 60 saniyede risk skorunuzu ve eylem planınızı görün.',
    canonical: 'https://trendmasterakademi.com/crash-test/',
    ogUrl: 'https://trendmasterakademi.com/crash-test/',
    heading: 'Agency Crash Test // 60 Saniyede Ajans Kriz Dayanıklılık Skoru',
    subheading: 'Kritik kod kilitlenmeleri, devir süreçleri tıkanmış projeler veya yaklaşan teslimat baskısı altında ajansınızın risk puanını ölçün.',
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
    title: 'Devir Hazırlık Kontrolü (12 Kalem) - Yazılımcı Ayrılık Riski | Trend Master Akademi',
    h1: 'Devir Hazırlık Kontrolü',
    description: 'Yazılımcınız ayrılıyor veya ayrıldı mı? 12 kritik kalemi kontrol edin, devir risk skorunuzu ve eksik envanterinizi 60 saniyede ücretsiz analiz edin.',
    canonical: 'https://trendmasterakademi.com/devir-kontrolu/',
    ogUrl: 'https://trendmasterakademi.com/devir-kontrolu/',
    heading: 'Devir Hazırlık Kontrolü // 12 Kalemlik Geliştirici Ayrılık Denetimi',
    subheading: 'Git repo, ortam değişkenleri, DNS ve ödeme anahtarlarınızı ayrılan geliştiriciden eksiksiz devralıp almadığınızı test edin.',
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
    dir: 'sozluk',
    title: 'Yazılımcı Dili → Ajans Dili Teknik Terim Sözlüğü | Trend Master Akademi',
    h1: 'Teknik Terim Sözlüğü',
    description: 'Yazılımcınız teknik bir bahane sunduğunda ne anlama geldiğini öğrenin. Deadlock, N+1, Race Condition, Webhook ve 12 temel terimin iş etkisi ve çözümü.',
    canonical: 'https://trendmasterakademi.com/sozluk/',
    ogUrl: 'https://trendmasterakademi.com/sozluk/',
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
    dir: 'kesinti-maliyeti',
    title: 'Web Sitesi Kesinti Maliyeti Hesaplayıcı (Downtime Calculator) | Trend Master Akademi',
    h1: 'Kesinti Maliyeti Hesaplayıcı',
    description: 'Sunucu çökmesi veya HTTP 500 kesintisinde saatlik ve toplam tahmini ciro kaybınızı hesaplayın. Şeffaf matematik ve kurtarma ROI analizi.',
    canonical: 'https://trendmasterakademi.com/kesinti-maliyeti/',
    ogUrl: 'https://trendmasterakademi.com/kesinti-maliyeti/',
    heading: 'Web Sitesi & API Kesinti Maliyeti Hesaplayıcı',
    subheading: 'Sistem çöktüğünde geçen her dakikanın ajansınıza ve müşterinize gerçek finansal ve itibar maliyetini hesaplayın.',
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
    dir: 'about',
    title: 'Mühendislik Standartlarımız & Hakkımızda | Trend Master Akademi',
    h1: 'Mühendislik Standartlarımız & Hakkımızda',
    description: 'Trend Master Akademi mühendislik standartları, 4 temel prensip ve B2B SWAT vizyonu.',
    canonical: 'https://trendmasterakademi.com/about/',
    ogUrl: 'https://trendmasterakademi.com/about/',
    heading: 'Ajansların Güvendiği Arka Plan Mühendislik Masası',
    subheading: 'Modern web, SaaS, API mimarileri ve acil kod kurtarma (SWAT) stüdyosu.',
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
    subheading: 'Aslında bu iş fikri bir online derste doğdu.',
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
    dir: 'privacy',
    title: 'KVKK Aydınlatma Metni & Gizlilik Politikası | Trend Master Akademi',
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
    title: 'KVKK Aydınlatma Metni & Gizlilik Politikası | Trend Master Akademi',
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
  }
];

// 3.3 — Add each glossary term page dynamically with extraContent and schema
const glossaryPages = glossaryTerms.map(term => {
  const matching = teshisData.filter(d => d.ilgiliTerimler && d.ilgiliTerimler.includes(term.slug));
  const visible = matching.slice(0, 4);
  const remaining = matching.length - 4;
  
  let reverseBlock = '';
  if (matching.length > 0) {
    reverseBlock = `
      <section class="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 mt-6">
        <h2 class="text-xl font-bold text-white">Bu terim şu belirtilerde çıkar</h2>
        <ul class="space-y-2 font-mono text-sm text-cyan-300">
          ${visible.map(d => `<li><a href="/teshis/${escapeHtml(d.slug)}/" class="hover:underline">→ ${escapeHtml(d.no)} · ${escapeHtml(d.baslik.tr)}</a></li>`).join('\n          ')}
        </ul>
        ${remaining > 0 ? `<p class="text-xs text-slate-400 pt-1"><a href="/teshis/" class="text-cyan-400 hover:underline">ve ${remaining} teşhis daha →</a></p>` : ''}
      </section>
    `;
  }

  const relatedTermsHtml = term.relatedTerms && term.relatedTerms.length > 0
    ? `
      <ul class="space-y-1 font-mono text-sm text-cyan-300 my-3">
        ${term.relatedTerms.map(rSlug => {
          const rObj = glossaryTerms.find(g => g.slug === rSlug);
          const rTitle = rObj ? rObj.title : rSlug;
          return `<li><a href="/sozluk/${escapeHtml(rSlug)}/" class="hover:underline">→ ${escapeHtml(rTitle)}</a></li>`;
        }).join('\n        ')}
      </ul>
    `
    : '';

  const relatedServiceHtml = term.relatedService
    ? `<p class="pt-2"><a href="${escapeHtml(term.relatedService.link)}" class="text-cyan-400 hover:underline font-bold">→ ${escapeHtml(term.relatedService.title)}</a></p>`
    : '';

  const mainGlossaryContent = `
    <section class="space-y-6 mt-6 border-t border-white/10 pt-6">
      ${term.urgencyLevel ? `<p class="text-sm font-mono text-cyan-400">Aciliyet: ${escapeHtml(term.urgencyLevel)}</p>` : ''}

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-white">Tanım</h2>
        <p class="text-slate-300 leading-relaxed">${escapeHtml(term.shortDef?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-white">Ajans için ne anlama gelir</h2>
        <p class="text-slate-300 leading-relaxed">${escapeHtml(term.agencyImpact?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-white">Kim çözer</h2>
        <p class="text-slate-300 leading-relaxed">${escapeHtml(term.whoSolves?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-white">İlgili terimler</h2>
        ${relatedTermsHtml}
        ${relatedServiceHtml}
      </section>
    </section>
  `;

  const extraContent = `${mainGlossaryContent}\n${reverseBlock}`;

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

  return {
    dir: `sozluk/${term.slug}`,
    title: `${term.title} Nedir? Ajanslar İçin Teknik Rehber | Trend Master Akademi`,
    h1: `${term.title} Nedir?`,
    description: `${term.title}: ${term.shortDef.tr}`,
    canonical: `https://trendmasterakademi.com/sozluk/${term.slug}/`,
    ogUrl: `https://trendmasterakademi.com/sozluk/${term.slug}/`,
    heading: term.title,
    subheading: `${term.shortDef.tr} ${term.agencyImpact.tr}`,
    extraContent,
    schema
  };
});

// 3.1 & 3.2 — Add each diagnostic page dynamically with full extraContent and schema
const teshisPages = teshisData.map(item => {
  const logRowsHtml = item.logSatirlari && item.logSatirlari.length > 0
    ? `
      <ul class="space-y-2 font-mono text-sm bg-black/40 p-4 rounded-xl border border-white/10 my-3">
        ${item.logSatirlari.map((log, idx) => {
          const eslesme = item.logEslesme?.find(e => e.satir === idx && e.harf);
          const neden = eslesme ? item.nedenler?.find(n => n.harf === eslesme.harf) : null;
          const badgeHtml = neden ? ` <span>→ ${escapeHtml(eslesme.harf)} · ${escapeHtml(neden.ad?.tr || '')}</span>` : '';
          return `<li><code>${escapeHtml(log)}</code>${badgeHtml}</li>`;
        }).join('\n        ')}
      </ul>
    `
    : '';

  const nedenlerHtml = item.nedenler && item.nedenler.length > 0
    ? item.nedenler.map(n => {
        const testStr = Array.isArray(n.diyagramTest?.tr) ? n.diyagramTest.tr.join(' ') : (n.diyagramTest?.tr || '');
        const cozumStr = Array.isArray(n.diyagramCozum?.tr) ? n.diyagramCozum.tr.join(' ') : (n.diyagramCozum?.tr || '');
        return `
          <div class="space-y-2 p-5 rounded-2xl bg-white/5 border border-white/10 my-4">
            <h3 class="text-lg font-bold text-cyan-300">${escapeHtml(n.harf)} · ${escapeHtml(n.ad?.tr || '')}</h3>
            <p class="text-slate-300 leading-relaxed">${escapeHtml(n.aciklama?.tr || '')}</p>
            <p class="text-slate-300 text-sm"><strong class="text-white">Ayırt edici test:</strong> ${escapeHtml(testStr)}</p>
            <p class="text-slate-300 text-sm"><strong class="text-white">Kanıt:</strong> ${escapeHtml(n.kanit?.tr || '')}</p>
            <p class="text-slate-300 text-sm"><strong class="text-white">Çözüm:</strong> ${escapeHtml(cozumStr)}</p>
          </div>
        `;
      }).join('\n')
    : '';

  const termsHtml = item.ilgiliTerimler && item.ilgiliTerimler.length > 0
    ? `
      <ul class="space-y-1 font-mono text-sm text-cyan-300 my-3">
        ${item.ilgiliTerimler.map(tSlug => {
          const tObj = glossaryTerms.find(g => g.slug === tSlug);
          const tTitle = tObj ? tObj.title : tSlug;
          return `<li><a href="/sozluk/${escapeHtml(tSlug)}/" class="hover:underline">→ ${escapeHtml(tTitle)}</a></li>`;
        }).join('\n        ')}
      </ul>
    `
    : '';

  const serviceHtml = item.ilgiliHizmet
    ? `<p class="pt-2"><a href="${escapeHtml(item.ilgiliHizmet.link)}" class="text-cyan-400 hover:underline font-bold">→ ${escapeHtml(item.ilgiliHizmet.baslik?.tr || '')}</a></p>`
    : '';

  const extraContent = `
    <section class="space-y-6 mt-6 border-t border-white/10 pt-6">
      <p class="text-sm font-mono text-cyan-400">Aciliyet: ${escapeHtml(item.aciliyet?.etiket?.tr || '')} · Kategori: ${escapeHtml(item.kirinti?.tr || '')}</p>

      <section class="space-y-3">
        <h2 class="text-xl font-bold text-white">Sisteminizde bu satırları görüyorsanız</h2>
        ${logRowsHtml}
        ${item.logNotu?.tr ? `<p class="text-slate-300 text-sm">${escapeHtml(item.logNotu.tr)}</p>` : ''}
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-bold text-white">Üç olası neden ve ayırt edici testleri</h2>
        ${nedenlerHtml}
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-white">Kim çözer, ne kadar sürer</h2>
        <p class="text-slate-300 leading-relaxed">${escapeHtml(item.kimCozer?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-white">Çözülmezse ne olur</h2>
        <p class="text-slate-300 leading-relaxed">${escapeHtml(item.cozulmezse?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-white">İlgili terimler ve hizmet</h2>
        ${termsHtml}
        ${serviceHtml}
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

  return {
    dir: `teshis/${item.slug}`,
    title: `${item.baslik.tr} | Trend Master Akademi`,
    h1: item.baslik.tr,
    description: item.ozet.tr.split('.')[0] + '.',
    canonical: `https://trendmasterakademi.com/teshis/${item.slug}/`,
    ogUrl: `https://trendmasterakademi.com/teshis/${item.slug}/`,
    subheading: item.ozet.tr,
    extraContent,
    schema
  };
});

const pages = [...basePages, ...glossaryPages, ...teshisPages];

pages.forEach(page => {
  const targetDir = path.join(distDir, page.dir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  let html = template;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${page.title}</title>`);
  
  // Replace Meta Description
  html = html.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${page.description}" />`);
  
  // Replace Canonical
  html = html.replace(/<link rel="canonical" href=".*?" \/>/i, `<link rel="canonical" href="${page.canonical}" />`);
  
  // Replace OpenGraph Title & URL
  html = html.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${page.title}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${page.ogUrl}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${page.description}" />`);
  html = html.replace(/<meta property="og:image" content=".*?" \/>/i, `<meta property="og:image" content="https://trendmasterakademi.com/og-image.jpg" />`);

  // Replace Twitter Title & URL
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${page.title}" />`);
  html = html.replace(/<meta name="twitter:url" content=".*?" \/>/i, `<meta name="twitter:url" content="${page.ogUrl}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${page.description}" />`);
  html = html.replace(/<meta name="twitter:image" content=".*?" \/>/i, `<meta name="twitter:image" content="https://trendmasterakademi.com/og-image.jpg" />`);

  // Clean Hreflang for this specific page (Self-referencing tr and x-default, NO en)
  html = html.replace(/<link rel="alternate" hreflang="tr" href=".*?" \/>/i, `<link rel="alternate" hreflang="tr" href="${page.canonical}" />`);
  html = html.replace(/<link rel="alternate" hreflang="x-default" href=".*?" \/>/i, `<link rel="alternate" hreflang="x-default" href="${page.canonical}" />`);
  html = html.replace(/<link rel="alternate" hreflang="en" href=".*?" \/>\s*/i, '');

  // Replace JSON-LD Structured Data for this specific page
  if (page.schema) {
    const jsonLdString = JSON.stringify(page.schema, null, 2).replace(/<\/script>/gi, '<\\/script>');
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, `<script type="application/ld+json">\n${jsonLdString}\n    </script>`);
  }

  // Ensure Pre-rendered Semantic HTML is visible & corporate branded with distinct h1
  const semanticBlock = `
    <div class="ssr-pre-render p-6 sm:p-12 max-w-5xl mx-auto text-slate-200 font-sans">
      <header class="mb-8 border-b border-white/10 pb-6">
        <h1 class="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">${page.h1}</h1>
        <nav class="flex flex-wrap gap-4 text-sm font-mono text-cyan-400">
          <a href="/" class="hover:underline">Ana Sayfa</a>
          <a href="/agency/" class="hover:underline">Ajans Çözümleri</a>
          <a href="/crash-test/" class="hover:underline">Crash Test (60sn)</a>
          <a href="/devir-kontrolu/" class="hover:underline">Devir Kontrolü</a>
          <a href="/teshis/" class="hover:underline">Teşhis Kataloğu</a>
          <a href="/kesinti-maliyeti/" class="hover:underline">Kesinti Maliyeti</a>
          <a href="/about/" class="hover:underline">Hakkımızda</a>
          <a href="/privacy/" class="hover:underline">KVKK & Gizlilik</a>
        </nav>
      </header>
      <main class="space-y-6">
        ${page.heading ? `<h2 class="text-2xl font-bold text-white">${page.heading}</h2>` : ''}
        <p class="text-slate-300 text-lg leading-relaxed">${page.subheading}</p>
        ${page.extraContent || ''}
        <section class="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2 mt-6">
          <h3 class="text-base font-bold text-cyan-300">Trend Master Akademi Studio & Labs</h3>
          <p class="text-sm text-slate-400">B2B White-Label Mühendislik Masası | Tel: <a href="tel:+905343713573" class="text-white">+90 534 371 35 73</a> | E-posta: <a href="mailto:info@trendmasterakademi.com" class="text-white">info@trendmasterakademi.com</a></p>
          <p class="text-xs text-slate-400">Adres: Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091 Konak / İzmir</p>
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

// B3 — sitemap.xml <lastmod> güncellemesi (git tarihlerinden)
const sitemapPageSourceMap = {
  'https://trendmasterakademi.com/': 'v2-draft/src/pages/Home.jsx',
  'https://trendmasterakademi.com/agency/': 'v2-draft/src/pages/Agency.jsx',
  'https://trendmasterakademi.com/crash-test/': 'v2-draft/src/pages/CrashTest.jsx',
  'https://trendmasterakademi.com/devir-kontrolu/': 'v2-draft/src/pages/DevirKontrolu.jsx',
  'https://trendmasterakademi.com/sozluk/': 'v2-draft/src/data/glossaryData.js',
  'https://trendmasterakademi.com/kesinti-maliyeti/': 'v2-draft/src/pages/KesintiMaliyeti.jsx',
  'https://trendmasterakademi.com/about/': 'v2-draft/src/pages/About.jsx',
  'https://trendmasterakademi.com/hikayemiz/': 'v2-draft/src/pages/Story.jsx',
  'https://trendmasterakademi.com/privacy/': 'v2-draft/src/pages/Privacy.jsx',
  'https://trendmasterakademi.com/gizlilik/': 'v2-draft/src/pages/Privacy.jsx',
  'https://trendmasterakademi.com/nda/': 'v2-draft/src/pages/Nda.jsx',
  'https://trendmasterakademi.com/teshis/': 'v2-draft/src/data/teshisData.js'
};

for (const term of glossaryTerms) {
  sitemapPageSourceMap[`https://trendmasterakademi.com/sozluk/${term.slug}/`] = 'v2-draft/src/data/glossaryData.js';
}

for (const item of teshisData) {
  sitemapPageSourceMap[`https://trendmasterakademi.com/teshis/${item.slug}/`] = `v2-draft/src/data/teshis/${item.slug}.js`;
}

function updateSitemapLastmod() {
  const publicSitemapPath = path.join(__dirname, 'public/sitemap.xml');
  const distSitemapPath = path.join(__dirname, 'dist/sitemap.xml');
  const rootSitemapPath = path.join(repoRoot, 'sitemap.xml');

  if (!fs.existsSync(publicSitemapPath)) {
    console.warn('[SITEMAP WARNING] public/sitemap.xml not found');
    return;
  }

  let content = fs.readFileSync(publicSitemapPath, 'utf8');
  let updatedCount = 0;

  content = content.replace(/<url>([\s\S]*?)<\/url>/g, (match, urlInner) => {
    const locMatch = urlInner.match(/<loc>(.*?)<\/loc>/);
    if (!locMatch) return match;
    const loc = locMatch[1].trim();
    const sourceFile = sitemapPageSourceMap[loc];
    if (!sourceFile) return match;

    const dates = getGitDates(sourceFile);
    if (!dates.dateModified) return match;

    const lastmodDate = dates.dateModified.slice(0, 10);
    updatedCount++;
    return match.replace(/<lastmod>.*?<\/lastmod>/, `<lastmod>${lastmodDate}</lastmod>`);
  });

  fs.writeFileSync(publicSitemapPath, content, 'utf8');
  if (fs.existsSync(distSitemapPath)) {
    fs.writeFileSync(distSitemapPath, content, 'utf8');
  }
  if (fs.existsSync(rootSitemapPath)) {
    fs.writeFileSync(rootSitemapPath, content, 'utf8');
  }
  console.log(`sitemap.xml updated with git lastmod dates (${updatedCount} URLs)`);
}

updateSitemapLastmod();
