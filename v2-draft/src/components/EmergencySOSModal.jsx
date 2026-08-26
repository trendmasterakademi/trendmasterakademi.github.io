import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, X, PhoneCall, ShieldCheck, Clock, Send } from 'lucide-react';

const EmergencySOSModal = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';

  const [agencyName, setAgencyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [urgency, setUrgency] = useState('critical');
  const [problemDesc, setProblemDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const phone = "905343713573";
    const urgencyLabel = urgency === 'critical' 
      ? (isTr ? '🔴 KRİTİK (0-2 Saat Müdahale Gerekli)' : '🔴 CRITICAL (0-2h Immediate Intervention)')
      : urgency === 'high'
      ? (isTr ? '🟠 YÜKSEK (Bugün Çözülmeli / T-48H)' : '🟠 HIGH (Must Be Resolved Today / T-48H)')
      : (isTr ? '🟡 PLANLI DESTEK (Kapasite Artışı)' : '🟡 PLANNED SUPPORT (Capacity Surge)');

    const text = encodeURIComponent(
      `🚨 *TMA ACİL TEKNİK KRİZ BİLDİRİMİ (SOS)* 🚨\n\n` +
      `🏢 *${isTr ? 'Ajans / Şirket:' : 'Agency / Company:'}* ${agencyName || (isTr ? 'Belirtilmedi' : 'Not specified')}\n` +
      `👤 *${isTr ? 'Yetkili:' : 'Contact Person:'}* ${contactPerson || (isTr ? 'Belirtilmedi' : 'Not specified')}\n` +
      `⚡ *${isTr ? 'Aciliyet Düzeyi:' : 'Urgency Level:'}* ${urgencyLabel}\n` +
      `📝 *${isTr ? 'Kriz Özeti:' : 'Crisis Scope:'}* ${problemDesc}\n\n` +
      `_TMA Response Desk üzerinden gönderildi._`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-xl bg-[#0d121d] border border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(239,68,68,0.25)] relative overflow-hidden text-slate-100 my-8"
        >
          {/* Top glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 animate-pulse"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 flex-shrink-0">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
                  TMA Response Desk // 7-24 {isTr ? 'Kriz Masası' : 'Crisis Desk'}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {isTr ? 'Acil Teknik Müdahale & İmdat Butonu' : 'Emergency Technical Intervention & SOS'}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
            {isTr 
              ? 'Teslim tarihi sıkışan, geliştiricisi ayrılan veya canlıda kilitlenen projeler için doğrudan kıdemli mühendislik ekibimiz devreye girer.' 
              : 'Direct senior engineering dispatch for locked codebases, abandoned repos, or mission-critical launch deadlines.'}
          </p>

          {submitted ? (
            <div className="py-8 text-center flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">
                {isTr ? 'Kriz Masasına Aktarılıyorsunuz...' : 'Connecting to Crisis Desk...'}
              </h4>
              <p className="text-sm text-slate-400">
                {isTr ? 'WhatsApp üzerinden doğrudan Developer Mehmet Şahin ile anında canlı bağlantı kuruluyor.' : 'Connecting you directly with Developer Mehmet Sahin via WhatsApp.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                    {isTr ? 'Ajans / Şirket Adı' : 'Agency / Company Name'}
                  </label>
                  <input
                    type="text"
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
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black text-sm sm:text-base shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px]"
                >
                  <Send className="w-4 h-4" />
                  <span>{isTr ? 'Kriz Masasına Anında Bildir (WhatsApp)' : 'Dispatch Crisis Desk (WhatsApp)'}</span>
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EmergencySOSModal;
