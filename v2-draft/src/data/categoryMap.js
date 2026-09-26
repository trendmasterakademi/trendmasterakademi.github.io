import { seoData } from './seoData.js';

export const CATEGORY_DEFS = [
  { id: 'acil', tr: 'Acil Durum', en: 'Emergency' },
  { id: 'teshis', tr: 'Teşhis Kataloğu', en: 'Diagnostic Catalog' },
  { id: 'araclar', tr: 'Araçlar', en: 'Tools' },
  { id: 'ajans', tr: 'Ajanslar İçin', en: 'For Agencies' },
  { id: 'vaka', tr: 'Vaka Arşivi', en: 'Case Archive' },
  { id: 'sozluk', tr: 'Sözlük', en: 'Glossary' },
  { id: 'kurumsal', tr: 'Kurumsal ve Yasal', en: 'Company & Legal' }
];

export const ORTAK_URLS = ['/', '/agency/', '/crash-test/', '/about/', '/privacy/', '/nda/', '/sos/', '/sla/', '/radar/'];

export const EN_TEK_URLS = [
  '/agency-kit/',
  '/handover-audit/',
  '/glossary/',
  '/downtime-calc/',
  '/story/',
  '/diagnostic/',
  '/salvageability/',
  '/post-mortems/',
  '/triage/',
  '/tech-matrix/',
  '/mutual-nda/',
  '/outage-simulator/',
  '/codebase-health/',
  '/rescue-roi/',
  '/ai-code-takeover/',
  '/overview/'
];

export const getDil = (url) => {
  if (ORTAK_URLS.includes(url)) return 'ortak';
  if (EN_TEK_URLS.includes(url) || /^\/(glossary|diagnostic|post-mortems)\/[^/]+\/$/.test(url)) return 'en';
  return 'tr';
};

const STATIC_KAT_MAP = [
  ['anasayfa', ['/']],
  ['acil', ['/sos/', '/triyaj/', '/triage/', '/radar/', '/sla/']],
  ['araclar', [
    '/crash-test/',
    '/devir-kontrolu/', '/handover-audit/',
    '/kesinti-maliyeti/', '/downtime-calc/',
    '/hasar-tespiti/', '/outage-simulator/',
    '/kod-sagligi/', '/codebase-health/',
    '/kurtarma-maliyeti/', '/rescue-roi/',
    '/kurtarilabilirlik/', '/salvageability/',
    '/teknoloji-uyumluluk/', '/tech-matrix/'
  ]],
  ['ajans', ['/agency/', '/kit/', '/agency-kit/', '/tmai/', '/ai-code-takeover/']],
  ['kurumsal', [
    '/tanitim/', '/overview/',
    '/about/',
    '/hikayemiz/', '/story/',
    '/nda/',
    '/gizlilik-sozlesmesi/', '/mutual-nda/',
    '/privacy/'
  ]],
];

export const getKategori = (url) => {
  for (const [ad, liste] of STATIC_KAT_MAP) {
    if (liste.includes(url)) return ad;
  }
  if (/^\/(teshis|diagnostic)\//.test(url)) return 'teshis';
  if (/^\/(post-mortem|post-mortems)\//.test(url)) return 'vaka';
  if (/^\/(sozluk|glossary)\//.test(url)) return 'sozluk';
  return '?';
};

export const getCleanTitle = (url, lang = 'tr') => {
  const entry = seoData[url];
  if (!entry) return url;
  const isEn = lang === 'en';
  const item = (isEn ? (entry.en || entry.tr) : (entry.tr || entry.en)) || {};
  const fullTitle = item.title || '';
  return fullTitle.replace(/\s*\|\s*Trend Master Akademi$/i, '').trim();
};

export const getPagesForLang = (lang = 'tr') => {
  const isEn = lang === 'en';
  const urls = Object.keys(seoData).filter(u => u !== '/');
  
  return urls
    .map(url => {
      const d = getDil(url);
      const kat = getKategori(url);
      const baslik = getCleanTitle(url, lang);
      return { url, dil: d, kategori: kat, baslik };
    })
    .filter(p => {
      if (isEn) return p.dil === 'en' || p.dil === 'ortak';
      return p.dil === 'tr' || p.dil === 'ortak';
    });
};
