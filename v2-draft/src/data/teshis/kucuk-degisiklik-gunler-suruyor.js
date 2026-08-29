export default {
  "slug": "kucuk-degisiklik-gunler-suruyor",
  "no": "20",
  "baslik": {
    "tr": "Küçük değişiklik günler sürüyor",
    "en": "Minor Changes Take Days to Deliver"
  },
  "diyagramBaslik": {
    "tr": "Değişiklik çok yavaş",
    "en": "Trivial change delay"
  },
  "kirinti": {
    "tr": "Kod Sağlığı",
    "en": "Code Health"
  },
  "aciliyet": {
    "seviye": "orta",
    "etiket": {
      "tr": "Orta · hız kaybı",
      "en": "Medium · velocity loss"
    }
  },
  "ozet": {
    "tr": "\"Bir buton rengi\" ya da \"bir alan ekle\" gibi işler günlere yayılıyor ve müşteri bunu isteksizlik sanıyor. Gerçek sebep genellikle kodda değil, değişikliği yapmadan önce anlamak için harcanan sürededir.",
    "en": "Trivial edits like updating button styles or adding a form field drag on for days, leading clients to assume reluctance. The root cause is not developer speed, but the cognitive overhead of deciphering undocumented code."
  },
  "logSatirlari": [
    "Görev süresi: tahmin 2 saat, gerçekleşen 2 gün",
    "Kurulum: yeni bir geliştirici projeyi kaç günde çalıştırıyor?",
    "Belge var mı: kurulum notu, mimari şeması, karar kaydı",
    "Yayın sıklığı: haftada kaç kez canlıya çıkılabiliyor?"
  ],
  "logNotu": {
    "tr": "En açıklayıcı ölçü, yeni bir geliştiricinin projeyi ilk kez çalıştırma süresidir. Bu süre bir günden uzunsa gecikmenin sebebi yetenek değil ortamdır.",
    "en": "The clearest benchmark is time-to-first-commit for a new developer. If local onboarding takes longer than one day, velocity loss stems from developer experience, not individual talent."
  },
  "nedenler": [
    {
      "harf": "A",
      "ad": {
        "tr": "Belgesizlik",
        "en": "Zero developer documentation"
      },
      "aciklama": {
        "tr": "Bilgi kimsenin yazmadığı yerde, insanların kafasında. Her değişiklik önce arkeoloji gerektiriyor.",
        "en": "Domain knowledge exists solely in individuals' memories. Every change requires historical code archaeology."
      },
      "kanit": {
        "tr": "Kurulum belgesi yok → A",
        "en": "Missing README / architecture docs → A"
      },
      "diyagramAd": {
        "tr": "Belgesizlik",
        "en": "Zero docs"
      },
      "diyagramTest": {
        "tr": [
          "Yeni biri projeyi",
          "bir günde ayağa",
          "kaldırabilir mi?"
        ],
        "en": [
          "Can a new dev boot",
          "the project locally",
          "within 1 day?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Kurulum ve karar",
          "kaydı yaz"
        ],
        "en": [
          "Write README setup",
          "+ architecture",
          "decision records"
        ]
      }
    },
    {
      "harf": "B",
      "ad": {
        "tr": "Elle yayın",
        "en": "Manual deployment ceremony"
      },
      "aciklama": {
        "tr": "Her teslim elle yapılıyor; küçük bir değişiklik bile uzun bir tören gerektiriyor.",
        "en": "Deployments rely on manual FTP / SSH commands; tiny tweaks require extensive manual rituals."
      },
      "kanit": {
        "tr": "Yayın elle ve uzun → B",
        "en": "Manual FTP/SSH release steps → B"
      },
      "diyagramAd": {
        "tr": "Elle yayın",
        "en": "Manual deploy"
      },
      "diyagramTest": {
        "tr": [
          "Yayın tek komutla",
          "yapılabiliyor mu?"
        ],
        "en": [
          "Is deployment",
          "automated with a",
          "single command?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Yayını otomatikleştir",
          "· tek adım"
        ],
        "en": [
          "Automate CI/CD ·",
          "one-click release",
          "pipeline"
        ]
      }
    },
    {
      "harf": "C",
      "ad": {
        "tr": "Karışık yapı",
        "en": "Unstructured spaghetti architecture"
      },
      "aciklama": {
        "tr": "Değişiklik gereken yeri bulmak zaman alıyor; mantık dağınık, isimlendirme tutarsız.",
        "en": "Locating which file controls the feature takes hours; scattered business logic and inconsistent naming conventions."
      },
      "kanit": {
        "tr": "Yeri bulmak saatler sürüyor → C",
        "en": "Hours spent locating source code file → C"
      },
      "diyagramAd": {
        "tr": "Karışık yapı",
        "en": "Spaghetti logic"
      },
      "diyagramTest": {
        "tr": [
          "Değişecek yeri",
          "bulmak saatler",
          "sürüyor mu?"
        ],
        "en": [
          "Does locating target",
          "logic require hours",
          "of grep searching?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Dokunulan yeri",
          "kademeli düzenle"
        ],
        "en": [
          "Apply Scout Rule:",
          "clean up target",
          "module gradually"
        ]
      }
    }
  ],
  "kimCozer": {
    "tr": "Bu üçünün hiçbiri \"daha çok çalışarak\" çözülmez. Yatırımın karşılığı ilk haftada görünmez, ikinci ayda görünür: aynı ekip aynı sürede belirgin biçimde daha çok iş çıkarır.",
    "en": "None of these are resolved by 'working overtime'. The payoff is felt by month two: identical teams outputting dramatically higher volume with zero overtime."
  },
  "cozulmezse": {
    "tr": "Yavaşlık bileşik büyür ve ilişkiyi aşındırır. Müşteri gecikmeyi ilgisizlik sanır; ekip ise gerçekten çalıştığı hâlde savunmaya geçer.",
    "en": "Sluggish delivery erodes client relationships. Clients interpret delays as neglect, while engineers burn out operating in an unmaintained codebase."
  },
  "ilgiliTerimler": [
    "refactor",
    "teknik-borc",
    "ci-cd"
  ],
  "ilgiliHizmet": {
    "baslik": {
      "tr": "B2B White-Label Mühendislik Masası",
      "en": "B2B White-Label Engineering Desk"
    },
    "link": "/agency/"
  }
};
