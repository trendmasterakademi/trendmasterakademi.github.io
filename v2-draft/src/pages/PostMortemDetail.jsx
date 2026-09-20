import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  AlertTriangle, ArrowLeft, Clock, ShieldCheck, 
  Terminal, CheckCircle2, Flame, Wrench, AlertCircle, Calendar
} from 'lucide-react';
import { postMortems } from '../data/postMortemData';
import { getCalendlyUrl } from '../utils/calendly';
import { formatDocumentTitle } from '../utils/pageTitle';
import { isTurkish } from '../i18n';

const PostMortemDetail = () => {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const lang = isTr ? 'tr' : 'en';

  const item = postMortems.find(p => p.slug === slug);

  useEffect(() => {
    if (item) {
      document.title = formatDocumentTitle(`${item.no} · ${item.title[lang]} | Trend Master Akademi`);

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', item.summary[lang].slice(0, 155) + '...');
      }

      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', isTr 
          ? `https://trendmasterakademi.com/post-mortem/${item.slug}/` 
          : `https://trendmasterakademi.com/post-mortems/${item.slug}/`
        );
      }
    }
  }, [item, lang, isTr]);

  if (!item) {
    return (
      <div className="pt-40 pb-28 px-4 text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl font-black text-white">
          {isTr ? 'Post-Mortem Raporu Bulunamadı' : 'Post-Mortem Report Not Found'}
        </h1>
        <p className="text-slate-400">
          {isTr ? 'Aradığınız vaka otopsisi mevcut değil veya taşınmış.' : 'The requested incident report does not exist or has been relocated.'}
        </p>
        <div className="pt-4">
          <Link
            to={isTr ? "/post-mortem/" : "/post-mortems/"}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold text-sm"
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
    <article className="pt-32 pb-28 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto text-slate-200">
      
      {/* Back to Archive Breadcrumb */}
      <nav className="mb-8">
        <Link
          to={isTr ? "/post-mortem/" : "/post-mortems/"}
          className="inline-flex items-center gap-2 font-mono text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isTr ? '← Tüm Post-Mortem Raporlarına Dön' : '← Back to All Post-Mortem Reports'}</span>
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-12 space-y-6 border-b border-white/10 pb-8">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <span className="text-slate-400 font-bold">
            #{item.no}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold uppercase ${
            isSev1 
              ? 'bg-red-500/10 border border-red-500/30 text-red-400' 
              : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
          }`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            {item.severity}
          </span>
          <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
            {item.category[lang]}
          </span>
          <span className="text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            {item.duration[lang]}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-mono text-white leading-tight">
          {item.title[lang]}
        </h1>

        {/* Impact Box */}
        <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/25 space-y-1 text-xs sm:text-sm text-red-200">
          <strong className="text-red-400 uppercase tracking-wider font-mono block">
            {isTr ? 'OPERASYONEL & FİNANSAL ETKİ:' : 'OPERATIONAL & FINANCIAL IMPACT:'}
          </strong>
          <p className="leading-relaxed">
            {item.impact[lang]}
          </p>
        </div>
      </header>

      {/* Content Sections */}
      <div className="space-y-12">
        
        {/* 1. Executive Summary */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <span className="text-cyan-400">01.</span>
            <span>{isTr ? 'Olay Özeti (Executive Summary)' : 'Executive Summary'}</span>
          </h2>
          <p className="text-slate-300 text-base leading-relaxed bg-[#0d121d] p-6 rounded-2xl border border-white/10">
            {item.summary[lang]}
          </p>
        </section>

        {/* 2. Chronological Timeline */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <span className="text-cyan-400">02.</span>
            <span>{isTr ? 'Saniye Saniye Olay Kronolojisi' : 'Incident Chronology (Timeline)'}</span>
          </h2>

          <div className="relative border-l-2 border-cyan-500/30 ml-4 pl-6 space-y-6">
            {item.timeline.map((step, sIdx) => (
              <div key={sIdx} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-cyan-400 border-4 border-[#080b11] group-hover:scale-125 transition-transform"></div>
                
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {step.time}
                    </span>
                    <h3 className="text-base font-bold text-white">
                      {step.title[lang]}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed pt-1">
                    {step.desc[lang]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Root Cause Analysis */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <span className="text-cyan-400">03.</span>
            <span>{isTr ? 'Kök Neden Analizi (Root Cause / 5 Whys)' : 'Root Cause Analysis (5 Whys)'}</span>
          </h2>
          <div className="bg-[#0d121d] p-6 rounded-2xl border border-white/10 text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-2">
            {item.rootCause[lang]}
          </div>
        </section>

        {/* 4. TMA Hotfix & Intervention */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <span className="text-emerald-400">04.</span>
            <span>{isTr ? 'TMA Cerrahi Hotfix & Müdahale Protokolü' : 'TMA Surgical Hotfix & Response Protocol'}</span>
          </h2>
          <div className="bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/20 text-sm text-slate-200 leading-relaxed whitespace-pre-line space-y-2">
            {item.tmaHotfix[lang]}
          </div>
        </section>

        {/* 5. Permanent Mitigations */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <span className="text-cyan-400">05.</span>
            <span>{isTr ? 'Alınan Kalıcı Önleyici Tedbirler (Hardening)' : 'Permanent Mitigations & Hardening'}</span>
          </h2>
          <div className="bg-[#0d121d] p-6 rounded-2xl border border-white/10 text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-2">
            {item.permanentMitigation[lang]}
          </div>
        </section>

      </div>

      {/* Bottom CTA Box */}
      <footer className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-[#0d121d] to-[#111827] border border-cyan-500/30 text-center space-y-4 shadow-2xl">
        <h3 className="text-xl sm:text-2xl font-black font-mono text-white">
          {isTr ? 'Benzer Bir Sistem Kilitlenmesiyle mi Karşı Karşıyasınız?' : 'Facing a Similar Systemic Outage?'}
        </h3>
        <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
          {isTr
            ? 'TMA SWAT masası; yüksek eşzamanlılık, veritabanı kilitlenmeleri ve kopan ödeme pipeline’larında 0-2 saatte cerrahi müdahale uygular.'
            : 'The TMA SWAT desk applies rapid surgical containment within 0-2 hours for high-concurrency deadlocks and broken pipelines.'}
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <a
            href={getCalendlyUrl('post_mortem', { slug: item.slug })}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Calendar className="w-4 h-4" />
            <span>{isTr ? '30 Dakikalık Teknik Triyaj Talep Edin' : 'Request a 30-Minute Technical Triage'}</span>
          </a>
          <Link
            to={isTr ? "/kurtarilabilirlik/" : "/salvageability/"}
            className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center gap-2"
          >
            <span>{isTr ? 'Salvageability Index (60sn) →' : 'Salvageability Index (60s) →'}</span>
          </Link>
        </div>
      </footer>

    </article>
  );
};

export default PostMortemDetail;
