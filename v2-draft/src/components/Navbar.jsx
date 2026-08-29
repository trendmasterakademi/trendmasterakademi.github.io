import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

const EmergencySOSModal = lazy(() => import('./EmergencySOSModal'));

const Navbar = () => {
  const { t, i18n } = useTranslation();
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
    if (location.pathname !== '/') {
      return;
    }

    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      setScrolled(window.scrollY > 30);

      const sections = [
        { id: 'contact', el: document.getElementById('contact') },
        { id: 'testimonials', el: document.getElementById('testimonials') },
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
    if (location.pathname === '/') {
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

  const isHome = location.pathname === '/';
  const isTr = i18n.language !== 'en';

  return (
    <>
      <header className={`fixed w-full max-w-[100vw] top-0 left-0 z-50 py-2.5 sm:py-3.5 px-3.5 sm:px-6 md:px-12 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#080b11]/95 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
          : 'bg-[#080b11]/80 backdrop-blur-md border-b border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full gap-4">
          
          {/* Brand Logo & Active Response Desk Badge */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-lg sm:text-xl group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all flex-shrink-0">
                T
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm sm:text-base md:text-lg tracking-wide text-white group-hover:text-cyan-400 transition-colors leading-tight whitespace-nowrap">
                  TREND MASTER
                </span>
                <span className="text-[8.5px] sm:text-[10px] font-mono tracking-widest text-slate-400">STUDIO & LABS</span>
              </div>
            </Link>

            {/* 24/7 Response Desk Live Status Badge */}
            <button
              onClick={() => setIsSOSOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono hover:bg-emerald-500/20 transition-colors cursor-pointer whitespace-nowrap shadow-sm shadow-emerald-500/10"
              title={isTr ? "Acil Incident & Kriz Müdahale Masası" : "Emergency Engineering & Crisis Desk"}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{isTr ? "Canlı Kriz Masası" : "Live SWAT Desk"}</span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/agency"
              className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                location.pathname === '/agency'
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>{t('nav-agency')}</span>
            </Link>

            <Link
              to="/crash-test"
              className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                location.pathname === '/crash-test'
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>{t('nav-crashtest')}</span>
            </Link>

            <Link
              to="/devir-kontrolu"
              className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all ${
                location.pathname === '/devir-kontrolu'
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {isTr ? 'Devir Kontrolü' : 'Handover Audit'}
            </Link>

            <Link
              to="/sozluk"
              className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all ${
                location.pathname.startsWith('/sozluk')
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {isTr ? 'Terim Sözlüğü' : 'Glossary'}
            </Link>

            <Link
              to="/kesinti-maliyeti"
              className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all ${
                location.pathname === '/kesinti-maliyeti'
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {isTr ? 'Kesinti Maliyeti' : 'Downtime Calc'}
            </Link>

            <Link
              to="/about"
              className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all ${
                location.pathname === '/about'
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

          {/* Action CTAs: Emergency SOS Button & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            
            {/* SOS Emergency Button */}
            <button
              onClick={() => setIsSOSOpen(true)}
              className="px-3 sm:px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 hover:text-red-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-sm shadow-red-500/20"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-bounce" />
              <span>{isTr ? 'Acil Kriz (SOS)' : 'Emergency SOS'}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title={isTr ? 'Switch to English' : 'Türkçe Dil Seçeneği'}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{i18n.language === 'tr' ? 'EN' : 'TR'}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden pt-4 pb-6 px-4 border-t border-white/10 mt-3 space-y-2 bg-[#080b11]/98 backdrop-blur-2xl rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <Link
              to="/agency"
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>{t('nav-agency')}</span>
            </Link>

            <Link
              to="/crash-test"
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>{t('nav-crashtest')}</span>
            </Link>

            <Link
              to="/devir-kontrolu"
              onClick={() => setIsOpen(false)}
              className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/5"
            >
              {isTr ? '12 Kalemlik Devir Kontrolü' : 'Handover Readiness Audit'}
            </Link>

            <Link
              to="/sozluk"
              onClick={() => setIsOpen(false)}
              className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/5"
            >
              {isTr ? 'Ajans Terim Sözlüğü' : 'Developer-to-Agency Glossary'}
            </Link>

            <Link
              to="/kesinti-maliyeti"
              onClick={() => setIsOpen(false)}
              className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/5"
            >
              {isTr ? 'Kesinti Maliyeti Hesaplayıcı' : 'Downtime Loss Calculator'}
            </Link>

            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/5"
            >
              {t('nav-about')}
            </Link>

            <a
              href="/#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/5"
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
