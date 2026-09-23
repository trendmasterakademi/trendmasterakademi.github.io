import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  AlertTriangle, ArrowLeft, Clock, ShieldCheck, 
  Terminal, CheckCircle2, Flame, Wrench, AlertCircle, Calendar
} from 'lucide-react';
import { postMortems, postMortemDisclosure, getPostMortemH1 } from '../data/postMortemData';
import { getCalendlyUrl } from '../utils/calendly';
import { setPageSeo } from '../utils/pageTitle';
import { isTurkish } from '../i18n';

const PostMortemDetail = () => {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const lang = isTr ? 'tr' : 'en';

  const item = postMortems.find(p => p.slug === slug);

  useEffect(() => {
    if (item) {
      setPageSeo(isTr ? `/post-mortem/${item.slug}/` : `/post-mortems/${item.slug}/`, lang);
    }
  }, [item, lang, isTr]);

  if (!item) {
    return (
      <div className="min-h-screen pt-40 pb-28 px-4 text-center max-w-2xl mx-auto space-y-4 bg-[var(--paper)] text-[var(--ink)]">
        <h1 className="text-3xl font-serif font-semibold text-[var(--ink)]">
          {isTr ? 'Post-Mortem Raporu Bulunamadı' : 'Post-Mortem Report Not Found'}
        </h1>
        <p className="text-[var(--ink-light)]">
          {isTr ? 'Aradığınız vaka otopsisi mevcut değil veya taşınmış.' : 'The requested incident report does not exist or has been relocated.'}
        </p>
        <div className="pt-4">
          <Link
            to={isTr ? "/post-mortem/" : "/post-mortems/"}
            className="btn-primary min-h-[44px] inline-flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isTr ? 'Arşive Dön' : 'Back to Archive'}</span>
          </Link>
        </div>
      </div>
    );
  }

  const isSev1 = item.severity.includes('SEV-1');

  return (
    <article className="min-h-screen pt-32 pb-28 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto bg-[var(--paper)] text-[var(--ink)] font-sans selection:bg-[var(--accent)] selection:text-white">
      
      {/* Back to Archive Breadcrumb */}
      <nav className="mb-8">
        <Link
          to={isTr ? "/post-mortem/" : "/post-mortems/"}
          className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[var(--accent)] hover:underline transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isTr ? '← Tüm Post-Mortem Raporlarına Dön' : '← Back to All Post-Mortem Reports'}</span>
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-12 space-y-6 border-b border-[var(--rule)] pb-8">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <span className="text-[var(--accent)] font-bold">
            #{item.no}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold uppercase ${
            isSev1 
              ? 'bg-rose-50 border border-rose-300 text-rose-800' 
              : 'bg-amber-50 border border-amber-300 text-amber-800'
          }`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            {item.severity}
          </span>
          <span className="px-3 py-1 rounded-lg bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink-light)]">
            {item.category[lang]}
          </span>
          <span className="text-[var(--ink-muted)] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
            {item.date[lang]}
          </span>
          <span className="text-[var(--ink-muted)] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
            {item.duration[lang]}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-[var(--ink)] leading-tight">
          {getPostMortemH1(item, lang)}
        </h1>

        {/* Impact Box */}
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1 text-xs sm:text-sm text-rose-950">
          <strong className="text-rose-800 uppercase tracking-wider font-mono block font-semibold">
            {isTr ? 'OPERASYONEL & FİNANSAL ETKİ:' : 'OPERATIONAL & FINANCIAL IMPACT:'}
          </strong>
          <p className="leading-relaxed">
            {item.impact[lang]}
          </p>
        </div>

        {/* Disclosure / Künye Box */}
        <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] leading-relaxed font-mono">
          <p>
            {postMortemDisclosure.detail[lang]}
          </p>
        </div>
      </header>

      {/* Content Sections */}
      <div className="space-y-12">
        
        {/* 1. Executive Summary */}
        <section className="space-y-3">
          <h2 className="text-xl font-serif font-semibold text-[var(--ink)] flex items-center gap-2">
            <span className="text-[var(--accent)] font-mono">01.</span>
            <span>{isTr ? 'Olay Özeti (Executive Summary)' : 'Executive Summary'}</span>
          </h2>
          <p className="text-[var(--ink-light)] text-base leading-relaxed bg-[var(--surface)] p-6 rounded-2xl border border-[var(--rule)]">
            {item.summary[lang]}
          </p>
        </section>

        {/* 2. Chronological Timeline */}
        <section className="space-y-4">
          <h2 className="text-xl font-serif font-semibold text-[var(--ink)] flex items-center gap-2">
            <span className="text-[var(--accent)] font-mono">02.</span>
            <span>{isTr ? 'Saniye Saniye Olay Kronolojisi' : 'Incident Chronology (Timeline)'}</span>
          </h2>

          <div className="relative border-l-2 border-[var(--rule)] ml-4 pl-6 space-y-6">
            {item.timeline.map((step, sIdx) => (
              <div key={sIdx} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[var(--accent)] border-4 border-[var(--paper)] group-hover:scale-125 transition-transform"></div>
                
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-[var(--accent)] bg-[var(--accent-subtle)] px-2 py-0.5 rounded border border-[var(--accent)]/20">
                      {step.time}
                    </span>
                    <h3 className="text-base font-semibold text-[var(--ink)]">
                      {step.title[lang]}
                    </h3>
                  </div>
                  <p className="text-sm text-[var(--ink-light)] leading-relaxed pt-1">
                    {step.desc[lang]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Root Cause Analysis */}
        <section className="space-y-3">
          <h2 className="text-xl font-serif font-semibold text-[var(--ink)] flex items-center gap-2">
            <span className="text-[var(--accent)] font-mono">03.</span>
            <span>{isTr ? 'Kök Neden Analizi (Root Cause / 5 Whys)' : 'Root Cause Analysis (5 Whys)'}</span>
          </h2>
          <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--rule)] text-sm text-[var(--ink-light)] leading-relaxed whitespace-pre-line space-y-2">
            {item.rootCause[lang]}
          </div>
        </section>

        {/* 4. TMA Hotfix & Intervention */}
        <section className="space-y-3">
          <h2 className="text-xl font-serif font-semibold text-[var(--ink)] flex items-center gap-2">
            <span className="text-emerald-700 font-mono">04.</span>
            <span>{isTr ? 'TMA Cerrahi Hotfix & Müdahale Protokolü' : 'TMA Surgical Hotfix & Response Protocol'}</span>
          </h2>
          <div className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-200 text-sm text-emerald-950 leading-relaxed whitespace-pre-line space-y-2">
            {item.tmaHotfix[lang]}
          </div>
        </section>

        {/* 5. Permanent Mitigations */}
        <section className="space-y-3">
          <h2 className="text-xl font-serif font-semibold text-[var(--ink)] flex items-center gap-2">
            <span className="text-[var(--accent)] font-mono">05.</span>
            <span>{isTr ? 'Alınan Kalıcı Önleyici Tedbirler (Hardening)' : 'Permanent Mitigations & Hardening'}</span>
          </h2>
          <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--rule)] text-sm text-[var(--ink-light)] leading-relaxed whitespace-pre-line space-y-2">
            {item.permanentMitigation[lang]}
          </div>
        </section>

      </div>

      {/* Bottom CTA Box */}
      <footer className="mt-16 p-8 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] text-center space-y-4 shadow-sm">
        <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[var(--ink)]">
          {isTr ? 'Benzer Bir Sistem Kilitlenmesiyle mi Karşı Karşıyasınız?' : 'Facing a Similar Systemic Outage?'}
        </h3>
        <p className="text-[var(--ink-light)] text-sm max-w-xl mx-auto leading-relaxed">
          {isTr
            ? 'TMA SWAT masası; yüksek eşzamanlılık, veritabanı kilitlenmeleri ve kopan ödeme pipeline’larında 0-2 saatte cerrahi müdahale uygular.'
            : 'The TMA SWAT desk applies rapid surgical containment within 0-2 hours for high-concurrency deadlocks and broken pipelines.'}
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <a
            href={getCalendlyUrl('post_mortem', { slug: item.slug })}
            target="_blank"
            rel="noreferrer"
            className="btn-primary min-h-[44px] text-xs sm:text-sm font-semibold flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>{isTr ? '30 Dakikalık Teknik Triyaj Talep Edin' : 'Request a 30-Minute Technical Triage'}</span>
          </a>
          <Link
            to={isTr ? "/kurtarilabilirlik/" : "/salvageability/"}
            className="btn-secondary min-h-[44px] text-xs sm:text-sm font-semibold flex items-center gap-2"
          >
            <span>{isTr ? 'Salvageability Index (60sn) →' : 'Salvageability Index (60s) →'}</span>
          </Link>
        </div>
        <p className="text-xs text-[var(--ink-muted)] pt-2">
          {isTr ? (
            <>Tüm teknik incelemeler ve müdahaleler <Link to="/nda/" className="text-[var(--accent)] underline hover:text-[var(--accent-hover)] transition-colors">Gizlilik ve Çalışma Sözleşmesi (NDA)</Link> kapsamındadır.</>
          ) : (
            <>All technical reviews and interventions are covered under our <Link to="/nda/" className="text-[var(--accent)] underline hover:text-[var(--accent-hover)] transition-colors">Confidentiality and Engagement Agreement (NDA)</Link>.</>
          )}
        </p>
      </footer>

    </article>
  );
};

export default PostMortemDetail;
