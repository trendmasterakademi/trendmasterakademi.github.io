import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, ArrowRight, ArrowLeft, 
  RotateCcw, Copy, Flame, Clock, ShieldCheck, 
  Code2, Users, Check, Cpu, Layers,
  PhoneCall, Mail, Send, Calendar, Stethoscope, Loader2
} from 'lucide-react';
import EmergencySOSModal from '../components/EmergencySOSModal';
import { getCalendlyUrl } from '../utils/calendly';
import { setPageSeo } from '../utils/pageTitle';
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

const scenarios = [
  {
    id: 'http500',
    code: 'HTTP 500',
    tag: { tr: 'KRİTİK ACİLİYET', en: 'CRITICAL SEVERITY' },
    title: { tr: 'Müşteri Sitesi / Canlı Sistem Çöktü', en: 'Client Website / Live System Down' },
    subtitle: { tr: 'Canlı yayın kesintisi · Veritabanı kilidi · Ödeme API kopması', en: 'Production outage · Database deadlock · Payment API breakdown' },
    icon: Flame,
    color: 'from-red-500/20 to-orange-500/20',
    borderColor: 'border-red-500/40',
    badgeColor: 'text-red-400 bg-red-500/10 border-red-500/30',
    questions: [
      {
        id: 'outageScope',
        label: { tr: 'Kesintinin Kapsamı Nedir?', en: 'What is the scope of the outage?' },
        options: [
          { value: 'total', label: { tr: 'Tüm sistem çöktü (Beyaz ekran / 500 Internal Server Error)', en: 'Full outage (Blank screen / 500 Internal Server Error)' } },
          { value: 'partial', label: { tr: 'Ödeme, üyelik veya kritik bir API çalışmıyor', en: 'Payment, auth, or critical API integration failed' } },
          { value: 'slow', label: { tr: 'Aşırı yavaşlık & veritabanı kilitlenmesi yaşanıyor', en: 'Severe degradation & database locks' } }
        ]
      },
      {
        id: 'accessStatus',
        label: { tr: 'Sunucu ve Kod Erişim Durumunuz Nedir?', en: 'What is your server and codebase access status?' },
        options: [
          { value: 'full', label: { tr: 'Git repo ve SSH / cPanel / Cloud erişimlerimiz tam', en: 'Full Git repo, SSH / cPanel / Cloud access available' } },
          { value: 'gitOnly', label: { tr: 'Yalnızca kaynak kod / Git erişimi var', en: 'Only source code / Git access is available' } },
          { value: 'limited', label: { tr: 'Şifreler dağınık, önceki geliştiricide kaldı', en: 'Credentials missing or stuck with former developer' } }
        ]
      },
      {
        id: 'clientPressure',
        label: { tr: 'Müşteri Tarafındaki Durum Nedir?', en: 'What is the client sentiment level?' },
        options: [
          { value: 'furious', label: { tr: 'Müşteri aktif ciro kaybediyor / Sözleşme fesih riski', en: 'Client is losing revenue / Risk of contract cancellation' } },
          { value: 'waiting', label: { tr: 'Müşteri haber bekliyor, süre kısıtlı', en: 'Client is waiting for updates, tight timeframe' } },
          { value: 'internal', label: { tr: 'Kendi şirket içi altyapımız, müşteri henüz fark etmedi', en: 'Internal system, no external client escalations yet' } }
        ]
      }
    ]
  },
  {
    id: 'handover',
    code: 'HANDOVER HELL',
    tag: { tr: 'YÜKSEK RİSK', en: 'HIGH RISK' },
    title: { tr: 'Yazılımcı / Ekip Projeden Çekildi', en: 'Developer Disengaged / Stranded Codebase' },
    subtitle: { tr: 'Yarım kalmış kod tabanı · Dokümantasyon yok · Devir tıkanması', en: 'Stranded codebase · No documentation · Handover bottleneck' },
    icon: Users,
    color: 'from-amber-500/20 to-yellow-500/20',
    borderColor: 'border-amber-500/40',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    questions: [
      {
        id: 'docState',
        label: { tr: 'Mevcut Kodun Dokümantasyonu ve Durumu Nedir?', en: 'What is the condition and documentation of the code?' },
        options: [
          { value: 'none', label: { tr: 'Sıfır dokümantasyon, karmaşık spagetti kod', en: 'Zero documentation, tangled spaghetti code' } },
          { value: 'partial', label: { tr: 'Kısmen anlaşılır ama kritik kısımlar izole değil', en: 'Partially readable, but critical logic is intertwined' } },
          { value: 'clean', label: { tr: 'Modern stack (React, Node, Python), kod okunabilir', en: 'Modern stack (React, Node, Python), readable structure' } }
        ]
      },
      {
        id: 'deadlineGap',
        label: { tr: 'Teslim Tarihine Ne Kadar Süre Var?', en: 'How much time is left until the delivery deadline?' },
        options: [
          { value: 'passed', label: { tr: 'Teslim tarihi geçti / Müşteri cezai şart işletiyor', en: 'Deadline passed / Client imposing contractual penalties' } },
          { value: 'thisWeek', label: { tr: 'Bu hafta içinde teslim edilmesi gerekiyor', en: 'Must be delivered within this week' } },
          { value: 'month', label: { tr: '1 aydan fazla süremiz var ama ekip kapasitesi yetersiz', en: 'More than a month, but internal capacity is overloaded' } }
        ]
      },
      {
        id: 'missingModules',
        label: { tr: 'Eksik Kalan Parça Ne Kadar Büyüklükte?', en: 'How large is the missing piece?' },
        options: [
          { value: 'core', label: { tr: 'Backend, veri akışı veya kritik entegrasyonlar bitmemiş', en: 'Core backend, data flows, or integrations unfinished' } },
          { value: 'bugs', label: { tr: 'Proje bitti sanılıyordu ama her yerden bug fışkırıyor', en: 'Project was thought done, but bugs are everywhere' } },
          { value: 'ui', label: { tr: 'Sadece frontend / tasarım uyarlamaları eksik', en: 'Only frontend / UI responsive polishing pending' } }
        ]
      }
    ]
  },
  {
    id: 't48h',
    code: 'T−48H CRUNCH',
    tag: { tr: 'ZAMAN KRİTİK', en: 'TIME CRITICAL' },
    title: { tr: 'Teslime 48 Saat Kaldı / Lansman Krizi', en: '48 Hours to Launch / Delivery Crunch' },
    subtitle: { tr: 'Kapasite açığı · Yetişmeyen modüller · Acil bitirme baskısı', en: 'Capacity shortage · Pending modules · Urgent delivery crunch' },
    icon: Clock,
    color: 'bg-[var(--surface)]',
    borderColor: 'border-[var(--rule)]',
    badgeColor: 'text-[var(--accent)] bg-[var(--paper)] border-[var(--rule)]',
    questions: [
      {
        id: 'remainingWork',
        label: { tr: 'Kalan İşin Tahmini Hacmi Nedir?', en: 'What is the estimated volume of remaining work?' },
        options: [
          { value: 'heavy', label: { tr: '2-3 deneyimli yazılımcının 24 saat aralıksız çalışması gerek', en: 'Needs 2-3 senior devs working continuously' } },
          { value: 'moderate', label: { tr: '1 kıdemli yazılımcının odaklanmış 1-2 günü yeterli', en: '1 senior dev focused for 1-2 days is sufficient' } },
          { value: 'polish', label: { tr: 'Hata ayıklama, responsive uyum ve son testler kaldı', en: 'Bug fixes, responsive alignment, and final QA tests' } }
        ]
      },
      {
        id: 'techStackMatch',
        label: { tr: 'Kullanılan Teknoloji Yığını Nedir?', en: 'What is the technology stack used?' },
        options: [
          { value: 'custom', label: { tr: 'Özel PHP / Legacy Framework / Dağınık mimari', en: 'Legacy PHP / Custom Framework / Fragmented stack' } },
          { value: 'mobile', label: { tr: 'Flutter / React Native Mobil Uygulama', en: 'Flutter / React Native Mobile Application' } },
          { value: 'modern', label: { tr: 'React / Next.js / Node.js / Python / PostgreSQL', en: 'React / Next.js / Node.js / Python / PostgreSQL' } }
        ]
      },
      {
        id: 'supportModel',
        label: { tr: 'Teslimat Aciliyeti ve Çalışma Modeli Nedir?', en: 'What is the delivery urgency and preferred model?' },
        options: [
          { value: 'criticalCrunch', label: { tr: 'Kritik Acil: Bugün geceye kadar yetiştirilmeli', en: 'Critical: Must be delivered by tonight' } },
          { value: 'whitelabel', label: { tr: 'White-Label (Ajansınızın personeli gibi arka planda)', en: '100% White-Label (Invisibly as your internal team)' } },
          { value: 'swat', label: { tr: 'Doğrudan teknik repo devralma & hotfix teslimi', en: 'Direct repo takeover & rapid hotfix delivery' } }
        ]
      }
    ]
  },
  {
    id: 'overflow',
    code: 'WHITE-LABEL CAPACITY',
    tag: { tr: 'KAPASİTE VE TAŞERON ÜRETİM', en: 'CAPACITY & WHITE-LABEL' },
    title: { tr: 'Yoğunluktan Yetişmeyen İşler & Web Üretimi', en: 'Capacity Overflow & Web Production' },
    subtitle: { tr: 'İç ekip yoğunluğu · Yetişmeyen kurumsal web & SaaS · Dış kaynak yazılım üretimi', en: 'Internal team overload · Pending web & SaaS projects · White-label engineering' },
    icon: Layers,
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/40',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    questions: [
      {
        id: 'workType',
        label: { tr: 'Kapasitenizi En Çok Zorlayan Web / Yazılım İşi Nedir?', en: 'Which type of web / software project is bottlenecking your capacity?' },
        options: [
          { value: 'customWeb', label: { tr: 'Özel Kurumsal Web Sitesi & Landing Page (React, Next.js, Headless CMS)', en: 'Custom Corporate Website & Landing Page (React, Next.js, Headless CMS)' } },
          { value: 'ecommerce', label: { tr: 'E-Ticaret, Pazaryeri & Ödeme Entegrasyonları (Stripe, iyzico, PayTR)', en: 'E-Commerce, Marketplace & Payment Integrations (Stripe, iyzico, PayTR)' } },
          { value: 'saasPanel', label: { tr: 'Özel SaaS Platformu, Müşteri Portali veya Mobil Uygulama (Flutter)', en: 'Custom SaaS Platform, Customer Portal or Mobile App (Flutter)' } }
        ]
      },
      {
        id: 'collaborationModel',
        label: { tr: 'Ajansınız İçin İdeal Çalışma ve Teslimat Modeli Nedir?', en: 'What is the ideal collaboration and delivery model for your agency?' },
        options: [
          { value: 'whitelabel', label: { tr: '%100 White-Label (Biz müşteriyle görüşelim, siz arkada ajansımız adına kodlayın)', en: '100% White-Label (We manage client comms, you engineer under our brand)' } },
          { value: 'hybridSprint', label: { tr: 'Hibrit Sprint Desteği (Mevcut ekibimize modül bazlı kıdemli takviye)', en: 'Hybrid Sprint Surge (Senior engineering reinforcement on specific modules)' } },
          { value: 'turnkey', label: { tr: 'Anahtar Teslim (Figma/Tasarım bizden, backend + frontend eksiksiz sizden)', en: 'Turnkey Execution (Design/Figma from us, complete code from you)' } }
        ]
      },
      {
        id: 'projectTimeline',
        label: { tr: 'Projenin Başlama Aciliyeti ve Zaman Çizelgesi Nedir?', en: 'What is the project start urgency and expected timeline?' },
        options: [
          { value: 'urgentStart', label: { tr: 'Hemen bu hafta içinde başlanması gereken acil iş', en: 'Urgent: Must kick off within this week' } },
          { value: 'retainerPool', label: { tr: 'Önümüzdeki 1-2 ay için sürekli kapasite ortaklığı (aylık havuz)', en: 'Ongoing monthly capacity partnership for upcoming 1-2 months' } },
          { value: 'proposalStage', label: { tr: 'Müşteri teklif aşamasında, 1-2 hafta içinde başlayacak proje', en: 'In proposal/contract stage, kicks off in 1-2 weeks' } }
        ]
      }
    ]
  },
  {
    id: 'complex',
    code: 'SPECIAL ARCHITECTURE',
    tag: { tr: 'UZMANLIK GEREKSİNİMİ', en: 'SPECIALTY NEEDED' },
    title: { tr: 'Özel Mimari, AI & Ödeme Tıkanması', en: 'Custom Architecture, AI & Payment Block' },
    subtitle: { tr: 'Mevcut ekibin uzmanlık alanı dışı · Yapay zeka · Özel algoritmalar', en: 'Out of team expertise · Artificial intelligence · Custom algorithms' },
    icon: Cpu,
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/40',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    questions: [
      {
        id: 'specialNeeds',
        label: { tr: 'En Çok Tıkandığınız Özel Alan Hangisi?', en: 'Where is the primary technical bottleneck?' },
        options: [
          { value: 'algo', label: { tr: 'Yüksek hacimli veri işleme / Algoritmik hesaplama / FinTech', en: 'High-frequency data processing / Algorithmic FinTech' } },
          { value: 'ai', label: { tr: 'OpenAI / LLM / RAG / Akıllı Bot & Otomasyon Mimarisi', en: 'OpenAI / LLM / RAG / Intelligent Agent Automation' } },
          { value: 'scale', label: { tr: 'Sunucu optimizasyonu, Redis caching & Docker CI/CD', en: 'Server tuning, Redis caching & Docker CI/CD pipelines' } },
          { value: 'payment', label: { tr: 'Stripe, iyzico, PayTR veya çoklu para birimli abonelik', en: 'Stripe, iyzico, PayTR multi-currency subscriptions' } }
        ]
      },
      {
        id: 'budgetRisk',
        label: { tr: 'Bu İşin Çözülmemesi Ajansınızı Nasıl Etkiler?', en: 'How would leaving this unresolved affect your agency?' },
        options: [
          { value: 'reputation', label: { tr: 'Büyük ve stratejik bir kurumsal müşteriyi kaybetme riski', en: 'Risk of losing a high-tier enterprise client' } },
          { value: 'stalled', label: { tr: 'Proje haftalardır ilerlemiyor, ajans içi vakit kaybı', en: 'Project stalled for weeks, burning internal hours' } },
          { value: 'exploration', label: { tr: 'Yeni bir teklif hazırlıyoruz, fizibilite desteği arıyoruz', en: 'Preparing a proposal, seeking feasibility backing' } }
        ]
      },
      {
        id: 'deliveryPace',
        label: { tr: 'Hedeflenen Çözüm Süresi Nedir?', en: 'What is your target turnaround time?' },
        options: [
          { value: 'urgent', label: { tr: '1 - 3 Gün İçinde Çalışır Hale Getirilmeli', en: 'Must be operational within 1 - 3 days' } },
          { value: 'standard', label: { tr: '1 - 2 Hafta İçinde Tamamlanmalı', en: 'Can be completed within 1 - 2 weeks' } }
        ]
      }
    ]
  }
];

