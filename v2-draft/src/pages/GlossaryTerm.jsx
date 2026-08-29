import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, ShieldCheck, AlertTriangle, 
  HelpCircle, CheckCircle2, PhoneCall, BookOpen, ExternalLink, Zap
} from 'lucide-react';
import { glossaryTerms } from '../data/glossaryData';

const GlossaryTerm = () => {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';
  const navigate = useNavigate();

  const term = glossaryTerms.find(t => t.slug === slug);

  useEffect(() => {
    if (!term) return;

    document.title = isTr
      ? `${term.title} Nedir? Ajanslar İçin Teknik Rehber | Trend Master Akademi`
      : `${term.title} - Agency Executive Guide | Trend Master Academy`;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", `${term.title}: ${term.shortDef[isTr ? 'tr' : 'en']}`);
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://trendmasterakademi.com/sozluk/${term.slug}/`);
    }

    if (window.trackEvent) {
      window.trackEvent('glossary_term_viewed', { term: term.slug });
    }
  }, [term, isTr]);

  if (!term) {
    return (
      <div className="min-h-screen pt-36 pb-28 px-4 text-center space-y-6">
        <h1 className="text-3xl font-bold text-white">Terim Bulunamadı</h1>
        <p className="text-slate-400">Aradığınız terim sözlüğümüzde yer almıyor olabilir.</p>
        <Link to="/sozluk/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-bg-dark font-bold">
          <ArrowLeft className="w-4 h-4" /> Terim Sözlüğüne Dön
        </Link>
      </div>
    );
  }

  const relatedTermObjects = term.relatedTerms
    .map(relSlug => glossaryTerms.find(t => t.slug === relSlug))
    .filter(Boolean);

  const openWhatsApp = () => {
    if (window.trackEvent) {
      window.trackEvent('whatsapp_clicked', { source: `glossary_${term.slug}` });
    }
    const text = isTr
      ? `Merhaba, sitenizdeki "${term.title}" terimiyle ilgili projemizde bir darboğaz yaşıyoruz. Acil teknik triyaj desteği alabilir miyiz?`
      : `Hello, we are experiencing an incident related to "${term.title}" on our agency project. We need technical triage support.`;
    window.open(`https://wa.me/905343713573?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 md:px-8 bg-[#080b11] text-slate-200 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#1f293d_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            to="/sozluk/"
            className="text-xs sm:text-sm font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isTr ? '← Terim Sözlüğü Dizini' : '← Glossary Directory'}</span>
          </Link>
          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${term.urgencyColor}`}>
            {term.urgencyLevel}
          </span>
        </div>

        {/* Core Article Header */}
        <div className="space-y-4">
          <span className="text-xs font-mono tracking-widest text-slate-400 uppercase block">
            {isTr ? 'TEKNİK TERİM REHBERİ' : 'TECHNICAL GLOSSARY ITEM'} // {term.slug.toUpperCase()}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {term.title}
          </h1>
          <p className="text-lg sm:text-xl text-cyan-300 font-medium leading-relaxed p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
            {term.shortDef[isTr ? 'tr' : 'en']}
          </p>
        </div>

        {/* Section 1: Agency Impact */}
        <div className="p-7 sm:p-8 rounded-3xl bg-[#111827]/90 border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">
              {isTr ? 'Ajans İçin Ne Anlama Gelir? (İş Etkisi)' : 'What It Means for Your Agency (Business Impact)'}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed pl-7 border-l-2 border-amber-400/50">
            {term.agencyImpact[isTr ? 'tr' : 'en']}
          </p>
        </div>

        {/* Section 2: Urgency & Who Solves */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-[#111827] border border-white/10 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-400" /> {isTr ? 'Ne Zaman Acildir?' : 'When Is It Critical?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {term.urgencyLevel === 'Kritik (P0)'
                ? (isTr ? 'Canlı yayında ciro veya veri kaybı yaşanıyorsa hemen müdahale edilmelidir. Gecikme doğrudan müşteri kaybına yol açar.' : 'Production outage causing active revenue or data loss requires sub-2h remediation.')
                : (isTr ? 'Yayın öncesi veya bir sonraki sprint başında planlı olarak temizlenmelidir.' : 'Should be scheduled during upcoming sprint to prevent compounding technical debt.')}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#111827] border border-white/10 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> {isTr ? 'Kim Çözer?' : 'Who Resolves It?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {term.whoSolves[isTr ? 'tr' : 'en']}
            </p>
          </div>
        </div>

        {/* Section 3: Related Service Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-transparent border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              {isTr ? 'İLGİLİ TMA ÇÖZÜMÜ' : 'RELATED TMA SOLUTION'}
            </span>
            <h3 className="text-lg font-bold text-white">{term.relatedService.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {isTr ? 'Ajansınız adına %100 White-Label ve resmi NDA altında mühendislik desteği.' : '%100 White-Label engineering support under mutual NDA.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={term.relatedService.link}
              className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-bg-dark font-black text-xs sm:text-sm whitespace-nowrap flex items-center gap-2 shadow-lg shadow-cyan-500/25"
            >
              <span>{isTr ? 'Çözümü İncele' : 'View Solution'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={openWhatsApp}
              className="px-4 py-3.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{isTr ? 'Acil SWAT' : 'Emergency SWAT'}</span>
            </button>
          </div>
        </div>

        {/* Section 4: Internal Linking to Related Terms */}
        {relatedTermObjects.length > 0 && (
          <div className="p-7 rounded-3xl bg-[#111827] border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white">
              {isTr ? 'İlgili Diğer Teknik Terimler' : 'Related Technical Concepts'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedTermObjects.map(rel => (
                <Link
                  key={rel.slug}
                  to={`/sozluk/${rel.slug}/`}
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col justify-between space-y-2 group"
                >
                  <strong className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {rel.title}
                  </strong>
                  <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                    {isTr ? 'İncele →' : 'Read →'}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default GlossaryTerm;
