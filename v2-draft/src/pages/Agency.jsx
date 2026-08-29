import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, AlertTriangle, Code2, Cpu, Zap, Server, Database, 
  Smartphone, Bot, Clock, FileCode, CheckCircle2, ArrowRight, 
  PhoneCall, Mail, MessageSquare, Lock, Layers, HelpCircle, Terminal, Calendar
} from 'lucide-react';
import EmergencySOSModal from '../components/EmergencySOSModal';
import FAQ from '../components/FAQ';
import { getCalendlyUrl } from '../utils/calendly';

const capabilities = [
  { 
    title: { tr: 'Modern Kurumsal Web & Landing Page', en: 'High-Converting Corporate Web & Landing Pages' }, 
    desc: { tr: 'Yüksek dönüşümlü, ultra hızlı, responsive ve SEO optimize modern web siteleri.', en: 'High-converting, ultra-fast, responsive, and SEO-optimized web interfaces.' }, 
    cat: 'Frontend' 
  },
  { 
    title: { tr: 'React / Next.js Tabanlı Frontend', en: 'React / Next.js Frontend Architecture' }, 
    desc: { tr: 'Modern bileşen mimarisi, SSR, ISR ve yüksek performanslı interaktif paneller.', en: 'Modern component architecture, SSR, ISR, and high-performance dynamic interfaces.' }, 
    cat: 'Frontend' 
  },
  { 
    title: { tr: 'SaaS & Özel Web Uygulamaları', en: 'SaaS & Custom Web Applications' }, 
    desc: { tr: 'Sıfırdan ölçeklenebilir SaaS platformları, multi-tenant yapılar ve müşteri portalları.', en: 'From-scratch scalable SaaS platforms, multi-tenant models, and customer portals.' }, 
    cat: 'SaaS' 
  },
  { 
    title: { tr: 'Node.js, Python & FastAPI Backend', en: 'Node.js, Python & FastAPI Backends' }, 
    desc: { tr: 'Yüksek eşzamanlı, asenkron, mikroservis ve REST/GraphQL backend mimarileri.', en: 'High-concurrency, asynchronous, microservices, and modern API backends.' }, 
    cat: 'Backend' 
  },
  { 
    title: { tr: 'PostgreSQL, Redis & DB Mimarisi', en: 'PostgreSQL, Redis & DB Architecture' }, 
    desc: { tr: 'Veritabanı tasarımı, indeksleme, kilitlenen sorgu optimizasyonu ve caching katmanları.', en: 'Relational DB design, advanced indexing, query tuning, and caching pipelines.' }, 
    cat: 'Database' 
  },
  { 
    title: { tr: 'Admin & Müşteri Dashboard Panelleri', en: 'Admin & Customer Dashboards' }, 
    desc: { tr: 'Gelişmiş yetkilendirme, gerçek zamanlı veri görselleştirme ve rol bazlı erişim.', en: 'Advanced authorization, real-time data charts, and role-based access control.' }, 
    cat: 'Panel' 
  },
  { 
    title: { tr: 'Stripe, iyzico, PayTR Entegrasyonu', en: 'Stripe, iyzico & PayTR Integrations' }, 
    desc: { tr: 'Abonelik, tek çekim, pazar yeri ödemeleri ve güvenli webhook akışları.', en: 'Subscriptions, one-off checkouts, marketplace payouts, and robust webhooks.' }, 
    cat: 'Payment' 
  },
  { 
    title: { tr: 'REST API & GraphQL Geliştirme', en: 'REST API & GraphQL Development' }, 
    desc: { tr: 'Dokümante edilmiş, güvenli, hızlı ve versiyonlanmış API servisleri.', en: 'Fully documented, authenticated, versioned, and lightning-fast API microservices.' }, 
    cat: 'API' 
  },
  { 
    title: { tr: 'CRM, ERP & 3. Parti Entegrasyonları', en: 'CRM, ERP & 3rd Party Integrations' }, 
    desc: { tr: 'Farklı yazılımlar arasında çift yönlü otomatik veri senkronizasyonu ve webhooklar.', en: 'Bi-directional automated data pipelines and webhooks between disjoint systems.' }, 
    cat: 'Integration' 
  },
  { 
    title: { tr: 'OpenAI, LLM & Yapay Zeka Sistemleri', en: 'OpenAI, LLM & AI Automations' }, 
    desc: { tr: 'Özel şirket içi yapay zeka araçları, RAG mimarisi ve akıllı otomasyon akışları.', en: 'Proprietary enterprise AI agents, RAG knowledge bases, and smart workflows.' }, 
    cat: 'AI' 
  },
  { 
    title: { tr: 'AI Chatbot & Akıllı Asistanlar', en: 'AI Chatbots & Virtual Assistants' }, 
    desc: { tr: 'Müşteri hizmetleri ve dahili operasyonlar için zeki bot sistemleri.', en: 'Intelligent multi-lingual conversational bots for customer support and operations.' }, 
    cat: 'AI' 
  },
  { 
    title: { tr: 'Flutter Tabanlı Mobil Uygulamalar', en: 'Flutter Cross-Platform Mobile Apps' }, 
    desc: { tr: 'Tek kod tabanıyla hem iOS hem Android için native hızında şık mobil deneyimler.', en: 'Native-speed, elegant mobile experiences on iOS and Android from one codebase.' }, 
    cat: 'Mobile' 
  },
  { 
    title: { tr: 'Docker, CI/CD & Sunucu Dağıtımı', en: 'Docker, CI/CD & Cloud Deployment' }, 
    desc: { tr: "Otomatik test ve canlıya alma CI/CD pipeline'ları, Nginx & Linux sunucu yapılandırması.", en: 'Automated CI/CD pipelines, containerization, Nginx, and cloud hosting.' }, 
    cat: 'DevOps' 
  },
  { 
    title: { tr: 'Hız & Performans Optimizasyonu', en: 'Speed & Core Web Vitals Tuning' }, 
    desc: { tr: 'Core Web Vitals iyileştirmeleri, frontend & backend darboğaz giderme.', en: 'PageSpeed audits, Core Web Vitals boosts, frontend and backend bottleneck removal.' }, 
    cat: 'Optimization' 
  },
  { 
    title: { tr: 'SQL & DB Darboğazlarının Onarımı', en: 'SQL & Database Bottleneck Fixes' }, 
    desc: { tr: 'Kilitlenen yavaş sorguların tespiti, deadlock onarımı ve performans refactorü.', en: 'Deadlock resolution, index tuning, and refactoring of slow query bottlenecks.' }, 
    cat: 'Database' 
  },
  { 
    title: { tr: 'Yarım Kalan Projelerin Devralınması', en: 'Abandoned Codebase Takeover' }, 
    desc: { tr: 'Önceki geliştiriciden kalan kod tabanının incelenmesi, onarımı ve tamamlanması.', en: 'Auditing, fixing, and bringing stranded codebases to successful launch.' }, 
    cat: 'Rescue' 
  },
  { 
    title: { tr: 'Kritik Canlı Hata & Hotfix Müdahalesi', en: 'Critical Live Outage Hotfix SWAT' }, 
    desc: { tr: 'Canlı kesintilerinde (HTTP 500, crash, data bozulması) hızlı SWAT onarımı.', en: 'Rapid SWAT intervention for live crashes, HTTP 500s, and data corruption.' }, 
    cat: 'Rescue' 
  },
  { 
    title: { tr: 'Güvenlik & Kod Kalitesi İncelemesi', en: 'Security & Code Quality Audits' }, 
    desc: { tr: 'Güvenlik açığı tespiti, refactoring ve eski kodların modern standartlara taşınması.', en: 'Vulnerability discovery, security audits, refactoring, and code modernization.' }, 
    cat: 'Security' 
  },
  { 
    title: { tr: 'Teknik Mimari & Teknoloji Danışmanlığı', en: 'Technical Architecture Advisory' }, 
    desc: { tr: 'Doğru teknoloji seçimi, fizibilite ve ajans içi teknik danışmanlık.', en: 'Right-stack selection, feasibility studies, and senior technical guidance.' }, 
    cat: 'Consulting' 
  },
  { 
    title: { tr: 'FinTech & Algoritmik Bot Sistemleri', en: 'FinTech & Algorithmic Trading Bots' }, 
    desc: { tr: 'Pine Script, TradingView indikatörleri ve otomatik borsa işlem motorları.', en: 'Pine Script scripts, TradingView indicators, and high-frequency automated execution.' }, 
    cat: 'FinTech' 
  }
];

