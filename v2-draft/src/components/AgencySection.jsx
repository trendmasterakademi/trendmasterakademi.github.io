import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShieldCheck, Flame, Users, Clock, ArrowRight, Zap, Lock, FileCode } from 'lucide-react';
import TypewriterText from './TypewriterText';

const AgencySection = () => {
  const { t } = useTranslation();

  return (
    <section id="agency-preview" className="py-20 md:py-28 px-4 sm:px-6 md:px-12 bg-[#0a0f18] relative border-y border-white/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4" /> {t('agency-sec-badge')}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-white tracking-tight leading-tight">
              <span className="block">
                <TypewriterText text={t('agency-sec-title')} speed={35} delay={100} showCursor={false} />
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                <TypewriterText text={t('agency-sec-title-highlight')} speed={35} delay={1050} cursorColor="text-cyan-400" />
              </span>
            </h2>
          </div>
          <div className="max-w-lg">
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-4">
              {t('agency-sec-desc')}
            </p>
            <Link
              to="/agency"
              className="text-sm font-mono font-bold text-cyan-400 hover:text-white flex items-center gap-1.5 group transition-colors"
            >
              <span>{t('agency-sec-link')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 3 Crisis Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: HTTP 500 Outage */}
          <div className="p-7 rounded-3xl bg-[#111827] border border-red-500/30 hover:border-red-500/60 transition-all flex flex-col justify-between group shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                  <Flame className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded border border-red-500/20">
                  {t('crisis-card1-tag')}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                {t('crisis-card1-title')}
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {t('crisis-card1-desc')}
              </p>
            </div>
            <Link
              to="/crash-test"
              className="mt-8 pt-4 border-t border-white/10 text-sm font-bold text-red-400 hover:text-white flex items-center justify-between transition-colors"
            >
              <span>{t('crisis-card1-action')}</span>
            </Link>
          </div>

          {/* Card 2: Handover Hell */}
          <div className="p-7 rounded-3xl bg-[#111827] border border-amber-500/30 hover:border-amber-500/60 transition-all flex flex-col justify-between group shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                  {t('crisis-card2-tag')}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                {t('crisis-card2-title')}
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {t('crisis-card2-desc')}
              </p>
            </div>
            <Link
              to="/crash-test"
              className="mt-8 pt-4 border-t border-white/10 text-sm font-bold text-amber-400 hover:text-white flex items-center justify-between transition-colors"
            >
              <span>{t('crisis-card2-action')}</span>
            </Link>
          </div>

          {/* Card 3: T-48H Crunch */}
          <div className="p-7 rounded-3xl bg-[#111827] border border-cyan-500/30 hover:border-cyan-500/60 transition-all flex flex-col justify-between group shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                  {t('crisis-card3-tag')}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                {t('crisis-card3-title')}
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {t('crisis-card3-desc')}
              </p>
            </div>
            <Link
              to="/crash-test"
              className="mt-8 pt-4 border-t border-white/10 text-sm font-bold text-cyan-400 hover:text-white flex items-center justify-between transition-colors"
            >
              <span>{t('crisis-card3-action')}</span>
            </Link>
          </div>

        </div>

        {/* Agency Guarantees Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-200">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <span className="font-semibold">{t('guarantee-whitelabel')}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="font-semibold">{t('guarantee-nda')}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <FileCode className="w-5 h-5 text-orange-400 flex-shrink-0" />
              <span className="font-semibold">{t('guarantee-ownership')}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/crash-test"
              className="px-6 py-3 rounded-full bg-cyan-500 text-bg-dark font-bold text-sm hover:bg-cyan-400 transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{t('guarantee-runtest')}</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AgencySection;
