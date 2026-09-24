import React, { useState, useMemo, useEffect } from "react";
import { outageSimulatorData } from "../data/outageSimulatorData";
import { getCalendlyUrl } from "../utils/calendly";
import { setPageSeo } from "../utils/pageTitle";

// Kesinti ve itibar zararı hesabı. Kural (Adım 79–80): gizli çarpan yok; her kalemin formülü
// o anki değerlerle ekranda yazılı. Metinler: src/data/outageSimulatorData.js
export default function OutageSimulator({ lang = "tr" }) {
  const t = outageSimulatorData[lang] || outageSimulatorData.tr;
  const isEn = lang === "en";

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
  const [churnMonths, setChurnMonths] = useState(3);
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

  // Profil değerleri elle değişince rapor artık o profilin adını taşımaz.
  const edit = (setter) => (e) => { setSelectedPreset(null); setter(Math.max(0, Number(e.target.value))); };

  const metrics = useMemo(() => {
    const directRevenueLoss = Math.round((monthlyRevenue / 730) * durationHours * peakMultiplier);
    const wastedAdSpend = Math.round((dailyAdSpend / 24) * durationHours);
    const slaPenalty = Math.round(monthlyRevenue * (slaPenaltyRate / 100));
    const churnLoss = Math.round(monthlyRevenue * (churnRiskRate / 100) * churnMonths);
    const engDrag = Math.round(engTeamSize * engHourlyRate * durationHours);
    const indirect = wastedAdSpend + slaPenalty + churnLoss + engDrag;
    return { directRevenueLoss, wastedAdSpend, slaPenalty, churnLoss, engDrag, indirect, total: directRevenueLoss + indirect };
  }, [monthlyRevenue, durationHours, peakMultiplier, dailyAdSpend, slaPenaltyRate, churnRiskRate, churnMonths, engTeamSize, engHourlyRate]);

  const formatCurrency = (val) => new Intl.NumberFormat(isEn ? "en-US" : "tr-TR", {
    style: "currency", currency: "TRY", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0
  }).format(val);
  const num = (n) => Number(n).toLocaleString(isEn ? "en-US" : "tr-TR", { maximumFractionDigits: 2 });
  const pct = (n) => (isEn ? `${num(n)}%` : `%${num(n)}`);
  const hours = (n) => (isEn ? `${n} ${n === 1 ? "hour" : "hours"}` : `${n} saat`);
  const months = (n) => (isEn ? `${n} ${n === 1 ? "month" : "months"}` : `${n} ay`);
  const engineers = (n) => (isEn ? `${n} ${n === 1 ? "engineer" : "engineers"}` : `${n} mühendis`);
  const perHour = isEn ? "/ hour" : "/ saat";

  const items = [
    { key: "direct_revenue", amount: metrics.directRevenueLoss, calc: `(${formatCurrency(monthlyRevenue)} ÷ 730) × ${hours(durationHours)} × ${num(peakMultiplier)}` },
    { key: "wasted_ads", amount: metrics.wastedAdSpend, calc: `(${formatCurrency(dailyAdSpend)} ÷ 24) × ${hours(durationHours)}` },
    { key: "sla_penalty", amount: metrics.slaPenalty, calc: `${formatCurrency(monthlyRevenue)} × ${pct(slaPenaltyRate)}` },
    { key: "churn_ltv", amount: metrics.churnLoss, calc: `${formatCurrency(monthlyRevenue)} × ${pct(churnRiskRate)} × ${months(churnMonths)}` },
    { key: "eng_drag", amount: metrics.engDrag, calc: `${engineers(engTeamSize)} × ${formatCurrency(engHourlyRate)} ${perHour} × ${hours(durationHours)}` }
  ].map((it) => ({ ...it, dim: t.dimensions.find((d) => d.id === it.key) }));

  const copyBrief = () => {
    const profile = t.presets.find((p) => p.id === selectedPreset)?.name;
    const lines = items.map((it, i) => `${i + 1}. ${it.dim.title}: ${formatCurrency(it.amount)}\n   ${it.calc}`).join("\n");
    const brief = isEn ? `[TMA OUTAGE COST REPORT]
============================================================
Profile: ${profile || "Custom profile"}
Outage duration: ${hours(durationHours)} (time multiplier: ${num(peakMultiplier)})

TOTAL ESTIMATED COST OF THE OUTAGE: ${formatCurrency(metrics.total)}
------------------------------------------------------------
${lines}

${t.labels.methodNote}

TMA Crisis Triage Desk: info@trendmasterakademi.com | +90 534 371 35 73
SLA & response commitments: https://trendmasterakademi.com/sla/
============================================================` : `[TMA KESİNTİ MALİYETİ RAPORU]
============================================================
Profil: ${profile || "Özel Profil"}
Kesinti süresi: ${hours(durationHours)} (zaman çarpanı: ${num(peakMultiplier)})

TOPLAM TAHMİNİ KESİNTİ MALİYETİ: ${formatCurrency(metrics.total)}
------------------------------------------------------------
${lines}

${t.labels.methodNote}

TMA Kriz Triyaj Masası: info@trendmasterakademi.com | +90 534 371 35 73
SLA & Müdahale Taahhütleri: https://trendmasterakademi.com/sla/
============================================================`;

    navigator.clipboard.writeText(brief).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const inputCls = "w-full bg-[var(--paper)] border border-[var(--rule)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]";

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
                {formatCurrency(preset.monthlyRevenue)} / {isEn ? "mo" : "ay"}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Inputs + Output */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-base font-serif font-semibold text-[var(--ink)] flex items-center gap-2 border-b border-[var(--rule)] pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]"></span>
              {t.labels.inputsTitle}
            </h2>

            {/* Duration Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <label htmlFor="duration-slider" className="text-[var(--ink)] font-medium">{t.labels.durationHours}</label>
                <span className="text-[var(--accent)] font-bold">{isEn ? `${durationHours} ${durationHours === 1 ? "Hour" : "Hours"}` : `${durationHours} Saat`}</span>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label htmlFor="monthly-rev-input" className="block text-[var(--ink-2)] mb-1">{t.labels.monthlyRevenue}</label>
                <input id="monthly-rev-input" type="number" aria-label={t.labels.monthlyRevenue} value={monthlyRevenue} onChange={edit(setMonthlyRevenue)} className={inputCls} />
              </div>
              <div>
                <label htmlFor="daily-ad-input" className="block text-[var(--ink-2)] mb-1">{t.labels.dailyAdSpend}</label>
                <input id="daily-ad-input" type="number" aria-label={t.labels.dailyAdSpend} value={dailyAdSpend} onChange={edit(setDailyAdSpend)} className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label htmlFor="sla-penalty-input" className="block text-[var(--ink-2)] mb-1">{t.labels.slaPenaltyRate}</label>
                <input id="sla-penalty-input" type="number" min="0" max="100" aria-label={t.labels.slaPenaltyRate} value={slaPenaltyRate} onChange={edit(setSlaPenaltyRate)} className={inputCls} />
              </div>
              <div>
                <label htmlFor="churn-risk-input" className="block text-[var(--ink-2)] mb-1">{t.labels.churnRiskRate}</label>
                <input id="churn-risk-input" type="number" step="0.5" min="0" max="100" aria-label={t.labels.churnRiskRate} value={churnRiskRate} onChange={edit(setChurnRiskRate)} className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label htmlFor="churn-months-input" className="block text-[var(--ink-2)] mb-1">{t.labels.churnMonths}</label>
                <input id="churn-months-input" type="number" min="0" max="24" aria-label={t.labels.churnMonths} value={churnMonths} onChange={(e) => setChurnMonths(Math.max(0, Number(e.target.value)))} className={inputCls} />
              </div>
              <div>
                <label htmlFor="eng-team-input" className="block text-[var(--ink-2)] mb-1">{t.labels.engTeamSize}</label>
                <input id="eng-team-input" type="number" min="0" max="50" aria-label={t.labels.engTeamSize} value={engTeamSize} onChange={edit(setEngTeamSize)} className={inputCls} />
              </div>
            </div>

            <div className="text-xs font-mono">
              <label htmlFor="eng-rate-input" className="block text-[var(--ink-2)] mb-1">{t.labels.engHourlyRate}</label>
              <input id="eng-rate-input" type="number" aria-label={t.labels.engHourlyRate} value={engHourlyRate} onChange={edit(setEngHourlyRate)} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <span className="text-xs font-mono uppercase text-[var(--accent)] tracking-wider block mb-2 font-semibold">
              {t.labels.totalTcod}
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[var(--ink)] font-mono tracking-tight mb-3">
              {formatCurrency(metrics.total)}
            </div>
            <p className="text-xs font-mono text-[var(--ink-2)]">
              {t.labels.indirectTotal}: <strong className="text-[var(--ink)]">{formatCurrency(metrics.indirect)}</strong>
            </p>

            {/* Breakdown with live formulas */}
            <div className="mt-6 space-y-2.5 border-t border-[var(--rule)] pt-6 text-xs font-mono">
              {items.map((it, i) => (
                <div key={it.key} className="p-2.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)] space-y-1">
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-[var(--ink-2)]">{i + 1}. {it.dim.title}</span>
                    <span className="font-bold text-[var(--ink)]">{formatCurrency(it.amount)}</span>
                  </div>
                  <div className="text-[var(--ink-3)] break-words">{it.calc}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              <span className="text-xs font-mono uppercase text-[var(--ink-3)] block">{t.labels.methodTitle}</span>
              <p className="text-xs text-[var(--ink-2)] leading-relaxed">{t.labels.methodNote}</p>
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
