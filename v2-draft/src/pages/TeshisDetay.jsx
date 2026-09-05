import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, AlertTriangle, Terminal, MessageSquare, PhoneCall } from 'lucide-react';
import TeshisDiyagram from '../components/TeshisDiyagram';
import { formatDocumentTitle } from '../utils/pageTitle';
import { useKrizHattiAcik } from '../utils/krizHatti';

// Dynamic code-split loaders: Each diagnostic chunk is loaded strictly on demand!
const teshisLoaders = {
  'ayni-stok-iki-musteriye-satildi': () => import('../data/teshis/ayni-stok-iki-musteriye-satildi.js'),
  'odeme-alindi-siparis-olusmadi': () => import('../data/teshis/odeme-alindi-siparis-olusmadi.js'),
  'odeme-iki-kez-alindi': () => import('../data/teshis/odeme-iki-kez-alindi.js'),
  'site-yavasladi-sunucu-bos': () => import('../data/teshis/site-yavasladi-sunucu-bos.js'),
  'islemler-kilitlendi-sayfa-donuyor': () => import('../data/teshis/islemler-kilitlendi-sayfa-donuyor.js'),
  'entegrasyon-429-veriyor': () => import('../data/teshis/entegrasyon-429-veriyor.js'),
  'sunucu-her-gun-yeniden-baslatiliyor': () => import('../data/teshis/sunucu-her-gun-yeniden-baslatiliyor.js'),
  'guncelleme-sonrasi-veri-kayboldu': () => import('../data/teshis/guncelleme-sonrasi-veri-kayboldu.js'),
  'testte-calisiyor-canlida-calismiyor': () => import('../data/teshis/testte-calisiyor-canlida-calismiyor.js'),
  'deploy-sonrasi-site-bozuldu': () => import('../data/teshis/deploy-sonrasi-site-bozuldu.js'),
  'her-yeni-ozellik-oncekini-bozuyor': () => import('../data/teshis/her-yeni-ozellik-oncekini-bozuyor.js'),
  'kucuk-degisiklik-gunler-suruyor': () => import('../data/teshis/kucuk-degisiklik-gunler-suruyor.js'),
  'site-500-veriyor-dun-calisiyordu': () => import('../data/teshis/site-500-veriyor-dun-calisiyordu.js'),
  'yazilimci-gitti-koda-girilemiyor': () => import('../data/teshis/yazilimci-gitti-koda-girilemiyor.js'),
  'bulut-hesabi-askiya-alindi': () => import('../data/teshis/bulut-hesabi-askiya-alindi.js'),
  'yedek-var-sanildi-yedek-yok': () => import('../data/teshis/yedek-var-sanildi-yedek-yok.js'),
  'domain-hosting-erisimi-yok': () => import('../data/teshis/domain-hosting-erisimi-yok.js'),
  'ssl-suresi-doldu': () => import('../data/teshis/ssl-suresi-doldu.js'),
  'form-gonderiliyor-mail-gelmiyor': () => import('../data/teshis/form-gonderiliyor-mail-gelmiyor.js'),
  'site-aramalarda-gorunmez-oldu': () => import('../data/teshis/site-aramalarda-gorunmez-oldu.js')
};

const HARF_BG_COLORS = {
  A: 'bg-red-400',
  B: 'bg-amber-400',
  C: 'bg-purple-400',
  D: 'bg-cyan-400'
};

