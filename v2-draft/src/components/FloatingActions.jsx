import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp } from 'lucide-react';

const FloatingActions = () => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isHoveredWA, setIsHoveredWA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
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
      ? '🚨 *TMA ACİL TEKNİK DESTEK / KRİZ HATTI* 🚨\n\nMerhaba, web siteniz üzerinden acil teknik müdahale / proje desteği almak için yazıyorum.'
      : '🚨 *TMA EMERGENCY TECHNICAL DISPATCH* 🚨\n\nHello, reaching out via your website for emergency engineering / project support.';
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-center gap-3.5 pointer-events-none">
      
      {/* 1. Stylish Scroll-To-Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="pointer-events-auto w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#0a0f18]/95 hover:bg-[#111827] border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 hover:text-white shadow-[0_4px_25px_rgba(0,0,0,0.7)] backdrop-blur-xl flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] group cursor-pointer animate-in fade-in zoom-in-75"
          aria-label={isTr ? 'Sayfa Başına Dön' : 'Scroll to Top'}
          title={isTr ? 'Sayfa Başına Dön' : 'Scroll to Top'}
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* 2. Direct Emergency WhatsApp Hotline */}
      <div 
        className="relative pointer-events-auto flex items-center"
        onMouseEnter={() => setIsHoveredWA(true)}
        onMouseLeave={() => setIsHoveredWA(false)}
      >
        {/* Tooltip on hover */}
        {isHoveredWA && (
          <div className="hidden sm:block absolute right-full mr-3.5 px-3.5 py-1.5 rounded-xl bg-[#0a0f18]/95 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold whitespace-nowrap shadow-[0_4px_20px_rgba(0,0,0,0.7)] backdrop-blur-md animate-in fade-in slide-in-from-right-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              {isTr ? 'Doğrudan Kriz Masası (WhatsApp)' : 'Emergency Hotline (WhatsApp)'}
            </span>
          </div>
        )}

        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (window.trackEvent) {
              window.trackEvent('whatsapp_clicked', { source: 'floating_widget' });
            }
          }}
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-[0_4px_25px_rgba(16,185,129,0.4)] flex items-center justify-center transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] cursor-pointer group border border-emerald-300/30"
          aria-label="WhatsApp Acil Destek"
        >
          {/* Custom Modern WhatsApp SVG */}
          <svg className="w-7 h-7 fill-current transform group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </a>
      </div>

    </div>
  );
};

export default FloatingActions;
