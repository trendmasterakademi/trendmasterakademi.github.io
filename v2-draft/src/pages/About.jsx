import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Server, Lock, Cpu, ArrowRight, ArrowLeft, Zap, PhoneCall, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCalendlyUrl } from '../utils/calendly';
import { formatDocumentTitle } from '../utils/pageTitle';
import { isTurkish } from '../i18n';

const About = () => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);

  useEffect(() => {
    document.title = formatDocumentTitle(isTr 
      ? "Mühendislik Standartlarımız | Trend Master Akademi"
      : "Engineering Standards & About | Trend Master Academy");

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
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 md:px-8 bg-[var(--paper)] text-[var(--ink)] relative font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Back to Home Link */}
        <div className="flex items-center justify-start">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-[var(--ink-secondary)] hover:text-[var(--accent)] font-mono transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {isTr ? '← Ana Sayfaya Dön' : '← Back to Home'}
          </Link>
        </div>

        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[var(--accent)] text-xs font-mono font-semibold uppercase tracking-wider">
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
          <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[var(--ink)] tracking-tight">
            {isTr ? 'Trend Master Akademi Adı Nereden Geliyor?' : 'Where Does the Name "Akademi" Come From?'}
          </h3>
          
          {isTr ? (
            <div className="space-y-3 text-[var(--ink-secondary)] text-base sm:text-lg leading-relaxed">
              <p>
                Aslında bu iş fikri bir online derste doğdu.
              </p>
              <p>
                Yirmi yıldır finansal piyasaların içerisindeydim. Yazılım hep işimin ayrılmaz bir parçasıydı ama uzun süre yalnızca kendim için: kendi sistemlerimi yazdım, kendi fikirlerimi koda döktüm, kendi hatalarımı kendim ayıkladım.{' '}
                <Link
                  to="/hikayemiz/"
                  className="text-[var(--accent)] hover:underline font-semibold transition-colors inline-block"
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
                  to="/hikayemiz/"
                  className="text-[var(--accent)] hover:underline font-semibold transition-colors inline-block"
                >
                  Read more...
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* 4 Core Pillars Section */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[var(--ink)] tracking-tight">
              {isTr ? 'Dört Temel Mühendislik Standardımız' : 'Our Four Engineering Pillars'}
            </h2>
            <p className="text-[var(--ink-secondary)] text-sm sm:text-base">
              {isTr 
                ? 'Ajanslarla çalışırken taviz vermediğimiz 4 temel operasyonel ve hukuki kuralımız.' 
                : '4 non-negotiable operational and legal principles when collaborating with agencies.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-xl border border-[var(--rule)] bg-[var(--surface)] space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-[var(--paper)] text-[var(--accent)] flex items-center justify-center font-mono font-bold text-base border border-[var(--rule)]">
                01
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[var(--ink)]">
                {isTr ? '%100 White-Label & Görünmezlik' : '100% White-Label & Invisible Delivery'}
              </h3>
              <p className="text-[var(--ink-secondary)] text-sm sm:text-base leading-relaxed">
                {isTr 
                  ? 'Müşteriniz hiçbir zaman bizim adımızı duymaz. Projeler ajansınızın markası, logosu ve kurumsal kimliği altında teslim edilir. İletişim isterseniz ajans alan adı e-postanız üzerinden yürütülür.' 
                  : 'Your client never sees our brand. Work is delivered under your agency credentials, domain email, and repository namespaces.'}
              </p>
            </div>

            <div className="p-8 rounded-xl border border-[var(--rule)] bg-[var(--surface)] space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-[var(--paper)] text-[var(--accent)] flex items-center justify-center font-mono font-bold text-base border border-[var(--rule)]">
                02
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[var(--ink)]">
                {isTr ? 'Resmi NDA & Fikri Mülkiyet Devri' : 'Binding Legal NDA & Total IP Transfer'}
              </h3>
              <p className="text-[var(--ink-secondary)] text-sm sm:text-base leading-relaxed">
                {isTr 
                  ? 'Projeye başlamadan önce bağlayıcı Gizlilik Sözleşmesi (NDA) imzalanır. Geliştirilen tüm kaynak kodlar, mimari ve fikri mülkiyet %100 ajansınıza ve müşterinize aittir.' 
                  : 'Prior to work, a binding NDA is executed. All source code, architecture, and IP belong 100% to your agency and client.'}
              </p>
              <div className="pt-1">
                <Link 
                  to="/nda/" 
                  className="btn-link inline-flex items-center gap-1 font-mono text-xs sm:text-sm font-semibold"
                >
                  {isTr ? 'Sözleşmeyi okuyun →' : 'Read the agreement →'}
                </Link>
              </div>
            </div>

            <div className="p-8 rounded-xl border border-[var(--rule)] bg-[var(--surface)] space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-[var(--paper)] text-[var(--accent)] flex items-center justify-center font-mono font-bold text-base border border-[var(--rule)]">
                03
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[var(--ink)]">
                {isTr ? 'Şeffaf Ücretlendirme' : 'Transparent Pricing'}
              </h3>
              <p className="text-[var(--ink-secondary)] text-sm sm:text-base leading-relaxed">
                {isTr 
                  ? 'İlk kod teşhisi ve triyaj ücretsizdir. Sonraki çalışmanın kapsamı ve bedeli teşhis tamamlandıktan sonra işe özel belirlenir; bedel piyasa koşullarıyla uyumludur ve çalışma başlamadan önce yazılı olarak netleşir. Acil müdahalelerde teşhis ve bedel birlikte iletilir.' 
                  : 'The initial code diagnosis and triage are free. The scope and price of any subsequent work are set per engagement once the diagnosis is complete; pricing is aligned with prevailing market rates and is confirmed in writing before work begins. For emergency response, the diagnosis and the price are delivered together.'}
              </p>
            </div>

            <div className="p-8 rounded-xl border border-[var(--rule)] bg-[var(--surface)] space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-[var(--paper)] text-[var(--accent)] flex items-center justify-center font-mono font-bold text-base border border-[var(--rule)]">
                04
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[var(--ink)]">
                {isTr ? 'Doğrudan Mühendislik Masası Muhatabı' : 'Direct Senior Engineering Contact'}
              </h3>
              <p className="text-[var(--ink-secondary)] text-sm sm:text-base leading-relaxed">
                {isTr 
                  ? 'Arada teknik bilgisi olmayan satış temsilcileri veya bürokrasi katmanları yoktur. İletişim doğrudan projeyi yürüten kıdemli mühendislik masamız üzerinden anlık yürütülür.' 
                  : 'No non-technical intermediaries or ticket queues. You interface directly with senior system architects and backend engineers.'}
              </p>
            </div>

            <div className="p-8 rounded-xl border border-[var(--rule)] bg-[var(--surface)] space-y-4 md:col-span-2 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-[var(--paper)] text-[var(--accent)] flex items-center justify-center font-mono font-bold text-base border border-[var(--rule)]">
                05
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[var(--ink)]">
                {isTr ? 'Süreklilik Güvencesi' : 'Continuity Guarantee'}
              </h3>
              <div className="text-[var(--ink-secondary)] text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  {isTr 
                    ? 'Kriz masası tek kişilik değildir. Bir işi başlatan mühendis herhangi bir sebeple devre dışı kalırsa masadaki bir başkası devralır; başlamış iş yarıda kalmaz.' 
                    : 'The response desk is not a single person. If the engineer who started an engagement becomes unavailable for any reason, another member of the desk takes over; work already under way is not left unfinished.'}
                </p>
                <p>
                  {isTr 
                    ? 'Bunun ötesinde kodunuz hiçbir aşamada bizde rehin kalmaz. Repo süreç boyunca ajansınızın kontrolündedir ve dokümantasyon iş ilerledikçe teslim edilir. Çalışma herhangi bir sebeple kesilse dahi elinizde çalışan sistem ve eksiksiz kaynak kod kalır.' 
                    : 'Beyond that, your code is never held by us at any stage. The repository stays under your agency\'s control throughout, and documentation is handed over as the work progresses. Even if an engagement is interrupted for any reason, you are left with a working system and the complete source.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <div className="p-8 sm:p-12 rounded-xl bg-[var(--surface)] border border-[var(--rule)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-serif font-semibold text-[var(--ink)]">
              {isTr ? 'Ajansınız İçin Mühendislik Masası Oluşturun' : 'Establish Your Engineering Backline Today'}
            </h3>
            <p className="text-[var(--ink-secondary)] text-sm max-w-xl">
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
              className="btn-primary w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-center gap-2 text-center"
            >
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{isTr ? 'Takvimden 30 Dakikalık Görüşme Seç' : 'Schedule a 30-Minute Call'}</span>
            </a>
            <Link
              to="/agency/"
              className="btn-secondary w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-center gap-2 text-center"
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
