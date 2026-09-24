import React, { useState, useMemo, useEffect } from "react";
import { outageSimulatorData } from "../data/outageSimulatorData";
import { getCalendlyUrl } from "../utils/calendly";
import { setPageSeo } from "../utils/pageTitle";

export default function OutageSimulator({ lang = "tr" }) {
  const t = outageSimulatorData[lang] || outageSimulatorData.tr;

  useEffect(() => {
    setPageSeo(lang === 'tr' ? '/hasar-tespiti/' : '/outage-simulator/', lang);
  }, [lang]);

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
    const brief = lang === "en" ? `[TMA OUTAGE & DAMAGE ASSESSMENT BRIEF (TCOD)]
============================================================
Scenario analysed: ${t.presets.find(p => p.id === selectedPreset)?.name || "Custom profile"}
Outage duration: ${durationHours} ${durationHours === 1 ? "hour" : "hours"} (time multiplier: ${peakMultiplier}x)

TOTAL COST OF DOWNTIME (TCOD): ${formatCurrency(metrics.totalTcod)}
------------------------------------------------------------
1. Direct sales / revenue loss:     ${formatCurrency(metrics.directRevenueLoss)}
2. Wasted ad spend:                 ${formatCurrency(metrics.wastedAdSpend)}
3. Contractual SLA penalty:         ${formatCurrency(metrics.slaPenalty)}
4. Customer churn & LTV loss:       ${formatCurrency(metrics.churnLoss)}
5. Engineering opportunity cost:    ${formatCurrency(metrics.engDrag)}

Hidden damage ratio: ${metrics.hiddenMultiplier}x the direct revenue loss.

TMA Crisis Triage Desk: info@trendmasterakademi.com | +90 534 371 35 73
SLA & response commitments: https://trendmasterakademi.com/sla/
============================================================` : `[TMA KURUMSAL KESİNTİ & HASAR TESPİT BRİFİNGİ (TCOD)]
============================================================
Analiz Edilen Senaryo: ${t.presets.find(p => p.id === selectedPreset)?.name || "Özel Profil"}
Kesinti Süresi: ${durationHours} Saat (Zaman Çarpanı: ${String(peakMultiplier).replace('.', ',')}x)

TOPLAM GERÇEK HASAR (TCOD): ${formatCurrency(metrics.totalTcod)}
------------------------------------------------------------
1. Doğrudan Satış/Ciro Kaybı:       ${formatCurrency(metrics.directRevenueLoss)}
2. Boşa Yanan Reklam Bütçesi:      ${formatCurrency(metrics.wastedAdSpend)}
3. Sözleşmesel SLA Cezası:          ${formatCurrency(metrics.slaPenalty)}
4. Müşteri Terki & LTV Kaybı:       ${formatCurrency(metrics.churnLoss)}
5. Mühendislik Fırsat Maliyeti:     ${formatCurrency(metrics.engDrag)}

Gizli Hasar Oranı: Doğrudan ciro kaybının ${String(metrics.hiddenMultiplier).replace('.', ',')} katı!

TMA Kriz Triyaj Masası: info@trendmasterakademi.com | +90 534 371 35 73
SLA & Müdahale Taahhütleri: https://trendmasterakademi.com/sla/
============================================================`;

    navigator.clipboard.writeText(brief).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[var(--accent)] selection:text-[var(--on-accent)]">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--accent)] text-xs font-mono font-medium uppercase tracking-widest mb-4">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
          {t.hero.badge}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold tracking-tight text-[var(--ink)] mb-4">
          {t.hero.title}
        </h1>
        <p className="text-base sm:text-lg text-[var(--ink-2)] max-w-[34rem] mx-auto mb-4">
          {t.hero.subtitle}
        </p>
        <p className="text-xs text-[var(--ink-3)] font-mono">
          {t.hero.notice}
        </p>
      </div>

      {/* Preset Selector */}
      <div className="max-w-6xl mx-auto mb-10">
        <span className="text-xs font-mono text-[var(--ink-3)] uppercase tracking-wider block mb-3 text-center">
          {t.labels.selectPreset}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {t.presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer min-h-[48px] ${
                selectedPreset === preset.id
                  ? "bg-[var(--accent-wash)] border-[var(--accent)] text-[var(--ink)] shadow-sm"
                  : "bg-[var(--surface)] border-[var(--rule)] text-[var(--ink-2)] hover:border-[var(--ink-3)] hover:text-[var(--ink)]"
              }`}
            >
              <h3 className="text-xs font-bold font-mono tracking-tight">{preset.name}</h3>
              <p className="text-xs text-[var(--ink-3)] mt-1 font-mono">
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
          <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-base font-serif font-semibold text-[var(--ink)] flex items-center gap-2 border-b border-[var(--rule)] pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]"></span>
              {lang === "en" ? "Incident Variables & Exposure" : "Kesinti Değişkenleri & Maruziyet"}
            </h2>

            {/* Duration Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <label htmlFor="duration-slider" className="text-[var(--ink)] font-medium">{t.labels.durationHours}</label>
                <span className="text-[var(--accent)] font-bold">{durationHours} {lang === "en" ? (durationHours === 1 ? "Hour" : "Hours") : "Saat"}</span>
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
                className="w-full h-11 accent-[var(--accent)] cursor-pointer"
              />
            </div>

            {/* Peak Timing Multiplier */}
            <div>
              <label htmlFor="peak-multiplier-select" className="text-xs font-mono text-[var(--ink)] font-medium block mb-2">
                {t.labels.peakMultiplier}
              </label>
              <select
                id="peak-multiplier-select"
                value={peakMultiplier}
                onChange={(e) => setPeakMultiplier(Number(e.target.value))}
                aria-label={t.labels.peakMultiplier}
                className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-lg p-2.5 text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] font-mono"
              >
                <option value={2.0}>{t.labels.peakOptions.peak}</option>
                <option value={1.0}>{t.labels.peakOptions.normal}</option>
                <option value={0.5}>{t.labels.peakOptions.night}</option>
              </select>
            </div>

            {/* Revenue & Ad Spend Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label htmlFor="monthly-rev-input" className="block text-[var(--ink-2)] mb-1">{t.labels.monthlyRevenue}</label>
                <input
                  id="monthly-rev-input"
                  type="number"
                  aria-label={t.labels.monthlyRevenue}
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label htmlFor="daily-ad-input" className="block text-[var(--ink-2)] mb-1">{t.labels.dailyAdSpend}</label>
                <input
                  id="daily-ad-input"
                  type="number"
                  aria-label={t.labels.dailyAdSpend}
                  value={dailyAdSpend}
                  onChange={(e) => setDailyAdSpend(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>

            {/* SLA Penalty & Churn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label htmlFor="sla-penalty-input" className="block text-[var(--ink-2)] mb-1">{t.labels.slaPenaltyRate}</label>
                <input
                  id="sla-penalty-input"
                  type="number"
                  min="0"
                  max="100"
                  aria-label={t.labels.slaPenaltyRate}
                  value={slaPenaltyRate}
                  onChange={(e) => setSlaPenaltyRate(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label htmlFor="churn-risk-input" className="block text-[var(--ink-2)] mb-1">{t.labels.churnRiskRate}</label>
                <input
                  id="churn-risk-input"
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  aria-label={t.labels.churnRiskRate}
                  value={churnRiskRate}
                  onChange={(e) => setChurnRiskRate(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>

            {/* Engineering Team Drag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label htmlFor="eng-team-input" className="block text-[var(--ink-2)] mb-1">{t.labels.engTeamSize}</label>
                <input
                  id="eng-team-input"
                  type="number"
                  min="1"
                  max="50"
                  aria-label={t.labels.engTeamSize}
                  value={engTeamSize}
                  onChange={(e) => setEngTeamSize(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label htmlFor="eng-rate-input" className="block text-[var(--ink-2)] mb-1">{t.labels.engHourlyRate}</label>
                <input
                  id="eng-rate-input"
                  type="number"
                  aria-label={t.labels.engHourlyRate}
                  value={engHourlyRate}
                  onChange={(e) => setEngHourlyRate(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Real-time TCOD Output & Breakdown Column */}
        <div className="lg:col-span-6 space-y-5">
          {/* Main TCOD Banner */}
          <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <span className="text-xs font-mono uppercase text-[var(--accent)] tracking-wider block mb-2 font-semibold">
              {t.labels.totalTcod}
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[var(--ink)] font-mono tracking-tight mb-3">
              {formatCurrency(metrics.totalTcod)}
            </div>

            {/* Hidden Cost Alert */}
            <div className="p-3.5 rounded-xl bg-[var(--accent-wash)] border border-[var(--accent)]/30 text-xs font-mono text-[var(--accent)]">
              <strong>{t.labels.hiddenCostWarning}</strong>{" "}
              <span className="font-bold underline">{lang === "en" ? `${metrics.hiddenMultiplier}x` : String(metrics.hiddenMultiplier).replace('.', ',')}</span>{" "}
              {lang === "en" ? "of direct sales losses." : "katına ulaşıyor!"}
            </div>

            {/* Breakdown Cards */}
            <div className="mt-6 space-y-2.5 border-t border-[var(--rule)] pt-6 text-xs font-mono">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)]">
                <span className="text-[var(--ink-2)]">1. {t.dimensions[0].title}</span>
                <span className="font-bold text-[var(--ink)]">{formatCurrency(metrics.directRevenueLoss)}</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)]">
                <span className="text-[var(--ink-2)]">2. {t.dimensions[1].title}</span>
                <span className="font-bold text-[var(--tint-warn-ink)]">{formatCurrency(metrics.wastedAdSpend)}</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)]">
                <span className="text-[var(--ink-2)]">3. {t.dimensions[2].title}</span>
                <span className="font-bold text-[var(--tint-danger-ink)]">{formatCurrency(metrics.slaPenalty)}</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)]">
                <span className="text-[var(--ink-2)]">4. {t.dimensions[3].title}</span>
                <span className="font-bold text-[var(--tint-info-ink)]">{formatCurrency(metrics.churnLoss)}</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)]">
                <span className="text-[var(--ink-2)]">5. {t.dimensions[4].title}</span>
                <span className="font-bold text-[var(--tint-info-ink)]">{formatCurrency(metrics.engDrag)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-2.5 border-t border-[var(--rule)] pt-6">
              <button
                onClick={copyBrief}
                className="btn-secondary min-h-[44px] w-full text-xs font-mono font-medium flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? t.labels.copied : t.labels.copyBrief}
              </button>

              <a
                href={getCalendlyUrl(lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary min-h-[44px] w-full text-xs font-mono font-semibold flex items-center justify-center gap-2 text-center"
              >
                {t.labels.triageCta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
