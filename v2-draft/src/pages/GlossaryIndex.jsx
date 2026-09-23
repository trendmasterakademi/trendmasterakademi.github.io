import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Search, ArrowRight, ShieldCheck, AlertTriangle, 
  Terminal, Sparkles, HelpCircle, Calendar 
} from 'lucide-react';
import { glossaryTerms, glossaryHubH1 } from '../data/glossaryData';
import { getCalendlyUrl } from '../utils/calendly';
import { setPageSeo } from '../utils/pageTitle';
import { isTurkish } from '../i18n';

const GlossaryIndex = () => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setPageSeo(isTr ? '/sozluk/' : '/glossary/', isTr ? 'tr' : 'en');
  }, [isTr]);

  const filteredTerms = glossaryTerms.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.shortDef[isTr ? 'tr' : 'en'].toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 md:px-8 bg-[var(--paper)] text-[var(--ink)] relative font-sans selection:bg-[var(--accent)] selection:text-white">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Eyebrow */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink-muted)] text-xs font-mono font-medium uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-[var(--accent)]" /> {isTr ? 'AJANS PATRONU REHBERİ' : 'AGENCY EXECUTIVE GUIDE'}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-[var(--ink)] tracking-tight leading-tight">
            {glossaryHubH1[isTr ? 'tr' : 'en']}
          </h1>

          <p className="text-[var(--ink-light)] text-base sm:text-lg leading-relaxed">
            {isTr 
              ? 'Yazılımcınız teknik bir bahane sunduğunda veya acil bir kriz yaşandığında; ne olduğunu, ajansınıza maliyetini ve kimin çözeceğini 30 saniyede kavrayın.' 
              : 'Translate complex developer jargon into actionable business impact, operational urgency, and pragmatic resolution paths.'}
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--ink-muted)]">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder={isTr ? 'Terim veya kavram ara... (örn: deadlock, webhook, refactor)' : 'Search terms... (e.g. deadlock, webhook, refactor)'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink)] placeholder-[var(--ink-muted)] text-sm sm:text-base focus:border-[var(--accent)] focus:outline-none shadow-sm transition-all"
          />
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTerms.map((term) => (
            <div
              key={term.slug}
              className="p-6 sm:p-7 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--accent)] transition-all flex flex-col justify-between space-y-5 shadow-sm group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full border ${term.urgencyColor}`}>
                    {isTr ? term.urgencyLevel : term.urgencyLevelEn}
                  </span>
                  <span className="text-xs font-mono text-[var(--ink-muted)]">/{isTr ? 'sozluk' : 'glossary'}/{term.slug}/</span>
                </div>

                <h2 className="text-xl font-serif font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                  <Link to={isTr ? `/sozluk/${term.slug}/` : `/glossary/${term.slug}/`} className="hover:underline">
                    {isTr ? term.title : term.titleEn}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-[var(--ink-light)] leading-relaxed line-clamp-3">
                  {term.shortDef[isTr ? 'tr' : 'en']}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--rule)] flex items-center justify-between">
                <Link
                  to={isTr ? `/sozluk/${term.slug}/` : `/glossary/${term.slug}/`}
                  className="text-xs font-semibold font-mono text-[var(--accent)] hover:underline flex items-center gap-1.5 group-hover:translate-x-1 transition-transform min-h-[44px]"
                >
                  <span>{isTr ? 'Ajans Etkisini & Çözümü Gör' : 'Read Agency Impact'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Hub Callout */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] text-center space-y-4 max-w-3xl mx-auto shadow-sm">
          <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[var(--ink)]">
            {isTr ? 'Projenizde Bu Problemlerden Biri Canlıda mı Yaşanıyor?' : 'Facing One of These Technical Bottlenecks on Production?'}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--ink-light)] max-w-xl mx-auto leading-relaxed">
            {isTr 
              ? 'TMA SWAT masası; veritabanı kilitlenmelerini, webhook kopmalarını ve bellek sızıntılarını ajansınız adına sessizce çözer.' 
              : 'Our backline engineering desk diagnoses deadlocks, broken webhooks, and concurrency bugs under strict NDA.'}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/crash-test/"
              className="btn-primary min-h-[44px] text-xs sm:text-sm font-mono flex items-center gap-2"
            >
              <span>{isTr ? '60sn Crash Test Simülatörü →' : 'Launch 60s Crash Test →'}</span>
            </Link>
            <Link
              to="/agency/"
              className="btn-secondary min-h-[44px] text-xs sm:text-sm font-mono flex items-center gap-2"
            >
              <span>{isTr ? 'Mühendislik Kapasitesi & Altyapı' : 'Engineering Capacity & Infrastructure'}</span>
            </Link>
          </div>

          {/* Calm Calendly Line */}
          <div className="pt-2">
            <a
              href={getCalendlyUrl('glossary_index')}
              target="_blank"
              rel="noreferrer"
              onClick={() => window.trackEvent && window.trackEvent('calendar_clicked', { source: 'glossary_index' })}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-[var(--accent)] hover:underline min-h-[44px]"
            >
              <span>
                {isTr 
                  ? 'Aradığınız terimi bulamadınız mı? 30 dakikalık teknik tanışma görüşmesi →' 
                  : "Can't find the term you're looking for? 30-minute technical intro call →"}
              </span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GlossaryIndex;
