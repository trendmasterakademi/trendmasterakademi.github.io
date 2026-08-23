document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. TRANSLATION DICTIONARY (i18n)
  // ==========================================
  const translations = {
    tr: {
      "site-title": "Trend Master Akademi | Elite Full-Stack Yazılım & Dijital Çözüm Stüdyosu",
      "about-site-title": "Hakkımızda & Mühendislik Vizyonumuz | Trend Master Akademi",
      
      // Navbar
      "logo-text": "TREND MASTER AKADEMİ",
      "nav-home": "Ana Sayfa",
      "nav-solutions": "Çözümlerimiz",
      "nav-wizard": "Proje Hesaplayıcı",
      "nav-cases": "Vaka Analizleri",
      "nav-about": "Akademi & Hakkımızda",
      "nav-contact": "İletişim",
      "nav-btn-start": "Proje Başlat",
      
      // Hero
      "hero-typewriter-default": "Fikirden Canlı Ürüne SaaS ve Web Çözümleri",
      "hero-title": "Fikirden Canlı Ürüne: <span class='hero-title-highlight'>Modern Web, SaaS & Uçtan Uca Yazılım Mimarisi</span>",
      "hero-desc": "Sıfırdan modern web siteleri ve SaaS platformları inşası, kilitlenen kodların kurtarılması, yapay zeka & API entegrasyonları ve algoritmik sistemler. Aracı ajanslar olmadan, doğrudan kıdemli mühendis güvencesiyle ilk günden çalışan çözümler.",
      "btn-hero-wizard": "Projenizi / Sorununuzu Anlatın",
      "btn-hero-whatsapp": "WhatsApp ile Hemen Danışın",
      
      // Engineering Deck
      "deck-tab-arch": "SaaS Mimarisi",
      "deck-tab-debug": "Canlı Terminal & Kod",
      "deck-tab-algo": "Bot & Algo Motoru",
      "metric-delivery": "Temiz Kod Garantisi",
      "metric-api": "Ortalama API Yanıtı",
      "metric-test": "TDD & Test Kapsamı",
      "debug-status-fixed": "✓ TÜM TESTLER BAŞARILI",

      // Trust Bar
      "trust-1-title": "10+ Yıl Deneyim",
      "trust-1-desc": "Kıdemli Full-Stack Mühendislik",
      "trust-2-title": "%100 Teslimat Güvencesi",
      "trust-2-desc": "Temiz, Dokümante & Sahipli Kod",
      "trust-3-title": "< 0.5s Yükleme Hızı",
      "trust-3-desc": "SEO & Reklam Odaklı Performans",
      "trust-4-title": "Birebir Senior Muhatap",
      "trust-4-desc": "Sıfır Ajans Bürokrasisi",

      // Solutions Matrix
      "matrix-subtitle": "Tam Olarak Neye İhtiyacınız Var?",
      "matrix-title": "Sorununuzun Çözümü Burada",
      "matrix-desc": "Fikir aşamasından canlıya, kilitlenen kodların kurtarılmasından otomatik yapay zeka ve finansal bot sistemlerine kadar eksiksiz mühendislik desteği.",
      "badge-web": "Ultra Hızlı Web",
      "m-web-title": "Modern Web & Landing Page İnşası",
      "m-web-desc": "Google Ads ve sosyal medya reklamlarınızdan maksimum dönüşüm alan, mobil öncelikli, 0.4s açılış hızına sahip premium kurumsal web siteleri.",
      "m-web-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Next.js, React & Modern UI Tasarımları",
      "m-web-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Yüksek Dönüşüm (CRO) & Ads Optimizasyonu",
      "m-web-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> SEO Uyumlu & Şimşek Hızında Yükleme",
      "m-btn-select": "Projeyi Başlat",

      "badge-saas": "Fikirden Ürüne",
      "m-saas-title": "SaaS & Özel Web Uygulaması Mimarisi",
      "m-saas-desc": "Yazılım fikrinizi MVP'den ölçeklenebilir bir SaaS platformuna dönüştürüyoruz. Üyelik, abonelik ödemeleri, admin panelleri ve güçlü veritabanı altyapısı.",
      "m-saas-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Çok Kiracılı (Multi-tenant) Mimari & Auth",
      "m-saas-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Stripe, Iyzico & PayTR Ödeme Sistemleri",
      "m-saas-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Gelişmiş Müşteri & Yönetim Panelleri",

      "badge-bug": "Acil Müdahale",
      "m-bug-title": "Kod Çözümleri & Hata Kurtarma",
      "m-bug-desc": "Yarım kalmış, tıkanmış veya çöken yazılımlarınızı devralıp 24-48 saat içinde ayağa kaldırıyoruz. Kod temizliği, güvenlik açıklarını kapatma ve hızlandırma.",
      "m-bug-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Kritik Bug Tespiti & Anında Onarım",
      "m-bug-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Veritabanı Darboğazı & Query İyileştirme",
      "m-bug-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Kod Refactoring & Modernizasyon",

      "badge-ai": "Yeni Nesil Çözüm",
      "m-ai-title": "Yapay Zeka, Webhook & API Entegrasyonları",
      "m-ai-desc": "Şirket içi süreçlerinizi otomatikleştiren özel AI botları, CRM, ERP, ödeme ve kargo sistemlerini birbirine bağlayan sağlam API köprüleri.",
      "m-ai-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> OpenAI, Claude & Özel LLM Entegrasyonları",
      "m-ai-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Webhook & Asenkron Kuyruk Sistemleri",
      "m-ai-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> İki Yönlü Veri Senkronizasyonu",

      "badge-algo": "Yüksek Hassasiyet",
      "m-algo-title": "Özel Botlar & Algoritmik Mühendislik",
      "m-algo-desc": "TradingView Pine Script v5 indikatörleri, Python alım-satım botları, arbitraj ve canlı borsa API otomasyonlarında kurumsal düzeyde matematiksel sistemler.",
      "m-algo-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Pine Script v5 Özel İndikatör & Strateji",
      "m-algo-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Binance, Bybit vb. Borsa API Bağlantıları",
      "m-algo-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> 7/24 Kesintisiz Sunucu Otomasyonu",

      "badge-cto": "Stratejik Danışmanlık",
      "m-cto-title": "Teknik Mimarlık & CTO Danışmanlığı",
      "m-cto-desc": "Girişiminiz veya şirketiniz için doğru teknoloji yığını seçimi, kod denetimi (code audit), maliyet optimizasyonu ve uçtan uca teknik yol haritası.",
      "m-cto-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Mimari Tasarım & Teknoloji Seçimi",
      "m-cto-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Bulut & Sunucu Maliyetlerini Düşürme",
      "m-cto-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Kod Güvenlik & Performans Denetimi",

      // Wizard
      "wizard-subtitle": "Akıllı Danışma & Teklif Sihirbazı",
      "wizard-title": "Projenizi veya Sorununuzu 3 Adımda İletin",
      "wizard-desc": "İhtiyacınızı seçin; anında bir teknik brif oluşturalım ve Mehmet Şahin ile doğrudan WhatsApp üzerinden iletişime geçin.",
      "w-step1-title": "Ne Tür Bir Çözüme İhtiyacınız Var?",
      "w-step2-title": "Projenizin Mevcut Durumu Nedir?",
      "w-step3-title": "Hedeflenen Zaman & Öncelik?",
      "w-sum-title": "📋 Teknik Ön-Brifing Özeti",
      "w-sum-desc": "Seçimlerinize göre otomatik oluşturulan talep özeti:",
      "w-sum-srv": "Hizmet Türü:",
      "w-sum-stg": "Proje Durumu:",
      "w-sum-time": "Zaman Çizelgesi:",
      "w-sum-note-head": "💡 Mühendis Güvencesi:",
      "w-sum-note-body": "Talebiniz doğrudan kurucu geliştirici Mehmet Şahin'e iletilir. 30 dakika içinde teknik değerlendirme ve net çözüm planı paylaşıyoruz.",
      "w-btn-submit": "WhatsApp ile Gönder & Teklif Al",

      // Cases & Compare
      "cases-subtitle": "Fikirden Canlı Ürüne",
      "cases-title": "Geliştirdiğimiz Başarı Hikayeleri",
      "cases-desc": "Müşterilerimizin fikirlerini ve kilitlenen teknik süreçlerini nasıl yüksek performanslı canlı ürünlere dönüştürdük?",
      "compare-subtitle": "Neden Bizi Seçmelisiniz?",
      "compare-title": "Geleneksel Hantal Ajanslar vs. TMA Modeli",
      "compare-desc": "Aracıların ve bitmeyen toplantıların maliyetini değil, doğrudan kıdemli mühendisliğin hızını satın alın.",
      "cmp-feature": "Kriter / Özellik",
      "cmp-tma": "🚀 TMA Full-Stack Mühendislik",
      "cmp-trad": "❌ Geleneksel Hantal Ajanslar",

      // Testimonials & Social
      "testimonials-subtitle": "Müşteri & Öğrenci Deneyimleri",
      "testimonials-title": "Bizimle Çalışanlar Ne Diyor?",
      "testimonials-desc": "Geliştirdiğimiz yazılım projelerinden ve eğitim programlarımızdan gelen geri bildirimler.",
      "tech-band-label": "Kullandığımız Teknolojiler & Araçlar",
      "github-subtitle": "Açık Kaynak Kodlu Projelerimiz",
      "github-title": "GitHub Yetenek Havuzumuz",
      "github-desc": "Yazılım yeteneklerimizi ve trading algoritmalarımızı sergilediğimiz açık kaynak projelerimiz. Canlı API verisi çekilmektedir.",
      "github-loading": "Projeler yükleniyor...",
      "github-view-profile": "GitHub Profilimizi İnceleyin",
      "blog-subtitle": "Yayınlarımız & Makalelerimiz",
      "blog-title": "Son LinkedIn Paylaşımlarımız",
      "blog-desc": "Modern yazılım mimarisi, SaaS geliştirme süreçleri ve algoritmik sistemler üzerine analizlerimiz.",
      "blog-loading": "Makaleler yükleniyor...",
      "blog-view-profile": "Bizi LinkedIn'de Takip Edin",

      // Contact & Footer
      "contact-subtitle": "Doğrudan İletişim",
      "contact-title": "Projenizi Birlikte Hayata Geçirelim",
      "contact-desc": "Web, SaaS, hata düzeltme veya bot geliştirme talepleriniz için doğrudan iletişime geçebilirsiniz. İzmir Konak merkezli ofisimizde veya online kanallardan 7/24 hizmetinizdeyiz.",
      "contact-wa": "1. WhatsApp & Telefon",
      "contact-email": "Kurumsal E-Posta",
      "form-title": "Hızlı Proje Talep Formu",
      "form-label-name": "Adınız Soyadınız",
      "form-placeholder-name": "Örn. Ahmet Yılmaz",
      "form-label-email": "E-Posta Adresiniz",
      "form-placeholder-email": "Örn. ahmet@example.com",
      "form-label-phone": "Telefon Numaranız",
      "form-placeholder-phone": "Örn. 0532 XXXXXXX",
      "form-label-msg": "Projeniz / Çözüm Bekleyen Sorununuz",
      "form-placeholder-msg": "Web, SaaS, acil hata düzeltmesi veya bot talebiniz hakkında kısaca bilgi verin...",
      "form-submit": "WhatsApp ile Mehmet Şahin'e İlet",
      "footer-desc": "Modern web ve SaaS mimarileri, yüksek performanslı kod çözümleri, yapay zeka entegrasyonları ve algoritmik yazılım mühendisliğinde güvenilir çözüm ortağınız.",
      "footer-quick": "Hızlı Linkler",
      "footer-legal-title": "Güvence & Şeffaflık",
      "footer-legal-desc": "TMA bünyesinde geliştirilen tüm yazılımlar tam kaynak kod mülkiyeti ile teslim edilir. Eğitimler ve teknik analiz yazılımları yatırım danışmanlığı kapsamında değildir.",
      "footer-copy": "© 2026 Trend Master Akademi. Kurucu: Mehmet Şahin. Tüm Hakları Saklıdır.",
      "fab-tooltip": "Doğrudan Mehmet Şahin ile Konuşun!",
      "sticky-wa": "WhatsApp ile Yazın",
      "sticky-calc": "Teklif Al"
    },
    en: {
      "site-title": "Trend Master Akademi | Elite Full-Stack Engineering & Digital Product Studio",
      "about-site-title": "About Us & Engineering Vision | Trend Master Akademi",
      
      // Navbar
      "logo-text": "TREND MASTER AKADEMİ",
      "nav-home": "Home",
      "nav-solutions": "Solutions",
      "nav-wizard": "Project Estimator",
      "nav-cases": "Case Studies",
      "nav-about": "Academy & About",
      "nav-contact": "Contact",
      "nav-btn-start": "Start Project",
      
      // Hero
      "hero-typewriter-default": "From Idea to Scaled Web & SaaS Products",
      "hero-title": "From Idea to Scale: <span class='hero-title-highlight'>Modern Web, SaaS & Full-Stack Architecture</span>",
      "hero-desc": "Building high-performance web applications and SaaS platforms from scratch, resolving critical code bottlenecks, AI/API integrations, and algorithmic systems. Direct senior engineer guarantee with zero agency fluff.",
      "btn-hero-wizard": "Explain Your Project / Issue",
      "btn-hero-whatsapp": "Chat Directly on WhatsApp",
      
      // Engineering Deck
      "deck-tab-arch": "SaaS Architecture",
      "deck-tab-debug": "Live Terminal & Code",
      "deck-tab-algo": "Algo & Bot Engine",
      "metric-delivery": "Clean Code Guarantee",
      "metric-api": "Average API Response",
      "metric-test": "TDD & Test Coverage",
      "debug-status-fixed": "✓ ALL TESTS PASSING",

      // Trust Bar
      "trust-1-title": "10+ Years Experience",
      "trust-1-desc": "Senior Full-Stack Engineering",
      "trust-2-title": "100% Delivery Guarantee",
      "trust-2-desc": "Clean, Documented & Owned Code",
      "trust-3-title": "< 0.5s Fast Loading",
      "trust-3-desc": "SEO & Ads Conversion Optimized",
      "trust-4-title": "Direct Senior Partner",
      "trust-4-desc": "Zero Agency Bureaucracy",

      // Solutions Matrix
      "matrix-subtitle": "What Exactly Do You Need?",
      "matrix-title": "Your Engineering Solution Is Here",
      "matrix-desc": "From initial idea to live deployment, fixing stuck codebases to automated AI workflows and algorithmic trading engines.",
      "badge-web": "Ultra Fast Web",
      "m-web-title": "Modern Web & Landing Page Building",
      "m-web-desc": "High-converting, mobile-first corporate websites with 0.4s load speed designed to maximize ROI from Google & Social Ads.",
      "m-web-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Next.js, React & Modern UI Stack",
      "m-web-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> High Conversion Rate & Ads Ready",
      "m-web-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Top-Tier SEO & Core Web Vitals",
      "m-btn-select": "Start Web Project",

      "badge-saas": "Idea to Product",
      "m-saas-title": "SaaS & Custom Web Application Architecture",
      "m-saas-desc": "Turning software concepts into scalable SaaS platforms with multi-tenant auth, recurring subscription billing, and robust admin dashboards.",
      "m-saas-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Multi-tenant Architecture & Secure Auth",
      "m-saas-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Stripe, Iyzico & Global Payment Gateways",
      "m-saas-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Comprehensive Admin & Customer Portals",

      "badge-bug": "Emergency Hotfix",
      "m-bug-title": "Code Solutions & Bug Recovery",
      "m-bug-desc": "Taking over broken or stalled codebases and restoring them within 24-48 hours. Code cleaning, fixing security vulnerabilities, and database tuning.",
      "m-bug-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Critical Bug Detection & Quick Hotfix",
      "m-bug-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Database Bottleneck & Query Tuning",
      "m-bug-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Complete Refactoring & Modernization",

      "badge-ai": "Next-Gen AI",
      "m-ai-title": "AI, Webhook & Custom API Integrations",
      "m-ai-desc": "Custom LLM bots to automate internal workflows, and reliable API bridges linking CRM, ERP, payments, and fulfillment platforms.",
      "m-ai-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> OpenAI, Claude & Custom LLM Pipelines",
      "m-ai-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Webhooks & Asynchronous Event Queues",
      "m-ai-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Bidirectional Data Synchronization",

      "badge-algo": "High Precision",
      "m-algo-title": "Custom Bots & Algorithmic Engineering",
      "m-algo-desc": "TradingView Pine Script v5 indicators, Python execution bots, arbitrage algorithms, and high-frequency exchange API automation.",
      "m-algo-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Pine Script v5 Custom Indicators & Strategies",
      "m-algo-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Binance, Bybit & Global Exchange APIs",
      "m-algo-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> 24/7 Autonomous Server Execution",

      "badge-cto": "Strategic Advisory",
      "m-cto-title": "Technical Architecture & CTO Advisory",
      "m-cto-desc": "Selecting the optimal tech stack for your startup, code audits, cloud cost optimization, and end-to-end technical roadmaps.",
      "m-cto-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Architecture Design & Tech Stack Selection",
      "m-cto-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Cloud & Infrastructure Cost Reduction",
      "m-cto-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Security Audits & Code Performance Tuning",

      // Wizard
      "wizard-subtitle": "Smart Consultation & Estimator Wizard",
      "wizard-title": "Submit Your Project or Issue in 3 Steps",
      "wizard-desc": "Select your requirements to generate an instant technical brief and connect directly with Mehmet Şahin via WhatsApp.",
      "w-step1-title": "What kind of solution do you need?",
      "w-step2-title": "What is the current status of your project?",
      "w-step3-title": "Target timeline and urgency?",
      "w-sum-title": "📋 Technical Pre-Brief Summary",
      "w-sum-desc": "Automatically generated summary based on your choices:",
      "w-sum-srv": "Service Type:",
      "w-sum-stg": "Project Status:",
      "w-sum-time": "Timeline:",
      "w-sum-note-head": "💡 Senior Guarantee:",
      "w-sum-note-body": "Your request goes directly to Founder & Architect Mehmet Şahin. We provide an initial technical evaluation and roadmap within 30 minutes.",
      "w-btn-submit": "Send via WhatsApp & Get Quote",

      // Cases & Compare
      "cases-subtitle": "From Idea to Live Product",
      "cases-title": "Our Track Record & Success Stories",
      "cases-desc": "How we transformed client ideas and salvaged stalled codebases into high-performance production systems.",
      "compare-subtitle": "Why Choose TMA?",
      "compare-title": "Traditional Bloated Agencies vs. TMA Model",
      "compare-desc": "Pay for pure senior engineering velocity, not endless middleman meetings and overhead.",
      "cmp-feature": "Feature / Metric",
      "cmp-tma": "🚀 TMA Full-Stack Studio",
      "cmp-trad": "❌ Traditional Slow Agencies",

      // Testimonials & Social
      "testimonials-subtitle": "Client & Student Testimonials",
      "testimonials-title": "What Our Partners Say",
      "testimonials-desc": "Direct feedback from custom software clients and algorithmic academy graduates.",
      "tech-band-label": "Technologies & Tools We Master",
      "github-subtitle": "Open Source Repositories",
      "github-title": "GitHub Talent Pool",
      "github-desc": "Live showcase of our open-source software libraries and algorithmic tools fetched directly via GitHub API.",
      "github-loading": "Loading projects...",
      "github-view-profile": "View GitHub Profile",
      "blog-subtitle": "Insights & Publications",
      "blog-title": "Recent LinkedIn Insights",
      "blog-desc": "Our articles and breakdowns on modern software architectures, SaaS development, and algorithmic systems.",
      "blog-loading": "Loading posts...",
      "blog-view-profile": "Follow Us on LinkedIn",

      // Contact & Footer
      "contact-subtitle": "Direct Contact",
      "contact-title": "Let's Build Your Solution Together",
      "contact-desc": "Reach out directly for custom Web, SaaS, hotfix, or bot development requests. Available 24/7 online and at our İzmir Konak offices.",
      "contact-wa": "1. WhatsApp & Phone",
      "contact-email": "Official Email",
      "form-title": "Quick Project Request Form",
      "form-label-name": "Full Name",
      "form-placeholder-name": "e.g. John Doe",
      "form-label-email": "Email Address",
      "form-placeholder-email": "e.g. john@example.com",
      "form-label-phone": "Phone Number",
      "form-placeholder-phone": "e.g. +1 555 123 4567",
      "form-label-msg": "Your Project / Problem Summary",
      "form-placeholder-msg": "Tell us briefly about your web, SaaS, urgent bug fix, or custom bot needs...",
      "form-submit": "Send to Mehmet Şahin via WhatsApp",
      "footer-desc": "Your trusted partner in modern web & SaaS architectures, high-performance code debugging, AI integrations, and algorithmic software engineering.",
      "footer-quick": "Quick Links",
      "footer-legal-title": "Transparency & Guarantee",
      "footer-legal-desc": "All custom software is delivered with 100% full source code ownership. Academy materials and analysis software are not financial investment advice.",
      "footer-copy": "© 2026 Trend Master Akademi. Founder: Mehmet Şahin. All Rights Reserved.",
      "fab-tooltip": "Chat directly with Mehmet Şahin!",
      "sticky-wa": "Chat on WhatsApp",
      "sticky-calc": "Get Quote"
    }
  };

  // ==========================================
  // 2. LANGUAGE SWITCHER LOGIC
  // ==========================================
  const langBtnTr = document.getElementById('langBtnTr');
  const langBtnEn = document.getElementById('langBtnEn');
  let currentLang = localStorage.getItem('tma_lang') || 'tr';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('tma_lang', lang);
    document.documentElement.lang = lang;

    if (lang === 'tr') {
      if (langBtnTr) langBtnTr.classList.add('active');
      if (langBtnEn) langBtnEn.classList.remove('active');
    } else {
      if (langBtnEn) langBtnEn.classList.add('active');
      if (langBtnTr) langBtnTr.classList.remove('active');
    }

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key]) {
        el.setAttribute('placeholder', translations[lang][key]);
      }
    });
  }

  if (langBtnTr) langBtnTr.addEventListener('click', () => applyLanguage('tr'));
  if (langBtnEn) langBtnEn.addEventListener('click', () => applyLanguage('en'));
  applyLanguage(currentLang);


  // ==========================================
  // 3. DYNAMIC TYPEWRITER PROBLEM-SOLVER TICKER
  // ==========================================
  const typewriterElement = document.getElementById('typewriterText');
  if (typewriterElement) {
    const headlinesTr = [
      "Fikirden Canlı Ürüne SaaS ve Web Çözümleri",
      "Tıkanan Kodlar ve Canlı Hatalar İçin Acil Destek",
      "Yapay Zeka, Webhook & Özel API Entegrasyonları",
      "Özel Algoritmik Botlar ve Finansal Mühendislik",
      "Kıdemli Full-Stack Mühendis Güvencesiyle 0 Bug"
    ];
    const headlinesEn = [
      "From Idea to Scaled Web & SaaS Products",
      "Emergency Hotfixes for Stalled Codebases",
      "AI Pipelines, Webhooks & Custom API Bridges",
      "Autonomous Trading Bots & High-Frequency Logic",
      "Direct Senior Engineer Guarantee with 0 Bugs"
    ];

    let headlineIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    function typeLoop() {
      const list = currentLang === 'en' ? headlinesEn : headlinesTr;
      const currentText = list[headlineIndex % list.length];

      if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 35;
      } else {
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 65;
      }

      if (!isDeleting && charIndex === currentText.length) {
        typingSpeed = 2200; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        headlineIndex++;
        typingSpeed = 500;
      }

      setTimeout(typeLoop, typingSpeed);
    }

    setTimeout(typeLoop, 800);
  }


  // ==========================================
  // 4. INTERACTIVE 3-TAB ENGINEERING DECK
  // ==========================================
  const deckTabBtns = document.querySelectorAll('.deck-tab-btn');
  const deckPanels = document.querySelectorAll('.deck-panel');

  deckTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-deck-tab');
      
      deckTabBtns.forEach(b => b.classList.remove('active'));
      deckPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetTabId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });


  // ==========================================
  // 5. INTERACTIVE LEAD WIZARD (HESAPLAYICI)
  // ==========================================
  let wizardData = {
    service: "SaaS & Web Uygulaması",
    stage: "Sıfırdan Yeni Fikir / Proje",
    time: "Hemen / Bu Hafta Başlamak İstiyorum"
  };

  const sumService = document.getElementById('sumService');
  const sumStage = document.getElementById('sumStage');
  const sumTime = document.getElementById('sumTime');

  function bindOptionGroup(containerId, dataKey, summaryEl) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const options = container.querySelectorAll('.wizard-option');
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        const val = opt.getAttribute('data-value');
        wizardData[dataKey] = val;
        if (summaryEl) summaryEl.textContent = val;
      });
    });
  }

  bindOptionGroup('wizardServiceOptions', 'service', sumService);
  bindOptionGroup('wizardStageOptions', 'stage', sumStage);
  bindOptionGroup('wizardTimeOptions', 'time', sumTime);

  // Allow matrix cards to trigger specific wizard services
  const matrixActionBtns = document.querySelectorAll('[data-wizard-service]');
  matrixActionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const srvType = btn.getAttribute('data-wizard-service');
      const wizardServiceContainer = document.getElementById('wizardServiceOptions');
      if (wizardServiceContainer) {
        const options = wizardServiceContainer.querySelectorAll('.wizard-option');
        options.forEach(opt => {
          const val = opt.getAttribute('data-value').toLowerCase();
          if (
            (srvType === 'web' && val.includes('web')) ||
            (srvType === 'saas' && val.includes('saas')) ||
            (srvType === 'bugfix' && val.includes('bug')) ||
            (srvType === 'ai' && val.includes('yapay')) ||
            (srvType === 'algo' && val.includes('bot')) ||
            (srvType === 'cto' && val.includes('mimari'))
          ) {
            options.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            wizardData.service = opt.getAttribute('data-value');
            if (sumService) sumService.textContent = wizardData.service;
          }
        });
      }
    });
  });

  // Wizard Dispatch Button to WhatsApp
  const btnDispatchWizard = document.getElementById('btnDispatchWizard');
  if (btnDispatchWizard) {
    btnDispatchWizard.addEventListener('click', () => {
      const message = `Merhaba Mehmet Bey,\n\nTrend Master Akademi web sitenizdeki proje sihirbazından teknik bir talep oluşturmak istiyorum:\n\n📌 *İhtiyaç Duyulan Hizmet:* ${wizardData.service}\n📊 *Proje Aşaması:* ${wizardData.stage}\n⏱️ *Zaman / Öncelik:* ${wizardData.time}\n\nBu kapsamda sizinle hızlı bir ön değerlendirme ve teklif görüşmesi yapabilir miyiz?`;
      const encodedMsg = encodeURIComponent(message);
      window.open(`https://wa.me/905343713573?text=${encodedMsg}`, '_blank');
    });
  }


  // ==========================================
  // 6. CONTACT FORM DISPATCH TO WHATSAPP
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName') ? document.getElementById('formName').value : '';
      const email = document.getElementById('formEmail') ? document.getElementById('formEmail').value : '';
      const phone = document.getElementById('formPhone') ? document.getElementById('formPhone').value : '';
      const msg = document.getElementById('formMsg') ? document.getElementById('formMsg').value : '';

      const fullMessage = `Merhaba Mehmet Bey,\n\nWeb sitenizdeki iletişim formundan yeni bir talep gönderiyorum:\n\n👤 *Ad Soyad:* ${name}\n📧 *E-Posta:* ${email}\n📞 *Telefon:* ${phone}\n💬 *Talep Detayı:* ${msg}\n\nDetayları görüşmek üzere dönüşünüzü rica ederim.`;
      const encodedMsg = encodeURIComponent(fullMessage);
      window.open(`https://wa.me/905343713573?text=${encodedMsg}`, '_blank');
    });
  }


  // ==========================================
  // 7. CHART SIMULATOR (ALGO BOT CANVAS)
  // ==========================================
  const canvas = document.getElementById('chartCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let candles = [];
    const candleCount = 45;
    let basePrice = 100;
    
    function resizeCanvas() {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight || 300;
      canvas.width = width;
      canvas.height = height;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function initCandles() {
      candles = [];
      let current = basePrice;
      for (let i = 0; i < candleCount; i++) {
        const change = (Math.random() - 0.48) * 3;
        const open = current;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * 2;
        const low = Math.min(open, close) - Math.random() * 2;
        candles.push({ open, close, high, low });
        current = close;
      }
    }
    initCandles();

    function drawChart() {
      if (!width || !height) {
        resizeCanvas();
        if (!width) return requestAnimationFrame(drawChart);
      }

      ctx.clearRect(0, 0, width, height);

      // Draw Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let y = 40; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const minPrice = Math.min(...candles.map(c => c.low)) - 2;
      const maxPrice = Math.max(...candles.map(c => c.high)) + 2;
      const priceRange = maxPrice - minPrice || 1;

      const candleWidth = (width / candleCount) * 0.65;
      const spacing = width / candleCount;

      candles.forEach((c, idx) => {
        const x = idx * spacing + spacing / 2;
        const openY = height - ((c.open - minPrice) / priceRange) * height;
        const closeY = height - ((c.close - minPrice) / priceRange) * height;
        const highY = height - ((c.high - minPrice) / priceRange) * height;
        const lowY = height - ((c.low - minPrice) / priceRange) * height;

        const isBull = c.close >= c.open;
        const color = isBull ? '#00e676' : '#ff1744';

        // Draw Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();

        // Draw Body
        ctx.fillStyle = color;
        const bodyY = Math.min(openY, closeY);
        const bodyHeight = Math.max(Math.abs(closeY - openY), 2);
        ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
      });

      // Overlay status tag
      ctx.fillStyle = 'rgba(0, 229, 255, 0.85)';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('⚡ ALGO ENGINE: LIVE SIGNAL [CONFIRMED]', 20, 30);
    }

    // Step chart smoothly
    setInterval(() => {
      const lastCandle = candles[candles.length - 1];
      const change = (Math.random() - 0.47) * 2.8;
      const open = lastCandle.close;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * 1.5;
      const low = Math.min(open, close) - Math.random() * 1.5;

      candles.shift();
      candles.push({ open, close, high, low });
      drawChart();
    }, 1200);

    drawChart();
  }


  // ==========================================
  // 8. TESTIMONIALS CAROUSEL
  // ==========================================
  const testimonials = [
    {
      name: "Burak Yılmaz",
      role: "SaaS Kurucusu & E-Ticaret Girişimcisi",
      text: "Fikir aşamasındaki SaaS platformumuzu Mehmet Bey ile 40 günde canlıya aldık. Kod kalitesi, Stripe entegrasyonu ve sıfır hata politikası gerçekten Türkiye'de nadir bulunan bir senior mühendislik seviyesi.",
      rating: 5
    },
    {
      name: "Canan Erdem",
      role: "Pazarlama Ajansı Başkanı",
      text: "Google Ads açılış hızlarımız berbattı ve reklam bütçemiz eriyordu. TMA ile web sitemizi baştan inşa ettik; açılış hızı 0.35 saniyeye indi ve dönüşüm oranımız 3 katına çıktı. Emeğinize sağlık!",
      rating: 5
    },
    {
      name: "Murat Demir",
      role: "Finansal Analist & Bot Geliştirici",
      text: "TradingView ve Pine Script v5 mentörlüğü sayesinde stratejilerimi kendi algoritmik botlarıma dönüştürdüm. Mehmet Bey sadece kodlamayı değil, arkasındaki matematiksel mimariyi öğretiyor.",
      rating: 5
    },
    {
      name: "Serdar Koç",
      role: "Teknoloji Direktörü (CTO)",
      text: "Kilitlenen veritabanı sorgularımız ve çöken backend servislerimiz için acil müdahale aldık. 24 saat içinde sorunu kökünden çözüp tüm sistemi temizlediler. Kesinlikle tavsiye ederim.",
      rating: 5
    }
  ];

  const carousel = document.getElementById('testimonialsCarousel');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  let currentTestimonialIndex = 0;

  function renderTestimonials() {
    if (!carousel) return;
    carousel.innerHTML = '';
    
    testimonials.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `testimonial-card ${index === currentTestimonialIndex ? 'active' : ''}`;
      
      let stars = '';
      for (let i = 0; i < item.rating; i++) {
        stars += `<svg width="16" height="16" viewBox="0 0 24 24" fill="#ffbd2e" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
      }

      card.innerHTML = `
        <div class="testimonial-stars" style="display: flex; gap: 4px; margin-bottom: 16px;">${stars}</div>
        <p class="testimonial-text" style="font-size: 1rem; color: var(--text-main); line-height: 1.7; margin-bottom: 20px; font-style: italic;">"${item.text}"</p>
        <div class="testimonial-author">
          <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--accent-blue); margin-bottom: 2px;">${item.name}</h4>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${item.role}</span>
        </div>
      `;
      carousel.appendChild(card);
    });
  }

  function showTestimonial(index) {
    currentTestimonialIndex = (index + testimonials.length) % testimonials.length;
    renderTestimonials();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => showTestimonial(currentTestimonialIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showTestimonial(currentTestimonialIndex + 1));
  renderTestimonials();

  // Auto rotate testimonials
  setInterval(() => {
    showTestimonial(currentTestimonialIndex + 1);
  }, 7000);


  // ==========================================
  // 9. GITHUB REPOSITORIES LIVE LOADER
  // ==========================================
  const githubContainer = document.getElementById('githubReposContainer');
  if (githubContainer) {
    fetch('https://api.github.com/users/trendmasterakademi/repos?sort=updated&per_page=6')
      .then(res => res.json())
      .then(repos => {
        if (Array.isArray(repos) && repos.length > 0) {
          githubContainer.innerHTML = '';
          repos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'matrix-card';
            card.style.padding = '24px';
            card.innerHTML = `
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <span style="font-family: monospace; font-size: 0.8rem; color: var(--accent-blue);">📦 GitHub Repo</span>
                  <span style="font-size: 0.75rem; color: var(--accent-green); font-weight: 700;">★ ${repo.stargazers_count || 0} Stars</span>
                </div>
                <h4 style="font-size: 1.1rem; margin-bottom: 8px;">${repo.name}</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px;">
                  ${repo.description || 'Trend Master Akademi açık kaynak kodlu mühendislik ve bot projesi.'}
                </p>
              </div>
              <a href="${repo.html_url}" target="_blank" class="matrix-action-btn" style="margin-top: 10px;">
                <span>Kodu İncele</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </a>
            `;
            githubContainer.appendChild(card);
          });
        } else {
          githubContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">
              Açık kaynak projelerimizi GitHub profilimiz üzerinden doğrudan inceleyebilirsiniz.
            </div>
          `;
        }
      })
      .catch(() => {
        githubContainer.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">
            Açık kaynak projelerimizi GitHub profilimiz üzerinden doğrudan inceleyebilirsiniz.
          </div>
        `;
      });
  }


  // ==========================================
  // 10. LINKEDIN ARTICLES LOADER
  // ==========================================
  const blogContainer = document.getElementById('blogContainer');
  if (blogContainer) {
    fetch('articles.json')
      .then(res => res.json())
      .then(articles => {
        if (Array.isArray(articles) && articles.length > 0) {
          blogContainer.innerHTML = '';
          articles.slice(0, 3).forEach(art => {
            const card = document.createElement('div');
            card.className = 'matrix-card';
            card.style.padding = '24px';
            card.innerHTML = `
              <div>
                <span style="font-size: 0.75rem; color: var(--accent-blue); font-weight: 700; display: block; margin-bottom: 8px;">ARTICLE & INSIGHT</span>
                <h4 style="font-size: 1.15rem; margin-bottom: 10px;">${art.title}</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px;">
                  ${art.summary || (art.content ? art.content.substring(0, 120) + '...' : '')}
                </p>
              </div>
              <a href="${art.url || 'https://www.linkedin.com/in/trendmasterakademi/'}" target="_blank" class="matrix-action-btn">
                <span>LinkedIn'de Oku</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </a>
            `;
            blogContainer.appendChild(card);
          });
        } else {
          blogContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">
              En güncel yayınlarımızı ve yazılım analizlerimizi LinkedIn profilimizden takip edebilirsiniz.
            </div>
          `;
        }
      })
      .catch(() => {
        blogContainer.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">
            En güncel yayınlarımızı ve yazılım analizlerimizi LinkedIn profilimizden takip edebilirsiniz.
          </div>
        `;
      });
  }


  // ==========================================
  // 11. NAVBAR SCROLL & MOBILE MENU
  // ==========================================
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      if (header) header.classList.add('scrolled');
      if (backToTop) backToTop.classList.add('visible');
    } else {
      if (header) header.classList.remove('scrolled');
      if (backToTop) backToTop.classList.remove('visible');
    }
  });

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
