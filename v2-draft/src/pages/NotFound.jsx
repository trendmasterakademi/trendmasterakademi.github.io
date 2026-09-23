import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PhoneCall, MessageSquare, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { formatDocumentTitle } from '../utils/pageTitle';
import { useKrizHattiAcik } from '../utils/krizHatti';
import { isTurkish } from '../i18n';

const NotFound = () => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const krizHattiAcik = useKrizHattiAcik();

  useEffect(() => {
    document.title = formatDocumentTitle(
      isTr 
        ? 'Bu sayfa bulunamadı | Trend Master Akademi'
        : 'Page Not Found | Trend Master Akademi'
    );
  }, [isTr]);

  return (
    <div className="min-h-screen pt-32 pb-28 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto bg-[var(--paper)] text-[var(--ink)] font-sans selection:bg-[var(--accent)] selection:text-[var(--on-accent)]">
      
      {/* Back Navigation */}
      <div className="mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-[var(--accent)] hover:underline font-mono transition-colors mb-6 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" /> {isTr ? '← Ana Sayfaya Dön' : '← Back to Home'}
        </Link>
      </div>

      {/* Header & h1 */}
      <header className="space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--r-control)] text-xs font-mono bg-[var(--tint-warn-bg)] border border-[var(--tint-warn-rule)] text-[var(--tint-warn-ink)]">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>HTTP 404 // NOT FOUND</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-[var(--ink)] tracking-tight leading-tight">
          {isTr ? 'Bu sayfa yok — ama hat açık' : 'This page does not exist — but the desk is open'}
        </h1>
        <p className="text-sm sm:text-base text-[var(--ink-2)] leading-relaxed max-w-[34rem]">
          {isTr 
            ? 'Aradığınız adres taşınmış ya da hiç var olmamış olabilir. Acil bir durumdaysanız kriz hattı aşağıda.'
            : 'The address you are looking for may have moved or never existed. If you are facing an emergency, the crisis desk is below.'}
        </p>
      </header>

      {/* Kriz Hattı Durum Şeridi */}
      <div className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed flex items-center gap-3 mb-8 ${
        krizHattiAcik 
          ? 'bg-[var(--tint-ok-bg)] border-[var(--tint-ok-rule)] text-[var(--tint-ok-ink)]' 
          : 'bg-[var(--tint-warn-bg)] border-[var(--tint-warn-rule)] text-[var(--tint-warn-ink)]'
      }`}>
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
          krizHattiAcik ? 'bg-[var(--sev-ok)] animate-pulse' : 'bg-[var(--tint-warn-ink)]'
        }`}></span>
        <span>
          {krizHattiAcik
            ? (isTr 
                ? 'Kriz hattı şu an açık · her gün 09:00 – 24:00 · canlı kesintilerde ilk yanıt taahhüdü 15 dakika'
                : 'Response desk is open now · daily 09:00 – 24:00 · first-response commitment for live outages: 15 minutes')
            : (isTr 
                ? "Kriz hattı şu an kapalı. Bildiriminiz ertesi sabah 09:00'da ele alınır — formu yine de doldurabilirsiniz."
                : 'The response desk is closed right now. Your notification is picked up at 09:00 the following morning — you can still submit the form.')
          }
        </span>
      </div>

      {/* Phone & WhatsApp Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <a
          href="https://wa.me/905343713573"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary min-h-[52px] p-4 text-sm sm:text-base font-semibold flex items-center justify-center gap-2.5"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{isTr ? "WhatsApp'tan yaz" : 'Message on WhatsApp'}</span>
        </a>

        <a
          href="tel:+905343713573"
          className="btn-secondary min-h-[52px] p-4 text-sm sm:text-base font-semibold flex items-center justify-center gap-2.5"
        >
          <PhoneCall className="w-4 h-4 text-[var(--tint-ok-ink)]" />
          <span>+90 534 371 35 73</span>
        </a>
      </div>

      {/* Navigation Help: Nereye gitmek istemiştiniz? */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-5 shadow-sm">
        <h2 className="text-lg sm:text-xl font-serif font-semibold text-[var(--ink)]">
          {isTr ? 'Nereye gitmek istemiştiniz?' : 'Where were you looking to go?'}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Link
            to="/"
            className="p-4 rounded-xl bg-[var(--paper)] hover:bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--accent)] transition-all flex items-center justify-between gap-3 group min-h-[44px]"
          >
            <div>
              <div className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                {isTr ? 'Ana sayfa' : 'Home'}
              </div>
              <div className="text-xs text-[var(--ink-3)] mt-0.5">
                {isTr ? 'B2B Mühendislik Masası & Tanıtım' : 'B2B Engineering Desk & Overview'}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--accent)] group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Link>

          <Link
            to="/teshis/"
            className="p-4 rounded-xl bg-[var(--paper)] hover:bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--accent)] transition-all flex items-center justify-between gap-3 group min-h-[44px]"
          >
            <div>
              <div className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                {isTr ? 'Teşhis kataloğu — 20 belgelenmiş arıza' : 'Diagnosis catalog — 20 failure patterns'}
              </div>
              <div className="text-xs text-[var(--ink-3)] mt-0.5">
                {isTr ? 'Hata belirtileri ve çözüm adımları' : 'Error symptoms and resolution steps'}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--accent)] group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Link>

          <Link
            to="/crash-test/"
            className="p-4 rounded-xl bg-[var(--paper)] hover:bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--accent)] transition-all flex items-center justify-between gap-3 group min-h-[44px]"
          >
            <div>
              <div className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                {isTr ? 'Sistem Crash Test — 60 saniyede teşhis' : 'System Crash Test — 60s self-check'}
              </div>
              <div className="text-xs text-[var(--ink-3)] mt-0.5">
                {isTr ? 'Altyapı kriz dayanıklılık skoru' : 'Infrastructure crisis resilience score'}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--accent)] group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Link>

          <Link
            to="/sos/"
            className="p-4 rounded-xl bg-[var(--accent-wash)] border border-[var(--accent)]/30 hover:border-[var(--accent)] transition-all flex items-center justify-between gap-3 group min-h-[44px]"
          >
            <div>
              <div className="text-sm font-semibold text-[var(--accent)] transition-colors">
                {isTr ? 'Acil teknik destek' : 'Emergency technical support'}
              </div>
              <div className="text-xs text-[var(--ink-3)] mt-0.5">
                {isTr ? 'Kriz masası ve doğrudan bildirim' : 'Direct response desk dispatch'}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--accent)] group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default NotFound;
