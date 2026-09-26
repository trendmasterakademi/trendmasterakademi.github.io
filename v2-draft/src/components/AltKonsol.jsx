import React from 'react';
import { ChevronDown } from 'lucide-react';

// Ana sayfa ilk ekranının dibindeki konsol: aşağıda "Tüm sayfalar" dizini olduğunu gösterir ve oraya götürür.
// Komut bir kez yazılır (yalnız CSS; ilk HTML'de metin tamdır), imleç yanıp söner, çıktı ardından belirir.
// Klasör adları (sm ve üstü) dizini o kategori seçili açar. Hareketi azalt ayarında animasyon yoktur (index.css).

const KLASOR = {
  acil: ['acil', 'emergency'],
  teshis: ['teşhis', 'diagnostic'],
  araclar: ['araçlar', 'tools'],
  ajans: ['ajanslar', 'agencies'],
  vaka: ['vaka', 'archive'],
  sozluk: ['sözlük', 'glossary'],
  kurumsal: ['kurumsal', 'company'],
};

const AltKonsol = ({ isTr, kategoriler, sayfaSayisi, onSec }) => {
  const komut = isTr ? 'ls tüm-sayfalar/' : 'ls all-pages/';
  const ozet = isTr ? `${kategoriler.length} kategori · ${sayfaSayisi} sayfa` : `${kategoriler.length} categories · ${sayfaSayisi} pages`;
  const git = (e, id) => { e.preventDefault(); onSec(id); };

  return (
    <nav
      aria-label={isTr ? 'Tüm sayfalar kısayolu' : 'All pages shortcut'}
      data-alt-konsol=""
      style={{ '--alt-konsol-harf': komut.length }}
      className="absolute bottom-3 sm:bottom-8 left-4 right-[88px] sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-[min(640px,calc(100%-2rem))] z-10 text-left font-mono text-xs sm:text-[13px] leading-5 rounded-[var(--r-panel)] border border-[var(--rule)] bg-[var(--term-bg)]/85 backdrop-blur-sm shadow-lg px-3.5 py-2 sm:px-4 sm:py-3 text-[var(--term-ink)] transition-colors hover:border-[var(--term-diff-add)]/50 focus-within:border-[var(--term-diff-add)]/60"
    >
      <div aria-hidden="true" className="flex items-center gap-2 whitespace-nowrap overflow-hidden">
        <span className="hidden sm:flex items-center gap-1 mr-1">
          <span className="w-2 h-2 rounded-full bg-[var(--term-accent)]" />
          <span className="w-2 h-2 rounded-full bg-[var(--term-warn)]" />
          <span className="w-2 h-2 rounded-full bg-[var(--term-diff-add)]" />
        </span>
        <span className="text-[var(--term-diff-add)]">tma:~$</span>
        <span className="alt-konsol-komut text-[var(--term-bright)]">{komut}</span>
        <span className="alt-konsol-imlec" />
      </div>

      <ul className="alt-konsol-cikti hidden sm:flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-[var(--term-dim)]">
        {kategoriler.map((k) => (
          <li key={k.id}>
            <a
              href="#tum-sayfalar"
              onClick={(e) => git(e, k.id)}
              className="relative z-[1] rounded-sm hover:text-[var(--term-diff-add)] focus-visible:text-[var(--term-diff-add)] transition-colors"
              aria-label={isTr ? `${k.tr} kategorisine in` : `Go to ${k.en}`}
            >
              {(KLASOR[k.id] || [k.id, k.id])[isTr ? 0 : 1]}/
            </a>
          </li>
        ))}
      </ul>

      <a
        href="#tum-sayfalar"
        onClick={(e) => git(e, null)}
        aria-label={isTr ? `${ozet} aşağıda: tüm sayfalara in` : `${ozet} below: go to all pages`}
        className="alt-konsol-cikti mt-1.5 flex items-center justify-between gap-3 text-[var(--term-dim)] hover:text-[var(--term-ink)] transition-colors after:absolute after:inset-0 after:content-[''] after:rounded-[var(--r-panel)]"
      >
        <span>{ozet}</span>
        <span className="inline-flex items-center gap-1 text-[var(--term-ink)]">
          <span className="hidden sm:inline">{isTr ? 'aşağıda' : 'below'}</span>
          <ChevronDown aria-hidden="true" className="alt-konsol-ok w-4 h-4 text-[var(--term-diff-add)]" />
        </span>
      </a>
    </nav>
  );
};

export default AltKonsol;
