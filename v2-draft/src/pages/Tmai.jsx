import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { tmaiData } from '../data/tmaiData';
import { tmaiH1 } from '../data/pageH1Data';
import { setPageSeo } from '../utils/pageTitle';
import { isTurkish } from '../i18n';

const Tmai = () => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const lang = isTr ? 'tr' : 'en';
  const data = tmaiData[lang];

  useEffect(() => {
    setPageSeo(isTr ? '/tmai/' : '/ai-code-takeover/', lang);
  }, [isTr, lang]);

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 md:px-8 bg-[var(--paper)] text-[var(--ink)] relative font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* 1. Rozet · H1 · Giris */}
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--r-control)] bg-[var(--accent-wash)] border border-[var(--accent)] text-[var(--accent)] text-xs font-mono font-semibold uppercase tracking-wider">
            {data.rozet}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold font-serif text-[var(--ink)] tracking-tight leading-tight">
            {tmaiH1[lang]}
          </h1>
          <p className="text-base sm:text-lg text-[var(--ink-2)] leading-relaxed">
            {data.giris}
          </p>
        </section>

        {/* 2. neZaman.baslik · neZaman.maddeler */}
        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold font-serif text-[var(--ink)] tracking-tight">
            {data.neZaman.baslik}
          </h2>
          <ul className="space-y-3">
            {data.neZaman.maddeler.map((madde, idx) => (
              <li key={idx} className="flex items-start gap-3 text-base text-[var(--ink-2)]">
                <span className="text-[var(--accent)] font-mono font-bold mt-0.5">•</span>
                <span>{madde}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 3. kontroller.baslik · kontroller.giris · 6 kart */}
        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold font-serif text-[var(--ink)] tracking-tight">
            {data.kontroller.baslik}
          </h2>
          <p className="text-base text-[var(--ink-2)] leading-relaxed">
            {data.kontroller.giris}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {data.kontroller.maddeler.map((kart, idx) => (
              <div key={idx} className="p-6 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] space-y-3">
                <h3 className="text-lg font-semibold font-serif text-[var(--ink)]">
                  {kart.baslik}
                </h3>
                <p className="text-sm text-[var(--ink-2)] leading-relaxed">
                  {kart.neden}
                </p>
                <div className="text-xs font-mono text-[var(--ink-3)] pt-2 border-t border-[var(--rule)]">
                  <strong className="text-[var(--accent)] font-semibold">
                    {isTr ? 'Bakılan:' : 'What we check:'}
                  </strong>{' '}
                  {kart.bakilan}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. surec.baslik · 5 adım, numaralı */}
        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold font-serif text-[var(--ink)] tracking-tight">
            {data.surec.baslik}
          </h2>
          <div className="space-y-4 pt-2">
            {data.surec.adimlar.map((adim, idx) => (
              <div key={idx} className="p-6 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] flex flex-col sm:flex-row items-start gap-4">
                <div className="w-8 h-8 rounded-[var(--r-control)] bg-[var(--accent-wash)] border border-[var(--accent)] text-[var(--accent)] font-mono font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="space-y-1.5 flex-1">
                  {adim.link ? (
                    <Link to={adim.link} className="text-base sm:text-lg font-semibold font-serif text-[var(--ink)] hover:text-[var(--accent)] hover:underline inline-flex items-center gap-1.5 transition-colors">
                      <span>{adim.baslik}</span>
                      <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
                    </Link>
                  ) : (
                    <h3 className="text-base sm:text-lg font-semibold font-serif text-[var(--ink)]">
                      {adim.baslik}
                    </h3>
                  )}
                  <p className="text-sm text-[var(--ink-2)] leading-relaxed">
                    {adim.metin}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. sinir.baslik · sinir.metin */}
        <section className="p-6 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] space-y-2">
          <h2 className="text-xl font-semibold font-serif text-[var(--ink)]">
            {data.sinir.baslik}
          </h2>
          <p className="text-sm sm:text-base text-[var(--ink-2)] leading-relaxed">
            {data.sinir.metin}
          </p>
        </section>

        {/* 6. aracNotu */}
        <p className="text-xs text-[var(--ink-3)] font-mono leading-relaxed">
          {data.aracNotu}
        </p>

        {/* 7. cta.baslik · cta.metin · birincil düğme (btn-primary) · ikincil düğme (btn-secondary) */}
        <section className="p-6 sm:p-8 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] space-y-4 text-left">
          <h2 className="text-2xl font-semibold font-serif text-[var(--ink)]">
            {data.cta.baslik}
          </h2>
          <p className="text-sm sm:text-base text-[var(--ink-2)] leading-relaxed">
            {data.cta.metin}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link to={data.cta.birincil.link} className="btn-primary">
              <span>{data.cta.birincil.etiket}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to={data.cta.ikincil.link} className="btn-secondary">
              <span>{data.cta.ikincil.etiket}</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Tmai;
