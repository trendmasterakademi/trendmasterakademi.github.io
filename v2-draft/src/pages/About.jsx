import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Server, Lock, Cpu, ArrowRight, ArrowLeft, Zap, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';

  useEffect(() => {
    document.title = isTr 
      ? "Mühendislik Standartlarımız & Hakkımızda | Trend Master Akademi"
      : "Engineering Standards & About | Trend Master Academy";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", isTr
        ? "Trend Master Akademi: Dijital ajansların ve kurumsal ekiplerin görünmez teknik gücü. 4 temel mühendislik standardımız ve B2B SWAT vizyonumuz."
        : "Trend Master Academy: The invisible backline engineering power for digital agencies. 4 core pillars and B2B crisis triage standard."
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://trendmasterakademi.com/about/');
    }
  }, [isTr]);

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 md:px-8 bg-[#080b11] text-slate-200 relative  font-sans">
      {/* Ambience glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#1f293d_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none -z-10"></div>

      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Back to Home Link */}
        <div className="flex items-center justify-start">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {isTr ? '← Ana Sayfaya Dön' : '← Back to Home'}
          </Link>
        </div>

        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Cpu className="w-4 h-4" /> {isTr ? 'MÜHENDİSLİK STANDARTLARIMIZ' : 'ENGINEERING STANDARDS'}
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {isTr ? 'Ajansların Güvendiği Görünmez Mühendislik Masası.' : 'The Invisible Engineering Backline for Digital Agencies.'}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {isTr 
              ? 'Biz bir son kullanıcı ajansı değiliz. Dijital ajansların, yazılım evlerinin ve girişimlerin arka planında; krizleri çözen, karmaşık mimarileri kuran ve %100 White-Label çalışan kıdemli bir mühendislik stüdyosuyuz.' 
              : 'We do not compete with agencies. We operate purely behind the scenes as your dedicated senior engineering studio under complete NDA and White-Label governance.'}
          </p>
        </div>

        {/* Brand Story Transition Banner */}
        <div className="p-5 sm:p-6 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-cyan-300">
              {isTr ? 'Trend Master Akademi Adı Nereden Geliyor?' : 'Where Does the Name Trend Master Akademi Come From?'}
            </h3>
            <p className="text-xs text-slate-400">
              {isTr 
                ? '20 yıllık finansal yazılım geçmişimiz, online derslerden doğan adımız ve kuruluş hikâyemiz.' 
                : 'Our 20-year software background, roots in online education, and brand story.'}
            </p>
          </div>
          <Link
            to="/hikayemiz/"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-bg-dark font-black text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all shadow-md shadow-cyan-500/20"
          >
            <span>{isTr ? 'Hikâyemizi Oku →' : 'Read Our Story →'}</span>
          </Link>
        </div>

        {/* 4 Core Pillars Section */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isTr ? 'Dört Temel Mühendislik Standardımız' : 'Our Four Engineering Pillars'}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              {isTr 
                ? 'Ajanslarla çalışırken taviz vermediğimiz 4 temel operasyonel ve hukuki kuralımız.' 
                : '4 non-negotiable operational and legal principles when collaborating with agencies.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-[#111827]/70 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-lg border border-cyan-500/30">
                01
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {isTr ? '%100 White-Label & Görünmezlik' : '100% White-Label & Invisible Delivery'}
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {isTr 
                  ? 'Müşteriniz hiçbir zaman bizim adımızı duymaz. Projeler ajansınızın markası, logosu ve kurumsal kimliği altında teslim edilir. İletişim isterseniz ajans alan adı e-postanız üzerinden yürütülür.' 
                  : 'Your client never sees our brand. Work is delivered under your agency credentials, domain email, and repository namespaces.'}
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-[#111827]/70 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-lg border border-emerald-500/30">
                02
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {isTr ? 'Resmi NDA & Fikri Mülkiyet Devri' : 'Binding Legal NDA & Total IP Transfer'}
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {isTr 
                  ? 'Projeye başlamadan önce bağlayıcı Gizlilik Sözleşmesi (NDA) imzalanır. Geliştirilen tüm kaynak kodlar, mimari ve fikri mülkiyet %100 ajansınıza ve müşterinize aittir.' 
                  : 'Prior to work, a binding NDA is executed. All source code, architecture, and IP belong 100% to your agency and client.'}
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-[#111827]/70 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-lg border border-amber-500/30">
                03
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {isTr ? 'Şeffaf Ücretlendirme' : 'Transparent Pricing'}
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {isTr 
                  ? 'İlk kod teşhisi ve triyaj ücretsizdir. Sonraki çalışmanın kapsamı ve bedeli, teşhis tamamlandıktan sonra işe özel olarak belirlenir ve çalışma başlamadan önce yazılı olarak netleşir.' 
                  : 'Initial code triage is free. Scope and pricing for subsequent work are tailored after diagnosis and established in writing before work begins.'}
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-[#111827]/70 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono font-bold text-lg border border-purple-500/30">
                04
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {isTr ? 'Doğrudan Mühendislik Masası Muhatabı' : 'Direct Senior Engineering Contact'}
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {isTr 
                  ? 'Arada teknik bilgisi olmayan satış temsilcileri veya bürokrasi katmanları yoktur. İletişim doğrudan projeyi yürüten kıdemli mühendislik masamız üzerinden anlık yürütülür.' 
                  : 'No non-technical intermediaries or ticket queues. You interface directly with senior system architects and backend engineers.'}
              </p>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-[#111827] to-[#0e1626] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-bold text-white">
              {isTr ? 'Ajansınız İçin Mühendislik Masası Oluşturun' : 'Establish Your Engineering Backline Today'}
            </h3>
            <p className="text-slate-300 text-sm max-w-xl">
              {isTr 
                ? 'Kriz yaşayan projeleriniz, tıkanan API entegrasyonlarınız veya ekibinizin kapasitesini aşan teknik işler için resmi NDA ile çalışmaya başlayın.' 
                : 'Deploy reliable senior engineering power for your agency projects under mutual NDA.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/agency/"
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-bg-dark font-black text-sm whitespace-nowrap flex items-center gap-2 shadow-lg shadow-cyan-500/25"
            >
              <span>{isTr ? 'Ajans Çözümlerini İncele' : 'Explore Agency Solutions'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Legal Information Section / Yasal Bilgiler */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 bg-[#111827]/70 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {isTr ? 'Yasal Bilgiler' : 'Legal Information'}
              </h2>
              <span className="text-xs font-mono text-cyan-400">
                {isTr ? 'Doğrulanabilir Resmi Mükellefiyet Künyesi' : 'Verifiable Tax & Business Registration Data'}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-mono border-collapse">
              <tbody className="divide-y divide-white/10">
                <tr className="border-b border-white/10">
                  <td className="py-3.5 px-2 sm:px-4 text-slate-400 font-semibold w-1/3">
                    {isTr ? 'Mükellef / İşletme Türü' : 'Entity / Structure'}
                  </td>
                  <td className="py-3.5 px-2 sm:px-4 text-white font-bold">
                    {isTr ? 'Mehmet Şahin — Şahıs İşletmesi' : 'Mehmet Şahin — Sole Proprietorship'}
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3.5 px-2 sm:px-4 text-slate-400 font-semibold">
                    {isTr ? 'Vergi Dairesi' : 'Tax Office'}
                  </td>
                  <td className="py-3.5 px-2 sm:px-4 text-slate-200">
                    {isTr ? 'Konak Vergi Dairesi' : 'Konak Tax Office'}
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3.5 px-2 sm:px-4 text-slate-400 font-semibold">
                    {isTr ? 'Vergi Kimlik No (VKN)' : 'Tax ID (VKN)'}
                  </td>
                  <td className="py-3.5 px-2 sm:px-4 text-cyan-400 font-bold tracking-wider">
                    7930336132
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3.5 px-2 sm:px-4 text-slate-400 font-semibold">
                    {isTr ? 'Ana Faaliyet Kodu' : 'Activity Code'}
                  </td>
                  <td className="py-3.5 px-2 sm:px-4 text-slate-200">
                    {isTr ? '621000 — Bilgisayar Programlama Faaliyetleri' : '621000 — Computer Programming Activities'}
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3.5 px-2 sm:px-4 text-slate-400 font-semibold">
                    {isTr ? 'Yasal İş Yeri Adresi' : 'Official Registered Address'}
                  </td>
                  <td className="py-3.5 px-2 sm:px-4 text-slate-200 leading-relaxed">
                    Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091 Konak / İzmir
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-2 sm:px-4 text-slate-400 font-semibold">
                    {isTr ? 'Resmi İletişim' : 'Official Contact'}
                  </td>
                  <td className="py-3.5 px-2 sm:px-4 text-slate-200">
                    +90 534 371 35 73 · info@trendmasterakademi.com
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs sm:text-sm text-cyan-300 font-mono">
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
