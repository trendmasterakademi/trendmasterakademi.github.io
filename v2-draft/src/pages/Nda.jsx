import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Download, ArrowLeft, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const Nda = () => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';

  useEffect(() => {
    document.title = isTr 
      ? "Gizlilik ve Çalışma Sözleşmesi | Trend Master Akademi"
      : "Confidentiality and Engagement Agreement | Trend Master Academy";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", isTr
        ? "Çalışmaya başlamadan önce imzaladığımız karşılıklı gizlilik ve çalışma sözleşmesinin tam metni ve sade dilli özeti."
        : "Full text and plain-language summary of the mutual confidentiality and engagement agreement signed before work begins."
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://trendmasterakademi.com/nda/');
    }
  }, [isTr]);

  return (
    <div className="pt-32 pb-28 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto text-slate-200">
      
      {/* Header & Back Link */}
      <div className="mb-12">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 font-mono transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> {isTr ? '← Ana Sayfaya Dön' : '← Back to Home'}
        </Link>
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-4 h-4" /> {isTr ? 'RESMİ NDA & ÇALIŞMA SÖZLEŞMESİ' : 'MUTUAL NDA & ENGAGEMENT AGREEMENT'}
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
          {isTr ? 'Gizlilik ve Çalışma Sözleşmesi' : 'Confidentiality and Engagement Agreement'}
        </h1>
        
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          {isTr 
            ? 'Çalışmaya başlamadan önce karşılıklı bir gizlilik ve çalışma sözleşmesi imzalıyoruz. Ne imzalayacağınızı önceden bilmeniz için sözleşmenin ne dediğini burada sade dille anlattık.' 
            : "Before any work begins, we sign a mutual confidentiality and engagement agreement. So you know what you'll be signing, here is what it says in plain language."}
        </p>
      </div>

      {/* SECTION 1: Size ne sağlıyor / What it gives you */}
      <section className="mb-14">
        <div className="border-b border-white/10 pb-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {isTr ? 'Size ne sağlıyor' : 'What it gives you'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Item 1 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isTr ? 'Müşteriniz sizin müşteriniz olarak kalır.' : 'Your client stays your client.'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isTr 
                ? 'Yazılı onayınız olmadan müşterinizle iletişime geçmez, teklif sunmaz, ticari ilişki kurmayız. Bu yükümlülük iş bittikten sonra iki yıl daha sürer.' 
                : 'We do not contact your client, pitch them or enter into any commercial relationship without your written consent. This obligation continues for two years after the work ends.'}
            </p>
          </div>

          {/* Item 2 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isTr ? 'Adımız hiçbir yerde görünmez.' : 'Our name appears nowhere.'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isTr 
                ? 'Çalışma %100 beyaz etikettir. Teslim edilen işte markamız, logomuz veya adımız yer almaz. İsterseniz iletişim sizin alan adınıza ait bir e-posta üzerinden yürür.' 
                : 'The work is 100% white-label. Our brand, logo and name do not appear in anything delivered. If you prefer, communication runs through an email address on your own domain.'}
            </p>
          </div>

          {/* Item 3 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isTr ? 'Kod ve mali haklar size geçer.' : 'Code and economic rights transfer to you.'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isTr 
                ? 'Bedel tamamlandığında; işleme, çoğaltma, yayma, temsil ve umuma iletim hakları tek tek sayılarak size devredilir. Genel bir "her hak sizindir" cümlesiyle değil, kanunun aradığı biçimde. Devraldığınız hakları üçüncü kişilere devredebilir, alt lisans verebilirsiniz.' 
                : 'Once payment is complete, the rights of adaptation, reproduction, distribution, performance and communication to the public are transferred to you — enumerated individually, as the law requires, not as a generic "everything is yours" sentence. You may transfer those rights onward or sub-license them.'}
            </p>
          </div>

          {/* Item 4 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isTr ? 'Kimliğiniz açıklanmaz.' : 'Your identity is never disclosed.'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isTr 
                ? 'Yayınladığımız vaka anlatımları kimliğe dair hiçbir ayrıntı içermez. Sizin veya müşterinizin adını referans ya da tanıtım amacıyla yazılı onayınız olmadan kullanmayız.' 
                : "The case accounts we publish contain no identifying detail. We do not use your name or your client's name for reference or promotion without your written consent."}
            </p>
          </div>

          {/* Item 5 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isTr ? 'Verileriniz için sıfatımız bellidir.' : 'Our role with your data is defined.'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isTr 
                ? 'Kişisel veri işlenmesi gerekiyorsa siz veya müşteriniz veri sorumlusu, biz veri işleyeniz. Verileri yalnızca sizin talimatınız doğrultusunda işler, iş bitiminde siler veya iade ederiz. Bir ihlalden haberdar olursak sizi 24 saat içinde bilgilendiririz.' 
                : 'Where personal data is processed, you or your client are the data controller and we are the data processor. We process data only on your instruction and delete or return it when the work ends. If we become aware of a breach, we notify you within 24 hours.'}
            </p>
          </div>

          {/* Item 6 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isTr ? 'Gizlilik iş bitince bitmez.' : 'Confidentiality outlives the engagement.'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isTr 
                ? 'Gizlilik yükümlülüğü sözleşme sona erdikten sonra beş yıl sürer; ticari sır ve kişisel veri niteliğindeki bilgilerde süresizdir.' 
                : 'It continues for five years after the agreement ends — indefinitely for trade secrets and personal data.'}
            </p>
          </div>

          {/* Item 7 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isTr ? 'İlk teşhis ücretsiz ve taahhütsüzdür.' : 'The initial diagnosis is free and carries no commitment.'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isTr 
                ? 'Bu aşamada hiçbir tarafın iş yapma veya iş verme yükümlülüğü doğmaz. Ama gizlilik teşhis aşamasında da geçerlidir — paylaştığınız her şey aynı korumaya tabidir.' 
                : 'Neither side is obliged to proceed. Confidentiality still applies at that stage — everything you share is protected the same way.'}
            </p>
          </div>

          {/* Item 8 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isTr ? 'Bedel sabittir.' : 'The fee is fixed.'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isTr 
                ? 'Teşhis tamamlandıktan sonra yazılı olarak bildirilir. Saatlik veya ucu açık çalışmıyoruz. Kapsam dışı talepler ayrıca fiyatlanır ve yazılı onayınız olmadan uygulanmaz.' 
                : 'It is confirmed in writing after the diagnosis. We do not bill hourly or open-ended. Out-of-scope requests are priced separately and never carried out without your written approval.'}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Dürüst olalım: sözleşme bizi de koruyor */}
      <section className="mb-14">
        <div className="border-b border-white/10 pb-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {isTr ? 'Dürüst olalım: sözleşme bizi de koruyor' : "Let's be straight: the agreement protects us too"}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
            {isTr 
              ? 'Yayınlanan her sözleşme gibi bu da bizim standart metnimiz ve bazı maddeleri bizim lehimize. Sonradan bulun diye saklamıyoruz — burada yazıyoruz.' 
              : "Like any published contract, this is our standard text and some clauses favour us. We're not hiding them at the bottom — they're here."}
          </p>
        </div>

        <div className="space-y-4">
          {/* Item 1 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isTr ? 'Devraldığımız koddaki eski kusurlardan sorumlu değiliz.' : 'We are not liable for pre-existing defects in code we take over.'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isTr 
                ? 'Yarım kalmış bir projeyi devralırken, bizden önce yazılmış hataların, güvenlik açıklarının ve lisans ihlallerinin sorumluluğunu üstlenemeyiz. Sorumluluğumuz, üzerinde fiilen çalıştığımız ve iş emrinde tanımlanan kapsamla sınırlıdır. Teşhiste gördüğümüz ama kapsam dışında kalan kusurları size yazılı olarak bildiririz.' 
                : 'When we inherit an unfinished project, we cannot assume responsibility for faults, security gaps or licence breaches written before us. Our liability is limited to what we actually worked on, as defined in the work order. We report in writing any defects we find that fall outside scope.'}
            </p>
          </div>

          {/* Item 2 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isTr ? 'Sorumluluğumuzun bir tavanı var.' : 'Our liability has a cap.'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isTr 
                ? <>O iş için fiilen ödenen bedeli aşmaz ve dolaylı zararları — kâr kaybı, iş kaybı, itibar kaybı — kapsamaz. <strong className="text-white">Kast ve ağır kusur bunun dışındadır</strong>; o hâllerde genel hükümler geçerlidir ve hiçbir sınırlama uygulanmaz.</>
                : <>It does not exceed the fee actually paid for that engagement and does not cover indirect losses — lost profit, lost business, reputational harm. <strong className="text-white">Intent and gross negligence are excluded from this cap</strong>; in those cases general provisions apply and no limitation operates.</>}
            </p>
          </div>

          {/* Item 3 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isTr ? 'Yöntemlerimiz ve araçlarımız bizde kalır.' : 'Our methods and tools remain ours.'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isTr 
                ? 'Sizin projeniz sizindir. Ama bizim kontrol listelerimiz, şablonlarımız ve genel amaçlı araçlarımız devrin dışındadır. Teslim edilen işte kullanılmışlarsa, o iş özelinde süresiz kullanım hakkınız olur.' 
                : 'Your project is yours. Our checklists, templates and general-purpose tooling are not part of the transfer. Where they were used in your delivery, you get an unlimited right to use them for that engagement.'}
            </p>
          </div>

          {/* Item 4 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isTr ? 'Müdahale öncesi yedek almak sizin sorumluluğunuzdadır.' : 'Taking a backup before intervention is your responsibility.'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isTr 
                ? 'İsterseniz bu konuda destek veririz; ayrıca fiyatlanabilir.' 
                : 'We can help; that support may be priced separately.'}
            </p>
          </div>

          {/* Item 5 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isTr ? 'Ödeme gecikirse çalışmayı askıya alabiliriz.' : 'We may suspend work if payment is delayed.'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isTr 
                ? 'Askı süresi teslim süresine eklenir.' 
                : 'The suspension period is added to the delivery timeline.'}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: Değiştirilebilir mi? */}
      <section className="mb-14 p-8 rounded-3xl bg-cyan-950/20 border border-cyan-500/30 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          {isTr ? 'Değiştirilebilir mi?' : 'Can it be changed?'}
        </h2>
        <div className="space-y-2 text-sm sm:text-base text-slate-300 leading-relaxed">
          <p>
            {isTr 
              ? 'Evet. Bu bizim standart metnimiz, dayatma değil. İtiraz ettiğiniz maddeyi konuşuruz — sözleşme, iki tarafın da kabul ettiği şeydir.' 
              : 'Yes. This is our standard text, not an ultimatum. If you object to a clause, we discuss it — a contract is what both sides agree to.'}
          </p>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            {isTr 
              ? 'Sözleşmenin tam metni, çalışma öncesinde tarafınıza iletilir.' 
              : 'The full text of the agreement is provided to you before work begins.'}
          </p>
        </div>
      </section>

      {/* SECTION 4: Sözleşmenin tam metni + PDF Download */}
      <section className="mb-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {isTr ? 'Sözleşmenin tam metni' : 'Full text of the agreement'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              16 Madde · Tam ve Açık Metin
            </p>
          </div>

          <a
            href="/sozlesme/tma-gizlilik-ve-calisma-sozlesmesi.pdf"
            download="tma-gizlilik-ve-calisma-sozlesmesi.pdf"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-bg-dark font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex-shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{isTr ? 'Sözleşmeyi PDF olarak indir' : 'Download the agreement (PDF)'}</span>
          </a>
        </div>

        {/* Contract Full Text Paper Container */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#0d121d] border border-white/10 text-slate-300 space-y-8 text-xs sm:text-sm leading-relaxed font-sans select-text">
          
          <div className="text-center pb-6 border-b border-white/10 space-y-2">
            <div className="text-base sm:text-lg font-black text-white tracking-wide">
              GİZLİLİK VE ÇALIŞMA SÖZLEŞMESİ
            </div>
            <p className="text-slate-400 text-xs font-mono">Trend Master Akademi — Standart B2B Sözleşme Metni</p>
          </div>

          {/* MADDE 1 */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm sm:text-base">MADDE 1 — TARAFLAR</h3>
            <p>1.1. İşbu sözleşme aşağıdaki taraflar arasında akdedilmiştir:</p>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1 font-mono text-[11px] sm:text-xs">
              <p className="text-white font-bold">HİZMET SAĞLAYICI:</p>
              <p>Trend Master Akademi markası altında faaliyet gösteren Mehmet Şahin (Şahıs İşletmesi)</p>
              <p>Konak Vergi Dairesi · VKN: 7930336132</p>
              <p>Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091 Konak / İzmir</p>
              <p>E-posta: info@trendmasterakademi.com</p>
              <p className="text-slate-400 italic">(Bundan sonra "TMA" olarak anılacaktır.)</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1 font-mono text-[11px] sm:text-xs">
              <p className="text-white font-bold">HİZMET ALAN:</p>
              <p>Unvan: ..............................................</p>
              <p>Vergi Dairesi / VKN: ................................</p>
              <p>Adres: ..............................................</p>
              <p>Yetkili & E-posta: ..................................</p>
              <p className="text-slate-400 italic">(Bundan sonra "AJANS" olarak anılacaktır.)</p>
            </div>
            <p>1.2. TMA ve AJANS birlikte "Taraflar", ayrı ayrı "Taraf" olarak anılır.</p>
          </div>

          {/* MADDE 2 */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm sm:text-base">MADDE 2 — SÖZLEŞMENİN KONUSU</h3>
            <p>2.1. İşbu sözleşme, AJANS'ın kendi müşterisine ait veya kendi bünyesindeki yazılım projelerinde TMA'dan alacağı teknik hizmetlerin gizlilik, çalışma ve mülkiyet koşullarını düzenler.</p>
            <p>2.2. Hizmetler şunlardan biri veya birkaçı olabilir: mevcut kod tabanının devralınması ve onarımı, canlı sistem arızalarına acil müdahale, mimari kurulum ve geliştirme, kapasite takviyesi, teknik denetim.</p>
            <p>2.3. İşbu sözleşme çerçeve niteliğindedir. Her iş için kapsam, süre ve bedel ayrıca İş Emri ile belirlenir. İş Emri bu sözleşmenin ayrılmaz parçasıdır ve çelişki hâlinde İş Emri'nin ilgili işe özgü hükümleri öncelikle uygulanır.</p>
          </div>

          {/* MADDE 3 */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm sm:text-base">MADDE 3 — GİZLİ BİLGİ</h3>
            <p>3.1. "Gizli Bilgi", Taraflardan birinin diğerine yazılı, sözlü, elektronik veya başka herhangi bir biçimde ilettiği; ticari, teknik, finansal veya operasyonel nitelikteki her türlü bilgiyi kapsar. Buna sınırlayıcı olmaksızın şunlar dâhildir:</p>
            <ul className="list-none space-y-1 pl-4">
              <li>a) Kaynak kod, veri tabanı yapıları, mimari şemalar, API anahtarları, erişim bilgileri</li>
              <li>b) Müşteri listeleri, müşteri kimlikleri ve ticari ilişkiler</li>
              <li>c) Fiyatlandırma, teklif ve sözleşme koşulları</li>
              <li>d) İş süreçleri, yöntemler, kontrol listeleri ve şablonlar</li>
              <li>e) Proje kapsamında öğrenilen her türlü kurumsal bilgi</li>
            </ul>
            <p>3.2. Aşağıdakiler Gizli Bilgi sayılmaz:</p>
            <ul className="list-none space-y-1 pl-4">
              <li>a) İfşa anında kamuya açık olan veya alıcı Tarafın kusuru olmaksızın sonradan kamuya açılan bilgiler</li>
              <li>b) Alıcı Tarafın ifşadan önce hukuka uygun şekilde sahip olduğu bilgiler</li>
              <li>c) Alıcı Tarafın Gizli Bilgi'den bağımsız olarak kendi geliştirdiği bilgiler</li>
              <li>d) Yetkili merci kararıyla açıklanması zorunlu bilgiler — bu hâlde açıklayan Taraf, mümkün olan en kısa sürede diğer Tarafı bilgilendirir</li>
            </ul>
          </div>

          {/* MADDE 4 */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm sm:text-base">MADDE 4 — GİZLİLİK YÜKÜMLÜLÜĞÜ (KARŞILIKLI)</h3>
            <p>4.1. Taraflar, Gizli Bilgi'yi yalnızca işbu sözleşme kapsamındaki iş için kullanır; üçüncü kişilere aktarmaz, yayımlamaz, kopyalamaz.</p>
            <p>4.2. Gizli Bilgi'ye erişim, işin gerektirdiği kişilerle sınırlıdır. Taraflar, kendi çalışanları ve alt yüklenicilerinin bu yükümlülüklere uymasından kendileri sorumludur.</p>
            <p>4.3. Gizlilik yükümlülüğü, sözleşmenin sona ermesinden itibaren 5 (beş) yıl süreyle devam eder. Ticari sır ve kişisel veri niteliğindeki bilgilerde bu süre süresizdir.</p>
            <p>4.4. İş bitiminde veya talep hâlinde, her Taraf diğerine ait Gizli Bilgi'yi iade eder veya kalıcı olarak imha eder; talep üzerine imha beyanı verir. Yedekleme sistemlerinde otomatik kalan kopyalar, erişilmediği ve süresi dolduğunda silindiği sürece bu hükmün ihlali sayılmaz.</p>
          </div>

          {/* MADDE 5 */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm sm:text-base">MADDE 5 — BEYAZ ETİKET VE MÜŞTERİYE TEMAS YASAĞI</h3>
            <p>5.1. TMA, işbu sözleşme kapsamındaki çalışmayı %100 beyaz etiket olarak yürütür. Teslim edilen işlerde TMA'nın markası, logosu veya adı yer almaz.</p>
            <p>5.2. TMA, AJANS'ın müşterisiyle AJANS'ın yazılı onayı olmaksızın doğrudan iletişime geçmez, teklif sunmaz, ticari ilişki kurmaz. Bu yükümlülük sözleşmenin sona ermesinden itibaren 2 (iki) yıl devam eder.</p>
            <p>5.3. AJANS'ın talebi hâlinde iletişim, AJANS'ın alan adına ait bir e-posta adresi üzerinden yürütülebilir.</p>
            <p>5.4. TMA, AJANS'ın veya müşterisinin kimliğini referans, vaka analizi veya tanıtım amacıyla AJANS'ın yazılı onayı olmaksızın açıklamaz. Kimliğe dair hiçbir ayrıntı içermeyen, tamamen anonimleştirilmiş teknik anlatımlar bu hükmün dışındadır.</p>
          </div>

          {/* MADDE 6 */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm sm:text-base">MADDE 6 — KİŞİSEL VERİLERİN KORUNMASI</h3>
            <p>6.1. Çalışma kapsamında kişisel veri işlenmesi hâlinde, 6698 sayılı KVKK uyarınca AJANS veya müşterisi veri sorumlusu, TMA veri işleyen sıfatını haizdir.</p>
            <p>6.2. TMA, kişisel verileri yalnızca AJANS'ın yazılı talimatı doğrultusunda ve işin gerektirdiği ölçüde işler; başka bir amaçla kullanmaz.</p>
            <p>6.3. TMA, KVKK m.12 uyarınca uygun teknik ve idari tedbirleri alır.</p>
            <p>6.4. TMA, bir veri ihlalinden haberdar olduğunda gecikmeksizin ve en geç 24 saat içinde AJANS'ı bilgilendirir. Kurul'a ve ilgili kişilere bildirim yükümlülüğü veri sorumlusuna aittir.</p>
            <p>6.5. TMA, iş bitiminde erişimindeki kişisel verileri siler veya AJANS'a iade eder.</p>
            <p>6.6. TMA, mümkün olan hâllerde gerçek kişisel veri yerine anonimleştirilmiş veya test verisi kullanılmasını talep edebilir.</p>
          </div>

          {/* MADDE 7 */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm sm:text-base">MADDE 7 — ÜCRETSİZ TEŞHİS AŞAMASI</h3>
            <p>7.1. İlk teşhis ve triyaj ücretsizdir. Bu aşamada TMA, kod tabanını, altyapıyı ve devir durumunu inceler; bulgularını yazılı olarak iletir.</p>
            <p>7.2. Teşhis aşaması hiçbir Tarafa iş yapma veya iş verme yükümlülüğü doğurmaz.</p>
            <p>7.3. Teşhis aşamasında paylaşılan bilgiler de Madde 3 ve 4 kapsamında Gizli Bilgi sayılır; teşhisin ücretsiz olması gizlilik yükümlülüğünü etkilemez.</p>
            <p>7.4. Teşhis raporu TMA'nın fikri ürünüdür ve yalnızca AJANS'ın iç değerlendirmesi için kullanılabilir; üçüncü kişilere iletilemez veya başka bir tedarikçiye iş tarifi olarak verilemez.</p>
          </div>

          {/* MADDE 8 */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm sm:text-base">MADDE 8 — BEDEL, ÖDEME VE KAPSAM</h3>
            <p>8.1. Bedel, teşhis tamamlandıktan sonra sabit tutar olarak yazılı biçimde bildirilir. TMA saatlik veya ucu açık esasla çalışmaz.</p>
            <p>8.2. Acil müdahalelerde teşhis ve sabit bedel birlikte iletilir.</p>
            <p>8.3. Ödeme koşulları her İş Emri'nde ayrıca belirlenir. Aksi kararlaştırılmadıkça:</p>
            <ul className="list-none space-y-1 pl-4">
              <li>- Acil müdahalelerde bedelin %50'si işe başlamadan, kalanı teslimde,</li>
              <li>- Planlı işlerde bedelin %40'ı işe başlamadan, kalanı teslimde ödenir.</li>
            </ul>
            <p>8.4. Kapsam değişikliği: İş Emri'nde tanımlanmayan talepler ek iş sayılır; ayrıca fiyatlanır ve yazılı onay alınmadan uygulanmaz.</p>
            <p>8.5. Ödemede gecikme hâlinde TMA, çalışmayı askıya alma hakkına sahiptir; askı süresi teslim süresine eklenir.</p>
          </div>

          {/* MADDE 9 */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm sm:text-base">MADDE 9 — FİKRİ MÜLKİYET VE MALİ HAKLARIN DEVRİ</h3>
            <p>9.1. TMA tarafından işbu sözleşme kapsamında üretilen ve 5846 sayılı FSEK anlamında eser niteliği taşıyan yazılım, kod, dokümantasyon ve tasarımlar üzerindeki mali haklar, bedelin tamamı ödendiği anda, süresiz, yer ve sayı bakımından sınırsız olarak AJANS'a devredilir.</p>
            <p>9.2. Devredilen mali haklar şunlardır ve bunlarla sınırlıdır:</p>
            <ul className="list-none space-y-1 pl-4">
              <li>a) İşleme hakkı (FSEK m.21)</li>
              <li>b) Çoğaltma hakkı (FSEK m.22)</li>
              <li>c) Yayma hakkı (FSEK m.23)</li>
              <li>d) Temsil hakkı (FSEK m.24)</li>
              <li>e) İşaret, ses ve/veya görüntü nakline yarayan araçlarla umuma iletim hakkı (FSEK m.25)</li>
            </ul>
            <p>9.3. AJANS, devraldığı hakları üçüncü kişilere devredebilir ve alt lisans verebilir.</p>
            <p>9.4. Devir, bedelin tamamının ödenmesi şartına bağlıdır. Ödeme tamamlanana kadar mali haklar TMA'da kalır; AJANS'a bu süre boyunca yalnızca test ve değerlendirme amaçlı kullanım izni verilmiştir.</p>
            <p>9.5. TMA'nın kendisine ait kalanlar: TMA'nın işbu sözleşmeden önce geliştirdiği veya sözleşmeden bağımsız olarak geliştirdiği genel amaçlı araçlar, kütüphaneler, kontrol listeleri, şablonlar ve çalışma yöntemleri devir kapsamı dışındadır. Bunlar teslim edilen işte kullanılmışsa, AJANS'a bu iş özelinde süresiz, münhasır olmayan, devredilebilir kullanım hakkı tanınır.</p>
            <p>9.6. Üçüncü taraf açık kaynak bileşenler kendi lisans koşullarına tabidir; TMA bu bileşenlerin lisans uyumluluğunu teslim raporunda belirtir.</p>
          </div>

          {/* MADDE 10 */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm sm:text-base">MADDE 10 — DEVRALINAN KOD VE MEVCUT KUSURLAR</h3>
            <p>10.1. TMA'nın devraldığı veya müdahale ettiği kod tabanı, üçüncü kişiler tarafından üretilmiş olabilir. TMA, kendi müdahalesinden önce var olan kusurlardan, güvenlik açıklarından, lisans ihlallerinden ve veri kayıplarından sorumlu değildir.</p>
            <p>10.2. TMA'nın sorumluluğu, fiilen üzerinde çalıştığı ve İş Emri'nde tanımlanan kapsamla sınırlıdır.</p>
            <p>10.3. AJANS, TMA'ya devrettiği kod, veri ve erişimler üzerinde tasarruf yetkisine sahip olduğunu beyan eder. Üçüncü kişi haklarının ihlalinden doğan talepler AJANS'a aittir.</p>
            <p>10.4. TMA, teşhis aşamasında tespit ettiği ancak kapsam dışında kalan kusurları yazılı olarak bildirir; bildirimden sonra bu kusurların giderilmemesinden doğan sonuçlardan sorumlu tutulamaz.</p>
            <p>10.5. Yedekleme: Müdahale öncesi yedek alınması AJANS'ın sorumluluğundadır. AJANS talep ederse TMA yedekleme desteği verir; bu destek ayrıca fiyatlanabilir.</p>
          </div>

          {/* MADDE 11 */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm sm:text-base">MADDE 11 — SORUMLULUK VE SINIRLARI</h3>
            <p>11.1. TMA, hizmetleri mesleki özen ve basiretli bir tacir gibi yürütür.</p>
            <p>11.2. TMA'nın işbu sözleşmeden doğan toplam sorumluluğu, ilgili İş Emri kapsamında fiilen ödenen bedeli aşamaz.</p>
            <p>11.3. TMA, dolaylı zararlardan — kâr kaybı, iş kaybı, itibar kaybı, veri kaybı, üçüncü kişi talepleri — sorumlu değildir.</p>
            <p>11.4. Bu maddedeki sınırlamalar, TMA'nın kastından ve ağır kusurundan doğan sorumluluğu kapsamaz. Bu hâllerde genel hükümler uygulanır.</p>
            <p>11.5. TMA, AJANS'ın veya müşterisinin altyapı sağlayıcılarından, üçüncü taraf servislerden veya ödeme kuruluşlarından kaynaklanan kesinti ve arızalardan sorumlu değildir.</p>
          </div>

          {/* MADDE 12 */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm sm:text-base">MADDE 12 — PERSONEL AYARTMA</h3>
            <p>12.1. Taraflar, sözleşme süresince ve sona ermesinden itibaren 1 (bir) yıl boyunca, diğer Tarafın projede fiilen görev almış çalışanına veya alt yüklenicisine doğrudan iş teklifinde bulunmaz. Kamuya açık ilanlara yapılan başvurular bu hükmün dışındadır.</p>
          </div>

          {/* MADDE 13 */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm sm:text-base">MADDE 13 — SÜRE VE FESİH</h3>
            <p>13.1. İşbu sözleşme imza tarihinde yürürlüğe girer ve Taraflardan biri 30 gün önceden yazılı bildirimle feshedene kadar yürürlükte kalır.</p>
            <p>13.2. Fesih, devam eden İş Emirlerini etkilemez; bunlar kendi koşullarına göre tamamlanır.</p>
            <p>13.3. Gizlilik (Madde 4), temas yasağı (Madde 5.2), fikri mülkiyet (Madde 9) ve sorumluluk (Madde 11) hükümleri fesihten sonra da yürürlükte kalır.</p>
            <p>13.4. Haklı sebeple derhal fesih hakkı saklıdır.</p>
          </div>

          {/* MADDE 14 */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm sm:text-base">MADDE 14 — MÜCBİR SEBEP</h3>
            <p>14.1. Doğal afet, salgın, savaş, siber saldırı, ülke çapında altyapı kesintisi ve benzeri, Tarafların kontrolü dışındaki olaylar mücbir sebep sayılır. Mücbir sebep süresince yükümlülükler askıya alınır; 30 günü aşarsa her Taraf sözleşmeyi feshedebilir.</p>
          </div>

          {/* MADDE 15 */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm sm:text-base">MADDE 15 — MUHTELİF HÜKÜMLER</h3>
            <p>15.1. Tebligat: Madde 1'deki e-posta adresleri geçerli tebligat adresi sayılır. Adres değişikliği 7 gün içinde bildirilir.</p>
            <p>15.2. Devir: Taraflar, diğerinin yazılı onayı olmaksızın sözleşmeyi devredemez.</p>
            <p>15.3. Bölünebilirlik: Bir hükmün geçersizliği diğerlerini etkilemez.</p>
            <p>15.4. Bütünlük: İşbu sözleşme ve İş Emirleri, Taraflar arasındaki anlaşmanın tamamını oluşturur.</p>
            <p>15.5. Değişiklik: Değişiklikler yazılı olarak yapılır.</p>
          </div>

          {/* MADDE 16 */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm sm:text-base">MADDE 16 — UYGULANACAK HUKUK VE YETKİ</h3>
            <p>16.1. İşbu sözleşme Türk hukukuna tabidir.</p>
            <p>16.2. Uyuşmazlıklarda İzmir Mahkemeleri ve İcra Daireleri yetkilidir.</p>
            <p>16.3. Taraflar dava yoluna başvurmadan önce 30 gün iyi niyetle uzlaşmaya çalışır.</p>
          </div>

          {/* İMZA BLOĞU */}
          <div className="pt-6 border-t border-white/10 space-y-4">
            <h3 className="font-bold text-white text-sm sm:text-base">İMZA</h3>
            <p>Taraflar, işbu sözleşmeyi okuyup anlayarak, 16 maddeden ibaret hâliyle iki nüsha olarak imza altına almıştır.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 font-mono text-[11px] sm:text-xs">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <p className="text-white font-bold">TMA</p>
                <p>Trend Master Akademi</p>
                <p>Mehmet Şahin — Şahıs İşletmesi</p>
                <p>VKN: 7930336132</p>
                <div className="pt-2">
                  <p>Tarih: ...........................</p>
                  <p className="mt-2">İmza: ............................</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <p className="text-white font-bold">AJANS</p>
                <p>Unvan: ..............................</p>
                <p>VKN: ................................</p>
                <p>Yetkili: ............................</p>
                <div className="pt-2">
                  <p>Tarih: .............................</p>
                  <p className="mt-2">İmza: ..............................</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: ⚖ ÖNCELİK KAYDI (Precedence Clause - En altta, görsel olarak ayrılmış) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-100 text-xs sm:text-sm leading-relaxed space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm sm:text-base">
          <Scale className="w-5 h-5 flex-shrink-0" />
          <span>{isTr ? '⚖ ÖNCELİK KAYDI' : '⚖ NOTICE OF PRECEDENCE'}</span>
        </div>
        {!isTr && (
          <p className="text-xs text-amber-300/80 italic">
            The following notice is provided in Turkish, the governing language of the agreement.
          </p>
        )}
        <p className="text-slate-200 leading-relaxed font-sans">
          Bu sayfa genel bilgilendirme amacıyla hazırlanmış olup taraflar arasındaki hak ve yükümlülükler akdedilecek olan ıslak/güvenli elektronik imzalı "Gizlilik ve Çalışma Sözleşmesi" metnine tabidir. Bu özet ile imzalanan sözleşme arasında çelişki olması halinde imzalı sözleşme hükümleri esas alınır.
        </p>
      </section>

    </div>
  );
};

export default Nda;