const situationQuotes = [
  {
    quote: {
      tr: "“Önceki geliştirici projeden beklenmedik şekilde çekildi ve dokümantasyon yok. Müşteri teslimat bekliyor, bu kod tabanını devralıp toparlayabilir misiniz?”",
      en: "“The previous developer unexpectedly disengaged from the project without documentation. The client expects delivery, can you take over and rescue this codebase?”"
    },
    tag: { tr: "Kod Kurtarma & Devralma", en: "Code Rescue & Takeover" }
  },
  {
    quote: {
      tr: "“Teslim tarihine 48 saat kaldı, kritik ödeme API entegrasyonu patladı. Ekibimizin kapasitesi doldu.”",
      en: "“Only 48 hours left to launch, the payment API integration crashed, and our team is fully booked.”"
    },
    tag: { tr: "T-48H Lansman Darboğazı", en: "T-48H Launch Crunch" }
  },
  {
    quote: {
      tr: "“Müşterimiz özel bir SaaS paneli ve yapay zeka entegrasyonu istiyor, standart WordPress ile yapamıyoruz.”",
      en: "“The client demands a bespoke SaaS dashboard and AI automation, standard WordPress won't cut it.”"
    },
    tag: { tr: "Özel Mimari & AI", en: "Custom Architecture & AI" }
  },
  {
    quote: {
      tr: "“Müşteri sitesi canlıda kilitlendi, veritabanı çöktü. Acil müdahale edecek kıdemli birine ihtiyacımız var.”",
      en: "“The client's website just crashed in production, database locked up. We urgently need a senior engineer.”"
    },
    tag: { tr: "Canlı Hotfix & SWAT", en: "Live Hotfix & SWAT" }
  },
  {
    quote: {
      tr: "“Mobil uygulamasını da istiyorlar, Flutter tarafında güvenebileceğimiz bir white-label ortak arıyoruz.”",
      en: "“They also asked for mobile apps; we need a dependable white-label partner on the Flutter side.”"
    },
    tag: { tr: "Mobil Uygulama Genişlemesi", en: "Mobile Extension" }
  },
  {
    quote: {
      tr: "“Biz tasarımı ve müşteri ilişkisini yönetelim; siz arkada teknik mühendisliği kusursuz yürütün.”",
      en: "“We will manage the design and client relationship; you handle the technical engineering seamlessly.”"
    },
    tag: { tr: "Sürekli White-Label Ortaklık", en: "Ongoing White-Label Partner" }
  }
];

