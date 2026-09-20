import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, ShieldAlert, Terminal, Copy, Check, 
  ArrowRight, PhoneCall, ExternalLink, Activity, Flame, 
  CheckCircle2, XCircle, AlertOctagon, CornerDownRight, Clock
} from 'lucide-react';
import { triageScenarios } from '../data/triageData';
import { getCalendlyUrl } from '../utils/calendly';
import { formatDocumentTitle } from '../utils/pageTitle';
import { isTurkish } from '../i18n';

export const Triage = () => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const lang = isTr ? 'tr' : 'en';

  const [selectedId, setSelectedId] = useState(triageScenarios[0].id);
  const [copiedCmd, setCopiedCmd] = useState(null);
  const [copiedReport, setCopiedReport] = useState(false);

  const activeScenario = triageScenarios.find(s => s.id === selectedId) || triageScenarios[0];

  useEffect(() => {
    document.title = formatDocumentTitle(
      isTr 
        ? 'Canlı Kriz & Triyaj Simülatörü // İlk 15 Dakika Protokolü | Trend Master Akademi'
        : 'Emergency Triage & Incident Simulator // First 15-Min Protocol | Trend Master Academy'
    );

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        isTr
          ? 'Canlı sisteminiz krizde mi? Belirtiyi seçin, ilk 15 dakikada ne yapmamanız gerektiğini, çekilecek log komutlarını ve acil müdahale adımlarını anında görün.'
          : 'Is your production system down? Select your symptom, discover what NOT to do in the first 15 minutes, extract critical logs, and get immediate triage steps.'
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute(
        'href',
        isTr 
          ? 'https://trendmasterakademi.com/triyaj/' 
          : 'https://trendmasterakademi.com/triage/'
      );
    }
  }, [isTr]);

  const copyCommand = (cmd, index) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(index);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const copyFullReport = () => {
    const report = `[TMA INCIDENT TRIAGE REPORT]
Kategori: ${activeScenario.category[lang]}
Şiddet: ${activeScenario.severity}
Semptom: ${activeScenario.symptom[lang]}
Tahmini İlk Yanıt Süresi: ${activeScenario.firstResponseTime[lang]}

--- NE YAPILMAMALI ---
${activeScenario.doNot.map(d => `• ${d[lang]}`).join('\n')}

--- ANLIK EYLEM PLANI ---
${activeScenario.immediateAction[lang]}

--- TMA SWAT PROTOKOLÜ ---
${activeScenario.tmaResolution[lang]}
Rapor Tarihi: ${new Date().toISOString()}`;

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>{isTr ? 'CANLI KRİZ & ACİL TRİYAJ MASASI' : 'EMERGENCY TRIAGE & CRISIS DESK'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {isTr ? 'İlk 15 Dakika Protokolü: Sistem Çöktüğünde Ne Yapma!' : 'First 15-Minute Protocol: What NOT To Do During Outages'}
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          {isTr
            ? 'Canlı sisteminiz çöktüğünde veya kilitlendiğinde ilk panikle yapılan hamleler (rastgele restart, kontrolsüz migration rollback) kesinti süresini saatlerce uzatır. Belirtinizi seçin, kanıt toplayın ve soğukkanlı eylem planını uygulayın.'
            : 'When production fails, panicked initial responses (random server reboots, blind migration reverts) multiply downtime tenfold. Select your symptom, gather hard evidence, and execute disciplined incident protocols.'}
        </p>
      </div>

      {/* Main Grid: Selector on Left, Action Protocol on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Symptom Selector List */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold px-1">
            {isTr ? 'Gözlemlenen Kriz Belirtisi (6 Senaryo)' : 'Observed Outage Symptoms (6 Scenarios)'}
          </h2>
          <div className="space-y-2">
            {triageScenarios.map((sc) => {
              const isSelected = sc.id === activeScenario.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => setSelectedId(sc.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-white/10 border-cyan-400/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/30'
                      : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {sc.category[lang]}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      sc.severity.includes('SEV-0')
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30 font-bold'
                        : sc.severity.includes('SEV-1')
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {sc.severity}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 line-clamp-2 leading-snug">
                    {sc.symptom[lang]}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Quick SOS Box */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 mt-6">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm font-mono">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{isTr ? 'Canlıda Aktif Ciro Kaybı mı Var?' : 'Active Revenue Loss in Progress?'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isTr
                ? 'İlk teşhis ve triyaj ücretsizdir. Masaya doğrudan kıdemli mühendis bağlanır.'
                : 'Initial diagnosis and triage are complimentary. A senior engineer connects directly.'}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="tel:+905343713573"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 text-black text-xs font-bold hover:bg-amber-300 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>+90 534 371 35 73</span>
              </a>
              <Link
                to={isTr ? "/sos/" : "/sos/"}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-mono hover:bg-white/20 transition-colors"
              >
                <span>{isTr ? 'Kriz Hattı →' : 'Crisis Desk →'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Triage Protocol Sheet */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-black/60 border border-white/10 space-y-8 backdrop-blur-xl relative overflow-hidden">
            {/* Ambient indicator */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Protocol Meta Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>PROTOKOL: {activeScenario.id.toUpperCase()}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {activeScenario.category[lang]}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 block">{isTr ? 'İLK YANIT' : 'RESPONSE'}</span>
                  <span className="text-sm font-bold text-emerald-400">{activeScenario.firstResponseTime[lang]}</span>
                </div>
                <span className={`text-xs font-mono px-3 py-1.5 rounded-lg font-bold ${
                  activeScenario.severity.includes('SEV-0')
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : activeScenario.severity.includes('SEV-1')
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                }`}>
                  {activeScenario.severity}
                </span>
              </div>
            </div>

            {/* Symptom Definition */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-sm text-slate-200">
              <span className="text-cyan-400 font-bold block mb-1">
                {isTr ? '▸ GÖZLEMLENEN BELİRTİ' : '▸ OBSERVED SYMPTOM'}
              </span>
              {activeScenario.symptom[lang]}
            </div>

            {/* 1. WHAT NOT TO DO (CRITICAL) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-mono text-sm font-bold tracking-wide">
                <AlertOctagon className="w-4 h-4 text-red-400" />
                <span>{isTr ? '1. İLK 15 DAKİKADA KESİNLİKLE YAPILMAMASI GEREKENLER' : '1. ABSOLUTE "DO NOTs" IN FIRST 15 MINUTES'}</span>
              </div>
              <div className="space-y-2">
                {activeScenario.doNot.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-200 leading-relaxed font-sans">
                      {item[lang]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. DIAGNOSTIC CLI COMMANDS */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-bold tracking-wide">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>{isTr ? '2. KANIT VE TEŞHİS TOPLAMA KOMUTLARI' : '2. DIAGNOSTIC & EVIDENCE EXTRACTION COMMANDS'}</span>
              </div>
              <div className="space-y-3">
                {activeScenario.diagnosticCommands.map((diag, idx) => (
                  <div key={idx} className="rounded-xl bg-black/80 border border-white/10 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 text-xs font-mono text-slate-400">
                      <span>{diag.desc[lang]}</span>
                      <button
                        onClick={() => copyCommand(diag.cmd, idx)}
                        className="inline-flex items-center gap-1 text-cyan-300 hover:text-white transition-colors"
                      >
                        {copiedCmd === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">{isTr ? 'Kopyalandı' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{isTr ? 'Kopyala' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      <code>{diag.cmd}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. IMMEDIATE ACTION PROTOCOL */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm font-bold tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isTr ? '3. SOĞUKKANLI ANLIK MÜDAHALE ADIMLARI' : '3. IMMEDIATE INCIDENT CONTAINMENT STEPS'}</span>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-sm leading-relaxed whitespace-pre-line font-sans">
                {activeScenario.immediateAction[lang]}
              </div>
            </div>

            {/* 4. TMA SWAT RESOLUTION */}
            <div className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wide block">
                {isTr ? '▸ TMA SWAT MASASI MÜDAHALE PROTOKOLÜ' : '▸ TMA SWAT RESOLUTION PROTOCOL'}
              </span>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {activeScenario.tmaResolution[lang]}
              </p>
              {activeScenario.linkedTeshisSlug && (
                <div className="pt-2">
                  <Link
                    to={isTr ? `/teshis/${activeScenario.linkedTeshisSlug}/` : `/diagnostic/${activeScenario.linkedTeshisSlug}/`}
                    className="inline-flex items-center gap-1 text-xs font-mono text-cyan-400 hover:underline font-bold"
                  >
                    <span>{isTr ? 'Arıza Kataloğundaki Detaylı Reçeteyi İnceleyin' : 'View Full Catalog Diagnosis & Root Cause'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
              <button
                onClick={copyFullReport}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/20 text-slate-200 text-xs font-mono font-bold hover:bg-white/10 transition-colors"
              >
                {copiedReport ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">{isTr ? 'Triyaj Raporu Kopyalandı!' : 'Triage Report Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-cyan-400" />
                    <span>{isTr ? 'Kriz Raporunu Kopyala (Markdown)' : 'Copy Triage Brief (Markdown)'}</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-3">
                <a
                  href={getCalendlyUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isTr ? '15 Dk Triyaj Randevusu' : '15-Min Triage Call'}</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Triage;
