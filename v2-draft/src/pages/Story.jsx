import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BookOpen, ShieldCheck, ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCalendlyUrl } from '../utils/calendly';

const Story = () => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';

  useEffect(() => {
    document.title = isTr 
      ? "Hikâyemiz & Kuruluş Anlatısı | Trend Master Akademi"
      : "Our Story & Origins | Trend Master Academy";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", isTr
        ? "Trend Master Akademi'nin kuruluş hikâyesi: 20 yıllık finansal piyasa yazılım geçmişimiz, online derslerden doğan Akademi adı ve ajansların görünmez mühendislik masası olma vizyonumuz."
        : "The story of Trend Master Akademi: 20 years of financial software development, our roots in online education, and our evolution into the invisible engineering backline for agencies."
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://trendmasterakademi.com/hikayemiz/');
    }
  }, [isTr]);

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 md:px-8 bg-[#080b11] text-slate-200 relative font-sans">
      {/* Ambience glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#1f293d_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Back to Home Link */}
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {isTr ? '← Ana Sayfaya Dön' : '← Back to Home'}
          </Link>
          <Link 
            to="/about/" 
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            <span>{isTr ? 'Mühendislik Standartlarımız' : 'Engineering Standards'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Brand Story Section */}
        <section className="space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" /> {isTr ? 'MARKA HİKÂYEMİZ' : 'OUR STORY'}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight border-b border-white/10 pb-6">
            {isTr ? "Trend Master Akademi'nin hikâyesi" : "The Trend Master Akademi story"}
          </h1>

          {isTr ? (
            <div className="space-y-6 pt-2">
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
              <div className="p-5 rounded-2xl bg-white/5 border-l-4 border-cyan-400 text-white font-bold text-lg sm:text-xl">
                Bir gün ortağım şunu sordu: "Bunu neden ülke çapına yaymıyoruz?"
              </div>
              <p>
                Bugün yaptığımız iş bu. Biz bir son kullanıcı ajansı değiliz; dijital ajansların, yazılım evlerinin ve girişimlerin arka planında krizleri çözen, karmaşık mimarileri kuran ve %100 white-label çalışan bir back-office ve yazılım eviyiz.
              </p>
              <p>
                Adımız hâlâ "Akademi" — çünkü işin eğitimini önemsiyoruz. Bu sitedeki <Link to="/sozluk/" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">Terim Sözlüğü</Link> de o yüzden var: geliştirici dilini ajans diline çeviriyor. Ve hâlâ aynı disiplin geçerli: bir sistemi kurtarmak, onu anlatabilecek kadar anlamayı gerektirir. Anlatamadığın kod tabanını zaten onaramazsın — yani "Akademi" adı, yaptığımız işin yabancısı değil kaynağı oluyor.
              </p>
              <p>
                Bu, kuruluşun hikâyesi. Masa o günden bu yana büyüdü — bugün işi yürüten ekip daha fazla kişiden oluşuyor.
              </p>
            </div>
          ) : (
            <div className="space-y-6 pt-2">
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
              <div className="p-5 rounded-2xl bg-white/5 border-l-4 border-cyan-400 text-white font-bold text-lg sm:text-xl">
                One day my partner asked: "Why aren't we taking this nationwide?"
              </div>
              <p>
                That's what we do today. We are not an end-client agency; we are a back-office and software house working behind digital agencies, software houses and startups — resolving crises, building complex architectures, operating 100% white-label.
              </p>
              <p>
                Our name is still "Akademi", because we take the teaching side of this work seriously. That is also why the <Link to="/sozluk/" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">Glossary</Link> exists on this site: it translates developer language into agency language. And the same discipline still holds: rescuing a system requires understanding it well enough to explain it. You cannot repair a codebase you cannot explain — which makes "Akademi" not a stranger to the work we do, but its source.
              </p>
              <p>
                This is the story of how it started. The desk has grown since — the team running the work today is larger.
              </p>
            </div>
          )}
        </section>

        {/* Transition Cards to Standards & Calendly */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-white/10 flex flex-col justify-between gap-4">
            <div className="space-y-1 text-left">
              <h3 className="text-lg font-bold text-white">
                {isTr ? 'Mühendislik Standartlarımızı İnceleyin' : 'Explore Our Engineering Standards'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                {isTr ? '%100 White-Label, Resmi NDA, Şeffaf Ücretlendirme ve Doğrudan Mühendislik Masası prensiplerimiz.' : '100% White-Label, Binding NDA, Transparent Pricing and Direct Engineering Desk.'}
              </p>
            </div>
            <Link
              to="/about/"
              className="px-6 py-3.5 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors w-full sm:w-fit"
            >
              <span>{isTr ? 'Standartlarımızı Görün' : 'View Standards'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col justify-between gap-4">
            <div className="space-y-1 text-left">
              <h3 className="text-lg font-bold text-white">
                {isTr ? 'Birlikte Çalışmayı Konuşalım' : "Let's Discuss Working Together"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                {isTr ? 'Ekibiniz veya projeniz için uygun zamanı belirleyin, doğrudan teknik masa ile görüşün.' : 'Select a time for your agency or project to consult directly with senior engineering.'}
              </p>
            </div>
            <a
              href={getCalendlyUrl('story_end')}
              target="_blank"
              rel="noreferrer"
              onClick={() => window.trackEvent && window.trackEvent('calendar_clicked', { source: 'story_end' })}
              className="px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-bg-dark font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 w-full sm:w-fit"
            >
              <Calendar className="w-4 h-4" />
              <span>{isTr ? '30 dakikalık teknik tanışma görüşmesi →' : '30-minute technical intro call →'}</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Story;
