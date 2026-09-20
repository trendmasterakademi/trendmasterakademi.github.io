import React, { useState, useMemo } from "react";
import { outageSimulatorData } from "../data/outageSimulatorData";
import { getCalendlyUrl } from "../utils/calendly";

export default function OutageSimulator({ lang = "tr" }) {
  const t = outageSimulatorData[lang] || outageSimulatorData.tr;

  const [selectedPreset, setSelectedPreset] = useState("ecommerce");
  const [durationHours, setDurationHours] = useState(4);
  const [peakMultiplier, setPeakMultiplier] = useState(2.0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(2500000);
  const [dailyAdSpend, setDailyAdSpend] = useState(15000);
  const [slaPenaltyRate, setSlaPenaltyRate] = useState(0);
  const [churnRiskRate, setChurnRiskRate] = useState(1.5);
  const [engTeamSize, setEngTeamSize] = useState(4);
  const [engHourlyRate, setEngHourlyRate] = useState(950);
  const [copied, setCopied] = useState(false);

  const applyPreset = (presetId) => {
    const p = t.presets.find((pr) => pr.id === presetId);
    if (!p) return;
    setSelectedPreset(presetId);
    setMonthlyRevenue(p.monthlyRevenue);
    setDailyAdSpend(p.dailyAdSpend);
    setSlaPenaltyRate(p.slaPenaltyRate);
    setChurnRiskRate(p.churnRiskRate);
    setEngTeamSize(p.engTeamSize);
    setEngHourlyRate(p.engHourlyRate);
  };

  // Calculations
  const metrics = useMemo(() => {
    const hourlyRevenue = monthlyRevenue / 730;
    const directRevenueLoss = Math.round(hourlyRevenue * durationHours * peakMultiplier);
    const wastedAdSpend = Math.round((dailyAdSpend / 24) * durationHours);
    
    // SLA Penalty applies if duration exceeds 1 hour and penalty rate > 0
    const slaPenalty = durationHours >= 1 ? Math.round(monthlyRevenue * (slaPenaltyRate / 100)) : 0;
    
    // Churn impact: annualized lost LTV from frustrated clients
    const churnLoss = Math.round((monthlyRevenue * (churnRiskRate / 100)) * (durationHours >= 4 ? 6 : 3));
    
    // Engineering opportunity drag: internal dev hours burned in fire-fighting (1.5x panic factor)
    const engDrag = Math.round(engTeamSize * engHourlyRate * durationHours * 1.5);

    const totalTcod = directRevenueLoss + wastedAdSpend + slaPenalty + churnLoss + engDrag;
    const hiddenCollateral = wastedAdSpend + slaPenalty + churnLoss + engDrag;
    const hiddenMultiplier = directRevenueLoss > 0 ? (hiddenCollateral / directRevenueLoss).toFixed(1) : "0";

    return {
      directRevenueLoss,
      wastedAdSpend,
      slaPenalty,
      churnLoss,
      engDrag,
      totalTcod,
      hiddenCollateral,
      hiddenMultiplier
    };
  }, [
    monthlyRevenue,
    durationHours,
    peakMultiplier,
    dailyAdSpend,
    slaPenaltyRate,
    churnRiskRate,
    engTeamSize,
    engHourlyRate
  ]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat(lang === "en" ? "en-US" : "tr-TR", {
      style: "currency",
      currency: lang === "en" ? "USD" : "TRY",
      maximumFractionDigits: 0
    }).format(val);
  };

  const copyBrief = () => {
    const brief = `[TMA KURUMSAL KESİNTİ & HASAR TESPİT BRİFİNGİ (TCOD)]
============================================================
Analiz Edilen Senaryo: ${t.presets.find(p => p.id === selectedPreset)?.name || "Özel Profil"}
Kesinti Süresi: ${durationHours} Saat (Zaman Çarpanı: ${peakMultiplier}x)

TOPLAM GERÇEK HASAR (TCOD): ${formatCurrency(metrics.totalTcod)}
------------------------------------------------------------
1. Doğrudan Satış/Ciro Kaybı:       ${formatCurrency(metrics.directRevenueLoss)}
2. Boşa Yanan Reklam Bütçesi:      ${formatCurrency(metrics.wastedAdSpend)}
3. Sözleşmesel SLA Cezası:          ${formatCurrency(metrics.slaPenalty)}
4. Müşteri Terki & LTV Kaybı:       ${formatCurrency(metrics.churnLoss)}
5. Mühendislik Fırsat Maliyeti:     ${formatCurrency(metrics.engDrag)}

Gizli Hasar Oranı: Doğrudan ciro kaybının ${metrics.hiddenMultiplier} katı!

TMA Kriz Triyaj Masası: info@trendmasterakademi.com | +90 534 371 35 73
SLA & Müdahale Taahhütleri: https://trendmasterakademi.com/sla/
============================================================`;

    navigator.clipboard.writeText(brief).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-rose-500/30">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-400 text-xs font-mono font-medium uppercase tracking-widest mb-4">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          {t.hero.badge}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
          {t.hero.title}
        </h1>
        <p className="text-base sm:text-lg text-neutral-400 max-w-3xl mx-auto mb-4">
          {t.hero.subtitle}
        </p>
        <p className="text-xs text-neutral-500 font-mono">
          🚨 {t.hero.notice}
        </p>
      </div>

      {/* Preset Selector */}
      <div className="max-w-6xl mx-auto mb-10">
        <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-3 text-center">
          {t.labels.selectPreset}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {t.presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className={`p-3.5 rounded-xl text-left border transition-all ${
                selectedPreset === preset.id
                  ? "bg-rose-950/40 border-rose-500 text-white shadow-lg shadow-rose-950/30"
                  : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
              }`}
            >
              <h3 className="text-xs font-bold font-mono tracking-tight">{preset.name}</h3>
              <p className="text-[11px] text-neutral-500 mt-1 font-mono">
                {formatCurrency(preset.monthlyRevenue)} / {lang === "en" ? "mo" : "ay"}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Controls + Real-Time TCOD Output */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              {lang === "en" ? "Incident Variables & Exposure" : "Kesinti Değişkenleri & Maruziyet"}
            </h2>

            {/* Duration Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <label htmlFor="duration-slider" className="text-neutral-300 font-medium">{t.labels.durationHours}</label>
                <span className="text-rose-400 font-bold">{durationHours} {lang === "en" ? "Hours" : "Saat"}</span>
              </div>
              <input
                id="duration-slider"
                type="range"
                min="1"
                max="48"
                step="1"
                aria-label={t.labels.durationHours}
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Peak Timing Multiplier */}
            <div>
              <label htmlFor="peak-multiplier-select" className="text-xs font-mono text-neutral-300 font-medium block mb-2">
                {t.labels.peakMultiplier}
              </label>
              <select
                id="peak-multiplier-select"
                value={peakMultiplier}
                onChange={(e) => setPeakMultiplier(Number(e.target.value))}
                aria-label={t.labels.peakMultiplier}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
              >
                <option value={2.0}>{t.labels.peakOptions.peak}</option>
                <option value={1.0}>{t.labels.peakOptions.normal}</option>
                <option value={0.5}>{t.labels.peakOptions.night}</option>
              </select>
            </div>

            {/* Revenue & Ad Spend Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label htmlFor="monthly-rev-input" className="block text-neutral-400 mb-1">{t.labels.monthlyRevenue}</label>
                <input
                  id="monthly-rev-input"
                  type="number"
                  aria-label={t.labels.monthlyRevenue}
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label htmlFor="daily-ad-input" className="block text-neutral-400 mb-1">{t.labels.dailyAdSpend}</label>
                <input
                  id="daily-ad-input"
                  type="number"
                  aria-label={t.labels.dailyAdSpend}
                  value={dailyAdSpend}
                  onChange={(e) => setDailyAdSpend(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* SLA Penalty & Churn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label htmlFor="sla-penalty-input" className="block text-neutral-400 mb-1">{t.labels.slaPenaltyRate}</label>
                <input
                  id="sla-penalty-input"
                  type="number"
                  min="0"
                  max="100"
                  aria-label={t.labels.slaPenaltyRate}
                  value={slaPenaltyRate}
                  onChange={(e) => setSlaPenaltyRate(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label htmlFor="churn-risk-input" className="block text-neutral-400 mb-1">{t.labels.churnRiskRate}</label>
                <input
                  id="churn-risk-input"
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  aria-label={t.labels.churnRiskRate}
                  value={churnRiskRate}
                  onChange={(e) => setChurnRiskRate(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Engineering Team Drag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label htmlFor="eng-team-input" className="block text-neutral-400 mb-1">{t.labels.engTeamSize}</label>
                <input
                  id="eng-team-input"
                  type="number"
                  min="1"
                  max="50"
                  aria-label={t.labels.engTeamSize}
                  value={engTeamSize}
                  onChange={(e) => setEngTeamSize(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label htmlFor="eng-rate-input" className="block text-neutral-400 mb-1">{t.labels.engHourlyRate}</label>
                <input
                  id="eng-rate-input"
                  type="number"
                  aria-label={t.labels.engHourlyRate}
                  value={engHourlyRate}
                  onChange={(e) => setEngHourlyRate(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Real-time TCOD Output & Breakdown Column */}
        <div className="lg:col-span-6 space-y-5">
          {/* Main TCOD Banner */}
          <div className="bg-neutral-900/90 border border-rose-900/60 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl -z-10"></div>
            
            <span className="text-xs font-mono uppercase text-rose-400 tracking-wider block mb-2 font-semibold">
              {t.labels.totalTcod}
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-mono tracking-tight mb-3">
              {formatCurrency(metrics.totalTcod)}
            </div>

            {/* Hidden Cost Alert */}
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs font-mono text-rose-200">
              ⚠ <strong>{t.labels.hiddenCostWarning}</strong>{" "}
              <span className="text-white font-extrabold underline">{metrics.hiddenMultiplier}x</span>{" "}
              {lang === "en" ? "of direct sales losses." : "katına ulaşıyor!"}
            </div>

            {/* Breakdown Cards */}
            <div className="mt-6 space-y-2.5 border-t border-neutral-800/80 pt-6 text-xs font-mono">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80">
                <span className="text-neutral-300">1. {t.dimensions[0].title}</span>
                <span className="font-bold text-white">{formatCurrency(metrics.directRevenueLoss)}</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80">
                <span className="text-neutral-300">2. {t.dimensions[1].title}</span>
                <span className="font-bold text-amber-400">{formatCurrency(metrics.wastedAdSpend)}</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80">
                <span className="text-neutral-300">3. {t.dimensions[2].title}</span>
                <span className="font-bold text-rose-400">{formatCurrency(metrics.slaPenalty)}</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80">
                <span className="text-neutral-300">4. {t.dimensions[3].title}</span>
                <span className="font-bold text-purple-400">{formatCurrency(metrics.churnLoss)}</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80">
                <span className="text-neutral-300">5. {t.dimensions[4].title}</span>
                <span className="font-bold text-cyan-400">{formatCurrency(metrics.engDrag)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-2.5 border-t border-neutral-800/80 pt-6">
              <button
                onClick={copyBrief}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-mono font-medium text-white transition flex items-center justify-center gap-2"
              >
                📋 {copied ? t.labels.copied : t.labels.copyBrief}
              </button>

              <a
                href={getCalendlyUrl(lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-mono font-bold text-white transition flex items-center justify-center gap-2 text-center shadow-lg shadow-rose-950/60"
              >
                🚨 {t.labels.triageCta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
