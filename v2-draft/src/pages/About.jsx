import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Code2, Zap, Cpu, CheckCircle2, ArrowRight, UserCheck } from 'lucide-react';

const About = () => {
  const { t, i18n } = useTranslation();
  const isTr = i18n.language !== 'en';

  React.useEffect(() => {
    document.title = isTr
      ? "Mühendislik Standartlarımız & Hakkımızda | Trend Master Akademi"
      : "Engineering Standards & About Us | Trend Master Academy";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", isTr
        ? "Trend Master Akademi mühendislik standartları, 4 temel prensip ve B2B SWAT vizyonu."
        : "Trend Master Academy engineering standards, 4 core pillars, and B2B technical SWAT vision."
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://trendmasterakademi.com/about/');
    }
  }, [isTr]);

  return (
    <div className="pt-32 pb-28 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto text-slate-200">
      
      {/* Header */}
      <div className="mb-16 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-4 h-4" /> {isTr ? 'MÜHENDİSLİK STANDARTLARI & HAKKIMIZDA' : 'ENGINEERING STANDARDS & ABOUT US'}
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
          {isTr ? 'Ajansların Güvendiği Arka Plan Mühendislik Masası' : 'The Invisible Engineering Power Trusted by Agencies'}
        </h1>
        <p className="text-slate-300 text-base sm:text-lg md:text-xl leading-relaxed">
          {isTr 
            ? 'Trend Master Akademi Studio & Labs; modern web, SaaS, API mimarileri ve acil kod kurtarma (SWAT) alanında çalışan teknik bir B2B yazılım stüdyosudur.' 
            : 'Trend Master Academy Studio & Labs is a technical software studio specializing in modern web, SaaS architectures, API integrations, and emergency code SWAT rescues.'}
        </p>
      </div>

      {/* 4 Pillars of TMA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-8 rounded-3xl border border-white/10 bg-[#111827]/70 space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-lg border border-cyan-500/30">
            01
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {isTr ? '%100 White-Label & Görünmezlik' : '100% White-Label & Invisibility'}
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {isTr 
              ? 'Müşterileriniz ile asla doğrudan temas kurmayız. İster ajansınızın kurumsal e-postasıyla ekibiniz gibi çalışırız, ister tamamen görünmez bir arka plan masası oluruz.' 
              : 'We never contact your clients directly. We operate either under your agency brand email or as an entirely invisible background engineering bench.'}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-8 rounded-3xl border border-white/10 bg-[#111827]/70 space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-lg border border-emerald-500/30">
            02
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {isTr ? 'Resmi NDA & Tam Mülkiyet' : 'Strict NDA & Total Ownership'}
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {isTr 
              ? 'Projeye başlamadan önce bağlayıcı Gizlilik Sözleşmesi (NDA) imzalanır. Geliştirilen tüm kaynak kodlar, mimari ve fikri mülkiyet %100 ajansınıza ve müşterinize aittir.' 
              : 'Prior to work, a binding NDA is executed. All source code, architecture, and IP belong 100% to your agency and client.'}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-8 rounded-3xl border border-white/10 bg-[#111827]/70 space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-lg border border-amber-500/30">
            03
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {isTr ? 'Şeffaf Ücretlendirme' : 'Transparent Pricing'}
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {isTr 
              ? 'İlk kod teşhisi ve triyaj ücretsizdir. Sonraki çalışmanın kapsamı ve bedeli, teşhis tamamlandıktan sonra işe özel olarak belirlenir ve çalışma başlamadan önce yazılı olarak netleşir.' 
              : 'Initial code triage is free. Scope and pricing for subsequent work are tailored after diagnosis and established in writing before work begins.'}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-8 rounded-3xl border border-white/10 bg-[#111827]/70 space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono font-bold text-lg border border-purple-500/30">
            04
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {isTr ? 'Doğrudan Mühendislik Masası Muhatabı' : 'Direct Senior Engineering Contact'}
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {isTr 
              ? 'Arada teknik bilgisi olmayan satış temsilcileri veya bürokrasi katmanları yoktur. İletişim doğrudan projeyi yürüten kıdemli mühendislik masamız üzerinden anlık yürütülür.' 
              : 'No non-technical sales reps or bureaucratic middlemen. You communicate directly with the senior engineering desk executing your project in real-time.'}
          </p>
        </motion.div>

      </div>

      {/* Direct CTA */}
      <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#111827] via-[#0d131f] to-[#151f33] border border-cyan-500/30 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
          {isTr ? 'Projelerinizde Teknik Olarak Yalnız Değilsiniz.' : 'You Are Never Alone on the Technical Front.'}
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          {isTr 
            ? '15-20 dakikalık kısa bir online tanışma görüşmesi yaparak ihtiyaç anında kiminle iletişime geçeceğinizi netleştirelim.' 
            : 'Schedule a brief 15-20 minute introductory call so you know exactly who to call when a critical technical crunch arises.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/agency"
            className="px-7 py-4 rounded-2xl bg-cyan-500 text-bg-dark font-black text-sm sm:text-base hover:bg-cyan-400 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <span>{isTr ? 'Ajans Çözüm Modelini İncele' : 'Explore Agency Solution Model'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/crash-test"
            className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-sm sm:text-base transition-colors flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>{isTr ? 'Crash Test Simülasyonu (60sn)' : 'Run Crash Test (60s)'}</span>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default About;
