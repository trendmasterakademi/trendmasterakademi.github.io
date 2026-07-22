import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Mail, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const waNumber = '905343713573';
    const waText = i18n.language === 'tr' 
      ? `Merhaba Trend Master Akademi,\n\nWeb siteniz üzerinden yeni bir başvuru/talep formu doldurdum:\n\n*Ad Soyad:* ${formData.name}\n*E-Posta:* ${formData.email}\n*Telefon:* ${formData.phone}\n*Mesaj:* ${formData.message}`
      : `Hello Trend Master Academy,\n\nI have submitted a contact form on your website:\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Phone:* ${formData.phone}\n*Message:* ${formData.message}`;
    
    const encodedText = encodeURIComponent(waText);
    const waUrl = `https://wa.me/${waNumber}?text=${encodedText}`;
    window.open(waUrl, '_blank');
  };

  return (
    <section id="contact" className="py-24 px-6 md:px-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 -translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        <div>
          <h4 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">{t('contact-subtitle')}</h4>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('contact-title')}</h2>
          <p className="text-slate-400 mb-12 text-lg leading-relaxed">{t('contact-desc')}</p>
          
          <div className="space-y-6">
            <a href="https://wa.me/905343713573" target="_blank" rel="noreferrer" className="flex items-center gap-4 glass-panel p-4 rounded-xl hover:border-primary/50 transition-colors w-fit">
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-white font-bold">{t('contact-wa')}</div>
                <div className="text-primary text-sm font-medium">{t('contact-wa-sub')}</div>
              </div>
            </a>
            
            <a href="mailto:info@trendmasterakademi.com" className="flex items-center gap-4 glass-panel p-4 rounded-xl hover:border-white/20 transition-colors w-fit">
              <div className="w-12 h-12 rounded-full bg-white/5 text-slate-300 flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <div className="text-white font-bold">{t('contact-email')}</div>
                <div className="text-slate-400 text-sm font-medium">info@trendmasterakademi.com</div>
              </div>
            </a>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-8 rounded-3xl border border-primary/20"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Ad Soyad</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Ahmet Yılmaz" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">E-Posta</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="ornek@mail.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Telefon</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="+90 555 000 0000" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Mesajınız</label>
              <textarea required rows="4" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Hangi eğitimle ilgileniyorsunuz?"></textarea>
            </div>
            
            <button type="submit" className="w-full bg-primary text-bg-dark font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors mt-2">
              <Send className="w-5 h-5" />
              {t('form-submit') || 'Gönder'}
            </button>
          </form>
        </motion.div>
        
      </div>
    </section>
  );
};

export default Contact;
