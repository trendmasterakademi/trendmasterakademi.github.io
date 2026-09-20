import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FileText, AlertTriangle, ArrowRight, ShieldCheck, 
  Clock, Database, Layers, CheckCircle2, Terminal
} from 'lucide-react';
import { postMortems } from '../data/postMortemData';
import { formatDocumentTitle } from '../utils/pageTitle';
import { isTurkish } from '../i18n';

const PostMortemIndex = () => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const lang = isTr ? 'tr' : 'en';

  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    document.title = formatDocumentTitle(isTr 
      ? 'Public Post-Mortem & Kök Neden Analizi (RCA) | Trend Master Akademi'
      : 'Public Incident Post-Mortem & RCA Archive | Trend Master Academy');

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', isTr
        ? 'Gerçek sistem krizlerinin saniye saniye zaman çizelgesi, kök neden analizi (RCA) ve cerrahi TMA hotfix müdahaleleri.'
        : 'Anonymized production incident post-mortems, second-by-second timelines, root-cause analyses, and surgical TMA engineering fixes.'
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', isTr ? 'https://trendmasterakademi.com/post-mortem/' : 'https://trendmasterakademi.com/post-mortems/');
    }
  }, [lang]);

  const categories = ['ALL', ...new Set(postMortems.map(p => p.category.tr))];

  const filteredItems = selectedCategory === 'ALL'
    ? postMortems
    : postMortems.filter(p => p.category.tr === selectedCategory);

  return (
    <div className="pt-32 pb-28 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto text-slate-200">
      
      {/* Header */}
      <header className="mb-14 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
          <Terminal className="w-4 h-4" />
          {isTr ? 'AÇIK KAYNAKLI TEKNİK OTOPSİ ARŞİVİ' : 'PUBLIC INCIDENT POST-MORTEM ARCHIVE'}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-white tracking-tight">
          {isTr ? 'Incident Post-Mortem & RCA' : 'Incident Post-Mortems & RCA'}
        </h1>

        <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">
          {isTr 
            ? 'Pazarlama laflarıyla değil, mühendislik ciddiyetiyle: Çözdüğümüz kritik altyapı krizlerinin müşteri gizliliği korunarak hazırlanmış saniye saniye zaman çizelgesi, kök neden analizi (5 Whys) ve kalıcı önlem raporları.'
            : 'Engineering rigor over marketing claims: Anonymized post-mortems detailing second-by-second incident chronologies, root-cause analyses, and surgical TMA hotfix protocols.'}
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap gap-2.5 pt-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
            {isTr ? 'Sıfır İsim / %100 Anonim' : 'Zero Client Identifiers'}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold">
            {isTr ? 'Gerçek Üretim Vakaları' : 'Real Production Outages'}
          </span>
        </div>
      </header>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
            }`}
          >
            {cat === 'ALL' ? (isTr ? 'Tüm Vakalar' : 'All Incidents') : cat}
          </button>
        ))}
      </div>

      {/* Post-Mortem Cards */}
      <div className="space-y-6">
        {filteredItems.map((item) => {
          const isSev1 = item.severity.includes('SEV-1');

          return (
            <Link
              key={item.slug}
              to={isTr ? `/post-mortem/${item.slug}/` : `/post-mortems/${item.slug}/`}
              className="block group border border-white/10 hover:border-cyan-500/40 rounded-3xl bg-[#0d121d] hover:bg-[#111827] transition-all p-6 sm:p-8 space-y-4 shadow-xl hover:shadow-[0_0_30px_rgba(0,229,255,0.1)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-400 font-bold">
                    #{item.no}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-lg font-mono text-xs font-bold uppercase ${
                    isSev1 
                      ? 'bg-red-500/10 border border-red-500/30 text-red-400' 
                      : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                  }`}>
                    <AlertTriangle className="w-3 h-3" />
                    {item.severity}
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    {item.category[lang]}
                  </span>
                </div>

                <div className="font-mono text-xs text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{item.duration[lang]}</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                {item.title[lang]}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {item.summary[lang]}
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-white/5 text-xs font-mono">
                <span className="text-slate-400">
                  <strong className="text-slate-300">{isTr ? 'Etki: ' : 'Impact: '}</strong>
                  {item.impact[lang]}
                </span>
                <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-4">
                  <span>{isTr ? 'Otopsiyi Oku' : 'Read Post-Mortem'}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
};

export default PostMortemIndex;
