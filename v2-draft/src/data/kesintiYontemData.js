// Kesinti maliyeti hesaplayıcısı — yöntem metni ve zaman dilimi seçenekleri.
// React (KesintiMaliyeti.jsx) ve ön-render (generate_static_pages.js) buradan okur. Adım 81.

export const peakPresets = [
  { id: 'peak', label: { tr: 'Zirve Saat', en: 'Peak Hours' }, factor: 2.0 },
  { id: 'normal', label: { tr: 'Normal Saat', en: 'Normal Hours' }, factor: 1.0 },
  { id: 'night', label: { tr: 'Gece', en: 'Night' }, factor: 0.5 }
];

export const kesintiYontem = {
  tr: {
    altBaslik: "Sistem çöktüğünde veya sipariş akışı tıkandığında geçen sürenin doğrudan ciro kaybını şeffaf matematikle hesaplayın.",
    baslik: "Hesaplama Metodolojisi & Şeffaflık Beyanı",
    formul: "Tahmini Doğrudan Kayıp = (Aylık Ciro ÷ 730 Saat) × Kesinti Süresi (Saat) × Zirve Katsayısı",
    paragraflar: [
      "Bu hesap tek bir formülden ibarettir: aylık cironuz 730 saate bölünür, kesinti süresiyle ve seçtiğiniz zirve katsayısıyla çarpılır. Gizli çarpan yoktur; yukarıdaki her adım ekranda görünür ve katsayıyı siz değiştirirsiniz.",
      "Sektöre göre çarpan, itibar kaybı oranı veya \"müdahale edilmezse\" senaryosu kullanmıyoruz — bunlar güvenilir biçimde ölçülemez. Dolaşan saatlik kesinti maliyeti rakamlarının çoğu kurumsal veri merkezi örneklemine dayanır ve ajans müşterisi ölçeğinde anlamsızdır.",
      "Sonuç doğrudan ciro kaybının tahminidir; iade, kargo, destek yükü ve müşteri kaybı gibi dolaylı etkileri içermez."
    ]
  },
  en: {
    altBaslik: "Estimate direct revenue loss during live production outages with transparent, verifiable arithmetic.",
    baslik: "Calculation Methodology & Transparency Disclosure",
    formul: "Estimated Direct Loss = (Monthly Revenue ÷ 730 Hours) × Outage Duration (Hours) × Peak Factor",
    paragraflar: [
      "This calculation is a single formula: your monthly revenue divided by 730 hours, multiplied by the outage duration and the peak factor you choose. There are no hidden multipliers; every step above is shown on screen and you control the factor.",
      "We do not use sector multipliers, reputation-loss ratios or \"what if nobody intervened\" scenarios — those cannot be measured reliably. Most published hourly downtime figures come from enterprise data-centre samples and do not apply at agency-client scale.",
      "The result estimates direct revenue loss only; it excludes refunds, shipping, support load and customer churn."
    ]
  }
};
