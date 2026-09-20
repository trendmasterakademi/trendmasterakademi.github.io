import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { glossaryTerms } from './src/data/glossaryData.js';
import { teshisData } from './src/data/teshisData.js';
import { postMortems } from './src/data/postMortemData.js';
import { triageScenarios } from './src/data/triageData.js';
import { slaTiers, coreCommitments } from './src/data/slaData.js';
import { techStackData } from './src/data/techStackData.js';
import { ndaData } from './src/data/ndaData.js';
import { outageSimulatorData } from './src/data/outageSimulatorData.js';
import { radarData } from './src/data/radarData.js';
import { codeHealthData } from './src/data/codeHealthData.js';
import { rescueRoiData } from './src/data/rescueRoiData.js';

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

// 2.3 — Ana Sayfa Şerit Log Eşleşmeleri ve SSS Bölümü (Hero.jsx ve FAQ.jsx'ten okunan veriler)
const homeFaqHtml = `
  <section class="space-y-4 mt-8 border-t border-white/10 pt-6">
    <h2 class="text-xl font-bold text-white">Sıkça Sorulan Sorular</h2>
    <div class="space-y-4">
      ${faqData.map(item => `
        <div class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <h3 class="text-lg font-bold text-cyan-300">${escapeHtml(item.question?.tr || '')}</h3>
          <p class="text-slate-300 leading-relaxed text-sm sm:text-base">${escapeHtml(item.answer?.tr || '')}</p>
        </div>
      `).join('\n      ')}
    </div>
  </section>
`;

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
  ${homeFaqHtml}
`;

const aboutExtraContent = `
  <section class="space-y-6 mt-8 border-t border-white/10 pt-6">
    <h2 class="text-2xl font-bold text-white tracking-tight">Dört Temel Mühendislik Standardımız</h2>
    <p class="text-slate-300 leading-relaxed">Ajanslarla çalışırken taviz vermediğimiz 5 temel operasyonel ve hukuki kuralımız:</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
      <div class="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <h3 class="text-lg font-bold text-cyan-300">01 · %100 White-Label & Görünmezlik</h3>
        <p class="text-slate-300 text-sm leading-relaxed">Müşteriniz hiçbir zaman bizim adımızı duymaz. Projeler ajansınızın markası, logosu ve kurumsal kimliği altında teslim edilir. İletişim isterseniz ajans alan adı e-postanız üzerinden yürütülür.</p>
      </div>

      <div class="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <h3 class="text-lg font-bold text-emerald-300">02 · Resmi NDA & Fikri Mülkiyet Devri</h3>
        <p class="text-slate-300 text-sm leading-relaxed">Projeye başlamadan önce bağlayıcı Gizlilik Sözleşmesi (NDA) imzalanır. Geliştirilen tüm kaynak kodlar, mimari ve fikri mülkiyet %100 ajansınıza ve müşterinize aittir. <a href="/nda/" class="text-cyan-400 hover:underline">Sözleşmeyi inceleyin →</a></p>
      </div>

      <div class="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <h3 class="text-lg font-bold text-amber-300">03 · Şeffaf Ücretlendirme</h3>
        <p class="text-slate-300 text-sm leading-relaxed">İlk kod teşhisi ve triyaj ücretsizdir. Sonraki çalışmanın kapsamı ve bedeli teşhis tamamlandıktan sonra işe özel belirlenir; bedel piyasa koşullarıyla uyumludur ve çalışma başlamadan önce yazılı olarak netleşir.</p>
      </div>

      <div class="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <h3 class="text-lg font-bold text-purple-300">04 · Doğrudan Mühendislik Masası Muhatabı</h3>
        <p class="text-slate-300 text-sm leading-relaxed">Arada teknik bilgisi olmayan satış temsilcileri veya bürokrasi katmanları yoktur. İletişim doğrudan projeyi yürüten kıdemli mühendislik masamız üzerinden anlık yürütülür.</p>
      </div>

      <div class="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2 md:col-span-2">
        <h3 class="text-lg font-bold text-blue-300">05 · Süreklilik Güvencesi</h3>
        <p class="text-slate-300 text-sm leading-relaxed">Kriz masası tek kişilik değildir. Bir işi başlatan mühendis devre dışı kalırsa masadaki bir başkası devralır; iş yarıda kalmaz. Repo süreç boyunca ajansınızın kontrolündedir ve dokümantasyon teslim edilir.</p>
      </div>
    </div>
  </section>
`;

const storyExtraContent = `
  <section class="space-y-6 mt-8 border-t border-white/10 pt-6 text-slate-300 leading-relaxed">
    <h2 class="text-2xl font-bold text-white tracking-tight">Kuruluş Hikâyemiz ve Vizyonumuz</h2>
    <p>Aslında bu iş fikri bir online derste doğdu.</p>
    <p>Yirmi yıldır finansal piyasaların içerisindeydim. Yazılım hep işimin ayrılmaz bir parçasıydı ama uzun süre yalnızca kendim için: kendi sistemlerimi yazdım, kendi fikirlerimi koda döktüm, kendi hatalarımı kendim ayıkladım. Dışarıya iş yapmıyordum, yapmak da istemiyordum. Yirmi yıl boyunca bunun tek kişilik bir iş olduğunu, ancak kendime yetebileceğimi sanıyordum.</p>
    <p>2020'de, COVID salgınında her şeyin durduğu ve herkesin kıtlık konuştuğu dönemde bildiklerimi anlatmaya başladım. Yaklaşık elli kişi eğittim. Öğretmek beni değiştirdi: yirmi yıldır sezgiyle yaptığım her şeyi başkalarının anlayabileceği hâle getirmek her şeyi sistemleştirdi.</p>
    <p class="font-bold text-white">Trend Master Akademi fikri o online derslerde doğdu. Adımız oradan geliyor ve değiştirmedik.</p>
    <p>Kursiyerlerden biriyle ortak olduktan sonra asıl ihtiyacın sınıfta değil sahada olduğunu gördük. Özellikle pandemiden sonra dijital ajanslarda ciddi bir nitelikli yazılımcı darboğazı oluşmuştu. Yarım kalmış projeler, kaybolmuş erişimler, geçmiş teslim tarihleri ve krizler... Bu projeleri devralıp tek tek ayağa kaldırdık.</p>
    <p>Bugün yaptığımız iş bu: biz bir son kullanıcı ajansı değiliz. Dijital ajansların, yazılım evlerinin ve girişimlerin arka planında krizleri çözen, karmaşık mimarileri kuran ve %100 White-Label çalışan kıdemli bir mühendislik masasıyız.</p>
    <p>Adımız hâlâ "Akademi" — çünkü bir sistemi kurtarmak, onu anlatabilecek kadar anlamayı gerektirir. Sitemizdeki <a href="/sozluk/" class="text-cyan-400 hover:underline">Teknik Terim Sözlüğü</a> ve <a href="/teshis/" class="text-cyan-400 hover:underline">Teşhis Kataloğu</a> da bu anlayışla yayındadır.</p>
  </section>
`;

const kesintiExtraContent = `
  <section class="space-y-6 mt-8 border-t border-white/10 pt-6">
    <h2 class="text-2xl font-bold text-white tracking-tight">Kesinti Maliyeti Nasıl Hesaplanır?</h2>
    <p class="text-slate-300 leading-relaxed">Bir web sitesi veya e-ticaret altyapısı çöktüğünde oluşan doğrudan ciro kaybı şeffaf bir matematiksel formüle dayanır:</p>
    
    <div class="p-5 rounded-2xl bg-white/5 border border-white/10 font-mono text-sm text-cyan-300 space-y-2">
      <p>Saatlik Ciro Kaybı = (Aylık Ciro / 720 Saat) × Zaman Çarpanı</p>
      <p>Toplam Kesinti Maliyeti = Saatlik Kayıp × Kesinti Süresi (Saat)</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
      <div class="p-4 rounded-xl bg-white/5 border border-white/10">
        <h3 class="text-sm font-bold text-white">Zirve Saat (Peak)</h3>
        <p class="text-xs text-slate-400 mt-1">2.0x Çarpan · Kampanya veya yoğun ziyaret saatleri.</p>
      </div>
      <div class="p-4 rounded-xl bg-white/5 border border-white/10">
        <h3 class="text-sm font-bold text-white">Normal Saat</h3>
        <p class="text-xs text-slate-400 mt-1">1.0x Çarpan · Günlük standart trafik akışı.</p>
      </div>
      <div class="p-4 rounded-xl bg-white/5 border border-white/10">
        <h3 class="text-sm font-bold text-white">Gece Saati</h3>
        <p class="text-xs text-slate-400 mt-1">0.5x Çarpan · Düşük trafik ve işlem hacmi.</p>
      </div>
    </div>

    <p class="text-slate-300 text-sm leading-relaxed">Doğrudan kayba ek olarak; Google reklam bütçesi israfı, arama motoru sıralama kaybı (SERP cezası) ve müşteri güven kaybı gibi dolaylı maliyetler genellikle doğrudan ciro kaybının 2 ila 3 katına ulaşır.</p>
  </section>
