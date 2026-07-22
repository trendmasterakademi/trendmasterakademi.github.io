import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const Services = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('fintech'); // 'fintech' or 'software'

  const fintechServices = [
    {
      id: 'algo',
      titleKey: 'card-algo-title',
      descKey: 'card-algo-desc',
      features: ['card-algo-feat1', 'card-algo-feat2', 'card-algo-feat3']
    },
    {
      id: 'ind',
      titleKey: 'card-ind-title',
      descKey: 'card-ind-desc',
      features: ['card-ind-feat1', 'card-ind-feat2', 'card-ind-feat3']
    },
    {
      id: 'ment',
      titleKey: 'card-ment-title',
      descKey: 'card-ment-desc',
      features: ['card-ment-feat1', 'card-ment-feat2', 'card-ment-feat3']
    }
  ];

  const softwareServices = [
    {
      id: 'web',
      titleKey: 'card-web-title',
      descKey: 'card-web-desc',
      features: ['card-web-feat1', 'card-web-feat2', 'card-web-feat3']
    },
    {
      id: 'mobile',
      titleKey: 'card-mobile-title',
      descKey: 'card-mobile-desc',
      features: ['card-mobile-feat1', 'card-mobile-feat2', 'card-mobile-feat3']
    },
    {
      id: 'api',
      titleKey: 'card-api-title',
      descKey: 'card-api-desc',
      features: ['card-api-feat1', 'card-api-feat2', 'card-api-feat3']
    }
  ];

  const activeServices = activeTab === 'fintech' ? fintechServices : softwareServices;

  return (
    <section id="services" className="py-24 px-6 md:px-12 bg-bg-dark relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <h4 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">{t('services-subtitle')}</h4>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('services-title')}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">{t('services-desc')}</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
            <button 
              onClick={() => setActiveTab('fintech')}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${activeTab === 'fintech' ? 'bg-primary text-bg-dark' : 'text-slate-300 hover:text-white'}`}
            >
              {t('tab-fintech-title')}
            </button>
            <button 
              onClick={() => setActiveTab('software')}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${activeTab === 'software' ? 'bg-primary text-bg-dark' : 'text-slate-300 hover:text-white'}`}
            >
              {t('tab-software-title')}
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {activeServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass-panel rounded-2xl p-8 hover:border-primary/50 transition-colors group flex flex-col"
              >
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{t(service.titleKey)}</h3>
                <p className="text-slate-400 mb-8 leading-relaxed flex-grow">{t(service.descKey)}</p>
                <ul className="space-y-4 mb-8">
                  {service.features.map((featKey, idx) => (
                    <li key={idx} className="flex items-start text-sm text-slate-300 gap-3" dangerouslySetInnerHTML={{ __html: t(featKey) }}></li>
                  ))}
                </ul>
                <button className="w-full py-3 rounded-xl border border-white/20 font-bold hover:bg-primary hover:text-bg-dark hover:border-primary transition-all">
                  {t('card-btn-info')}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default Services;
