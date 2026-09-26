import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

// Ana sayfaya özel sayfalama (yalnız ana sayfa kullanır):
// - Fare tekerleği ve klavye satır satır değil sayfa sayfa kaydırır: ilk ekran ↔ "tüm sayfalar" dizini.
//   Dizin ekrandan uzunsa içinde doğal kaydırma sürer; dizinin tepesinden yukarı ilk ekrana döner.
//   Dokunmatik ekranda doğal kaydırma korunur (geçiş efektleri yine çalışır).
// - --ilerleme (0 ilk ekran … 1 dizin) kök öğeye her karede yazılır (React durumu değil); geçiş efektleri CSS'te bu değere bağlı.
// - Arama kutusu dizine inilince üstte ortada sabitlenir (yuva), ilk ekrana dönünce yerine döner; iki yer arasında kayarak geçer.
// - Hareketi azalt ayarında sayfalama anında atlar, kutu kaymaz, dönüşüm yoktur (index.css).

const SURE = 900; // sayfa geçişi (ms)
const KILIT = 450; // geçişten sonra tekerlek ataleti yutulur (ms)
const EGRI = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2); // başta ve sonda yavaş: sayfa hissi
const YUVA_EGRI = 'cubic-bezier(0.22, 1, 0.36, 1)';

export function useAnaSayfaSayfalama({ kokRef, dizinRef, kutuRef }) {
  const [yuvada, setYuvada] = useState(false);
  const yuvaRef = useRef(false);
  const oncekiKutu = useRef(null);
  const animRef = useRef(0);
  const kilitSon = useRef(0);
  const hareketYok = useRef(false);

  // Dizinin sayfadaki yerleşim konumu: geçiş efektinin dönüşümü (translateY) sayılmaz, yoksa hedef kayar
  const dizinUst = useCallback(() => {
    let y = 0;
    for (let el = dizinRef.current; el; el = el.offsetParent) y += el.offsetTop;
    return y;
  }, [dizinRef]);

  const git = useCallback((sayfa, bitince) => {
    const hedef = sayfa ? dizinUst() : 0;
    cancelAnimationFrame(animRef.current);
    const bas = window.scrollY;
    const fark = hedef - bas;
    const bitir = () => { animRef.current = 0; kilitSon.current = performance.now() + KILIT; if (bitince) bitince(); };
    if (hareketYok.current || Math.abs(fark) < 2) { window.scrollTo({ top: hedef, behavior: 'instant' }); bitir(); return; }
    const t0 = performance.now();
    const adim = (t) => {
      const k = Math.min(1, (t - t0) / SURE);
      window.scrollTo({ top: bas + fark * EGRI(k), behavior: 'instant' });
      if (k < 1) animRef.current = requestAnimationFrame(adim);
      else bitir();
    };
    animRef.current = requestAnimationFrame(adim);
  }, [dizinUst]);

  useEffect(() => {
    const kok = kokRef.current;
    if (!kok) return undefined;
    hareketYok.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    kok.setAttribute('data-sayfalama', 'acik');

    let bekleyen = 0;
    const guncelle = () => {
      bekleyen = 0;
      const h = dizinUst();
      const p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
      kok.style.setProperty('--ilerleme', p.toFixed(4));
      const yeni = yuvaRef.current ? p > 0.45 : p > 0.55;
      if (yeni !== yuvaRef.current) {
        yuvaRef.current = yeni;
        oncekiKutu.current = kutuRef.current ? kutuRef.current.getBoundingClientRect() : null;
        setYuvada(yeni);
      }
    };
    const kaydir = () => { if (!bekleyen) bekleyen = requestAnimationFrame(guncelle); };

    const tekerlek = (e) => {
      if (e.ctrlKey || e.defaultPrevented) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      if (e.target instanceof Element && e.target.closest('[role="listbox"], #nav-drawer')) return;
      const simdi = performance.now();
      if (animRef.current || simdi < kilitSon.current) { e.preventDefault(); return; }
      const y = window.scrollY;
      const h = dizinUst();
      const asagi = e.deltaY > 0;
      if (y < h - 2) { e.preventDefault(); if (asagi) git(1); else if (y > 0) git(0); return; }
      if (!asagi && y <= h + 2) { e.preventDefault(); git(0); return; }
      const px = e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1);
      if (!asagi && y + px < h) { e.preventDefault(); window.scrollTo({ top: h, behavior: 'instant' }); kilitSon.current = simdi + KILIT; }
    };

    const tus = (e) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const el = e.target instanceof Element ? e.target : null;
      if (el && el.closest('input, textarea, select, [contenteditable="true"], [role="tablist"], [role="listbox"], #nav-drawer')) return;
      const bosluk = e.key === ' ' || e.key === 'Spacebar';
      if (bosluk && el && el.closest('a, button')) return;
      const asagi = e.key === 'PageDown' || e.key === 'ArrowDown' || (bosluk && !e.shiftKey);
      const yukari = e.key === 'PageUp' || e.key === 'ArrowUp' || e.key === 'Home' || (bosluk && e.shiftKey);
      if (!asagi && !yukari) return;
      if (animRef.current) { e.preventDefault(); return; }
      const y = window.scrollY;
      const h = dizinUst();
      if (e.key === 'Home') { if (y > 0) { e.preventDefault(); git(0); } return; }
      if (y < h - 2) { e.preventDefault(); if (asagi) git(1); else if (y > 0) git(0); return; }
      if (yukari && y <= h + 2) { e.preventDefault(); git(0); }
    };

    const dokunus = () => { if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = 0; } };

    guncelle();
    window.addEventListener('scroll', kaydir, { passive: true });
    window.addEventListener('resize', kaydir);
    window.addEventListener('wheel', tekerlek, { passive: false });
    window.addEventListener('keydown', tus);
    window.addEventListener('touchstart', dokunus, { passive: true });
    return () => {
      cancelAnimationFrame(bekleyen);
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('scroll', kaydir);
      window.removeEventListener('resize', kaydir);
      window.removeEventListener('wheel', tekerlek);
      window.removeEventListener('keydown', tus);
      window.removeEventListener('touchstart', dokunus);
      kok.removeAttribute('data-sayfalama');
      kok.style.removeProperty('--ilerleme');
    };
  }, [kokRef, kutuRef, dizinUst, git]);

  // Arama kutusu ilk ekran ↔ yuva arasında kayarak geçer: eski konumdan yenisine (FLIP)
  useLayoutEffect(() => {
    const kutu = kutuRef.current;
    const once = oncekiKutu.current;
    oncekiKutu.current = null;
    if (!kutu || !once || hareketYok.current || typeof kutu.animate !== 'function') return;
    const sonra = kutu.getBoundingClientRect();
    const dx = once.left - sonra.left;
    const dy = once.top - sonra.top;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
    kutu.animate(
      [{ transform: `translate(${dx}px, ${dy}px)`, width: `${once.width}px` }, { transform: 'translate(0px, 0px)', width: `${sonra.width}px` }],
      { duration: 480, easing: YUVA_EGRI },
    );
  }, [yuvada, kutuRef]);

  return { git, yuvada };
}