`;

const sosPageExtraContent = `
  <section class="space-y-6">
    <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
      <span>Kriz hattı her gün 09:00 – 24:00 açık · acil bildirimlere tipik ilk yanıt 15 dakika.</span>
    </div>
    <div class="flex flex-wrap gap-4 text-sm font-semibold">
      <a href="tel:+905343713573" class="text-cyan-400 hover:underline">+90 534 371 35 73</a>
      <a href="https://wa.me/905343713573" target="_blank" rel="noopener" class="text-emerald-400 hover:underline">WhatsApp'tan yaz</a>
    </div>
    <div class="space-y-3">
      <h2 class="text-xl font-bold text-white">Yazarken şunları ekleyin</h2>
      <ol class="list-decimal list-inside space-y-2 text-slate-300">
        <li>Ajans adı ve size ulaşılacak numara</li>
        <li>Ne oldu: hata ekranı, hata satırı ya da sistemin davranışı</li>
        <li>Ne zaman başladı ve o sırada ne değişti (yayın, güncelleme, ödeme sağlayıcı)</li>
        <li>Erişim var mı: sunucu, repo, panel — yoksa da yazın, teşhis için şart değil</li>
      </ol>
      <p class="text-sm text-slate-400 italic">İlk teşhis için şifre ya da repo erişimi istemiyoruz.</p>
    </div>
    <div class="space-y-3 pt-4 border-t border-white/10">
      <h2 class="text-xl font-bold text-white">Aciliyet yoksa</h2>
      <ul class="space-y-2 text-slate-300">
        <li><a href="/crash-test/" class="text-cyan-400 hover:underline">60 saniyelik Agency Crash Test ile durumu kendiniz teşhis edin</a></li>
        <li><a href="/teshis/" class="text-cyan-400 hover:underline">20 arızanın belgelenmiş teşhis kataloğu</a></li>
      </ul>
    </div>
  </section>
`;

const agencyExtraContent = `
  <section class="space-y-8 mt-8 border-t border-white/10 pt-6">
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-white">Ajansların bize geldiği altı durum</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${situationQuotes.map(sq => `
        <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <h3 class="text-base font-bold text-cyan-300 font-mono">${escapeHtml(sq.tag?.tr || '')}</h3>
          <p class="text-slate-300 text-sm leading-relaxed">${escapeHtml(sq.quote?.tr || '')}</p>
        </article>`).join('\n        ')}
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="text-xl font-bold text-white">Teknik yetkinlikler</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${capabilities.map(cap => `
        <article class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <h3 class="text-sm font-bold text-cyan-300 font-mono">${escapeHtml(cap.title?.tr || '')} · ${escapeHtml(cap.cat || '')}</h3>
          <p class="text-slate-300 text-xs leading-relaxed">${escapeHtml(cap.desc?.tr || '')}</p>
        </article>`).join('\n        ')}
      </div>
    </div>
  </section>
`;

const crashTestExtraContent = `
  <section class="space-y-6 mt-8 border-t border-white/10 pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
      <div><strong class="text-white block text-sm">60 Saniye</strong> Ortalama test süresi</div>
      <div><strong class="text-emerald-400 block text-sm">0 Erişim</strong> Şifre veya repo erişimi istemez</div>
      <div><strong class="text-cyan-400 block text-sm">1 Teşhis</strong> Doğrudan arıza kataloğu eşleşmesi ve eylem reçetesi</div>
    </div>

    <h2 class="text-xl font-bold text-white">Testin kapsadığı beş kriz senaryosu</h2>
    <div class="space-y-4">
      ${scenarios.map(sc => `
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span class="text-cyan-300 font-bold">${escapeHtml(sc.tag?.tr || '')}</span>
          <span class="text-slate-400">${escapeHtml(sc.code || '')}</span>
        </div>
        <h3 class="text-lg font-bold text-white">${escapeHtml(sc.title?.tr || '')}</h3>
        <p class="text-slate-300 text-sm leading-relaxed">${escapeHtml(sc.subtitle?.tr || '')}</p>
        <div class="space-y-1 pt-1 border-t border-white/5">
          <p class="text-xs font-semibold text-slate-400 font-mono">Senaryoda değerlendirilen sorular:</p>
          <ul class="list-disc list-inside space-y-1 text-xs text-slate-400 font-mono">
            ${(sc.questions || []).map(q => `
            <li>${escapeHtml(q.label?.tr || '')}</li>`).join('\n            ')}
          </ul>
        </div>
      </article>`).join('\n      ')}
    </div>
  </section>
`;

const devirExtraContent = `
  <section class="space-y-6 mt-8 border-t border-white/10 pt-6">
    <h2 class="text-xl font-bold text-white">Kontrol edilen 12 kalem</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${handoverItems.map(item => `
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <h3 class="text-base font-bold text-cyan-300">${escapeHtml(item.title?.tr || '')}</h3>
        <p class="text-slate-300 text-sm leading-relaxed">${escapeHtml(item.desc?.tr || '')}</p>
        <p class="text-xs font-mono text-slate-400">Ağırlık: ${escapeHtml(item.weight)} puan</p>
      </article>`).join('\n      ')}
    </div>
  </section>
`;

const salvageabilityExtraContentTr = `
  <section class="space-y-6 mt-8 border-t border-white/10 pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
      <div><strong class="text-white block text-sm">5 Boyutlu Risk</strong> Mimari, Test, Veritabanı, Trafik, Teknik Borç</div>
      <div><strong class="text-emerald-400 block text-sm">0 Erişim</strong> Şifre veya repo istemez</div>
      <div><strong class="text-cyan-400 block text-sm">3 Stratejik Karar</strong> SWAT Rescue, Strangler Fig veya Clean Slate</div>
    </div>

    <h2 class="text-xl font-bold text-white">Değerlendirilen 5 Kritik Boyut</h2>
    <div class="space-y-4">
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <h3 class="text-base font-bold text-cyan-300">1. Mimari Bağımlılık & Spagetti Yoğunluğu</h3>
        <p class="text-slate-300 text-sm leading-relaxed">Bir modüldeki değişiklik alakasız yerleri patlatıyor mu? Monolitik düğümler ve kontrolsüz bağımlılıklar.</p>
      </article>
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <h3 class="text-base font-bold text-cyan-300">2. Test Kapsamı & Alan Bilgisi (Domain Knowledge)</h3>
        <p class="text-slate-300 text-sm leading-relaxed">Sistemi yazan kişi ayrıldı mı? Otomatik unit/entegrasyon testi var mı yoksa canlı ortamda mı test ediliyor?</p>
      </article>
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <h3 class="text-base font-bold text-cyan-300">3. Veritabanı Bütünlüğü & Şema Karmaşası</h3>
        <p class="text-slate-300 text-sm leading-relaxed">Foreign key, constraint veya migrasyon disiplini var mı yoksa veritabanı kilitlenme veya tutarsızlık içinde mi?</p>
      </article>
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <h3 class="text-base font-bold text-cyan-300">4. Canlı Trafik Baskısı & Teslimat Süresi</h3>
        <p class="text-slate-300 text-sm leading-relaxed">Sistem şu an aktif ciro üretiyor mu ve acil bir lansman/sözleşme tarihi var mı?</p>
      </article>
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <h3 class="text-base font-bold text-cyan-300">5. Teknik Borç / Bakım Maliyeti Oranı</h3>
        <p class="text-slate-300 text-sm leading-relaxed">Yeni bir özellik eklemek kaç gün sürüyor? Bakım maliyeti ciro ve geliştirme hızını kilitliyor mu?</p>
      </article>
    </div>
  </section>
`;

