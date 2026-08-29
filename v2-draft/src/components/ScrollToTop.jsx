import { useLayoutEffect, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    if (hash) {
      const timer = setTimeout(() => {
        const id = hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
      return () => clearTimeout(timer);
    }

    const scrollToTop = () => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };

    scrollToTop();
    const rafId = requestAnimationFrame(scrollToTop);
    const timeoutId = setTimeout(scrollToTop, 50);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
