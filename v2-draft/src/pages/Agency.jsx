import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, AlertTriangle, Code2, Cpu, Zap, Server, Database, 
  Smartphone, Bot, Clock, FileCode, CheckCircle2, ArrowRight, 
  PhoneCall, Mail, MessageSquare, Lock, Layers, HelpCircle, Terminal 
} from 'lucide-react';
import EmergencySOSModal from '../components/EmergencySOSModal';
import CodeDiffShowcase from '../components/CodeDiffShowcase';
import TypewriterText from '../components/TypewriterText';

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
    desc: { tr: 'Canlı kesintilerinde (HTTP 500, crash, data bozulması) 7/24 hızlı SWAT onarımı.', en: '24/7 rapid SWAT intervention for live crashes, HTTP 500s, and data corruption.' }, 
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
      tr: "“Önceki yazılımcı projeyi yarım bıraktı, hiçbir dokümantasyon yok. Müşteri çok gergin, bunu kurtarabilir misiniz?”",
      en: "“Our previous developer abandoned the project halfway through with zero documentation. The client is furious, can you rescue this?”"
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

  return (
    <div className="min-h-screen pt-28 pb-28 bg-[#080b11] text-slate-200 relative overflow-hidden font-sans">
      
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
              <TypewriterText text={isTr ? 'Ajansınızın yerine değil,' : 'Not to replace your agency,'} speed={35} delay={100} showCursor={false} />
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
              <TypewriterText text={isTr ? 'ajansınızın yanında.' : 'to stand right beside it.'} speed={35} delay={1050} cursorColor="text-cyan-400" />
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
              to="/crash-test"
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
              <p className="text-white font-semibold pt-4 border-t border-white/10">
                {isTr 
                  ? 'Bu nedenle çalışma modelimizi %100 şeffaf tutuyor; doğrudan kıdemli mühendislik ekibimiz üzerinden hızlı, güvenilir ve sürdürülebilir çözümler üretiyoruz.' 
                  : 'That’s why our model is 100% transparent: you collaborate directly with senior engineers delivering rapid, reliable, and sustainable technical solutions.'}
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

        {/* LIVE CODE DIFF & BENCHMARK SHOWCASE */}
        <CodeDiffShowcase />

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
                  <Clock className="w-5 h-5 text-cyan-400" /> {isTr ? '15–20 Dakikalık Online Tanışma Görüşmesi' : '15–20 Minute Online Introductory Call'}
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
                  href="https://wa.me/905343713573?text=Merhaba%2C%20Trend%20Master%20Akademi%20ile%20ajans%20%C3%A7%C3%B6z%C3%BCm%20ortakl%C4%B1%C4%9F%C4%B1%20ve%20tan%C4%B1%C5%9Fma%20g%C3%B6r%C3%BC%C5%9Fmesi%20hakk%C4%B1nda%20konu%C5%9Fmak%20istiyoruz."
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-bg-dark font-black text-sm sm:text-base shadow-xl shadow-emerald-500/25 flex items-center gap-3 transition-all transform hover:-translate-y-0.5 min-h-[48px]"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>{isTr ? 'Tanışma Randevusu Al (WhatsApp)' : 'Book Intro Call (WhatsApp)'}</span>
                </a>

                <Link
                  to="/crash-test"
                  className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-sm sm:text-base flex items-center gap-2 transition-colors min-h-[48px]"
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
