export const caseStudies = [
  {
    id: 'veri-kaybi-sanilan-sistem',
    baslik: {
      tr: '"Veriler kayboldu" sanılan sistemin gerçek hikâyesi',
      en: 'The system everyone thought had lost its data'
    },
    durum: {
      tr: 'Çok şubeli bir kurumun web sistemi ile arka plan verileri arasındaki bağ koptu. On binlerce kayıt erişilemez hâle geldi. İlk değerlendirme "veri kaybı" yönündeydi; kurum içinde verilerin ele geçirilmiş olabileceği konuşuluyordu.',
      en: "The link between a multi-branch organization's web system and its backend data broke. Tens of thousands of records became inaccessible. The initial assessment was data loss; internally, people were discussing whether the data had been stolen."
    },
    teshis: {
      tr: 'Kod tabanında arıza aramadık. Altyapının bulut üzerinde olduğunu görünce e-posta arşivlerini taradık. Beş günlük tarama sonunda sağlayıcının aylar önce gönderdiği yazışmalar çıktı: kapasite artışı nedeniyle altyapı değiştirilecek, güncelleme yapılması gerekiyordu. Beş ayrı e-posta, sonuncusunda "son uyarı" ibaresi. Hiçbiri yanıtlanmamıştı.',
      en: "We didn't look for a fault in the codebase. Once we saw the infrastructure was hosted in the cloud, we searched the email archives. After five days of scanning, the provider's correspondence surfaced — sent months earlier: the infrastructure was being changed to increase capacity, and an update was required. Five separate emails, the last marked \"final notice\". None had been answered."
    },
    kokNeden: {
      tr: 'Kod değil, süreç. Sağlayıcı, güncelleme yapılmadığı için verileri koruma amacıyla ayrı bir arşive almış; ardından gelen ödeme uyarıları da karşılıksız kalınca hesabı askıya almıştı. Veri ne çalınmıştı ne kaybolmuştu — erişim kapanmıştı ve durum yönetime iletilmemişti.',
      en: 'Not code — process. Because no update was made, the provider had moved the data into a separate archive to protect it; when the subsequent payment notices also went unanswered, the account was suspended. The data had neither been stolen nor lost — access had been closed, and the situation had not been escalated to management.'
    },
    sonuc: {
      tr: 'Veri sağlayıcı tarafında eksiksiz duruyordu. Erişim geri alındı, sistem ayağa kaldırıldı.',
      en: "The data was intact on the provider's side. Access was restored and the system brought back up.",
      highlight: {
        tr: 'Veri kaybı: sıfır.',
        en: 'Data lost: none.'
      }
    },
    ajansIcin: {
      tr: 'Bu vakada tek satır kod hatalı değildi. Müşterinizin altyapısı birinin kişisel hesabına kayıtlıysa ve yenileme uyarıları okunmayan bir kutuya düşüyorsa, aynı senaryo sizi de bulur — ve ilk bakışta "veri kaybı" gibi görünür.',
      en: "Not a single line of code was at fault in this case. If your client's infrastructure sits under someone's personal account and renewal notices land in an inbox nobody reads, the same scenario will find you — and at first glance it will look like data loss."
    },
    timeline: [
      { time: 'T+00h', label: { tr: 'Kriz Bildirimi & Kilitlenme', en: 'Incident Alert & Lockout' } },
      { time: 'T+04h', label: { tr: 'Veritabanı & DNS Denetimi', en: 'Database & DNS Audit' } },
      { time: 'T+12h', label: { tr: 'Bulut Arşiv Yazışmalarının Tespiti', en: 'Cloud Archive Discovery' } },
      { time: 'T+24h', label: { tr: 'Erişimin Açılması & Sıfır Veri Kaybı', en: 'Access Restored, Zero Loss' } }
    ]
  },
  {
    id: 'odeme-webhook-kopmasi-lansman-krizi',
    baslik: {
      tr: 'Lansmana 36 Saat Kala Kopan Ödeme Webhook\'u ve Sipariş Kilidi',
      en: 'Payment Webhook Failure & Order Deadlock 36 Hours Before Launch'
    },
    durum: {
      tr: 'Bir dijital ajans, perakende müşterisi için aylar süren e-ticaret lansmanına hazırlanıyordu. Lansmandan 36 saat önce canlı testlerde ödemeler bankadan çekiliyor ancak sipariş durumu "beklemede" kalıyor, sepet temizlenmiyordu. Ajans sözleşme feshi riskiyle karşı karşıya kaldı.',
      en: 'A digital agency was preparing a high-stakes retail e-commerce launch. 36 hours before go-live, test payments were successfully charged by the gateway but orders remained pending and carts failed to clear, risking contract cancellation.'
    },
    teshis: {
      tr: 'Ödeme sağlayıcısının webhook çağrıları, arkadaki senkron fatura PDF üretimi ve e-posta gönderimi nedeniyle 5 saniyelik ağ timeout sınırına takılıyordu. Banka webhook yanıtı alamayınca işlemi failover sayıp iptal bayrağı düşürüyordu.',
      en: 'The gateway webhook callback was timing out over the 5-second network threshold due to synchronous PDF invoice rendering and SMTP email dispatch inside the HTTP handler. Without a timely HTTP 200, the gateway flagged transactions as unconfirmed.'
    },
    kokNeden: {
      tr: 'Ağır iş yüklerinin HTTP yaşam döngüsünde senkron çalıştırılması. Asenkron bir arka plan kuyruğu (BullMQ/Redis) ve idempotency kontrolü bulunmuyordu.',
      en: 'Synchronous execution of heavy I/O operations inside the webhook endpoint. Lack of an asynchronous message queue (BullMQ/Redis) and idempotency token verification.'
    },
    sonuc: {
      tr: 'Webhook yanıt süresi 18 milisaniyeye çekildi. PDF ve bildirim akışları arka plan Redis kuyruğuna taşındı. Lansman tam zamanında açıldı.',
      en: 'Webhook response latency dropped to 18 milliseconds. Heavy rendering tasks were offloaded to background Redis queues. The platform launched exactly on schedule.',
      highlight: {
        tr: 'Lansman gecikmesi: 0 saat · Sipariş kaybı: Sıfır.',
        en: 'Launch delay: 0 hours · Lost orders: Zero.'
      }
    },
    ajansIcin: {
      tr: 'Webhook endpoint\'leri asla ağır işlem yapmamalıdır; yalnızca isteği doğrulamalı ve işi arka plan kuyruğuna atmalıdır. Aksi halde gerçek reklam trafiğinde tüm mağaza çöker.',
      en: 'Webhook handlers must never process heavy rendering tasks inline. They must only verify the payload and push jobs onto a worker queue. Otherwise, production ad traffic instantly paralyzes the shop.'
    },
    timeline: [
      { time: 'T+00h', label: { tr: 'Lansman Kriz Çağrısı (SOS)', en: 'Launch Crisis SOS Dispatch' } },
      { time: 'T+02h', label: { tr: 'Sandbox Yük Testi & Profilleme', en: 'Sandbox Load Test & Profiling' } },
      { time: 'T+06h', label: { tr: 'BullMQ & Redis Kuyruk Mimarisi', en: 'BullMQ & Redis Queue Architecture' } },
      { time: 'T+18h', label: { tr: '5.000 Sipariş Stres Testi & Yayına Giriş', en: '5,000 Stress Pass & Live Deployment' } }
    ]
  },
  {
    id: 'yazilimci-ayrildi-dokumantasyonsuz-devir',
    baslik: {
      tr: 'Yazılımcı Ayrıldı, Dokümantasyon Yok: 40.000 Satırlık Kodun 4 Günde Devralınması',
      en: 'Developer Disengaged, Zero Documentation: 40,000 Lines Rescued in 4 Days'
    },
    durum: {
      tr: 'Kurumsal bir lojistik takip SaaS platformunun tek kıdemli yazılımcısı projeyi tamamlamadan işten ayrıldı. Ne mimari şema, ne ortam değişkenleri (env) kılavuzu, ne de migration listesi vardı. Müşteri ajansa haftalık gecikme cezası işletmeye başladı.',
      en: 'The sole senior developer of an enterprise logistics SaaS platform disengaged before handover. There were no architecture diagrams, no environment variable blueprints, and no migration log. The client initiated contractual delay penalties.'
    },
    teshis: {
      tr: 'Kod tabanı çalışıyordu ancak dış API anahtarları eski yazılımcının şahsi cihazında kalmıştı. Veritabanı şeması production üzerinde elle değiştirilmiş, repo migration dosyalarıyla senkronu kopmuştu.',
      en: 'The code ran, but critical 3rd-party API credentials were locked on the departed developer\'s local machine. The live database had been manually altered, drifting entirely out of sync with migration scripts.'
    },
    kokNeden: {
      tr: 'CI/CD boru hattının ve Dockerize edilmiş izole geliştirme ortamının bulunmaması; projenin tek bir kişinin yerel ortamına bağımlı geliştirilmiş olması.',
      en: 'Absence of CI/CD pipelines and containerized Docker environments; the entire lifecycle was tightly coupled to a single developer\'s personal machine.'
    },
    sonuc: {
      tr: 'Repoya tersine mühendislik (reverse-engineering) uygulandı. Tüm servisler Dockerize edildi, şema farkları migrate edildi ve 4. günde eksiksiz dokümantasyonla ajansa devredildi.',
      en: 'Reverse engineering was applied to the repository. The entire stack was containerized with Docker, schema drift was reconciled, and clean documented handover was finalized on Day 4.',
      highlight: {
        tr: 'Cezai şart: İptal edildi · Kod kurtarma: %100 eksiksiz.',
        en: 'Penalties: Cancelled · Code rescue: 100% complete.'
      }
    },
    ajansIcin: {
      tr: 'Bir projeyi tek bir yazılımcının hafızasına emanet etmek ajanslar için ölümcül bir kumardır. Proje daima tek komutla (`docker compose up`) ayağa kalkacak bağımsızlıkta teslim alınmalıdır.',
      en: 'Entrusting a client codebase exclusively to one developer\'s memory is a fatal gamble. Every project must be structured to build in isolation with a single command (`docker compose up`).'
    },
    timeline: [
      { time: 'T+00h', label: { tr: 'Git & Sunucu Erişimlerinin Devralınması', en: 'Git & Server Key Takeover' } },
      { time: 'T+12h', label: { tr: 'Bağımlılık Taraması & Docker Sandbox', en: 'Dependency Scan & Docker Sandbox' } },
      { time: 'T+36h', label: { tr: 'Veritabanı Şema Senkronizasyonu', en: 'Database Schema Drift Migration' } },
      { time: 'T+96h', label: { tr: 'CI/CD Kurulumu & Temiz Devir Teslimi', en: 'CI/CD Pipeline & Clean Handover' } }
    ]
  }
];
