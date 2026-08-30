import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { HelpCircle, ChevronDown, ShieldCheck, Zap, Lock, Code2, Database, Calendar } from 'lucide-react';
import { getCalendlyUrl } from '../utils/calendly';

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
    id: 'continuity-guarantee',
    icon: Lock,
    question: {
      tr: "Projeyi yürüten kişi ulaşılamaz olursa ne oluyor?",
      en: "What happens if the engineer running my project becomes unavailable?"
    },
    answer: {
      tr: "Kriz masası tek kişilik değildir; başlayan bir işi masadaki bir başkası devralır. Ayrıca kod hiçbir aşamada bizde tutulmaz — repo sizin kontrolünüzdedir, dokümantasyon iş ilerledikçe teslim edilir. Çalışma yarıda kesilse bile ajansınızın elinde çalışan sistem ve eksiksiz kaynak kod kalır.",
      en: "The response desk is not a single person; another member of the desk takes over work already under way. Your code is never held by us either — the repository is under your control and documentation is delivered as the work progresses. Even if an engagement is interrupted, your agency is left with a working system and the complete source."
    }
  },
  {
    id: 'sla-response',
    icon: Zap,
    question: {
      tr: "Acil kod kurtarmada süreç nasıl işliyor?",
      en: "How does the emergency code rescue process work?"
    },
    answer: {
      tr: "Canlı sistem kesintilerinde (HTTP 500, veritabanı kilitlenmesi, ödeme API kopması) önce repoyu izole bir sandbox ortamına alır, teşhisi orada yaparız. Teşhis ve sabit bedel birlikte iletilir. Süre taahhüdü vermiyoruz — her arızanın kapsamı farklıdır ve tutulamayacak bir söz vermek işe yaramaz.",
      en: "For live production outages (HTTP 500, database deadlocks, payment API failures), we first isolate the repository into a sandbox environment and perform the diagnosis there. Diagnosis and fixed fee are delivered together. We do not provide time commitments — the scope of each incident differs, and making promises that cannot be kept helps no one."
    }
  },
  {
    id: 'response-time',
    icon: Zap,
    question: {
      tr: "Acil bir durumda ne kadar sürede dönüş alırım?",
      en: "How quickly will I get a response in an emergency?"
    },
    answer: {
      tr: "Kriz hattı her gün 09:00 – 24:00 arasında açıktır; acil bildirimlere tipik ilk yanıt süremiz 15 dakikadır. Bu saatler dışında ulaşan bildirimler ertesi sabah 09:00'da ele alınır.",
      en: "The response desk is open daily between 09:00 and 24:00 (UTC+3); our typical first reply to an emergency is 15 minutes. Notifications arriving outside these hours are picked up at 09:00 the following morning."
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
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '';
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

                <React.Fragment>
                  {isOpen && (
                    <div>
                      <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-1 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-white/5 ml-14 sm:ml-14 space-y-3">
                        <p>{item.answer[isTr ? 'tr' : 'en']}</p>
                        {isHomePage && item.id === 'whitelabel-model' && (
                          <div className="pt-1">
                            <Link 
                              to="/nda/" 
                              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono text-xs sm:text-sm font-bold transition-colors"
                            >
                              {isTr ? 'Sözleşmeyi okuyun →' : 'Read the agreement →'}
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="text-white font-bold text-sm sm:text-base block">
              {isTr ? 'Aklınıza takılan farklı bir soru mu var?' : 'Have a different question in mind?'}
            </span>
            <span className="text-slate-400 text-xs sm:text-sm">
              {isTr ? 'Kriz masası ve kıdemli mühendislik ekibimizle doğrudan görüşebilirsiniz.' : 'Reach out directly to our senior engineering desk.'}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={getCalendlyUrl('faq_box')}
              target="_blank"
              rel="noreferrer"
              onClick={() => window.trackEvent && window.trackEvent('calendar_clicked', { source: 'faq_box' })}
              className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-bg-dark font-bold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Calendar className="w-4 h-4" />
              <span>{isTr ? '30 Dakikalık Randevu Seç →' : 'Schedule 30-Min Call →'}</span>
            </a>
            <a
              href="https://wa.me/905343713573?text=Merhaba%2C%20TMA%20hakk%C4%B1nda%20teknik%20bir%20sorum%20var."
              target="_blank"
              rel="noreferrer"
              onClick={() => window.trackEvent && window.trackEvent('whatsapp_clicked', { source: 'faq_box' })}
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-400 font-bold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-2"
            >
              <span>{isTr ? 'WhatsApp’tan Sorun →' : 'Ask on WhatsApp →'}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
