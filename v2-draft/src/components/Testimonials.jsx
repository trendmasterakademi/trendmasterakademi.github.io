import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonialsList = [
  {
    avatar: "SG",
    stars: 5,
    name: "Süleyman G.",
    role: { tr: "Kripto Para Danışmanı", en: "Cryptocurrency Consultant" },
    text: { tr: "Trading sistemleri ve indikatör entegrasyonu konusunda çok donanımlı. İşlemlerimi disipline etmemde büyük yardımı dokundu.", en: "Very knowledgeable in trading systems and indicator integration. Great help in disciplining my trades." }
  },
  {
    avatar: "MD",
    stars: 5,
    name: "Muammer D.",
    role: { tr: "Borsa Özel Ders", en: "Stock Market Private Student" },
    text: { tr: "Mehmet hocamla dersler çok verimli geçiyor. Teknik analiz ve piyasa dinamiklerini pratik örneklerle anlatıyor.", en: "Lessons with teacher Mehmet are extremely productive. He explains technical analysis and market dynamics with practical examples." }
  },
  {
    avatar: "MK",
    stars: 5,
    name: "Mert K.",
    role: { tr: "Teknoloji Direktörü — Fintech", en: "Tech Director — Fintech" },
    text: { tr: "Mevcut altyapımızın performans sorunlarını kökten çözdüler. Sistem artık kat kat daha hızlı yanıt veriyor.", en: "They solved the performance issues of our current infrastructure from the root. The system now responds times faster." }
  }
];

const Testimonials = () => {
  const { t, i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonialsList.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonialsList.length) % testimonialsList.length);

  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, []);

  const current = testimonialsList[currentIndex];

  return (
    <section className="py-24 px-6 md:px-12 bg-black/30 relative">
      <div className="max-w-4xl mx-auto text-center">
        <h4 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">{t('testimonials-subtitle')}</h4>
        <h2 className="text-4xl font-bold mb-12">{t('testimonials-title')}</h2>

        <div className="relative h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 w-full"
            >
              <Quote className="w-12 h-12 text-primary/40 mx-auto mb-6" />
              <p className="text-xl md:text-2xl text-slate-200 leading-relaxed italic mb-8">
                "{current.text[i18n.language]}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg border border-primary/30">
                  {current.avatar}
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">{current.name}</div>
                  <div className="text-primary text-sm">{current.role[i18n.language]}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button onClick={prev} className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-primary hover:border-primary hover:text-black transition-colors z-10">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={next} className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-primary hover:border-primary hover:text-black transition-colors z-10">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
