import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLang = () => {
    const newLang = i18n.language === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="fixed w-full z-50 glass-panel border-b-0 py-4 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-bold text-xl border border-primary/30">
            T
          </div>
          <span className="font-bold text-lg tracking-wider hidden md:block">
            {t('logo-text')}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-primary hover:text-primary-dark transition-colors">{t('nav-home')}</Link>
          <Link to="/about" className="hover:text-primary transition-colors">{t('nav-about')}</Link>
          <a href="/#services" className="hover:text-primary transition-colors">{t('nav-services')}</a>
          
          <button className="bg-primary text-bg-dark px-6 py-2 rounded-full font-semibold hover:bg-white transition-colors">
            {t('nav-btn')}
          </button>

          <button onClick={toggleLang} className="flex items-center gap-2 hover:text-primary transition-colors">
            <Globe className="w-5 h-5" />
            <span className="uppercase text-sm font-bold">{i18n.language}</span>
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full glass-panel py-6 px-6 flex flex-col gap-6 md:hidden"
          >
            <Link to="/" className="text-primary text-xl font-medium" onClick={() => setIsOpen(false)}>{t('nav-home')}</Link>
            <Link to="/about" className="text-xl font-medium" onClick={() => setIsOpen(false)}>{t('nav-about')}</Link>
            <a href="/#services" className="text-xl font-medium" onClick={() => setIsOpen(false)}>{t('nav-services')}</a>
            <button className="bg-primary text-bg-dark px-6 py-3 rounded-xl font-semibold text-center w-full">
              {t('nav-btn')}
            </button>
            <button onClick={toggleLang} className="flex items-center gap-2 justify-center w-full py-2 border border-white/10 rounded-xl">
              <Globe className="w-5 h-5" />
              <span className="uppercase text-sm font-bold">{i18n.language === 'tr' ? 'Switch to English' : 'Türkçe\'ye Geç'}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
