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
      className="fixed inset-0 z-[100] overflow-y-auto p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md flex justify-center items-start sm:items-center animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="TMA Agency Kit Viewer"
    >
      <div 
        className="relative w-full max-w-5xl my-auto max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] flex flex-col min-h-0 bg-[#090d16] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,229,255,0.15)] overflow-hidden text-slate-200 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-[#06080e]/95 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
                TMA AGENCY KIT // 2026
              </span>
            </div>
            <span className="hidden sm:inline text-xs text-slate-500 font-mono">|</span>
            <span className="hidden sm:inline text-xs text-slate-400 font-mono">
              {isTr ? 'Resmi Ajans Müdahale & Hazırlık Rehberi' : 'Official Agency Incident & Readiness Guide'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/kit/"
              onClick={onClose}
              className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{isTr ? 'Görsel Galeri Sayfası' : 'Visual Gallery'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-slate-950/60 px-4 sm:px-6 gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('response-kit')}
            className={`py-3 px-4 text-xs sm:text-sm font-mono font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'response-kit'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>01. Agency Response Kit (8 Kart)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('crash-test')}
            className={`py-3 px-4 text-xs sm:text-sm font-mono font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'crash-test'
                ? 'border-rose-500 text-rose-300 bg-rose-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-rose-400" />
            <span>02. 60sn Agency Crash Test (Poster)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* TAB 1: AGENCY RESPONSE KIT (8 Cards) */}
          {activeTab === 'response-kit' && (
            <div className="space-y-8 animate-in fade-in duration-150">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/60">
                  {data.responseKit.badge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                  {data.responseKit.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  {data.responseKit.subtitle}
                </p>
              </div>

              {/* 8 Cards Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                
                {/* Slide 01: Kapak / Overview */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0d121d] border border-cyan-500/20 space-y-4 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
                  <div className="rounded-xl overflow-hidden border border-white/10 mb-1">
                    <img src="/agency-kit/response-kit-slide-1.png" alt="Slide 1: White-Label Engineering" className="w-full h-auto object-cover max-h-48" loading="lazy" />
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-cyan-400 font-bold">01 // {data.responseKit.slides[0].tag}</span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
                      {data.responseKit.slides[0].status}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white font-mono leading-snug">
                    {data.responseKit.slides[0].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {data.responseKit.slides[0].desc}
                  </p>
                  <ul className="space-y-2 text-xs text-slate-400 pt-1 font-mono">
                    {data.responseKit.slides[0].points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Slide 02: Görünmeyen Ekip */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0d121d] border border-white/10 space-y-4 hover:border-cyan-500/30 transition-all">
                  <div className="rounded-xl overflow-hidden border border-white/10 mb-1">
                    <img src="/agency-kit/response-kit-slide-2.png" alt="Slide 2: Invisible Tech Squad" className="w-full h-auto object-cover max-h-48" loading="lazy" />
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-cyan-400 font-bold">02 // {data.responseKit.slides[1].tag}</span>
                    <span className="text-slate-500">CAPACITY</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white font-mono leading-snug">
                    {data.responseKit.slides[1].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    {data.responseKit.slides[1].desc}
                  </p>
                  <div className="space-y-2 pt-1">
                    {data.responseKit.slides[1].items.map((it, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-cyan-400 font-bold">{it.no}</span>
                          <span className="font-bold text-slate-200">{it.title || it['CANLI SİSTEM HATASI']}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono text-right">{it.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slide 03: White-Label Model */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0d121d] border border-white/10 space-y-4 hover:border-cyan-500/30 transition-all">
                  <div className="rounded-xl overflow-hidden border border-white/10 mb-1">
                    <img src="/agency-kit/response-kit-slide-3.png" alt="Slide 3: White-Label Model" className="w-full h-auto object-cover max-h-48" loading="lazy" />
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-cyan-400 font-bold">03 // {data.responseKit.slides[2].tag}</span>
                    <span className="text-slate-500">POLICY</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white font-mono leading-snug">
                    {data.responseKit.slides[2].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    {data.responseKit.slides[2].desc}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {data.responseKit.slides[2].cards.map((c, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400">
                          <span>{c.no}</span>
                          <span>{c.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">{c.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slide 04: 6 Çözüm Alanı */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0d121d] border border-white/10 space-y-4 hover:border-cyan-500/30 transition-all">
                  <div className="rounded-xl overflow-hidden border border-white/10 mb-1">
                    <img src="/agency-kit/response-kit-slide-4.png" alt="Slide 4: 6 Solutions" className="w-full h-auto object-cover max-h-48" loading="lazy" />
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-cyan-400 font-bold">04 // {data.responseKit.slides[3].tag}</span>
                    <span className="text-slate-500">SOLUTIONS</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white font-mono leading-snug">
                    {data.responseKit.slides[3].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    {data.responseKit.slides[3].desc}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {data.responseKit.slides[3].solutions.map((s, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-white mb-0.5">
                          <span className="text-cyan-400 text-[11px]">{s.no}</span>
                          <span className="text-[12px]">{s.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slide 05: Acil Durum Akışı */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0d121d] border border-white/10 space-y-4 hover:border-cyan-500/30 transition-all">
                  <div className="rounded-xl overflow-hidden border border-white/10 mb-1">
                    <img src="/agency-kit/response-kit-slide-5.png" alt="Slide 5: Incident Workflow" className="w-full h-auto object-cover max-h-48" loading="lazy" />
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-cyan-400 font-bold">05 // {data.responseKit.slides[4].tag}</span>
                    <span className="text-amber-400 font-bold font-mono text-[11px]">30 MIN TARGET</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white font-mono leading-snug">
                    {data.responseKit.slides[4].title}
                  </h3>
                  <div className="space-y-2.5 pt-1">
                    {data.responseKit.slides[4].steps.map((st, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                          {st.step}
                        </span>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-white font-mono">{st.title}</h4>
                          <p className="text-[11px] text-slate-300 leading-snug">{st.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center font-mono text-xs font-bold text-cyan-300">
                    ⚡ {data.responseKit.slides[4].highlight}
                  </div>
                </div>

                {/* Slide 06: Çalışma Modelleri */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0d121d] border border-white/10 space-y-4 hover:border-cyan-500/30 transition-all">
                  <div className="rounded-xl overflow-hidden border border-white/10 mb-1">
                    <img src="/agency-kit/response-kit-slide-6.png" alt="Slide 6: Engagement Models" className="w-full h-auto object-cover max-h-48" loading="lazy" />
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-cyan-400 font-bold">06 // {data.responseKit.slides[5].tag}</span>
                    <span className="text-slate-500">ENGAGEMENT</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white font-mono leading-snug">
                    {data.responseKit.slides[5].title}
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {data.responseKit.slides[5].models.map((m, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <span className="text-xs font-mono font-bold text-cyan-400 block">{m.name}</span>
                        <p className="text-[11px] text-slate-300 leading-tight">{m.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slide 07: Güvenli ve Temiz Devir */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0d121d] border border-white/10 space-y-4 hover:border-cyan-500/30 transition-all">
                  <div className="rounded-xl overflow-hidden border border-white/10 mb-1">
                    <img src="/agency-kit/response-kit-slide-7.png" alt="Slide 7: Clean Handover" className="w-full h-auto object-cover max-h-48" loading="lazy" />
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-cyan-400 font-bold">07 // {data.responseKit.slides[6].tag}</span>
                    <span className="text-emerald-400 font-bold font-mono text-[11px]">STANDARDS</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white font-mono leading-snug">
                    {data.responseKit.slides[6].title}
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    {data.responseKit.slides[6].stats.map((st, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-base sm:text-lg font-black font-mono text-cyan-400 block">{st.value}</span>
                        <span className="text-[10px] font-mono text-slate-400 block font-bold">{st.label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 bg-white/5 p-2 rounded-xl border border-white/5 text-center">
                    {data.responseKit.slides[6].techStack}
                  </p>
                </div>

                {/* Slide 08: Kriz Masası & İletişim */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-[#0d121d] to-purple-950/30 border border-cyan-500/40 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="rounded-xl overflow-hidden border border-white/10 mb-2">
                      <img src="/agency-kit/response-kit-slide-8.png" alt="Slide 8: Response Desk Hotline" className="w-full h-auto object-cover max-h-48" loading="lazy" />
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono mb-2">
                      <span className="text-cyan-400 font-bold">08 // {data.responseKit.slides[7].tag}</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">HOTLINE</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white font-mono leading-snug mb-2">
                      {data.responseKit.slides[7].title}
                    </h3>
                    <p className="text-xs text-slate-300 mb-4">
                      {data.responseKit.slides[7].desc}
                    </p>
                    <div className="space-y-2 text-xs font-mono text-slate-300">
                      <div className="flex items-center gap-2">
                        <PhoneCall className="w-4 h-4 text-emerald-400" />
                        <a href="tel:+905343713573" className="hover:text-white font-bold text-cyan-300 text-sm">{data.responseKit.slides[7].phone}</a>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        info@trendmasterakademi.com · 09:00 – 24:00
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2">
                    <a
                      href="tel:+905343713573"
                      className="flex-1 min-w-[140px] px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-lg cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{isTr ? 'Kriz Masasını Ara' : 'Call Response Desk'}</span>
                    </a>
                    <Link
                      to="/crash-test/"
                      onClick={onClose}
                      className="flex-1 min-w-[140px] px-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-lg cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
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
              <div className="p-6 sm:p-10 rounded-3xl bg-[#080709] border-2 border-rose-500/40 text-center space-y-6 relative overflow-hidden shadow-[0_0_60px_rgba(244,63,94,0.15)]">
                
                {/* Visual Poster Image */}
                <div className="max-w-xs mx-auto rounded-2xl overflow-hidden border border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.25)] relative z-10">
                  <img 
                    src="/agency-kit/crash-test-500-poster.png" 
                    alt="Crash Test 500 Poster" 
                    className="w-full h-auto object-contain"
                  />
                </div>
                
                {/* Background 500 watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[160px] sm:text-[220px] font-black font-mono text-rose-500/5 select-none pointer-events-none">
                  500
                </div>

                <div className="space-y-2 relative z-10">
                  <span className="text-xs font-mono font-bold tracking-widest text-rose-400 uppercase bg-rose-950/60 px-3.5 py-1 rounded-full border border-rose-800/60">
                    {data.crashTest.badge}
                  </span>
                  <div className="text-5xl sm:text-7xl font-black font-mono text-rose-500 tracking-tight pt-2">
                    {data.crashTest.code}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase tracking-wide">
                    {data.crashTest.title}
                  </h2>
                  <p className="text-lg sm:text-xl font-bold text-rose-400">
                    {data.crashTest.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                    {data.crashTest.description}
                  </p>
                </div>

                {/* 3 Scenarios */}
                <div className="space-y-2.5 text-left relative z-10 pt-2">
                  {data.crashTest.scenarios.map((sc, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 hover:border-rose-500/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-rose-400 font-bold text-sm">{sc.no}</span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white font-mono">{sc.title}</h4>
                          <p className="text-[11px] text-slate-400 leading-snug">{sc.desc}</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 flex-shrink-0">
                        {sc.tag}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Security Guarantee & Action */}
                <div className="pt-4 border-t border-white/10 space-y-4 relative z-10">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-slate-300 block uppercase tracking-wider">
                      {data.crashTest.notice.title}
                    </span>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      🔒 {data.crashTest.notice.security}
                    </p>
                  </div>

                  <Link
                    to="/crash-test/"
                    onClick={onClose}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-slate-950 font-mono font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:brightness-110 transition-all cursor-pointer w-full sm:w-auto"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>{isTr ? '60 Saniyelik Testi Başlat →' : 'Start 60-Second Test →'}</span>
                  </Link>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Bar */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-t border-white/10 bg-[#06080e] text-xs font-mono text-slate-400 gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span>Trend Master Akademi Studio & Labs</span>
            <span>•</span>
            <span className="text-cyan-400">White-Label Engineering Desk</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:+905343713573" className="text-emerald-400 hover:text-white transition-colors flex items-center gap-1 font-bold">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>+90 534 371 35 73</span>
            </a>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              {isTr ? 'Kapat' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
