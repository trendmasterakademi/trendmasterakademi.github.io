import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShieldCheck, PhoneCall, Mail, MapPin, Zap } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/10 bg-[#06080d] pt-16 pb-12 px-4 sm:px-6 md:px-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
        
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 font-black text-xl border border-cyan-500/30">
              T
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-wider text-white">
                {t('logo-text')}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-slate-400">STUDIO & LABS</span>
            </div>
          </Link>
          <p className="text-slate-300 text-sm leading-relaxed max-w-md">
            {t('footer-desc')}
          </p>
          <div className="pt-2 text-xs font-mono text-cyan-400">
            {t('footer-founder')}
          </div>
        </div>
        
        {/* Navigation Column */}
        <div className="md:col-span-3">
          <h4 className="text-white font-bold text-base mb-4">{t('footer-quick')}</h4>
          <ul className="space-y-2.5 text-slate-300">
            <li><Link to="/" className="hover:text-cyan-400 transition-colors">{t('nav-home')}</Link></li>
            <li><Link to="/agency" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> {t('nav-agency')}</Link></li>
            <li><Link to="/crash-test" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-cyan-400" /> {t('nav-crashtest')}</Link></li>
            <li><Link to="/about" className="hover:text-cyan-400 transition-colors">{t('nav-about')}</Link></li>
            <li><a href="/#services" className="hover:text-cyan-400 transition-colors">{t('nav-services')}</a></li>
            <li><a href="/#contact" className="hover:text-cyan-400 transition-colors">{t('nav-contact')}</a></li>
          </ul>
        </div>
        
        {/* Security & Guarantee Column */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-white font-bold text-base flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> {t('footer-security-title')}
          </h4>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            {t('footer-security-desc')}
          </p>
          <div className="pt-2 text-xs space-y-1.5 font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
              <a href="tel:+905343713573" className="hover:text-white">+90 534 371 35 73</a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <a href="mailto:info@trendmasterakademi.com" className="hover:text-white">info@trendmasterakademi.com</a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Konak / İzmir, Türkiye</span>
            </div>
          </div>
        </div>

      </div>
      
      {/* Bottom Copyright without social links */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
        <p>{t('footer-copy')}</p>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Response Desk Active</span>
          <span>•</span>
          <span>%100 White-Label Partner</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
