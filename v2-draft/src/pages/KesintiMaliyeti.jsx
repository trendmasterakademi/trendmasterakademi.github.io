import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Calculator, DollarSign, Clock, AlertTriangle, ShieldCheck, 
  ArrowRight, PhoneCall, TrendingDown, Info, CheckCircle2,
  Layers, ShoppingBag, Globe, Server, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

const sectors = [
  {
    id: 'ecommerce',
    title: { tr: 'E-Ticaret / D2C Mağaza', en: 'E-Commerce / D2C Store' },
    desc: { tr: 'Doğrudan sepete atma ve anlık checkout akışı', en: 'Direct add-to-cart and instant checkout' },
    icon: ShoppingBag,
    multiplier: 1.4,
    reputationFactor: 0.25
  },
  {
    id: 'saas',
    title: { tr: 'B2B SaaS / Web Yazılımı', en: 'B2B SaaS / Cloud Platform' },
    desc: { tr: 'Abonelik, SLA taahhütleri ve kurumsal veri akışı', en: 'Subscriptions, SLA commitments, enterprise data' },
    icon: Server,
    multiplier: 1.25,
    reputationFactor: 0.35
  },
  {
    id: 'marketplace',
    title: { tr: 'Pazaryeri / Çok Satıcılı Sistem', en: 'Marketplace / Multi-Vendor' },
    desc: { tr: 'Alıcı ve satıcı çift taraflı komisyon ve sipariş hacmi', en: 'Two-sided transaction and vendor commission volume' },
    icon: Layers,
    multiplier: 1.6,
    reputationFactor: 0.40
  },
  {
    id: 'corporate',
    title: { tr: 'Kurumsal / B2B Lead Sitesi', en: 'Corporate / B2B Lead Engine' },
    desc: { tr: 'Teklif formları, katalog ve müşteri ilişkileri', en: 'Quote requests, product catalogs, RFP funnels' },
    icon: Globe,
    multiplier: 0.85,
    reputationFactor: 0.20
  }
];

const revenueTiers = [
  { id: 't1', label: '₺250.000 - ₺500.000 / ay', monthlyAvg: 375000 },
  { id: 't2', label: '₺500.000 - ₺1.500.000 / ay', monthlyAvg: 1000000 },
  { id: 't3', label: '₺1.500.000 - ₺5.000.000 / ay', monthlyAvg: 3250000 },
  { id: 't4', label: '₺5.000.000 - ₺15.000.000+ / ay', monthlyAvg: 10000000 }
];

const timeSlots = [
  { id: 'peak', label: { tr: 'Zirve Saatler (10:00 - 22:00)', en: 'Peak Hours (10:00 - 22:00)' }, factor: 1.5 },
  { id: 'normal', label: { tr: 'Normal Saatler (08:00 - 10:00 / 22:00 - 00:00)', en: 'Normal Hours' }, factor: 1.0 },
  { id: 'night', label: { tr: 'Gece Saatleri (00:00 - 08:00)', en: 'Off-Peak / Night' }, factor: 0.5 }
];

