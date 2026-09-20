export const codeHealthData = {
  tr: {
    hero: {
      badge: "MÜHENDİSLİK DENETİMİ & TEKNİK BORÇ",
      title: "Kod Tabanı Sağlığı & Teknik Borç Kontrol Listesi",
      subtitle: "Yazılımınızı çöpe atmadan veya yeni bir geliştiriciye devretmeden önce; mimari ayrışma, test disiplini, veritabanı hijyeni ve devir hazırlığını 20 objektif kriterle denetleyin.",
      notice: "Bu denetim sıfır erişim gerektirir; kodunuzu veya şifrelerinizi TMA ile paylaşmanız gerekmez."
    },
    categories: [
      {
        id: "architecture",
        title: "1. Mimari & Bağımlılık Ayrışması",
        desc: "Kodun modülerliği, bileşen sınırları ve bakım kolaylığı.",
        items: [
          { id: "c1", title: "Katmanlı / Modüler Mimari", desc: "İş mantığı (business logic), veri erişim katmanı ve API uçları birbirinden kesin çizgilerle ayrılmış mı?", weight: 5, risk: "Değişikliklerin zincirleme yan etkiyle sistemi çökertmesi." },
          { id: "c2", title: "Dairesel Bağımlılıkların Yokluğu", desc: "Modüller veya dosyalar arasında birbirini çağıran döngüsel (circular) import/require zincirleri yok mu?", weight: 5, risk: "Çalışma anında sessiz kilitlenme ve memory leak riski." },
          { id: "c3", title: "Güncel Paket & Kütüphane Versiyonları", desc: "Kritik bağımlılıklar ve framework son 2 yıl içinde yayınlanmış desteklenen LTS sürümlerde mi?", weight: 5, risk: "Güvenlik açıkları ve yamalanması imkansız kütüphane hataları." },
          { id: "c4", title: "Ölü Kod ve Spagetti Yoğunluğu", desc: "Kullanılmayan binlerce satırlık 'yorum satırına alınmış' veya yetim (orphaned) fonksiyonlardan arındırılmış mı?", weight: 5, risk: "Yeni geliştiricinin sistemi anlamasının haftalar sürmesi." },
          { id: "c5", title: "Tek Sorumluluk Prensibi (SRP)", desc: "Tek bir dosyada 2000+ satırlık 'her işi yapan tanrı fonksiyonlar' (God Objects) bulunmuyor mu?", weight: 5, risk: "Bir bug'ı düzeltirken 3 yeni bug üretilmesi." }
        ]
      },
      {
        id: "testing",
        title: "2. Test Piramidi & Kalite Güvencesi",
        desc: "Otomatik test kapsamı ve canlı ortam hata izolasyonu.",
        items: [
          { id: "c6", title: "Otomatik Birim (Unit) Testleri", desc: "Çekirdek finansal/iş mantığını kapsayan otomatik unit testler mevcut ve yeşil mi?", weight: 5, risk: "Her deploy'un müşteriler üzerinde canlıda test edilmesi." },
          { id: "c7", title: "Kritik Yol Entegrasyon Testleri", desc: "Ödeme, kayıt, sepet veya yetkilendirme gibi kritik akışlar end-to-end veya API düzeyinde test ediliyor mu?", weight: 5, risk: "Flash sale veya lansman esnasında ödeme ağ geçidinin çökmesi." },
          { id: "c8", title: "Staging / Canlı Ortam Paritesi", desc: "Test ortamı, veritabanı şeması ve konfigürasyonu canlı ortamın birebir kopyası mı?", weight: 5, risk: "'Lokalimde çalışıyordu ama sunucuda patladı' krizleri." },
          { id: "c9", title: "CI Otomasyonunda Test Koşumu", desc: "Her Pull Request veya commit merge öncesinde otomatik testler zorunlu koşuluyor mu?", weight: 5, risk: "Bozuk kodların doğrudan canlı sunucuya fırlatılması." },
          { id: "c10", title: "Hata İzleme & APM Entegrasyonu", desc: "Sentry, Datadog veya benzeri bir araçla unhandled exceptions anlık olarak loglanıyor mu?", weight: 5, risk: "Kritik arızaların müşterilerden gelen şikayetlerle öğrenilmesi." }
        ]
      },
      {
        id: "database",
        title: "3. Veritabanı & Veri Bütünlüğü",
        desc: "Şema disiplini, indeksleme stratejisi ve veri tutarlılığı.",
        items: [
          { id: "c11", title: "Otomatik Migrasyon Disiplini", desc: "Veritabanı değişiklikleri manuel SQL çalıştırmak yerine koddaki migrasyon dosyalarıyla mı yönetiliyor?", weight: 5, risk: "Geliştiriciler arasında şema uyuşmazlığı ve veri kaybı." },
          { id: "c12", title: "Foreign Key & Bütünlük Kısıtları", desc: "Tablolar arasında ilişkisel kısıtlamalar (constraints) tanımlı ve yetim kayıt oluşumu engellenmiş mi?", weight: 5, risk: "Tutarsız veriler sebebiyle raporların ve bakiyelerin bozulması." },
          { id: "c13", title: "Sorgu İndeksleme Stratejisi", desc: "Yüksek hacimli tablolarda WHERE ve JOIN kolonları uygun indekslere sahip mi?", weight: 5, risk: "Tablo büyüdükçe CPU'nun %100 Seq Scan ile kilitlenmesi." },
          { id: "c14", title: "Bağlantı Havuzu (Connection Pool) Yönetimi", desc: "PgBouncer veya ORM pool ayarları yapılandırılmış ve connection leak'ler önlenmiş mi?", weight: 5, risk: "Trafik sıçramasında veritabanının 'too many connections' hatası vermesi." },
          { id: "c15", title: "Düzenli Yedekleme & Geri Yükleme Testi", desc: "Veritabanı yedekleri periyodik olarak alınıyor ve en az bir kez başarıyla geri yüklendi mi?", weight: 5, risk: "Kriz anında 'yedek var sanılıp yedeğin bozuk çıkması' felaketi." }
        ]
      },
      {
        id: "security_handover",
        title: "4. Güvenlik, Devir & Operasyonel Bağımsızlık",
        desc: "Erişim kilitleri, çevre değişkenleri ve tek geliştirici bağımlılığı.",
        items: [
          { id: "c16", title: "Kod İçinde Hardcoded Secret Bulunmaması", desc: "API anahtarları, DB şifreleri ve gizli token'lar kod repolarına gömülmemiş mi?", weight: 5, risk: "Repo sızıntısında tüm altyapının ve müşteri verilerinin ele geçirilmesi." },
          { id: "c17", title: "Tek Kişiye Bağımlılığın (Bus Factor) Yokluğu", desc: "Projenin nasıl derleneceği ve deploy edileceği tek bir geliştiricinin hafızasında değil, yazılı mı?", weight: 5, risk: "Yazılımcı işten ayrıldığında projenin kilitlenmesi." },
          { id: "c18", title: "Erişim Kilitleri & Ayrılan Personel İptalleri", desc: "Eski çalışanların veya ajansların SSH, AWS veya veritabanı erişimleri tamamen kapatıldı mı?", weight: 5, risk: "Yetkisiz silme, sabotaj veya veri hırsızlığı." },
          { id: "c19", title: "Tek Tıkla / Otomatik Deploy Pipeline", desc: "Canlıya çıkış manuel FTP/SSH ile dosya kopyalamak yerine tek komutla veya CI/CD ile mi yapılıyor?", weight: 5, risk: "Yanlış dosyanın canlıya atılmasıyla tüm sitenin 500'e düşmesi." },
          { id: "c20", title: "Mimari Dokümantasyon & README", desc: "Yeni başlayan bir kıdemli mühendis repoyu klonlayıp 30 dakikada lokalde ayağa kaldırabiliyor mu?", weight: 5, risk: "Devir sürecinin aylar süren maliyetli bir kördüğüme dönmesi." }
        ]
      }
    ],
    scoreLevels: {
      critical: {
        range: "0 – 39 Puan",
        title: "Kritik Koma — Acil SWAT Müdahalesi Zorunlu",
        desc: "Kod tabanınız şu an canlı bombadır. Her deploy yüksek risk taşır, geliştirici bağımlılığı kritiktir ve veri kaybı riski çok yüksektir.",
        action: "Canlıya yeni özellik eklemeyi durdurun; hemen TMA SWAT triyaj randevusu alın."
      },
      warning: {
        range: "40 – 69 Puan",
        title: "Ağır Teknik Borç — Refactor & Stabilizasyon Gerekli",
        desc: "Sistem çalışıyor ancak geliştirme hızı yarı yarıya düşmüş durumda. Küçük değişiklikler beklenmedik yerleri bozuyor.",
        action: "TMA ile Strangler Fig veya kontrollü refactor planı oluşturun."
      },
      good: {
        range: "70 – 84 Puan",
        title: "Stabilize Edilebilir — Önleyici Bakım Yeterli",
        desc: "Çekirdek yapı fena değil; eksik birkaç test ve indeksleme iyileştirmesiyle yüksek güvenilirlik seviyesine çıkabilir.",
        action: "Kritik eksikleri kapatmak için TMA danışmanlık masası brifingi alın."
      },
      excellent: {
        range: "85 – 100 Puan",
        title: "Üretim Standartlarında — Dayanıklı ve Sağlıklı",
        desc: "Tebrikler. Kod tabanınız sektörün en iyi %5'lik diliminde yer alıyor. Devir veya ölçeklenme için hazır.",
        action: "Mevcut standartlarınızı korumak için periyodik denetim yapın."
      }
    },
    labels: {
      scoreTitle: "Hesaplanan Kod Tabanı Sağlık Skoru",
      selectAll: "+ Tümünü Seç",
      clearAll: "Temizle",
      topRisks: "En Acil 3 Yangın Riski",
      copyReport: "CTO / Yönetim Denetim Raporunu Kopyala",
      copiedNotice: "Kod denetim raporu panoya kopyalandı!",
      triageCta: "Bu Skor İçin SWAT İncelemesi Başlat"
    }
  },
  en: {
    hero: {
      badge: "ENGINEERING AUDIT & TECHNICAL DEBT",
      title: "Codebase Health & Technical Debt Audit Checklist",
      subtitle: "Before scrapping working software or handing off code to a new team; audit architectural coupling, test discipline, database hygiene, and handover readiness across 20 objective criteria.",
      notice: "Zero access required: you never need to share code, credentials, or repositories with TMA."
    },
    categories: [
      {
        id: "architecture",
        title: "1. Architecture & Coupling",
        desc: "Modularity, component boundaries, and maintainability.",
        items: [
          { id: "c1", title: "Layered / Modular Architecture", desc: "Is business logic strictly decoupled from persistence layers and API endpoints?", weight: 5, risk: "Cascading side-effects breaking unrelated production features." },
          { id: "c2", title: "Absence of Circular Dependencies", desc: "Are modules free of cyclic import chains that cause silent runtime locks?", weight: 5, risk: "Silent deadlocks and runaway V8 memory leaks." },
          { id: "c3", title: "Maintained Dependency Versions", desc: "Are frameworks and libraries on LTS versions supported within the last 2 years?", weight: 5, risk: "Unpatchable CVE vulnerabilities and zero-day exposure." },
          { id: "c4", title: "Zero Dead Code & Low Spaghetti", desc: "Is the repo purged of thousands of lines of commented-out or orphaned routines?", weight: 5, risk: "Onboarding new engineers takes weeks of guesswork." },
          { id: "c5", title: "Single Responsibility Principle (SRP)", desc: "Are routines free of 2,000+ line God Objects that attempt to do everything?", weight: 5, risk: "Fixing one bug inevitably spawns three new regressions." }
        ]
      },
      {
        id: "testing",
        title: "2. Testing Pyramid & Quality Assurance",
        desc: "Automated regression testing and production fault isolation.",
        items: [
          { id: "c6", title: "Automated Unit Test Suites", desc: "Do automated unit tests exist and pass for core business and calculation logic?", weight: 5, risk: "Every release is tested live on paying customers." },
          { id: "c7", title: "Critical Path Integration Tests", desc: "Are checkout, authentication, and payment workflows validated end-to-end?", weight: 5, risk: "Payment gateway silently fails during marketing campaigns." },
          { id: "c8", title: "Staging / Production Parity", desc: "Does the staging environment mirror production databases and service configs?", weight: 5, risk: "'Worked on my machine, broke on production' nightmares." },
          { id: "c9", title: "Mandatory CI Build Gates", desc: "Are automated tests enforced as a blocking prerequisite before PR merges?", weight: 5, risk: "Broken builds land straight in production." },
          { id: "c10", title: "Real-time Error Tracking & APM", desc: "Are unhandled exceptions tracked in real-time via Sentry, Datadog, or similar?", weight: 5, risk: "Discovering critical outages only after customers complain." }
        ]
      },
      {
        id: "database",
        title: "3. Database Hygiene & Data Integrity",
        desc: "Schema migrations, query indexing, and consistency guarantees.",
        items: [
          { id: "c11", title: "Automated Migration Discipline", desc: "Are schema changes versioned via code migrations rather than manual SQL queries?", weight: 5, risk: "Schema drift between developers causing catastrophic data loss." },
          { id: "c12", title: "Foreign Keys & Integrity Constraints", desc: "Are relational constraints enforced to prevent orphaned records in tables?", weight: 5, risk: "Corrupted balance ledgers and inaccurate financial audits." },
          { id: "c13", title: "Composite Query Indexing Strategy", desc: "Are frequently filtered WHERE and JOIN columns backed by appropriate indexes?", weight: 5, risk: "CPU spikes to 100% due to full table sequential scans." },
          { id: "c14", title: "Connection Pool Management", desc: "Are connection pooling (e.g. PgBouncer) and ORM limits strictly configured?", weight: 5, risk: "'Too many connections' fatal crash under modest traffic surges." },
          { id: "c15", title: "Regular Backup & Restoration Drill", desc: "Are backups automated and has a full restoration been tested in the last 6 months?", weight: 5, risk: "Discovering backups were corrupted only during an active disaster." }
        ]
      },
      {
        id: "security_handover",
        title: "4. Security, Handover & Operational Independence",
        desc: "Credential safety, access revocations, and bus factor risks.",
        items: [
          { id: "c16", title: "Zero Hardcoded Secrets in Code", desc: "Are all API keys, DB passwords, and private tokens stored outside version control?", weight: 5, risk: "Immediate infrastructure compromise in case of repository leaks." },
          { id: "c17", title: "Low Bus Factor (Zero Single-Dev Lock)", desc: "Is deployment and build architecture documented rather than in one person's head?", weight: 5, risk: "Project becomes completely locked if a key developer departs." },
          { id: "c18", title: "Revoked Access for Departed Staff", desc: "Have former contractors and developers had all SSH, AWS, and DB keys revoked?", weight: 5, risk: "Unauthorized data exfiltration, sabotage, or IP theft." },
          { id: "c19", title: "One-Click Automated Deployment", desc: "Are deploys triggered via CI/CD pipelines instead of manual SSH/FTP file transfers?", weight: 5, risk: "Accidental overwrite of wrong files causing 500 error cascades." },
          { id: "c20", title: "Architectural Documentation & README", desc: "Can a newly onboarded senior engineer run the stack locally in under 30 minutes?", weight: 5, risk: "Handover drags into a multi-month financial quagmire." }
        ]
      }
    ],
    scoreLevels: {
      critical: {
        range: "0 – 39 Points",
        title: "Critical Coma — Immediate SWAT Triage Required",
        desc: "Your codebase is an active liability. Every deploy carries high regression risk, key-person dependency is severe, and data loss hazards are acute.",
        action: "Halt new feature work; book an immediate TMA SWAT triage review."
      },
      warning: {
        range: "40 – 69 Points",
        title: "Heavy Technical Debt — Refactoring & Stabilization Needed",
        desc: "The system is running, but developer velocity is halved. Minor modifications routinely trigger regressions in unrelated modules.",
        action: "Partner with TMA to map a Strangler Fig or staged stabilization plan."
      },
      good: {
        range: "70 – 84 Points",
        title: "Recoverable — Preventive Hardening Sufficient",
        desc: "The core architecture is sound; addressing a few test and indexing gaps will elevate resilience to top-tier standards.",
        action: "Request an advisory briefing from TMA to close remaining vulnerabilities."
      },
      excellent: {
        range: "85 – 100 Points",
        title: "Production-Ready — Highly Resilient & Audited",
        desc: "Congratulations. Your codebase ranks in the top 5% of industry engineering standards. Ready for handover or scale.",
        action: "Maintain periodic audits to safeguard current standards."
      }
    },
    labels: {
      scoreTitle: "Calculated Codebase Health Score",
      selectAll: "+ Select All",
      clearAll: "Clear",
      topRisks: "Top 3 Critical Fire Hazards",
      copyReport: "Copy CTO / Executive Audit Brief",
      copiedNotice: "Code audit brief copied to clipboard!",
      triageCta: "Initiate SWAT Review for This Score"
    }
  }
};
