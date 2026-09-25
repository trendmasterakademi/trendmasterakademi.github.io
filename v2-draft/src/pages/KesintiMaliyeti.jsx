import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Calculator, Info, Calendar, PhoneCall, ShoppingBag, 
  Clock, TrendingDown, DollarSign
} from 'lucide-react';
import { getCalendlyUrl } from '../utils/calendly';
import { setPageSeo } from '../utils/pageTitle';
import { isTurkish } from '../i18n';
import { downtimeCostH1 } from '../data/pageH1Data';
import { kesintiYontem, peakPresets } from '../data/kesintiYontemData';

const revenueTiers = [
  { id: 't1', label: { tr: '₺250.000 - ₺500.000 / ay', en: '₺250,000 - ₺500,000 / month' }, monthlyAvg: 375000 },
  { id: 't2', label: { tr: '₺500.000 - ₺1.500.000 / ay', en: '₺500,000 - ₺1,500,000 / month' }, monthlyAvg: 1000000 },
  { id: 't3', label: { tr: '₺1.500.000 - ₺5.000.000 / ay', en: '₺1,500,000 - ₺5,000,000 / month' }, monthlyAvg: 3250000 },
  { id: 't4', label: { tr: '₺5.000.000 - ₺15.000.000+ / ay', en: '₺5,000,000 - ₺15,000,000+ / month' }, monthlyAvg: 10000000 }
];

const AVERAGE_BASKET_TRY = 1268;

