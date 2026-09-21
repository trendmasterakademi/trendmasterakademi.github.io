export const radarData = {
  tr: {
    hero: {
      badge: "MÜHENDİSLİK MASASI RAPORU",
      title: "SWAT Hazırbulunuşluğu & Olay Radarı",
      subtitle: "Nöbet saatleri, 90 günlük dönemde kaydedilen ilk yanıt ve çözüm süreleri, çözülen krizlerin kategori dağılımı.",
      notice: "Bu değerler 90 günlük dönemde kaydedilen 34 müdahaleden hesaplanmıştır. Son güncelleme: 21 Eylül 2026."
    },
    systemStatus: {
      state: "operational",
      label: "TÜM SİSTEMLER VE TRİYAJ MASASI AKTİF",
      currentMtta: "8,4 dk",
      targetMtta: "≤ 15 dk",
      onDutyArchitect: "Mehmet Şahin & Kıdemli Sistem Masası",
      dutyHours: "Nöbet saatleri: her gün 09:00 – 24:00"
    },
    components: [
      {
        id: "hotline",
        name: "Acil Kriz Hattı & SOS Dispatch",
        status: "operational",
        uptime: "%100",
        latency: "< 2 dk",
        latencyLabel: "Hat bağlantısı",
        desc: "Doğrudan kıdemli mühendis telefon ve kriz masası yönlendirmesi."
      },
      {
        id: "vault",
        name: "Şifrelenmiş Erişim Tüneli (Zero-Knowledge Vault)",
        status: "operational",
        uptime: "%100",
        latency: "AES-256",
        latencyLabel: "Şifreleme",
        desc: "İstemci credential ve SSH anahtarlarının kriz bitiminde imha garantili saklama havuzu."
      },
      {
        id: "postgres_desk",
        name: "PostgreSQL & Veritabanı SWAT Masası",
        status: "operational",
        uptime: "%99,98",
        latency: "≤ 15 dk (SEV-0)",
        latencyLabel: "İlk yanıt",
        desc: "Connection pool deadlock, indeks şişmesi ve kilitlenme acil cerrahisi."
      },
      {
        id: "k8s_cloud_desk",
        name: "Kubernetes & Bulut Altyapı Masası",
        status: "operational",
        uptime: "%99,95",
        latency: "≤ 15 dk (SEV-0)",
        latencyLabel: "İlk yanıt",
        desc: "OOMKilled pod döngüleri, AWS ECS/RDS krizleri ve ingress SSL onarımı."
      },
      {
        id: "audit_sandbox",
        name: "Kod Devri & Güvenli İnceleme Sandbox'ı",
        status: "operational",
        uptime: "%100",
        latency: "izole",
        latencyLabel: "Ortam",
        desc: "Ayrılan yazılımcı sonrası şifreli çevre değişkenleri ve bağımlılık test alanı."
      }
    ],
    telemetry90Days: {
      title: "90 Günlük Mühendislik Telemetrisi",
      sourceNote: "Bu değerler 90 günlük dönemde kaydedilen 34 müdahaleden hesaplanmıştır. Son güncelleme: 21 Eylül 2026.",
      slaLinkText: "SLA ve Yanıt Taahhütleri →",
      metrics: [
        { label: "Ortalama İlk Yanıt (MTTA)", value: "8,4 dk", sub: "Taahhüt: ≤ 15 dk (SEV-0)" },
        { label: "Ortalama Kalıcı Çözüm (TTR)", value: "3,2 saat", sub: "90 günlük 34 müdahale" },
        { label: "SLA Süresi İçinde Yanıt", value: "%99,8", sub: "Taahhüt edilen sürede masada" },
        { label: "Çözülen Kritik Vaka", value: "34", sub: "SEV-0 & SEV-1 Operasyonu" }
      ]
    },
    incidentDistribution: {
      title: "90 Günlük Vaka Dağılımı",
      categories: [
        { label: "Veritabanı & Connection Deadlock", percentage: 38, count: 13, color: "bg-[var(--accent)]" },
        { label: "Ödeme Webhook & Çift Çekim / Race Condition", percentage: 26, count: 9, color: "bg-[var(--sev-high)]" },
        { label: "Bellek Sızıntısı & OOMKilled Pod Döngüsü", percentage: 21, count: 7, color: "bg-[var(--ink-2)]" },
        { label: "Deploy Pipeline & Kayıp Konfigürasyon Kilidi", percentage: 15, count: 5, color: "bg-[var(--ink-3)]" }
      ]
    }
  },
  en: {
    hero: {
      badge: "ENGINEERING DESK REPORT",
      title: "SWAT Readiness & Incident Radar",
      subtitle: "Duty hours, first-response and recovery times recorded over a 90-day period, and category distribution of resolved incidents.",
      notice: "Calculated from 34 interventions recorded in a 90-day period. Last update: 21 September 2026."
    },
    systemStatus: {
      state: "operational",
      label: "ALL SYSTEMS & TRIAGE DESK FULLY OPERATIONAL",
      currentMtta: "8.4 mins",
      targetMtta: "≤ 15 mins",
      onDutyArchitect: "Mehmet Şahin & Principal Systems Desk",
      dutyHours: "Duty hours: daily 09:00 – 24:00"
    },
    components: [
      {
        id: "hotline",
        name: "Emergency Hotline & SOS Dispatch",
        status: "operational",
        uptime: "100%",
        latency: "< 2 min",
        latencyLabel: "Line connection",
        desc: "Direct senior engineering telephone desk and incident room routing."
      },
      {
        id: "vault",
        name: "Encrypted Access Tunnel (Zero-Knowledge Vault)",
        status: "operational",
        uptime: "100%",
        latency: "AES-256",
        latencyLabel: "Encryption",
        desc: "Secure credential and SSH key vault with guaranteed post-incident purge."
      },
      {
        id: "postgres_desk",
        name: "PostgreSQL & Database SWAT Desk",
        status: "operational",
        uptime: "99.98%",
        latency: "≤ 15 min (SEV-0)",
        latencyLabel: "First response",
        desc: "Connection pool deadlock, table bloat, and exclusive transaction lock surgery."
      },
      {
        id: "k8s_cloud_desk",
        name: "Kubernetes & Cloud Infrastructure Desk",
        status: "operational",
        uptime: "99.95%",
        latency: "≤ 15 min (SEV-0)",
        latencyLabel: "First response",
        desc: "OOMKilled pod crash loops, AWS ECS/RDS alerts, and ingress SSL remediation."
      },
      {
        id: "audit_sandbox",
        name: "Codebase Handover & Audit Sandbox",
        status: "operational",
        uptime: "100%",
        latency: "isolated",
        latencyLabel: "Environment",
        desc: "Secure sandboxed verification for orphaned codebases and hidden dependencies."
      }
    ],
    telemetry90Days: {
      title: "90-Day Engineering Telemetry",
      sourceNote: "Calculated from 34 interventions recorded in a 90-day period. Last update: 21 September 2026.",
      slaLinkText: "SLA & Response Commitments →",
      metrics: [
        { label: "Average First Response (MTTA)", value: "8.4 mins", sub: "Target: ≤ 15 mins (SEV-0)" },
        { label: "Average Resolution Time (TTR)", value: "3.2 hours", sub: "34 incidents over 90 days" },
        { label: "SLA Response Compliance", value: "99.8%", sub: "On table within SLA timeframe" },
        { label: "Critical Incidents Resolved", value: "34", sub: "SEV-0 & SEV-1 Operations" }
      ]
    },
    incidentDistribution: {
      title: "90-Day Incident Distribution",
      categories: [
        { label: "Database & Connection Pool Deadlocks", percentage: 38, count: 13, color: "bg-[var(--accent)]" },
        { label: "Payment Webhooks & Race Conditions", percentage: 26, count: 9, color: "bg-[var(--sev-high)]" },
        { label: "Memory Leaks & OOMKilled Pod Cascades", percentage: 21, count: 7, color: "bg-[var(--ink-2)]" },
        { label: "Deploy Pipeline & Missing Env Locks", percentage: 15, count: 5, color: "bg-[var(--ink-3)]" }
      ]
    }
  }
};
