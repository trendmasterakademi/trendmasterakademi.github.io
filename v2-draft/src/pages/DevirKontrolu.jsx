import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Copy, Check, 
  ArrowRight, ArrowLeft, RefreshCw, Mail, PhoneCall,
  Key, Lock, Server, Database, Globe, CreditCard, GitBranch,
  Terminal, FileText, Layers, AlertCircle, HelpCircle, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCalendlyUrl } from '../utils/calendly';
import { setPageSeo } from '../utils/pageTitle';
import { isTurkish } from '../i18n';
import { handoverAuditH1 } from '../data/pageH1Data';
import { tmaiData, tmaiYollar, tmaiAraclar } from '../data/tmaiData';
import { slaTiers } from '../data/slaData';

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
  const isTr = isTurkish(i18n);

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [copied, setCopied] = useState(false);
  const [isAiProject, setIsAiProject] = useState(false);

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
    setPageSeo(isTr ? '/devir-kontrolu/' : '/handover-audit/', isTr ? 'tr' : 'en');

    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('ai') === '1') {
        setIsAiProject(true);
      }
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
        color: 'text-[var(--tint-danger-ink)]',
        bgColor: 'bg-[var(--tint-danger-bg)] border-[var(--tint-danger-rule)]',
        summary: isTr
          ? 'Proje devralınamaz aşamada. Temel erişimler veya sırlar kayıp; ayrılan geliştiriciye %100 bağımlılık sürüyor. 24-48 saat içinde acil envanter dondurması gereklidir.'
          : 'Codebase is at high takeover risk. Core infrastructure credentials or secrets are missing. Immediate credential freeze required.',
        sevLevel: 'SEV-2'
      };
    } else if (score >= 35) {
      return {
        level: isTr ? 'YÜKSEK RİSK (SEVİYE 2)' : 'ELEVATED RISK (LEVEL 2)',
        color: 'text-[var(--tint-warn-ink)]',
        bgColor: 'bg-[var(--tint-warn-bg)] border-[var(--tint-warn-rule)]',
        summary: isTr
          ? 'Temel kod elinizde olsa da kritik yapılandırmalarda veya ortam değişkenlerinde açıklar var. Devir sürecinin uzman denetiminde toparlanması gerekir.'
          : 'Core repository is accessible, but missing environment configurations or deployment assets pose operational risk.',
        sevLevel: 'SEV-3'
      };
    } else {
      return {
        level: isTr ? 'KONTROLLÜ DEVİR (SEVİYE 3)' : 'CONTROLLED HANDOVER (LEVEL 3)',
        color: 'text-[var(--tint-ok-ink)]',
        bgColor: 'bg-[var(--tint-ok-bg)] border-[var(--tint-ok-rule)]',
        summary: isTr
          ? 'Kritik erişimler ajansınızın kontrolünde. Eksik dokümantasyon ve test süreçleri kısa bir sprint ile tamamlanabilir.'
          : 'Primary administrative credentials are secured. Missing docs or test coverage can be finalized in a brief sprint.',
        sevLevel: 'SEV-3'
      };
    }
  };

  const riskDetails = getRiskLevelDetails(riskScore);
  const recommendedTier = slaTiers.find(t => t.level === riskDetails.sevLevel);

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
    const aiLine = isAiProject ? `\n${tmaiAraclar.brifSatiri[isTr ? 'tr' : 'en']}\n` : '';
    const maddeler = missingItems.map((item) => `• ${item.title[isTr ? 'tr' : 'en']} (${answers[item.id] === 'no' ? (isTr ? 'YOK' : 'MISSING') : (isTr ? 'EMİN DEĞİL' : 'UNSURE')})\n   - Risk: ${item.impact[isTr ? 'tr' : 'en']}`).join('\n');
    const text = isTr
      ? `=== TMA DEVİR HAZIRLIK DENETİM RAPORU ===\n` +
        `Risk Skoru: %${riskScore} (${riskDetails.level})\n` +
        `Eksik / Şüpheli Kalem Sayısı: ${missingItems.length} / 12\n` +
        aiLine +
        `\nEKSİK KALEMLER & RİSKLER:\n` +
        maddeler +
        `\n\n3 ADIMLI TOPARLAMA PROTOKOLÜ:\n` +
        `1. Erişim & Sırların Dondurulması (GitHub, AWS, DNS, Stripe)\n` +
        `2. İzole Sandbox Ortamında Derleme & .env Doğrulaması\n` +
        `3. Bağımsız Dokümantasyon & Eksiksiz Kod Mülkiyet Devri\n\n` +
        `TMA Kriz Masası: +90 534 371 35 73 | info@trendmasterakademi.com`
      : `=== TMA HANDOVER READINESS AUDIT REPORT ===\n` +
        `Risk score: ${riskScore}% (${riskDetails.level})\n` +
        `Missing / uncertain items: ${missingItems.length} / 12\n` +
        aiLine +
        `\nMISSING ITEMS & RISKS:\n` +
        maddeler +
        `\n\n3-STEP RECOVERY PROTOCOL:\n` +
        `1. Freeze access and secrets (GitHub, AWS, DNS, Stripe)\n` +
        `2. Build in an isolated sandbox and verify the .env\n` +
        `3. Independent documentation and full code ownership transfer\n\n` +
        `TMA Response Desk: +90 534 371 35 73 | info@trendmasterakademi.com`;

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
    const aiBadge = isAiProject ? `\n🤖 *${tmaiAraclar.brifSatiri[isTr ? 'tr' : 'en']}*` : '';
    const rawText = isTr
      ? `📋 *TMA DEVİR HAZIRLIK KONTROLÜ RAPORU* 📋\n\n` +
        `🔥 *Hesaplanan Devir Riski:* %${riskScore} (${riskDetails.level})\n` +
        `⚠️ *Eksik / Belirsiz Kalem:* ${missingItems.length} / 12 Adet${kitBadge}${aiBadge}\n\n` +
        `Ayrılan geliştiriciden kalan projemiz için acil devir analizi ve white-label mühendislik desteği almak istiyoruz.`
      : `📋 *TMA DEVELOPER HANDOVER READINESS REPORT* 📋\n\n` +
        `🔥 *Calculated Takeover Risk:* ${riskScore}% (${riskDetails.level})\n` +
        `⚠️ *Missing Checkpoints:* ${missingItems.length} / 12${kitBadge}${aiBadge}\n\n` +
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
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 md:px-8 bg-[var(--paper)] text-[var(--ink)] relative font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* STEP 1: Eyebrow & Status Bar */}
        {step === 1 && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[var(--rule)]">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--sev-ok)]"></span>
              <span lang="en" className="text-xs sm:text-sm font-mono tracking-widest text-[var(--ink-3)] uppercase">
                TMA Diagnostic Tool // Handover Readiness v1.0
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-[var(--surface)] text-[var(--ink-3)] border border-[var(--rule)]">
                {isTr ? '%100 Gizlilik Güvencesi' : '100% Confidentiality Guarantee'}
              </span>
            </div>
          </div>
        )}

        {/* STEP 1: Intro Screen */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-[var(--accent-wash)] border border-[var(--accent)] text-[var(--accent)] text-xs font-mono font-semibold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /> {isTr ? 'GELİŞTİRİCİ AYRILIK KONTROL LİSTESİ' : 'DEVELOPER HANDOVER CHECKLIST'}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold font-serif text-[var(--ink)] tracking-tight leading-tight">
                {handoverAuditH1[isTr ? 'tr' : 'en']}
              </h1>

              <p className="text-[var(--ink-3)] text-base sm:text-lg leading-relaxed">
                {isTr 
                  ? 'Geliştiriciniz projeden çekildiğinde veya ayrılma arifesindeyken; elinizdeki repo, ortam değişkenleri ve sunucu erişimlerinin eksiksiz olup olmadığını 12 kritik maddede test edin.' 
                  : 'Audit whether your repository, secrets, deployment keys, and domain rights are fully transferable before your engineer departs.'}
              </p>
            </div>

            {/* Reassurance Callout Card */}
            <div className="p-6 sm:p-8 rounded bg-[var(--surface)] border border-[var(--rule)] shadow-sm max-w-2xl mx-auto space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded bg-[var(--accent-wash)] text-[var(--accent)] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-base font-semibold font-serif text-[var(--ink)]">
                    {isTr ? 'Sisteminize Bağlanmaz, Şifre veya Erişim İstemez' : 'Zero System Access, No Passwords Required'}
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--ink-3)] leading-relaxed">
                    {isTr 
                      ? 'Bu araç yalnızca durumunuzu anlamanıza yardımcı bir karar matrisidir. Hiçbir teknik şifre, anahtar veya sunucu bilgisi girmeniz gerekmez.' 
                      : 'This tool is a pure audit matrix. It does not connect to your servers or require any confidential keys.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[var(--rule)] text-center">
                <div className="p-3 rounded bg-[var(--paper)] border border-[var(--rule)]">
                  <strong className="block text-[var(--ink)] font-mono text-base sm:text-lg">12</strong>
                  <span className="text-xs text-[var(--ink-3)]">{isTr ? 'Kritik Kontrol' : 'Critical Checks'}</span>
                </div>
                <div className="p-3 rounded bg-[var(--paper)] border border-[var(--rule)]">
                  <strong className="block text-[var(--accent)] font-mono text-base sm:text-lg">60 sn</strong>
                  <span className="text-xs text-[var(--ink-3)]">{isTr ? 'Tamamlama' : 'Completion'}</span>
                </div>
                <div className="p-3 rounded bg-[var(--paper)] border border-[var(--rule)]">
                  <strong className="block text-[var(--tint-ok-ink)] font-mono text-base sm:text-lg">%100</strong>
                  <span className="text-xs text-[var(--ink-3)]">
                    {isTr ? 'Ücretsiz Teşhis' : 'Free Diagnosis'}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Option Checkbox */}
            <div className="max-w-2xl mx-auto pt-2">
              <label className="flex items-center gap-3 p-4 rounded bg-[var(--surface)] border border-[var(--rule)] cursor-pointer hover:border-[var(--accent)] transition-colors">
                <input
                  type="checkbox"
                  checked={isAiProject}
                  onChange={(e) => setIsAiProject(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--rule)] text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                />
                <span className="text-sm sm:text-base font-medium text-[var(--ink)]">
                  {tmaiAraclar.secenek[isTr ? 'tr' : 'en']}
                </span>
              </label>
            </div>

            {/* Start Button */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={startChecklist}
                className="px-10 py-4 rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--on-accent)] font-semibold text-base sm:text-lg shadow-sm flex items-center gap-3 transition-colors cursor-pointer min-h-[44px]"
              >
                <span>{isTr ? 'Devir Kontrolünü Başlat (12 Soru)' : 'Start Handover Audit (12 Items)'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: 12-Item Checklist */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Sticky Unified Diagnostic & Progress Header */}
            <div className="sticky top-[78px] sm:top-[92px] md:top-[100px] z-40 p-4 sm:p-5 rounded bg-[var(--surface)] border border-[var(--rule)] shadow-sm space-y-3.5 transition-all">
              {/* Eyebrow & Status Bar */}
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--rule)] text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--sev-ok)]"></span>
                  <span lang="en" className="text-xs text-[var(--ink-3)] uppercase tracking-wider">
                    TMA Diagnostic Tool // Handover Readiness v1.0
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[var(--surface)] text-[var(--ink-3)] border border-[var(--rule)]">
                  {isTr ? '%100 Gizlilik Güvencesi' : '100% Confidentiality Guarantee'}
                </span>
              </div>

              {/* Progress & Title Row */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono uppercase text-[var(--accent)] font-semibold block">
                    {isTr ? 'Adım 2 / 2 · Canlı İlerleme' : 'Step 2 / 2 · Live Progress'}
                  </span>
                  <h2 className="text-sm sm:text-lg md:text-xl font-semibold font-serif text-[var(--ink)] leading-tight">
                    {isTr ? '12 Kalemlik Devir Kontrol Listesi' : '12-Point Handover Audit Checklist'}
                  </h2>
                  <span className="text-xs font-mono text-[var(--ink-3)] block mt-0.5 font-semibold">
                    <span className="text-[var(--accent)] font-bold">{answeredCount}</span> / {handoverItems.length} {isTr ? 'Kalem Yanıtlandı' : 'Answered'}
                    {answeredCount === handoverItems.length && (
                      <span className="text-[var(--tint-ok-ink)] ml-2 font-semibold">{isTr ? '✓ Analiz Hazır' : '✓ Ready'}</span>
                    )}
                  </span>
                </div>
                <div className="w-full sm:w-64 h-2.5 sm:h-3 bg-[var(--paper)] rounded overflow-hidden border border-[var(--rule)] flex-shrink-0">
                  <div 
                    className="h-full bg-[var(--accent)] transition-all duration-300"
                    style={{ width: `${(answeredCount / handoverItems.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* AI Option Checkbox */}
            <label className="flex items-center gap-3 p-4 rounded bg-[var(--surface)] border border-[var(--rule)] cursor-pointer hover:border-[var(--accent)] transition-colors">
              <input
                type="checkbox"
                checked={isAiProject}
                onChange={(e) => setIsAiProject(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--rule)] text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
              />
              <span className="text-sm sm:text-base font-medium text-[var(--ink)]">
                {tmaiAraclar.secenek[isTr ? 'tr' : 'en']}
              </span>
            </label>

            {/* Questions Grid */}
            <div className="space-y-6">
              {handoverItems.map((item) => {
                const IconComponent = item.icon;
                const currentAnswer = answers[item.id];

                return (
                  <div 
                    key={item.id}
                    className="p-6 sm:p-7 rounded bg-[var(--surface)] border border-[var(--rule)] shadow-sm space-y-4 hover:border-[var(--ink-3)] transition-all"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="p-3 rounded bg-[var(--accent-wash)] text-[var(--accent)] border border-[var(--accent)] flex-shrink-0 mt-0.5">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h3 className="text-base sm:text-lg font-semibold font-serif text-[var(--ink)]">
                            {item.title[isTr ? 'tr' : 'en']}
                          </h3>
                          <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[var(--paper)] text-[var(--ink-3)] border border-[var(--rule)]">
                            {isTr ? `Ağırlık: ${item.weight} Puan` : `Weight: ${item.weight} Pts`}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[var(--ink-3)] leading-relaxed">
                          {item.desc[isTr ? 'tr' : 'en']}
                        </p>
                      </div>
                    </div>

                    {/* Choices Options */}
                    <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleSelectAnswer(item.id, 'yes')}
                        className={`py-3 px-3 rounded border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[44px] ${
                          currentAnswer === 'yes'
                            ? 'bg-[var(--tint-ok-bg)] border-[var(--tint-ok-rule)] text-[var(--tint-ok-ink)] shadow-sm'
                            : 'bg-[var(--paper)] border-[var(--rule)] text-[var(--ink)] hover:border-[var(--ink-3)]'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-[var(--tint-ok-ink)]" />
                        <span>{isTr ? 'Evet, Var' : 'Yes, Secured'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectAnswer(item.id, 'unsure')}
                        className={`py-3 px-3 rounded border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[44px] ${
                          currentAnswer === 'unsure'
                            ? 'bg-[var(--tint-warn-bg)] border-[var(--tint-warn-rule)] text-[var(--tint-warn-ink)] shadow-sm'
                            : 'bg-[var(--paper)] border-[var(--rule)] text-[var(--ink)] hover:border-[var(--ink-3)]'
                        }`}
                      >
                        <HelpCircle className="w-4 h-4 text-[var(--tint-warn-ink)]" />
                        <span>{isTr ? 'Emin Değilim' : 'Unsure'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectAnswer(item.id, 'no')}
                        className={`py-3 px-3 rounded border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[44px] ${
                          currentAnswer === 'no'
                            ? 'bg-[var(--tint-danger-bg)] border-[var(--tint-danger-rule)] text-[var(--tint-danger-ink)] shadow-sm'
                            : 'bg-[var(--paper)] border-[var(--rule)] text-[var(--ink)] hover:border-[var(--ink-3)]'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4 text-[var(--tint-danger-ink)]" />
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
                className="px-6 py-3.5 rounded bg-[var(--surface)] hover:bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] font-medium text-sm flex items-center gap-2 cursor-pointer min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4" /> {isTr ? 'Geri' : 'Back'}
              </button>

              <button
                type="button"
                disabled={!isAllAnswered}
                onClick={completeChecklist}
                className={`px-8 py-3.5 rounded font-semibold text-sm sm:text-base tracking-wide flex items-center gap-3 transition-colors cursor-pointer min-h-[44px] ${
                  isAllAnswered
                    ? 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--on-accent)] shadow-sm'
                    : 'bg-[var(--rule)] text-[var(--ink-3)] cursor-not-allowed'
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
          <div className="space-y-8">
            {/* Header Result Card */}
            <div className="p-6 sm:p-8 rounded bg-[var(--surface)] border border-[var(--rule)] shadow-sm relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[var(--rule)]">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]"></span>
                    <span className="text-xs font-mono font-semibold tracking-widest text-[var(--accent)] uppercase">
                      {isTr ? 'DEVİR HAZIRLIK ANALİZ RAPORU' : 'HANDOVER READINESS BLUEPRINT'}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold font-serif text-[var(--ink)]">
                    {riskDetails.level}
                  </h2>
                  <p className="text-sm sm:text-base text-[var(--ink-3)] mt-2 max-w-xl leading-relaxed">
                    {riskDetails.summary}
                  </p>
                </div>

                {/* Score Rating Gauge */}
                <div className="flex items-center gap-4 bg-[var(--paper)] p-4 rounded border border-[var(--rule)] flex-shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-mono uppercase text-[var(--ink-3)] block">{isTr ? 'Devir Riski' : 'Takeover Risk'}</span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${riskDetails.bgColor} ${riskDetails.color}`}>
                      {riskScore >= 65 ? 'YÜKSEK TEHLİKE' : riskScore >= 35 ? 'DİKKAT GEREKTİRİR' : 'GÜVENLİ'}
                    </span>
                  </div>
                  <div className="w-20 h-20 rounded bg-[var(--surface)] border border-[var(--rule)] flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold font-mono text-[var(--ink)]">%{riskScore}</span>
                    <span className="text-xs font-mono text-[var(--accent)]">RISK</span>
                  </div>
                </div>
              </div>

              {/* Metric Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
                <div className="p-5 rounded bg-[var(--paper)] border border-[var(--rule)]">
                  <span className="text-xs sm:text-sm text-[var(--ink-3)] block mb-1">{isTr ? 'Eksik / Belirsiz Kalem' : 'Missing Checkpoints'}</span>
                  <strong className="text-base sm:text-lg font-semibold text-[var(--tint-warn-ink)]">{missingItems.length} / 12 {isTr ? 'Kalem' : 'Items'}</strong>
                  <span className="text-xs text-[var(--ink-3)] block mt-1">{criticalMissing.length} {isTr ? 'kritik erişim kalemi' : 'critical items'}</span>
                </div>
                <div className="p-5 rounded bg-[var(--paper)] border border-[var(--rule)]">
                  <span className="text-xs sm:text-sm text-[var(--ink)] font-semibold block mb-1">{isTr ? 'İlk Teşhis & Triyaj' : 'Initial Triage'}</span>
                  <strong className="text-base sm:text-lg font-semibold text-[var(--tint-ok-ink)] font-mono">{isTr ? 'Ücretsiz' : 'Free'}</strong>
                  <span className="text-xs text-[var(--ink-3)] block mt-1">{isTr ? 'Sonraki adımlar kapsama göre belirlenir' : 'Next steps scoped per project'}</span>
                </div>
                <Link
                  to="/sla/"
                  className="block p-5 rounded bg-[var(--paper)] border border-[var(--rule)] transition-colors hover:border-[var(--accent)]"
                >
                  <span className="text-xs sm:text-sm text-[var(--ink-3)] block mb-1">{isTr ? 'Önerilen Devir SLA' : 'Recommended SLA'}</span>
                  <strong className="text-base sm:text-lg font-semibold text-[var(--accent)]">
                    {recommendedTier ? `${recommendedTier.level} · ${recommendedTier.mtta[isTr ? 'tr' : 'en']}` : ''}
                  </strong>
                  <span className="text-xs text-[var(--ink-3)] block mt-1">
                    {isTr ? "İlk yanıt, SLA'ya göre" : 'First response, per the SLA'}
                  </span>
                </Link>
                <div className="p-5 rounded bg-[var(--paper)] border border-[var(--rule)]">
                  <span className="text-xs sm:text-sm text-[var(--ink-3)] block mb-1">{isTr ? 'Çalışma Güvencesi' : 'TMA Guarantee'}</span>
                  <strong className="text-base sm:text-lg font-semibold text-[var(--tint-ok-ink)]">%100 White-Label</strong>
                  <span className="text-xs text-[var(--ink-3)] block mt-1">{isTr ? 'Resmi NDA güvencesiyle' : 'Under mutual NDA'}</span>
                </div>
              </div>
            </div>

            {/* AI Takeover Block (tmai) */}
            {isAiProject && (
              <div className="p-6 sm:p-8 rounded bg-[var(--surface)] border border-[var(--rule)] space-y-4 shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-semibold tracking-wider text-[var(--accent)]">
                    {tmaiAraclar.devirBlok.baslik[isTr ? 'tr' : 'en']}
                  </span>
                  <p className="text-sm sm:text-base text-[var(--ink-2)] leading-relaxed">
                    {tmaiAraclar.devirBlok.metin[isTr ? 'tr' : 'en']}
                  </p>
                </div>
                <ul className="space-y-2 pt-2">
                  {tmaiData[isTr ? 'tr' : 'en'].kontroller.maddeler.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-[var(--ink)]">
                      <span className="text-[var(--accent)] font-mono font-bold mt-0.5">•</span>
                      <span>{m.baslik}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <Link
                    to={tmaiYollar[isTr ? 'tr' : 'en']}
                    className="text-sm font-semibold font-mono text-[var(--accent)] hover:underline inline-flex items-center gap-1.5 min-h-[44px]"
                  >
                    <span>{tmaiAraclar.devirBlok.linkEtiketi[isTr ? 'tr' : 'en']}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* Missing Items Breakdown List */}
            {missingItems.length > 0 && (
              <div className="p-6 sm:p-8 rounded bg-[var(--surface)] border border-[var(--rule)] space-y-6 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[var(--rule)] pb-4">
                  <div>
                    <h3 className="text-xl font-semibold font-serif text-[var(--ink)]">
                      {isTr ? 'Eksik veya Belirsiz Tespit Edilen Kalemler' : 'Identified Missing or Unsure Checkpoints'}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--ink-3)]">
                      {isTr ? 'Aşağıdaki kalemlerin eksik olması durumunda karşılaşacağınız olası teknik ve operasyonel riskler:' : 'Operational risks if these checkpoints remain unverified:'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={copyReport}
                    className="px-4 py-2.5 rounded bg-[var(--paper)] hover:bg-[var(--surface)] border border-[var(--rule)] text-xs sm:text-sm font-semibold text-[var(--ink)] flex items-center gap-2 transition-colors cursor-pointer min-h-[44px]"
                  >
                    {copied ? <Check className="w-4 h-4 text-[var(--tint-ok-ink)]" /> : <Copy className="w-4 h-4 text-[var(--ink-3)]" />}
                    <span>{copied ? (isTr ? 'Kopyalandı!' : 'Copied!') : (isTr ? 'Raporu Kopyala' : 'Copy Blueprint')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {missingItems.map(item => (
                    <div key={item.id} className="p-5 rounded bg-[var(--paper)] border border-[var(--rule)] space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-[var(--ink)] text-sm sm:text-base font-semibold font-serif">{item.title[isTr ? 'tr' : 'en']}</strong>
                        <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                          answers[item.id] === 'no' ? 'bg-[var(--tint-danger-bg)] text-[var(--tint-danger-ink)] border border-[var(--tint-danger-rule)]' : 'bg-[var(--tint-warn-bg)] text-[var(--tint-warn-ink)] border border-[var(--tint-warn-rule)]'
                        }`}>
                          {answers[item.id] === 'no' ? (isTr ? 'YOK' : 'MISSING') : (isTr ? 'EMİN DEĞİL' : 'UNSURE')}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--ink-3)] leading-relaxed border-l-2 border-[var(--accent)] pl-3">
                        <strong className="text-[var(--accent)] block">{isTr ? 'Bu olmazsa ne olur?' : 'Impact if missing:'}</strong>
                        {item.impact[isTr ? 'tr' : 'en']}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3-Step Recovery Recipe */}
            <div className="p-6 sm:p-8 rounded bg-[var(--surface)] border border-[var(--rule)] space-y-6 shadow-sm">
              <h3 className="text-xl sm:text-2xl font-semibold font-serif text-[var(--ink)]">
                {isTr ? 'TMA 3 Adımlı Devir Toparlama Reçetesi' : 'TMA 3-Step Codebase Recovery Protocol'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded bg-[var(--paper)] border border-[var(--rule)] space-y-3">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-[var(--surface)] text-[var(--ink)] border border-[var(--rule)]">
                    {isTr ? 'ADIM 01 (0 - 24 Saat)' : 'STEP 01 (0 - 24 Hours)'}
                  </span>
                  <h4 className="text-base font-semibold font-serif text-[var(--ink)]">
                    {isTr ? 'Erişim Dondurma & İzolasyon' : 'Credential Freeze & Isolation'}
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--ink-3)] leading-relaxed">
                    {isTr 
                      ? 'Git repo, DNS, sunucu ve ödeme paneli yönetici yetkileri ajansınız adına devralınır; ayrılan geliştiricinin kişisel hesap bağı koparılır.' 
                      : 'Master administrative access is transferred to your agency domain; developer personal card bindings are severed.'}
                  </p>
                </div>

                <div className="p-6 rounded bg-[var(--paper)] border border-[var(--rule)] space-y-3">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-[var(--surface)] text-[var(--ink)] border border-[var(--rule)]">
                    {isTr ? 'ADIM 02 (24 - 48 Saat)' : 'STEP 02 (24 - 48 Hours)'}
                  </span>
                  <h4 className="text-base font-semibold font-serif text-[var(--ink)]">
                    {isTr ? 'Sandbox Derleme & .env Doğrulama' : 'Sandbox Build & Secrets Audit'}
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--ink-3)] leading-relaxed">
                    {isTr 
                      ? 'Kod izole bir staging sunucusunda sıfırdan derlenir; eksik ortam değişkenleri ve API bağlantıları canlıya dokunmadan test edilir.' 
                      : 'Code is spun up in an isolated staging sandbox; missing env variables and API endpoints are verified.'}
                  </p>
                </div>

                <div className="p-6 rounded bg-[var(--paper)] border border-[var(--rule)] space-y-3">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-[var(--surface)] text-[var(--ink)] border border-[var(--rule)]">
                    {isTr ? 'ADIM 03 (48 - 72 Saat)' : 'STEP 03 (48 - 72 Hours)'}
                  </span>
                  <h4 className="text-base font-semibold font-serif text-[var(--ink)]">
                    {isTr ? 'Temiz Devir & Dokümantasyon' : 'Clean Handover & Docs'}
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--ink-3)] leading-relaxed">
                    {isTr 
                      ? 'Eksik kurulum rehberi (README), OpenAPI şeması ve test suite tamamlanarak ajansınıza bağımsız çalışabilir biçimde teslim edilir.' 
                      : 'Setup guides, API schemas, and deployment documentation are finalized and delivered with full IP ownership.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Email Lead Capture Card */}
            <div className="p-8 rounded bg-[var(--surface)] border border-[var(--rule)] text-left space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--rule)] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[var(--accent-wash)] text-[var(--accent)] flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold font-serif text-[var(--ink)]">
                      {isTr ? 'Bu Devir Raporunu & Eksik Kalem Listesini E-Postama Gönder' : 'Send This Handover Audit Report to My Email'}
                    </h4>
                    <p className="text-xs text-[var(--ink-3)]">
                      {isTr ? 'Ajans içi değerlendirme ve ayrılan ekiple paylaşım için hazır teknik liste formatında iletilir.' : 'Sent in a ready-to-share checklist format for your agency stakeholders.'}
                    </p>
                  </div>
                </div>
              </div>

              {leadSent === 'success' ? (
                <div className="p-5 rounded bg-[var(--tint-ok-bg)] border border-[var(--tint-ok-rule)] flex items-center gap-3 text-[var(--tint-ok-ink)] text-sm font-semibold">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[var(--tint-ok-ink)]" />
                  <span>{isTr ? 'Devir raporu talebiniz başarıyla kaydedildi! Ekibimiz analizi hazırlayıp iletecektir.' : 'Handover report request logged successfully! Our SWAT engineers will deliver your audit.'}</span>
                </div>
              ) : leadSent === 'error' ? (
                <div className="p-5 rounded bg-[var(--tint-warn-bg)] border border-[var(--tint-warn-rule)] space-y-3">
                  <div className="flex items-center gap-3 text-[var(--tint-warn-ink)] text-sm font-semibold">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[var(--tint-warn-ink)]" />
                    <span>{isTr ? 'Ağ kesintisi nedeniyle otomatik iletilemedi.' : 'Network interruption during auto-dispatch.'}</span>
                  </div>
                  <p className="text-xs text-[var(--ink-3)]">
                    {isTr ? 'Raporunuz hazır. Aşağıdaki butona tıklayarak WhatsApp üzerinden doğrudan talep edebilirsiniz:' : 'Your audit is ready. Request directly via WhatsApp:'}
                  </p>
                  <button
                    type="button"
                    onClick={openWhatsAppDispatch}
                    className="w-full py-3 px-4 rounded bg-[var(--sev-ok)] hover:opacity-90 text-[var(--on-sev-ok)] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm min-h-[44px]"
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
                    aria-label={isTr ? 'Adınız Soyadınız' : 'Your Full Name'}
                    placeholder={isTr ? 'Adınız Soyadınız' : 'Your Full Name'}
                    value={leadName}
                    onChange={e => setLeadName(e.target.value)}
                    className="px-4 py-3 rounded bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] placeholder:text-[var(--ink-3)] text-sm focus:border-[var(--accent)] focus:outline-none min-h-[44px]"
                  />
                  <input
                    type="email"
                    required
                    aria-label={isTr ? 'Kurumsal E-Posta Adresiniz' : 'Corporate Email Address'}
                    placeholder={isTr ? 'Kurumsal E-Posta Adresiniz' : 'Corporate Email Address'}
                    value={leadEmail}
                    onChange={e => setLeadEmail(e.target.value)}
                    className="px-4 py-3 rounded bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] placeholder:text-[var(--ink-3)] text-sm focus:border-[var(--accent)] focus:outline-none min-h-[44px]"
                  />
                  <input
                    type="tel"
                    aria-label={isTr ? 'WhatsApp / Telefon (Opsiyonel)' : 'Phone (Optional)'}
                    placeholder={isTr ? 'WhatsApp / Telefon (Opsiyonel)' : 'Phone (Optional)'}
                    value={leadPhone}
                    onChange={e => setLeadPhone(e.target.value)}
                    className="px-4 py-3 rounded bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] placeholder:text-[var(--ink-3)] text-sm focus:border-[var(--accent)] focus:outline-none min-h-[44px]"
                  />
                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      disabled={isSendingLead}
                      className="w-full py-3 px-6 rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--on-accent)] font-semibold text-sm tracking-wide transition-colors shadow-sm cursor-pointer disabled:opacity-50 min-h-[44px]"
                    >
                      {isSendingLead ? (isTr ? 'İletiliyor...' : 'Sending...') : (isTr ? 'Raporu & Kontrol Listesini E-Postama Gönder →' : 'Send Blueprint to My Email →')}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Direct Action Area */}
            <div className="p-6 sm:p-8 rounded bg-[var(--surface)] border border-[var(--rule)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-lg sm:text-xl font-semibold font-serif text-[var(--ink)]">
                  {isTr ? 'Yazılımcınız Ayrılmadan Önce Devir Sürecini Birlikte Yönetelim' : 'Let’s Supervise the Handover Before Your Dev Leaves'}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--ink-3)]">
                  {isTr ? 'Geliştiricinizle aranıza girmeden, %100 White-Label ve resmi NDA altında teknik denetimi yürütüyoruz.' : 'We audit codebase completeness invisibly under strict mutual NDA.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 flex-shrink-0">
                <a
                  href={getCalendlyUrl('handover_result', { agency_code: campaignParams.agency_code })}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => window.trackEvent && window.trackEvent('calendar_clicked', { source: 'handover_result', agency_code: campaignParams.agency_code })}
                  className="px-6 py-3 rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--on-accent)] font-semibold text-sm sm:text-base flex items-center gap-2 whitespace-nowrap shadow-sm cursor-pointer transition-colors min-h-[44px]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isTr ? 'Takvimden 30 Dakikalık Görüşme Seç' : 'Book a 30-Minute Intro Call'}</span>
                </a>

                <button
                  type="button"
                  onClick={openWhatsAppDispatch}
                  className="px-5 py-3 rounded bg-[var(--sev-ok)] hover:opacity-90 text-[var(--on-sev-ok)] font-semibold text-sm flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors min-h-[44px]"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{isTr ? 'WhatsApp ile Danışın' : 'Consult via WhatsApp'}</span>
                </button>
              </div>
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
                className="text-xs sm:text-sm text-[var(--ink-3)] hover:text-[var(--ink)] underline cursor-pointer flex items-center gap-1.5 min-h-[44px]"
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
