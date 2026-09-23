import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Download, ArrowLeft, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { setPageSeo } from '../utils/pageTitle';
import { isTurkish } from '../i18n';
import { ndaFullAgreementData } from '../data/ndaFullAgreementData';

const DOT_LINE = '.'.repeat(64);

const Nda = () => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const lang = isTr ? 'tr' : 'en';

  useEffect(() => {
    setPageSeo('/nda/', lang);
  }, [lang]);

  const { pageHeader, whatItGivesYou, protectsUsToo, canItBeChanged, fullAgreementHeader, clauses, signatures, precedenceNotice } = ndaFullAgreementData;

  return (
    <div className="pt-32 pb-28 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto text-[var(--ink)] font-sans">
      
      {/* Header & Back Link */}
      <div className="mb-12">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-[var(--accent)] hover:underline font-mono transition-colors mb-6 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" /> {pageHeader.backLink[lang]}
        </Link>
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-4 h-4" /> {pageHeader.badge[lang]}
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold font-serif text-[var(--ink)] tracking-tight mb-6">
          {pageHeader.h1[lang]}
        </h1>
        
        <p className="text-[var(--ink-muted)] text-base sm:text-lg leading-relaxed">
          {pageHeader.lead[lang]}
        </p>
      </div>

      {/* SECTION 1: Size ne sağlıyor / What it gives you */}
      <section className="mb-14">
        <div className="border-b border-[var(--rule)] pb-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold font-serif text-[var(--ink)]">
            {whatItGivesYou.title[lang]}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {whatItGivesYou.items.map((item, idx) => (
            <div key={idx} className="p-6 rounded bg-[var(--surface)] border border-[var(--rule)] space-y-2 shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold font-serif text-[var(--ink)]">
                {item.title[lang]}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">
                {item.desc[lang]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Protects us too */}
      <section className="mb-14">
        <div className="border-b border-[var(--rule)] pb-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold font-serif text-[var(--ink)]">
            {protectsUsToo.title[lang]}
          </h2>
          <p className="text-[var(--ink-muted)] text-xs sm:text-sm mt-2 leading-relaxed">
            {protectsUsToo.lead[lang]}
          </p>
        </div>

        <div className="space-y-4">
          {protectsUsToo.items.map((item, idx) => (
            <div key={idx} className="p-6 rounded bg-[var(--surface)] border border-[var(--rule)] space-y-2 shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold font-serif text-[var(--ink)]">
                {item.title[lang]}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">
                {item.highlight ? (
                  (() => {
                    const text = item.desc[lang];
                    const hl = item.highlight[lang];
                    const parts = text.split(hl);
                    return (
                      <>
                        {parts[0]}
                        <strong className="text-[var(--ink)]">{hl}</strong>
                        {parts[1]}
                      </>
                    );
                  })()
                ) : (
                  item.desc[lang]
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Can it be changed */}
      <section className="mb-14 p-8 rounded bg-[var(--paper)] border border-[var(--rule)] space-y-4 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-semibold font-serif text-[var(--ink)]">
          {canItBeChanged.title[lang]}
        </h2>
        <div className="space-y-2 text-sm sm:text-base text-[var(--ink)] leading-relaxed">
          <p>{canItBeChanged.paragraphs[0][lang]}</p>
          <p className="text-xs sm:text-sm text-[var(--ink-muted)] font-mono">
            {canItBeChanged.paragraphs[1][lang]}
          </p>
        </div>
      </section>

      {/* SECTION 4: Sözleşmenin tam metni + PDF Download */}
      <section className="mb-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--rule)] pb-6 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold font-serif text-[var(--ink)]">
              {fullAgreementHeader.title[lang]}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--ink-muted)] mt-1 font-mono">
              {fullAgreementHeader.subtitle[lang]}
            </p>
          </div>

          <a
            href={fullAgreementHeader.pdfHref}
            download={fullAgreementHeader.pdfDownloadName}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer flex-shrink-0 min-h-[44px]"
          >
            <Download className="w-4 h-4" />
            <span>{fullAgreementHeader.pdfButton[lang]}</span>
          </a>
        </div>

        {/* Contract Full Text Paper Container */}
        <div className="p-6 sm:p-10 rounded bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink)] space-y-8 text-xs sm:text-sm leading-relaxed font-sans select-text shadow-sm">
          
          <div className="text-center pb-6 border-b border-[var(--rule)] space-y-2">
            <div className="text-base sm:text-lg font-bold font-serif text-[var(--ink)] tracking-wide">
              {fullAgreementHeader.documentTitle}
            </div>
            <p className="text-[var(--ink-muted)] text-xs font-mono">{fullAgreementHeader.documentSubtitle}</p>
          </div>

          {/* 16 Clauses */}
          {clauses.map((clause) => {
            if (clause.num === 1) {
              return (
                <div key={clause.num} className="space-y-3">
                  <h3 className="font-semibold font-serif text-[var(--ink)] text-sm sm:text-base">{clause.title}</h3>
                  <p>{clause.intro}</p>
                  <div className="p-4 rounded bg-[var(--paper)] border border-[var(--rule)] space-y-1 font-mono text-xs">
                    <p className="text-[var(--ink)] font-bold">{clause.serviceProvider.title}</p>
                    {clause.serviceProvider.lines.map((line, lIdx) => (
                      <p key={lIdx}>{line}</p>
                    ))}
                    <p className="text-[var(--ink-muted)] italic">{clause.serviceProvider.suffix}</p>
                  </div>
                  <div className="p-4 rounded bg-[var(--paper)] border border-[var(--rule)] space-y-1.5 font-mono text-xs overflow-hidden">
                    <p className="text-[var(--ink)] font-bold">{clause.client.title}</p>
                    {clause.client.fields.map((field, fIdx) => (
                      <p key={fIdx} className="flex items-baseline gap-1 overflow-hidden">
                        <span className="shrink-0">{field.label}</span>
                        <span className="overflow-hidden whitespace-nowrap text-[var(--ink-muted)] select-none">{DOT_LINE}</span>
                      </p>
                    ))}
                    <p className="text-[var(--ink-muted)] italic pt-0.5">{clause.client.suffix}</p>
                  </div>
                  <p>{clause.outro}</p>
                </div>
              );
            }

            if (clause.num === 3) {
              return (
                <div key={clause.num} className="space-y-3">
                  <h3 className="font-semibold font-serif text-[var(--ink)] text-sm sm:text-base">{clause.title}</h3>
                  <p>{clause.lead1}</p>
                  <ul className="list-none space-y-1 pl-4">
                    {clause.list1.map((item, iIdx) => (
                      <li key={iIdx}>{item}</li>
                    ))}
                  </ul>
                  <p>{clause.lead2}</p>
                  <ul className="list-none space-y-1 pl-4">
                    {clause.list2.map((item, iIdx) => (
                      <li key={iIdx}>{item}</li>
                    ))}
                  </ul>
                </div>
              );
            }

            if (clause.num === 8) {
              return (
                <div key={clause.num} className="space-y-3">
                  <h3 className="font-semibold font-serif text-[var(--ink)] text-sm sm:text-base">{clause.title}</h3>
                  {clause.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                  <ul className="list-none space-y-1 pl-4">
                    {clause.list.map((item, iIdx) => (
                      <li key={iIdx}>{item}</li>
                    ))}
                  </ul>
                  {clause.postParagraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>
              );
            }

            if (clause.num === 9) {
              return (
                <div key={clause.num} className="space-y-3">
                  <h3 className="font-semibold font-serif text-[var(--ink)] text-sm sm:text-base">{clause.title}</h3>
                  {clause.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                  <ul className="list-none space-y-1 pl-4">
                    {clause.list.map((item, iIdx) => (
                      <li key={iIdx}>{item}</li>
                    ))}
                  </ul>
                  {clause.postParagraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>
              );
            }

            return (
              <div key={clause.num} className="space-y-3">
                <h3 className="font-semibold font-serif text-[var(--ink)] text-sm sm:text-base">{clause.title}</h3>
                {clause.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            );
          })}

          {/* İMZA BLOĞU */}
          <div className="pt-6 border-t border-[var(--rule)] space-y-4">
            <h3 className="font-semibold font-serif text-[var(--ink)] text-sm sm:text-base">{signatures.title}</h3>
            <p>{signatures.intro}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 font-mono text-xs">
              <div className="p-4 rounded bg-[var(--paper)] border border-[var(--rule)] space-y-2 overflow-hidden">
                <p className="text-[var(--ink)] font-bold">{signatures.tma.title}</p>
                {signatures.tma.lines.map((line, lIdx) => (
                  <p key={lIdx}>{line}</p>
                ))}
                <div className="pt-2 space-y-1.5">
                  {signatures.tma.fields.map((field, fIdx) => (
                    <p key={fIdx} className="flex items-baseline gap-1 overflow-hidden">
                      <span className="shrink-0">{field.label}</span>
                      <span className="overflow-hidden whitespace-nowrap text-[var(--ink-muted)] select-none">{DOT_LINE}</span>
                    </p>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded bg-[var(--paper)] border border-[var(--rule)] space-y-2 overflow-hidden">
                <p className="text-[var(--ink)] font-bold">{signatures.ajans.title}</p>
                {signatures.ajans.fields.slice(0, 3).map((field, fIdx) => (
                  <p key={fIdx} className="flex items-baseline gap-1 overflow-hidden">
                    <span className="shrink-0">{field.label}</span>
                    <span className="overflow-hidden whitespace-nowrap text-[var(--ink-muted)] select-none">{DOT_LINE}</span>
                  </p>
                ))}
                <div className="pt-2 space-y-1.5">
                  {signatures.ajans.fields.slice(3).map((field, fIdx) => (
                    <p key={fIdx} className="flex items-baseline gap-1 overflow-hidden">
                      <span className="shrink-0">{field.label}</span>
                      <span className="overflow-hidden whitespace-nowrap text-[var(--ink-muted)] select-none">{DOT_LINE}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: ÖNCELİK KAYDI */}
      <section className="p-6 sm:p-8 rounded bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs sm:text-sm leading-relaxed space-y-3">
        <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm sm:text-base">
          <Scale className="w-5 h-5 flex-shrink-0" />
          <span>{precedenceNotice.title[lang]}</span>
        </div>
        {!isTr && (
          <p className="text-xs text-amber-800/80 italic">
            {precedenceNotice.enNotice}
          </p>
        )}
        <p className="text-amber-950 leading-relaxed font-sans">
          {precedenceNotice.text}
        </p>
      </section>

    </div>
  );
};

export default Nda;
