import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-16">
        <h4 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">{t('about-badge')}</h4>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('about-title')}</h1>
        <p className="text-slate-400 text-lg max-w-3xl leading-relaxed">
          {t('about-intro-desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-8 rounded-3xl border border-white/10"
        >
          <h3 className="text-2xl font-bold text-white mb-4">1. {t('pillar1-title')}</h3>
          <p className="text-slate-400 mb-6">{t('pillar1-desc')}</p>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-primary rounded-full"></span> {t('pillar1-f1')}</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-primary rounded-full"></span> {t('pillar1-f2')}</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-primary rounded-full"></span> {t('pillar1-f3')}</li>
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-8 rounded-3xl border border-white/10"
        >
          <h3 className="text-2xl font-bold text-white mb-4">2. {t('pillar2-title')}</h3>
          <p className="text-slate-400 mb-6">{t('pillar2-desc')}</p>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-primary rounded-full"></span> {t('pillar2-f1')}</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-primary rounded-full"></span> {t('pillar2-f2')}</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-primary rounded-full"></span> {t('pillar2-f3')}</li>
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-8 rounded-3xl border border-white/10"
        >
          <h3 className="text-2xl font-bold text-white mb-4">3. {t('pillar3-title')}</h3>
          <p className="text-slate-400 mb-6">{t('pillar3-desc')}</p>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-primary rounded-full"></span> {t('pillar3-f1')}</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-primary rounded-full"></span> {t('pillar3-f2')}</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-primary rounded-full"></span> {t('pillar3-f3')}</li>
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-8 rounded-3xl border border-white/10"
        >
          <h3 className="text-2xl font-bold text-white mb-4">4. {t('pillar4-title')}</h3>
          <p className="text-slate-400 mb-6">{t('pillar4-desc')}</p>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-primary rounded-full"></span> {t('pillar4-f1')}</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-primary rounded-full"></span> {t('pillar4-f2')}</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-primary rounded-full"></span> {t('pillar4-f3')}</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
