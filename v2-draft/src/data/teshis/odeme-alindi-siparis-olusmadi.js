export default {
  "slug": "odeme-alindi-siparis-olusmadi",
  "no": "02",
  "baslik": {
    "tr": "Ödeme alındı, sipariş oluşmadı",
    "en": "Payment Charged but Order Not Created"
  },
  "diyagramBaslik": {
    "tr": "Ödeme var, sipariş yok",
    "en": "Payment without order"
  },
  "kirinti": {
    "tr": "Sipariş & Ödeme",
    "en": "Orders & Payments"
  },
  "aciliyet": {
    "seviye": "kritik",
    "etiket": {
      "tr": "Kritik · ticari kayıp",
      "en": "Critical · commercial loss"
    }
  },
  "ozet": {
    "tr": "Müşterinin kartından para çekildi ama sistemde sipariş yok. Müşteri arıyor, elinizde kayıt yok. Para bankada, sipariş ortada yok — ikisinin arasında kopmuş bir bildirim var.",
    "en": "Customer was charged successfully but no order appears in the system. The client contacts support with no reference on file. Funds are in the bank, order is missing — caused by a severed webhook callback between the two."
  },
  "logSatirlari": [
    "Webhook adresi: 404 / 500 / zaman aşımı",
    "Ödeme sağlayıcı paneli: callback failed · retry 3/3",
    "Uygulama log'unda ödeme referansı hiç geçmiyor",
    "HTTP 302 — bildirim yönlendirmeyi takip etmiyor"
  ],
  "logNotu": {
    "tr": "Ödeme sağlayıcısının panelinde her bildirim denemesinin kaydı vardır. Cevabı orada aramak kodda aramaktan hızlıdır: sağlayıcı size kaç kez denediğini ve ne cevap aldığını söyler.",
    "en": "Every webhook dispatch attempt is logged in the payment gateway dashboard. Checking provider logs is faster than codebase debugging: it reveals retry counts and HTTP response codes directly."
  },
  "nedenler": [
    {
      "harf": "A",
      "ad": {
        "tr": "Bildirim ulaşmadı",
        "en": "Callback undelivered"
      },
      "aciklama": {
        "tr": "Sağlayıcı bildirimi gönderdi ama adres yanlış, kapalı ya da güvenlik duvarı engelledi.",
        "en": "Gateway sent webhook but endpoint URL was invalid, firewalled (WAF), or blocked."
      },
      "kanit": {
        "tr": "Sağlayıcı panelinde 404 / zaman aşımı → A",
        "en": "404 or timeout in gateway panel → A"
      },
      "diyagramAd": {
        "tr": "Bildirim ulaşmadı",
        "en": "Undelivered webhook"
      },
      "diyagramTest": {
        "tr": [
          "Sağlayıcı panelinde",
          "deneme kaydı",
          "var mı?"
        ],
        "en": [
          "Are webhook retry",
          "logs visible in",
          "gateway panel?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Adres ve güvenlik",
          "duvarı düzeltme"
        ],
        "en": [
          "Fix endpoint URL",
          "+ whitelist WAF"
        ]
      }
    },
    {
      "harf": "B",
      "ad": {
        "tr": "İşlenemedi",
        "en": "Callback unhandled (500)"
      },
      "aciklama": {
        "tr": "Bildirim geldi, uygulama hata verdi. Sağlayıcı tekrar denedi, aynı hata tekrarlandı.",
        "en": "Webhook arrived but application threw unhandled exception. Retries repeated the crash."
      },
      "kanit": {
        "tr": "Log'da 500 + tekrar denemeler → B",
        "en": "HTTP 500 + retry loop in logs → B"
      },
      "diyagramAd": {
        "tr": "İşlenemedi",
        "en": "Handler crashed"
      },
      "diyagramTest": {
        "tr": [
          "Log'da bildirim",
          "geldi ama hata",
          "verdi mi?"
        ],
        "en": [
          "Did webhook arrive",
          "but throw 500",
          "fatal error?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Hatayı düzelt +",
          "kuyruğa al"
        ],
        "en": [
          "Patch exception +",
          "queue job buffer"
        ]
      }
    },
    {
      "harf": "C",
      "ad": {
        "tr": "Kaydedilmedi",
        "en": "Validation drop (Silent 200)"
      },
      "aciklama": {
        "tr": "Bildirim başarıyla döndü ama sipariş yazılmadı. Genellikle bir doğrulama hatası kayıt oluşturmayı sessizce engeller.",
        "en": "Webhook returned HTTP 200 but order insertion failed silently due to internal validation drops."
      },
      "kanit": {
        "tr": "200 dönmüş ama kayıt yok → C",
        "en": "HTTP 200 returned but no row → C"
      },
      "diyagramAd": {
        "tr": "Kaydedilmedi",
        "en": "Silent drop"
      },
      "diyagramTest": {
        "tr": [
          "Bildirime 200",
          "dönmüş ama kayıt",
          "yok mu?"
        ],
        "en": [
          "Was 200 returned",
          "without creating",
          "order record?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Doğrulama hatasını",
          "logla + kaydı",
          "garanti et"
        ],
        "en": [
          "Log validation +",
          "guarantee atomic",
          "insert"
        ]
      }
    }
  ],
  "kimCozer": {
    "tr": "Backend mühendisi. Kalıcı çözüm bildirimi doğrudan işlemek değil, önce kuyruğa yazıp sonra işlemektir; böylece uygulama hata verse bile bildirim kaybolmaz. Bu yapı kurulmadan aynı arıza her yoğun günde geri gelir.",
    "en": "Senior backend engineer. Permanent resilience requires decoupling ingestion from execution via message queues: ingest webhook payload to broker first, then process asynchronously."
  },
  "cozulmezse": {
    "tr": "Her kayıp bildirim, parası alınmış ama siparişi olmayan bir müşteri demektir. Bunlar genellikle müşteri şikâyet edene kadar fark edilmez — şikâyet etmeyenler hiç bilinmez.",
    "en": "Every dropped webhook is a charged client with an empty basket. These remain invisible until chargebacks and support escalations arrive."
  },
  "ilgiliTerimler": [
    "webhook",
    "idempotency",
    "rate-limit"
  ],
  "ilgiliHizmet": {
    "baslik": {
      "tr": "Acil Kriz Müdahalesi & Crash Test",
      "en": "Emergency Incident Triage & Crash Test"
    },
    "link": "/crash-test/"
  }
};
