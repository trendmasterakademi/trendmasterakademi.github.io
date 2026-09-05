import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { useKrizHattiAcik } from '../utils/krizHatti';

const EmergencySOSModal = lazy(() => import('./EmergencySOSModal'));

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const krizHattiAcik = useKrizHattiAcik();
  const [isOpen, setIsOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleLang = () => {
    const newLang = i18n.language === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const handleOpenSOS = () => setIsSOSOpen(true);
    window.addEventListener('open-sos-modal', handleOpenSOS);
    return () => window.removeEventListener('open-sos-modal', handleOpenSOS);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/' && location.pathname !== '') {
      return;
    }

    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      setScrolled(window.scrollY > 30);

      const sections = [
        { id: 'contact', el: document.getElementById('contact') },
        { id: 'services', el: document.getElementById('services') },
        { id: 'agency-preview', el: document.getElementById('agency-preview') },
        { id: 'hero', el: document.getElementById('hero') }
      ];

      for (const sec of sections) {
        if (sec.el) {
          const top = sec.el.offsetTop;
          const height = sec.el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sec.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavClick = (e, targetId) => {
    if (location.pathname === '/' || location.pathname === '') {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(targetId);
      }
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  const isHome = location.pathname === '/' || location.pathname === '';
  const isTr = i18n.language !== 'en';
  const path = location.pathname;

  return (
    <>
      <header className={`fixed w-full max-w-[100vw] top-0 left-0 z-50 py-2 sm:py-3.5 px-2.5 sm:px-6 md:px-12 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#080b11]/95 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
          : 'bg-[#080b11]/80 backdrop-blur-md border-b border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full gap-2 sm:gap-4">
          
          {/* Brand Logo & Active Response Desk Badge */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 min-w-0">
            <Link to="/" className="flex items-center group flex-shrink-0" aria-label="Trend Master Akademi Ana Sayfa">
              <img 
                src="/logo-dark.png" 
                alt="Trend Master Akademi" 
                className="h-7 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                width="200"
                height="38"
              />
            </Link>

            {/* Response Desk Live Status Badge */}
            <button
              type="button"
              onClick={() => setIsSOSOpen(true)}
              className={`hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                krizHattiAcik
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 shadow-sm shadow-emerald-500/10'
                  : 'bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 shadow-sm shadow-amber-500/10'
              }`}
              title={isTr ? "Acil Incident & Kriz Müdahale Masası" : "Emergency Engineering & Crisis Desk"}
            >
              <span className={`w-2 h-2 rounded-full ${
                krizHattiAcik ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}></span>
              <span>
                {krizHattiAcik
                  ? (isTr ? "Canlı Kriz Masası" : "Live SWAT Desk")
                  : (isTr ? "Kriz Masası · 09:00'da" : "Crisis Desk · from 09:00")
                }
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/agency/"
              className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                path.startsWith('/agency')
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>{t('nav-agency')}</span>
            </Link>

            <Link
              to="/crash-test/"
              className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                path.startsWith('/crash-test')
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>{t('nav-crashtest')}</span>
            </Link>

            <Link
              to="/devir-kontrolu/"
              className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all ${
                path.startsWith('/devir-kontrolu')
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {isTr ? 'Devir Kontrolü' : 'Handover Audit'}
            </Link>

            <Link
              to="/teshis/"
              className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all ${
                path.startsWith('/teshis')
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {isTr ? 'Teşhis Kataloğu' : 'Diagnostic Catalog'}
            </Link>

            <Link
              to="/kesinti-maliyeti/"
              className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all ${
                path.startsWith('/kesinti-maliyeti')
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {isTr ? 'Kesinti Maliyeti' : 'Downtime Calc'}
            </Link>

            <Link
              to="/about/"
              className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all ${
                path.startsWith('/about')
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {t('nav-about')}
            </Link>

            {isHome ? (
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all ${
                  activeSection === 'contact'
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {t('nav-contact')}
              </a>
            ) : (
              <Link
                to="/#contact"
                className="px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                {t('nav-contact')}
              </Link>
            )}
          </nav>

          {/* Action CTAs: Emergency SOS Button & Language Switcher & Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            
            {/* SOS Emergency Button - Compact on Mobile */}
            <button
              type="button"
              onClick={() => setIsSOSOpen(true)}
              className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 hover:text-red-300 text-[11px] sm:text-sm font-bold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-sm shadow-red-500/20"
              title={isTr ? 'Acil Kriz ve Incident Müdahalesi (SOS)' : 'Emergency Technical Incident (SOS)'}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-bounce flex-shrink-0" />
              <span className="hidden sm:inline">{isTr ? 'Acil Kriz (SOS)' : 'Emergency SOS'}</span>
              <span className="sm:hidden font-mono font-black">SOS</span>
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLang}
              className="px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] sm:text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title={isTr ? 'Switch to English' : 'Türkçe Dil Seçeneği'}
            >
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 flex-shrink-0" />
              <span>{i18n.language === 'tr' ? 'EN' : 'TR'}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer min-w-[34px] min-h-[34px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden pt-3 pb-5 px-3 border-t border-white/10 mt-2.5 space-y-1.5 bg-[#080b11]/98 backdrop-blur-2xl rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xl">
            <Link
              to="/agency/"
              onClick={() => setIsOpen(false)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                path.startsWith('/agency')
                  ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                  : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>{t('nav-agency')}</span>
            </Link>

            <Link
              to="/crash-test/"
              onClick={() => setIsOpen(false)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                path.startsWith('/crash-test')
                  ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                  : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>{t('nav-crashtest')}</span>
            </Link>

            <Link
              to="/devir-kontrolu/"
              onClick={() => setIsOpen(false)}
              className={`block w-full text-left px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold ${
                path.startsWith('/devir-kontrolu')
                  ? 'text-cyan-400 bg-cyan-500/10'
                  : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              {isTr ? '12 Kalemlik Devir Kontrolü' : 'Handover Readiness Audit'}
            </Link>

            <Link
              to="/teshis/"
              onClick={() => setIsOpen(false)}
              className={`block w-full text-left px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold ${
                path.startsWith('/teshis')
                  ? 'text-cyan-400 bg-cyan-500/10'
                  : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              {isTr ? 'Teşhis Kataloğu' : 'Diagnostic Catalog'}
            </Link>

            <Link
              to="/kesinti-maliyeti/"
              onClick={() => setIsOpen(false)}
              className={`block w-full text-left px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold ${
                path.startsWith('/kesinti-maliyeti')
                  ? 'text-cyan-400 bg-cyan-500/10'
                  : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              {isTr ? 'Kesinti Maliyeti Hesaplayıcı' : 'Downtime Loss Calculator'}
            </Link>

            <Link
              to="/about/"
              onClick={() => setIsOpen(false)}
              className={`block w-full text-left px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold ${
                path.startsWith('/about')
                  ? 'text-cyan-400 bg-cyan-500/10'
                  : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              {t('nav-about')}
            </Link>

            <a
              href="/#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="block w-full text-left px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 hover:bg-white/5"
            >
              {t('nav-contact')}
            </a>
          </div>
        )}
      </header>

      {/* Emergency SOS Modal (Lazy Loaded) */}
      {isSOSOpen && (
        <Suspense fallback={null}>
          <EmergencySOSModal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} />
        </Suspense>
      )}
    </>
  );
};

export default Navbar;
