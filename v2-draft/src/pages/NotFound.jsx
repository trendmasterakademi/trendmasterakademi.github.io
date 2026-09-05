import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PhoneCall, MessageSquare, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { formatDocumentTitle } from '../utils/pageTitle';
import { useKrizHattiAcik } from '../utils/krizHatti';

const NotFound = () => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';
  const krizHattiAcik = useKrizHattiAcik();

  useEffect(() => {
    document.title = formatDocumentTitle(
      isTr 
        ? 'Bu sayfa bulunamadı | Trend Master Akademi'
        : 'Page Not Found | Trend Master Academy'
    );
  }, [isTr]);

  return (
    <div className="pt-32 pb-28 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto text-slate-200">
      
      {/* Back Navigation */}
      <div className="mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 font-mono transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> {isTr ? '← Ana Sayfaya Dön' : '← Back to Home'}
        </Link>
      </div>

      {/* Header & h1 */}
      <header className="space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>HTTP 404 // NOT FOUND</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
          {isTr ? 'Bu sayfa yok — ama hat açık' : 'This page does not exist — but the desk is open'}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
          {isTr 
            ? 'Aradığınız adres taşınmış ya da hiç var olmamış olabilir. Acil bir durumdaysanız kriz hattı aşağıda.'
            : 'The address you are looking for may have moved or never existed. If you are facing an emergency, the crisis desk is below.'}
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

      {/* Phone & WhatsApp Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
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

      {/* Navigation Help: Nereye gitmek istemiştiniz? */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 space-y-5">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          {isTr ? 'Nereye gitmek istemiştiniz?' : 'Where were you looking to go?'}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Link
            to="/"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between gap-3 group"
          >
            <div>
              <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                {isTr ? 'Ana sayfa' : 'Home'}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {isTr ? 'B2B Mühendislik Masası & Tanıtım' : 'B2B Engineering Desk & Overview'}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Link>

          <Link
            to="/teshis/"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between gap-3 group"
          >
            <div>
              <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                {isTr ? 'Teşhis kataloğu — 20 belgelenmiş arıza' : 'Diagnosis catalog — 20 failure patterns'}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {isTr ? 'Hata belirtileri ve çözüm adımları' : 'Error symptoms and resolution steps'}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Link>

          <Link
            to="/crash-test/"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between gap-3 group"
          >
            <div>
              <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                {isTr ? 'Agency Crash Test — 60 saniyede teşhis' : 'Agency Crash Test — 60s self-check'}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {isTr ? 'Ajans kriz dayanıklılık skoru' : 'Agency crisis resilience score'}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Link>

          <Link
            to="/sos/"
            className="p-4 rounded-xl bg-red-500/10 hover:bg-red-500/15 border border-red-500/30 transition-all flex items-center justify-between gap-3 group"
          >
            <div>
              <div className="text-sm font-bold text-red-300 group-hover:text-red-200 transition-colors">
                {isTr ? 'Acil teknik destek' : 'Emergency technical support'}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {isTr ? 'Kriz masası ve doğrudan bildirim' : 'Direct response desk dispatch'}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default NotFound;
