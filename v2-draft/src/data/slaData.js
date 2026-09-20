/**
 * Transparent Engineering SLA & Commitment Matrix Data
 * TMA'nın B2B ajanslar ve teknoloji şirketlerine sunduğu resmi hizmet taahhütleri.
 */

export const slaTiers = [
  {
    level: 'SEV-0',
    title: { tr: 'Kritik Çöküş (Total Outage)', en: 'Total System Outage' },
    badgeColor: 'red',
    mtta: { tr: '≤ 15 Dakika', en: '≤ 15 Minutes' },
    timeToTable: { tr: '≤ 30 Dakika', en: '≤ 30 Minutes' },
    updateCadence: { tr: 'Her 30 dakikada bir canlı durum raporu', en: 'Written status update every 30 mins' },
    definition: {
      tr: 'Canlı ciro üreten sistem veya ödeme akışı tamamen kilitlendi. Son kullanıcılar işlem yapamıyor, HTTP 500/504 alarmları patladı.',
      en: 'Production system or checkout pipeline completely down. End users blocked from transactions, HTTP 500/504 errors surging.'
    },
    typicalIncidents: [
      { tr: 'PostgreSQL max_connections & Deadlock', en: 'PostgreSQL max_connections & Deadlocks' },
      { tr: 'Ödeme Webhook Çöküşü & Veritabanı Kilitlenmesi', en: 'Payment Webhook Storm & DB Lock' },
      { tr: 'Tüm Servislerin Çökmesi (502 Bad Gateway)', en: 'Full Cluster Failure (502 Bad Gateway)' }
    ],
    slaComplianceRate: '99.4%'
  },
  {
    level: 'SEV-1',
    title: { tr: 'Kritik Fonksiyon Bozukluğu (Degraded)', en: 'Core Function Degradation' },
    badgeColor: 'amber',
    mtta: { tr: '≤ 30 Dakika', en: '≤ 30 Minutes' },
    timeToTable: { tr: '≤ 60 Dakika', en: '≤ 60 Minutes' },
    updateCadence: { tr: 'Her 60 dakikada bir yazılı ilerleme raporu', en: 'Written progress report every 60 mins' },
    definition: {
      tr: 'Site genel olarak ayakta ancak çekirdek bir gelir/operasyon fonksiyonu (sepet, ödeme mutabakatı, kargo API) çalışmıyor.',
      en: 'System accessible but a core transactional module (cart checkout, payment reconciliation, 3rd party API) is failing.'
    },
    typicalIncidents: [
      { tr: 'Mükerrer Kart Çekimi (Race Condition)', en: 'Duplicate Charges (Race Condition)' },
      { tr: 'Dış API 429 Rate Limit Tıkanıklığı', en: 'Third-party API 429 Rate Limit Choke' },
      { tr: 'Periyodik OOM / Memory Leak Çöküşleri', en: 'Periodic Node/Python OOM Memory Leaks' }
    ],
    slaComplianceRate: '99.1%'
  },
  {
    level: 'SEV-2',
    title: { tr: 'Teslimat & Lansman Tıkanıklığı (Major Blocker)', en: 'Deployment & Release Blocker' },
    badgeColor: 'blue',
    mtta: { tr: '≤ 2 Saat', en: '≤ 2 Hours' },
    timeToTable: { tr: '≤ 4 Saat', en: '≤ 4 Hours' },
    updateCadence: { tr: 'Günde 2 kez detaylı durum brifingi', en: 'Detailed status briefing twice daily' },
    definition: {
      tr: 'Müşteri teslimat tarihi veya lansman tehlikede; ayrılan yazılımcı erişimleri bloke etti, bozuk migration pipeline\'ı kilitledi.',
      en: 'Critical client milestone or launch at risk; departed developer locked credentials or broken migration blocked CI/CD.'
    },
    typicalIncidents: [
      { tr: 'Ayrılan Geliştirici & Kayıp .env Anahtarları', en: 'Departed Engineer & Missing .env Secrets' },
      { tr: 'Başarısız DB Migrasyonu & Şema Uyumsuzluğu', en: 'Failed Schema Migration & Data Conflict' },
      { tr: 'CI/CD Docker Build Pipeline Kilitlenmesi', en: 'CI/CD Docker Build Pipeline Freeze' }
    ],
    slaComplianceRate: '98.8%'
  },
  {
    level: 'SEV-3',
    title: { tr: 'Mühendislik Danışmanlığı & Refactor (Advisory)', en: 'Engineering Advisory & Refactor' },
    badgeColor: 'purple',
    mtta: { tr: '≤ 4 Saat', en: '≤ 4 Hours' },
    timeToTable: { tr: 'Aynı iş günü içinde planlama', en: 'Scheduled within same business day' },
    updateCadence: { tr: 'Haftalık sprint ve PR inceleme raporları', en: 'Weekly sprint and PR review reports' },
    definition: {
      tr: 'Acil kesinti yok; spagetti kodun temizlenmesi, kurtarılabilirlik denetimi, N+1 sorgu optimizasyonu veya White-Label kapasite takviyesi.',
      en: 'Non-emergency technical debt cleanup, salvageability audits, N+1 query optimization, or white-label team extension.'
    },
    typicalIncidents: [
      { tr: 'Salvageability Index (Refactor vs Rebuild)', en: 'Salvageability Audit (Refactor vs Rebuild)' },
      { tr: 'SQL Sorgu Optimizasyonu & İndeks Mimarisi', en: 'SQL Query Optimization & Index Architecture' },
      { tr: 'B2B White-Label Sprint Takviyesi', en: 'B2B White-Label Engineering Sprint' }
    ],
    slaComplianceRate: '100%'
  }
];