const Agency = () => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  React.useEffect(() => {
    document.title = isTr
      ? "B2B Ajans Çözüm Ortaklığı & White-Label SWAT | Trend Master Akademi"
      : "B2B Agency Partnership & White-Label SWAT | Trend Master Academy";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", isTr
        ? "Dijital ajansların görünmez teknik gücü: %100 White-Label, resmi NDA güvencesi, 20+ teknik yetkinlik ve acil kriz masası."
        : "Behind-the-scenes engineering firepower for digital agencies: 100% White-Label, binding NDA protection, and emergency SWAT recovery."
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://trendmasterakademi.com/agency/');
    }
  }, [isTr]);

  return (
    <div className="min-h-screen pt-28 pb-28 bg-[#080b11] text-slate-200 relative  font-sans">
      
      {/* Background Cyber Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">

        {/* HERO SECTION */}
        <section className="text-center max-w-4xl mx-auto pt-6 pb-20">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(0,229,255,0.15)]">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            {isTr ? 'TMA RESPONSE DESK // B2B AJANS ÇÖZÜM ORTAKLIĞI' : 'TMA RESPONSE DESK // B2B AGENCY PARTNERSHIP'}
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-mono tracking-tight text-white leading-[1.18] mb-6">
            <span className="block">
              {isTr ? 'Ajansınızın yerine değil,' : 'Not to replace your agency,'}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
              {isTr ? 'ajansınızın yanında.' : 'to stand right beside it.'}
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed mb-10 max-w-3xl mx-auto font-normal">
            {isTr 
              ? 'Bir projede teknik olarak tıkandığınızda, ekibinizin kapasitesi dolduğunda, teslim tarihi yaklaştığında veya müşterinizin talebi mevcut uzmanlık alanınızın dışına çıktığında güvenilir teknik çözüm ortağınız ve kriz kurtarma ekibiniziz.' 
              : 'When you are technically blocked, when your team is over capacity, when deadlines loom, or when client requirements exceed your internal stack — we are your reliable technical partner and crisis SWAT force.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/crash-test/"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-bg-dark font-black text-sm sm:text-base shadow-xl shadow-cyan-500/25 flex items-center gap-3 transition-all transform hover:-translate-y-0.5 min-h-[48px]"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>{isTr ? "Agency Crash Test'i Başlat (60 sn)" : "Run Agency Crash Test (60s)"}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setIsSOSOpen(true)}
              className="px-8 py-4 rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-300 font-bold text-sm sm:text-base flex items-center gap-2.5 transition-colors cursor-pointer min-h-[48px]"
            >
              <AlertTriangle className="w-5 h-5 text-red-400 animate-bounce" />
              <span>{isTr ? 'Acil Kriz Masası (SOS)' : 'Emergency Crisis Desk (SOS)'}</span>
            </button>
          </div>

          {/* Trust Guarantees Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-white/10 text-left">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-bold text-xs sm:text-sm uppercase font-mono">%100 White-Label</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isTr ? 'Sizin müşteriniz, sizin logonuz; arka plandaki görünmez güç biziz.' : 'Your client, your brand; we operate purely as your invisible engineering backline.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400">
                <Lock className="w-5 h-5" />
                <span className="font-bold text-xs sm:text-sm uppercase font-mono">{isTr ? 'Resmi NDA / Gizlilik' : 'Mutual Legal NDA'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isTr ? 'Tüm kaynak kod, veri ve müşteri ilişkileri yasal sözleşme korumasında.' : 'All source code, data, and client relations are protected under strict NDA.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-orange-400">
                <Clock className="w-5 h-5" />
                <span className="font-bold text-xs sm:text-sm uppercase font-mono">{isTr ? 'Hızlı SWAT Triyajı' : 'Rapid SWAT Triage'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isTr ? 'Kilitlenen kod ve acil teslimatlar için saatler içinde müdahale.' : 'Hours-level intervention for deadlocked code and tight launch deadlines.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-400">
                <FileCode className="w-5 h-5" />
                <span className="font-bold text-xs sm:text-sm uppercase font-mono">{isTr ? 'Temiz Kod Devri' : 'Clean Code Handover'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isTr ? 'Dokümante edilmiş, bağımsız, sürdürülebilir tam mülkiyet teslimi.' : 'Documented, modular, tested code with 100% intellectual property transfer.'}
              </p>
            </div>
          </div>

        </section>

        {/* MANIFESTO SECTION */}
        <section className="py-16 border-t border-white/10">
          <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#111827] to-[#0d131f] border border-cyan-500/20 relative shadow-2xl space-y-6">
            <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-cyan-400 uppercase block">
              {isTr ? 'Çalışma Felsefemiz' : 'Our Working Philosophy'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
              {isTr 
                ? 'Müşterinizle aranıza girmek için değil; arkanızdaki teknik gücü büyütmek için buradayız.' 
                : 'Not to step between you and your client; but to multiply your technical power from behind.'}
            </h2>
            <div className="space-y-4 text-slate-300 text-base sm:text-lg leading-relaxed">
              <p>
                {isTr 
                  ? 'Ajansların zaman zaman karşılaştığı çok tanıdık bir problemi biliyoruz: Müşteri vardır, proje alınmıştır, tasarım hazırlanmıştır; ancak bir noktada özel bir backend geliştirmesi, karmaşık bir API entegrasyonu, performans problemi, yarım bırakılmış bir kod tabanı, ödeme altyapısı veya ekibin kapasitesini aşan teknik bir ihtiyaç ortaya çıkar.' 
                  : 'We know the familiar agency dilemma: You have the client, the project is signed, designs are approved; but then a complex backend bottleneck, payment API failure, abandoned legacy code, or unexpected scale requirement threatens the launch.'}
              </p>
              <p>
                {isTr 
                  ? 'Ajans tarafında teknik bir iş outsource edildiğinde en büyük problemin yalnızca kod yazılması olmadığını biliyoruz. İletişim kopukluğu, teslim tarihlerinin sürekli ötelenmesi, dokümantasyonsuz kod veya teslimden sonra ulaşılamayan kişiler ajansın itibarını riske atar.' 
                  : 'We understand that outsourcing technical work involves more than code. Poor communication, missed deadlines, spaghetti code, and unresponsive developers risk your agency’s hard-earned client reputation.'}
              </p>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {isTr 
                    ? 'Bu nedenle çalışma modelimizi %100 şeffaf tutuyor; doğrudan kıdemli mühendislik masamız üzerinden hızlı, güvenilir ve sürdürülebilir çözümler üretiyoruz.' 
                    : 'That’s why our model is 100% transparent, executing directly via our senior engineering desk with speed and dependable code.'}
                </p>
            </div>
          </div>
        </section>

        {/* SITUATION QUOTES */}
        <section className="py-16">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-orange-400 uppercase block mb-3">
              {isTr ? 'Kriz & İhtiyaç Senaryoları' : 'Real-World Crisis Scenarios'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
              {isTr ? 'Özellikle şu durumlarda bizi hatırlamanızı isteriz:' : 'Especially remember us when you hear:'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {situationQuotes.map((sq, idx) => (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-[#111827]/80 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/5 text-cyan-400 border border-white/10 mb-5">
                    {sq.tag[isTr ? 'tr' : 'en']}
                  </span>
                  <p className="text-base sm:text-lg text-slate-200 italic font-medium leading-relaxed mb-6 group-hover:text-white transition-colors">
                    {sq.quote[isTr ? 'tr' : 'en']}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs sm:text-sm text-slate-400">
                  <span>{isTr ? 'TMA Çözüm Modeli' : 'TMA Solution'}</span>
                  <span className="text-cyan-400 font-mono font-bold">White-Label SWAT →</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 20 CAPABILITIES MATRIX */}
        <section className="py-16 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-cyan-400 uppercase block mb-3">
              {isTr ? 'Teknik Yetkinlik Alanları' : 'Core Technical Capabilities'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
              {isTr ? 'Ajansınıza güç katabileceğimiz başlıca alanlar' : 'Where we empower your agency'}
            </h2>
            <p className="text-slate-300 text-base sm:text-lg mt-3 leading-relaxed">
              {isTr 
                ? 'Modern frontend mimarilerinden karmaşık backend, AI otomasyonları ve kriz hotfix müdahalelerine kadar tam kapsamlı mühendislik.' 
                : 'Comprehensive full-stack engineering from modern frontend stacks to complex backends, AI automations, and crisis hotfixes.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {capabilities.map((cap, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-white/10 text-slate-300 font-semibold">
                      {cap.cat}
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">#{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 leading-snug">{cap.title[isTr ? 'tr' : 'en']}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{cap.desc[isTr ? 'tr' : 'en']}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4-STEP TIMELINE */}
        <section className="py-16 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-emerald-400 uppercase block mb-3">
              {isTr ? 'Süreç Nasıl İlerliyor?' : 'How It Works'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
              {isTr ? '4 Adımda Pürüzsüz White-Label Entegrasyonu' : 'Seamless 4-Step White-Label Integration'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: { tr: 'Hızlı Triyaj & İnceleme', en: 'Rapid Triage & Audit' },
                desc: { tr: 'Talebi veya kriz durumunu teknik olarak değerlendiriyor, yapılabilirlik ve reçeteyi baştan netleştiriyoruz.', en: 'We evaluate the bottleneck or scope, outlining feasibility, timeline, and exact action recipe upfront.' }
              },
              {
                step: '02',
                title: { tr: 'NDA & Şeffaf Kapsam', en: 'NDA & Fixed Scope' },
                desc: { tr: 'Karşılıklı gizlilik sözleşmesi (NDA) imzalıyor, sabit bütçe ve kesin teslim takvimini belirliyoruz.', en: 'We sign mutual NDAs, establishing fixed pricing and firm delivery deadlines with zero surprise costs.' }
              },
              {
                step: '03',
                title: { tr: 'White-Label Geliştirme', en: 'White-Label Execution' },
                desc: { tr: 'Doğrudan teknik ekip üzerinden, isterseniz ajans e-postanızla veya tamamen arka planda çalışıyoruz.', en: 'We build directly as your invisible backline engineers or under your agency domain email.' }
              },
              {
                step: '04',
                title: { tr: 'Temiz Devir & Güvence', en: 'Clean Handover & IP Transfer' },
                desc: { tr: 'Eksiksiz dokümantasyon, test edilmiş kod ve %100 mülkiyet devriyle projeyi teslim ediyoruz.', en: 'Tested, documented codebase handed over with 100% intellectual property rights transferred to you.' }
              }
            ].map((p, idx) => (
              <div key={idx} className="p-7 rounded-3xl bg-[#111827] border border-white/10 relative space-y-3">
                <span className="text-3xl sm:text-4xl font-black font-mono text-cyan-400/40 block">
                  {p.step}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">{p.title[isTr ? 'tr' : 'en']}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{p.desc[isTr ? 'tr' : 'en']}</p>
              </div>
            ))}
          </div>
        </section>

        {/* B2B SWAT CASE STUDIES SECTION */}
        <section className="py-16 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-cyan-400 uppercase block mb-3">
              {isTr ? 'Gerçek Müdahale Örnekleri (NDA Güvencesinde)' : 'Real-World Incident Case Studies (Under Strict NDA)'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
              {isTr ? 'Ajanslar Adına Kurtarılan & Teslim Edilen Projeler' : 'Rescued & Delivered on Behalf of Partner Agencies'}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed max-w-2xl mx-auto">
              {isTr 
                ? 'Bu sayfada hiçbir müşterinin adı yazmıyor — sizinki de yazmayacak. Anlatılan senaryolar yürüttüğümüz gerçek projelerden alınmıştır; kimliğe dair her ayrıntı çıkarılmıştır.' 
                : 'No client is named on this page — and yours never will be. These scenarios are drawn from real engagements; every identifying detail has been removed.'}
            </p>
            <div className="mt-3.5">
              <Link
                to="/about/"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors underline decoration-cyan-500/40 hover:decoration-cyan-400"
              >
                <span>{isTr ? 'Kendi kimliğimizi yayınlıyoruz. Müşterilerimizinkini asla.' : "We publish our own legal identity. Never our clients'."}</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Case 01 */}
            <div className="p-7 rounded-3xl bg-[#111827] border border-red-500/20 hover:border-red-500/40 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                    {isTr ? 'Lansman T-24H Kriz SWAT' : 'Launch T-24H SWAT Hotfix'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">2.5 {isTr ? 'Saat' : 'Hours'}</span>
                </div>
                <h3 className="text-xl font-bold text-white leading-snug">
                  {isTr ? 'PostgreSQL Deadlock & Ödeme Webhook Kopması' : 'PostgreSQL Deadlock & Payment Webhook Break'}
                </h3>
                <div className="text-xs font-mono text-cyan-400">
                  Next.js · Node.js · PostgreSQL · Redis · Stripe / iyzico
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <p className="border-l-2 border-red-400/60 pl-3 text-slate-300">
                    <strong className="text-white block">{isTr ? 'Kriz:' : 'Crisis:'}</strong>
                    {isTr 
                      ? 'Lansman arifesinde 800+ eşzamanlı sepette veritabanı kilitlenmesi ve ödeme callback kayıpları yaşandı.' 
                      : 'Severe DB row deadlocks and lost payment webhook callbacks occurred on eve of launch with 800+ concurrent checkouts.'}
                  </p>
                  <p className="border-l-2 border-emerald-400/60 pl-3 text-slate-300">
                    <strong className="text-white block">{isTr ? 'TMA Müdahalesi:' : 'TMA Intervention:'}</strong>
                    {isTr 
                      ? 'Sandbox staging fork oluşturuldu, row lock yapısı asenkron Redis kuyruğuna taşındı, webhook idempotent yapıldı.' 
                      : 'Forked to staging sandbox, replaced row locks with async Redis queues, made webhooks fully idempotent.'}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">{isTr ? 'Kayıp Oranı:' : 'Loss Rate:'} <strong className="text-emerald-400">%0</strong></span>
                <span className="text-slate-400">{isTr ? 'Mülkiyet:' : 'Ownership:'} <strong className="text-cyan-300">%100 Ajans</strong></span>
              </div>
            </div>

            {/* Case 02 */}
            <div className="p-7 rounded-3xl bg-[#111827] border border-orange-500/20 hover:border-orange-500/40 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30">
                    {isTr ? 'Yarım Kalan Repo Devralma' : 'Abandoned Codebase Takeover'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">6 {isTr ? 'Gün Sprint' : 'Days Sprint'}</span>
                </div>
                <h3 className="text-xl font-bold text-white leading-snug">
                  {isTr ? 'Geliştirici Ayrılığı Sonrası B2B SaaS Mimarisi' : 'B2B SaaS Platform Takeover Post-Dev Departure'}
                </h3>
                <div className="text-xs font-mono text-cyan-400">
                  React · Python / FastAPI · PostgreSQL · Docker · AWS
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <p className="border-l-2 border-orange-400/60 pl-3 text-slate-300">
                    <strong className="text-white block">{isTr ? 'Kriz:' : 'Crisis:'}</strong>
                    {isTr 
                      ? 'Önceki ekibin dokümantasyonsuz ayrıldığı, 42 backend uç noktasının yarım kaldığı ve yetkilendirme mimarisinin çöktüğü sistem.' 
                      : 'Previous dev departed abruptly leaving 42 broken endpoints, missing docs, and failing JWT authorization.'}
                  </p>
                  <p className="border-l-2 border-emerald-400/60 pl-3 text-slate-300">
                    <strong className="text-white block">{isTr ? 'TMA Müdahalesi:' : 'TMA Intervention:'}</strong>
                    {isTr 
                      ? 'Mimari haritalandırıldı, eksik REST uçları tamamlandı, OpenAPI şeması üretildi ve tüm spagetti kod refactor edildi.' 
                      : 'Codebase audited, completed all REST endpoints, auto-generated OpenAPI schemas, and refactored modular backend.'}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">{isTr ? 'Teslimat:' : 'Delivery:'} <strong className="text-emerald-400">Zamanında</strong></span>
                <span className="text-slate-400">{isTr ? 'Dokümantasyon:' : 'Docs:'} <strong className="text-cyan-300">Swagger UI</strong></span>
              </div>
            </div>

            {/* Case 03 */}
            <div className="p-7 rounded-3xl bg-[#111827] border border-cyan-500/20 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    {isTr ? 'Trafik & API Ölçekleme' : 'Traffic & Scale Triaging'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">14 {isTr ? 'Saat' : 'Hours'}</span>
                </div>
                <h3 className="text-xl font-bold text-white leading-snug">
                  {isTr ? '150K+ Anlık Trafikte Gateway 504 Darboğazı' : '150K+ Concurrent Traffic Gateway 504 Bottleneck'}
                </h3>
                <div className="text-xs font-mono text-cyan-400">
                  Flutter · Node.js · MongoDB · Socket.io · AWS Lambda
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <p className="border-l-2 border-cyan-400/60 pl-3 text-slate-300">
                    <strong className="text-white block">{isTr ? 'Kriz:' : 'Crisis:'}</strong>
                    {isTr 
                      ? 'Mobil biletleme kampanyasında HTTP 504 Gateway Timeout ve socket connection kilitlenmeleri yaşandı.' 
                      : 'Severe HTTP 504 timeouts and websocket connection saturation during sudden live ticketing surges.'}
                  </p>
                  <p className="border-l-2 border-emerald-400/60 pl-3 text-slate-300">
                    <strong className="text-white block">{isTr ? 'TMA Müdahalesi:' : 'TMA Intervention:'}</strong>
                    {isTr 
                      ? 'Redis cache katmanı, query indexing ve socket connection throttling devreye alındı; mikroservis yükü dengelendi.' 
                      : 'Deployed Redis caching, indexed bottleneck queries, and throttled socket reconnections to stabilize Lambda workers.'}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">{isTr ? 'Yanıt Süresi:' : 'Latency:'} <strong className="text-emerald-400">4.2s → 120ms</strong></span>
                <span className="text-slate-400">{isTr ? 'Uptime:' : 'Uptime:'} <strong className="text-cyan-300">%99.98</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* TRANSPARENT PRICING SECTION / ÜCRETLENDİRME MODELİ */}
        <section className="py-16 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-emerald-400 uppercase block mb-3">
              {isTr ? 'ŞEFFAF ÜCRETLENDİRME' : 'TRANSPARENT PRICING'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
              {isTr ? 'Bedeli teşhisten sonra, yazılı ve sabit veriyoruz' : 'We quote after diagnosis — fixed and in writing'}
            </h2>
          </div>

          <div className="max-w-5xl mx-auto space-y-8">
            {/* 3 Layers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Katman 01 */}
              <div className="p-7 rounded-3xl bg-[#111827] border-2 border-emerald-500/40 relative flex flex-col justify-between space-y-6 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {isTr ? 'HER İŞTE' : 'EVERY ENGAGEMENT'}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      {isTr ? 'Ücretsiz · taahhüt yok' : 'Free · no commitment'}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    {isTr ? 'İlk teşhis ücretsizdir — ve yüzeysel değildir.' : "The initial diagnosis is free — and it isn't superficial."}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isTr 
                      ? 'Kod tabanını, altyapıyı ve devir durumunu inceler; sorunun gerçekte nerede olduğunu, ne gerektirdiğini ve ne kadar süreceğini yazılı olarak iletiriz. Bu aşamada ücret talep edilmez, taahhüt istenmez.' 
                      : 'We review the codebase, the infrastructure and the handover state, then set out in writing where the fault actually is, what it takes to fix, and how long it will take. No fee, no commitment at this stage.'}
                  </p>
                </div>
              </div>

              {/* Katman 02 */}
              <div className="p-7 rounded-3xl bg-[#111827] border border-white/10 relative flex flex-col justify-between space-y-6 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-slate-300 border border-white/20">
                      {isTr ? 'PLANLI İŞLER' : 'PLANNED WORK'}
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                      {isTr ? 'Sabit teklif · kapsam netleşince' : 'Fixed quote · once scope is defined'}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    {isTr ? 'Bedel teşhisten sonra belirlenir.' : 'The fee follows the diagnosis.'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isTr 
                      ? <>Devralma, kapasite takviyesi ve mimari işlerde kapsam netleştikten sonra sabit teklif iletilir; çalışma başlamadan önce bedel yazılı olarak nettir. <strong className="text-white">Saatlik ve ucu açık çalışmıyoruz.</strong></>
                      : <>For takeovers, capacity support and architecture work, a fixed quote follows once scope is defined; the fee is confirmed in writing before work starts. <strong className="text-white">We don't bill hourly or open-ended.</strong></>}
                  </p>
                </div>
              </div>

              {/* Katman 03 */}
              <div className="p-7 rounded-3xl bg-[#111827] border border-cyan-500/30 relative flex flex-col justify-between space-y-6 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      {isTr ? 'ACİL MÜDAHALE' : 'EMERGENCY RESPONSE'}
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                      {isTr ? 'Sabit bedel · işin kapsamına göre' : 'Fixed fee · depending on scope'}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    {isTr ? 'Teşhis ve bedel aynı anda verilir.' : 'Diagnosis and price arrive together.'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isTr 
                      ? 'Saatler içinde çözülmesi gereken durumlarda teşhisi beklemek anlamsızdır; teşhis ve sabit bedel birlikte iletilir.' 
                      : 'When something has to be resolved within hours, waiting for a diagnosis makes no sense: we deliver the diagnosis and a fixed fee at the same time.'}
                  </p>
                </div>
              </div>

            </div>

            {/* Acil Teklif Hattı (3 katmanın ALTINDA, ayrı ve yeşil çerçeveli) */}
            <div className="p-7 sm:p-9 rounded-3xl bg-emerald-950/20 border-2 border-emerald-500/40 space-y-6 shadow-xl">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  {isTr ? 'ACİL TEKLİF HATTI' : 'URGENT QUOTE LINE'}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {isTr ? 'Teklif iki taraftan da gelebilir.' : 'A quote can come from either side.'}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                  {isTr 
                    ? <>Tanımadığınız birine kriz anında rakam taahhüt etmek zorunda değilsiniz. Kapsamı görüp bedeli biz veririz; <strong className="text-white">siz de kendi bütçenizi iletebilirsiniz.</strong> İki durumda da net cevap alırsınız: yapılır ya da yapılmaz.</>
                    : <>You shouldn't have to commit to a figure with someone you don't know, mid-crisis. We can review the scope and quote it; <strong className="text-white">or you can tell us your budget.</strong> Either way you get a straight answer: we can do it, or we can't.</>}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-white font-bold text-sm sm:text-base">
                    {isTr ? 'Biz teklif veririz' : 'We quote'}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {isTr ? 'Teşhisi yapar, sabit bedeli iletiriz.' : 'We run the diagnosis and give you a fixed fee.'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="text-white font-bold text-sm sm:text-base">
                      {isTr ? 'Siz teklif verirsiniz' : 'You quote'}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {isTr ? 'Bütçenizi söylersiniz, kapsamı ona göre konuşuruz.' : 'You name your budget, we shape the scope around it.'}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => window.dispatchEvent(new CustomEvent('open-sos-modal'))}
                      className="text-emerald-400 font-mono font-bold text-xs sm:text-sm hover:underline focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-pointer transition-colors text-left"
                    >
                      {isTr ? 'Bütçenizi iletin →' : 'Send us your budget →'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Alt not */}
            <div className="text-center pt-2">
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                <Link to="/nda/" className="hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/40 transition-colors">
                  {isTr 
                    ? 'Tüm çalışmalar resmi NDA kapsamındadır; kaynak kod ve fikri mülkiyet %100 ajansınıza aittir.' 
                    : 'All work is covered by a formal NDA; source code and IP belong 100% to your agency.'}
                </Link>
              </p>
            </div>

          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <FAQ />

        {/* MEETING INVITATION */}
        <section className="py-16">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-[#111827] via-[#0b121f] to-[#151f33] border border-cyan-500/30 text-center relative overflow-hidden shadow-2xl">
            
            <div className="max-w-3xl mx-auto space-y-6">
              <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase inline-block">
                {isTr ? 'İş Ortaklığı Daveti' : 'Partnership Invitation'}
              </span>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {isTr ? 'Her projede birlikte çalışmak zorunda değiliz.' : 'We don’t need to work on every project.'}
              </h2>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                {isTr 
                  ? 'Belki aylar boyunca birbirimize hiç ihtiyaç duymayacaksınız. Ama günün birinde teknik olarak zor bir iş masanıza geldiğinde veya güvenilir bir geliştiriciye “Şuna bir bakabilir misiniz?” demek istediğinizde bizi hatırlamanız bizim için yeterli.' 
                  : 'You might not need us for months. But when a high-stakes bottleneck arrives or when you need a trusted developer to ask “Can you take a look at this?”, knowing we are ready is all that matters.'}
              </p>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 max-w-xl mx-auto text-left space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" /> {isTr ? '30 Dakikalık Online Tanışma Görüşmesi' : '30-Minute Online Introductory Call'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {isTr 
                    ? 'Ortada aktif bir proje olması gerekmiyor; birbirimizi tanımamız ve ihtiyaç oluştuğunda kiminle iletişime geçeceğinizi bilmeniz yeterli.' 
                    : 'No active project required; just getting acquainted so you know who to call when a critical crunch occurs.'}
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs sm:text-sm font-mono text-slate-300">
                  <span>📞 <a href="tel:+905343713573" className="hover:text-cyan-400 font-bold">+90 534 371 35 73</a></span>
                  <span>✉️ <a href="mailto:info@trendmasterakademi.com" className="hover:text-cyan-400 font-bold">info@trendmasterakademi.com</a></span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <a
                  href={getCalendlyUrl('agency_card')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => window.trackEvent && window.trackEvent('calendar_clicked', { source: 'agency_card' })}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-bg-dark font-black text-sm sm:text-base shadow-xl shadow-emerald-500/25 flex items-center gap-3 transition-all transform hover:-translate-y-0.5 min-h-[48px]"
                >
                  <Calendar className="w-5 h-5" />
                  <span>{isTr ? 'Takvimden Randevu Seç' : 'Select Time from Calendar'}</span>
                </a>

                <a
                  href="https://wa.me/905343713573?text=Merhaba%2C%20Trend%20Master%20Akademi%20ile%20ajans%20%C3%A7%C3%B6z%C3%BCm%20ortakl%C4%B1%C4%9F%C4%B1%20ve%20tan%C4%B1%C5%9Fma%20g%C3%B6r%C3%BC%C5%9Fmesi%20hakk%C4%B1nda%20konu%C5%9Fmak%20istiyoruz."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => window.trackEvent && window.trackEvent('whatsapp_clicked', { source: 'agency_intro_call' })}
                  className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm sm:text-base flex items-center gap-2.5 transition-colors min-h-[48px]"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <span>{isTr ? 'Tanışma Randevusu Al (WhatsApp)' : 'Book Intro Call (WhatsApp)'}</span>
                </a>

                <Link
                  to="/crash-test/"
                  className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold text-sm sm:text-base flex items-center gap-2 transition-colors min-h-[48px]"
                >
                  <Zap className="w-5 h-5 text-cyan-400 fill-current" />
                  <span>{isTr ? "Crash Test'i Çalıştır" : "Run Crash Test"}</span>
                </Link>
              </div>

            </div>
          </div>
        </section>

      </div>

      {/* Global SOS Modal */}
      <EmergencySOSModal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} />
    </div>
  );
};

export default Agency;
