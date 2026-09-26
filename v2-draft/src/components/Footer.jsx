import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShieldCheck, PhoneCall, Mail, Zap, Lock, Globe, Terminal, Layers, FileText, Activity, AlertTriangle } from 'lucide-react';
import KVKKModal from './KVKKModal';
import { useKrizHattiAcik } from '../utils/krizHatti';
import { isTurkish } from '../i18n';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const [isKVKKOpen, setIsKVKKOpen] = useState(false);
  const krizHattiAcik = useKrizHattiAcik();

  return (
    <footer className="border-t border-[var(--rule)] bg-[var(--surface)] pt-6 pb-24 md:pb-6 px-4 sm:px-6 md:px-12 text-[var(--ink-2)] text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 mb-4">
        
        {/* Brand Column */}
        <div className="lg:col-span-3 space-y-3">
          <Link to="/" className="inline-block group min-h-[44px] flex items-center" aria-label="Trend Master Akademi Ana Sayfa">
            <img 
              src="/logo-light.svg" 
              alt="Trend Master Akademi" 
              className="logo-light h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              width="220"
              height="42"
            />
            <img 
              src="/logo-dark.svg" 
              alt="Trend Master Akademi" 
              className="logo-dark h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              width="220"
              height="42"
            />
          </Link>
          <p className="text-[var(--ink-2)] text-xs leading-relaxed">
            {isTr 
              ? 'Yüksek işlem hacimli platformlar, teknoloji ekipleri ve kurumsal sistemler için %100 White-Label ve resmi NDA korumasıyla çalışan kıdemli mühendislik masası ve kriz kurtarma stüdyosu.' 
              : 'Senior engineering desk and crisis recovery studio for high-throughput platforms and tech teams operating under 100% White-Label and strict mutual NDA.'}
          </p>
          <div className="text-xs font-mono text-[var(--ink-3)] flex flex-wrap items-center gap-2">
            <span>{isTr ? 'Sistem & Operasyon Masası:' : 'Systems & Operations Desk:'} <strong className="text-[var(--ink)]">Trend Master Akademi Studio & Labs</strong></span>
            <span>•</span>
            <a href="https://www.linkedin.com/in/trendmasterakademi/" target="_blank" rel="noreferrer" className="text-[var(--accent)] hover:underline min-h-[44px] inline-flex items-center">LinkedIn</a>
          </div>

          {/* Yasal Bilgiler / Legal Information - Compact */}
          <div className="pt-2 text-xs font-mono text-[var(--ink-3)] space-y-0.5 border-t border-[var(--rule)]">
            <span className="text-xs font-semibold text-[var(--ink)] block uppercase tracking-wider">
              {isTr ? 'Yasal Bilgiler' : 'Legal Information'}
            </span>
            <p className="text-[var(--ink)] font-medium">
              {isTr ? 'Mehmet Şahin — Şahıs İşletmesi' : 'Mehmet Şahin — Sole Proprietorship'}
            </p>
            <p>
              {isTr ? 'Konak Vergi Dairesi' : 'Konak Tax Office'} · {isTr ? 'VKN' : 'Tax ID'}: 7930336132 · {isTr ? 'Faaliyet Kodu' : 'Activity Code'}: 621000
            </p>
            <p className="leading-tight">
              Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091 Konak / İzmir
            </p>
          </div>
        </div>
        
        {/* Navigation Links: 3 Columns */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Column 1: Engineering & Incident */}
          <div>
            <h2 className="text-[var(--ink-3)] font-semibold text-xs uppercase tracking-wider mb-2">
              {isTr ? 'Mühendislik & Kriz' : 'Engineering & Incident'}
            </h2>
            <ul className="space-y-1 text-xs">
              <li><Link to="/" className="hover:text-[var(--accent)] transition-colors py-1 sm:py-0.5 min-h-[44px] flex items-center">{t('nav-home')}</Link></li>
              <li><Link to="/agency/" className="hover:text-[var(--accent)] transition-colors py-1 sm:py-0.5 min-h-[44px] flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0" /> {t('nav-agency')}</Link></li>
              <li><Link to="/crash-test/" className="hover:text-[var(--accent)] transition-colors py-1 sm:py-0.5 min-h-[44px] flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0" /> {t('nav-crashtest')}</Link></li>
              <li><Link to={isTr ? "/kurtarilabilirlik/" : "/salvageability/"} className="hover:text-[var(--accent)] transition-colors py-1 sm:py-0.5 min-h-[44px] flex items-center">{isTr ? 'Kurtarılabilirlik İndeksi' : 'Salvageability Index'}</Link></li>
              <li><Link to={isTr ? "/tmai/" : "/ai-code-takeover/"} className="hover:text-[var(--accent)] transition-colors py-1 sm:py-0.5 min-h-[44px] flex items-center">{isTr ? 'tmai · Yapay Zekâ Kodu' : 'tmai · AI-Generated Code'}</Link></li>
              <li><Link to={isTr ? "/post-mortem/" : "/post-mortems/"} className="hover:text-[var(--accent)] transition-colors py-1 sm:py-0.5 min-h-[44px] flex items-center">{isTr ? 'Post-Mortem ve Kök Neden Arşivi' : 'Incident Post-Mortems & RCA'}</Link></li>
              <li><Link to={isTr ? "/triyaj/" : "/triage/"} className="hover:text-[var(--accent)] transition-colors py-1 sm:py-0.5 min-h-[44px] flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0" /> {isTr ? 'Kriz Triyaj Simülatörü' : 'Emergency Triage Simulator'}</Link></li>
              <li><Link to="/sos/" className="hover:text-[var(--accent)] transition-colors py-1 sm:py-0.5 min-h-[44px] flex items-center">{isTr ? 'Acil Teknik Destek' : 'Emergency Support'}</Link></li>
            </ul>
          </div>

          {/* Column 2: Tools & Audit */}
          <div>
            <h2 className="text-[var(--ink-3)] font-semibold text-xs uppercase tracking-wider mb-2">
              {isTr ? 'Araçlar & Denetim' : 'Tools & Audit'}
            </h2>
            <ul className="space-y-1 text-xs">
              <li><Link to="/sla/" className="hover:text-[var(--accent)] transition-colors py-1 sm:py-0.5 min-h-[44px] flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0" /> {isTr ? 'Şeffaf Mühendislik SLA' : 'Engineering SLA Matrix'}</Link></li>
              <li><Link to={isTr ? "/teknoloji-uyumluluk/" : "/tech-matrix/"} className="hover:text-[var(--accent)] transition-colors py-1 sm:py-0.5 min-h-[44px] flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0" /> {isTr ? 'Teknoloji & Kurtarma Matrisi' : 'Tech Compatibility Matrix'}</Link></li>
              <li><Link to={isTr ? "/hasar-tespiti/" : "/outage-simulator/"} className="hover:text-[var(--accent)] transition-colors py-1 sm:py-0.5 min-h-[44px] flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-[var(--sev-critical)] flex-shrink-0" /> {isTr ? 'Kesinti ve İtibar Zararı Simülatörü' : 'Outage & Reputation Cost Simulator'}</Link></li>
              <li><Link to="/radar/" className="hover:text-[var(--accent)] transition-colors py-1 sm:py-0.5 min-h-[44px] flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-[var(--sev-ok)] flex-shrink-0" /> {isTr ? 'SWAT Durum Radarı' : 'Live Status Radar'}</Link></li>
              <li><Link to={isTr ? "/kod-sagligi/" : "/codebase-health/"} className="hover:text-[var(--accent)] transition-colors py-1 sm:py-0.5 min-h-[44px] flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0" /> {isTr ? 'Kod Sağlığı & Borç Denetimi' : 'Codebase Health Audit'}</Link></li>
              <li><Link to={isTr ? "/kurtarma-maliyeti/" : "/rescue-roi/"} className="hover:text-[var(--accent)] transition-colors py-1 sm:py-0.5 min-h-[44px] flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-[var(--sev-ok)] flex-shrink-0" /> {isTr ? 'Kurtarma mı, Sıfırdan Yazım mı?' : 'Rescue or Rebuild?'}</Link></li>
              <li><Link to={isTr ? "/tanitim/#faq" : "/overview/#faq"} className="hover:text-[var(--accent)] transition-colors py-1 sm:py-0.5 min-h-[44px] flex items-center">{isTr ? 'Sıkça Sorulan Sorular (SSS)' : 'FAQ'}</Link></li>
            </ul>
          </div>

          {/* Column 3: Corporate & Legal */}
          <div>
            <h2 className="text-[var(--ink-3)] font-semibold text-xs uppercase tracking-wider mb-2">
              {isTr ? 'Kurumsal & Yasal' : 'Corporate & Legal'}
            </h2>
            <ul className="space-y-1 text-xs">
              <li><Link to="/about/" className="hover:text-[var(--accent)] transition-colors py-1 sm:py-0.5 min-h-[44px] flex items-center">{t('nav-about')}</Link></li>
              <li><Link to={isTr ? "/hikayemiz/" : "/story/"} className="hover:text-[var(--accent)] transition-colors py-1 sm:py-0.5 min-h-[44px] flex items-center">{isTr ? 'Marka Hikâyemiz' : 'Our Story'}</Link></li>
              <li><Link to={isTr ? "/tanitim/#contact" : "/overview/#contact"} className="hover:text-[var(--accent)] transition-colors py-1 sm:py-0.5 min-h-[44px] flex items-center">{t('nav-contact')}</Link></li>
              <li><Link to={isTr ? "/gizlilik-sozlesmesi/" : "/mutual-nda/"} className="hover:text-[var(--accent)] transition-colors py-1 sm:py-0.5 min-h-[44px] flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0" /> {isTr ? 'İnteraktif Gizlilik Sözleşmesi (NDA)' : 'Interactive Mutual NDA'}</Link></li>
              <li>
                <Link 
                  to="/privacy/" 
                  className="hover:text-[var(--accent)] transition-colors py-1 sm:py-0.5 min-h-[44px] flex items-center gap-1 text-[var(--ink-3)]"
                >
                  {isTr ? 'KVKK & Gizlilik Politikası' : 'Privacy Policy & KVKK'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/nda/" 
                  className="hover:text-[var(--accent)] transition-colors py-1 sm:py-0.5 min-h-[44px] flex items-center gap-1 text-[var(--ink-3)]"
                >
                  {isTr ? 'Gizlilik ve Çalışma Sözleşmesi' : 'Confidentiality and Engagement Agreement'}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Security & Pricing Column */}
        <div className="lg:col-span-3 space-y-2.5">
          <h2 className="text-[var(--ink)] font-semibold text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--accent)]" /> {isTr ? 'Ücretlendirme' : 'Pricing'}
          </h2>
          <div className="p-3 rounded-[var(--r-panel)] bg-[var(--paper)] border border-[var(--rule)] space-y-1.5 text-xs text-[var(--ink-2)]">
            <div className="flex justify-between border-b border-[var(--rule)] pb-1">
              <span>{isTr ? 'İlk teşhis & triyaj' : 'Initial diagnosis & triage'}</span>
              <strong className="text-[var(--sev-ok)] font-mono">{isTr ? 'Ücretsiz' : 'Free'}</strong>
            </div>
            <div className="flex justify-between border-b border-[var(--rule)] pb-1">
              <span>{isTr ? 'Planlı işler' : 'Planned work'}</span>
              <strong className="text-[var(--ink)] font-mono">{isTr ? 'Teşhis sonrası sabit teklif' : 'Fixed quote after diagnosis'}</strong>
            </div>
            <div className="flex justify-between border-b border-[var(--rule)] pb-1">
              <span>{isTr ? 'Acil müdahale' : 'Emergency response'}</span>
              <strong className="text-[var(--accent)] font-mono">{isTr ? 'Teşhisle aynı anda' : 'Priced with the diagnosis'}</strong>
            </div>
            <div className="flex justify-between pt-0.5 items-center">
              <span>{isTr ? 'Acil teklif hattı' : 'Urgent quote line'}</span>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-sos-modal'))}
                className="text-[var(--accent)] font-mono font-medium hover:underline focus:outline-none rounded cursor-pointer transition-colors text-right min-h-[44px] flex items-center"
              >
                {isTr ? 'Kriz Masasına Teklif İletin →' : 'Inquire with Crisis Desk →'}
              </button>
            </div>
          </div>
          <p className="text-xs text-[var(--ink-3)] leading-relaxed">
            {isTr ? 'Bedel işin kapsamına göre, piyasa koşullarıyla uyumlu şekilde belirlenir.' : 'Pricing is set according to the scope of the work, aligned with prevailing market rates.'}
          </p>
          <div className="pt-1 text-xs space-y-1 font-mono text-[var(--ink-2)]">
            <div className="flex items-center gap-2 min-h-[44px]">
              <PhoneCall className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0" />
              <a href="tel:+905343713573" className="hover:text-[var(--accent)] font-medium text-[var(--ink)] min-h-[44px] inline-flex items-center">+90 534 371 35 73</a>
              <span className="text-xs text-[var(--ink-3)] font-mono">({isTr ? '09:00 – 24:00' : '09:00 – 24:00'})</span>
            </div>
            <div className="flex items-center gap-2 min-h-[44px]">
              <Mail className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0" />
              <span className="font-mono text-xs text-[var(--ink)] select-all">info@trendmasterakademi.com</span>
            </div>
          </div>
        </div>

      </div>
      
      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto pt-4 border-t border-[var(--rule)] flex flex-col sm:flex-row justify-between items-center gap-3 text-[var(--ink-3)] text-xs">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} Trend Master Akademi Studio & Labs. {isTr ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
        </p>
        <div className="flex items-center gap-4 text-[var(--ink-2)]">
          <span className="flex items-center gap-1.5 min-h-[44px]">
            <span className={`w-2 h-2 rounded-full ${krizHattiAcik ? 'bg-[var(--sev-ok)]' : 'bg-[var(--sev-high)]'}`}></span>
            <span>
              {krizHattiAcik
                ? (isTr ? 'Kriz hattı açık · 09:00 – 24:00' : 'Response desk open · 09:00 – 24:00')
                : (isTr ? "Kriz hattı kapalı · 09:00'da açılır" : 'Response desk closed · opens 09:00')
              }
            </span>
          </span>
          <span>•</span>
          <button onClick={() => setIsKVKKOpen(true)} className="hover:text-[var(--accent)] transition-colors cursor-pointer min-h-[44px] inline-flex items-center">
            {isTr ? 'KVKK ve Gizlilik' : 'Privacy & Terms'}
          </button>
        </div>
      </div>

      <KVKKModal isOpen={isKVKKOpen} onClose={() => setIsKVKKOpen(false)} />
    </footer>
  );
};

export default Footer;
