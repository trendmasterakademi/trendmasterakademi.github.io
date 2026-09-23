const trSystemStatus = {
  state: "operational",
  label: "NÖBETÇİ MASA",
  currentMtta: "8,4 dk",
  targetMtta: "≤ 15 dk",
  onDutyArchitect: "Mehmet Şahin & Kıdemli Sistem Masası",
  dutyHours: "Nöbet saatleri · her gün 09:00 – 24:00"
};

const enSystemStatus = {
  state: "operational",
  label: "ON-DUTY DESK",
  currentMtta: "8.4 mins",
  targetMtta: "≤ 15 mins",
  onDutyArchitect: "Mehmet Şahin & Principal Systems Desk",
  dutyHours: "Duty hours · daily 09:00 – 24:00"
};

const trIncidentDistribution = {
  title: "90 Günlük Vaka Dağılımı",
  categories: [
    { id: "db", label: "Veritabanı & Connection Deadlock", percentage: 38, count: 13, color: "bg-[var(--accent)]" },
    { id: "payment", label: "Ödeme Webhook & Çift Çekim / Race Condition", percentage: 26, count: 9, color: "bg-[var(--sev-high)]" },
    { id: "memory", label: "Bellek Sızıntısı & OOMKilled Pod Döngüsü", percentage: 21, count: 7, color: "bg-[var(--ink-2)]" },
    { id: "deploy", label: "Deploy Pipeline & Kayıp Konfigürasyon Kilidi", percentage: 15, count: 5, color: "bg-[var(--ink-3)]" }
  ]
};

const enIncidentDistribution = {
  title: "90-Day Incident Distribution",
  categories: [
    { id: "db", label: "Database & Connection Pool Deadlocks", percentage: 38, count: 13, color: "bg-[var(--accent)]" },
    { id: "payment", label: "Payment Webhooks & Race Conditions", percentage: 26, count: 9, color: "bg-[var(--sev-high)]" },
    { id: "memory", label: "Memory Leaks & OOMKilled Pod Cascades", percentage: 21, count: 7, color: "bg-[var(--ink-2)]" },
    { id: "deploy", label: "Deploy Pipeline & Missing Env Locks", percentage: 15, count: 5, color: "bg-[var(--ink-3)]" }
  ]
};

const getIncidentMetric = (categories, categoryId, lang) => {
  const cat = categories.find(c => c.id === categoryId);
  if (!cat) return null;
  return lang === 'tr' ? `90 günde · ${cat.count} vaka` : `90 days · ${cat.count} cases`;
};

const trComponents = [
  {
    id: "hotline",
    name: "Acil Kriz Hattı & SOS Dispatch",
    status: "operational",
    get metric() {
      return trSystemStatus.dutyHours;
    },
    latency: "< 2 dk",
    latencyLabel: "Hat bağlantısı",
    desc: "Doğrudan kıdemli mühendis telefon ve kriz masası yönlendirmesi."
  },
  {
    id: "vault",
    name: "Şifrelenmiş Erişim Kasası",
    status: "operational",
    metric: "Dayanak · Sözleşme Madde 4.1 · 4.4",
    metricLink: "/nda/",
    latency: "AES-256",
    latencyLabel: "Şifreleme",
    desc: "Müdahale için verilen erişim bilgileri ve SSH anahtarları yalnızca iş için kullanılır. İş bitiminde ya da talep hâlinde iade edilir veya kalıcı olarak imha edilir; talep üzerine imha beyanı verilir."
  },
  {
    id: "postgres_desk",
    incidentCategoryId: "db",
    name: "PostgreSQL & Veritabanı SWAT Masası",
    status: "operational",
    get metric() {
      return getIncidentMetric(trIncidentDistribution.categories, this.incidentCategoryId, 'tr');
    },
    latency: "≤ 15 dk (SEV-0)",
    latencyLabel: "İlk yanıt",
    desc: "Connection pool deadlock, indeks şişmesi ve kilitlenme acil cerrahisi."
  },
  {
    id: "k8s_cloud_desk",
    incidentCategoryId: "memory",
    name: "Kubernetes & Bulut Altyapı Masası",
    status: "operational",
    get metric() {
      return getIncidentMetric(trIncidentDistribution.categories, this.incidentCategoryId, 'tr');
    },
    latency: "≤ 15 dk (SEV-0)",
    latencyLabel: "İlk yanıt",
    desc: "OOMKilled pod döngüleri, AWS ECS/RDS krizleri ve ingress SSL onarımı."
  },
  {
    id: "audit_sandbox",
    name: "Kod Devri & Güvenli İnceleme Sandbox'ı",
    status: "operational",
    latency: "izole",
    latencyLabel: "Ortam",
    desc: "Ayrılan yazılımcı sonrası şifreli çevre değişkenleri ve bağımlılık test alanı."
  }
];

