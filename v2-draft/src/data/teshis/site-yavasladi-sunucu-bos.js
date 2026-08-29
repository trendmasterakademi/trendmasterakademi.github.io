export default {
  "slug": "site-yavasladi-sunucu-bos",
  "no": "11",
  "baslik": {
    "tr": "Site yavaşladı ama sunucu boş",
    "en": "Site Stalled Despite Idle Server Resources"
  },
  "diyagramBaslik": {
    "tr": "Yavaş ama sunucu boş",
    "en": "Slow with idle server"
  },
  "kirinti": {
    "tr": "Performans",
    "en": "Performance"
  },
  "aciliyet": {
    "seviye": "yuksek",
    "etiket": {
      "tr": "Yüksek · dönüşüm kaybı",
      "en": "High · conversion loss"
    }
  },
  "ozet": {
    "tr": "Sayfalar geç açılıyor ama sunucu kaynakları rahat görünüyor. 'Sunucu yetersiz' denip plan yükseltilir, hiçbir şey değişmez. Boş bir sunucuda yavaşlık kaynak sorunu değil, bekleme sorunudur.",
    "en": "Page latency surges while server CPU and RAM remain idle. Upgrading infrastructure tiers changes nothing. Sluggish performance on idle servers is a blocking I/O bottleneck, not a compute limitation."
  },
  "logSatirlari": [
    "Sayfa başına veritabanı sorgu sayısı: yüzlerce",
    "Yavaş sorgu log'u: aynı sorgu defalarca tekrarlıyor",
    "Harici servis çağrısı: 2–8 saniye bekleme",
    "İlk bayt süresi yüksek, indirme hızlı"
  ],
  "logNotu": {
    "tr": "Sunucu boşken yaşanan yavaşlık, sistemin çalışmadığını değil beklediğini gösterir. Aranacak şey işlemci kullanımı değil, isteğin nerede beklediğidir.",
    "en": "Latency with low CPU indicates blocking wait states. The metric to investigate is not CPU utilization, but where the thread is blocking."
  },
  "nedenler": [
    {
      "harf": "A",
      "ad": {
        "tr": "Sorgu çoğalması",
        "en": "N+1 query explosion"
      },
      "aciklama": {
        "tr": "Listedeki her satır için ayrı sorgu atılıyor. 10 kayıtla fark edilmez, 500 kayıtla site durur.",
        "en": "Loop triggers separate SQL queries for each item. Unnoticeable with 10 items, catastrophic with 500."
      },
      "kanit": {
        "tr": "Aynı sorgu defalarca tekrarlıyor → A",
        "en": "Same query loops hundreds of times → A"
      },
      "diyagramAd": {
        "tr": "Sorgu çoğalması",
        "en": "N+1 queries"
      },
      "diyagramTest": {
        "tr": [
          "Aynı sorgu sayfa",
          "başına defalarca",
          "mı tekrarlıyor?"
        ],
        "en": [
          "Does same query",
          "execute hundreds",
          "of times per hit?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "İlişkileri toplu",
          "çek · saatler",
          "içinde biter"
        ],
        "en": [
          "Eager loading +",
          "batch SQL joins",
          "· resolved today"
        ]
      }
    },
    {
      "harf": "B",
      "ad": {
        "tr": "Dizin eksik",
        "en": "Missing database index"
      },
      "aciklama": {
        "tr": "Sorgu doğru ama tablo baştan sona taranıyor. Veri büyüdükçe süre doğrusal artar.",
        "en": "Query syntax is clean but triggers full table scans (Seq Scan). Duration grows linearly with table size."
      },
      "kanit": {
        "tr": "Yavaş sorgu tüm tabloyu tarıyor → B",
        "en": "Full table scan in EXPLAIN log → B"
      },
      "diyagramAd": {
        "tr": "Dizin eksik",
        "en": "Missing index"
      },
      "diyagramTest": {
        "tr": [
          "Yavaş sorgu tüm",
          "tabloyu mu",
          "tarıyor?"
        ],
        "en": [
          "Does EXPLAIN show",
          "full table scan",
          "on large tables?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Dizin ekle ·",
          "etki anında"
        ],
        "en": [
          "Add composite",
          "index · instant",
          "speedup"
        ]
      }
    },
    {
      "harf": "C",
      "ad": {
        "tr": "Harici bekleme",
        "en": "Synchronous third-party I/O"
      },
      "aciklama": {
        "tr": "Kargo, ödeme veya stok servisi yavaş yanıt veriyor ve sayfa onu bekliyor.",
        "en": "Outbound carrier, payment, or ERP API is slow and web process blocks execution."
      },
      "kanit": {
        "tr": "Yavaşlık harici çağrıda yoğunlaşıyor → C",
        "en": "Latency concentrated in external cURL → C"
      },
      "diyagramAd": {
        "tr": "Harici bekleme",
        "en": "Third-party wait"
      },
      "diyagramTest": {
        "tr": [
          "Yavaşlık harici",
          "çağrıda mı",
          "yoğunlaşıyor?"
        ],
        "en": [
          "Is TTFB spent on",
          "outbound 3rd-party",
          "HTTP requests?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Önbellek + zaman",
          "aşımı + arka",
          "plana al"
        ],
        "en": [
          "Redis cache +",
          "strict timeouts +",
          "async background"
        ]
      }
    }
  ],
  "kimCozer": {
    "tr": "Kıdemli backend mühendisi. A ve B çoğunlukla aynı gün kapanır ve etkisi anında görülür. C'de asıl mesele harici servisi hızlandırmak değil, sayfanın onu beklememesini sağlamaktır.",
    "en": "Senior backend engineer. A and B are resolved in hours with instant speedup. For C, the solution is asynchronous decoupling so pages never block on third parties."
  },
  "cozulmezse": {
    "tr": "Yavaşlık dönüşümü doğrudan düşürür ve arama sıralamasında da karşılığı vardır. Sunucu yükseltmek maliyeti artırır, belirtiyi bir süre örter, nedeni bırakır.",
    "en": "High latency degrades checkout conversion and organic Core Web Vitals. Server upgrades mask symptoms temporarily while increasing cloud spend without fixing root flaws."
  },
  "ilgiliTerimler": [
    "n-plus-1-sorgu",
    "teknik-borc",
    "rate-limit"
  ],
  "ilgiliHizmet": {
    "baslik": {
      "tr": "Kesinti Maliyeti Hesabı",
      "en": "Downtime Loss Calculator"
    },
    "link": "/kesinti-maliyeti/"
  }
};
