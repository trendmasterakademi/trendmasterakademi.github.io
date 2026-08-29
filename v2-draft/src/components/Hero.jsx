import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Zap, ArrowRight, CheckCircle2, Calendar
} from 'lucide-react';
import { getCalendlyUrl } from '../utils/calendly';

const diagnosticLogs = [
  {
    no: '#01',
    log: 'SQLSTATE[40001]: Serialization failure: 1213 Deadlock found',
    title: {
      tr: '#01 · Aynı stok iki müşteriye satıldı',
      en: '#01 · Same stock sold to two customers'
    },
    href: '/teshis/ayni-stok-iki-musteriye-satildi/'
  },
  {
    no: '#04',
    log: 'Lock wait timeout exceeded; try restarting transaction',
    title: {
      tr: '#04 · İşlemler kilitlendi, sayfa dönüp duruyor',
      en: '#04 · Transactions locked, page is spinning'
    },
    href: '/teshis/islemler-kilitlendi-sayfa-donuyor/'
  },
  {
    no: '#07',
    log: '502 Bad Gateway · upstream prematurely closed connection',
    title: {
      tr: '#07 · Site 500 veriyor, dün çalışıyordu',
      en: '#07 · Site returns 500, worked yesterday'
    },
    href: '/teshis/site-500-veriyor-dun-calisiyordu/'
  },
  {
    no: '#10',
    log: 'NET::ERR_CERT_DATE_INVALID',
    title: {
      tr: '#10 · SSL süresi doldu, tarayıcı uyarı veriyor',
      en: '#10 · SSL expired, browser warning'
    },
    href: '/teshis/ssl-suresi-doldu/'
  },
  {
    no: '#12',
    log: 'HTTP 429 Too Many Requests',
    title: {
      tr: '#12 · Entegrasyon aniden 429 vermeye başladı',
      en: '#12 · Integration suddenly throwing 429'
    },
    href: '/teshis/entegrasyon-429-veriyor/'
  },
  {
    no: '#13',
    log: 'Out of memory: Killed process',
    title: {
      tr: '#13 · Sunucu her gün yeniden başlatılıyor',
      en: '#13 · Server restarted every day'
    },
    href: '/teshis/sunucu-her-gun-yeniden-baslatiliyor/'
  },
  {
    no: '#18',
    log: 'SMTP error 535 Authentication failed',
    title: {
      tr: '#18 · Form gönderiliyor ama mail gelmiyor',
      en: '#18 · Form submits but no email arrives'
    },
    href: '/teshis/form-gonderiliyor-mail-gelmiyor/'
  },
  {
    no: '#19',
    log: 'robots.txt → Disallow: /',
    title: {
      tr: '#19 · Site aramalarda görünmez oldu',
      en: '#19 · Site became invisible in search'
    },
    href: '/teshis/site-aramalarda-gorunmez-oldu/'
  }
];

// Desktop: 4 distinct pairs from different diagnostic families
const desktopPairs = [
  // Pair 1: #01 (Database) + #10 (SSL/Security)
  [diagnosticLogs[0], diagnosticLogs[3]],
  // Pair 2: #04 (Lock/Performance) + #18 (Email/Integration)
  [diagnosticLogs[1], diagnosticLogs[6]],
  // Pair 3: #07 (Server/Gateway) + #19 (SEO/Search)
  [diagnosticLogs[2], diagnosticLogs[7]],
  // Pair 4: #12 (API/Rate Limit) + #13 (Memory/Infra)
  [diagnosticLogs[4], diagnosticLogs[5]]
];

