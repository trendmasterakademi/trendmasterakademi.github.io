import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, PhoneCall, Mail, ExternalLink, Calendar, ArrowRight, Award, FileText, CheckCircle2 } from 'lucide-react';
import { getCalendlyUrl } from '../utils/calendly';
import { isTurkish } from '../i18n';

export const FounderSection = () => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);

  return (
    <section id="founder" className="py-20 md:py-28 px-4 sm:px-6 md:px-12 bg-[#080c14] border-b border-white/10 relative font-sans">
      {/* Subtle ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Award className="w-4 h-4" /> {isTr ? 'KURUCUDAN AÇIK NOT & MASA KİMLİĞİ' : 'FOUNDER COMMITMENT & DESK IDENTITY'}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-white tracking-tight leading-tight">
            <span className="block">
              {isTr ? 'Kelimelerle Değil,' : 'Not With Marketing Words,'}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
              {isTr ? 'Doğrudan Çekirdek Mühendislikle Çözüyoruz.' : 'Engineered Directly At Systems Core.'}
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
            {isTr 
              ? 'Aracılar, şişirilmiş pazarlama vaatleri veya yapay zeka şablonlarıyla değil; 20 yıllık sistem mimarisi deneyimi, resmi vergi kaydı ve İzmir Heris Tower ofisimizle doğrudan kıdemli mühendislik sunuyoruz.' 
              : 'Not through intermediaries, marketing fluff, or AI templates; direct senior engineering backed by 20+ years of systems architecture, formal corporate standing, and physical presence at Heris Tower, Izmir.'}
          </p>
        </div>

        {/* Main Grid: Founder Letter + Verified Desk Identity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left: Founder Letter & Ethos (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#0e1626]/80 border border-white/10 p-7 sm:p-9 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-mono font-black text-xl">
                  MŞ
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Mehmet Şahin</h3>
                  <p className="text-xs font-mono text-cyan-400">
                    {isTr ? 'Kurucu & Baş Yazılım Mimarı (Lead Architect)' : 'Founder & Lead Software Architect'}
                  </p>
                </div>
              </div>

              {isTr ? (
                <>
                  <p>
                    Yirmi yılı aşkın süredir finansal sistemlerin, algoritmik yazılımların ve yüksek erişilebilirlikli sunucu altyapılarının içindeyim. Yıllarca yalnızca kendi sistemlerimi yazdım, kendi mimarimi koda döktüm ve kendi hatalarımı ayıkladım.
                  </p>
                  <p>
                    <strong className="text-white">Trend Master Akademi</strong> adı, COVID döneminde bildiklerimi sistemleştirip anlattığım online sınıflarda doğdu. O dönemde gördüğümüz en somut gerçek şuydu: Yüksek işlem hacimli projelerde, karmaşık veri akışlarında veya kritik teslimat eşiklerinde; altyapıyı eksiksiz ayağa kaldıracak, kilitlenen deadlock'ları çözecek derin mühendislik birikimi çok nadir bulunuyordu.
                  </p>
                  <p>
                    Biz doğrudan bu kilitlenmeleri çözmek ve teknoloji liderlerinin arkasında görünmez, sarsılmaz bir teknik derinlik sağlamak için konumlandık. <strong>Sıfır dış görünürlük kuralıyla çalışırız:</strong> Projeyi devraldığımızda çift taraflı resmi NDA imzalar, mevcut ekibinizin sessiz bir uzantısı gibi operasyonu yürütür ve eksiksiz teslim ederiz.
                  </p>
                  <p className="text-slate-200 font-medium italic border-l-2 border-cyan-400 pl-4 my-2">
                    "Bize telefonla veya WhatsApp'tan ulaştığınızda bir satış temsilcisiyle değil; kodunuzu bizzat inceleyecek, sunucunuza girecek ve sorunu çözecek kıdemli mühendislik masasıyla doğrudan görüşürsünüz."
                  </p>
                </>
              ) : (
                <>
                  <p>
                    I have spent over twenty years inside financial systems, algorithmic engineering, and high-availability server infrastructures. For years, I engineered my own platforms, converted my own models into code, and resolved my own deadlocks.
                  </p>
                  <p>
                    The name <strong className="text-white">Trend Master Akademi</strong> was born in online technical cohorts where I taught systems architecture during the pandemic. The clearest reality on the ground was that in high-throughput applications and critical delivery crunches, deep engineering expertise capable of untangling database deadlocks and stabilizing fragile pipelines was exceptionally rare.
                  </p>
                  <p>
                    We operate specifically to untangle these critical bottlenecks and provide an invisible, unshakeable technical backline for engineering leaders. <strong>We maintain a zero-visibility policy:</strong> We execute under mutual binding NDA, operate as a silent extension of your internal team, and deliver with zero footprint.
                  </p>
                  <p className="text-slate-200 font-medium italic border-l-2 border-cyan-400 pl-4 my-2">
                    "When you reach out via phone or WhatsApp, you do not talk to an outsourced sales rep. You speak directly to the senior engineering desk inspecting your repository."
                  </p>
                </>
              )}
            </div>

            {/* Quick Links */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <Link
                to={isTr ? "/hikayemiz/" : "/story/"}
                className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>{isTr ? 'Kuruluş Hikâyemizi Okuyun' : 'Read Our Full Origin Story'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about/"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <span>{isTr ? 'Mühendislik Standartlarımız →' : 'Engineering Standards →'}</span>
              </Link>
            </div>
          </div>

          {/* Right: Verified Corporate Presence & Desk Contacts (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Physical Location Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#0f172a]/90 border border-cyan-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {isTr ? 'FİZİKSEL MÜHENDİSLİK MERKEZİ' : 'PHYSICAL DESK LOCATION'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  İZMİR
                </span>
              </div>

              <div className="space-y-1 text-sm text-slate-300">
                <strong className="block text-white font-bold text-base">Heris Tower — Konak / İzmir</strong>
                <p className="text-xs text-slate-400 leading-relaxed font-mono">
                  Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091 Konak / İzmir
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2 text-xs font-mono text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isTr ? 'İşletme Türü:' : 'Legal Standing:'}</span>
                  <span className="font-bold text-white">Mehmet Şahin ({isTr ? 'Şahıs İşletmesi' : 'Sole Proprietorship'})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isTr ? 'Vergi Dairesi & VKN:' : 'Tax Registration:'}</span>
                  <span className="text-cyan-300">{isTr ? 'Konak V.D.' : 'Konak Tax Office'} · 7930336132</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isTr ? 'NACE Faaliyet:' : 'Activity Code:'}</span>
                  <span className="text-slate-200">621000 — {isTr ? 'Bilgisayar Programlama' : 'Computer Programming & Systems Architecture'}</span>
                </div>
              </div>
            </div>

            {/* Direct Communication Channels */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#0f172a]/90 border border-white/10 shadow-xl space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" /> {isTr ? 'DOĞRUDAN MASA BAĞLANTISI' : 'DIRECT DESK ACCESS'}
              </span>

              <div className="space-y-3">
                <a
                  href="tel:+905343713573"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-xs font-mono"
                >
                  <span className="text-slate-400">{isTr ? 'Telefon & Kriz Hattı:' : 'Direct Phone Line:'}</span>
                  <strong className="text-emerald-400 font-bold">+90 534 371 35 73</strong>
                </a>

                <a
                  href="mailto:info@trendmasterakademi.com"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-xs font-mono"
                >
                  <span className="text-slate-400">{isTr ? 'Doğrudan E-Posta:' : 'Desk Email:'}</span>
                  <strong className="text-cyan-300">info@trendmasterakademi.com</strong>
                </a>

                <a
                  href={getCalendlyUrl('founder_card')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors text-xs font-mono text-cyan-300 font-bold"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{isTr ? '30 Dk Teknik Tanışma' : 'Book 30-Min Tech Intro'}</span>
                  </span>
                  <span>→</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default FounderSection;
