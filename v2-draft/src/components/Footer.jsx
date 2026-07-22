import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/10 bg-bg-dark pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-bold text-xl border border-primary/30">
              T
            </div>
            <span className="font-bold text-lg tracking-wider">
              {t('logo-text')}
            </span>
          </Link>
          <p className="text-slate-400 leading-relaxed max-w-sm mb-6">
            {t('footer-desc')}
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">{t('footer-quick')}</h4>
          <ul className="space-y-4 text-slate-400">
            <li><Link to="/" className="hover:text-primary transition-colors">{t('nav-home')}</Link></li>
            <li><Link to="/about" className="hover:text-primary transition-colors">{t('nav-about')}</Link></li>
            <li><a href="/#services" className="hover:text-primary transition-colors">{t('nav-services')}</a></li>
            <li><a href="/#contact" className="hover:text-primary transition-colors">{t('nav-contact')}</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">{t('footer-warning-title')}</h4>
          <p className="text-slate-500 text-sm leading-relaxed">
            {t('footer-warning-desc')}
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
        <p>{t('footer-copy')}</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-primary transition-colors">X (Twitter)</a>
          <a href="https://www.linkedin.com/in/trendmasterakademi/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-primary transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
