import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BookOpen, X, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { agencyKitData } from '../data/agencyKitData';
import { isTurkish } from '../i18n';
import AgencyKitModal from './AgencyKitModal';

function KitBanner() {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const data = isTr ? agencyKitData.tr.banner : agencyKitData.en.banner;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(() => {
    try {
      return sessionStorage.getItem('tma_kit_banner_dismissed') !== 'true';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const handleOpen = () => setIsModalOpen(true);
    window.addEventListener('open-kit-modal', handleOpen);
    return () => window.removeEventListener('open-kit-modal', handleOpen);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem('tma_kit_banner_dismissed', 'true');
    } catch {
      // Ignore storage errors
    }
  };

  const handleRestore = () => {
    setIsVisible(true);
    try {
      sessionStorage.removeItem('tma_kit_banner_dismissed');
    } catch {
      // Ignore storage errors
    }
  };

  if (!isVisible) {
    return (
      <>
        {/* Subtle mini trigger tab when banner is dismissed */}
        <div className="fixed top-2 right-24 z-50 animate-in fade-in duration-300">
          <button
            onClick={handleRestore}
            className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono hover:bg-cyan-900/90 transition-colors shadow-lg flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
            title={isTr ? "TMA Agency Kiti Banner'ını Aç" : "Open TMA Agency Kit Banner"}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>{isTr ? 'TMA Kit' : 'Agency Kit'}</span>
          </button>
        </div>
        <AgencyKitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  // Ticker items duplicated for seamless infinite loop
  const tickerLoop = [...data.tickerItems, ...data.tickerItems];

  return (
    <>
      <div 
        className="w-full h-8 sm:h-9 bg-gradient-to-r from-[#03060c] via-[#080d19] to-[#03060c] border-b border-cyan-500/25 flex items-center justify-between text-xs font-mono select-none overflow-hidden relative z-50 text-slate-300"
        role="region"
        aria-label="TMA Agency Response Kit Banner"
      >
        {/* Left: Sticky Brand Badge */}
        <div className="flex items-center gap-2 px-3 sm:px-4 bg-[#03060c]/95 h-full z-20 flex-shrink-0 border-r border-white/10 shadow-[4px_0_12px_rgba(0,0,0,0.6)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="font-bold text-[11px] sm:text-xs text-white tracking-wider uppercase font-mono flex items-center gap-1">
            <span className="text-cyan-400 font-black">TMA</span>
            <span className="hidden sm:inline text-slate-300">AGENCY KIT</span>
          </span>
        </div>

        {/* Middle: Infinite Scrolling Marquee Ticker */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center mask-linear-gradient">
          <Link to="/kit/" className="animate-marquee flex items-center gap-8 sm:gap-12 whitespace-nowrap pl-4 cursor-pointer" title={isTr ? "Görsel Kılavuzu Aç" : "Open Visual Guide"}>
            {tickerLoop.map((item, index) => (
              <div 
                key={index} 
                className="inline-flex items-center gap-2 group hover:text-white transition-colors text-[11px] sm:text-xs"
              >
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold text-[10px] tracking-wider uppercase">
                  {item.tag}
                </span>
                <span className="text-slate-300 group-hover:text-cyan-200 transition-colors">
                  {item.text}
                </span>
                <span className="text-cyan-500/60 font-mono text-[10px] hidden sm:inline">
                  [+]
                </span>
              </div>
            ))}
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 bg-[#03060c]/95 h-full z-20 flex-shrink-0 border-l border-white/10 shadow-[-4px_0_12px_rgba(0,0,0,0.6)]">
          <Link
            to="/kit/"
            className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] sm:text-[11px] text-cyan-300 hover:text-white font-mono hover:bg-white/5 transition-colors whitespace-nowrap"
            title={isTr ? "TMA Agency Kit Görsel Sayfası" : "TMA Agency Kit Visual Page"}
          >
            <span>{isTr ? 'Görsel Galeri' : 'Gallery'}</span>
            <ArrowRight className="w-3 h-3 text-cyan-400" />
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-2 sm:px-3 py-1 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] sm:text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,229,255,0.3)] hover:scale-[1.02] cursor-pointer"
            aria-label="TMA Kiti İncele"
          >
            <BookOpen className="w-3 h-3 text-slate-950 flex-shrink-0" />
            <span className="hidden xs:inline">{data.cta}</span>
          </button>

          <button
            onClick={handleDismiss}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Kapat"
            title={isTr ? "Banner'ı gizle" : "Hide banner"}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Modal */}
      <AgencyKitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default React.memo(KitBanner);
