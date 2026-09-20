import React, { useState, useMemo } from "react";
import { rescueRoiData } from "../data/rescueRoiData";
import { getCalendlyUrl } from "../utils/calendly";

export default function RescueRoi({ lang = "tr" }) {
  const t = rescueRoiData[lang] || rescueRoiData.tr;

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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-mono font-medium uppercase tracking-widest mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {t.hero.badge}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
          {t.hero.title}
        </h1>
        <p className="text-base sm:text-lg text-neutral-400 max-w-3xl mx-auto mb-4">
          {t.hero.subtitle}
        </p>
        <p className="text-xs text-neutral-500 font-mono">
          💼 {t.hero.notice}
        </p>
      </div>

      {/* Preset Selector */}
      <div className="max-w-6xl mx-auto mb-10">
        <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-3 text-center">
          {t.labels.presetTitle}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {t.presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className={`p-4 rounded-xl text-left border transition-all ${
                selectedPreset === preset.id
                  ? "bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-950/30"
                  : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
              }`}
            >
              <h3 className="text-sm font-bold font-mono tracking-tight">{preset.name}</h3>
              <p className="text-xs text-neutral-500 mt-1 font-mono">
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
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              {lang === "en" ? "Rebuild Assumptions & Team Metrics" : "Sıfırdan Yazım Parametreleri & Maliyetler"}
            </h2>

            {/* Team Size Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <label htmlFor="team-size-slider" className="text-neutral-300 font-medium">{t.labels.teamSize}</label>
                <span className="text-emerald-400 font-bold">{teamSize} {lang === "en" ? "Engineers" : "Mühendis"}</span>
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
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Rebuild Duration Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <label htmlFor="rebuild-months-slider" className="text-neutral-300 font-medium">{t.labels.rebuildMonths}</label>
                <span className="text-white font-bold">{rebuildMonths} {lang === "en" ? "Months" : "Ay"}</span>
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
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Numerical Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label htmlFor="monthly-rate-input" className="block text-neutral-400 mb-1">{t.labels.monthlyRate}</label>
                <input
                  id="monthly-rate-input"
                  type="number"
                  aria-label={t.labels.monthlyRate}
                  value={monthlyRatePerDev}
                  onChange={(e) => setMonthlyRatePerDev(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="recruiting-months-input" className="block text-neutral-400 mb-1">{t.labels.recruitingMonths}</label>
                <input
                  id="recruiting-months-input"
                  type="number"
                  min="0"
                  max="12"
                  aria-label={t.labels.recruitingMonths}
                  value={recruitingMonths}
                  onChange={(e) => setRecruitingMonths(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="text-xs font-mono">
              <label htmlFor="monthly-rev-risk-input" className="block text-neutral-400 mb-1">{t.labels.monthlyRevenue}</label>
              <input
                id="monthly-rev-risk-input"
                type="number"
                aria-label={t.labels.monthlyRevenue}
                value={monthlyRevenueAtRisk}
                onChange={(e) => setMonthlyRevenueAtRisk(Math.max(0, Number(e.target.value)))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Financial ROI Output Column */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-neutral-900/90 border border-emerald-900/60 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>

            <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider block mb-2 font-semibold">
              {t.labels.capitalSaved}
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-mono tracking-tight mb-4">
              {formatCurrency(metrics.netCapitalSaved)}
            </div>

            {/* Key Value Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6 font-mono">
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
                <span className="text-[10px] text-neutral-400 uppercase block mb-1">
                  {t.labels.timeSaved}
                </span>
                <span className="text-2xl font-extrabold text-white">
                  {metrics.timeSavedMonths} {lang === "en" ? "Mo" : "Ay"}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
                <span className="text-[10px] text-neutral-400 uppercase block mb-1">
                  {t.labels.roiMultiplier}
                </span>
                <span className="text-2xl font-extrabold text-emerald-400">
                  {metrics.roiMultiplier}x
                </span>
              </div>
            </div>

            {/* Comparison Details */}
            <div className="space-y-3 border-t border-neutral-800/80 pt-5 text-xs font-mono">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-400">{t.labels.rebuildSummaryTitle} ({metrics.totalRebuildMonths} Ay):</span>
                <span className="font-bold text-rose-400">{formatCurrency(metrics.totalRebuildCost)}</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-400">{t.labels.rescueSummaryTitle} (~3 Hafta):</span>
                <span className="font-bold text-emerald-400">{formatCurrency(metrics.tmaRescueCost)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-2.5 border-t border-neutral-800/80 pt-6">
              <button
                onClick={copyBrief}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-mono font-medium text-white transition flex items-center justify-center gap-2"
              >
                📋 {copied ? t.labels.copiedNotice : t.labels.copyReport}
              </button>

              <a
                href={getCalendlyUrl(lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-mono font-bold text-white transition flex items-center justify-center gap-2 text-center shadow-lg shadow-emerald-950/60"
              >
                ⚡ {t.labels.triageCta}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Grid: Rebuild Liabilities vs Rescue Advantages */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-3">
          <h2 className="text-sm font-mono font-bold text-rose-400 uppercase tracking-wider">
            {t.labels.rebuildBreakdown}
          </h2>
          <ul className="text-xs text-neutral-300 space-y-2 list-disc list-inside font-sans">
            {t.rebuildItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-3">
          <h2 className="text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider">
            {t.labels.rescueBreakdown}
          </h2>
          <ul className="text-xs text-neutral-300 space-y-2 list-disc list-inside font-sans">
            {t.rescueItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
