export default {
  "slug": "site-500-veriyor-dun-calisiyordu",
  "no": "13",
  "baslik": {
    "tr": "Site 500 veriyor, dün çalışıyordu",
    "en": "Site Returning 500 Error, Worked Yesterday"
  },
  "diyagramBaslik": {
    "tr": "Site 500 veriyor",
    "en": "Site 500 error"
  },
  "kirinti": {
    "tr": "Canlı Arıza",
    "en": "Live Outage"
  },
  "aciliyet": {
    "seviye": "kritik",
    "etiket": {
      "tr": "Kritik · site kapalı",
      "en": "Critical · outage"
    }
  },
  "ozet": {
    "tr": "Dün sorunsuz açılan site bugün 500 veriyor ve kimse bir şey değiştirmediğini söylüyor. \"Hiçbir şey değişmedi\" cümlesi neredeyse her zaman yanlıştır — değişen bir şey vardır, sadece kod olmayabilir.",
    "en": "A website that booted flawlessly yesterday throws 500 errors today, with team members insisting nothing changed. \"Nothing changed\" is almost always false — something mutated, just not necessarily code."
  },
  "logSatirlari": [
    "PHP Fatal error / Uncaught Error        ← uygulama log'u",
    "502 Bad Gateway · upstream prematurely closed connection",
    "No space left on device",
    "SQLSTATE[HY000] [2002] Connection refused"
  ],
  "logNotu": {
    "tr": "500 bir teşhis değil, bir kapaktır. Gerçek neden uygulama log'unda, bir alt satırdadır. Sunucu log'una bakılmadan yapılan her tahmin zaman kaybıdır.",
    "en": "HTTP 500 is not a diagnosis; it is a generic wrapper. The actual root cause lives in application error logs one line below. Any guesswork without log inspection is wasted downtime."
  },
  "nedenler": [
    {
      "harf": "A",
      "ad": {
        "tr": "Kimlik süresi doldu",
        "en": "Expired credentials"
      },
      "aciklama": {
        "tr": "Bir API anahtarı, veritabanı parolası veya servis hesabı süresi doldu. Kod değişmedi ama sistem artık bağlanamıyor.",
        "en": "An API key, database secret, or service account credential expired. Code remains untouched, but upstream authentication is failing."
      },
      "kanit": {
        "tr": "Log'da authentication failed → A",
        "en": "Authentication failed in log → A"
      },
      "diyagramAd": {
        "tr": "Kimlik süresi doldu",
        "en": "Expired credentials"
      },
      "diyagramTest": {
        "tr": [
          "Log'da 401 / auth",
          "hatası var mı?"
        ],
        "en": [
          "Is there a 401 /",
          "auth failure in",
          "system logs?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Anahtar yenileme",
          "· dakikalar"
        ],
        "en": [
          "Secret rotation",
          "· fixed in mins"
        ]
      }
    },
    {
      "harf": "B",
      "ad": {
        "tr": "Disk veya bellek doldu",
        "en": "Disk / memory exhausted"
      },
      "aciklama": {
        "tr": "Log dosyaları, yedekler ya da geçici dosyalar diski doldurdu; uygulama yazamıyor.",
        "en": "Log files, automated dumps, or temp caches filled the disk partition; runtime writes fail."
      },
      "kanit": {
        "tr": "No space left on device → B",
        "en": "No space left on device → B"
      },
      "diyagramAd": {
        "tr": "Disk / bellek doldu",
        "en": "Disk / memory full"
      },
      "diyagramTest": {
        "tr": [
          "df -h çıktısında",
          "%100 var mı?"
        ],
        "en": [
          "Does df -h output",
          "show 100% disk",
          "utilization?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Temizlik +",
          "log rotasyonu"
        ],
        "en": [
          "Disk sanitize +",
          "logrotate cron"
        ]
      }
    },
    {
      "harf": "C",
      "ad": {
        "tr": "Otomatik güncelleme",
        "en": "Unattended OS update"
      },
      "aciklama": {
        "tr": "Sunucu, kütüphane veya eklenti kendiliğinden güncellendi. \"Kimse dokunmadı\" doğrudur; dokunan sistemin kendisidir.",
        "en": "OS packages, shared libraries, or plugins auto-updated overnight. \"Nobody touched it\" is true; the daemon did."
      },
      "kanit": {
        "tr": "Paket log'unda gece güncellemesi → C",
        "en": "Nightly auto-update in apt/yum log → C"
      },
      "diyagramAd": {
        "tr": "Otomatik güncelleme",
        "en": "Auto update"
      },
      "diyagramTest": {
        "tr": [
          "Sistem log'unda",
          "dün gece update",
          "var mı?"
        ],
        "en": [
          "Did unattended",
          "upgrades execute",
          "last night?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Sürüm sabitleme",
          "+ geri alma"
        ],
        "en": [
          "Package pinning",
          "+ rollback patch"
        ]
      }
    }
  ],
  "kimCozer": {
    "tr": "A ve B sistem yöneticisi işidir ve çoğu zaman bir saatin altında kapanır. C'de geri alma yapılmadan önce hangi paketin güncellendiği tespit edilmelidir; yanlış paketi geri almak ikinci bir arıza üretir.",
    "en": "A and B are sysadmin operations, typically resolved in under one hour. For C, the exact mutated package must be identified before executing rollbacks; reverting the wrong library causes secondary outages."
  },
  "cozulmezse": {
    "tr": "500 veren sayfayı arama motorları da görür. Kesinti uzadıkça dizin kaybı başlar ve geri gelmesi kesintinin kendisinden uzun sürer.",
    "en": "Search engine crawlers index HTTP 500 responses immediately. Prolonged downtime induces organic de-indexing, which takes far longer to recover than resolving the incident."
  },
  "ilgiliTerimler": [
    "ci-cd",
    "staging-ortami",
    "memory-leak"
  ],
  "ilgiliHizmet": {
    "baslik": {
      "tr": "Kesinti Maliyeti Hesabı",
      "en": "Downtime Loss Calculator"
    },
    "link": "/kesinti-maliyeti/"
  }
};
