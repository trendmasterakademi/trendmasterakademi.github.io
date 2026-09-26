import { useLayoutEffect, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();
  const ilkAcilis = useRef(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    const ilk = ilkAcilis.current;
    ilkAcilis.current = false;
    if (hash) {
      const id = hash.replace('#', '');
      let attempts = 0;
      const maxAttempts = 40; // 40 * 50ms = 2000ms
      const interval = setInterval(() => {
        attempts++;
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          clearInterval(interval);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    }

    // Adım 100: ilk açılışta sayfa zaten en üstte — hiçbir şey zorlanmaz. Sayfa içi geçişte yalnız gerçekten aşağıdaysa
    // en üste alınır (eskiden beş kez zorlanıyordu; her çağrı ağır sayfada zorunlu düzen hesabı ve uzun görev demekti).
    if (ilk) return undefined;
    const enUste = () => { if (window.scrollY !== 0) window.scrollTo({ top: 0, behavior: 'instant' }); };
    enUste();
    const raf = requestAnimationFrame(enUste);
    const t = setTimeout(enUste, 100);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
