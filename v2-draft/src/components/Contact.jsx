import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, PhoneCall, Mail, MapPin, ShieldCheck, Send, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const isTr = i18n.language !== 'en';
  const [formData, setFormData] = useState({ 
    name: '', 
    agency: '', 
    email: '', 
    phone: '', 
    message: '',
    kvkkConsent: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('https://api.web3forms.com/submit', {
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
      }).catch(err => console.log('Lead sync noted:', err));
    } catch (err) {
      console.log('Lead capture error:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleOpenWhatsApp = () => {
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
    setFormData({ name: '', agency: '', email: '', phone: '', message: '', kvkkConsent: true });
    setIsSubmitted(false);
  };

  return (
    <section id="contact" className="py-24 md:py-32 px-4 sm:px-6 md:px-12 relative overflow-hidden bg-[#080b11] border-t border-white/10">
      <div className="absolute top-1/2 left-0 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 -translate-x-1/2 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Direct Channels & Trust */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h4 className="text-cyan-400 font-mono font-bold tracking-widest uppercase text-xs sm:text-sm mb-3">
              {t('contact-subtitle')}
            </h4>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-white mb-6">
              {t('contact-title')}
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              {t('contact-desc')}
            </p>
          </div>
          
          <div className="space-y-4">
            
            {/* Direct WhatsApp Box */}
            <a 
              href="https://wa.me/905343713573?text=Merhaba%20Mehmet%20Bey%2C%20TMA%20ile%20proje%20ve%20teknik%20destek%20hakk%C4%B1nda%20g%C3%B6r%C3%BC%C5%9Fmek%20istiyoruz." 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-emerald-500/30 hover:border-emerald-500/60 hover:bg-white/[0.08] transition-all group shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <div className="text-white font-bold text-base">
                  {isTr ? 'WhatsApp Kriz & Destek Masası' : 'WhatsApp Crisis & Support Desk'}
                </div>
                <div className="text-emerald-400 text-sm font-mono font-bold">+90 534 371 35 73</div>
              </div>
            </a>
            
            {/* Direct Call Box */}
            <a 
              href="tel:+905343713573" 
              className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.08] transition-all group shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <div className="text-white font-bold text-base">{t('contact-direct-call')}</div>
                <div className="text-cyan-400 text-sm font-mono font-bold">+90 534 371 35 73</div>
              </div>
            </a>

            {/* Email Box */}
            <a 
              href="mailto:info@trendmasterakademi.com" 
              className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-all group shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 text-slate-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <div className="text-white font-bold text-base">{t('contact-direct-email')}</div>
                <div className="text-slate-300 text-sm font-mono">info@trendmasterakademi.com</div>
              </div>
            </a>

            {/* Address Box */}
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 text-slate-300">
              <div className="w-12 h-12 rounded-xl bg-white/10 text-slate-400 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="text-white font-bold text-base">{t('contact-direct-address')}</div>
                <div className="text-slate-400 text-xs sm:text-sm">{t('contact-address-text')}</div>
              </div>
            </div>

          </div>

          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs sm:text-sm flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 flex-shrink-0 text-cyan-400" />
            <span>{t('contact-nda-badge')}</span>
          </div>
        </div>
        
        {/* Right Column: Contact Form with Backend Lead Capture */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-7 glass-panel p-7 sm:p-10 rounded-3xl border border-cyan-500/25 bg-[#111827]/85 shadow-2xl"
        >
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  {isTr ? 'Talebiniz Başarıyla Kaydedildi!' : 'Inquiry Successfully Saved!'}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                  {isTr 
                    ? 'Talebiniz kriz masası gelen kutumuza ulaştı. Dilerseniz hemen WhatsApp üzerinden mesajı iletebilir veya tanışma randevusu seçebilirsiniz.' 
                    : 'Your inquiry has reached our engineering triage desk. You can also forward it directly on WhatsApp or book an introductory call.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-bg-dark font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isTr ? 'WhatsApp’tan Şimdi İlet →' : 'Forward to WhatsApp Now →'}</span>
                </button>

                <a
                  href="tel:+905343713573"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm flex items-center gap-2 transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-cyan-400" />
                  <span>+90 534 371 35 73</span>
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer w-full"
                >
                  {isTr ? '← Yeni Form Doldur' : '← Submit Another Inquiry'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-200 mb-2">
                    {t('contact-label-name')} <span className="text-red-400">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    name="name"
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3.5 text-white text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition-colors" 
                    placeholder="Adınız Soyadınız" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-200 mb-2">
                    {t('contact-label-agency')}
                  </label>
                  <input 
                    type="text" 
                    name="agency"
                    value={formData.agency} 
                    onChange={e => setFormData({...formData, agency: e.target.value})} 
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3.5 text-white text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition-colors" 
                    placeholder="Örn: Acme Creative / Agency" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-200 mb-2">
                    {t('contact-label-email')} <span className="text-red-400">*</span>
                  </label>
                  <input 
                    required 
                    type="email" 
                    name="email"
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3.5 text-white text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition-colors" 
                    placeholder="ornek@sirket.com" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-200 mb-2">
                    {t('contact-label-phone')} <span className="text-red-400">*</span>
                  </label>
                  <input 
                    required 
                    type="tel" 
                    name="phone"
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3.5 text-white text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition-colors" 
                    placeholder="+90 534 000 0000" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-200 mb-2">
                  {t('contact-label-message')} <span className="text-red-400">*</span>
                </label>
                <textarea 
                  required 
                  rows="4" 
                  name="message"
                  value={formData.message} 
                  onChange={e => setFormData({...formData, message: e.target.value})} 
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3.5 text-white text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition-colors resize-none leading-relaxed" 
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
                  className="mt-1 w-4 h-4 rounded bg-black/50 border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="kvkk" className="text-xs text-slate-400 leading-relaxed cursor-pointer">
                  {isTr 
                    ? 'İletişim bilgilerimin kriz masası değerlendirmesi ve geri dönüş amacıyla işlenmesini onaylıyorum (KVKK ve Gizlilik Politikası uyarınca bilgileriniz 3. taraflarla paylaşılmaz).' 
                    : 'I consent to the processing of my contact details for triage and response purposes under NDA and Privacy standards.'}
                </label>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-bg-dark font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-emerald-500/20 text-base cursor-pointer transform hover:-translate-y-0.5 mt-2 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                <span>{isSubmitting ? (isTr ? 'Kaydediliyor...' : 'Submitting...') : t('contact-btn-submit')}</span>
              </button>
            </form>
          )}
        </motion.div>
        
      </div>
    </section>
  );
};

export default Contact;
