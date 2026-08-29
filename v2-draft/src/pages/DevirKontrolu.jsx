import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Copy, Check, 
  ArrowRight, ArrowLeft, RefreshCw, Mail, PhoneCall,
  Key, Lock, Server, Database, Globe, CreditCard, GitBranch,
  Terminal, FileText, Layers, AlertCircle, HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * 12 Kalemlik Devir Hazırlık Kontrolü (Handover Readiness Checklist)
 * Ağırlıklandırma Gerekçeleri:
 * - Kritik Erişimler (Git, DNS, Ödeme, Sunucu): 12-15 Puan. Bu kalemler olmadan kod tabanına erişilemez veya yayın kesilir.
 * - Çevresel Sırlar & Veri (Env, DB Yedek, 3. Parti API): 8-10 Puan. Uygulama ayağa kalkamaz veya veri kaybı yaşanır.
 * - Süreç & Dokümantasyon (CI/CD, Docs, Test, Lisans): 2-6 Puan. Bakım ve geliştirme maliyetini artırır.
 * Toplam Maksimum Risk: 100 Puan.
 */
const handoverItems = [
  {
    id: 'git_repo',
    title: { tr: '1. Git Repo Erişim & Sahiplik Devri', en: '1. Git Repository Ownership & Access' },
    desc: { 
      tr: 'Kaynak kodun barındığı GitHub/GitLab/Bitbucket organizasyonunda tam Admin/Owner yetkisi ajansınıza devredildi mi?', 
      en: 'Has full Admin/Owner access to the GitHub/GitLab/Bitbucket repo been transferred to your agency?' 
    },
    impact: {
      tr: 'Erişim yoksa: Ayrılan geliştirici hesabı kapattığında veya erişimi kestiğinde tüm kaynak kodu ve sürüm geçmişini kaybedersiniz.',
      en: 'Without access: If the departing developer closes their account, all source code and commit history are permanently lost.'
    },
    weight: 15,
    icon: GitBranch
  },
  {
    id: 'env_secrets',
    title: { tr: '2. Ortam Değişkenleri (.env) & Bağlantı Sırları', en: '2. Environment Variables (.env) & Secrets' },
    desc: { 
      tr: 'Canlı ve staging ortamlarındaki tüm API anahtarları, JWT secretları ve veritabanı şifreleri eksiksiz bir listede mevcut mu?', 
      en: 'Are all production & staging API keys, JWT secrets, and database passwords compiled in a secure inventory?' 
    },
    impact: {
      tr: 'Erişim yoksa: Kod elinizde olsa dahi uygulama çalıştırılamaz; veritabanına ve dış servislere bağlanamaz.',
      en: 'Without secrets: Even with the codebase, the app cannot boot or connect to databases and external microservices.'
    },
    weight: 10,
    icon: Key
  },
  {
    id: 'dns_domain',
    title: { tr: '3. Alan Adı (Domain) & DNS Yönetim Paneli', en: '3. Domain Registrar & DNS Management Access' },
    desc: { 
      tr: 'Cloudflare, GoDaddy, Namecheap vb. DNS ve domain sağlayıcı hesabının yönetici erişimi ajansınızın kontrolünde mi?', 
      en: 'Does your agency hold administrative control of Cloudflare/registrar DNS panels?' 
    },
    impact: {
      tr: 'Erişim yoksa: Sunucuyu taşısanız bile trafiği yeni sunucuya yönlendiremezsiniz; site kesintiye uğrar.',
      en: 'Without DNS access: You cannot point traffic to a new server or renew routing during server migrations.'
    },
    weight: 12,
    icon: Globe
  },
  {
    id: 'ssl_certs',
    title: { tr: '4. SSL Sertifikası & Yenileme Yöntemi', en: '4. SSL Certificates & Auto-Renewal Pipeline' },
    desc: { 
      tr: 'SSL sertifikasının (Let’s Encrypt / Certbot / Cloudflare Edge) nasıl yenilendiği ve süresi biliniyor mu?', 
      en: 'Is the SSL certificate renewal method (Certbot/Cloudflare) documented and managed?' 
    },
    impact: {
      tr: 'Erişim yoksa: Sertifika süresi dolduğunda tüm ziyaretçiler "Güvenli Değil / Gizlilik Hatası" ekranıyla karşılaşır.',
      en: 'Without SSL pipeline: When certs expire, visitors are blocked by browser privacy/security warning screens.'
    },
    weight: 5,
    icon: Lock
  },
  {
    id: 'db_backup',
    title: { tr: '5. Veritabanı Yedeği & Güncel Dump Dosyası', en: '5. Database Backups & Recent Dump Snapshot' },
    desc: { 
      tr: 'Son 24-48 saatlik güncel bir veritabanı dump/snapshot yedeği ve geri yükleme (restore) talimatı var mı?', 
      en: 'Do you possess a verified database dump from the last 24-48 hours with restore instructions?' 
    },
    impact: {
      tr: 'Erişim yoksa: Devir esnasında yaşanacak olası bir veri bozulmasında müşteri verilerini kurtarma şansınız kalmaz.',
      en: 'Without backups: Any database corruption during migration results in irreversible customer data loss.'
    },
    weight: 10,
    icon: Database
  },
  {
    id: 'third_party_apis',
    title: { tr: '6. Üçüncü Taraf API Hesapları & Tokenlar', en: '6. 3rd-Party API Accounts & Integrations' },
    desc: { 
      tr: 'Google Maps, SendGrid, AWS S3, Twilio, OpenAI vb. dış servislerin hesapları ajans/müşteri adına mı kayıtlı?', 
      en: 'Are 3rd-party services (SendGrid, Maps, S3, Twilio, OpenAI) registered under agency/client credentials?' 
    },
    impact: {
      tr: 'Erişim yoksa: Geliştiricinin kişisel hesabına bağlı servisler faturalandırma veya kota nedeniyle aniden durur.',
      en: 'Without ownership: APIs bound to developer personal cards fail suddenly upon quota limits or billing blocks.'
    },
    weight: 8,
    icon: Layers
  },
  {
    id: 'payment_gateway',
    title: { tr: '7. Ödeme Sağlayıcı Paneli & Webhook Gizli Anahtarları', en: '7. Payment Gateway Panel & Webhook Secrets' },
    desc: { 
      tr: 'Stripe, iyzico, PayTR vb. ödeme paneli yönetimi ve webhook signing secret anahtarları elinizde mi?', 
      en: 'Do you hold master access to Stripe/iyzico/PayTR dashboards and webhook signing secrets?' 
    },
    impact: {
      tr: 'Erişim yoksa: Siparişler tamamlansa bile veritabanına yansımaz, para akışı kilitlenir ve ciro kaybı doğar.',
      en: 'Without payment keys: Webhook breaks cause silent checkout failures and direct revenue loss.'
    },
    weight: 12,
    icon: CreditCard
  },
  {
    id: 'server_cloud',
    title: { tr: '8. Sunucu / Hosting / Bulut Hesap Yetkisi', en: '8. Cloud/Server Administrative Root Access' },
    desc: { 
      tr: 'AWS, Hetzner, DigitalOcean, Vercel vb. sunucu altyapısına SSH key ve Root/Admin düzeyinde erişiminiz var mı?', 
      en: 'Do you have SSH root keys and admin dashboard access to AWS/Hetzner/Vercel/DigitalOcean infrastructure?' 
    },
    impact: {
      tr: 'Erişim yoksa: Canlı sistem çöktüğünde veya yeniden başlatma gerektiğinde sunucuya müdahale edemezsiniz.',
      en: 'Without root access: When servers lock up or require reboots, you are locked out from the machines.'
    },
    weight: 12,
    icon: Server
  },
  {
    id: 'cicd_pipeline',
    title: { tr: '9. CI/CD & Otomatik Dağıtım İş Akışları', en: '9. CI/CD & Automated Deployment Workflows' },
    desc: { 
      tr: 'GitHub Actions, GitLab CI veya Dockerfile derleme ve otomatik canlıya alma adımları belgelenmiş mi?', 
      en: 'Are GitHub Actions, GitLab CI, or Docker build deployment pipelines documented and functional?' 
    },
    impact: {
      tr: 'Erişim yoksa: Yapılan yeni kod düzeltmelerini canlıya hatasız dağıtmak saatler süren manuel riske dönüşür.',
      en: 'Without CI/CD: Deploying bugfixes becomes a fragile, error-prone manual ordeal.'
    },
    weight: 6,
    icon: Terminal
  },
  {
    id: 'readme_docs',
    title: { tr: '10. Kurulum & Mimari Dokümantasyonu (README)', en: '10. Local Setup & Architecture Documentation' },
    desc: { 
      tr: 'Yeni bir geliştiricinin projeyi localhost ortamında sıfırdan ayağa kaldırabilmesi için adım adım rehber var mı?', 
      en: 'Does a step-by-step README exist enabling a new engineer to spin up the repo locally from scratch?' 
    },
    impact: {
      tr: 'Erişim yoksa: Yeni ekibin projeyi anlaması ve ilk commit’i atması günler/haftalar süren tersine mühendisliğe dönüşür.',
      en: 'Without docs: Onboarding a replacement dev requires costly days/weeks of reverse engineering.'
    },
    weight: 5,
    icon: FileText
  },
  {
    id: 'test_coverage',
    title: { tr: '11. Test Kapsamı & Otomatik Kalite Kontrolü', en: '11. Automated Test Suite & QA Scripts' },
    desc: { 
      tr: 'Kritik akışları (ödeme, kayıt, API) doğrulayan unit veya integration test suite mevcut mu?', 
      en: 'Is there an automated unit or integration test suite covering core payment/auth funnels?' 
    },
    impact: {
      tr: 'Erişim yoksa: Yapılan her kod değişikliğinde sistemin başka bir yerinin bozulma riski (regresyon) artar.',
      en: 'Without tests: Every bugfix carries high risk of silently breaking adjacent system workflows.'
    },
    weight: 3,
    icon: ShieldCheck
  },
  {
    id: 'licenses_ip',
    title: { tr: '12. Kütüphane Lisansları & Mülkiyet Hakları', en: '12. Third-Party Licenses & IP Assignment' },
    desc: { 
      tr: 'Kullanılan ücretli tema, plugin veya kütüphanelerin lisans anahtarları ve devir sözleşmesi mevcut mu?', 
      en: 'Are commercial library licenses, paid plugin keys, and IP assignment records secured?' 
    },
    impact: {
      tr: 'Erişim yoksa: Müşteriniz ileride lisans ihlali cezası veya üçüncü parti telif talepleriyle karşılaşabilir.',
      en: 'Without license records: Your client may face commercial infringement fines or plugin deactivations.'
    },
    weight: 2,
    icon: AlertCircle
  }
];