const KesintiMaliyeti = () => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);

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
    setPageSeo(isTr ? '/kesinti-maliyeti/' : '/downtime-calc/', isTr ? 'tr' : 'en');

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
    return new Intl.NumberFormat(isTr ? 'tr-TR' : 'en-US', { style: 'currency', currency: 'TRY', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 }).format(Math.round(val));
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
        `⏳ Outage duration: ${durationHours} ${durationHours === 1 ? 'hour' : 'hours'}\n` +
        `📊 Monthly revenue: ${formatCurrency(monthlyRev)}\n` +
        `⚙️ Peak factor: ${factorStr} (assumption)\n` +
        `📉 Estimated direct revenue loss: ${formatCurrency(directLoss)}${kitBadge}\n\n` +
        `We request a diagnosis from TMA for our live system outage.`;

    window.open(`https://wa.me/905343713573?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 md:px-8 bg-[var(--paper)] text-[var(--ink)] relative font-sans selection:bg-[var(--accent)] selection:text-[var(--on-accent)]">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Eyebrow & Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--accent)] text-xs font-mono font-medium uppercase tracking-wider">
            <Calculator className="w-4 h-4" /> {isTr ? 'FİNANSAL RİSK & ETKİ SİMÜLATÖRÜ' : 'FINANCIAL LOSS SIMULATOR'}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-[var(--ink)] tracking-tight leading-tight">
            {downtimeCostH1[isTr ? 'tr' : 'en']}
          </h1>

          <p className="text-[var(--ink-2)] text-base sm:text-lg leading-relaxed">
            {kesintiYontem[isTr ? 'tr' : 'en'].altBaslik}
          </p>
        </div>

        {/* 2-Column Layout: Inputs vs Realtime Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Inputs (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Input 1: Monthly Revenue or Daily Orders */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-sm font-mono uppercase text-[var(--ink-3)] font-semibold block">
                  1. {isTr ? 'Aylık Ciro veya Sipariş Hacmi' : 'Monthly Revenue or Order Volume'}
                </label>
                <div className="flex items-center gap-1.5 bg-[var(--paper)] p-1 rounded-xl border border-[var(--rule)] text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => { setInputMode('tier'); setDailyOrders(''); }}
                    className={`px-3 py-1.5 min-h-[44px] rounded-lg transition-colors cursor-pointer ${
                      inputMode !== 'orders' ? 'bg-[var(--accent)] text-[var(--on-accent)] font-semibold' : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {isTr ? 'Aylık Ciro' : 'Monthly Revenue'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setInputMode('orders'); setCustomRevenue(''); }}
                    className={`px-3 py-1.5 min-h-[44px] rounded-lg transition-colors cursor-pointer ${
                      inputMode === 'orders' ? 'bg-[var(--accent)] text-[var(--on-accent)] font-semibold' : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
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
                    <label htmlFor="kesinti-siparis" className="text-xs text-[var(--ink-2)] mb-1.5 block">
                      {isTr ? 'Tahmini Günlük Sipariş Adedi:' : 'Estimated Daily Orders:'}
                    </label>
                    <input
                      id="kesinti-siparis"
                      type="number"
                      placeholder={isTr ? 'Örn: 100 sipariş/gün' : 'e.g. 100 orders/day'}
                      value={dailyOrders}
                      onChange={e => setDailyOrders(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] text-sm focus:border-[var(--accent)] focus:outline-none font-mono"
                    />
                  </div>
                  <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--rule)] text-xs text-[var(--ink-2)] leading-relaxed font-mono">
                    {isTr ? (
                      <>
                        Hesaplanan Aylık Ciro: <strong className="text-[var(--ink)]">{formatCurrency(monthlyRev)}</strong>
                        <span className="block text-xs text-[var(--ink-3)] mt-1 font-sans">
                          * Ortalama sepet ₺1.268 — T.C. Ticaret Bakanlığı ETBİS 2025 verisinden: ₺2,46 trilyon perakende e-ticaret hacmi ÷ 1,94 milyar işlem.
                        </span>
                      </>
                    ) : (
                      <>
                        Calculated Monthly Revenue: <strong className="text-[var(--ink)]">{formatCurrency(monthlyRev)}</strong>
                        <span className="block text-xs text-[var(--ink-3)] mt-1 font-sans">
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
                        className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-semibold text-left transition-all cursor-pointer min-h-[48px] ${
                          selectedTier === t.id && !customRevenue && inputMode === 'tier'
                            ? 'bg-[var(--accent-wash)] border-[var(--accent)] text-[var(--accent)]'
                            : 'bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink-2)] hover:bg-[var(--surface)] hover:text-[var(--ink)]'
                        }`}
                      >
                        {t.label[isTr ? 'tr' : 'en']}
                      </button>
                    ))}
                  </div>
                  <div>
                    <input
                      type="number"
                      aria-label={isTr ? 'Net aylık ciro' : 'Exact monthly revenue'}
                      placeholder={isTr ? 'Veya net aylık ciro girin (örn: 1500000)' : 'Or specify exact monthly revenue (e.g. 1500000)'}
                      value={customRevenue}
                      onChange={e => { setCustomRevenue(e.target.value); setInputMode('custom'); }}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] text-xs sm:text-sm focus:border-[var(--accent)] focus:outline-none font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Input 2: Duration Slider */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <label htmlFor="kesinti-sure" className="text-sm font-mono uppercase text-[var(--ink-3)] font-semibold">
                  2. {isTr ? 'Tahmini Kesinti Süresi' : 'Estimated Outage Duration'}
                </label>
                <span className="text-lg font-bold font-mono text-[var(--accent)]">
                  {durationHours} {isTr ? 'Saat' : (durationHours === 1 ? 'Hour' : 'Hours')}
                </span>
              </div>
              <input
                id="kesinti-sure"
                type="range"
                min="1"
                max="48"
                step="1"
                value={durationHours}
                onChange={e => setDurationHours(parseInt(e.target.value))}
                className="w-full h-11 accent-[var(--accent)] cursor-pointer"
              />
              <div className="flex justify-between text-xs font-mono text-[var(--ink-3)]">
                <span>{isTr ? '1 Saat' : '1 Hour'}</span>
                <span>{isTr ? '12 Saat' : '12 Hours'}</span>
                <span>{isTr ? '24 Saat' : '24 Hours'}</span>
                <span>{isTr ? '48 Saat' : '48 Hours'}</span>
              </div>
            </div>

            {/* Input 3: Peak Factor (Visible and Adjustable) */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label htmlFor="kesinti-katsayi" className="text-sm font-mono uppercase text-[var(--ink-3)] font-semibold">
                  3. {isTr ? 'Zirve Katsayısı (Trafik Yoğunluğu)' : 'Peak Factor (Traffic Intensity)'}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--ink-3)] font-mono">{isTr ? 'Katsayı:' : 'Multiplier:'}</span>
                  <input
                    id="kesinti-katsayi"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10.0"
                    value={peakFactor}
                    onChange={e => setPeakFactor(parseFloat(e.target.value) || 1.0)}
                    className="w-20 px-3 py-1 rounded-lg bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] font-mono font-bold text-center text-sm focus:border-[var(--accent)] focus:outline-none min-h-[44px]"
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
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer min-h-[48px] flex flex-col justify-center items-center gap-0.5 ${
                        isSelected
                          ? 'bg-[var(--accent-wash)] border-[var(--accent)] text-[var(--accent)]'
                          : 'bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink-2)] hover:bg-[var(--surface)] hover:text-[var(--ink)]'
                      }`}
                    >
                      <span>{preset.label[isTr ? 'tr' : 'en']}</span>
                      <span className="font-mono text-xs">{isTr ? `${preset.factor.toFixed(1).replace('.', ',')}×` : `× ${preset.factor.toFixed(1)}`}</span>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-[var(--ink-3)] leading-relaxed italic">
                {isTr 
                  ? 'Bu bir varsayımdır. Kendi trafik dağılımınızı biliyorsanız değiştirin.' 
                  : 'This is an assumption. Adjust if you know your specific traffic distribution.'}
              </p>
            </div>

          </div>

          {/* Right Column: Realtime Arithmetic Blueprint Output (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            
            <div className="p-7 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] shadow-sm space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[var(--rule)] pb-4">
                <span className="text-xs font-mono font-semibold tracking-widest text-[var(--accent)] uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
                  {isTr ? 'TAHMİNİ KAYIP ANALİZİ' : 'ESTIMATED LOSS BLUEPRINT'}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-[var(--r-control)] bg-[var(--paper)] text-[var(--ink-3)] border border-[var(--rule)]">
                  {durationHours} {isTr ? 'Saatlik Simülasyon' : 'Hour Simulation'}
                </span>
              </div>

              {/* Total Estimated Loss Hero */}
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-mono uppercase text-[var(--ink-3)] block">
                  {isTr ? 'Tahmini Doğrudan Ciro Kaybı' : 'Estimated Direct Revenue Loss'}
                </span>
                <strong className="text-3xl sm:text-4xl font-bold font-mono text-[var(--accent)] block tracking-tight">
                  {formatCurrency(directLoss)}
                </strong>
                <span className="text-xs text-[var(--ink-3)] font-mono block pt-0.5">
                  {isTr 
                    ? `(${durationHours} saat × ${formatCurrency(hourlyRev)} / saat × ${peakFactor.toFixed(1).replace('.', ',')}x)`
                    : `(${durationHours} ${durationHours === 1 ? 'hr' : 'hrs'} × ${formatCurrency(hourlyRev)} / hr × ${peakFactor.toFixed(1)}x)`}
                </span>
              </div>

              {/* Step-by-Step Arithmetic Table */}
              <div className="space-y-3 pt-3 text-xs sm:text-sm font-mono border-t border-[var(--rule)]">
                <div className="flex justify-between items-center text-[var(--ink-2)]">
                  <span>{isTr ? 'Aylık ciro' : 'Monthly revenue'}</span>
                  <span className="font-semibold text-[var(--ink)]">{formatCurrency(monthlyRev)}</span>
                </div>
                <div className="flex justify-between items-center text-[var(--ink-2)]">
                  <span>{isTr ? 'Saat başına  (÷ 730 saat)' : 'Per hour  (÷ 730 hours)'}</span>
                  <span className="font-semibold text-[var(--ink)]">{formatCurrency(hourlyRev)}</span>
                </div>
                <div className="flex justify-between items-center text-[var(--ink-2)]">
                  <span>{isTr ? 'Kesinti süresi' : 'Outage duration'}</span>
                  <span className="font-semibold text-[var(--ink)]">{durationHours} {isTr ? 'saat' : (durationHours === 1 ? 'hour' : 'hours')}</span>
                </div>
                <div className="flex justify-between items-center text-[var(--ink-2)]">
                  <span className="text-xs">
                    {isTr ? 'Zirve katsayısı  (varsayım · değiştirilebilir)' : 'Peak factor  (assumption · adjustable)'}
                  </span>
                  <span className="font-semibold text-[var(--accent)]">× {peakFactor.toLocaleString(isTr ? 'tr-TR' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                </div>
                <div className="pt-3 border-t border-dashed border-[var(--rule)] flex justify-between items-center text-sm sm:text-base">
                  <span className="font-semibold text-[var(--ink)]">{isTr ? 'Tahmini doğrudan ciro kaybı' : 'Estimated direct revenue loss'}</span>
                  <strong className="text-xl sm:text-2xl font-bold text-[var(--accent)] font-mono">{formatCurrency(directLoss)}</strong>
                </div>
              </div>

              {/* Action Choice: Crisis vs Planning */}
              <div className="space-y-3 pt-2">
                <p className="text-xs sm:text-sm font-semibold text-[var(--ink)] text-center font-mono">
                  {isTr ? 'Bu kesinti şu an yaşanıyor mu?' : 'Is this outage happening right now?'}
                </p>

                {/* 1. Primary: WhatsApp (Crisis) */}
                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="btn-primary min-h-[48px] w-full text-sm sm:text-base font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-5 h-5 text-[var(--on-accent)]" />
                  <span>{isTr ? 'Şu an yaşanıyor — Kriz masasına yaz' : 'Happening now — message the response desk'}</span>
                </button>

                {/* 2. Secondary: Takvim (Planning ahead) */}
                <a
                  href={getCalendlyUrl('downtime_result')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => window.trackEvent && window.trackEvent('calendar_clicked', { source: 'downtime_result' })}
                  className="btn-secondary min-h-[44px] w-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[var(--accent)]" />
                  <span>{isTr ? 'Önlem alıyorum — 30 dakikalık görüşme' : 'Planning ahead — book a 30-minute call'}</span>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Section 3: Transparent Formula & Calculation Methodology */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--rule)] space-y-4 text-xs sm:text-sm text-[var(--ink-2)]">
          <div className="flex items-center gap-2 text-[var(--ink)] font-semibold">
            <Info className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="text-base font-serif font-semibold text-[var(--ink)]">
              {kesintiYontem[isTr ? 'tr' : 'en'].baslik}
            </h2>
          </div>
          
          <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--rule)] font-mono text-[var(--ink)] text-xs overflow-x-auto">
            <code>
              {kesintiYontem[isTr ? 'tr' : 'en'].formul}
            </code>
          </div>

          <div className="space-y-3 leading-relaxed text-[var(--ink-2)] text-xs sm:text-sm">
            {kesintiYontem[isTr ? 'tr' : 'en'].paragraflar.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default KesintiMaliyeti;
