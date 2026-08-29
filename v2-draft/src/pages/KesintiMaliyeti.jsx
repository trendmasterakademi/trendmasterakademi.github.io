import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Calculator, Info, Calendar, PhoneCall, ShoppingBag, 
  Clock, TrendingDown, DollarSign
} from 'lucide-react';
import { getCalendlyUrl } from '../utils/calendly';

const revenueTiers = [
  { id: 't1', label: '₺250.000 - ₺500.000 / ay', monthlyAvg: 375000 },
  { id: 't2', label: '₺500.000 - ₺1.500.000 / ay', monthlyAvg: 1000000 },
  { id: 't3', label: '₺1.500.000 - ₺5.000.000 / ay', monthlyAvg: 3250000 },
  { id: 't4', label: '₺5.000.000 - ₺15.000.000+ / ay', monthlyAvg: 10000000 }
];

const peakPresets = [
  { id: 'peak', label: { tr: 'Zirve Saat', en: 'Peak Hours' }, factor: 2.0 },
  { id: 'normal', label: { tr: 'Normal Saat', en: 'Normal Hours' }, factor: 1.0 },
  { id: 'night', label: { tr: 'Gece', en: 'Night' }, factor: 0.5 }
];

const AVERAGE_BASKET_TRY = 1268;

const KesintiMaliyeti = () => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';

  const [inputMode, setInputMode] = useState('tier'); // 'tier', 'custom', 'orders'
  const [selectedTier, setSelectedTier] = useState('t2');
  const [customRevenue, setCustomRevenue] = useState('');
  const [dailyOrders, setDailyOrders] = useState('');
  const [peakFactor, setPeakFactor] = useState(2.0);
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
        ? "Sunucu çökmesi veya HTTP 500 kesintisinde saatlik ve toplam tahmini ciro kaybınızı hesaplayın. Şeffaf matematik ve doğrudan ciro kaybı simülasyonu."
        : "Calculate estimated direct revenue loss during website outages. Transparent arithmetic, no hidden multipliers."
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

  // Determine monthly revenue based on selected input mode
  let monthlyRev = 1000000;
  if (inputMode === 'orders') {
    const orders = parseFloat(dailyOrders) || 0;
    monthlyRev = orders * 30 * AVERAGE_BASKET_TRY;
  } else if (inputMode === 'custom' || customRevenue) {
    monthlyRev = parseFloat(customRevenue) || 0;
  } else {
    const tierObj = revenueTiers.find(t => t.id === selectedTier) || revenueTiers[1];
    monthlyRev = tierObj.monthlyAvg;
  }

  // 1 Month = 730 Hours (365 days * 24 / 12)
  const hourlyRev = monthlyRev / 730;
  
  // Direct Revenue Loss during Outage = hourlyRev * duration * peakFactor
  const directLoss = hourlyRev * durationHours * peakFactor;

  // Track telemetry upon calculation change
  useEffect(() => {
    if (window.trackEvent) {
      const lossBand = directLoss > 100000 ? 'high_100k_plus' : directLoss > 30000 ? 'mid_30k_100k' : 'under_30k';
      window.trackEvent('downtime_calc_completed', {
        loss_band: lossBand,
        agency_code: campaignParams.agency_code
      });
    }
  }, [inputMode, selectedTier, customRevenue, dailyOrders, peakFactor, durationHours]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(Math.round(val));
  };

  const openWhatsApp = () => {
    if (window.trackEvent) {
      window.trackEvent('whatsapp_clicked', {
        source: 'downtime_calc',
        agency_code: campaignParams.agency_code
      });
    }

    const kitBadge = campaignParams.agency_code ? `\n📦 *Kriz Kiti Ajans Kodu:* #${campaignParams.agency_code}` : '';
    const factorStr = peakFactor.toLocaleString(isTr ? 'tr-TR' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    
    const text = isTr
      ? `⏱️ *TMA KESİNTİ MALİYETİ HESABI*\n\n` +
        `⏳ Kesinti süresi: ${durationHours} saat\n` +
        `📊 Aylık ciro: ${formatCurrency(monthlyRev)}\n` +
        `⚙️ Zirve katsayısı: ${factorStr} (varsayım)\n` +
        `📉 Tahmini doğrudan ciro kaybı: ${formatCurrency(directLoss)}${kitBadge}\n\n` +
        `Canlı sistemdeki kesinti için TMA'dan teşhis talep ediyoruz.`
      : `⏱️ *TMA DOWNTIME COST ASSESSMENT*\n\n` +
        `⏳ Outage duration: ${durationHours} hours\n` +
        `📊 Monthly revenue: ${formatCurrency(monthlyRev)}\n` +
        `⚙️ Peak factor: ${factorStr} (assumption)\n` +
        `📉 Estimated direct revenue loss: ${formatCurrency(directLoss)}${kitBadge}\n\n` +
        `We request a diagnosis from TMA for our live system outage.`;

    window.open(`https://wa.me/905343713573?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 md:px-8 bg-[#080b11] text-slate-200 relative font-sans">
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
              ? 'Sistem çöktüğünde veya sipariş akışı tıkandığında geçen sürenin doğrudan ciro kaybını şeffaf matematikle hesaplayın.' 
              : 'Estimate direct revenue loss during live production outages with transparent, verifiable arithmetic.'}
          </p>
        </div>

        {/* 2-Column Layout: Inputs vs Realtime Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Inputs (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Input 1: Monthly Revenue or Daily Orders */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#111827]/90 border border-white/10 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-sm font-mono uppercase text-slate-400 font-bold block">
                  1. {isTr ? 'Aylık Ciro veya Sipariş Hacmi' : 'Monthly Revenue or Order Volume'}
                </label>
                <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => { setInputMode('tier'); setDailyOrders(''); }}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      inputMode !== 'orders' ? 'bg-cyan-500 text-bg-dark font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {isTr ? 'Aylık Ciro' : 'Monthly Revenue'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setInputMode('orders'); setCustomRevenue(''); }}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      inputMode === 'orders' ? 'bg-cyan-500 text-bg-dark font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {isTr ? 'Günlük Sipariş' : 'Daily Orders'}
                  </button>
                </div>
              </div>

              {inputMode === 'orders' ? (
                /* Daily Orders Mode */
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="text-xs text-slate-400 mb-1.5 block">
                      {isTr ? 'Tahmini Günlük Sipariş Adedi:' : 'Estimated Daily Orders:'}
                    </label>
                    <input
                      type="number"
                      placeholder={isTr ? 'Örn: 100 sipariş/gün' : 'e.g. 100 orders/day'}
                      value={dailyOrders}
                      onChange={e => setDailyOrders(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
                    />
                  </div>
                  <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 leading-relaxed font-mono">
                    {isTr ? (
                      <>
                        Hesaplanan Aylık Ciro: <strong className="text-white">{formatCurrency(monthlyRev)}</strong>
                        <span className="block text-[11px] text-slate-400 mt-1 font-sans">
                          * Ortalama sepet ₺1.268 — T.C. Ticaret Bakanlığı ETBİS 2025 verisinden: ₺2,46 trilyon perakende e-ticaret hacmi ÷ 1,94 milyar işlem.
                        </span>
                      </>
                    ) : (
                      <>
                        Calculated Monthly Revenue: <strong className="text-white">{formatCurrency(monthlyRev)}</strong>
                        <span className="block text-[11px] text-slate-400 mt-1 font-sans">
                          * Average basket ₺1,268 — from Ministry of Commerce ETBİS 2025 data: ₺2.46 trillion retail e-commerce volume ÷ 1.94 billion transactions.
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                /* Monthly Revenue Tiers & Custom Input */
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {revenueTiers.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => { setSelectedTier(t.id); setCustomRevenue(''); setInputMode('tier'); }}
                        className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold text-left transition-all cursor-pointer min-h-[48px] ${
                          selectedTier === t.id && !customRevenue && inputMode === 'tier'
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder={isTr ? 'Veya net aylık ciro girin (örn: 1500000)' : 'Or specify exact monthly revenue (e.g. 1500000)'}
                      value={customRevenue}
                      onChange={e => { setCustomRevenue(e.target.value); setInputMode('custom'); }}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Input 2: Duration Slider */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#111827]/90 border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <label className="text-sm font-mono uppercase text-slate-400 font-bold">
                  2. {isTr ? 'Tahmini Kesinti Süresi' : 'Estimated Outage Duration'}
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
                <span>1 Saat</span>
                <span>12 Saat</span>
                <span>24 Saat</span>
                <span>48 Saat</span>
              </div>
            </div>

            {/* Input 3: Peak Factor (Visible and Adjustable) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#111827]/90 border border-white/10 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-sm font-mono uppercase text-slate-400 font-bold">
                  3. {isTr ? 'Zirve Katsayısı (Trafik Yoğunluğu)' : 'Peak Factor (Traffic Intensity)'}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">Katsayı:</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10.0"
                    value={peakFactor}
                    onChange={e => setPeakFactor(parseFloat(e.target.value) || 1.0)}
                    className="w-20 px-3 py-1 rounded-lg bg-black/40 border border-cyan-400/50 text-cyan-300 font-mono font-bold text-center text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {peakPresets.map(preset => {
                  const isSelected = Math.abs(peakFactor - preset.factor) < 0.01;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setPeakFactor(preset.factor)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer min-h-[48px] flex flex-col justify-center items-center gap-0.5 ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <span>{preset.label[isTr ? 'tr' : 'en']}</span>
                      <span className="font-mono text-[10px] opacity-75">× {preset.factor.toFixed(1)}</span>
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed italic">
                {isTr 
                  ? 'Bu bir varsayımdır. Kendi trafik dağılımınızı biliyorsanız değiştirin.' 
                  : 'This is an assumption. Adjust if you know your specific traffic distribution.'}
              </p>
            </div>

          </div>

          {/* Right Column: Realtime Arithmetic Blueprint Output (5 Cols) */}
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
                  {isTr ? 'Tahmini Doğrudan Ciro Kaybı' : 'Estimated Direct Revenue Loss'}
                </span>
                <strong className="text-3xl sm:text-4xl font-black font-mono text-red-400 block tracking-tight">
                  {formatCurrency(directLoss)}
                </strong>
              </div>

              {/* Step-by-Step Arithmetic Table */}
              <div className="space-y-3 pt-3 text-xs sm:text-sm font-mono border-t border-white/10">
                <div className="flex justify-between items-center text-slate-300">
                  <span>{isTr ? 'Aylık ciro' : 'Monthly revenue'}</span>
                  <span className="font-bold text-white">{formatCurrency(monthlyRev)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>{isTr ? 'Saat başına  (÷ 730 saat)' : 'Per hour  (÷ 730 hours)'}</span>
                  <span className="font-bold text-slate-200">{formatCurrency(hourlyRev)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>{isTr ? 'Kesinti süresi' : 'Outage duration'}</span>
                  <span className="font-bold text-slate-200">{durationHours} {isTr ? 'saat' : 'hours'}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-[11px] sm:text-xs">
                    {isTr ? 'Zirve katsayısı  (varsayım · değiştirilebilir)' : 'Peak factor  (assumption · adjustable)'}
                  </span>
                  <span className="font-bold text-cyan-400">× {peakFactor.toLocaleString(isTr ? 'tr-TR' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                </div>
                <div className="pt-3 border-t border-dashed border-white/20 flex justify-between items-center text-sm sm:text-base">
                  <span className="font-bold text-white">{isTr ? 'Tahmini doğrudan ciro kaybı' : 'Estimated direct revenue loss'}</span>
                  <strong className="text-xl sm:text-2xl font-black text-red-400 font-mono">{formatCurrency(directLoss)}</strong>
                </div>
              </div>

              {/* Planning CTAs: Primary = Takvim, Secondary = WhatsApp */}
              <div className="space-y-3 pt-2">
                <a
                  href={getCalendlyUrl('downtime_result')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => window.trackEvent && window.trackEvent('calendar_clicked', { source: 'downtime_result' })}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-bg-dark font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 cursor-pointer transform hover:-translate-y-0.5 transition-all min-h-[48px]"
                >
                  <Calendar className="w-5 h-5" />
                  <span>{isTr ? 'Takvimden 30 Dakikalık Görüşme Seç' : 'Book a 30-Minute Intro Call'}</span>
                </a>

                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px]"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>{isTr ? 'WhatsApp ile Danışın' : 'Consult via WhatsApp'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Section 3: Transparent Formula & Calculation Methodology */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-white/10 space-y-4 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-2 text-white font-bold">
            <Info className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold">
              {isTr ? 'Hesaplama Metodolojisi & Şeffaflık Beyanı' : 'Calculation Methodology & Transparency Disclosure'}
            </h3>
          </div>
          
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-cyan-300 text-xs overflow-x-auto">
            <code>
              {isTr 
                ? 'Tahmini Doğrudan Kayıp = (Aylık Ciro ÷ 730 Saat) × Kesinti Süresi (Saat) × Zirve Katsayısı'
                : 'Estimated Direct Loss = (Monthly Revenue ÷ 730 Hours) × Outage Duration (Hours) × Peak Factor'}
            </code>
          </div>

          <div className="space-y-3 leading-relaxed text-slate-300 text-xs sm:text-sm">
            <p>
              {isTr 
                ? 'Bu hesap tek bir formülden ibarettir: aylık cironuz 730 saate bölünür, kesinti süresiyle ve seçtiğiniz zirve katsayısıyla çarpılır. Gizli çarpan yoktur; yukarıdaki her adım ekranda görünür ve katsayıyı siz değiştirirsiniz.'
                : 'This calculation is a single formula: your monthly revenue divided by 730 hours, multiplied by the outage duration and the peak factor you choose. There are no hidden multipliers; every step above is shown on screen and you control the factor.'}
            </p>
            <p>
              {isTr 
                ? 'Sektöre göre çarpan, itibar kaybı oranı veya "müdahale edilmezse" senaryosu kullanmıyoruz — bunlar güvenilir biçimde ölçülemez. Dolaşan saatlik kesinti maliyeti rakamlarının çoğu kurumsal veri merkezi örneklemine dayanır ve ajans müşterisi ölçeğinde anlamsızdır.'
                : 'We do not use sector multipliers, reputation-loss ratios or "what if nobody intervened" scenarios — those cannot be measured reliably. Most published hourly downtime figures come from enterprise data-centre samples and do not apply at agency-client scale.'}
            </p>
            <p>
              {isTr 
                ? 'Sonuç doğrudan ciro kaybının tahminidir; iade, kargo, destek yükü ve müşteri kaybı gibi dolaylı etkileri içermez.'
                : 'The result estimates direct revenue loss only; it excludes refunds, shipping, support load and customer churn.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default KesintiMaliyeti;
