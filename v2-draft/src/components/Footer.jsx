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
    <footer className="border-t border-[var(--rule)] bg-[var(--surface)] pt-16 pb-12 px-4 sm:px-6 md:px-12 text-[var(--ink-2)] text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
        
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4">
          <Link to="/" className="inline-block group" aria-label="Trend Master Akademi Ana Sayfa">
            <img 
              src="/logo-light.png" 
              alt="Trend Master Akademi" 
              className="h-9 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] mb-1"
              width="220"
              height="42"
            />
          </Link>
          <p className="text-[var(--ink-2)] text-sm leading-relaxed max-w-md">
            {isTr 
              ? 'Yüksek işlem hacimli platformlar, teknoloji ekipleri ve kurumsal sistemler için %100 White-Label ve resmi NDA korumasıyla çalışan kıdemli mühendislik masası ve kriz kurtarma stüdyosu.' 
              : 'Senior engineering desk and crisis recovery studio for high-throughput platforms and tech teams operating under 100% White-Label and strict mutual NDA.'}
          </p>
          <div className="pt-2 text-xs font-mono text-[var(--ink-3)] flex flex-wrap items-center gap-3">
            <span>Sistem & Operasyon Masası: <strong className="text-[var(--ink)]">Trend Master Akademi Studio & Labs</strong></span>
            <span>•</span>
            <a href="https://www.linkedin.com/in/trendmasterakademi/" target="_blank" rel="noreferrer" className="text-[var(--accent)] hover:underline">LinkedIn</a>
          </div>
        </div>
        
        {/* Navigation Column */}
        <div className="md:col-span-3">
          <h3 className="text-[var(--ink)] font-semibold text-base mb-4">{t('footer-quick')}</h3>
          <ul className="space-y-2.5 text-[var(--ink-2)] text-xs sm:text-sm">
            <li><Link to="/" className="hover:text-[var(--accent)] transition-colors">{t('nav-home')}</Link></li>
            <li><Link to="/agency/" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" /> {t('nav-agency')}</Link></li>
            <li><Link to="/crash-test/" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-[var(--accent)]" /> {t('nav-crashtest')}</Link></li>
            <li><Link to={isTr ? "/kurtarilabilirlik/" : "/salvageability/"} className="hover:text-[var(--accent)] transition-colors">{isTr ? 'Salvageability Index (Karar Matrisi)' : 'Salvageability Index'}</Link></li>
            <li><Link to={isTr ? "/post-mortem/" : "/post-mortems/"} className="hover:text-[var(--accent)] transition-colors">{isTr ? 'Incident Post-Mortem & RCA' : 'Incident Post-Mortems & RCA'}</Link></li>
            <li><Link to={isTr ? "/triyaj/" : "/triage/"} className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-[var(--accent)]" /> {isTr ? 'Kriz Triyaj Simülatörü' : 'Emergency Triage Simulator'}</Link></li>
            <li><Link to="/sla/" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" /> {isTr ? 'Şeffaf Mühendislik SLA' : 'Engineering SLA Matrix'}</Link></li>
            <li><Link to={isTr ? "/teknoloji-uyumluluk/" : "/tech-matrix/"} className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-[var(--accent)]" /> {isTr ? 'Teknoloji & Kurtarma Matrisi' : 'Tech Compatibility Matrix'}</Link></li>
            <li><Link to={isTr ? "/gizlilik-sozlesmesi/" : "/mutual-nda/"} className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-[var(--accent)]" /> {isTr ? 'İnteraktif Gizlilik Sözleşmesi (NDA)' : 'Interactive Mutual NDA'}</Link></li>
            <li><Link to={isTr ? "/hasar-tespiti/" : "/outage-simulator/"} className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-[var(--sev-1)]" /> {isTr ? 'Gelişmiş Hasar Simülatörü' : 'Outage Damage Simulator'}</Link></li>
            <li><Link to="/radar/" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-[var(--sev-4)]" /> {isTr ? 'SWAT Durum Radarı' : 'Live Status Radar'}</Link></li>
            <li><Link to={isTr ? "/kod-sagligi/" : "/codebase-health/"} className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" /> {isTr ? 'Kod Sağlığı & Borç Denetimi' : 'Codebase Health Audit'}</Link></li>
            <li><Link to={isTr ? "/kurtarma-maliyeti/" : "/rescue-roi/"} className="hover:text-[var(--accent)] transition-colors flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-[var(--sev-4)]" /> {isTr ? 'Kurtarma vs Yeniden Yazım ROI' : 'Rescue vs Rebuild ROI'}</Link></li>
            <li><Link to="/sos/" className="hover:text-[var(--accent)] transition-colors">{isTr ? 'Acil Teknik Destek' : 'Emergency Support'}</Link></li>
            <li><Link to="/about/" className="hover:text-[var(--accent)] transition-colors">{t('nav-about')}</Link></li>
            <li><Link to={isTr ? "/hikayemiz/" : "/story/"} className="hover:text-[var(--accent)] transition-colors">{isTr ? 'Marka Hikâyemiz' : 'Our Story'}</Link></li>
            <li><a href="/#faq" className="hover:text-[var(--accent)] transition-colors">{isTr ? 'Sıkça Sorulan Sorular (SSS)' : 'FAQ'}</a></li>
            <li><a href="/#contact" className="hover:text-[var(--accent)] transition-colors">{t('nav-contact')}</a></li>
            <li>
              <Link 
                to="/privacy/" 
                className="hover:text-[var(--accent)] transition-colors flex items-center gap-1 text-[var(--ink-3)] text-xs"
              >
                {isTr ? 'KVKK & Gizlilik Politikası' : 'Privacy Policy & KVKK'}
              </Link>
            </li>
            <li>
              <Link 
                to="/nda/" 
                className="hover:text-[var(--accent)] transition-colors flex items-center gap-1 text-[var(--ink-3)] text-xs"
              >
                {isTr ? 'Gizlilik ve Çalışma Sözleşmesi' : 'Confidentiality Agreement (NDA)'}
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Security & Pricing Column */}
        <div className="md:col-span-4 space-y-3">
          <h3 className="text-[var(--ink)] font-semibold text-base flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--accent)]" /> {isTr ? 'Ücretlendirme' : 'Pricing'}
          </h3>
          <div className="p-4 rounded-[var(--r-panel)] bg-[var(--paper)] border border-[var(--rule)] space-y-2 text-xs text-[var(--ink-2)]">
            <div className="flex justify-between border-b border-[var(--rule)] pb-1">
              <span>{isTr ? 'İlk teşhis & triyaj' : 'Initial diagnosis & triage'}</span>
              <strong className="text-[var(--sev-4)] font-mono">{isTr ? 'Ücretsiz' : 'Free'}</strong>
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
                className="text-[var(--accent)] font-mono font-medium hover:underline focus:outline-none rounded cursor-pointer transition-colors text-right"
              >
                {isTr ? 'Kriz Masasına Teklif İletin →' : 'Inquire with Crisis Desk →'}
              </button>
            </div>
          </div>
          <p className="text-[12px] text-[var(--ink-3)] leading-relaxed pt-1">
            {isTr ? 'Bedel işin kapsamına göre, piyasa koşullarıyla uyumlu şekilde belirlenir.' : 'Pricing is set according to the scope of the work, aligned with prevailing market rates.'}
          </p>
          <div className="pt-2 text-xs space-y-1.5 font-mono text-[var(--ink-2)]">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-[var(--accent)]" />
              <a href="tel:+905343713573" className="hover:text-[var(--accent)] font-medium text-[var(--ink)]">+90 534 371 35 73</a>
              <span className="text-[12px] text-[var(--ink-3)] font-mono">({isTr ? 'Kriz Hattı · 09:00 – 24:00' : 'Response Desk · 09:00 – 24:00'})</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
              <a href="mailto:info@trendmasterakademi.com" className="hover:text-[var(--accent)] text-[var(--ink)]">info@trendmasterakademi.com</a>
            </div>
          </div>

          {/* Yasal Bilgiler / Legal Information */}
          <div className="pt-3 mt-2 border-t border-[var(--rule)] text-xs font-mono text-[var(--ink-2)] space-y-1">
            <span className="text-[12px] font-semibold text-[var(--ink)] block uppercase tracking-wider">
              {isTr ? 'Yasal Bilgiler' : 'Legal Information'}
            </span>
            <p className="text-[var(--ink)] font-medium">
              {isTr ? 'Mehmet Şahin — Şahıs İşletmesi' : 'Mehmet Şahin — Sole Proprietorship'}
            </p>
            <p>
              {isTr ? 'Konak Vergi Dairesi' : 'Konak Tax Office'} · {isTr ? 'VKN' : 'Tax ID'}: 7930336132
            </p>
            <p>
              {isTr ? 'Faaliyet Kodu: 621000 — Bilgisayar Programlama Faaliyetleri' : 'Activity Code: 621000 — Computer Programming Activities'}
            </p>
            <p className="text-[12px] leading-relaxed text-[var(--ink-3)]">
              Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091 Konak / İzmir
            </p>
          </div>
        </div>

      </div>
      
      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-[var(--rule)] flex flex-col sm:flex-row justify-between items-center gap-4 text-[var(--ink-3)] text-xs">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} Trend Master Akademi Studio & Labs. {isTr ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
        </p>
        <div className="flex items-center gap-4 text-[var(--ink-2)]">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${krizHattiAcik ? 'bg-[var(--sev-4)]' : 'bg-[var(--sev-2)]'}`}></span>
            <span>
              {krizHattiAcik
                ? (isTr ? 'Kriz hattı açık · 09:00 – 24:00' : 'Response desk open · 09:00 – 24:00')
                : (isTr ? "Kriz hattı kapalı · 09:00'da açılır" : 'Response desk closed · opens 09:00')
              }
            </span>
          </span>
          <span>•</span>
          <button onClick={() => setIsKVKKOpen(true)} className="hover:text-[var(--accent)] transition-colors cursor-pointer">
            {isTr ? 'KVKK ve Gizlilik' : 'Privacy & Terms'}
          </button>
        </div>
      </div>

      <KVKKModal isOpen={isKVKKOpen} onClose={() => setIsKVKKOpen(false)} />
    </footer>
  );
};

export default Footer;
