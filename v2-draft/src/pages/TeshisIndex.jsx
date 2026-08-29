import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, ArrowRight, Stethoscope } from 'lucide-react';
import { teshisSummaries } from '../data/teshis/indexSummary';

const TeshisIndex = () => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';
  const lang = isTr ? 'tr' : 'en';

  useEffect(() => {
    document.title = isTr 
      ? 'Teşhis Kataloğu | Trend Master Akademi'
      : 'Diagnostic Catalog | Trend Master Academy';

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', isTr
        ? 'Belirtiden nedene: yazılım arızalarının ajans diliyle teşhis rehberi.'
        : 'From symptom to root cause: technical defect triage guide for digital agencies.'
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://trendmasterakademi.com/teshis/');
    }
  }, [lang]);

  return (
    <div className="pt-32 pb-28 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto text-slate-200">
      
      {/* Header */}
      <header className="mb-14 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
          <Stethoscope className="w-4 h-4" />
          {isTr ? 'B2B TEŞHİS & TRİYAJ REHBERİ' : 'B2B DIAGNOSTIC & TRIAGE CATALOG'}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-white tracking-tight">
          {isTr ? 'Teşhis Kataloğu' : 'Diagnostic Catalog'}
        </h1>

        <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">
          {isTr 
            ? 'Okuyucu teknik terimle değil belirtiyle gelir: "aynı stok iki kişiye satıldı", "bulut hesabı askıya alındı". Uzmanlık, aynı belirtiyi üreten farklı nedenleri birbirinden ayırabilmekte görünür.'
            : 'Engineers and agency leaders arrive with symptoms rather than abstract terms. True engineering expertise is proven by distinguishing multiple root causes from the same defect.'}
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap gap-2.5 pt-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
            {isTr ? 'İsim: Teşhis Kataloğu' : 'Format: Diagnostic Catalog'}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold">
            {isTr ? '20 Teşhis Yayında (20 Hedef)' : '20 Diagnostics Live (20 Total)'}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-semibold">
            {isTr ? 'Her teşhiste akış + diyagram' : 'Interactive Flowchart per Defect'}
          </span>
        </div>
      </header>

      {/* Diagnostics Grid */}
      <div className="space-y-6">
        {[...teshisSummaries].sort((a, b) => {
          const order = { kritik: 1, yuksek: 2, orta: 3 };
          const diff = (order[a.aciliyet.seviye] || 99) - (order[b.aciliyet.seviye] || 99);
          if (diff !== 0) return diff;
          return parseInt(a.no, 10) - parseInt(b.no, 10);
        }).map((item) => {
          const baslikText = item.baslik[lang] || item.baslik.tr;
          const kirintiText = item.kirinti[lang] || item.kirinti.tr;
          const aciliyetText = item.aciliyet.etiket[lang] || item.aciliyet.etiket.tr;
          const ozetText = item.ozet[lang] || item.ozet.tr;
          const isKritik = item.aciliyet.seviye === 'kritik';

          return (
            <Link
              key={item.slug}
              to={`/teshis/${item.slug}/`}
              className="block group border border-white/10 hover:border-cyan-500/40 rounded-3xl bg-[#0d121d] hover:bg-[#111827] transition-all p-6 sm:p-8 space-y-4 shadow-xl hover:shadow-[0_0_30px_rgba(0,229,255,0.1)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-400 font-bold">
                    #{item.no}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-lg font-mono text-xs font-semibold uppercase ${
                    isKritik 
                      ? 'bg-red-500/10 border border-red-500/30 text-red-400' 
                      : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                  }`}>
                    <AlertTriangle className="w-3 h-3" />
                    {aciliyetText}
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    {kirintiText}
                  </span>
                </div>

                <span className="font-mono text-xs text-cyan-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  {isTr ? 'Teşhis Detayı' : 'Diagnostic Flow'} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {baslikText}
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed line-clamp-2">
                  {ozetText}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-white/5">
                <span className="text-[11px] font-mono text-slate-400">
                  {isTr ? 'Olası Nedenler:' : 'Root Causes:'}
                </span>
                {item.nedenler.map((cause) => (
                  <span 
                    key={cause.harf}
                    className="px-2 py-0.5 rounded bg-white/5 font-mono text-[11px] text-slate-300"
                  >
                    {cause.harf}: {cause.ad[lang] || cause.ad.tr}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Glossary Reference Link */}
      <div className="mt-12 text-center pt-8 border-t border-white/10">
        <Link 
          to="/sozluk/" 
          className="text-xs sm:text-sm font-mono text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5"
        >
          <span>{isTr ? 'Teknik terimlerin kısa karşılıkları için → Terim Sözlüğü' : 'Short definitions of the technical terms → Glossary'}</span>
        </Link>
      </div>

    </div>
  );
};

export default TeshisIndex;
