import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, AlertTriangle, Terminal, MessageSquare, PhoneCall } from 'lucide-react';
import TeshisDiyagram from '../components/TeshisDiyagram';
import { formatDocumentTitle } from '../utils/pageTitle';
import { useKrizHattiAcik } from '../utils/krizHatti';
import { isTurkish } from '../i18n';

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
  A: 'bg-red-700 text-white',
  B: 'bg-amber-700 text-white',
  C: 'bg-purple-700 text-white',
  D: 'bg-blue-700 text-white'
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
    <section className="border border-emerald-300 rounded-2xl bg-emerald-50/50 p-4 sm:p-5 space-y-3">
      <div className="space-y-1.5">
        <h3 className="text-sm sm:text-base font-serif font-semibold text-[var(--ink)]">
          {isTr ? 'Bu belirti şu an sizin sisteminizde mi?' : 'Are you seeing this right now?'}
        </h3>
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--ink-light)]">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${krizHattiAcik ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`}></span>
          <span className={krizHattiAcik ? 'text-emerald-900 font-medium' : 'text-amber-900 font-medium'}>
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
          className="btn-primary min-h-[44px] inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold"
        >
          <MessageSquare className="w-4 h-4 flex-shrink-0" />
          <span>{isTr ? "WhatsApp'tan yaz" : 'Message on WhatsApp'}</span>
        </a>

        <a
          href="tel:+905343713573"
          className="btn-secondary min-h-[44px] inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold font-mono"
        >
          <PhoneCall className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>+90 534 371 35 73</span>
        </a>
      </div>
    </section>
  );
};