const KesintiMaliyeti = () => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';

  const [selectedSector, setSelectedSector] = useState('ecommerce');
  const [selectedTier, setSelectedTier] = useState('t2');
  const [customRevenue, setCustomRevenue] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('peak');
  const [durationHours, setDurationHours] = useState(4);

  const [campaignParams, setCampaignParams] = useState({
    utm_source: '',
    utm_campaign: '',
    agency_code: ''
  });

  useEffect(() => {
    document.title = isTr
      ? "Web Sitesi Kesinti Maliyeti Hesaplayıcı (Downtime Calculator) | Trend Master Akademi"
      : "Website Downtime Cost Calculator | Trend Master Academy";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", isTr
        ? "Sunucu çökmesi veya HTTP 500 kesintisinde saatlik ve toplam tahmini ciro kaybınızı hesaplayın. Şeffaf matematik ve kurtarma ROI analizi."
        : "Calculate estimated revenue loss during website outages. Transparent formula, reputation risk metrics, and SWAT recovery ROI."
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://trendmasterakademi.com/kesinti-maliyeti/');
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const src = params.get('utm_source') || '';
      const cmp = params.get('utm_campaign') || '';
      const agency = params.get('a') || params.get('agency') || '';
      if (src || cmp || agency) {
        setCampaignParams({ utm_source: src, utm_campaign: cmp, agency_code: agency });
      }
    } catch (e) {}
  }, [isTr]);

  // Calculations
  const sectorObj = sectors.find(s => s.id === selectedSector) || sectors[0];
  const tierObj = revenueTiers.find(t => t.id === selectedTier) || revenueTiers[1];
  const timeSlotObj = timeSlots.find(ts => ts.id === selectedTimeSlot) || timeSlots[0];

  const monthlyRev = customRevenue ? parseFloat(customRevenue) || tierObj.monthlyAvg : tierObj.monthlyAvg;
  
  // Base hourly revenue (Assuming 720 hours per month)
  const baseHourlyRev = monthlyRev / 720;
  
  // Weighted Hourly Loss
  const hourlyLoss = baseHourlyRev * timeSlotObj.factor * sectorObj.multiplier;
  
  // Direct Revenue Loss during Outage
  const directLoss = hourlyLoss * durationHours;
  
  // Reputation & SLA / Churn Penalty Risk
  const reputationRisk = directLoss * sectorObj.reputationFactor;
  
  // Total Compound Risk
  const totalRisk = directLoss + reputationRisk;

  // Saved if SWAT triaged in 2.5 hours vs long duration
  const swatDuration = 2.5;
  const potentialProlongedHours = Math.max(durationHours, 18);
  const prolongedLoss = (hourlyLoss * potentialProlongedHours) * (1 + sectorObj.reputationFactor);
  const swatLoss = (hourlyLoss * swatDuration) * (1 + sectorObj.reputationFactor);
  const savedAmount = Math.max(prolongedLoss - swatLoss, 15000);

  // Track telemetry upon calculation change
  useEffect(() => {
    if (window.trackEvent) {
      const lossBand = totalRisk > 100000 ? 'high_100k_plus' : totalRisk > 30000 ? 'mid_30k_100k' : 'under_30k';
      window.trackEvent('downtime_calc_completed', {
        sector: selectedSector,
        loss_band: lossBand,
        agency_code: campaignParams.agency_code
      });
    }
  }, [selectedSector, selectedTier, customRevenue, selectedTimeSlot, durationHours]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);
  };

  const openWhatsApp = () => {
    if (window.trackEvent) {
      window.trackEvent('whatsapp_clicked', {
        source: 'downtime_calc',
        sector: selectedSector,
        agency_code: campaignParams.agency_code
      });
    }

    const kitBadge = campaignParams.agency_code ? `\n📦 *Kriz Kiti Ajans Kodu:* #${campaignParams.agency_code}` : '';
    const text = isTr
      ? `⏱️ *TMA KESİNTİ MALİYETİ HESAPLAMA ÇIKTISI* ⏱️\n\n` +
        `🏢 *Sektör:* ${sectorObj.title.tr}\n` +
        `⏳ *Kesinti Süresi:* ${durationHours} Saat\n` +
        `📉 *Tahmini Toplam Kayıp:* ${formatCurrency(totalRisk)}${kitBadge}\n\n` +
        `Canlı sistemdeki kesintiyi en hızlı şekilde sonlandırmak için acil TMA SWAT müdahalesi talep ediyoruz.`
      : `⏱️ *TMA DOWNTIME COST ASSESSMENT* ⏱️\n\n` +
        `🏢 *Sector:* ${sectorObj.title.en}\n` +
        `⏳ *Duration:* ${durationHours} Hours\n` +
        `📉 *Estimated Risk Loss:* ${formatCurrency(totalRisk)}${kitBadge}\n\n` +
        `We request emergency SWAT intervention to resolve our production outage immediately.`;

    window.open(`https://wa.me/905343713573?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 md:px-8 bg-[#080b11] text-slate-200 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-red-500/10 via-amber-500/5 to-transparent blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#1f293d_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none -z-10"></div>

      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Eyebrow & Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Calculator className="w-4 h-4" /> {isTr ? 'FİNANSAL RİSK & ETKİ SİMÜLATÖRÜ' : 'FINANCIAL LOSS SIMULATOR'}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {isTr ? 'Web Sitesi & API Kesinti Maliyeti Hesaplayıcı' : 'Website & System Downtime Cost Calculator'}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {isTr 
              ? 'Sistem çöktüğünde veya sipariş akışı tıkandığında geçen her dakikanın ajansınıza ve müşterinize gerçek maliyetini hesaplayın.' 
              : 'Estimate real financial revenue loss, SLA penalties, and customer churn impact during live production outages.'}
          </p>
        </div>

        {/* 2-Column Layout: Inputs vs Realtime Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Inputs (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Input 1: Sector */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#111827]/90 border border-white/10 space-y-4 shadow-xl">
              <label className="text-sm font-mono uppercase text-slate-400 font-bold block">
                1. {isTr ? 'Projenin Sektörü & İş Modeli' : 'Business Model & Sector'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sectors.map(sec => {
                  const Icon = sec.icon;
                  const isSelected = selectedSector === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setSelectedSector(sec.id)}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer min-h-[48px] ${
                        isSelected 
                          ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,229,255,0.15)]' 
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <div>
                        <strong className="block text-xs sm:text-sm font-bold">{sec.title[isTr ? 'tr' : 'en']}</strong>
                        <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">{sec.desc[isTr ? 'tr' : 'en']}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input 2: Monthly Revenue Tier */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#111827]/90 border border-white/10 space-y-4 shadow-xl">
              <label className="text-sm font-mono uppercase text-slate-400 font-bold block">
                2. {isTr ? 'Müşterinin / Sistemin Ortalama Aylık Cirosu' : 'Average Monthly Revenue'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {revenueTiers.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => { setSelectedTier(t.id); setCustomRevenue(''); }}
                    className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold text-left transition-all cursor-pointer min-h-[48px] ${
                      selectedTier === t.id && !customRevenue
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="pt-2">
                <input
                  type="number"
                  placeholder={isTr ? 'Veya net aylık ciro girin (örn: 2500000)' : 'Or specify exact monthly revenue (e.g. 2500000)'}
                  value={customRevenue}
                  onChange={e => setCustomRevenue(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Input 3: Time Slot & Duration Slider */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#111827]/90 border border-white/10 space-y-5 shadow-xl">
              <div className="space-y-3">
                <label className="text-sm font-mono uppercase text-slate-400 font-bold block">
                  3. {isTr ? 'Kesintinin Yaşandığı Zaman Dilimi' : 'Time Window of Outage'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {timeSlots.map(ts => (
                    <button
                      key={ts.id}
                      type="button"
                      onClick={() => setSelectedTimeSlot(ts.id)}
                      className={`py-2.5 px-3 rounded-xl border text-[11px] sm:text-xs font-bold text-center transition-all cursor-pointer min-h-[48px] ${
                        selectedTimeSlot === ts.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {ts.label[isTr ? 'tr' : 'en']}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider Duration */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-mono uppercase text-slate-400 font-bold">
                    4. {isTr ? 'Tahmini Kesinti Süresi' : 'Estimated Outage Duration'}
                  </label>
                  <span className="text-lg font-black font-mono text-cyan-400">
                    {durationHours} {isTr ? 'Saat' : 'Hours'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="48"
                  step="1"
                  value={durationHours}
                  onChange={e => setDurationHours(parseInt(e.target.value))}
                  className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>1 Saat (Hotfix)</span>
                  <span>12 Saat (Yarım Gün)</span>
                  <span>24 Saat (1 Gün)</span>
                  <span>48 Saat (Kriz)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Realtime Financial Blueprint Output (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            
            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#111827] via-[#0d131f] to-[#151f33] border border-red-500/40 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  {isTr ? 'TAHMİNİ KAYIP ANALİZİ' : 'ESTIMATED LOSS BLUEPRINT'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                  {durationHours} Saatlik Simülasyon
                </span>
              </div>

              {/* Total Estimated Loss Hero */}
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-mono uppercase text-slate-400 block">
                  {isTr ? 'Toplam Tahmini Bileşik Risk' : 'Total Estimated Compound Loss'}
                </span>
                <strong className="text-3xl sm:text-4xl font-black font-mono text-red-400 block tracking-tight">
                  {formatCurrency(totalRisk)}
                </strong>
                <span className="text-[11px] text-slate-400 block">
                  {isTr ? 'Doğrudan ciro kaybı + itibar ve müşteri churn riski dahil' : 'Direct turnover loss + client churn risk factor'}
                </span>
              </div>

              {/* Loss Breakdown Cards */}
              <div className="space-y-2.5 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                  <span className="text-slate-400">{isTr ? 'Saatlik Tahmini Ciro Kaybı:' : 'Hourly Revenue Loss:'}</span>
                  <strong className="text-white font-mono text-sm">{formatCurrency(hourlyLoss)}/saat</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                  <span className="text-slate-400">{isTr ? 'Doğrudan Sipariş / Fırsat Kaybı:' : 'Direct Lost Orders:'}</span>
                  <strong className="text-white font-mono text-sm">{formatCurrency(directLoss)}</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                  <span className="text-slate-400">{isTr ? 'SLA Ceza & Churn İtibar Riski:' : 'SLA Penalty & Churn Factor:'}</span>
                  <strong className="text-amber-400 font-mono text-sm">{formatCurrency(reputationRisk)}</strong>
                </div>
              </div>

              {/* SWAT Recovery Comparison Box */}
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <strong className="text-xs font-bold text-emerald-300 uppercase font-mono">
                    {isTr ? 'TMA SWAT İle Kurtarılan Tutar' : 'Saved via TMA SWAT Intervention'}
                  </strong>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isTr 
                    ? `Bu kesinti 24-48 saat uzamak yerine 2.5 saatlik SWAT müdahalesiyle çözüldüğünde tahmini `
                    : `Resolving this outage within 2.5h instead of prolonged 24h downtime saves approximately `}
                  <strong className="text-emerald-400 font-mono font-bold">{formatCurrency(savedAmount)}</strong>
                  {isTr ? ' net ciro kurtarılır.' : ' in net revenue.'}
                </p>
                <div className="pt-1 text-[11px] font-mono text-emerald-400/80">
                  TMA Hotfix Maliyeti: <strong>Önceden Sabit ₺15.000 - ₺35.000</strong>
                </div>
              </div>

              {/* Emergency CTA */}
              <button
                type="button"
                onClick={openWhatsApp}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-bg-dark font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 cursor-pointer transform hover:-translate-y-0.5 transition-all min-h-[48px]"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{isTr ? 'Acil SWAT Kesinti Masasını Başlat →' : 'Deploy Emergency SWAT →'}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Section 3: Transparent Formula & Calculation Disclaimer */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-white/10 space-y-4 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-2 text-white font-bold">
            <Info className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold">{isTr ? 'Şeffaf Hesaplama Modeli & Formül Metodolojisi' : 'Calculation Methodology & Transparency Disclosure'}</h3>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-cyan-300 text-xs overflow-x-auto">
            <code>
              Tahmini Kayıp = (Aylık Ciro / 720 Saat) × Kesinti Süresi (Saat) × Zaman Dilimi Katsayısı × Sektörel Dönüşüm Çarpanı + İtibar/Ceza Riski
            </code>
          </div>
          <p className="leading-relaxed text-slate-400 text-xs">
            {isTr 
              ? '* Hesaplanan tutarlar sektörel sepet terk oranları, B2B SLA gecikme cezaları ve ortalama saatlik trafik hacimlerine dayalı **tahmini** değerlerdir. Uydurma kesinlik vaat edilmez; kriz anındaki olası ciro ve itibar hasarını ajans patronunun görmesi amacıyla modellenmiştir.' 
              : '* Figures represent estimated risk ranges based on standard industry checkout drop-off rates and B2B SLA penalty benchmarks.'}
          </p>
        </div>

      </div>
    </div>
  );
};

export default KesintiMaliyeti;
