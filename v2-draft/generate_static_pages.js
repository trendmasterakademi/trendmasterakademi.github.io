import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glossaryTerms } from './src/data/glossaryData.js';
import { teshisData } from './src/data/teshisData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('dist/index.html not found! Run vite build first.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

// 3.4 — HTML Kaçış Fonksiyonu
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

// 2.3 — Ana Sayfa Şerit Log Eşleşmeleri (Hero.jsx ile birebir aynı 8 kayıt)
const homeHeroLogs = [
  {
    log: 'SQLSTATE[40001]: Serialization failure: 1213 Deadlock found',
    slug: 'ayni-stok-iki-musteriye-satildi'
  },
  {
    log: 'Lock wait timeout exceeded; try restarting transaction',
    slug: 'islemler-kilitlendi-sayfa-donuyor'
  },
  {
    log: '502 Bad Gateway · upstream prematurely closed connection',
    slug: 'site-500-veriyor-dun-calisiyordu'
  },
  {
    log: 'NET::ERR_CERT_DATE_INVALID',
    slug: 'ssl-suresi-doldu'
  },
  {
    log: 'HTTP 429 Too Many Requests',
    slug: 'entegrasyon-429-veriyor'
  },
  {
    log: 'Out of memory: Killed process',
    slug: 'sunucu-her-gun-yeniden-baslatiliyor'
  },
  {
    log: 'SMTP error 535 Authentication failed',
    slug: 'form-gonderiliyor-mail-gelmiyor'
  },
  {
    log: 'robots.txt → Disallow: /',
    slug: 'site-aramalarda-gorunmez-oldu'
  }
];

const homePageExtraContent = `
  <section class="space-y-6 mt-6 border-t border-white/10 pt-6">
    <h2 class="text-xl font-bold text-white">Sisteminizde bu satırları görüyorsanız</h2>
    <ul class="space-y-3">
      ${homeHeroLogs.map(entry => {
        const item = teshisData.find(d => d.slug === entry.slug);
        const titleText = item ? `${item.no} · ${item.baslik.tr}` : entry.slug;
        return `
        <li class="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1 font-mono text-sm">
          <div class="text-slate-400"><code>${escapeHtml(entry.log)}</code></div>
          <div><a href="/teshis/${escapeHtml(entry.slug)}/" class="text-cyan-300 hover:underline font-bold">→ ${escapeHtml(titleText)}</a></div>
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
    extraContent: homePageExtraContent
  },
  {
    dir: 'agency',
    title: 'Ajans Çözümleri & B2B White-Label Mühendislik Masası | Trend Master Akademi',
    h1: 'Ajans Çözümleri & B2B Mühendislik Masası',
    description: 'Dijital ajansların görünmez teknik gücü: %100 White-Label, resmi NDA güvencesi, 20+ teknik yetkinlik, acil kriz masası ve kıdemli mühendislik takviyesi.',
    canonical: 'https://trendmasterakademi.com/agency/',
    ogUrl: 'https://trendmasterakademi.com/agency/',
    heading: 'Ajansınızın Yerine Değil, Ajansınızın Yanında Güvenilir Mühendislik Masası.',
    subheading: 'Bir projede teknik olarak tıkandığınızda, teslim tarihi yaklaştığında veya ekibinizin kapasitesi dolduğunda: %100 White-Label, resmi NDA ve doğrudan kıdemli mühendislik desteği.'
  },
  {
    dir: 'crash-test',
    title: 'Agency Crash Test (60sn) - Kriz & Risk Simülatörü | Trend Master Akademi',
    h1: 'Agency Crash Test (60sn)',
    description: 'Ajansınız teknik bir krize hazır mı? HTTP 500 kesintisi, geliştirici ani ayrılığı veya T-48H lansman darboğazı için 60 saniyede risk skorunuzu ve eylem planınızı görün.',
    canonical: 'https://trendmasterakademi.com/crash-test/',
    ogUrl: 'https://trendmasterakademi.com/crash-test/',
    heading: 'Agency Crash Test // 60 Saniyede Ajans Kriz Dayanıklılık Skoru',
    subheading: 'Kritik kod kilitlenmeleri, devir süreçleri tıkanmış projeler veya yaklaşan teslimat baskısı altında ajansınızın risk puanını ölçün.'
  },
  {
    dir: 'devir-kontrolu',
    title: 'Devir Hazırlık Kontrolü (12 Kalem) - Yazılımcı Ayrılık Riski | Trend Master Akademi',
    h1: 'Devir Hazırlık Kontrolü',
    description: 'Yazılımcınız ayrılıyor veya ayrıldı mı? 12 kritik kalemi kontrol edin, devir risk skorunuzu ve eksik envanterinizi 60 saniyede ücretsiz analiz edin.',
    canonical: 'https://trendmasterakademi.com/devir-kontrolu/',
    ogUrl: 'https://trendmasterakademi.com/devir-kontrolu/',
    heading: 'Devir Hazırlık Kontrolü // 12 Kalemlik Geliştirici Ayrılık Denetimi',
    subheading: 'Git repo, ortam değişkenleri, DNS ve ödeme anahtarlarınızı ayrılan geliştiriciden eksiksiz devralıp almadığınızı test edin.'
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
    extraContent: glossaryHubExtraContent
  },
  {
    dir: 'kesinti-maliyeti',
    title: 'Web Sitesi Kesinti Maliyeti Hesaplayıcı (Downtime Calculator) | Trend Master Akademi',
    h1: 'Kesinti Maliyeti Hesaplayıcı',
    description: 'Sunucu çökmesi veya HTTP 500 kesintisinde saatlik ve toplam tahmini ciro kaybınızı hesaplayın. Şeffaf matematik ve kurtarma ROI analizi.',
    canonical: 'https://trendmasterakademi.com/kesinti-maliyeti/',
    ogUrl: 'https://trendmasterakademi.com/kesinti-maliyeti/',
    heading: 'Web Sitesi & API Kesinti Maliyeti Hesaplayıcı',
    subheading: 'Sistem çöktüğünde geçen her dakikanın ajansınıza ve müşterinize gerçek finansal ve itibar maliyetini hesaplayın.'
  },
  {
    dir: 'about',
    title: 'Mühendislik Standartlarımız & Hakkımızda | Trend Master Akademi',
    h1: 'Mühendislik Standartlarımız & Hakkımızda',
    description: 'Trend Master Akademi mühendislik standartları, 4 temel prensip ve B2B SWAT vizyonu.',
    canonical: 'https://trendmasterakademi.com/about/',
    ogUrl: 'https://trendmasterakademi.com/about/',
    heading: 'Ajansların Güvendiği Arka Plan Mühendislik Masası',
    subheading: 'Modern web, SaaS, API mimarileri ve acil kod kurtarma (SWAT) stüdyosu.'
  },
  {
    dir: 'hikayemiz',
    title: 'Hikâyemiz & Kuruluş Anlatısı | Trend Master Akademi',
    h1: "Trend Master Akademi'nin hikâyesi",
    description: '20 yıllık finansal yazılım tecrübesi, online eğitimden doğan isim ve B2B mühendislik masası vizyonumuz.',
    canonical: 'https://trendmasterakademi.com/hikayemiz/',
    ogUrl: 'https://trendmasterakademi.com/hikayemiz/',
    subheading: 'Aslında bu iş fikri bir online derste doğdu.'
  },
  {
    dir: 'privacy',
    title: 'KVKK Aydınlatma Metni & Gizlilik Politikası | Trend Master Akademi',
    h1: 'KVKK Aydınlatma Metni & Gizlilik Politikası',
    description: 'Trend Master Akademi KVKK aydınlatma metni, veri sorumlusu taahhüdü, resmi NDA ve %100 White-Label gizlilik standartları.',
    canonical: 'https://trendmasterakademi.com/privacy/',
    ogUrl: 'https://trendmasterakademi.com/privacy/',
    heading: 'KVKK Aydınlatma Metni & Gizlilik Politikası',
    subheading: '6698 sayılı KVKK kapsamında veri sorumlusu taahhüdü, resmi NDA ve %100 White-Label gizlilik ilkeleri.'
  },
  {
    dir: 'gizlilik',
    title: 'KVKK Aydınlatma Metni & Gizlilik Politikası | Trend Master Akademi',
    h1: 'KVKK Aydınlatma Metni & Gizlilik Politikası',
    description: 'Trend Master Akademi KVKK aydınlatma metni, veri sorumlusu taahhüdü, resmi NDA ve %100 White-Label gizlilik standartları.',
    canonical: 'https://trendmasterakademi.com/privacy/',
    ogUrl: 'https://trendmasterakademi.com/privacy/',
    heading: 'KVKK Aydınlatma Metni & Gizlilik Politikası',
    subheading: '6698 sayılı KVKK kapsamında veri sorumlusu taahhüdü, resmi NDA ve %100 White-Label gizlilik ilkeleri.'
  },
  {
    dir: 'nda',
    title: 'Gizlilik ve Çalışma Sözleşmesi | Trend Master Akademi',
    h1: 'Gizlilik ve Çalışma Sözleşmesi',
    description: 'Çalışmaya başlamadan önce imzaladığımız karşılıklı gizlilik ve çalışma sözleşmesinin tam metni ve sade dilli özeti.',
    canonical: 'https://trendmasterakademi.com/nda/',
    ogUrl: 'https://trendmasterakademi.com/nda/',
    subheading: 'Çalışmaya başlamadan önce karşılıklı bir gizlilik ve çalışma sözleşmesi imzalıyoruz. Ne imzalayacağınızı önceden bilmeniz için sözleşmenin ne dediğini burada sade dille anlattık.'
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
    extraContent: teshisHubExtraContent
  }
];

