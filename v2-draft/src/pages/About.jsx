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
        </div>

        {/* Brand Story Section */}
        <section className="max-w-3xl mx-auto space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed pt-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight border-b border-white/10 pb-4">
            {isTr ? "Trend Master Akademi'nin hikâyesi" : "The Trend Master Akademi story"}
          </h2>

          {isTr ? (
            <div className="space-y-6">
              <p>
                Aslında bu iş fikri bir online derste doğdu.
              </p>
              <p>
                Yirmi yıldır finansal piyasaların içerisindeydim. Yazılım hep işimin ayrılmaz bir parçasıydı ama uzun süre yalnızca kendim için: kendi sistemlerimi yazdım, kendi fikirlerimi koda döktüm, kendi hatalarımı kendim ayıkladım. Dışarıya iş yapmıyordum, yapmak da istemiyordum. Yirmi yıl boyunca bunun tek kişilik bir iş olduğunu, ancak kendime yetebileceğimi sanıyordum.
              </p>
              <p>
                2020'de, COVID salgınında her şeyin durduğu ve herkesin kıtlık konuştuğu dönemde, ben de o dönemi zor geçirenlerden biri olarak bildiğimi anlatmaya başladım. Derken yaklaşık elli kişi eğittim. Beklemediğim bir şey oldu: öğretmek beni değiştirdi. Yirmi yıldır sezgiyle yaptığım her şeyi bir başkasının anlayabileceği hâle getirmek, bakış açım dahil her anlamda değişmemi sağladı. Dağınık olan her şey sistemleşti.
              </p>
              <p className="font-bold text-white">
                Trend Master Akademi fikri o online derslerde doğdu. Adımız oradan geliyor ve değiştirmedik.
              </p>
              <p>
                O elli kişiden biri dikkatimi çekti. Teknik tarafta değil — anlatışında, olaylara bakışında, bende hiç olmayan bir şey vardı: hitabet, pazarlama, gerçek piyasalara adaptasyon. Kurs bitti, ilişkimiz bitmedi. Bir süre sonra ortağım oldu. Yirmi yıl tek başına çalışmış biri için bu, sandığımdan büyük bir değişiklikti. Bu sayfada "biz" diyorsak, o günden beri diyoruz.
              </p>
              <p>
                Sonra ikimiz de aynı şeyi gördük: asıl ihtiyaç sınıfta değil sahada. Yazılım talepleri gelmeye başladı; aldık, iyi de gitti.
              </p>
              <p>
                Asıl dönüm noktası ajanslarda oldu. Pandemiden sonra nitelikli yazılımcı kıtlığı vardı — o dönem üniversiteden çıkan kuşak eksik yetişti. Ajanslar projenin neredeyse her aşamasını bir başkasına yaptırıyor, çoğundan enkaz çıkıyordu. Yarım kalmış kod, kaybolmuş erişimler, geçmiş teslim tarihi, sinirini tutamayan müşteri. Böyle birkaç proje önümüze geldi. Çözdük.
              </p>
              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border-l-4 border-cyan-400 text-white font-bold text-lg sm:text-xl">
                Bir gün ortağım şunu sordu: "Bunu neden ülke çapına yaymıyoruz?"
              </div>
              <p>
                Bugün yaptığımız iş bu. Biz bir son kullanıcı ajansı değiliz; dijital ajansların, yazılım evlerinin ve girişimlerin arka planında krizleri çözen, karmaşık mimarileri kuran ve %100 white-label çalışan bir back-office ve yazılım eviyiz.
              </p>
              <p>
                Adımız hâlâ "Akademi" — çünkü işin eğitimini önemsiyoruz. Bu sitedeki <Link to="/sozluk/" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">Terim Sözlüğü</Link> de o yüzden var: geliştirici dilini ajans diline çeviriyor. Ve hâlâ aynı disiplin geçerli: bir sistemi kurtarmak, onu anlatabilecek kadar anlamayı gerektirir. Anlatamadığın kod tabanını zaten onaramazsın — yani "Akademi" adı, yaptığımız işin yabancısı değil kaynağı oluyor.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <p>
                This business actually started in an online class.
              </p>
              <p>
                I spent twenty years inside financial markets. Software was always inseparable from that work — but for a long time only for myself: I wrote my own systems, turned my own ideas into code, debugged my own mistakes. I didn't work for anyone else, and I didn't want to. For twenty years I believed this was a one-person job, that I only ever needed to be enough for myself.
              </p>
              <p>
                In 2020, when COVID stopped everything and everyone was talking about scarcity, I started teaching what I knew — as someone having a hard time in that period myself. I ended up training around fifty people. Something unexpected happened: teaching changed me. Having to turn twenty years of instinct into something another person could follow changed everything, including how I saw the work. What had been scattered became a system.
              </p>
              <p className="font-bold text-white">
                The idea for Trend Master Akademi was born in those online classes. That is where our name comes from, and we never changed it.
              </p>
              <p>
                One of those fifty stood out. Not on the technical side — in how they explained things, in how they read a situation, there was something I had never had: presence, marketing instinct, an ability to adapt to real markets. The course ended; the relationship didn't. Some time later they became my partner. For someone who had worked alone for twenty years, that was a bigger change than I expected. When this page says "we", it has meant that since that day.
              </p>
              <p>
                Then we both saw the same thing: the real need wasn't in the classroom, it was in the field. Software requests started coming in. We took them, and it went well.
              </p>
              <p>
                The real turning point came with agencies. After the pandemic there was a genuine shortage of qualified developers — the cohort leaving university in those years came out underprepared. Agencies were outsourcing nearly every stage of a project, and most of it came back as wreckage. Half-finished code, lost credentials, a missed deadline, a client out of patience. A few projects like that landed in front of us. We fixed them.
              </p>
              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border-l-4 border-cyan-400 text-white font-bold text-lg sm:text-xl">
                One day my partner asked: "Why aren't we taking this nationwide?"
              </div>
              <p>
                That's what we do today. We are not an end-client agency; we are a back-office and software house working behind digital agencies, software houses and startups — resolving crises, building complex architectures, operating 100% white-label.
              </p>
              <p>
                Our name is still "Akademi", because we take the teaching side of this work seriously. That is also why the <Link to="/sozluk/" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">Glossary</Link> exists on this site: it translates developer language into agency language. And the same discipline still holds: rescuing a system requires understanding it well enough to explain it. You cannot repair a codebase you cannot explain — which makes "Akademi" not a stranger to the work we do, but its source.
              </p>
            </div>
          )}
        </section>

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
