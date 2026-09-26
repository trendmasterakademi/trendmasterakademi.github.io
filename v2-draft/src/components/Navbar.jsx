import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, AlertTriangle, ShieldCheck, Zap, BookOpen, Sun, Moon, ClipboardCheck, Stethoscope, Calculator, Users, Mail } from 'lucide-react';
import { useKrizHattiAcik } from '../utils/krizHatti';
import { isTurkish } from '../i18n';
import { getLocalizedPath } from '../utils/routes';
import KitBanner from './KitBanner';

const EmergencySOSModal = lazy(() => import('./EmergencySOSModal'));

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const krizHattiAcik = useKrizHattiAcik();
  const [isOpen, setIsOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tma_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  const location = useLocation();
  const navigate = useNavigate();

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('tma_theme', nextTheme);
    } catch (e) {}
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(currentTheme);
  }, []);

  const toggleLang = () => {
    const isEn = (i18n.resolvedLanguage || i18n.language || 'tr').toLowerCase().startsWith('en');
    const newLang = isEn ? 'tr' : 'en';
    i18n.changeLanguage(newLang);
    const newPath = getLocalizedPath(location.pathname, newLang);
    if (newPath !== location.pathname) {
      navigate(newPath + location.hash, { replace: true });
    }
  };

  const menuBtnRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleOpenSOS = () => setIsSOSOpen(true);
    window.addEventListener('open-sos-modal', handleOpenSOS);
    return () => window.removeEventListener('open-sos-modal', handleOpenSOS);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        if (menuBtnRef.current) {
          menuBtnRef.current.focus();
        }
      }
    };

    const handleClickOutside = (e) => {
      if (
        drawerRef.current && !drawerRef.current.contains(e.target) &&
        menuBtnRef.current && !menuBtnRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const isHome = location.pathname === '/' || location.pathname === '';
  const isTanitim = /^\/(tanitim|overview)\/?$/.test(location.pathname);
  const isTr = isTurkish(i18n);
  const path = location.pathname;

  useEffect(() => {
    if (!isTanitim) {
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
  }, [location.pathname, isTanitim]);

  const handleNavClick = (e, targetId) => {
    if (isTanitim) {
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

  return (
    <>
      <header className={`fixed w-full max-w-[100vw] top-0 left-0 z-50 transition-all duration-300 ${
        isHome
          ? (scrolled ? 'bg-[var(--paper)]/90 backdrop-blur-md border-b border-[var(--rule)]' : 'bg-transparent')
          : (scrolled ? 'bg-[var(--surface)] border-b border-[var(--rule)] shadow-navbar' : 'bg-[var(--surface)] border-b border-[var(--rule)]')
      }`}>
        {isHome ? (
          <div className="h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center min-h-[44px]" aria-label="Trend Master Akademi Ana Sayfa">
              <img
                src="/logo-dark.svg"
                alt="Trend Master Akademi"
                className="h-7 sm:h-8 w-auto object-contain"
                width="200"
                height="38"
              />
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={toggleLang}
                className="px-2.5 py-1.5 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink-2)] hover:text-[var(--ink)] text-xs font-mono font-medium flex items-center gap-1.5 min-h-[44px] cursor-pointer"
                title={t('nav-switch-lang')}
              >
                <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>{(i18n.resolvedLanguage || i18n.language || 'tr').toLowerCase().startsWith('en') ? 'TR' : 'EN'}</span>
              </button>

              <button
                ref={menuBtnRef}
                id="nav-menu-btn"
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls="nav-drawer"
                aria-label={t('home-menu-button')}
                className="px-3 sm:px-4 py-1.5 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink)] hover:bg-[var(--paper)] text-xs sm:text-sm font-medium flex items-center gap-2 min-h-[44px] cursor-pointer"
              >
                {isOpen ? <X className="w-4 h-4 text-[var(--ink)]" /> : <Menu className="w-4 h-4 text-[var(--ink)]" />}
                <span>{t('home-menu-button')}</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* TMA Agency Response Kit & Crash Test Scrolling Banner */}
            <KitBanner />

            <div className="h-[39px] px-4 sm:px-6 lg:px-8 max-w-full flex items-center">
              <div className="w-full mx-auto flex justify-between items-center gap-2 sm:gap-4">
              
              {/* Brand Logo & Active Response Desk Badge */}
              <div className="flex items-center gap-2 sm:gap-3 2xl:gap-4 flex-shrink-0">
                <Link to="/" className="flex items-center group flex-shrink-0 min-h-[44px]" aria-label="Trend Master Akademi Ana Sayfa">
              <img 
                src="/logo-light.svg" 
                alt="Trend Master Akademi" 
                className="logo-light h-6 sm:h-7 lg:h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                width="200"
                height="38"
              />
              <img 
                src="/logo-dark.svg" 
                alt="Trend Master Akademi" 
                className="logo-dark h-6 sm:h-7 lg:h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                width="200"
                height="38"
              />
            </Link>

            {/* Response Desk Live Status Badge (SWAT rozeti yalnız ≥ 1440'ta header'da) */}
            <button
              type="button"
              onClick={() => setIsSOSOpen(true)}
              className="hidden min-[1440px]:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--r-control)] text-xs font-mono transition-colors cursor-pointer whitespace-nowrap flex-shrink-0 bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink-2)]"
              title={isTr ? "Acil Incident & Kriz Müdahale Masası" : "Emergency Engineering & Crisis Desk"}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                krizHattiAcik ? 'bg-[var(--sev-ok-dot)]' : 'bg-[var(--sev-high)]'
              }`}></span>
              <span>
                {krizHattiAcik
                  ? (isTr ? "Canlı Kriz Masası" : "Live SWAT Desk")
                  : (isTr ? "Kriz Masası · 09:00" : "Crisis Desk · 09:00")
                }
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links (Yalnız ≥ 1440px'te) */}
          <nav className="hidden min-[1440px]:flex items-center gap-1 2xl:gap-1.5 flex-shrink-0">
            <Link
              to="/agency/"
              className={`px-2.5 py-1.5 rounded-[var(--r-control)] text-xs 2xl:text-sm font-medium transition-all whitespace-nowrap ${
                path.startsWith('/agency')
                  ? 'text-[var(--accent-ink)] bg-[var(--accent-wash)] border border-[var(--accent)]/20'
                  : 'text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--paper)]'
              }`}
              title={isTr ? 'Kapasite & Altyapı' : 'Capacity & Infra'}
            >
              {isTr ? 'Kapasite' : 'Capacity'}
            </Link>

            <Link
              to="/kit/"
              className={`px-2.5 py-1.5 rounded-[var(--r-control)] text-xs 2xl:text-sm font-medium transition-all whitespace-nowrap ${
                path.startsWith('/kit') || path.startsWith('/agency-kit')
                  ? 'text-[var(--accent-ink)] bg-[var(--accent-wash)] border border-[var(--accent)]/20'
                  : 'text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--paper)]'
              }`}
              title={isTr ? 'TMA Agency Response Kit (Görsel Kılavuz)' : 'TMA Agency Response Kit (Visual Guide)'}
            >
              Agency Kit
            </Link>

            <Link
              to="/crash-test/"
              className={`px-2.5 py-1.5 rounded-[var(--r-control)] text-xs 2xl:text-sm font-medium transition-all whitespace-nowrap ${
                path.startsWith('/crash-test')
                  ? 'text-[var(--accent-ink)] bg-[var(--accent-wash)] border border-[var(--accent)]/20'
                  : 'text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--paper)]'
              }`}
              title={isTr ? 'Crash Test (60sn Risk Analizi)' : 'Crash Test (60s Risk Audit)'}
            >
              Crash Test
            </Link>

            <Link
              to={isTr ? "/devir-kontrolu/" : "/handover-audit/"}
              className={`px-2.5 py-1.5 rounded-[var(--r-control)] text-xs 2xl:text-sm font-medium transition-all whitespace-nowrap ${
                path.startsWith('/devir-kontrolu') || path.startsWith('/handover-audit')
                  ? 'text-[var(--accent-ink)] bg-[var(--accent-wash)] border border-[var(--accent)]/20'
                  : 'text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--paper)]'
              }`}
              title={isTr ? 'Devir Kontrolü & Kod Tabanı Denetimi' : 'Handover Audit & Code Health'}
            >
              {isTr ? 'Devir' : 'Handover'}
            </Link>

            <Link
              to={isTr ? "/teshis/" : "/diagnostic/"}
              className={`px-2.5 py-1.5 rounded-[var(--r-control)] text-xs 2xl:text-sm font-medium transition-all whitespace-nowrap ${
                path.startsWith('/teshis') || path.startsWith('/diagnostic')
                  ? 'text-[var(--accent-ink)] bg-[var(--accent-wash)] border border-[var(--accent)]/20'
                  : 'text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--paper)]'
              }`}
              title={isTr ? 'Teşhis Kataloğu & Kriz Çözümleri' : 'Diagnostic Catalog & Incident Playbooks'}
            >
              {isTr ? 'Teşhis' : 'Diagnostic'}
            </Link>

            <Link
              to={isTr ? "/kesinti-maliyeti/" : "/downtime-calc/"}
              className={`px-2.5 py-1.5 rounded-[var(--r-control)] text-xs 2xl:text-sm font-medium transition-all whitespace-nowrap ${
                path.startsWith('/kesinti-maliyeti') || path.startsWith('/downtime-calc') || path.startsWith('/downtime-cost')
                  ? 'text-[var(--accent-ink)] bg-[var(--accent-wash)] border border-[var(--accent)]/20'
                  : 'text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--paper)]'
              }`}
              title={isTr ? 'Kesinti Maliyeti Hesaplayıcı' : 'Downtime Cost Calculator'}
            >
              {isTr ? 'Maliyet' : 'Downtime'}
            </Link>

            <Link
              to="/about/"
              className={`px-2.5 py-1.5 rounded-[var(--r-control)] text-xs 2xl:text-sm font-medium transition-all whitespace-nowrap ${
                path.startsWith('/about')
                  ? 'text-[var(--accent-ink)] bg-[var(--accent-wash)] border border-[var(--accent)]/20'
                  : 'text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--paper)]'
              }`}
              title={t('nav-about')}
            >
              {t('nav-about')}
            </Link>

            {isTanitim ? (
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                className={`px-2.5 py-1.5 rounded-[var(--r-control)] text-xs 2xl:text-sm font-medium transition-all whitespace-nowrap ${
                  activeSection === 'contact'
                    ? 'text-[var(--accent-ink)] bg-[var(--accent-wash)] border border-[var(--accent)]/20'
                    : 'text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--paper)]'
                }`}
                title={t('nav-contact')}
              >
                {t('nav-contact')}
              </a>
            ) : (
              <Link
                to={isTr ? '/tanitim/#contact' : '/overview/#contact'}
                className="px-2.5 py-1.5 rounded-[var(--r-control)] text-xs 2xl:text-sm font-medium text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--paper)] transition-all whitespace-nowrap"
                title={t('nav-contact')}
              >
                {t('nav-contact')}
              </Link>
            )}
          </nav>

          {/* Action CTAs: Emergency SOS Button & Language Switcher & Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            
            {/* SOS Emergency Button (Her zaman header'da) */}
            <button
              type="button"
              onClick={() => setIsSOSOpen(true)}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-[var(--r-control)] bg-[var(--accent)] hover:bg-[var(--accent-ink)] text-[var(--on-accent)] text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-sm flex-shrink-0 min-h-[44px]"
              title={isTr ? 'Acil Kriz ve Incident Müdahalesi (SOS)' : 'Emergency Technical Incident (SOS)'}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[var(--on-accent)] flex-shrink-0" />
              <span className="hidden sm:inline">{isTr ? 'Acil Kriz (SOS)' : 'Emergency SOS'}</span>
              <span className="sm:hidden font-mono font-bold">SOS</span>
            </button>

            {/* Language Switcher (≥ 640px'te header'da) */}
            <button
              type="button"
              onClick={toggleLang}
              className="hidden sm:flex px-2.5 py-1.5 rounded-[var(--r-control)] bg-[var(--surface)] hover:bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink-2)] hover:text-[var(--ink)] text-xs font-mono font-medium items-center justify-center gap-1 transition-colors cursor-pointer flex-shrink-0 min-h-[44px] min-w-[44px]"
              title={isTr ? 'Switch to English' : 'Türkçe Dil Seçeneği'}
            >
              <Globe className="w-3.5 h-3.5 text-[var(--ink-3)] flex-shrink-0" />
              <span>{isTr ? 'EN' : 'TR'}</span>
            </button>

            {/* Theme Switcher (≥ 640px'te header'da) */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? (isTr ? 'Açık temaya geç' : 'Switch to light theme') : (isTr ? 'Koyu temaya geç' : 'Switch to dark theme')}
              aria-pressed={theme === 'dark'}
              className="hidden sm:flex p-1.5 sm:p-2 rounded-[var(--r-control)] bg-[var(--surface)] hover:bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors cursor-pointer min-w-[44px] min-h-[44px] items-center justify-center flex-shrink-0"
              title={theme === 'dark' ? (isTr ? 'Açık Tema' : 'Light Theme') : (isTr ? 'Koyu Tema' : 'Dark Theme')}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[var(--ink-2)]" />
              ) : (
                <Moon className="w-4 h-4 text-[var(--ink-2)]" />
              )}
            </button>

            {/* Mobile / Tablet / Laptop Hamburger Toggle (< 1440px) */}
            <button
              ref={menuBtnRef}
              id="nav-menu-btn"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="nav-drawer"
              className="min-[1440px]:hidden p-1.5 sm:p-2 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
              aria-label={isOpen ? (isTr ? "Menüyü kapat" : "Close menu") : (isTr ? "Menüyü aç" : "Open menu")}
            >
              {isOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>

        </div>
      </div>
      </>
      )}

        {/* Navigation Drawer */}
        {isOpen && (
          <div
            ref={drawerRef}
            id="nav-drawer"
            role="region"
            aria-labelledby="nav-menu-btn"
            className={`${isHome ? '' : 'min-[1440px]:hidden'} absolute top-full right-4 sm:right-6 lg:right-8 w-[calc(100%-32px)] sm:w-80 sm:min-w-[320px] max-w-sm pt-3 pb-5 px-3 border border-[var(--rule)] space-y-1 bg-[var(--surface)] rounded-[var(--r-panel)] shadow-navbar max-h-[calc(100dvh-80px)] overflow-y-auto z-50 mt-1`}
          >
            {/* Top controls row for < 640px: TR/EN and Theme Switcher */}
            <div className="sm:hidden flex items-center justify-between pb-2.5 mb-2 border-b border-[var(--rule)]">
              <button
                type="button"
                onClick={toggleLang}
                className="px-3 py-1.5 rounded-[var(--r-control)] bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink-2)] text-xs font-mono font-medium flex items-center gap-1.5 min-h-[44px]"
              >
                <Globe className="w-3.5 h-3.5 text-[var(--ink-3)]" />
                <span>{isTr ? 'English (EN)' : 'Türkçe (TR)'}</span>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? (isTr ? 'Açık temaya geç' : 'Switch to light theme') : (isTr ? 'Koyu temaya geç' : 'Switch to dark theme')}
                aria-pressed={theme === 'dark'}
                className="px-3 py-1.5 rounded-[var(--r-control)] bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink-2)] text-xs font-medium flex items-center gap-1.5 min-h-[44px]"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-[var(--ink-2)]" /> : <Moon className="w-4 h-4 text-[var(--ink-2)]" />}
                <span>{theme === 'dark' ? (isTr ? 'Açık Tema' : 'Light Theme') : (isTr ? 'Koyu Tema' : 'Dark Theme')}</span>
              </button>
            </div>

            {/* SWAT Status Badge in drawer for < 1440px */}
            <button
              type="button"
              onClick={() => { setIsOpen(false); setIsSOSOpen(true); }}
              className="w-full text-left px-3.5 py-2.5 rounded-[var(--r-control)] text-xs font-mono flex items-center justify-between bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink-2)] mb-2 min-h-[44px]"
            >
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  krizHattiAcik ? 'bg-[var(--sev-ok-dot)]' : 'bg-[var(--sev-high)]'
                }`}></span>
                <span>{isTr ? "Kriz Müdahale Masası" : "Emergency Response Desk"}</span>
              </span>
              <span className="text-[var(--accent)] font-semibold whitespace-nowrap flex-shrink-0">
                {krizHattiAcik ? (isTr ? "Canlı 09:00–24:00" : "Live 09:00–24:00") : (isTr ? "09:00 Açılış" : "Opens 09:00")}
              </span>
            </button>

            <Link
              to="/kit/"
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-3.5 py-2.5 rounded-[var(--r-control)] text-xs sm:text-sm font-semibold flex items-center gap-2 text-[var(--accent-ink)] bg-[var(--accent-wash)] border border-[var(--accent)]/20 mb-1 min-h-[44px]"
            >
              <BookOpen className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
              <span className="leading-snug">{isTr ? 'TMA Agency Response Kit (Görsel Kılavuz)' : 'TMA Agency Response Kit (Visual Guide)'}</span>
            </Link>

            <Link
              to="/agency/"
              onClick={() => setIsOpen(false)}
              className={`w-full text-left px-3.5 py-2.5 rounded-[var(--r-control)] text-xs sm:text-sm font-medium flex items-center gap-2 min-h-[44px] ${
                path.startsWith('/agency')
                  ? 'bg-[var(--accent-wash)] text-[var(--accent-ink)] border border-[var(--accent)]/20'
                  : 'text-[var(--ink-2)] hover:bg-[var(--paper)]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[var(--ink-3)] flex-shrink-0" />
              <span>{t('nav-agency')}</span>
            </Link>

            <Link
              to="/crash-test/"
              onClick={() => setIsOpen(false)}
              className={`w-full text-left px-3.5 py-2.5 rounded-[var(--r-control)] text-xs sm:text-sm font-medium flex items-center gap-2 min-h-[44px] ${
                path.startsWith('/crash-test')
                  ? 'bg-[var(--accent-wash)] text-[var(--accent-ink)] border border-[var(--accent)]/20'
                  : 'text-[var(--ink-2)] hover:bg-[var(--paper)]'
              }`}
            >
              <Zap className="w-4 h-4 text-[var(--ink-3)] flex-shrink-0" />
              <span>{t('nav-crashtest')}</span>
            </Link>

            <Link
              to={isTr ? "/devir-kontrolu/" : "/handover-audit/"}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 w-full text-left px-3.5 py-2.5 rounded-[var(--r-control)] text-xs sm:text-sm font-medium whitespace-nowrap min-h-[44px] ${
                path.startsWith('/devir-kontrolu') || path.startsWith('/handover-audit')
                  ? 'text-[var(--accent-ink)] bg-[var(--accent-wash)]'
                  : 'text-[var(--ink-2)] hover:bg-[var(--paper)]'
              }`}
            >
              <ClipboardCheck className="w-4 h-4 text-[var(--ink-3)] flex-shrink-0" />
              <span>{isTr ? '12 Kalemlik Devir Kontrolü' : 'Handover Readiness Audit'}</span>
            </Link>

            <Link
              to={isTr ? "/teshis/" : "/diagnostic/"}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 w-full text-left px-3.5 py-2.5 rounded-[var(--r-control)] text-xs sm:text-sm font-medium min-h-[44px] ${
                path.startsWith('/teshis') || path.startsWith('/diagnostic')
                  ? 'text-[var(--accent-ink)] bg-[var(--accent-wash)]'
                  : 'text-[var(--ink-2)] hover:bg-[var(--paper)]'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-[var(--ink-3)] flex-shrink-0" />
              <span>{isTr ? 'Teşhis Kataloğu' : 'Diagnostic Catalog'}</span>
            </Link>

            <Link
              to={isTr ? "/kesinti-maliyeti/" : "/downtime-calc/"}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 w-full text-left px-3.5 py-2.5 rounded-[var(--r-control)] text-xs sm:text-sm font-medium min-h-[44px] ${
                path.startsWith('/kesinti-maliyeti') || path.startsWith('/downtime-calc') || path.startsWith('/downtime-cost')
                  ? 'text-[var(--accent-ink)] bg-[var(--accent-wash)]'
                  : 'text-[var(--ink-2)] hover:bg-[var(--paper)]'
              }`}
            >
              <Calculator className="w-4 h-4 text-[var(--ink-3)] flex-shrink-0" />
              <span>{isTr ? 'Kesinti Maliyeti Hesaplayıcı' : 'Downtime Loss Calculator'}</span>
            </Link>

            <Link
              to="/about/"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 w-full text-left px-3.5 py-2.5 rounded-[var(--r-control)] text-xs sm:text-sm font-medium min-h-[44px] ${
                path.startsWith('/about')
                  ? 'text-[var(--accent-ink)] bg-[var(--accent-wash)]'
                  : 'text-[var(--ink-2)] hover:bg-[var(--paper)]'
              }`}
            >
              <Users className="w-4 h-4 text-[var(--ink-3)] flex-shrink-0" />
              <span>{t('nav-about')}</span>
            </Link>

            {isTanitim ? (
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                className="flex items-center gap-2 w-full text-left px-3.5 py-2.5 rounded-[var(--r-control)] text-xs sm:text-sm font-medium text-[var(--ink-2)] hover:bg-[var(--paper)] min-h-[44px]"
              >
                <Mail className="w-4 h-4 text-[var(--ink-3)] flex-shrink-0" />
                <span>{t('nav-contact')}</span>
              </a>
            ) : (
              <Link
                to={isTr ? '/tanitim/#contact' : '/overview/#contact'}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 w-full text-left px-3.5 py-2.5 rounded-[var(--r-control)] text-xs sm:text-sm font-medium text-[var(--ink-2)] hover:bg-[var(--paper)] min-h-[44px]"
              >
                <Mail className="w-4 h-4 text-[var(--ink-3)] flex-shrink-0" />
                <span>{t('nav-contact')}</span>
              </Link>
            )}
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
