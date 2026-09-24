// Kesinti ve itibar zararı hesabı — sayfa metinleri.
// React (OutageSimulator.jsx) ve ön-render (generate_static_pages.js) buradan okur.
// Kural (Adım 79–80): gizli çarpan yok; her kalemin formülü ekranda yazılı, bütün değerler kullanıcının girdisi ya da görünür varsayım.
// 730 = bir aydaki ortalama saat (365 × 24 ÷ 12). 15 dakika yalnız SLA'daki SEV-0 ilk yanıt süresi olarak anılır.

export const outageSimulatorData = {
  tr: {
    hero: {
      badge: "KESİNTİNİN TOPLAM MALİYETİ",
      title: "Kesinti ve İtibar Zararı Simülatörü",
      subtitle: "Bir kesintide doğrudan ciro kaybının yanında boşa giden reklam bütçesi, sözleşme cezası, müşteri kaybı ve ekibinizin arızaya harcadığı saatler de maliyettir. Beş kalemi kendi rakamlarınızla, formülleri görerek hesaplayın.",
      notice: "SEV-0 kesintide ilk yanıt süresi SLA'da ≤ 15 dakika olarak yazılıdır."
    },
    presets: [
      { id: "ecommerce", name: "E-Ticaret & Pazaryeri", monthlyRevenue: 2500000, dailyAdSpend: 15000, slaPenaltyRate: 0, churnRiskRate: 1.5, engTeamSize: 4, engHourlyRate: 950 },
      { id: "saas_b2b", name: "SaaS & B2B Kurumsal Yazılım", monthlyRevenue: 1200000, dailyAdSpend: 5000, slaPenaltyRate: 10, churnRiskRate: 3.0, engTeamSize: 6, engHourlyRate: 1200 },
      { id: "agency_client", name: "Ajans Müşteri Projesi (Lansman Kriz)", monthlyRevenue: 800000, dailyAdSpend: 8000, slaPenaltyRate: 15, churnRiskRate: 5.0, engTeamSize: 3, engHourlyRate: 850 },
      { id: "fintech", name: "Fintech & Yüksek Hacimli İşlem", monthlyRevenue: 6000000, dailyAdSpend: 25000, slaPenaltyRate: 20, churnRiskRate: 4.0, engTeamSize: 8, engHourlyRate: 1500 }
    ],
    dimensions: [
      { id: "direct_revenue", title: "Doğrudan Ciro Kaybı", desc: "Kesinti süresince gerçekleşemeyen sipariş ve ödemelerin bedeli.", formula: "(Aylık ciro ÷ 730) × Kesinti süresi × Zaman çarpanı" },
      { id: "wasted_ads", title: "Boşa Giden Reklam Bütçesi", desc: "Reklamlar hata veren sayfalara trafik göndermeye devam ederken harcanan bütçe.", formula: "(Günlük reklam bütçesi ÷ 24) × Kesinti süresi" },
      { id: "sla_penalty", title: "Sözleşmesel SLA Cezası", desc: "Müşterinizle yaptığınız sözleşmede kesinti için ceza ya da iade maddesi varsa, onun bedeli.", formula: "Aylık ciro × SLA ceza oranı" },
      { id: "churn_ltv", title: "Müşteri Kaybı", desc: "Kesinti nedeniyle ayrılan müşterilerin, kayıp sürdükçe getirmeyeceği ciro.", formula: "Aylık ciro × Müşteri kaybı oranı × Kaybın süreceği ay" },
      { id: "eng_drag", title: "Mühendislik Maliyeti", desc: "Ekibinizin planlı işini bırakıp arızayla uğraştığı saatlerin maliyeti.", formula: "Mühendis sayısı × Saatlik maliyet × Kesinti süresi" }
    ],
    labels: {
      selectPreset: "Örnek Sektör Profili Seçin",
      inputsTitle: "Kesinti Değişkenleri",
      durationHours: "Tahmini Kesinti Süresi (Saat)",
      monthlyRevenue: "Aylık Ciro / Faturalandırma (₺)",
      dailyAdSpend: "Günlük Aktif Reklam Bütçesi (₺)",
      slaPenaltyRate: "Sözleşmesel SLA Ceza Oranı (aylık bedelin %'si)",
      churnRiskRate: "Tahmini Müşteri Kaybı Oranı (%)",
      churnMonths: "Kaybın Süreceği Ay (varsayım)",
      engTeamSize: "Krize Müdahale Eden Mühendis Sayısı",
      engHourlyRate: "Mühendis Başına Saatlik Maliyet (₺)",
      peakMultiplier: "Kesintinin Yaşandığı Zaman Dilimi",
      peakOptions: {
        peak: "Zirve Saatler (2,0× Çarpan - Flash Sale / İş Saatleri)",
        normal: "Normal Saatler (1,0× Çarpan)",
        night: "Düşük Trafik / Gece (0,5× Çarpan)"
      },
      totalTcod: "Toplam Tahmini Kesinti Maliyeti",
      indirectTotal: "Doğrudan ciro kaybı dışındaki dört kalem",
      methodTitle: "Hesap",
      methodNote: "Gizli çarpan yoktur: her kalemin formülü yanında yazılıdır ve bütün değerler sizin girdiğiniz ya da seçtiğiniz değerlerdir. 730, bir aydaki ortalama saattir (365 × 24 ÷ 12). Zaman çarpanı ve kaybın süreceği ay birer varsayımdır; kendi verinizi biliyorsanız değiştirin.",
      copyBrief: "Maliyet Raporunu Kopyala",
      copied: "Maliyet raporu panoya kopyalandı!",
      triageCta: "Triyaj Masasıyla Görüşme Planla"
    }
  },
  en: {
    hero: {
      badge: "TOTAL COST OF AN OUTAGE",
      title: "Outage & Reputation Cost Simulator",
      subtitle: "In an outage, lost revenue is not the only cost: wasted ad spend, contractual penalties, lost customers and the hours your team spends on the incident count too. Calculate all five with your own numbers, with every formula shown.",
      notice: "For a SEV-0 outage, the first response time written in the SLA is ≤ 15 minutes."
    },
    presets: [
      { id: "ecommerce", name: "E-Commerce & Marketplace", monthlyRevenue: 2500000, dailyAdSpend: 15000, slaPenaltyRate: 0, churnRiskRate: 1.5, engTeamSize: 4, engHourlyRate: 950 },
      { id: "saas_b2b", name: "SaaS & Enterprise B2B", monthlyRevenue: 1200000, dailyAdSpend: 5000, slaPenaltyRate: 10, churnRiskRate: 3.0, engTeamSize: 6, engHourlyRate: 1200 },
      { id: "agency_client", name: "Agency Client Project (Launch Crisis)", monthlyRevenue: 800000, dailyAdSpend: 8000, slaPenaltyRate: 15, churnRiskRate: 5.0, engTeamSize: 3, engHourlyRate: 850 },
      { id: "fintech", name: "Fintech & High-Volume Transactions", monthlyRevenue: 6000000, dailyAdSpend: 25000, slaPenaltyRate: 20, churnRiskRate: 4.0, engTeamSize: 8, engHourlyRate: 1500 }
    ],
    dimensions: [
      { id: "direct_revenue", title: "Direct Lost Revenue", desc: "Value of the orders and payments that could not happen during the outage.", formula: "(Monthly revenue ÷ 730) × Outage duration × Time multiplier" },
      { id: "wasted_ads", title: "Wasted Ad Spend", desc: "Budget spent while ads keep sending traffic to failing pages.", formula: "(Daily ad spend ÷ 24) × Outage duration" },
      { id: "sla_penalty", title: "Contractual SLA Penalty", desc: "If your contract with your client has a penalty or refund clause for downtime, its cost.", formula: "Monthly revenue × SLA penalty rate" },
      { id: "churn_ltv", title: "Lost Customers", desc: "Revenue that customers who leave because of the outage will not bring while the loss lasts.", formula: "Monthly revenue × Customer loss rate × Months the loss lasts" },
      { id: "eng_drag", title: "Engineering Cost", desc: "Cost of the hours your team spends on the incident instead of planned work.", formula: "Engineers × Hourly cost × Outage duration" }
    ],
    labels: {
      selectPreset: "Select an Example Industry Profile",
      inputsTitle: "Outage Variables",
      durationHours: "Estimated Outage Duration (Hours)",
      monthlyRevenue: "Monthly Revenue / Billing (₺)",
      dailyAdSpend: "Daily Active Ad Spend (₺)",
      slaPenaltyRate: "Contractual SLA Penalty Rate (% of monthly billing)",
      churnRiskRate: "Estimated Customer Loss Rate (%)",
      churnMonths: "Months the Loss Lasts (assumption)",
      engTeamSize: "Engineers Working on the Incident",
      engHourlyRate: "Hourly Cost per Engineer (₺)",
      peakMultiplier: "Time Window of Outage",
      peakOptions: {
        peak: "Peak Business Hours (2.0x Multiplier)",
        normal: "Standard Hours (1.0x Multiplier)",
        night: "Off-Peak / Night (0.5x Multiplier)"
      },
      totalTcod: "Total Estimated Cost of the Outage",
      indirectTotal: "The four items besides direct lost revenue",
      methodTitle: "Calculation",
      methodNote: "There are no hidden multipliers: each item's formula is shown next to it, and every value is one you entered or selected. 730 is the average number of hours in a month (365 × 24 ÷ 12). The time multiplier and the months the loss lasts are assumptions; change them if you know your own data.",
      copyBrief: "Copy Cost Report",
      copied: "Cost report copied to clipboard!",
      triageCta: "Book a Call with the Triage Desk"
    }
  }
};

export const outageSimulatorH1 = {
  tr: outageSimulatorData.tr.hero.title,
  en: outageSimulatorData.en.hero.title
};
