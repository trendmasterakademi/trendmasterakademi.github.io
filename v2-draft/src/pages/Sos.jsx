import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PhoneCall, MessageSquare, AlertTriangle, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { setPageSeo } from '../utils/pageTitle';
import { useKrizHattiAcik } from '../utils/krizHatti';
import { isTurkish } from '../i18n';

const Sos = () => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const krizHattiAcik = useKrizHattiAcik();

  useEffect(() => {
    setPageSeo('/sos/', isTr ? 'tr' : 'en');
    // Açılışta bir kez SOS modalını otomatik tetikle
    window.dispatchEvent(new CustomEvent('open-sos-modal'));
  }, [isTr]);

  const handleOpenModal = () => {
    window.dispatchEvent(new CustomEvent('open-sos-modal'));
  };

  return (
    <div className="pt-32 pb-36 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto text-[var(--ink)] font-sans">
      
      {/* Breadcrumb Navigation */}
      <div className="mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-[var(--accent)] hover:underline font-mono transition-colors mb-6 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" /> {isTr ? '← Ana Sayfaya Dön' : '← Back to Home'}
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--ink-muted)] mb-3">
          <Link to="/" className="hover:text-[var(--ink)] transition-colors min-h-[44px] inline-flex items-center">{isTr ? 'Ana Sayfa' : 'Home'}</Link>
          <span>/</span>
          <span className="text-[var(--accent)] font-semibold">{isTr ? 'Acil Teknik Destek' : 'Emergency Technical Support'}</span>
        </div>
      </div>

      {/* Header & h1 */}
      <header className="space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-mono bg-[var(--accent-soft)] border border-[var(--accent)] text-[var(--accent)] font-semibold">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{isTr ? 'KRİZ MASASI // EMERGENCY DISPATCH' : 'CRISIS DESK // EMERGENCY DISPATCH'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold font-serif text-[var(--ink)] tracking-tight leading-tight">
          {isTr ? 'Acil Teknik Destek — Kriz Hattı' : 'Emergency Technical Support — Response Desk'}
        </h1>
        <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed max-w-[34rem]">
          {isTr 
            ? 'Burası ajansların imdat butonu. Ajansınızın canlı sistemi durduysa, teslim tarihi yanıyorsa ya da devraldığınız kod açılmıyorsa doğrudan buraya yazın. İlk teşhis ücretsizdir.'
            : 'If your agency’s live system is down, deadline is burning, or inherited codebase won’t start, reach out directly. Initial diagnosis is free.'}
        </p>
      </header>

      {/* Kriz Hattı Durum Şeridi */}
      <div className={`p-4 rounded border text-xs sm:text-sm leading-relaxed flex items-center gap-3 mb-8 ${
        krizHattiAcik 
          ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
          : 'bg-amber-50 border-amber-300 text-amber-900'
      }`}>
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
          krizHattiAcik ? 'bg-emerald-600' : 'bg-amber-600'
        }`}></span>
        <span>
          {krizHattiAcik
            ? (isTr 
                ? 'Kriz hattı her gün 09:00 – 24:00 açık · canlı kesintilerde ilk yanıt taahhüdü 15 dakika.'
                : 'Crisis line open every day 09:00 – 24:00 · first-response commitment for live outages: 15 minutes.')
            : (isTr 
                ? "Kriz hattı şu an kapalı. Bildiriminiz ertesi sabah 09:00'da ele alınır — formu yine de doldurabilirsiniz."
                : 'The response desk is closed right now. Your notification is picked up at 09:00 the following morning — you can still submit the form.')
          }
        </span>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <button
          type="button"
          onClick={handleOpenModal}
          className="p-4 rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--on-accent)] font-semibold text-sm sm:text-base shadow-sm flex items-center justify-center gap-2.5 transition-colors cursor-pointer min-h-[44px]"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{isTr ? 'Acil SOS Formunu Aç' : 'Open Emergency SOS Form'}</span>
        </button>

        <a
          href="https://wa.me/905343713573"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded bg-[var(--sev-ok)] hover:bg-[var(--sev-ok-hover)] text-white font-semibold text-sm sm:text-base shadow-sm flex items-center justify-center gap-2.5 transition-colors min-h-[44px]"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{isTr ? "WhatsApp'tan yaz" : 'Message on WhatsApp'}</span>
        </a>

        <a
          href="tel:+905343713573"
          className="p-4 rounded bg-[var(--surface)] hover:bg-[var(--paper)] text-[var(--ink)] font-semibold text-sm sm:text-base border border-[var(--rule)] flex items-center justify-center gap-2.5 transition-colors min-h-[44px]"
        >
          <PhoneCall className="w-4 h-4 text-emerald-700" />
          <span>+90 534 371 35 73</span>
        </a>
      </div>

      {/* Section: Yazarken şunları ekleyin */}
      <section className="p-6 sm:p-8 rounded bg-[var(--surface)] border border-[var(--rule)] space-y-5 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold font-serif text-[var(--ink)] flex items-center gap-2">
          <span>{isTr ? 'Yazarken şunları ekleyin' : 'What to include when reaching out'}</span>
        </h2>
        <ol className="space-y-3.5 text-sm sm:text-base text-[var(--ink)]">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded bg-[var(--accent-soft)] text-[var(--accent)] font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold">1</span>
            <span>{isTr ? 'Ajans adı ve size ulaşılacak numara' : 'Agency name and your direct contact number'}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded bg-[var(--accent-soft)] text-[var(--accent)] font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold">2</span>
            <span>{isTr ? 'Ne oldu: hata ekranı, hata satırı ya da sistemin davranışı' : 'What happened: error screen, error line, or unexpected system behavior'}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded bg-[var(--accent-soft)] text-[var(--accent)] font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold">3</span>
            <span>{isTr ? 'Ne zaman başladı ve o sırada ne değişti (yayın, güncelleme, ödeme sağlayıcı)' : 'When it started and what changed at that time (deploy, update, payment gateway)'}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded bg-[var(--accent-soft)] text-[var(--accent)] font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold">4</span>
            <span>{isTr ? 'Erişim var mı: sunucu, repo, panel — yoksa da yazın, teşhis için şart değil' : 'Access status: server, repo, dashboard — reach out even if unavailable, not required for initial diagnosis'}</span>
          </li>
        </ol>
        <div className="pt-4 border-t border-[var(--rule)] flex items-center gap-2 text-xs sm:text-sm text-[var(--ink-muted)] italic">
          <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>{isTr ? 'İlk teşhis için şifre ya da repo erişimi istemiyoruz.' : 'We do not require passwords or repository access for the initial diagnosis.'}</span>
        </div>
      </section>

      {/* Section: Aciliyet yoksa */}
      <section className="p-6 sm:p-8 rounded bg-[var(--surface)] border border-[var(--rule)] space-y-4 shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold font-serif text-[var(--ink)]">
          {isTr ? 'Aciliyet yoksa' : 'If not an active emergency'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <Link
            to="/crash-test/"
            className="p-4 rounded bg-[var(--paper)] hover:bg-[var(--surface)] border border-[var(--rule)] transition-colors flex items-center justify-between gap-3 group min-h-[44px]"
          >
            <span className="text-xs sm:text-sm text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
              {isTr 
                ? '60 saniyelik Agency Crash Test ile durumu kendiniz teşhis edin' 
                : 'Diagnose the situation yourself with the 60-second Agency Crash Test'}
            </span>
            <ArrowRight className="w-4 h-4 text-[var(--accent)] group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Link>

          <Link
            to="/teshis/"
            className="p-4 rounded bg-[var(--paper)] hover:bg-[var(--surface)] border border-[var(--rule)] transition-colors flex items-center justify-between gap-3 group min-h-[44px]"
          >
            <span className="text-xs sm:text-sm text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
              {isTr 
                ? '20 arızanın belgelenmiş teşhis kataloğu' 
                : 'Documented diagnosis catalog for 20 failure patterns'}
            </span>
            <ArrowRight className="w-4 h-4 text-[var(--accent)] group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Sos;
