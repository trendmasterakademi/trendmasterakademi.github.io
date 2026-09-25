import React, { useState, useMemo, useEffect } from "react";
import { rescueRoiData } from "../data/rescueRoiData";
import { getCalendlyUrl } from "../utils/calendly";
import { setPageSeo } from "../utils/pageTitle";

// Kurtarma mı, sıfırdan yazım mı? — yalnız kullanıcının girdiği değerlerle sıfırdan yazımın maaş maliyeti.
// TMA fiyatı, oran, getiri ya da süre vaadi yok (Adım 79). Metinler: src/data/rescueRoiData.js
// Profil değerleri elle değişince seçili profil düşer; rapor 'Özel Proje' yazar (Adım 80).
export default function RescueRoi({ lang = "tr" }) {
  const t = rescueRoiData[lang] || rescueRoiData.tr;
  const isEn = lang === "en";

  useEffect(() => {
    setPageSeo(lang === 'tr' ? '/kurtarma-maliyeti/' : '/rescue-roi/', lang);
  }, [lang]);

  const [selectedPreset, setSelectedPreset] = useState("saas");
  const [teamSize, setTeamSize] = useState(3);
  const [monthlyRatePerDev, setMonthlyRatePerDev] = useState(90000);
  const [rebuildMonths, setRebuildMonths] = useState(5);
  const [recruitingMonths, setRecruitingMonths] = useState(2);
  const [copied, setCopied] = useState(false);

  const applyPreset = (presetId) => {
    const p = t.presets.find((pr) => pr.id === presetId);
    if (!p) return;
    setSelectedPreset(presetId);
    setTeamSize(p.teamSize);
    setMonthlyRatePerDev(p.monthlyRatePerDev);
    setRebuildMonths(p.rebuildMonths);
    setRecruitingMonths(p.recruitingMonths);
  };

  const metrics = useMemo(() => {
    const totalMonths = rebuildMonths + recruitingMonths;
    const payrollCost = teamSize * monthlyRatePerDev * totalMonths;
    return { totalMonths, payrollCost };
  }, [teamSize, monthlyRatePerDev, rebuildMonths, recruitingMonths]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat(isEn ? "en-US" : "tr-TR", {
      style: "currency",
      currency: "TRY",
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0
    }).format(val);
  };

  const months = (n) => (isEn ? `${n} ${n === 1 ? "month" : "months"}` : `${n} ay`);
  const engineers = (n) => (isEn ? `${n} ${n === 1 ? "engineer" : "engineers"}` : `${n} mühendis`);
  const perMonth = isEn ? "/ month" : "/ ay";
  const teamText = `${engineers(teamSize)} × ${formatCurrency(monthlyRatePerDev)} ${perMonth}`;
  const durationText = isEn
    ? `${months(recruitingMonths)} recruiting + ${months(rebuildMonths)} rebuild = ${months(metrics.totalMonths)}`
    : `${months(recruitingMonths)} işe alım + ${months(rebuildMonths)} yazım = ${months(metrics.totalMonths)}`;

  const copyBrief = () => {
    const profile = t.presets.find((p) => p.id === selectedPreset)?.name;
    const brief = isEn ? `[TMA REBUILD COST REPORT]
============================================================
Profile: ${profile || "Custom project"}

Team: ${teamText}
Duration: ${durationText}
PAYROLL COST OF A REBUILD: ${formatCurrency(metrics.payrollCost)}

${t.labels.formula}
${t.labels.excluded}

Rescue: ${t.hero.notice}

TMA Engineering Desk: info@trendmasterakademi.com | +90 534 371 35 73
============================================================` : `[TMA SIFIRDAN YAZIM MALİYETİ RAPORU]
============================================================
Profil: ${profile || "Özel Proje"}

Ekip: ${teamText}
Süre: ${durationText}
SIFIRDAN YAZIMIN MAAŞ MALİYETİ: ${formatCurrency(metrics.payrollCost)}

${t.labels.formula}
${t.labels.excluded}

Kurtarma: ${t.hero.notice}

TMA Mühendislik Masası: info@trendmasterakademi.com | +90 534 371 35 73
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
          {t.labels.presetTitle}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {t.presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer min-h-[48px] ${
                selectedPreset === preset.id
                  ? "bg-[var(--accent-wash)] border-[var(--accent)] text-[var(--ink)] shadow-sm"
                  : "bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink-2)] hover:border-[var(--ink-3)] hover:text-[var(--ink)]"
              }`}
            >
              <span className="block text-sm font-bold font-mono tracking-tight">{preset.name}</span>
              <p className="text-xs text-[var(--ink-3)] mt-1 font-mono">
                {engineers(preset.teamSize)} · {isEn ? `${months(preset.rebuildMonths)} rebuild` : `${months(preset.rebuildMonths)} yazım`}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs + Rebuild Cost Output */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-base font-serif font-semibold text-[var(--ink)] flex items-center gap-2 border-b border-[var(--rule)] pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]"></span>
              {t.labels.inputsTitle}
            </h2>

            {/* Team Size Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <label htmlFor="team-size-slider" className="text-[var(--ink)] font-medium">{t.labels.teamSize}</label>
                <span className="text-[var(--accent)] font-bold">{engineers(teamSize)}</span>
              </div>
              <input
                id="team-size-slider"
                type="range"
                min="1"
                max="12"
                step="1"
                aria-label={t.labels.teamSize}
                value={teamSize}
                onChange={(e) => { setSelectedPreset(null); setTeamSize(Number(e.target.value)); }}
                className="w-full h-11 accent-[var(--accent)] cursor-pointer"
              />
            </div>

            {/* Rebuild Duration Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <label htmlFor="rebuild-months-slider" className="text-[var(--ink)] font-medium">{t.labels.rebuildMonths}</label>
                <span className="text-[var(--ink)] font-bold">{months(rebuildMonths)}</span>
              </div>
              <input
                id="rebuild-months-slider"
                type="range"
                min="2"
                max="18"
                step="1"
                aria-label={t.labels.rebuildMonths}
                value={rebuildMonths}
                onChange={(e) => { setSelectedPreset(null); setRebuildMonths(Number(e.target.value)); }}
                className="w-full h-11 accent-[var(--accent)] cursor-pointer"
              />
            </div>

            {/* Numerical Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label htmlFor="monthly-rate-input" className="block text-[var(--ink-2)] mb-1">{t.labels.monthlyRate}</label>
                <input
                  id="monthly-rate-input"
                  type="number"
                  aria-label={t.labels.monthlyRate}
                  value={monthlyRatePerDev}
                  onChange={(e) => { setSelectedPreset(null); setMonthlyRatePerDev(Math.max(0, Number(e.target.value))); }}
                  className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label htmlFor="recruiting-months-input" className="block text-[var(--ink-2)] mb-1">{t.labels.recruitingMonths}</label>
                <input
                  id="recruiting-months-input"
                  type="number"
                  min="0"
                  max="12"
                  aria-label={t.labels.recruitingMonths}
                  value={recruitingMonths}
                  onChange={(e) => { setSelectedPreset(null); setRecruitingMonths(Math.max(0, Number(e.target.value))); }}
                  className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Rebuild Cost Output Column */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <span className="text-xs font-mono uppercase text-[var(--accent)] tracking-wider block mb-2 font-semibold">
              {t.labels.resultTitle}
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[var(--ink)] font-mono tracking-tight mb-4">
              {formatCurrency(metrics.payrollCost)}
            </div>

            {/* Step-by-step breakdown */}
            <div className="space-y-3 border-t border-[var(--rule)] pt-5 text-xs font-mono">
              <div className="flex justify-between items-center gap-3 p-2.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)]">
                <span className="text-[var(--ink-2)]">{t.labels.teamLine}</span>
                <span className="font-semibold text-[var(--ink)] text-right">{teamText}</span>
              </div>
              <div className="flex justify-between items-center gap-3 p-2.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)]">
                <span className="text-[var(--ink-2)]">{t.labels.durationLine}</span>
                <span className="font-semibold text-[var(--ink)] text-right">{durationText}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <span className="text-xs font-mono uppercase text-[var(--ink-3)] block">{t.labels.formulaTitle}</span>
              <div className="p-3 rounded-lg bg-[var(--paper)] border border-[var(--rule)] font-mono text-[var(--ink)] text-xs overflow-x-auto">
                <code>{t.labels.formula}</code>
              </div>
              <p className="text-xs text-[var(--ink-2)] leading-relaxed">{t.labels.excluded}</p>
            </div>

            <p className="text-xs text-[var(--ink-3)] font-mono leading-relaxed mt-4 pt-3 border-t border-[var(--rule)]">
              {t.labels.sourceNote}
            </p>

            {/* Actions */}
            <div className="mt-6 space-y-2.5 border-t border-[var(--rule)] pt-6">
              <button
                onClick={copyBrief}
                className="btn-secondary min-h-[44px] w-full text-xs font-mono font-medium flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? t.labels.copiedNotice : t.labels.copyReport}
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

      {/* Rebuild risks vs how a rescue is priced */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-3">
          <h2 className="text-sm font-mono font-semibold text-[var(--tint-danger-ink)] uppercase tracking-wider">
            {t.labels.rebuildBreakdown}
          </h2>
          <ul className="text-xs text-[var(--ink-2)] space-y-2 list-disc list-inside font-sans">
            {t.rebuildItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-3">
          <h2 className="text-sm font-mono font-semibold text-[var(--ink)] uppercase tracking-wider">
            {t.labels.rescueBreakdown}
          </h2>
          <ul className="text-xs text-[var(--ink-2)] space-y-2 list-disc list-inside font-sans">
            {t.rescueItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
