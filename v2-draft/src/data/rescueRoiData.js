export const rescueRoiData = {
  tr: {
    hero: {
      badge: "FİNANSAL FİZİBİLİTE & SERMAYE TASARRUFU",
      title: "SWAT Kurtarma vs. Sıfırdan Yazım ROI Hesaplayıcı",
      subtitle: "Tıkanan bir projeyi çöpe atıp yeniden yazmak aylar süren bir sermaye tuzağıdır. TMA SWAT cerrahi müdahalesi ile sıfırdan yazım (Rebuild) arasındaki maliyet, zaman ve ROI farkını finansal olarak karşılaştırın.",
      notice: "TMA kurtarma operasyonları, mevcut canlı ciro akışını durdurmadan paralel cerrahi disipliniyle yürütülür."
    },
    presets: [
      {
        id: "saas",
        name: "Büyüyen SaaS / Startup",
        teamSize: 3,
        monthlyRatePerDev: 90000,
        rebuildMonths: 5,
        monthlyRevenueAtRisk: 450000,
        recruitingMonths: 2
      },
      {
        id: "ecommerce",
        name: "Orta Ölçek E-Ticaret / Ajans Müşterisi",
        teamSize: 4,
        monthlyRatePerDev: 100000,
        rebuildMonths: 7,
        monthlyRevenueAtRisk: 1200000,
        recruitingMonths: 2
      },
      {
        id: "enterprise",
        name: "Kurumsal Monolit / Fintech",
        teamSize: 7,
        monthlyRatePerDev: 130000,
        rebuildMonths: 10,
        monthlyRevenueAtRisk: 3500000,
        recruitingMonths: 3
      }
    ],
    labels: {
      presetTitle: "Hazır Proje Profili Seçin",
      teamSize: "Sıfırdan Yazım İçin Gereken Mühendis Sayısı",
      monthlyRate: "Mühendis Başına Aylık Maliyet (Maaş + Yan Haklar) (₺)",
      rebuildMonths: "Tahmini Sıfırdan Yazım Süresi (Ay)",
      recruitingMonths: "İşe Alım & Onboarding Süresi (Ay)",
      monthlyRevenue: "Risk Altındaki Aylık Ciro / Fatura Bedeli (₺)",
      rebuildSummaryTitle: "Sıfırdan Yazım (Rebuild) Maliyeti",
      rescueSummaryTitle: "TMA SWAT Kurtarma (Rescue) Modeli",
      capitalSaved: "Tasarruf Edilen Net Sermaye",
      timeSaved: "Kazanılan Zaman",
      roiMultiplier: "Sermaye Geri Dönüş Oranı (ROI)",
      copyReport: "Yatırımcı / Yönetim Kurulu Raporunu Kopyala",
      copiedNotice: "Finansal ROI raporu panoya kopyalandı!",
      triageCta: "Bu Tasarruf İçin Fizibilite Randevusu Al",
      rebuildBreakdown: "Sıfırdan Yazım Maliyet Kalemleri:",
      rescueBreakdown: "TMA SWAT Kurtarma Avantajları:",
      sourceNote: "Aralıklar sektör verilerinin ortalamasıdır; tek bir TMA projesinin sonucu değildir."
    },
    rebuildItems: [
      "2-3 ay işe alım, mülakat ve oryantasyon gecikmesi",
      "Geliştirme süresince kaçırılan pazar fırsatları ve ciro kaybı",
      "Eski sistemdeki yıllarca birikmiş özel kuralların (edge cases) kaybolması",
      "Sıfırdan yazılan sistemin canlıya çıktığında yeni çocukluk hastalıkları üretmesi"
    ],
    rescueItems: [
      "Yalnızca 2-4 haftalık hedefe yönelik cerrahi refactor süresi",
      "Öngörülebilir, sürprizsiz sabit mühendislik bütçesi",
      "Mevcut veri ve kullanıcıların sıfır kesintiyle korunması",
      "Eski sistemdeki çalışan iş mantığının korunarak darboğazların elenmesi"
    ]
  },
  en: {
    hero: {
      badge: "FINANCIAL FEASIBILITY & CAPITAL PRESERVATION",
      title: "Rescue vs. Rebuild Financial ROI Calculator",
      subtitle: "Scrapping working software to rebuild from scratch is often a multi-quarter capital trap. Compare direct payroll, opportunity costs, time-to-market, and ROI between TMA SWAT Rescue and a ground-up Rebuild.",
      notice: "TMA surgical rescue engagements preserve active revenue streams without halting ongoing business."
    },
    presets: [
      {
        id: "saas",
        name: "Growth SaaS / Startup",
        teamSize: 3,
        monthlyRatePerDev: 90000,
        rebuildMonths: 5,
        monthlyRevenueAtRisk: 450000,
        recruitingMonths: 2
      },
      {
        id: "ecommerce",
        name: "Mid-Market E-Commerce / Agency Client",
        teamSize: 4,
        monthlyRatePerDev: 100000,
        rebuildMonths: 7,
        monthlyRevenueAtRisk: 1200000,
        recruitingMonths: 2
      },
      {
        id: "enterprise",
        name: "Enterprise Monolith / Fintech",
        teamSize: 7,
        monthlyRatePerDev: 130000,
        rebuildMonths: 10,
        monthlyRevenueAtRisk: 3500000,
        recruitingMonths: 3
      }
    ],
    labels: {
      presetTitle: "Select Project Profile",
      teamSize: "Engineers Required for Full Rebuild",
      monthlyRate: "Monthly Cost per Senior Engineer (Payroll + Burden) ($ / ₺)",
      rebuildMonths: "Estimated Rebuild Duration (Months)",
      recruitingMonths: "Recruiting & Onboarding Lead Time (Months)",
      monthlyRevenue: "Monthly Revenue at Risk ($ / ₺)",
      rebuildSummaryTitle: "Ground-Up Rebuild Total Cost",
      rescueSummaryTitle: "TMA SWAT Rescue Model",
      capitalSaved: "Net Capital Preserved",
      timeSaved: "Time to Market Saved",
      roiMultiplier: "Return on Capital (ROI)",
      copyReport: "Copy Board / Investor Feasibility Brief",
      copiedNotice: "Financial ROI brief copied to clipboard!",
      triageCta: "Schedule Feasibility Review for This ROI",
      rebuildBreakdown: "Ground-Up Rebuild Liabilities:",
      rescueBreakdown: "TMA SWAT Rescue Advantages:",
      sourceNote: "Ranges are industry averages, not the result of a single TMA project."
    },
    rebuildItems: [
      "2-3 months lost in sourcing, interviewing, and ramp-up drag",
      "Opportunity cost of frozen roadmap and forfeited market share",
      "Catastrophic loss of undocumented domain logic and edge-case handling",
      "New greenfield systems inevitably introduce fresh, untested regressions"
    ],
    rescueItems: [
      "Targeted 2-4 week surgical refactor and bottleneck elimination",
      "Predictable, capped engineering investment with zero scope bloat",
      "Zero downtime and uninterrupted preservation of live customer data",
      "Hardened architecture keeping existing proprietary domain knowledge intact"
    ]
  }
};
