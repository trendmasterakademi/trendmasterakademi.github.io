import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Zap, ArrowRight, CheckCircle2, Calendar
} from 'lucide-react';
import { getCalendlyUrl } from '../utils/calendly';
import { isTurkish } from '../i18n';

export const diagnosticLogs = [
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
  const isTr = isTurkish(i18n);
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
    <section id="hero" className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden px-4 sm:px-6 md:px-12 w-full max-w-full bg-[var(--paper)]">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
        
        {/* Left Column: Value Proposition */}
        <div className="lg:col-span-6 flex flex-col gap-5 sm:gap-6 self-start">
          {/* Studio & Availability Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--r-control)] border border-[var(--rule)] bg-[var(--surface)] text-[var(--ink-2)] text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-[var(--sev-ok-dot)]"></span>
              <span className="label-caps">{t('hero-badge', 'INCIDENT TRIAGE & SYSTEMS ARCHITECTURE // KERNEL DESK')}</span>
            </div>
            <span className="text-xs text-[var(--ink-3)]">
              {isTr ? 'İzmir · Uzaktan (TR / EN)' : 'İzmir · Remote (TR / EN)'}
            </span>
          </div>
          
          {/* Main Hook Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-serif font-semibold leading-[1.2] text-[var(--ink)]">
            <span className="block text-[var(--ink)]">
              {t('hero-title-line1', isTr ? 'Kritik Sistem Kesintileri,' : 'Critical Systems Outages,')}
            </span>
            <span className="block text-[var(--ink)]">
              {t('hero-title-line2', isTr ? 'Kilitlenen Kod Tabanları:' : 'Locked Codebases:')}
            </span>
            <span className="block text-[var(--accent)] mt-1">
              {t('hero-title-highlight', isTr ? 'Çekirdek Seviyesinde Mühendislik Müdahalesi.' : 'Kernel-Level Engineering Triage.')}
            </span>
          </h1>
          
          {/* Body Description */}
          <p className="text-base sm:text-lg text-[var(--ink-2)] leading-relaxed max-w-[68ch] font-normal">
            {t('hero-desc', isTr 
              ? "Yüksek eşzamanlılık (concurrency), veritabanı kilitlenmeleri (deadlock), kopan ödeme pipeline'ları ve devralınması gereken dokümantasyonsuz kod tabanları için derin operasyonel mühendislik masası. Sessiz, izole ve tamamen görünmez." 
              : "Deep operational engineering desk for high concurrency, database deadlocks, severed payment pipelines, and undocumented stranded codebases. Silent, isolated, and completely invisible.")}
          </p>

          {/* Above-the-fold Guarantees */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm text-[var(--ink-2)] py-1">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /> {isTr ? '%100 White-Label' : '100% White-Label'}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /> {isTr ? 'Resmi NDA Güvencesi' : 'Binding NDA'}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /> {isTr ? 'Tam Kod Mülkiyeti' : 'Full Code Ownership'}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /> {isTr ? 'İlk Teşhis Ücretsiz' : 'First Diagnosis Free'}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /> {isTr ? 'Kriz Hattı 09:00 – 24:00' : 'Response Desk 09:00 – 24:00'}
            </span>
          </div>
          
          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 w-full sm:w-auto">
            <Link
              to="/crash-test/"
              onClick={() => window.trackEvent && window.trackEvent('crash_test_clicked', { source: 'hero_cta' })}
              className="btn-primary min-h-[44px]"
            >
              <Zap className="w-4 h-4" />
              <span>{t('btn-crashtest', isTr ? 'Sistem Arızasını Teşhis Edin (Simulator)' : 'Diagnose System Failure (Simulator)')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={getCalendlyUrl('hero')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => window.trackEvent && window.trackEvent('calendar_clicked', { source: 'hero' })}
              className="btn-secondary min-h-[44px]"
            >
              <Calendar className="w-4 h-4 text-[var(--ink-3)]" />
              <span>{isTr ? '30 Dakikalık Teknik Triyaj — Takvimden Seçin' : 'Book a 30-Minute Technical Triage'}</span>
            </a>
          </div>

          {/* Quick Trust Metrics Bar */}
          <div className="grid grid-cols-3 gap-4 pt-5 border-t border-[var(--rule)] max-w-xl text-left">
            <div>
              <strong className="block text-xl font-serif font-semibold text-[var(--ink)] tabular">
                {isTr ? '14+ Yıl' : '14+ Years'}
              </strong>
              <span className="text-xs text-[var(--ink-3)]">
                {isTr ? 'Yazılım & Mimari Deneyimi' : 'Engineering Experience'}
              </span>
            </div>
            <div>
              <strong className="block text-xl font-serif font-semibold text-[var(--ink)] tabular">40+ Repo</strong>
              <span className="text-xs text-[var(--ink-3)]">
                {isTr ? 'Devralınan & Çözülen Kod' : 'Codebases Rescued'}
              </span>
            </div>
            <div>
              <strong className="block text-xl font-serif font-semibold text-[var(--ink)] tabular">
                {isTr ? '20 Teşhis' : '20 Diagnostics'}
              </strong>
              <span className="text-xs text-[var(--ink-3)]">
                {isTr ? 'Yayınlanmış Arıza Kataloğu' : 'Published Fault Catalog'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Rotating Real Diagnostic Logs Block (Technical Terminal) */}
        <div className="lg:col-span-6 relative w-full self-start lg:sticky lg:top-28 z-20 mt-4 lg:mt-0">
          <div 
            className="rounded-[var(--r-panel)] bg-[var(--term-bg)] border border-[var(--rule-strong)] shadow-sm overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
          >
            <div className="p-5 sm:p-6 text-[var(--term-ink)]">
              
              {/* Terminal Header: Source & File Context instead of fake traffic lights */}
              <div className="flex items-center justify-between gap-2 border-b border-[var(--term-dim)]/30 pb-3 mb-4 font-mono text-xs text-[var(--term-dim)]">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--term-accent)] font-semibold">tma://telemetry</span>
                  <span>—</span>
                  <span className="uppercase tracking-wider text-xs font-sans font-medium text-[var(--term-ink)]">
                    {isTr ? 'SİSTEMİNİZDE BUNU GÖRÜYORSANIZ' : 'IF YOU SEE THIS IN YOUR SYSTEM'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--term-dim)]">
                  <span>{displayCounterIndex + 1}/{currentTotal}</span>
                </div>
              </div>

              {/* Rotating Logs Container */}
              {isDesktop ? (
                /* Desktop: 4 Pairs of 2 stacked cards */
                <div className="relative min-h-[220px] flex items-center">
                  {desktopPairs.map((pair, idx) => {
                    const isActive = activeCardIndex === idx;
                    return (
                      <div
                        key={idx}
                        className={`transition-opacity duration-200 w-full flex flex-col gap-3 ${
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
                            className="block p-3.5 rounded-[var(--r-control)] bg-[var(--term-bg)] hover:bg-[var(--term-bg-2)] border border-[var(--term-dim)]/30 hover:border-[var(--term-accent)]/60 transition-colors"
                          >
                            <div className="font-mono text-xs sm:text-sm text-[var(--term-accent)] mb-1.5 leading-snug break-words">
                              {item.log}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-sans text-[var(--term-ink)] hover:text-[var(--term-bright)] transition-colors">
                              <span>→</span>
                              <span className="underline underline-offset-4">
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
                        className={`transition-opacity duration-200 w-full ${
                          isActive 
                            ? 'opacity-100 relative pointer-events-auto z-10' 
                            : 'opacity-0 absolute inset-0 pointer-events-none -z-10'
                        }`}
                        aria-hidden={!isActive}
                      >
                        <Link
                          to={item.href}
                          className="block p-3.5 rounded-[var(--r-control)] bg-[var(--term-bg)] hover:bg-[var(--term-bg-2)] border border-[var(--term-dim)]/30 hover:border-[var(--term-accent)]/60 transition-colors"
                        >
                          <div className="font-mono text-xs sm:text-sm text-[var(--term-accent)] mb-2 leading-snug break-words">
                            {item.log}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-sans text-[var(--term-ink)] hover:text-[var(--term-bright)] transition-colors">
                            <span>→</span>
                            <span className="underline underline-offset-4">
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
              <div className="pt-3 mt-4 border-t border-[var(--term-dim)]/30 flex items-center justify-between text-xs font-sans text-[var(--term-dim)]">
                <Link
                  to="/teshis/"
                  className="text-[var(--term-accent)] hover:underline font-medium inline-flex items-center gap-1.5 min-h-[44px] py-[13px] -my-[13px]"
                >
                  <span>{isTr ? 'Tüm Teşhis Kataloğunu İncele (20 Belirti)' : 'Explore All Diagnostics (20 Symptoms)'}</span>
                  <span>→</span>
                </Link>
                <span className="hidden sm:inline">
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

