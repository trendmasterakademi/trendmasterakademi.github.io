import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck } from 'lucide-react';

const testimonialsList = [
  {
    avatar: "KD",
    stars: 5,
    name: "Kaan D.",
    role: { tr: "Ajans Başkanı — Creative & Tech Lab", en: "Agency President — Creative & Tech Lab" },
    text: { 
      tr: "Teslimata 48 saat kala kilitlenen ödeme API ve backend darboğazını gece yarısı devreye girip sabaha kadar çözdüler. Lansmanı kurtardık ve müşterimize en ufak bir aksaklık hissettirmedik. Kesinlikle vazgeçilmez kriz ortağımız.", 
      en: "They stepped in at midnight to resolve a locked payment API and backend bottleneck just 48 hours before launch. Saved our delivery without our client noticing any glitch. Truly our indispensable SWAT partner." 
    }
  },
  {
    avatar: "SA",
    stars: 5,
    name: "Selin A.",
    role: { tr: "Operasyon Direktörü — Dijital Ajans", en: "Operations Director — Digital Agency" },
    text: { 
      tr: "Önceki geliştirici ekibin devretmeden ayrıldığı karmaşık Next.js projesini 4 günde toparlayıp eksiksiz dokümante edilmiş şekilde teslim ettiler. White-label çalışma disiplinleri ve iletişim hızları ajansımıza büyük güven verdi.", 
      en: "They took over an undocumented, complex Next.js codebase left without handover and delivered a clean, tested release in 4 days. Flawless white-label discipline and instant communication." 
    }
  },
  {
    avatar: "ET",
    stars: 5,
    name: "Emre T.",
    role: { tr: "Kurucu Ortak — B2B SaaS Platformu", en: "Co-Founder — B2B SaaS Platform" },
    text: { 
      tr: "Yapay zeka ve LLM otomasyonları konusunda ekibimizin tıkandığı mimariyi sıfırdan inşa ettiler. Kod kalitesi, FastAPI backend hızı ve Docker entegrasyonu tek kelimeyle kusursuzdu.", 
      en: "They built the exact AI & LLM pipeline our internal squad was struggling to architect. The code quality, FastAPI backend performance, and Docker CI/CD setup were world-class." 
    }
  },
  {
    avatar: "BY",
    stars: 5,
    name: "Burak Y.",
    role: { tr: "Yazılım Grup Müdürü — E-Ticaret Çözümleri", en: "Engineering Lead — E-Commerce Tech" },
    text: { 
      tr: "Kampanya döneminde aşırı trafikten çöken PostgreSQL veritabanımızı 2 saat içinde optimize edip ayağa kaldırdılar. Teknik mühendislik bilgisi ve kriz soğukkanlılığı en üst seviyede.", 
      en: "Our PostgreSQL database choked during a major campaign surge; they diagnosed and optimized the bottlenecks within 2 hours. Supreme technical depth and crisis composure." 
    }
  },
  {
    avatar: "DK",
    stars: 5,
    name: "Deniz K.",
    role: { tr: "Proje Yöneticisi — Web & Mobil Stüdyosu", en: "Project Manager — Web & Mobile Studio" },
    text: { 
      tr: "Flutter mobil uygulamamızın karmaşık webhook ve mağaza yayın süreçlerini sorunsuz tamamladık. Proje boyunca doğrudan teknik ekiple çalışmak teslimat süremizi yarı yarıya kısalttı.", 
      en: "Completed our Flutter mobile app's complex webhooks and store publishing smoothly. Working directly with senior engineers cut our development timeframe in half." 
    }
  },
  {
    avatar: "MB",
    stars: 5,
    name: "Murat B.",
    role: { tr: "Teknoloji Direktörü — Medya & Yazılım Evi", en: "CTO — Media & Software House" },
    text: { 
      tr: "Ajansımızın masasına gelen zorlu ve alışılmadık teknik taleplerde 'Trend Master Akademi mühendislik masasına danışalım' demek şirketimizin en büyük konforu ve güvencesi oldu.", 
      en: "Whenever unconventional, high-complexity client briefs arrive at our agency, knowing we can consult the Trend Master Academy engineering desk is our biggest asset and peace of mind." 
    }
  }
];

const Testimonials = () => {
  const { t, i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonialsList.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonialsList.length) % testimonialsList.length);

  useEffect(() => {
    const timer = setInterval(next, 9000);
    return () => clearInterval(timer);
  }, []);

  const current = testimonialsList[currentIndex];
  const lang = i18n.language === 'en' ? 'en' : 'tr';

  return (
    <section id="testimonials" className="py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-black/40 relative border-t border-white/10">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Header */}
        <h4 className="text-cyan-400 font-mono font-bold tracking-widest uppercase text-xs sm:text-sm mb-3">
          {t('testimonials-subtitle')}
        </h4>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-white mb-14">
          {t('testimonials-title')}
        </h2>

        {/* Carousel Box */}
        <div className="relative min-h-[360px] sm:min-h-[320px] flex items-center justify-center">
          <React.Fragment>
            <div
              key={currentIndex}
              
              
              
              
              className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 w-full bg-[#111827]/80 shadow-2xl relative"
            >
              <div className="flex items-center justify-center gap-1 mb-6">
                {[...Array(current.stars)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-base sm:text-lg md:text-xl text-slate-200 leading-relaxed italic mb-8 font-medium">
                "{current.text[lang]}"
              </p>

              <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-black text-base border border-cyan-500/30 flex-shrink-0">
                  {current.avatar}
                </div>
                <div className="text-left">
                  <div className="font-bold text-base sm:text-lg text-white">{current.name}</div>
                  <div className="text-cyan-400 text-xs sm:text-sm font-mono flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{current.role[lang]}</span>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>

          {/* Navigation Arrows */}
          <button 
            onClick={prev} 
            className="absolute left-0 sm:-left-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/70 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-cyan-500 hover:border-cyan-500 hover:text-black transition-colors z-10 cursor-pointer shadow-lg"
            aria-label="Önceki Yorum"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={next} 
            className="absolute right-0 sm:-right-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/70 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-cyan-500 hover:border-cyan-500 hover:text-black transition-colors z-10 cursor-pointer shadow-lg"
            aria-label="Sonraki Yorum"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Carousel Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonialsList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentIndex === idx ? 'w-8 bg-cyan-400' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Yorum ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