const enComponents = [
  {
    id: "hotline",
    name: "Emergency Hotline & SOS Dispatch",
    status: "operational",
    get metric() {
      return enSystemStatus.dutyHours;
    },
    latency: "< 2 min",
    latencyLabel: "Line connection",
    desc: "Direct senior engineering telephone desk and incident room routing."
  },
  {
    id: "vault",
    name: "Encrypted Access Vault",
    status: "operational",
    metric: "Basis · Contract Clauses 4.1 · 4.4",
    metricLink: "/nda/",
    latency: "AES-256",
    latencyLabel: "Encryption",
    desc: "Credentials and SSH keys provided for the intervention are used only for the work. When the work ends, or on request, they are returned or permanently destroyed; a destruction statement is provided on request."
  },
  {
    id: "postgres_desk",
    incidentCategoryId: "db",
    name: "PostgreSQL & Database SWAT Desk",
    status: "operational",
    get metric() {
      return getIncidentMetric(enIncidentDistribution.categories, this.incidentCategoryId, 'en');
    },
    latency: "≤ 15 min (SEV-0)",
    latencyLabel: "First response",
    desc: "Connection pool deadlock, table bloat, and exclusive transaction lock surgery."
  },
  {
    id: "k8s_cloud_desk",
    incidentCategoryId: "memory",
    name: "Kubernetes & Cloud Infrastructure Desk",
    status: "operational",
    get metric() {
      return getIncidentMetric(enIncidentDistribution.categories, this.incidentCategoryId, 'en');
    },
    latency: "≤ 15 min (SEV-0)",
    latencyLabel: "First response",
    desc: "OOMKilled pod crash loops, AWS ECS/RDS alerts, and ingress SSL remediation."
  },
  {
    id: "audit_sandbox",
    name: "Codebase Handover & Audit Sandbox",
    status: "operational",
    latency: "isolated",
    latencyLabel: "Environment",
    desc: "Secure sandboxed verification for orphaned codebases and hidden dependencies."
  }
];

export const radarData = {
  tr: {
    hero: {
      badge: "MÜHENDİSLİK MASASI RAPORU",
      title: "SWAT Hazırbulunuşluğu & Olay Radarı",
      subtitle: "Nöbet saatleri, 90 günlük dönemde kaydedilen ilk yanıt ve çözüm süreleri, çözülen krizlerin kategori dağılımı.",
      notice: "Bu değerler 90 günlük dönemde kaydedilen 34 müdahaleden hesaplanmıştır. Son güncelleme: 21 Eylül 2026."
    },
    systemStatus: trSystemStatus,
    components: trComponents,
    telemetry90Days: {
      title: "90 Günlük Mühendislik Telemetrisi",
      sourceNote: "Bu değerler 90 günlük dönemde kaydedilen 34 müdahaleden hesaplanmıştır. Son güncelleme: 21 Eylül 2026.",
      slaLinkText: "SLA ve Yanıt Taahhütleri →",
      metrics: [
        { label: "Ortalama İlk Yanıt (MTTA)", value: "8,4 dk", sub: "Taahhüt: ≤ 15 dk (SEV-0)" },
        { label: "Ortalama Kalıcı Çözüm (TTR)", value: "3,2 saat", sub: "90 günlük 34 müdahale" },
        { label: "Çözülen Vaka", value: "34", sub: "90 günlük dönem" }
      ]
    },
    incidentDistribution: trIncidentDistribution
  },
  en: {
    hero: {
      badge: "ENGINEERING DESK REPORT",
      title: "SWAT Readiness & Incident Radar",
      subtitle: "Duty hours, first-response and recovery times recorded over a 90-day period, and category distribution of resolved incidents.",
      notice: "Calculated from 34 interventions recorded in a 90-day period. Last update: 21 September 2026."
    },
    systemStatus: enSystemStatus,
    components: enComponents,
    telemetry90Days: {
      title: "90-Day Engineering Telemetry",
      sourceNote: "Calculated from 34 interventions recorded in a 90-day period. Last update: 21 September 2026.",
      slaLinkText: "SLA & Response Commitments →",
      metrics: [
        { label: "Average First Response (MTTA)", value: "8.4 mins", sub: "Target: ≤ 15 mins (SEV-0)" },
        { label: "Average Resolution Time (TTR)", value: "3.2 hours", sub: "34 incidents over 90 days" },
        { label: "Resolved Incidents", value: "34", sub: "90-day period" }
      ]
    },
    incidentDistribution: enIncidentDistribution
  }
};

export const radarH1 = {
  tr: radarData.tr.hero.title,
  en: radarData.en.hero.title
};
