document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. TRANSLATION DICTIONARY (i18n)
  // ==========================================
  const translations = {
    tr: {
      "site-title": "Trend Master Akademi | Finansal Teknolojiler & Özel Yazılım Çözümleri",
      "about-site-title": "Teknoloji Stratejileri & Hakkımızda | Trend Master Akademi",
      
      // Navbar
      "logo-text": "TREND MASTER AKADEMİ",
      "nav-home": "Ana Sayfa",
      "nav-about": "Eğitim & Hakkımızda",
      "nav-services": "Hizmetler",
      "nav-contact": "İletişim",
      "nav-btn": "Randevu Al",
      
      // Hero
      "hero-badge": "Finansal Teknolojiler & Yazılım Çözümleri",
      "hero-title": "Geleceğin Finansal ve Yazılım Teknolojilerini İnşa Ediyoruz",
      "hero-desc": "Yüksek performanslı algoritmik trading botlarından, modern web ve mobil uygulamalara kadar uzanan geniş bir yelpazede yenilikçi yazılım çözümleri ve profesyonel eğitimler sunuyoruz.",
      "btn-explore": "Çözümleri İncele",
      "btn-contact": "Bizimle İletişime Geç",
      "ticker-status": "CANLI SİMÜLASYON",
      
      // Services
      "services-subtitle": "Neler Sunuyoruz?",
      "services-title": "Teknoloji ve Yazılım Hizmetlerimiz",
      "services-desc": "İşinizi ve yatırımlarınızı bir üst seviyeye taşımak için geliştirilen özel yazılım çözümleri, trading sistemleri ve eğitim programları.",
      
      // Service Tabs
      "tab-fintech-title": "Finansal Teknolojiler",
      "tab-software-title": "Yazılım Çözümleri",
      
      // Product Cards
      "card-algo-title": "Algoritmik Trading Botları",
      "card-algo-desc": "Pine Script ve Python tabanlı stratejilerinizi tam otomatik botlara dönüştürüyoruz. Sizin belirlediğiniz kurallarla 7/24 kesintisiz işlem disiplini sağlayın.",
      "card-algo-feat1": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Pine Script & Python Entegrasyonu",
      "card-algo-feat2": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Geriye Dönük Test (Backtest) Optimizasyonu",
      "card-algo-feat3": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Webhook ve Borsa API Bağlantıları",
      
      "card-ind-title": "Özel Teknik İndikatörler",
      "card-ind-desc": "Karmaşık piyasa verilerini basitleştiren, trend yönünü ve hacim onaylarını tek bir panelde birleştiren özel formüllü indikatör setleri hazırlıyoruz.",
      "card-ind-feat1": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Çoklu Zaman Dilimi (MTF) Filtreleme",
      "card-ind-feat2": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Gecikmesiz Sinyal Doğrulama Motoru",
      "card-ind-feat3": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Özelleştirilebilir Canlı Alarm Yapısı",
      
      "card-ment-title": "Birebir Mentörlük Programı",
      "card-ment-desc": "Price Action, Smart Money Concepts ve sistemli risk yönetimi metodolojilerini baştan sona uygulamalı olarak öğreten profesyonel eğitim serisi.",
      "card-ment-feat1": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Kişiye Özel İlerleme Planı ve Takip",
      "card-ment-feat2": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Canlı Piyasa Analizi ve Backtest Pratikleri",
      "card-ment-feat3": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Kasa & Risk Yönetimi Metrik Şablonları",

      "card-web-title": "Web & SaaS Geliştirme",
      "card-web-desc": "Modern, hızlı, SEO uyumlu web uygulamaları ve SaaS platformları geliştiriyoruz. En son web teknolojilerini işinizle buluşturuyoruz.",
      "card-web-feat1": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> React, Next.js ve Tailwind CSS Altyapısı",
      "card-web-feat2": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> REST & GraphQL API Tasarımları",
      "card-web-feat3": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Güvenli Üyelik, Abonelik ve Ödeme Sistemleri",
      
      "card-mobile-title": "Mobil Uygulama Geliştirme",
      "card-mobile-desc": "iOS ve Android platformlarında yüksek performanslı, kullanıcı dostu native veya hibrit mobil uygulamalar tasarlıyoruz.",
      "card-mobile-feat1": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Flutter ile Tek Kod Tabanından Hızlı Geliştirme",
      "card-mobile-feat2": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Push Bildirimleri ve Biyometrik Entegrasyonlar",
      "card-mobile-feat3": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> App Store ve Google Play Store Yayın Süreçleri",
      
      "card-api-title": "Entegrasyon & Özel API Çözümleri",
      "card-api-desc": "Sistemlerinizi birbirine bağlayan, veri akışını otomatikleştiren ve iş süreçlerini hızlandıran özel arka uç sistemleri kuruyoruz.",
      "card-api-feat1": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Node.js, Python ve Go ile Güçlü Backend Yapıları",
      "card-api-feat2": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Webhook Entegrasyonları ve Veri Tabanı Optimizasyonu",
      "card-api-feat3": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Bulut Altyapı Dağıtımı ve Mesajlaşma Kuyrukları",

      "card-btn-info": "Detaylı Bilgi Al",
      "card-btn-mufredat": "Müfredatı İncele",
      
      // GitHub Section
      "github-subtitle": "Açık Kaynak Kodlu Projelerimiz",
      "github-title": "GitHub Yetenek Havuzumuz",
      "github-desc": "Yazılım yeteneklerimizi ve trading algoritmalarımızı sergilediğimiz açık kaynak projelerimiz. Canlı API verisi çekilmektedir.",
      "github-loading": "Projeler yükleniyor...",
      "github-error": "Projeler yüklenirken hata oluştu. Lütfen daha sonra tekrar deneyin.",
      "github-view-profile": "GitHub Profilimizi İnceleyin",
      
      // Blog/Publications Section
      "blog-subtitle": "Yayınlarımız & Makalelerimiz",
      "blog-title": "Son LinkedIn Paylaşımlarımız",
      "blog-desc": "Finansal piyasalar, algoritmik trading ve Pine Script üzerine en güncel analizlerimiz ve makalelerimiz.",
      "blog-loading": "Makaleler yükleniyor...",
      "blog-error": "Makaleler yüklenirken hata oluştu. Lütfen daha sonra tekrar deneyin.",
      "blog-view-profile": "Bizi LinkedIn'de Takip Edin",
      
      // CTA Banner
      "cta-unsure": "Kararsız mı kaldınız?",
      "cta-desc": "Eğitim sistemimizi ve stratejilerimizi yakından tanımak için ücretsiz bir tanışma dersi planlayabilirsiniz.",
      "cta-btn": "Ücretsiz İlk Ders Randevusu Al",
      
      // Contact Section
      "contact-subtitle": "Bize Ulaşın",
      "contact-title": "Geleceğinizi Birlikte Kodlayalım",
      "contact-desc": "Eğitim içerikleri, yazılım talepleri veya indikatör siparişleri hakkında bilgi almak için formu doldurabilir ya da doğrudan destek kanallarımızdan bize yazabilirsiniz.",
      "contact-wa": "WhatsApp Destek Hattı",
      "contact-wa-sub": "Hemen Yazın (Canlı Destek)",
      "contact-email": "E-Posta Adresi",
      
      // Contact Form Labels & Placeholders
      "form-label-name": "Adınız Soyadınız",
      "form-label-email": "E-Posta Adresiniz",
      "form-label-phone": "Telefon Numaranız",
      "form-label-msg": "Mesajınız / Talep Detayları",
      "form-placeholder-name": "Örn. Ahmet Yılmaz",
      "form-placeholder-email": "Örn. ahmet@example.com",
      "form-placeholder-phone": "Örn. 0532 XXXXXXX",
      "form-placeholder-msg": "Hangi eğitim veya yazılım paketiyle ilgilendiğinizi belirtebilirsiniz...",
      "form-submit": "WhatsApp ile Gönder / Başvur",
      
      // Footer
      "footer-desc": "Finansal okuryazarlık ve trading yazılımlarının yanı sıra modern web, mobil ve entegrasyon çözümleriyle işinizi geleceğe taşıyan profesyonel teknoloji akademisi ve yazılım evi.",
      "footer-quick": "Hızlı Linkler",
      "footer-warning-title": "Yasal Uyarı",
      "footer-warning-desc": "Trend Master Akademi bünyesinde verilen eğitimler, hazırlanan yazılımlar ve paylaşılan indikatör sinyalleri kesinlikle yatırım danışmanlığı kapsamında değildir. Finansal piyasalar yüksek risk içerir.",
      "footer-copy": "© 2026 Trend Master Akademi. Tüm Hakları Saklıdır.",
      
      // About Page Intro
      "about-badge": "Eğitim Metodolojimiz",
      "about-title": "Eğitim & Hakkımızda",
      "about-breadcrumb-home": "Ana Sayfa",
      "about-breadcrumb-current": "Eğitim & Hakkımızda",
      "about-intro-title": "Piyasalarda Uzmanlaşmak İçin Profesyonel Eğitim Stratejileri",
      "about-intro-desc": "Trend Master Akademi, finansal piyasaların karmaşık yapısını anlaşılır, matematiksel ve test edilebilir stratejilerle basitleştirir. Hedefimiz, yüksek kazanç vaatlerinin arkasından gitmek yerine, yatırımcılara kendi stratejilerini tasarlayabilecek ve uygulayabilecek teknik donanımı kazandırmaktır.",
      "about-warn-box": "Unutmayın, piyasalarda yüksek kazanç vaadi değil, sadece disiplinli eğitim kazandırır.",
      
      // About Page Pillars
      "about-pillars-subtitle": "Başarımızın Sırrı",
      "about-pillars-title": "Eğitimimizin 4 Temel Sütunu",
      "about-pillars-desc": "Müfredatımız, finansal piyasalarda kalıcı ve sürdürülebilir başarı elde etmek için gerekli tüm disiplinleri kapsar.",
      "pillar1-title": "Piyasa Yapısı ve Stratejik Yaklaşımlar",
      "pillar1-desc": "Grafikleri okumayı ve büyük oyuncuların izlerini takip etmeyi öğrenin.",
      "pillar1-f1": "Trend Takipçiliği Metotları",
      "pillar1-f2": "Price Action (Mum Formasyonları, S/R, MSB)",
      "pillar1-f3": "Kurumsal Yaklaşım (ICT, SMC, Order Block, FVG)",
      
      "pillar2-title": "Risk ve Kasa Yönetimi",
      "pillar2-desc": "Sermayenizi korumayı ve matematiksel olarak büyütmeyi kavrayın.",
      "pillar2-f1": "Risk/Reward (R:R) Oranları (1:2 - 1:3 Kuralları)",
      "pillar2-f2": "İşlem Başına Maksimum %1-2 Risk Kuralları",
      "pillar2-f3": "Matematiksel Metrikler ve İlerleme Takibi",
      
      "pillar3-title": "İndikatörler ve Teknik Onay",
      "pillar3-desc": "Matematiksel onay mekanizmaları ile işlemlerin başarı oranını artırın.",
      "pillar3-f1": "RSI, EMA ve MACD Doğru Kombinasyonları",
      "pillar3-f2": "Pine Script ile Backtest ve Strateji Otomasyonu",
      "pillar3-f3": "Sinyal Filtreleme ve Yanıltıcı Sinyallerden Kaçınma",
      
      "pillar4-title": "Yatırımcı Psikolojisi ve Disiplin",
      "pillar4-desc": "Sisteminize sadık kalarak duygularınızı yönetmeyi öğrenin.",
      "pillar4-f1": "FOMO (Fırsatı Kaçırma Korkusu) Yönetimi",
      "pillar4-f2": "İntikam İşlemlerinden Kaçınma Disiplini",
      "pillar4-f3": "Ticaret Günlüğü (Journaling) Oluşturma Rutinleri",
      
      "about-cta-title": "Birlikte Başaralım",
      "about-cta-desc": "Eğitim müfredatımız ve size en uygun birebir mentörlük saatleri hakkında detaylı bilgi almak için bizimle iletişime geçin.",
      "about-cta-btn1": "İletişim Formuna Git",
      "about-cta-btn2": "WhatsApp Destek",

      // Statistics Section
      "stat-hours": "Saat Eğitim İçeriği",
      "stat-students": "Özel Yazılım Projesi",
      "stat-bots": "Bot & İndikatör Projesi",
      "stat-satisfaction": "Sistem Çalışma Süresi (Uptime)",

      // Testimonials Section
      "testimonials-subtitle": "Öğrenci & İş Ortağı Görüşleri",
      "testimonials-title": "Birlikte Çalıştığımız Kişi ve Kurumların Görüşleri",
      "testimonials-desc": "Eğitim programlarımızdan mezun olan yatırımcıların ve yazılım çözümlerimizi kullanan iş ortaklarımızın deneyimleri.",
      "testimonial1-text": '"Pine Script konusunda sıfırdan başladım. 3 ay sonra kendi indikatörümü yazıp TradingView\'da yayınladım. Eğitim metodolojisi gerçekten çok sistematik ve anlaşılır."',
      "testimonial1-name": "Ahmet K.",
      "testimonial1-role": "Bireysel Yatırımcı — Pine Script Eğitimi",
      "testimonial2-text": '"Risk yönetimi eğitimi hayatımı değiştirdi. Eskiden duygusal işlem yapıyordum, şimdi her pozisyonumda %1 risk kuralını uyguluyorum. Kayıplarım dramatik şekilde azaldı."',
      "testimonial2-name": "Selin Y.",
      "testimonial2-role": "Forex Trader — Mentörlük Programı",
      "testimonial3-text": '"Algoritmik trading botumu TMA ekibiyle birlikte geliştirdik. Strateji mantığından API entegrasyonuna kadar her adımda profesyonel destek aldım. Şimdi botum 7/24 çalışıyor."',
      "testimonial3-name": "Mehmet E.",
      "testimonial3-role": "Kripto Trader — Bot Geliştirme",
      "testimonial4-text": '"Smart Money Concepts eğitimi sayesinde piyasaya bakış açım tamamen değişti. Order Block ve FVG kavramlarını gerçek işlemlere nasıl uygulayacağımı artık çok iyi biliyorum."',
      "testimonial4-name": "Deniz T.",
      "testimonial4-role": "BIST Trader — SMC Eğitimi",
      "testimonial5-text": '"Şirketimizin SaaS platformunu sıfırdan kurdular. Hem ölçeklenebilir backend yapısı hem de harika çalışan modern arayüz tasarımı ile beklentilerimizin çok ötesinde bir iş teslim ettiler."',
      "testimonial5-name": "Hakan B.",
      "testimonial5-role": "CEO — Fintech SaaS Projesi",
      "testimonial6-text": '"Mobil uygulamamızın borsa entegrasyonu ve canlı veri akışındaki gecikmeleri çözmek için TMA ile çalıştık. Webhook ve API optimizasyonları sayesinde veri gecikmesini neredeyse sıfıra indirdik."',
      "testimonial6-name": "Zeynep A.",
      "testimonial6-role": "CTO — Yatırım Teknolojileri Firması",

      // Tech Band
      "tech-band-label": "Kullandığımız Teknolojiler",

      // WhatsApp FAB Tooltip
      "fab-tooltip": "Bize WhatsApp'tan yazın!"
    },
    en: {
      "site-title": "Trend Master Academy | Financial Technologies & Custom Software Solutions",
      "about-site-title": "Technology Strategies & About Us | Trend Master Academy",
      
      // Navbar
      "logo-text": "TREND MASTER ACADEMY",
      "nav-home": "Home",
      "nav-about": "Education & About",
      "nav-services": "Services",
      "nav-contact": "Contact",
      "nav-btn": "Book Session",
      
      // Hero
      "hero-badge": "FinTech & Custom Software Solutions",
      "hero-title": "Building the Future of Financial and Software Technologies",
      "hero-desc": "We deliver innovative technology solutions and professional courses, ranging from high-performance algorithmic trading bots to modern web & mobile applications.",
      "btn-explore": "Explore Solutions",
      "btn-contact": "Get in Touch",
      "ticker-status": "LIVE SIMULATION",
      
      // Services
      "services-subtitle": "What We Offer",
      "services-title": "Our Technology & Software Services",
      "services-desc": "Custom software solutions, automated trading systems, and training programs designed to elevate your business and investments.",
      
      // Service Tabs
      "tab-fintech-title": "Financial Tech",
      "tab-software-title": "Software Solutions",
      
      // Product Cards
      "card-algo-title": "Algorithmic Trading Bots",
      "card-algo-desc": "We convert your Pine Script and Python based strategies into fully automated trading bots. Maintain 24/7 trading discipline with rules defined by you.",
      "card-algo-feat1": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Pine Script & Python Integration",
      "card-algo-feat2": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Backtesting & Optimization Setup",
      "card-algo-feat3": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Webhook and Exchange API Connections",
      
      "card-ind-title": "Custom Technical Indicators",
      "card-ind-desc": "We develop custom technical indicators that simplify complex market data, merging trend directions and volume confirmations into a single panel.",
      "card-ind-feat1": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Multi-Timeframe (MTF) Filtering",
      "card-ind-feat2": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Zero Lag Signal Confirmation Engine",
      "card-ind-feat3": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Customizable Live Alert Systems",
      
      "card-ment-title": "1-on-1 Mentorship Program",
      "card-ment-desc": "An intensive professional mentoring program teaching Price Action, Smart Money Concepts, and systematic risk management practices from scratch.",
      "card-ment-feat1": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Personalized Progress Tracking",
      "card-ment-feat2": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Live Market Analysis & Backtests",
      "card-ment-feat3": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Risk & Portfolio Management Metric Sheets",

      "card-web-title": "Web & SaaS Development",
      "card-web-desc": "We build fast, secure, modern, and SEO-friendly web applications and SaaS platforms, bringing the latest tech to your business.",
      "card-web-feat1": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> React, Next.js, and Tailwind CSS Stack",
      "card-web-feat2": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> High-Performance REST & GraphQL API Design",
      "card-web-feat3": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Secure Auth, Subscription & Payment Flows",
      
      "card-mobile-title": "Mobile App Development",
      "card-mobile-desc": "We design and develop high-performance, user-friendly native or hybrid mobile apps running flawlessly on iOS and Android.",
      "card-mobile-feat1": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Cross-Platform Dev with Flutter & React Native",
      "card-mobile-feat2": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Push Notification & Biometric Auth Integration",
      "card-mobile-feat3": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> App Store & Google Play Store Publishing",
      
      "card-api-title": "Integration & Custom APIs",
      "card-api-desc": "We connect systems, automate complex data flows, and build robust backend engines to streamline your business workflows.",
      "card-api-feat1": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Strong Backend with Node.js, Python, and Go",
      "card-api-feat2": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Webhooks Integration & DB Performance Tuning",
      "card-api-feat3": "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Cloud Architecture Deployment & Message Queues",

      "card-btn-info": "Get Details",
      "card-btn-mufredat": "View Syllabus",
      
      // GitHub Section
      "github-subtitle": "Our Open Source Projects",
      "github-title": "GitHub Talent Pool",
      "github-desc": "Open source projects where we demonstrate our programming skills and trading algorithms. Live API data is retrieved.",
      "github-loading": "Loading repositories...",
      "github-error": "Failed to load projects. Please try again later.",
      "github-view-profile": "View Our GitHub Profile",
      
      // Blog/Publications Section
      "blog-subtitle": "Our Publications & Articles",
      "blog-title": "Our Latest LinkedIn Posts",
      "blog-desc": "Our latest analyses and articles on financial markets, algorithmic trading, and Pine Script.",
      "blog-loading": "Loading articles...",
      "blog-error": "Failed to load articles. Please try again later.",
      "blog-view-profile": "Follow Us on LinkedIn",
      
      // CTA Banner
      "cta-unsure": "Still Undecided?",
      "cta-desc": "You can schedule a free introductory session to get to know our education system and strategies up close.",
      "cta-btn": "Book a Free First Session",
      
      // Contact Section
      "contact-subtitle": "Get in Touch",
      "contact-title": "Let's Code Your Future Together",
      "contact-desc": "Fill out the contact form or message us directly via our support channels to inquire about course curriculum, custom indicator orders, or bot integrations.",
      "contact-wa": "WhatsApp Support Line",
      "contact-wa-sub": "Chat Now (Live Help)",
      "contact-email": "E-Mail Address",
      
      // Contact Form Labels & Placeholders
      "form-label-name": "Your Name",
      "form-label-email": "Your Email",
      "form-label-phone": "Your Phone Number",
      "form-label-msg": "Your Message / Request Details",
      "form-placeholder-name": "e.g. John Doe",
      "form-placeholder-email": "e.g. john@example.com",
      "form-placeholder-phone": "e.g. +1 (555) 000-0000",
      "form-placeholder-msg": "Please specify which training program or software package you are interested in...",
      "form-submit": "Send / Apply via WhatsApp",
      
      // Footer
      "footer-desc": "A professional technology academy and software house empowering your business with modern web, mobile, and integration solutions alongside financial trading systems.",
      "footer-quick": "Quick Links",
      "footer-warning-title": "Disclaimer",
      "footer-warning-desc": "Trading education, indicators, and software provided by Trend Master Academy are not investment advice. Financial markets involve significant capital risks.",
      "footer-copy": "© 2026 Trend Master Academy. All Rights Reserved.",
      
      // About Page Intro
      "about-badge": "Our Methodology",
      "about-title": "Education & About Us",
      "about-breadcrumb-home": "Home",
      "about-breadcrumb-current": "Education & About Us",
      "about-intro-title": "Professional Education Strategies to Master the Markets",
      "about-intro-desc": "Trend Master Academy simplifies the complex nature of financial markets through structured, mathematical, and testable strategies. Our target is not chasing empty profit guarantees, but empowering traders to develop, test, and run their own strategies independently.",
      "about-warn-box": "Remember, not promises of high profits, but only disciplined education will make you win.",
      
      // About Page Pillars
      "about-pillars-subtitle": "Secret to Our Success",
      "about-pillars-title": "4 Pillars of Our Methodology",
      "about-pillars-desc": "Our comprehensive curriculum covers all crucial aspects of modern trading to establish long-term consistency.",
      "pillar1-title": "Market Structure & Strategic Approaches",
      "pillar1-desc": "Learn to interpret charts and read the footprints of institutional volume makers.",
      "pillar1-f1": "Trend Following Methodologies",
      "pillar1-f2": "Price Action Rules (Candles, S/R, MSB)",
      "pillar1-f3": "Institutional Concepts (ICT, SMC, Order Block, FVG)",
      
      "pillar2-title": "Risk & Portfolio Management",
      "pillar2-desc": "Protect your capital and grow it steadily with metrics-driven mathematical models.",
      "pillar2-f1": "Risk/Reward (R:R) Ratios (1:2 and 1:3 rules)",
      "pillar2-f2": "Max 1-2% Capital Risk per Trade Rules",
      "pillar2-f3": "Mathematical Metrics & Growth Journals",
      
      "pillar3-title": "Indicators & Technical Confirmations",
      "pillar3-desc": "Increase your probability using mathematical and algorithmic filter systems.",
      "pillar3-f1": "Correct Combinations of RSI, EMA, and MACD",
      "pillar3-f2": "Pine Script Backtesting & Strategy Automation",
      "pillar3-f3": "Signal Filtering and Avoiding Bad Market Whiplash",
      
      "pillar4-title": "Trader Psychology & Discipline",
      "pillar4-desc": "Learn to stay committed to your plan and manage your emotions systematically.",
      "pillar4-f1": "Managing FOMO (Fear of Missing Out)",
      "pillar4-f2": "Avoiding Revenge Trades & Overtrading",
      "pillar4-f3": "Trading Journal (Journaling) Routines",
      
      "about-cta-title": "Let's Succeed Together",
      "about-cta-desc": "Get detailed information about our curriculum and schedule the best 1-on-1 mentorship times that suit your calendar.",
      "about-cta-btn1": "Go to Contact Form",
      "about-cta-btn2": "WhatsApp Support",

      // Statistics Section
      "stat-hours": "Hours of Trading Content",
      "stat-students": "Custom Software Projects",
      "stat-bots": "Bot & Indicator Projects",
      "stat-satisfaction": "System Uptime (Uptime Rate)",

      // Testimonials Section
      "testimonials-subtitle": "Student & Partner Testimonials",
      "testimonials-title": "What Our Students & Partners Say",
      "testimonials-desc": "Feedback from traders who completed our education programs and business partners using our custom software solutions.",
      "testimonial1-text": '"I started from zero in Pine Script. After 3 months, I wrote and published my own indicator on TradingView. The education methodology is truly systematic and easy to understand."',
      "testimonial1-name": "Ahmet K.",
      "testimonial1-role": "Individual Investor — Pine Script Training",
      "testimonial2-text": '"Risk management training changed my life. I used to trade emotionally, now I apply the 1% risk rule on every position. My losses have decreased dramatically."',
      "testimonial2-name": "Selin Y.",
      "testimonial2-role": "Forex Trader — Mentorship Program",
      "testimonial3-text": '"We developed my algorithmic trading bot together with the TMA team. I received professional support at every step from strategy logic to API integration. Now my bot runs 24/7."',
      "testimonial3-name": "Mehmet E.",
      "testimonial3-role": "Crypto Trader — Bot Development",
      "testimonial4-text": '"Thanks to the Smart Money Concepts training, my perspective on the market has completely changed. I now know very well how to apply Order Block and FVG concepts to real trades."',
      "testimonial4-name": "Deniz T.",
      "testimonial4-role": "BIST Trader — SMC Training",
      "testimonial5-text": '"They built our company\'s SaaS platform from scratch. They delivered a job far beyond our expectations with both a scalable backend structure and a wonderfully working modern UI design."',
      "testimonial5-name": "Hakan B.",
      "testimonial5-role": "CEO — Fintech SaaS Project",
      "testimonial6-text": '"We worked with TMA to resolve latency issues in our mobile app\'s exchange integration and live data stream. Thanks to webhook and API optimizations, we reduced data latency to almost zero."',
      "testimonial6-name": "Zeynep A.",
      "testimonial6-role": "CTO — Investment Tech Company",

      // Tech Band
      "tech-band-label": "Technologies We Use",

      // WhatsApp FAB Tooltip
      "fab-tooltip": "Chat with us on WhatsApp!"
    }
  };

  // ==========================================
  // 10b. DYNAMIC TESTIMONIALS (SHUFFLE & RENDER)
  // ==========================================
  const testimonialsList = [
    {
      avatar: "SG",
      stars: 5,
      name: "Süleyman G.",
      role: {
        tr: "Kripto Para Danışmanı",
        en: "Cryptocurrency Consultant"
      },
      text: {
        tr: "Trading sistemleri ve indikatör entegyonu konusunda çok donanımlı. İşlemlerimi disipline etmemde büyük yardımı dokundu.",
        en: "Very knowledgeable in trading systems and indicator integration. Great help in disciplining my trades."
      }
    },
    {
      avatar: "MD",
      stars: 5,
      name: "Muammer D.",
      role: {
        tr: "Borsa Özel Ders",
        en: "Stock Market Private Student"
      },
      text: {
        tr: "Mehmet hocamla dersler çok verimli geçiyor. Teknik analiz ve piyasa dinamiklerini pratik örneklerle anlatıyor.",
        en: "Lessons with teacher Mehmet are extremely productive. He explains technical analysis and market dynamics with practical examples."
      }
    },
    {
      avatar: "KY",
      stars: 5,
      name: "Kaan Y.",
      role: {
        tr: "Kripto Para Danışmanı",
        en: "Cryptocurrency Consultant"
      },
      text: {
        tr: "Piyasa dilini anlamak, alım-satıma dair tüm detayları öğrenmek ve herkesten önde olmak istiyorsanız doğru tercihi yaparsınız. Hocam gerçekten çok özel bir trader.",
        en: "If you want to understand the language of the market, learn all the details of buying and selling, and be ahead of everyone, you will make the right choice. My teacher is truly a very special trader."
      }
    },
    {
      avatar: "MŞ",
      stars: 5,
      name: "Mehmet Ş.",
      role: {
        tr: "Forex Eğitimi",
        en: "Forex Training"
      },
      text: {
        tr: "Mehmet hocamla yaklaşık 1,5 aydır ders yapıyoruz. Kendisinden fazlası ile faydalanıyorum. Mehmet hoca hem piyasa bilgisi hem tecrübesi hem de bilgi aktarımı ile çok kaliteli bir eğitim sunuyor. Her fiyat hareketini nedeni ile birlikte detaylı şekilde açıklıyor.",
        en: "We have been doing classes with teacher Mehmet for about 1.5 months. I benefit from him more than enough. I receive a very high-quality education thanks to Mehmet teacher's market knowledge, experience, and information transfer. He explains every price movement in detail with its reason."
      }
    },
    {
      avatar: "ÖÖ",
      stars: 5,
      name: "Ömer Efe Ö.",
      role: {
        tr: "Borsa Yatırım Danışmanı",
        en: "Stock Market Investment Advisor"
      },
      text: {
        tr: "Benimle çok iyi ilgilendi ve tüm sorularımı sabırla yanıtladı, sorunlarımı dinledi teşekkürler.",
        en: "He took great care of me, answered all my questions patiently, and listened to my concerns, thank you."
      }
    },
    {
      avatar: "MK",
      stars: 5,
      name: "Mert K.",
      role: {
        tr: "Teknoloji Direktörü — Finans Teknolojileri Sektörü",
        en: "Technology Director — Financial Technologies Sector"
      },
      text: {
        tr: "Mevcut altyapımızın performans sorunlarını kökten çözdüler. Sistem artık kat kat daha hızlı yanıt veriyor ve ölçeklenme konusunda hiç endişemiz kalmadı.",
        en: "They solved the performance issues of our current infrastructure from the root. The system now responds times faster and we have no concerns about scaling anymore."
      }
    },
    {
      avatar: "AY",
      stars: 5,
      name: "Ayşe Y.",
      role: {
        tr: "Kurucu Ortak — Yatırım Teknolojileri",
        en: "Co-Founder — Investment Technologies"
      },
      text: {
        tr: "Karmaşık entegrasyon ihtiyaçlarımızı sıfırdan planlayıp uyguladılar. Hem teknik derinlik hem de iletişim tarafında beklentimizin üzerinde bir deneyimdi.",
        en: "They planned and implemented our complex integration needs from scratch. It was an experience beyond our expectations in both technical depth and communication."
      }
    },
    {
      avatar: "SD",
      stars: 5,
      name: "Suzan D.",
      role: {
        tr: "Ürün Sorumlusu — Mobil Uygulama Geliştirme",
        en: "Product Manager — Mobile App Development"
      },
      text: {
        tr: "Canlı veri akışındaki gecikme sorunlarını API optimizasyonlarıyla neredeyse tamamen ortadan kaldırdılar. Kullanıcı deneyimimiz belirgin şekilde iyileşti.",
        en: "They almost completely eliminated latency issues in live data stream with API optimizations. Our user experience has improved significantly."
      }
    },
    {
      avatar: "ET",
      stars: 5,
      name: "Emre T.",
      role: {
        tr: "CTO — Fintech SaaS",
        en: "CTO — Fintech SaaS"
      },
      text: {
        tr: "Backend mimarimizi modern ve sürdürülebilir bir yapıya taşıdılar. Ekibin teknik yetkinliği ve çözüm odaklı yaklaşımı fark yaratıyor.",
        en: "They migrated our backend architecture to a modern and sustainable structure. The technical competence and solution-oriented approach of the team make a difference."
      }
    },
    {
      avatar: "BC",
      stars: 5,
      name: "Burak C.",
      role: {
        tr: "Operasyon Direktörü — Yatırım Platformu",
        en: "Operations Director — Investment Platform"
      },
      text: {
        tr: "Webhook tabanlı otomasyon altyapımızı kurdular; manuel süreçlerimizin büyük kısmını devre dışı bıraktık. Zaman kazancı ciddi oldu.",
        en: "They built our webhook-based automation infrastructure; we disabled most of our manual processes. The time savings have been significant."
      }
    },
    {
      avatar: "RA",
      stars: 5,
      name: "Rana A.",
      role: {
        tr: "Genel Müdür — Teknoloji Danışmanlığı",
        en: "General Manager — Technology Consulting"
      },
      text: {
        tr: "Projeye başından sonuna kadar profesyonelce yaklaştılar. Teslim süresi, kod kalitesi ve sonrasındaki destek konusunda tam güven verdiler.",
        en: "They approached the project professionally from start to finish. They gave full confidence regarding delivery time, code quality, and post-delivery support."
      }
    }
  ];

  let shuffledTestimonials = [];

  function shuffleTestimonials() {
    const clone = [...testimonialsList];
    for (let i = clone.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    shuffledTestimonials = clone;
  }

  function renderTestimonials(lang) {
    const container = document.getElementById('testimonialsCarousel');
    if (!container) return;
    
    container.innerHTML = '';
    
    shuffledTestimonials.forEach(t => {
      const text = t.text[lang] || t.text['tr'];
      const role = t.role[lang] || t.role['tr'];
      
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      
      // Star rating display
      let starsHTML = '';
      for (let i = 0; i < t.stars; i++) {
        starsHTML += '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
      }
      
      card.innerHTML = `
        <div class="testimonial-stars">
          ${starsHTML}
        </div>
        <svg class="testimonial-quote-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
        <p class="testimonial-text">${text}</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">${t.avatar}</div>
          <div>
            <div class="testimonial-name">${t.name}</div>
            <div class="testimonial-role">${role}</div>
          </div>
        </div>
      `;
      
      container.appendChild(card);
    });
  }

  // Shuffle once on load
  shuffleTestimonials();


  // ==========================================
  // 2. LANGUAGE MANAGEMENT (i18n)
  // ==========================================
  let currentLang = 'tr';
  
  const detectLanguage = () => {
    // 1. Check local storage first
    const savedLang = localStorage.getItem('lang');
    if (savedLang === 'tr' || savedLang === 'en') {
      return savedLang;
    }
    
    // 2. Check browser navigator language
    const browserLang = navigator.language || navigator.userLanguage || '';
    if (browserLang.toLowerCase().startsWith('tr')) {
      return 'tr';
    }
    
    // 3. Default to english
    return 'en';
  };
  
  const setLanguage = (lang) => {
    if (lang !== 'tr' && lang !== 'en') lang = 'tr';
    currentLang = lang;
    localStorage.setItem('lang', lang);
    
    // Update active state in UI switch buttons
    const btnTr = document.getElementById('langBtnTr');
    const btnEn = document.getElementById('langBtnEn');
    
    if (btnTr && btnEn) {
      if (lang === 'tr') {
        btnTr.classList.add('active');
        btnEn.classList.remove('active');
      } else {
        btnEn.classList.add('active');
        btnTr.classList.remove('active');
      }
    }
    
    // Translate text content
    const elementsToTranslate = document.querySelectorAll('[data-i18n]');
    elementsToTranslate.forEach(elem => {
      const key = elem.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        // If it contains HTML tags (like SVG), use innerHTML, otherwise textContent
        if (translations[lang][key].includes('<svg') || translations[lang][key].includes('<span')) {
          elem.innerHTML = translations[lang][key];
        } else {
          elem.textContent = translations[lang][key];
        }
      }
    });
    
    // Translate input placeholders
    const placeholdersToTranslate = document.querySelectorAll('[data-i18n-placeholder]');
    placeholdersToTranslate.forEach(input => {
      const key = input.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key]) {
        input.placeholder = translations[lang][key];
      }
    });
    
    // Special translations for documents (like title attribute or browser window title)
    if (translations[lang]) {
      const isAboutPage = window.location.pathname.includes('about.html');
      document.title = translations[lang][isAboutPage ? "about-site-title" : "site-title"];
    }
    
    // Re-draw GitHub repositories in the correct language
    const githubGrid = document.getElementById('githubReposContainer');
    if (githubGrid) {
      renderGitHubRepos();
    }
    
    // Re-draw Blog articles in the correct language
    const blogGrid = document.getElementById('blogContainer');
    if (blogGrid) {
      renderBlogArticles();
    }

    // Re-draw Testimonials in the correct language
    const testimonialsContainer = document.getElementById('testimonialsCarousel');
    if (testimonialsContainer) {
      renderTestimonials(lang);
    }
  };


  // ==========================================
  // 3. HEADER SCROLL EFFECT
  // ==========================================
  const header = document.getElementById('header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll();


  // ==========================================
  // 4. MOBILE MENU (HAMBURGER)
  // ==========================================
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }


  // ==========================================
  // 5. WHATSAPP CONTACT FORM INTEGRATION
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const message = document.getElementById('formMsg').value.trim();
      
      const waNumber = '905343713573';
      const waText = currentLang === 'tr' 
        ? `Merhaba Trend Master Akademi,\n\nWeb siteniz üzerinden yeni bir başvuru/talep formu doldurdum:\n\n*Ad Soyad:* ${name}\n*E-Posta:* ${email}\n*Telefon:* ${phone}\n*Mesaj:* ${message}`
        : `Hello Trend Master Academy,\n\nI have submitted a contact form on your website:\n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Message:* ${message}`;
      
      const encodedText = encodeURIComponent(waText);
      const waUrl = `https://wa.me/${waNumber}?text=${encodedText}`;
      
      window.open(waUrl, '_blank');
      contactForm.reset();
    });
  }


  // ==========================================
  // 6. GITHUB REPOSITORIES FETCH & DISPLAY
  // ==========================================
  const githubRepos = []; // cache fetched repos
  
  // Fallback repositories in case the API limit is hit or account has no public projects
  const fallbackRepos = [
    {
      name: "tma-pine-alerts-connector",
      description_tr: "TradingView Pine Script alarmlarını gerçek zamanlı olarak Binance, Bybit ve OKX vadeli işlemler borsalarına yönlendiren webhook konnektörü.",
      description_en: "TradingView Pine Script alert webhook connector to automate Binance, Bybit, and OKX futures trading in real-time.",
      stargazers_count: 14,
      forks_count: 5,
      language: "Python",
      langColor: "#3572A5"
    },
    {
      name: "tma-fintech-saas-dashboard",
      description_tr: "Finansal verileri, trading alarmlarını ve kullanıcı portföy yönetimini tek bir arayüzde birleştiren Next.js & Tailwind CSS tabanlı SaaS paneli.",
      description_en: "A Next.js & Tailwind CSS based SaaS dashboard integrating financial analytics, trading alerts, and user portfolio tracking.",
      stargazers_count: 31,
      forks_count: 12,
      language: "TypeScript",
      langColor: "#3178c6"
    },
    {
      name: "tma-mobile-trading-companion",
      description_tr: "Kullanıcıların trading sinyallerini anlık bildirim olarak aldığı ve API anahtarlarını yönettikleri şık Flutter tabanlı mobil uygulama.",
      description_en: "A sleek Flutter-based iOS/Android mobile companion app for real-time alert notifications and API credential management.",
      stargazers_count: 19,
      forks_count: 4,
      language: "Dart",
      langColor: "#00B4AB"
    },
    {
      name: "price-action-backtester",
      description_tr: "Market yapısı kırılımları (MSB), order block (emir blokları) ve FVG modellerini geriye dönük test eden yüksek performanslı Pandas tabanlı backtest motoru.",
      description_en: "A high-performance algorithmic backtesting engine that simulates market structure breaks, order blocks, and FVG patterns.",
      stargazers_count: 22,
      forks_count: 8,
      language: "Python",
      langColor: "#3572A5"
    }
  ];
  
  const getLanguageColor = (lang) => {
    const colors = {
      "Python": "#3572A5",
      "JavaScript": "#f1e05a",
      "TypeScript": "#3178c6",
      "Dart": "#00B4AB",
      "HTML": "#e34c26",
      "CSS": "#563d7c",
      "Pine Script": "#00b0ff"
    };
    return colors[lang] || "#8b949e";
  };
  
  const renderGitHubRepos = () => {
    const container = document.getElementById('githubReposContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Choose repositories to show: API results if populated, otherwise fallbacks
    const reposToShow = githubRepos.length > 0 ? githubRepos : fallbackRepos;
    
    reposToShow.forEach(repo => {
      // Resolve description based on active language
      let desc = '';
      if (repo.description_tr && repo.description_en) {
        desc = currentLang === 'tr' ? repo.description_tr : repo.description_en;
      } else {
        desc = repo.description || (currentLang === 'tr' ? 'Açıklama bulunmuyor.' : 'No description available.');
      }
      
      const lang = repo.language || 'Pine Script';
      const langColor = repo.langColor || getLanguageColor(lang);
      
      const htmlUrl = repo.html_url || `https://github.com/trendmasterakademi/${repo.name}`;
      
      const card = document.createElement('div');
      card.className = 'repo-card';
      
      card.innerHTML = `
        <div>
          <div class="repo-header">
            <svg class="repo-icon-folder" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </div>
          <a href="${htmlUrl}" target="_blank" class="repo-title-link">${repo.name}</a>
          <p class="repo-desc">${desc}</p>
        </div>
        <div class="repo-footer">
          <div class="repo-lang">
            <span class="repo-lang-dot" style="background-color: ${langColor};"></span>
            <span>${lang}</span>
          </div>
          <div class="repo-stats">
            <div class="repo-stat-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span>${repo.stargazers_count}</span>
            </div>
            <div class="repo-stat-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>
              <span>${repo.forks_count}</span>
            </div>
          </div>
        </div>
      `;
      
      container.appendChild(card);
    });
  };
  
  const fetchGitHubRepos = () => {
    const container = document.getElementById('githubReposContainer');
    if (!container) return;
    
    fetch('https://api.github.com/users/trendmasterakademi/repos')
      .then(response => {
        if (!response.ok) {
          throw new Error('API failed');
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          githubRepos.length = 0; // Clear array
          // Pull top repos
          data.forEach(r => {
            githubRepos.push({
              name: r.name,
              description: r.description,
              stargazers_count: r.stargazers_count,
              forks_count: r.forks,
              language: r.language,
              html_url: r.html_url
            });
          });
        }
        renderGitHubRepos();
      })
      .catch(err => {
        console.warn('GitHub API fetch failed, loading default fallback projects:', err);
        renderGitHubRepos();
      });
  };


  // ==========================================
  // 6b. LINKEDIN ARTICLES FETCH & DISPLAY
  // ==========================================
  const blogArticles = []; // cache fetched articles

  const renderBlogArticles = () => {
    const container = document.getElementById('blogContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (blogArticles.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">
          \${currentLang === 'tr' ? 'Henüz makale bulunmuyor.' : 'No articles available yet.'}
        </div>
      `;
      return;
    }
    
    blogArticles.forEach(article => {
      // Create blog card
      const card = document.createElement('div');
      card.className = 'blog-card';
      
      // Formatting date if possible
      let dateString = article.date;
      try {
        const dateObj = new Date(article.date);
        if (!isNaN(dateObj)) {
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          dateString = dateObj.toLocaleDateString(currentLang === 'tr' ? 'tr-TR' : 'en-US', options);
        }
      } catch (e) {}

      // Resolve titles and summaries (in case we want multilanguage later, or default to general)
      const title = currentLang === 'tr' && article.title_tr ? article.title_tr : (article.title || '');
      const summary = currentLang === 'tr' && article.summary_tr ? article.summary_tr : (article.summary || '');
      
      card.innerHTML = `
        <div class="blog-card-image-wrapper">
          <img src="\${article.image || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800'}" alt="\${title}" class="blog-card-image" loading="lazy">
          <div class="blog-card-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            <span>LinkedIn</span>
          </div>
        </div>
        <div class="blog-card-content">
          <div class="blog-card-date">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>\${dateString}</span>
          </div>
          <h3 class="blog-card-title">\${title}</h3>
          <p class="blog-card-desc">\${summary}</p>
          <div class="blog-card-footer">
            <a href="\${article.link}" target="_blank" class="blog-card-link">
              <span>\${currentLang === 'tr' ? 'LinkedIn\\'de Oku' : 'Read on LinkedIn'}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
        </div>
      `;
      
      container.appendChild(card);
    });
  };

  const fetchBlogArticles = () => {
    const container = document.getElementById('blogContainer');
    if (!container) return;
    
    // Draw skeleton loader
    container.innerHTML = Array(3).fill(0).map(() => `
      <div class="blog-skeleton">
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-text date"></div>
          <div class="skeleton-text title"></div>
          <div class="skeleton-text desc-1"></div>
          <div class="skeleton-text desc-2"></div>
          <div class="skeleton-text desc-3"></div>
          <div class="skeleton-text button"></div>
        </div>
      </div>
    `).join('');
    
    fetch('articles.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch articles.json');
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          blogArticles.length = 0;
          data.forEach(item => blogArticles.push(item));
        }
        renderBlogArticles();
      })
      .catch(err => {
        console.error('Error fetching articles.json:', err);
        container.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; color: var(--accent-red); padding: 40px 0;">
            <p>\${currentLang === 'tr' ? 'Makaleler yüklenirken hata oluştu.' : 'Failed to load articles.'}</p>
          </div>
        `;
      });
  };


  // ==========================================
  // 7. INTERACTIVE TRADING CHART SIMULATION
  // ==========================================
  const canvas = document.getElementById('chartCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    let candles = [];
    const maxCandles = 22;
    let currentPrice = 1450.50;
    let ticksInCurrentCandle = 0;
    const ticksPerCandle = 30;
    
    const generateInitialData = () => {
      let price = 1400.00;
      for (let i = 0; i < maxCandles; i++) {
        const change = (Math.random() - 0.48) * 15;
        const open = price;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * 5;
        const low = Math.min(open, close) - Math.random() * 5;
        
        candles.push({ open, high, low, close });
        price = close;
      }
      currentPrice = price;
    };
    
    generateInitialData();
    
    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      ctx.scale(dpr, dpr);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const updateMarket = () => {
      const lastCandleIndex = candles.length - 1;
      if (lastCandleIndex < 0) return;
      
      const tickChange = (Math.random() - 0.5) * 2.2;
      currentPrice += tickChange;
      
      const currentCandle = candles[lastCandleIndex];
      currentCandle.close = currentPrice;
      if (currentPrice > currentCandle.high) currentCandle.high = currentPrice;
      if (currentPrice < currentCandle.low) currentCandle.low = currentPrice;
      
      ticksInCurrentCandle++;
      
      if (ticksInCurrentCandle >= ticksPerCandle) {
        ticksInCurrentCandle = 0;
        candles.shift();
        
        const open = currentPrice;
        const close = open;
        candles.push({ open, high: open, low: open, close });
      }
    };
    
    const marketInterval = setInterval(updateMarket, 100);
    
    const drawChart = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      
      ctx.clearRect(0, 0, width, height);
      
      const rightPadding = 60;
      const bottomPadding = 30;
      const chartWidth = width - rightPadding;
      const chartHeight = height - bottomPadding;
      
      let minPrice = Infinity;
      let maxPrice = -Infinity;
      
      candles.forEach(c => {
        if (c.low < minPrice) minPrice = c.low;
        if (c.high > maxPrice) maxPrice = c.high;
      });
      
      const priceRange = maxPrice - minPrice;
      minPrice -= priceRange * 0.15;
      maxPrice += priceRange * 0.15;
      
      const getX = (index) => {
        return (index / (maxCandles - 1)) * (chartWidth - 40) + 20;
      };
      
      const getY = (price) => {
        return chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * chartHeight;
      };
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      
      const gridLevels = 5;
      for (let i = 0; i <= gridLevels; i++) {
        const p = minPrice + (i / gridLevels) * (maxPrice - minPrice);
        const y = getY(p);
        
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(chartWidth, y);
        ctx.stroke();
        
        ctx.fillStyle = '#64748b';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(p.toFixed(2), chartWidth + 8, y + 3);
      }
      
      const candleWidth = (chartWidth - 40) / maxCandles;
      candles.forEach((_, i) => {
        if (i % 4 === 0) {
          const x = getX(i);
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, chartHeight);
          ctx.stroke();
        }
      });
      
      candles.forEach((c, i) => {
        const x = getX(i);
        const yOpen = getY(c.open);
        const yClose = getY(c.close);
        const yHigh = getY(c.high);
        const yLow = getY(c.low);
        
        const isBullish = c.close >= c.open;
        const themeColor = isBullish ? '#00e676' : '#ff1744';
        
        ctx.strokeStyle = themeColor;
        ctx.fillStyle = isBullish ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 23, 68, 0.25)';
        ctx.lineWidth = 1.5;
        
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();
        
        const rectHeight = yClose - yOpen;
        const rectWidth = candleWidth * 0.75;
        ctx.fillRect(x - rectWidth / 2, yOpen, rectWidth, rectHeight);
        ctx.strokeRect(x - rectWidth / 2, yOpen, rectWidth, rectHeight);
      });
      
      const maPeriod = 5;
      let maPoints = [];
      
      for (let i = maPeriod - 1; i < candles.length; i++) {
        let sum = 0;
        for (let j = 0; j < maPeriod; j++) {
          sum += candles[i - j].close;
        }
        maPoints.push({
          x: getX(i),
          y: getY(sum / maPeriod)
        });
      }
      
      if (maPoints.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 229, 255, 0.4)';
        
        ctx.moveTo(maPoints[0].x, maPoints[0].y);
        for (let i = 1; i < maPoints.length; i++) {
          ctx.lineTo(maPoints[i].x, maPoints[i].y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      
      const yCurrent = getY(currentPrice);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.35)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.moveTo(0, yCurrent);
      ctx.lineTo(chartWidth, yCurrent);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = '#00e5ff';
      ctx.beginPath();
      ctx.rect(chartWidth + 4, yCurrent - 9, 52, 18);
      ctx.fill();
      
      ctx.fillStyle = '#080b11';
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(currentPrice.toFixed(2), chartWidth + 30, yCurrent + 4);
      
      animationFrameId = requestAnimationFrame(drawChart);
    };
    
    drawChart();
    
    window.addEventListener('beforeunload', () => {
      clearInterval(marketInterval);
      cancelAnimationFrame(animationFrameId);
    });
  }

  // ==========================================
  // 7b. ANIMATED DEVELOPER TERMINAL SIMULATION
  // ==========================================
  const terminal = document.getElementById('softwareTerminalContent');
  if (terminal) {
    const logs = [
      { type: 'command', text: 'npm run build:api-gateway' },
      { type: 'info', text: 'Building REST & GraphQL microservices...' },
      { type: 'success', text: '[SUCCESS] Web & SaaS backend compiled. (1.2s)' },
      { type: 'command', text: 'docker-compose up -d db cache' },
      { type: 'info', text: 'Launching PostgreSQL and Redis containers...' },
      { type: 'success', text: '[SUCCESS] Database instances healthy.' },
      { type: 'command', text: 'python run_bot_agent.py --env live' },
      { type: 'info', text: 'Authenticating Binance & OKX API keys...' },
      { type: 'success', text: '[SUCCESS] Algo signature verified. Trading agent live.' },
      { type: 'info', text: '[WEBHOOK] POST /api/v1/alerts received (Binance ETH Breakout)' },
      { type: 'info', text: '[DB] Storing order record: Buy 2.5 ETH @ Market' },
      { type: 'success', text: '[SUCCESS] Telemetry check: 99.9% system uptime' }
    ];

    let logIndex = 0;
    let terminalTimeout;
    
    const writeLine = (logObj) => {
      if (!document.getElementById('softwareTerminalContent')) return;
      const line = document.createElement('div');
      line.className = 'terminal-line';

      if (logObj.type === 'command') {
        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt-software';
        prompt.textContent = 'tma-dev@ubuntu:~$';
        line.appendChild(prompt);

        const textSpan = document.createElement('span');
        textSpan.className = 'terminal-text';
        line.appendChild(textSpan);

        let charIndex = 0;
        const commandText = logObj.text;
        
        const typeChar = () => {
          if (!document.getElementById('softwareTerminalContent')) return;
          if (charIndex < commandText.length) {
            textSpan.textContent += commandText[charIndex];
            charIndex++;
            terminalTimeout = setTimeout(typeChar, 35);
          } else {
            logIndex = (logIndex + 1) % logs.length;
            terminalTimeout = setTimeout(processNextLog, 1200);
          }
        };
        typeChar();
      } else {
        const textSpan = document.createElement('span');
        textSpan.className = `terminal-text ${logObj.type}`;
        textSpan.textContent = logObj.text;
        line.appendChild(textSpan);
        
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
        
        logIndex = (logIndex + 1) % logs.length;
        terminalTimeout = setTimeout(processNextLog, 1000);
      }

      if (logObj.type === 'command') {
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
      }
    };

    const processNextLog = () => {
      if (!document.getElementById('softwareTerminalContent')) return;
      if (terminal.children.length > 9) {
        terminal.innerHTML = '';
      }
      writeLine(logs[logIndex]);
    };

    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    terminal.appendChild(cursor);

    terminal.innerHTML = '';
    
    terminalTimeout = setTimeout(processNextLog, 500);

    window.addEventListener('beforeunload', () => {
      clearTimeout(terminalTimeout);
    });
  }


  // ==========================================
  // 8. INITIALIZATION & BINDINGS (Moved to bottom)
  // ==========================================
  // Set up click handlers for language selector
  const langSwitcherElement = document.getElementById('langSwitcher');
  if (langSwitcherElement) {
    langSwitcherElement.addEventListener('click', () => {
      const nextLang = currentLang === 'tr' ? 'en' : 'tr';
      setLanguage(nextLang);
    });
  }

  // Trigger GitHub fetch if container is present on page load
  if (document.getElementById('githubReposContainer')) {
    fetchGitHubRepos();
  }

  // Trigger Blog articles fetch if container is present on page load
  if (document.getElementById('blogContainer')) {
    fetchBlogArticles();
  }
  
  // Initialize language on startup (after all functions are fully defined)
  const initialLang = detectLanguage();
  setLanguage(initialLang);


  // ==========================================
  // 9. BACK TO TOP BUTTON
  // ==========================================
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // ==========================================
  // 10. ANIMATED STATISTICS COUNTER
  // ==========================================
  const animateCounters = () => {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    statNumbers.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2000; // ms
      const startTime = performance.now();
      
      const easeOutQuart = t => 1 - Math.pow(1 - t, 4);
      
      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const currentVal = Math.floor(easedProgress * target);
        
        el.textContent = currentVal + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target + suffix;
        }
      };
      
      requestAnimationFrame(updateCounter);
    });
  };
  
  const statsSection = document.getElementById('stats');
  if (statsSection) {
    let statsAnimated = false;
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    statsObserver.observe(statsSection);
  }

  // ==========================================
  // 11. TESTIMONIALS CAROUSEL NAVIGATION
  // ==========================================
  const testimonialsCarousel = document.getElementById('testimonialsCarousel');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  
  if (testimonialsCarousel && prevBtn && nextBtn) {
    const scrollAmount = 384; // card width + gap
    
    prevBtn.addEventListener('click', () => {
      testimonialsCarousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
      testimonialsCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }
  
});
