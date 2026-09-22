import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Server, Lock, Cpu, ArrowRight, ArrowLeft, Zap, PhoneCall, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { coreCommitments } from '../data/slaData';
import { getCalendlyUrl } from '../utils/calendly';
import { setPageSeo } from '../utils/pageTitle';
import { isTurkish } from '../i18n';

const About = () => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);

  useEffect(() => {
    setPageSeo('/about/', isTr ? 'tr' : 'en');
  }, [isTr]);

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 md:px-8 bg-[var(--paper)] text-[var(--ink)] relative font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Back to Home Link */}
        <div className="flex items-center justify-start">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-[var(--ink-secondary)] hover:text-[var(--accent)] font-mono transition-colors min-h-[44px] py-[13px] -my-[13px]"
          >
            <ArrowLeft className="w-4 h-4" /> {isTr ? '← Ana Sayfaya Dön' : '← Back to Home'}
          </Link>
        </div>

        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--r-control)] bg-red-50 border border-red-200 text-[var(--accent)] text-xs font-mono font-semibold uppercase tracking-wider">
            <Cpu className="w-4 h-4" /> {isTr ? 'MÜHENDİSLİK STANDARTLARIMIZ' : 'ENGINEERING STANDARDS'}
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-[var(--ink)] tracking-tight leading-tight">
            {isTr ? 'Ajansların Güvendiği Görünmez Mühendislik Masası.' : 'The Invisible Engineering Backline for Digital Agencies.'}
          </h1>

          <p className="text-[var(--ink-secondary)] text-base sm:text-lg leading-relaxed">
            {isTr 
              ? 'Biz bir son kullanıcı ajansı değiliz. Dijital ajansların, yazılım evlerinin ve girişimlerin arka planında; krizleri çözen, karmaşık mimarileri kuran ve %100 White-Label çalışan kıdemli bir mühendislik stüdyosuyuz.' 
              : 'We do not compete with agencies. We operate purely behind the scenes as your dedicated senior engineering studio under complete NDA and White-Label governance.'}
          </p>
        </div>

        {/* Brand Story Teaser Block */}
        <div className="p-6 sm:p-8 rounded-xl bg-[var(--surface)] border border-[var(--rule)] space-y-4 max-w-4xl mx-auto shadow-sm">
          <div className="flex items-center gap-4 border-b border-[var(--rule)] pb-4">
            <picture className="flex-shrink-0">
              <source
                type="image/avif"
                srcSet="/images/mehmet-sahin-160.avif 1x, /images/mehmet-sahin-320.avif 2x, /images/mehmet-sahin-480.avif 3x"
              />
              <source
                type="image/webp"
                srcSet="/images/mehmet-sahin-160.webp 1x, /images/mehmet-sahin-320.webp 2x, /images/mehmet-sahin-480.webp 3x"
              />
              <img
                src="/images/mehmet-sahin-160.jpg"
                srcSet="/images/mehmet-sahin-320.jpg 2x, /images/mehmet-sahin-480.jpg 3x"
                alt="Mehmet Şahin — Kurucu & Baş Yazılım Mimarı"
                width="64"
                height="64"
                loading="lazy"
                decoding="async"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[var(--rule)] object-cover shadow-sm"
              />
            </picture>
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[var(--ink)] tracking-tight">
                {isTr ? 'Trend Master Akademi Adı Nereden Geliyor?' : 'Where Does the Name "Akademi" Come From?'}
              </h3>
              <p className="text-xs font-mono text-[var(--accent)] font-medium">
                {isTr ? 'Mehmet Şahin — Kurucu & Baş Yazılım Mimarı' : 'Mehmet Şahin — Founder & Lead Software Architect'}
              </p>
            </div>
          </div>
          
          {isTr ? (
            <div className="space-y-3 text-[var(--ink-secondary)] text-base sm:text-lg leading-relaxed">
              <p>
                Aslında bu iş fikri bir online derste doğdu.
              </p>
              <p>
                Yirmi yıldır finansal piyasaların içerisindeydim. Yazılım hep işimin ayrılmaz bir parçasıydı ama uzun süre yalnızca kendim için: kendi sistemlerimi yazdım, kendi fikirlerimi koda döktüm, kendi hatalarımı kendim ayıkladım.{' '}
                <Link
                  to="/hikayemiz/"
                  className="text-[var(--accent)] hover:underline font-semibold transition-colors inline-block py-2 -my-2 px-1 -mx-1"
                >
                  Devamı...
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-3 text-[var(--ink-secondary)] text-base sm:text-lg leading-relaxed">
              <p>
                This business actually started in an online class.
              </p>
              <p>
                I spent twenty years inside financial markets. Software was always inseparable from that work — but for a long time only for myself: I wrote my own systems, turned my own ideas into code, debugged my own mistakes.{' '}
                <Link
                  to="/story/"
                  className="text-[var(--accent)] hover:underline font-semibold transition-colors inline-block py-2 -my-2 px-1 -mx-1"
                >
                  Read more...
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* 6 Core Commitments Section */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[var(--ink)] tracking-tight">
              {isTr ? 'Altı Temel Taahhüdümüz' : 'Our Six Core Commitments'}
            </h2>
            <p className="text-[var(--ink-secondary)] text-sm sm:text-base">
              {isTr 
                ? 'Ajanslarla çalışırken taviz vermediğimiz altı kural:' 
                : 'Six non-negotiable rules when collaborating with agencies:'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreCommitments.map((c) => (
              <div key={c.no} className="p-8 rounded-xl border border-[var(--rule)] bg-[var(--surface)] space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--paper)] text-[var(--accent)] flex items-center justify-center font-mono font-bold text-base border border-[var(--rule)]">
                    {c.no}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[var(--ink)]">
                    {c.title[isTr ? 'tr' : 'en']}
                  </h3>
                  <p className="text-[var(--ink-secondary)] text-sm sm:text-base leading-relaxed">
                    {c.desc[isTr ? 'tr' : 'en']}
                  </p>
                </div>
                {c.no === '02' && (
                  <div className="pt-2">
                    <Link 
                      to="/nda/" 
                      className="btn-link inline-flex items-center gap-1 font-mono text-xs sm:text-sm font-semibold text-[var(--accent)] hover:underline"
                    >
                      {isTr ? 'Sözleşmeyi okuyun →' : 'Read the agreement →'}
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA section */}
        <div className="p-8 sm:p-12 rounded-xl bg-[var(--surface)] border border-[var(--rule)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-serif font-semibold text-[var(--ink)]">
              {isTr ? 'Ajansınız İçin Mühendislik Masası Oluşturun' : 'Establish Your Engineering Backline Today'}
            </h3>
            <p className="text-[var(--ink-secondary)] text-sm max-w-[34rem]">
              {isTr 
                ? 'Kriz yaşayan projeleriniz, tıkanan API entegrasyonlarınız veya ekibinizin kapasitesini aşan teknik işler için resmi NDA ile çalışmaya başlayın.' 
                : 'Deploy reliable senior engineering power for your agency projects under mutual NDA.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={getCalendlyUrl('about_cta')}
              target="_blank"
              rel="noreferrer"
              onClick={() => window.trackEvent && window.trackEvent('calendar_clicked', { source: 'about_cta' })}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{isTr ? 'Takvimden 30 Dakikalık Görüşme Seç' : 'Schedule a 30-Minute Call'}</span>
            </a>
            <Link
              to="/agency/"
              className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <span>{isTr ? 'Teknik Müdahale Modelini İncele' : 'Review Technical Operations Model'}</span>
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </Link>
          </div>
        </div>

        {/* Legal Information Section / Yasal Bilgiler */}
        <div className="p-8 sm:p-10 rounded-xl border border-[var(--rule)] bg-[var(--surface)] space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-[var(--accent)] flex items-center justify-center border border-red-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[var(--ink)]">
                {isTr ? 'Yasal Bilgiler' : 'Legal Information'}
              </h2>
              <span className="text-xs font-mono text-[var(--accent)]">
                {isTr ? 'Doğrulanabilir Resmi Mükellefiyet Künyesi' : 'Verifiable Tax & Business Registration Data'}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-mono border-collapse">
              <tbody className="divide-y divide-[var(--rule)]">
                <tr className="border-b border-[var(--rule)]">
                  <td className="py-3.5 px-2 sm:px-4 text-[var(--ink-secondary)] font-semibold w-1/3">
                    {isTr ? 'Mükellef / İşletme Türü' : 'Entity / Structure'}
                  </td>
                  <td className="py-3.5 px-2 sm:px-4 text-[var(--ink)] font-bold">
                    {isTr ? 'Mehmet Şahin — Şahıs İşletmesi' : 'Mehmet Şahin — Sole Proprietorship'}
                  </td>
                </tr>
                <tr className="border-b border-[var(--rule)]">
                  <td className="py-3.5 px-2 sm:px-4 text-[var(--ink-secondary)] font-semibold">
                    {isTr ? 'Vergi Dairesi' : 'Tax Office'}
                  </td>
                  <td className="py-3.5 px-2 sm:px-4 text-[var(--ink)]">
                    {isTr ? 'Konak Vergi Dairesi' : 'Konak Tax Office'}
                  </td>
                </tr>
                <tr className="border-b border-[var(--rule)]">
                  <td className="py-3.5 px-2 sm:px-4 text-[var(--ink-secondary)] font-semibold">
                    {isTr ? 'Vergi Kimlik No (VKN)' : 'Tax ID (VKN)'}
                  </td>
                  <td className="py-3.5 px-2 sm:px-4 text-[var(--accent)] font-bold tracking-wider">
                    7930336132
                  </td>
                </tr>
                <tr className="border-b border-[var(--rule)]">
                  <td className="py-3.5 px-2 sm:px-4 text-[var(--ink-secondary)] font-semibold">
                    {isTr ? 'Ana Faaliyet Kodu' : 'Activity Code'}
                  </td>
                  <td className="py-3.5 px-2 sm:px-4 text-[var(--ink)]">
                    {isTr ? '621000 — Bilgisayar Programlama Faaliyetleri' : '621000 — Computer Programming Activities'}
                  </td>
                </tr>
                <tr className="border-b border-[var(--rule)]">
                  <td className="py-3.5 px-2 sm:px-4 text-[var(--ink-secondary)] font-semibold">
                    {isTr ? 'Yasal İş Yeri Adresi' : 'Official Registered Address'}
                  </td>
                  <td className="py-3.5 px-2 sm:px-4 text-[var(--ink)] leading-relaxed">
                    Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091 Konak / İzmir
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-2 sm:px-4 text-[var(--ink-secondary)] font-semibold">
                    {isTr ? 'Resmi İletişim' : 'Official Contact'}
                  </td>
                  <td className="py-3.5 px-2 sm:px-4 text-[var(--ink)]">
                    +90 534 371 35 73 · info@trendmasterakademi.com
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-lg bg-[var(--paper)] border border-[var(--rule)] text-xs sm:text-sm text-[var(--ink-secondary)] font-mono">
            {isTr 
              ? 'Faaliyet belgesi ve vergi levhası, sözleşme öncesi talep üzerine ibraz edilir.' 
              : 'Certificate of activity and tax registration plate are presented upon request prior to agreement.'}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
