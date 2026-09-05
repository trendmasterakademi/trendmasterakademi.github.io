import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PhoneCall, MessageSquare, AlertTriangle, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { formatDocumentTitle } from '../utils/pageTitle';
import { useKrizHattiAcik } from '../utils/krizHatti';

const Sos = () => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';
  const krizHattiAcik = useKrizHattiAcik();

  useEffect(() => {
    document.title = formatDocumentTitle(
      isTr 
        ? 'Acil Teknik Destek (SOS) | Trend Master Akademi'
        : 'Emergency Technical Support (SOS) | Trend Master Academy'
    );

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        isTr
          ? 'Ajansınızın canlı sistemi durduysa, teslim tarihi yanıyorsa ya da devraldığınız kod açılmıyorsa kriz hattı: her gün 09:00 – 24:00, ilk teşhis ücretsiz.'
          : 'Direct emergency crisis desk if your agency system is down, deadline is crunching, or inherited code is locked. Open daily 09:00 - 24:00.'
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://trendmasterakademi.com/sos/');
    }

    // Açılışta bir kez SOS modalını otomatik tetikle
    window.dispatchEvent(new CustomEvent('open-sos-modal'));
  }, [isTr]);

  const handleOpenModal = () => {
    window.dispatchEvent(new CustomEvent('open-sos-modal'));
  };

  return (
    <div className="pt-32 pb-28 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto text-slate-200">
      
      {/* Breadcrumb Navigation */}
      <div className="mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 font-mono transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> {isTr ? '← Ana Sayfaya Dön' : '← Back to Home'}
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-3">
          <Link to="/" className="hover:text-white transition-colors">{isTr ? 'Ana Sayfa' : 'Home'}</Link>
          <span>/</span>
          <span className="text-red-400 font-semibold">{isTr ? 'Acil Teknik Destek' : 'Emergency Technical Support'}</span>
        </div>
      </div>

      {/* Header & h1 */}
      <header className="space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-red-500/10 border border-red-500/30 text-red-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{isTr ? 'KRİZ MASASI // EMERGENCY DISPATCH' : 'CRISIS DESK // EMERGENCY DISPATCH'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
          {isTr ? 'Acil Teknik Destek — Kriz Hattı' : 'Emergency Technical Support — Response Desk'}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          {isTr 
            ? 'Ajansınızın canlı sistemi durduysa, teslim tarihi yanıyorsa ya da devraldığınız kod açılmıyorsa doğrudan buraya yazın. İlk teşhis ücretsizdir.'
            : 'If your agency’s live system is down, deadline is burning, or inherited codebase won’t start, reach out directly. Initial diagnosis is free.'}
        </p>
      </header>

      {/* Kriz Hattı Durum Şeridi */}
      <div className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed flex items-center gap-3 mb-8 ${
        krizHattiAcik 
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
          : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
      }`}>
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
          krizHattiAcik ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
        }`}></span>
        <span>
          {krizHattiAcik
            ? (isTr 
                ? 'Kriz hattı şu an açık · her gün 09:00 – 24:00 · acil bildirimlere tipik ilk yanıt 15 dakika'
                : 'Response desk is open now · daily 09:00 – 24:00 · typical first reply to emergencies 15 minutes')
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
          className="p-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-sm sm:text-base shadow-lg shadow-red-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer min-h-[52px]"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{isTr ? 'Acil SOS Formunu Aç' : 'Open Emergency SOS Form'}</span>
        </button>

        <a
          href="https://wa.me/905343713573"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2.5 transition-all min-h-[52px]"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{isTr ? "WhatsApp'tan yaz" : 'Message on WhatsApp'}</span>
        </a>

        <a
          href="tel:+905343713573"
          className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm sm:text-base border border-white/10 flex items-center justify-center gap-2.5 transition-colors min-h-[52px]"
        >
          <PhoneCall className="w-4 h-4 text-emerald-400" />
          <span>+90 534 371 35 73</span>
        </a>
      </div>

      {/* Section: Yazarken şunları ekleyin */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 space-y-5 mb-10">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span>{isTr ? 'Yazarken şunları ekleyin' : 'What to include when reaching out'}</span>
        </h2>
        <ol className="space-y-3.5 text-sm sm:text-base text-slate-300">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">1</span>
            <span>{isTr ? 'Ajans adı ve size ulaşılacak numara' : 'Agency name and your direct contact number'}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">2</span>
            <span>{isTr ? 'Ne oldu: hata ekranı, hata satırı ya da sistemin davranışı' : 'What happened: error screen, error line, or unexpected system behavior'}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">3</span>
            <span>{isTr ? 'Ne zaman başladı ve o sırada ne değişti (yayın, güncelleme, ödeme sağlayıcı)' : 'When it started and what changed at that time (deploy, update, payment gateway)'}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">4</span>
            <span>{isTr ? 'Erişim var mı: sunucu, repo, panel — yoksa da yazın, teşhis için şart değil' : 'Access status: server, repo, dashboard — reach out even if unavailable, not required for initial diagnosis'}</span>
          </li>
        </ol>
        <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs sm:text-sm text-slate-400 italic">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{isTr ? 'İlk teşhis için şifre ya da repo erişimi istemiyoruz.' : 'We do not require passwords or repository access for the initial diagnosis.'}</span>
        </div>
      </section>

      {/* Section: Aciliyet yoksa */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          {isTr ? 'Aciliyet yoksa' : 'If not an active emergency'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <Link
            to="/crash-test/"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between gap-3 group"
          >
            <span className="text-xs sm:text-sm text-slate-200 group-hover:text-cyan-300 transition-colors">
              {isTr 
                ? '60 saniyelik Agency Crash Test ile durumu kendiniz teşhis edin' 
                : 'Diagnose the situation yourself with the 60-second Agency Crash Test'}
            </span>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Link>

          <Link
            to="/teshis/"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between gap-3 group"
          >
            <span className="text-xs sm:text-sm text-slate-200 group-hover:text-cyan-300 transition-colors">
              {isTr 
                ? '20 arızanın belgelenmiş teşhis kataloğu' 
                : 'Documented diagnosis catalog for 20 failure patterns'}
            </span>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Sos;
