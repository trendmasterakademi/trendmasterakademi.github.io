import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Copy, Check, 
  ArrowRight, RefreshCw, Cpu, Database, GitBranch,
  Layers, Clock, HelpCircle, FileText, Calendar, Zap, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCalendlyUrl } from '../utils/calendly';
import { formatDocumentTitle } from '../utils/pageTitle';
import { isTurkish } from '../i18n';

/**
 * Salvageability Index // Kurtarılabilirlik Karar Matrisi
 * "Refactor vs. Rebuild vs. Scrape"
 * 
 * 5 Boyutlu Risk & Karar Analizi:
 * 1. Mimari & Bağımlılık (Architecture & Coupling) - 25 Puan
 * 2. Test & Bilgi Aktarımı (Test & Knowledge) - 20 Puan
 * 3. Veritabanı & Veri Bütünlüğü (Database & Data Integrity) - 25 Puan
 * 4. Canlı Trafik & Zaman Baskısı (Live Traffic & Deadlines) - 15 Puan
 * 5. Teknik Borç Faizi (Technical Debt Drag) - 15 Puan
 * Toplam: 100 Puan
 */

const questions = [
  {
    id: 'arch_coupling',
    category: { tr: '1. Mimari & Bağımlılık Yapısı', en: '1. Architecture & Coupling' },
    title: { 
      tr: 'Kod tabanının mevcut mimari durumu ve sürüm sağlığı nedir?', 
      en: 'What is the architectural state and version health of the codebase?' 
    },
    desc: {
      tr: 'Framework güncelliği, modüler ayrım ve kodun okunabilirlik seviyesi.',
      en: 'Framework currency, modular isolation, and code readability.'
    },
    options: [
      {
        score: 25,
        label: { 
          tr: 'Modern & Modüler: Desteklenen framework (React, Next.js, Node, Python 3), modüller izole.', 
          en: 'Modern & Modular: Supported frameworks, isolated services, clear boundaries.' 
        }
      },
      {
        score: 15,
        label: { 
          tr: 'Yarı Monolit / Hafif Eskimiş: 2-4 yıllık stack, kısmen spagetti ancak dosyalar bulunabiliyor.', 
          en: 'Semi-Monolith / Slightly Outdated: 2-4 year old stack, some spaghetti but traceable.' 
        }
      },
      {
        score: 5,
        label: { 
          tr: 'Terk Edilmiş / Ağır Spagetti: Versiyonu geçmiş dil/kütüphaneler, aşırı bağımlılık kilitlenmesi.', 
          en: 'Abandoned / Heavy Spaghetti: EOL dependencies, severe coupling, no separation of concerns.' 
        }
      }
    ]
  },
  {
    id: 'test_knowledge',
    category: { tr: '2. Test & Bilgi Aktarımı (Knowledge Transfer)', en: '2. Test Coverage & Knowledge' },
    title: { 
      tr: 'Mevcut test kapsamı ve kodu yazan ekibin erişilebilirliği ne durumda?', 
      en: 'What is the test coverage and availability of the original authors?' 
    },
    options: [
      {
        score: 20,
        label: { 
          tr: 'Kapsamlı Test & Dokümantasyon: Otomatik CI/CD testleri var, mimari şema mevcut.', 
          en: 'Comprehensive Tests & Docs: Automated CI/CD, unit/integration tests, architectural diagram.' 
        }
      },
      {
        score: 10,
        label: { 
          tr: 'Kısmi Bilgi: Test yok veya kırık; ancak geliştiriciyle soru-cevap yapılabiliyor.', 
          en: 'Partial Knowledge: Little/broken tests; original author is reachable for Q&A.' 
        }
      },
      {
        score: 0,
        label: { 
          tr: 'Sıfır Test & Sıfır İletişim: Geliştirici ayrıldı/ulaşılamıyor, hiçbir test veya doküman yok.', 
          en: 'Zero Tests & No Contact: Author left, no tests, no README, complete black box.' 
        }
      }
    ]
  },
  {
    id: 'db_integrity',
    category: { tr: '3. Veritabanı & Veri Bütünlüğü (Database Integrity)', en: '3. Database & Data Integrity' },
    title: { 
      tr: 'Veritabanı şeması, ilişkisel bütünlük ve veri sağlığı ne seviyede?', 
      en: 'What is the state of database schemas, relational integrity, and data health?' 
    },
    options: [
      {
        score: 25,
        label: { 
          tr: 'Sağlam İlişkisel Şema: Foreign keyler, migrasyon geçmişi ve veri yedekleri eksiksiz.', 
          en: 'Solid Relational Schema: Foreign keys, migration history, clean backups intact.' 
        }
      },
      {
        score: 12,
        label: { 
          tr: 'Kısmi Bütünlük: Migrasyonlar eksik, bazı tablolarda yetim (orphan) kayıtlar var ama kurtarılabilir.', 
          en: 'Partial Integrity: Missing migration history, some orphan rows, but recoverable.' 
        }
      },
      {
        score: 0,
        label: { 
          tr: 'Kritik Veri Kirliliği: İlişkiler kod içinde çözülmüş, deadlocklar var, şema dokümantasyonu yok.', 
          en: 'Critical Data Corruption: Inconsistent logic in code, frequent deadlocks, unmapped tables.' 
        }
      }
    ]
  },
  {
    id: 'traffic_deadline',
    category: { tr: '4. Canlı Trafik & Zaman Baskısı (Live Traffic & Deadlines)', en: '4. Live Traffic & Deadlines' },
    title: { 
      tr: 'Sistemin canlı kullanıcı trafiği ve yaklaşan teslimat baskısı nedir?', 
      en: 'What is the live user traffic level and approaching delivery pressure?' 
    },
    options: [
      {
        score: 15,
        label: { 
          tr: 'Canlı & Kritik Gelir Akışı: Sistem anlık ödeme/sipariş alıyor; durdurulamaz (Zero-Downtime şart).', 
          en: 'Live & Revenue-Critical: System processes active payments; zero-downtime required.' 
        }
      },
      {
        score: 10,
        label: { 
          tr: 'Yaklaşan Lansman / Ceza Riski: 2-4 hafta içinde teslim zorunluluğu var, canlıda değil.', 
          en: 'Hard Deadline / Penalty Risk: Must launch within 2-4 weeks, not yet live.' 
        }
      },
      {
        score: 5,
        label: { 
          tr: 'Esnek Zaman: Canlıda kritik trafik yok, teslim tarihi esnetilebilir.', 
          en: 'Flexible Timeline: No active critical traffic, timeline can be adjusted.' 
        }
      }
    ]
  },
  {
    id: 'tech_debt_drag',
    category: { tr: '5. Teknik Borç Faizi (Technical Debt Drag)', en: '5. Technical Debt Drag' },
    title: { 
      tr: 'Yeni bir özellik eklemek veya hata düzeltmek ne kadar sürüyor?', 
      en: 'How long does it take to ship a simple feature or fix a bug?' 
    },
    options: [
      {
        score: 15,
        label: { 
          tr: 'Öngörülebilir: Yeni özellikler 1-3 günde test edilip canlıya güvenle alınabiliyor.', 
          en: 'Predictable: Features ship in 1-3 days with high confidence.' 
        }
      },
      {
        score: 8,
        label: { 
          tr: 'Sürtünmeli: Basit bir değişiklik beklenmedik başka yerleri bozabiliyor (2-5x gecikme).', 
          en: 'Friction: Simple changes break unrelated modules (2-5x delay factor).' 
        }
      },
      {
        score: 0,
        label: { 
          tr: 'Kilitlenmiş (Code Paralysis): Geliştiriciler koda dokunmaktan korkuyor, her deploy kriz yaratıyor.', 
          en: 'Code Paralysis: Developers fear touching code, every deploy triggers an outage.' 
        }
      }
    ]
  }
];

