document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. TRANSLATION DICTIONARY (i18n)
  // ==========================================
  const translations = {
    tr: {
      "site-title": "Trend Master Akademi | Algoritmik Trading ve Finansal Yazılım Eğitimleri",
      "about-site-title": "Eğitim Stratejileri & Hakkımızda | Trend Master Akademi",
      
      // Navbar
      "logo-text": "TREND MASTER AKADEMİ",
      "nav-home": "Ana Sayfa",
      "nav-about": "Eğitim & Hakkımızda",
      "nav-services": "Hizmetler",
      "nav-contact": "İletişim",
      "nav-btn": "Randevu Al",
      
      // Hero
      "hero-badge": "Geleceğin Trading Teknolojisi",
      "hero-title": "Finansal Piyasalarda Uzmanlaşmak İçin Doğru Adrestesiniz",
      "hero-desc": "Piyasalarda yüksek kazanç vaatleri değil, sadece disiplinli stratejiler ve doğru eğitim kazandırır. Algoritmik sistemler ve teknik onay mekanizmalarıyla işlemlerinizi profesyonel boyuta taşıyın.",
      "btn-explore": "Eğitimleri İncele",
      "btn-contact": "Bizimle İletişime Geç",
      "ticker-status": "CANLI SİMÜLASYON",
      
      // Services
      "services-subtitle": "Neler Sunuyoruz?",
      "services-title": "Trading ve Yazılım Çözümlerimiz",
      "services-desc": "Piyasalarda rekabet avantajı elde etmeniz için geliştirilen stratejiler, kodlama çözümleri ve özel eğitim modülleri.",
      
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
      
      "card-btn-info": "Detaylı Bilgi Al",
      "card-btn-mufredat": "Müfredatı İncele",
      
      // GitHub Section
      "github-subtitle": "Açık Kaynak Kodlu Projelerimiz",
      "github-title": "GitHub Yetenek Havuzumuz",
      "github-desc": "Yazılım yeteneklerimizi ve trading algoritmalarımızı sergilediğimiz açık kaynak projelerimiz. Canlı API verisi çekilmektedir.",
      "github-loading": "Projeler yükleniyor...",
      "github-error": "Projeler yüklenirken hata oluştu. Lütfen daha sonra tekrar deneyin.",
      "github-view-profile": "GitHub Profilimizi İnceleyin",
      
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
      "footer-desc": "Finansal okuryazarlığı modern teknoloji ve yazılım disiplinleriyle birleştirerek sürdürülebilir başarıyı hedefleyen profesyonel eğitim akademisi.",
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
      "stat-students": "Aktif Öğrenci",
      "stat-bots": "Bot & İndikatör Projesi",
      "stat-satisfaction": "Memnuniyet Oranı",

      // Testimonials Section
      "testimonials-subtitle": "Öğrenci Deneyimleri",
      "testimonials-title": "Öğrencilerimiz Ne Diyor?",
      "testimonials-desc": "Eğitim programlarımızdan geçen yatırımcıların geri bildirimleri.",
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

      // Tech Band
      "tech-band-label": "Kullandığımız Teknolojiler",

      // WhatsApp FAB Tooltip
      "fab-tooltip": "Bize WhatsApp'tan yazın!"
    },
    en: {
      "site-title": "Trend Master Academy | Algorithmic Trading and Financial Software Education",
      "about-site-title": "Education Strategies & About Us | Trend Master Academy",
      
      // Navbar
      "logo-text": "TREND MASTER ACADEMY",
      "nav-home": "Home",
      "nav-about": "Education & About",
      "nav-services": "Services",
      "nav-contact": "Contact",
      "nav-btn": "Book Session",
      
      // Hero
      "hero-badge": "Future of Trading Technology",
      "hero-title": "You Are in the Right Place to Master Financial Markets",
      "hero-desc": "Not promises of high profits, but only disciplined strategies and proper education will make you win in the markets. Take your trading to a professional level with algorithmic systems and technical confirmation mechanisms.",
      "btn-explore": "Explore Programs",
      "btn-contact": "Get in Touch",
      "ticker-status": "LIVE SIMULATION",
      
      // Services
      "services-subtitle": "What We Offer",
      "services-title": "Trading & Software Solutions",
      "services-desc": "Strategies, coding solutions, and customized education modules developed for you to gain a competitive edge in the markets.",
      
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
      
      "card-btn-info": "Get Details",
      "card-btn-mufredat": "View Syllabus",
      
      // GitHub Section
      "github-subtitle": "Our Open Source Projects",
      "github-title": "GitHub Talent Pool",
      "github-desc": "Open source projects where we demonstrate our programming skills and trading algorithms. Live API data is retrieved.",
      "github-loading": "Loading repositories...",
      "github-error": "Failed to load projects. Please try again later.",
      "github-view-profile": "View Our GitHub Profile",
      
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
      "footer-desc": "A professional academy aiming for sustainable trading success by combining financial literacy with modern programming disciplines.",
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
      "stat-hours": "Hours of Education Content",
      "stat-students": "Active Students",
      "stat-bots": "Bot & Indicator Projects",
      "stat-satisfaction": "Satisfaction Rate",

      // Testimonials Section
      "testimonials-subtitle": "Student Experiences",
      "testimonials-title": "What Our Students Say",
      "testimonials-desc": "Feedback from traders who completed our education programs.",
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

      // Tech Band
      "tech-band-label": "Technologies We Use",

      // WhatsApp FAB Tooltip
      "fab-tooltip": "Chat with us on WhatsApp!"
    }
  };


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
      name: "price-action-backtester",
      description_tr: "Market yapısı kırılımları (MSB), order block (emir blokları) ve FVG modellerini geriye dönük test eden yüksek performanslı Pandas tabanlı backtest motoru.",
      description_en: "A high-performance algorithmic backtesting engine that simulates market structure breaks, order blocks, and FVG patterns.",
      stargazers_count: 22,
      forks_count: 8,
      language: "Python",
      langColor: "#3572A5"
    },
    {
      name: "tma-triangular-ma-strategy",
      description_tr: "Gürültü filtreleri ve dinamik ATR hedeflerine sahip, çift düzleştirilmiş özel Triangular Moving Average indikatör stratejisi.",
      description_en: "A double-smoothed customized Triangular Moving Average strategy indicator with noise filters and dynamic ATR targets.",
      stargazers_count: 18,
      forks_count: 3,
      language: "Pine Script",
      langColor: "#00b0ff"
    }
  ];
  
  const getLanguageColor = (lang) => {
    const colors = {
      "Python": "#3572A5",
      "JavaScript": "#f1e05a",
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
