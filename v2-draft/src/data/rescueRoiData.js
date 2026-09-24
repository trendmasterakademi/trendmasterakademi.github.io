// Kurtarma mı, sıfırdan yazım mı? — sayfa metinleri.
// React (RescueRoi.jsx) ve ön-render (generate_static_pages.js) buradan okur.
// Hesap yalnız kullanıcının girdiği değerlerden yapılır: TMA fiyatı, oran, getiri ya da süre vaadi yoktur (Adım 79).
// Kurtarmanın fiyatlanmasıyla ilgili cümleler sözleşme Madde 7.1 ve 8.1'e dayanır.

export const rescueRoiData = {
  tr: {
    hero: {
      badge: "SIFIRDAN YAZIM MALİYETİ",
      title: "Kurtarma mı, Sıfırdan Yazım mı?",
      subtitle: "Çalışan bir sistemi çöpe atıp baştan yazmanın maaş maliyetini kendi rakamlarınızla hesaplayın. Kurtarmanın bedeli ise kod incelenmeden söylenemez.",
      notice: "Kurtarmanın bedeli, ücretsiz ilk teşhisten sonra sabit tutar olarak yazılı bildirilir."
    },
    presets: [
      { id: "saas", name: "Büyüyen SaaS / Startup", teamSize: 3, monthlyRatePerDev: 90000, rebuildMonths: 5, recruitingMonths: 2 },
      { id: "ecommerce", name: "Orta Ölçek E-Ticaret / Ajans Müşterisi", teamSize: 4, monthlyRatePerDev: 100000, rebuildMonths: 7, recruitingMonths: 2 },
      { id: "enterprise", name: "Kurumsal Monolit / Fintech", teamSize: 7, monthlyRatePerDev: 130000, rebuildMonths: 10, recruitingMonths: 3 }
    ],
    labels: {
      presetTitle: "Örnek Proje Profili Seçin",
      inputsTitle: "Sıfırdan Yazım Varsayımları",
      teamSize: "Sıfırdan Yazım İçin Gereken Mühendis Sayısı",
      monthlyRate: "Mühendis Başına Aylık Maliyet (Maaş + Yan Haklar) (₺)",
      rebuildMonths: "Tahmini Sıfırdan Yazım Süresi (Ay)",
      recruitingMonths: "İşe Alım & Oryantasyon Süresi (Ay)",
      resultTitle: "Sıfırdan Yazımın Maaş Maliyeti",
      teamLine: "Ekip",
      durationLine: "Süre",
      formulaTitle: "Hesap",
      formula: "Maaş Maliyeti = Mühendis Sayısı × Aylık Maliyet × (İşe Alım Süresi + Yazım Süresi)",
      excluded: "Dahil olmayanlar: bu sürede ertelenen iş ve ciro, eski sistemdeki yazılı olmayan kuralların kaybı, yeni sistemin ilk aylarındaki hatalar.",
      sourceNote: "Hesaptaki bütün rakamlar sizin girdiğiniz değerlerdir; hazır profiller yalnız örnektir.",
      copyReport: "Maliyet Raporunu Kopyala",
      copiedNotice: "Maliyet raporu panoya kopyalandı!",
      triageCta: "Ücretsiz İlk Teşhis İçin Görüşme Planla",
      rebuildBreakdown: "Sıfırdan yazımın riskleri",
      rescueBreakdown: "Kurtarma nasıl fiyatlanır"
    },
    rebuildItems: [
      "İşe alım, mülakat ve oryantasyon için geçen süre",
      "Geliştirme süresince ertelenen yol haritası ve kaçırılan pazar fırsatları",
      "Eski sistemde yıllarca birikmiş, yazılı olmayan özel kuralların (edge case) kaybolması",
      "Sıfırdan yazılan sistemin canlıya çıktığında yeni hatalar üretmesi"
    ],
    rescueItems: [
      "Kurtarmada mevcut sistem ve içindeki iş kuralları yerinde kalır; önce darboğazlar ele alınır.",
      "Süre ve bedel kod incelenmeden verilmez.",
      "İlk teşhis ücretsizdir; bulgular yazılı iletilir.",
      "Bedel, teşhisten sonra sabit tutar olarak yazılı bildirilir; saatlik ya da ucu açık çalışılmaz."
    ]
  },
  en: {
    hero: {
      badge: "REBUILD COST",
      title: "Rescue or Rebuild?",
      subtitle: "Calculate the payroll cost of scrapping a working system and rebuilding it, using your own numbers. The cost of a rescue cannot be stated before the code has been reviewed.",
      notice: "A rescue is priced after the free initial diagnosis, as a fixed fee, in writing."
    },
    presets: [
      { id: "saas", name: "Growth SaaS / Startup", teamSize: 3, monthlyRatePerDev: 90000, rebuildMonths: 5, recruitingMonths: 2 },
      { id: "ecommerce", name: "Mid-Market E-Commerce / Agency Client", teamSize: 4, monthlyRatePerDev: 100000, rebuildMonths: 7, recruitingMonths: 2 },
      { id: "enterprise", name: "Enterprise Monolith / Fintech", teamSize: 7, monthlyRatePerDev: 130000, rebuildMonths: 10, recruitingMonths: 3 }
    ],
    labels: {
      presetTitle: "Select an Example Project Profile",
      inputsTitle: "Rebuild Assumptions",
      teamSize: "Engineers Required for a Full Rebuild",
      monthlyRate: "Monthly Cost per Engineer (Salary + Benefits) (₺)",
      rebuildMonths: "Estimated Rebuild Duration (Months)",
      recruitingMonths: "Recruiting & Onboarding Time (Months)",
      resultTitle: "Payroll Cost of a Rebuild",
      teamLine: "Team",
      durationLine: "Duration",
      formulaTitle: "Calculation",
      formula: "Payroll Cost = Engineers × Monthly Cost × (Recruiting Time + Rebuild Time)",
      excluded: "Not included: work and revenue put on hold meanwhile, loss of unwritten rules in the old system, bugs in the new system's first months.",
      sourceNote: "Every figure in this calculation is a value you entered; the profiles are only examples.",
      copyReport: "Copy Cost Report",
      copiedNotice: "Cost report copied to clipboard!",
      triageCta: "Book a Call for a Free Initial Diagnosis",
      rebuildBreakdown: "Risks of a rebuild",
      rescueBreakdown: "How a rescue is priced"
    },
    rebuildItems: [
      "Time spent sourcing, interviewing and onboarding",
      "Roadmap on hold and market opportunities missed during development",
      "Loss of unwritten edge-case rules accumulated in the old system over years",
      "A system rewritten from scratch produces new bugs once it goes live"
    ],
    rescueItems: [
      "In a rescue, the existing system and its business rules stay in place; bottlenecks are addressed first.",
      "No timeline or price is given before the code has been reviewed.",
      "The initial diagnosis is free; findings are shared in writing.",
      "The fee is given in writing as a fixed amount after the diagnosis; there is no hourly or open-ended billing."
    ]
  }
};

export const rescueRoiH1 = {
  tr: rescueRoiData.tr.hero.title,
  en: rescueRoiData.en.hero.title
};
