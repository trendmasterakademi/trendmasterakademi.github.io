import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import arkaPlan from '../data/arkaPlan.json';

// Ana sayfa arka planı: dört sahne, dönüşümlü üç geçiş.
// Geçişler tarayıcının animasyon motoruyla (Web Animations) çalışır; React yalnız geçişin başında ve sonunda güncellenir.
// Sıradaki sahnenin fotoğrafı geçişten önce iner ve çözülür; inmemiş fotoğrafa geçilmez.

export const GECISLER = ['tarama', 'radar', 'derinlik'];
const SAHNE_SURESI = 9000; // bir sahnenin ekranda kaldığı süre (ms), geçiş bittikten sonra sayılır
const SURE = { tarama: 1400, radar: 1600, derinlik: 1600 };
const EGRI = 'cubic-bezier(0.22, 1, 0.36, 1)';
const YUKLEME_BEKLEME = 8000; // sıradaki fotoğraf bu sürede inmezse bu tur atlanır
const YAKINLASMA = { olcek: 1.05, sure: SAHNE_SURESI + 2 * 1600 + 2000 };

const SAHNELER = [...arkaPlan].sort((a, b) => a.sahne - b.sahne);

const srcSet = (sahne, yon, bicim) =>
  sahne.dosyalar
    .filter((d) => d.yon === yon && d.bicim === bicim)
    .sort((a, b) => a.w - b.w)
    .map((d) => `/arka-plan/${d.ad} ${d.w}w`)
    .join(', ');

const yedekSrc = (sahne) => {
  const y = sahne.dosyalar.filter((d) => d.yon === 'yatay' && d.bicim === 'webp').sort((a, b) => a.w - b.w);
  const d = y.find((x) => x.w >= 1920) || y[y.length - 1];
  return `/arka-plan/${d.ad}`;
};

// Geçişe giren katmanın ilk (ilk kareyle aynı) stili: animasyon başlamadan önce de doğru görünür
const MASKE = 'linear-gradient(to bottom, #000 45%, transparent 55%)';
const gelenStil = (tur) => {
  if (tur === 'tarama') return { maskImage: MASKE, WebkitMaskImage: MASKE, maskSize: '100% 250%', WebkitMaskSize: '100% 250%', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: '0% 100%', WebkitMaskPosition: '0% 100%' };
  if (tur === 'radar') return { clipPath: 'circle(0% at 50% 50%)', WebkitClipPath: 'circle(0% at 50% 50%)' };
  return { opacity: 0, transform: 'scale(1.08)' };
};

const SahneResmi = ({ sahne, oncelik, resimRef }) => (
  <picture className="block w-full h-full">
    <source media="(orientation: portrait)" type="image/avif" srcSet={srcSet(sahne, 'dikey', 'avif')} sizes="100vw" />
    <source media="(orientation: portrait)" type="image/webp" srcSet={srcSet(sahne, 'dikey', 'webp')} sizes="100vw" />
    <source type="image/avif" srcSet={srcSet(sahne, 'yatay', 'avif')} sizes="100vw" />
    <source type="image/webp" srcSet={srcSet(sahne, 'yatay', 'webp')} sizes="100vw" />
    <img
      ref={resimRef}
      src={yedekSrc(sahne)}
      alt=""
      fetchPriority={oncelik}
      decoding="async"
      draggable={false}
      className="w-full h-full object-cover object-center select-none"
    />
  </picture>
);