function getMatchedDiagnosis(scenarioId, answers) {
  // Scenario 1: http500
  if (scenarioId === 'http500') {
    // ⚠️ Priority rule: accessStatus === 'limited'
    if (answers.accessStatus?.value === 'limited') {
      return {
        matched: true,
        slug: 'domain-hosting-erisimi-yok',
        priorityReason: {
          tr: 'Erişim olmadan hiçbir arıza giderilemez; önce bu çözülmeli.',
          en: 'Without access no fault can be repaired; this must be resolved first.'
        }
      };
    }

    const scope = answers.outageScope?.value;
    if (scope === 'total') {
      return { matched: true, slug: 'site-500-veriyor-dun-calisiyordu' };
    } else if (scope === 'partial') {
      return { matched: true, slug: 'odeme-alindi-siparis-olusmadi' };
    } else if (scope === 'slow') {
      return { matched: true, slug: 'islemler-kilitlendi-sayfa-donuyor' };
    }
  }

  // Scenario 2: handover
  if (scenarioId === 'handover') {
    // ⚠️ Priority rule: missingModules === 'bugs'
    if (answers.missingModules?.value === 'bugs') {
      return { matched: true, slug: 'her-yeni-ozellik-oncekini-bozuyor' };
    }

    const doc = answers.docState?.value;
    if (doc === 'none') {
      return { matched: true, slug: 'yazilimci-gitti-koda-girilemiyor' };
    } else {
      return { matched: true, slug: 'kucuk-degisiklik-gunler-suruyor' };
    }
  }

  // Scenario 3: overflow
  if (scenarioId === 'overflow') {
    const work = answers.workType?.value;
    if (work === 'ecommerce') {
      return { matched: true, slug: 'odeme-alindi-siparis-olusmadi' };
    } else if (work === 'customWeb') {
      return { matched: true, slug: 'kucuk-degisiklik-gunler-suruyor' };
    } else if (work === 'saasPanel') {
      return { matched: true, slug: 'site-yavasladi-sunucu-bos' };
    }
  }

  // Scenario 4: complex
  if (scenarioId === 'complex') {
    const need = answers.specialNeeds?.value;
    if (need === 'payment') {
      return { matched: true, slug: 'odeme-alindi-siparis-olusmadi' };
    } else if (need === 'scale') {
      return { matched: true, slug: 'sunucu-her-gun-yeniden-baslatiliyor' };
    } else if (need === 'algo') {
      return { matched: true, slug: 'site-yavasladi-sunucu-bos' };
    }
  }

  // Scenario 5: t48h OR complex/ai (no match)
  return {
    matched: false
  };
}

