import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { caseStudies } from '../data/caseStudiesData';
import { ShieldAlert, CheckCircle2, Clock, ArrowRight, FileCheck, Stethoscope } from 'lucide-react';
import { isTurkish } from '../i18n';

const CaseStudySection = () => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);

  const activeCase = caseStudies[activeCaseIndex];

  return (
    <section id="cases" className="py-24 px-4 sm:px-6 md:px-12 bg-[var(--paper)] border-b border-[var(--rule)] relative font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink-2)] text-xs font-mono font-medium uppercase tracking-wider">
            <Stethoscope className="w-4 h-4 text-[var(--accent)]" /> {isTr ? 'GERÇEK VAKA ANALİZLERİ & POST-MORTEM' : 'AUTHENTIC CASE POST-MORTEMS'}
          </div>
          <h2 className="font-serif text-lg sm:text-xl font-semibold text-[var(--ink)] tracking-tight leading-tight">
            <span className="block">
              {isTr ? 'Kriz Anında Neler Yaşandı?' : 'What Actually Happened in the Crisis?'}
            </span>
            <span className="block text-[var(--ink)]">
              {isTr ? 'Sahadan Gerçek Mühendislik Raporları' : 'Field Engineering Post-Mortem Records'}
            </span>
          </h2>
          <p className="text-[var(--ink-2)] text-base sm:text-lg leading-relaxed">
            {isTr 
              ? 'Devraldığımız her iş kodda başlar; hepsi kodda bitmez. Bir sistemi kurtarmanın ilk adımı aceleyle kod yazmak değil, arızanın ve sürecin gerçek kök nedenini bulmaktır.' 
              : "Every rescue we take on begins in the code; not all end there. The first step in saving a system isn't frantic coding — it's isolating the exact operational root cause."}
          </p>
        </div>

        {/* Case Navigation Tabs */}
        <div className="flex flex-col sm:flex-row gap-3 border-b border-[var(--rule)] pb-4">
          {caseStudies.map((item, idx) => {
            const isActive = activeCaseIndex === idx;
            return (
              <button
                key={item.id}
                onClick={() => setActiveCaseIndex(idx)}
                className={`flex-1 p-4 rounded-[var(--r-panel)] text-left border transition-all cursor-pointer font-mono text-xs sm:text-sm ${
                  isActive
                    ? 'bg-[var(--surface)] border-[var(--accent)] text-[var(--ink)] shadow-sm ring-1 ring-[var(--accent)]'
                    : 'bg-[var(--surface)] border-[var(--rule)] text-[var(--ink-2)] hover:border-[var(--rule-strong)] hover:text-[var(--ink)]'
                }`}
              >
                <div className="text-xs uppercase tracking-wider text-[var(--accent)] font-medium mb-1">
                  {isTr ? `VAKA 0${idx + 1}` : `CASE 0${idx + 1}`}
                </div>
                <div className="font-semibold line-clamp-2">
                  {item.baslik[isTr ? 'tr' : 'en']}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Case Article */}
        <article className="p-6 sm:p-10 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] space-y-8 shadow-sm relative overflow-hidden">
          
          {/* Case Header */}
          <div className="border-b border-[var(--rule)] pb-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] font-medium">
              <FileCheck className="w-4 h-4" />
              <span>{isTr ? 'DOĞRULANMIŞ TMA OPERASYONU' : 'VERIFIED TMA POST-MORTEM'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[var(--ink)] font-serif tracking-tight">
              {activeCase.baslik[isTr ? 'tr' : 'en']}
            </h3>
          </div>

          {/* Incident Timeline Visual */}
          {activeCase.timeline && (
            <div className="space-y-3 pt-2">
              <div className="text-xs font-mono font-medium uppercase tracking-wider text-[var(--ink-3)] flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>{isTr ? 'Operasyonel Zaman Çizelgesi' : 'Operational Response Timeline'}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {activeCase.timeline.map((step, sIdx) => (
                  <div key={sIdx} className="p-3 rounded-[var(--r-control)] bg-[var(--paper)] border border-[var(--rule)] space-y-1 font-mono text-xs">
                    <span className="text-[var(--accent)] font-semibold text-xs block">{step.time}</span>
                    <span className="text-[var(--ink-2)] leading-snug block">{step.label[isTr ? 'tr' : 'en']}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Case 5 Core Sections */}
          <div className="space-y-6 text-[var(--ink-2)] text-sm sm:text-base leading-relaxed pt-2">
            
            {/* 1. Durum */}
            <div className="space-y-1.5">
              <div className="text-xs font-mono font-medium uppercase tracking-wider text-[var(--ink-3)]">
                {isTr ? 'Durum' : 'The Situation'}
              </div>
              <p className="max-w-[34rem]">
                {activeCase.durum[isTr ? 'tr' : 'en']}
              </p>
            </div>

            {/* 2. Teşhis */}
            <div className="space-y-1.5">
              <div className="text-xs font-mono font-medium uppercase tracking-wider text-[var(--ink-3)]">
                {isTr ? 'Teşhis' : 'Diagnosis'}
              </div>
              <p className="max-w-[34rem]">
                {activeCase.teshis[isTr ? 'tr' : 'en']}
              </p>
            </div>

            {/* 3. Kök Neden */}
            <div className="space-y-1.5">
              <div className="text-xs font-mono font-medium uppercase tracking-wider text-[var(--ink-3)]">
                {isTr ? 'Kök Neden' : 'Root Cause'}
              </div>
              <p className="max-w-[34rem]">
                {activeCase.kokNeden[isTr ? 'tr' : 'en']}
              </p>
            </div>

            {/* 4. Sonuç */}
            <div className="space-y-1.5">
              <div className="text-xs font-mono font-medium uppercase tracking-wider text-[var(--ink-3)]">
                {isTr ? 'Sonuç' : 'Outcome'}
              </div>
              <p className="max-w-[34rem]">
                {activeCase.sonuc[isTr ? 'tr' : 'en']}{' '}
                <strong className="text-[var(--ink)] font-semibold font-mono block sm:inline mt-1 sm:mt-0">
                  {activeCase.sonuc.highlight[isTr ? 'tr' : 'en']}
                </strong>
              </p>
            </div>

            {/* 5. Ajansınız İçin Anlamı */}
            <div className="p-5 sm:p-6 rounded-[var(--r-panel)] bg-[var(--paper)] border-l-4 border-[var(--accent)] border-y border-r border-[var(--rule)] space-y-2 mt-4">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent)]">
                {isTr ? 'Ajansınız İçin Ne Anlama Geliyor?' : 'What This Means for Your Agency'}
              </div>
              <p className="text-[var(--ink)] max-w-[34rem] leading-relaxed">
                {activeCase.ajansIcin[isTr ? 'tr' : 'en']}
              </p>
            </div>

          </div>

        </article>

      </div>
    </section>
  );
};

export default CaseStudySection;