const HomeBackground = () => {
  // katman: { anahtar, sahne (0..3), rol: 'aktif' | 'sonraki' | 'giden' | 'gelen' }
  const [durum, setDurum] = useState({ katmanlar: [{ anahtar: 0, sahne: 0, rol: 'aktif' }], gecis: null, sayac: 1 });
  const kutular = useRef(new Map()); // anahtar → katman div'i
  const resimler = useRef(new Map()); // anahtar → img
  const cizgi = useRef(null);
  const durumRef = useRef(durum);
  const animler = useRef(new Set());
  const zamanlayici = useRef(null);
  const turSayac = useRef(0);
  const bitti = useRef(false);
  const hareketYok = useRef(false);
  const planlaRef = useRef(null);
  const sonrakiEkleRef = useRef(null);
  durumRef.current = durum;

  const izle = (a) => { animler.current.add(a); a.finished.then(() => animler.current.delete(a), () => animler.current.delete(a)); return a; };
  const yakinlas = (img) => {
    if (!img || hareketYok.current || typeof img.animate !== 'function') return;
    izle(img.animate([{ transform: 'scale(1)' }, { transform: `scale(${YAKINLASMA.olcek})` }], { duration: YAKINLASMA.sure, easing: 'linear', fill: 'forwards' }));
  };

  // Yaşam döngüsü: tek sefer kurulur, yalnız bileşen kaldırılınca temizlenir (geçiş sırasında hiçbir şey iptal edilmez)
  useEffect(() => {
    hareketYok.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (hareketYok.current) return undefined;

    const sonrakiEkle = () => setDurum((d) => {
      if (d.katmanlar.some((k) => k.rol === 'sonraki')) return d;
      const aktif = d.katmanlar.find((k) => k.rol === 'aktif');
      return { ...d, sayac: d.sayac + 1, katmanlar: [...d.katmanlar, { anahtar: d.sayac, sahne: (aktif.sahne + 1) % SAHNELER.length, rol: 'sonraki' }] };
    });

    const inmesiniBekle = (img) => new Promise((coz, reddet) => {
      if (!img) { reddet(new Error('resim yok')); return; }
      const bitir = () => (img.naturalWidth > 0 ? (img.decode ? img.decode().then(coz, coz) : coz()) : reddet(new Error('bozuk')));
      if (img.complete) { bitir(); return; }
      const t = setTimeout(() => reddet(new Error('zaman aşımı')), YUKLEME_BEKLEME);
      img.addEventListener('load', () => { clearTimeout(t); bitir(); }, { once: true });
      img.addEventListener('error', () => { clearTimeout(t); reddet(new Error('hata')); }, { once: true });
    });

    const planla = () => { clearTimeout(zamanlayici.current); zamanlayici.current = setTimeout(gecisDene, SAHNE_SURESI); };

    async function gecisDene() {
      if (bitti.current) return;
      if (document.hidden) return; // görünür olunca yeniden planlanır
      const sonraki = durumRef.current.katmanlar.find((k) => k.rol === 'sonraki');
      if (!sonraki) { sonrakiEkle(); planla(); return; }
      try { await inmesiniBekle(resimler.current.get(sonraki.anahtar)); } catch { planla(); return; }
      if (bitti.current || document.hidden) return;
      const tur = GECISLER[turSayac.current % GECISLER.length];
      turSayac.current += 1;
      setDurum((d) => ({
        ...d,
        gecis: { tur, id: d.sayac },
        sayac: d.sayac + 1,
        katmanlar: d.katmanlar.map((k) => (k.rol === 'aktif' ? { ...k, rol: 'giden' } : k.rol === 'sonraki' ? { ...k, rol: 'gelen' } : k)),
      }));
    }
    planlaRef.current = planla;
    sonrakiEkleRef.current = sonrakiEkle;

    // Sıradaki sahne, açılış fotoğrafı ve sayfa yüklendikten sonra DOM'a girer (açılışın bant genişliğini paylaşmaz)
    const ilkSonraki = () => {
      const bosta = window.requestIdleCallback || ((f) => setTimeout(f, 1500));
      bosta(() => { if (!bitti.current) sonrakiEkle(); });
    };
    if (document.readyState === 'complete') ilkSonraki(); else window.addEventListener('load', ilkSonraki, { once: true });
    yakinlas(resimler.current.get(0));
    planla();

    const gorunurluk = () => { if (document.hidden) clearTimeout(zamanlayici.current); else if (!durumRef.current.gecis) planla(); };
    document.addEventListener('visibilitychange', gorunurluk);

    return () => {
      bitti.current = true;
      clearTimeout(zamanlayici.current);
      window.removeEventListener('load', ilkSonraki);
      document.removeEventListener('visibilitychange', gorunurluk);
      animler.current.forEach((a) => a.cancel());
      animler.current.clear();
    };
  }, []);

  // Geçişi oynat: yeni rolleri DOM'a işlenir işlenmez, boyamadan önce başlar
  useLayoutEffect(() => {
    const g = durum.gecis;
    if (!g) return;
    const gelen = durum.katmanlar.find((k) => k.rol === 'gelen');
    const giden = durum.katmanlar.find((k) => k.rol === 'giden');
    const gelenKutu = gelen && kutular.current.get(gelen.anahtar);
    const gidenKutu = giden && kutular.current.get(giden.anahtar);
    if (!gelenKutu || typeof gelenKutu.animate !== 'function') return;
    const secenek = { duration: SURE[g.tur], easing: EGRI, fill: 'forwards' };
    const oynayan = [];
    if (g.tur === 'tarama') {
      oynayan.push(gelenKutu.animate([{ maskPosition: '0% 100%', webkitMaskPosition: '0% 100%' }, { maskPosition: '0% 0%', webkitMaskPosition: '0% 0%' }], secenek));
      if (cizgi.current) oynayan.push(cizgi.current.animate([{ transform: 'translateY(-25vh)', opacity: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 1, offset: 0.9 }, { transform: 'translateY(125vh)', opacity: 0 }], secenek));
    } else if (g.tur === 'radar') {
      oynayan.push(gelenKutu.animate([{ clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(72% at 50% 50%)' }], secenek));
    } else {
      oynayan.push(gelenKutu.animate([{ opacity: 0, transform: 'scale(1.08)' }, { opacity: 1, transform: 'scale(1)' }], secenek));
      if (gidenKutu) oynayan.push(gidenKutu.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.1)' }], secenek));
    }
    oynayan.forEach(izle);
    yakinlas(resimler.current.get(gelen.anahtar));
    Promise.all(oynayan.map((a) => a.finished)).then(() => {
      if (bitti.current) return;
      setDurum((d) => (d.gecis && d.gecis.id === g.id
        ? { ...d, gecis: null, katmanlar: d.katmanlar.filter((k) => k.rol !== 'giden').map((k) => (k.rol === 'gelen' ? { ...k, rol: 'aktif' } : k)) }
        : d));
    }, () => {});
  }, [durum.gecis]);

  // Geçiş bitince: son karede tutulan geçiş animasyonları bırakılır (dinlenme stili zaten aynı), sıradaki sahne eklenir, sayaç yeniden kurulur
  const oncekiGecis = useRef(null);
  useLayoutEffect(() => {
    if (durum.gecis) { oncekiGecis.current = durum.gecis; return; }
    if (!oncekiGecis.current) return;
    oncekiGecis.current = null;
    durum.katmanlar.forEach((k) => {
      const kutu = kutular.current.get(k.anahtar);
      if (kutu && kutu.getAnimations) kutu.getAnimations().forEach((a) => a.cancel());
    });
    if (cizgi.current && cizgi.current.getAnimations) cizgi.current.getAnimations().forEach((a) => a.cancel());
    if (sonrakiEkleRef.current) sonrakiEkleRef.current();
    if (planlaRef.current) planlaRef.current();
  }, [durum.gecis, durum.katmanlar]);

  const aktif = durum.katmanlar.find((k) => k.rol === 'aktif' || k.rol === 'gelen');
  const katmanStili = (k) => {
    if (k.rol === 'sonraki') return { zIndex: 0, opacity: 0 };
    if (k.rol === 'giden') return { zIndex: 1 };
    if (k.rol === 'gelen') return { zIndex: 2, ...gelenStil(durum.gecis ? durum.gecis.tur : 'derinlik') };
    return { zIndex: 1 };
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
      data-arka-plan=""
      data-sahne={aktif ? SAHNELER[aktif.sahne].sahne : 1}
      data-gecis={durum.gecis ? durum.gecis.tur : undefined}
    >
      <div className="absolute inset-0 bg-[var(--paper)]" />
      {durum.katmanlar.map((k) => (
        <div
          key={k.anahtar}
          ref={(el) => { if (el) kutular.current.set(k.anahtar, el); else kutular.current.delete(k.anahtar); }}
          className="absolute inset-0 overflow-hidden"
          data-katman={k.rol}
          data-sahne-no={SAHNELER[k.sahne].sahne}
          style={katmanStili(k)}
        >
          <SahneResmi
            sahne={SAHNELER[k.sahne]}
            oncelik={k.anahtar === 0 ? 'high' : 'low'}
            resimRef={(el) => { if (el) resimler.current.set(k.anahtar, el); else resimler.current.delete(k.anahtar); }}
          />
        </div>
      ))}
      {durum.gecis && durum.gecis.tur === 'tarama' && (
        <div
          ref={cizgi}
          className="absolute left-0 right-0 top-0 h-[2px] pointer-events-none"
          style={{
            zIndex: 3,
            opacity: 0,
            background: 'rgba(76, 178, 130, 0.85)',
            boxShadow: '0 0 12px rgba(76, 178, 130, 0.9), 0 -1px 3px rgba(235, 87, 87, 0.6), 0 1px 3px rgba(56, 189, 248, 0.6)',
          }}
        />
      )}
    </div>
  );
};

export default HomeBackground;
