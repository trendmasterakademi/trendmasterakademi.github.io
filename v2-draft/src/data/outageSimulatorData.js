export const outageSimulatorData = {
  tr: {
    hero: {
      badge: "KURUMSAL HASAR TESPİTİ & TCOD MOTORU",
      title: "Gelişmiş Kesinti & İtibar Zararı Simülatörü",
      subtitle: "Bir üretim arızasında buzdağının sadece görünen yüzü doğrudan sepet kaybıdır. Boşa yanan reklam bütçesini, sözleşmesel SLA cezalarını, müşteri terkini ve mühendislik fırsat maliyetini birlikte hesaplayın.",
      notice: "TMA kriz triyaj masası, ilk 15 dakikada müdahale ederek gizli hasar çarpanlarının büyümesini durdurur."
    },
    presets: [
      {
        id: "ecommerce",
        name: "E-Ticaret & Pazaryeri",
        monthlyRevenue: 2500000,
        dailyAdSpend: 15000,
        slaPenaltyRate: 0,
        churnRiskRate: 1.5,
        engTeamSize: 4,
        engHourlyRate: 950
      },
      {
        id: "saas_b2b",
        name: "SaaS & B2B Kurumsal Yazılım",
        monthlyRevenue: 1200000,
        dailyAdSpend: 5000,
        slaPenaltyRate: 10,
        churnRiskRate: 3.0,
        engTeamSize: 6,
        engHourlyRate: 1200
      },
      {
        id: "agency_client",
        name: "Ajans Müşteri Projesi (Lansman Kriz)",
        monthlyRevenue: 800000,
        dailyAdSpend: 8000,
        slaPenaltyRate: 15,
        churnRiskRate: 5.0,
        engTeamSize: 3,
        engHourlyRate: 850
      },
      {
        id: "fintech",
        name: "Fintech & Yüksek Hacimli İşlem",
        monthlyRevenue: 6000000,
        dailyAdSpend: 25000,
        slaPenaltyRate: 20,
        churnRiskRate: 4.0,
        engTeamSize: 8,
        engHourlyRate: 1500
      }
    ],
    dimensions: [
      {
        id: "direct_revenue",
        title: "Doğrudan Ciro Kaybı",
        desc: "Kesinti süresince gerçekleşemeyen sipariş ve ödeme işlemlerinin toplam bedeli."
      },
      {
        id: "wasted_ads",
        title: "Yanan Reklam Bütçesi",
        desc: "Google Ads ve Meta reklamları 500/502 hatası veren sayfalara trafik çekmeye devam ederken boşa harcanan bütçe."
      },
      {
        id: "sla_penalty",
        title: "Sözleşmesel SLA Cezası",
        desc: "B2B sözleşmelerinde yer alan %99,9 uptime taahhüdünün ihlali halinde müşteriye ödenmesi gereken yasal tazminat."
      },
      {
        id: "churn_ltv",
        title: "Müşteri Terki & LTV Kaybı",
        desc: "Kesinti nedeniyle rakibe geçen veya aboneliğini iptal eden müşterilerin yaşam boyu değer kaybı."
      },
      {
        id: "eng_drag",
        title: "Mühendislik Fırsat Maliyeti",
        desc: "Şirket içi ekibin planlı sprint'i durdurup panikle arıza çözmeye çalışırken harcadığı adam/saat maliyeti."
      }
    ],
    labels: {
      selectPreset: "Hazır Sektör Profili Seçin",
      durationHours: "Tahmini Kesinti Süresi (Saat)",
      monthlyRevenue: "Aylık Ciro / Faturalandırma (₺)",
      dailyAdSpend: "Günlük Aktif Reklam Bütçesi (₺)",
      slaPenaltyRate: "Sözleşmesel SLA Ceza Oranı (%)",
      churnRiskRate: "Tahmini Müşteri Kaybı / Terk Oranı (%)",
      engTeamSize: "Krize Müdahale Eden Mühendis Sayısı",
      engHourlyRate: "Mühendis Başına Saatlik Maliyet (₺)",
      peakMultiplier: "Kesintinin Yaşandığı Zaman Dilimi",
      peakOptions: {
        peak: "Zirve Saatler (2,0× Çarpan - Flash Sale / İş Saatleri)",
        normal: "Normal Saatler (1,0× Çarpan)",
        night: "Düşük Trafik / Gece (0,5× Çarpan)"
      },
      totalTcod: "Toplam Gerçek Kesinti Hasarı (TCOD)",
      breakdownTitle: "Zarar Kalemleri Dağılımı",
      copyBrief: "Hasar Raporunu Kopyala (Yönetim / Müşteri)",
      copied: "Hasar değerlendirme brifingi panoya kopyalandı!",
      triageCta: "Zararı Durdur: 15 Dk Triyaj Masası",
      hiddenCostWarning: "Bu kesintideki gizli maliyetler doğrudan ciro kaybının"
    }
  },
  en: {
    hero: {
      badge: "ENTERPRISE OUTAGE DAMAGE & TCOD ENGINE",
      title: "Outage & Reputational Damage Simulator",
      subtitle: "In a production outage, lost checkout sales are merely the tip of the iceberg. Model wasted ad spend, contractual SLA penalties, customer churn, and internal engineering drag simultaneously.",
      notice: "TMA's crisis triage desk engages in under 15 minutes to stop compounding damage multipliers."
    },
    presets: [
      {
        id: "ecommerce",
        name: "E-Commerce & Marketplace",
        monthlyRevenue: 2500000,
        dailyAdSpend: 15000,
        slaPenaltyRate: 0,
        churnRiskRate: 1.5,
        engTeamSize: 4,
        engHourlyRate: 950
      },
      {
        id: "saas_b2b",
        name: "SaaS & Enterprise B2B",
        monthlyRevenue: 1200000,
        dailyAdSpend: 5000,
        slaPenaltyRate: 10,
        churnRiskRate: 3.0,
        engTeamSize: 6,
        engHourlyRate: 1200
      },
      {
        id: "agency_client",
        name: "Agency Client Project (Launch Crisis)",
        monthlyRevenue: 800000,
        dailyAdSpend: 8000,
        slaPenaltyRate: 15,
        churnRiskRate: 5.0,
        engTeamSize: 3,
        engHourlyRate: 850
      },
      {
        id: "fintech",
        name: "Fintech & High-Volume Transactions",
        monthlyRevenue: 6000000,
        dailyAdSpend: 25000,
        slaPenaltyRate: 20,
        churnRiskRate: 4.0,
        engTeamSize: 8,
        engHourlyRate: 1500
      }
    ],
    dimensions: [
      {
        id: "direct_revenue",
        title: "Direct Lost Revenue",
        desc: "Total value of unfulfilled transactions and orders blocked while systems remain offline."
      },
      {
        id: "wasted_ads",
        title: "Wasted Ad Spend",
        desc: "Budget burned driving active paid traffic (Google/Meta Ads) into HTTP 500/502 error screens."
      },
      {
        id: "sla_penalty",
        title: "Contractual SLA Penalties",
        desc: "Direct financial clawbacks owed to enterprise clients for breaching contractual uptime commitments."
      },
      {
        id: "churn_ltv",
        title: "Customer Churn & LTV Loss",
        desc: "Lifetime value lost from frustrated users defecting to competitors during the downtime window."
      },
      {
        id: "eng_drag",
        title: "Engineering Opportunity Drag",
        desc: "Cost of internal engineering payroll diverted from revenue-generating roadmap sprints into crisis fighting."
      }
    ],
    labels: {
      selectPreset: "Select Industry Profile",
      durationHours: "Estimated Outage Duration (Hours)",
      monthlyRevenue: "Monthly Revenue / Billing ($ / ₺)",
      dailyAdSpend: "Daily Active Ad Spend ($ / ₺)",
      slaPenaltyRate: "Contractual SLA Penalty Rate (%)",
      churnRiskRate: "Estimated Customer Churn Rate (%)",
      engTeamSize: "Engineers Diverted to Crisis",
      engHourlyRate: "Hourly Payroll Cost per Engineer ($ / ₺)",
      peakMultiplier: "Time Window of Outage",
      peakOptions: {
        peak: "Peak Business Hours (2.0x Multiplier)",
        normal: "Standard Hours (1.0x Multiplier)",
        night: "Off-Peak / Night (0.5x Multiplier)"
      },
      totalTcod: "Total True Cost of Downtime (TCOD)",
      breakdownTitle: "Damage Component Breakdown",
      copyBrief: "Copy Outage Assessment Brief (Board / Client)",
      copied: "Outage assessment brief copied to clipboard!",
      triageCta: "Halt Compounding Damage: 15-Min Triage Desk",
      hiddenCostWarning: "Hidden collateral costs in this incident represent"
    }
  }
};