const DevirKontrolu = () => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
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

  const [campaignParams, setCampaignParams] = useState({
    utm_source: '',
    utm_campaign: '',
    agency_code: ''
  });

  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSent, setLeadSent] = useState(null);
  const [isSendingLead, setIsSendingLead] = useState(false);

  useEffect(() => {
    document.title = isTr
      ? "Devir Hazırlık Kontrolü (12 Kalem) - Yazılımcı Ayrılık Riski | Trend Master Akademi"
      : "Developer Handover Readiness Audit (12-Point Checklist) | Trend Master Academy";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", isTr
        ? "Yazılımcınız ayrılıyor veya ayrıldı mı? 12 kritik kalemi kontrol edin, devir risk skorunuzu ve eksik envanterinizi 60 saniyede ücretsiz analiz edin."
        : "Is your developer leaving? Audit 12 critical handover checkpoints and calculate codebase takeover risk in 60 seconds."
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://trendmasterakademi.com/devir-kontrolu/');
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

  const handleSelectAnswer = (id, choice) => {
    setAnswers(prev => ({
      ...prev,
      [id]: choice
    }));
  };

  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount === handoverItems.length;

  const calculateScore = () => {
    let score = 0;
    handoverItems.forEach(item => {
      const ans = answers[item.id];
      if (ans === 'no') {
        score += item.weight;
      } else if (ans === 'unsure') {
        score += item.weight * 0.5;
      }
    });
    return Math.round(Math.min(Math.max(score, 5), 100));
  };

  const riskScore = calculateScore();
  const missingItems = handoverItems.filter(item => answers[item.id] === 'no' || answers[item.id] === 'unsure');
  const criticalMissing = missingItems.filter(item => item.weight >= 10);

  const getRiskLevelDetails = (score) => {
    if (score >= 65) {
      return {
        level: isTr ? 'KRİTİK RİSK (SEVİYE 1)' : 'CRITICAL RISK (LEVEL 1)',
        color: 'text-red-400',
        bgColor: 'bg-red-500/10 border-red-500/30',
        summary: isTr
          ? 'Proje devralınamaz aşamada. Temel erişimler veya sırlar kayıp; ayrılan geliştiriciye %100 bağımlılık sürüyor. 24-48 saat içinde acil envanter dondurması gereklidir.'
          : 'Codebase is at high takeover risk. Core infrastructure credentials or secrets are missing. Immediate credential freeze required.',
        sla: isTr ? '0 - 2 Saat Triyaj' : '0 - 2 Hours Triage'
      };
    } else if (score >= 35) {
      return {
        level: isTr ? 'YÜKSEK RİSK (SEVİYE 2)' : 'ELEVATED RISK (LEVEL 2)',
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10 border-amber-500/30',
        summary: isTr
          ? 'Temel kod elinizde olsa da kritik yapılandırmalarda veya ortam değişkenlerinde açıklar var. Devir sürecinin uzman denetiminde toparlanması gerekir.'
          : 'Core repository is accessible, but missing environment configurations or deployment assets pose operational risk.',
        sla: isTr ? '12 - 24 Saat Toparlama' : '12 - 24 Hours Remediation'
      };
    } else {
      return {
        level: isTr ? 'KONTROLLÜ DEVİR (SEVİYE 3)' : 'CONTROLLED HANDOVER (LEVEL 3)',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10 border-emerald-500/30',
        summary: isTr
          ? 'Kritik erişimler ajansınızın kontrolünde. Eksik dokümantasyon ve test süreçleri kısa bir sprint ile tamamlanabilir.'
          : 'Primary administrative credentials are secured. Missing docs or test coverage can be finalized in a brief sprint.',
        sla: isTr ? 'Sprint Bazlı Devir' : 'Sprint-Based Handover'
      };
    }
  };

  const riskDetails = getRiskLevelDetails(riskScore);

  const startChecklist = () => {
    setStep(2);
    if (window.trackEvent) {
      window.trackEvent('handover_check_started', {
        utm_source: campaignParams.utm_source,
        agency_code: campaignParams.agency_code
      });
    }
  };

  const completeChecklist = () => {
    setStep(3);
    if (window.trackEvent) {
      window.trackEvent('handover_check_completed', {
        risk_score: riskScore,
        missing_count: missingItems.length,
        agency_code: campaignParams.agency_code
      });
    }
  };

  const copyReport = () => {
    const text = `=== TMA DEVİR HAZIRLIK DENETİM RAPORU ===\n` +
      `Risk Skoru: %${riskScore} (${riskDetails.level})\n` +
      `Eksik / Şüpheli Kalem Sayısı: ${missingItems.length} / 12\n\n` +
      `EKSİK KALEMLER & RİSKLER:\n` +
      missingItems.map((item, i) => `${i + 1}. ${item.title.tr} (${answers[item.id] === 'no' ? 'YOK' : 'EMİN DEĞİL'})\n   - Risk: ${item.impact.tr}`).join('\n') +
      `\n\n3 ADIMLI TOPARLAMA PROTOKOLÜ:\n` +
      `1. Erişim & Sırların Dondurulması (GitHub, AWS, DNS, Stripe)\n` +
      `2. İzole Sandbox Ortamında Derleme & .env Doğrulaması\n` +
      `3. Bağımsız Dokümantasyon & Eksiksiz Kod Mülkiyet Devri\n\n` +
      `TMA Kriz Masası: +90 534 371 35 73 | info@trendmasterakademi.com`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openWhatsAppDispatch = () => {
    if (window.trackEvent) {
      window.trackEvent('whatsapp_clicked', {
        source: 'handover_dispatch',
        risk_score: riskScore,
        agency_code: campaignParams.agency_code
      });
    }

    const kitBadge = campaignParams.agency_code ? `\n📦 *Kriz Kiti Ajans Kodu:* #${campaignParams.agency_code}` : '';
    const rawText = isTr
      ? `📋 *TMA DEVİR HAZIRLIK KONTROLÜ RAPORU* 📋\n\n` +
        `🔥 *Hesaplanan Devir Riski:* %${riskScore} (${riskDetails.level})\n` +
        `⚠️ *Eksik / Belirsiz Kalem:* ${missingItems.length} / 12 Adet${kitBadge}\n\n` +
        `Ayrılan geliştiriciden kalan projemiz için acil devir analizi ve white-label mühendislik desteği almak istiyoruz.`
      : `📋 *TMA DEVELOPER HANDOVER READINESS REPORT* 📋\n\n` +
        `🔥 *Calculated Takeover Risk:* ${riskScore}% (${riskDetails.level})\n` +
        `⚠️ *Missing Checkpoints:* ${missingItems.length} / 12${kitBadge}\n\n` +
        `We would like to request an emergency handover triage and white-label engineering support for our project.`;

    window.open(`https://wa.me/905343713573?text=${encodeURIComponent(rawText)}`, '_blank');
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setIsSendingLead(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: '64ef0cf5-703c-4cfd-92a4-4f0ba65bb2bb',
          from_name: 'TMA Devir Kontrol Diagnostic',
          subject: `📋 DEVİR KONTROL RAPORU: ${leadName} (%${riskScore} Risk - ${missingItems.length} Eksik)${campaignParams.agency_code ? ` [Kutu #${campaignParams.agency_code}]` : ''}`,
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          riskScore: `%${riskScore}`,
          riskLevel: riskDetails.level,
          missingCount: missingItems.length,
          missingList: missingItems.map(m => `${m.title.tr} [${answers[m.id] === 'no' ? 'YOK' : 'EMİN DEĞİL'}]`).join(', '),
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
          window.trackEvent('handover_report_submitted', {
            risk_score: riskScore,
            agency_code: campaignParams.agency_code
          });
        }
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Lead error:', err);
      setLeadSent('error');
    } finally {
      setIsSendingLead(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 md:px-8 bg-[#080b11] text-slate-200 relative  font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-cyan-500/10 via-amber-500/5 to-transparent blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#1f293d_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none -z-10"></div>

      <div className="max-w-5xl mx-auto">
        
        {/* Eyebrow & Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs sm:text-sm font-mono tracking-widest text-slate-300 uppercase">
              TMA Diagnostic Tool // Handover Readiness v1.0
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              %100 Gizlilik Güvencesi
            </span>
          </div>
        </div>

        {/* STEP 1: Intro Screen */}
        {step === 1 && (
          <div
            
            
            className="space-y-8"
          >
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /> {isTr ? 'GELİŞTİRİCİ AYRILIK KONTROL LİSTESİ' : 'DEVELOPER HANDOVER CHECKLIST'}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {isTr ? 'Yazılımcınız Ayrılıyor mu? Elinizde Gerçekten Ne Var?' : 'Is Your Developer Leaving? What Do You Truly Own?'}
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                {isTr 
                  ? 'Geliştiriciniz projeden çekildiğinde veya ayrılma arifesindeyken; elinizdeki repo, ortam değişkenleri ve sunucu erişimlerinin eksiksiz olup olmadığını 12 kritik maddede test edin.' 
                  : 'Audit whether your repository, secrets, deployment keys, and domain rights are fully transferable before your engineer departs.'}
              </p>
            </div>

            {/* Reassurance Callout Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#111827]/80 border border-cyan-500/30 shadow-xl max-w-2xl mx-auto space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-white">
                    {isTr ? 'Sisteminize Bağlanmaz, Şifre veya Erişim İstemez' : 'Zero System Access, No Passwords Required'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isTr 
                      ? 'Bu araç yalnızca durumunuzu anlamanıza yardımcı bir karar matrisidir. Hiçbir teknik şifre, anahtar veya sunucu bilgisi girmeniz gerekmez.' 
                      : 'This tool is a pure audit matrix. It does not connect to your servers or require any confidential keys.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10 text-center">
                <div className="p-3 rounded-xl bg-white/5">
                  <strong className="block text-white font-mono text-base sm:text-lg">12</strong>
                  <span className="text-[10px] sm:text-xs text-slate-400">Kritik Kontrol</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <strong className="block text-cyan-400 font-mono text-base sm:text-lg">60 sn</strong>
                  <span className="text-[10px] sm:text-xs text-slate-400">Tamamlama</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <strong className="block text-emerald-400 font-mono text-base sm:text-lg">%100</strong>
                  <span className="text-[10px] sm:text-xs text-slate-400">Ücretsiz Teşhis</span>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={startChecklist}
                className="px-10 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-bg-dark font-black text-base sm:text-lg shadow-xl shadow-cyan-500/25 flex items-center gap-3 transition-all transform hover:-translate-y-0.5 cursor-pointer min-h-[48px]"
              >
                <span>{isTr ? 'Devir Kontrolünü Başlat (12 Soru)' : 'Start Handover Audit (12 Items)'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: 12-Item Checklist */}
        {step === 2 && (
          <div
            
            
            className="space-y-8"
          >
            {/* Sticky Progress Header */}
            <div className="sticky top-14 sm:top-20 z-30 p-4 sm:p-5 rounded-2xl bg-[#080b11]/95 backdrop-blur-xl border border-cyan-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.85)] flex flex-wrap items-center justify-between gap-4 transition-all">
              <div>
                <span className="text-[10px] sm:text-xs font-mono uppercase text-cyan-400 font-bold block mb-0.5">
                  {isTr ? 'Adım 2 / 2 · Canlı İlerleme' : 'Step 2 / 2 · Live Progress'}
                </span>
                <h2 className="text-base sm:text-xl font-bold text-white leading-tight">
                  {isTr ? '12 Kalemlik Devir Kontrol Listesi' : '12-Point Handover Audit Checklist'}
                </h2>
                <span className="text-xs font-mono text-slate-300 block mt-1 font-semibold">
                  <span className="text-cyan-400 font-bold">{answeredCount}</span> / {handoverItems.length} {isTr ? 'Kalem Yanıtlandı' : 'Answered'}
                  {answeredCount === handoverItems.length && (
                    <span className="text-emerald-400 ml-2 font-bold">{isTr ? '✓ Hazır' : '✓ Ready'}</span>
                  )}
                </span>
              </div>
              <div className="w-full sm:w-64 h-3 bg-black/50 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300 shadow-[0_0_12px_rgba(0,229,255,0.5)]"
                  style={{ width: `${(answeredCount / handoverItems.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Questions Grid */}
            <div className="space-y-6">
              {handoverItems.map((item) => {
                const IconComponent = item.icon;
                const currentAnswer = answers[item.id];

                return (
                  <div 
                    key={item.id}
                    className="p-6 sm:p-7 rounded-3xl bg-[#111827]/85 border border-white/10 shadow-xl space-y-4 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex-shrink-0 mt-0.5">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-white">
                            {item.title[isTr ? 'tr' : 'en']}
                          </h3>
                          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                            {isTr ? `Ağırlık: ${item.weight} Puan` : `Weight: ${item.weight} Pts`}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {item.desc[isTr ? 'tr' : 'en']}
                        </p>
                      </div>
                    </div>

                    {/* Choices Options */}
                    <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleSelectAnswer(item.id, 'yes')}
                        className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[48px] ${
                          currentAnswer === 'yes'
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{isTr ? 'Evet, Var' : 'Yes, Secured'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectAnswer(item.id, 'unsure')}
                        className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[48px] ${
                          currentAnswer === 'unsure'
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <HelpCircle className="w-4 h-4 text-amber-400" />
                        <span>{isTr ? 'Emin Değilim' : 'Unsure'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectAnswer(item.id, 'no')}
                        className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[48px] ${
                          currentAnswer === 'no'
                            ? 'bg-red-500/20 border-red-400 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span>{isTr ? 'Hayır, Yok' : 'No / Missing'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-sm flex items-center gap-2 cursor-pointer min-h-[48px]"
              >
                <ArrowLeft className="w-4 h-4" /> {isTr ? 'Geri' : 'Back'}
              </button>

              <button
                type="button"
                disabled={!isAllAnswered}
                onClick={completeChecklist}
                className={`px-8 py-4 rounded-2xl font-black text-sm sm:text-base tracking-wide flex items-center gap-3 transition-all cursor-pointer min-h-[48px] ${
                  isAllAnswered
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-bg-dark shadow-lg shadow-cyan-500/25 hover:opacity-95 transform hover:-translate-y-0.5'
                    : 'bg-white/10 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>{isTr ? 'Devir Raporunu & Teşhisi Üret' : 'Generate Handover Report'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Results, Missing Items & Action Protocol */}
        {step === 3 && (
          <div
            
            
            className="space-y-8"
          >
            {/* Header Result Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#111827] via-[#0d131f] to-[#151f33] border border-cyan-500/30 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                    <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                      {isTr ? 'DEVİR HAZIRLIK ANALİZ RAPORU' : 'HANDOVER READINESS BLUEPRINT'}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
                    {riskDetails.level}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-xl leading-relaxed">
                    {riskDetails.summary}
                  </p>
                </div>

                {/* Score Rating Gauge */}
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-mono uppercase text-slate-400 block">{isTr ? 'Devir Riski' : 'Takeover Risk'}</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${riskDetails.bgColor} ${riskDetails.color}`}>
                      {riskScore >= 65 ? 'YÜKSEK TEHLİKE' : riskScore >= 35 ? 'DİKKAT GEREKTİRİR' : 'GÜVENLİ'}
                    </span>
                  </div>
                  <div className="w-20 h-20 rounded-2xl bg-black/40 border border-cyan-500/40 flex flex-col items-center justify-center shadow-inner">
                    <span className="text-3xl font-black font-mono text-white">%{riskScore}</span>
                    <span className="text-[9px] font-mono text-cyan-400">RISK</span>
                  </div>
                </div>
              </div>

              {/* Metric Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs sm:text-sm text-slate-400 block mb-1">{isTr ? 'Eksik / Belirsiz Kalem' : 'Missing Checkpoints'}</span>
                  <strong className="text-base sm:text-lg font-bold text-amber-400">{missingItems.length} / 12 {isTr ? 'Kalem' : 'Items'}</strong>
                  <span className="text-xs text-slate-400 block mt-1">{criticalMissing.length} {isTr ? 'kritik erişim kalemi' : 'critical items'}</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-cyan-500/30 bg-cyan-500/5">
                  <span className="text-xs sm:text-sm text-cyan-300 font-bold block mb-1">{isTr ? 'İlk Teşhis & Triyaj' : 'Initial Triage'}</span>
                  <strong className="text-base sm:text-lg font-bold text-emerald-400 font-mono">{isTr ? 'Ücretsiz' : 'Free'}</strong>
                  <span className="text-xs text-cyan-400/80 block mt-1">{isTr ? 'Sonraki adımlar kapsama göre belirlenir' : 'Next steps scoped per project'}</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs sm:text-sm text-slate-400 block mb-1">{isTr ? 'Önerilen Devir SLA' : 'Recommended SLA'}</span>
                  <strong className="text-base sm:text-lg font-bold text-cyan-400">{riskDetails.sla}</strong>
                  <span className="text-xs text-slate-400 block mt-1">{isTr ? 'İzole repo testi & devir' : 'Isolated repo testing'}</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs sm:text-sm text-slate-400 block mb-1">{isTr ? 'Çalışma Güvencesi' : 'TMA Guarantee'}</span>
                  <strong className="text-base sm:text-lg font-bold text-emerald-400">%100 White-Label</strong>
                  <span className="text-xs text-slate-400 block mt-1">{isTr ? 'Resmi NDA güvencesiyle' : 'Under mutual NDA'}</span>
                </div>
              </div>
            </div>

            {/* Missing Items Breakdown List */}
            {missingItems.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-red-500/20 space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {isTr ? 'Eksik veya Belirsiz Tespit Edilen Kalemler' : 'Identified Missing or Unsure Checkpoints'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400">
                      {isTr ? 'Aşağıdaki kalemlerin eksik olması durumunda karşılaşacağınız olası teknik ve operasyonel riskler:' : 'Operational risks if these checkpoints remain unverified:'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={copyReport}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? (isTr ? 'Kopyalandı!' : 'Copied!') : (isTr ? 'Raporu Kopyala' : 'Copy Blueprint')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {missingItems.map(item => (
                    <div key={item.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-white text-sm sm:text-base font-bold">{item.title[isTr ? 'tr' : 'en']}</strong>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          answers[item.id] === 'no' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {answers[item.id] === 'no' ? (isTr ? 'YOK' : 'MISSING') : (isTr ? 'EMİN DEĞİL' : 'UNSURE')}
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed border-l-2 border-red-500/50 pl-3">
                        <strong className="text-red-400 block">{isTr ? 'Bu olmazsa ne olur?' : 'Impact if missing:'}</strong>
                        {item.impact[isTr ? 'tr' : 'en']}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3-Step Recovery Recipe */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-white/10 space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {isTr ? 'TMA 3 Adımlı Devir Toparlama Reçetesi' : 'TMA 3-Step Codebase Recovery Protocol'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    {isTr ? 'ADIM 01 (0 - 24 Saat)' : 'STEP 01 (0 - 24 Hours)'}
                  </span>
                  <h4 className="text-base font-bold text-white">
                    {isTr ? 'Erişim Dondurma & İzolasyon' : 'Credential Freeze & Isolation'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isTr 
                      ? 'Git repo, DNS, sunucu ve ödeme paneli yönetici yetkileri ajansınız adına devralınır; ayrılan geliştiricinin kişisel hesap bağı koparılır.' 
                      : 'Master administrative access is transferred to your agency domain; developer personal card bindings are severed.'}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30">
                    {isTr ? 'ADIM 02 (24 - 48 Saat)' : 'STEP 02 (24 - 48 Hours)'}
                  </span>
                  <h4 className="text-base font-bold text-white">
                    {isTr ? 'Sandbox Derleme & .env Doğrulama' : 'Sandbox Build & Secrets Audit'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isTr 
                      ? 'Kod izole bir staging sunucusunda sıfırdan derlenir; eksik ortam değişkenleri ve API bağlantıları canlıya dokunmadan test edilir.' 
                      : 'Code is spun up in an isolated staging sandbox; missing env variables and API endpoints are verified.'}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {isTr ? 'ADIM 03 (48 - 72 Saat)' : 'STEP 03 (48 - 72 Hours)'}
                  </span>
                  <h4 className="text-base font-bold text-white">
                    {isTr ? 'Temiz Devir & Dokümantasyon' : 'Clean Handover & Docs'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isTr 
                      ? 'Eksik kurulum rehberi (README), OpenAPI şeması ve test suite tamamlanarak ajansınıza bağımsız çalışabilir biçimde teslim edilir.' 
                      : 'Setup guides, API schemas, and deployment documentation are finalized and delivered with full IP ownership.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Email Lead Capture Card */}
            <div className="p-8 rounded-3xl bg-[#0e1626] border border-cyan-500/30 text-left space-y-5 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">
                      {isTr ? 'Bu Devir Raporunu & Eksik Kalem Listesini E-Postama Gönder' : 'Send This Handover Audit Report to My Email'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {isTr ? 'Ajans içi değerlendirme ve ayrılan ekiple paylaşım için hazır teknik liste formatında iletilir.' : 'Sent in a ready-to-share checklist format for your agency stakeholders.'}
                    </p>
                  </div>
                </div>
              </div>

              {leadSent === 'success' ? (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-sm font-bold">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                  <span>{isTr ? 'Devir raporu talebiniz başarıyla kaydedildi! Ekibimiz analizi hazırlayıp iletecektir.' : 'Handover report request logged successfully! Our SWAT engineers will deliver your audit.'}</span>
                </div>
              ) : leadSent === 'error' ? (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <div className="flex items-center gap-3 text-amber-300 text-sm font-bold">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />
                    <span>{isTr ? 'Ağ kesintisi nedeniyle otomatik iletilemedi.' : 'Network interruption during auto-dispatch.'}</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {isTr ? 'Raporunuz hazır. Aşağıdaki butona tıklayarak WhatsApp üzerinden doğrudan talep edebilirsiniz:' : 'Your audit is ready. Request directly via WhatsApp:'}
                  </p>
                  <button
                    type="button"
                    onClick={openWhatsAppDispatch}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-bg-dark font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>{isTr ? 'WhatsApp ile Raporu Talep Et →' : 'Request Report via WhatsApp →'}</span>
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={handleLeadSubmit}
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
                    placeholder={isTr ? 'Kurumsal E-Posta Adresiniz' : 'Corporate Email Address'}
                    value={leadEmail}
                    onChange={e => setLeadEmail(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder={isTr ? 'WhatsApp / Telefon (Opsiyonel)' : 'Phone (Optional)'}
                    value={leadPhone}
                    onChange={e => setLeadPhone(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      disabled={isSendingLead}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-bg-dark font-black text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
                    >
                      {isSendingLead ? (isTr ? 'İletiliyor...' : 'Sending...') : (isTr ? 'Raporu & Kontrol Listesini E-Postama Gönder →' : 'Send Blueprint to My Email →')}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Direct WhatsApp Call to Action */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-transparent border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-lg sm:text-xl font-bold text-white">
                  {isTr ? 'Yazılımcınız Ayrılmadan Önce Devir Sürecini Birlikte Yönetelim' : 'Let’s Supervise the Handover Before Your Dev Leaves'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  {isTr ? 'Geliştiricinizle aranıza girmeden, %100 White-Label ve resmi NDA altında teknik denetimi yürütüyoruz.' : 'We audit codebase completeness invisibly under strict mutual NDA.'}
                </p>
              </div>
              <button
                type="button"
                onClick={openWhatsAppDispatch}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-bg-dark font-black text-sm sm:text-base flex items-center gap-2 whitespace-nowrap shadow-xl shadow-emerald-500/25 cursor-pointer transform hover:-translate-y-0.5 transition-all min-h-[48px]"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{isTr ? 'WhatsApp’tan Devir Destek Masası' : 'Handover SWAT on WhatsApp'}</span>
              </button>
            </div>

            {/* Restart Button */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setAnswers({});
                  setLeadSent(null);
                }}
                className="text-xs sm:text-sm text-slate-400 hover:text-white underline cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isTr ? 'Kontrolü Baştan Başlat' : 'Restart Audit'}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default DevirKontrolu;