const Salvageability = () => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const lang = isTr ? 'tr' : 'en';

  const [answers, setAnswers] = useState({
    arch_coupling: 15,
    test_knowledge: 10,
    db_integrity: 12,
    traffic_deadline: 10,
    tech_debt_drag: 8
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = formatDocumentTitle(isTr 
      ? 'Salvageability Index // Kurtarılabilirlik Karar Matrisi | Trend Master Akademi'
      : 'Salvageability Index // Refactor vs Rebuild Matrix | Trend Master Akademi');

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', isTr
        ? 'Mevcut kodu kurtarmaya değer mi, yoksa baştan mı yazmalı? 5 boyutlu teknik fizibilite analizi ve kurtarılabilirlik skoru.'
        : 'Is the codebase worth saving or should you rebuild from scratch? 5-dimensional technical feasibility and salvageability scoring.'
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', isTr ? 'https://trendmasterakademi.com/kurtarilabilirlik/' : 'https://trendmasterakademi.com/salvageability/');
    }
  }, [lang]);

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

  // Karar Matrisi Mantığı:
  // 70 - 100: Cerrahi Kurtarma (SWAT Viable)
  // 40 - 69: Kademeli Strangler Fig Dönüşümü
  // 0 - 39: Temiz Sayfa / Sıfırdan Yazım (Clean Slate)
  let decision = {
    code: 'SWAT_RESCUE',
    title: { 
      tr: 'Cerrahi SWAT Müdahalesi Uygulanabilir (%70+ Kurtarılabilir)', 
      en: 'Surgical SWAT Rescue Viable (70%+ Salvageable)' 
    },
    badgeColor: 'text-emerald-800 bg-emerald-50 border-emerald-300',
    tag: { tr: 'REFACTOR & STABILIZE', en: 'REFACTOR & STABILIZE' },
    summary: {
      tr: 'Kod tabanının çekirdeği ve veri omurgası kurtarılmaya değer. Sıfırdan yazım hem maliyet hem de zaman açısından gereksiz bir risk yaratır. Cerrahi bir SWAT müdahalesiyle 48-72 saatte kilit noktalar izole edilip sistem stabilize edilebilir.',
      en: 'The core and data backbone are worth saving. A full rewrite would introduce unnecessary cost and timeline risk. Surgical SWAT stabilization within 48-72 hours can unblock delivery.'
    },
    actionPlan: [
      { tr: 'Veritabanı transaction sırasını ve indeksleme kilitlerini izole et', en: 'Isolate DB transaction locks and indexing bottlenecks' },
      { tr: 'Hata veren veya sızdıran 1-2 kritik modüle cerrahi bypass hotfix uygula', en: 'Deploy surgical bypass hotfixes to 1-2 failing modules' },
      { tr: 'Temel CI/CD ve regressif test kalkanı kurarak teslimatı tamamla', en: 'Establish minimal CI/CD and regression safety shields' }
    ],
    financialRoi: {
      tr: 'Sıfırdan yazıma kıyasla tahmini %60–%75 bütçe tasarrufu, 3–6 ay zaman kazancı.',
      en: 'Estimated 60-75% budget savings vs full rewrite, saving 3-6 months.'
    }
  };

  if (totalScore < 40) {
    decision = {
      code: 'CLEAN_SLATE',
      title: { 
        tr: 'Temiz Sayfa Tavsiyesi (Baştan Yazım Daha Ekonomik)', 
        en: 'Clean Slate Recommendation (Rebuild Is More Economical)' 
      },
      badgeColor: 'text-rose-800 bg-rose-50 border-rose-300',
      tag: { tr: 'SCRAP & REBUILD', en: 'SCRAP & REBUILD' },
      summary: {
        tr: 'Mevcut kod tabanındaki teknik borç faizi, sıfırdan modern stack ile yazmaktan daha maliyetlidir. Bu koda harcanacak her geliştirici saati, yeni hatalar üretecek bir kara deliktir. Veritabanı şemasını dışa aktarıp temiz bir mimariyle baştan yazılması tavsiye edilir.',
        en: 'The technical debt drag exceeds the cost of a modern greenfield build. Investing further engineering hours here will generate diminishing returns. Export schema/data and rebuild clean.'
      },
      actionPlan: [
        { tr: 'Mevcut veritabanındaki verileri doğrula ve güvenli dump al', en: 'Verify and extract clean database schemas and data dumps' },
        { tr: 'Gereksiz karmaşıklığı atıp sadece çekirdek MVP fonksiyonlarını listele', en: 'Strip unnecessary legacy bloat; define core MVP specifications' },
        { tr: 'Modern, tip güvenli altyapı (FastAPI / Next.js / Nest) ile 3-4 haftalık sprint kur', en: 'Launch a 3-4 week sprint on modern, type-safe architecture' }
      ],
      financialRoi: {
        tr: 'Eski kodu yamamaya çalışmak, baştan yazmaktan %140 daha pahalıya mal olur.',
        en: 'Attempting to patch legacy debt will cost 140% more than a clean build.'
      }
    };
  } else if (totalScore < 70) {
    decision = {
      code: 'STRANGLER_FIG',
      title: { 
        tr: 'Kademeli Strangler Fig Dönüşümü Tavsiye Edilir', 
        en: 'Staged Strangler Fig Migration Recommended' 
      },
      badgeColor: 'text-[var(--accent)] bg-[var(--accent-subtle)] border-[var(--accent)]/30',
      tag: { tr: 'STRANGLER MIGRATION', en: 'STRANGLER MIGRATION' },
      summary: {
        tr: 'Kod tabanı ne tamamen çöpe atılacak kadar çürük ne de tek seferde düzeltilecek kadar temiz. Canlı sistem durdurulamaz; bu nedenle monolitik yapı canlıda çalışırken, tıkanan modüller (ödeme, auth, api) paralel mikroservislerle kademeli olarak devralınmalıdır.',
        en: 'The system is neither completely dead nor clean enough for a quick hotfix. Live traffic cannot stop; adopt the Strangler Fig pattern to migrate bottleneck modules in parallel.'
      },
      actionPlan: [
        { tr: 'Trafik önüne bir ters vekil sunucu (reverse proxy) koy', en: 'Place a reverse proxy in front of live production traffic' },
        { tr: 'En çok çöken 1 modülü (örn: ödeme/sipariş) izole mikroservise yönlendir', en: 'Reroute the most volatile module to an isolated microservice' },
        { tr: 'Veritabanı kilitlerini gölge trafik (shadow traffic) ile temizle', en: 'Decouple database contention with shadow traffic validation' }
      ],
      financialRoi: {
        tr: 'Sıfır kesinti (Zero-Downtime) ile kademeli modernizasyon, bütçe riskini %50 düşürür.',
        en: 'Zero-downtime modernization with staged releases cuts financial risk by 50%.'
      }
    };
  }

  const copyReport = () => {
    const reportText = `[TMA SALVAGEABILITY INDEX REPORT]
Tarih: ${new Date().toISOString().split('T')[0]}
Kurtarılabilirlik Skoru: %${totalScore} / 100
Karar: ${decision.title.tr}
Strateji: ${decision.tag.tr}

Özet Değerlendirme:
${decision.summary.tr}

Tavsiye Edilen Eylem Adımları:
${decision.actionPlan.map((a, i) => `${i + 1}. ${a.tr}`).join('\n')}

Finansal & Süreç Etkisi:
${decision.financialRoi.tr}

Doğrulama & Triyaj Masası: Trend Master Akademi Studio & Labs
https://trendmasterakademi.com/kurtarilabilirlik/`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen pt-32 pb-28 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto bg-[var(--paper)] text-[var(--ink)] font-sans selection:bg-[var(--accent)] selection:text-white">
      
      {/* Header */}
      <header className="mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--accent)] text-xs font-mono font-medium uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          {isTr ? 'TEKNİK FİZİBİLİTE & KARAR MATRİSİ' : 'TECHNICAL FEASIBILITY & DECISION MATRIX'}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-[var(--ink)] tracking-tight">
          {isTr ? 'Salvageability Index' : 'Salvageability Index'}
        </h1>

        <p className="text-[var(--ink-light)] text-base sm:text-lg leading-relaxed max-w-[34rem]">
          {isTr 
            ? 'Bir yazılım krizinde sorulması gereken en kritik soru: «Bu kodu kurtarmaya değer mi, yoksa sıfırdan mı yazılmalı?» 5 boyutlu risk analizini yanıtlayın, tarafsız kurtarılabilirlik skorunu ve eylem planını anında görün.'
            : 'The most decisive question in a software crisis: "Is this codebase worth saving or should you rebuild?" Answer 5 risk dimensions to determine your salvageability score and action blueprint.'}
        </p>

        <div className="flex flex-wrap gap-2.5 pt-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--accent)] font-semibold">
            {isTr ? 'Refactor vs. Rebuild vs. Scrap' : 'Refactor vs. Rebuild vs. Scrap'}
          </span>
          <span className="px-3 py-1.5 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink-light)] font-semibold">
            {isTr ? '60 Saniyede Matematiksel Karar' : 'Mathematical Decision in 60s'}
          </span>
        </div>
      </header>

      {/* Main Grid: Questions on Left, Live Matrix on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Questions Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-4 shadow-sm">
              <div className="space-y-1">
                <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase tracking-wider">
                  {q.category[lang]}
                </span>
                <h3 className="text-base sm:text-lg font-serif font-semibold text-[var(--ink)]">
                  {q.title[lang]}
                </h3>
                {q.desc && (
                  <p className="text-xs text-[var(--ink-muted)]">
                    {q.desc[lang]}
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5 pt-1">
                {q.options.map((opt, oIdx) => {
                  const isSelected = answers[q.id] === opt.score;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.score }))}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer min-h-[44px] ${
                        isSelected
                          ? 'bg-[var(--accent-subtle)] border-[var(--accent)] text-[var(--ink)] shadow-sm'
                          : 'bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink-light)] hover:bg-[var(--surface)] hover:text-[var(--ink)]'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border mt-0.5 flex-shrink-0 flex items-center justify-center ${
                        isSelected ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[var(--rule)]'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                      </div>
                      <span className="leading-relaxed">{opt.label[lang]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Live Score & Decision Matrix (5 Cols Sticky) */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
          
          <div className="p-7 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-6 shadow-sm relative overflow-hidden">
            {/* Score Display */}
            <div className="space-y-2 border-b border-[var(--rule)] pb-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-[var(--ink-muted)] uppercase tracking-wider">
                  {isTr ? 'Kurtarılabilirlik Skoru' : 'Salvageability Score'}
                </span>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold uppercase border ${decision.badgeColor}`}>
                  {decision.tag[lang]}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-serif font-semibold text-[var(--ink)] font-mono tracking-tight">
                  %{totalScore}
                </span>
                <span className="text-sm font-mono text-[var(--ink-muted)]">/ 100</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-[var(--paper)] border border-[var(--rule)] overflow-hidden mt-3">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    totalScore >= 70 ? 'bg-emerald-600' : totalScore >= 40 ? 'bg-[var(--accent)]' : 'bg-rose-600'
                  }`}
                  style={{ width: `${totalScore}%` }}
                ></div>
              </div>
            </div>

            {/* Decision & Action */}
            <div className="space-y-4">
              <h4 className="text-lg font-serif font-semibold text-[var(--ink)] leading-snug">
                {decision.title[lang]}
              </h4>
              <p className="text-xs sm:text-sm text-[var(--ink-light)] leading-relaxed">
                {decision.summary[lang]}
              </p>

              {/* Action Blueprint */}
              <div className="space-y-2 pt-2 border-t border-[var(--rule)]">
                <span className="text-xs font-mono text-[var(--accent)] font-semibold uppercase block">
                  {isTr ? 'Öncelikli Eylem Planı:' : 'Recommended Action Plan:'}
                </span>
                <ul className="space-y-1.5 text-xs text-[var(--ink-light)]">
                  {decision.actionPlan.map((action, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[var(--accent)] font-mono font-semibold">0{i + 1}.</span>
                      <span>{action[lang]}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Financial ROI Note */}
              <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--rule)] text-xs font-mono text-[var(--ink-light)]">
                <strong className="text-emerald-800 block mb-0.5 font-semibold">{isTr ? 'Finansal Etki:' : 'Financial Impact:'}</strong>
                {decision.financialRoi[lang]}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2 border-t border-[var(--rule)]">
              <button
                type="button"
                onClick={copyReport}
                className="btn-secondary min-h-[44px] w-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4 text-[var(--ink-muted)]" />}
                <span>{copied ? (isTr ? 'Rapor Panoya Kopyalandı!' : 'Report Copied!') : (isTr ? 'Karar Raporunu Kopyala' : 'Copy Decision Report')}</span>
              </button>

              <a
                href={getCalendlyUrl('salvageability', { score: totalScore, strategy: decision.code })}
                target="_blank"
                rel="noreferrer"
                className="btn-primary min-h-[44px] w-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 text-center"
              >
                <Calendar className="w-4 h-4" />
                <span>{isTr ? 'Bu Skoru Kıdemli Masayla Değerlendir' : 'Discuss Score with Senior Desk'}</span>
              </a>
            </div>

          </div>

          {/* Quiet Note */}
          <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--rule)] text-xs text-[var(--ink-muted)] font-mono leading-relaxed">
            {isTr 
              ? 'TMA Salvageability Matrix; son 5 yılda incelenen 60+ yarım kalmış, çökmüş veya sahipsiz kod tabanının ampirik kurtarma verilerine dayanır.' 
              : 'The TMA Salvageability Matrix is grounded in empirical recovery metrics from 60+ distressed and legacy codebases evaluated over 5 years.'}
          </div>

        </div>

      </div>

    </div>
  );
};

export default Salvageability;
