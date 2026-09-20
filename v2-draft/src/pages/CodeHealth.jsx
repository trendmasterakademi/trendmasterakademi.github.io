import React, { useState, useMemo } from "react";
import { codeHealthData } from "../data/codeHealthData";
import { getCalendlyUrl } from "../utils/calendly";

export default function CodeHealth({ lang = "tr" }) {
  const t = codeHealthData[lang] || codeHealthData.tr;

  // Default initial checked items (simulate typical mid-level debt)
  const [checkedIds, setCheckedIds] = useState(["c1", "c3", "c8", "c11", "c14", "c16", "c18", "c19"]);
  const [copied, setCopied] = useState(false);

  const toggleItem = (id) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    const allIds = t.categories.flatMap((cat) => cat.items.map((i) => i.id));
    setCheckedIds(allIds);
  };

  const clearAll = () => {
    setCheckedIds([]);
  };

  // Score Calculation
  const score = useMemo(() => {
    return checkedIds.length * 5;
  }, [checkedIds]);

  const scoreTier = useMemo(() => {
    if (score < 40) return t.scoreLevels.critical;
    if (score < 70) return t.scoreLevels.warning;
    if (score < 85) return t.scoreLevels.good;
    return t.scoreLevels.excellent;
  }, [score, t.scoreLevels]);

  const tierColor = useMemo(() => {
    if (score < 40) return { text: "text-rose-400", bg: "bg-rose-950/60", border: "border-rose-500", badge: "bg-rose-500 text-black" };
    if (score < 70) return { text: "text-amber-400", bg: "bg-amber-950/60", border: "border-amber-500", badge: "bg-amber-500 text-black" };
    if (score < 85) return { text: "text-blue-400", bg: "bg-blue-950/60", border: "border-blue-500", badge: "bg-blue-500 text-black" };
    return { text: "text-emerald-400", bg: "bg-emerald-950/60", border: "border-emerald-500", badge: "bg-emerald-500 text-black" };
  }, [score]);

  // Top 3 Unchecked Risks
  const topUncheckedRisks = useMemo(() => {
    const allItems = t.categories.flatMap((cat) => cat.items);
    return allItems.filter((i) => !checkedIds.includes(i.id)).slice(0, 3);
  }, [t.categories, checkedIds]);

  const copyReport = () => {
    const brief = `[TMA KOD TABANI SAĞLIK & TEKNİK BORÇ RAPORU]
============================================================
Hesaplanan Skor: ${score} / 100 (${scoreTier.range})
Değerlendirme: ${scoreTier.title}

Özet Durum:
${scoreTier.desc}

Tespit Edilen En Acil Yangın Riskleri:
${topUncheckedRisks.map((r, idx) => `  ${idx + 1}. ${r.title}: ${r.risk}`).join("\n")}

Önerilen Eylem:
${scoreTier.action}

TMA Kod Devri & Audit Sandbox: info@trendmasterakademi.com | +90 534 371 35 73
Sözleşme & NDA Koruma: https://trendmasterakademi.com/gizlilik-sozlesmesi/
============================================================`;

    navigator.clipboard.writeText(brief).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-cyan-500/30">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-mono font-medium uppercase tracking-widest mb-4">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
          {t.hero.badge}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
          {t.hero.title}
        </h1>
        <p className="text-base sm:text-lg text-neutral-400 max-w-3xl mx-auto mb-4">
          {t.hero.subtitle}
        </p>
        <p className="text-xs text-neutral-500 font-mono">
          🔒 {t.hero.notice}
        </p>
      </div>

      {/* Audit Checklist + Sticky Score Sidebar */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Checklist Categories Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 text-xs font-mono">
            <span className="text-neutral-400 uppercase tracking-wider">
              {lang === "en" ? "20 Verification Checkpoints" : "20 Kritik Doğrulama Maddesi"}
            </span>
            <div className="flex gap-4">
              <button
                onClick={selectAll}
                className="text-neutral-400 hover:text-cyan-400 transition"
              >
                {t.labels.selectAll}
              </button>
              <button
                onClick={clearAll}
                className="text-neutral-400 hover:text-rose-400 transition"
              >
                {t.labels.clearAll} ({checkedIds.length}/20)
              </button>
            </div>
          </div>

          {t.categories.map((cat) => (
            <div key={cat.id} className="space-y-3">
              <div className="border-b border-neutral-800 pb-2">
                <h2 className="text-base font-bold text-white tracking-tight">{cat.title}</h2>
                <p className="text-xs text-neutral-400 mt-0.5">{cat.desc}</p>
              </div>

              <div className="space-y-2.5">
                {cat.items.map((item) => {
                  const isChecked = checkedIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`cursor-pointer rounded-xl p-4 border transition-all flex items-start gap-3.5 ${
                        isChecked
                          ? "bg-neutral-900/80 border-cyan-500/50 shadow-sm"
                          : "bg-neutral-900/30 border-neutral-800/70 hover:border-neutral-700 hover:bg-neutral-900/50"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                          isChecked
                            ? "bg-cyan-500 text-neutral-950"
                            : "border border-neutral-700 text-transparent"
                        }`}
                      >
                        ✓
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-white tracking-tight">
                            {item.title}
                          </h3>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                            +{item.weight} pts
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          {item.desc}
                        </p>
                        {!isChecked && (
                          <p className="text-[11px] font-mono text-rose-400/90 pt-1">
                            ⚠ Risk: {item.risk}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sticky Score Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-5">
            {/* Score Card */}
            <div className={`rounded-2xl p-6 border shadow-2xl backdrop-blur-md ${tierColor.bg} ${tierColor.border}`}>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                {t.labels.scoreTitle}
              </span>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-extrabold font-mono tracking-tight text-white">
                  {score}
                </span>
                <span className="text-lg font-mono text-neutral-400">/ 100</span>
              </div>

              {/* Tier Badge */}
              <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                <div className="inline-block px-2.5 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider bg-white/10 text-white">
                  {scoreTier.title}
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {scoreTier.desc}
                </p>
                <div className="p-3 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-neutral-300">
                  <strong className="text-cyan-300 block mb-1">Önerilen Eylem:</strong>
                  {scoreTier.action}
                </div>
              </div>
            </div>

            {/* Top Unchecked Risks */}
            {topUncheckedRisks.length > 0 && (
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-mono text-rose-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <span>🚨</span> {t.labels.topRisks}
                </h3>
                <ul className="space-y-2 text-xs font-mono text-neutral-300">
                  {topUncheckedRisks.map((r, idx) => (
                    <li key={r.id} className="p-2 rounded bg-neutral-950/70 border border-neutral-800/80">
                      <span className="font-bold text-white block mb-0.5">{idx + 1}. {r.title}</span>
                      <span className="text-neutral-400 text-[11px] leading-tight block">{r.risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={copyReport}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-mono font-medium text-white transition flex items-center justify-center gap-2"
              >
                📋 {copied ? t.labels.copiedNotice : t.labels.copyReport}
              </button>

              <a
                href={getCalendlyUrl(lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-mono font-bold text-white transition flex items-center justify-center gap-2 text-center shadow-lg shadow-cyan-950/50"
              >
                ⚡ {t.labels.triageCta}
              </a>

              <p className="text-[10px] text-neutral-500 font-mono text-center pt-1">
                {lang === "en"
                  ? "Direct senior audit • NDA protected • Zero-risk sandbox"
                  : "Kıdemli mühendis denetimi • NDA korumalı • İzole sandbox"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
