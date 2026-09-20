import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Clock, Zap, FileText, CheckCircle2, 
  AlertTriangle, PhoneCall, ExternalLink, ArrowRight, 
  Check, Lock, Activity, Users, HelpCircle
} from 'lucide-react';
import { slaTiers, coreCommitments } from '../data/slaData';
import { getCalendlyUrl } from '../utils/calendly';
import { formatDocumentTitle } from '../utils/pageTitle';
import { isTurkish } from '../i18n';

export const Sla = () => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const lang = isTr ? 'tr' : 'en';

  const [activeTier, setActiveTier] = useState('SEV-0');

  useEffect(() => {
    document.title = formatDocumentTitle(
      isTr 
        ? 'Şeffaf Mühendislik SLA & Yanıt Taahhütleri | Trend Master Akademi'
        : 'Transparent Engineering SLA & Response Commitments | Trend Master Academy'
    );

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        isTr
          ? 'Muğlak vaatler yerine dakikalarla tanımlı mühendislik taahhütleri: SEV-0 için 15 dk yanıt, %100 White-Label garantisi, resmi NDA ve sıfır veri kaybı güvencesi.'
          : 'Strict engineering commitments defined in minutes: 15-min MTTA for SEV-0, 100% White-Label guarantee, enforceable NDA, and zero-loss rollback assurance.'
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://trendmasterakademi.com/sla/');
    }
  }, [isTr]);

  const selectedTier = slaTiers.find(t => t.level === activeTier) || slaTiers[0];

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isTr ? 'B2B HİZMET SEVİYESİ TAAHHÜTLERİ (SLA)' : 'B2B SERVICE LEVEL AGREEMENTS (SLA)'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {isTr ? 'Şeffaf Mühendislik SLA & Yanıt Süresi Matrisi' : 'Transparent Engineering SLA & Response Matrix'}
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          {isTr
            ? 'Ajanslar ve kurumsal şirketler için muğlak "en kısa sürede inceleriz" sözleri yerine; dakikalarla tanımlanmış, bağlayıcı mühendislik masası taahhütleri.'
            : 'Instead of vague "we will look into it ASAP" promises; strictly defined, minute-by-minute senior engineering desk commitments.'}
        </p>
      </div>

      {/* SLA Tiers Interactive Matrix */}
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>{isTr ? 'Olay Ciddiyet Seviyeleri (Severity Tiers)' : 'Incident Severity Tiers'}</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            {isTr ? 'Ortalama SLA Uyum Oranı: %99.3' : 'Overall SLA Compliance Rate: 99.3%'}
          </span>
        </div>

        {/* Tier Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {slaTiers.map(t => {
            const isActive = t.level === activeTier;
            return (
              <button
                key={t.level}
                onClick={() => setActiveTier(t.level)}
                className={`p-4 rounded-2xl border text-left transition-all duration-150 relative ${
                  isActive
                    ? 'bg-white/10 border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/30'
                    : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    t.level === 'SEV-0' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                    t.level === 'SEV-1' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    t.level === 'SEV-2' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  }`}>
                    {t.level}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{t.slaComplianceRate}</span>
                </div>
                <div className="text-sm font-bold text-white line-clamp-1">
                  {t.title[lang]}
                </div>
                <div className="text-xs font-mono text-cyan-300 mt-1">
                  MTTA: {t.mtta[lang]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Tier Expanded Sheet */}
        <div className="p-6 sm:p-8 rounded-3xl bg-black/60 border border-white/10 space-y-8 backdrop-blur-xl relative overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-white/10 pb-6 font-mono">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                {isTr ? 'İLK YANIT (MTTA)' : 'FIRST RESPONSE (MTTA)'}
              </span>
              <strong className="text-xl sm:text-2xl font-black text-cyan-300">
                {selectedTier.mtta[lang]}
              </strong>
              <p className="text-[11px] text-slate-400">
                {isTr ? 'Acil çağrı sonrası mühendisin ilk teyidi' : 'Initial acknowledgment by senior engineer'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                {isTr ? 'MASAYA OTURMA & TRİYAJ' : 'TIME TO ENGAGE (TABLE)'}
              </span>
              <strong className="text-xl sm:text-2xl font-black text-emerald-400">
                {selectedTier.timeToTable[lang]}
              </strong>
              <p className="text-[11px] text-slate-400">
                {isTr ? 'Canlı sisteme SSH/Repo erişimiyle müdahale' : 'Active production triage and containment'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                {isTr ? 'DURUM GÜNCELLEME SIKLIĞI' : 'STATUS CADENCE'}
              </span>
              <strong className="text-base sm:text-lg font-bold text-white block mt-1">
                {selectedTier.updateCadence[lang]}
              </strong>
              <p className="text-[11px] text-slate-400">
                {isTr ? 'Yazılı durum ve kriz brifingi' : 'Written brief and incident milestones'}
              </p>
            </div>
          </div>

          {/* Definition */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              {isTr ? 'KAPSAM & TANIM' : 'SCOPE & DEFINITION'}
            </h3>
            <p className="text-slate-200 text-base leading-relaxed">
              {selectedTier.definition[lang]}
            </p>
          </div>

          {/* Typical Incidents */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              {isTr ? 'BU SEVİYEYE GİREN TİPİK VAKALAR' : 'TYPICAL INCIDENT PATTERNS'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectedTier.typicalIncidents.map((inc, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200 leading-snug">{inc[lang]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick CTA inside tier */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="text-xs text-slate-400 font-mono">
              {isTr ? 'Bu seviyede aktif bir kriziniz mi var?' : 'Experiencing an incident at this severity?'}
            </div>
            <div className="flex items-center gap-3">
              <Link
                to={isTr ? "/triyaj/" : "/triage/"}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-mono hover:bg-white/20 transition-colors"
              >
                <span>{isTr ? 'Triyaj Simülatörü →' : 'Triage Simulator →'}</span>
              </Link>
              <Link
                to={isTr ? "/sos/" : "/sos/"}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-400 transition-colors shadow-lg shadow-red-500/20"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{isTr ? 'Acil Kriz Masası (SOS)' : 'Emergency Crisis Desk'}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Core Engineering Commitments */}
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400">
            <Lock className="w-3.5 h-3.5" />
            <span>{isTr ? 'KURUMSAL & HUKUKİ GÜVENCELER' : 'CORPORATE & LEGAL ASSURANCES'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isTr ? 'Ajanslarla Çalışırken Taviz Vermediğimiz 5 Temel Taahhüt' : '5 Core Commitments We Never Compromise On'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreCommitments.map((c) => (
            <article key={c.no} className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 hover:border-white/20 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xl font-black font-mono text-cyan-400">{c.no}</span>
                <span className="text-xs font-mono text-slate-500 uppercase">{isTr ? 'GARANTİ' : 'GUARANTEE'}</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {c.title[lang]}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {c.desc[lang]}
              </p>
            </article>
          ))}

          {/* 6th Card: NDA Link */}
          <article className="p-6 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wide">
                {isTr ? 'RESMİ SÖZLEŞME METNİ' : 'LEGAL CONTRACT TEXT'}
              </span>
              <h3 className="text-lg font-bold text-white">
                {isTr ? 'Standart Gizlilik Sözleşmemizi (NDA) İnceleyin' : 'Review Our Standard Non-Disclosure Agreement'}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {isTr
                  ? 'Ajansınızın fikri mülkiyetini ve görünmezlik şartlarını güvenceye alan şeffaf sözleşme şablonumuz.'
                  : 'Our transparent contract template safeguarding your agency IP, confidentiality, and white-label invisibility.'}
              </p>
            </div>
            <div className="pt-3">
              <Link
                to={isTr ? "/nda/" : "/nda/"}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-400 hover:underline"
              >
                <span>{isTr ? 'NDA Metnini Oku →' : 'Read Full NDA →'}</span>
              </Link>
            </div>
          </article>
        </div>
      </div>

      {/* Bottom CTA Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 text-center space-y-6 max-w-3xl mx-auto">
        <h3 className="text-2xl sm:text-3xl font-black text-white">
          {isTr ? 'Kriz Kapınızı Çalmadan Tanışalım' : 'Meet Before Critical Outages Strike'}
        </h3>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          {isTr
            ? 'Birçok ajansla ilk temasımız canlı sistem durduğunda gerçekleşir. Dilerseniz önceden 15 dakikalık bir triyaj tanışması yaparak acil durum protokolünüzü netleştirelim.'
            : 'Most agencies reach out when production is already on fire. Schedule a 15-minute intro triage to define your standby emergency protocol beforehand.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href={getCalendlyUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 text-black font-bold text-sm hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Clock className="w-4 h-4" />
            <span>{isTr ? '15 Dk Triyaj Tanışması' : '15-Min Intro Triage'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <Link
            to={isTr ? "/sos/" : "/sos/"}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 text-white font-mono text-sm hover:bg-white/20 transition-colors"
          >
            <span>{isTr ? 'Kriz Masası (SOS) →' : 'Crisis Desk (SOS) →'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sla;
