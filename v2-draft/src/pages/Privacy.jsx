import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Lock, ArrowLeft, Mail, PhoneCall, MapPin, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDocumentTitle } from '../utils/pageTitle';

const Privacy = () => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';

  useEffect(() => {
    document.title = formatDocumentTitle(isTr 
      ? "KVKK & Gizlilik Politikası | Trend Master Akademi"
      : "Privacy Policy & NDA Commitment | Trend Master Academy");

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", isTr
        ? "Trend Master Akademi KVKK aydınlatma metni, veri sorumlusu taahhüdü, resmi NDA ve %100 White-Label gizlilik standartları."
        : "Trend Master Academy privacy policy, mutual NDA guidelines, and data protection standards."
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://trendmasterakademi.com/privacy/');
    }
  }, [isTr]);

  return (
    <div className="pt-32 pb-28 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto text-slate-200">
      
      <div className="mb-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 font-mono transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> {isTr ? '← Ana Sayfaya Dön' : '← Back to Home'}
        </Link>
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-4 h-4" /> {isTr ? 'RESMİ BİLDİRİM & GİZLİLİK' : 'LEGAL & PRIVACY'}
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
          {isTr ? 'KVKK Aydınlatma Metni & Gizlilik Politikası' : 'Privacy Policy & NDA Standard'}
        </h1>
        
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          {isTr 
            ? 'Trend Master Akademi Studio & Labs olarak, ajans çözüm ortaklarımızın ve ziyaretçilerimizin kişisel verilerinin güvenliğine, gizliliğine ve fikri mülkiyet haklarına en üst düzeyde önem veriyoruz.' 
            : 'At Trend Master Academy Studio & Labs, we adhere to the highest standards of data privacy, mutual NDA, and intellectual property protection.'}
        </p>
      </div>

      {/* NDA Guarantee Box */}
      <div className="p-6 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 mb-12 space-y-3">
        <div className="flex items-center gap-2 text-cyan-300 font-bold text-base sm:text-lg">
          <Lock className="w-5 h-5 text-cyan-400" />
          <span>{isTr ? '%100 White-Label & Katı Gizlilik Sözleşmesi (NDA) Güvencesi' : '100% White-Label & Strict Mutual NDA'}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {isTr 
            ? 'Ajansınızın ve müşterilerinizin teknik verileri, kaynak kodları, veri modelleri ve ticari sırları resmi NDA kapsamında korunur. Müşterileriniz ile asla doğrudan temas kurulmaz; tüm süreçler ajansınızın arka plan mühendislik masası olarak yürütülür.' 
            : 'All agency and client technical repositories, database schemas, and intellectual assets are protected under mutually binding NDA covenants.'}
        </p>
        <div className="pt-1">
          <Link 
            to="/nda/" 
            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono text-xs sm:text-sm font-bold transition-colors"
          >
            {isTr ? 'Sözleşmeyi okuyun →' : 'Read the agreement →'}
          </Link>
        </div>
      </div>

      {/* Policy Sections */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 bg-[#0d121d] space-y-8 text-sm sm:text-base leading-relaxed text-slate-300">
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>1. Veri Sorumlusu</span>
          </h2>
          <p>
            {isTr 
              ? '6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca; Trend Master Akademi markası altında faaliyet gösteren Mehmet Şahin (Şahıs İşletmesi, Konak Vergi Dairesi, VKN: 7930336132, Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091 Konak / İzmir), veri sorumlusu sıfatıyla hareket etmektedir.' 
              : 'Under applicable privacy legislation; Mehmet Şahin operating under the brand Trend Master Akademi (Sole Proprietorship, Konak Tax Office, Tax ID: 7930336132, Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091 Konak / Izmir, Email: info@trendmasterakademi.com) acts as the Data Controller.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>2. İşlenen Kişisel Veriler ve Toplama Yöntemleri</span>
          </h2>
          <p>
            {isTr 
              ? 'Web sitemizdeki iletişim formları, Crash Test kriz simülatörü ve acil SOS bildirim modülleri vasıtasıyla ad-soyad, kurumsal e-posta adresi, telefon/WhatsApp numarası, şirket/ajans unvanı ve paylaşılan teknik kriz özeti işlenmektedir.' 
              : 'Data processed includes name, email, phone number, agency title, and submitted technical triage briefs.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>3. Kişisel Verilerin İşlenme Amaçları</span>
          </h2>
          <ul className="space-y-2 list-disc list-inside text-slate-300">
            <li>{isTr ? 'Acil teknik triyaj, kod incelemesi ve eylem planı hazırlanması' : 'Emergency technical triage and blueprint generation'}</li>
            <li>{isTr ? 'Doğrudan kıdemli mühendislik masamız ile iletişim ve tekliflendirme süreçlerinin yürütülmesi' : 'Direct engineering triage and proposal delivery'}</li>
            <li>{isTr ? 'Talep edilen Crash Test analiz raporunun ilgilinin e-posta adresine iletilmesi' : 'Sending requested diagnostics reports'}</li>
            <li>{isTr ? 'Yasal yükümlülüklerin yerine getirilmesi' : 'Fulfilling legal regulatory requirements'}</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>4. Üçüncü Taraflarla Paylaşım Yasağı</span>
          </h2>
          <p>
            {isTr 
              ? 'Toplanan hiçbir kişisel veya ticari veri; reklam, pazarlama, kiralama veya satma amacıyla 3. taraf kişi, kurum veya platformlarla kesinlikle paylaşılmaz.' 
              : 'No collected data is ever sold, rented, or transferred to 3rd party marketing brokers.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>5. Çerezler ve Analitik Araçları (Google Analytics & Microsoft Clarity)</span>
          </h2>
          <p>
            {isTr 
              ? 'Sitemizde temel oturum işlevlerinin yanı sıra kullanıcı deneyimini analiz etmek ve hataları teşhis etmek amacıyla Google Analytics 4 (GA4) ve Microsoft Clarity kullanılmaktadır. Bu ölçüm araçları yalnızca kullanıcı çerez bildiriminde "Kabul Et" butonunu tıkladığında (Google Consent Mode v2 standartlarında) aktifleşir. Kullanıcıların formlara girdiği hassas kriz detayları ve özel veriler Microsoft Clarity üzerinde katı bir şekilde maskelenmektedir.' 
              : 'Our website utilizes Google Analytics 4 (GA4) and Microsoft Clarity for technical diagnostics and experience optimization. Tracking scripts only activate upon explicit consent under Google Consent Mode v2. All sensitive input fields and private form details are strictly masked.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>6. İletişim & Haklarınız</span>
          </h2>
          <p>
            {isTr 
              ? 'KVKK m.11 kapsamındaki haklarınızı kullanmak, verilerinizin silinmesini veya güncellenmesini talep etmek için aşağıdaki kanallardan veri sorumlusuna başvurabilirsiniz:' 
              : 'To exercise your data privacy rights, contact us at:'}
          </p>
          <div className="pt-2 text-sm font-mono space-y-1.5 text-cyan-300">
            <div>✉️ E-posta: <a href="mailto:info@trendmasterakademi.com" className="hover:underline text-white">info@trendmasterakademi.com</a></div>
            <div>📞 Telefon: <a href="tel:+905343713573" className="hover:underline text-white">+90 534 371 35 73</a></div>
            <div>📍 Adres: Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091 Konak / İzmir</div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Privacy;
