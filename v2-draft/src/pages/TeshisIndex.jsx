import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, ArrowRight, Stethoscope } from 'lucide-react';
import { teshisSummaries } from '../data/teshis/indexSummary';
import { teshisCatalogH1 } from '../data/pageH1Data';
import { teshisSayisi } from '../data/teshis/count.js';
import { setPageSeo } from '../utils/pageTitle';
import { isTurkish } from '../i18n';

const TeshisIndex = () => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const lang = isTr ? 'tr' : 'en';

  useEffect(() => {
    setPageSeo(isTr ? '/teshis/' : '/diagnostic/', lang);
  }, [lang]);

  return (
    <div className="min-h-screen pt-32 pb-28 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto bg-[var(--paper)] text-[var(--ink)] font-sans selection:bg-[var(--accent)] selection:text-[var(--on-accent)]">
      
      {/* Header */}
      <header className="mb-14 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--accent)] text-xs font-mono font-medium uppercase tracking-wider">
          <Stethoscope className="w-4 h-4" />
          {isTr ? 'B2B TEŞHİS & TRİYAJ REHBERİ' : 'B2B DIAGNOSTIC & TRIAGE CATALOG'}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-[var(--ink)] tracking-tight">
          {teshisCatalogH1[isTr ? 'tr' : 'en']}
        </h1>

        <p className="text-[var(--ink-2)] text-base sm:text-lg leading-relaxed max-w-[34rem]">
          {isTr 
            ? 'Belirtiyi görüyorsunuz ama nedenini bilmiyorsunuz. Buradaki her teşhis bir belirtiyle başlar, aynı belirtiyi üretebilecek nedenleri ayırır ve hangisiyle karşı karşıya olduğunuzu nasıl anlayacağınızı gösterir.'
            : 'You can see the symptom but not the cause. Each entry starts from a symptom, separates the causes that could produce it, and shows you how to tell which one you are facing.'}
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap gap-2.5 pt-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--tint-ok-ink)] font-semibold">
            {isTr ? `${teshisSayisi} belirti` : `${teshisSayisi} symptoms`}
          </span>
          <span className="px-3 py-1.5 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink)] font-semibold">
            {isTr ? 'İlk teşhis ücretsiz' : 'First diagnosis is free'}
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
              to={isTr ? `/teshis/${item.slug}/` : `/diagnostic/${item.slug}/`}
              className="block group border border-[var(--rule)] hover:border-[var(--accent)] rounded-2xl bg-[var(--surface)] transition-all p-6 sm:p-8 space-y-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[var(--accent)] font-bold">
                    #{item.no}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-lg font-mono text-xs font-semibold uppercase ${
                    isKritik 
                      ? 'bg-[var(--tint-danger-bg)] border border-[var(--tint-danger-rule)] text-[var(--tint-danger-ink)]' 
                      : 'bg-[var(--tint-warn-bg)] border border-[var(--tint-warn-rule)] text-[var(--tint-warn-ink)]'
                  }`}>
                    <AlertTriangle className="w-3 h-3" />
                    {aciliyetText}
                  </span>
                  <span className="font-mono text-xs text-[var(--ink-3)]">
                    {kirintiText}
                  </span>
                </div>

                <span className="font-mono text-xs text-[var(--accent)] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-semibold min-h-[44px]">
                  {isTr ? 'Teşhis Detayı' : 'Diagnostic Flow'} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                  {baslikText}
                </h2>
                <p className="text-[var(--ink-2)] text-xs sm:text-sm mt-2 leading-relaxed line-clamp-2">
                  {ozetText}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-[var(--rule)]">
                <span className="text-xs font-mono text-[var(--ink-3)]">
                  {isTr ? 'Olası Nedenler:' : 'Root Causes:'}
                </span>
                {item.nedenler.map((cause) => (
                  <span 
                    key={cause.harf}
                    className="px-2 py-0.5 rounded bg-[var(--paper)] font-mono text-xs text-[var(--ink-2)] border border-[var(--rule)]"
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
      <div className="mt-12 text-center pt-8 border-t border-[var(--rule)]">
        <Link 
          to="/sozluk/" 
          className="text-xs sm:text-sm font-mono text-[var(--accent)] hover:underline inline-flex items-center gap-1.5 min-h-[44px]"
        >
          <span>{isTr ? 'Teknik terimlerin kısa karşılıkları için → Terim Sözlüğü' : 'Short definitions of the technical terms → Glossary'}</span>
        </Link>
      </div>

    </div>
  );
};

export default TeshisIndex;
