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
          text: "Üç adımda teknik başlangıç: QR'ı tara → Kısa brifi gönder → Planı onayla · İlk teknik ön değerlendirme: hedef 30 dk",
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
          desc: "",
          status: "READY",
          points: []
        },
        {
          slideNo: "02",
          tag: "AJANSIN GÖRÜNMEYEN TEKNİK EKİBİ",
          title: "Proje tıkandığında yeni ekip aramayın.",
          desc: "Yetişmeyen işler ve canlı sistem sorunları için ajansınıza doğrudan kıdemli yazılım gücü ekleriz.",
          items: [
            { no: "01", title: "YETİŞMEYEN SPRINT", desc: "Backlog ve özellik geliştirme" },
            { no: "02", title: "CANLI SİSTEM HATASI", desc: "Kritik bug, kesinti ve performans" },
            { no: "03", title: "EKSİK TEKNİK UZMANLIK", desc: "Backend, entegrasyon, AI ve mimari" }
          ]
        },
        {
          slideNo: "03",
          tag: "WHITE-LABEL MODEL",
          title: "Sizin markanız. Bizim mühendisliğimiz.",
          desc: "",
          cards: [
            { no: "01", title: "MÜŞTERİ SİZDE", desc: "İletişim ajansınızda kalır." },
            { no: "02", title: "BYPASS YOK", desc: "İzinsiz temas veya teklif yok." },
            { no: "03", title: "GİZLİLİK", desc: "NDA ve portföy gizliliği." },
            { no: "04", title: "TAM DEVİR", desc: "Kod, erişim ve teknik notlar sizde." }
          ]
        },
        {
          slideNo: "04",
          tag: "TEK PARTNER, ALTI ÇÖZÜM ALANI",
          title: "Koddan canlı sisteme.",
          desc: "",
          solutions: [
            { no: "01", title: "ACİL BUG FIX", desc: "Canlı hata ve kesinti" },
            { no: "02", title: "KOD DEVRALMA", desc: "Yarım kalan projeler" },
            { no: "03", title: "WEB & SaaS", desc: "React, Next.js, backend" },
            { no: "04", title: "API & ÖDEME", desc: "Webhook, CRM, veri akışı" },
            { no: "05", title: "AI OTOMASYON", desc: "LLM ve özel iş akışları" },
            { no: "06", title: "AUDIT & HIZ", desc: "Güvenlik ve performans" }
          ]
        },
        {
          slideNo: "05",
          tag: "ACİL DURUM AKIŞI",
          title: "Üç adımda teknik başlangıç.",
          desc: "",
          steps: [
            { step: "01", title: "QR'I TARA", desc: "Hazır mesajla ajans destek hattına bağlan." },
            { step: "02", title: "KISA BRİFİ GÖNDER", desc: "URL, hata, teknoloji ve önceliği paylaş." },
            { step: "03", title: "PLANI ONAYLA", desc: "Kapsam, süre ve bütçe netleşince başlayalım." }
          ],
          highlight: "İLK TEKNİK ÖN DEĞERLENDİRME: HEDEF 30 DK"
        },
        {
          slideNo: "06",
          tag: "ÇALIŞMA MODELLERİ",
          title: "İhtiyaç kadar kıdemli teknik güç.",
          desc: "",
          models: [
            { name: "RESPONSE", desc: "Canlı sistem müdahalesi" },
            { name: "SPRINT", desc: "Backlog ve yoğunluk desteği" },
            { name: "BUILD", desc: "Ajans markasıyla uçtan uca üretim" },
            { name: "AUDIT", desc: "Kod, mimari, güvenlik ve hız denetimi" }
          ]
        },
        {
          slideNo: "07",
          tag: "GÜVENLİ VE TEMİZ DEVİR",
          title: "Sadece çalışan değil, devralınabilir kod.",
          desc: "",
          stats: [
            { value: "10+", label: "YIL DENEYİM", desc: "Doğrudan kıdemli geliştirici muhatap" },
            { value: "100%", label: "KAYNAK KOD", desc: "Erişim, mülkiyet ve teknik dokümantasyon" },
            { value: "CI/CD", label: "TESLİM DİSİPLİNİ", desc: "Test, kontrollü yayın ve geri dönüş planı" }
          ],
          techStack: "React / Next.js • Node.js / Python • PostgreSQL / Redis • Docker / Cloud • API / Webhook • OpenAI / LLM"
        },
        {
          slideNo: "08",
          tag: "WHITE-LABEL AGENCY ENGINEERING",
          title: "Bir sonraki teknik çıkmazda bizi hatırlayın.",
          desc: "Ajans destek hattına hazır mesajla bağlanın.",
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
          text: "Technical kickoff in three steps: Scan the QR → Send a short brief → Approve the plan · Initial technical pre-assessment: target 30 min",
          link: "/sos/",
          highlight: "Target 30 Min"
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
          title: "You talk to your client. We handle the technical load.",
          desc: "",
          status: "READY",
          points: []
        },
        {
          slideNo: "02",
          tag: "YOUR AGENCY'S INVISIBLE TECH TEAM",
          title: "When a project stalls, don't go looking for a new team.",
          desc: "For work that is falling behind and for live system problems, we add senior software capacity directly to your agency.",
          items: [
            { no: "01", title: "UNFINISHED SPRINT", desc: "Backlog and feature development" },
            { no: "02", title: "LIVE SYSTEM ERROR", desc: "Critical bugs, downtime and performance" },
            { no: "03", title: "MISSING TECHNICAL EXPERTISE", desc: "Backend, integration, AI and architecture" }
          ]
        },
        {
          slideNo: "03",
          tag: "WHITE-LABEL MODEL",
          title: "Your brand. Our engineering.",
          desc: "",
          cards: [
            { no: "01", title: "THE CLIENT STAYS WITH YOU", desc: "Communication stays with your agency." },
            { no: "02", title: "NO BYPASS", desc: "No unauthorised contact or offers." },
            { no: "03", title: "CONFIDENTIALITY", desc: "NDA and portfolio confidentiality." },
            { no: "04", title: "FULL HANDOVER", desc: "Code, access and technical notes stay with you." }
          ]
        },
        {
          slideNo: "04",
          tag: "ONE PARTNER, SIX SOLUTION AREAS",
          title: "From code to live system.",
          desc: "",
          solutions: [
            { no: "01", title: "EMERGENCY BUG FIX", desc: "Live errors and downtime" },
            { no: "02", title: "CODE TAKEOVER", desc: "Unfinished projects" },
            { no: "03", title: "WEB & SaaS", desc: "React, Next.js, backend" },
            { no: "04", title: "API & PAYMENTS", desc: "Webhooks, CRM, data flow" },
            { no: "05", title: "AI AUTOMATION", desc: "LLMs and custom workflows" },
            { no: "06", title: "AUDIT & SPEED", desc: "Security and performance" }
          ]
        },
        {
          slideNo: "05",
          tag: "EMERGENCY FLOW",
          title: "Technical kickoff in three steps.",
          desc: "",
          steps: [
            { step: "01", title: "SCAN THE QR", desc: "Connect to the agency support line with a ready-made message." },
            { step: "02", title: "SEND A SHORT BRIEF", desc: "Share the URL, the error, the tech stack and the priority." },
            { step: "03", title: "APPROVE THE PLAN", desc: "Once scope, timeline and budget are clear, we start." }
          ],
          highlight: "INITIAL TECHNICAL PRE-ASSESSMENT: TARGET 30 MIN"
        },
        {
          slideNo: "06",
          tag: "ENGAGEMENT MODELS",
          title: "As much senior technical capacity as you need.",
          desc: "",
          models: [
            { name: "RESPONSE", desc: "Live system intervention" },
            { name: "SPRINT", desc: "Backlog and peak-load support" },
            { name: "BUILD", desc: "End-to-end delivery under your agency's brand" },
            { name: "AUDIT", desc: "Code, architecture, security and speed audit" }
          ]
        },
        {
          slideNo: "07",
          tag: "SECURE AND CLEAN HANDOVER",
          title: "Not just working code — code that can be taken over.",
          desc: "",
          stats: [
            { value: "10+", label: "YEARS OF EXPERIENCE", desc: "A senior developer as your direct contact" },
            { value: "100%", label: "SOURCE CODE", desc: "Access, ownership and technical documentation" },
            { value: "CI/CD", label: "DELIVERY DISCIPLINE", desc: "Testing, controlled releases and a rollback plan" }
          ],
          techStack: "React / Next.js • Node.js / Python • PostgreSQL / Redis • Docker / Cloud • API / Webhook • OpenAI / LLM"
        },
        {
          slideNo: "08",
          tag: "WHITE-LABEL AGENCY ENGINEERING",
          title: "Remember us at your next technical dead end.",
          desc: "Connect to the agency support line with a ready-made message.",
          phone: "+90 534 371 35 73",
          email: "info@trendmasterakademi.com",
          website: "trendmasterakademi.com",
          cta: "Connect to Agency Response Desk"
        }
      ]
    }
  }
};

export const agencyKitH1 = {
  tr: {
    prefix: "Ajanslar İçin ",
    accent: "Müdahale & Hazırlık",
    suffix: " Kiti",
    full: "Ajanslar İçin Müdahale & Hazırlık Kiti"
  },
  en: {
    prefix: "Official ",
    accent: "Agency Incident",
    suffix: " & Readiness Kit",
    full: "Official Agency Incident & Readiness Kit"
  }
};

export const crashTestH1 = {
  tr: {
    line1: "Ajansınız teknik bir krize ",
    accent: "gerçekten hazır mı?",
    full: "Ajansınız teknik bir krize gerçekten hazır mı?"
  },
  en: {
    line1: "Is your agency ",
    accent: "truly ready for a technical crisis?",
    full: "Is your agency truly ready for a technical crisis?"
  }
};
