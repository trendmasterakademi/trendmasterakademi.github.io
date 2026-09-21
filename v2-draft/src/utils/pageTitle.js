import { seoData } from '../data/seoData.js';

export function formatDocumentTitle(title) {
  if (!title || title.length <= 60) {
    return title;
  }
  const brandSuffix = ' | Trend Master Akademi';
  if (title.endsWith(brandSuffix)) {
    return title.slice(0, -brandSuffix.length);
  }
  return title;
}

export function setPageSeo(path, lang = 'tr') {
  if (!path) return;
  const cleanPath = path.endsWith('/') ? path : `${path}/`;
  const pageSeo = seoData[cleanPath] || seoData[path];
  if (!pageSeo) return;
  const entry = pageSeo[lang] || pageSeo.tr || pageSeo.en;
  if (!entry) return;

  if (entry.title) {
    document.title = formatDocumentTitle(entry.title);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = entry.title;
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.content = entry.title;
  }
  if (entry.desc) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = entry.desc;
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = entry.desc;
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.content = entry.desc;
  }

  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) {
    ogLocale.content = lang === 'en' ? 'en_US' : 'tr_TR';
  }

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.href = `https://trendmasterakademi.com${cleanPath}`;
  }
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) {
    ogUrl.content = `https://trendmasterakademi.com${cleanPath}`;
  }
}
