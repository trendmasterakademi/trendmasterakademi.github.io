import React, { useState, useMemo, useEffect } from "react";
import { techStackData } from "../data/techStackData";
import { getCalendlyUrl } from "../utils/calendly";
import { ShieldCheck } from "lucide-react";
import { setPageSeo } from "../utils/pageTitle";

export default function TechMatrix({ lang = "tr" }) {
  const t = techStackData[lang] || techStackData.tr;

  useEffect(() => {
    setPageSeo(lang === 'tr' ? '/teknoloji-uyumluluk/' : '/tech-matrix/', lang);
  }, [lang]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTechIds, setSelectedTechIds] = useState(["nodejs", "postgresql", "docker_k8s"]);
  const [copied, setCopied] = useState(false);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") return t.items;
    return t.items.filter((item) => item.category === selectedCategory);
  }, [t.items, selectedCategory]);

  const selectedItems = useMemo(() => {
    return t.items.filter((item) => selectedTechIds.includes(item.id));
  }, [t.items, selectedTechIds]);

  const toggleTech = (id) => {
    setSelectedTechIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    const idsToAdd = filteredItems.map((i) => i.id);
    setSelectedTechIds((prev) => Array.from(new Set([...prev, ...idsToAdd])));
  };

  const clearAll = () => {
    setSelectedTechIds([]);
  };

  const copyStackBrief = () => {
    if (selectedItems.length === 0) return;
    const names = selectedItems.map((i) => i.name).join(", ");
    const readiness = selectedItems.some((i) => i.supportLevel.includes("SEV-0"))
      ? "SEV-0 (≤ 15 Dk / Mins)"
      : "SEV-1 (≤ 30 Dk / Mins)";
    
    const combinedRisks = selectedItems
      .flatMap((i) => i.commonIncidents)
      .slice(0, 6)
      .map((r) => `  - ${r}`)
      .join("\n");

    const brief = `[TMA MÜHENDİSLİK STACK BRİFİNGİ / ARCHITECTURE BRIEF]
--------------------------------------------------
Seçilen Teknolojiler: ${names}
Müdahale Hazırbulunuşluğu: ${readiness}
Kurtarma & SWAT Kapsamı: %98+ Tam Cerrahi

Tespit Edilen Olası Mimari Risk Noktaları:
${combinedRisks}

TMA Mühendislik Masası: info@trendmasterakademi.com | +90 534 371 35 73
Doğrudan Triyaj: https://trendmasterakademi.com/${lang === "en" ? "triage" : "triyaj"}/
--------------------------------------------------`;

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
        <p className="text-xs text-[var(--ink-3)] font-mono flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>{t.hero.notice}</span>
        </p>
      </div>

      {/* Category Tabs & Filter Actions */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--rule)] pb-4">
        <div className="flex flex-wrap gap-2">
          {t.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 min-h-[44px] rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-sm"
                  : "bg-[var(--surface)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--paper)] border border-[var(--rule)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <button
            onClick={selectAllFiltered}
            className="text-[var(--ink-2)] hover:text-[var(--accent)] transition cursor-pointer min-h-[44px] flex items-center"
          >
            {lang === "en" ? "+ Select All in View" : "+ Görünenleri Seç"}
          </button>
          <span className="text-[var(--rule)]" aria-hidden="true">|</span>
          <button
            onClick={clearAll}
            className="text-[var(--ink-2)] hover:text-[var(--tint-danger-ink)] transition cursor-pointer min-h-[44px] flex items-center"
          >
            {lang === "en" ? "Clear" : "Temizle"} ({selectedTechIds.length})
          </button>
        </div>
      </div>

      {/* Main Grid: Tech Cards + Sticky Evaluation Drawer */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tech Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((tech, idx) => {
              const isSelected = selectedTechIds.includes(tech.id);
              const isLastOdd = idx === filteredItems.length - 1 && filteredItems.length % 2 === 1;
              return (
                <div
                  key={tech.id}
                  onClick={() => toggleTech(tech.id)}
                  className={`cursor-pointer rounded-xl p-5 border transition-all relative ${
                    isLastOdd ? "md:col-span-2" : ""
                  } ${
                    isSelected
                      ? "bg-[var(--surface)] border-[var(--accent)] shadow-sm"
                      : "bg-[var(--surface)] border-[var(--rule)] hover:border-[var(--ink-3)]"
                  }`}
                >
                  {/* Selection Indicator */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-base font-semibold text-[var(--ink)] tracking-tight flex items-center gap-2">
                        {tech.name}
                      </h3>
                      <span className="text-xs font-mono text-[var(--ink-3)]">
                        {tech.versionRange}
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-[var(--accent)] text-[var(--on-accent)]"
                          : "border border-[var(--rule)] text-transparent"
                      }`}
                    >
                      ✓
                    </div>
                  </div>

                  {/* Readiness & Support Level */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-[var(--tint-ok-bg)] text-[var(--tint-ok-ink)] border border-[var(--tint-ok-rule)]">
                      {tech.readiness}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-[var(--paper)] text-[var(--ink)] border border-[var(--rule)]">
                      {tech.supportLevel}
                    </span>
                  </div>

                  {/* Common Incidents */}
                  <div className="space-y-1 mb-3">
                    <span className="text-xs font-mono font-semibold text-[var(--ink-3)] uppercase tracking-wider block">
                      {lang === "en" ? "Common Outage Vectors:" : "Tipik Kritik Arıza Noktaları:"}
                    </span>
                    <ul className="text-xs text-[var(--ink-2)] space-y-1 list-disc list-inside">
                      {tech.commonIncidents.slice(0, 2).map((inc, idx) => (
                        <li key={idx} className="truncate">
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Rescue Capability Preview */}
                  <div className="border-t border-[var(--rule)] pt-2 text-xs text-[var(--ink-2)]">
                    <span className="text-[var(--accent)] font-mono font-semibold">TMA SWAT: </span>
                    <span className="line-clamp-2">{tech.rescueCapability}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Stack Evaluation Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-[80px] max-h-[calc(100dvh-96px)] overflow-y-auto bg-[var(--surface)] border border-[var(--rule)] rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-serif font-semibold text-[var(--ink)] mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]"></span>
              {t.summaryBox.title}
            </h2>

            {selectedItems.length === 0 ? (
              <p className="text-xs text-[var(--ink-3)] leading-relaxed font-mono py-6">
                {t.summaryBox.emptyNotice}
              </p>
            ) : (
              <div className="space-y-6">
                {/* Score & TTR */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-[var(--paper)] p-3 rounded-xl border border-[var(--rule)]">
                    <span className="text-xs font-mono text-[var(--ink-3)] uppercase block mb-1">
                      {t.summaryBox.rescueScore}
                    </span>
                    <span className="text-xl font-bold text-[var(--accent)] font-mono">
                      %99.2
                    </span>
                    <span className="text-xs text-[var(--ink-3)] block font-mono">
                      {lang === "en" ? "Full Surgical SWAT" : "Tam Cerrahi Kapsam"}
                    </span>
                  </div>

                  <div className="bg-[var(--paper)] p-3 rounded-xl border border-[var(--rule)]">
                    <span className="text-xs font-mono text-[var(--ink-3)] uppercase block mb-1">
                      {t.summaryBox.estimatedTtr}
                    </span>
                    <span className="text-xl font-bold text-[var(--ink)] font-mono">
                      ≤ 15 Dk
                    </span>
                    <span className="text-xs text-[var(--ink-3)] block font-mono">
                      {lang === "en" ? "SEV-0/1 Hot Desk" : "Kriz Masası Masada"}
                    </span>
                  </div>
                </div>

                {/* Primary Action CTA (Placed in first 480px) */}
                <div className="space-y-2 pt-1">
                  <a
                    href={getCalendlyUrl(lang)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary min-h-[44px] w-full text-xs font-mono font-semibold flex items-center justify-center gap-2 text-center"
                  >
                    {t.summaryBox.actionCta}
                  </a>

                  <button
                    onClick={copyStackBrief}
                    className="btn-secondary min-h-[44px] w-full text-xs font-mono font-medium flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {copied ? t.summaryBox.copiedNotice : (lang === "en" ? "Copy Stack Briefing" : "Mimari Brifingini Kopyala")}
                  </button>

                  <p className="text-xs text-[var(--ink-3)] font-mono text-center pt-1">
                    {lang === "en"
                      ? "Direct senior desk • NDA protected • No sales reps"
                      : "Doğrudan kıdemli mühendis masası • NDA korumalı • Aracı yok"}
                  </p>
                </div>

                {/* Selected Badges */}
                <div className="border-t border-[var(--rule)] pt-4">
                  <span className="text-xs font-mono text-[var(--ink-3)] uppercase tracking-wider block mb-2">
                    {lang === "en" ? "Selected Components:" : "Seçili Bileşenler:"} ({selectedItems.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                    {selectedItems.map((item) => (
                      <span
                        key={item.id}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--paper)] text-xs font-mono text-[var(--ink)] border border-[var(--rule)]"
                      >
                        {item.name.split(" ")[0]}
                        <button
                          onClick={() => toggleTech(item.id)}
                          className="text-[var(--ink-3)] hover:text-[var(--tint-danger-ink)] ml-1 cursor-pointer relative after:absolute after:inset-[-14px_-18px] after:content-['']"
                          aria-label={lang === "en" ? `Remove ${item.name}` : `${item.name} seçimini kaldır`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Combined Outage Risks */}
                <div className="border-t border-[var(--rule)] pt-4">
                  <span className="text-xs font-mono text-[var(--tint-warn-ink)] uppercase tracking-wider block mb-2">
                    {t.summaryBox.keyRisks}:
                  </span>
                  <ul className="text-xs text-[var(--ink-2)] space-y-2 list-disc list-inside bg-[var(--paper)] p-3 rounded-xl border border-[var(--rule)]">
                    {selectedItems
                      .flatMap((item) => item.commonIncidents)
                      .slice(0, 4)
                      .map((incident, idx) => (
                        <li key={idx} className="leading-snug">
                          {incident}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
