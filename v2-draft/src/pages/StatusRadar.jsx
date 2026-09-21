import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { radarData } from "../data/radarData";
import { getCalendlyUrl } from "../utils/calendly";
import { setPageSeo } from "../utils/pageTitle";

export default function StatusRadar({ lang = "tr" }) {
  const t = radarData[lang] || radarData.tr;
  const isTr = lang === "tr";

  useEffect(() => {
    setPageSeo('/radar/', lang);
  }, [lang]);

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[var(--accent)] selection:text-[var(--on-accent)]">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink-muted)] text-xs font-mono font-medium uppercase tracking-widest mb-4">
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
          {t.hero.notice}
        </p>
      </div>

      {/* Main Status Beacon Card */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="bg-[var(--surface)] border border-emerald-300 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-xs font-mono text-emerald-800 uppercase tracking-widest block font-bold">
                  {t.systemStatus.label}
                </span>
                <span className="text-sm text-[var(--ink-light)] font-mono">
                  {t.systemStatus.onDutyArchitect} • {t.systemStatus.dutyHours}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-[var(--rule)] pt-4 sm:pt-0 sm:pl-6 text-xs font-mono">
              <div>
                <span className="text-[var(--ink-muted)] block uppercase">{isTr ? "Ortalama MTTA (90 Gün)" : "Average MTTA (90 Days)"}</span>
                <span className="text-lg font-bold text-emerald-700">{t.systemStatus.currentMtta}</span>
              </div>
              <div>
                <span className="text-[var(--ink-muted)] block uppercase">{isTr ? "Taahhüt Edilen (SEV-0)" : "Commitment (SEV-0)"}</span>
                <span className="text-lg font-bold text-[var(--ink)]">{t.systemStatus.targetMtta}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Components Health Grid */}
      <div className="max-w-5xl mx-auto mb-12 space-y-4">
        <h2 className="text-xs font-mono text-[var(--ink-muted)] uppercase tracking-wider">
          {isTr 
            ? "Mühendislik Masaları & Altyapı · Nöbet saatlerinde erişilebilirlik (09:00–24:00)" 
            : "Service Desks & Infrastructure · Availability during duty hours (09:00–24:00)"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {t.components.map((comp, idx) => (
            <div
              key={comp.id}
              className={`bg-[var(--surface)] border border-[var(--rule)] rounded-xl p-5 space-y-3 hover:border-[var(--ink-muted)] transition shadow-sm lg:col-span-2 ${
                idx === 3 ? "lg:col-start-2" : ""
              } ${idx === 4 ? "md:col-span-2 lg:col-span-2" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span className="text-xs font-mono text-emerald-800 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                  {comp.uptime}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--ink)] tracking-tight">{comp.name}</h3>
                <p className="text-xs text-[var(--ink-light)] mt-1 leading-relaxed">{comp.desc}</p>
              </div>
              <div className="border-t border-[var(--rule)] pt-2 flex justify-between text-xs font-mono text-[var(--ink-muted)]">
                <span>{comp.latencyLabel || (isTr ? "Yanıt" : "Response")}:</span>
                <span className="text-[var(--ink)] font-semibold">{comp.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 90-Day Telemetry & Incident Radar Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
        {/* Telemetry Metrics */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-xs font-mono text-[var(--ink-muted)] uppercase tracking-wider">
            {t.telemetry90Days.title}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {t.telemetry90Days.metrics.map((m, idx) => (
              <div
                key={idx}
                className={`bg-[var(--surface)] border border-[var(--rule)] rounded-xl p-4 space-y-1 shadow-sm ${
                  idx === 0 ? "col-span-2" : "col-span-1"
                }`}
              >
                <span className="text-xs font-mono text-[var(--ink-muted)] block uppercase">
                  {m.label}
                </span>
                <span className="text-2xl font-bold font-mono text-[var(--ink)] block">
                  {m.value}
                </span>
                <span className="text-xs font-mono text-emerald-700 block">
                  {m.sub}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Distribution Radar */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-xs font-mono text-[var(--ink-muted)] uppercase tracking-wider">
            {t.incidentDistribution.title}
          </h2>
          <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-xl p-5 space-y-4 shadow-sm">
            {t.incidentDistribution.categories.map((cat, idx) => (
              <div key={idx} className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between items-center text-[var(--ink)]">
                  <span>{cat.label}</span>
                  <span className="font-semibold text-[var(--ink)]">%{cat.percentage} ({cat.count} {isTr ? "vaka" : "cases"})</span>
                </div>
                <div className="w-full bg-[var(--paper)] h-2 rounded-full overflow-hidden border border-[var(--rule)]">
                  <div
                    className={`h-full ${cat.color} transition-all duration-500`}
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Source Note with SLA link */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <span>{t.telemetry90Days.sourceNote}</span>
          <Link
            to="/sla/"
            className="text-[var(--accent)] font-semibold hover:underline font-mono inline-flex items-center gap-1 shrink-0"
          >
            {t.telemetry90Days.slaLinkText}
          </Link>
        </div>
      </div>

      {/* Emergency Action Banner */}
      <div className="max-w-5xl mx-auto text-center border-t border-[var(--rule)] pt-10">
        <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="tel:+905343713573"
            className="btn-secondary min-h-[44px] w-full sm:w-auto px-6 py-3 font-mono font-semibold text-xs flex items-center justify-center gap-2 whitespace-normal"
          >
            {isTr ? "Doğrudan Kriz Hattı: +90 534 371 35 73" : "Emergency Hotline: +90 534 371 35 73"}
          </a>

          <a
            href={getCalendlyUrl(lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary min-h-[44px] w-full sm:w-auto px-6 py-3 font-mono font-semibold text-xs flex items-center justify-center gap-2 text-center whitespace-normal"
          >
            {isTr ? "Kıdemli Triyaj Masasına Bağlan" : "Schedule Direct Triage Desk"}
          </a>
        </div>
        <p className="text-xs text-[var(--ink-muted)] font-mono mt-3">
          {isTr
            ? "SEV-0/1 krizlerinde satış temsilcisi olmadan doğrudan sistem mimarı masaya bağlanır"
            : "SEV-0/1 incidents are escalated instantly • Zero sales middleman"}
        </p>
      </div>
    </div>
  );
}
