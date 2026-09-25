// Şiddet etiketi — kod (SEV-0 … SEV-3) iki dilde aynı kalır; yanındaki İngilizce sözcük Türkçe sayfada Türkçe yazılır.
// Veride etiket tek dizedir ('SEV-1 CRITICAL'); bu fonksiyon yalnız gösterimi değiştirir, includes('SEV-1') gibi mantıklara dokunmaz.
const tr = { CRITICAL: 'KRİTİK', HIGH: 'YÜKSEK', MAJOR: 'CİDDİ' };

export const siddetEtiketi = (siddet, lang) =>
  lang === 'tr' ? String(siddet || '').replace(/\b(CRITICAL|HIGH|MAJOR)\b/g, (w) => tr[w]) : siddet;
