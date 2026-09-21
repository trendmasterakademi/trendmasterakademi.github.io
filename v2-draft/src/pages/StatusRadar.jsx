import React from "react";
import { radarData } from "../data/radarData";
import { getCalendlyUrl } from "../utils/calendly";

export default function StatusRadar({ lang = "tr" }) {
  const t = radarData[lang] || radarData.tr;

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[var(--accent)] selection:text-white">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink-muted)] text-xs font-mono font-medium uppercase tracking-widest mb-4">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
          {t.hero.badge}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold tracking-tight text-[var(--ink)] mb-4">
          {t.hero.title}
        </h1>
        <p className="text-base sm:text-lg text-[var(--ink-light)] max-w-3xl mx-auto mb-4">
          {t.hero.subtitle}
        </p>
        <p className="text-xs text-[var(--ink-muted)] font-mono">
          📡 {t.hero.notice}
        </p>
      </div>

      {/* Main Status Beacon Card */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="bg-[var(--surface)] border border-emerald-300 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 rounded-full bg-emerald-600"></div>
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
                <span className="text-[var(--ink-muted)] block uppercase">{lang === "en" ? "Active SEV-0" : "Aktif SEV-0"}</span>
                <span className="text-lg font-bold text-[var(--ink)]">{t.systemStatus.activeSev0} {lang === "en" ? "Queued" : "Bekleyen"}</span>
              </div>
              <div>
                <span className="text-[var(--ink-muted)] block uppercase">{lang === "en" ? "Live MTTA" : "Canlı MTTA"}</span>
                <span className="text-lg font-bold text-emerald-700">{t.systemStatus.currentMtta}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Components Health Grid */}
      <div className="max-w-5xl mx-auto mb-12 space-y-4">
        <h2 className="text-xs font-mono text-[var(--ink-muted)] uppercase tracking-wider">
          {lang === "en" ? "Operational Service Desks & Infrastructure" : "Operasyonel Mühendislik Masaları & Altyapı"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.components.map((comp) => (
            <div
              key={comp.id}
              className="bg-[var(--surface)] border border-[var(--rule)] rounded-xl p-5 space-y-3 hover:border-[var(--ink-muted)] transition shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span className="text-xs font-mono text-emerald-800 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                  {comp.uptime} {lang === "en" ? "Uptime" : "Aktiflik"}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--ink)] tracking-tight">{comp.name}</h3>
                <p className="text-xs text-[var(--ink-light)] mt-1 leading-relaxed">{comp.desc}</p>
              </div>
              <div className="border-t border-[var(--rule)] pt-2 flex justify-between text-xs font-mono text-[var(--ink-muted)]">
                <span>{lang === "en" ? "Response: " : "Yanıt: "}</span>
                <span className="text-[var(--ink)]">{comp.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 90-Day Telemetry & Incident Radar Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Telemetry Metrics */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-xs font-mono text-[var(--ink-muted)] uppercase tracking-wider">
            {t.telemetry90Days.title}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {t.telemetry90Days.metrics.map((m, idx) => (
              <div
                key={idx}
                className="bg-[var(--surface)] border border-[var(--rule)] rounded-xl p-4 space-y-1 shadow-sm"
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
                  <span className="font-semibold text-[var(--ink)]">%{cat.percentage} ({cat.count} {lang === "en" ? "cases" : "vaka"})</span>
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

      {/* Emergency Action Banner */}
      <div className="max-w-5xl mx-auto text-center border-t border-[var(--rule)] pt-10">
        <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="tel:+905343713573"
            className="btn-secondary min-h-[44px] w-full sm:w-auto px-6 py-3 font-mono font-semibold text-xs flex items-center justify-center gap-2"
          >
            📞 {lang === "en" ? "Emergency Hotline: +90 534 371 35 73" : "Doğrudan Kriz Hattı: +90 534 371 35 73"}
          </a>

          <a
            href={getCalendlyUrl(lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary min-h-[44px] w-full sm:w-auto px-6 py-3 font-mono font-semibold text-xs flex items-center justify-center gap-2 text-center"
          >
            ⚡ {lang === "en" ? "Schedule Direct Triage Desk" : "Kıdemli Triyaj Masasına Bağlan"}
          </a>
        </div>
        <p className="text-xs text-[var(--ink-muted)] font-mono mt-3">
          {lang === "en"
            ? "SEV-0/1 incidents are escalated instantly • Zero sales middleman"
            : "SEV-0/1 krizlerinde satış temsilcisi olmadan doğrudan sistem mimarı masaya bağlanır"}
        </p>
      </div>
    </div>
  );
}
