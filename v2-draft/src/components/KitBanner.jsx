import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BookOpen, X, ArrowRight } from 'lucide-react';
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
        <div className="fixed top-2 right-24 z-50">
          <button
            onClick={handleRestore}
            className="px-2.5 py-1 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink-2)] text-xs hover:border-[var(--accent)] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            title={isTr ? "TMA Agency Kiti Bilgi Satırını Aç" : "Open TMA Agency Kit Bar"}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
            <span>{isTr ? 'TMA Kit' : 'Agency Kit'}</span>
          </button>
        </div>
        <AgencyKitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  // Duran tek satır (Statik, sakin ve kurumsal bilgilendirme bandı)
  const featuredItem = data.tickerItems[0] || { tag: 'TMA KIT', text: 'White-Label Mühendislik Dokümantasyonu' };

  return (
    <>
      <div 
        className="w-full h-6 bg-[var(--surface)] border-b border-[var(--rule)] flex items-center justify-between text-[11px] font-sans select-none overflow-hidden relative z-50 text-[var(--ink-2)]"
        role="region"
        aria-label="TMA Agency Response Kit Banner"
      >
        {/* Left: Brand Badge */}
        <div className="flex items-center gap-1.5 px-2.5 sm:px-3 bg-[var(--accent-wash)] h-full z-20 flex-shrink-0 border-r border-[var(--rule)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
          <span className="font-semibold text-[10px] text-[var(--accent-ink)] tracking-wider uppercase">
            TMA AGENCY KIT
          </span>
        </div>

        {/* Middle: Static Informational Row */}
        <div className="flex-1 overflow-hidden h-full flex items-center px-3">
          <Link 
            to="/kit/" 
            className="flex items-center gap-2 text-[11px] text-[var(--ink-2)] hover:text-[var(--accent-ink)] transition-colors truncate" 
            title={isTr ? "Görsel Kılavuzu Aç" : "Open Visual Guide"}
          >
            <span className="px-1.5 py-0.5 rounded-[var(--r-control)] bg-[var(--accent-wash)] border border-[var(--accent)]/20 text-[var(--accent-ink)] font-semibold text-[10px] uppercase tracking-wider flex-shrink-0">
              {featuredItem.tag}
            </span>
            <span className="truncate font-medium text-[var(--ink)]">
              {featuredItem.text}
            </span>
            <span className="hidden md:inline text-[var(--ink-3)] text-[11px]">
              — {data.tickerItems[1]?.text || ''}
            </span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 px-2 bg-[var(--surface)] h-full z-20 flex-shrink-0 border-l border-[var(--rule)]">
          <Link
            to="/kit/"
            className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[var(--r-control)] text-[11px] text-[var(--ink-2)] hover:text-[var(--accent-ink)] hover:bg-[var(--paper)] transition-colors whitespace-nowrap"
            title={isTr ? "TMA Agency Kit Görsel Sayfası" : "TMA Agency Kit Visual Page"}
          >
            <span>{isTr ? 'Görsel Galeri' : 'Gallery'}</span>
            <ArrowRight className="w-3 h-3 text-[var(--accent)]" />
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-2 py-0.5 rounded-[var(--r-control)] bg-[var(--accent)] hover:bg-[var(--accent-ink)] text-white font-medium text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            aria-label="TMA Kiti İncele"
          >
            <BookOpen className="w-3 h-3 flex-shrink-0" />
            <span className="hidden xs:inline">{data.cta}</span>
          </button>

          <button
            onClick={handleDismiss}
            className="p-0.5 rounded-[var(--r-control)] text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--paper)] transition-colors cursor-pointer"
            aria-label="Kapat"
            title={isTr ? "Banner'ı gizle" : "Hide banner"}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Interactive Modal */}
      <AgencyKitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default React.memo(KitBanner);