const salvageabilityExtraContentEn = `
  <section class="space-y-6 mt-8 border-t border-white/10 pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
      <div><strong class="text-white block text-sm">5 Risk Dimensions</strong> Architecture, Tests, Database, Traffic, Debt Drag</div>
      <div><strong class="text-emerald-400 block text-sm">Zero Access</strong> No credentials or repo access needed</div>
      <div><strong class="text-cyan-400 block text-sm">3 Strategic Paths</strong> SWAT Rescue, Strangler Fig, or Clean Slate</div>
    </div>

    <h2 class="text-xl font-bold text-white">5 Critical Dimensions Evaluated</h2>
    <div class="space-y-4">
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <h3 class="text-base font-bold text-cyan-300">1. Architectural Coupling & Spaghetti Density</h3>
        <p class="text-slate-300 text-sm leading-relaxed">Does changing one module break unrelated endpoints? Monolithic tangles and hidden dependencies.</p>
      </article>
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <h3 class="text-base font-bold text-cyan-300">2. Test Coverage & Domain Knowledge</h3>
        <p class="text-slate-300 text-sm leading-relaxed">Did the original developers vanish? Are automated test suites nonexistent, leaving code untested until production?</p>
      </article>
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <h3 class="text-base font-bold text-cyan-300">3. Database Integrity & Schema Hygiene</h3>
        <p class="text-slate-300 text-sm leading-relaxed">Are foreign keys and constraints intact, or is the schema fraught with deadlocks and orphaned data?</p>
      </article>
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <h3 class="text-base font-bold text-cyan-300">4. Live Traffic Pressure & Deadline Urgency</h3>
        <p class="text-slate-300 text-sm leading-relaxed">Is the system currently processing real revenue with tight contractual delivery milestones?</p>
      </article>
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <h3 class="text-base font-bold text-cyan-300">5. Technical Debt Drag Ratio</h3>
        <p class="text-slate-300 text-sm leading-relaxed">Does shipping a minor feature take weeks instead of hours due to crippling maintenance overhead?</p>
      </article>
    </div>
  </section>
`;

const postMortemHubExtraContentTr = `
  <section class="space-y-6 mt-6 border-t border-white/10 pt-6">
    <h2 class="text-xl font-bold text-white">Yayınlanmış Post-Mortem Vakaları</h2>
    <ul class="space-y-4">
      ${postMortems.map(item => `
        <li class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <a href="/post-mortem/${escapeHtml(item.slug)}/" class="text-cyan-300 font-bold hover:underline font-mono text-base">→ ${escapeHtml(item.no)} · ${escapeHtml(item.title?.tr || '')}</a>
            <span class="text-xs font-mono text-amber-400">${escapeHtml(item.severity)} · ${escapeHtml(item.category?.tr || '')}</span>
          </div>
          <p class="text-sm text-slate-300 leading-relaxed">${escapeHtml(item.summary?.tr || '')}</p>
          <div class="text-xs font-mono text-slate-400">Süre: ${escapeHtml(item.duration?.tr || '')} · Etki: ${escapeHtml(item.impact?.tr || '')}</div>
        </li>
      `).join('\n      ')}
    </ul>
  </section>
`;

const postMortemHubExtraContentEn = `
  <section class="space-y-6 mt-6 border-t border-white/10 pt-6">
    <h2 class="text-xl font-bold text-white">Published Incident Post-Mortems</h2>
    <ul class="space-y-4">
      ${postMortems.map(item => `
        <li class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <a href="/post-mortems/${escapeHtml(item.slug)}/" class="text-cyan-300 font-bold hover:underline font-mono text-base">→ ${escapeHtml(item.no)} · ${escapeHtml(item.title?.en || item.title?.tr || '')}</a>
            <span class="text-xs font-mono text-amber-400">${escapeHtml(item.severity)} · ${escapeHtml(item.category?.en || '')}</span>
          </div>
          <p class="text-sm text-slate-300 leading-relaxed">${escapeHtml(item.summary?.en || item.summary?.tr || '')}</p>
          <div class="text-xs font-mono text-slate-400">Duration: ${escapeHtml(item.duration?.en || '')} · Impact: ${escapeHtml(item.impact?.en || '')}</div>
        </li>
      `).join('\n      ')}
    </ul>
  </section>
`;

