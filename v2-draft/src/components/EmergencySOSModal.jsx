import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, X, PhoneCall, ShieldCheck, Clock, Send, CheckCircle2, MessageSquare, RefreshCw } from 'lucide-react';

const EmergencySOSModal = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';

  const [agencyName, setAgencyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [urgency, setUrgency] = useState('critical');
  const [problemDesc, setProblemDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const getUrgencyLabel = () => {
    return urgency === 'critical' 
      ? (isTr ? '🔴 KRİTİK (0-2 Saat Müdahale Gerekli)' : '🔴 CRITICAL (0-2h Immediate Intervention)')
      : urgency === 'high'
      ? (isTr ? '🟠 YÜKSEK (Bugün Çözülmeli / T-48H)' : '🟠 HIGH (Must Be Resolved Today / T-48H)')
      : (isTr ? '🟡 PLANLI DESTEK (Kapasite Artışı)' : '🟡 PLANNED SUPPORT (Capacity Surge)');
  };

  const getWhatsAppUrl = () => {
    const phone = "905343713573";
    const text = encodeURIComponent(
      `🚨 *TMA ACİL TEKNİK KRİZ BİLDİRİMİ (SOS)* 🚨\n\n` +
      `🏢 *${isTr ? 'Ajans / Şirket:' : 'Agency / Company:'}* ${agencyName || (isTr ? 'Belirtilmedi' : 'Not specified')}\n` +
      `👤 *${isTr ? 'Yetkili:' : 'Contact Person:'}* ${contactPerson || (isTr ? 'Belirtilmedi' : 'Not specified')}\n` +
      `📞 *${isTr ? 'Telefon / WhatsApp:' : 'Phone / WhatsApp:'}* ${contactPhone}\n` +
      `⚡ *${isTr ? 'Aciliyet Düzeyi:' : 'Urgency Level:'}* ${getUrgencyLabel()}\n` +
      `📝 *${isTr ? 'Kriz Özeti:' : 'Crisis Scope:'}* ${problemDesc}\n\n` +
      `_TMA Response Desk üzerinden gönderildi._`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const urgencyLabel = getUrgencyLabel();

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '64ef0cf5-703c-4cfd-92a4-4f0ba65bb2bb',
          from_name: 'TMA SOS Dispatch Desk',
          subject: `🚨 ACİL KRİZ BİLDİRİMİ (SOS) - ${agencyName || 'Ajans'} (${urgencyLabel})`,
          agency: agencyName || 'Belirtilmedi',
          contactPerson: contactPerson || 'Belirtilmedi',
          phone: contactPhone,
          urgency: urgencyLabel,
          problemDesc: problemDesc,
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSubmitStatus('success');
        if (window.trackEvent) {
          window.trackEvent('sos_form_submitted', { urgency: urgencyLabel });
        }
        // Automatically trigger WhatsApp forward
        window.open(getWhatsAppUrl(), '_blank');
      } else {
        throw new Error(data.message || 'SOS dispatch failed');
      }
    } catch (err) {
      console.error('SOS submit error:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-xl max-h-[92vh] flex flex-col bg-[#0d121d] border border-red-500/40 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.25)] relative text-slate-100 my-auto overflow-hidden"
        >
          {/* Top glow line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 animate-pulse z-10"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer z-20"
            aria-label={isTr ? 'Kapat' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Modal Body */}
          <div className="overflow-y-auto p-5 sm:p-7 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 pr-8 mb-2">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 flex-shrink-0">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
                    TMA Response Desk // 7-24 {isTr ? 'Kriz Masası' : 'Crisis Desk'}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                  {isTr ? 'Acil Teknik Müdahale & İmdat Butonu' : 'Emergency Technical Intervention & SOS'}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed mb-3">
              {isTr 
                ? 'Teslim tarihi sıkışan, geliştiricisi ayrılan veya canlıda kilitlenen projeler için doğrudan kıdemli mühendislik masamız devreye girer.' 
                : 'Direct senior engineering dispatch for locked codebases, abandoned repos, or mission-critical launch deadlines.'}
            </p>

          {submitStatus === 'success' ? (
            <div className="py-8 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">
                {isTr ? 'Kriz Bildirimi Kaydedildi & İletildi!' : 'Crisis Ticket Saved & Dispatched!'}
              </h4>
              <p className="text-sm text-slate-300 max-w-md">
                {isTr ? 'Bildiriminiz kriz masamıza kaydedildi ve WhatsApp üzerinden kıdemli mühendislik masamıza aktarıldı.' : 'Your ticket is logged and forwarded directly to our senior engineering desk.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => window.trackEvent && window.trackEvent('whatsapp_clicked', { source: 'sos_success_screen' })}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-bg-dark font-black text-xs sm:text-sm flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isTr ? 'WhatsApp Mesajını Aç' : 'Open WhatsApp'}</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer"
                >
                  {isTr ? 'Pencereyi Kapat' : 'Close Window'}
                </button>
              </div>
            </div>
          ) : submitStatus === 'error' ? (
            <div className="py-8 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">
                {isTr ? 'Ağ Kesintisi Nedeniyle Otomatik İletilemedi' : 'Network Interruption During Dispatch'}
              </h4>
              <p className="text-sm text-amber-200 max-w-md">
                {isTr 
                  ? 'Kriz bilgileriniz hazırlandı. Aşağıdaki butona basarak doğrudan WhatsApp üzerinden kriz masamıza anında iletebilirsiniz:' 
                  : 'Your crisis scope is ready. Dispatch directly via WhatsApp below:'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => window.trackEvent && window.trackEvent('whatsapp_clicked', { source: 'sos_error_fallback' })}
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-bg-dark font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 animate-pulse"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isTr ? 'WhatsApp ile Anında Gönder (Tek Tıkla)' : 'Send via WhatsApp (One-Click)'}</span>
                </a>
                <a
                  href="tel:+905343713573"
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-cyan-400" />
                  <span>+90 534 371 35 73</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Honeypot */}
              <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                    {isTr ? 'Ajans / Şirket Adı' : 'Agency / Company Name'}
                  </label>
                  <input
                    type="text"
                    name="agencyName"
                    required
                    placeholder={isTr ? 'Örn: Acme Creative' : 'e.g. Acme Creative'}
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm sm:text-base focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                    {isTr ? 'Yetkili / İletişim Kişisi' : 'Contact Person'}
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    required
                    placeholder={isTr ? 'Adınız & Soyadınız' : 'Your Full Name'}
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm sm:text-base focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                  {isTr ? 'Telefon / WhatsApp Numarası' : 'Phone / WhatsApp Number'} <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  required
                  placeholder="+90 534 000 0000"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm sm:text-base focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                  {isTr ? 'Aciliyet Düzeyi' : 'Urgency Level'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'critical', label: isTr ? '🔴 Kritik (0-2 Saat)' : '🔴 Critical (0-2h)', sub: isTr ? 'Canlı kesinti / Lansman günü' : 'Live outage / Launch day' },
                    { id: 'high', label: isTr ? '🟠 Yüksek (Bugün)' : '🟠 High (Today)', sub: isTr ? 'T-48h Teslim / Devir' : 'T-48h Crunch / Handover' },
                    { id: 'medium', label: isTr ? '🟡 Planlı Destek' : '🟡 Planned Surge', sub: isTr ? 'Kapasite artışı' : 'Team capacity surge' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setUrgency(item.id)}
                      className={`p-3 rounded-xl text-left border text-xs sm:text-sm transition-all flex flex-col justify-between cursor-pointer ${
                        urgency === item.id
                          ? 'border-red-500 bg-red-500/20 text-white font-bold shadow-md shadow-red-500/20'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/25'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-[11px] text-slate-400 mt-1">{item.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                  {isTr ? 'Kriz Durumu / Hata Özeti' : 'Crisis Summary / Error Details'}
                </label>
                <textarea
                  rows={3}
                  name="problemDesc"
                  required
                  placeholder={isTr ? 'Hatanın türü, kilitlenen teknoloji veya teslimat darboğazı hakkında kısaca bilgi verin...' : 'Briefly describe the error, bottleneck, or missing delivery component...'}
                  value={problemDesc}
                  onChange={(e) => setProblemDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm sm:text-base focus:border-red-500 focus:outline-none transition-colors resize-none leading-relaxed"
                ></textarea>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/10 gap-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> %100 White-Label & NDA
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" /> {isTr ? 'İlk Yanıt: ~15 Dakika' : 'First Response: ~15 Mins'}
                </span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black text-sm sm:text-base shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px] disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? (isTr ? 'Kaydediliyor...' : 'Saving...') : (isTr ? 'Kriz Masasına Anında Bildir (WhatsApp)' : 'Dispatch Crisis Desk (WhatsApp)')}</span>
                </button>
                <a
                  href="tel:+905343713573"
                  className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm sm:text-base border border-white/10 flex items-center justify-center gap-2 transition-colors min-h-[48px]"
                  title="Doğrudan Telefonla Ara"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>{isTr ? 'Ara' : 'Call'}</span>
                </a>
              </div>
            </form>
          )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EmergencySOSModal;