export const coreCommitments = [
  {
    no: '01',
    title: { tr: '%100 White-Label & Görünmezlik Garantisi', en: '100% White-Label & Invisibility Guarantee' },
    desc: {
      tr: 'Müşteriniz TMA adını asla duymaz. Tüm commit\'ler, raporlar ve teknik dokümanlar ajansınızın kurumsal kimliği altında teslim edilir.',
      en: 'Your client never hears our name. All commits, reports, and technical artifacts are delivered under your agency branding.'
    }
  },
  {
    no: '02',
    title: { tr: 'Önceden İmzalı Bağlayıcı Gizlilik (NDA)', en: 'Pre-Signed Binding Non-Disclosure Agreement' },
    desc: {
      tr: 'Tek satır koda bakmadan önce ıslak veya güvenli e-imzalı NDA devreye girer. Fikri mülkiyet %100 ajansınıza ve müşterinize aittir.',
      en: 'Before inspecting a single line of code, an enforceable NDA is executed. 100% of IP remains strictly yours and your client’s.'
    }
  },
  {
    no: '03',
    title: { tr: 'Sıfır Veri Kaybı & Anlık Rollback Güvencesi', en: 'Zero-Loss Rollback & Data Safety Guarantee' },
    desc: {
      tr: 'Canlı sisteme yapılan her cerrahi müdahaleden önce veritabanı anlık görüntüsü (snapshot) ve kod geri alma noktası oluşturulur.',
      en: 'Before any hotfix touch on production, atomic snapshots and tested rollback hooks are created to prevent data loss.'
    }
  },
  {
    no: '04',
    title: { tr: 'Şeffaf Ücretlendirme & Sürpriz Fatura Yasağı', en: 'Transparent Pricing & No Surprise Overtime' },
    desc: {
      tr: 'İlk kod teşhisi ve triyaj ücretsizdir. Müdahale kapsamı ve bedeli çalışma başlamadan önce yazılı olarak netleşir.',
      en: 'Initial diagnosis and triage are free. Project scope and fixed fees are agreed in writing before intervention begins.'
    }
  },
  {
    no: '05',
    title: { tr: 'Doğrudan Kıdemli Masa Muhataplığı', en: 'Direct Senior Engineering Desk Engagement' },
    desc: {
      tr: 'Teknik bilgisi olmayan satış temsilcileri veya bürokrasi katmanları yoktur. Kriz anında doğrudan kıdemli mühendis masaya oturur.',
      en: 'No account managers or non-technical layers. During critical hours, you speak directly with senior systems engineers.'
    }
  }
];
