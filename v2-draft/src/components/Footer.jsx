import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShieldCheck, PhoneCall, Mail, Zap, Lock, Globe } from 'lucide-react';
import KVKKModal from './KVKKModal';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isTr = i18n.language !== 'en';
  const [isKVKKOpen, setIsKVKKOpen] = useState(false);

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
            {isTr 
              ? 'Dijital ajanslar ve teknoloji şirketleri için %100 White-Label, resmi NDA güvencesi altında çalışan kıdemli B2B mühendislik masası ve acil kod kurtarma stüdyosu.' 
              : 'Senior B2B engineering desk and emergency code SWAT recovery studio for digital agencies under 100% White-Label and strict mutual NDA.'}
          </p>
          <div className="pt-2 text-xs font-mono text-cyan-400 flex flex-wrap items-center gap-3">
            <span>B2B Mühendislik Masası: <strong>Trend Master Akademi Studio & Labs</strong></span>
            <span>•</span>
            <a href="https://github.com/trendmasterakademi" target="_blank" rel="noreferrer" className="hover:text-white underline">GitHub</a>
            <span>•</span>
            <a href="https://www.linkedin.com/in/trendmasterakademi/" target="_blank" rel="noreferrer" className="hover:text-white underline">LinkedIn</a>
          </div>
        </div>
        
        {/* Navigation Column */}
        <div className="md:col-span-3">
          <h3 className="text-white font-bold text-base mb-4">{t('footer-quick')}</h3>
          <ul className="space-y-2.5 text-slate-300 text-xs sm:text-sm">
            <li><Link to="/" className="hover:text-cyan-400 transition-colors">{t('nav-home')}</Link></li>
            <li><Link to="/agency/" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> {t('nav-agency')}</Link></li>
            <li><Link to="/crash-test/" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-cyan-400" /> {t('nav-crashtest')}</Link></li>
            <li><Link to="/about/" className="hover:text-cyan-400 transition-colors">{t('nav-about')}</Link></li>
            <li><Link to="/hikayemiz/" className="hover:text-cyan-400 transition-colors">{isTr ? 'Marka Hikâyemiz' : 'Our Story'}</Link></li>
            <li><a href="/#faq" className="hover:text-cyan-400 transition-colors">{isTr ? 'Sıkça Sorulan Sorular (SSS)' : 'FAQ'}</a></li>
            <li><a href="/#contact" className="hover:text-cyan-400 transition-colors">{t('nav-contact')}</a></li>
            <li>
              <Link 
                to="/privacy/" 
                className="hover:text-cyan-400 transition-colors flex items-center gap-1 text-slate-400 text-xs"
              >
                {isTr ? '🔒 KVKK & Gizlilik Politikası' : '🔒 Privacy Policy & KVKK'}
              </Link>
            </li>
            <li>
              <Link 
                to="/nda/" 
                className="hover:text-cyan-400 transition-colors flex items-center gap-1 text-slate-400 text-xs"
              >
                {isTr ? '📄 Gizlilik ve Çalışma Sözleşmesi' : '📄 Confidentiality Agreement (NDA)'}
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Security & Pricing Column */}
        <div className="md:col-span-4 space-y-3">
          <h3 className="text-white font-bold text-base flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> {isTr ? 'Ücretlendirme' : 'Pricing'}
          </h3>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs text-slate-300">
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>{isTr ? 'İlk teşhis & triyaj' : 'Initial diagnosis & triage'}</span>
              <strong className="text-emerald-400 font-mono">{isTr ? 'Ücretsiz' : 'Free'}</strong>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>{isTr ? 'Planlı işler' : 'Planned work'}</span>
              <strong className="text-slate-200 font-mono">{isTr ? 'Teşhis sonrası sabit teklif' : 'Fixed quote after diagnosis'}</strong>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>{isTr ? 'Acil müdahale' : 'Emergency response'}</span>
              <strong className="text-cyan-400 font-mono">{isTr ? 'Teşhisle aynı anda' : 'Priced with the diagnosis'}</strong>
            </div>
            <div className="flex justify-between pt-0.5 items-center">
              <span>{isTr ? 'Acil teklif hattı' : 'Urgent quote line'}</span>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-sos-modal'))}
                className="text-emerald-400 font-mono font-bold hover:underline focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-pointer transition-colors text-right"
              >
                {isTr ? 'Teklif iki taraftan' : 'Quotes from either side'}
              </button>
            </div>
          </div>
          <div className="pt-2 text-xs space-y-1.5 font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
              <a href="tel:+905343713573" className="hover:text-white">+90 534 371 35 73</a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <a href="mailto:info@trendmasterakademi.com" className="hover:text-white">info@trendmasterakademi.com</a>
            </div>
          </div>

          {/* Yasal Bilgiler / Legal Information */}
          <div className="pt-3 mt-2 border-t border-white/10 text-xs font-mono text-slate-400 space-y-1">
            <span className="text-[11px] font-bold text-slate-300 block uppercase tracking-wider">
              {isTr ? 'Yasal Bilgiler' : 'Legal Information'}
            </span>
            <p className="text-slate-300">
              {isTr ? 'Mehmet Şahin — Şahıs İşletmesi' : 'Mehmet Şahin — Sole Proprietorship'}
            </p>
            <p>
              {isTr ? 'Konak Vergi Dairesi' : 'Konak Tax Office'} · {isTr ? 'VKN' : 'Tax ID'}: 7930336132
            </p>
            <p>
              {isTr ? 'Faaliyet Kodu: 621000 — Bilgisayar Programlama Faaliyetleri' : 'Activity Code: 621000 — Computer Programming Activities'}
            </p>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091 Konak / İzmir
            </p>
          </div>
        </div>

      </div>
      
      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} Trend Master Akademi Studio & Labs. {isTr ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
        </p>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Response Desk: Online</span>
          <span>•</span>
          <button onClick={() => setIsKVKKOpen(true)} className="hover:text-cyan-400 transition-colors cursor-pointer">
            {isTr ? 'KVKK ve Gizlilik' : 'Privacy & Terms'}
          </button>
        </div>
      </div>

      <KVKKModal isOpen={isKVKKOpen} onClose={() => setIsKVKKOpen(false)} />
    </footer>
  );
};

export default Footer;