const TeshisDetay = () => {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
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
      canonical.setAttribute('href', isTr ? `https://trendmasterakademi.com/teshis/${teshis.slug}/` : `https://trendmasterakademi.com/diagnostic/${teshis.slug}/`);
    }
  }, [teshis, lang]);

  if (notFound) {
    return <Navigate to="/teshis/" replace />;
  }

  if (loading || !teshis) {
    return (
      <div className="min-h-[70vh] pt-32 pb-24 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center text-center space-y-6 bg-[var(--paper)]">
        <div className="w-48 h-6 bg-[var(--surface)] rounded-full border border-[var(--rule)]"></div>
        <div className="w-3/4 max-w-lg h-10 bg-[var(--surface)] rounded-2xl border border-[var(--rule)]"></div>
        <div className="w-full max-w-md h-4 bg-[var(--surface)] rounded-lg"></div>
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
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto bg-[var(--paper)] text-[var(--ink)] font-sans selection:bg-[var(--accent)] selection:text-white">
      
      {/* Back Link */}
      <div className="mb-6">
        <Link 
          to="/teshis/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-[var(--accent)] hover:underline font-mono transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" /> {isTr ? '← Teşhis Kataloğuna Dön' : '← Back to Diagnostic Catalog'}
        </Link>
      </div>

      {/* Main Diagnostic Article Box */}
      <article className="border border-[var(--rule)] rounded-2xl bg-[var(--surface)] overflow-hidden shadow-sm">
        
        {/* Terminal Header Bar */}
        <div className="flex items-center gap-2 px-4 sm:px-6 py-3 border-b border-[var(--rule)] bg-[var(--paper)] text-xs font-mono text-[var(--ink-muted)] overflow-x-auto">
          <span className="text-[var(--ink-muted)] whitespace-nowrap">
            trendmasterakademi.com/teshis/{teshis.slug}/
          </span>
        </div>

        <div className="p-6 sm:p-8 md:p-10 space-y-8">
          
          {/* Header & Meta */}
          <div className="space-y-4 border-b border-[var(--rule)] pb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs text-[var(--accent)] font-bold">
                #{teshis.no}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs font-semibold uppercase tracking-wider ${
                isKritik 
                  ? 'bg-rose-50 border border-rose-300 text-rose-800' 
                  : 'bg-amber-50 border border-amber-300 text-amber-800'
              }`}>
                <AlertTriangle className="w-3.5 h-3.5" />
                {aciliyetText}
              </span>
              <span className="font-mono text-xs text-[var(--ink-muted)]">
                {isTr ? 'Teşhis Kataloğu' : 'Diagnostic Catalog'} › {kirintiText}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-[var(--ink)] tracking-tight leading-snug">
              {baslikText}
            </h1>

            <p className="text-[var(--ink-light)] text-sm sm:text-base md:text-lg leading-relaxed max-w-[34rem]">
              {ozetText}
            </p>

            {teshis.sahadaNasilGorunur && (
              <div className="pt-4 border-t border-[var(--rule)] space-y-2">
                <h2 className="text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider text-[var(--accent)]">
                  {isTr ? 'Sahada nasıl görünür' : 'How it shows up in the field'}
                </h2>
                <p className="text-[var(--ink-light)] text-sm sm:text-base leading-relaxed max-w-[34rem]">
                  {teshis.sahadaNasilGorunur[lang] || teshis.sahadaNasilGorunur.tr}
                </p>
              </div>
            )}
          </div>

          {/* Kriz Şeridi (Konum 1: Başlık + özet altı, log satırları üstü) */}
          <KrizSeridi teshis={teshis} isTr={isTr} lang={lang} krizHattiAcik={krizHattiAcik} />

          {/* Section 1: Sisteminizde bunu arayın (Log Satırları - Terminal Theme) */}
          <section className="border border-[var(--rule)] rounded-2xl bg-[var(--term-bg)] overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-white/10 bg-white/5">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
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
                    <code className="block text-emerald-300 whitespace-pre">
                      {log}
                    </code>
                    {neden && (
                      <span className="text-emerald-400 text-xs font-mono shrink-0">
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
            <h2 className="text-lg sm:text-xl font-serif font-semibold text-[var(--ink)] flex items-center gap-2">
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
            <h2 className="text-lg sm:text-xl font-serif font-semibold text-[var(--ink)]">
              {isTr ? 'Ayırt edici testler' : 'Differential tests'}
            </h2>

            <div className={`grid grid-cols-1 ${teshis.nedenler.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>
              {teshis.nedenler.map((cause, idx) => {
                const causeName = cause.ad[lang] || cause.ad.tr;
                const causeDesc = cause.aciklama[lang] || cause.aciklama.tr;
                const causeKanit = cause.kanit[lang] || cause.kanit.tr;
                const bgClass = HARF_BG_COLORS[cause.harf] || 'bg-[var(--accent)] text-white';

                return (
                  <div 
                    key={`card-${idx}`}
                    className="border border-[var(--rule)] rounded-2xl bg-[var(--paper)] p-5 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-6 h-6 rounded-lg grid place-items-center font-mono text-xs font-bold flex-shrink-0 ${bgClass}`}>
                          {cause.harf}
                        </span>
                        <h3 className="text-sm sm:text-base font-semibold text-[var(--ink)]">
                          {causeName}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--ink-light)] leading-relaxed">
                        {causeDesc}
                      </p>
                    </div>

                    <div className="pt-2 space-y-2.5">
                      <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--rule)] font-mono text-xs text-[var(--ink)] overflow-x-auto whitespace-pre">
                        {causeKanit}
                      </div>

                      {cause.yanlisDuzeltme && (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-800 block">
                            {isTr ? 'Sık yapılan yanlış düzeltme' : 'Common wrong fix'}
                          </span>
                          <p className="leading-relaxed">
                            {cause.yanlisDuzeltme[lang] || cause.yanlisDuzeltme.tr}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 4: Kim çözer / Çözülmezse */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif font-semibold text-[var(--ink)]">
              {isTr ? 'Kim çözer / Çözülmezse' : 'Who resolves it / Cost of delay'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-emerald-300 rounded-2xl p-5 bg-emerald-50/50 space-y-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800 block">
                  {isTr ? 'Kim çözer' : 'Who resolves it'}
                </span>
                <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
                  {kimCozerText}
                </p>
              </div>

              <div className="border border-amber-300 rounded-2xl p-5 bg-amber-50/50 space-y-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-800 block">
                  {isTr ? 'Çözülmezse' : 'If left unresolved'}
                </span>
                <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                  {cozulmezseText}
                </p>
              </div>
            </div>
          </section>

          {/* Kriz Şeridi (Konum 2: Kim çözer / Çözülmezse altı, alt çipler üstü) */}
          <KrizSeridi teshis={teshis} isTr={isTr} lang={lang} krizHattiAcik={krizHattiAcik} />

          {/* Bottom Chips & CTA */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[var(--rule)]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-[var(--ink-muted)] mr-1">
                {isTr ? 'İlgili Terimler:' : 'Related Terms:'}
              </span>
              {teshis.ilgiliTerimler.map((termSlug) => (
                <Link
                  key={termSlug}
                  to={`/sozluk/${termSlug}/`}
                  className="px-3 py-1.5 rounded-lg border border-[var(--rule)] bg-[var(--paper)] font-mono text-xs text-[var(--ink)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors min-h-[44px] inline-flex items-center"
                >
                  {termSlug}
                </Link>
              ))}
            </div>

            <Link
              to={teshis.ilgiliHizmet?.link || '/crash-test/'}
              className="btn-primary min-h-[44px] inline-flex items-center gap-2 text-xs sm:text-sm font-semibold"
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
