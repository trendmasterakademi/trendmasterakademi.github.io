import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Zap, Download, PhoneCall, ArrowRight, ArrowLeft, 
  X, ZoomIn, CheckCircle2, FileText, ChevronLeft, ChevronRight,
  ExternalLink, Lock, AlertTriangle, Sparkles
} from 'lucide-react';
import { agencyKitData } from '../data/agencyKitData';
import { isTurkish } from '../i18n';

export default function AgencyKit() {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const data = isTr ? agencyKitData.tr : agencyKitData.en;

  // Lightbox state for slide inspection
  const [activeSlideIndex, setActiveSlideIndex] = useState(null);
  const [isPosterLightboxOpen, setIsPosterLightboxOpen] = useState(false);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeSlideIndex !== null) {
        if (e.key === 'Escape') setActiveSlideIndex(null);
        if (e.key === 'ArrowRight') setActiveSlideIndex((prev) => (prev + 1) % 8);
        if (e.key === 'ArrowLeft') setActiveSlideIndex((prev) => (prev - 1 + 8) % 8);
      }
      if (isPosterLightboxOpen && e.key === 'Escape') {
        setIsPosterLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSlideIndex, isPosterLightboxOpen]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (activeSlideIndex !== null || isPosterLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeSlideIndex, isPosterLightboxOpen]);

  return (
    <div className="min-h-screen bg-[#060911] text-slate-200 pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-cyan-500 selection:text-black">
      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-24">
        
        {/* ========================================================
            HERO SECTION: TMA AGENCY KIT // VISUAL RELEASE
        ======================================================== */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>TMA AGENCY KIT // 2026 OFFICIAL RELEASE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-mono tracking-tight leading-tight">
            {isTr ? (
              <>
                Ajanslar İçin <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Müdahale & Hazırlık</span> Kiti
              </>
            ) : (
              <>
                Official <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Agency Incident</span> & Readiness Kit
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {isTr 
              ? "Dijital ajansların görünmeyen kıdemli teknik masası. 8 Slaytlık Response Kit ve 60 Saniyelik Crash Test 500 posteri ile teknik kriz protokollerinizi şimdi güvenceye alın."
              : "The invisible senior engineering desk for digital agencies. Fortify your technical crisis protocols with the 8-Slide Response Kit and 60-Second Crash Test 500 poster."
            }
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 font-mono text-xs sm:text-sm">
            <a
              href="#response-kit"
              className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-2 transition-all shadow-[0_0_25px_rgba(0,229,255,0.3)] hover:scale-[1.02] cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isTr ? '8 Slaytlık Kiti İncele' : 'Explore 8-Slide Kit'}</span>
            </a>

            <a
              href="#crash-test-poster"
              className="px-5 py-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-rose-400" />
              <span>{isTr ? 'Crash Test 500 Posteri' : 'Crash Test 500 Poster'}</span>
            </a>

            <a
              href="/agency-kit/tma-agency-response-kit.pdf"
              download="TMA-Agency-Response-Kit.pdf"
              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-semibold flex items-center gap-2 transition-all cursor-pointer"
              title={isTr ? "Response Kit PDF'ini İndir" : "Download Response Kit PDF"}
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>{isTr ? 'PDF İndir (8 Sayfa)' : 'Download PDF (8 Pgs)'}</span>
            </a>
          </div>
        </section>

        {/* ========================================================
            SECTION 1: 8-SLIDE RESPONSE KIT VISUAL GALLERY
        ======================================================== */}
        <section id="response-kit" className="space-y-8 scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-6 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                01 // AGENCY RESPONSE KIT
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">
                {data.responseKit.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                {data.responseKit.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <a
                href="/agency-kit/tma-agency-response-kit.pdf"
                download="TMA-Agency-Response-Kit.pdf"
                className="px-3.5 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/60 transition-colors flex items-center gap-2 font-bold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isTr ? 'Orijinal PDF (8 Slayt)' : 'Original PDF (8 Slides)'}</span>
              </a>
            </div>
          </div>

          {/* 8 Slide Graphic Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((slideNum, idx) => {
              const slideInfo = data.responseKit.slides[idx];
              return (
                <div
                  key={slideNum}
                  onClick={() => setActiveSlideIndex(idx)}
                  className="group relative rounded-2xl bg-[#0a0f1c] border border-white/10 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col shadow-lg hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] hover:-translate-y-1"
                >
                  {/* Slide Visual Container */}
                  <div className="relative aspect-square w-full bg-[#050811] overflow-hidden">
                    <img
                      src={`/agency-kit/response-kit-slide-${slideNum}.png`}
                      alt={`TMA Agency Response Kit Slide ${slideNum}: ${slideInfo.title}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Hover Overlay with Zoom Icon */}
                    <div className="absolute inset-0 bg-cyan-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4 text-center backdrop-blur-[2px]">
                      <span className="w-10 h-10 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <ZoomIn className="w-5 h-5" />
                      </span>
                      <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                        {isTr ? 'Büyüt & İncele' : 'Inspect Slide'}
                      </span>
                    </div>

                    {/* Top Slide Number Badge */}
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 font-mono text-[10px] font-bold text-cyan-400">
                      SLIDE 0{slideNum}
                    </div>
                  </div>

                  {/* Card Description */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2 bg-[#0d1322]">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                        {slideInfo.tag}
                      </span>
                      <h3 className="text-sm font-bold text-white font-mono group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {slideInfo.title}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-cyan-400">
                      <span>{isTr ? 'Detayı Gör' : 'View Details'}</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            SECTION 2: AGENCY CRASH TEST 500 POSTER SHOWCASE
        ======================================================== */}
        <section id="crash-test-poster" className="space-y-8 scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-6 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-400">
                02 // 60-SECOND TECHNICAL READINESS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">
                {data.crashTest.title} (HTTP 500 Poster)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                {data.crashTest.description}
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <a
                href="/agency-kit/tma-agency-crash-test-500.pdf"
                download="TMA-Agency-Crash-Test-500.pdf"
                className="px-3.5 py-2 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:bg-rose-900/60 transition-colors flex items-center gap-2 font-bold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isTr ? 'Poster PDF İndir' : 'Download Poster PDF'}</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl bg-[#090b14] border border-rose-500/30 p-6 sm:p-10 relative overflow-hidden">
            
            {/* Background 500 watermark */}
            <div className="absolute top-1/2 right-10 -translate-y-1/2 text-[200px] sm:text-[300px] font-black font-mono text-rose-500/5 select-none pointer-events-none">
              500
            </div>

            {/* Poster Preview with Click-to-Zoom */}
            <div className="lg:col-span-5 flex justify-center">
              <div 
                onClick={() => setIsPosterLightboxOpen(true)}
                className="relative group rounded-2xl overflow-hidden border border-rose-500/40 shadow-[0_0_50px_rgba(244,63,94,0.2)] cursor-pointer max-w-sm w-full bg-black"
              >
                <img
                  src="/agency-kit/crash-test-500-poster.png"
                  alt="TMA Agency Crash Test 500 Poster"
                  className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-rose-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                  <span className="w-12 h-12 rounded-full bg-rose-500 text-slate-950 flex items-center justify-center font-bold shadow-xl">
                    <ZoomIn className="w-6 h-6" />
                  </span>
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    {isTr ? 'Posteri Tam Ekran İncele' : 'Zoom Full Poster'}
                  </span>
                </div>
              </div>
            </div>

            {/* Poster Details & Scenarios */}
            <div className="lg:col-span-7 space-y-6 relative z-10">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold tracking-widest text-rose-400 uppercase bg-rose-950/60 px-3 py-1 rounded-full border border-rose-800/60">
                  {data.crashTest.badge}
                </span>
                <h3 className="text-2xl sm:text-4xl font-black text-white font-mono">
                  {data.crashTest.subtitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {isTr
                    ? "Kriz kapıyı çalmadan önce ajansınızın ilk müdahale refleksini ölçün. 4 soruya yanıt vererek teknik hazırlık puanınızı ve cerrahi eylem planınızı anında alın."
                    : "Measure your agency's incident triage reflexes before outage strikes. Answer 4 questions to calculate your readiness score and surgical action plan instantly."
                  }
                </p>
              </div>

              {/* 3 Scenarios */}
              <div className="space-y-3">
                {data.crashTest.scenarios.map((sc, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 hover:border-rose-500/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-rose-400 font-bold text-sm">{sc.no}</span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white font-mono">{sc.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-snug">{sc.desc}</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 flex-shrink-0">
                      {sc.tag}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3 font-mono text-xs sm:text-sm">
                <Link
                  to="/crash-test/"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-slate-950 font-black uppercase tracking-wider shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{isTr ? '60 Saniyelik Testi Başlat →' : 'Start 60-Second Test →'}</span>
                </Link>

                <a
                  href="/agency-kit/tma-agency-crash-test-500.pdf"
                  download="TMA-Agency-Crash-Test-500.pdf"
                  className="px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-rose-400" />
                  <span>{isTr ? 'Poster PDF İndir' : 'Download Poster PDF'}</span>
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            SECTION 3: 4 WHITE-LABEL COMMITMENTS
        ======================================================== */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
              TRUST & SECURITY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">
              {isTr ? 'Ajanslar İçin 4 Temel Taahhüt' : '4 Foundational Agency Commitments'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#090d16] border border-cyan-500/20 space-y-2">
              <span className="font-mono text-cyan-400 text-xs font-bold block">01 // CLIENT OWNERSHIP</span>
              <h3 className="text-base font-bold text-white font-mono">{isTr ? 'Müşteri Sizde Kalır' : 'You Own the Client'}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isTr ? 'Tüm müşteri iletişimi ajansınız üzerinden yürütülür. TMA asla görünmez veya temas kurmaz.' : 'All client communication stays strictly inside your agency. TMA remains completely invisible.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#090d16] border border-cyan-500/20 space-y-2">
              <span className="font-mono text-cyan-400 text-xs font-bold block">02 // ZERO BYPASS</span>
              <h3 className="text-base font-bold text-white font-mono">{isTr ? 'Sıfır Bypass İlkesi' : 'Zero Client Bypass'}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isTr ? 'İzinsiz temas, arkadan dolanma veya doğrudan teklif verme kesinlikle yasaktır ve NDA ile korunur.' : 'Zero unauthorized contact or direct solicitation, legally secured under bilateral NDA.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#090d16] border border-cyan-500/20 space-y-2">
              <span className="font-mono text-cyan-400 text-xs font-bold block">03 // BINDING NDA</span>
              <h3 className="text-base font-bold text-white font-mono">{isTr ? 'Resmi Karşılıklı NDA' : 'Mutual Binding NDA'}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isTr ? 'Projeye başlamadan önce iki taraflı bağlayıcı gizlilik sözleşmesi imzalayarak hukuki güvence sağlarız.' : 'We execute a binding bilateral non-disclosure agreement before any code review or deployment.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#090d16] border border-cyan-500/20 space-y-2">
              <span className="font-mono text-cyan-400 text-xs font-bold block">04 // 100% IP</span>
              <h3 className="text-base font-bold text-white font-mono">{isTr ? 'Eksiksiz Kaynak Kod Mülkiyeti' : '100% IP & Source Code'}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isTr ? 'Tüm kaynak kodlar, dokümantasyon ve sunucu yetkileri projenin sonunda eksiksiz ajansınıza devredilir.' : 'All source code, technical notes, and deployment access are handed over cleanly with zero lock-in.'}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: EMERGENCY RESPONSE DESK CALLOUT
        ======================================================== */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-[#0a0f1c] to-purple-950/30 border border-cyan-500/40 text-center max-w-3xl mx-auto space-y-6 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{isTr ? 'CANLI KRİZ MASASI · 09:00 – 24:00' : 'LIVE RESPONSE DESK · 09:00 – 24:00'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">
            {isTr ? 'Bir Sonraki Teknik Çıkmazda Bizi Hatırlayın' : 'Remember Us at Your Next Technical Outage'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            {isTr
              ? "Canlı sistem çöküşü, yetişmeyen sprint veya yarım kalan kodlar için doğrudan kıdemli mühendislik masamıza bağlanın."
              : "Connect directly to our senior engineering desk for live outages, stalled sprints, or undocumented takeovers."
            }
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono text-xs sm:text-sm">
            <a
              href="tel:+905343713573"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-2 transition-colors shadow-lg cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>+90 534 371 35 73</span>
            </a>

            <a
              href="mailto:info@trendmasterakademi.com"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold transition-colors cursor-pointer"
            >
              info@trendmasterakademi.com
            </a>
          </div>
        </section>

      </div>

      {/* ========================================================
          INTERACTIVE LIGHTBOX: SLIDE VIEWER (8 SLIDES)
      ======================================================== */}
      {activeSlideIndex !== null && (
        <div 
          className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveSlideIndex(null)}
        >
          {/* Lightbox Top Controls */}
          <div className="flex items-center justify-between px-2 sm:px-4 py-2 text-xs font-mono text-slate-300 z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40">
                SLIDE 0{activeSlideIndex + 1} / 08
              </span>
              <span className="hidden sm:inline font-bold text-white">
                {data.responseKit.slides[activeSlideIndex].title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`/agency-kit/response-kit-slide-${activeSlideIndex + 1}.png`}
                download={`TMA-Agency-Response-Kit-Slide-${activeSlideIndex + 1}.png`}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                title={isTr ? "Bu Görseli İndir" : "Download This Slide"}
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">{isTr ? 'Görseli İndir' : 'Download'}</span>
              </a>

              <button
                onClick={() => setActiveSlideIndex(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Kapat"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Lightbox Main Slide Area with Arrows */}
          <div className="flex-1 flex items-center justify-center relative min-h-0 py-2" onClick={(e) => e.stopPropagation()}>
            {/* Prev Button */}
            <button
              onClick={() => setActiveSlideIndex((prev) => (prev - 1 + 8) % 8)}
              className="absolute left-2 sm:left-6 z-20 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-cyan-500 hover:text-slate-950 text-white border border-white/20 transition-all cursor-pointer backdrop-blur-md shadow-2xl"
              aria-label="Önceki Slayt"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Slide Image */}
            <div className="max-h-[75vh] max-w-[85vw] sm:max-w-[70vw] aspect-square flex items-center justify-center">
              <img
                src={`/agency-kit/response-kit-slide-${activeSlideIndex + 1}.png`}
                alt={`Slide ${activeSlideIndex + 1}`}
                className="max-h-full max-w-full object-contain rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-white/10"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={() => setActiveSlideIndex((prev) => (prev + 1) % 8)}
              className="absolute right-2 sm:right-6 z-20 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-cyan-500 hover:text-slate-950 text-white border border-white/20 transition-all cursor-pointer backdrop-blur-md shadow-2xl"
              aria-label="Sonraki Slayt"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          </div>

          {/* Lightbox Bottom Thumbnail Bar */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10" onClick={(e) => e.stopPropagation()}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sNum, idx) => (
              <button
                key={sNum}
                onClick={() => setActiveSlideIndex(idx)}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                  activeSlideIndex === idx
                    ? 'border-cyan-400 scale-110 shadow-[0_0_15px_rgba(0,229,255,0.5)]'
                    : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={`/agency-kit/response-kit-slide-${sNum}.png`}
                  alt={`Thumb ${sNum}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          POSTER LIGHTBOX: CRASH TEST 500
      ======================================================== */}
      {isPosterLightboxOpen && (
        <div 
          className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsPosterLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-2 sm:px-4 py-2 text-xs font-mono text-slate-300 z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/40">
                POSTER // CRASH TEST 500
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/agency-kit/tma-agency-crash-test-500.pdf"
                download="TMA-Agency-Crash-Test-500.pdf"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">{isTr ? 'PDF İndir' : 'Download PDF'}</span>
              </a>

              <button
                onClick={() => setIsPosterLightboxOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Kapat"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Poster Image */}
          <div className="flex-1 flex items-center justify-center relative min-h-0 py-2" onClick={(e) => e.stopPropagation()}>
            <div className="max-h-[80vh] max-w-[85vw] flex items-center justify-center">
              <img
                src="/agency-kit/crash-test-500-poster.png"
                alt="Crash Test 500 Poster"
                className="max-h-full max-w-full object-contain rounded-2xl shadow-[0_0_60px_rgba(244,63,94,0.3)] border border-rose-500/30"
              />
            </div>
          </div>

          <div className="text-center py-2 z-10" onClick={(e) => e.stopPropagation()}>
            <Link
              to="/crash-test/"
              onClick={() => setIsPosterLightboxOpen(false)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isTr ? '60 Saniyelik Testi Başlat →' : 'Start 60-Second Test →'}</span>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
