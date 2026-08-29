import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, ArrowRight, ArrowLeft, 
  RotateCcw, Copy, ExternalLink, Flame, Zap, Clock, ShieldCheck, 
  Terminal, Lock, Layers, Server, Code2, Users, FileCode, Check, Cpu,
  PhoneCall, Mail, Send
} from 'lucide-react';
import EmergencySOSModal from '../components/EmergencySOSModal';

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
    baseRisk: 48,
    questions: [
      {
        id: 'outageScope',
        label: { tr: 'Kesintinin Kapsamı Nedir?', en: 'What is the scope of the outage?' },
        options: [
          { value: 'total', label: { tr: 'Tüm sistem çöktü (Beyaz ekran / 500 Internal Server Error)', en: 'Full outage (Blank screen / 500 Internal Server Error)' }, weight: 18 },
          { value: 'partial', label: { tr: 'Ödeme, üyelik veya kritik bir API çalışmıyor', en: 'Payment, auth, or critical API integration failed' }, weight: 12 },
          { value: 'slow', label: { tr: 'Aşırı yavaşlık & veritabanı kilitlenmesi yaşanıyor', en: 'Severe degradation & database locks' }, weight: 6 }
        ]
      },
      {
        id: 'accessStatus',
        label: { tr: 'Sunucu ve Kod Erişim Durumunuz Nedir?', en: 'What is your server and codebase access status?' },
        options: [
          { value: 'full', label: { tr: 'Git repo ve SSH / cPanel / Cloud erişimlerimiz tam', en: 'Full Git repo, SSH / cPanel / Cloud access available' }, weight: -6 },
          { value: 'gitOnly', label: { tr: 'Yalnızca kaynak kod / Git erişimi var', en: 'Only source code / Git access is available' }, weight: 8 },
          { value: 'limited', label: { tr: 'Şifreler dağınık, önceki geliştiricide kaldı', en: 'Credentials missing or stuck with former developer' }, weight: 18 }
        ]
      },
      {
        id: 'clientPressure',
        label: { tr: 'Müşteri Tarafındaki Durum Nedir?', en: 'What is the client sentiment level?' },
        options: [
          { value: 'furious', label: { tr: 'Müşteri aktif ciro kaybediyor / Sözleşme fesih riski', en: 'Client is losing revenue / Risk of contract cancellation' }, weight: 18 },
          { value: 'waiting', label: { tr: 'Müşteri haber bekliyor, süre kısıtlı', en: 'Client is waiting for updates, tight timeframe' }, weight: 9 },
          { value: 'internal', label: { tr: 'Kendi şirket içi altyapımız, müşteri henüz fark etmedi', en: 'Internal system, no external client escalations yet' }, weight: 2 }
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
    baseRisk: 40,
    questions: [
      {
        id: 'docState',
        label: { tr: 'Mevcut Kodun Dokümantasyonu ve Durumu Nedir?', en: 'What is the condition and documentation of the code?' },
        options: [
          { value: 'none', label: { tr: 'Sıfır dokümantasyon, karmaşık spagetti kod', en: 'Zero documentation, tangled spaghetti code' }, weight: 20 },
          { value: 'partial', label: { tr: 'Kısmen anlaşılır ama kritik kısımlar izole değil', en: 'Partially readable, but critical logic is intertwined' }, weight: 10 },
          { value: 'clean', label: { tr: 'Modern stack (React, Node, Python), kod okunabilir', en: 'Modern stack (React, Node, Python), readable structure' }, weight: -4 }
        ]
      },
      {
        id: 'deadlineGap',
        label: { tr: 'Teslim Tarihine Ne Kadar Süre Var?', en: 'How much time is left until the delivery deadline?' },
        options: [
          { value: 'passed', label: { tr: 'Teslim tarihi geçti / Müşteri cezai şart işletiyor', en: 'Deadline passed / Client imposing contractual penalties' }, weight: 22 },
          { value: 'thisWeek', label: { tr: 'Bu hafta içinde teslim edilmesi gerekiyor', en: 'Must be delivered within this week' }, weight: 12 },
          { value: 'month', label: { tr: '1 aydan fazla süremiz var ama ekip kapasitesi yetersiz', en: 'More than a month, but internal capacity is overloaded' }, weight: 4 }
        ]
      },
      {
        id: 'missingModules',
        label: { tr: 'Eksik Kalan Parça Ne Kadar Büyüklükte?', en: 'How large is the missing piece?' },
        options: [
          { value: 'core', label: { tr: 'Backend, veri akışı veya kritik entegrasyonlar bitmemiş', en: 'Core backend, data flows, or integrations unfinished' }, weight: 18 },
          { value: 'bugs', label: { tr: 'Proje bitti sanılıyordu ama her yerden bug fışkırıyor', en: 'Project was thought done, but bugs are everywhere' }, weight: 14 },
          { value: 'ui', label: { tr: 'Sadece frontend / tasarım uyarlamaları eksik', en: 'Only frontend / UI responsive polishing pending' }, weight: 5 }
        ]
      }
    ]
  },
  {
    id: 't48h',
    code: 'T−48H DARBOĞAZ',
    tag: { tr: 'ZAMAN KRİTİK', en: 'TIME CRITICAL' },
    title: { tr: 'Teslime 48 Saat Kaldı / Lansman Krizi', en: '48 Hours to Launch / Delivery Crunch' },
    subtitle: { tr: 'Kapasite açığı · Yetişmeyen modüller · Acil bitirme baskısı', en: 'Capacity shortage · Pending modules · Urgent delivery crunch' },
    icon: Clock,
    color: 'from-cyan-500/20 to-blue-500/20',
    borderColor: 'border-cyan-500/40',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    baseRisk: 44,
    questions: [
      {
        id: 'remainingWork',
        label: { tr: 'Kalan İşin Tahmini Hacmi Nedir?', en: 'What is the estimated volume of remaining work?' },
        options: [
          { value: 'heavy', label: { tr: '2-3 deneyimli yazılımcının 24 saat aralıksız çalışması gerek', en: 'Needs 2-3 senior devs working continuously' }, weight: 20 },
          { value: 'moderate', label: { tr: '1 kıdemli yazılımcının odaklanmış 1-2 günü yeterli', en: '1 senior dev focused for 1-2 days is sufficient' }, weight: 10 },
          { value: 'polish', label: { tr: 'Hata ayıklama, responsive uyum ve son testler kaldı', en: 'Bug fixes, responsive alignment, and final QA tests' }, weight: 4 }
        ]
      },
      {
        id: 'techStackMatch',
        label: { tr: 'Kullanılan Teknoloji Yığını Nedir?', en: 'What is the technology stack used?' },
        options: [
          { value: 'custom', label: { tr: 'Özel PHP / Legacy Framework / Dağınık mimari', en: 'Legacy PHP / Custom Framework / Fragmented stack' }, weight: 18 },
          { value: 'mobile', label: { tr: 'Flutter / React Native Mobil Uygulama', en: 'Flutter / React Native Mobile Application' }, weight: 10 },
          { value: 'modern', label: { tr: 'React / Next.js / Node.js / Python / PostgreSQL', en: 'React / Next.js / Node.js / Python / PostgreSQL' }, weight: -5 }
        ]
      },
      {
        id: 'supportModel',
        label: { tr: 'Teslimat Aciliyeti ve Çalışma Modeli Nedir?', en: 'What is the delivery urgency and preferred model?' },
        options: [
          { value: 'criticalCrunch', label: { tr: 'Kritik Acil: Bugün geceye kadar yetiştirilmeli', en: 'Critical: Must be delivered by tonight' }, weight: 16 },
          { value: 'whitelabel', label: { tr: 'White-Label (Ajansınızın personeli gibi arka planda)', en: '100% White-Label (Invisibly as your internal team)' }, weight: 6 },
          { value: 'swat', label: { tr: 'Doğrudan teknik repo devralma & hotfix teslimi', en: 'Direct repo takeover & rapid hotfix delivery' }, weight: 4 }
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
    baseRisk: 38,
    questions: [
      {
        id: 'specialNeeds',
        label: { tr: 'En Çok Tıkandığınız Özel Alan Hangisi?', en: 'Where is the primary technical bottleneck?' },
        options: [
          { value: 'algo', label: { tr: 'Yüksek hacimli veri işleme / Algoritmik hesaplama / FinTech', en: 'High-frequency data processing / Algorithmic FinTech' }, weight: 18 },
          { value: 'ai', label: { tr: 'OpenAI / LLM / RAG / Akıllı Bot & Otomasyon Mimarisi', en: 'OpenAI / LLM / RAG / Intelligent Agent Automation' }, weight: 14 },
          { value: 'scale', label: { tr: 'Sunucu optimizasyonu, Redis caching & Docker CI/CD', en: 'Server tuning, Redis caching & Docker CI/CD pipelines' }, weight: 10 },
          { value: 'payment', label: { tr: 'Stripe, iyzico, PayTR veya çoklu para birimli abonelik', en: 'Stripe, iyzico, PayTR multi-currency subscriptions' }, weight: 8 }
        ]
      },
      {
        id: 'budgetRisk',
        label: { tr: 'Bu İşin Çözülmemesi Ajansınızı Nasıl Etkiler?', en: 'How would leaving this unresolved affect your agency?' },
        options: [
          { value: 'reputation', label: { tr: 'Büyük ve stratejik bir kurumsal müşteriyi kaybetme riski', en: 'Risk of losing a high-tier enterprise client' }, weight: 22 },
          { value: 'stalled', label: { tr: 'Proje haftalardır ilerlemiyor, ajans içi vakit kaybı', en: 'Project stalled for weeks, burning internal hours' }, weight: 12 },
          { value: 'exploration', label: { tr: 'Yeni bir teklif hazırlıyoruz, fizibilite desteği arıyoruz', en: 'Preparing a proposal, seeking feasibility backing' }, weight: 2 }
        ]
      },
      {
        id: 'deliveryPace',
        label: { tr: 'Hedeflenen Çözüm Süresi Nedir?', en: 'What is your target turnaround time?' },
        options: [
          { value: 'urgent', label: { tr: '1 - 3 Gün İçinde Çalışır Hale Getirilmeli', en: 'Must be operational within 1 - 3 days' }, weight: 18 },
          { value: 'standard', label: { tr: '1 - 2 Hafta İçinde Tamamlanmalı', en: 'Can be completed within 1 - 2 weeks' }, weight: 5 }
        ]
      }
    ]
  }
];

const CrashTest = () => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';

  const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [copied, setCopied] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);

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
    document.title = isTr
      ? "Agency Crash Test (60sn) - Kriz & Risk Simülatörü | Trend Master Akademi"
      : "Agency Crash Test (60s) - Crisis & Risk Simulator | Trend Master Academy";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", isTr
        ? "Ajansınız teknik bir krize hazır mı? HTTP 500 kesintisi, geliştirici ani ayrılığı veya T-48H lansman darboğazı için 60 saniyede risk skorunuzu ve eylem planınızı görün."
        : "Is your agency prepared for a technical crisis? Calculate risk scores and get a 3-phase action recovery blueprint in 60 seconds."
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://trendmasterakademi.com/crash-test/');
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const src = params.get('utm_source') || '';
      const cmp = params.get('utm_campaign') || '';
      const agency = params.get('a') || params.get('agency') || '';
      if (src || cmp || agency) {
        setCampaignParams({ utm_source: src, utm_campaign: cmp, agency_code: agency });
      }
    } catch (e) {}
  }, [isTr]);

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
  const isAllAnswered = currentQuestions.every(q => answers[q.id]);

  const calculateScore = () => {
    let score = selectedScenario.baseRisk;
    Object.values(answers).forEach(ans => {
      if (ans && typeof ans.weight === 'number') {
        score += ans.weight;
      }
    });
    return Math.min(Math.max(score, 38), 98);
  };

  const riskScore = calculateScore();

  const getRiskDetails = (score) => {
    if (score >= 80) {
      return {
        level: isTr ? 'KRİTİK RİSK (SEVİYE 1)' : 'CRITICAL RISK (LEVEL 1)',
        color: 'text-red-400',
        bgColor: 'bg-red-500/10 border-red-500/30',
        summary: isTr 
          ? 'Projenin teknik bütünlüğü ve ajansınızın müşteri itibarı yüksek tehlike altında. 0-2 saat içinde acil müdahale önerilir.' 
          : 'Project technical integrity and client reputation are in severe jeopardy. 0-2 hour rapid intervention strongly advised.',
        dailyLossEst: '₺45.000 - ₺120.000+ / $1,800 - $4,500+',
        triageTime: isTr ? '15 - 30 Dakika' : '15 - 30 Minutes'
      };
    } else if (score >= 60) {
      return {
        level: isTr ? 'YÜKSEK TEHLİKE (SEVİYE 2)' : 'ELEVATED RISK (LEVEL 2)',
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10 border-amber-500/30',
        summary: isTr 
          ? 'Darboğazlar birikmiş durumda ve teslim tarihine yetişmeme riski belirgin. 24 saat içinde uzman devralması tavsiye edilir.' 
          : 'Bottlenecks are compounding and deadline breach is probable. Senior engineering takeover within 24h recommended.',
        dailyLossEst: '₺20.000 - ₺45.000 / $800 - $1,800',
        triageTime: isTr ? '1 - 2 Saat' : '1 - 2 Hours'
      };
    } else {
      return {
        level: isTr ? 'KONTROLLÜ RİSK (SEVİYE 3)' : 'CONTROLLED RISK (LEVEL 3)',
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-500/10 border-cyan-500/30',
        summary: isTr 
          ? 'Sistem kurtarılabilir aşamada ancak ekibinizin üzerindeki gereksiz yükü hafifletmek için white-label takviyesi fayda sağlar.' 
          : 'Codebase is recoverable; white-label surge support is recommended to relieve internal team strain.',
        dailyLossEst: '₺8.000 - ₺20.000 / $300 - $800',
        triageTime: isTr ? '2 - 4 Saat' : '2 - 4 Hours'
      };
    }
  };

  const riskDetails = getRiskDetails(riskScore);

  const copyActionPlan = () => {
    const text = `=== TMA AGENCY CRASH TEST REPORT ===\n` +
      `Scenario: ${selectedScenario.title[isTr ? 'tr' : 'en']} (${selectedScenario.code})\n` +
      `Risk Rating: %${riskScore} - ${riskDetails.level}\n` +
      `Estimated Daily Loss Risk: ${riskDetails.dailyLossEst}\n` +
      `Emergency Triage Turnaround: ${riskDetails.triageTime}\n\n` +
      `ACTION RECOVERY PROTOCOL:\n` +
      `Phase 1 (0-2h): Repo Isolation, Git Fork & Deadlock Log Audits\n` +
      `Phase 2 (2-12h): White-Label Hotfix, Database & API Re-architecture\n` +
      `Phase 3 (12-24h): Production Deployment, Stress Testing & Clean Handover\n\n` +
      `TMA Response Desk: +90 534 371 35 73 | info@trendmasterakademi.com`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openWhatsAppDispatch = () => {
    if (window.trackEvent) {
      window.trackEvent('whatsapp_clicked', {
        source: 'crash_test_dispatch',
        scenario: selectedScenario?.code,
        risk_score: riskScore,
        agency_code: campaignParams.agency_code
      });
    }

    const kitBadge = campaignParams.agency_code ? `\n📦 *Kriz Kiti Ajans Kodu:* #${campaignParams.agency_code}` : '';
    const rawText = isTr
      ? `🚨 *TMA CRASH TEST SONUCU & ACİL MÜDAHALE TALEBİ* 🚨\n\n` +
        `📊 *Seçilen Kriz:* ${selectedScenario.title.tr} (${selectedScenario.code})\n` +
        `🔥 *Hesaplanan Risk Skoru:* %${riskScore} (${riskDetails.level})\n` +
        `⏱️ *Önerilen Triyaj Süresi:* ${riskDetails.triageTime}${kitBadge}\n\n` +
        `Ajansımız için acil teknik destek / white-label müdahale görüşmesi başlatmak istiyoruz.`
      : `🚨 *TMA CRASH TEST REPORT & EMERGENCY DISPATCH INQUIRY* 🚨\n\n` +
        `📊 *Selected Incident:* ${selectedScenario.title.en} (${selectedScenario.code})\n` +
        `🔥 *Calculated Risk Rating:* ${riskScore}% (${riskDetails.level})\n` +
        `⏱️ *Recommended Triage Window:* ${riskDetails.triageTime}${kitBadge}\n\n` +
        `We would like to initiate an emergency technical support / white-label consultation for our agency.`;

    const text = encodeURIComponent(rawText);
    window.open(`https://wa.me/905343713573?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 md:px-8 bg-[#080b11] text-slate-200 relative  font-sans">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-cyan-500/10 via-red-500/5 to-transparent blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#1f293d_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto">
        
        {/* Top Eyebrow & Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs sm:text-sm font-mono tracking-widest text-slate-300 uppercase">
              TMA Response Desk // Diagnostic Engine v2.5
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              ⚡ {isTr ? '60 SANİYELİK SİMÜLASYON' : '60-SECOND SIMULATION'}
            </span>
            <button
              onClick={() => setIsSOSOpen(true)}
              className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> {isTr ? 'Acil SOS Masası' : 'Emergency SOS Desk'}
            </button>
          </div>
        </div>

        {/* Hero of Crash Test */}
        {step < 3 && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <ShieldAlert className="w-4 h-4" /> {isTr ? 'Ajans Kriz Dayanıklılık & Risk Testi' : 'Agency Crisis Resilience & Risk Test'}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight text-white mb-5 leading-tight">
              <span className="block">
                {isTr ? 'Ajansınız teknik bir krize ' : 'Is your agency '}
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-300 to-cyan-400">
                {isTr ? 'gerçekten hazır mı?' : 'truly ready for a technical crisis?'}
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              {isTr 
                ? 'Kritik kod kilitlenmeleri, devir süreçleri tıkanmış yarım kalan projeler veya yaklaşan teslimat baskısı altında ajansınızın risk puanını ölçün. Anında ajansınıza özel 3 aşamalı ilk aksiyon planını görün.' 
                : 'Measure your agency’s risk rating under live outages, stranded repositories, or tight delivery deadlines. Get an instant 3-phase action recovery blueprint.'}
            </p>

            {/* Quick Guarantees Bar */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mt-8 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200">
              <div className="text-center">
                <strong className="block text-white font-bold text-sm sm:text-base">60 {isTr ? 'Sn' : 'Sec'}</strong>
                <span className="text-slate-400 text-xs">{isTr ? 'Ortalama Süre' : 'Average Time'}</span>
              </div>
              <div className="text-center border-x border-white/10">
                <strong className="block text-emerald-400 font-bold text-sm sm:text-base">0 {isTr ? 'Erişim' : 'Access'}</strong>
                <span className="text-slate-400 text-xs">{isTr ? 'Şifre / Repo İstemez' : 'Zero Repo/Credentials'}</span>
              </div>
              <div className="text-center">
                <strong className="block text-cyan-400 font-bold text-sm sm:text-base">1 {isTr ? 'Plan' : 'Plan'}</strong>
                <span className="text-slate-400 text-xs">{isTr ? 'Anında Eylem Reçetesi' : 'Instant Action Plan'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
          {[
            { s: 1, label: isTr ? '01. Kriz Senaryosu' : '01. Crisis Scenario' },
            { s: 2, label: isTr ? '02. Durum Teşhisi' : '02. Diagnosis' },
            { s: 3, label: isTr ? '03. Risk Raporu & Reçete' : '03. Risk Blueprint' }
          ].map((item) => (
            <div
              key={item.s}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-mono transition-all ${
                step === item.s
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                  : step > item.s
                  ? 'bg-white/5 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/5 text-slate-500 border border-white/5'
              }`}
            >
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* STEP 1: Scenario Selection */}
        {step === 1 && (
          <div
            
            
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {scenarios.map((sc) => {
                const IconComponent = sc.icon;
                const isSelected = selectedScenario.id === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => handleScenarioSelect(sc)}
                    className={`p-6 sm:p-7 rounded-3xl text-left border transition-all duration-300 relative group cursor-pointer overflow-hidden ${
                      isSelected
                        ? `bg-gradient-to-br ${sc.color} ${sc.borderColor} shadow-[0_0_30px_rgba(0,229,255,0.15)] ring-1 ring-white/20`
                        : 'bg-[#111827]/80 border-white/10 hover:border-white/25 hover:bg-[#151f33]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3.5 rounded-2xl ${isSelected ? 'bg-white/10' : 'bg-white/5'} border border-white/10`}>
                        <IconComponent className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${sc.badgeColor}`}>
                          {sc.tag[isTr ? 'tr' : 'en']}
                        </span>
                        <span className="text-xs font-mono text-slate-400 font-bold">{sc.code}</span>
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {sc.title[isTr ? 'tr' : 'en']}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-5">
                      {sc.subtitle[isTr ? 'tr' : 'en']}
                    </p>

                    <div className="flex items-center justify-between text-xs sm:text-sm pt-4 border-t border-white/10">
                      <span className="text-slate-400">{isTr ? 'Temel Risk İndeksi' : 'Base Risk Index'}</span>
                      <span className="font-mono font-bold text-white">%{sc.baseRisk}</span>
                    </div>
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
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-bg-dark font-black text-sm sm:text-base tracking-wide flex items-center gap-3 shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer min-h-[48px]"
              >
                <span>{isTr ? 'Durum Teşhisine Geç' : 'Proceed to Diagnosis'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Questions */}
        {step === 2 && (
          <div
            
            
            className="space-y-8"
          >
            {/* Sticky Selected Scenario & Progress Mini-Banner */}
            <div className="sticky top-14 sm:top-20 z-30 p-4 sm:p-5 rounded-2xl bg-[#080b11]/95 backdrop-blur-xl border border-cyan-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.85)] flex flex-wrap items-center justify-between gap-3 transition-all">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg text-xs sm:text-sm font-mono font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  {selectedScenario.code}
                </span>
                <div>
                  <strong className="text-white text-sm sm:text-base block">{selectedScenario.title[isTr ? 'tr' : 'en']}</strong>
                  <span className="text-xs text-slate-400">
                    {Object.keys(answers).length} / {currentQuestions.length} {isTr ? 'Soru Yanıtlandı' : 'Answered'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs sm:text-sm text-slate-400 hover:text-white underline cursor-pointer"
              >
                {isTr ? 'Senaryoyu Değiştir' : 'Change Scenario'}
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {currentQuestions.map((q, idx) => (
                <div key={q.id} className="p-6 sm:p-7 rounded-3xl bg-[#111827]/85 border border-white/10 shadow-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono text-xs sm:text-sm font-bold border border-cyan-500/40 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{q.label[isTr ? 'tr' : 'en']}</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = answers[q.id]?.value === opt.value;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleAnswerSelect(q.id, opt)}
                          className={`p-4 sm:p-5 rounded-2xl text-left border transition-all text-sm sm:text-base flex items-center justify-between gap-3 cursor-pointer min-h-[52px] ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-400 text-white font-semibold shadow-[0_0_20px_rgba(0,229,255,0.1)]'
                              : 'bg-white/5 border-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                          }`}
                        >
                          <span className="leading-snug">{opt.label[isTr ? 'tr' : 'en']}</span>
                          <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'border-cyan-400 bg-cyan-400 text-bg-dark' : 'border-white/20'
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
                className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-sm sm:text-base flex items-center gap-2 cursor-pointer transition-colors min-h-[48px]"
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
                      risk_score: riskScore,
                      risk_level: riskDetails.level,
                      agency_code: campaignParams.agency_code
                    });
                  }
                }}
                className={`px-8 py-4 rounded-2xl font-black text-sm sm:text-base tracking-wide flex items-center gap-3 transition-all cursor-pointer min-h-[48px] ${
                  isAllAnswered
                    ? 'bg-gradient-to-r from-red-500 via-orange-500 to-cyan-400 text-bg-dark shadow-lg shadow-orange-500/25 hover:opacity-95 transform hover:-translate-y-0.5'
                    : 'bg-white/10 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>{isTr ? 'Risk Raporunu & Aksiyon Planını Üret' : 'Generate Risk Blueprint & Action Plan'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Results & Protocol */}
        {step === 3 && (
          <div
            
            
            className="space-y-8"
          >
            {/* Header Risk Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#111827] via-[#0d131f] to-[#1a0e14] border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)] relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                    <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
                      {isTr ? 'TMA TEŞHİS RAPORU' : 'TMA DIAGNOSTIC BLUEPRINT'} // {selectedScenario.code}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
                    {selectedScenario.title[isTr ? 'tr' : 'en']}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-xl leading-relaxed">
                    {riskDetails.summary}
                  </p>
                </div>

                {/* Score Gauge */}
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-mono uppercase text-slate-400 block">{isTr ? 'Kriz & Risk Skoru' : 'Crisis Risk Index'}</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${riskDetails.bgColor} ${riskDetails.color}`}>
                      {riskDetails.level}
                    </span>
                  </div>
                  <div className="w-20 h-20 rounded-2xl bg-black/40 border border-red-500/40 flex flex-col items-center justify-center shadow-inner">
                    <span className="text-3xl font-black font-mono text-white">%{riskScore}</span>
                    <span className="text-[9px] font-mono text-red-400">RATING</span>
                  </div>
                </div>
              </div>

              {/* Metric Highlights with Pricing Anchor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs sm:text-sm text-slate-400 block mb-1">{isTr ? 'Tahmini Günlük Risk & Kayıp' : 'Estimated Daily Risk Loss'}</span>
                  <strong className="text-base sm:text-lg font-bold text-red-400">{riskDetails.dailyLossEst}</strong>
                  <span className="text-xs text-slate-400 block mt-1">{isTr ? 'Cezai şart ve müşteri kaybı dahil' : 'Contract penalties & client churn factored'}</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-cyan-500/30 bg-cyan-500/5">
                  <span className="text-xs sm:text-sm text-cyan-300 font-bold block mb-1">{isTr ? 'İlk Teşhis & Triyaj' : 'Initial Triage'}</span>
                  <strong className="text-base sm:text-lg font-bold text-emerald-400 font-mono">{isTr ? 'Ücretsiz' : 'Free'}</strong>
                  <span className="text-xs text-cyan-400/80 block mt-1">{isTr ? 'Sonraki adımlar kapsama göre belirlenir' : 'Next steps scoped per project'}</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs sm:text-sm text-slate-400 block mb-1">{isTr ? 'Acil Triyaj & Teşhis Süresi' : 'Rapid Triage Turnaround'}</span>
                  <strong className="text-base sm:text-lg font-bold text-cyan-400">{riskDetails.triageTime}</strong>
                  <span className="text-xs text-slate-400 block mt-1">{isTr ? 'İlk kod analizi ve yapılabilirlik raporu' : 'Initial audit and feasibility report'}</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs sm:text-sm text-slate-400 block mb-1">{isTr ? 'TMA Çalışma Güvencesi' : 'TMA Engagement Guarantee'}</span>
                  <strong className="text-base sm:text-lg font-bold text-emerald-400">%100 White-Label</strong>
                  <span className="text-xs text-slate-400 block mt-1">{isTr ? 'Resmi Gizlilik Sözleşmesi (NDA) ile' : 'Protected under Mutual NDA'}</span>
                </div>
              </div>
            </div>

            {/* 3-Phase Action Protocol */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-white/10 shadow-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs sm:text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                    {isTr ? 'Acil Müdahale Protokolü' : 'Emergency SWAT Protocol'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {isTr ? 'Ajansınıza Özel 3 Aşamalı İlk Kurtarma Reçetesi' : 'Your Bespoke 3-Phase Recovery Blueprint'}
                  </h3>
                </div>
                <button
                  onClick={copyActionPlan}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? (isTr ? 'Kopyalandı!' : 'Copied!') : (isTr ? 'Raporu Kopyala' : 'Copy Blueprint')}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      {isTr ? 'AŞAMA 01 (0 - 2 Saat)' : 'PHASE 01 (0 - 2 Hours)'}
                    </span>
                    <Clock className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {isTr ? 'Kod Dondurma & İzole Teşhis' : 'Code Freeze & Isolated Audit'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isTr 
                      ? 'Mevcut repoyu klonlayıp güvenli izole ortama alıyoruz. Canlıdaki hasarın yayılmasını durdurup hata loglarını, API ve veritabanı kilitlerini ayrıştırıyoruz.' 
                      : 'We fork the codebase into an isolated staging sandbox, halt live data degradation, and isolate error logs, API breaks, and DB deadlocks.'}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30">
                      {isTr ? 'AŞAMA 02 (2 - 12 Saat)' : 'PHASE 02 (2 - 12 Hours)'}
                    </span>
                    <Code2 className="w-4 h-4 text-orange-400" />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {isTr ? 'White-Label Hotfix & Onarım' : 'White-Label Hotfix & Repair'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isTr 
                      ? 'Eksik modüllerin tamamlanması, spagetti kodun temizlenmesi ve kritik API entegrasyonlarının doğrudan kıdemli mühendislik masamızca ayağa kaldırılması.' 
                      : 'Completing missing endpoints, refactoring messy logic, and rebuilding broken API integrations directly with our senior engineering desk.'}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {isTr ? 'AŞAMA 03 (12 - 24 Saat)' : 'PHASE 03 (12 - 24 Hours)'}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {isTr ? 'Canlı Dağıtım & Temiz Devir' : 'Deployment & Clean Handover'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isTr 
                      ? 'Stres testleri ve güvenlik kontrolleri sonrası sistem canlıya alınır. Tüm dokümante edilmiş kaynak kod ajansınıza eksiksiz teslim edilir.' 
                      : 'Following automated stress and security audits, the system is deployed live. Documented clean source code is completely handed over to your agency.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Handover Cross-Link Tool Box */}
            {selectedScenario?.code === 'SCN-02' && (
              <div className="p-6 sm:p-7 rounded-3xl bg-cyan-950/40 border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                      {isTr ? 'ÖZEL DEVİR HAZIRLIK ENVENTERİ' : 'DEDICATED HANDOVER AUDIT'}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {isTr ? 'Ayrılan yazılımcının elindeki 12 kritik kalemi tek tek kontrol edin' : 'Audit 12 critical handover checkpoints before your developer departs'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {isTr ? 'Git, DNS, .env, DB yedeği ve ödeme anahtarlarını test eden 60 saniyelik ücretsiz denetim aracı.' : 'Verify Git, DNS, .env secrets, DB dumps, and payment access in 60 seconds.'}
                  </p>
                </div>
                <Link
                  to="/devir-kontrolu/"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-bg-dark font-black text-xs sm:text-sm whitespace-nowrap flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>{isTr ? '12 Kalemlik Devir Kontrolü →' : '12-Point Handover Audit →'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* HTTP 500 Downtime Calculator Cross-Link Tool Box */}
            {(selectedScenario?.code === 'HTTP 500' || selectedScenario?.code === 'SCN-01') && (
              <div className="p-6 sm:p-7 rounded-3xl bg-red-950/40 border border-red-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-xs font-mono font-bold text-red-300 uppercase tracking-wider">
                      {isTr ? 'ÖZEL KESİNTİ MALİYETİ SİMÜLATÖRÜ' : 'DEDICATED DOWNTIME LOSS CALCULATOR'}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {isTr ? 'Bu kesintinin saatlik ve toplam ciro kaybını hesaplamak ister misiniz?' : 'Calculate the exact hourly and total turnover loss of this downtime'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {isTr ? 'Sektörünüze ve ciro aralığınıza göre tahmini finansal kaybı ve SLA riskini modelleyin.' : 'Model financial loss, churn risk, and SWAT remediation savings in 30 seconds.'}
                  </p>
                </div>
                <Link
                  to="/kesinti-maliyeti/"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-bg-dark font-black text-xs sm:text-sm whitespace-nowrap flex items-center gap-2 shadow-lg shadow-red-500/25 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>{isTr ? 'Kesinti Maliyeti Hesaplayıcı →' : 'Downtime Loss Calculator →'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Email Lead Capture Card */}
            <div className="p-8 rounded-3xl bg-[#0e1626] border border-cyan-500/30 text-left space-y-5 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">
                      {isTr ? 'Bu Kriz Raporunu & 3 Aşamalı Reçeteyi E-Postama Gönder' : 'Send This Crisis Blueprint & Action Recipe to My Email'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {isTr ? 'Ajans içi değerlendirme ve teknik ekibinizle paylaşım için hazır PDF/E-posta formatında iletilir.' : 'Sent in a ready-to-share technical blueprint format for your internal stakeholders.'}
                    </p>
                  </div>
                </div>
              </div>

              {leadSent === 'success' ? (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-sm font-bold">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                  <span>{isTr ? 'Rapor talebiniz başarıyla kaydedildi! Kriz masamız analizi hazırlayıp iletecektir.' : 'Report request logged successfully! Our SWAT engineers will deliver your blueprint.'}</span>
                </div>
              ) : leadSent === 'error' ? (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <div className="flex items-center gap-3 text-amber-300 text-sm font-bold">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />
                    <span>{isTr ? 'Ağ kesintisi nedeniyle otomatik iletilemedi.' : 'Network interruption during auto-dispatch.'}</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {isTr ? 'Analiz skorunuz ve eylem planınız hazır. Aşağıdaki butona tıklayarak WhatsApp üzerinden raporu hemen talep edebilirsiniz:' : 'Your diagnosis is ready. Request your blueprint directly via WhatsApp:'}
                  </p>
                  <button
                    type="button"
                    onClick={openWhatsAppDispatch}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-bg-dark font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
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
                          subject: `🎯 CRASH TEST RAPOR TALEBİ: ${leadName} (%${riskScore} Risk - ${selectedScenario?.code})${campaignParams.agency_code ? ` [Kutu #${campaignParams.agency_code}]` : ''}`,
                          name: leadName,
                          email: leadEmail,
                          phone: leadPhone,
                          scenario: selectedScenario?.title[isTr ? 'tr' : 'en'],
                          riskScore: `%${riskScore}`,
                          lossRisk: lossRisk,
                          turnaroundSLA: turnaroundSLA,
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
                    className="px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                  <input
                    type="email"
                    required
                    placeholder={isTr ? 'Kurumsal E-posta' : 'Corporate Email'}
                    value={leadEmail}
                    onChange={e => setLeadEmail(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    placeholder={isTr ? 'Telefon / WhatsApp' : 'Phone / WhatsApp'}
                    value={leadPhone}
                    onChange={e => setLeadPhone(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSendingLead}
                    className="sm:col-span-3 py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-bg-dark font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSendingLead ? (isTr ? 'Gönderiliyor...' : 'Sending...') : (isTr ? 'Detaylı Eylem Raporumu Gönder' : 'Send My Custom Blueprint')}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Bottom Dispatch CTA */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-red-950/40 via-[#111827] to-cyan-950/40 border border-cyan-500/30 text-center space-y-6">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
                {isTr ? 'Bu Krizi Birlikte 24 Saat İçinde Çözelim' : 'Let’s Resolve This Crunch Together in 24 Hours'}
              </h3>
              <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                {isTr 
                  ? 'Müşteriniz sizin müşteriniz olarak kalırken; arka planda ihtiyacınız olan teknik gücü ve kurtarma mühendisliğini anında devreye alalım.' 
                  : 'While your client remains strictly yours; let us deploy the invisible engineering rescue power you need immediately.'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={openWhatsAppDispatch}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-bg-dark font-black text-sm sm:text-base shadow-xl shadow-emerald-500/25 flex items-center gap-3 transition-all transform hover:-translate-y-0.5 cursor-pointer min-h-[48px]"
                >
                  <PhoneCall className="w-5 h-5" />
                  <span>{isTr ? 'Kriz Masasını Devreye Sok (WhatsApp)' : 'Deploy Crisis Desk (WhatsApp)'}</span>
                </button>

                <button
                  onClick={() => setIsSOSOpen(true)}
                  className="px-8 py-4 rounded-2xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-bold text-sm sm:text-base flex items-center gap-2 transition-colors cursor-pointer min-h-[48px]"
                >
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span>{isTr ? 'Acil SOS Formu Gönder' : 'Send Emergency SOS Ticket'}</span>
                </button>

                <button
                  onClick={() => {
                    setStep(1);
                    setAnswers({});
                  }}
                  className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold text-sm sm:text-base flex items-center gap-2 transition-colors cursor-pointer min-h-[48px]"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{isTr ? 'Yeniden Test Et' : 'Restart Test'}</span>
                </button>
              </div>

              {/* Direct Info */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400 border-t border-white/10">
                <span>📞 {isTr ? 'Kriz Hattı' : 'Hotline'}: <a href="tel:+905343713573" className="text-white font-mono hover:text-cyan-400 font-bold">+90 534 371 35 73</a></span>
                <span>✉️ {isTr ? 'E-posta' : 'Email'}: <a href="mailto:info@trendmasterakademi.com" className="text-white font-mono hover:text-cyan-400 font-bold">info@trendmasterakademi.com</a></span>
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
