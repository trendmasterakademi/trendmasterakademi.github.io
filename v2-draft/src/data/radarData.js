export const radarData = {
  tr: {
    hero: {
      badge: "CANLI MÜHENDİSLİK MASASI & RADAR",
      title: "Sistem Sağlığı, SWAT Hazırbulunuşluğu & Olay Radarı",
      subtitle: "Şeffaf mühendislik disiplini: TMA operasyonel hazırbulunuşluğunu, anlık nöbetçi mimar durumunu, son 90 günlük SLA telemetrisini ve vaka dağılımını canlı denetleyin.",
      notice: "Tüm mühendislik masası metrikleri gerçek operasyonel kayıtlarla senkronizedir."
    },
    systemStatus: {
      state: "operational",
      label: "TÜM SİSTEMLER VE TRİYAJ MASASI AKTİF",
      activeSev0: 0,
      currentMtta: "8.4 Dakika",
      targetMtta: "≤ 15 Dakika",
      onDutyArchitect: "Mehmet Şahin & Kıdemli Sistem Masası",
      dutyHours: "09:00 – 24:00 Kesintisiz Canlı Masa"
    },
    components: [
      {
        id: "hotline",
        name: "Acil Kriz Hattı & SOS Dispatch",
        status: "operational",
        uptime: "100.0%",
        latency: "< 2 dk ilk bağlantı",
        desc: "Doğrudan kıdemli mühendis telefon ve kriz masası yönlendirmesi."
      },
      {
        id: "vault",
        name: "Şifrelenmiş Erişim Tüneli (Zero-Knowledge Vault)",
        status: "operational",
        uptime: "100.0%",
        latency: "AES-256 Şifreli",
        desc: "İstemci credential ve SSH anahtarlarının kriz bitiminde imha garantili saklama havuzu."
      },
      {
        id: "postgres_desk",
        name: "PostgreSQL & Veritabanı SWAT Masası",
        status: "operational",
        uptime: "99.98%",
        latency: "≤ 15 dk masada",
        desc: "Connection pool deadlock, indeks şişmesi ve kilitlenme acil cerrahisi."
      },
      {
        id: "k8s_cloud_desk",
        name: "Kubernetes & Bulut Altyapı Masası",
        status: "operational",
        uptime: "99.95%",
        latency: "≤ 15 dk masada",
        desc: "OOMKilled pod döngüleri, AWS ECS/RDS krizleri ve ingress SSL onarımı."
      },
      {
        id: "audit_sandbox",
        name: "Kod Devri & Güvenli İnceleme Sandbox'ı",
        status: "operational",
        uptime: "100.0%",
        latency: "İzole Ortam",
        desc: "Ayrılan yazılımcı sonrası şifreli çevre değişkenleri ve bağımlılık test alanı."
      }
    ],
    telemetry90Days: {
      title: "Son 90 Günlük Mühendislik Telemetrisi",
      metrics: [
        { label: "Çözülen Kritik Vaka", value: "34", sub: "SEV-0 & SEV-1 Operasyonu" },
        { label: "Ortalama Masaya Oturma (MTTA)", value: "8.4 Dk", sub: "Hedef: ≤ 15 Dk (Başarı %100)" },
        { label: "Ortalama Çözüm / Canlıya Alma (TTR)", value: "3.2 Saat", sub: "Kalıcı Hotfix & Sıfır Veri Kaybı" },
        { label: "SLA Taahhüt Uyumu", value: "%99.8", sub: "15 Dk Yanıt & Masaya Oturma" }
      ]
    },
    incidentDistribution: {
      title: "Son 90 Gün Vaka Dağılım Radarı",
      categories: [
        { label: "Veritabanı & Connection Deadlock", percentage: 38, count: 13, color: "bg-rose-500" },
        { label: "Ödeme Webhook & Çift Çekim / Race Condition", percentage: 26, count: 9, color: "bg-amber-500" },
        { label: "Bellek Sızıntısı & OOMKilled Pod Döngüsü", percentage: 21, count: 7, color: "bg-blue-600" },
        { label: "Deploy Pipeline & Kayıp Konfigürasyon Kilidi", percentage: 15, count: 5, color: "bg-purple-500" }
      ]
    }
  },
  en: {
    hero: {
      badge: "LIVE ENGINEERING DESK & RADAR",
      title: "System Health, SWAT Readiness & Incident Radar",
      subtitle: "Radical engineering transparency: audit TMA's operational readiness, live on-duty architect availability, 90-day SLA telemetry, and historical incident distribution.",
      notice: "All engineering metrics are synchronized with production incident logs."
    },
    systemStatus: {
      state: "operational",
      label: "ALL SYSTEMS & TRIAGE DESK FULLY OPERATIONAL",
      activeSev0: 0,
      currentMtta: "8.4 Minutes",
      targetMtta: "≤ 15 Minutes",
      onDutyArchitect: "Mehmet Şahin & Principal Systems Desk",
      dutyHours: "09:00 – 24:00 Direct Active Desk"
    },
    components: [
      {
        id: "hotline",
        name: "Emergency Hotline & SOS Dispatch",
        status: "operational",
        uptime: "100.0%",
        latency: "< 2 min dispatch",
        desc: "Direct senior engineering telephone desk and incident room routing."
      },
      {
        id: "vault",
        name: "Encrypted Access Tunnel (Zero-Knowledge Vault)",
        status: "operational",
        uptime: "100.0%",
        latency: "AES-256 Encrypted",
        desc: "Secure credential and SSH key vault with guaranteed post-incident purge."
      },
      {
        id: "postgres_desk",
        name: "PostgreSQL & Database SWAT Desk",
        status: "operational",
        uptime: "99.98%",
        latency: "≤ 15 min on table",
        desc: "Connection pool deadlock, table bloat, and exclusive transaction lock surgery."
      },
      {
        id: "k8s_cloud_desk",
        name: "Kubernetes & Cloud Infrastructure Desk",
        status: "operational",
        uptime: "99.95%",
        latency: "≤ 15 min on table",
        desc: "OOMKilled pod crash loops, AWS ECS/RDS alerts, and ingress SSL remediation."
      },
      {
        id: "audit_sandbox",
        name: "Codebase Handover & Audit Sandbox",
        status: "operational",
        uptime: "100.0%",
        latency: "Isolated Enclave",
        desc: "Secure sandboxed verification for orphaned codebases and hidden dependencies."
      }
    ],
    telemetry90Days: {
      title: "90-Day Engineering Telemetry",
      metrics: [
        { label: "Critical Incidents Resolved", value: "34", sub: "SEV-0 & SEV-1 Interventions" },
        { label: "Average Time to Table (MTTA)", value: "8.4 Mins", sub: "Target: ≤ 15 Mins (100% Met)" },
        { label: "Average Time to Recovery (TTR)", value: "3.2 Hours", sub: "Permanent Hotfix & Zero Data Loss" },
        { label: "SLA Commitment Compliance", value: "99.8%", sub: "15-Min Response & Table SLA" }
      ]
    },
    incidentDistribution: {
      title: "90-Day Incident Distribution Radar",
      categories: [
        { label: "Database & Connection Pool Deadlocks", percentage: 38, count: 13, color: "bg-rose-500" },
        { label: "Payment Webhooks & Race Conditions", percentage: 26, count: 9, color: "bg-amber-500" },
        { label: "Memory Leaks & OOMKilled Pod Cascades", percentage: 21, count: 7, color: "bg-blue-600" },
        { label: "Deploy Pipeline & Missing Env Locks", percentage: 15, count: 5, color: "bg-purple-500" }
      ]
    }
  }
};
