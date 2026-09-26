import { lazy, createElement } from 'react';

// Rota sayfaları. İlk açılışta sayfanın kendi kodu (HTML'deki modulepreload bağlantısı) React çizmeden önce yüklenir
// ve sayfa ilk çizimde içerikle gelir. Eskiden önce yükleme iskeleti, sonra içerik çiziliyor, alt bilgi yer
// değiştiriyordu (masaüstünde ekran kayması ~0,3). Sayfa modülü `hazirla(yol)` dışa aktarırsa (teşhis verisi gibi)
// o da beklenir. Sonraki gezinmelerde her sayfa eskisi gibi ihtiyaç anında (lazy) yüklenir.
const kayit = new Map();

export const sayfa = (ad, yukle) => {
  let modul = null;
  const Tembel = lazy(yukle);
  const Sayfa = (props) => createElement(modul || Tembel, props);
  kayit.set(ad, (yol) => yukle().then((m) => {
    modul = m.default;
    const gecerliYol = yol || (typeof window !== 'undefined' ? window.location.pathname : '/');
    return m.hazirla ? m.hazirla(gecerliYol) : null;
  }));
  return Sayfa;
};

export const sayfayiHazirla = (ad, yol = '/') => {
  const hazirla = kayit.get(ad);
  return hazirla ? hazirla(yol) : Promise.resolve(null);
};

export const ilkSayfayiHazirla = () => {
  if (typeof document === 'undefined') return Promise.resolve(null);
  const adresler = [...document.querySelectorAll('link[rel="modulepreload"]')].map((l) => l.getAttribute('href') || '');
  const bekle = [...kayit]
    .filter(([ad]) => adresler.some((a) => new RegExp(`^/assets/${ad}-[A-Za-z0-9_-]{8}\\.js$`).test(a)))
    .map(([, hazirla]) => hazirla(typeof window !== 'undefined' ? window.location.pathname : '/'));
  return Promise.all(bekle).catch(() => null);
};
