import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, ArrowUpRight } from 'lucide-react';
import HomeBackground from '../components/HomeBackground';
import HomeCanvas from '../components/HomeCanvas';
import AltKonsol from '../components/AltKonsol';
import { useAnaSayfaSayfalama } from '../components/anaSayfaSayfalama';
import { setPageSeo } from '../utils/pageTitle';
import { isTurkish } from '../i18n';
import { CATEGORY_DEFS, getPagesForLang } from '../data/categoryMap';

// 1-to-1 character mapping table for Turkish and Latin characters
const TR_CHAR_MAP = {
  'ş': 's', 'Ş': 's',
  'ı': 'i', 'I': 'i', 'İ': 'i', 'i': 'i',
  'ğ': 'g', 'Ğ': 'g',
  'ç': 'c', 'Ç': 'c',
  'ö': 'o', 'Ö': 'o',
  'ü': 'u', 'Ü': 'u'
};

const normalizeChar = (ch) => {
  if (TR_CHAR_MAP[ch]) return TR_CHAR_MAP[ch];
  const lower = ch.toLowerCase();
  return lower.length === 1 ? lower : ch;
};

// Character-by-character normalization: length of input exactly matches length of output
const normalize1to1 = (str) => {
  if (!str) return '';
  let res = '';
  for (let i = 0; i < str.length; i++) {
    res += normalizeChar(str[i]);
  }
  return res;
};

// Snippet boundary extraction (~140 chars)
const extractSnippet = (text, query, maxLen = 140) => {
  if (!text) return '';
  const normText = normalize1to1(text);
  const normQuery = normalize1to1(query).trim();
  if (!normQuery) {
    const raw = text.slice(0, maxLen).trim();
    return text.length > maxLen ? `${raw} …` : raw;
  }

  let matchIdx = normText.indexOf(normQuery);
  if (matchIdx === -1) {
    const firstWord = normQuery.split(/\s+/)[0];
    if (firstWord) matchIdx = normText.indexOf(firstWord);
  }
  if (matchIdx === -1) matchIdx = 0;

  let start = Math.max(0, matchIdx - Math.floor(maxLen / 3));
  let end = Math.min(text.length, start + maxLen);

  if (start > 0) {
    const spaceBefore = text.indexOf(' ', start);
    if (spaceBefore !== -1 && spaceBefore < matchIdx) start = spaceBefore + 1;
  }
  if (end < text.length) {
    const spaceAfter = text.lastIndexOf(' ', end);
    if (spaceAfter > matchIdx) end = spaceAfter;
  }

  let snippet = text.slice(start, end).trim();
  if (start > 0) snippet = `… ${snippet}`;
  if (end < text.length) snippet = `${snippet} …`;

  return snippet;
};

