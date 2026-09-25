import React, { useState, useMemo, useEffect } from "react";
import { codeHealthData } from "../data/codeHealthData";
import { getCalendlyUrl } from "../utils/calendly";
import { setPageSeo } from "../utils/pageTitle";

export default function CodeHealth({ lang = "tr" }) {
  const t = codeHealthData[lang] || codeHealthData.tr;

  useEffect(() => {
    setPageSeo(lang === 'tr' ? '/kod-sagligi/' : '/codebase-health/', lang);
  }, [lang]);

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
    if (score < 40) return { text: "text-[var(--tint-danger-ink)]", bg: "bg-[var(--tint-danger-bg)]", border: "border-[var(--tint-danger-rule)]" };
    if (score < 70) return { text: "text-[var(--tint-warn-ink)]", bg: "bg-[var(--tint-warn-bg)]", border: "border-[var(--tint-warn-rule)]" };
    if (score < 85) return { text: "text-[var(--tint-info-ink)]", bg: "bg-[var(--tint-info-bg)]", border: "border-[var(--tint-info-rule)]" };
    return { text: "text-[var(--tint-ok-ink)]", bg: "bg-[var(--tint-ok-bg)]", border: "border-[var(--tint-ok-rule)]" };
  }, [score]);

  // Top 3 Unchecked Risks
  const topUncheckedRisks = useMemo(() => {
    const allItems = t.categories.flatMap((cat) => cat.items);
    return allItems.filter((i) => !checkedIds.includes(i.id)).slice(0, 3);
  }, [t.categories, checkedIds]);

  const copyReport = () => {
    const isTr = lang === 'tr';
    const brief = isTr ? `[TMA KOD TABANI SAĞLIK & TEKNİK BORÇ RAPORU]
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
Sözleşme & NDA Koruma: https://trendmasterakademi.com/nda/
============================================================` : `[TMA CODEBASE HEALTH & TECHNICAL DEBT REPORT]
============================================================
Calculated Score: ${score} / 100 (${scoreTier.range})
Assessment: ${scoreTier.title}

Summary:
${scoreTier.desc}

Top Critical Fire Risks:
${topUncheckedRisks.map((r, idx) => `  ${idx + 1}. ${r.title}: ${r.risk}`).join("\n")}

Recommended Action:
${scoreTier.action}

TMA Code Handover & Audit Sandbox: info@trendmasterakademi.com | +90 534 371 35 73
Agreement & NDA Protection: https://trendmasterakademi.com/nda/
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink-3)] text-xs font-mono font-medium uppercase tracking-widest mb-4">
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

      {/* Audit Checklist + Sticky Score Sidebar */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Checklist Categories Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between border-b border-[var(--rule)] pb-3 text-xs font-mono">
            <span className="text-[var(--ink-3)] uppercase tracking-wider">
              {lang === "en" ? "20 Verification Checkpoints" : "20 Kritik Doğrulama Maddesi"}
            </span>
            <div className="flex gap-4">
              <button
                onClick={selectAll}
                className="text-[var(--ink-2)] hover:text-[var(--accent)] transition cursor-pointer min-h-[44px] flex items-center"
              >
                {t.labels.selectAll}
              </button>
              <button
                onClick={clearAll}
                className="text-[var(--ink-2)] hover:text-[var(--accent)] transition cursor-pointer min-h-[44px] flex items-center"
              >
                {t.labels.clearAll} ({checkedIds.length}/20)
              </button>
            </div>
          </div>

          {t.categories.map((cat) => (
            <div key={cat.id} className="space-y-3">
              <div className="border-b border-[var(--rule)] pb-2">
                <h2 className="text-base font-serif font-semibold text-[var(--ink)] tracking-tight">{cat.title}</h2>
                <p className="text-xs text-[var(--ink-2)] mt-0.5">{cat.desc}</p>
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
                          ? "bg-[var(--surface)] border-[var(--accent)] shadow-sm"
                          : "bg-[var(--surface)] border-[var(--rule)] hover:border-[var(--ink-3)]"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                          isChecked
                            ? "bg-[var(--accent)] text-[var(--on-accent)]"
                            : "border border-[var(--rule)] text-transparent"
                        }`}
                      >
                        ✓
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold text-[var(--ink)] tracking-tight">
                            {item.title}
                          </h3>
                          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink-3)]">
                            +{item.weight} {lang === 'en' ? 'pts' : 'puan'}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                          {item.desc}
                        </p>
                        {!isChecked && (
                          <p className="text-xs font-mono text-[var(--sev-critical)] pt-1">
                            Risk: {item.risk}
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
          <div className="sticky top-[80px] max-h-[calc(100dvh-96px)] overflow-y-auto space-y-4 pr-1">
            {/* Score Card */}
            <div className={`rounded-2xl p-6 border shadow-sm ${tierColor.bg} ${tierColor.border}`}>
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--ink-3)] block mb-1">
                {t.labels.scoreTitle}
              </span>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold font-mono tracking-tight text-[var(--ink)]">
                  {score}
                </span>
                <span className="text-lg font-mono text-[var(--ink-3)]">/ 100</span>
              </div>

              {/* Tier Badge */}
              <div className="mt-3 pt-3 border-t border-[var(--rule)] space-y-2">
                <div className="inline-block px-2.5 py-1 rounded text-xs font-mono font-semibold uppercase tracking-wider bg-[var(--surface)] text-[var(--ink)] border border-[var(--rule)]">
                  {scoreTier.title}
                </div>
                <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                  {scoreTier.desc}
                </p>
                <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--rule)] text-xs font-mono text-[var(--ink)]">
                  <strong className="text-[var(--accent)] block mb-1">{lang === 'en' ? 'Recommended Action:' : 'Önerilen Eylem:'}</strong>
                  {scoreTier.action}
                </div>
              </div>
            </div>

            {/* Actions (In first 480px) */}
            <div className="space-y-2">
              <a
                href={getCalendlyUrl(lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full min-h-[44px] text-xs font-mono font-semibold flex items-center justify-center gap-2 text-center"
              >
                {t.labels.triageCta}
              </a>

              <button
                onClick={copyReport}
                className="btn-secondary w-full min-h-[44px] text-xs font-mono font-medium flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? t.labels.copiedNotice : t.labels.copyReport}
              </button>

              <p className="text-xs text-[var(--ink-3)] font-mono text-center pt-1">
                {lang === "en"
                  ? "Direct senior audit • NDA protected • Zero-risk sandbox"
                  : "Kıdemli mühendis denetimi • NDA korumalı • İzole sandbox"}
              </p>
            </div>

            {/* Top Unchecked Risks */}
            {topUncheckedRisks.length > 0 && (
              <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-mono text-[var(--sev-critical)] uppercase tracking-wider font-semibold">
                  {t.labels.topRisks}
                </h3>
                <ul className="space-y-2 text-xs font-mono text-[var(--ink)]">
                  {topUncheckedRisks.map((r, idx) => (
                    <li key={r.id} className="p-2.5 rounded bg-[var(--paper)] border border-[var(--rule)]">
                      <span className="font-semibold text-[var(--ink)] block mb-0.5">{idx + 1}. {r.title}</span>
                      <span className="text-[var(--ink-2)] text-xs leading-tight block">{r.risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
