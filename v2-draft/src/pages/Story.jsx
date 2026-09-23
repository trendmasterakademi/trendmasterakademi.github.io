import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BookOpen, ShieldCheck, ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCalendlyUrl } from '../utils/calendly';
import { setPageSeo } from '../utils/pageTitle';
import { isTurkish } from '../i18n';
import { storyH1 } from '../data/pageH1Data';

const Story = () => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);

  useEffect(() => {
    setPageSeo(isTr ? '/hikayemiz/' : '/story/', isTr ? 'tr' : 'en');
  }, [isTr]);

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 md:px-8 bg-[var(--paper)] text-[var(--ink)] relative font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Back to Home Link */}
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-[var(--accent)] hover:underline font-mono transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" /> {isTr ? '← Ana Sayfaya Dön' : '← Back to Home'}
          </Link>
          <Link 
            to="/about/" 
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors min-h-[44px]"
          >
            <span>{isTr ? 'Mühendislik Standartlarımız' : 'Engineering Standards'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Brand Story Section */}
        <section className="space-y-6 text-[var(--ink)] text-base sm:text-lg leading-relaxed">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-[var(--accent-soft)] border border-[var(--accent)] text-[var(--accent)] text-xs font-mono font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" /> {isTr ? 'MARKA HİKÂYEMİZ' : 'OUR STORY'}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold font-serif text-[var(--ink)] tracking-tight leading-tight border-b border-[var(--rule)] pb-6">
            {storyH1[isTr ? 'tr' : 'en']}
          </h1>

          <div className="flex items-center gap-4 py-2 border-b border-[var(--rule)]">
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
              <div className="text-base sm:text-lg font-semibold text-[var(--ink)]">Mehmet Şahin</div>
              <div className="text-xs font-mono text-[var(--accent)] font-medium">
                {isTr ? 'Kurucu & Baş Yazılım Mimarı' : 'Founder & Lead Software Architect'}
              </div>
            </div>
          </div>

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
              <p className="font-semibold text-[var(--ink)]">
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
              <div className="p-5 rounded bg-[var(--surface)] border-l-4 border-[var(--accent)] text-[var(--ink)] font-semibold text-lg sm:text-xl shadow-sm">
                Bir gün ortağım şunu sordu: "Bunu neden ülke çapına yaymıyoruz?"
              </div>
              <p>
                Bugün yaptığımız iş bu. Biz bir son kullanıcı ajansı değiliz; dijital ajansların, yazılım evlerinin ve girişimlerin arka planında krizleri çözen, karmaşık mimarileri kuran ve %100 white-label çalışan bir back-office ve yazılım eviyiz.
              </p>
              <p>
                Adımız hâlâ "Akademi" — çünkü işin eğitimini önemsiyoruz. Bu sitedeki <Link to="/sozluk/" className="text-[var(--accent)] hover:underline underline-offset-2">Terim Sözlüğü</Link> de o yüzden var: geliştirici dilini ajans diline çeviriyor. Ve hâlâ aynı disiplin geçerli: bir sistemi kurtarmak, onu anlatabilecek kadar anlamayı gerektirir. Anlatamadığın kod tabanını zaten onaramazsın — yani "Akademi" adı, yaptığımız işin yabancısı değil kaynağı oluyor.
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
              <p className="font-semibold text-[var(--ink)]">
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
              <div className="p-5 rounded bg-[var(--surface)] border-l-4 border-[var(--accent)] text-[var(--ink)] font-semibold text-lg sm:text-xl shadow-sm">
                One day my partner asked: "Why aren't we taking this nationwide?"
              </div>
              <p>
                That's what we do today. We are not an end-client agency; we are a back-office and software house working behind digital agencies, software houses and startups — resolving crises, building complex architectures, operating 100% white-label.
              </p>
              <p>
                Our name is still "Akademi", because we take the teaching side of this work seriously. That is also why the <Link to="/glossary/" className="text-[var(--accent)] hover:underline underline-offset-2">Glossary</Link> exists on this site: it translates developer language into agency language. And the same discipline still holds: rescuing a system requires understanding it well enough to explain it. You cannot repair a codebase you cannot explain — which makes "Akademi" not a stranger to the work we do, but its source.
              </p>
              <p>
                This is the story of how it started. The desk has grown since — the team running the work today is larger.
              </p>
            </div>
          )}
        </section>

        {/* Transition Cards to Standards & Calendly */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 rounded bg-[var(--surface)] border border-[var(--rule)] flex flex-col justify-between gap-4 shadow-sm">
            <div className="space-y-1 text-left">
              <h3 className="text-lg font-semibold font-serif text-[var(--ink)]">
                {isTr ? 'Mühendislik Standartlarımızı İnceleyin' : 'Explore Our Engineering Standards'}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--ink-muted)]">
                {isTr ? '%100 White-Label, Resmi NDA, Şeffaf Ücretlendirme ve Doğrudan Mühendislik Masası prensiplerimiz.' : '100% White-Label, Binding NDA, Transparent Pricing and Direct Engineering Desk.'}
              </p>
            </div>
            <Link
              to="/about/"
              className="px-6 py-3 rounded bg-[var(--paper)] hover:bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink)] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors w-full sm:w-fit min-h-[44px]"
            >
              <span>{isTr ? 'Standartlarımızı Görün' : 'View Standards'}</span>
              <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
            </Link>
          </div>

          <div className="p-6 sm:p-8 rounded bg-[var(--surface)] border border-[var(--rule)] flex flex-col justify-between gap-4 shadow-sm">
            <div className="space-y-1 text-left">
              <h3 className="text-lg font-semibold font-serif text-[var(--ink)]">
                {isTr ? 'Birlikte Çalışmayı Konuşalım' : "Let's Discuss Working Together"}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--ink-muted)]">
                {isTr ? 'Ekibiniz veya projeniz için uygun zamanı belirleyin, doğrudan teknik masa ile görüşün.' : 'Select a time for your agency or project to consult directly with senior engineering.'}
              </p>
            </div>
            <a
              href={getCalendlyUrl('story_end')}
              target="_blank"
              rel="noreferrer"
              onClick={() => window.trackEvent && window.trackEvent('calendar_clicked', { source: 'story_end' })}
              className="px-6 py-3 rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm w-full sm:w-fit min-h-[44px]"
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
