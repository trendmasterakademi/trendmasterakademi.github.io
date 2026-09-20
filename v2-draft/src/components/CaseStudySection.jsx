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
    <section id="cases" className="py-20 md:py-28 px-4 sm:px-6 md:px-12 bg-[#06080d] border-b border-white/10 relative font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Stethoscope className="w-4 h-4" /> {isTr ? 'GERÇEK VAKA ANALİZLERİ & POST-MORTEM' : 'AUTHENTIC CASE POST-MORTEMS'}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-white tracking-tight leading-tight">
            <span className="block">
              {isTr ? 'Kriz Anında Neler Yaşandı?' : 'What Actually Happened in the Crisis?'}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              {isTr ? 'Sahadan Gerçek Mühendislik Raporları' : 'Field Engineering Post-Mortem Records'}
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {isTr 
              ? 'Devraldığımız her iş kodda başlar; hepsi kodda bitmez. Bir sistemi kurtarmanın ilk adımı aceleyle kod yazmak değil, arızanın ve sürecin gerçek kök nedenini bulmaktır.' 
              : "Every rescue we take on begins in the code; not all end there. The first step in saving a system isn't frantic coding — it's isolating the exact operational root cause."}
          </p>
        </div>

        {/* Case Navigation Tabs */}
        <div className="flex flex-col sm:flex-row gap-3 border-b border-white/10 pb-4">
          {caseStudies.map((item, idx) => {
            const isActive = activeCaseIndex === idx;
            return (
              <button
                key={item.id}
                onClick={() => setActiveCaseIndex(idx)}
                className={`flex-1 p-4 rounded-2xl text-left border transition-all cursor-pointer font-mono text-xs sm:text-sm ${
                  isActive
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-[0_0_20px_rgba(0,229,255,0.15)] ring-1 ring-cyan-500/30'
                    : 'bg-[#0d131f]/70 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold mb-1">
                  {isTr ? `VAKA 0${idx + 1}` : `CASE 0${idx + 1}`}
                </div>
                <div className="font-bold line-clamp-2">
                  {item.baslik[isTr ? 'tr' : 'en']}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Case Article */}
        <article className="p-6 sm:p-10 rounded-3xl bg-[#0d131f]/90 border border-white/10 space-y-8 shadow-2xl relative overflow-hidden">
          
          {/* Case Header */}
          <div className="border-b border-white/10 pb-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
              <FileCheck className="w-4 h-4" />
              <span>{isTr ? 'DOĞRULANMIŞ TMA OPERASYONU' : 'VERIFIED TMA POST-MORTEM'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
              {activeCase.baslik[isTr ? 'tr' : 'en']}
            </h3>
          </div>

          {/* Incident Timeline Visual */}
          {activeCase.timeline && (
            <div className="space-y-3 pt-2">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isTr ? 'Operasyonel Zaman Çizelgesi (T-Minus Timeline)' : 'Operational Response Timeline'}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {activeCase.timeline.map((step, sIdx) => (
                  <div key={sIdx} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1 font-mono text-xs">
                    <span className="text-cyan-400 font-bold text-[11px] block">{step.time}</span>
                    <span className="text-slate-300 leading-snug block">{step.label[isTr ? 'tr' : 'en']}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Case 5 Core Sections */}
          <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed pt-2">
            
            {/* 1. Durum */}
            <div className="space-y-1.5">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                {isTr ? 'Durum' : 'The Situation'}
              </div>
              <p className="max-w-[75ch]">
                {activeCase.durum[isTr ? 'tr' : 'en']}
              </p>
            </div>

            {/* 2. Teşhis */}
            <div className="space-y-1.5">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                {isTr ? 'Teşhis' : 'Diagnosis'}
              </div>
              <p className="max-w-[75ch]">
                {activeCase.teshis[isTr ? 'tr' : 'en']}
              </p>
            </div>

            {/* 3. Kök Neden */}
            <div className="space-y-1.5">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                {isTr ? 'Kök Neden' : 'Root Cause'}
              </div>
              <p className="max-w-[75ch]">
                {activeCase.kokNeden[isTr ? 'tr' : 'en']}
              </p>
            </div>

            {/* 4. Sonuç */}
            <div className="space-y-1.5">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                {isTr ? 'Sonuç' : 'Outcome'}
              </div>
              <p className="max-w-[75ch]">
                {activeCase.sonuc[isTr ? 'tr' : 'en']}{' '}
                <strong className="text-emerald-400 font-bold font-mono block sm:inline mt-1 sm:mt-0">
                  {activeCase.sonuc.highlight[isTr ? 'tr' : 'en']}
                </strong>
              </p>
            </div>

            {/* 5. Ajansınız İçin Anlamı */}
            <div className="p-5 sm:p-6 rounded-2xl bg-cyan-950/20 border-l-4 border-cyan-400 border border-white/5 space-y-2 mt-4">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                {isTr ? 'Ajansınız İçin Ne Anlama Geliyor?' : 'What This Means for Your Agency'}
              </div>
              <p className="text-slate-200 max-w-[75ch] leading-relaxed">
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