const Hero = () => {
  const { t, i18n } = useTranslation();
  const isTr = i18n.language !== 'en';
  const [isDesktop, setIsDesktop] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [displayCounterIndex, setDisplayCounterIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Reset index when switching viewport mode
  useEffect(() => {
    setActiveCardIndex(0);
    setDisplayCounterIndex(0);
  }, [isDesktop]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return;
    }

    if (isPaused) return;

    const total = isDesktop ? desktopPairs.length : diagnosticLogs.length;
    const duration = isDesktop ? 6000 : 4500;

    const interval = setInterval(() => {
      setActiveCardIndex((prev) => {
        const next = (prev + 1) % total;
        setTimeout(() => {
          setDisplayCounterIndex(next);
        }, 350);
        return next;
      });
    }, duration);

    return () => clearInterval(interval);
  }, [isPaused, isDesktop]);

  const currentTotal = isDesktop ? desktopPairs.length : diagnosticLogs.length;

  return (
    <section id="hero" className="relative pt-20 pb-14 sm:pt-28 md:pt-32 md:pb-24 lg:pt-32 overflow-hidden px-4 sm:px-6 md:px-12 w-full max-w-full">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] sm:max-w-[800px] h-[450px] sm:h-[700px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/12 to-purple-600/15 rounded-full blur-[110px] sm:blur-[140px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start w-full">
        
        {/* Left Column: Value Proposition */}
        <div className="lg:col-span-6 flex flex-col gap-5 sm:gap-6 self-start">
          {/* Studio & Availability Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs sm:text-sm font-mono font-bold shadow-[0_0_20px_rgba(0,229,255,0.15)]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>B2B Technical SWAT & White-Label Engineering</span>
            </div>
            <span className="text-xs font-mono text-slate-400">İzmir · Uzaktan (TR / EN)</span>
          </div>
          
          {/* Main Hook Headline */}
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[2.6rem] xl:text-[3rem] font-black font-mono leading-[1.18] tracking-tight text-white">
            <span className="block text-slate-200">
              {isTr ? 'Teknik olarak projesi tıkanmış' : 'For Agencies with Blocked Projects:'}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">
              {isTr ? 'ajanslar için:' : 'Code Taken Over & Rescued,'}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-300 to-amber-400 text-[0.88em]">
              {isTr ? 'Kodu Devralır, Ajansınız Adına Eksiksiz Teslim Ederiz.' : 'Delivered Flawlessly Under Your Agency Brand.'}
            </span>
          </h1>
          
          {/* Body Description */}
          <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
            {isTr 
              ? 'Bir projede teknik olarak tıkandığınızda, teslim tarihi yaklaştığında veya müşteriniz özel bir SaaS mimarisi istediğinde: %100 White-Label, resmi NDA ve doğrudan kıdemli mühendislik masası.' 
              : 'When you are technically blocked, facing tight delivery crunches, or building custom SaaS pipelines: 100% White-Label, binding NDA protection, and direct senior engineering execution.'}
          </p>

          {/* Above-the-fold Guarantees */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-mono text-slate-300 py-1">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> %100 White-Label
            </span>
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Resmi NDA Güvencesi
            </span>
            <span className="flex items-center gap-1.5 text-amber-300 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Tam Kod Mülkiyeti
            </span>
            <span className="flex items-center gap-1.5 text-purple-300 font-bold">
              <CheckCircle2 className="w-4 h-4" /> İlk Teşhis Ücretsiz
            </span>
          </div>
          
          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 w-full sm:w-auto">
            <Link
              to="/crash-test/"
              onClick={() => window.trackEvent && window.trackEvent('crash_test_clicked', { source: 'hero_cta' })}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-bg-dark px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl font-black text-sm sm:text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 min-h-[48px] w-full sm:w-auto text-center"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>{isTr ? 'Kodunuzu 60sn’de Değerlendirin' : 'Evaluate Code in 60s'}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href={getCalendlyUrl('hero')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => window.trackEvent && window.trackEvent('calendar_clicked', { source: 'hero' })}
              className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base border border-white/20 hover:bg-white/5 text-white transition-all flex items-center justify-center gap-2 min-h-[48px] w-full sm:w-auto text-center"
            >
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span>{isTr ? '30 Dakikalık Teknik Tanışma — Takvimden Seçin' : 'Book a 30-Minute Technical Intro'}</span>
            </a>
          </div>

          {/* Quick Trust Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-5 border-t border-white/10 max-w-xl text-center sm:text-left">
            <div>
              <strong className="block text-sm sm:text-lg lg:text-xl font-black text-white">14+ Yıl</strong>
              <span className="text-[10px] sm:text-xs text-slate-400">
                {isTr ? 'Yazılım & Mimari Deneyimi' : 'Engineering Experience'}
              </span>
            </div>
            <div>
              <strong className="block text-sm sm:text-lg lg:text-xl font-black text-cyan-400">40+ Repo</strong>
              <span className="text-[10px] sm:text-xs text-slate-400">
                {isTr ? 'Devralınan & Çözülen Kod' : 'Codebases Rescued'}
              </span>
            </div>
            <div>
              <strong className="block text-sm sm:text-lg lg:text-xl font-black text-emerald-400">
                {isTr ? '20 Teşhis' : '20 Diagnostics'}
              </strong>
              <span className="text-[10px] sm:text-xs text-slate-400">
                {isTr ? 'Yayınlanmış Arıza Kataloğu' : 'Published Fault Catalog'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Rotating Real Diagnostic Logs Block */}
        <div className="lg:col-span-6 relative w-full self-start lg:sticky lg:top-28 z-20 mt-4 lg:mt-0">
          <div 
            className="p-[2px] rounded-2xl sm:rounded-3xl bg-gradient-to-br from-cyan-400/50 via-blue-500/30 to-emerald-400/40 shadow-[0_0_50px_rgba(0,229,255,0.15)] transition-all"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
          >
            <div className="bg-[#080c16]/98 backdrop-blur-2xl rounded-[18px] sm:rounded-[22px] p-5 sm:p-7 border border-white/10 relative overflow-hidden">
              
              {/* Top Header Label */}
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3.5 mb-5">
                <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  {isTr ? 'SİSTEMİNİZDE BUNU GÖRÜYORSANIZ' : 'IF YOU SEE THIS IN YOUR SYSTEM'}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {displayCounterIndex + 1} / {currentTotal}
                  </span>
                </div>
              </div>

              {/* Rotating Logs Container (All 8 links rendered in DOM for SEO and Accessibility) */}
              {isDesktop ? (
                /* Desktop: 4 Pairs of 2 stacked cards */
                <div className="relative min-h-[220px] flex items-center">
                  {desktopPairs.map((pair, idx) => {
                    const isActive = activeCardIndex === idx;
                    return (
                      <div
                        key={idx}
                        className={`transition-opacity duration-300 w-full flex flex-col gap-3 ${
                          isActive 
                            ? 'opacity-100 relative pointer-events-auto z-10' 
                            : 'opacity-0 absolute inset-0 pointer-events-none -z-10'
                        }`}
                        aria-hidden={!isActive}
                      >
                        {pair.map((item, pIdx) => (
                          <Link
                            key={pIdx}
                            to={item.href}
                            className="block group p-3.5 sm:p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-cyan-500/40 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          >
                            <div className="font-mono text-xs sm:text-sm text-cyan-300 font-semibold mb-1.5 leading-snug break-words">
                              {item.log}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 group-hover:text-white transition-colors">
                              <span className="text-cyan-400">→</span>
                              <span className="group-hover:underline underline-offset-4">
                                {isTr ? item.title.tr : item.title.en}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Mobile: 8 Individual cards */
                <div className="relative min-h-[140px] flex items-center">
                  {diagnosticLogs.map((item, idx) => {
                    const isActive = activeCardIndex === idx;
                    return (
                      <div
                        key={idx}
                        className={`transition-opacity duration-300 w-full ${
                          isActive 
                            ? 'opacity-100 relative pointer-events-auto z-10' 
                            : 'opacity-0 absolute inset-0 pointer-events-none -z-10'
                        }`}
                        aria-hidden={!isActive}
                      >
                        <Link
                          to={item.href}
                          className="block group p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-cyan-500/40 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        >
                          <div className="font-mono text-xs sm:text-sm text-cyan-300 font-semibold mb-3 leading-snug break-words">
                            {item.log}
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-slate-300 group-hover:text-white transition-colors">
                            <span className="text-cyan-400">→</span>
                            <span className="group-hover:underline underline-offset-4">
                              {isTr ? item.title.tr : item.title.en}
                            </span>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bottom Catalog Link */}
              <div className="pt-3.5 mt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                <Link
                  to="/teshis/"
                  className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded"
                >
                  <span>{isTr ? 'Tüm Teşhis Kataloğunu İncele (20 Belirti)' : 'Explore All Diagnostics (20 Symptoms)'}</span>
                  <span>→</span>
                </Link>
                <span className="text-slate-500 text-[11px] hidden sm:inline">
                  {isTr ? 'İlk teşhis ücretsiz' : 'First diagnosis free'}
                </span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;

