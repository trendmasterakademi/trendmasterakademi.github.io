import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { HelpCircle, ChevronDown, ShieldCheck, Zap, Lock, Code2, Database, Calendar } from 'lucide-react';
import { getCalendlyUrl } from '../utils/calendly';
import { isTurkish } from '../i18n';

export const faqData = [
  {
    id: 'whitelabel-model',
    icon: ShieldCheck,
    question: {
      tr: "Trend Master Akademi'nin White-Label çalışma modeli nasıl işler?",
      en: "How does Trend Master Akademi's White-Label partnership model work?"
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
      tr: "TMA bir şahıs işletmesidir, ancak kriz masası tek kişilik değildir: masada ikinci bir kıdemli mühendis bulunur ve başlayan bir işi o devralır. Kod hiçbir aşamada bizde tutulmaz — repo sizin kontrolünüzdedir, dokümantasyon iş ilerledikçe teslim edilir. Çalışma yarıda kesilse bile ajansınızın elinde çalışan sistem ve eksiksiz kaynak kod kalır.",
      en: "TMA is a sole proprietorship, but the response desk is not a one-person operation: a second senior engineer is on the desk to take over any work already under way. Your code is never held by us either — the repository is under your control and documentation is delivered as the work progresses. Even if an engagement is interrupted, your agency is left with a working system and the complete source."
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
      tr: "Kriz hattı her gün 09:00 – 24:00 arasında açıktır. Canlı kesinti (SEV-0) bildirimlerinde ilk yanıt taahhüdümüz 15 dakikadır; diğer seviyelerin süreleri SLA sayfasında yazılıdır. Bu saatler dışında ulaşan bildirimler ertesi sabah 09:00'da ele alınır.",
      en: "The response desk is open daily between 09:00 and 24:00 (UTC+3). For live-outage (SEV-0) incidents our first-response commitment is 15 minutes; times for other levels are listed on the SLA page. Notifications arriving outside these hours are picked up at 09:00 the next morning."
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
      tr: "Önceki geliştiricinin devretmeden ayrıldığı projelerde; repoyu klonlayarak mimariyi, veri modellerini ve kilitlenen noktaları haritalandırıyoruz. Eksik kalan backend uçlarını tamamlayıp, spagetti kodu modern standartlara refactor ederek dokümante edilmiş şekilde teslim ediyoruz.",
      en: "For stranded projects left without handover; we clone the repository and map architecture, data models, and bottlenecks. We complete missing backend endpoints, refactor tangled spaghetti code to modern standards, and hand over a documented production release."
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
  const isTr = isTurkish(i18n);
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '';
  const [openIdx, setOpenIdx] = useState(0);

  const toggleAccordion = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 md:px-12 bg-[var(--paper)] relative border-b border-[var(--rule)] overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink-2)] text-xs font-mono font-medium uppercase tracking-wider mb-4">
            <HelpCircle className="w-4 h-4 text-[var(--accent)]" /> {isTr ? 'SIKÇA SORULAN SORULAR' : 'FREQUENTLY ASKED QUESTIONS'}
          </div>
          <h2 className="font-serif text-lg sm:text-xl font-semibold text-[var(--ink)] tracking-tight leading-tight">
            <span className="block">
              {isTr ? 'Ajansların En Çok Merak Ettiği' : 'Key Questions from Partner'}
            </span>
            <span className="block text-[var(--ink)]">
              {isTr ? 'Teknik & Operasyonel Sorular' : 'Agencies & Tech Leaders'}
            </span>
          </h2>
          <p className="text-[var(--ink-2)] text-base sm:text-lg mt-4 leading-relaxed">
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
                className={`rounded-[var(--r-panel)] border transition-all duration-200 overflow-hidden ${
                  isOpen 
                    ? 'bg-[var(--surface)] border-[var(--rule-strong)] shadow-sm' 
                    : 'bg-[var(--surface)] border-[var(--rule)] hover:border-[var(--rule-strong)]'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-6 sm:p-7 flex items-center justify-between gap-4 text-left cursor-pointer select-none focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-[var(--r-control)] flex items-center justify-center flex-shrink-0 transition-colors ${
                      isOpen ? 'bg-[var(--paper)] text-[var(--accent)] border border-[var(--rule)]' : 'bg-[var(--paper)] text-[var(--ink-3)] border border-[var(--rule)]'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className={`text-base sm:text-lg font-semibold transition-colors ${
                      isOpen ? 'text-[var(--accent)]' : 'text-[var(--ink)]'
                    }`}>
                      {item.question[isTr ? 'tr' : 'en']}
                    </h3>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-[var(--paper)] text-[var(--accent)]' : 'bg-[var(--paper)] text-[var(--ink-3)]'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <React.Fragment>
                  {isOpen && (
                    <div>
                      <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-1 text-[var(--ink-2)] text-sm sm:text-base leading-relaxed border-t border-[var(--rule)] ml-14 sm:ml-14 space-y-3">
                        <p>{item.answer[isTr ? 'tr' : 'en']}</p>
                        {isHomePage && item.id === 'whitelabel-model' && (
                          <div className="pt-1">
                            <Link 
                              to="/nda/" 
                              className="inline-flex items-center gap-1 text-[var(--accent)] hover:text-[var(--accent-hover)] font-mono text-xs sm:text-sm font-semibold transition-colors min-h-[44px] py-1"
                            >
                              {isTr ? 'Sözleşmeyi okuyun →' : 'Read the agreement →'}
                            </Link>
                          </div>
                        )}
                        {item.id === 'response-time' && (
                          <div className="pt-1">
                            <Link 
                              to="/sla/" 
                              className="inline-flex items-center gap-1 text-[var(--accent)] hover:text-[var(--accent-hover)] font-mono text-xs sm:text-sm font-semibold transition-colors min-h-[44px] py-1"
                            >
                              {isTr ? 'SLA ve Yanıt Taahhütleri →' : 'SLA & Response Commitments →'}
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

        <div className="mt-12 p-6 sm:p-8 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left shadow-sm">
          <div>
            <span className="text-[var(--ink)] font-semibold text-sm sm:text-base block">
              {isTr ? 'Aklınıza takılan farklı bir soru mu var?' : 'Have a different question in mind?'}
            </span>
            <span className="text-[var(--ink-3)] text-xs sm:text-sm">
              {isTr ? 'Kriz masası ve kıdemli mühendislik ekibimizle doğrudan görüşebilirsiniz.' : 'Reach out directly to our senior engineering desk.'}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={getCalendlyUrl('faq_box')}
              target="_blank"
              rel="noreferrer"
              onClick={() => window.trackEvent && window.trackEvent('calendar_clicked', { source: 'faq_box' })}
              className="btn-primary flex items-center gap-2 min-h-[44px]"
            >
              <Calendar className="w-4 h-4" />
              <span>{isTr ? '30 Dakikalık Randevu Seç →' : 'Schedule 30-Min Call →'}</span>
            </a>
            <a
              href="https://wa.me/905343713573?text=Merhaba%2C%20TMA%20hakk%C4%B1nda%20teknik%20bir%20sorum%20var."
              target="_blank"
              rel="noreferrer"
              onClick={() => window.trackEvent && window.trackEvent('whatsapp_clicked', { source: 'faq_box' })}
              className="btn-secondary flex items-center gap-2 min-h-[44px]"
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
