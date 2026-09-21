import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FileText, AlertTriangle, ArrowRight, ShieldCheck, 
  Clock, Database, Layers, CheckCircle2, Terminal, Calendar
} from 'lucide-react';
import { postMortems, postMortemDisclosure } from '../data/postMortemData';
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
      : 'Public Incident Post-Mortem & RCA Archive | Trend Master Akademi');

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
    <div className="min-h-screen pt-32 pb-28 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto bg-[var(--paper)] text-[var(--ink)] font-sans selection:bg-[var(--accent)] selection:text-[var(--on-accent)]">
      
      {/* Header */}
      <header className="mb-14 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--accent)] text-xs font-mono font-medium uppercase tracking-wider">
          <Terminal className="w-4 h-4" />
          {isTr ? 'AÇIK KAYNAKLI TEKNİK OTOPSİ ARŞİVİ' : 'PUBLIC INCIDENT POST-MORTEM ARCHIVE'}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-[var(--ink)] tracking-tight">
          {isTr ? 'Incident Post-Mortem & RCA' : 'Incident Post-Mortems & RCA'}
        </h1>

        <p className="text-[var(--ink-light)] text-base sm:text-lg leading-relaxed max-w-[34rem]">
          {isTr 
            ? 'Pazarlama laflarıyla değil, mühendislik ciddiyetiyle: Çözdüğümüz kritik altyapı krizlerinin müşteri gizliliği korunarak hazırlanmış saniye saniye zaman çizelgesi, kök neden analizi (5 Whys) ve kalıcı önlem raporları.'
            : 'Engineering rigor over marketing claims: Anonymized post-mortems detailing second-by-second incident chronologies, root-cause analyses, and surgical TMA hotfix protocols.'}
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap gap-2.5 pt-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-emerald-800 font-semibold">
            {isTr ? 'Sıfır İsim / %100 Anonim' : 'Zero Client Identifiers'}
          </span>
          <span className="px-3 py-1.5 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink)] font-semibold">
            {isTr ? 'Gerçek Üretim Vakaları' : 'Real Production Outages'}
          </span>
        </div>

        {/* Disclosure Notice */}
        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] leading-relaxed font-mono">
          {postMortemDisclosure.index[lang]}
        </div>
      </header>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-[var(--rule)] pb-4">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 min-h-[44px] rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'btn-primary'
                : 'btn-secondary'
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
              className="block group border border-[var(--rule)] hover:border-[var(--accent)] rounded-2xl bg-[var(--surface)] transition-all p-6 sm:p-8 space-y-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[var(--accent)] font-bold">
                    #{item.no}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-lg font-mono text-xs font-bold uppercase ${
                    isSev1 
                      ? 'bg-rose-50 border border-rose-300 text-rose-800' 
                      : 'bg-amber-50 border border-amber-300 text-amber-800'
                  }`}>
                    <AlertTriangle className="w-3 h-3" />
                    {item.severity}
                  </span>
                  <span className="font-mono text-xs text-[var(--ink-muted)]">
                    {item.category[lang]}
                  </span>
                </div>

                <div className="font-mono text-xs text-[var(--ink-muted)] flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
                    {item.date[lang]}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
                    {item.duration[lang]}
                  </span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                {item.title[lang]}
              </h2>

              <p className="text-[var(--ink-light)] text-sm sm:text-base leading-relaxed">
                {item.summary[lang]}
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-[var(--rule)] text-xs font-mono">
                <span className="text-[var(--ink-light)]">
                  <strong className="text-[var(--ink)]">{isTr ? 'Etki: ' : 'Impact: '}</strong>
                  {item.impact[lang]}
                </span>
                <span className="text-[var(--accent)] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-4 min-h-[44px]">
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