// Vurgulama (<mark>) bileşeni: Harfsiz sorgularda da özgün harf kılıfını koruyarak işaretler
const renderHighlight = (snippet, query) => {
  if (!query || !snippet) return snippet;
  const normSnippet = normalize1to1(snippet);
  const words = query.trim().split(/\s+/).filter(Boolean).map(normalize1to1);
  if (!words.length) return snippet;

  const intervals = [];
  for (const w of words) {
    if (!w) continue;
    let pos = 0;
    while ((pos = normSnippet.indexOf(w, pos)) !== -1) {
      intervals.push([pos, pos + w.length]);
      pos += w.length;
    }
  }

  if (!intervals.length) return snippet;
  intervals.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  // Merge overlapping / adjacent intervals
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = intervals[i];
    if (curr[0] <= prev[1]) {
      prev[1] = Math.max(prev[1], curr[1]);
    } else {
      merged.push(curr);
    }
  }

  const parts = [];
  let last = 0;
  for (let i = 0; i < merged.length; i++) {
    const [start, end] = merged[i];
    if (start > last) {
      parts.push(snippet.slice(last, start));
    }
    parts.push(
      <mark key={i} className="bg-[var(--accent-wash)] text-[var(--accent-ink)] font-semibold px-0.5 rounded">
        {snippet.slice(start, end)}
      </mark>
    );
    last = end;
  }
  if (last < snippet.length) {
    parts.push(snippet.slice(last));
  }

  return parts;
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const navigate = useNavigate();

  // Açılışta yazılan harfler kaybolmaz: Ön-render arama kutusuna girilmiş değeri devral
  const [query, setQuery] = useState(() => {
    if (typeof window !== 'undefined' && window.__TMA_INITIAL_SEARCH__) {
      return window.__TMA_INITIAL_SEARCH__;
    }
    return '';
  });
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [isDropdownOpen, setIsDropdownOpen] = useState(() => query.trim().length > 0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchIndex, setSearchIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('acil');

  const searchBoxRef = useRef(null);
  const inputRef = useRef(null);
  const loadingIndexRef = useRef(false);
  const kokRef = useRef(null);
  const dizinRef = useRef(null);
  // Adım 100: tekerlek ve klavye sayfa sayfa kaydırır; arama kutusu dizinde üstte ortada durur
  const { git: sayfayaGit, yuvada } = useAnaSayfaSayfalama({ kokRef, dizinRef, kutuRef: searchBoxRef });

  // SEO setup
  useEffect(() => {
    setPageSeo('/', isTr ? 'tr' : 'en');
  }, [i18n.language, isTr]);

  // Debounce query ~100ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 100);
    return () => clearTimeout(handler);
  }, [query]);

  // Lazy download search index on focus or input
  const loadSearchIndex = useCallback(async () => {
    if (searchIndex || loadingIndexRef.current) return;
    loadingIndexRef.current = true;
    try {
      const res = await fetch('/arama-dizini.json');
      if (res.ok) {
        const data = await res.json();
        setSearchIndex(data);
      }
    } catch (err) {
      console.warn('Could not load search index:', err);
    } finally {
      loadingIndexRef.current = false;
    }
  }, [searchIndex]);

  // Ön-render sırasında değer girilmişse arama dizinini hemen başlat
  useEffect(() => {
    if (query.trim().length > 0) {
      loadSearchIndex();
    }
  }, [loadSearchIndex, query]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Filter and rank search results
  const searchResults = useMemo(() => {
    const q = debouncedQuery.trim();
    if (q.length < 2 || !searchIndex) return [];

    const normQ = normalize1to1(q);
    const qWords = normQ.split(/\s+/).filter(Boolean);

    // Kapsam: Aktif dilin sayfaları (Türkçede tr + ortak, İngilizcede en + ortak)
    const filteredIndex = searchIndex.filter(page => {
      if (page.url === '/') return false;
      if (isTr) return page.dil === 'tr' || page.dil === 'ortak';
      return page.dil === 'en' || page.dil === 'ortak';
    }).map(page => (!isTr && page.dil === 'ortak' && page.baslik_en)
      ? { ...page, baslik: page.baslik_en, metin: page.metin_en || page.metin }
      : page);

    const matches = [];

    for (const item of filteredIndex) {
      const normTitle = normalize1to1(item.baslik || '');
      const normText = normalize1to1(item.metin || '');

      let score = 0;

      // 1. Tam ifade başlıkta geçiyor
      if (normTitle.includes(normQ)) {
        score = 1000;
      }
      // 2. Tam ifade metinde geçiyor
      else if (normText.includes(normQ)) {
        score = 500;
      }
      // 3. Bütün kelimeler geçiyor
      else if (qWords.every(w => normTitle.includes(w) || normText.includes(w))) {
        score = 200;
      }
      // 4. En az bir kelime geçiyor
      else if (qWords.some(w => normTitle.includes(w) || normText.includes(w))) {
        score = 50;
      }

      if (score > 0) {
        const snippet = extractSnippet(item.metin || item.baslik, q, 140);
        matches.push({
          ...item,
          score,
          snippet
        });
      }
    }

    // Rank results by score descending
    // Adım 100: çözüm odaklı sonuçlar üstte, terimler (sözlük) her zaman en altta.
    // Önce güçlü eşleşmeler (başlıkta ya da metinde tam ifade), sonra kelime eşleşmeleri; her grupta teşhis → acil → araçlar → vaka → ajans → kurumsal.
    const ONCELIK = { teshis: 0, acil: 1, araclar: 2, vaka: 3, ajans: 4, kurumsal: 5 };
    const grup = (m) => (m.kategori === 'sozluk' ? 20 : 0) + (m.score >= 500 ? 0 : 10) + (ONCELIK[m.kategori] ?? 6);
    matches.sort((a, b) => grup(a) - grup(b) || b.score - a.score);
    return matches;
  }, [debouncedQuery, searchIndex, isTr]);

  // Keyboard navigation inside search dropdown
  const handleKeyDown = (e) => {
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsDropdownOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        navigate(searchResults[selectedIndex].url);
        setIsDropdownOpen(false);
      } else if (searchResults.length > 0) {
        navigate(searchResults[0].url);
        setIsDropdownOpen(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsDropdownOpen(false);
      setSelectedIndex(-1);
    }
  };

  // Alt konsol: dizine in; kategori verilmişse onu seç; odak seçili sekmeye geçer
  const dizineGit = (katId) => {
    if (katId) setActiveCategory(katId);
    sayfayaGit(1, () => {
      const sekme = katId ? document.getElementById(`tab-${katId}`) : document.querySelector('#tum-sayfalar [role="tab"][aria-selected="true"]');
      if (sekme) sekme.focus({ preventScroll: true });
    });
  };

  // Sekmeler arasında ←/→ ile gezinme (WAI-ARIA sekme kalıbı)
  const handleTabKeyDown = (e, currentCatId) => {
    const catIds = CATEGORY_DEFS.map(c => c.id);
    const idx = catIds.indexOf(currentCatId);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextId = catIds[(idx + 1) % catIds.length];
      setActiveCategory(nextId);
      document.getElementById(`tab-${nextId}`)?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevId = catIds[(idx - 1 + catIds.length) % catIds.length];
      setActiveCategory(prevId);
      document.getElementById(`tab-${prevId}`)?.focus();
    }
  };

  // Directory pages for active language
  const allCategoryPages = useMemo(() => {
    return getPagesForLang(isTr ? 'tr' : 'en');
  }, [isTr]);

  const resultCountText = t('home-search-count').replace('{n}', searchResults.length);

  return (
    <div ref={kokRef} data-ana-sayfa="" className="home-dark-scope relative min-h-screen overflow-x-clip text-[var(--ink-2)] selection:bg-[var(--accent)] selection:text-[var(--on-accent)] font-sans">
      {/* 1. Canlı arka plan: Stok fotoğraf katmanı (Unsplash) */}
      <HomeBackground />

      {/* 2. Fotoğraf üstü şeffaf canvas animasyon katmanı (Ekran/ışık karışımı, saydamlık ~0.65) */}
      <HomeCanvas />

      {/* 3. Genel arka plan kararması: En fazla %30 (Tüm ekranı %80+ karartan katman kalktı) */}
      <div 
        aria-hidden="true" 
        className="ana-karartma fixed inset-0 pointer-events-none z-[1] bg-black"
      />

      {/* 4. İlk Ekran (100svh, koyu, ortalanmış tek odak) */}
      <section className="relative z-20 min-h-[100svh] flex flex-col justify-center items-center px-4 pt-20 pb-28 sm:pb-40 text-center max-w-4xl mx-auto">
        {/* Başlık, slogan ve arama kutusunun arkasında yumuşak kenarlı radyal karartma geçişi (Kontrast ≥ 4.5:1) */}
        <div 
          aria-hidden="true"
          className="absolute inset-0 sm:-inset-x-16 -inset-y-12 bg-[radial-gradient(ellipse_at_center,rgba(15,18,22,0.85)_0%,rgba(15,18,22,0.55)_50%,transparent_75%)] pointer-events-none -z-10 rounded-3xl"
        />

        {/* H1 Başlık (Source Serif 4, clamp boyutlu, dize sabiti JSX yok) */}
        <h1 className="ana-ilk-ekran-icerik font-serif text-[var(--ink)] font-normal tracking-tight mb-3 [font-size:clamp(1.75rem,5.5vw+0.5rem,4.5rem)] break-words max-w-full leading-[1.08] select-none">
          {t('home-h1')}
        </h1>

        {/* Bir satır slogan */}
        <p className="ana-ilk-ekran-icerik text-[var(--ink-2)] text-base sm:text-lg md:text-xl font-normal tracking-normal mb-8 sm:mb-10 max-w-xl mx-auto">
          {t('home-slogan')}
        </p>

        {/* Tek Odak: Büyük hap biçimli arama kutusu */}
        <div data-arama-yeri="" className="w-full max-w-[640px] mx-auto relative h-14 sm:h-16">
        <div
          ref={searchBoxRef}
          data-arama-kutusu={yuvada ? 'yuva' : 'yerinde'}
          className={yuvada
            ? 'fixed z-30 top-[72px] left-1/2 -translate-x-1/2 w-[min(560px,calc(100vw-24px))]'
            : 'absolute inset-x-0 top-0'}
        >
          <div className="relative flex items-center">
            <Search className="absolute left-5 z-10 w-5 h-5 text-[var(--ink-3)] pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={isDropdownOpen && (searchResults.length > 0 || query.trim().length > 0)}
              aria-controls="search-results-listbox"
              aria-autocomplete="list"
              aria-activedescendant={selectedIndex >= 0 ? `search-option-${selectedIndex}` : undefined}
              aria-label={t('home-search-aria-label')}
              placeholder={t('home-search-placeholder')}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsDropdownOpen(true);
                loadSearchIndex();
              }}
              onFocus={() => {
                loadSearchIndex();
                if (query.trim().length > 0) setIsDropdownOpen(true);
              }}
              onKeyDown={handleKeyDown}
              className={`w-full ${yuvada ? 'h-11' : 'h-14 sm:h-16'} pl-11 sm:pl-13 ${query ? 'pr-12' : 'pr-5'} rounded-full bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--rule-strong)] text-[var(--ink)] placeholder:text-[var(--ink-3)] text-sm sm:text-base focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 transition-all shadow-2xl`}
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setDebouncedQuery('');
                  setSelectedIndex(-1);
                  if (inputRef.current) inputRef.current.focus();
                }}
                className="absolute right-4 p-2 text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full"
                aria-label={isTr ? 'Aramayı temizle' : 'Clear search'}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sonuç Sayısı Duyurusu (Ekran Okuyucu) */}
          <div className="sr-only" aria-live="polite">
            {query.trim().length >= 2 ? resultCountText : ''}
          </div>

          {/* Sonuç Listesi (Arama kutusunun hemen altında açılır) */}
          {isDropdownOpen && (
            <div className="absolute top-full left-2 right-2 sm:left-0 sm:right-0 mt-2 bg-[var(--surface)]/95 backdrop-blur-xl border border-[var(--rule)] rounded-2xl shadow-2xl z-50 overflow-hidden text-left">
              {/* Durum: 1 Karakter Girişi */}
              {query.trim().length === 1 && (
                <div className="p-4 text-center text-xs font-mono text-[var(--ink-3)]">
                  {t('home-search-min-chars')}
                </div>
              )}

              {/* Durum: Sonuçlar Var */}
              {query.trim().length >= 2 && searchResults.length > 0 && (
                <>
                  <div className="px-5 py-2.5 border-b border-[var(--rule)] flex items-center justify-between text-xs font-mono text-[var(--ink-3)] bg-[var(--paper)]/50">
                    <span>{resultCountText}</span>
                    <span className="text-[11px] hidden sm:inline">↑↓ gezin · Enter seç</span>
                  </div>

                  <div
                    role="listbox"
                    id="search-results-listbox"
                    className="max-h-[380px] sm:max-h-[440px] overflow-y-auto divide-y divide-[var(--rule)]"
                  >
                    {searchResults.map((item, idx) => {
                      const katDef = CATEGORY_DEFS.find(c => c.id === item.kategori);
                      const katLabel = katDef ? (isTr ? katDef.tr : katDef.en) : item.kategori;

                      return (
                        <div
                          key={item.url}
                          role="option"
                          id={`search-option-${idx}`}
                          aria-selected={selectedIndex === idx}
                          onClick={() => {
                            navigate(item.url);
                            setIsDropdownOpen(false);
                          }}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`px-5 py-3.5 block transition-colors cursor-pointer text-left ${
                            selectedIndex === idx ? 'bg-[var(--paper)]' : 'hover:bg-[var(--paper)]/50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-semibold text-xs sm:text-sm text-[var(--ink)] group-hover:text-[var(--accent)] line-clamp-1">
                              {item.baslik}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink-3)] flex-shrink-0">
                              {katLabel}
                            </span>
                          </div>
                          <div className="text-xs text-[var(--ink-2)] line-clamp-2 leading-relaxed">
                            {renderHighlight(item.snippet, query)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Durum: Sonuç Yok */}
              {query.trim().length >= 2 && searchResults.length === 0 && (
                <div className="p-6 text-center space-y-3">
                  <p className="text-xs sm:text-sm text-[var(--ink-2)]">
                    {t('home-search-empty')}
                  </p>
                  <a
                    href="#tum-sayfalar"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsDropdownOpen(false);
                      const el = document.getElementById('tum-sayfalar');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent)] hover:underline min-h-[44px]"
                  >
                    ↓ {t('home-directory-title')}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
        </div>

        <AltKonsol isTr={isTr} kategoriler={CATEGORY_DEFS} onSec={dizineGit} />
      </section>

      {/* 5. İlk ekranın altı: "Tüm sayfalar" dizini (Koyu) */}
      <section id="tum-sayfalar" ref={dizinRef} className="ana-dizin relative z-10 max-w-6xl mx-auto px-4 pt-32 sm:pt-36 pb-16 sm:pb-24 border-t border-[var(--rule)]">
        <h2 className="sr-only">
          {t('home-directory-title')}
        </h2>

        {/* Kategoriler hap sekmelerle gösterilir (WAI-ARIA sekme kalıbı, ←/→ ile geçilir) */}
        <div role="tablist" aria-label={t('home-directory-title')} className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORY_DEFS.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                id={`tab-${cat.id}`}
                aria-controls={`panel-${cat.id}`}
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat.id)}
                onKeyDown={(e) => handleTabKeyDown(e, cat.id)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer min-h-[44px] flex items-center ${
                  isActive
                    ? 'bg-[var(--accent)] text-[var(--on-accent)] shadow-md'
                    : 'bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--paper)]'
                }`}
              >
                {isTr ? cat.tr : cat.en}
              </button>
            );
          })}
        </div>

        {/* 7 kategori paneli: WAI-ARIA tabpanel kalıbı. Yalnız biri görünür, diğerleri hidden. 66 sayfanın tümü HTML'de mevcuttur. */}
        {CATEGORY_DEFS.map(cat => {
          const isSelected = activeCategory === cat.id;
          const pages = allCategoryPages.filter(p => p.kategori === cat.id);
          return (
            <div
              key={cat.id}
              role="tabpanel"
              id={`panel-${cat.id}`}
              aria-labelledby={`tab-${cat.id}`}
              hidden={!isSelected}
              className={isSelected ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" : undefined}
            >
              {pages.map(page => (
                <Link
                  key={page.url}
                  to={page.url}
                  className="p-4 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--accent)]/40 hover:bg-[var(--paper)] transition-all group flex flex-col justify-between min-h-[76px]"
                >
                  <span className="text-xs sm:text-sm font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-snug line-clamp-2">
                    {page.baslik}
                  </span>
                  <span className="text-[11px] font-mono text-[var(--ink-3)] group-hover:text-[var(--accent)] transition-colors flex items-center justify-between mt-3 pt-2 border-t border-[var(--rule)]/60">
                    <span className="truncate">{page.url}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </span>
                </Link>
              ))}
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Home;