// 3.3 — Add each glossary term page dynamically with extraContent
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

  return {
    dir: `sozluk/${term.slug}`,
    title: `${term.title} Nedir? Ajanslar İçin Teknik Rehber | Trend Master Akademi`,
    h1: `${term.title} Nedir?`,
    description: `${term.title}: ${term.shortDef.tr}`,
    canonical: `https://trendmasterakademi.com/sozluk/${term.slug}/`,
    ogUrl: `https://trendmasterakademi.com/sozluk/${term.slug}/`,
    heading: term.title,
    subheading: `${term.shortDef.tr} ${term.agencyImpact.tr}`,
    extraContent
  };
});

// 3.1 & 3.2 — Add each diagnostic page dynamically with full extraContent and NO heading (prevents h1 duplicate)
const teshisPages = teshisData.map(item => {
  const logRowsHtml = item.logSatirlari && item.logSatirlari.length > 0
    ? `
      <ul class="space-y-2 font-mono text-sm bg-black/40 p-4 rounded-xl border border-white/10 my-3">
        ${item.logSatirlari.map(log => `<li><code>${escapeHtml(log)}</code></li>`).join('\n        ')}
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

  return {
    dir: `teshis/${item.slug}`,
    title: `${item.baslik.tr} | Trend Master Akademi`,
    h1: item.baslik.tr,
    description: item.ozet.tr.split('.')[0] + '.',
    canonical: `https://trendmasterakademi.com/teshis/${item.slug}/`,
    ogUrl: `https://trendmasterakademi.com/teshis/${item.slug}/`,
    subheading: item.ozet.tr,
    extraContent
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
