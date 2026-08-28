import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
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
    <section id="services" className="py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-bg-dark relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h4 className="text-cyan-400 font-mono font-bold tracking-widest uppercase text-xs sm:text-sm mb-3">
            {t('services-subtitle')}
          </h4>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-white mb-6">
            {t('services-title')}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {t('services-desc')}
          </p>
        </div>

        {/* Dynamic Category Tabs */}
        <div className="flex justify-center mb-14">
          <div className="flex bg-white/5 p-1.5 rounded-full border border-white/10 max-w-md w-full justify-between">
            <button 
              onClick={() => setActiveTab('swat')}
              className={`flex-1 py-3 px-4 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'swat' 
                  ? 'bg-cyan-500 text-bg-dark shadow-lg shadow-cyan-500/25' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{t('tab-swat-title')}</span>
            </button>
            <button 
              onClick={() => setActiveTab('software')}
              className={`flex-1 py-3 px-4 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'software' 
                  ? 'bg-cyan-500 text-bg-dark shadow-lg shadow-cyan-500/25' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>{t('tab-software-title')}</span>
            </button>
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {activeServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, delay: index * 0.1 }}
                className="glass-panel rounded-3xl p-7 md:p-8 hover:border-cyan-500/50 transition-all group flex flex-col justify-between bg-[#111827]/70 shadow-xl"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                    {t(service.titleKey)}
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                    {t(service.descKey)}
                  </p>
                  
                  <ul className="space-y-3.5 mb-8">
                    {service.features.map((featKey, idx) => (
                      <li key={idx} className="flex items-start text-sm sm:text-base text-slate-200 gap-3">
                        <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>{t(featKey)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a 
                  href="#contact"
                  className="w-full py-3.5 rounded-2xl border border-white/20 font-bold text-sm sm:text-base text-center hover:bg-cyan-500 hover:text-bg-dark hover:border-cyan-500 transition-all flex items-center justify-center gap-2 cursor-pointer mt-auto"
                >
                  <span>{t('card-btn-contact')}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default Services;
