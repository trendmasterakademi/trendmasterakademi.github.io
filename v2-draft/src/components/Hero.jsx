import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronRight, Activity } from 'lucide-react';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-6 md:px-12">
      {/* Background abstract elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary w-fit text-sm font-medium">
            <Activity className="w-4 h-4" />
            {t('hero-badge')}
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            {t('hero-title')}
          </h1>
          
          <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
            {t('hero-desc')}
          </p>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <button className="bg-primary text-bg-dark px-8 py-3 rounded-full font-bold hover:bg-white transition-colors flex items-center gap-2">
              {t('btn-explore')}
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-3 rounded-full font-bold border border-white/20 hover:bg-white/5 transition-colors">
              {t('btn-contact')}
            </button>
          </div>
        </motion.div>

        {/* Visual / Simulation Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="glass-panel rounded-2xl p-6 border border-primary/20 overflow-hidden relative group">
            {/* Simulation Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <div className="flex flex-col">
                <span className="text-white font-bold tracking-wider">TMA / DEV-TERMINAL</span>
                <span className="text-xs text-primary font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  {t('ticker-status')}
                </span>
              </div>
            </div>

            {/* Simulated Code / Graph */}
            <div className="h-64 bg-black/40 rounded-xl p-4 font-mono text-sm text-green-400/80 overflow-hidden relative">
              <motion.div 
                animate={{ y: [0, -200] }} 
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="space-y-2"
              >
                <p>{'>'} initializing high-frequency core...</p>
                <p>{'>'} fetching market data streams [OK]</p>
                <p>{'>'} analyzing order blocks...</p>
                <p className="text-primary">{'>'} TRADE EXECUTED: LONG @ 64,230.00</p>
                <p>{'>'} updating telemetry tracking layer...</p>
                <p>{'>'} risk parity calculated.</p>
                <p>{'>'} deploying new nodes...</p>
                <p className="text-yellow-400">{'>'} latency: 0.04ms</p>
              </motion.div>
              
              {/* Overlay gradient to fade out code at bottom */}
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
