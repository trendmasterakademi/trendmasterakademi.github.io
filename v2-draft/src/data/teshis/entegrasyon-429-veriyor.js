export default {
  "slug": "entegrasyon-429-veriyor",
  "no": "12",
  "baslik": {
    "tr": "Entegrasyon aniden 429 vermeye başladı",
    "en": "Third-Party Integration Returning HTTP 429"
  },
  "diyagramBaslik": {
    "tr": "Entegrasyon 429 veriyor",
    "en": "Integration 429 rate limit"
  },
  "kirinti": {
    "tr": "İletişim & Entegrasyon",
    "en": "Contact & Integrations"
  },
  "aciliyet": {
    "seviye": "yuksek",
    "etiket": {
      "tr": "Yüksek · veri akışı durdu",
      "en": "High · data sync halted"
    }
  },
  "ozet": {
    "tr": "Aylardır çalışan bir entegrasyon — kargo, pazaryeri, ödeme ya da e-posta — birden hata vermeye başladı ve kod değişmedi. Karşı taraf artık isteklerinizi reddediyor; sorun sizde değil, sizin hızınızda olabilir.",
    "en": "An integration running smoothly for months — carrier, marketplace, payment gateway, or transactional email — abruptly fails with HTTP 429. The remote host is throttling your traffic due to volumetric burst limits."
  },
  "logSatirlari": [
    "HTTP 429 Too Many Requests",
    "Retry-After: 60",
    "X-RateLimit-Remaining: 0",
    "Sağlayıcı paneli: quota exceeded for this period"
  ],
  "logNotu": {
    "tr": "Retry-After başlığı ne kadar beklemeniz gerektiğini söyler. Bu başlık okunmadan yapılan yeniden denemeler limiti daha da uzatır.",
    "en": "The Retry-After header indicates the mandatory cooldown interval. Retrying blindly without parsing backoff headers prolongs IP ban windows."
  },
  "nedenler": [
    {
      "harf": "A",
      "ad": {
        "tr": "Hacim büyüdü",
        "en": "Natural volume growth"
      },
      "aciklama": {
        "tr": "İş büyüdü, istek sayısı sessizce limitin üstüne çıktı. Kod aynı, trafik değişti.",
        "en": "Order volume scaled naturally, exceeding baseline API tier quota without notice."
      },
      "kanit": {
        "tr": "İstek sayısı zamanla artmış → A",
        "en": "Request rate climbed over time → A"
      },
      "diyagramAd": {
        "tr": "Hacim büyüdü",
        "en": "Volume growth"
      },
      "diyagramTest": {
        "tr": [
          "İstek sayısı son",
          "aylarda arttı mı?"
        ],
        "en": [
          "Has API traffic",
          "grown steadily in",
          "recent months?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Toplu istek +",
          "paket yükseltme"
        ],
        "en": [
          "Batch payloads +",
          "upgrade API tier"
        ]
      }
    },
    {
      "harf": "B",
      "ad": {
        "tr": "Döngüsel tekrar",
        "en": "Retry storm (No backoff)"
      },
      "aciklama": {
        "tr": "Hata sonrası yeniden deneme mantığı beklemeden tekrarlıyor ve limiti kendi kendine dolduruyor.",
        "en": "Worker catches transient error and immediately hammers API in tight loop, exhausting rate limits."
      },
      "kanit": {
        "tr": "Aynı istek çok kısa aralıkla tekrarlıyor → B",
        "en": "Rapid repeated requests in log → B"
      },
      "diyagramAd": {
        "tr": "Döngüsel tekrar",
        "en": "Retry storm"
      },
      "diyagramTest": {
        "tr": [
          "Aynı istek çok",
          "kısa aralıkla mı",
          "tekrarlıyor?"
        ],
        "en": [
          "Are retry requests",
          "fired without",
          "backoff delays?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Artan bekleme",
          "süresi ekle"
        ],
        "en": [
          "Exponential",
          "backoff + jitter",
          "retry logic"
        ]
      }
    },
    {
      "harf": "C",
      "ad": {
        "tr": "Limit değişti",
        "en": "Provider quota downgrade"
      },
      "aciklama": {
        "tr": "Karşı taraf kotayı değiştirdi ya da fiyat planı düştü. Sizde hiçbir şey değişmedi.",
        "en": "Upstream provider tightened throttle policy or subscription plan lapsed to free tier."
      },
      "kanit": {
        "tr": "Limit başlığındaki değer düşmüş → C",
        "en": "X-RateLimit cap dropped in headers → C"
      },
      "diyagramAd": {
        "tr": "Limit değişti",
        "en": "Quota reduced"
      },
      "diyagramTest": {
        "tr": [
          "Limit başlığındaki",
          "değer düştü mü?"
        ],
        "en": [
          "Did rate limit",
          "header cap drop",
          "unexpectedly?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Sağlayıcıyla plan",
          "görüşmesi"
        ],
        "en": [
          "Negotiate higher",
          "tier with vendor"
        ]
      }
    }
  ],
  "kimCozer": {
    "tr": "Backend mühendisi. Kalıcı çözüm istek sayısını azaltmak ve artan bekleme süresiyle yeniden denemektir. Bu iki yapı kurulduğunda entegrasyon hacim büyüdükçe kendiliğinden uyum sağlar.",
    "en": "Backend engineer. Permanent resilience combines payload batching with exponential backoff and jitter algorithms. This enables integrations to scale gracefully with traffic spikes."
  },
  "cozulmezse": {
    "tr": "Reddedilen her istek eksik veri demektir: gönderilmeyen kargo bildirimi, güncellenmeyen stok, ulaşmayan e-posta. Sistem çalışıyor görünür ama içerik doğru değildir.",
    "en": "Throttled requests mean desynchronized operations: tracking numbers unsent, inventory un-updated, customer transactional emails lost in queue."
  },
  "ilgiliTerimler": [
    "rate-limit",
    "webhook",
    "idempotency"
  ],
  "ilgiliHizmet": {
    "baslik": {
      "tr": "B2B White-Label Mühendislik Masası",
      "en": "B2B White-Label Engineering Desk"
    },
    "link": "/agency/"
  }
};
