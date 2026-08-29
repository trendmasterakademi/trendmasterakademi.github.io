import React from 'react';
import { useTranslation } from 'react-i18next';
import { caseStudies } from '../data/caseStudiesData';

const CaseStudySection = () => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';

  return (
    <section className="py-24 px-4 sm:px-6 md:px-12 bg-[#06080d] border-t border-white/10 relative font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            {isTr ? 'Gerçek bir vaka' : 'A real case'}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {isTr 
              ? 'Devraldığımız her iş kodda başlar; hepsi kodda bitmez. Bir sistemi kurtarmanın ilk adımı kod yazmak değil, arızanın gerçekten nerede olduğunu bulmaktır.' 
              : "Every job we take on starts in the code; not all of them end there. The first step in rescuing a system isn't writing code — it's finding where the fault actually is."}
          </p>
        </div>

        {/* Case Studies List (Rendered dynamically from array) */}
        <div className="space-y-12">
          {caseStudies.map((caseItem) => (
            <article 
              key={caseItem.id} 
              className="p-6 sm:p-10 rounded-3xl bg-[#0d131f]/90 border border-white/10 space-y-8 shadow-2xl"
            >
              {/* Case Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight border-b border-white/10 pb-4">
                {caseItem.baslik[isTr ? 'tr' : 'en']}
              </h3>

              {/* Case 5 Core Sections */}
              <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
                
                {/* 1. Durum / The situation */}
                <div className="space-y-1.5">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    {isTr ? 'Durum' : 'The situation'}
                  </div>
                  <p className="max-w-[70ch]">
                    {caseItem.durum[isTr ? 'tr' : 'en']}
                  </p>
                </div>

                {/* 2. Teşhis / Diagnosis */}
                <div className="space-y-1.5">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    {isTr ? 'Teşhis' : 'Diagnosis'}
                  </div>
                  <p className="max-w-[70ch]">
                    {caseItem.teshis[isTr ? 'tr' : 'en']}
                  </p>
                </div>

                {/* 3. Kök neden / Root cause */}
                <div className="space-y-1.5">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    {isTr ? 'Kök neden' : 'Root cause'}
                  </div>
                  <p className="max-w-[70ch]">
                    {caseItem.kokNeden[isTr ? 'tr' : 'en']}
                  </p>
                </div>

                {/* 4. Sonuç / Outcome */}
                <div className="space-y-1.5">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    {isTr ? 'Sonuç' : 'Outcome'}
                  </div>
                  <p className="max-w-[70ch]">
                    {caseItem.sonuc[isTr ? 'tr' : 'en']}{' '}
                    <strong className="text-white font-bold">
                      {caseItem.sonuc.highlight[isTr ? 'tr' : 'en']}
                    </strong>
                  </p>
                </div>

                {/* 5. Ajansınız için ne anlama geliyor / What this means for your agency */}
                <div className="p-5 sm:p-6 rounded-2xl bg-cyan-950/20 border-l-4 border-cyan-400 border border-white/5 space-y-2 mt-4">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                    {isTr ? 'Ajansınız için ne anlama geliyor' : 'What this means for your agency'}
                  </div>
                  <p className="text-slate-200 max-w-[70ch] leading-relaxed">
                    {caseItem.ajansIcin[isTr ? 'tr' : 'en']}
                  </p>
                </div>

              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CaseStudySection;
