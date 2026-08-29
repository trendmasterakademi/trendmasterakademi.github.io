import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Search, ArrowRight, ShieldCheck, AlertTriangle, 
  Terminal, Sparkles, HelpCircle 
} from 'lucide-react';
import { glossaryTerms } from '../data/glossaryData';

const GlossaryIndex = () => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.title = isTr
      ? "Yazılımcı Dili → Ajans Dili Teknik Terim Sözlüğü | Trend Master Akademi"
      : "Developer-to-Agency Tech Glossary | Trend Master Academy";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", isTr
        ? "Yazılımcınız teknik bir bahane sunduğunda ne anlama geldiğini öğrenin. Deadlock, N+1, Race Condition, Webhook ve 12 temel terimin iş etkisi ve çözümü."
        : "Demystifying developer terminology for digital agency owners. Understand business impact, urgency, and solutions for 12 core backend concepts."
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://trendmasterakademi.com/sozluk/');
    }
  }, [isTr]);

  const filteredTerms = glossaryTerms.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.shortDef[isTr ? 'tr' : 'en'].toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 md:px-8 bg-[#080b11] text-slate-200 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#1f293d_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Eyebrow */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" /> {isTr ? 'AJANS PATRONU REHBERİ' : 'AGENCY EXECUTIVE GUIDE'}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {isTr ? 'Yazılımcı Dili → Ajans Dili Terim Sözlüğü' : 'Developer-to-Agency Technical Glossary'}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {isTr 
              ? 'Yazılımcınız teknik bir bahane sunduğunda veya acil bir kriz yaşandığında; ne olduğunu, ajansınıza maliyetini ve kimin çözeceğini 30 saniyede kavrayın.' 
              : 'Translate complex developer jargon into actionable business impact, operational urgency, and pragmatic resolution paths.'}
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder={isTr ? 'Terim veya kavram ara... (örn: deadlock, webhook, refactor)' : 'Search terms... (e.g. deadlock, webhook, refactor)'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#111827] border border-white/15 text-white placeholder-slate-500 text-sm sm:text-base focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 shadow-xl transition-all"
          />
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTerms.map((term) => (
            <div
              key={term.slug}
              className="p-6 sm:p-7 rounded-3xl bg-[#111827]/80 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-5 shadow-xl group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${term.urgencyColor}`}>
                    {term.urgencyLevel}
                  </span>
                  <span className="text-xs font-mono text-slate-500">/sozluk/{term.slug}/</span>
                </div>

                <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  <Link to={`/sozluk/${term.slug}/`} className="hover:underline">
                    {term.title}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {term.shortDef[isTr ? 'tr' : 'en']}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <Link
                  to={`/sozluk/${term.slug}/`}
                  className="text-xs font-bold font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform"
                >
                  <span>{isTr ? 'Ajans Etkisini & Çözümü Gör' : 'Read Agency Impact'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Hub Callout */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#111827] via-[#0e1626] to-[#151f33] border border-cyan-500/30 text-center space-y-4 max-w-3xl mx-auto shadow-2xl">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {isTr ? 'Projenizde Bu Problemlerden Biri Canlıda mı Yaşanıyor?' : 'Facing One of These Technical Bottlenecks on Production?'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            {isTr 
              ? 'TMA SWAT masası; veritabanı kilitlenmelerini, webhook kopmalarını ve bellek sızıntılarını ajansınız adına sessizce çözer.' 
              : 'Our backline engineering desk diagnoses deadlocks, broken webhooks, and concurrency bugs under strict NDA.'}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/crash-test/"
              className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-bg-dark font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <span>{isTr ? '60sn Crash Test Simülatörü →' : 'Launch 60s Crash Test →'}</span>
            </Link>
            <Link
              to="/agency/"
              className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm"
            >
              <span>{isTr ? 'Ajans Çözümleri Masası' : 'Agency Engineering Desk'}</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GlossaryIndex;
