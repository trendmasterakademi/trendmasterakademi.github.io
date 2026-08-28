import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HelpCircle, ChevronDown, ShieldCheck, Zap, Lock, Code2, Database } from 'lucide-react';

export const faqData = [
  {
    id: 'whitelabel-model',
    icon: ShieldCheck,
    question: {
      tr: "Trend Master Akademi'nin White-Label çalışma modeli nasıl işler?",
      en: "How does Trend Master Academy's White-Label partnership model work?"
    },
    answer: {
      tr: "Ajansınızla resmi Gizlilik Sözleşmesi (NDA) imzalayarak çalışıyoruz. Müşterileriniz ile asla doğrudan temas kurmuyoruz; dilerseniz ajansınızın kurumsal e-posta adresiyle veya tamamen görünmez bir arka plan mühendislik masası olarak projelerinizi teslim ediyoruz. Tüm kaynak kodlar ve fikri mülkiyet hakları %100 ajansınıza aittir.",
      en: "We operate under a legally binding Mutual NDA. We never contact your clients directly; we build either under your agency's domain email or as an invisible backline engineering squad. All source code and IP rights belong 100% to your agency."
    }
  },
  {
    id: 'sla-response',
    icon: Zap,
    question: {
      tr: "Acil kod kurtarma (Incident SWAT) müdahale süresi (SLA) nedir?",
      en: "What is the response SLA for emergency code rescue (Incident SWAT)?"
    },
    answer: {
      tr: "Canlı sistem kesintilerinde (HTTP 500, veritabanı kilitlenmesi, ödeme API kopması), 0-2 saat içinde repoyu izole sandbox ortamına alarak acil triyaj ve ilk hotfix müdahalesini başlatıyoruz. Kritik lansman darboğazlarında (T-48h) aynı gün içinde kıdemli geliştirici kapasite takviyesi devreye girer.",
      en: "For live production outages (HTTP 500, DB deadlocks, payment API failures), we isolate the repository into a sandbox within 0-2 hours for immediate triage and hotfix dispatch. For T-48h launch crunches, we deploy same-day senior engineering surge capacity."
    }
  },
  {
    id: 'abandoned-code',
    icon: Code2,
    question: {
      tr: "Yarım kalan veya dokümantasyonsuz spagetti projeleri nasıl devralıyorsunuz?",
      en: "How do you take over undocumented or abandoned spaghetti codebases?"
    },
    answer: {
      tr: "Önceki geliştiricinin devretmeden ayrıldığı projelerde; repoyu klonlayarak mimariyi, veri modellerini ve kilitlenen noktaları haritalandırıyoruz. Eksik kalan backend uçlarını tamamlayıp, spagetti kodu modern standartlara refactor ederek eksiksiz dokümante edilmiş şekilde teslim ediyoruz.",
      en: "For stranded projects left without handover; we clone the repository and map architecture, data models, and bottlenecks. We complete missing backend endpoints, refactor tangled spaghetti code to modern standards, and hand over a fully documented production release."
    }
  },
  {
    id: 'ip-ownership',
    icon: Lock,
    question: {
      tr: "Geliştirilen kodların ve sistemin fikri mülkiyeti (IP) kime ait olur?",
      en: "Who owns the intellectual property and source code of the project?"
    },
    answer: {
      tr: "Geliştirilen tüm kaynak kodlar, veritabanı şemaları, API konfigürasyonları ve dokümantasyon %100 sizin ajansınıza ve müşterinize aittir. Herhangi bir telif, lisans veya bağımlılık hakkı talep edilmez.",
      en: "100% of all developed source code, database schemas, API configurations, and documentation belong exclusively to your agency and client. Zero recurring vendor-lock or licensing claims."
    }
  },
  {
    id: 'tech-stack',
    icon: Database,
    question: {
      tr: "Hangi teknoloji yığınlarında (Tech Stack) uzman desteği veriyorsunuz?",
      en: "Which technology stacks do you provide senior engineering support for?"
    },
    answer: {
      tr: "Modern web ve backend dünyasının lider teknolojileri: React, Next.js, Node.js, Python / FastAPI, PostgreSQL, Redis, Docker, Flutter, Stripe / iyzico ödeme webhookları ve OpenAI / LLM yapay zeka agent entegrasyonlarında kıdemli mühendislik desteği sağlıyoruz.",
      en: "Leading modern web & backend technologies: React, Next.js, Node.js, Python / FastAPI, PostgreSQL, Redis, Docker, Flutter, Stripe / iyzico webhook architectures, and enterprise OpenAI / LLM agent automations."
    }
  }
];

const FAQ = () => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';
  const [openIdx, setOpenIdx] = useState(0);

  const toggleAccordion = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 md:py-28 px-4 sm:px-6 md:px-12 bg-[#090d15] relative border-b border-white/10 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-4 h-4" /> {isTr ? 'SIKÇA SORULAN SORULAR' : 'FREQUENTLY ASKED QUESTIONS'}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-white tracking-tight leading-tight">
            <span className="block">
              {isTr ? 'Ajansların En Çok Merak Ettiği' : 'Key Questions from Partner'}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
              {isTr ? 'Teknik & Operasyonel Sorular' : 'Agencies & Tech Leaders'}
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
            {isTr 
              ? 'White-label çalışma disiplini, gizlilik protokolleri ve acil kod müdahale süreçlerimiz hakkında tüm detaylar.' 
              : 'Detailed operational transparency on our white-label protocols, NDAs, and emergency intervention SLAs.'}
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, idx) => {
            const isOpen = openIdx === idx;
            const IconComponent = item.icon;

            return (
              <div 
                key={item.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'bg-[#111827] border-cyan-500/40 shadow-[0_0_30px_rgba(0,229,255,0.1)]' 
                    : 'bg-[#0d131f]/70 border-white/10 hover:border-white/20 hover:bg-[#0d131f]'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-6 sm:p-7 flex items-center justify-between gap-4 text-left cursor-pointer select-none focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      isOpen ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-white/5 text-slate-400 border border-white/10'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className={`text-base sm:text-lg font-bold transition-colors ${
                      isOpen ? 'text-cyan-300' : 'text-white'
                    }`}>
                      {item.question[isTr ? 'tr' : 'en']}
                    </h3>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-slate-400'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-1 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-white/5 ml-14 sm:ml-14">
                        {item.answer[isTr ? 'tr' : 'en']}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="text-white font-bold text-sm sm:text-base block">
              {isTr ? 'Aklınıza takılan farklı bir soru mu var?' : 'Have a different question in mind?'}
            </span>
            <span className="text-slate-400 text-xs sm:text-sm">
              {isTr ? 'Kriz masası ve kıdemli mühendislik ekibimizle doğrudan görüşebilirsiniz.' : 'Reach out directly to our senior engineering desk.'}
            </span>
          </div>
          <a
            href="https://wa.me/905343713573?text=Merhaba%2C%20TMA%20hakk%C4%B1nda%20teknik%20bir%20sorum%20var."
            target="_blank"
            rel="noreferrer"
            onClick={() => window.trackEvent && window.trackEvent('whatsapp_clicked', { source: 'faq_box' })}
            className="px-6 py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-bold text-xs sm:text-sm transition-all whitespace-nowrap"
          >
            {isTr ? 'WhatsApp’tan Sorun →' : 'Ask on WhatsApp →'}
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