const CrashTest = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isTr = isTurkish(i18n);
  const isKrizHattiAcik = useKrizHattiAcik();

  const [selectedScenario, setSelectedScenario] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const senaryoParam = params.get('senaryo');
        if (senaryoParam) {
          const matched = scenarios.find(s => s.id === senaryoParam);
          if (matched) return matched;
        }
      } catch (e) {}
    }
    return scenarios[0];
  });
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [copied, setCopied] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  // Dynamic Diagnosis Data State
  const [diagData, setDiagData] = useState(null);
  const [isLoadingDiag, setIsLoadingDiag] = useState(false);
  const [diagError, setDiagError] = useState(false);

  const matchResult = getMatchedDiagnosis(selectedScenario.id, answers);

  useEffect(() => {
    if (step === 3 && matchResult.matched && matchResult.slug) {
      if (teshisLoaders[matchResult.slug]) {
        setIsLoadingDiag(true);
        setDiagError(false);
        teshisLoaders[matchResult.slug]()
          .then((mod) => {
            setDiagData(mod.default || mod);
            setIsLoadingDiag(false);
          })
          .catch((err) => {
            console.error('Diagnosis data load failed:', err);
            setDiagError(true);
            setIsLoadingDiag(false);
          });
      } else {
        setDiagError(true);
      }
    } else {
      setDiagData(null);
      setIsLoadingDiag(false);
      setDiagError(false);
    }
  }, [step, matchResult.matched, matchResult.slug]);

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const timer = setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 40);
    return () => clearTimeout(timer);
  }, [step]);

  // UTM & Physical Crisis Kit Tracking
  const [campaignParams, setCampaignParams] = useState({
    utm_source: '',
    utm_campaign: '',
    agency_code: ''
  });

  // Email Lead Capture State
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSent, setLeadSent] = useState(false);
  const [isSendingLead, setIsSendingLead] = useState(false);

  React.useEffect(() => {
    setPageSeo('/crash-test/', isTr ? 'tr' : 'en');

    try {
      const params = new URLSearchParams(window.location.search);
      const src = params.get('utm_source') || '';
      const cmp = params.get('utm_campaign') || '';
      const agency = params.get('a') || params.get('agency') || '';
      if (src || cmp || agency) {
        setCampaignParams({ utm_source: src, utm_campaign: cmp, agency_code: agency });
      }

      const senaryoParam = params.get('senaryo');
      if (senaryoParam) {
        const matched = scenarios.find(s => s.id === senaryoParam);
        if (matched) {
          setSelectedScenario(matched);
        }
      }
    } catch (e) {}
  }, [isTr]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const senaryoParam = params.get('senaryo');
      if (senaryoParam) {
        const matched = scenarios.find(s => s.id === senaryoParam);
        if (matched) {
          setSelectedScenario(matched);
          setAnswers({});
          setStep(1);
        }
      }
    } catch (e) {}
  }, [location.search]);

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario);
    setAnswers({});
  };

  const handleAnswerSelect = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const currentQuestions = selectedScenario.questions;
  const isAllAnswered = currentQuestions.length > 0 && currentQuestions.every(q => answers[q.id]);

  const copyActionPlan = () => {
    const header = `=== TMA AGENCY CRASH TEST REPORT ===\n` +
      `Scenario: ${selectedScenario.title[isTr ? 'tr' : 'en']} (${selectedScenario.code})\n`;

    const body = matchResult.matched && diagData
      ? `Matched Diagnosis: #${diagData.no} · ${diagData.baslik[isTr ? 'tr' : 'en']}\n` +
        `Severity: ${diagData.aciliyet?.etiket?.[isTr ? 'tr' : 'en'] || ''}\n` +
        `Diagnostic Tests:\n` +
        (diagData.nedenler || []).map(n => {
          const t = n.diyagramTest?.[isTr ? 'tr' : 'en'];
          return `  - ${Array.isArray(t) ? t.join(' ') : (t || '')}`;
        }).join('\n') + `\n\n`
      : matchResult.matched
      ? `Matched Diagnosis: ${matchResult.slug}\n\n`
      : `Result: Capacity and timeline scoping required.\n\n`;

    const protocol = `ACTION RECOVERY PROTOCOL:\n` +
      `Phase 1: Code Freeze, Repo Isolation & Diagnostics\n` +
      `Phase 2: White-Label Hotfix & Repair\n` +
      `Phase 3: Production Deployment & Clean Handover\n\n` +
      `TMA Response Desk: +90 534 371 35 73 | info@trendmasterakademi.com`;

    navigator.clipboard.writeText(header + body + protocol);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openWhatsAppDispatch = () => {
    if (window.trackEvent) {
      window.trackEvent('whatsapp_clicked', {
        source: 'crash_test_dispatch',
        scenario: selectedScenario?.code,
        diagnosis: matchResult.matched ? matchResult.slug : 'capacity_scoping',
        agency_code: campaignParams.agency_code
      });
    }

    const kitBadge = campaignParams.agency_code ? `\n📦 *Kriz Kiti Ajans Kodu:* #${campaignParams.agency_code}` : '';
    const diagTitle = diagData?.baslik?.[isTr ? 'tr' : 'en'];
    const diagNo = diagData?.no;
    const diagSeverity = diagData?.aciliyet?.etiket?.[isTr ? 'tr' : 'en'];

    const rawText = matchResult.matched
      ? (isTr
          ? `🚨 *TMA CRASH TEST TEŞHİS EŞLEŞMESİ* 🚨\n\n` +
            `📊 *Seçilen Kriz:* ${selectedScenario.title.tr} (${selectedScenario.code})\n` +
            `🎯 *Eşleşen Teşhis:* ${diagNo ? `#${diagNo} · ` : ''}${diagTitle || matchResult.slug}\n` +
            (diagSeverity ? `⚡ *Aciliyet:* ${diagSeverity}${kitBadge}\n\n` : `${kitBadge}\n\n`) +
            `Bu arıza tablosu için TMA'dan acil teknik destek / teşhis görüşmesi talep ediyoruz.`
          : `🚨 *TMA CRASH TEST DIAGNOSTIC MATCH* 🚨\n\n` +
            `📊 *Selected Incident:* ${selectedScenario.title.en} (${selectedScenario.code})\n` +
            `🎯 *Matched Diagnosis:* ${diagNo ? `#${diagNo} · ` : ''}${diagTitle || matchResult.slug}\n` +
            (diagSeverity ? `⚡ *Severity:* ${diagSeverity}${kitBadge}\n\n` : `${kitBadge}\n\n`) +
            `We request an emergency technical consultation / diagnosis from TMA for this incident.`)
      : (isTr
          ? `⏱️ *TMA CRASH TEST KAPASİTE & DEVİR TALEBİ* ⏱️\n\n` +
            `📊 *Seçilen Durum:* ${selectedScenario.title.tr} (${selectedScenario.code})${kitBadge}\n\n` +
            `Kalan iş hacmi ve teslimat takvimi için teknik kapsam görüşmesi talep ediyoruz.`
          : `⏱️ *TMA CRASH TEST CAPACITY & SCOPING INQUIRY* ⏱️\n\n` +
            `📊 *Selected Scenario:* ${selectedScenario.title.en} (${selectedScenario.code})${kitBadge}\n\n` +
            `We request a technical scoping consultation for remaining work volume and timeline.`);

    const text = encodeURIComponent(rawText);
    window.open(`https://wa.me/905343713573?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 md:px-8 bg-[var(--paper)] text-[var(--ink)] relative font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Eyebrow & Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[var(--rule)]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span lang="en" className="text-xs sm:text-sm font-mono tracking-widest text-[var(--ink-muted)] uppercase">
              TMA Response Desk // Diagnostic Engine
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded text-xs font-mono bg-[var(--surface)] text-[var(--ink)] border border-[var(--rule)]">
              ⚡ {isTr ? '60 SANİYELİK SİMÜLASYON' : '60-SECOND SIMULATION'}
            </span>
            <button
              onClick={() => setIsSOSOpen(true)}
              className="px-3 py-1 rounded text-xs font-semibold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 hover:bg-[var(--accent)]/20 transition-colors flex items-center gap-1.5 cursor-pointer min-h-[44px]"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> {isTr ? 'Acil SOS Masası' : 'Emergency SOS Desk'}
            </button>
          </div>
        </div>

        {/* Hero of Crash Test */}
        {step < 3 && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] text-xs font-mono font-semibold uppercase tracking-wider mb-4">
              <ShieldAlert className="w-4 h-4" /> {isTr ? 'Ajans Kriz Dayanıklılık & Teşhis Testi' : 'Agency Crisis Resilience & Diagnostic Test'}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold tracking-tight text-[var(--ink)] mb-5 leading-tight">
              <span className="block">
                {isTr ? 'Ajansınız teknik bir krize ' : 'Is your agency '}
              </span>
              <span className="block text-[var(--accent)]">
                {isTr ? 'gerçekten hazır mı?' : 'truly ready for a technical crisis?'}
              </span>
            </h1>
            <p className="text-[var(--ink-muted)] text-base sm:text-lg leading-relaxed">
              {isTr 
                ? 'Kritik kod kilitlenmeleri, devir süreçleri tıkanmış yarım kalan projeler veya yaklaşan teslimat baskısı altında durumunuzu doğrudan teşhis edin. Eşleşen arıza tablosunu ve 3 aşamalı eylem reçetesini görün.' 
                : 'Diagnose your situation under live outages, stranded repositories, or tight delivery deadlines. Review the matching fault blueprint and your 3-phase action recovery recipe.'}
            </p>

            {/* Quick Guarantees Bar */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mt-8 p-3.5 rounded bg-[var(--surface)] border border-[var(--rule)] text-xs sm:text-sm text-[var(--ink)]">
              <div className="text-center">
                <strong className="block text-[var(--ink)] font-semibold text-sm sm:text-base">60 {isTr ? 'Sn' : 'Sec'}</strong>
                <span className="text-[var(--ink-muted)] text-xs">{isTr ? 'Ortalama Süre' : 'Average Time'}</span>
              </div>
              <div className="text-center border-x border-[var(--rule)]">
                <strong className="block text-emerald-600 font-semibold text-sm sm:text-base">0 {isTr ? 'Erişim' : 'Access'}</strong>
                <span className="text-[var(--ink-muted)] text-xs">{isTr ? 'Şifre / Repo İstemez' : 'Zero Repo/Credentials'}</span>
              </div>
              <div className="text-center">
                <strong className="block text-[var(--accent)] font-semibold text-sm sm:text-base">1 {isTr ? 'Teşhis' : 'Diagnosis'}</strong>
                <span className="text-[var(--ink-muted)] text-xs">{isTr ? 'Doğrudan Eşleşme' : 'Direct Blueprint Match'}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Breadcrumb Tabs */}
        {step === 1 && (
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 flex-wrap">
            {[
              { s: 1, label: isTr ? '01. Senaryo Seçimi' : '01. Scenario' },
              { s: 2, label: isTr ? '02. Durum Teşhisi' : '02. Diagnosis' },
              { s: 3, label: isTr ? '03. Teşhis Eşleşmesi & Reçete' : '03. Diagnosis & Blueprint' }
            ].map((item) => (
              <div
                key={item.s}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs sm:text-sm font-mono transition-all ${
                  step === item.s
                    ? 'bg-[var(--surface)] text-[var(--accent)] border border-[var(--accent)] font-semibold shadow-sm'
                    : step > item.s
                    ? 'bg-[var(--surface)] text-emerald-600 border border-emerald-500/30'
                    : 'bg-[var(--paper)] text-[var(--ink-muted)] border border-[var(--rule)]'
                }`}
              >
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* STEP 1: Scenario Selection */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {scenarios.map((sc) => {
                const IconComponent = sc.icon;
                const isSelected = selectedScenario.id === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => handleScenarioSelect(sc)}
                    className={`p-6 sm:p-7 rounded-xl text-left border transition-all duration-300 relative group cursor-pointer overflow-hidden ${
                      sc.id === 'complex' ? 'md:col-span-2' : ''
                    } ${
                      isSelected
                        ? 'bg-[var(--surface)] border-[var(--accent)] shadow-sm ring-1 ring-[var(--accent)]'
                        : 'bg-[var(--surface)] border-[var(--rule)] hover:border-[var(--rule-dark)]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3.5 rounded ${isSelected ? 'bg-[var(--paper)] text-[var(--accent)]' : 'bg-[var(--paper)] text-[var(--ink-muted)]'} border border-[var(--rule)]`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-semibold border ${sc.badgeColor}`}>
                          {sc.tag[isTr ? 'tr' : 'en']}
                        </span>
                        <span className="text-xs font-mono text-[var(--ink-muted)] font-semibold">{sc.code}</span>
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-serif font-semibold text-[var(--ink)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                      {sc.title[isTr ? 'tr' : 'en']}
                    </h3>
                    <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                      {sc.subtitle[isTr ? 'tr' : 'en']}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Next Action */}
            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  setStep(2);
                  if (window.trackEvent) {
                    window.trackEvent('crash_test_started', {
                      scenario: selectedScenario.code,
                      utm_source: campaignParams.utm_source,
                      agency_code: campaignParams.agency_code
                    });
                  }
                }}
                className="px-8 py-4 rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm sm:text-base tracking-wide flex items-center gap-3 shadow-sm transition-colors cursor-pointer min-h-[48px]"
              >
                <span>{isTr ? 'Durum Teşhisine Geç' : 'Proceed to Diagnosis'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Questions */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Sticky Unified Scenario & Progress Header */}
            <div className="sticky top-[78px] sm:top-[92px] md:top-[100px] z-40 p-4 sm:p-5 rounded-xl bg-[var(--surface)] border border-[var(--rule)] shadow-sm space-y-3.5 transition-all">
              {/* Eyebrow & Status Bar */}
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--rule)] text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
                  <span className="text-xs text-[var(--ink-muted)] uppercase tracking-wider">
                    TMA Crash Simulator // {selectedScenario.code}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[var(--paper)] text-[var(--ink-muted)] border border-[var(--rule)]">
                  {isTr ? '%100 Güvenli Analiz' : '100% Confidential'}
                </span>
              </div>

              {/* Progress & Title Row */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded text-xs sm:text-sm font-mono font-semibold bg-[var(--paper)] border border-[var(--rule)] text-[var(--accent)]">
                    {selectedScenario.code}
                  </span>
                  <div>
                    <strong className="text-[var(--ink)] text-sm sm:text-base block">{selectedScenario.title[isTr ? 'tr' : 'en']}</strong>
                    <span className="text-xs text-[var(--ink-muted)]">
                      {Object.keys(answers).length} / {currentQuestions.length} {isTr ? 'Soru Yanıtlandı' : 'Answered'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-28 sm:w-48 h-2.5 sm:h-3 bg-[var(--paper)] rounded-full overflow-hidden border border-[var(--rule)]">
                    <div 
                      className="h-full bg-[var(--accent)] transition-all duration-300"
                      style={{ width: `${(Object.keys(answers).length / currentQuestions.length) * 100}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs sm:text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] underline cursor-pointer whitespace-nowrap min-h-[44px] inline-flex items-center"
                  >
                    {isTr ? 'Senaryoyu Değiştir' : 'Change Scenario'}
                  </button>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {currentQuestions.map((q, idx) => (
                <div key={q.id} className="p-6 sm:p-7 rounded-xl bg-[var(--surface)] border border-[var(--rule)] shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[var(--paper)] text-[var(--accent)] flex items-center justify-center font-mono text-xs sm:text-sm font-semibold border border-[var(--rule)] flex-shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="text-base sm:text-lg font-serif font-semibold text-[var(--ink)] leading-snug">{q.label[isTr ? 'tr' : 'en']}</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = answers[q.id]?.value === opt.value;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleAnswerSelect(q.id, opt)}
                          className={`p-4 sm:p-5 rounded-lg text-left border transition-all text-sm sm:text-base flex items-center justify-between gap-3 cursor-pointer min-h-[52px] ${
                            isSelected
                              ? 'bg-[var(--paper)] border-[var(--accent)] text-[var(--ink)] font-semibold shadow-sm'
                              : 'bg-[var(--surface)] border-[var(--rule)] text-[var(--ink)] hover:border-[var(--rule-dark)]'
                          }`}
                        >
                          <span className="leading-snug">{opt.label[isTr ? 'tr' : 'en']}</span>
                          <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'border-[var(--accent)] bg-[var(--accent)] text-white' : 'border-[var(--rule-dark)]'
                          }`}>
                            {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons Navigation */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-4 rounded bg-[var(--surface)] hover:bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] font-semibold text-sm sm:text-base flex items-center gap-2 cursor-pointer transition-colors min-h-[48px]"
              >
                <ArrowLeft className="w-4 h-4" /> {isTr ? 'Geri' : 'Back'}
              </button>

              <button
                disabled={!isAllAnswered}
                onClick={() => {
                  setStep(3);
                  if (window.trackEvent) {
                    window.trackEvent('crash_test_completed', {
                      scenario: selectedScenario.code,
                      diagnosis_matched: matchResult.matched,
                      diagnosis_slug: matchResult.matched ? matchResult.slug : 'capacity_scoping',
                      agency_code: campaignParams.agency_code
                    });
                  }
                }}
                className={`px-8 py-4 rounded font-semibold text-sm sm:text-base tracking-wide flex items-center gap-3 transition-all cursor-pointer min-h-[48px] ${
                  isAllAnswered
                    ? 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-sm'
                    : 'bg-[var(--surface)] text-[var(--ink-muted)] border border-[var(--rule)] cursor-not-allowed opacity-50'
                }`}
              >
                <span>{isTr ? 'Teşhis Eşleşmesini & Aksiyon Planını Üret' : 'Generate Diagnostic Match & Action Plan'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Results & Protocol */}
        {step === 3 && (
          <div className="space-y-8">
            {/* Header / Diagnosis Matching Card */}
            {matchResult.matched ? (
              <div className="p-6 sm:p-8 rounded-xl bg-[var(--surface)] border border-[var(--rule)] shadow-sm relative overflow-hidden space-y-6">
                
                {/* Priority Rule Banner (if applicable) */}
                {matchResult.priorityReason && (
                  <div className="p-4 rounded bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-800 text-sm">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
                    <span className="font-semibold">{matchResult.priorityReason[isTr ? 'tr' : 'en']}</span>
                  </div>
                )}

                {isLoadingDiag ? (
                  /* Loading State (No dummy text / no fake badges) */
                  <div className="py-12 flex flex-col items-center justify-center gap-3 text-[var(--accent)]">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-xs font-mono text-[var(--ink-muted)] uppercase tracking-wider">
                      {isTr ? 'Teşhis Verisi Yükleniyor...' : 'Loading Diagnostic Data...'}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[var(--rule)]">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]"></span>
                          <span className="text-xs font-mono font-semibold tracking-widest text-[var(--accent)] uppercase">
                            {isTr ? 'TEŞHİS KATALOĞU EŞLEŞMESİ' : 'DIAGNOSTIC CATALOG MATCH'} // {selectedScenario.code}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm font-mono text-[var(--ink-muted)] block">
                          {isTr ? 'Verdiğiniz cevaplar şu tabloyla örtüşüyor:' : 'Your answers match the following failure profile:'}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[var(--ink)] flex flex-wrap items-center gap-3">
                          {diagData?.no && (
                            <>
                              <span className="text-[var(--accent)] font-mono">#{diagData.no}</span>
                              <span>·</span>
                            </>
                          )}
                          <span>{diagData?.baslik?.[isTr ? 'tr' : 'en'] || matchResult.slug}</span>
                        </h2>
                      </div>

                      {/* Urgency Badge strictly from diagnostic data */}
                      {!diagError && diagData?.aciliyet?.etiket && (
                        <div className="flex-shrink-0">
                          <span className={`px-4 py-2 rounded text-xs sm:text-sm font-mono font-semibold border inline-flex items-center gap-2 ${
                            diagData.aciliyet.seviye === 'kritik'
                              ? 'text-[var(--accent)] bg-[var(--accent)]/10 border-[var(--accent)]/30'
                              : 'text-amber-800 bg-amber-50 border-amber-200'
                          }`}>
                            <span className="w-2 h-2 rounded-full bg-current"></span>
                            <span>{diagData.aciliyet.etiket[isTr ? 'tr' : 'en']}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Distinguishing Tests Box strictly from diagnostic data */}
                    {!diagError && diagData?.nedenler && diagData.nedenler.length > 0 && (
                      <div className="p-5 sm:p-6 rounded-lg bg-[var(--paper)] border border-[var(--rule)] space-y-4">
                        <div className="flex items-center gap-2 text-sm font-mono font-semibold text-[var(--ink)]">
                          <Stethoscope className="w-4 h-4 text-[var(--accent)]" />
                          <span>
                            {isTr 
                              ? 'Bu arızanın üç olası nedeni var ve ayırt edici testleri şunlar:' 
                              : 'This symptom has three root causes with the following distinguishing diagnostic tests:'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {diagData.nedenler.map((neden, tIdx) => {
                            const rawTest = neden.diyagramTest?.[isTr ? 'tr' : 'en'];
                            const testText = Array.isArray(rawTest) ? rawTest.join(' ') : (rawTest || '');
                            return (
                              <div key={tIdx} className="p-4 rounded bg-[var(--surface)] border border-[var(--rule)] flex items-start gap-2.5">
                                <ArrowRight className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                                <span className="text-xs sm:text-sm text-[var(--ink)] leading-relaxed font-mono">{testText}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}

              </div>
            ) : (
              /* Non-matching case: t48h or complex/ai */
              <div className="p-6 sm:p-8 rounded-xl bg-[var(--surface)] border border-[var(--rule)] shadow-sm relative overflow-hidden space-y-6">
                <div className="space-y-2 pb-4 border-b border-[var(--rule)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]"></span>
                    <span className="text-xs font-mono font-semibold tracking-widest text-[var(--accent)] uppercase">
                      {isTr ? 'KAPASİTE & DEVİR DEĞERLENDİRMESİ' : 'CAPACITY & TIMELINE ASSESSMENT'} // {selectedScenario.code}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[var(--ink)]">
                    {selectedScenario.title[isTr ? 'tr' : 'en']}
                  </h2>
                </div>

                <div className="p-6 rounded-lg bg-[var(--paper)] border border-[var(--rule)] space-y-5">
                  <p className="text-[var(--ink)] text-sm sm:text-base leading-relaxed">
                    {isTr 
                      ? 'Bu bir arıza değil, kapasite ve zaman sorunu. Teşhis Kataloğu yayında olan 20 arızayı kapsıyor; sizinki onlardan biri değil. Bu durumda yapılacak şey teşhis değil, kapsamı konuşmak: ne kadar iş kaldığını ve ne kadar sürede kapatılabileceğini birlikte çıkarırız.'
                      : 'This is a capacity and timeline problem, not a fault. The Diagnostic Catalog covers 20 published failures and yours is not one of them. What you need here is not a diagnosis but a scoping conversation: we work out together how much work remains and how quickly it can be closed.'}
                  </p>
                </div>
              </div>
            )}

            {/* 3-Phase Action Protocol */}
            <div className="p-6 sm:p-8 rounded-xl bg-[var(--surface)] border border-[var(--rule)] shadow-sm space-y-6">
              <div>
                <span className="text-xs sm:text-sm font-mono font-semibold text-[var(--accent)] uppercase tracking-wider block">
                  {isTr ? 'Müdahale Protokolü' : 'Action Protocol'}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[var(--ink)]">
                  {isTr ? 'Ajansınıza Özel 3 Aşamalı İlk Kurtarma Reçetesi' : 'Your Bespoke 3-Phase Recovery Blueprint'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="p-6 rounded-lg bg-[var(--paper)] border border-[var(--rule)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-[var(--surface)] text-[var(--accent)] border border-[var(--rule)]">
                      {isTr ? 'AŞAMA 01' : 'PHASE 01'}
                    </span>
                    <Clock className="w-4 h-4 text-[var(--accent)]" />
                  </div>
                  <h4 className="text-base sm:text-lg font-serif font-semibold text-[var(--ink)]">
                    {isTr ? 'Kod Dondurma & İzole Teşhis' : 'Code Freeze & Isolated Audit'}
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">
                    {isTr 
                      ? 'Mevcut repoyu klonlayıp güvenli izole ortama alıyoruz. Canlıdaki hasarın yayılmasını durdurup hata loglarını, API ve veritabanı kilitlerini ayrıştırıyoruz.' 
                      : 'We fork the codebase into an isolated staging sandbox, halt live data degradation, and isolate error logs, API breaks, and DB deadlocks.'}
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-[var(--paper)] border border-[var(--rule)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-[var(--surface)] text-orange-600 border border-[var(--rule)]">
                      {isTr ? 'AŞAMA 02' : 'PHASE 02'}
                    </span>
                    <Code2 className="w-4 h-4 text-orange-600" />
                  </div>
                  <h4 className="text-base sm:text-lg font-serif font-semibold text-[var(--ink)]">
                    {isTr ? 'White-Label Hotfix & Onarım' : 'White-Label Hotfix & Repair'}
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">
                    {isTr 
                      ? 'Eksik modüllerin tamamlanması, spagetti kodun temizlenmesi ve kritik API entegrasyonlarının doğrudan kıdemli mühendislik masamızca ayağa kaldırılması.' 
                      : 'Completing missing endpoints, refactoring messy logic, and rebuilding broken API integrations directly with our senior engineering desk.'}
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-[var(--paper)] border border-[var(--rule)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-[var(--surface)] text-emerald-600 border border-[var(--rule)]">
                      {isTr ? 'AŞAMA 03' : 'PHASE 03'}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h4 className="text-base sm:text-lg font-serif font-semibold text-[var(--ink)]">
                    {isTr ? 'Canlı Dağıtım & Temiz Devir' : 'Deployment & Clean Handover'}
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">
                    {isTr 
                      ? 'Stres testleri ve güvenlik kontrolleri sonrası sistem canlıya alınır. Tüm dokümante edilmiş kaynak kod ajansınıza eksiksiz teslim edilir.' 
                      : 'Following automated stress and security audits, the system is deployed live. Documented clean source code is completely handed over to your agency.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Unified 3-Tier Action Block */}
            <div className="p-6 sm:p-10 rounded-xl bg-[var(--surface)] border border-[var(--rule)] text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-[var(--ink)]">
                  {matchResult.matched
                    ? (isTr ? 'Bu Krizi Birlikte Çözelim' : 'Let’s Resolve This Together')
                    : (isTr ? 'Kapsamı ve Çözümü Birlikte Konuşalım' : 'Let’s Scope the Solution Together')}
                </h3>
                <p className="text-[var(--ink-muted)] text-sm sm:text-base md:text-lg max-w-[34rem] mx-auto leading-relaxed">
                  {matchResult.matched
                    ? (isTr 
                        ? 'Müşteriniz sizin müşteriniz olarak kalırken; arka planda ihtiyacınız olan teknik gücü ve kurtarma mühendisliğini doğrudan devreye alalım.' 
                        : 'While your client remains strictly yours; let us deploy the invisible engineering rescue power you need directly.')
                    : (isTr
                        ? 'Kalan iş yükünü, teslimat takvimini ve ajansınıza en uygun white-label çalışma modelini doğrudan değerlendirelim.'
                        : 'Let us directly evaluate the remaining workload, delivery timeline, and the optimal white-label model for your agency.')}
                </p>
              </div>

              {/* Night Status Line (directly above primary button) */}
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-mono text-[var(--ink-muted)]">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isKrizHattiAcik ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
                <span>
                  {isTr 
                    ? (isKrizHattiAcik 
                        ? 'Kriz hattı şu an açık · her gün 09:00 – 24:00 · canlı kesintilerde ilk yanıt taahhüdü 15 dakika' 
                        : "Kriz hattı şu an kapalı. Bildiriminiz ertesi sabah 09:00'da ele alınır — yine de gönderin.")
                    : (isKrizHattiAcik
                        ? 'Crisis hotline is currently open · daily 09:00 – 24:00 · first-response commitment for live outages: 15 minutes'
                        : 'Crisis hotline is currently closed. Your notification will be handled at 09:00 tomorrow morning — please send anyway.')
                  }
                </span>
              </div>

              {/* Tier 1: Primary Dominant Button */}
              <div>
                {matchResult.matched ? (
                  <button
                    onClick={openWhatsAppDispatch}
                    className="w-full py-4 sm:py-5 px-8 rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-base sm:text-lg shadow-sm flex items-center justify-center gap-3 transition-colors cursor-pointer min-h-[56px]"
                  >
                    <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>{isTr ? 'Kriz Masasını Devreye Sok (WhatsApp)' : 'Deploy Crisis Desk (WhatsApp)'}</span>
                  </button>
                ) : (
                  <a
                    href={getCalendlyUrl('crash_test_kapasite', { agency_code: campaignParams.agency_code })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => window.trackEvent && window.trackEvent('calendar_clicked', { source: 'crash_test_result', scenario: selectedScenario?.code, agency_code: campaignParams.agency_code })}
                    className="w-full py-4 sm:py-5 px-8 rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-base sm:text-lg shadow-sm flex items-center justify-center gap-3 transition-colors min-h-[56px]"
                  >
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>{isTr ? 'Takvimden 30 Dakikalık Kapsam Görüşmesi Seç' : 'Book a 30-Minute Scoping Call'}</span>
                  </a>
                )}
              </div>

              {/* Tier 2: Secondary Quiet Action Row */}
              {matchResult.matched ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                  <Link
                    to={`/teshis/${matchResult.slug}/`}
                    className="px-4 py-3 rounded bg-[var(--paper)] hover:bg-[var(--surface)] border border-[var(--rule)] text-xs sm:text-sm font-semibold text-[var(--ink)] flex items-center justify-center gap-2 transition-colors cursor-pointer text-center min-h-[44px]"
                  >
                    <span>{isTr ? 'Teşhisin tamamını okuyun' : 'Read complete diagnosis'}</span>
                    <ArrowRight className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                  </Link>

                  <button
                    onClick={copyActionPlan}
                    className="px-4 py-3 rounded bg-[var(--paper)] hover:bg-[var(--surface)] border border-[var(--rule)] text-xs sm:text-sm font-semibold text-[var(--ink)] flex items-center justify-center gap-2 transition-colors cursor-pointer text-center min-h-[44px]"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <Copy className="w-4 h-4 text-[var(--ink-muted)] flex-shrink-0" />}
                    <span>{copied ? (isTr ? 'Kopyalandı!' : 'Copied!') : (isTr ? 'Raporu Kopyala' : 'Copy Blueprint')}</span>
                  </button>

                  <a
                    href={getCalendlyUrl('crash_test', { scenario: selectedScenario?.code, agency_code: campaignParams.agency_code })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => window.trackEvent && window.trackEvent('calendar_clicked', { source: 'crash_test_result', scenario: selectedScenario?.code, agency_code: campaignParams.agency_code })}
                    className="px-4 py-3 rounded bg-[var(--paper)] hover:bg-[var(--surface)] border border-[var(--rule)] text-xs sm:text-sm font-semibold text-[var(--ink)] flex items-center justify-center gap-2 transition-colors cursor-pointer text-center min-h-[44px]"
                  >
                    <Calendar className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                    <span>{isTr ? 'Takvimden Randevu Seç' : 'Book Call from Calendar'}</span>
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  <Link
                    to="/agency/"
                    className="px-4 py-3 rounded bg-[var(--paper)] hover:bg-[var(--surface)] border border-[var(--rule)] text-xs sm:text-sm font-semibold text-[var(--ink)] flex items-center justify-center gap-2 transition-colors cursor-pointer text-center min-h-[44px]"
                  >
                    <span>{isTr ? 'Altyapı & Çekirdek Mühendislik Masası →' : 'Infrastructure & Kernel Engineering Desk →'}</span>
                    <ArrowRight className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                  </Link>

                  <button
                    onClick={copyActionPlan}
                    className="px-4 py-3 rounded bg-[var(--paper)] hover:bg-[var(--surface)] border border-[var(--rule)] text-xs sm:text-sm font-semibold text-[var(--ink)] flex items-center justify-center gap-2 transition-colors cursor-pointer text-center min-h-[44px]"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <Copy className="w-4 h-4 text-[var(--ink-muted)] flex-shrink-0" />}
                    <span>{copied ? (isTr ? 'Kopyalandı!' : 'Copied!') : (isTr ? 'Raporu Kopyala' : 'Copy Blueprint')}</span>
                  </button>
                </div>
              )}

              {/* Tier 3: Native <details> / <summary> Folded Group */}
              <details className="group w-full rounded-xl bg-[var(--paper)] border border-[var(--rule)] p-4 sm:p-6 transition-all text-left">
                <summary className="cursor-pointer text-xs sm:text-sm font-mono font-semibold text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors flex items-center justify-center gap-2 select-none py-1">
                  <span>{isTr ? 'Diğer seçenekler' : 'Other options'}</span>
                  <span className="text-xs transition-transform duration-200 group-open:rotate-180">▼</span>
                </summary>

                <div className="mt-6 space-y-6 pt-6 border-t border-[var(--rule)]">
                  {/* Email Lead Capture */}
                  <div className="p-6 sm:p-8 rounded-lg bg-[var(--surface)] border border-[var(--rule)] text-left space-y-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--rule)] pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-[var(--paper)] text-[var(--accent)] border border-[var(--rule)] flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base sm:text-lg font-serif font-semibold text-[var(--ink)]">
                            {isTr ? 'Bu Teşhis Raporunu & Reçeteyi E-Postama Gönder' : 'Send This Diagnostic Blueprint & Action Recipe to My Email'}
                          </h4>
                          <p className="text-xs text-[var(--ink-muted)]">
                            {isTr ? 'Ajans içi değerlendirme ve teknik ekibinizle paylaşım için hazır PDF/E-posta formatında iletilir.' : 'Sent in a ready-to-share technical blueprint format for your internal stakeholders.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {leadSent === 'success' ? (
                      <div className="p-5 rounded bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm font-semibold">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                        <span>{isTr ? 'Rapor talebiniz başarıyla kaydedildi! Kriz masamız analizi hazırlayıp iletecektir.' : 'Report request logged successfully! Our engineers will deliver your blueprint.'}</span>
                      </div>
                    ) : leadSent === 'error' ? (
                      <div className="p-5 rounded bg-amber-50 border border-amber-200 space-y-3">
                        <div className="flex items-center gap-3 text-amber-800 text-sm font-semibold">
                          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
                          <span>{isTr ? 'Ağ kesintisi nedeniyle otomatik iletilemedi.' : 'Network interruption during auto-dispatch.'}</span>
                        </div>
                        <p className="text-xs text-[var(--ink-muted)]">
                          {isTr ? 'Teşhis raporunuz hazır. Aşağıdaki butona tıklayarak WhatsApp üzerinden raporu hemen talep edebilirsiniz:' : 'Your diagnosis is ready. Request your blueprint directly via WhatsApp:'}
                        </p>
                        <button
                          type="button"
                          onClick={openWhatsAppDispatch}
                          className="w-full py-3 px-4 rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm min-h-[44px]"
                        >
                          <PhoneCall className="w-4 h-4" />
                          <span>{isTr ? 'WhatsApp ile Raporu Talep Et →' : 'Request Blueprint via WhatsApp →'}</span>
                        </button>
                      </div>
                    ) : (
                      <form 
                        onSubmit={async (e) => {
                          e.preventDefault();
                          setIsSendingLead(true);
                          try {
                            const response = await fetch('https://api.web3forms.com/submit', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                              body: JSON.stringify({
                                access_key: '64ef0cf5-703c-4cfd-92a4-4f0ba65bb2bb',
                                from_name: 'TMA Crash Test Diagnostic',
                                subject: `🎯 CRASH TEST TEŞHİS TALEBİ: ${leadName} (${selectedScenario?.code} - ${matchResult.matched ? (diagData ? `#${diagData.no}` : matchResult.slug) : 'Kapsam Görüşmesi'})${campaignParams.agency_code ? ` [Kutu #${campaignParams.agency_code}]` : ''}`,
                                name: leadName,
                                email: leadEmail,
                                phone: leadPhone,
                                scenario: selectedScenario?.title[isTr ? 'tr' : 'en'],
                                matchedDiagnosis: matchResult.matched ? (diagData ? `#${diagData.no} · ${diagData.baslik[isTr ? 'tr' : 'en']}` : matchResult.slug) : 'Kapsam ve Kapasite Görüşmesi',
                                severity: matchResult.matched ? (diagData?.aciliyet?.etiket?.[isTr ? 'tr' : 'en'] || 'N/A') : 'Kapsam Görüşmesi',
                                agencyBoxCode: campaignParams.agency_code || 'N/A',
                                utm_source: campaignParams.utm_source || 'direct',
                                utm_campaign: campaignParams.utm_campaign || 'N/A',
                                timestamp: new Date().toISOString()
                              })
                            });
                            const data = await response.json();
                            if (response.ok && data.success) {
                              setLeadSent('success');
                              if (window.trackEvent) {
                                window.trackEvent('report_email_submitted', {
                                  scenario: selectedScenario?.code,
                                  agency_code: campaignParams.agency_code
                                });
                              }
                            } else {
                              throw new Error(data.message || 'Submission failed');
                            }
                          } catch (err) {
                            console.error('Lead err:', err);
                            setLeadSent('error');
                          } finally {
                            setIsSendingLead(false);
                          }
                        }} 
                        className="grid grid-cols-1 sm:grid-cols-3 gap-3.5"
                      >
                        {/* Honeypot */}
                        <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                        <input
                          type="text"
                          required
                          placeholder={isTr ? 'Adınız Soyadınız' : 'Your Full Name'}
                          value={leadName}
                          onChange={e => setLeadName(e.target.value)}
                          className="px-4 py-3 rounded bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] placeholder:text-[var(--ink-muted)] text-sm focus:border-[var(--accent)] focus:outline-none min-h-[44px]"
                        />
                        <input
                          type="email"
                          required
                          placeholder={isTr ? 'Kurumsal E-posta' : 'Corporate Email'}
                          value={leadEmail}
                          onChange={e => setLeadEmail(e.target.value)}
                          className="px-4 py-3 rounded bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] placeholder:text-[var(--ink-muted)] text-sm focus:border-[var(--accent)] focus:outline-none min-h-[44px]"
                        />
                        <input
                          type="tel"
                          required
                          placeholder={isTr ? 'Telefon / WhatsApp' : 'Phone / WhatsApp'}
                          value={leadPhone}
                          onChange={e => setLeadPhone(e.target.value)}
                          className="px-4 py-3 rounded bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] placeholder:text-[var(--ink-muted)] text-sm focus:border-[var(--accent)] focus:outline-none min-h-[44px]"
                        />
                        <button
                          type="submit"
                          disabled={isSendingLead}
                          className="sm:col-span-3 py-3 px-6 rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm disabled:opacity-50 min-h-[44px]"
                        >
                          <Send className="w-4 h-4" />
                          <span>{isSendingLead ? (isTr ? 'Gönderiliyor...' : 'Sending...') : (isTr ? 'Detaylı Eylem Raporumu Gönder' : 'Send My Custom Blueprint')}</span>
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Additional Actions Inside <details> */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    {/* Handover Tool Link */}
                    {selectedScenario?.code === 'HANDOVER HELL' && (
                      <Link
                        to="/devir-kontrolu/"
                        className="px-5 py-3 rounded bg-[var(--surface)] hover:bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer min-h-[44px]"
                      >
                        <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
                        <span>{isTr ? '12 Kalemlik Devir Kontrolü →' : '12-Point Handover Audit →'}</span>
                      </Link>
                    )}

                    {/* HTTP 500 Downtime Loss Calculator */}
                    {selectedScenario?.code === 'HTTP 500' && (
                      <Link
                        to="/kesinti-maliyeti/"
                        className="px-5 py-3 rounded bg-[var(--surface)] hover:bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer min-h-[44px]"
                      >
                        <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
                        <span>{isTr ? 'Kesinti Maliyeti Hesaplayıcı →' : 'Downtime Loss Calculator →'}</span>
                      </Link>
                    )}

                    {/* Emergency SOS Modal Button */}
                    <button
                      type="button"
                      onClick={() => setIsSOSOpen(true)}
                      className="px-5 py-3 rounded bg-[var(--surface)] hover:bg-[var(--paper)] border border-[var(--rule)] text-[var(--accent)] font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer min-h-[44px]"
                    >
                      <AlertTriangle className="w-4 h-4 text-[var(--accent)]" />
                      <span>{isTr ? 'Acil SOS Formu Gönder' : 'Send Emergency SOS Ticket'}</span>
                    </button>

                    {/* Restart Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setAnswers({});
                      }}
                      className="px-5 py-3 rounded bg-[var(--surface)] hover:bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink-muted)] hover:text-[var(--ink)] font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer min-h-[44px]"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{isTr ? 'Yeniden Test Et' : 'Restart Test'}</span>
                    </button>
                  </div>
                </div>
              </details>

              <p className="text-xs sm:text-sm text-[var(--ink-muted)] font-mono">
                {isTr 
                  ? 'Kriz masası tek kişilik değildir — başlayan iş, biri devre dışı kalsa da tamamlanır.' 
                  : 'The response desk is not a single person — work that starts gets finished, even if someone drops out.'}
              </p>

              {/* Direct Info */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-[var(--ink-muted)] border-t border-[var(--rule)]">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-0.5">
                  <span>📞 {isTr ? 'Kriz Hattı' : 'Response Desk'}: <a href="tel:+905343713573" className="text-[var(--ink)] font-mono hover:text-[var(--accent)] font-semibold">+90 534 371 35 73</a></span>
                  <span className="text-xs text-[var(--ink-muted)] font-mono">
                    {isTr 
                      ? 'her gün 09:00 – 24:00 · canlı kesintilerde ilk yanıt taahhüdü 15 dakika' 
                      : 'daily 09:00 – 24:00 · first-response commitment for live outages: 15 minutes'}
                  </span>
                </div>
                <span>✉️ {isTr ? 'E-posta' : 'Email'}: <a href="mailto:info@trendmasterakademi.com" className="text-[var(--ink)] font-mono hover:text-[var(--accent)] font-semibold">info@trendmasterakademi.com</a></span>
                <span>📍 Konak / İzmir & Global Remote</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Global SOS Modal */}
      <EmergencySOSModal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} />
    </div>
  );
};

export default CrashTest;

