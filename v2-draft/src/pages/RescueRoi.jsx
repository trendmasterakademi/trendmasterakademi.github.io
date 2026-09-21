import React, { useState, useMemo, useEffect } from "react";
import { rescueRoiData } from "../data/rescueRoiData";
import { getCalendlyUrl } from "../utils/calendly";
import { setPageSeo } from "../utils/pageTitle";

export default function RescueRoi({ lang = "tr" }) {
  const t = rescueRoiData[lang] || rescueRoiData.tr;

  useEffect(() => {
    setPageSeo(lang === 'tr' ? '/kurtarma-maliyeti/' : '/rescue-roi/', lang);
  }, [lang]);

  const [selectedPreset, setSelectedPreset] = useState("saas");
  const [teamSize, setTeamSize] = useState(3);
  const [monthlyRatePerDev, setMonthlyRatePerDev] = useState(90000);
  const [rebuildMonths, setRebuildMonths] = useState(5);
  const [recruitingMonths, setRecruitingMonths] = useState(2);
  const [monthlyRevenueAtRisk, setMonthlyRevenueAtRisk] = useState(450000);
  const [copied, setCopied] = useState(false);

  const applyPreset = (presetId) => {
    const p = t.presets.find((pr) => pr.id === presetId);
    if (!p) return;
    setSelectedPreset(presetId);
    setTeamSize(p.teamSize);
    setMonthlyRatePerDev(p.monthlyRatePerDev);
    setRebuildMonths(p.rebuildMonths);
    setRecruitingMonths(p.recruitingMonths);
    setMonthlyRevenueAtRisk(p.monthlyRevenueAtRisk);
  };

  const metrics = useMemo(() => {
    const totalRebuildMonths = rebuildMonths + recruitingMonths;
    const rebuildPayrollCost = teamSize * monthlyRatePerDev * totalRebuildMonths;
    const rebuildOpportunityCost = Math.round(monthlyRevenueAtRisk * 0.15 * totalRebuildMonths);
    const totalRebuildCost = rebuildPayrollCost + rebuildOpportunityCost;
    
    // TMA rescue typically costs ~18% of a multi-month full rebuild
    const tmaRescueCost = Math.round(totalRebuildCost * 0.18);
    const netCapitalSaved = totalRebuildCost - tmaRescueCost;
    const timeSavedMonths = Math.max(1, totalRebuildMonths - 1);
    const roiMultiplier = tmaRescueCost > 0 ? (netCapitalSaved / tmaRescueCost).toFixed(1) : "0";

    return {
      totalRebuildMonths,
      rebuildPayrollCost,
      rebuildOpportunityCost,
      totalRebuildCost,
      tmaRescueCost,
      netCapitalSaved,
      timeSavedMonths,
      roiMultiplier
    };
  }, [
    teamSize,
    monthlyRatePerDev,
    rebuildMonths,
    recruitingMonths,
    monthlyRevenueAtRisk
  ]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat(lang === "en" ? "en-US" : "tr-TR", {
      style: "currency",
      currency: lang === "en" ? "USD" : "TRY",
      maximumFractionDigits: 0
    }).format(val);
  };

  const copyBrief = () => {
    const brief = `[TMA FİNANSAL ROI & KURTARMA VS. REBUILD RAPORU]
============================================================
Analiz Edilen Profil: ${t.presets.find(p => p.id === selectedPreset)?.name || "Özel Proje"}

NET TASARRUF EDİLEN SERMAYE: ${formatCurrency(metrics.netCapitalSaved)}
KAZANILAN ZAMAN: ${metrics.timeSavedMonths} Ay
SERMAYE GETİRİ ORANI (ROI): ${metrics.roiMultiplier}x Kat

Finansal Karşılaştırma:
------------------------------------------------------------
1. Sıfırdan Yazım (Rebuild) Toplam Maliyeti: ${formatCurrency(metrics.totalRebuildCost)}
   - Doğrudan Mühendis Maaşları (${metrics.totalRebuildMonths} Ay): ${formatCurrency(metrics.rebuildPayrollCost)}
   - Kaçırılan Pazar & Ciro Fırsat Maliyeti: ${formatCurrency(metrics.rebuildOpportunityCost)}
   
2. TMA SWAT Cerrahi Kurtarma Yatırımı: ${formatCurrency(metrics.tmaRescueCost)}
   - Tahmini Müdahale Süresi: 2 - 4 Hafta
   - Veri Kaybı Riski: Sıfır (Canlı ciro korunur)

TMA Mühendislik Masası: info@trendmasterakademi.com | +90 534 371 35 73
Sözleşme & NDA Koruma: https://trendmasterakademi.com/gizlilik-sozlesmesi/
============================================================`;

    navigator.clipboard.writeText(brief).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[var(--accent)] selection:text-white">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--accent)] text-xs font-mono font-medium uppercase tracking-widest mb-4">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
          {t.hero.badge}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold tracking-tight text-[var(--ink)] mb-4">
          {t.hero.title}
        </h1>
        <p className="text-base sm:text-lg text-[var(--ink-light)] max-w-[34rem] mx-auto mb-4">
          {t.hero.subtitle}
        </p>
        <p className="text-xs text-[var(--ink-muted)] font-mono">
          💼 {t.hero.notice}
        </p>
      </div>

      {/* Preset Selector */}
      <div className="max-w-6xl mx-auto mb-10">
        <span className="text-xs font-mono text-[var(--ink-muted)] uppercase tracking-wider block mb-3 text-center">
          {t.labels.presetTitle}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {t.presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer min-h-[48px] ${
                selectedPreset === preset.id
                  ? "bg-[var(--accent-subtle)] border-[var(--accent)] text-[var(--ink)] shadow-sm"
                  : "bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink-light)] hover:border-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              <h3 className="text-sm font-bold font-mono tracking-tight">{preset.name}</h3>
              <p className="text-xs text-[var(--ink-muted)] mt-1 font-mono">
                {preset.teamSize} Devs • {preset.rebuildMonths} Mo Rebuild
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs + Financial ROI Output */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-base font-serif font-semibold text-[var(--ink)] flex items-center gap-2 border-b border-[var(--rule)] pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]"></span>
              {lang === "en" ? "Rebuild Assumptions & Team Metrics" : "Sıfırdan Yazım Parametreleri & Maliyetler"}
            </h2>

            {/* Team Size Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <label htmlFor="team-size-slider" className="text-[var(--ink)] font-medium">{t.labels.teamSize}</label>
                <span className="text-[var(--accent)] font-bold">{teamSize} {lang === "en" ? "Engineers" : "Mühendis"}</span>
              </div>
              <input
                id="team-size-slider"
                type="range"
                min="1"
                max="12"
                step="1"
                aria-label={t.labels.teamSize}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full accent-[var(--accent)] cursor-pointer"
              />
            </div>

            {/* Rebuild Duration Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <label htmlFor="rebuild-months-slider" className="text-[var(--ink)] font-medium">{t.labels.rebuildMonths}</label>
                <span className="text-[var(--ink)] font-bold">{rebuildMonths} {lang === "en" ? "Months" : "Ay"}</span>
              </div>
              <input
                id="rebuild-months-slider"
                type="range"
                min="2"
                max="18"
                step="1"
                aria-label={t.labels.rebuildMonths}
                value={rebuildMonths}
                onChange={(e) => setRebuildMonths(Number(e.target.value))}
                className="w-full accent-[var(--accent)] cursor-pointer"
              />
            </div>

            {/* Numerical Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label htmlFor="monthly-rate-input" className="block text-[var(--ink-light)] mb-1">{t.labels.monthlyRate}</label>
                <input
                  id="monthly-rate-input"
                  type="number"
                  aria-label={t.labels.monthlyRate}
                  value={monthlyRatePerDev}
                  onChange={(e) => setMonthlyRatePerDev(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label htmlFor="recruiting-months-input" className="block text-[var(--ink-light)] mb-1">{t.labels.recruitingMonths}</label>
                <input
                  id="recruiting-months-input"
                  type="number"
                  min="0"
                  max="12"
                  aria-label={t.labels.recruitingMonths}
                  value={recruitingMonths}
                  onChange={(e) => setRecruitingMonths(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>

            <div className="text-xs font-mono">
              <label htmlFor="monthly-rev-risk-input" className="block text-[var(--ink-light)] mb-1">{t.labels.monthlyRevenue}</label>
              <input
                id="monthly-rev-risk-input"
                type="number"
                aria-label={t.labels.monthlyRevenue}
                value={monthlyRevenueAtRisk}
                onChange={(e) => setMonthlyRevenueAtRisk(Math.max(0, Number(e.target.value)))}
                className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>
        </div>

        {/* Financial ROI Output Column */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <span className="text-xs font-mono uppercase text-[var(--accent)] tracking-wider block mb-2 font-semibold">
              {t.labels.capitalSaved}
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[var(--ink)] font-mono tracking-tight mb-4">
              {formatCurrency(metrics.netCapitalSaved)}
            </div>

            {/* Key Value Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6 font-mono">
              <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--rule)]">
                <span className="text-xs text-[var(--ink-muted)] uppercase block mb-1">
                  {t.labels.timeSaved}
                </span>
                <span className="text-2xl font-bold text-[var(--ink)]">
                  {metrics.timeSavedMonths} {lang === "en" ? "Mo" : "Ay"}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--rule)]">
                <span className="text-xs text-[var(--ink-muted)] uppercase block mb-1">
                  {t.labels.roiMultiplier}
                </span>
                <span className="text-2xl font-bold text-[var(--accent)]">
                  {metrics.roiMultiplier}x
                </span>
              </div>
            </div>

            {/* Comparison Details */}
            <div className="space-y-3 border-t border-[var(--rule)] pt-5 text-xs font-mono">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)]">
                <span className="text-[var(--ink-light)]">{t.labels.rebuildSummaryTitle} ({metrics.totalRebuildMonths} {lang === "en" ? "Mo" : "Ay"}):</span>
                <span className="font-bold text-rose-700">{formatCurrency(metrics.totalRebuildCost)}</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)]">
                <span className="text-[var(--ink-light)]">{t.labels.rescueSummaryTitle} {lang === "en" ? "(~3 Weeks):" : "(~3 Hafta):"}</span>
                <span className="font-bold text-emerald-700">{formatCurrency(metrics.tmaRescueCost)}</span>
              </div>
            </div>

            <p className="text-xs text-[var(--ink-muted)] font-mono leading-relaxed mt-4 pt-3 border-t border-[var(--rule)]">
              ℹ️ {t.labels.sourceNote}
            </p>

            {/* Actions */}
            <div className="mt-6 space-y-2.5 border-t border-[var(--rule)] pt-6">
              <button
                onClick={copyBrief}
                className="btn-secondary min-h-[44px] w-full text-xs font-mono font-medium flex items-center justify-center gap-2 cursor-pointer"
              >
                📋 {copied ? t.labels.copiedNotice : t.labels.copyReport}
              </button>

              <a
                href={getCalendlyUrl(lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary min-h-[44px] w-full text-xs font-mono font-semibold flex items-center justify-center gap-2 text-center"
              >
                ⚡ {t.labels.triageCta}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Grid: Rebuild Liabilities vs Rescue Advantages */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-3">
          <h2 className="text-sm font-mono font-semibold text-rose-700 uppercase tracking-wider">
            {t.labels.rebuildBreakdown}
          </h2>
          <ul className="text-xs text-[var(--ink-light)] space-y-2 list-disc list-inside font-sans">
            {t.rebuildItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-3">
          <h2 className="text-sm font-mono font-semibold text-emerald-700 uppercase tracking-wider">
            {t.labels.rescueBreakdown}
          </h2>
          <ul className="text-xs text-[var(--ink-light)] space-y-2 list-disc list-inside font-sans">
            {t.rescueItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
