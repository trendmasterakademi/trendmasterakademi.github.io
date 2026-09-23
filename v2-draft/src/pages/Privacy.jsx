import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Lock, ArrowLeft, Mail, PhoneCall, MapPin, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { setPageSeo } from '../utils/pageTitle';
import { isTurkish } from '../i18n';
import { privacyH1 } from '../data/pageH1Data';

const Privacy = () => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);

  useEffect(() => {
    setPageSeo('/privacy/', isTr ? 'tr' : 'en');
  }, [isTr]);

  return (
    <div className="min-h-screen pt-32 pb-28 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto bg-[var(--paper)] text-[var(--ink)] font-sans selection:bg-[var(--accent)] selection:text-[var(--on-accent)]">
      
      <div className="mb-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-[var(--accent)] hover:underline font-mono transition-colors mb-6 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" /> {isTr ? '← Ana Sayfaya Dön' : '← Back to Home'}
        </Link>
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--accent)] text-xs font-mono font-medium uppercase tracking-wider mb-4">
          <ShieldCheck className="w-4 h-4" /> {isTr ? 'RESMİ BİLDİRİM & GİZLİLİK' : 'LEGAL & PRIVACY'}
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-[var(--ink)] tracking-tight mb-6">
          {privacyH1[isTr ? 'tr' : 'en']}
        </h1>
        
        <p className="text-[var(--ink-2)] text-base sm:text-lg leading-relaxed">
          {isTr 
            ? 'Trend Master Akademi Studio & Labs olarak, ajans çözüm ortaklarımızın ve ziyaretçilerimizin kişisel verilerinin güvenliğine, gizliliğine ve fikri mülkiyet haklarına en üst düzeyde önem veriyoruz.' 
            : 'At Trend Master Akademi Studio & Labs, we adhere to the highest standards of data privacy, mutual NDA, and intellectual property protection.'}
        </p>
      </div>

      {/* NDA Guarantee Box */}
      <div className="p-6 rounded-2xl bg-[var(--accent-wash)] border border-[var(--accent)]/30 mb-12 space-y-3">
        <div className="flex items-center gap-2 text-[var(--ink)] font-semibold text-base sm:text-lg">
          <Lock className="w-5 h-5 text-[var(--accent)]" />
          <span>{isTr ? '%100 White-Label & Katı Gizlilik Sözleşmesi (NDA) Güvencesi' : '100% White-Label & Strict Mutual NDA'}</span>
        </div>
        <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
          {isTr 
            ? 'Ajansınızın ve müşterilerinizin teknik verileri, kaynak kodları, veri modelleri ve ticari sırları resmi NDA kapsamında korunur. Müşterileriniz ile asla doğrudan temas kurulmaz; tüm süreçler ajansınızın arka plan mühendislik masası olarak yürütülür.' 
            : 'All agency and client technical repositories, database schemas, and intellectual assets are protected under mutually binding NDA covenants.'}
        </p>
        <div className="pt-1">
          <Link 
            to="/nda/" 
            className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline font-mono text-xs sm:text-sm font-semibold transition-colors min-h-[44px]"
          >
            {isTr ? 'Sözleşmeyi okuyun →' : 'Read the agreement →'}
          </Link>
        </div>
      </div>

      {/* Policy Sections */}
      <div className="p-8 sm:p-12 rounded-2xl border border-[var(--rule)] bg-[var(--surface)] space-y-8 text-sm sm:text-base leading-relaxed text-[var(--ink-2)] shadow-sm">
        
        <section className="space-y-3">
          <h2 className="text-xl font-serif font-semibold text-[var(--ink)] flex items-center gap-2">
            <span>1. Veri Sorumlusu</span>
          </h2>
          <p>
            {isTr 
              ? '6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca; Trend Master Akademi markası altında faaliyet gösteren Mehmet Şahin (Şahıs İşletmesi, Konak Vergi Dairesi, VKN: 7930336132, Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091 Konak / İzmir), veri sorumlusu sıfatıyla hareket etmektedir.' 
              : 'Under applicable privacy legislation; Mehmet Şahin operating under the brand Trend Master Akademi (Sole Proprietorship, Konak Tax Office, Tax ID: 7930336132, Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091 Konak / Izmir, Email: info@trendmasterakademi.com) acts as the Data Controller.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-serif font-semibold text-[var(--ink)] flex items-center gap-2">
            <span>2. İşlenen Kişisel Veriler ve Toplama Yöntemleri</span>
          </h2>
          <p>
            {isTr 
              ? 'Web sitemizdeki iletişim formları, Crash Test kriz simülatörü ve acil SOS bildirim modülleri vasıtasıyla ad-soyad, kurumsal e-posta adresi, telefon/WhatsApp numarası, şirket/ajans unvanı ve paylaşılan teknik kriz özeti işlenmektedir.' 
              : 'Data processed includes name, email, phone number, agency title, and submitted technical triage briefs.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-serif font-semibold text-[var(--ink)] flex items-center gap-2">
            <span>3. Kişisel Verilerin İşlenme Amaçları</span>
          </h2>
          <ul className="space-y-2 list-disc list-inside text-[var(--ink-2)]">
            <li>{isTr ? 'Acil teknik triyaj, kod incelemesi ve eylem planı hazırlanması' : 'Emergency technical triage and blueprint generation'}</li>
            <li>{isTr ? 'Doğrudan kıdemli mühendislik masamız ile iletişim ve tekliflendirme süreçlerinin yürütülmesi' : 'Direct engineering triage and proposal delivery'}</li>
            <li>{isTr ? 'Talep edilen Crash Test analiz raporunun ilgilinin e-posta adresine iletilmesi' : 'Sending requested diagnostics reports'}</li>
            <li>{isTr ? 'Yasal yükümlülüklerin yerine getirilmesi' : 'Fulfilling legal regulatory requirements'}</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-serif font-semibold text-[var(--ink)] flex items-center gap-2">
            <span>4. Üçüncü Taraflarla Paylaşım Yasağı</span>
          </h2>
          <p>
            {isTr 
              ? 'Toplanan hiçbir kişisel veya ticari veri; reklam, pazarlama, kiralama veya satma amacıyla 3. taraf kişi, kurum veya platformlarla kesinlikle paylaşılmaz.' 
              : 'No collected data is ever sold, rented, or transferred to 3rd party marketing brokers.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-serif font-semibold text-[var(--ink)] flex items-center gap-2">
            <span>5. Çerezler ve Analitik Araçları (Google Analytics & Microsoft Clarity)</span>
          </h2>
          <p>
            {isTr 
              ? 'Sitemizde temel oturum işlevlerinin yanı sıra kullanıcı deneyimini analiz etmek ve hataları teşhis etmek amacıyla Google Analytics 4 (GA4) ve Microsoft Clarity kullanılmaktadır. Bu ölçüm araçları yalnızca kullanıcı çerez bildiriminde "Kabul Et" butonunu tıkladığında (Google Consent Mode v2 standartlarında) aktifleşir. Kullanıcıların formlara girdiği hassas kriz detayları ve özel veriler Microsoft Clarity üzerinde katı bir şekilde maskelenmektedir.' 
              : 'Our website utilizes Google Analytics 4 (GA4) and Microsoft Clarity for technical diagnostics and experience optimization. Tracking scripts only activate upon explicit consent under Google Consent Mode v2. All sensitive input fields and private form details are strictly masked.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-serif font-semibold text-[var(--ink)] flex items-center gap-2">
            <span>6. İletişim & Haklarınız</span>
          </h2>
          <p>
            {isTr 
              ? 'KVKK m.11 kapsamındaki haklarınızı kullanmak, verilerinizin silinmesini veya güncellenmesini talep etmek için aşağıdaki kanallardan veri sorumlusuna başvurabilirsiniz:' 
              : 'To exercise your data privacy rights, contact us at:'}
          </p>
          <div className="pt-2 text-sm font-mono space-y-1.5 text-[var(--ink-2)]">
            <div>E-posta: <a href="mailto:info@trendmasterakademi.com" className="hover:underline text-[var(--accent)] inline-block py-[13px] -my-[13px]">info@trendmasterakademi.com</a></div>
            <div>Telefon: <a href="tel:+905343713573" className="hover:underline text-[var(--accent)] inline-block py-[13px] -my-[13px]">+90 534 371 35 73</a></div>
            <div>Adres: Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091 Konak / İzmir</div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Privacy;
