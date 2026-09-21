import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, PhoneCall, Mail, MapPin, ShieldCheck, Send, CheckCircle2, AlertTriangle, RefreshCw, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCalendlyUrl } from '../utils/calendly';
import { isTurkish } from '../i18n';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const [formData, setFormData] = useState({ 
    name: '', 
    agency: '', 
    email: '', 
    phone: '', 
    message: '',
    kvkkConsent: true,
    botcheck: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [contactChannelError, setContactChannelError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.botcheck) {
      console.warn('Bot detected via honeypot.');
      return;
    }

    if (!formData.email?.trim() && !formData.phone?.trim()) {
      setContactChannelError(true);
      return;
    }
    setContactChannelError(false);

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '64ef0cf5-703c-4cfd-92a4-4f0ba65bb2bb',
          from_name: 'TMA Lead Desk',
          subject: `🚨 Yeni TMA İletişim / Ajans Talebi - ${formData.name} (${formData.agency || 'Bireysel'})`,
          name: formData.name,
          agency: formData.agency || 'Belirtilmedi',
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSubmitStatus('success');
        if (window.trackEvent) {
          window.trackEvent('contact_form_submitted', { form_type: 'b2b_inquiry', has_agency: Boolean(formData.agency) });
        }
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Lead capture error:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenWhatsApp = () => {
    if (window.trackEvent) {
      window.trackEvent('whatsapp_clicked', { source: 'contact_form' });
    }
    const waNumber = '905343713573';
    const waText = isTr 
      ? `🚨 *TMA B2B TEKNİK TALEP / İLETİŞİM FORMU* 🚨\n\n` +
        `👤 *Yetkili / Ad Soyad:* ${formData.name}\n` +
        `🏢 *Ajans / Şirket:* ${formData.agency || 'Belirtilmedi'}\n` +
        `📧 *E-Posta:* ${formData.email}\n` +
        `📞 *Telefon / WhatsApp:* ${formData.phone}\n` +
        `📝 *Proje / Kriz Özeti:* ${formData.message}\n\n` +
        `_Web sitesi iletişim formu üzerinden iletildi._`
      : `🚨 *TMA B2B TECHNICAL INQUIRY / CONTACT FORM* 🚨\n\n` +
        `👤 *Name:* ${formData.name}\n` +
        `🏢 *Agency / Company:* ${formData.agency || 'Not specified'}\n` +
        `📧 *Email:* ${formData.email}\n` +
        `📞 *Phone / WhatsApp:* ${formData.phone}\n` +
        `📝 *Project / Crisis Scope:* ${formData.message}\n\n` +
        `_Sent via website contact form._`;
    
    const encodedText = encodeURIComponent(waText);
    const waUrl = `https://wa.me/${waNumber}?text=${encodedText}`;
    window.open(waUrl, '_blank');
  };

  const handleReset = () => {
    setFormData({ name: '', agency: '', email: '', phone: '', message: '', kvkkConsent: true, botcheck: '' });
    setContactChannelError(false);
    setSubmitStatus(null);
  };

  return (
    <section id="contact" className="py-[136px] px-4 sm:px-6 md:px-12 relative overflow-hidden bg-[var(--paper)] border-t border-[var(--rule)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Direct Channels & Trust */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h4 className="text-xs sm:text-sm font-mono font-medium text-[var(--ink-3)] uppercase tracking-wider mb-3">
              {t('contact-subtitle')}
            </h4>
            <h2 className="font-serif text-[32px] sm:text-[40px] md:text-[44px] font-semibold text-[var(--ink)] tracking-tight leading-tight mb-6">
              {t('contact-title')}
            </h2>
            <p className="text-[var(--ink-2)] text-base sm:text-lg leading-relaxed">
              {t('contact-desc')}
            </p>
          </div>
          
          <div className="space-y-4">
            
            {/* Direct WhatsApp Box */}
            <a 
              href="https://wa.me/905343713573?text=Merhaba%2C%20TMA%20ile%20proje%20ve%20teknik%20destek%20hakk%C4%B1nda%20g%C3%B6r%C3%BC%C5%9Fmek%20istiyoruz." 
              target="_blank" 
              rel="noreferrer" 
              onClick={() => window.trackEvent && window.trackEvent('whatsapp_clicked', { source: 'contact_box' })}
              className="flex items-center gap-4 p-5 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--rule-strong)] transition-all group shadow-sm"
            >
              <div className="w-12 h-12 rounded-[var(--r-control)] bg-[var(--paper)] text-[var(--accent)] border border-[var(--rule)] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[var(--ink)] font-semibold text-base">
                  {isTr ? 'WhatsApp Kriz & Destek Masası' : 'WhatsApp Crisis & Support Desk'}
                </div>
                <div className="text-[var(--accent)] text-sm font-mono font-semibold">+90 534 371 35 73</div>
              </div>
            </a>
            
            {/* Direct Call Box */}
            <a 
              href="tel:+905343713573" 
              className="flex items-center gap-4 p-5 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--rule-strong)] transition-all group shadow-sm"
            >
              <div className="w-12 h-12 rounded-[var(--r-control)] bg-[var(--paper)] text-[var(--ink)] border border-[var(--rule)] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[var(--ink)] font-semibold text-base">
                  {isTr ? 'Kriz Hattı · her gün 09:00 – 24:00' : 'Response Desk · daily 09:00 – 24:00'}
                </div>
                <div className="text-[var(--ink)] text-sm font-mono font-semibold">+90 534 371 35 73</div>
                <div className="text-xs text-[var(--ink-3)] font-mono mt-0.5">
                  {isTr ? 'acil bildirimlere tipik ilk yanıt: 15 dakika' : 'typical first reply to emergencies: 15 minutes'}
                </div>
              </div>
            </a>

            {/* Email Box */}
            <a 
              href="mailto:info@trendmasterakademi.com" 
              className="flex items-center gap-4 p-5 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--rule-strong)] transition-all group shadow-sm"
            >
              <div className="w-12 h-12 rounded-[var(--r-control)] bg-[var(--paper)] text-[var(--ink)] border border-[var(--rule)] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[var(--ink)] font-semibold text-base">{t('contact-direct-email')}</div>
                <div className="text-[var(--ink-2)] text-sm font-mono">info@trendmasterakademi.com</div>
              </div>
            </a>

            {/* 30-Minute Meeting Box */}
            <a 
              href={getCalendlyUrl('contact_card')} 
              target="_blank" 
              rel="noreferrer"
              onClick={() => window.trackEvent && window.trackEvent('calendar_clicked', { source: 'contact_card' })}
              className="flex items-center gap-4 p-5 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--accent)] hover:border-[var(--accent-hover)] transition-all group shadow-sm"
            >
              <div className="w-12 h-12 rounded-[var(--r-control)] bg-[var(--paper)] text-[var(--accent)] border border-[var(--rule)] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[var(--ink)] font-semibold text-base">
                  {isTr ? '30 Dakikalık Tanışma Randevusu' : '30-Minute Intro Meeting'}
                </div>
                <div className="text-[var(--accent)] text-xs sm:text-sm font-mono font-medium">
                  {isTr ? 'Takvimden uygun saati seçin' : 'Pick a time on our calendar'}
                </div>
              </div>
            </a>

            {/* Address Box */}
            <div className="flex items-center gap-4 p-5 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink-2)]">
              <div className="w-12 h-12 rounded-[var(--r-control)] bg-[var(--paper)] text-[var(--ink-3)] border border-[var(--rule)] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[var(--ink)] font-semibold text-base">{t('contact-direct-address')}</div>
                <div className="text-[var(--ink-3)] text-xs sm:text-sm">{t('contact-address-text')}</div>
              </div>
            </div>

          </div>

          <div className="p-4 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink-2)] text-xs sm:text-sm flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 flex-shrink-0 text-[var(--accent)]" />
            <span>
              {isTr ? (
                <>Tüm başvurular ve görüşmeler <Link to="/nda/" className="text-[var(--accent)] underline hover:text-[var(--accent-hover)] transition-colors">gizlilik sözleşmesi (NDA)</Link> kapsamındadır.</>
              ) : (
                <>All inquiries and consultations are protected under <Link to="/nda/" className="text-[var(--accent)] underline hover:text-[var(--accent-hover)] transition-colors">mutual non-disclosure agreement (NDA)</Link>.</>
              )}
            </span>
          </div>
        </div>
        
        {/* Right Column: Contact Form with Backend Lead Capture */}
        <div className="lg:col-span-7 p-7 sm:p-10 rounded-[var(--r-panel)] border border-[var(--rule)] bg-[var(--surface)] shadow-sm">
          {submitStatus === 'success' ? (
            <div className="flex flex-col items-center justify-center text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-[var(--paper)] border border-[var(--rule)] flex items-center justify-center text-[var(--sev-4)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-[var(--ink)] font-serif">
                  {isTr ? 'Talebiniz Başarıyla Kaydedildi!' : 'Inquiry Successfully Saved!'}
                </h3>
                <p className="text-[var(--ink-2)] text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                  {isTr 
                    ? 'Talebiniz kriz masası gelen kutumuza güvenle ulaştı. Dilerseniz hemen WhatsApp üzerinden doğrudan iletişime geçebilirsiniz.' 
                    : 'Your inquiry has reached our engineering triage desk. You can also forward it directly on WhatsApp.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="btn-primary px-6 py-3 rounded-[var(--r-control)] font-medium text-sm flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isTr ? 'WhatsApp’tan Şimdi İlet →' : 'Forward to WhatsApp Now →'}</span>
                </button>

                <a
                  href="tel:+905343713573"
                  className="btn-secondary px-6 py-3 rounded-[var(--r-control)] font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-[var(--accent)]" />
                  <span>+90 534 371 35 73</span>
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-link px-5 py-2.5 rounded-[var(--r-control)] text-xs font-semibold cursor-pointer w-full"
                >
                  {isTr ? '← Yeni Form Doldur' : '← Submit Another Inquiry'}
                </button>
              </div>
            </div>
          ) : submitStatus === 'error' ? (
            <div className="flex flex-col items-center justify-center text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-[var(--paper)] border border-[var(--rule)] flex items-center justify-center text-[var(--sev-1)]">
                <AlertTriangle className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-[var(--ink)] font-serif">
                  {isTr ? 'Sunucu Bağlantısı Kurulamadı' : 'Server Connection Interrupted'}
                </h3>
                <p className="text-[var(--ink-2)] text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                  {isTr 
                    ? 'Ağ kesintisi nedeniyle otomatik kayıt iletilemedi. Ancak bilgileriniz hazır; aşağıdaki butona tıklayarak tek tıkla WhatsApp kriz masasına iletebilirsiniz:' 
                    : 'Network timeout prevented automated form storage. Your brief is preserved below — dispatch directly via WhatsApp:'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="btn-primary px-7 py-3.5 rounded-[var(--r-control)] font-medium text-sm sm:text-base flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>{isTr ? 'WhatsApp ile Anında Gönder (Tek Tıkla)' : 'Send via WhatsApp (One-Click)'}</span>
                </button>

                <a
                  href="tel:+905343713573"
                  className="btn-secondary px-6 py-3.5 rounded-[var(--r-control)] font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-[var(--accent)]" />
                  <span>+90 534 371 35 73</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSubmitStatus(null)}
                  className="btn-link px-5 py-2.5 rounded-[var(--r-control)] text-xs font-semibold cursor-pointer w-full flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isTr ? 'Tekrar Dene' : 'Try Again'}</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Honeypot anti-spam */}
              <input 
                type="checkbox" 
                name="botcheck" 
                className="hidden" 
                style={{ display: 'none' }} 
                tabIndex={-1} 
                autoComplete="off"
                onChange={e => setFormData({...formData, botcheck: e.target.checked ? 'bot' : ''})}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="iletisim-ad" className="block text-sm font-medium text-[var(--ink)] mb-2">
                    {t('contact-label-name')} <span className="text-[var(--accent)]">*</span>
                  </label>
                  <input 
                    id="iletisim-ad"
                    required 
                    type="text" 
                    name="name"
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-[var(--r-control)] px-4 py-3 text-[var(--ink)] text-sm sm:text-base focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--ink-3)]" 
                    placeholder={isTr ? "Adınız Soyadınız" : "Your Full Name"} 
                  />
                </div>
                <div>
                  <label htmlFor="iletisim-ajans" className="block text-sm font-medium text-[var(--ink)] mb-2">
                    {t('contact-label-agency')}
                  </label>
                  <input 
                    id="iletisim-ajans"
                    type="text" 
                    name="agency"
                    value={formData.agency} 
                    onChange={e => setFormData({...formData, agency: e.target.value})} 
                    className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-[var(--r-control)] px-4 py-3 text-[var(--ink)] text-sm sm:text-base focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--ink-3)]" 
                    placeholder={isTr ? "Örn: Kurum / Şirket Adı" : "E.g. Company / Organization"} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="iletisim-eposta" className="block text-sm font-medium text-[var(--ink)] mb-2">
                    {t('contact-label-email')}
                  </label>
                  <input 
                    id="iletisim-eposta"
                    type="email" 
                    name="email"
                    value={formData.email} 
                    onChange={e => {
                      setFormData({...formData, email: e.target.value});
                      if (contactChannelError) setContactChannelError(false);
                    }} 
                    className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-[var(--r-control)] px-4 py-3 text-[var(--ink)] text-sm sm:text-base focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--ink-3)]" 
                    placeholder={isTr ? "ornek@sirket.com" : "name@company.com"} 
                  />
                </div>
                <div>
                  <label htmlFor="iletisim-telefon" className="block text-sm font-medium text-[var(--ink)] mb-2">
                    {t('contact-label-phone')}
                  </label>
                  <input 
                    id="iletisim-telefon"
                    type="tel" 
                    name="phone"
                    value={formData.phone} 
                    onChange={e => {
                      setFormData({...formData, phone: e.target.value});
                      if (contactChannelError) setContactChannelError(false);
                    }} 
                    className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-[var(--r-control)] px-4 py-3 text-[var(--ink)] text-sm sm:text-base focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--ink-3)]" 
                    placeholder={isTr ? "+90 534 000 0000" : "+1 (555) 000-0000"} 
                  />
                </div>
              </div>

              {/* Helper text & Contact Channel Validation Alert */}
              <div className="-mt-2 space-y-1.5">
                <p className="text-xs text-[var(--ink-3)] font-mono">
                  {isTr ? 'İkisinden biri yeterli.' : 'Either one is enough.'}
                </p>
                {contactChannelError && (
                  <p className="text-xs text-[var(--accent)] font-medium flex items-center gap-1.5" role="alert">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{isTr ? 'Size dönebilmemiz için e-posta ya da telefon girin.' : 'Enter an email or a phone number so we can reply.'}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="iletisim-mesaj" className="block text-sm font-medium text-[var(--ink)] mb-2">
                  {t('contact-label-message')} <span className="text-[var(--accent)]">*</span>
                </label>
                <textarea 
                  id="iletisim-mesaj"
                  required 
                  rows="4" 
                  name="message"
                  value={formData.message} 
                  onChange={e => setFormData({...formData, message: e.target.value})} 
                  className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-[var(--r-control)] px-4 py-3 text-[var(--ink)] text-sm sm:text-base focus:outline-none focus:border-[var(--accent)] transition-colors resize-none leading-relaxed placeholder:text-[var(--ink-3)]" 
                  placeholder={t('contact-placeholder-msg')}
                ></textarea>
              </div>

              {/* KVKK Consent Checkbox */}
              <div className="flex items-start gap-3 pt-1">
                <input 
                  type="checkbox" 
                  id="kvkk"
                  name="kvkk"
                  required
                  checked={formData.kvkkConsent}
                  onChange={e => setFormData({...formData, kvkkConsent: e.target.checked})}
                  className="mt-1 w-4 h-4 rounded bg-[var(--paper)] border-[var(--rule)] text-[var(--accent)] focus:ring-0 cursor-pointer accent-[var(--accent)]"
                />
                <label htmlFor="kvkk" className="text-xs text-[var(--ink-3)] leading-relaxed cursor-pointer">
                  {isTr 
                    ? <>İletişim bilgilerimin kriz masası değerlendirmesi ve geri dönüş amacıyla işlenmesini onaylıyorum (<Link to="/privacy/" className="text-[var(--accent)] underline hover:text-[var(--accent-hover)]">KVKK ve Gizlilik Politikası</Link> uyarınca bilgileriniz 3. taraflarla paylaşılmaz).</>
                    : <>I consent to the processing of my contact details for triage and response under <Link to="/privacy/" className="text-[var(--accent)] underline hover:text-[var(--accent-hover)]">Privacy Policy</Link> standards.</>}
                </label>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary w-full py-3.5 px-6 rounded-[var(--r-control)] flex items-center justify-center gap-2.5 transition-all text-base cursor-pointer mt-2 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                <span>{isSubmitting ? (isTr ? 'Kaydediliyor...' : 'Submitting...') : t('contact-btn-submit')}</span>
              </button>
            </form>
          )}
        </div>
        
      </div>
    </section>
  );
};

export default Contact;
