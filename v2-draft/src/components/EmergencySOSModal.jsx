import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, X, PhoneCall, ShieldCheck, Clock, Send, CheckCircle2, MessageSquare, RefreshCw } from 'lucide-react';
import { useKrizHattiAcik } from '../utils/krizHatti';
import { isTurkish } from '../i18n';

const EmergencySOSModal = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const krizHattiAcik = useKrizHattiAcik();

  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement;

    if (modalRef.current) {
      modalRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (onCloseRef.current) {
          onCloseRef.current();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        try {
          if (document.body && document.body.contains(previousActiveElement.current)) {
            previousActiveElement.current.focus();
          }
        } catch (err) {}
      }
    };
  }, [isOpen]);

  const [agencyName, setAgencyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [urgency, setUrgency] = useState('critical');
  const [budget, setBudget] = useState('');
  const [problemDesc, setProblemDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const getUrgencyLabel = () => {
    return urgency === 'critical' 
      ? (isTr ? '🔴 CANLI KESİNTİ (şu an yaşanıyor)' : '🔴 LIVE OUTAGE (happening now)')
      : urgency === 'high'
      ? (isTr ? '🟠 TESLİM / DEVİR BASKISI (bugün çözülmeli)' : '🟠 DELIVERY / HANDOVER CRUNCH (must be resolved today)')
      : (isTr ? '🟡 PLANLI DESTEK (kapasite artışı)' : '🟡 PLANNED SUPPORT (capacity surge)');
  };

  const getWhatsAppUrl = () => {
    const phone = "905343713573";
    const text = encodeURIComponent(
      `🚨 *TMA ACİL TEKNİK KRİZ BİLDİRİMİ (SOS)* 🚨\n\n` +
      `🏢 *${isTr ? 'Ajans / Şirket:' : 'Agency / Company:'}* ${agencyName || (isTr ? 'Belirtilmedi' : 'Not specified')}\n` +
      `👤 *${isTr ? 'Yetkili:' : 'Contact Person:'}* ${contactPerson || (isTr ? 'Belirtilmedi' : 'Not specified')}\n` +
      `📞 *${isTr ? 'Telefon / WhatsApp:' : 'Phone / WhatsApp:'}* ${contactPhone}\n` +
      `⚡ *${isTr ? 'Aciliyet Düzeyi:' : 'Urgency Level:'}* ${getUrgencyLabel()}\n` +
      (budget ? `💰 *${isTr ? 'Bütçe Aralığı:' : 'Budget Range:'}* ${budget}\n` : '') +
      `📝 *${isTr ? 'Kriz Özeti:' : 'Crisis Scope:'}* ${problemDesc}\n\n` +
      `_TMA Response Desk üzerinden gönderildi._`
    );
    return `https://wa.me/905343713573?text=${text}`;
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
          budget: budget || 'Belirtilmedi',
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
    <React.Fragment>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 overflow-y-auto">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sos-modal-basligi"
          tabIndex={-1}
          className="w-full max-w-xl max-h-[92dvh] flex flex-col bg-[var(--surface)] border border-[var(--rule)] rounded-2xl shadow-2xl relative text-[var(--ink)] my-auto overflow-hidden outline-none"
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--accent)] z-30"></div>

          {/* Sticky Header */}
          <div className="sticky top-0 bg-[var(--surface)] border-b border-[var(--rule)] px-5 py-4 sm:px-7 sm:py-5 flex items-center justify-between z-20 shrink-0">
            <div className="flex items-center gap-3 pr-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[var(--accent-wash)] border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent)]"></span>
                  <span className="text-xs font-mono font-semibold tracking-widest text-[var(--accent)] uppercase">
                    TMA Response Desk // {isTr ? 'Kriz Masası' : 'Crisis Desk'}
                  </span>
                </div>
                <h3 id="sos-modal-basligi" className="text-base sm:text-lg font-serif font-semibold text-[var(--ink)] leading-tight">
                  {isTr ? 'Acil Teknik Müdahale & İmdat Butonu' : 'Emergency Technical Intervention & SOS'}
                </h3>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-[var(--paper)] hover:bg-[var(--rule)] text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors cursor-pointer shrink-0"
              aria-label={isTr ? 'Kapat' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Modal Body */}
          <div className="overflow-y-auto p-5 sm:p-7 space-y-4 flex-1">
            <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed mb-3">
              {isTr 
                ? 'Teslim tarihi sıkışan, geliştiricisi ayrılan veya canlıda kilitlenen projeler için doğrudan kıdemli mühendislik masamız devreye girer.' 
                : 'Direct senior engineering dispatch for locked codebases, abandoned repos, or mission-critical launch deadlines.'}
            </p>

            {/* Durum Şeridi */}
            <div className={`p-2.5 sm:p-3 rounded-lg border text-xs leading-relaxed flex items-center gap-2 mb-2 ${
              krizHattiAcik 
                ? 'bg-[var(--surface)] border-[var(--rule)] text-[var(--sev-ok)]' 
                : 'bg-[var(--surface)] border-[var(--rule)] text-[var(--sev-high)]'
            }`}>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                krizHattiAcik ? 'bg-[var(--sev-ok)]' : 'bg-[var(--sev-high)]'
              }`}></span>
              <span>
                {krizHattiAcik
                  ? (isTr 
                      ? 'Kriz hattı şu an açık · her gün 09:00 – 24:00 · canlı kesintilerde ilk yanıt taahhüdü 15 dakika'
                      : 'Response desk is open now · daily 09:00 – 24:00 · first-response commitment for live outages: 15 minutes')
                  : (isTr 
                      ? "Kriz hattı şu an kapalı. Bildiriminiz ertesi sabah 09:00'da ele alınır — formu yine de doldurabilirsiniz."
                      : 'The response desk is closed right now. Your notification is picked up at 09:00 the following morning — you can still submit the form.')
                }
              </span>
            </div>

          {submitStatus === 'success' ? (
            <div className="py-8 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--surface)] border border-[var(--rule)] flex items-center justify-center text-[var(--sev-ok)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-serif font-semibold text-[var(--ink)]">
                {isTr ? 'Kriz Bildirimi Kaydedildi & İletildi!' : 'Crisis Ticket Saved & Dispatched!'}
              </h4>
              <p className="text-sm text-[var(--ink-secondary)] max-w-md">
                {isTr ? 'Bildiriminiz kriz masamıza kaydedildi ve WhatsApp üzerinden kıdemli mühendislik masamıza aktarıldı.' : 'Your ticket is logged and forwarded directly to our senior engineering desk.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => window.trackEvent && window.trackEvent('whatsapp_clicked', { source: 'sos_success_screen' })}
                  className="px-6 py-3 rounded-lg bg-[#25D366] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm min-h-[44px]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isTr ? 'WhatsApp Mesajını Aç' : 'Open WhatsApp'}</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-lg bg-[var(--paper)] hover:bg-[var(--rule)] text-[var(--ink)] text-xs font-semibold cursor-pointer border border-[var(--rule)] min-h-[44px]"
                >
                  {isTr ? 'Pencereyi Kapat' : 'Close Window'}
                </button>
              </div>
            </div>
          ) : submitStatus === 'error' ? (
            <div className="py-8 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--surface)] border border-[var(--rule)] flex items-center justify-center text-[var(--sev-high)]">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-serif font-semibold text-[var(--ink)]">
                {isTr ? 'Ağ Kesintisi Nedeniyle Otomatik İletilemedi' : 'Network Interruption During Dispatch'}
              </h4>
              <p className="text-sm text-[var(--ink)] max-w-md">
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
                  className="px-7 py-3.5 rounded-lg bg-[#25D366] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm min-h-[44px]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isTr ? 'WhatsApp ile Anında Gönder (Tek Tıkla)' : 'Send via WhatsApp (One-Click)'}</span>
                </a>
                <a
                  href="tel:+905343713573"
                  className="px-5 py-3.5 rounded-lg bg-[var(--paper)] hover:bg-[var(--rule)] text-[var(--ink)] font-semibold text-xs sm:text-sm flex items-center gap-2 border border-[var(--rule)] min-h-[44px]"
                >
                  <PhoneCall className="w-4 h-4 text-[var(--accent)]" />
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
                  <label htmlFor="sos-ajans" className="block text-xs sm:text-sm font-semibold text-[var(--ink)] mb-1.5">
                    {isTr ? 'Ajans / Şirket Adı' : 'Agency / Company Name'}
                  </label>
                  <input
                    id="sos-ajans"
                    type="text"
                    name="agencyName"
                    required
                    placeholder={isTr ? 'Örn: Acme Creative' : 'e.g. Acme Creative'}
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] text-sm focus:border-[var(--accent)] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="sos-yetkili" className="block text-xs sm:text-sm font-semibold text-[var(--ink)] mb-1.5">
                    {isTr ? 'Yetkili / İletişim Kişisi' : 'Contact Person'}
                  </label>
                  <input
                    id="sos-yetkili"
                    type="text"
                    name="contactPerson"
                    required
                    placeholder={isTr ? 'Adınız & Soyadınız' : 'Your Full Name'}
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] text-sm focus:border-[var(--accent)] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="sos-telefon" className="block text-xs sm:text-sm font-semibold text-[var(--ink)] mb-1.5">
                  {isTr ? 'Telefon / WhatsApp Numarası' : 'Phone / WhatsApp Number'} <span className="text-[var(--accent)]">*</span>
                </label>
                <input
                  id="sos-telefon"
                  type="tel"
                  name="contactPhone"
                  required
                  placeholder="+90 534 000 0000"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] text-sm focus:border-[var(--accent)] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[var(--ink)] mb-1.5">
                  {isTr ? 'Aciliyet Düzeyi' : 'Urgency Level'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { 
                      id: 'critical', 
                      label: isTr ? 'Canlı kesinti' : 'Live outage', 
                      sub: isTr ? 'Şu an yaşanıyor · site veya ödeme durdu' : 'Happening now · site or payments down' 
                    },
                    { 
                      id: 'high', 
                      label: isTr ? 'Teslim / devir baskısı' : 'Delivery / handover crunch', 
                      sub: isTr ? 'Bugün çözülmesi gerekiyor' : 'Must be resolved today' 
                    },
                    { 
                      id: 'medium', 
                      label: isTr ? 'Planlı destek' : 'Planned support', 
                      sub: isTr ? 'Kapasite artışı' : 'Team capacity surge' 
                    }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setUrgency(item.id)}
                      className={`p-3 rounded-lg text-left border text-xs sm:text-sm transition-all flex flex-col justify-between cursor-pointer min-h-[44px] ${
                        urgency === item.id
                          ? 'border-[var(--accent)] bg-[var(--accent-wash)] text-[var(--accent-ink)] font-semibold'
                          : 'border-[var(--rule)] bg-[var(--surface)] text-[var(--ink-secondary)] hover:border-[var(--rule-strong)]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-xs text-[var(--ink-muted)] mt-1">{item.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="sos-butce" className="block text-xs sm:text-sm font-semibold text-[var(--ink)] mb-1.5">
                  {isTr ? 'Bütçe aralığınız (opsiyonel)' : 'Budget range (optional)'}
                </label>
                <input
                  id="sos-butce"
                  type="text"
                  name="budget"
                  placeholder={isTr ? 'Örn. 40.000 – 60.000 ₺ / henüz netleşmedi' : 'e.g. 40,000 – 60,000 ₺ / not finalized yet'}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] text-sm focus:border-[var(--accent)] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="sos-sorun" className="block text-xs sm:text-sm font-semibold text-[var(--ink)] mb-1.5">
                  {isTr ? 'Kriz Durumu / Hata Özeti' : 'Crisis Summary / Error Details'}
                </label>
                <textarea
                  id="sos-sorun"
                  rows={3}
                  name="problemDesc"
                  required
                  placeholder={isTr ? 'Hatanın türü, kilitlenen teknoloji veya teslimat darboğazı hakkında kısaca bilgi verin...' : 'Briefly describe the error, bottleneck, or missing delivery component...'}
                  value={problemDesc}
                  onChange={(e) => setProblemDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] text-sm focus:border-[var(--accent)] focus:outline-none transition-colors resize-none leading-relaxed"
                ></textarea>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-between text-xs text-[var(--ink-muted)] pt-2 border-t border-[var(--rule)] gap-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[var(--sev-ok)] shrink-0" /> %100 White-Label & <a href="/nda/" target="_blank" rel="noopener" className="underline hover:text-[var(--ink)] transition-colors min-h-[44px] min-w-[44px] inline-flex items-center justify-center -my-2.5">NDA</a>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[var(--accent)]" /> {isTr ? 'İlk Yanıt: ~15 Dakika' : 'First Response: ~15 Mins'}
                </span>
              </div>

              {/* Süreklilik Satırı */}
              <p className="text-xs text-[var(--ink-muted)] text-center">
                {isTr 
                  ? 'Kriz masası tek kişilik değildir; başlayan iş yarıda kalmaz.' 
                  : 'The response desk is not a single person; work under way is not left unfinished.'}
              </p>

              {/* Sticky Bottom Action Bar */}
              <div className="sticky bottom-0 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 bg-[var(--surface)] border-t border-[var(--rule)] p-3 sm:p-4 z-10 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full min-h-[44px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm font-semibold whitespace-normal text-center"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>{isSubmitting ? (isTr ? 'Kaydediliyor...' : 'Saving...') : (isTr ? 'Kriz Masasına Anında Bildir' : 'Dispatch Crisis Desk')}</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => window.trackEvent && window.trackEvent('whatsapp_clicked', { source: 'sos_bottom_bar' })}
                    className="btn-secondary min-h-[44px] flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold"
                    title="WhatsApp ile İletişim"
                  >
                    <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href="tel:+905343713573"
                    className="btn-secondary min-h-[44px] flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold"
                    title="Doğrudan Telefonla Ara"
                  >
                    <PhoneCall className="w-4 h-4 text-[var(--sev-ok)] shrink-0" />
                    <span>{isTr ? 'Ara' : 'Call'}</span>
                  </a>
                </div>
              </div>
            </form>
          )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default EmergencySOSModal;

