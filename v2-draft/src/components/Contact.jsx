import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, PhoneCall, Mail, MapPin, ShieldCheck, Send, ArrowRight } from 'lucide-react';
import TypewriterText from './TypewriterText';
import { motion } from 'framer-motion';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({ 
    name: '', 
    agency: '', 
    email: '', 
    phone: '', 
    message: '' 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const waNumber = '905343713573';
    const waText = i18n.language === 'tr' 
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

  return (
    <section id="contact" className="py-24 md:py-32 px-4 sm:px-6 md:px-12 relative overflow-hidden bg-[#080b11] border-t border-white/10">
      <div className="absolute top-1/2 left-0 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 -translate-x-1/2 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Direct Channels */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h4 className="text-cyan-400 font-mono font-bold tracking-widest uppercase text-xs sm:text-sm mb-3">
              {t('contact-subtitle')}
            </h4>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-white mb-6">
              <TypewriterText text={t('contact-title')} speed={18} delay={100} cursorColor="text-cyan-400" />
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              {t('contact-desc')}
            </p>
          </div>
          
          <div className="space-y-4">
            
            {/* Direct WhatsApp Box */}
            <a 
              href="https://wa.me/905343713573" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-emerald-500/30 hover:border-emerald-500/60 hover:bg-white/[0.08] transition-all group shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <div className="text-white font-bold text-base">WhatsApp Kriz & Destek Hattı</div>
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
        
        {/* Right Column: Contact Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-7 glass-panel p-7 sm:p-10 rounded-3xl border border-cyan-500/25 bg-[#111827]/85 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-200 mb-2">
                  {t('contact-label-name')} <span className="text-red-400">*</span>
                </label>
                <input 
                  required 
                  type="text" 
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
                value={formData.message} 
                onChange={e => setFormData({...formData, message: e.target.value})} 
                className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3.5 text-white text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition-colors resize-none leading-relaxed" 
                placeholder={t('contact-placeholder-msg')}
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-bg-dark font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-emerald-500/20 text-base cursor-pointer transform hover:-translate-y-0.5 mt-2"
            >
              <Send className="w-5 h-5" />
              <span>{t('contact-btn-submit')}</span>
            </button>
          </form>
        </motion.div>
        
      </div>
    </section>
  );
};

export default Contact;
