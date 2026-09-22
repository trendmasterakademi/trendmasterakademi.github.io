import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Clock, Zap, FileText, CheckCircle2, 
  AlertTriangle, PhoneCall, ExternalLink, ArrowRight, 
  Check, Lock, Activity, Users, HelpCircle
} from 'lucide-react';
import { slaTiers, coreCommitments, slaScope, slaMetaDesc } from '../data/slaData';
import { getCalendlyUrl } from '../utils/calendly';
import { setPageSeo } from '../utils/pageTitle';
import { isTurkish } from '../i18n';

export const Sla = () => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const lang = isTr ? 'tr' : 'en';

  const [activeTier, setActiveTier] = useState('SEV-0');

  useEffect(() => {
    setPageSeo('/sla/', lang);
  }, [isTr, lang]);

  const selectedTier = slaTiers.find(t => t.level === activeTier) || slaTiers[0];

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-16 text-[var(--ink)] font-sans">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[var(--accent-soft)] border border-[var(--accent)] text-[var(--accent)] font-mono text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isTr ? 'B2B HİZMET SEVİYESİ TAAHHÜTLERİ (SLA)' : 'B2B SERVICE LEVEL AGREEMENTS (SLA)'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-semibold font-serif text-[var(--ink)] tracking-tight">
          {isTr ? 'Şeffaf Mühendislik SLA & Yanıt Süresi Matrisi' : 'Transparent Engineering SLA & Response Matrix'}
        </h1>
        <p className="text-[var(--ink-muted)] text-base sm:text-lg leading-relaxed">
          {isTr
            ? 'Ajanslar ve kurumsal şirketler için muğlak "en kısa sürede inceleriz" sözleri yerine; dakikalarla tanımlanmış, bağlayıcı mühendislik masası taahhütleri.'
            : 'Instead of vague "we will look into it ASAP" promises; strictly defined, minute-by-minute senior engineering desk commitments.'}
        </p>
      </div>

      {/* SLA Tiers Interactive Matrix */}
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[var(--rule)] pb-4">
          <h2 className="text-lg font-semibold font-serif text-[var(--ink)] flex items-center gap-2">
            <Zap className="w-4 h-4 text-[var(--accent)]" />
            <span>{isTr ? 'Olay Ciddiyet Seviyeleri (Severity Tiers)' : 'Incident Severity Tiers'}</span>
          </h2>
          <span className="text-xs font-mono text-[var(--ink-muted)]">
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
                className={`p-4 rounded border text-left transition-all duration-150 relative min-h-[44px] cursor-pointer ${
                  isActive
                    ? 'bg-[var(--surface)] border-[var(--accent)] shadow-sm ring-1 ring-[var(--accent)]'
                    : 'bg-[var(--surface)] border-[var(--rule)] hover:border-[var(--ink-muted)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                    t.level === 'SEV-0' ? 'bg-red-50 text-red-800 border border-red-300' :
                    t.level === 'SEV-1' ? 'bg-amber-50 text-amber-800 border border-amber-300' :
                    t.level === 'SEV-2' ? 'bg-blue-50 text-blue-800 border border-blue-300' :
                    'bg-purple-50 text-purple-800 border border-purple-300'
                  }`}>
                    {t.level}
                  </span>
                  <span className="text-xs font-mono text-[var(--ink-muted)]">{t.slaComplianceRate}</span>
                </div>
                <div className="text-sm font-semibold font-serif text-[var(--ink)] line-clamp-1">
                  {t.title[lang]}
                </div>
                <div className="text-xs font-mono text-[var(--accent)] mt-1 font-semibold">
                  MTTA: {t.mtta[lang]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Tier Expanded Sheet */}
        <div className="p-6 sm:p-8 rounded bg-[var(--surface)] border border-[var(--rule)] space-y-8 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-[var(--rule)] pb-6 font-mono">
            <div className="p-4 rounded bg-[var(--paper)] border border-[var(--rule)] space-y-1">
              <span className="text-xs text-[var(--ink-muted)] uppercase tracking-wider block font-semibold">
                {isTr ? 'İLK YANIT (MTTA)' : 'FIRST RESPONSE (MTTA)'}
              </span>
              <strong className="text-xl sm:text-2xl font-bold text-[var(--accent)]">
                {selectedTier.mtta[lang]}
              </strong>
              <p className="text-xs text-[var(--ink-muted)]">
                {isTr ? 'Acil çağrı sonrası mühendisin ilk teyidi' : 'Initial acknowledgment by senior engineer'}
              </p>
            </div>

            <div className="p-4 rounded bg-[var(--paper)] border border-[var(--rule)] space-y-1">
              <span className="text-xs text-[var(--ink-muted)] uppercase tracking-wider block font-semibold">
                {isTr ? 'MASAYA OTURMA & TRİYAJ' : 'TIME TO ENGAGE (TABLE)'}
              </span>
              <strong className="text-xl sm:text-2xl font-bold text-emerald-700">
                {selectedTier.timeToTable[lang]}
              </strong>
              <p className="text-xs text-[var(--ink-muted)]">
                {isTr ? 'Canlı sisteme SSH/Repo erişimiyle müdahale' : 'Active production triage and containment'}
              </p>
            </div>

            <div className="p-4 rounded bg-[var(--paper)] border border-[var(--rule)] space-y-1">
              <span className="text-xs text-[var(--ink-muted)] uppercase tracking-wider block font-semibold">
                {isTr ? 'DURUM GÜNCELLEME SIKLIĞI' : 'STATUS CADENCE'}
              </span>
              <strong className="text-base sm:text-lg font-semibold text-[var(--ink)] block mt-1">
                {selectedTier.updateCadence[lang]}
              </strong>
              <p className="text-xs text-[var(--ink-muted)]">
                {isTr ? 'Yazılı durum ve kriz brifingi' : 'Written brief and incident milestones'}
              </p>
            </div>
          </div>

          {/* Definition */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-semibold text-[var(--ink-muted)] uppercase tracking-wider">
              {isTr ? 'KAPSAM & TANIM' : 'SCOPE & DEFINITION'}
            </h3>
            <p className="text-[var(--ink)] text-base leading-relaxed">
              {selectedTier.definition[lang]}
            </p>
          </div>

          {/* Typical Incidents */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-semibold text-[var(--ink-muted)] uppercase tracking-wider">
              {isTr ? 'BU SEVİYEYE GİREN TİPİK VAKALAR' : 'TYPICAL INCIDENT PATTERNS'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectedTier.typicalIncidents.map((inc, i) => (
                <div key={i} className="p-3.5 rounded bg-[var(--paper)] border border-[var(--rule)] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                  <span className="text-xs text-[var(--ink)] leading-snug">{inc[lang]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick CTA inside tier */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--rule)]">
            <div className="text-xs text-[var(--ink-muted)] font-mono">
              {isTr ? 'Bu seviyede aktif bir kriziniz mi var?' : 'Experiencing an incident at this severity?'}
            </div>
            <div className="flex items-center gap-3">
              <Link
                to={isTr ? "/triyaj/" : "/triage/"}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[var(--paper)] text-[var(--ink)] border border-[var(--rule)] text-xs font-mono hover:bg-[var(--surface)] transition-colors min-h-[44px]"
              >
                <span>{isTr ? 'Triyaj Simülatörü →' : 'Triage Simulator →'}</span>
              </Link>
              <Link
                to={isTr ? "/sos/" : "/sos/"}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[var(--accent)] text-[var(--on-accent)] text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-sm min-h-[44px]"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{isTr ? 'Acil Kriz Masası (SOS)' : 'Emergency Crisis Desk'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Coverage Note */}
        <div className="p-4 rounded bg-[var(--paper)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] leading-relaxed">
          <p>
            {slaScope[lang]}
          </p>
        </div>
      </div>

      {/* 6 Core Engineering Commitments */}
      <div className="space-y-8">
        <h2 className="text-2xl sm:text-3xl font-semibold font-serif text-[var(--ink)] tracking-tight">
          {isTr ? 'Altı Temel Taahhüdümüz' : 'Our Six Core Commitments'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreCommitments.map((c) => (
            <article key={c.no} className="p-6 rounded bg-[var(--surface)] border border-[var(--rule)] space-y-3 shadow-sm hover:border-[var(--ink-muted)] transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold font-mono text-[var(--accent)]">{c.no}</span>
                </div>
                <h3 className="text-lg font-semibold font-serif text-[var(--ink)]">
                  {c.title[lang]}
                </h3>
                <p className="text-[var(--ink-muted)] text-sm leading-relaxed">
                  {c.desc[lang]}
                </p>
              </div>
              {c.no === '02' && (
                <div className="pt-2">
                  <Link
                    to={isTr ? "/nda/" : "/nda/"}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline font-mono min-h-[44px] py-[13px] -my-[13px]"
                  >
                    <span>{isTr ? 'Sözleşmeyi okuyun →' : 'Read the agreement →'}</span>
                  </Link>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      {/* Bottom CTA Card */}
      <div className="p-8 sm:p-12 rounded bg-[var(--surface)] border border-[var(--rule)] text-center space-y-6 max-w-3xl mx-auto shadow-sm">
        <h3 className="text-2xl sm:text-3xl font-semibold font-serif text-[var(--ink)]">
          {isTr ? 'Kriz Kapınızı Çalmadan Tanışalım' : 'Meet Before Critical Outages Strike'}
        </h3>
        <p className="text-[var(--ink-muted)] text-sm sm:text-base leading-relaxed">
          {isTr
            ? 'Birçok ajansla ilk temasımız canlı sistem durduğunda gerçekleşir. Dilerseniz önceden 15 dakikalık bir triyaj tanışması yaparak acil durum protokolünüzü netleştirelim.'
            : 'Most agencies reach out when production is already on fire. Schedule a 15-minute intro triage to define your standby emergency protocol beforehand.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href={getCalendlyUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[var(--accent)] text-[var(--on-accent)] font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors shadow-sm min-h-[44px]"
          >
            <Clock className="w-4 h-4" />
            <span>{isTr ? '15 Dk Triyaj Tanışması' : '15-Min Intro Triage'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <Link
            to={isTr ? "/sos/" : "/sos/"}
            className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] font-mono text-sm hover:bg-[var(--surface)] transition-colors min-h-[44px]"
          >
            <span>{isTr ? 'Kriz Masası (SOS) →' : 'Crisis Desk (SOS) →'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sla;
