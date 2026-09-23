import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, AlertTriangle, Terminal, MessageSquare, PhoneCall } from 'lucide-react';
import TeshisDiyagram from '../components/TeshisDiyagram';
import { setPageSeo } from '../utils/pageTitle';
import { useKrizHattiAcik } from '../utils/krizHatti';
import { isTurkish } from '../i18n';
import { diagnosticLogEnMap } from '../data/diagnosticLogEnMap';
import { teshisSummaries } from '../data/teshis/indexSummary.js';

// Dynamic code-split loaders: Each diagnostic chunk is loaded strictly on demand!
const teshisModules = import.meta.glob(['../data/teshis/*.js', '!../data/teshis/indexSummary.js', '!../data/teshis/count.js']);
const teshisLoaders = Object.fromEntries(
  Object.entries(teshisModules).map(([p, load]) => [p.split('/').pop().replace(/\.js$/, ''), load])
);

const HARF_BG_COLORS = {
  A: 'bg-[var(--tint-danger-bg)] text-[var(--tint-danger-ink)] border border-[var(--tint-danger-rule)]',
  B: 'bg-[var(--tint-warn-bg)] text-[var(--tint-warn-ink)] border border-[var(--tint-warn-rule)]',
  C: 'bg-[var(--tint-info-bg)] text-[var(--tint-info-ink)] border border-[var(--tint-info-rule)]',
  D: 'bg-[var(--tint-info-bg)] text-[var(--tint-info-ink)] border border-[var(--tint-info-rule)]'
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
    <section className="border border-[var(--tint-ok-rule)] rounded-2xl bg-[var(--tint-ok-bg)] p-4 sm:p-5 space-y-3">
      <div className="space-y-1.5">
        <h3 className="text-sm sm:text-base font-serif font-semibold text-[var(--ink)]">
          {isTr ? 'Bu belirti şu an sizin sisteminizde mi?' : 'Are you seeing this right now?'}
        </h3>
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--ink-2)]">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${krizHattiAcik ? 'bg-[var(--tint-ok-ink)] animate-pulse' : 'bg-[var(--tint-warn-ink)]'}`}></span>
          <span className={krizHattiAcik ? 'text-[var(--tint-ok-ink)] font-medium' : 'text-[var(--tint-warn-ink)] font-medium'}>
            {krizHattiAcik
              ? (isTr
                  ? 'Kriz hattı şu an açık · her gün 09:00 – 24:00 · canlı kesintilerde ilk yanıt taahhüdü 15 dakika'
                  : 'Response desk is open now · daily 09:00 – 24:00 · first-response commitment for live outages: 15 minutes')
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
          <PhoneCall className="w-4 h-4 text-[var(--tint-ok-ink)] flex-shrink-0" />
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
    setPageSeo(isTr ? `/teshis/${teshis.slug}/` : `/diagnostic/${teshis.slug}/`, lang);
  }, [teshis, lang, isTr]);

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
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto bg-[var(--paper)] text-[var(--ink)] font-sans selection:bg-[var(--accent)] selection:text-[var(--on-accent)]">
      
      {/* Back Link */}
      <div className="mb-6">
        <Link 
          to={isTr ? "/teshis/" : "/diagnostic/"} 
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-[var(--accent)] hover:underline font-mono transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" /> {isTr ? '← Teşhis Kataloğuna Dön' : '← Back to Diagnostic Catalog'}
        </Link>
      </div>

      {/* Main Diagnostic Article Box */}
      <article className="border border-[var(--rule)] rounded-2xl bg-[var(--surface)] overflow-hidden shadow-sm">
        
        {/* Terminal Header Bar */}
        <div className="flex items-center gap-2 px-4 sm:px-6 py-3 border-b border-[var(--rule)] bg-[var(--paper)] text-xs font-mono text-[var(--ink-3)] overflow-x-auto">
          <span className="text-[var(--ink-3)] whitespace-nowrap">
            trendmasterakademi.com/{isTr ? 'teshis' : 'diagnostic'}/{teshis.slug}/
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
                  ? 'bg-[var(--tint-danger-bg)] border border-[var(--tint-danger-rule)] text-[var(--tint-danger-ink)]' 
                  : 'bg-[var(--tint-warn-bg)] border border-[var(--tint-warn-rule)] text-[var(--tint-warn-ink)]'
              }`}>
                <AlertTriangle className="w-3.5 h-3.5" />
                {aciliyetText}
              </span>
              <span className="font-mono text-xs text-[var(--ink-3)]">
                {isTr ? 'Teşhis Kataloğu' : 'Diagnostic Catalog'} › {kirintiText}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-[var(--ink)] tracking-tight leading-snug">
              {baslikText}
            </h1>

            <p className="text-[var(--ink-2)] text-sm sm:text-base md:text-lg leading-relaxed max-w-[34rem]">
              {ozetText}
            </p>

            {teshis.sahadaNasilGorunur && (
              <div className="pt-4 border-t border-[var(--rule)] space-y-2">
                <h2 className="text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider text-[var(--accent)]">
                  {isTr ? 'Sahada nasıl görünür' : 'How it shows up in the field'}
                </h2>
                <p className="text-[var(--ink-2)] text-sm sm:text-base leading-relaxed max-w-[34rem]">
                  {teshis.sahadaNasilGorunur[lang] || teshis.sahadaNasilGorunur.tr}
                </p>
              </div>
            )}

            {teshis.hataMetinleri && teshis.hataMetinleri.length > 0 && (
              <div className="pt-4 border-t border-[var(--rule)] space-y-3">
                <h2 className="text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider text-[var(--accent)]">
                  {isTr ? 'Ekranda gördüğünüz metin' : 'What you see on screen'}
                </h2>
                <div className="space-y-3">
                  {teshis.hataMetinleri.map((hm, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="p-3 rounded-xl bg-[var(--term-bg)] border border-[var(--rule)] font-mono text-xs sm:text-sm text-[var(--term-ink)] overflow-x-auto whitespace-pre">
                        <code>{hm.metin?.[lang] || hm.metin?.tr || ''}</code>
                      </div>
                      {(hm.nerede?.[lang] || hm.nerede?.tr) && (
                        <p className="text-xs text-[var(--ink-3)] font-sans">
                          {hm.nerede[lang] || hm.nerede.tr}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Kriz Şeridi (Konum 1: Başlık + özet altı, log satırları üstü) */}
          <KrizSeridi teshis={teshis} isTr={isTr} lang={lang} krizHattiAcik={krizHattiAcik} />

          {/* Section 1: Sisteminizde bunu arayın (Log Satırları - Terminal Theme) */}
          <section className="border border-[var(--rule)] rounded-2xl bg-[var(--term-bg)] overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-[var(--term-rule)] bg-[var(--term-bg-2)]">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--term-ink)] flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                {isTr ? 'Sisteminizde bunu arayın' : 'Look for this in your system'}
              </h2>
              <span className="text-xs font-mono text-[var(--term-dim)] italic">
                {isTr ? 'log / hata kaydı' : 'error log'}
              </span>
            </div>
            
            <div className="p-4 sm:p-5 space-y-2 overflow-x-auto select-text font-mono text-xs sm:text-sm">
              {teshis.logSatirlari.map((log, idx) => {
                const displayLog = (!isTr && diagnosticLogEnMap[log]) ? diagnosticLogEnMap[log] : log;
                const eslesme = teshis.logEslesme?.find(e => e.satir === idx && e.harf);
                const neden = eslesme ? teshis.nedenler?.find(n => n.harf === eslesme.harf) : null;
                const nedenAd = neden ? (isTr ? (neden.ad?.tr || '') : (neden.ad?.en || neden.ad?.tr || '')) : '';
                return (
                  <div key={`log-${idx}`} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <code className="block text-[var(--term-ink)] whitespace-pre">
                      {displayLog}
                    </code>
                    {neden && (
                      <span className="text-[var(--term-dim)] text-xs font-mono shrink-0">
                        {`→ ${eslesme.harf} · ${nedenAd}`}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-[var(--term-dim)]">
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
                const bgClass = HARF_BG_COLORS[cause.harf] || 'bg-[var(--accent)] text-[var(--on-accent)]';

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
                      <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
                        {causeDesc}
                      </p>
                    </div>

                    <div className="pt-2 space-y-2.5">
                      <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--rule)] font-mono text-xs text-[var(--ink)] overflow-x-auto whitespace-pre">
                        {causeKanit}
                      </div>

                      {cause.yanlisDuzeltme && (
                        <div className="p-2.5 rounded-xl bg-[var(--tint-warn-bg)] border border-[var(--tint-warn-rule)] text-xs text-[var(--ink)] space-y-1">
                          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--tint-warn-ink)] block">
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

          {/* Section: İlk 10 dakikada kendiniz kontrol edin */}
          {teshis.kontrolAdimlari && (teshis.kontrolAdimlari[lang] || teshis.kontrolAdimlari.tr)?.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-serif font-semibold text-[var(--ink)]">
                {isTr ? 'İlk 10 dakikada kendiniz kontrol edin' : 'Check it yourself in the first 10 minutes'}
              </h2>
              <div className="border border-[var(--rule)] rounded-2xl p-5 sm:p-6 bg-[var(--paper)]">
                <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
                  {(teshis.kontrolAdimlari[lang] || teshis.kontrolAdimlari.tr).map((step, idx) => (
                    <li key={idx}>
                      <span className="font-sans text-[var(--ink)]">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          )}

          {/* Section: Ne zaman devretmeli? */}
          {teshis.devirNoktasi && (teshis.devirNoktasi[lang] || teshis.devirNoktasi.tr) && (
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-serif font-semibold text-[var(--ink)]">
                {isTr ? 'Ne zaman devretmeli?' : 'When to hand it over'}
              </h2>
              <div className="border border-[var(--rule)] rounded-2xl p-5 sm:p-6 bg-[var(--surface)]">
                <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
                  {teshis.devirNoktasi[lang] || teshis.devirNoktasi.tr}
                </p>
              </div>
            </section>
          )}

          {/* Section 4: Kim çözer / Çözülmezse */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-serif font-semibold text-[var(--ink)]">
              {isTr ? 'Kim çözer / Çözülmezse' : 'Who resolves it / Cost of delay'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-[var(--tint-ok-rule)] rounded-2xl p-5 bg-[var(--tint-ok-bg)] space-y-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--tint-ok-ink)] block">
                  {isTr ? 'Kim çözer' : 'Who resolves it'}
                </span>
                <p className="text-xs sm:text-sm text-[var(--ink)] leading-relaxed">
                  {kimCozerText}
                </p>
              </div>

              <div className="border border-[var(--tint-warn-rule)] rounded-2xl p-5 bg-[var(--tint-warn-bg)] space-y-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--tint-warn-ink)] block">
                  {isTr ? 'Çözülmezse' : 'If left unresolved'}
                </span>
                <p className="text-xs sm:text-sm text-[var(--ink)] leading-relaxed">
                  {cozulmezseText}
                </p>
              </div>
            </div>
          </section>

          {/* Section: Resmî dokümanlar */}
          {teshis.resmiKaynaklar && teshis.resmiKaynaklar.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-serif font-semibold text-[var(--ink)]">
                {isTr ? 'Resmî dokümanlar' : 'Official documentation'}
              </h2>
              <ul className="space-y-2 font-mono text-xs sm:text-sm">
                {teshis.resmiKaynaklar.map((rk, idx) => {
                  const ad = rk.ad?.[lang] || rk.ad?.tr || '';
                  const url = rk.url?.[lang] || rk.url?.tr || '';
                  return (
                    <li key={idx}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:underline inline-flex items-center gap-1.5"
                      >
                        <span>→ {ad}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Kriz Şeridi (Konum 2: Kim çözer / Çözülmezse altı, alt çipler üstü) */}
          <KrizSeridi teshis={teshis} isTr={isTr} lang={lang} krizHattiAcik={krizHattiAcik} />

          {/* Bottom Chips & CTA */}
          <div className="space-y-4 pt-6 border-t border-[var(--rule)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-[var(--ink-3)] mr-1">
                  {isTr ? 'İlgili Terimler:' : 'Related Terms:'}
                </span>
                {teshis.ilgiliTerimler.map((termSlug) => (
                  <Link
                    key={termSlug}
                    to={isTr ? `/sozluk/${termSlug}/` : `/glossary/${termSlug}/`}
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

            {teshis.ilgiliTeshisler && teshis.ilgiliTeshisler.length > 0 && (
              <div className="pt-4 border-t border-[var(--rule)] space-y-2">
                <span className="text-xs font-mono text-[var(--ink-3)] block">
                  {isTr ? 'İlgili teşhisler:' : 'Related diagnostics:'}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {teshis.ilgiliTeshisler.map((tSlug) => {
                    const target = teshisSummaries.find((s) => s.slug === tSlug);
                    const title = target ? (target.baslik?.[lang] || target.baslik?.tr || tSlug) : tSlug;
                    return (
                      <Link
                        key={tSlug}
                        to={isTr ? `/teshis/${tSlug}/` : `/diagnostic/${tSlug}/`}
                        className="px-3 py-1.5 rounded-lg border border-[var(--rule)] bg-[var(--paper)] font-sans text-xs sm:text-sm text-[var(--ink)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors min-h-[44px] inline-flex items-center"
                      >
                        → {title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

      </article>

    </div>
  );
};

export default TeshisDetay;