const KrizSeridi = ({ teshis, isTr, lang, krizHattiAcik }) => {
  const baslikVal = (lang === 'en' ? teshis?.baslik?.en : teshis?.baslik?.tr) || teshis?.baslik?.tr || '';
  const aciliyetVal = (lang === 'en' ? teshis?.aciliyet?.etiket?.en : teshis?.aciliyet?.etiket?.tr) || teshis?.aciliyet?.etiket?.tr || '';
  const sonCumle = isTr
    ? 'Bu belirti şu an sistemimizde yaşanıyor; acil teknik destek talep ediyoruz.'
    : 'We are seeing this on our live system and request emergency technical support.';

  const waMessage = isTr
    ? `🚨 *TMA · Teşhis Kataloğu* 🚨\n\n🎯 *Teşhis:* #${teshis.no} · ${baslikVal}\n⚡ *Aciliyet:* ${aciliyetVal}\n\n${sonCumle}`
    : `🚨 *TMA · Diagnostic Catalog* 🚨\n\n🎯 *Diagnosis:* #${teshis.no} · ${baslikVal}\n⚡ *Severity:* ${aciliyetVal}\n\n${sonCumle}`;
  const waUrl = `https://wa.me/905343713573?text=${encodeURIComponent(waMessage)}`;

  return (
    <section className="border border-emerald-500/30 rounded-2xl bg-emerald-500/[0.04] p-4 sm:p-5 space-y-3">
      <div className="space-y-1.5">
        <h3 className="text-sm sm:text-base font-bold text-white">
          {isTr ? 'Bu belirti şu an sizin sisteminizde mi?' : 'Are you seeing this right now?'}
        </h3>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${krizHattiAcik ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          <span className={krizHattiAcik ? 'text-emerald-300/90' : 'text-amber-300/90'}>
            {krizHattiAcik
              ? (isTr
                  ? 'Kriz hattı şu an açık · her gün 09:00 – 24:00 · acil bildirimlere tipik ilk yanıt 15 dakika'
                  : 'Response desk is open now · daily 09:00 – 24:00 · typical first reply to emergencies 15 minutes')
              : (isTr
                  ? "Kriz hattı şu an kapalı. Bildiriminiz ertesi sabah 09:00'da ele alınır — yine de yazın."
                  : 'The response desk is closed right now. Your notification is picked up at 09:00 the following morning — write anyway.')}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer min-h-[44px]"
        >
          <MessageSquare className="w-4 h-4 flex-shrink-0" />
          <span>{isTr ? "WhatsApp'tan yaz" : 'Message on WhatsApp'}</span>
        </a>

        <a
          href="tel:+905343713573"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white font-mono font-bold text-xs sm:text-sm transition-colors cursor-pointer min-h-[44px]"
        >
          <PhoneCall className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>+90 534 371 35 73</span>
        </a>
      </div>
    </section>
  );
};

const TeshisDetay = () => {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';
  const lang = isTr ? 'tr' : 'en';
  const krizHattiAcik = useKrizHattiAcik();

  const [teshis, setTeshis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug || !teshisLoaders[slug]) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setNotFound(false);

    teshisLoaders[slug]()
      .then((mod) => {
        setTeshis(mod.default || mod);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load diagnostic module:', err);
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (!teshis) return;

    const baslikText = teshis.baslik[lang] || teshis.baslik.tr;
    const ozetText = teshis.ozet[lang] || teshis.ozet.tr;
    const sentences = ozetText.split(/(?<=\.)\s+/);
    let desc = sentences[0];
    if (desc.length < 80 && sentences[1]) {
      desc = desc + ' ' + sentences[1];
    }
    if (desc.length > 160) {
      desc = desc.slice(0, 157) + '...';
    }

    document.title = formatDocumentTitle(isTr
      ? `${baslikText} | Trend Master Akademi`
      : `${baslikText} | Trend Master Academy`);

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', desc);
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://trendmasterakademi.com/teshis/${teshis.slug}/`);
    }
  }, [teshis, lang]);

  if (notFound) {
    return <Navigate to="/teshis/" replace />;
  }

  if (loading || !teshis) {
    return (
      <div className="min-h-[70vh] pt-32 pb-24 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center text-center space-y-6 animate-pulse">
        <div className="w-48 h-6 bg-cyan-500/20 rounded-full border border-cyan-500/30"></div>
        <div className="w-3/4 max-w-lg h-10 bg-white/10 rounded-2xl"></div>
        <div className="w-full max-w-md h-4 bg-white/5 rounded-lg"></div>
      </div>
    );
  }

  const baslikText = teshis.baslik[lang] || teshis.baslik.tr;
  const kirintiText = teshis.kirinti[lang] || teshis.kirinti.tr;
  const aciliyetText = teshis.aciliyet.etiket[lang] || teshis.aciliyet.etiket.tr;
  const ozetText = teshis.ozet[lang] || teshis.ozet.tr;
  const logNotuText = teshis.logNotu[lang] || teshis.logNotu.tr;
  const kimCozerText = teshis.kimCozer[lang] || teshis.kimCozer.tr;
  const cozulmezseText = teshis.cozulmezse[lang] || teshis.cozulmezse.tr;

  const isKritik = teshis.aciliyet.seviye === 'kritik';

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto text-slate-200">
      
      {/* Back Link */}
      <div className="mb-6">
        <Link 
          to="/teshis/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {isTr ? '← Teşhis Kataloğuna Dön' : '← Back to Diagnostic Catalog'}
        </Link>
      </div>

      {/* Main Diagnostic Article Box */}
      <article className="border border-white/10 rounded-3xl bg-[#0d121d] overflow-hidden shadow-2xl">
        
        {/* Terminal Header Bar */}
        <div className="flex items-center gap-2 px-4 sm:px-6 py-3 border-b border-white/5 bg-white/[0.02] text-xs font-mono text-slate-500 overflow-x-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/40"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40"></span>
          <span className="ml-2 text-slate-400 whitespace-nowrap">
            trendmasterakademi.com/teshis/{teshis.slug}/
          </span>
        </div>

        <div className="p-6 sm:p-8 md:p-10 space-y-8">
          
          {/* Header & Meta */}
          <div className="space-y-4 border-b border-white/10 pb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs text-slate-400 font-bold">
                #{teshis.no}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs font-semibold uppercase tracking-wider ${
                isKritik 
                  ? 'bg-red-500/10 border border-red-500/30 text-red-400' 
                  : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
              }`}>
                <AlertTriangle className="w-3.5 h-3.5" />
                {aciliyetText}
              </span>
              <span className="font-mono text-xs text-slate-400">
                {isTr ? 'Teşhis Kataloğu' : 'Diagnostic Catalog'} › {kirintiText}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-snug">
              {baslikText}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl">
              {ozetText}
            </p>
          </div>

          {/* Kriz Şeridi (Konum 1: Başlık + özet altı, log satırları üstü) */}
          <KrizSeridi teshis={teshis} isTr={isTr} lang={lang} krizHattiAcik={krizHattiAcik} />

          {/* Section 1: Sisteminizde bunu arayın (Log Satırları) */}
          <section className="border border-cyan-400/25 rounded-2xl bg-cyan-400/[0.04] overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-cyan-400/20 bg-cyan-400/[0.06]">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                {isTr ? 'Sisteminizde bunu arayın' : 'Look for this in your system'}
              </h2>
              <span className="text-xs font-mono text-slate-400 italic">
                {isTr ? 'log / hata kaydı' : 'error log'}
              </span>
            </div>
            
            <div className="p-4 sm:p-5 space-y-2 overflow-x-auto select-text font-mono text-xs sm:text-sm">
              {teshis.logSatirlari.map((log, idx) => {
                const eslesme = teshis.logEslesme?.find(e => e.satir === idx && e.harf);
                const neden = eslesme ? teshis.nedenler?.find(n => n.harf === eslesme.harf) : null;
                const nedenAd = neden ? (isTr ? (neden.ad?.tr || '') : (neden.ad?.en || neden.ad?.tr || '')) : '';
                return (
                  <div key={`log-${idx}`} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <code className="block text-teal-300 whitespace-pre">
                      {log}
                    </code>
                    {neden && (
                      <span className="text-cyan-400 text-xs font-mono shrink-0">
                        {`→ ${eslesme.harf} · ${nedenAd}`}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-400">
              <p>{logNotuText}</p>
            </div>
          </section>

          {/* Section 2: Teşhis akışı (Flow Diagram) */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              {isTr ? 'Teşhis akışı' : 'Diagnostic flow'}
            </h2>
            <TeshisDiyagram 
              baslik={teshis.baslik} 
              diyagramBaslik={teshis.diyagramBaslik}
              nedenler={teshis.nedenler} 
            />
          </section>

          {/* Section 3: Ayırt edici testler (Neden Kartları) */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {isTr ? 'Ayırt edici testler' : 'Differential tests'}
            </h2>

            <div className={`grid grid-cols-1 ${teshis.nedenler.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>
              {teshis.nedenler.map((cause, idx) => {
                const causeName = cause.ad[lang] || cause.ad.tr;
                const causeDesc = cause.aciklama[lang] || cause.aciklama.tr;
                const causeKanit = cause.kanit[lang] || cause.kanit.tr;
                const bgClass = HARF_BG_COLORS[cause.harf] || 'bg-cyan-400';

                return (
                  <div 
                    key={`card-${idx}`}
                    className="border border-white/10 rounded-2xl bg-white/[0.025] p-5 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-6 h-6 rounded-lg grid place-items-center font-mono text-xs font-bold text-slate-950 flex-shrink-0 ${bgClass}`}>
                          {cause.harf}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-white">
                          {causeName}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {causeDesc}
                      </p>
                    </div>

                    <div className="pt-2">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre">
                        {causeKanit}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 4: Kim çözer / Çözülmezse */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {isTr ? 'Kim çözer / Çözülmezse' : 'Who resolves it / Cost of delay'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-emerald-500/30 rounded-2xl p-5 bg-emerald-500/[0.05] space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                  {isTr ? 'Kim çözer' : 'Who resolves it'}
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {kimCozerText}
                </p>
              </div>

              <div className="border border-amber-500/30 rounded-2xl p-5 bg-amber-500/[0.05] space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block">
                  {isTr ? 'Çözülmezse' : 'If left unresolved'}
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {cozulmezseText}
                </p>
              </div>
            </div>
          </section>

          {/* Kriz Şeridi (Konum 2: Kim çözer / Çözülmezse altı, alt çipler üstü) */}
          <KrizSeridi teshis={teshis} isTr={isTr} lang={lang} krizHattiAcik={krizHattiAcik} />

          {/* Bottom Chips & CTA */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400 mr-1">
                {isTr ? 'İlgili Terimler:' : 'Related Terms:'}
              </span>
              {teshis.ilgiliTerimler.map((termSlug) => (
                <Link
                  key={termSlug}
                  to={`/sozluk/${termSlug}/`}
                  className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] font-mono text-xs text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
                >
                  {termSlug}
                </Link>
              ))}
            </div>

            <Link
              to={teshis.ilgiliHizmet?.link || '/crash-test/'}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <span>{isTr ? 'Ücretsiz teşhis alın →' : 'Get a free triage →'}</span>
            </Link>
          </div>

        </div>

      </article>

    </div>
  );
};

export default TeshisDetay;
