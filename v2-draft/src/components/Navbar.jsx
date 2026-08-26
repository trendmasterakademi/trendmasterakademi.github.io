import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmergencySOSModal from './EmergencySOSModal';

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

  // ScrollSpy to detect active section when on Homepage
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
      // If on another page, navigate to homepage anchor
      setIsOpen(false);
    }
  };

  const isHome = location.pathname === '/';

  return (
    <>
      <header className={`fixed w-full top-0 left-0 z-50 py-3.5 px-4 sm:px-6 md:px-12 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#080b11]/95 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
          : 'bg-[#080b11]/80 backdrop-blur-md border-b border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Brand Logo & Active Indicator */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-xl group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all flex-shrink-0">
                T
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base md:text-lg tracking-wide text-white group-hover:text-cyan-400 transition-colors leading-tight">
                  TREND MASTER
                </span>
                <span className="text-[10px] font-mono tracking-widest text-slate-400">STUDIO & LABS</span>
              </div>
            </Link>

            {/* Desktop Status Badge */}
            <button
              onClick={() => setIsSOSOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono hover:bg-emerald-500/20 transition-colors cursor-pointer"
              title={t('nav-status-active')}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t('nav-status-active')}</span>
            </button>
          </div>

          {/* Desktop Navigation Links with Live Scroll Synchronisation */}
          <nav className="hidden md:flex items-center gap-6 text-sm lg:text-base font-medium">
            
            {/* Home Link */}
            <Link 
              to="/" 
              onClick={(e) => handleNavClick(e, 'hero')}
              className={`transition-colors py-1 relative ${
                isHome && activeSection === 'hero' 
                  ? 'text-cyan-400 font-bold' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>{t('nav-home')}</span>
              {isHome && activeSection === 'hero' && (
                <motion.span layoutId="navIndicator" className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
              )}
            </Link>

            {/* Agency Page Link */}
            <Link 
              to="/agency" 
              className={`flex items-center gap-1.5 transition-colors py-1 relative ${
                location.pathname === '/agency' 
                  ? 'text-cyan-400 font-bold' 
                  : 'text-slate-300 hover:text-cyan-400'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>{t('nav-agency')}</span>
              {location.pathname === '/agency' && (
                <motion.span layoutId="navIndicator" className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
              )}
            </Link>

            {/* Crash Test Simulator Link */}
            <Link 
              to="/crash-test" 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-semibold ${
                location.pathname === '/crash-test'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:border-cyan-400/50 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 fill-current" />
              <span>{t('nav-crashtest')}</span>
            </Link>

            {/* Services Anchor Link */}
            <a 
              href="/#services" 
              onClick={(e) => handleNavClick(e, 'services')}
              className={`transition-colors py-1 relative ${
                isHome && activeSection === 'services' 
                  ? 'text-cyan-400 font-bold' 
                  : 'text-slate-300 hover:text-cyan-400'
              }`}
            >
              <span>{t('nav-services')}</span>
              {isHome && activeSection === 'services' && (
                <motion.span layoutId="navIndicator" className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
              )}
            </a>

            {/* Contact Anchor Link */}
            <a 
              href="/#contact" 
              onClick={(e) => handleNavClick(e, 'contact')}
              className={`transition-colors py-1 relative ${
                isHome && activeSection === 'contact' 
                  ? 'text-cyan-400 font-bold' 
                  : 'text-slate-300 hover:text-cyan-400'
              }`}
            >
              <span>{t('nav-contact')}</span>
              {isHome && activeSection === 'contact' && (
                <motion.span layoutId="navIndicator" className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
              )}
            </a>
            
            {/* SOS Emergency Hotline Button */}
            <button 
              onClick={() => setIsSOSOpen(true)}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-4 py-2 rounded-full font-bold text-xs shadow-lg shadow-red-600/25 flex items-center gap-1.5 cursor-pointer transition-all transform hover:scale-105"
            >
              <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
              <span>{t('nav-sos')}</span>
            </button>

            {/* Language Switch Button */}
            <button 
              onClick={toggleLang} 
              className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 transition-colors pl-3 border-l border-white/15 cursor-pointer text-xs font-mono font-bold"
              title="Dili Değiştir / Switch Language"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="uppercase">{i18n.language === 'tr' ? 'EN' : 'TR'}</span>
            </button>
          </nav>

          {/* Mobile Fast Action Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={toggleLang} 
              className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-mono font-bold flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{i18n.language === 'tr' ? 'EN' : 'TR'}</span>
            </button>

            <button
              onClick={() => setIsSOSOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>SOS</span>
            </button>

            <button 
              className="text-white p-2 rounded-xl bg-white/5 border border-white/10 focus:outline-none" 
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menü"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="absolute top-full left-0 w-full bg-[#0d121d] border-b border-white/15 py-6 px-6 flex flex-col gap-4 md:hidden shadow-2xl"
            >
              <Link 
                to="/" 
                className={`text-lg font-semibold ${isHome && activeSection === 'hero' ? 'text-cyan-400' : 'text-white'}`} 
                onClick={(e) => handleNavClick(e, 'hero')}
              >
                {t('nav-home')}
              </Link>

              <Link 
                to="/agency" 
                className={`text-lg font-semibold flex items-center gap-2 ${location.pathname === '/agency' ? 'text-cyan-400' : 'text-slate-200'}`} 
                onClick={() => setIsOpen(false)}
              >
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span>{t('nav-agency')}</span>
              </Link>

              <Link 
                to="/crash-test" 
                className="text-orange-400 text-lg font-semibold flex items-center gap-2" 
                onClick={() => setIsOpen(false)}
              >
                <Zap className="w-5 h-5 fill-current" />
                <span>{t('nav-crashtest')}</span>
              </Link>

              <a 
                href="/#services" 
                className={`text-lg font-medium ${isHome && activeSection === 'services' ? 'text-cyan-400 font-bold' : 'text-slate-200'}`} 
                onClick={(e) => handleNavClick(e, 'services')}
              >
                {t('nav-services')}
              </a>

              <a 
                href="/#contact" 
                className={`text-lg font-medium ${isHome && activeSection === 'contact' ? 'text-cyan-400 font-bold' : 'text-slate-200'}`} 
                onClick={(e) => handleNavClick(e, 'contact')}
              >
                {t('nav-contact')}
              </a>
              
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setIsSOSOpen(true);
                }}
                className="bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-2xl font-bold text-center w-full flex items-center justify-center gap-2 mt-2 shadow-lg shadow-red-500/20"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>{t('nav-sos')}</span>
              </button>

              <button 
                onClick={() => {
                  toggleLang();
                  setIsOpen(false);
                }} 
                className="flex items-center gap-2 justify-center w-full py-3 border border-white/10 rounded-xl text-slate-300 text-sm font-semibold"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{t('nav-switch-lang')}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Emergency Modal */}
      <EmergencySOSModal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} />
    </>
  );
};

export default Navbar;
