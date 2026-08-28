import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('dist/index.html not found! Run vite build first.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

const pages = [
  {
    dir: 'agency',
    title: 'Ajans Çözümleri & B2B White-Label Mühendislik Masası | Trend Master Akademi',
    description: 'Dijital ajansların görünmez teknik gücü: %100 White-Label, resmi NDA güvencesi, 20+ teknik yetkinlik, acil kriz masası ve kıdemli mühendislik takviyesi.',
    canonical: 'https://trendmasterakademi.com/agency/',
    ogUrl: 'https://trendmasterakademi.com/agency/',
    heading: 'Ajansınızın Yerine Değil, Ajansınızın Yanında Güvenilir Mühendislik Masası.',
    subheading: 'Bir projede teknik olarak tıkandığınızda, teslim tarihi yaklaştığında veya ekibinizin kapasitesi dolduğunda: %100 White-Label, resmi NDA ve doğrudan kıdemli mühendislik desteği.'
  },
  {
    dir: 'crash-test',
    title: 'Agency Crash Test (60sn) - Kriz & Risk Simülatörü | Trend Master Akademi',
    description: 'Ajansınız teknik bir krize hazır mı? HTTP 500 kesintisi, geliştirici ani ayrılığı veya T-48H lansman darboğazı için 60 saniyede risk skorunuzu ve eylem planınızı görün.',
    canonical: 'https://trendmasterakademi.com/crash-test/',
    ogUrl: 'https://trendmasterakademi.com/crash-test/',
    heading: 'Agency Crash Test // 60 Saniyede Ajans Kriz Dayanıklılık Skoru',
    subheading: 'Kritik kod kilitlenmeleri, devir süreçleri tıkanmış projeler veya yaklaşan teslimat baskısı altında ajansınızın risk puanını ölçün.'
  },
  {
    dir: 'about',
    title: 'Mühendislik Standartlarımız & Hakkımızda | Trend Master Akademi',
    description: 'Trend Master Akademi mühendislik standartları, 4 temel prensip ve B2B SWAT vizyonu.',
    canonical: 'https://trendmasterakademi.com/about/',
    ogUrl: 'https://trendmasterakademi.com/about/',
    heading: 'Ajansların Güvendiği Arka Plan Mühendislik Masası',
    subheading: 'Modern web, SaaS, API mimarileri ve acil kod kurtarma (SWAT) stüdyosu.'
  },
  {
    dir: 'privacy',
    title: 'KVKK Aydınlatma Metni & Gizlilik Politikası | Trend Master Akademi',
    description: 'Trend Master Akademi KVKK aydınlatma metni, veri sorumlusu taahhüdü, resmi NDA ve %100 White-Label gizlilik standartları.',
    canonical: 'https://trendmasterakademi.com/privacy/',
    ogUrl: 'https://trendmasterakademi.com/privacy/',
    heading: 'KVKK Aydınlatma Metni & Gizlilik Politikası',
    subheading: '6698 sayılı KVKK kapsamında veri sorumlusu taahhüdü, resmi NDA ve %100 White-Label gizlilik ilkeleri.'
  },
  {
    dir: 'gizlilik',
    title: 'KVKK Aydınlatma Metni & Gizlilik Politikası | Trend Master Akademi',
    description: 'Trend Master Akademi KVKK aydınlatma metni, veri sorumlusu taahhüdü, resmi NDA ve %100 White-Label gizlilik standartları.',
    canonical: 'https://trendmasterakademi.com/privacy/',
    ogUrl: 'https://trendmasterakademi.com/privacy/',
    heading: 'KVKK Aydınlatma Metni & Gizlilik Politikası',
    subheading: '6698 sayılı KVKK kapsamında veri sorumlusu taahhüdü, resmi NDA ve %100 White-Label gizlilik ilkeleri.'
  }
];

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

  // Clean Hreflang for this specific page
  html = html.replace(/<link rel="alternate" hreflang="tr" href=".*?" \/>/i, `<link rel="alternate" hreflang="tr" href="${page.canonical}" />`);
  html = html.replace(/<link rel="alternate" hreflang="x-default" href=".*?" \/>/i, `<link rel="alternate" hreflang="x-default" href="${page.canonical}" />`);
  html = html.replace(/<link rel="alternate" hreflang="en" href=".*?" \/>\s*/i, '');

  // Ensure Pre-rendered Semantic HTML is visible & corporate branded
  const semanticBlock = `
    <div class="ssr-pre-render p-6 sm:p-12 max-w-5xl mx-auto text-slate-200 font-sans">
      <header class="mb-8 border-b border-white/10 pb-6">
        <h1 class="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">${page.title}</h1>
        <nav class="flex flex-wrap gap-4 text-sm font-mono text-cyan-400">
          <a href="/" class="hover:underline">Ana Sayfa</a>
          <a href="/agency/" class="hover:underline">Ajans Çözümleri</a>
          <a href="/crash-test/" class="hover:underline">Crash Test (60sn)</a>
          <a href="/about/" class="hover:underline">Hakkımızda</a>
          <a href="/privacy/" class="hover:underline">KVKK & Gizlilik</a>
        </nav>
      </header>
      <main class="space-y-6">
        <h2 class="text-2xl font-bold text-white">${page.heading}</h2>
        <p class="text-slate-300 text-lg leading-relaxed">${page.subheading}</p>
        <section class="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2 mt-6">
          <h3 class="text-base font-bold text-cyan-300">Trend Master Akademi Studio & Labs</h3>
          <p class="text-sm text-slate-400">B2B White-Label Mühendislik Masası | Tel: <a href="tel:+905343713573" class="text-white">+90 534 371 35 73</a> | E-posta: <a href="mailto:info@trendmasterakademi.com" class="text-white">info@trendmasterakademi.com</a></p>
          <p class="text-xs text-slate-400">Adres: Akdeniz Mah. Heris Tower No:55/091 Konak / İzmir</p>
        </section>
      </main>
    </div>
  `;

  html = html.replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">${semanticBlock}</div>`);

  const destFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(destFile, html, 'utf8');
  console.log(`Generated: ${page.dir}/index.html (200 OK static page ready)`);
});

console.log('All static sub-pages generated successfully!');
