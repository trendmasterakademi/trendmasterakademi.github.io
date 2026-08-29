export default {
  "slug": "her-yeni-ozellik-oncekini-bozuyor",
  "no": "15",
  "baslik": {
    "tr": "Her yeni özellik bir öncekini bozuyor",
    "en": "Every New Feature Breaks an Existing Feature"
  },
  "diyagramBaslik": {
    "tr": "Her özellik bozuyor",
    "en": "New features break old"
  },
  "kirinti": {
    "tr": "Kod Sağlığı",
    "en": "Code Health"
  },
  "aciliyet": {
    "seviye": "yuksek",
    "etiket": {
      "tr": "Yüksek · birikmiş borç",
      "en": "High · technical debt"
    }
  },
  "ozet": {
    "tr": "Bir yeri düzeltiyorsunuz, başka bir yer bozuluyor. Ekip aynı hataları tekrar tekrar düzeltiyor. Bu bir dikkatsizlik değil, kod tabanının artık değişimi kaldıramadığının işaretidir.",
    "en": "Fixing one module breaks another unrelated area. The development team repeatedly patches the same recurring bugs. This is not developer negligence, but architectural fragility from accumulated technical debt."
  },
  "logSatirlari": [
    "Aynı hata kaydının aylar içinde tekrar açılması",
    "Test yok, ya da var ama çalıştırılmıyor",
    "Tek bir dosyanın binlerce satır olması",
    "Aynı mantığın üç ayrı yerde kopyalanmış olması"
  ],
  "logNotu": {
    "tr": "Ölçülebilir tek gösterge tekrar açılan hata sayısıdır. \"Kod kötü\" bir histir; \"aynı hata üç ayda dört kez açıldı\" bir veridir.",
    "en": "The only objective metric is bug regression frequency. 'Code feels bad' is subjective sentiment; 'the same checkout defect reopened four times in 90 days' is actionable data."
  },
  "nedenler": [
    {
      "harf": "A",
      "ad": {
        "tr": "Kopyalanmış mantık",
        "en": "Duplicated business logic"
      },
      "aciklama": {
        "tr": "Aynı kural birden çok yerde yazılı. Biri düzeltiliyor, diğerleri unutuluyor.",
        "en": "Identical calculation logic copy-pasted across multiple controllers. Fixing one leaves the others broken."
      },
      "kanit": {
        "tr": "Aynı mantık birden çok yerde → A",
        "en": "Duplicated algorithms in codebase → A"
      },
      "diyagramAd": {
        "tr": "Kopyalanmış mantık",
        "en": "Duplicated logic"
      },
      "diyagramTest": {
        "tr": [
          "Aynı kural birden",
          "fazla yerde mi",
          "yazılı?"
        ],
        "en": [
          "Is business logic",
          "duplicated in multiple",
          "controllers?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Tek yere topla ·",
          "kademeli"
        ],
        "en": [
          "Consolidate to single",
          "service class ·",
          "incremental"
        ]
      }
    },
    {
      "harf": "B",
      "ad": {
        "tr": "Test yok",
        "en": "Missing regression test suite"
      },
      "aciklama": {
        "tr": "Güvenlik ağı yok; bir değişikliğin neyi bozduğu ancak canlıda anlaşılıyor.",
        "en": "Zero automated unit/integration tests exist; side effects are discovered only after real customers encounter crashes."
      },
      "kanit": {
        "tr": "Otomatik test yok → B",
        "en": "Zero test coverage in CI pipeline → B"
      },
      "diyagramAd": {
        "tr": "Test yok",
        "en": "Zero tests"
      },
      "diyagramTest": {
        "tr": [
          "Kritik akışların",
          "testi var mı?"
        ],
        "en": [
          "Do automated tests",
          "cover critical",
          "checkout paths?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Önce kritik akışa",
          "test yaz"
        ],
        "en": [
          "Write regression",
          "tests on critical",
          "flows FIRST"
        ]
      }
    },
    {
      "harf": "C",
      "ad": {
        "tr": "Aşırı bağlılık",
        "en": "High module coupling"
      },
      "aciklama": {
        "tr": "Modüller birbirine sıkı bağlı; bir yeri değiştirmek zinciri kırıyor.",
        "en": "Tightly coupled components mutate shared global state; altering one class triggers unpredictable cascade breaks."
      },
      "kanit": {
        "tr": "Küçük değişiklik geniş etki yapıyor → C",
        "en": "Minor patch creates wide blast radius → C"
      },
      "diyagramAd": {
        "tr": "Aşırı bağlılık",
        "en": "Tight coupling"
      },
      "diyagramTest": {
        "tr": [
          "Küçük değişiklik",
          "çok yeri mi",
          "etkiliyor?"
        ],
        "en": [
          "Does localized edit",
          "break unrelated",
          "views?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Sınırları ayır ·",
          "parça parça"
        ],
        "en": [
          "Decouple boundaries",
          "via interfaces ·",
          "step by step"
        ]
      }
    }
  ],
  "kimCozer": {
    "tr": "Kıdemli mühendis. Ama sıra bağlayıcıdır: önce test, sonra düzeltme. Güvenlik ağı olmadan yapılan büyük temizlik, mevcut arızalara yenilerini ekler. Her şeyi baştan yazmak neredeyse hiçbir zaman doğru cevap değildir.",
    "en": "Senior software architect. Sequence is mandatory: write regression tests FIRST, then refactor. Refactoring without test safety nets introduces secondary defects. Total rewrites from scratch are almost never the correct strategy."
  },
  "cozulmezse": {
    "tr": "Her yeni özelliğin maliyeti bir öncekinden yüksek olur. Ekip aynı işi daha uzun sürede yapmaya başlar ve bu dışarıdan \"yavaşladılar\" gibi görünür.",
    "en": "Development velocity stalls exponentially. Simple features take weeks, engineering morale plummets, and external stakeholders perceive the engineering team as ineffective."
  },
  "ilgiliTerimler": [
    "teknik-borc",
    "refactor",
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
