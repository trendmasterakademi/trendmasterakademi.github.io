export const agencyKitData = {
  tr: {
    banner: {
      badge: "TMA AGENCY KIT",
      cta: "Kiti İncele",
      tickerItems: [
        {
          tag: "CRASH TEST",
          text: "Ajansınız teknik bir krize gerçekten hazır mı? (HTTP 500 · Yazılımcı Terki · T-48h)",
          link: "/crash-test/",
          highlight: "60 Saniyelik Test"
        },
        {
          tag: "WHITE-LABEL",
          text: "Müşterinizle siz konuşun. Teknik yükü biz çözelim — %100 White-Label & Sıfır Bypass.",
          link: "/agency/",
          highlight: "Görünmeyen Ekip"
        },
        {
          tag: "6 ÇÖZÜM ALANI",
          text: "Acil Bug Fix · Kod Devralma · Web & SaaS · API & Ödeme · AI Otomasyon · Audit & Hız",
          link: "/agency/",
          highlight: "Uçtan Uca"
        },
        {
          tag: "ACİL DURUM AKIŞI",
          text: "3 Adımda Teknik Başlangıç: QR/Mesaj → Kısa Brif → Hedef 30 Dk Ön Değerlendirme",
          link: "/sos/",
          highlight: "Hedef 30 Dk"
        },
        {
          tag: "ÇALIŞMA MODELLERİ",
          text: "İhtiyaç kadar kıdemli teknik güç: Response · Sprint · Build · Audit",
          link: "/sla/",
          highlight: "Esnek Kapasite"
        },
        {
          tag: "TEMİZ DEVİR",
          text: "Sadece çalışan değil, devralınabilir kod: 10+ Yıl Deneyim · %100 Kaynak Kod Mülkiyeti",
          link: "/devir-kontrolu/",
          highlight: "CI/CD Disiplini"
        }
      ]
    },
    crashTest: {
      badge: "60 SANİYELİK TEKNİK HAZIRLIK TESTİ",
      code: "500",
      title: "AGENCY CRASH TEST",
      subtitle: "Ajansınız teknik bir krize gerçekten hazır mı?",
      description: "Bir senaryo seçin. Üç soruyu yanıtlayın. İlk müdahale planınızı ve teknik hazırlık puanınızı anında görün.",
      scenarios: [
        { no: "01", title: "Müşteri sitesi çöktü", tag: "HTTP 500", desc: "Zirve trafikte veritabanı kilitlendi veya sunucu 502/500 hatası veriyor." },
        { no: "02", title: "Yazılımcı projeyi bıraktı", tag: "HANDOVER", desc: "Eski geliştirici gitti, dokümantasyon yok, kod derlenemiyor veya erişim eksik." },
        { no: "03", title: "Teslime 48 saat kaldı", tag: "T-48H", desc: "Kritik lansman öncesi temel fonksiyonlar çalışmıyor, sprint tıkandı." }
      ],
      notice: {
        title: "TARA VE TESTİ BAŞLAT",
        security: "Sisteminize bağlanmaz. Şifre, sunucu erişimi veya müşteri verisi istemez.",
        url: "trendmasterakademi.com/crash-test"
      }
    },
    responseKit: {
      badge: "AGENCY RESPONSE KIT",
      title: "TMA Ajans Müdahale ve Çalışma Kılavuzu",
      subtitle: "Dijital ajansların görünmeyen kıdemli teknik masası: Kriz anında, devir süreçlerinde ve kapasite takviyesinde çalışma standartlarımız.",
      slides: [
        {
          slideNo: "01",
          tag: "WHITE-LABEL ENGINEERING",
          title: "Müşterinizle siz konuşun. Teknik yükü biz çözelim.",
          desc: "Ajansınızın marka kimliğini %100 koruyarak arka planda görünmez kıdemli mühendislik masası olarak çalışırız.",
          status: "READY",
          points: [
            "Ajansınızın adı ve markası ön plandadır.",
            "TMA doğrudan müşterinizle asla temas kurmaz.",
            "Resmi karşılıklı NDA ile tam gizlilik güvencesi."
          ]
        },
        {
          slideNo: "02",
          tag: "AJANSIN GÖRÜNMEYEN TEKNİK EKİBİ",
          title: "Proje tıkandığında yeni ekip aramayın.",
          desc: "Yetişmeyen işler ve canlı sistem sorunları için ajansınıza doğrudan kıdemli yazılım gücü ekleriz.",
          items: [
            { no: "01", title: "YETİŞMEYEN SPRINT", desc: "Backlog ve özellik geliştirme darboğazları" },
            { no: "02", title: "CANLI SİSTEM HATASI", desc: "Kritik bug, kesinti ve performans çöküşleri" },
            { no: "03", title: "EKSİK TEKNİK UZMANLIK", desc: "Backend, karmaşık entegrasyon, AI ve mimari" }
          ]
        },
        {
          slideNo: "03",
          tag: "WHITE-LABEL MODEL",
          title: "Sizin markanız. Bizim mühendisliğimiz.",
          desc: "Ajansınızın güvenliği ve müşteri ilişkisi 4 temel ilke ile korunur:",
          cards: [
            { no: "01", title: "MÜŞTERİ SİZDE", desc: "Tüm iletişim ajansınızda kalır." },
            { no: "02", title: "BYPASS YOK", desc: "İzinsiz temas veya doğrudan teklif kesinlikle yok." },
            { no: "03", title: "GİZLİLİK", desc: "İki taraflı bağlayıcı NDA ve portföy gizliliği." },
            { no: "04", title: "TAM DEVİR", desc: "Kod, sunucu erişimi ve teknik notlar eksiksiz sizde." }
          ]
        },
        {
          slideNo: "04",
          tag: "TEK PARTNER, ALTI ÇÖZÜM ALANI",
          title: "Koddan canlı sisteme.",
          desc: "Ajansların en sık karşılaştığı 6 kritik teknik alanda tam yetkinlik:",
          solutions: [
            { no: "01", title: "ACİL BUG FIX", desc: "Canlı hata, kesinti ve deadlock müdahalesi" },
            { no: "02", title: "KOD DEVRALMA", desc: "Yarım kalan, spagetti veya dokümantasyonsuz projeler" },
            { no: "03", title: "WEB & SAAS", desc: "React, Next.js, modern backend ve API mimarisi" },
            { no: "04", title: "API & ÖDEME", desc: "Webhook, sanal POS, CRM ve çift yönlü veri akışı" },
            { no: "05", title: "AI OTOMASYON", desc: "LLM, RAG ve şirkete özel akıllı iş akışları" },
            { no: "06", title: "AUDIT & HIZ", desc: "Güvenlik, kod sağlığı ve Core Web Vitals optimizasyonu" }
          ]
        },
        {
          slideNo: "05",
          tag: "ACİL DURUM AKIŞI",
          title: "Üç adımda teknik başlangıç.",
          desc: "Kriz anında bürokrasiye boğulmadan doğrudan masaya oturma protokolü:",
          steps: [
            { step: "01", title: "QR'I TARA VEYA YAZ", desc: "Hazır mesajla ajans destek hattına doğrudan bağlanın." },
            { step: "02", title: "KISA BRİFİ GÖNDER", desc: "URL, karşılaşılan hata, teknoloji yığını ve önceliği paylaşın." },
            { step: "03", title: "PLANI ONAYLA", desc: "Kapsam, süre ve sabit bütçe netleşince cerrahi müdahaleye başlayalım." }
          ],
          highlight: "İLK TEKNİK ÖN DEĞERLENDİRME: HEDEF 30 DK"
        },
        {
          slideNo: "06",
          tag: "ÇALIŞMA MODELLERİ",
          title: "İhtiyaç kadar kıdemli teknik güç.",
          desc: "Projenizin durumuna göre esnek ve öngörülebilir iş birliği modelleri:",
          models: [
            { name: "RESPONSE", desc: "Canlı sistem müdahalesi ve anlık kriz kurtarma" },
            { name: "SPRINT", desc: "Backlog eritme ve yoğunluk dönemi kıdemli takviyesi" },
            { name: "BUILD", desc: "Ajans markanızla sıfırdan uçtan uca mimari üretim" },
            { name: "AUDIT", desc: "Kod, mimari, güvenlik, deadlock ve hız denetimi" }
          ]
        },
        {
          slideNo: "07",
          tag: "GÜVENLİ VE TEMİZ DEVİR",
          title: "Sadece çalışan değil, devralınabilir kod.",
          desc: "Teslim ettiğimiz her satır kod ajansınızın ve müşterinizin geleceğini korur:",
          stats: [
            { value: "10+", label: "YIL DENEYİM", desc: "Doğrudan kıdemli geliştirici muhatap" },
            { value: "100%", label: "KAYNAK KOD", desc: "Erişim, mülkiyet ve teknik dokümantasyon sizde" },
            { value: "CI/CD", label: "TESLİM DİSİPLİNİ", desc: "Test, kontrollü yayın ve sıfır kayıplı geri dönüş planı" }
          ],
          techStack: "React / Next.js • Node.js / Python • PostgreSQL / Redis • Docker / Cloud • API / Webhook • OpenAI / LLM"
        },
        {
          slideNo: "08",
          tag: "WHITE-LABEL AGENCY ENGINEERING",
          title: "Bir sonraki teknik çıkmazda bizi hatırlayın.",
          desc: "Kriz hattımız ve mühendislik masamız her gün 09:00 – 24:00 saatleri arasında aktiftir.",
          phone: "+90 534 371 35 73",
          email: "info@trendmasterakademi.com",
          website: "trendmasterakademi.com",
          cta: "Ajans Destek Hattına Bağlan"
        }
      ]
    }
  },
  en: {
    banner: {
      badge: "TMA AGENCY KIT",
      cta: "View Kit",
      tickerItems: [
        {
          tag: "CRASH TEST",
          text: "Is your agency truly prepared for a technical outage? (HTTP 500 · Ghost Dev · T-48h)",
          link: "/crash-test/",
          highlight: "60-Second Test"
        },
        {
          tag: "WHITE-LABEL",
          text: "You manage the client. We solve the technical burden — 100% White-Label & Zero Bypass.",
          link: "/agency/",
          highlight: "Ghost Team"
        },
        {
          tag: "6 SOLUTIONS",
          text: "Emergency Bug Fix · Code Takeover · Web & SaaS · API & Payments · AI · Audit & Speed",
          link: "/agency/",
          highlight: "End-to-End"
        },
        {
          tag: "INCIDENT FLOW",
          text: "3-Step Technical Kickoff: QR/Text → Quick Brief → 30-Minute Triage Target",
          link: "/sos/",
          highlight: "Target 30 Mins"
        },
        {
          tag: "ENGAGEMENT",
          text: "Senior engineering capacity calibrated to need: Response · Sprint · Build · Audit",
          link: "/sla/",
          highlight: "Flexible Capacity"
        },
        {
          tag: "CLEAN HANDOVER",
          text: "Not just working code, maintainable code: 10+ Years Experience · 100% IP Ownership",
          link: "/handover-audit/",
          highlight: "CI/CD Discipline"
        }
      ]
    },
    crashTest: {
      badge: "60-SECOND TECHNICAL READINESS TEST",
      code: "500",
      title: "AGENCY CRASH TEST",
      subtitle: "Is your agency truly prepared for a technical crisis?",
      description: "Pick a scenario. Answer three questions. Instantly view your triage plan and technical readiness score.",
      scenarios: [
        { no: "01", title: "Client website crashed", tag: "HTTP 500", desc: "Database deadlocks or server returns 502/500 errors during peak traffic." },
        { no: "02", title: "Developer walked away", tag: "HANDOVER", desc: "Original engineer gone, zero documentation, code fails to compile or missing keys." },
        { no: "03", title: "48 hours to deadline", tag: "T-48H", desc: "Core features broken right before launch, sprint backlog completely blocked." }
      ],
      notice: {
        title: "SCAN & START TEST",
        security: "Does not connect to your system. Never requires passwords, server keys, or client data.",
        url: "trendmasterakademi.com/crash-test"
      }
    },
    responseKit: {
      badge: "AGENCY RESPONSE KIT",
      title: "TMA Agency Response & Engagement Guide",
      subtitle: "The invisible senior engineering desk for digital agencies: standards for outage response, code takeover, and capacity extension.",
      slides: [
        {
          slideNo: "01",
          tag: "WHITE-LABEL ENGINEERING",
          title: "You manage the client. We solve the technical burden.",
          desc: "We operate as an invisible senior engineering desk behind your agency's brand identity.",
          status: "READY",
          points: [
            "Your agency brand remains strictly front and center.",
            "TMA never contacts your clients directly.",
            "Full legal assurance under bilateral binding NDA."
          ]
        },
        {
          slideNo: "02",
          tag: "THE AGENCY'S INVISIBLE TECH SQUAD",
          title: "When projects stall, don't waste weeks recruiting.",
          desc: "We inject senior software firepower directly into your agency for unfinished backlogs and live outages.",
          items: [
            { no: "01", title: "UNFINISHED SPRINT", desc: "Backlog bottlenecks and delayed deliverables" },
            { no: "02", title: "LIVE PRODUCTION OUTAGE", desc: "Critical bugs, downtime, and performance degradation" },
            { no: "03", title: "SPECIALIZED TECH GAP", desc: "Complex backend, bespoke integrations, AI, and architecture" }
          ]
        },
        {
          slideNo: "03",
          tag: "WHITE-LABEL MODEL",
          title: "Your brand. Our engineering.",
          desc: "Your agency reputation and client relationship are shielded by 4 foundational rules:",
          cards: [
            { no: "01", title: "YOU OWN THE CLIENT", desc: "All communication stays strictly within your agency." },
            { no: "02", title: "ZERO BYPASS", desc: "Zero unauthorized client contact or solicitation." },
            { no: "03", title: "STRICT PRIVACY", desc: "Binding mutual NDA and portfolio confidentiality." },
            { no: "04", title: "FULL HANDOVER", desc: "Complete code, server credentials, and architecture notes stay yours." }
          ]
        },
        {
          slideNo: "04",
          tag: "ONE PARTNER, SIX CAPABILITY DOMAINS",
          title: "From code to live production.",
          desc: "Full surgical mastery across the 6 most common agency technical bottlenecks:",
          solutions: [
            { no: "01", title: "EMERGENCY BUG FIX", desc: "Live production errors, downtime, and deadlock triage" },
            { no: "02", title: "CODE TAKEOVER", desc: "Abandoned, spaghetti, or undocumented codebases" },
            { no: "03", title: "WEB & SAAS", desc: "React, Next.js, modern backend and API architectures" },
            { no: "04", title: "API & PAYMENTS", desc: "Webhooks, payment gateways, CRM, and two-way sync" },
            { no: "05", title: "AI AUTOMATION", desc: "LLM, RAG pipelines, and proprietary enterprise workflows" },
            { no: "06", title: "AUDIT & SPEED", desc: "Security, code health, and Core Web Vitals optimization" }
          ]
        },
        {
          slideNo: "05",
          tag: "INCIDENT RESPONSE WORKFLOW",
          title: "3 steps to technical kickoff.",
          desc: "Zero bureaucracy protocol to get senior engineers on table immediately:",
          steps: [
            { step: "01", title: "SCAN OR MESSAGE", desc: "Connect directly to the agency response desk with a pre-filled prompt." },
            { step: "02", title: "SEND A QUICK BRIEF", desc: "Share URL, observed error, tech stack, and urgency level." },
            { step: "03", title: "APPROVE THE PLAN", desc: "Begin surgical triage as soon as scope, timeline, and fixed quote align." }
          ],
          highlight: "INITIAL TECHNICAL TRIAGE: TARGET 30 MINS"
        },
        {
          slideNo: "06",
          tag: "ENGAGEMENT MODELS",
          title: "Senior technical firepower calibrated to need.",
          desc: "Flexible, predictable models tailored to project urgency:",
          models: [
            { name: "RESPONSE", desc: "Live outage mitigation and emergency hotfixes" },
            { name: "SPRINT", desc: "Backlog acceleration and peak-season senior extension" },
            { name: "BUILD", desc: "End-to-end architecture delivered under your agency brand" },
            { name: "AUDIT", desc: "Codebase, architecture, security, deadlock, and speed audit" }
          ]
        },
        {
          slideNo: "07",
          tag: "SECURE AND CLEAN HANDOVER",
          title: "Not just working code, maintainable code.",
          desc: "Every line delivered protects your agency's reputation and client's future:",
          stats: [
            { value: "10+", label: "YEARS EXP", desc: "Direct communication with lead engineers" },
            { value: "100%", label: "SOURCE CODE", desc: "Full ownership, access, and technical documentation" },
            { value: "CI/CD", label: "DELIVERY RIGOR", desc: "Automated testing, staged rollouts, zero-loss rollback plans" }
          ],
          techStack: "React / Next.js • Node.js / Python • PostgreSQL / Redis • Docker / Cloud • API / Webhook • OpenAI / LLM"
        },
        {
          slideNo: "08",
          tag: "WHITE-LABEL AGENCY ENGINEERING",
          title: "Remember us at your next technical impasse.",
          desc: "Our response desk and senior engineers are on duty daily from 09:00 to 24:00.",
          phone: "+90 534 371 35 73",
          email: "info@trendmasterakademi.com",
          website: "trendmasterakademi.com",
          cta: "Connect to Agency Response Desk"
        }
      ]
    }
  }
};
