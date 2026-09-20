export const ROUTE_PAIRS = [
  { tr: '/', en: '/' },
  { tr: '/agency/', en: '/agency/' },
  { tr: '/crash-test/', en: '/crash-test/' },
  { tr: '/devir-kontrolu/', en: '/handover-audit/' },
  { tr: '/sozluk/', en: '/glossary/' },
  { tr: '/kesinti-maliyeti/', en: '/downtime-calc/' },
  { tr: '/about/', en: '/about/' },
  { tr: '/hikayemiz/', en: '/story/' },
  { tr: '/privacy/', en: '/privacy/' },
  { tr: '/gizlilik/', en: '/privacy/' },
  { tr: '/kvkk/', en: '/privacy/' },
  { tr: '/nda/', en: '/nda/' },
  { tr: '/teshis/', en: '/diagnostic/' },
  { tr: '/sos/', en: '/sos/' },
  { tr: '/kurtarilabilirlik/', en: '/salvageability/' },
  { tr: '/post-mortem/', en: '/post-mortems/' },
  { tr: '/triyaj/', en: '/triage/' },
  { tr: '/sla/', en: '/sla/' },
  { tr: '/teknoloji-uyumluluk/', en: '/tech-matrix/' },
  { tr: '/gizlilik-sozlesmesi/', en: '/mutual-nda/' },
  { tr: '/hasar-tespiti/', en: '/outage-simulator/' },
  { tr: '/radar/', en: '/radar/' },
  { tr: '/kod-sagligi/', en: '/codebase-health/' },
  { tr: '/kurtarma-maliyeti/', en: '/rescue-roi/' },
];

export const normalizePath = (pathname) => {
  if (!pathname) return '/';
  let p = pathname.toLowerCase().trim();
  if (!p.startsWith('/')) p = '/' + p;
  if (!p.endsWith('/')) p = p + '/';
  return p;
};

export const getLocalizedPath = (currentPath, targetLang) => {
  const norm = normalizePath(currentPath);
  const isTargetEn = targetLang?.toLowerCase().startsWith('en');

  // Dynamic routes:
  // /sozluk/:slug/ <-> /glossary/:slug/
  if (norm.startsWith('/sozluk/')) {
    const slug = norm.replace('/sozluk/', '').replace('/', '');
    return isTargetEn ? (slug ? `/glossary/${slug}/` : '/glossary/') : (slug ? `/sozluk/${slug}/` : '/sozluk/');
  }
  if (norm.startsWith('/glossary/')) {
    const slug = norm.replace('/glossary/', '').replace('/', '');
    return isTargetEn ? (slug ? `/glossary/${slug}/` : '/glossary/') : (slug ? `/sozluk/${slug}/` : '/sozluk/');
  }

  // /teshis/:slug/ <-> /diagnostic/:slug/
  if (norm.startsWith('/teshis/')) {
    const slug = norm.replace('/teshis/', '').replace('/', '');
    return isTargetEn ? (slug ? `/diagnostic/${slug}/` : '/diagnostic/') : (slug ? `/teshis/${slug}/` : '/teshis/');
  }
  if (norm.startsWith('/diagnostic/') || norm.startsWith('/diagnostics/')) {
    const slug = norm.replace(/^\/diagnostics?\//, '').replace('/', '');
    return isTargetEn ? (slug ? `/diagnostic/${slug}/` : '/diagnostic/') : (slug ? `/teshis/${slug}/` : '/teshis/');
  }

  // /post-mortem/:slug/ <-> /post-mortems/:slug/
  if (norm.startsWith('/post-mortem/')) {
    const slug = norm.replace('/post-mortem/', '').replace('/', '');
    return isTargetEn ? (slug ? `/post-mortems/${slug}/` : '/post-mortems/') : (slug ? `/post-mortem/${slug}/` : '/post-mortem/');
  }
  if (norm.startsWith('/post-mortems/')) {
    const slug = norm.replace('/post-mortems/', '').replace('/', '');
    return isTargetEn ? (slug ? `/post-mortems/${slug}/` : '/post-mortems/') : (slug ? `/post-mortem/${slug}/` : '/post-mortem/');
  }

  // Static route pairs
  for (const pair of ROUTE_PAIRS) {
    if (norm === pair.tr || norm === pair.en) {
      return isTargetEn ? pair.en : pair.tr;
    }
  }

  return currentPath;
};

export const getLangFromPath = (pathname) => {
  const norm = normalizePath(pathname);
  if (
    norm.startsWith('/handover-audit/') ||
    norm.startsWith('/glossary/') ||
    norm.startsWith('/downtime-calc/') ||
    norm.startsWith('/downtime-cost/') ||
    norm.startsWith('/diagnostic/') ||
    norm.startsWith('/diagnostics/') ||
    norm.startsWith('/story/') ||
    norm.startsWith('/salvageability/') ||
    norm.startsWith('/post-mortems/') ||
    norm.startsWith('/triage/') ||
    norm.startsWith('/tech-matrix/') ||
    norm.startsWith('/mutual-nda/') ||
    norm.startsWith('/outage-simulator/') ||
    norm.startsWith('/codebase-health/') ||
    norm.startsWith('/rescue-roi/')
  ) {
    return 'en';
  }
  if (
    norm.startsWith('/devir-kontrolu/') ||
    norm.startsWith('/sozluk/') ||
    norm.startsWith('/kesinti-maliyeti/') ||
    norm.startsWith('/teshis/') ||
    norm.startsWith('/hikayemiz/') ||
    norm.startsWith('/gizlilik/') ||
    norm.startsWith('/kvkk/') ||
    norm.startsWith('/kurtarilabilirlik/') ||
    norm.startsWith('/post-mortem/') ||
    norm.startsWith('/triyaj/') ||
    norm.startsWith('/teknoloji-uyumluluk/') ||
    norm.startsWith('/gizlilik-sozlesmesi/') ||
    norm.startsWith('/hasar-tespiti/') ||
    norm.startsWith('/kod-sagligi/') ||
    norm.startsWith('/kurtarma-maliyeti/')
  ) {
    return 'tr';
  }
  return null;
};
