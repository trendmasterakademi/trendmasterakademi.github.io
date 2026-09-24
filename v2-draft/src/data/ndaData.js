export const ndaData = {
  tr: {
    hero: {
      badge: "HUKUKİ VE MÜHENDİSLİK GÜVEN PROTOKOLÜ",
      title: "İki Taraflı Gizlilik ve Fikri Mülkiyet Sözleşmesi (Mutual NDA)",
      subtitle: "Tek bir satır kaynak koda, veritabanı şemasına veya sunucu erişimine dokunmadan önce; karşılıklı bağlayıcı kurumsal gizlilik ve %100 fikri mülkiyet koruma taahhütnamenizi anında oluşturun.",
      notice: "TMA ile paylaşılan tüm erişimler, şifrelenmiş kanallardan aktarılır ve operasyon tamamlandığında geri dönülemez şekilde imha edilir."
    },
    tmaParty: {
      companyName: "________________________",
      signatory: "________________________",
      title: "________________________",
      address: "________________________",
      email: "info@trendmasterakademi.com",
      phone: "________________________",
      website: "www.trendmasterakademi.com"
    },
    scopeTypes: [
      { id: "crisis_triage", label: "Acil Kriz Triyajı & Canlı Sistem Kurtarma (SEV-0 / SEV-1)" },
      { id: "code_audit", label: "Kod Tabanı Devri, Mimari Denetim & Refactor İncelemesi" },
      { id: "white_label", label: "Ajans İçi White-Label Mühendislik & Ghost Delivery" },
      { id: "general_advisory", label: "Sürekli Kıdemli Sistem Mimarlığı & SLA Danışmanlığı" }
    ],
    formLabels: {
      companyName: "Şirket / Ajans Unvanı",
      companyNamePlaceholder: "Örn: ACME Bilişim A.Ş. veya Studio Creative Ltd.",
      signatory: "Yetkili Adı Soyadı",
      signatoryPlaceholder: "Örn: Ahmet Yılmaz",
      signatoryTitle: "Yetkili Unvanı",
      signatoryTitlePlaceholder: "Örn: CTO / Kurucu Ortak",
      email: "Resmi İletişim E-Postası",
      emailPlaceholder: "Örn: legal@acme.com veya ahmet@acme.com",
      scope: "Mühendislik Kapsamı & İşbirliği Türü",
      effectiveDate: "Yürürlük Tarihi",
      generateCta: "Sözleşmeyi Güncelle & Önizle",
      printCta: "Yazdır / PDF Olarak Kaydet",
      copyCta: "Sözleşme Metnini Kopyala",
      requestSignedCta: "TMA İmzalı Nüsha Talep Et",
      copiedNotice: "Sözleşme metni panoya kopyalandı!"
    },
    clauses: [
      {
        num: "1",
        title: "AMAÇ VE KAPSAM",
        content: "İşbu İki Taraflı Gizlilik ve Fikri Mülkiyet Sözleşmesi ('Sözleşme'), Taraflar arasında yürütülecek teknik analiz, kod incelemesi, sistem kurtarma, mimari denetim veya yazılım geliştirme işbirliği kapsamında paylaşılacak gizli bilgilerin korunması ve fikri mülkiyet haklarının güvence altına alınması amacıyla akdedilmiştir."
      },
      {
        num: "2",
        title: "GİZLİ BİLGİNİN TANIMI",
        content: "Taraflarca birbirine doğrudan veya dolaylı olarak açıklanan; kaynak kodlar, veritabanı şemaları, API anahtarları, sunucu erişim bilgileri, mimari diyagramlar, teknik borç analizleri, finansal veriler, müşteri listeleri ve işbu kapsamda üretilen her türlü teknik ve ticari bilgi 'Gizli Bilgi' olarak kabul edilir."
      },
      {
        num: "3",
        title: "TARAFLARIN TAAHHÜTLERİ VE GİZLİLİK YÜKÜMLÜLÜĞÜ",
        content: "Taraflar, karşı tarafın Gizli Bilgilerini en üst düzeyde ticari sır ve özenle korumayı; bu bilgileri karşı tarafın yazılı ön onayı olmaksızın üçüncü taraflara ifşa etmemeyi, kopyalamamayı, çoğaltmamayı ve yalnızca belirlenen mühendislik amacı doğrultusunda kullanmayı peşinen taahhüt eder."
      },
      {
        num: "4",
        title: "%100 FİKRİ MÜLKİYET (IP) MÜLKİYETİ",
        content: "Müşteri'nin sağladığı kaynak kodlar, sistemler ve TMA tarafından proje kapsamında geliştirilen, iyileştirilen, yamalanan veya optimize edilen tüm kod blokları, konfigürasyonlar ve mimari çözümler kayıtsız şartsız MÜŞTERİ'NİN münhasır fikri mülkiyetindedir. TMA, Müşteri'nin kodu veya fikri mülkiyeti üzerinde hiçbir hak, lisans veya mülkiyet iddiasında bulunamaz."
      },
      {
        num: "5",
        title: "WHITE-LABEL VE GİZLİ OPERASYON (GHOST DELIVERY)",
        content: "TMA, Müşteri'nin yazılı açık izni olmaksızın Müşteri'nin adını, logosunu, projesini veya arıza geçmişini herhangi bir pazarlama materyalinde, vaka çalışmasında (case study) veya kamuya açık referans listesinde kullanamaz. Tüm operasyonlar mutlak 'White-Label' (Görünmez Mühendislik Masası) disiplini ile yürütülür."
      },
      {
        num: "6",
        title: "SÜRE VE YÜRÜRLÜK",
        content: "İşbu Sözleşme imza/onay tarihinde yürürlüğe girer ve işbirliğinin sona ermesinden itibaren 2 (iki) yıl süreyle bağlayıcılığını korur. Kaynak kodlar ve ticari sırlara ilişkin gizlilik yükümlülükleri ise süresiz olarak geçerlidir."
      },
      {
        num: "7",
        title: "UYGULANACAK HUKUK VE YETKİLİ MAHKEME",
        content: "İşbu Sözleşme'nin uygulanmasından doğabilecek her türlü uyuşmazlığın çözümünde Türkiye Cumhuriyeti Hukuku uygulanacak olup, İzmir Mahkemeleri ve İcra Daireleri münhasıran yetkilidir."
      }
    ]
  },
  en: {
    hero: {
      badge: "LEGAL & ENGINEERING TRUST PROTOCOL",
      title: "Mutual Non-Disclosure & IP Protection Agreement (NDA)",
      subtitle: "Before touching a single line of source code, database schema, or infrastructure credential; generate your binding bilateral confidentiality and 100% intellectual property protection agreement instantly.",
      notice: "All credentials shared with TMA are transferred via encrypted tunnels and irrevocably purged once the engagement concludes."
    },
    tmaParty: {
      companyName: "________________________",
      signatory: "________________________",
      title: "________________________",
      address: "________________________",
      email: "info@trendmasterakademi.com",
      phone: "________________________",
      website: "www.trendmasterakademi.com"
    },
    scopeTypes: [
      { id: "crisis_triage", label: "Emergency Crisis Triage & Production Rescue (SEV-0 / SEV-1)" },
      { id: "code_audit", label: "Codebase Handover, Architectural Audit & Refactoring Review" },
      { id: "white_label", label: "Agency White-Label Engineering & Ghost Delivery" },
      { id: "general_advisory", label: "Retainer Senior Systems Architecture & SLA Advisory" }
    ],
    formLabels: {
      companyName: "Company / Agency Legal Name",
      companyNamePlaceholder: "e.g. ACME Technologies Inc. or Studio Creative Ltd.",
      signatory: "Authorized Signatory Name",
      signatoryPlaceholder: "e.g. John Doe",
      signatoryTitle: "Signatory Title",
      signatoryTitlePlaceholder: "e.g. CTO / Managing Director",
      email: "Official Corporate Email",
      emailPlaceholder: "e.g. legal@acme.com or john@acme.com",
      scope: "Engineering Scope & Engagement Type",
      effectiveDate: "Effective Date",
      generateCta: "Update & Preview Agreement",
      printCta: "Print / Save as PDF",
      copyCta: "Copy Agreement Text",
      requestSignedCta: "Request TMA Countersigned Copy",
      copiedNotice: "Agreement text copied to clipboard!"
    },
    clauses: [
      {
        num: "1",
        title: "PURPOSE AND SCOPE",
        content: "This Mutual Non-Disclosure and IP Protection Agreement ('Agreement') is entered into by and between the Parties for the purpose of preventing the unauthorized disclosure of Confidential Information and protecting intellectual property rights during technical diagnostics, code audits, emergency incident recovery, architectural evaluations, or software engineering engagements."
      },
      {
        num: "2",
        title: "DEFINITION OF CONFIDENTIAL INFORMATION",
        content: "All information disclosed directly or indirectly between the Parties, including but not limited to source code, database schemas, API credentials, server access keys, architectural blueprints, technical debt audits, financial metrics, customer records, and all engineering deliverables produced under this engagement, shall constitute 'Confidential Information'."
      },
      {
        num: "3",
        title: "OBLIGATIONS OF CONFIDENTIALITY",
        content: "Each Party agrees to hold the other Party's Confidential Information in strict confidence using the highest standard of professional care; not to disclose, duplicate, reverse engineer, or disseminate such information to any third party without prior written consent, and to use it solely for the agreed engineering scope."
      },
      {
        num: "4",
        title: "100% INTELLECTUAL PROPERTY (IP) OWNERSHIP",
        content: "All pre-existing code, systems, and proprietary technology provided by Client, as well as all code modifications, refactorings, hotfixes, patches, and architectural artifacts developed by TMA under this engagement, shall remain the exclusive, unconditional property of CLIENT. TMA asserts zero ownership or licensing claim over Client's IP."
      },
      {
        num: "5",
        title: "WHITE-LABEL & GHOST DELIVERY DISCIPLINE",
        content: "TMA shall not publicly disclose Client's name, trademark, project scope, or incident history in any public portfolio, marketing collateral, or case study without explicit prior written authorization. All operations remain strictly white-label and invisible."
      },
      {
        num: "6",
        title: "TERM AND TERMINATION",
        content: "This Agreement becomes effective on the Effective Date and shall remain binding for a period of two (2) years following termination of the engagement. Confidentiality obligations concerning source code and proprietary trade secrets shall survive indefinitely."
      },
      {
        num: "7",
        title: "GOVERNING LAW AND JURISDICTION",
        content: "This Agreement shall be governed by and construed in accordance with the laws of the Republic of Turkey. The Courts and Execution Offices of Izmir, Turkey shall have exclusive jurisdiction over any disputes arising under this Agreement."
      }
    ]
  }
};

export const mutualNdaH1 = {
  tr: ndaData.tr.hero.title,
  en: ndaData.en.hero.title
};
