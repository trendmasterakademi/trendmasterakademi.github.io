import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShieldCheck, Flame, Users, Clock, ArrowRight, Zap, Lock, FileCode, Layers } from 'lucide-react';

const AgencySection = () => {
  const { t } = useTranslation();

  return (
    <section id="agency-preview" className="py-[136px] px-4 sm:px-6 md:px-12 bg-[var(--paper)] relative border-b border-[var(--rule)]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink-2)] text-xs font-mono font-medium mb-4">
              <ShieldCheck className="w-4 h-4 text-[var(--accent)]" /> {t('agency-sec-badge')}
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[var(--ink)] tracking-tight leading-tight">
              <span className="block">
                {t('agency-sec-title')}
              </span>
              <span className="block text-[var(--accent)]">
                {t('agency-sec-title-highlight')}
              </span>
            </h2>
          </div>
          <div className="max-w-lg">
            <p className="text-[var(--ink-2)] text-base sm:text-lg leading-relaxed mb-4">
              {t('agency-sec-desc')}
            </p>
            <Link
              to="/agency/"
              className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1.5 group transition-colors min-h-[44px]"
            >
              <span>{t('agency-sec-link')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 4 Agency Scenarios Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Card 1: HTTP 500 Outage */}
          <div className="p-6 sm:p-7 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--rule-strong)] transition-all flex flex-col justify-between group shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-[var(--r-control)] bg-[var(--paper)] border border-[var(--rule)] flex items-center justify-center text-[var(--sev-1)]">
                  <Flame className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-medium text-[var(--sev-1)] bg-[var(--paper)] px-2 py-0.5 rounded border border-[var(--rule)]">
                  {t('crisis-card1-tag')}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-3 group-hover:text-[var(--accent)] transition-colors">
                {t('crisis-card1-title')}
              </h3>
              <p className="text-sm text-[var(--ink-2)] leading-relaxed">
                {t('crisis-card1-desc')}
              </p>
            </div>
            <Link
              to="/crash-test/?senaryo=http500"
              className="mt-6 pt-4 border-t border-[var(--rule)] text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center justify-between transition-colors min-h-[44px]"
            >
              <span>{t('crisis-card1-action')}</span>
            </Link>
          </div>

          {/* Card 2: Handover Hell */}
          <div className="p-6 sm:p-7 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--rule-strong)] transition-all flex flex-col justify-between group shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-[var(--r-control)] bg-[var(--paper)] border border-[var(--rule)] flex items-center justify-center text-[var(--sev-2)]">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-medium text-[var(--sev-2)] bg-[var(--paper)] px-2 py-0.5 rounded border border-[var(--rule)]">
                  {t('crisis-card2-tag')}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-3 group-hover:text-[var(--accent)] transition-colors">
                {t('crisis-card2-title')}
              </h3>
              <p className="text-sm text-[var(--ink-2)] leading-relaxed">
                {t('crisis-card2-desc')}
              </p>
            </div>
            <Link
              to="/crash-test/?senaryo=handover"
              className="mt-6 pt-4 border-t border-[var(--rule)] text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center justify-between transition-colors min-h-[44px]"
            >
              <span>{t('crisis-card2-action')}</span>
            </Link>
          </div>

          {/* Card 3: T-48H Crunch */}
          <div className="p-6 sm:p-7 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--rule-strong)] transition-all flex flex-col justify-between group shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-[var(--r-control)] bg-[var(--paper)] border border-[var(--rule)] flex items-center justify-center text-[var(--sev-3)]">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-medium text-[var(--sev-3)] bg-[var(--paper)] px-2 py-0.5 rounded border border-[var(--rule)]">
                  {t('crisis-card3-tag')}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-3 group-hover:text-[var(--accent)] transition-colors">
                {t('crisis-card3-title')}
              </h3>
              <p className="text-sm text-[var(--ink-2)] leading-relaxed">
                {t('crisis-card3-desc')}
              </p>
            </div>
            <Link
              to="/crash-test/?senaryo=t48h"
              className="mt-6 pt-4 border-t border-[var(--rule)] text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center justify-between transition-colors min-h-[44px]"
            >
              <span>{t('crisis-card3-action')}</span>
            </Link>
          </div>

          {/* Card 4: Capacity Overflow & White-Label Production */}
          <div className="p-6 sm:p-7 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--rule-strong)] transition-all flex flex-col justify-between group shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-[var(--r-control)] bg-[var(--paper)] border border-[var(--rule)] flex items-center justify-center text-[var(--sev-4)]">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-medium text-[var(--sev-4)] bg-[var(--paper)] px-2 py-0.5 rounded border border-[var(--rule)]">
                  {t('crisis-card4-tag')}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-3 group-hover:text-[var(--accent)] transition-colors">
                {t('crisis-card4-title')}
              </h3>
              <p className="text-sm text-[var(--ink-2)] leading-relaxed">
                {t('crisis-card4-desc')}
              </p>
            </div>
            <Link
              to="/crash-test/?senaryo=overflow"
              className="mt-6 pt-4 border-t border-[var(--rule)] text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center justify-between transition-colors min-h-[44px]"
            >
              <span>{t('crisis-card4-action')}</span>
            </Link>
          </div>

        </div>

        {/* Agency Guarantees Banner */}
        <div className="p-6 md:p-8 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] flex flex-wrap items-center justify-between gap-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--ink)]">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[var(--accent)] flex-shrink-0" />
              <span className="font-medium">{t('guarantee-whitelabel')}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-[var(--ink-2)] flex-shrink-0" />
              <span className="font-medium">{t('guarantee-nda')}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <FileCode className="w-5 h-5 text-[var(--ink-2)] flex-shrink-0" />
              <span className="font-medium">{t('guarantee-ownership')}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/crash-test/"
              className="btn-primary flex items-center gap-2"
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
