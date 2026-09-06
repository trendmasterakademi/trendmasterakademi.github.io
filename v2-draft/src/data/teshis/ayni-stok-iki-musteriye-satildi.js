export default {
  "slug": "ayni-stok-iki-musteriye-satildi",
  "no": "01",
  "baslik": {
    "tr": "Aynı stok iki müşteriye satıldı",
    "en": "Same Inventory Sold to Multiple Customers"
  },
  "diyagramBaslik": {
    "tr": "Aynı stok iki kez satıldı",
    "en": "Oversold inventory race"
  },
  "kirinti": {
    "tr": "Sipariş & Ödeme",
    "en": "Orders & Payments"
  },
  "aciliyet": {
    "seviye": "kritik",
    "etiket": {
      "tr": "Kritik · ticari kayıp",
      "en": "Critical · revenue loss"
    }
  },
  "ozet": {
    "tr": "Son kalan ürün iki ayrı siparişte çıktı, stok eksiye düştü. Birine iade yapmak zorundasınız. Bu belirtinin üç farklı nedeni var ve üçünün çözümü birbirinden tamamen ayrı — yanlış olanı düzeltmek sorunu geri getirir.",
    "en": "The last item in stock was checked out across two different orders, sending inventory negative. One customer requires a refund. This symptom stems from three distinct root causes, each demanding a completely different fix — addressing the wrong one will cause the defect to recur."
  },
  "sahadaNasilGorunur": {
    "tr": "Genellikle flaş indirimde veya e-posta bülteni gönderildiği anda ortaya çıkar. Son kalan tek ürün için aynı saniyede iki ayrı sipariş onaylanır. Stok panelde eksi bire düşer; durumu ilk fark eden, siparişi iptal edilen öfkeli müşteri olur.",
    "en": "Usually appears during flash sales or immediately after an email campaign drops. Two separate orders for the final single unit are confirmed in the exact same second. Inventory drops to negative one; the first to notice is the customer whose order gets canceled."
  },
  "logSatirlari": [
    "SQLSTATE[40001]: Serialization failure: 1213 Deadlock found",
    "Duplicate entry '...' for key 'orders_reference_unique'",
    "UPDATE products SET stock = stock - 1  ← kontrol ve yazma ayrı"
  ],
  "logEslesme": [
    {
      "satir": 0,
      "harf": "A"
    },
    {
      "satir": 1,
      "harf": "B"
    }
  ],
  "logNotu": {
    "tr": "Bu satırlardan hangisinin göründüğü, hangi nedenle karşı karşıya olduğunuzu daha ilk bakışta daraltır.",
    "en": "Which of these lines appears in your error logs narrows down the exact root cause at first glance."
  },
  "nedenler": [
    {
      "harf": "A",
      "ad": {
        "tr": "Race condition",
        "en": "Race condition"
      },
      "aciklama": {
        "tr": "Aynı anda gelen iki istek stoğu eşzamanlı düşürdü. Kontrol ile yazma arasında boşluk var.",
        "en": "Two simultaneous requests decremented stock concurrently. There is an unisolated gap between check and write."
      },
      "kanit": {
        "tr": "created_at farkı < 1sn → A",
        "en": "created_at diff < 1s → A"
      },
      "yanlisDuzeltme": {
        "tr": "Kod tarafına if (stok > 0) kontrolü eklenir; oysa paralel iki istek kontrolü aynı milisaniyede geçtiği için stok yine eksiye düşer.",
        "en": "Adding an if (stock > 0) check in application code fails because concurrent requests pass the check in the same millisecond."
      },
      "diyagramAd": {
        "tr": "Race condition",
        "en": "Race condition"
      },
      "diyagramTest": {
        "tr": [
          "İki siparişin",
          "created_at",
          "farkı < 1 sn mi?"
        ],
        "en": [
          "Are order",
          "created_at diffs",
          "< 1 second?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Atomik UPDATE +",
          "etkilenen satır",
          "kontrolü"
        ],
        "en": [
          "Atomic UPDATE +",
          "affected rows",
          "validation"
        ]
      }
    },
    {
      "harf": "B",
      "ad": {
        "tr": "Idempotency yok",
        "en": "Missing idempotency"
      },
      "aciklama": {
        "tr": "Tek bir ödeme iki kez işlendi; müşteri iki kez tıkladı ya da webhook tekrar geldi. Eşzamanlılık yok, tekrar var.",
        "en": "A single payment was processed twice; either the customer double-clicked or a webhook redelivered. No concurrency, just duplication."
      },
      "kanit": {
        "tr": "payment_reference aynı → B",
        "en": "payment_reference same → B"
      },
      "yanlisDuzeltme": {
        "tr": "Webhook isteğine hemen yanıt verilmez; ödeme ağ geçidi isteği zaman aşımı sanıp tekrar gönderdiğinde sipariş kaydı mükerrer işlenir.",
        "en": "Failing to acknowledge the webhook promptly causes the payment gateway to retry after timing out, triggering duplicate order processing."
      },
      "diyagramAd": {
        "tr": "Idempotency yok",
        "en": "No idempotency"
      },
      "diyagramTest": {
        "tr": [
          "payment_reference",
          "değerleri",
          "aynı mı?"
        ],
        "en": [
          "Are payment",
          "reference IDs",
          "identical?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "unique index +",
          "idempotency",
          "anahtarı"
        ],
        "en": [
          "unique index +",
          "idempotency key",
          "lock"
        ]
      }
    },
    {
      "harf": "C",
      "ad": {
        "tr": "Stok senkronu",
        "en": "Inventory sync lag"
      },
      "aciklama": {
        "tr": "Stoğun kaynağı ERP veya pazaryeri. Yarış sitede değil, iki sistem arasındaki gecikmede.",
        "en": "Inventory master resides in an ERP or marketplace. The race is not on-site, but within sync lag intervals."
      },
      "kanit": {
        "tr": "Senkron satıştan eski → C",
        "en": "Sync older than sale → C"
      },
      "yanlisDuzeltme": {
        "tr": "Entegrasyon cron sıklığı beş dakikadan bir dakikaya indirilir; fakat API yanıt süresi uzadığında kuyruk birikir ve çakışma engellenemez.",
        "en": "Reducing cron intervals from five minutes to one minute fails because slow API responses cause queue congestion and unhandled conflicts."
      },
      "diyagramAd": {
        "tr": "Stok senkronu",
        "en": "Inventory sync"
      },
      "diyagramTest": {
        "tr": [
          "Son ERP senkronu",
          "satıştan",
          "önce mi?"
        ],
        "en": [
          "Was last ERP",
          "sync before",
          "order timestamp?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Rezervasyon",
          "mantığı + senkron",
          "sıklığı"
        ],
        "en": [
          "Reservation lock",
          "+ higher sync",
          "frequency"
        ]
      }
    }
  ],
  "kimCozer": {
    "tr": "Kıdemli backend mühendisi · 2–4 saat. Doğru neden belirlendikten sonra üçü de kalıcı olarak kapanır. Teşhis olmadan yapılan düzeltme belirtiyi bastırır, kaynağı bırakır.",
    "en": "Senior backend engineer · 2–4 hours. Once the exact cause is isolated, all three are permanently resolved. Fixes applied without proper diagnosis merely mask symptoms while leaving the root cause intact."
  },
  "cozulmezse": {
    "tr": "Her çift satış bir iade, bir kargo maliyeti ve bir olumsuz yorum riski. Kampanya günlerinde eşzamanlı trafik arttığı için sıklık katlanarak büyür.",
    "en": "Every oversold item triggers refund overhead, double logistics costs, and negative client feedback. Under high-traffic sales campaigns, frequency compounds exponentially."
  },
  "ilgiliTerimler": [
    "race-condition",
    "idempotency",
    "deadlock"
  ],
  "ilgiliHizmet": {
    "baslik": {
      "tr": "Acil Kriz Müdahalesi & Crash Test",
      "en": "Emergency Incident Triage & Crash Test"
    },
    "link": "/crash-test/"
  }
};
