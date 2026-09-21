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
    <section id="founder" className="py-24 px-4 sm:px-6 md:px-12 bg-[var(--paper)] border-b border-[var(--rule)] relative font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink-2)] text-xs font-mono font-medium uppercase tracking-wider mb-4">
            <Award className="w-4 h-4 text-[var(--accent)]" /> {isTr ? 'KURUCUDAN AÇIK NOT & MASA KİMLİĞİ' : 'FOUNDER COMMITMENT & DESK IDENTITY'}
          </div>
          <h2 className="font-serif text-lg sm:text-xl font-semibold text-[var(--ink)] tracking-tight leading-tight">
            <span className="block">
              {isTr ? 'Kelimelerle Değil,' : 'Not With Marketing Words,'}
            </span>
            <span className="block text-[var(--ink)]">
              {isTr ? 'Doğrudan Çekirdek Mühendislikle Çözüyoruz.' : 'Engineered Directly At Systems Core.'}
            </span>
          </h2>
          <p className="text-[var(--ink-2)] text-base sm:text-lg mt-4 leading-relaxed">
            {isTr 
              ? 'Aracılar, şişirilmiş pazarlama vaatleri veya yapay zeka şablonlarıyla değil; 20 yıllık sistem mimarisi deneyimi, resmi vergi kaydı ve İzmir Heris Tower ofisimizle doğrudan kıdemli mühendislik sunuyoruz.' 
              : 'Not through intermediaries, marketing fluff, or AI templates; direct senior engineering backed by 20+ years of systems architecture, formal corporate standing, and physical presence at Heris Tower, Izmir.'}
          </p>
        </div>

        {/* Main Grid: Founder Letter + Verified Desk Identity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left: Founder Letter & Ethos (7 Cols) */}
          <div className="lg:col-span-7 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] p-7 sm:p-9 flex flex-col justify-between space-y-6 shadow-sm relative overflow-hidden">
            <div className="space-y-4 text-[var(--ink-2)] text-sm sm:text-base leading-relaxed">
              <div className="flex items-center gap-4 border-b border-[var(--rule)] pb-4 mb-4">
                {/* Visual Placeholder Box 1: Founder Portrait (4:5 aspect ratio) */}
                <div className="w-16 sm:w-20 aspect-[4/5] rounded-[var(--r-control)] bg-[var(--paper)] border border-[var(--rule)] flex items-center justify-center p-1.5 text-center text-xs font-mono text-[var(--ink-3)] leading-tight flex-shrink-0">
                  <span>Mehmet Şahin</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--ink)]">Mehmet Şahin</h3>
                  <p className="text-xs font-mono text-[var(--accent)] font-medium">
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
                    <strong className="text-[var(--ink)]">Trend Master Akademi</strong> adı, COVID döneminde bildiklerimi sistemleştirip anlattığım online sınıflarda doğdu. O dönemde gördüğümüz en somut gerçek şuydu: Yüksek işlem hacimli projelerde, karmaşık veri akışlarında veya kritik teslimat eşiklerinde; altyapıyı eksiksiz ayağa kaldıracak, kilitlenen deadlock'ları çözecek derin mühendislik birikimi çok nadir bulunuyordu.
                  </p>
                  <p>
                    Biz doğrudan bu kilitlenmeleri çözmek ve teknoloji liderlerinin arkasında görünmez, sarsılmaz bir teknik derinlik sağlamak için konumlandık. <strong>Sıfır dış görünürlük kuralıyla çalışırız:</strong> Projeyi devraldığımızda çift taraflı resmi NDA imzalar, mevcut ekibinizin sessiz bir uzantısı gibi operasyonu yürütür ve eksiksiz teslim ederiz.
                  </p>
                  <p className="text-[var(--ink)] font-medium italic border-l-2 border-[var(--accent)] pl-4 my-2">
                    "Bize telefonla veya WhatsApp'tan ulaştığınızda bir satış temsilcisiyle değil; kodunuzu bizzat inceleyecek, sunucunuza girecek ve sorunu çözecek kıdemli mühendislik masasıyla doğrudan görüşürsünüz."
                  </p>
                </>
              ) : (
                <>
                  <p>
                    I have spent over twenty years inside financial systems, algorithmic engineering, and high-availability server infrastructures. For years, I engineered my own platforms, converted my own models into code, and resolved my own deadlocks.
                  </p>
                  <p>
                    The name <strong className="text-[var(--ink)]">Trend Master Akademi</strong> was born in online technical cohorts where I taught systems architecture during the pandemic. The clearest reality on the ground was that in high-throughput applications and critical delivery crunches, deep engineering expertise capable of untangling database deadlocks and stabilizing fragile pipelines was exceptionally rare.
                  </p>
                  <p>
                    We operate specifically to untangle these critical bottlenecks and provide an invisible, unshakeable technical backline for engineering leaders. <strong>We maintain a zero-visibility policy:</strong> We execute under mutual binding NDA, operate as a silent extension of your internal team, and deliver with zero footprint.
                  </p>
                  <p className="text-[var(--ink)] font-medium italic border-l-2 border-[var(--accent)] pl-4 my-2">
                    "When you reach out via phone or WhatsApp, you do not talk to an outsourced sales rep. You speak directly to the senior engineering desk inspecting your repository."
                  </p>
                </>
              )}
            </div>

            {/* Quick Links */}
            <div className="pt-4 border-t border-[var(--rule)] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <Link
                to={isTr ? "/hikayemiz/" : "/story/"}
                className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium flex items-center gap-1.5 transition-colors"
              >
                <span>{isTr ? 'Kuruluş Hikâyemizi Okuyun' : 'Read Our Full Origin Story'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about/"
                className="text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors"
              >
                <span>{isTr ? 'Mühendislik Standartlarımız →' : 'Engineering Standards →'}</span>
              </Link>
            </div>
          </div>

          {/* Right: Verified Corporate Presence & Desk Contacts (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Physical Location Card */}
            <div className="p-6 sm:p-7 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium uppercase tracking-wider text-[var(--ink-2)] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--accent)]" /> {isTr ? 'FİZİKSEL MÜHENDİSLİK MERKEZİ' : 'PHYSICAL DESK LOCATION'}
                </span>
                <span className="px-2.5 py-0.5 rounded-[var(--r-control)] bg-[var(--paper)] text-[var(--ink)] border border-[var(--rule)] text-xs font-mono font-medium">
                  İZMİR
                </span>
              </div>

              <div className="space-y-1 text-sm text-[var(--ink-2)]">
                <strong className="block text-[var(--ink)] font-semibold text-base">Heris Tower — Konak / İzmir</strong>
                <p className="text-xs text-[var(--ink-3)] leading-relaxed font-mono">
                  Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091 Konak / İzmir
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--rule)] space-y-2 text-xs font-mono text-[var(--ink-2)]">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--ink-3)]">{isTr ? 'İşletme Türü:' : 'Legal Standing:'}</span>
                  <span className="font-semibold text-[var(--ink)]">Mehmet Şahin ({isTr ? 'Şahıs İşletmesi' : 'Sole Proprietorship'})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--ink-3)]">{isTr ? 'Vergi Dairesi & VKN:' : 'Tax Registration:'}</span>
                  <span className="text-[var(--ink)] font-medium">{isTr ? 'Konak V.D.' : 'Konak Tax Office'} · 7930336132</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--ink-3)]">{isTr ? 'NACE Faaliyet:' : 'Activity Code:'}</span>
                  <span className="text-[var(--ink)]">621000 — {isTr ? 'Bilgisayar Programlama' : 'Computer Programming & Systems Architecture'}</span>
                </div>
              </div>
            </div>

            {/* Direct Communication Channels */}
            <div className="p-6 sm:p-7 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] shadow-sm space-y-4">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-[var(--ink-3)] flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[var(--accent)]" /> {isTr ? 'DOĞRUDAN MASA BAĞLANTISI' : 'DIRECT DESK ACCESS'}
              </span>

              <div className="space-y-3">
                <a
                  href="tel:+905343713573"
                  className="flex items-center justify-between p-3 rounded-[var(--r-control)] bg-[var(--paper)] hover:bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--rule-strong)] transition-colors text-xs font-mono"
                >
                  <span className="text-[var(--ink-3)]">{isTr ? 'Telefon & Kriz Hattı:' : 'Direct Phone Line:'}</span>
                  <strong className="text-[var(--ink)] font-semibold">+90 534 371 35 73</strong>
                </a>

                <a
                  href="mailto:info@trendmasterakademi.com"
                  className="flex items-center justify-between p-3 rounded-[var(--r-control)] bg-[var(--paper)] hover:bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--rule-strong)] transition-colors text-xs font-mono"
                >
                  <span className="text-[var(--ink-3)]">{isTr ? 'Doğrudan E-Posta:' : 'Desk Email:'}</span>
                  <strong className="text-[var(--ink)] font-semibold">info@trendmasterakademi.com</strong>
                </a>

                <a
                  href={getCalendlyUrl('founder_card')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-[var(--r-control)] bg-[var(--surface)] hover:bg-[var(--paper)] border border-[var(--accent)] transition-colors text-xs font-mono text-[var(--accent)] font-semibold"
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
