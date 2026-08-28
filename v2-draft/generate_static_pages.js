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
    canonical: 'https://trendmasterakademi.com/agency',
    ogUrl: 'https://trendmasterakademi.com/agency',
    heading: 'Ajansınızın Yerine Değil, Ajansınızın Yanında Güvenilir Mühendislik Masası.',
    subheading: 'Bir projede teknik olarak tıkandığınızda, teslim tarihi yaklaştığında veya ekibinizin kapasitesi dolduğunda: %100 White-Label, resmi NDA ve doğrudan kıdemli mühendislik desteği.'
  },
  {
    dir: 'crash-test',
    title: 'Agency Crash Test (60sn) - Kriz & Risk Simülatörü | Trend Master Akademi',
    description: 'Ajansınız teknik bir krize hazır mı? HTTP 500 kesintisi, geliştirici ani ayrılığı veya T-48H lansman darboğazı için 60 saniyede risk skorunuzu ve eylem planınızı görün.',
    canonical: 'https://trendmasterakademi.com/crash-test',
    ogUrl: 'https://trendmasterakademi.com/crash-test',
    heading: 'Agency Crash Test // 60 Saniyede Ajans Kriz Dayanıklılık Skoru',
    subheading: 'Kritik kod kilitlenmeleri, devir süreçleri tıkanmış projeler veya yaklaşan teslimat baskısı altında ajansınızın risk puanını ölçün.'
  },
  {
    dir: 'about',
    title: 'Mühendislik Standartlarımız & Hakkımızda | Trend Master Akademi',
    description: 'Kurucu & Developer Mehmet Şahin liderliğinde Trend Master Akademi mühendislik standartları, 4 temel prensip ve B2B SWAT vizyonu.',
    canonical: 'https://trendmasterakademi.com/about',
    ogUrl: 'https://trendmasterakademi.com/about',
    heading: 'Ajansların Güvendiği Arka Plan Mühendislik Masası',
    subheading: 'Kurucu ve geliştirici Mehmet Şahin liderliğinde modern web, SaaS, API mimarileri ve acil kod kurtarma (SWAT) stüdyosu.'
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

  // Replace Twitter Title & URL
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${page.title}" />`);
  html = html.replace(/<meta name="twitter:url" content=".*?" \/>/i, `<meta name="twitter:url" content="${page.ogUrl}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${page.description}" />`);

  // Ensure Pre-rendered Semantic HTML is tailored
  const semanticBlock = `
      <header style="display:none" aria-hidden="true">
        <h1>${page.title}</h1>
        <nav>
          <a href="/">Ana Sayfa</a>
          <a href="/agency">Ajans Çözümleri</a>
          <a href="/crash-test">Agency Crash Test (60sn)</a>
          <a href="/about">Hakkımızda & Mühendislik Standartları</a>
        </nav>
      </header>
      <main style="display:none" aria-hidden="true">
        <h2>${page.heading}</h2>
        <p>${page.subheading}</p>
        <section>
          <h3>Trend Master Akademi Studio & Labs</h3>
          <p>Kurucu & Kıdemli Geliştirici: Mehmet Şahin | Telefon: +90 534 371 35 73 | E-posta: info@trendmasterakademi.com</p>
          <p>Adres: Akdeniz Mah. Heris Tower No:55/091 Konak / İzmir</p>
        </section>
      </main>
  `;

  html = html.replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">${semanticBlock}</div>`);

  const destFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(destFile, html, 'utf8');
  console.log(`Generated: ${page.dir}/index.html (200 OK static page ready)`);
});

console.log('All static sub-pages generated successfully!');