const triageExtraContentTr = `
  <section class="space-y-6 mt-8 border-t border-white/10 pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
      <div><strong class="text-white block text-sm">6 Kriz Tipi</strong> Veritabanı, Ödeme, Bellek, Deploy, 429, Devir</div>
      <div><strong class="text-emerald-400 block text-sm">İlk 15 Dk</strong> Kritik "Ne Yapma!" kuralları ve CLI komutları</div>
      <div><strong class="text-cyan-400 block text-sm">Ücretsiz Triyaj</strong> Masaya doğrudan kıdemli mühendis bağlanır</div>
    </div>

    <h2 class="text-xl font-bold text-white">Canlı Kriz Simülatöründe Kapsanan Senaryolar</h2>
    <div class="space-y-4">
      ${triageScenarios.map(sc => `
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-bold text-cyan-300 font-mono">${escapeHtml(sc.category?.tr || '')}</h3>
          <span class="text-xs font-mono text-amber-400">${escapeHtml(sc.severity)} · İlk Yanıt: ${escapeHtml(sc.firstResponseTime?.tr || '')}</span>
        </div>
        <p class="text-slate-300 text-sm leading-relaxed">${escapeHtml(sc.symptom?.tr || '')}</p>
        <div class="pt-2 text-xs font-mono text-red-300">
          <strong>Önemli:</strong> ${escapeHtml(sc.doNot?.[0]?.tr || '')}
        </div>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const triageExtraContentEn = `
  <section class="space-y-6 mt-8 border-t border-white/10 pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
      <div><strong class="text-white block text-sm">6 Outage Types</strong> Database, Payment, Memory, Deploy, 429, Handover</div>
      <div><strong class="text-emerald-400 block text-sm">First 15 Mins</strong> Critical DO NOTs and diagnostic CLI commands</div>
      <div><strong class="text-cyan-400 block text-sm">Free Triage</strong> Senior engineering desk engages directly</div>
    </div>

    <h2 class="text-xl font-bold text-white">Scenarios Covered in the Emergency Simulator</h2>
    <div class="space-y-4">
      ${triageScenarios.map(sc => `
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-bold text-cyan-300 font-mono">${escapeHtml(sc.category?.en || '')}</h3>
          <span class="text-xs font-mono text-amber-400">${escapeHtml(sc.severity)} · MTTA: ${escapeHtml(sc.firstResponseTime?.en || '')}</span>
        </div>
        <p class="text-slate-300 text-sm leading-relaxed">${escapeHtml(sc.symptom?.en || '')}</p>
        <div class="pt-2 text-xs font-mono text-red-300">
          <strong>Caution:</strong> ${escapeHtml(sc.doNot?.[0]?.en || '')}
        </div>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const slaExtraContentTr = `
  <section class="space-y-8 mt-8 border-t border-white/10 pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
      <div><strong class="text-red-400 block text-sm">SEV-0</strong> ≤ 15 Dk MTTA</div>
      <div><strong class="text-amber-400 block text-sm">SEV-1</strong> ≤ 30 Dk MTTA</div>
      <div><strong class="text-blue-400 block text-sm">SEV-2</strong> ≤ 2 Saat MTTA</div>
      <div><strong class="text-purple-400 block text-sm">SEV-3</strong> ≤ 4 Saat MTTA</div>
    </div>

    <h2 class="text-xl font-bold text-white">Hizmet Seviyesi Taahhütleri (SLA Seviyeleri)</h2>
    <div class="space-y-4">
      ${slaTiers.map(tier => `
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-bold text-white font-mono">${escapeHtml(tier.level)} · ${escapeHtml(tier.title?.tr || '')}</h3>
          <span class="text-xs font-mono text-cyan-300">İlk Yanıt: ${escapeHtml(tier.mtta?.tr || '')} · Masaya Oturma: ${escapeHtml(tier.timeToTable?.tr || '')}</span>
        </div>
        <p class="text-slate-300 text-sm leading-relaxed">${escapeHtml(tier.definition?.tr || '')}</p>
        <p class="text-xs font-mono text-slate-400">Rapor Sıklığı: ${escapeHtml(tier.updateCadence?.tr || '')}</p>
      </article>
      `).join('\n      ')}
    </div>

    <h2 class="text-xl font-bold text-white pt-4">Taviz Verilmeyen 5 Temel Mühendislik Taahhüdümüz</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${coreCommitments.map(c => `
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-base font-bold font-mono text-cyan-400">${escapeHtml(c.no)}</span>
          <h3 class="text-sm font-bold text-white">${escapeHtml(c.title?.tr || '')}</h3>
        </div>
        <p class="text-slate-300 text-xs leading-relaxed">${escapeHtml(c.desc?.tr || '')}</p>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const slaExtraContentEn = `
  <section class="space-y-8 mt-8 border-t border-white/10 pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
      <div><strong class="text-red-400 block text-sm">SEV-0</strong> ≤ 15 Mins MTTA</div>
      <div><strong class="text-amber-400 block text-sm">SEV-1</strong> ≤ 30 Mins MTTA</div>
      <div><strong class="text-blue-400 block text-sm">SEV-2</strong> ≤ 2 Hours MTTA</div>
      <div><strong class="text-purple-400 block text-sm">SEV-3</strong> ≤ 4 Hours MTTA</div>
    </div>

    <h2 class="text-xl font-bold text-white">Service Level Agreements (SLA Tiers)</h2>
    <div class="space-y-4">
      ${slaTiers.map(tier => `
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-bold text-white font-mono">${escapeHtml(tier.level)} · ${escapeHtml(tier.title?.en || tier.title?.tr || '')}</h3>
          <span class="text-xs font-mono text-cyan-300">MTTA: ${escapeHtml(tier.mtta?.en || '')} · Table: ${escapeHtml(tier.timeToTable?.en || '')}</span>
        </div>
        <p class="text-slate-300 text-sm leading-relaxed">${escapeHtml(tier.definition?.en || '')}</p>
        <p class="text-xs font-mono text-slate-400">Cadence: ${escapeHtml(tier.updateCadence?.en || '')}</p>
      </article>
      `).join('\n      ')}
    </div>

    <h2 class="text-xl font-bold text-white pt-4">5 Core Non-Negotiable Commitments</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${coreCommitments.map(c => `
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-base font-bold font-mono text-cyan-400">${escapeHtml(c.no)}</span>
          <h3 class="text-sm font-bold text-white">${escapeHtml(c.title?.en || c.title?.tr || '')}</h3>
        </div>
        <p class="text-slate-300 text-xs leading-relaxed">${escapeHtml(c.desc?.en || c.desc?.tr || '')}</p>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const techMatrixExtraContentTr = `
  <section class="space-y-8 mt-8 border-t border-white/10 pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
      <div><strong class="text-emerald-400 block text-sm">4 Kategori</strong> Backend, Frontend, DB, Infra</div>
      <div><strong class="text-white block text-sm">15+ Bileşen</strong> Node, Go, Python, Postgres, K8s</div>
      <div><strong class="text-cyan-400 block text-sm">≤ 15 Dk</strong> SEV-0 Anında SWAT Triyajı</div>
      <div><strong class="text-amber-400 block text-sm">%100</strong> Zero-Loss Rollback Garantisi</div>
    </div>

    <h2 class="text-xl font-bold text-white">Desteklenen Teknolojiler & Cerrahi Müdahale Derinliği</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${techStackData.tr.items.map(tech => `
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-bold text-white font-mono">${escapeHtml(tech.name)}</h3>
          <span class="text-xs font-mono text-emerald-400">${escapeHtml(tech.supportLevel)}</span>
        </div>
        <p class="text-xs font-mono text-slate-400">Hazırbulunuşluk: ${escapeHtml(tech.readiness)}</p>
        <div class="pt-1">
          <p class="text-xs font-semibold text-amber-300 font-mono">Kritik Arıza Noktaları:</p>
          <ul class="list-disc list-inside space-y-0.5 text-xs text-slate-300">
            ${tech.commonIncidents.slice(0, 2).map(inc => `<li>${escapeHtml(inc)}</li>`).join('\n            ')}
          </ul>
        </div>
        <p class="text-xs text-slate-400 pt-1"><strong class="text-cyan-300">TMA SWAT:</strong> ${escapeHtml(tech.rescueCapability)}</p>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const techMatrixExtraContentEn = `
  <section class="space-y-8 mt-8 border-t border-white/10 pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
      <div><strong class="text-emerald-400 block text-sm">4 Categories</strong> Backend, Frontend, DB, Infra</div>
      <div><strong class="text-white block text-sm">15+ Stacks</strong> Node, Go, Python, Postgres, K8s</div>
      <div><strong class="text-cyan-400 block text-sm">≤ 15 Mins</strong> SEV-0 Immediate SWAT Triage</div>
      <div><strong class="text-amber-400 block text-sm">100%</strong> Zero-Loss Rollback Guarantee</div>
    </div>

    <h2 class="text-xl font-bold text-white">Supported Technologies & Surgical Rescue Depth</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${techStackData.en.items.map(tech => `
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-bold text-white font-mono">${escapeHtml(tech.name)}</h3>
          <span class="text-xs font-mono text-emerald-400">${escapeHtml(tech.supportLevel)}</span>
        </div>
        <p class="text-xs font-mono text-slate-400">Readiness: ${escapeHtml(tech.readiness)}</p>
        <div class="pt-1">
          <p class="text-xs font-semibold text-amber-300 font-mono">Outage Vectors:</p>
          <ul class="list-disc list-inside space-y-0.5 text-xs text-slate-300">
            ${tech.commonIncidents.slice(0, 2).map(inc => `<li>${escapeHtml(inc)}</li>`).join('\n            ')}
          </ul>
        </div>
        <p class="text-xs text-slate-400 pt-1"><strong class="text-cyan-300">TMA SWAT:</strong> ${escapeHtml(tech.rescueCapability)}</p>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const ndaGeneratorExtraContentTr = `
  <section class="space-y-8 mt-8 border-t border-white/10 pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
      <div><strong class="text-emerald-400 block text-sm">%100 IP Koruma</strong> Kod ve mimari tamamen müşteriye aittir</div>
      <div><strong class="text-white block text-sm">White-Label</strong> Müşterinizin adı ve arızası asla yayınlanmaz</div>
      <div><strong class="text-cyan-400 block text-sm">Anında PDF / Yazdır</strong> 30 saniyede resmi sözleşme çıktısı</div>
    </div>

    <h2 class="text-xl font-bold text-white">Sözleşmede Yer Alan 7 Temel Hukuki ve Mühendislik Maddesi</h2>
    <div class="space-y-4">
      ${ndaData.tr.clauses.map(clause => `
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
        <h3 class="text-sm font-bold text-white font-mono uppercase">MADDE ${escapeHtml(clause.num)}. ${escapeHtml(clause.title)}</h3>
        <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">${escapeHtml(clause.content)}</p>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const ndaGeneratorExtraContentEn = `
  <section class="space-y-8 mt-8 border-t border-white/10 pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
      <div><strong class="text-emerald-400 block text-sm">100% IP Ownership</strong> All code & architecture belongs to client</div>
      <div><strong class="text-white block text-sm">Ghost Delivery</strong> Client identity and incident history strictly confidential</div>
      <div><strong class="text-cyan-400 block text-sm">Instant Print / PDF</strong> Official executive agreement in 30 seconds</div>
    </div>

    <h2 class="text-xl font-bold text-white">7 Core Legal & Engineering Clauses</h2>
    <div class="space-y-4">
      ${ndaData.en.clauses.map(clause => `
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
        <h3 class="text-sm font-bold text-white font-mono uppercase">SECTION ${escapeHtml(clause.num)}. ${escapeHtml(clause.title)}</h3>
        <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">${escapeHtml(clause.content)}</p>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const outageSimulatorExtraContentTr = `
  <section class="space-y-8 mt-8 border-t border-white/10 pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
      <div><strong class="text-rose-400 block text-sm">5 Boyutlu Zarar</strong> Ciro, Reklam, SLA, Churn, Mühendislik</div>
      <div><strong class="text-white block text-sm">TCOD Motoru</strong> True Cost of Downtime hesaplaması</div>
      <div><strong class="text-amber-400 block text-sm">Gizli Maliyet</strong> Ciro kaybının 2x - 4x katı teminat riski</div>
      <div><strong class="text-emerald-400 block text-sm">≤ 15 Dk</strong> Masaya bağlanarak hasarı durdurma</div>
    </div>

    <h2 class="text-xl font-bold text-white">Hesaplanan 5 Kurumsal Hasar Kalemi (TCOD)</h2>
    <div class="space-y-4">
      ${outageSimulatorData.tr.dimensions.map(dim => `
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
        <h3 class="text-base font-bold text-white font-mono">${escapeHtml(dim.title)}</h3>
        <p class="text-slate-300 text-sm leading-relaxed">${escapeHtml(dim.desc)}</p>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const outageSimulatorExtraContentEn = `
  <section class="space-y-8 mt-8 border-t border-white/10 pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
      <div><strong class="text-rose-400 block text-sm">5 Damage Vectors</strong> Revenue, Ads, SLA, Churn, Engineering</div>
      <div><strong class="text-white block text-sm">TCOD Engine</strong> True Cost of Downtime arithmetic</div>
      <div><strong class="text-amber-400 block text-sm">Hidden Drag</strong> 2x to 4x direct lost checkout sales</div>
      <div><strong class="text-emerald-400 block text-sm">≤ 15 Mins</strong> Stop bleeding via instant senior triage</div>
    </div>

    <h2 class="text-xl font-bold text-white">5 Modeled Damage Components (TCOD)</h2>
    <div class="space-y-4">
      ${outageSimulatorData.en.dimensions.map(dim => `
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
        <h3 class="text-base font-bold text-white font-mono">${escapeHtml(dim.title)}</h3>
        <p class="text-slate-300 text-sm leading-relaxed">${escapeHtml(dim.desc)}</p>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const radarExtraContentTr = `
  <section class="space-y-8 mt-8 border-t border-white/10 pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
      <div><strong class="text-emerald-400 block text-sm">Canlı Durum</strong> 0 Bekleyen SEV-0 / Masada Aktif</div>
      <div><strong class="text-white block text-sm">8.4 Dk MTTA</strong> Son 90 Gün Masaya Oturma Ortalaması</div>
      <div><strong class="text-cyan-400 block text-sm">3.2 Saat TTR</strong> Ortalama Kalıcı Çözüm Süresi</div>
      <div><strong class="text-purple-400 block text-sm">%99.8</strong> SLA Taahhüt Başarı Oranı</div>
    </div>

    <h2 class="text-xl font-bold text-white">Operasyonel Servis Masaları & Altyapı</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${radarData.tr.components.map(comp => `
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-bold text-white font-mono">${escapeHtml(comp.name)}</h3>
          <span class="text-xs font-mono text-emerald-400">${escapeHtml(comp.uptime)}</span>
        </div>
        <p class="text-slate-300 text-xs leading-relaxed">${escapeHtml(comp.desc)}</p>
        <p class="text-[11px] font-mono text-cyan-300 pt-1">Yanıt Hızı: ${escapeHtml(comp.latency)}</p>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const radarExtraContentEn = `
  <section class="space-y-8 mt-8 border-t border-white/10 pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
      <div><strong class="text-emerald-400 block text-sm">Live Status</strong> 0 Active SEV-0 Queue / All Operational</div>
      <div><strong class="text-white block text-sm">8.4 Min MTTA</strong> 90-Day Average Time to Table</div>
      <div><strong class="text-cyan-400 block text-sm">3.2 Hr TTR</strong> 90-Day Mean Time to Recovery</div>
      <div><strong class="text-purple-400 block text-sm">99.8%</strong> SLA Commitment Compliance</div>
    </div>

    <h2 class="text-xl font-bold text-white">Operational Service Desks & Infrastructure</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${radarData.en.components.map(comp => `
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-bold text-white font-mono">${escapeHtml(comp.name)}</h3>
          <span class="text-xs font-mono text-emerald-400">${escapeHtml(comp.uptime)}</span>
        </div>
        <p class="text-slate-300 text-xs leading-relaxed">${escapeHtml(comp.desc)}</p>
        <p class="text-[11px] font-mono text-cyan-300 pt-1">Response Latency: ${escapeHtml(comp.latency)}</p>
      </article>
      `).join('\n      ')}
    </div>
  </section>
`;

const codeHealthExtraContentTr = `
  <section class="space-y-8 mt-8 border-t border-white/10 pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
      <div><strong class="text-rose-400 block text-sm">4 Kritik Boyut</strong> Mimari, DB, Güvenlik, Borç</div>
      <div><strong class="text-white block text-sm">20 Parametre</strong> Ağırlıklı risk değerlendirme kriteri</div>
      <div><strong class="text-amber-400 block text-sm">Yangın Riski</strong> İlk 3 acil müdahale noktası tespiti</div>
      <div><strong class="text-emerald-400 block text-sm">Anında Rapor</strong> CTO & Yönetim Kurulu için Markdown çıktısı</div>
    </div>

    <h2 class="text-xl font-bold text-white">4 Boyutlu Kod Sağlığı ve Teknik Borç Denetim Kapsamı</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${codeHealthData.tr.categories.map(cat => `
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
        <div class="border-b border-white/10 pb-2">
          <h3 class="text-base font-bold text-white font-mono">${escapeHtml(cat.title)}</h3>
          <p class="text-xs text-slate-400">${escapeHtml(cat.desc)}</p>
        </div>
        <ul class="space-y-2 text-xs text-slate-300">
          ${cat.items.slice(0, 3).map(item => `
          <li class="flex items-start gap-2">
            <span class="text-amber-400 font-mono font-bold">•</span>
            <div>
              <span class="text-slate-200 font-medium">${escapeHtml(item.text)}</span>
              <p class="text-[11px] text-rose-300/80 font-mono">${escapeHtml(item.risk)}</p>
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
  <section class="space-y-8 mt-8 border-t border-white/10 pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
      <div><strong class="text-rose-400 block text-sm">4 Critical Vectors</strong> Architecture, DB, Security, Debt</div>
      <div><strong class="text-white block text-sm">20 Checkpoints</strong> Weighted risk assessment criteria</div>
      <div><strong class="text-amber-400 block text-sm">Fire Hazards</strong> Top 3 urgent triage vectors</div>
      <div><strong class="text-emerald-400 block text-sm">Instant Brief</strong> Copyable executive Markdown report</div>
    </div>

    <h2 class="text-xl font-bold text-white">4-Dimensional Codebase Health & Technical Debt Scope</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${codeHealthData.en.categories.map(cat => `
      <article class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
        <div class="border-b border-white/10 pb-2">
          <h3 class="text-base font-bold text-white font-mono">${escapeHtml(cat.title)}</h3>
          <p class="text-xs text-slate-400">${escapeHtml(cat.desc)}</p>
        </div>
        <ul class="space-y-2 text-xs text-slate-300">
          ${cat.items.slice(0, 3).map(item => `
          <li class="flex items-start gap-2">
            <span class="text-amber-400 font-mono font-bold">•</span>
            <div>
              <span class="text-slate-200 font-medium">${escapeHtml(item.text)}</span>
              <p class="text-[11px] text-rose-300/80 font-mono">${escapeHtml(item.risk)}</p>
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
  <section class="space-y-8 mt-8 border-t border-white/10 pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
      <div><strong class="text-emerald-400 block text-sm">%60 - %80</strong> Korunan Sermaye & Bütçe</div>
      <div><strong class="text-white block text-sm">4x - 10x ROI</strong> Cerrahi Kurtarma Çarpanı</div>
      <div><strong class="text-cyan-400 block text-sm">4 - 8 Ay</strong> Kazanılan Pazar Süresi</div>
      <div><strong class="text-amber-400 block text-sm">Zero-Rebuild Risk</strong> Sıfırdan yazım tuzaklarını bertaraf</div>
    </div>

    <h2 class="text-xl font-bold text-white">Sıfırdan Yazım Riskleri vs. TMA SWAT Kurtarma Modeli</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <article class="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
        <h3 class="text-base font-bold text-rose-300 font-mono">Sıfırdan Yazım (Rebuild) Maliyet & Risk Kalemleri</h3>
        <ul class="space-y-2 text-xs text-slate-300">
          ${rescueRoiData.tr.rebuildItems.map(item => `
          <li class="flex items-start gap-2">
            <span class="text-rose-400 font-mono font-bold">✕</span>
            <span>${escapeHtml(item)}</span>
          </li>
          `).join('\n          ')}
        </ul>
      </article>
      <article class="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
        <h3 class="text-base font-bold text-emerald-300 font-mono">TMA SWAT Kurtarma (Rescue) Avantajları</h3>
        <ul class="space-y-2 text-xs text-slate-300">
          ${rescueRoiData.tr.rescueItems.map(item => `
          <li class="flex items-start gap-2">
            <span class="text-emerald-400 font-mono font-bold">✓</span>
            <span>${escapeHtml(item)}</span>
          </li>
          `).join('\n          ')}
        </ul>
      </article>
    </div>
  </section>
`;

const rescueRoiExtraContentEn = `
  <section class="space-y-8 mt-8 border-t border-white/10 pt-6">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
      <div><strong class="text-emerald-400 block text-sm">60% - 80%</strong> Capital Preserved</div>
      <div><strong class="text-white block text-sm">4x - 10x ROI</strong> Surgical Rescue Multiplier</div>
      <div><strong class="text-cyan-400 block text-sm">4 - 8 Months</strong> Time to Market Saved</div>
      <div><strong class="text-amber-400 block text-sm">Zero-Rebuild Trap</strong> Eliminates ground-up rewrite failure risk</div>
    </div>

    <h2 class="text-xl font-bold text-white">Rebuild Liabilities vs. TMA SWAT Rescue Advantages</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <article class="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
        <h3 class="text-base font-bold text-rose-300 font-mono">Ground-Up Rebuild Liabilities</h3>
        <ul class="space-y-2 text-xs text-slate-300">
          ${rescueRoiData.en.rebuildItems.map(item => `
          <li class="flex items-start gap-2">
            <span class="text-rose-400 font-mono font-bold">✕</span>
            <span>${escapeHtml(item)}</span>
          </li>
          `).join('\n          ')}
        </ul>
      </article>
      <article class="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
        <h3 class="text-base font-bold text-emerald-300 font-mono">TMA SWAT Rescue Advantages</h3>
        <ul class="space-y-2 text-xs text-slate-300">
          ${rescueRoiData.en.rescueItems.map(item => `
          <li class="flex items-start gap-2">
            <span class="text-emerald-400 font-mono font-bold">✓</span>
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
    title: 'Developer Handover Readiness Audit (12 Checkpoints) | Trend Master Academy',
    h1: 'Developer Handover Readiness Audit',
    description: 'Is your developer leaving or already left? Check 12 mission-critical items, get your handover risk score and missing inventory in 60 seconds.',
    canonical: 'https://trendmasterakademi.com/handover-audit/',
    ogUrl: 'https://trendmasterakademi.com/handover-audit/',
    hreflangTr: 'https://trendmasterakademi.com/devir-kontrolu/',
    hreflangEn: 'https://trendmasterakademi.com/handover-audit/',
    heading: 'Developer Handover Readiness Audit // 12-Point Transition Checklist',
    subheading: 'Audit Git repos, environment variables, DNS, and payment keys to ensure zero project blockage during engineer transitions.',
    extraContent: devirExtraContent,
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
    title: 'Developer-to-Agency Tech Glossary | Trend Master Academy',
    h1: 'Developer-to-Agency Tech Glossary',
    description: 'Understand technical explanations from developers. Deadlock, N+1, Race Condition, Webhook, and 12 core concepts translated into business impact.',
    canonical: 'https://trendmasterakademi.com/glossary/',
    ogUrl: 'https://trendmasterakademi.com/glossary/',
    hreflangTr: 'https://trendmasterakademi.com/sozluk/',
    hreflangEn: 'https://trendmasterakademi.com/glossary/',
    heading: 'Developer-to-Agency Tech Glossary',
    subheading: 'A practical translation guide bridging technical jargon with business operations.',
    extraContent: glossaryHubExtraContent,
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
            "name": term.title,
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
    title: 'Downtime Loss Calculator | Trend Master Academy',
    h1: 'Downtime Loss Calculator',
    description: 'Calculate hourly and total estimated revenue loss during server crashes or HTTP 500 outages. Transparent math and recovery ROI analysis.',
    canonical: 'https://trendmasterakademi.com/downtime-calc/',
    ogUrl: 'https://trendmasterakademi.com/downtime-calc/',
    hreflangTr: 'https://trendmasterakademi.com/kesinti-maliyeti/',
    hreflangEn: 'https://trendmasterakademi.com/downtime-calc/',
    heading: 'Website & API Downtime Loss Calculator',
    subheading: 'Calculate the true financial and reputational cost of every minute your client systems remain offline.',
    extraContent: kesintiExtraContent,
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
    title: 'Our Story & Founding Origins | Trend Master Academy',
    h1: "The Story of Trend Master Academy",
    description: '20 years of financial software expertise, a name born in online education, and our B2B engineering desk vision.',
    canonical: 'https://trendmasterakademi.com/story/',
    ogUrl: 'https://trendmasterakademi.com/story/',
    hreflangTr: 'https://trendmasterakademi.com/hikayemiz/',
    hreflangEn: 'https://trendmasterakademi.com/story/',
    subheading: 'In truth, this concept originated in an online live class.',
    extraContent: storyExtraContent,
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
    title: 'Diagnostic Catalog // 20 Documented Outage Symptoms | Trend Master Academy',
    h1: 'Diagnostic Catalog',
    description: 'From symptom to root cause: technical diagnosis guide for agency leaders and engineering managers.',
    canonical: 'https://trendmasterakademi.com/diagnostic/',
    ogUrl: 'https://trendmasterakademi.com/diagnostic/',
    hreflangTr: 'https://trendmasterakademi.com/teshis/',
    hreflangEn: 'https://trendmasterakademi.com/diagnostic/',
    heading: 'Diagnostic Catalog',
    subheading: 'You see the symptom but not the cause. Each diagnosis begins with an observable failure, isolates potential causes, and outlines triage protocols.',
    extraContent: teshisHubExtraContent,
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
    title: 'Salvageability Index (Refactor vs Rebuild Matrix) | Trend Master Academy',
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
    title: 'Public Incident Post-Mortems & RCA Library | Trend Master Academy',
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
    title: 'Emergency Triage & Incident Simulator // First 15-Min Protocol | Trend Master Academy',
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
    description: 'Muğlak vaatler yerine dakikalarla tanımlı mühendislik taahhütleri: SEV-0 için 15 dk yanıt, %100 White-Label garantisi, resmi NDA ve sıfır veri kaybı güvencesi.',
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
    title: 'Tech Stack Compatibility & Rescue Matrix | Trend Master Academy',
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
    title: 'Mutual Non-Disclosure & IP Protection Agreement (NDA) | Trend Master Academy',
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
    title: 'Outage & Reputational Damage Simulator (TCOD) | Trend Master Academy',
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
    title: 'Canlı Sistem Sağlığı & SWAT Durum Radarı | Trend Master Akademi',
    h1: 'Canlı Sistem Sağlığı, SWAT Hazırbulunuşluğu & Olay Radarı',
    description: 'Radikal şeffaflık: TMA canlı mühendislik masası hazırbulunuşluğu, nöbetçi mimar durumu, 90 günlük SLA telemetrisi ve vaka dağılım radarı.',
    canonical: 'https://trendmasterakademi.com/radar/',
    ogUrl: 'https://trendmasterakademi.com/radar/',
    heading: 'Canlı Sistem Sağlığı, SWAT Hazırbulunuşluğu & Olay Radarı',
    subheading: 'Operasyonel hazırbulunuşluk, aktif nöbetçi mimar durumu, son 90 günlük masaya oturma süreleri (MTTA) ve çözülen krizlerin kategori dağılımı.',
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
            { "@type": "ListItem", "position": 2, "name": "SWAT Durum Radarı", "item": "https://trendmasterakademi.com/radar/" }
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
    title: 'Codebase Health & Technical Debt Audit Checklist | Trend Master Academy',
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
    title: 'SWAT Rescue vs Rebuild Financial ROI Calculator | Trend Master Academy',
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
    extraContent,
    schema
  };

  const enPage = {
    dir: `glossary/${term.slug}`,
    lang: 'en',
    title: formatPageTitle(`What is ${term.title}?`),
    h1: `What is ${term.title}?`,
    description: `${term.title.split(' (')[0]}: ${term.shortDef.en || term.shortDef.tr}`,
    canonical: `https://trendmasterakademi.com/glossary/${term.slug}/`,
    ogUrl: `https://trendmasterakademi.com/glossary/${term.slug}/`,
    hreflangTr: `https://trendmasterakademi.com/sozluk/${term.slug}/`,
    hreflangEn: `https://trendmasterakademi.com/glossary/${term.slug}/`,
    heading: term.title,
    subheading: `${term.shortDef.en || term.shortDef.tr} ${term.agencyImpact?.en || term.agencyImpact?.tr || ''}`,
    extraContent,
    schema
  };

  return [trPage, enPage];
});

// 3.1 & 3.2 — Add each diagnostic page dynamically with full extraContent and schema
const teshisPages = teshisData.flatMap(item => {
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
        const yanlisDuzeltmeHtml = n.yanlisDuzeltme?.tr
          ? `\n            <p class="text-slate-300 text-sm"><strong class="text-white">Sık yapılan yanlış düzeltme:</strong> ${escapeHtml(n.yanlisDuzeltme.tr)}</p>`
          : '';
        return `
          <div class="space-y-2 p-5 rounded-2xl bg-white/5 border border-white/10 my-4">
            <h3 class="text-lg font-bold text-cyan-300">${escapeHtml(n.harf)} · ${escapeHtml(n.ad?.tr || '')}</h3>
            <p class="text-slate-300 leading-relaxed">${escapeHtml(n.aciklama?.tr || '')}</p>
            <p class="text-slate-300 text-sm"><strong class="text-white">Ayırt edici test:</strong> ${escapeHtml(testStr)}</p>
            <p class="text-slate-300 text-sm"><strong class="text-white">Kanıt:</strong> ${escapeHtml(n.kanit?.tr || '')}</p>
            <p class="text-slate-300 text-sm"><strong class="text-white">Çözüm:</strong> ${escapeHtml(cozumStr)}</p>${yanlisDuzeltmeHtml}
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

  const sahadaHtml = item.sahadaNasilGorunur?.tr
    ? `
      <section class="space-y-2">
        <h2 class="text-xl font-bold text-white">Sahada nasıl görünür</h2>
        <p class="text-slate-300 leading-relaxed">${escapeHtml(item.sahadaNasilGorunur.tr)}</p>
      </section>
    `
    : '';

  const extraContent = `
    <section class="space-y-6 mt-6 border-t border-white/10 pt-6">
      <p class="text-sm font-mono text-cyan-400">Aciliyet: ${escapeHtml(item.aciliyet?.etiket?.tr || '')} · Kategori: ${escapeHtml(item.kirinti?.tr || '')}</p>
${sahadaHtml}
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
    extraContent,
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
    extraContent,
    schema
  };

  return [trPage, enPage];
});

const postMortemPages = postMortems.flatMap(item => {
  const trExtraContent = `
    <section class="space-y-6 mt-6 border-t border-white/10 pt-6">
      <div class="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><span class="text-slate-500 block">SEVERITY</span><strong class="text-amber-400">${escapeHtml(item.severity)}</strong></div>
        <div><span class="text-slate-500 block">KATEGORİ</span><strong class="text-white">${escapeHtml(item.category?.tr || '')}</strong></div>
        <div><span class="text-slate-500 block">KESİNTİ SÜRESİ</span><strong class="text-emerald-400">${escapeHtml(item.duration?.tr || '')}</strong></div>
        <div><span class="text-slate-500 block">TARİH</span><strong class="text-cyan-300">${escapeHtml(item.date)}</strong></div>
      </div>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-white">Olay Özeti</h2>
        <p class="text-slate-300 leading-relaxed">${escapeHtml(item.summary?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-white">Etki & Kayıp</h2>
        <p class="text-slate-300 leading-relaxed">${escapeHtml(item.impact?.tr || '')}</p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-bold text-white">Kronolojik Olay Akışı</h2>
        <ul class="space-y-2 font-mono text-sm bg-black/40 p-4 rounded-xl border border-white/10">
          ${(item.timeline || []).map(t => `
            <li><span class="text-cyan-300 font-bold">${escapeHtml(t.time)}</span> · <span class="text-white">${escapeHtml(t.title?.tr || '')}</span> — <span class="text-slate-300">${escapeHtml(t.desc?.tr || '')}</span></li>
          `).join('\n          ')}
        </ul>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-white">Kök Neden (5 Whys)</h2>
        <p class="text-slate-300 leading-relaxed whitespace-pre-line">${escapeHtml(item.rootCause?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-white">Uygulanan SWAT Müdahalesi & Hotfix</h2>
        <p class="text-slate-300 leading-relaxed whitespace-pre-line">${escapeHtml(item.tmaHotfix?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-white">Kalıcı Önleyici Tedbirler</h2>
        <p class="text-slate-300 leading-relaxed whitespace-pre-line">${escapeHtml(item.permanentMitigation?.tr || '')}</p>
      </section>
    </section>
  `;

  const enExtraContent = `
    <section class="space-y-6 mt-6 border-t border-white/10 pt-6">
      <div class="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><span class="text-slate-500 block">SEVERITY</span><strong class="text-amber-400">${escapeHtml(item.severity)}</strong></div>
        <div><span class="text-slate-500 block">CATEGORY</span><strong class="text-white">${escapeHtml(item.category?.en || '')}</strong></div>
        <div><span class="text-slate-500 block">DURATION</span><strong class="text-emerald-400">${escapeHtml(item.duration?.en || '')}</strong></div>
        <div><span class="text-slate-500 block">DATE</span><strong class="text-cyan-300">${escapeHtml(item.date)}</strong></div>
      </div>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-white">Incident Summary</h2>
        <p class="text-slate-300 leading-relaxed">${escapeHtml(item.summary?.en || item.summary?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-white">Business & Technical Impact</h2>
        <p class="text-slate-300 leading-relaxed">${escapeHtml(item.impact?.en || item.impact?.tr || '')}</p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-bold text-white">Incident Timeline</h2>
        <ul class="space-y-2 font-mono text-sm bg-black/40 p-4 rounded-xl border border-white/10">
          ${(item.timeline || []).map(t => `
            <li><span class="text-cyan-300 font-bold">${escapeHtml(t.time)}</span> · <span class="text-white">${escapeHtml(t.title?.en || t.title?.tr || '')}</span> — <span class="text-slate-300">${escapeHtml(t.desc?.en || t.desc?.tr || '')}</span></li>
          `).join('\n          ')}
        </ul>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-white">Root Cause Analysis (5 Whys)</h2>
        <p class="text-slate-300 leading-relaxed whitespace-pre-line">${escapeHtml(item.rootCause?.en || item.rootCause?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-white">TMA SWAT Resolution & Hotfix</h2>
        <p class="text-slate-300 leading-relaxed whitespace-pre-line">${escapeHtml(item.tmaHotfix?.en || item.tmaHotfix?.tr || '')}</p>
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-bold text-white">Permanent Mitigations</h2>
        <p class="text-slate-300 leading-relaxed whitespace-pre-line">${escapeHtml(item.permanentMitigation?.en || item.permanentMitigation?.tr || '')}</p>
      </section>
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
  
  // Replace OpenGraph Title & URL
  html = html.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${escapeHtml(page.title)}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${escapeHtml(page.ogUrl)}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${escapeHtml(page.description)}" />`);
  html = html.replace(/<meta property="og:image" content=".*?" \/>/i, `<meta property="og:image" content="https://trendmasterakademi.com/og-image.jpg" />`);

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
    <div class="ssr-pre-render p-6 sm:p-12 max-w-5xl mx-auto text-slate-200 font-sans">
      <header class="mb-8 border-b border-white/10 pb-6">
        <h1 class="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">${page.h1}</h1>
        <nav class="flex flex-wrap gap-4 text-sm font-mono text-cyan-400">
          <a href="/" class="hover:underline">${page.lang === 'en' ? 'Home' : 'Ana Sayfa'}</a>
          <a href="/agency/" class="hover:underline">${page.lang === 'en' ? 'Capacity & Infrastructure' : 'Kapasite & Altyapı'}</a>
          <a href="/crash-test/" class="hover:underline">${page.lang === 'en' ? 'Crash Test (60s)' : 'Crash Test (60sn)'}</a>
          <a href="${page.lang === 'en' ? '/handover-audit/' : '/devir-kontrolu/'}" class="hover:underline">${page.lang === 'en' ? 'Handover Audit' : 'Devir Kontrolü'}</a>
          <a href="${page.lang === 'en' ? '/diagnostic/' : '/teshis/'}" class="hover:underline">${page.lang === 'en' ? 'Diagnostic Catalog' : 'Teşhis Kataloğu'}</a>
          <a href="${page.lang === 'en' ? '/salvageability/' : '/kurtarilabilirlik/'}" class="hover:underline">${page.lang === 'en' ? 'Salvageability Index' : 'Kurtarılabilirlik İndeksi'}</a>
          <a href="${page.lang === 'en' ? '/post-mortems/' : '/post-mortem/'}" class="hover:underline">${page.lang === 'en' ? 'Post-Mortem & RCA' : 'Post-Mortem & RCA'}</a>
          <a href="${page.lang === 'en' ? '/triage/' : '/triyaj/'}" class="hover:underline">${page.lang === 'en' ? 'Triage Simulator' : 'Triyaj Simülatörü'}</a>
          <a href="/sla/" class="hover:underline">${page.lang === 'en' ? 'SLA & Commitments' : 'SLA & Taahhütler'}</a>
          <a href="${page.lang === 'en' ? '/tech-matrix/' : '/teknoloji-uyumluluk/'}" class="hover:underline">${page.lang === 'en' ? 'Tech Matrix' : 'Teknoloji Matrisi'}</a>
          <a href="${page.lang === 'en' ? '/mutual-nda/' : '/gizlilik-sozlesmesi/'}" class="hover:underline">${page.lang === 'en' ? 'Mutual NDA' : 'Gizlilik Sözleşmesi'}</a>
          <a href="${page.lang === 'en' ? '/outage-simulator/' : '/hasar-tespiti/'}" class="hover:underline">${page.lang === 'en' ? 'Damage Simulator' : 'Hasar Simülatörü'}</a>
          <a href="/radar/" class="hover:underline">${page.lang === 'en' ? 'Status Radar' : 'SWAT Radarı'}</a>
          <a href="${page.lang === 'en' ? '/codebase-health/' : '/kod-sagligi/'}" class="hover:underline">${page.lang === 'en' ? 'Codebase Health' : 'Kod Sağlığı'}</a>
          <a href="${page.lang === 'en' ? '/rescue-roi/' : '/kurtarma-maliyeti/'}" class="hover:underline">${page.lang === 'en' ? 'Rescue ROI' : 'Kurtarma ROI'}</a>
          <a href="${page.lang === 'en' ? '/downtime-calc/' : '/kesinti-maliyeti/'}" class="hover:underline">${page.lang === 'en' ? 'Downtime Calculator' : 'Kesinti Maliyeti'}</a>
          <a href="/sos/" class="hover:underline">${page.lang === 'en' ? 'Emergency Support' : 'Acil Teknik Destek'}</a>
          <a href="/about/" class="hover:underline">${page.lang === 'en' ? 'About Us' : 'Hakkımızda'}</a>
          <a href="/privacy/" class="hover:underline">${page.lang === 'en' ? 'Privacy Policy' : 'KVKK & Gizlilik'}</a>
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
  'https://trendmasterakademi.com/handover-audit/': 'v2-draft/src/pages/DevirKontrolu.jsx',
  'https://trendmasterakademi.com/kurtarilabilirlik/': 'v2-draft/src/pages/Salvageability.jsx',
  'https://trendmasterakademi.com/salvageability/': 'v2-draft/src/pages/Salvageability.jsx',
  'https://trendmasterakademi.com/post-mortem/': 'v2-draft/src/pages/PostMortemIndex.jsx',
  'https://trendmasterakademi.com/post-mortems/': 'v2-draft/src/pages/PostMortemIndex.jsx',
  'https://trendmasterakademi.com/triyaj/': 'v2-draft/src/pages/Triage.jsx',
  'https://trendmasterakademi.com/triage/': 'v2-draft/src/pages/Triage.jsx',
  'https://trendmasterakademi.com/sla/': 'v2-draft/src/pages/Sla.jsx',
  'https://trendmasterakademi.com/teknoloji-uyumluluk/': 'v2-draft/src/pages/TechMatrix.jsx',
  'https://trendmasterakademi.com/tech-matrix/': 'v2-draft/src/pages/TechMatrix.jsx',
  'https://trendmasterakademi.com/gizlilik-sozlesmesi/': 'v2-draft/src/pages/NdaGenerator.jsx',
  'https://trendmasterakademi.com/mutual-nda/': 'v2-draft/src/pages/NdaGenerator.jsx',
  'https://trendmasterakademi.com/hasar-tespiti/': 'v2-draft/src/pages/OutageSimulator.jsx',
  'https://trendmasterakademi.com/outage-simulator/': 'v2-draft/src/pages/OutageSimulator.jsx',
  'https://trendmasterakademi.com/radar/': 'v2-draft/src/pages/StatusRadar.jsx',
  'https://trendmasterakademi.com/kod-sagligi/': 'v2-draft/src/pages/CodeHealth.jsx',
  'https://trendmasterakademi.com/codebase-health/': 'v2-draft/src/pages/CodeHealth.jsx',
  'https://trendmasterakademi.com/kurtarma-maliyeti/': 'v2-draft/src/pages/RescueRoi.jsx',
  'https://trendmasterakademi.com/rescue-roi/': 'v2-draft/src/pages/RescueRoi.jsx',
  'https://trendmasterakademi.com/sozluk/': 'v2-draft/src/data/glossaryData.js',
  'https://trendmasterakademi.com/glossary/': 'v2-draft/src/data/glossaryData.js',
  'https://trendmasterakademi.com/kesinti-maliyeti/': 'v2-draft/src/pages/KesintiMaliyeti.jsx',
  'https://trendmasterakademi.com/downtime-calc/': 'v2-draft/src/pages/KesintiMaliyeti.jsx',
  'https://trendmasterakademi.com/about/': 'v2-draft/src/pages/About.jsx',
  'https://trendmasterakademi.com/hikayemiz/': 'v2-draft/src/pages/Story.jsx',
  'https://trendmasterakademi.com/story/': 'v2-draft/src/pages/Story.jsx',
  'https://trendmasterakademi.com/privacy/': 'v2-draft/src/pages/Privacy.jsx',
  'https://trendmasterakademi.com/gizlilik/': 'v2-draft/src/pages/Privacy.jsx',
  'https://trendmasterakademi.com/nda/': 'v2-draft/src/pages/Nda.jsx',
  'https://trendmasterakademi.com/teshis/': 'v2-draft/src/data/teshisData.js',
  'https://trendmasterakademi.com/diagnostic/': 'v2-draft/src/data/teshisData.js',
  'https://trendmasterakademi.com/sos/': 'v2-draft/src/pages/Sos.jsx'
};

for (const term of glossaryTerms) {
  sitemapPageSourceMap[`https://trendmasterakademi.com/sozluk/${term.slug}/`] = 'v2-draft/src/data/glossaryData.js';
  sitemapPageSourceMap[`https://trendmasterakademi.com/glossary/${term.slug}/`] = 'v2-draft/src/data/glossaryData.js';
}

for (const item of teshisData) {
  sitemapPageSourceMap[`https://trendmasterakademi.com/teshis/${item.slug}/`] = `v2-draft/src/data/teshis/${item.slug}.js`;
  sitemapPageSourceMap[`https://trendmasterakademi.com/diagnostic/${item.slug}/`] = `v2-draft/src/data/teshis/${item.slug}.js`;
}

for (const item of postMortems) {
  sitemapPageSourceMap[`https://trendmasterakademi.com/post-mortem/${item.slug}/`] = 'v2-draft/src/data/postMortemData.js';
  sitemapPageSourceMap[`https://trendmasterakademi.com/post-mortems/${item.slug}/`] = 'v2-draft/src/data/postMortemData.js';
}

function updateSitemapLastmod() {
  const publicSitemapPath = path.join(__dirname, 'public/sitemap.xml');
  const distSitemapPath = path.join(__dirname, 'dist/sitemap.xml');
  const rootSitemapPath = path.join(repoRoot, 'sitemap.xml');
  const pageHashesPath = path.join(__dirname, 'page-hashes.json');

  if (!fs.existsSync(publicSitemapPath)) {
    console.warn('[SITEMAP WARNING] public/sitemap.xml not found');
    return;
  }

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

  let content = fs.readFileSync(publicSitemapPath, 'utf8');
  let updatedCount = 0;
  let changedCount = 0;
  const changedUrls = [];

  content = content.replace(/<url>([\s\S]*?)<\/url>/g, (match, urlInner) => {
    const locMatch = urlInner.match(/<loc>(.*?)<\/loc>/);
    if (!locMatch) return match;
    const loc = locMatch[1].trim();

    const rel = loc.replace('https://trendmasterakademi.com/', '').replace(/\/$/, '');
    const htmlFile = path.join(distDir, rel, 'index.html');

    let pageLastmod = urlInner.match(/<lastmod>(.*?)<\/lastmod>/)?.[1] || todayStr;

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
    return match.replace(/<lastmod>.*?<\/lastmod>/, `<lastmod>${pageLastmod}</lastmod>`);
  });

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
