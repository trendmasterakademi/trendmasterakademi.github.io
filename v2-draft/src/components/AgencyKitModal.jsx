import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { X, ShieldCheck, Zap, PhoneCall, ArrowRight, CheckCircle2, Layers, Terminal, AlertTriangle, FileText, ExternalLink } from 'lucide-react';
import { agencyKitData } from '../data/agencyKitData';
import { isTurkish } from '../i18n';

export default function AgencyKitModal({ isOpen, onClose }) {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const data = isTr ? agencyKitData.tr : agencyKitData.en;
  const [activeTab, setActiveTab] = useState('response-kit'); // 'response-kit' | 'crash-test'

  // Escape key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] overflow-y-auto p-2 sm:p-4 md:p-6 bg-black/60 flex justify-center items-start sm:items-center animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="TMA Agency Kit Viewer"
    >
      <div 
        className="relative w-full max-w-5xl my-auto max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3rem)] flex flex-col min-h-0 bg-[var(--surface)] border border-[var(--rule)] rounded-2xl shadow-2xl overflow-hidden text-[var(--ink)] font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--rule)] bg-[var(--paper)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]"></span>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--ink)]">
                TMA AGENCY KIT // 2026
              </span>
            </div>
            <span className="hidden sm:inline text-xs text-[var(--ink-muted)] font-mono">|</span>
            <span className="hidden sm:inline text-xs text-[var(--ink-secondary)] font-mono">
              {isTr ? 'Resmi Ajans Müdahale & Hazırlık Rehberi' : 'Official Agency Incident & Readiness Guide'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/kit/"
              onClick={onClose}
              className="px-2.5 py-1 rounded-lg bg-[var(--surface)] hover:bg-[var(--rule)] border border-[var(--rule)] text-[var(--ink)] font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{isTr ? 'Görsel Galeri Sayfası' : 'Visual Gallery'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[var(--accent)]" />
            </Link>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--rule)] transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[var(--rule)] bg-[var(--paper)] px-4 sm:px-6 gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('response-kit')}
            className={`py-3 px-4 text-xs sm:text-sm font-mono font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'response-kit'
                ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)]'
                : 'border-transparent text-[var(--ink-secondary)] hover:text-[var(--ink)]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
            <span>01. Agency Response Kit (8 Kart)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('crash-test')}
            className={`py-3 px-4 text-xs sm:text-sm font-mono font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'crash-test'
                ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)]'
                : 'border-transparent text-[var(--ink-secondary)] hover:text-[var(--ink)]'
            }`}
          >
            <Zap className="w-4 h-4 text-[var(--accent)]" />
            <span>02. 60sn Agency Crash Test (Poster)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-[var(--paper)]">
          
          {/* TAB 1: AGENCY RESPONSE KIT (8 Cards) */}
          {activeTab === 'response-kit' && (
            <div className="space-y-8 animate-in fade-in duration-150">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[var(--accent)] bg-[var(--accent-wash)] px-3 py-1 rounded-[var(--r-control)] border border-[var(--accent)]/20">
                  {data.responseKit.badge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[var(--ink)] tracking-tight">
                  {data.responseKit.title}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--ink-secondary)]">
                  {data.responseKit.subtitle}
                </p>
              </div>

              {/* 8 Cards Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                
                {/* Slide 01: Kapak / Overview */}
                <div className="p-5 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-4 relative overflow-hidden group hover:border-[var(--rule-strong)] transition-all">
                  <div className="rounded-lg overflow-hidden border border-[var(--rule)] mb-1">
                    <img src="/agency-kit/response-kit-slide-1.png" alt="Slide 1: White-Label Engineering" className="w-full h-auto object-cover max-h-48" loading="lazy" />
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[var(--accent)] font-semibold">01 // {data.responseKit.slides[0].tag}</span>
                    <span className="px-2.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--rule)] text-[var(--sev-ok)] font-semibold text-xs">
                      {data.responseKit.slides[0].status}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-[var(--ink)] leading-snug">
                    {data.responseKit.slides[0].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
                    {data.responseKit.slides[0].desc}
                  </p>
                  <ul className="space-y-2 text-xs text-[var(--ink-secondary)] pt-1 font-mono">
                    {data.responseKit.slides[0].points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--sev-ok)] flex-shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Slide 02: Görünmeyen Ekip */}
                <div className="p-5 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-4 hover:border-[var(--rule-strong)] transition-all">
                  <div className="rounded-lg overflow-hidden border border-[var(--rule)] mb-1">
                    <img src="/agency-kit/response-kit-slide-2.png" alt="Slide 2: Invisible Tech Squad" className="w-full h-auto object-cover max-h-48" loading="lazy" />
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[var(--accent)] font-semibold">02 // {data.responseKit.slides[1].tag}</span>
                    <span className="text-[var(--ink-muted)]">CAPACITY</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-[var(--ink)] leading-snug">
                    {data.responseKit.slides[1].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--ink-secondary)]">
                    {data.responseKit.slides[1].desc}
                  </p>
                  <div className="space-y-2 pt-1">
                    {data.responseKit.slides[1].items.map((it, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)] flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[var(--accent)] font-semibold">{it.no}</span>
                          <span className="font-semibold text-[var(--ink)]">{it.title || it['CANLI SİSTEM HATASI']}</span>
                        </div>
                        <span className="text-xs text-[var(--ink-muted)] font-mono text-right">{it.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slide 03: White-Label Model */}
                <div className="p-5 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-4 hover:border-[var(--rule-strong)] transition-all">
                  <div className="rounded-lg overflow-hidden border border-[var(--rule)] mb-1">
                    <img src="/agency-kit/response-kit-slide-3.png" alt="Slide 3: White-Label Model" className="w-full h-auto object-cover max-h-48" loading="lazy" />
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[var(--accent)] font-semibold">03 // {data.responseKit.slides[2].tag}</span>
                    <span className="text-[var(--ink-muted)]">POLICY</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-[var(--ink)] leading-snug">
                    {data.responseKit.slides[2].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--ink-secondary)]">
                    {data.responseKit.slides[2].desc}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {data.responseKit.slides[2].cards.map((c, i) => (
                      <div key={i} className="p-3 rounded-lg bg-[var(--paper)] border border-[var(--rule)] space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--accent)]">
                          <span>{c.no}</span>
                          <span>{c.title}</span>
                        </div>
                        <p className="text-xs text-[var(--ink-secondary)] leading-tight">{c.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slide 04: 6 Çözüm Alanı */}
                <div className="p-5 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-4 hover:border-[var(--rule-strong)] transition-all">
                  <div className="rounded-lg overflow-hidden border border-[var(--rule)] mb-1">
                    <img src="/agency-kit/response-kit-slide-4.png" alt="Slide 4: 6 Solutions" className="w-full h-auto object-cover max-h-48" loading="lazy" />
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[var(--accent)] font-semibold">04 // {data.responseKit.slides[3].tag}</span>
                    <span className="text-[var(--ink-muted)]">SOLUTIONS</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-[var(--ink)] leading-snug">
                    {data.responseKit.slides[3].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--ink-secondary)]">
                    {data.responseKit.slides[3].desc}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {data.responseKit.slides[3].solutions.map((s, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)] text-xs">
                        <div className="flex items-center gap-1.5 font-mono font-semibold text-[var(--ink)] mb-0.5">
                          <span className="text-[var(--accent)] text-xs">{s.no}</span>
                          <span className="text-xs">{s.title}</span>
                        </div>
                        <p className="text-xs text-[var(--ink-secondary)] leading-tight">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slide 05: Acil Durum Akışı */}
                <div className="p-5 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-4 hover:border-[var(--rule-strong)] transition-all">
                  <div className="rounded-lg overflow-hidden border border-[var(--rule)] mb-1">
                    <img src="/agency-kit/response-kit-slide-5.png" alt="Slide 5: Incident Workflow" className="w-full h-auto object-cover max-h-48" loading="lazy" />
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[var(--accent)] font-semibold">05 // {data.responseKit.slides[4].tag}</span>
                    <span className="text-[var(--sev-high)] font-semibold font-mono text-xs">30 MIN TARGET</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-[var(--ink)] leading-snug">
                    {data.responseKit.slides[4].title}
                  </h3>
                  <div className="space-y-2.5 pt-1">
                    {data.responseKit.slides[4].steps.map((st, i) => (
                      <div key={i} className="p-3 rounded-lg bg-[var(--paper)] border border-[var(--rule)] flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[var(--accent-wash)] text-[var(--accent-ink)] border border-[var(--accent)]/20 flex items-center justify-center font-mono font-semibold text-xs flex-shrink-0">
                          {st.step}
                        </span>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-semibold text-[var(--ink)] font-mono">{st.title}</h4>
                          <p className="text-xs text-[var(--ink-secondary)] leading-snug">{st.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2.5 rounded-lg bg-[var(--accent-wash)] border border-[var(--accent)]/20 text-center font-mono text-xs font-semibold text-[var(--accent-ink)]">
                    {data.responseKit.slides[4].highlight}
                  </div>
                </div>

                {/* Slide 06: Çalışma Modelleri */}
                <div className="p-5 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-4 hover:border-[var(--rule-strong)] transition-all">
                  <div className="rounded-lg overflow-hidden border border-[var(--rule)] mb-1">
                    <img src="/agency-kit/response-kit-slide-6.png" alt="Slide 6: Engagement Models" className="w-full h-auto object-cover max-h-48" loading="lazy" />
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[var(--accent)] font-semibold">06 // {data.responseKit.slides[5].tag}</span>
                    <span className="text-[var(--ink-muted)]">ENGAGEMENT</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-[var(--ink)] leading-snug">
                    {data.responseKit.slides[5].title}
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {data.responseKit.slides[5].models.map((m, i) => (
                      <div key={i} className="p-3 rounded-lg bg-[var(--paper)] border border-[var(--rule)] space-y-1">
                        <span className="text-xs font-mono font-semibold text-[var(--accent)] block">{m.name}</span>
                        <p className="text-xs text-[var(--ink-secondary)] leading-tight">{m.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slide 07: Güvenli ve Temiz Devir */}
                <div className="p-5 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-4 hover:border-[var(--rule-strong)] transition-all">
                  <div className="rounded-lg overflow-hidden border border-[var(--rule)] mb-1">
                    <img src="/agency-kit/response-kit-slide-7.png" alt="Slide 7: Clean Handover" className="w-full h-auto object-cover max-h-48" loading="lazy" />
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[var(--accent)] font-semibold">07 // {data.responseKit.slides[6].tag}</span>
                    <span className="text-[var(--sev-ok)] font-semibold font-mono text-xs">STANDARDS</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-[var(--ink)] leading-snug">
                    {data.responseKit.slides[6].title}
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    {data.responseKit.slides[6].stats.map((st, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)]">
                        <span className="text-base sm:text-lg font-mono font-bold text-[var(--accent)] block">{st.value}</span>
                        <span className="text-xs font-mono text-[var(--ink-secondary)] block font-semibold">{st.label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-mono text-[var(--ink-secondary)] bg-[var(--paper)] p-2 rounded-lg border border-[var(--rule)] text-center">
                    {data.responseKit.slides[6].techStack}
                  </p>
                </div>

                {/* Slide 08: Kriz Masası & İletişim */}
                <div className="p-5 sm:p-6 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="rounded-lg overflow-hidden border border-[var(--rule)] mb-2">
                      <img src="/agency-kit/response-kit-slide-8.png" alt="Slide 8: Response Desk Hotline" className="w-full h-auto object-cover max-h-48" loading="lazy" />
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono mb-2">
                      <span className="text-[var(--accent)] font-semibold">08 // {data.responseKit.slides[7].tag}</span>
                      <span className="px-2 py-0.5 rounded bg-[var(--accent-wash)] border border-[var(--accent)]/20 text-[var(--accent-ink)] font-semibold text-xs">HOTLINE</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-serif font-semibold text-[var(--ink)] leading-snug mb-2">
                      {data.responseKit.slides[7].title}
                    </h3>
                    <p className="text-xs text-[var(--ink-secondary)] mb-4">
                      {data.responseKit.slides[7].desc}
                    </p>
                    <div className="space-y-2 text-xs font-mono text-[var(--ink-secondary)]">
                      <div className="flex items-center gap-2">
                        <PhoneCall className="w-4 h-4 text-[var(--sev-ok)]" />
                        <a href="tel:+905343713573" className="hover:text-[var(--accent)] font-semibold text-[var(--ink)] text-sm">{data.responseKit.slides[7].phone}</a>
                      </div>
                      <div className="text-xs text-[var(--ink-muted)]">
                        info@trendmasterakademi.com · 09:00 – 24:00
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2">
                    <a
                      href="tel:+905343713573"
                      className="flex-1 min-w-[140px] px-3 py-2 bg-[#25D366] text-white font-semibold font-mono text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{isTr ? 'Kriz Masasını Ara' : 'Call Response Desk'}</span>
                    </a>
                    <Link
                      to="/crash-test/"
                      onClick={onClose}
                      className="btn-secondary flex-1 min-w-[140px]"
                    >
                      <Zap className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>{isTr ? 'Crash Test Başlat' : 'Start Crash Test'}</span>
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: AGENCY CRASH TEST (Poster Style) */}
          {activeTab === 'crash-test' && (
            <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-150 py-4">
              <div className="p-6 sm:p-10 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] text-center space-y-6 relative overflow-hidden shadow-lg">
                
                {/* Visual Poster Image */}
                <div className="max-w-xs mx-auto rounded-xl overflow-hidden border border-[var(--rule)] shadow-sm relative z-10">
                  <img 
                    src="/agency-kit/crash-test-500-poster.png" 
                    alt="Crash Test 500 Poster" 
                    className="w-full h-auto object-contain"
                  />
                </div>

                <div className="space-y-2 relative z-10">
                  <span className="text-xs font-mono font-semibold tracking-widest text-[var(--accent)] uppercase bg-[var(--accent-wash)] px-3.5 py-1 rounded-[var(--r-control)] border border-[var(--accent)]/20">
                    {data.crashTest.badge}
                  </span>
                  <div className="text-5xl sm:text-6xl font-mono font-bold text-[var(--accent)] tracking-tight pt-2">
                    {data.crashTest.code}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[var(--ink)] uppercase tracking-wide">
                    {data.crashTest.title}
                  </h2>
                  <p className="text-lg sm:text-xl font-semibold text-[var(--accent)]">
                    {data.crashTest.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--ink-secondary)] max-w-lg mx-auto">
                    {data.crashTest.description}
                  </p>
                </div>

                {/* 3 Scenarios */}
                <div className="space-y-2.5 text-left relative z-10 pt-2">
                  {data.crashTest.scenarios.map((sc, i) => (
                    <div key={i} className="p-3.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)] flex items-center justify-between gap-3 hover:border-[var(--rule-strong)] transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[var(--accent)] font-semibold text-sm">{sc.no}</span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-[var(--ink)] font-mono">{sc.title}</h4>
                          <p className="text-xs text-[var(--ink-secondary)] leading-snug">{sc.desc}</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold text-[var(--accent-ink)] bg-[var(--accent-wash)] px-2 py-0.5 rounded border border-[var(--accent)]/20 flex-shrink-0">
                        {sc.tag}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Security Guarantee & Action */}
                <div className="pt-4 border-t border-[var(--rule)] space-y-4 relative z-10">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-semibold text-[var(--ink)] block uppercase tracking-wider">
                      {data.crashTest.notice.title}
                    </span>
                    <p className="text-xs text-[var(--ink-secondary)] max-w-md mx-auto">
                      {data.crashTest.notice.security}
                    </p>
                  </div>

                  <Link
                    to="/crash-test/"
                    onClick={onClose}
                    className="btn-primary w-full sm:w-auto"
                  >
                    <Zap className="w-4 h-4" />
                    <span>{isTr ? '60 Saniyelik Testi Başlat →' : 'Start 60-Second Test →'}</span>
                  </Link>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Bar */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-t border-[var(--rule)] bg-[var(--paper)] text-xs font-mono text-[var(--ink-secondary)] gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span>Trend Master Akademi Studio & Labs</span>
            <span>•</span>
            <span className="text-[var(--accent)] font-semibold">White-Label Engineering Desk</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:+905343713573" className="text-[var(--sev-ok)] hover:text-[var(--ink)] transition-colors flex items-center gap-1 font-semibold">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>+90 534 371 35 73</span>
            </a>
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              {isTr ? 'Kapat' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

