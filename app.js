document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. COMPREHENSIVE TRANSLATION DICTIONARY (i18n)
  // ==========================================
  const translations = {
    tr: {
      "site-title": "Trend Master Akademi | Elite Full-Stack Yazılım & Dijital Çözüm Stüdyosu",
      "about-site-title": "Hakkımızda & Mühendislik Vizyonumuz | Trend Master Akademi",
      
      // Navbar
      "logo-text": "TREND MASTER AKADEMİ",
      "logo-sub": "STUDIO & LABS",
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
      "hero-desc": "Sıfırdan modern web siteleri ve SaaS platformları inşası, kilitlenen kodların kurtarılması, yapay zeka & API entegrasyonları ve algoritmik sistemler. Aracı ajanslar olmadan, doğrudan kıdemli geliştirici güvencesiyle ilk günden çalışan çözümler.",
      "btn-hero-wizard": "Projenizi / Sorununuzu Anlatın",
      "btn-hero-whatsapp": "WhatsApp ile Hemen Danışın",
      
      // Engineering Deck
      "deck-tab-arch": "SaaS Mimarisi",
      "deck-tab-debug": "Canlı Terminal & Kod",
      "deck-tab-algo": "Bot & Algo Motoru",
      "node-ui-title": "Modern UI / UX",
      "node-ui-sub": "Next.js & React",
      "node-ui-tag": "0.4s Hızlı Açılış",
      "node-api-title": "REST / GraphQL",
      "node-api-sub": "Node.js & FastAPI",
      "node-api-tag": "<50ms Yanıt",
      "node-db-title": "DB & Cache",
      "node-db-sub": "PostgreSQL & Redis",
      "node-db-tag": "ACID & Ölçeklenebilir",
      "node-cloud-title": "Bulut Dağıtım",
      "node-cloud-sub": "Docker & CI/CD",
      "node-cloud-tag": "%99.99 Kesintisiz",
      "metric-delivery": "Temiz Kod Garantisi",
      "metric-api": "Ortalama API Yanıtı",
      "metric-test": "TDD & Test Kapsamı",
      "debug-status-fixed": "✓ TÜM TESTLER BAŞARILI",
      "terminal-build-ok": "✓ Build doğrulandı: 0 hata, 0 uyarı. Canlıya aktarılıyor...",
      "terminal-status-ok": "ℹ Durum: %100 çalışıyor. Yanıt süresi: 24ms.",

      // Trust Bar
      "trust-1-title": "10+ Yıl Deneyim",
      "trust-1-desc": "Kıdemli Full-Stack Geliştirici",
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
      "m-btn-select-web": "Web Projesi Başlat",

      "badge-saas": "Fikirden Ürüne",
      "m-saas-title": "SaaS & Özel Web Uygulaması Mimarisi",
      "m-saas-desc": "Yazılım fikrinizi MVP'den ölçeklenebilir bir SaaS platformuna dönüştürüyoruz. Üyelik, abonelik ödemeleri, admin panelleri ve güçlü veritabanı altyapısı.",
      "m-saas-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Çok Kiracılı (Multi-tenant) Mimari & Auth",
      "m-saas-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Stripe, Iyzico & PayTR Ödeme Sistemleri",
      "m-saas-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Gelişmiş Müşteri & Yönetim Panelleri",
      "m-btn-select-saas": "SaaS Projesi Planla",

      "badge-bug": "Acil Müdahale",
      "m-bug-title": "Kod Çözümleri & Hata Kurtarma",
      "m-bug-desc": "Yarım kalmış, tıkanmış veya çöken yazılımlarınızı devralıp 24-48 saat içinde ayağa kaldırıyoruz. Kod temizliği, güvenlik açıklarını kapatma ve hızlandırma.",
      "m-bug-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Kritik Bug Tespiti & Anında Onarım",
      "m-bug-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Veritabanı Darboğazı & Query İyileştirme",
      "m-bug-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Kod Refactoring & Modernizasyon",
      "m-btn-select-bug": "Hata Düzeltme Talep Et",

      "badge-ai": "Yeni Nesil Çözüm",
      "m-ai-title": "Yapay Zeka, Webhook & API Entegrasyonları",
      "m-ai-desc": "Şirket içi süreçlerinizi otomatikleştiren özel AI botları, CRM, ERP, ödeme ve kargo sistemlerini birbirine bağlayan sağlam API köprüleri.",
      "m-ai-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> OpenAI, Claude & Özel LLM Entegrasyonları",
      "m-ai-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Webhook & Asenkron Kuyruk Sistemleri",
      "m-ai-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> İki Yönlü Veri Senkronizasyonu",
      "m-btn-select-ai": "Entegrasyon Başlat",

      "badge-algo": "Yüksek Hassasiyet",
      "m-algo-title": "Özel Botlar & Algoritmik Mühendislik",
      "m-algo-desc": "TradingView Pine Script v5 indikatörleri, Python alım-satım botları, arbitraj ve canlı borsa API otomasyonlarında kurumsal düzeyde matematiksel sistemler.",
      "m-algo-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Pine Script v5 Özel İndikatör & Strateji",
      "m-algo-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Binance, Bybit vb. Borsa API Bağlantıları",
      "m-algo-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> 7/24 Kesintisiz Sunucu Otomasyonu",
      "m-btn-select-algo": "Bot Çözümü Al",

      "badge-cto": "Stratejik Danışmanlık",
      "m-cto-title": "Teknik Mimarlık & CTO Danışmanlığı",
      "m-cto-desc": "Girişiminiz veya şirketiniz için doğru teknoloji yığını seçimi, kod denetimi (code audit), maliyet optimizasyonu ve uçtan uca teknik yol haritası.",
      "m-cto-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Mimari Tasarım & Teknoloji Seçimi",
      "m-cto-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Bulut & Sunucu Maliyetlerini Düşürme",
      "m-cto-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Kod Güvenlik & Performans Denetimi",
      "m-btn-select-cto": "Danışmanlık Randevusu Al",

      // Wizard
      "wizard-subtitle": "Akıllı Danışma & Teklif Sihirbazı",
      "wizard-title": "Projenizi veya Sorununuzu 3 Adımda İletin",
      "wizard-desc": "İhtiyacınızı seçin; anında bir teknik brif oluşturalım ve Mehmet Şahin ile doğrudan WhatsApp üzerinden iletişime geçin.",
      "w-step1-title": "Ne Tür Bir Çözüme İhtiyacınız Var?",
      "w-opt1-t": "🚀 SaaS & Web Uygulaması",
      "w-opt1-s": "Sıfırdan MVP, ödeme & panel",
      "w-opt2-t": "🌐 Web Sitesi / Landing Page",
      "w-opt2-s": "Yüksek dönüşümlü & hızlı web",
      "w-opt3-t": "⚡ Acil Bug Fix & Onarım",
      "w-opt3-s": "Kilitlenen kodları kurtarma",
      "w-opt4-t": "🤖 Yapay Zeka / API / Webhook",
      "w-opt4-s": "Otomasyon & veri köprüleri",
      "w-opt5-t": "📈 Özel Bot / Pine Script",
      "w-opt5-s": "Alım-satım otomasyonu & analiz",
      "w-opt6-t": "💡 Mimari & CTO Danışmanlığı",
      "w-opt6-s": "Teknoloji seçimi & denetim",

      "w-step2-title": "Projenizin Mevcut Durumu Nedir?",
      "w-stg1-t": "✨ Sıfırdan Yeni Fikir",
      "w-stg1-s": "Henüz kodlama başlamadı",
      "w-stg2-t": "⚠️ Yarım Kalmış / Tıkandı",
      "w-stg2-s": "Devralınması & çözülmesi gerek",
      "w-stg3-t": "🔄 Mevcut Sistemi Büyütme",
      "w-stg3-s": "Yeni özellikler & ölçekleme",
      "w-stg4-t": "🔥 Acil Canlı Hata / Kesinti",
      "w-stg4-s": "Hemen düzeltilmesi şart",

      "w-step3-title": "Hedeflenen Zaman & Öncelik?",
      "w-time1-t": "⚡ Hemen / Çok Acil",
      "w-time1-s": "1-3 gün içinde başlangıç",
      "w-time2-t": "📅 1 - 2 Hafta İçinde",
      "w-time2-s": "Planlama aşamasındayım",

      "w-sum-title": "📋 Teknik Ön-Brifing Özeti",
      "w-sum-desc": "Seçimlerinize göre otomatik oluşturulan talep özeti:",
      "w-sum-srv": "Hizmet Türü:",
      "w-sum-stg": "Proje Durumu:",
      "w-sum-time": "Zaman Çizelgesi:",
      "w-sum-note-head": "💡 Geliştirici Güvencesi:",
      "w-sum-note-body": "Talebiniz doğrudan kurucu geliştirici Mehmet Şahin'e iletilir. 30 dakika içinde teknik değerlendirme ve net çözüm planı paylaşıyoruz.",
      "w-btn-submit": "WhatsApp ile Gönder & Teklif Al",

      // Cases & Compare
      "cases-subtitle": "Fikirden Canlı Ürüne",
      "cases-title": "Geliştirdiğimiz Başarı Hikayeleri",
      "cases-desc": "Müşterilerimizin fikirlerini ve kilitlenen teknik süreçlerini nasıl yüksek performanslı canlı ürünlere dönüştürdük?",
      "case1-badge": "SaaS & B2B Platformu",
      "case1-title": "Sıfırdan Bulut Tabanlı B2B Finans Paneli",
      "case1-desc": "Girişimcinin kurguladığı karmaşık finansal analiz algoritması, 45 günde çok kullanıcılı, Stripe abonelikli ve gerçek zamanlı bir SaaS ürününe dönüştürüldü.",
      "case1-r1": "45 Günde Fikirden Canlı Yayına",
      "case1-r2": "İlk 3 Ayda 10.000+ Aktif İşlem",

      "case2-badge": "E-Ticaret & Web Dönüşümü",
      "case2-title": "0.4s Hızında Yüksek Dönüşümlü Web Sitesi",
      "case2-desc": "Google Ads maliyetleri yüksek olan bir kurumsal firmanın web sitesi sıfırdan kodlandı; açılış hızı 4.2 saniyeden 0.4 saniyeye indirilerek dönüşüm oranı 3 katına çıkarıldı.",
      "case2-r1": "Google Ads %380 ROAS Artışı",
      "case2-r2": "%99 PageSpeed Performans Skoru",

      "case3-badge": "Kurtarma & Optimizasyon",
      "case3-title": "Kilitlenen Backend & 24 Saatte Hata Kurtarma",
      "case3-desc": "Önceki yazılımcının yarım bıraktığı ve veri tabanı kilitlenen bir e-ticaret altyapısı acil müdahaleyle incelendi; SQL darboğazları giderilip sistem sıfır kayıpla kurtarıldı.",
      "case3-r1": "24 Saatte Canlıya Geri Dönüş",
      "case3-r2": "%70 Veritabanı Yükü Azaltımı",

      "compare-subtitle": "Neden Bizi Seçmelisiniz?",
      "compare-title": "Geleneksel Hantal Ajanslar vs. TMA Modeli",
      "compare-desc": "Aracıların ve bitmeyen toplantıların maliyetini değil, doğrudan kıdemli geliştiricinin hızını satın alın.",
      "cmp-feature": "Kriter / Özellik",
      "cmp-tma": "🚀 TMA Full-Stack Geliştirici",
      "cmp-trad": "❌ Geleneksel Hantal Ajanslar",
      "cmp-r1-title": "<strong>İletişim & Muhatap</strong>",
      "cmp-r1-tma": "Doğrudan kodu yazan Kıdemli Geliştirici (Mehmet Şahin)",
      "cmp-r1-trad": "Satış temsilcisi, proje yöneticisi ve junior aracılar",
      "cmp-r2-title": "<strong>Teslimat & İlerleme Hızı</strong>",
      "cmp-r2-tma": "İlk 48 saatte çalışan canlı prototip ve hızlı iterasyon",
      "cmp-r2-trad": "Haftalar süren brief toplantıları ve bürokratik gecikmeler",
      "cmp-r3-title": "<strong>Kod Kalitesi & Mülkiyet</strong>",
      "cmp-r3-tma": "%100 Sizin mülkiyetinizde, temiz, modern ve dokümante kod",
      "cmp-r3-trad": "Kapalı kutu sistemler, bağımlılık yaratan lisans kilitleri",
      "cmp-r4-title": "<strong>Hata Ayıklama & Çözüm Hızı</strong>",
      "cmp-r4-tma": "Anında müdahale, dakikalar içinde tespit ve hotfix",
      "cmp-r4-trad": "Haftalarca süren ticket ve onay süreçleri",
      "cmp-r5-title": "<strong>Fiyat / Performans</strong>",
      "cmp-r5-tma": "Gereksiz ofis/aracı maliyeti yok; sadece saf yazılım mühendisliği",
      "cmp-r5-trad": "Yüksek ajans kâr marjları ve gizli ek masraflar",

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
      "github-code-link": "Kodu İncele",
      "blog-subtitle": "Yayınlarımız & Makalelerimiz",
      "blog-title": "Son LinkedIn Paylaşımlarımız",
      "blog-desc": "Modern yazılım mimarisi, SaaS geliştirme süreçleri ve algoritmik sistemler üzerine analizlerimiz.",
      "blog-loading": "Makaleler yükleniyor...",
      "blog-view-profile": "Bizi LinkedIn'de Takip Edin",
      "blog-read-link": "LinkedIn'de Oku",

      // Contact & Footer
      "contact-subtitle": "Doğrudan İletişim",
      "contact-title": "Projenizi Birlikte Hayata Geçirelim",
      "contact-desc": "Web, SaaS, hata düzeltme veya bot geliştirme talepleriniz için doğrudan iletişime geçebilirsiniz. İzmir Konak merkezli ofisimizde veya online kanallardan 7/24 hizmetinizdeyiz.",
      "contact-founder-name": "Kurucu & Full-Stack Developer: Mehmet Şahin",
      "contact-founder-title": "Senior Full-Stack Developer & Algoritmik Sistemler",
      "contact-wa": "WhatsApp & Telefon Hattı",
      "contact-wa-sub": "Canlı Hızlı Destek (30 Sn Yanıt)",
      "contact-email": "Kurumsal E-Posta",
      "contact-address-title": "Ofis Adresimiz",
      "contact-addresses": "Akdeniz Mah. Heris Tower No:55/091 Konak / İzmir",
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
      "footer-tagline": "Elite Full-Stack Engineering & Software Studio",
      "fab-tooltip": "Doğrudan Mehmet Şahin ile Konuşun!",
      "sticky-wa": "WhatsApp ile Yazın",
      "sticky-calc": "Teklif Al",

      // About Page Keys
      "about-badge": "Mühendislik Vizyonumuz & Akademi",
      "about-title": "Hakkımızda & Geliştirme Felsefemiz",
      "about-breadcrumb-home": "Ana Sayfa",
      "about-breadcrumb-current": "Akademi & Hakkımızda",
      "about-intro-title": "Kodun Ötesinde: İşinizi ve Ürününüzü Büyüten Mühendislik",
      "about-intro-desc": "Trend Master Akademi (TMA), kurulduğu ilk günden bu yana karmaşık matematiksel algoritmaları, finansal botları ve kurumsal yazılım mimarilerini en saf, optimize ve test edilmiş haliyle hayata geçirmeyi ilke edinmiştir. Bugün TMA; modern web siteleri inşası, sıfırdan SaaS platformları, kilitlenen kodların kurtarılması ve yapay zeka entegrasyonlarıyla uçtan uca dijital çözümler üreten üst düzey bir mühendislik stüdyosudur.",
      "about-founder-name": "Kurucu & Full-Stack Developer: Mehmet Şahin",
      "about-founder-title": "Senior Full-Stack Developer & Algorithmic Systems Architect",
      "method-subtitle": "Nasıl Çalışıyoruz?",
      "method-title": "4 Adımda Fikirden Canlı Ürüne",
      "method-desc": "Ajansların bürokratik gecikmeleri olmadan, doğrudan kıdemli geliştirici ile şeffaf ve hızlı teslimat döngüsü.",
      "method-step1-title": "Keşif & Mimari Tasarım",
      "method-step1-desc": "İhtiyacınızı, hedef kitlenizi ve olası teknik darboğazları analiz eder; doğru veri tabanı ve teknoloji yığınını (Next.js, FastAPI, PostgreSQL vb.) belirleriz.",
      "method-step2-title": "Hızlı Kodlama & Canlı Prototip",
      "method-step2-desc": "Haftalarca bekletmek yerine, ilk 48 saat içinde çalışan bir prototip sunar; geri bildirimlerinizle adım adım ürünü canlı ortamda büyütürüz.",
      "method-step3-title": "Test, Güvenlik & Optimizasyon",
      "method-step3-desc": "Otomatik testler, SQL optimizasyonu, 0.4s açılış hızı testleri ve güvenlik açıklarının kapatılmasıyla sıfır hata (0 Bug) standardı uygularız.",
      "method-step4-title": "Canlıya Dağıtım & 7/24 Destek",
      "method-step4-desc": "Tam kaynak kod mülkiyetiyle projeyi sunucunuza kurar, CI/CD pipeline'larını bağlar ve yayından sonra kesintisiz teknik destek sağlarız.",
      "about-pillars-subtitle": "Finansal Yazılım & Akademi Boyutumuz",
      "about-pillars-title": "Algoritmik Ticaret & Finansal Akademi",
      "about-pillars-desc": "TMA Akademi, finansal piyasaların karmaşık yapısını matematiksel onaylar ve Pine Script kodlama disipliniyle öğreten köklü eğitim programımızdır.",
      "pillar1-title": "Piyasa Yapısı & Smart Money (SMC)",
      "pillar1-desc": "Grafikleri okumayı ve büyük kurumsal oyuncuların ayak izlerini takip etmeyi öğrenin.",
      "pillar1-f1": "Trend Takipçiliği Metotları",
      "pillar1-f2": "Price Action (Mum Formasyonları, MSB)",
      "pillar1-f3": "Kurumsal Likidite & Order Block",
      "pillar2-title": "Risk & Kasa Yönetimi",
      "pillar2-desc": "Sermayenizi korumayı ve matematiksel olarak büyütmeyi kavrayın.",
      "pillar2-f1": "Risk/Reward (R:R) Oranları (1:2 - 1:3 Kuralları)",
      "pillar2-f2": "İşlem Başına Maksimum %1-2 Risk Kuralları",
      "pillar2-f3": "Matematiksel Metrikler ve İlerleme Takibi",
      "pillar3-title": "Pine Script & Bot Kodlama",
      "pillar3-desc": "Stratejilerinizi TradingView Pine Script v5 ile kodlayın ve borsa API'lerine bağlayın.",
      "pillar3-f1": "Pine Script v5 İndikatör & Strateji Yazımı",
      "pillar3-f2": "Backtest & Forward Testing Optimizasyonu",
      "pillar3-f3": "Webhook ile Borsa Alım-Satım Otomasyonu",
      "pillar4-title": "Yatırımcı Psikolojisi & Disiplin",
      "pillar4-desc": "Sisteminize sadık kalarak duygularınızı yönetmeyi öğrenin.",
      "pillar4-f1": "FOMO (Fırsatı Kaçırma Korkusu) Yönetimi",
      "pillar4-f2": "İntikam İşlemlerinden Kaçınma Disiplini",
      "pillar4-f3": "Ticaret Günlüğü (Journaling) Oluşturma Rutinleri",
      "about-cta-title": "Projenizi veya Eğitiminizi Birlikte Planlayalım",
      "about-cta-desc": "İster modern bir yazılım projesi hayata geçirin, ister algoritmik sistemler konusunda uzmanlaşın. Doğrudan Mehmet Şahin ile iletişime geçin.",
      "about-cta-btn1": "Proje Başlat / Teklif Al",
      "about-cta-btn2": "WhatsApp ile Doğrudan Yazın"
    },
    en: {
      "site-title": "Trend Master Akademi | Elite Full-Stack Engineering & Digital Product Studio",
      "about-site-title": "About Us & Engineering Vision | Trend Master Akademi",
      
      // Navbar
      "logo-text": "TREND MASTER AKADEMİ",
      "logo-sub": "STUDIO & LABS",
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
      "hero-desc": "Building high-performance web applications and SaaS platforms from scratch, resolving critical code bottlenecks, AI/API integrations, and algorithmic systems. Direct senior developer guarantee with zero agency fluff.",
      "btn-hero-wizard": "Explain Your Project / Issue",
      "btn-hero-whatsapp": "Chat Directly on WhatsApp",
      
      // Engineering Deck
      "deck-tab-arch": "SaaS Architecture",
      "deck-tab-debug": "Live Terminal & Code",
      "deck-tab-algo": "Algo & Bot Engine",
      "node-ui-title": "Modern UI / UX",
      "node-ui-sub": "Next.js & React",
      "node-ui-tag": "0.4s Fast Load",
      "node-api-title": "REST / GraphQL",
      "node-api-sub": "Node.js & FastAPI",
      "node-api-tag": "<50ms Latency",
      "node-db-title": "DB & Cache",
      "node-db-sub": "PostgreSQL & Redis",
      "node-db-tag": "ACID & Scalable",
      "node-cloud-title": "Cloud Deploy",
      "node-cloud-sub": "Docker & CI/CD",
      "node-cloud-tag": "99.99% Uptime",
      "metric-delivery": "Clean Code Guarantee",
      "metric-api": "Average API Response",
      "metric-test": "TDD & Test Coverage",
      "debug-status-fixed": "✓ ALL TESTS PASSING",
      "terminal-build-ok": "✓ Build verified: 0 errors, 0 warnings. Deploying to prod...",
      "terminal-status-ok": "ℹ Status: 100% operational. Response time: 24ms.",

      // Trust Bar
      "trust-1-title": "10+ Years Experience",
      "trust-1-desc": "Senior Full-Stack Developer",
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
      "m-web-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> High Conversion Rate (CRO) & Ads Ready",
      "m-web-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Top-Tier SEO & Core Web Vitals",
      "m-btn-select-web": "Start Web Project",

      "badge-saas": "Idea to Product",
      "m-saas-title": "SaaS & Custom Web Application Architecture",
      "m-saas-desc": "Turning software concepts into scalable SaaS platforms with multi-tenant auth, recurring subscription billing, and robust admin dashboards.",
      "m-saas-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Multi-tenant Architecture & Secure Auth",
      "m-saas-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Stripe, Iyzico & Global Payment Gateways",
      "m-saas-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Comprehensive Admin & Customer Portals",
      "m-btn-select-saas": "Plan SaaS Project",

      "badge-bug": "Emergency Hotfix",
      "m-bug-title": "Code Solutions & Bug Recovery",
      "m-bug-desc": "Taking over broken or stalled codebases and restoring them within 24-48 hours. Code cleaning, fixing security vulnerabilities, and database tuning.",
      "m-bug-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Critical Bug Detection & Quick Hotfix",
      "m-bug-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Database Bottleneck & Query Tuning",
      "m-bug-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Complete Refactoring & Modernization",
      "m-btn-select-bug": "Request Bug Fix",

      "badge-ai": "Next-Gen AI",
      "m-ai-title": "AI, Webhook & Custom API Integrations",
      "m-ai-desc": "Custom LLM bots to automate internal workflows, and reliable API bridges linking CRM, ERP, payments, and fulfillment platforms.",
      "m-ai-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> OpenAI, Claude & Custom LLM Pipelines",
      "m-ai-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Webhooks & Asynchronous Event Queues",
      "m-ai-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Bidirectional Data Synchronization",
      "m-btn-select-ai": "Launch Integration",

      "badge-algo": "High Precision",
      "m-algo-title": "Custom Bots & Algorithmic Engineering",
      "m-algo-desc": "TradingView Pine Script v5 indicators, Python execution bots, arbitrage algorithms, and high-frequency exchange API automation.",
      "m-algo-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Pine Script v5 Custom Indicators & Strategies",
      "m-algo-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Binance, Bybit & Global Exchange APIs",
      "m-algo-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> 24/7 Autonomous Server Execution",
      "m-btn-select-algo": "Get Bot Solution",

      "badge-cto": "Strategic Advisory",
      "m-cto-title": "Technical Architecture & CTO Advisory",
      "m-cto-desc": "Selecting the optimal tech stack for your startup, code audits, cloud cost optimization, and end-to-end technical roadmaps.",
      "m-cto-f1": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Architecture Design & Tech Stack Selection",
      "m-cto-f2": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Cloud & Infrastructure Cost Reduction",
      "m-cto-f3": "<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='20 6 9 17 4 12'></polyline></svg> Security Audits & Code Performance Tuning",
      "m-btn-select-cto": "Book CTO Consultation",

      // Wizard
      "wizard-subtitle": "Smart Consultation & Estimator Wizard",
      "wizard-title": "Submit Your Project or Issue in 3 Steps",
      "wizard-desc": "Select your requirements to generate an instant technical brief and connect directly with Mehmet Şahin via WhatsApp.",
      "w-step1-title": "What kind of solution do you need?",
      "w-opt1-t": "🚀 SaaS & Web Application",
      "w-opt1-s": "From scratch MVP, billing & portal",
      "w-opt2-t": "🌐 Web App / Landing Page",
      "w-opt2-s": "High-converting & ultra fast web",
      "w-opt3-t": "⚡ Emergency Bug Fix & Recovery",
      "w-opt3-s": "Rescuing stalled codebases",
      "w-opt4-t": "🤖 AI / API / Webhook Integration",
      "w-opt4-s": "Automation & data bridges",
      "w-opt5-t": "📈 Custom Bot / Pine Script",
      "w-opt5-s": "Trading automation & math models",
      "w-opt6-t": "💡 Architecture & CTO Advisory",
      "w-opt6-s": "Stack selection & code audit",

      "w-step2-title": "What is the current status of your project?",
      "w-stg1-t": "✨ New Idea from Scratch",
      "w-stg1-s": "No coding started yet",
      "w-stg2-t": "⚠️ Incomplete / Stalled Codebase",
      "w-stg2-s": "Needs takeover & bug resolution",
      "w-stg3-t": "🔄 Scaling Existing System",
      "w-stg3-s": "New features & cloud scaling",
      "w-stg4-t": "🔥 Urgent Production Outage",
      "w-stg4-s": "Requires immediate hotfix",

      "w-step3-title": "Target timeline and urgency?",
      "w-time1-t": "⚡ Immediate / Urgent",
      "w-time1-s": "Start within 1-3 days",
      "w-time2-t": "📅 Within 1 - 2 Weeks",
      "w-time2-s": "In planning phase",

      "w-sum-title": "📋 Technical Pre-Brief Summary",
      "w-sum-desc": "Automatically generated summary based on your choices:",
      "w-sum-srv": "Service Type:",
      "w-sum-stg": "Project Status:",
      "w-sum-time": "Timeline:",
      "w-sum-note-head": "💡 Developer Guarantee:",
      "w-sum-note-body": "Your request goes directly to Founder & Senior Developer Mehmet Şahin. We provide an initial technical evaluation and roadmap within 30 minutes.",
      "w-btn-submit": "Send via WhatsApp & Get Quote",

      // Cases & Compare
      "cases-subtitle": "From Idea to Live Product",
      "cases-title": "Our Track Record & Success Stories",
      "cases-desc": "How we transformed client ideas and salvaged stalled codebases into high-performance production systems.",
      "case1-badge": "SaaS & B2B Platform",
      "case1-title": "From Scratch Cloud-Native B2B Financial SaaS",
      "case1-desc": "Transformed a complex financial analytics algorithm into a multi-tenant, real-time SaaS platform with Stripe billing in 45 days.",
      "case1-r1": "Idea to Live Production in 45 Days",
      "case1-r2": "10,000+ Active Transactions in Q1",

      "case2-badge": "E-Commerce & High-Speed Web",
      "case2-title": "0.4s Ultra-Fast High-Conversion Web Platform",
      "case2-desc": "Re-engineered a corporate web architecture with high Google Ads spend; reduced load time from 4.2s to 0.4s, tripling conversion rates.",
      "case2-r1": "+380% ROAS Increase on Google Ads",
      "case2-r2": "99% Google PageSpeed Performance Score",

      "case3-badge": "Recovery & Performance Tuning",
      "case3-title": "Stalled Backend Recovery in 24 Hours",
      "case3-desc": "Emergency intervention on a broken database backend left by previous developers; resolved SQL locks and recovered production with zero data loss.",
      "case3-r1": "Back Live in Production within 24 Hours",
      "case3-r2": "70% Reduction in Server/DB Load",

      "compare-subtitle": "Why Choose TMA?",
      "compare-title": "Traditional Bloated Agencies vs. TMA Model",
      "compare-desc": "Pay for pure senior developer velocity, not endless middleman meetings and agency overhead.",
      "cmp-feature": "Feature / Metric",
      "cmp-tma": "🚀 TMA Full-Stack Developer",
      "cmp-trad": "❌ Traditional Slow Agencies",
      "cmp-r1-title": "<strong>Direct Communication</strong>",
      "cmp-r1-tma": "Directly with Senior Developer who writes the code (Mehmet Şahin)",
      "cmp-r1-trad": "Sales reps, account managers, and junior middlemen",
      "cmp-r2-title": "<strong>Delivery Velocity</strong>",
      "cmp-r2-tma": "Working prototype in the first 48 hours & fast iterations",
      "cmp-r2-trad": "Weeks of bureaucratic briefing meetings and delays",
      "cmp-r3-title": "<strong>Code Quality & Ownership</strong>",
      "cmp-r3-tma": "100% full client source code ownership, clean & modern",
      "cmp-r3-trad": "Blackbox lock-in systems and proprietary license fees",
      "cmp-r4-title": "<strong>Debugging & Response Time</strong>",
      "cmp-r4-tma": "Immediate intervention, root-cause detection & hotfix in hours",
      "cmp-r4-trad": "Weeks of support ticketing queues and approval bottlenecks",
      "cmp-r5-title": "<strong>Value / Performance</strong>",
      "cmp-r5-tma": "Zero unnecessary office or overhead costs; pure software craftsmanship",
      "cmp-r5-trad": "High agency profit margins and hidden unexpected bills",

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
      "github-code-link": "View Source",
      "blog-subtitle": "Insights & Publications",
      "blog-title": "Recent LinkedIn Insights",
      "blog-desc": "Our articles and breakdowns on modern software architectures, SaaS development, and algorithmic systems.",
      "blog-loading": "Loading posts...",
      "blog-view-profile": "Follow Us on LinkedIn",
      "blog-read-link": "Read on LinkedIn",

      // Contact & Footer
      "contact-subtitle": "Direct Contact",
      "contact-title": "Let's Build Your Solution Together",
      "contact-desc": "Reach out directly for custom Web, SaaS, hotfix, or bot development requests. Available 24/7 online and at our İzmir Konak offices.",
      "contact-founder-name": "Founder & Full-Stack Developer: Mehmet Şahin",
      "contact-founder-title": "Senior Full-Stack Developer & Algorithmic Systems Architect",
      "contact-wa": "WhatsApp & Direct Phone",
      "contact-wa-sub": "Live Fast Support (30 Sec Response)",
      "contact-email": "Official Email",
      "contact-address-title": "Office Address",
      "contact-addresses": "Akdeniz Mah. Heris Tower No:55/091 Konak / İzmir, Turkey",
      "form-title": "Quick Project Request Form",
      "form-label-name": "Full Name",
      "form-placeholder-name": "e.g. John Doe",
      "form-label-email": "Email Address",
      "form-placeholder-email": "e.g. john@example.com",
      "form-label-phone": "Phone Number",
      "form-placeholder-phone": "e.g. +90 5XX XXX XX XX",
      "form-label-msg": "Your Project / Problem Summary",
      "form-placeholder-msg": "Tell us briefly about your web, SaaS, urgent bug fix, or custom bot needs...",
      "form-submit": "Send to Mehmet Şahin via WhatsApp",
      "footer-desc": "Your trusted partner in modern web & SaaS architectures, high-performance code debugging, AI integrations, and algorithmic software engineering.",
      "footer-quick": "Quick Links",
      "footer-legal-title": "Transparency & Guarantee",
      "footer-legal-desc": "All custom software is delivered with 100% full source code ownership. Academy materials and analysis software are not financial investment advice.",
      "footer-copy": "© 2026 Trend Master Akademi. Founder: Mehmet Şahin. All Rights Reserved.",
      "footer-tagline": "Elite Full-Stack Engineering & Software Studio",
      "fab-tooltip": "Chat directly with Mehmet Şahin!",
      "sticky-wa": "Chat on WhatsApp",
      "sticky-calc": "Get Quote",

      // About Page Keys
      "about-badge": "Engineering Vision & Academy",
      "about-title": "About Us & Engineering Philosophy",
      "about-breadcrumb-home": "Home",
      "about-breadcrumb-current": "Academy & About",
      "about-intro-title": "Beyond Code: Engineering That Scales Your Product",
      "about-intro-desc": "From day one, Trend Master Akademi (TMA) has been committed to bringing complex mathematical algorithms, trading bots, and enterprise software architectures to life in their purest, most optimized, and thoroughly tested form. Today, TMA is an elite engineering studio delivering end-to-end digital solutions spanning modern web applications, scalable SaaS platforms, critical code recovery, and AI integrations.",
      "about-founder-name": "Founder & Full-Stack Developer: Mehmet Şahin",
      "about-founder-title": "Senior Full-Stack Developer & Algorithmic Systems Architect",
      "method-subtitle": "How We Work",
      "method-title": "4 Steps from Idea to Production",
      "method-desc": "Transparent, rapid delivery cycles directly with a senior developer, free from agency bureaucracy.",
      "method-step1-title": "Discovery & Architectural Design",
      "method-step1-desc": "We analyze your exact requirements, target users, and potential bottlenecks, selecting the optimal database and tech stack (Next.js, FastAPI, PostgreSQL, etc.).",
      "method-step2-title": "Rapid Prototyping & Live Iteration",
      "method-step2-desc": "Instead of waiting for weeks, we deliver a working live prototype within the first 48 hours and scale it step-by-step based on your feedback.",
      "method-step3-title": "Testing, Security & Optimization",
      "method-step3-desc": "We enforce a zero-bug standard with automated test suites, SQL query tuning, 0.4s speed audits, and security vulnerability patching.",
      "method-step4-title": "Production Deployment & 24/7 Support",
      "method-step4-desc": "We deploy the system to your cloud servers with 100% source code ownership, set up CI/CD pipelines, and provide continuous technical support.",
      "about-pillars-subtitle": "Financial Software & Academy Dimension",
      "about-pillars-title": "Algorithmic Trading & Financial Academy",
      "about-pillars-desc": "TMA Academy is our established education track teaching financial market structure through rigorous mathematical confirmations and Pine Script coding discipline.",
      "pillar1-title": "Market Structure & Smart Money (SMC)",
      "pillar1-desc": "Master chart structure reading and tracking institutional footprints.",
      "pillar1-f1": "Trend Following Methodologies",
      "pillar1-f2": "Price Action (Candle Formations, Market Structure Breaks)",
      "pillar1-f3": "Institutional Liquidity & Order Blocks",
      "pillar2-title": "Risk & Portfolio Management",
      "pillar2-desc": "Understand capital preservation and mathematical equity compounding.",
      "pillar2-f1": "Risk/Reward (R:R) Ratios (1:2 to 1:3 Rules)",
      "pillar2-f2": "Strict 1-2% Max Risk Rules per Trade",
      "pillar2-f3": "Mathematical Metrics & Performance Tracking",
      "pillar3-title": "Pine Script & Bot Development",
      "pillar3-desc": "Code your strategies in TradingView Pine Script v5 and connect to exchange APIs.",
      "pillar3-f1": "Pine Script v5 Custom Indicators & Strategies",
      "pillar3-f2": "Backtesting & Forward-Testing Optimization",
      "pillar3-f3": "Webhook Execution & Exchange Automation",
      "pillar4-title": "Trader Psychology & Discipline",
      "pillar4-desc": "Manage emotions and maintain consistent adherence to rules.",
      "pillar4-f1": "FOMO (Fear of Missing Out) Management",
      "pillar4-f2": "Discipline Against Revenge Trading",
      "pillar4-f3": "Trading Journal Routines & Mindset",
      "about-cta-title": "Let's Plan Your Project or Training",
      "about-cta-desc": "Whether you are launching a modern digital product or mastering algorithmic systems, get in touch directly with Mehmet Şahin.",
      "about-cta-btn1": "Start Project / Get Quote",
      "about-cta-btn2": "Direct Chat on WhatsApp"
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

    // Apply data-i18n attributes
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    // Apply data-i18n-placeholder attributes
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key]) {
        el.setAttribute('placeholder', translations[lang][key]);
      }
    });

    // Update dynamic wizard summary values in active language
    updateWizardSummary(currentLang);

    // Re-render testimonials in active language
    renderTestimonials(currentLang);
  }

  if (langBtnTr) langBtnTr.addEventListener('click', () => applyLanguage('tr'));
  if (langBtnEn) langBtnEn.addEventListener('click', () => applyLanguage('en'));


  // ==========================================
  // 3. CALM & SMOOTH HEADLINE TICKER (ZERO JITTER)
  // ==========================================
  const typewriterElement = document.getElementById('typewriterText');
  if (typewriterElement) {
    const headlinesTr = [
      "Fikirden Canlı Ürüne SaaS ve Web Çözümleri",
      "Tıkanan Kodlar ve Canlı Hatalar İçin Acil Destek",
      "Yapay Zeka, Webhook & Özel API Entegrasyonları",
      "Özel Algoritmik Botlar ve Finansal Mühendislik",
      "Kıdemli Full-Stack Geliştirici Güvencesiyle 0 Bug"
    ];
    const headlinesEn = [
      "From Idea to Scaled Web & SaaS Products",
      "Emergency Hotfixes for Stalled Codebases",
      "AI Pipelines, Webhooks & Custom API Bridges",
      "Autonomous Trading Bots & High-Frequency Logic",
      "Direct Senior Developer Guarantee with 0 Bugs"
    ];

    let headlineIndex = 0;
    typewriterElement.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    typewriterElement.style.display = 'inline-block';

    function rotateHeadline() {
      const list = currentLang === 'en' ? headlinesEn : headlinesTr;
      headlineIndex = (headlineIndex + 1) % list.length;
      
      typewriterElement.style.opacity = '0';
      typewriterElement.style.transform = 'translateY(4px)';
      
      setTimeout(() => {
        typewriterElement.textContent = list[headlineIndex];
        typewriterElement.style.opacity = '1';
        typewriterElement.style.transform = 'translateY(0)';
      }, 350);
    }

    setInterval(rotateHeadline, 3800);
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

      if (targetTabId === 'tabAlgo' && typeof resizeCanvas === 'function') {
        setTimeout(() => {
          resizeCanvas();
          drawChart();
        }, 50);
      }
    });
  });


  // ==========================================
  // 5. INTERACTIVE LEAD WIZARD (HESAPLAYICI)
  // ==========================================
  const wizardKeys = {
    serviceKey: 'saas',
    stageKey: 'stage-idea',
    timeKey: 'time-now'
  };

  const wizardLabels = {
    tr: {
      services: {
        'saas': 'SaaS & Web Uygulaması',
        'web': 'Modern Web Sitesi & Landing Page',
        'bugfix': 'Kod Onarımı & Bug Fix',
        'ai': 'Yapay Zeka & API Entegrasyonu',
        'algo': 'Özel Bot & Algoritmik Sistem',
        'cto': 'Teknik Mimarlık & CTO Danışmanlığı'
      },
      stages: {
        'stage-idea': 'Sıfırdan Yeni Fikir / Proje',
        'stage-stalled': 'Yarım Kalmış / Sorunlu Kod Tabanı',
        'stage-scale': 'Mevcut Sistemi Yenileme / Büyütme',
        'stage-urgent': 'Acil Müdahale Gereken Canlı Hata'
      },
      times: {
        'time-now': 'Hemen / Bu Hafta Başlamak İstiyorum',
        'time-soon': '1 - 2 Hafta İçinde'
      }
    },
    en: {
      services: {
        'saas': 'SaaS & Web Application',
        'web': 'Modern Web & Landing Page',
        'bugfix': 'Emergency Bug Fix & Code Recovery',
        'ai': 'AI / API / Webhook Integration',
        'algo': 'Custom Bot & Algorithmic Engine',
        'cto': 'Architecture & CTO Advisory'
      },
      stages: {
        'stage-idea': 'New Idea from Scratch',
        'stage-stalled': 'Incomplete / Stalled Codebase',
        'stage-scale': 'Scaling Existing System',
        'stage-urgent': 'Urgent Production Outage'
      },
      times: {
        'time-now': 'Immediate / Within 1-3 Days',
        'time-soon': 'Within 1 - 2 Weeks'
      }
    }
  };

  const sumService = document.getElementById('sumService');
  const sumStage = document.getElementById('sumStage');
  const sumTime = document.getElementById('sumTime');

  function updateWizardSummary(lang) {
    const dict = wizardLabels[lang] || wizardLabels.tr;
    if (sumService) sumService.textContent = dict.services[wizardKeys.serviceKey] || dict.services['saas'];
    if (sumStage) sumStage.textContent = dict.stages[wizardKeys.stageKey] || dict.stages['stage-idea'];
    if (sumTime) sumTime.textContent = dict.times[wizardKeys.timeKey] || dict.times['time-now'];
  }

  function bindOptionGroup(containerId, keyField) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const options = container.querySelectorAll('.wizard-option');
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        const valKey = opt.getAttribute('data-wizard-val') || 'saas';
        wizardKeys[keyField] = valKey;
        updateWizardSummary(currentLang);
      });
    });
  }

  bindOptionGroup('wizardServiceOptions', 'serviceKey');
  bindOptionGroup('wizardStageOptions', 'stageKey');
  bindOptionGroup('wizardTimeOptions', 'timeKey');

  // Allow matrix cards to trigger specific wizard services
  const matrixActionBtns = document.querySelectorAll('[data-wizard-service]');
  matrixActionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const srvType = btn.getAttribute('data-wizard-service');
      const wizardServiceContainer = document.getElementById('wizardServiceOptions');
      if (wizardServiceContainer) {
        const options = wizardServiceContainer.querySelectorAll('.wizard-option');
        options.forEach(opt => {
          const valKey = opt.getAttribute('data-wizard-val');
          if (valKey === srvType) {
            options.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            wizardKeys.serviceKey = valKey;
            updateWizardSummary(currentLang);
          }
        });
      }
    });
  });

  // Wizard Dispatch Button to WhatsApp
  const btnDispatchWizard = document.getElementById('btnDispatchWizard');
  if (btnDispatchWizard) {
    btnDispatchWizard.addEventListener('click', () => {
      const dict = wizardLabels[currentLang] || wizardLabels.tr;
      const srv = dict.services[wizardKeys.serviceKey] || dict.services['saas'];
      const stg = dict.stages[wizardKeys.stageKey] || dict.stages['stage-idea'];
      const tim = dict.times[wizardKeys.timeKey] || dict.times['time-now'];

      let message = '';
      if (currentLang === 'en') {
        message = `Hello Mehmet,\n\nI would like to submit a project request from the Trend Master Akademi website wizard:\n\n📌 *Required Solution:* ${srv}\n📊 *Current Stage:* ${stg}\n⏱️ *Timeline:* ${tim}\n\nCould we have a quick initial technical consultation and quote?`;
      } else {
        message = `Merhaba Mehmet Bey,\n\nTrend Master Akademi web sitenizdeki proje sihirbazından teknik bir talep oluşturmak istiyorum:\n\n📌 *İhtiyaç Duyulan Hizmet:* ${srv}\n📊 *Proje Aşaması:* ${stg}\n⏱️ *Zaman / Öncelik:* ${tim}\n\nBu kapsamda sizinle hızlı bir ön değerlendirme ve teklif görüşmesi yapabilir miyiz?`;
      }
      
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

      let fullMessage = '';
      if (currentLang === 'en') {
        fullMessage = `Hello Mehmet,\n\nI am sending a new project inquiry from your website contact form:\n\n👤 *Full Name:* ${name}\n📧 *Email:* ${email}\n📞 *Phone:* ${phone}\n💬 *Project Details:* ${msg}\n\nLooking forward to your response.`;
      } else {
        fullMessage = `Merhaba Mehmet Bey,\n\nWeb sitenizdeki iletişim formundan yeni bir talep gönderiyorum:\n\n👤 *Ad Soyad:* ${name}\n📧 *E-Posta:* ${email}\n📞 *Telefon:* ${phone}\n💬 *Talep Detayı:* ${msg}\n\nDetayları görüşmek üzere dönüşünüzü rica ederim.`;
      }

      const encodedMsg = encodeURIComponent(fullMessage);
      window.open(`https://wa.me/905343713573?text=${encodedMsg}`, '_blank');
    });
  }


  // ==========================================
  // 7. CHART SIMULATOR (ALGO BOT CANVAS)
  // ==========================================
  const canvas = document.getElementById('chartCanvas');
  let resizeCanvas, drawChart;

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let candles = [];
    const candleCount = 45;
    let basePrice = 100;
    
    resizeCanvas = function() {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight || 300;
      canvas.width = width;
      canvas.height = height;
    };
    
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

    drawChart = function() {
      if (!canvas.offsetParent) return; // Do not draw if tab is inactive/hidden
      if (!width || !height) {
        resizeCanvas();
        if (!width) return;
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
    };

    // Step chart smoothly when active
    setInterval(() => {
      if (!canvas.offsetParent) return;
      const lastCandle = candles[candles.length - 1];
      const change = (Math.random() - 0.47) * 2.8;
      const open = lastCandle.close;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * 1.5;
      const low = Math.min(open, close) - Math.random() * 1.5;

      candles.shift();
      candles.push({ open, close, high, low });
      drawChart();
    }, 1500);
  }


  // ==========================================
  // 8. BILINGUAL TESTIMONIALS (CLEAN 2x2 GRID)
  // ==========================================
  const testimonialsTr = [
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

  const testimonialsEn = [
    {
      name: "Burak Yilmaz",
      role: "SaaS Founder & E-Commerce Entrepreneur",
      text: "We launched our SaaS platform from scratch in 40 days with Mehmet. The code quality, Stripe billing architecture, and zero-bug execution represent top-tier full-stack craftsmanship.",
      rating: 5
    },
    {
      name: "Canan Erdem",
      role: "Managing Director, Growth Agency",
      text: "Our Google Ads landing speed was severely lagging. TMA re-engineered our website from the ground up: load speed plummeted to 0.35 seconds, and our lead conversion rate tripled immediately.",
      rating: 5
    },
    {
      name: "Murat Demir",
      role: "Quantitative Trader & Bot Developer",
      text: "Thanks to Mehmet's mentorship in Pine Script v5, I transformed my discretionary strategies into autonomous trading algorithms. He teaches not just syntax, but mathematical risk control.",
      rating: 5
    },
    {
      name: "Serdar Koc",
      role: "Chief Technology Officer (CTO)",
      text: "We requested emergency intervention for locked database queries and failing backend microservices. Mehmet diagnosed and repaired the bottleneck within 24 hours. Highly recommended.",
      rating: 5
    }
  ];

  const carousel = document.getElementById('testimonialsCarousel');

  function renderTestimonials(lang) {
    if (!carousel) return;
    const list = lang === 'en' ? testimonialsEn : testimonialsTr;
    carousel.innerHTML = '';
    
    list.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      
      let stars = '';
      for (let i = 0; i < item.rating; i++) {
        stars += `<svg width="16" height="16" viewBox="0 0 24 24" fill="#ffbd2e" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
      }

      card.innerHTML = `
        <div>
          <div class="testimonial-stars" style="display: flex; gap: 4px; margin-bottom: 16px;">${stars}</div>
          <p class="testimonial-text" style="font-size: 0.95rem; color: var(--text-main); line-height: 1.7; margin-bottom: 20px; font-style: italic;">"${item.text}"</p>
        </div>
        <div class="testimonial-author">
          <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--accent-blue); margin-bottom: 2px;">${item.name}</h4>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${item.role}</span>
        </div>
      `;
      carousel.appendChild(card);
    });
  }


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
          const actionBtnText = currentLang === 'en' ? 'View Source' : 'Kodu İncele';
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
                  ${repo.description || (currentLang === 'en' ? 'Trend Master Akademi open-source engineering project.' : 'Trend Master Akademi açık kaynak kodlu mühendislik projesi.')}
                </p>
              </div>
              <a href="${repo.html_url}" target="_blank" class="matrix-action-btn" style="margin-top: 10px;">
                <span>${actionBtnText}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </a>
            `;
            githubContainer.appendChild(card);
          });
        } else {
          githubContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">
              ${currentLang === 'en' ? 'Explore our open-source software libraries directly on our GitHub profile.' : 'Açık kaynak projelerimizi GitHub profilimiz üzerinden doğrudan inceleyebilirsiniz.'}
            </div>
          `;
        }
      })
      .catch(() => {
        if (githubContainer) {
          githubContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">
              ${currentLang === 'en' ? 'Explore our open-source software libraries directly on our GitHub profile.' : 'Açık kaynak projelerimizi GitHub profilimiz üzerinden doğrudan inceleyebilirsiniz.'}
            </div>
          `;
        }
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
          const readBtnText = currentLang === 'en' ? 'Read on LinkedIn' : "LinkedIn'de Oku";
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
                <span>${readBtnText}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </a>
            `;
            blogContainer.appendChild(card);
          });
        } else {
          blogContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">
              ${currentLang === 'en' ? 'Follow our recent software breakdowns and publications directly on LinkedIn.' : 'En güncel yayınlarımızı ve yazılım analizlerimizi LinkedIn profilimizden takip edebilirsiniz.'}
            </div>
          `;
        }
      })
      .catch(() => {
        if (blogContainer) {
          blogContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">
              ${currentLang === 'en' ? 'Follow our recent software breakdowns and publications directly on LinkedIn.' : 'En güncel yayınlarımızı ve yazılım analizlerimizi LinkedIn profilimizden takip edebilirsiniz.'}
            </div>
          `;
        }
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

  // Initialize language on startup
  applyLanguage(currentLang);

});
