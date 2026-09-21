import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Flame, Server, ShieldCheck, ShieldAlert, Cpu, Smartphone, Database, CheckCircle2, ArrowRight, Zap, Bot, Lock, Code2 
} from 'lucide-react';

const Services = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('swat'); // 'swat' or 'software'

  const swatServices = [
    {
      id: 'rescue',
      titleKey: 'card-rescue-title',
      descKey: 'card-rescue-desc',
      features: ['card-rescue-feat1', 'card-rescue-feat2', 'card-rescue-feat3']
    },
    {
      id: 'hotfix',
      titleKey: 'card-hotfix-title',
      descKey: 'card-hotfix-desc',
      features: ['card-hotfix-feat1', 'card-hotfix-feat2', 'card-hotfix-feat3']
    },
    {
      id: 'capacity',
      titleKey: 'card-capacity-title',
      descKey: 'card-capacity-desc',
      features: ['card-capacity-feat1', 'card-capacity-feat2', 'card-capacity-feat3']
    }
  ];

  const softwareServices = [
    {
      id: 'saas',
      titleKey: 'card-saas-title',
      descKey: 'card-saas-desc',
      features: ['card-saas-feat1', 'card-saas-feat2', 'card-saas-feat3']
    },
    {
      id: 'ai',
      titleKey: 'card-ai-title',
      descKey: 'card-ai-desc',
      features: ['card-ai-feat1', 'card-ai-feat2', 'card-ai-feat3']
    },
    {
      id: 'mobile',
      titleKey: 'card-mobile-title',
      descKey: 'card-mobile-desc',
      features: ['card-mobile-feat1', 'card-mobile-feat2', 'card-mobile-feat3']
    }
  ];

  const activeServices = activeTab === 'swat' ? swatServices : softwareServices;

  return (
    <section id="services" className="py-[136px] px-4 sm:px-6 md:px-12 bg-[var(--paper)] relative border-b border-[var(--rule)]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h4 className="text-xs sm:text-sm font-mono font-medium text-[var(--ink-3)] uppercase tracking-wider mb-3">
            {t('services-subtitle')}
          </h4>
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[var(--ink)] tracking-tight leading-tight mb-6">
            {t('services-title')}
          </h2>
          <p className="text-[var(--ink-2)] text-base sm:text-lg leading-relaxed">
            {t('services-desc')}
          </p>
        </div>

        {/* Dynamic Category Tabs */}
        <div className="flex justify-center mb-14">
          <div className="flex bg-[var(--surface)] p-1 rounded-[var(--r-control)] border border-[var(--rule)] max-w-md w-full justify-between shadow-sm">
            <button 
              onClick={() => setActiveTab('swat')}
              className={`flex-1 py-2.5 px-4 rounded-[var(--r-control)] font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'swat' 
                  ? 'bg-[var(--accent)] text-[var(--on-accent)] shadow-sm' 
                  : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{t('tab-swat-title')}</span>
            </button>
            <button 
              onClick={() => setActiveTab('software')}
              className={`flex-1 py-2.5 px-4 rounded-[var(--r-control)] font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'software' 
                  ? 'bg-[var(--accent)] text-[var(--on-accent)] shadow-sm' 
                  : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>{t('tab-software-title')}</span>
            </button>
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <React.Fragment>
            {activeServices.map((service, index) => (
              <div
                key={service.id}
                className="bg-[var(--surface)] border border-[var(--rule)] rounded-[var(--r-panel)] p-7 md:p-8 hover:border-[var(--rule-strong)] transition-all group flex flex-col justify-between shadow-sm"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-[var(--ink)] font-serif mb-4 group-hover:text-[var(--accent)] transition-colors">
                    {t(service.titleKey)}
                  </h3>
                  <p className="text-[var(--ink-2)] text-sm sm:text-base leading-relaxed mb-8">
                    {t(service.descKey)}
                  </p>
                  
                  <ul className="space-y-3.5 mb-8">
                    {service.features.map((featKey, idx) => (
                      <li key={idx} className="flex items-start text-sm sm:text-base text-[var(--ink)] gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                        <span>{t(featKey)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a 
                  href="#contact"
                  className="btn-secondary w-full cursor-pointer mt-auto flex items-center justify-center gap-2"
                >
                  <span>{t('card-btn-contact')}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </React.Fragment>
        </div>

      </div>
    </section>
  );
};

export default Services;
