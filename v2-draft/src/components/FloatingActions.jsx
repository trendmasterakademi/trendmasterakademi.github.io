import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const FloatingActions = () => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isHoveredWA, setIsHoveredWA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const getWhatsAppUrl = () => {
    const phone = '905343713573';
    const text = isTr
      ? '🚨 *TMA ACİL TEKNİK DESTEK / KRİZ HATTI* 🚨\n\nMerhaba Mehmet Bey, web siteniz üzerinden acil teknik müdahale / proje desteği almak için yazıyorum.'
      : '🚨 *TMA EMERGENCY TECHNICAL DISPATCH* 🚨\n\nHello Mehmet, reaching out via your website for emergency engineering / project support.';
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-center gap-3.5 pointer-events-none">
      
      {/* 1. Stylish Scroll-To-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 15 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="pointer-events-auto w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#0a0f18]/95 hover:bg-[#111827] border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 hover:text-white shadow-[0_4px_25px_rgba(0,0,0,0.7)] backdrop-blur-xl flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] group cursor-pointer"
            aria-label={isTr ? 'Sayfa Başına Dön' : 'Scroll to Top'}
            title={isTr ? 'Sayfa Başına Dön' : 'Scroll to Top'}
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. Floating Emergency WhatsApp Desk Widget */}
      <div
        className="pointer-events-auto relative flex items-center justify-end"
        onMouseEnter={() => setIsHoveredWA(true)}
        onMouseLeave={() => setIsHoveredWA(false)}
      >
        {/* Floating Tooltip / Info Badge on Hover (Desktop) */}
        <AnimatePresence>
          {isHoveredWA && (
            <motion.div
              initial={{ opacity: 0, x: 12, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 12, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-full mr-3 hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#080d16]/95 border border-emerald-500/40 text-slate-100 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl whitespace-nowrap"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-mono font-bold text-emerald-400 tracking-wider uppercase">
                  {isTr ? '7/24 Kriz Masası // WhatsApp' : '24/7 Response Desk // WhatsApp'}
                </span>
                <span className="text-sm font-bold text-white font-mono">
                  +90 534 371 35 73
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp Floating Action Button */}
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noreferrer"
          className="relative w-13 h-13 sm:w-15 sm:h-15 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 hover:from-emerald-400 hover:to-teal-600 text-white shadow-[0_6px_25px_rgba(16,185,129,0.45)] hover:shadow-[0_0_35px_rgba(16,185,129,0.75)] border border-emerald-300/40 flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 group cursor-pointer"
          aria-label="WhatsApp Kriz Hattı"
          title={isTr ? 'WhatsApp ile Kriz Masasına Bağlan' : 'Connect to Response Desk on WhatsApp'}
        >
          {/* Radar Ripple Effect */}
          <span className="w-full h-full absolute inset-0 rounded-2xl sm:rounded-3xl bg-emerald-400/25 animate-ping pointer-events-none -z-10" />
          
          {/* WhatsApp Custom Vector Icon */}
          <svg
            className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow-md group-hover:rotate-6 transition-transform"
            viewBox="0 0 24 24"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.510l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>

          {/* Active Online Indicator */}
          <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-3.5 h-3.5 rounded-full bg-emerald-300 border-2 border-[#080b11] shadow-sm" />
        </a>
      </div>

    </div>
  );
};

export default FloatingActions;