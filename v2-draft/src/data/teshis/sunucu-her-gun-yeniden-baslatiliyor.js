export default {
  "slug": "sunucu-her-gun-yeniden-baslatiliyor",
  "no": "07",
  "baslik": {
    "tr": "Sunucu her gün yeniden başlatılıyor",
    "en": "Server Rebooted Daily to Clear Freeze"
  },
  "diyagramBaslik": {
    "tr": "Günlük yeniden başlatma",
    "en": "Daily server restart"
  },
  "kirinti": {
    "tr": "Altyapı & Erişim",
    "en": "Infrastructure & Access"
  },
  "aciliyet": {
    "seviye": "yuksek",
    "etiket": {
      "tr": "Yüksek · gizlenen arıza",
      "en": "High · masked defect"
    }
  },
  "ozet": {
    "tr": "Site günün belirli saatinde yavaşlıyor veya kilitleniyor, sunucu yeniden başlatılınca düzeliyor. Bu bir çözüm değil, arızanın günlük olarak süpürülmesidir — ve her gün biraz erkene kayar.",
    "en": "The application slows down or freezes predictably every afternoon; rebooting restores normal function. Daily reboots are not a solution but a temporary band-aid — with degradation creeping earlier every day."
  },
  "logSatirlari": [
    "Out of memory: Killed process",
    "Bellek kullanımı zamanla artıyor, hiç düşmüyor",
    "Süreç yöneticisi: yeniden başlatma sayısı her gün artıyor",
    "Yanıt süreleri gün içinde giderek uzuyor"
  ],
  "logNotu": {
    "tr": "Bellek grafiğinin şekli tek başına teşhis koydurur: testere dişi normaldir, sürekli yükselen düz çizgi sızıntıdır.",
    "en": "Memory utilization graphs provide instant diagnosis: sawtooth patterns reflect healthy garbage collection; monotonic linear ascent proves memory leaks."
  },
  "nedenler": [
    {
      "harf": "A",
      "ad": {
        "tr": "Bellek sızıntısı",
        "en": "Application memory leak"
      },
      "aciklama": {
        "tr": "Uygulama ayırdığı belleği bırakmıyor; kullanım sürekli yükselir ve sistem sonunda süreci öldürür.",
        "en": "Unbounded caches or unclosed references accumulate until Linux OOM killer terminates the process."
      },
      "kanit": {
        "tr": "Bellek hiç düşmüyor → A",
        "en": "RAM usage never drops → A"
      },
      "diyagramAd": {
        "tr": "Bellek sızıntısı",
        "en": "Memory leak"
      },
      "diyagramTest": {
        "tr": [
          "Bellek grafiği hiç",
          "düşüyor mu?"
        ],
        "en": [
          "Does RAM graph",
          "ever drop during",
          "idle periods?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Sızıntıyı bul ·",
          "profil çıkar"
        ],
        "en": [
          "Heap dump profile",
          "+ patch leak"
        ]
      }
    },
    {
      "harf": "B",
      "ad": {
        "tr": "Büyük veri yükü",
        "en": "Unbuffered export spike"
      },
      "aciklama": {
        "tr": "Bir rapor veya dışa aktarma tüm kaydı belleğe alıyor. Sızıntı yok, tek seferlik aşırı yük var.",
        "en": "Bulk CSV export loads entire 500k row database into memory buffer at once, triggering instant OOM."
      },
      "kanit": {
        "tr": "Tepe belirli bir işlemde oluşuyor → B",
        "en": "Crash coincides with heavy report → B"
      },
      "diyagramAd": {
        "tr": "Büyük veri yükü",
        "en": "Heavy data load"
      },
      "diyagramTest": {
        "tr": [
          "Tepe belirli bir",
          "raporda mı",
          "oluşuyor?"
        ],
        "en": [
          "Do memory spikes",
          "correlate with bulk",
          "export jobs?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Parçalı işleme +",
          "akış kullan"
        ],
        "en": [
          "Stream chunking",
          "+ generator buffer"
        ]
      }
    },
    {
      "harf": "C",
      "ad": {
        "tr": "Kaynak yetersiz",
        "en": "Genuine capacity ceiling"
      },
      "aciklama": {
        "tr": "Sızıntı yok, iş gerçekten büyüdü. Bu, tek meşru 'sunucu yükselt' hâlidir.",
        "en": "Zero memory leaks; active concurrent user count simply exceeded instance memory limits."
      },
      "kanit": {
        "tr": "Kullanım sabit yüksek, artmıyor → C",
        "en": "Stable high load proportional to traffic → C"
      },
      "diyagramAd": {
        "tr": "Kaynak yetersiz",
        "en": "Capacity limit"
      },
      "diyagramTest": {
        "tr": [
          "Kullanım sabit",
          "yüksek ama",
          "artmıyor mu?"
        ],
        "en": [
          "Is RAM steady high",
          "proportional to",
          "active users?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Kaynak artırımı ·",
          "meşru tek hâl"
        ],
        "en": [
          "Scale instance RAM",
          "· valid upgrade"
        ]
      }
    }
  ],
  "kimCozer": {
    "tr": "A ve B yazılım tarafıdır; yeniden başlatma ikisini de gizler ama çözmez. C'de sunucu yükseltmek doğru karardır — ama A ve B elenmeden yapılırsa para harcanır, arıza kalır.",
    "en": "A and B are application bugs; automated cron reboots mask them without fixing. C is legitimate hardware scaling — but upgrading before diagnosing A & B wastes cloud spend while crashes persist."
  },
  "cozulmezse": {
    "tr": "Günlük yeniden başlatma bir gün yetmez hâle gelir ve kesinti tam yoğun saatte yaşanır. Zamanlanmış bir arıza gibidir: ne zaman olacağı bellidir, sadece tarihi bilinmez.",
    "en": "Daily reboots inevitably degrade into multi-hour crashes during high-traffic campaign peaks. It is a scheduled disaster waiting to execute."
  },
  "ilgiliTerimler": [
    "memory-leak",
    "teknik-borc",
    "ci-cd"
  ],
  "ilgiliHizmet": {
    "baslik": {
      "tr": "Kesinti Maliyeti Hesabı",
      "en": "Downtime Loss Calculator"
    },
    "link": "/kesinti-maliyeti/"
  }
};
