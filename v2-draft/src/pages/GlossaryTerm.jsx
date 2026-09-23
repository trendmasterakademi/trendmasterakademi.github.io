import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, ShieldCheck, AlertTriangle, 
  HelpCircle, CheckCircle2, PhoneCall, BookOpen, ExternalLink, Zap, Calendar
} from 'lucide-react';
import { glossaryTerms, getGlossaryH1 } from '../data/glossaryData';
import { teshisSummaries } from '../data/teshis/indexSummary';
import { getCalendlyUrl } from '../utils/calendly';
import { setPageSeo } from '../utils/pageTitle';
import { isTurkish } from '../i18n';

const GlossaryTerm = () => {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const navigate = useNavigate();

  const term = glossaryTerms.find(t => t.slug === slug);

  // Dynamic reverse lookup: Diagnostics that reference this term in catalog order (01..20)
  const referencingDiagnostics = term
    ? teshisSummaries.filter(item => item.ilgiliTerimler && item.ilgiliTerimler.includes(term.slug))
    : [];
  const visibleDiagnostics = referencingDiagnostics.slice(0, 4);
  const remainingCount = referencingDiagnostics.length - 4;

  useEffect(() => {
    if (!term) return;

    setPageSeo(isTr ? `/sozluk/${term.slug}/` : `/glossary/${term.slug}/`, isTr ? 'tr' : 'en');

    if (window.trackEvent) {
      window.trackEvent('glossary_term_viewed', { term: term.slug });
    }
  }, [term, isTr]);

  if (!term) {
    return (
      <div className="min-h-screen pt-36 pb-28 px-4 text-center space-y-6 bg-[var(--paper)] text-[var(--ink)]">
        <h1 className="text-3xl font-serif font-semibold text-[var(--ink)]">{isTr ? 'Terim Bulunamadı' : 'Term Not Found'}</h1>
        <p className="text-[var(--ink-light)]">Aradığınız terim sözlüğümüzde yer almıyor olabilir.</p>
        <Link to="/sozluk/" className="btn-primary min-h-[44px] inline-flex items-center gap-2">
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
    const termTitle = isTr ? term.title : (term.titleEn || term.title);
    const text = isTr
      ? `Merhaba, sitenizdeki "${termTitle}" terimiyle ilgili projemizde bir darboğaz yaşıyoruz. Acil teknik triyaj desteği alabilir miyiz?`
      : `Hello, we are experiencing an incident related to "${termTitle}" on our agency project. We need technical triage support.`;
    window.open(`https://wa.me/905343713573?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 md:px-8 bg-[var(--paper)] text-[var(--ink)] relative font-sans selection:bg-[var(--accent)] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[var(--rule)] pb-4">
          <Link
            to={isTr ? "/sozluk/" : "/glossary/"}
            className="text-xs sm:text-sm font-mono text-[var(--accent)] hover:underline flex items-center gap-1.5 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isTr ? '← Terim Sözlüğü Dizini' : '← Glossary Directory'}</span>
          </Link>
          <span className={`text-xs font-mono font-semibold px-3 py-1 rounded-full border ${term.urgencyColor}`}>
            {isTr ? term.urgencyLevel : term.urgencyLevelEn}
          </span>
        </div>

        {/* Core Article Header */}
        <div className="space-y-4">
          <span className="text-xs font-mono tracking-widest text-[var(--ink-muted)] uppercase block">
            {isTr ? 'TEKNİK TERİM REHBERİ' : 'TECHNICAL GLOSSARY ITEM'} // {term.slug.toUpperCase()}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-[var(--ink)] tracking-tight leading-tight">
            {getGlossaryH1(term, isTr ? 'tr' : 'en')}
          </h1>
          <p className="text-lg sm:text-xl text-[var(--ink)] font-medium leading-relaxed p-4 rounded-xl bg-[var(--surface)] border border-[var(--rule)]">
            {term.shortDef[isTr ? 'tr' : 'en']}
          </p>
        </div>

        {/* Section 1: Agency Impact */}
        <div className="p-7 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[var(--tint-warn-ink)]" />
            <h2 className="text-xl font-serif font-semibold text-[var(--ink)]">
              {isTr ? 'Ajans İçin Ne Anlama Gelir? (İş Etkisi)' : 'What It Means for Your Agency (Business Impact)'}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[var(--ink-light)] leading-relaxed pl-7 border-l-2 border-[var(--tint-warn-rule)]">
            {term.agencyImpact[isTr ? 'tr' : 'en']}
          </p>
        </div>

        {/* Section 2: Urgency & Who Solves */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-3">
            <h3 className="text-base font-serif font-semibold text-[var(--ink)] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[var(--accent)]" /> {isTr ? 'Ne Zaman Acildir?' : 'When Is It Critical?'}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--ink-light)] leading-relaxed">
              {term.urgencyLevel === 'Kritik (P0)'
                ? (isTr ? 'Canlı yayında ciro veya veri kaybı yaşanıyorsa hemen müdahale edilmelidir. Gecikme doğrudan müşteri kaybına yol açar.' : 'Production outage causing active revenue or data loss requires sub-2h remediation.')
                : (isTr ? 'Yayın öncesi veya bir sonraki sprint başında planlı olarak temizlenmelidir.' : 'Should be scheduled during upcoming sprint to prevent compounding technical debt.')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-3">
            <h3 className="text-base font-serif font-semibold text-[var(--ink)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--tint-ok-ink)]" /> {isTr ? 'Kim Çözer?' : 'Who Resolves It?'}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--ink-light)] leading-relaxed">
              {term.whoSolves[isTr ? 'tr' : 'en']}
            </p>
          </div>
        </div>

        {/* Reverse Index: Diagnostic Links referencing this Term */}
        {referencingDiagnostics.length > 0 && (
          <div className="p-7 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] shadow-sm space-y-4">
            <h2 className="text-xl font-serif font-semibold text-[var(--ink)]">
              {isTr ? 'Bu terim şu belirtilerde çıkar' : 'This term appears in these symptoms'}
            </h2>
            <div className="space-y-2.5 pl-1 sm:pl-2">
              {visibleDiagnostics.map(diag => {
                const titleText = diag.baslik[isTr ? 'tr' : 'en'] || diag.baslik.tr;
                return (
                  <Link
                    key={diag.slug}
                    to={isTr ? `/teshis/${diag.slug}/` : `/diagnostic/${diag.slug}/`}
                    className="group flex items-center gap-2 text-sm sm:text-base text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors min-h-[44px]"
                  >
                    <span className="text-[var(--accent)] font-mono font-semibold">→</span>
                    <span className="font-mono text-[var(--accent)] font-semibold">{diag.no}</span>
                    <span className="text-[var(--ink-muted)] font-mono">·</span>
                    <span className="group-hover:underline underline-offset-4">{titleText}</span>
                  </Link>
                );
              })}
              {remainingCount > 0 && (
                <div className="pt-2">
                  <Link
                    to={isTr ? "/teshis/" : "/diagnostic/"}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-[var(--accent)] hover:underline transition-colors font-semibold min-h-[44px]"
                  >
                    <span>{isTr ? `ve ${remainingCount} teşhis daha →` : `and ${remainingCount} more diagnostics →`}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 3: Related Service Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase">
              {isTr ? 'İLGİLİ TMA ÇÖZÜMÜ' : 'RELATED TMA SOLUTION'}
            </span>
            <h3 className="text-lg font-serif font-semibold text-[var(--ink)]">
              {typeof term.relatedService.title === 'object' ? term.relatedService.title[isTr ? 'tr' : 'en'] : term.relatedService.title}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--ink-light)]">
              {isTr ? 'Ajansınız adına %100 White-Label ve resmi NDA altında mühendislik desteği.' : '100% White-Label engineering support under mutual NDA.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={term.relatedService.link}
              className="btn-primary min-h-[44px] text-xs sm:text-sm whitespace-nowrap flex items-center gap-2"
            >
              <span>{isTr ? 'Çözümü İncele' : 'View Solution'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={openWhatsApp}
              className="btn-secondary min-h-[44px] text-xs sm:text-sm flex items-center gap-2 text-[var(--tint-ok-ink)] cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{isTr ? 'Acil SWAT' : 'Emergency SWAT'}</span>
            </button>
            <a
              href={getCalendlyUrl('glossary_term', { utm_campaign: term.slug })}
              target="_blank"
              rel="noreferrer"
              onClick={() => window.trackEvent && window.trackEvent('calendar_clicked', { source: 'glossary_term', term: term.slug })}
              className="btn-secondary min-h-[44px] font-mono text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap"
            >
              <span>{isTr ? '30 Dakikalık Teknik Tanışma →' : '30-Minute Technical Intro →'}</span>
            </a>
          </div>
        </div>

        {/* Section 4: Internal Linking to Related Terms */}
        {relatedTermObjects.length > 0 && (
          <div className="p-7 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-4">
            <h3 className="text-base font-serif font-semibold text-[var(--ink)]">
              {isTr ? 'İlgili Diğer Teknik Terimler' : 'Related Technical Concepts'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedTermObjects.map(rel => (
                <Link
                  key={rel.slug}
                  to={isTr ? `/sozluk/${rel.slug}/` : `/glossary/${rel.slug}/`}
                  className="p-4 rounded-xl bg-[var(--paper)] hover:bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--accent)] transition-all flex flex-col justify-between space-y-2 group min-h-[44px]"
                >
                  <strong className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                    {isTr ? rel.title : (rel.titleEn || rel.title.split(' (')[0])}
                  </strong>
                  <span className="text-xs font-mono text-[var(--accent)] flex items-center gap-1">
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
