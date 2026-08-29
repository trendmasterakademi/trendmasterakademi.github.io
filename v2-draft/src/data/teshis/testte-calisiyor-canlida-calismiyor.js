export default {
  "slug": "testte-calisiyor-canlida-calismiyor",
  "no": "14",
  "baslik": {
    "tr": "Test ortamında çalışıyor, canlıda çalışmıyor",
    "en": "Works in Staging, Fails in Production"
  },
  "diyagramBaslik": {
    "tr": "Testte çalışıyor",
    "en": "Works in staging only"
  },
  "kirinti": {
    "tr": "Devir & Süreklilik",
    "en": "Handover & Continuity"
  },
  "aciliyet": {
    "seviye": "yuksek",
    "etiket": {
      "tr": "Yüksek · teslim engeli",
      "en": "High · release blocker"
    }
  },
  "ozet": {
    "tr": "Geliştirici \"bende çalışıyor\" diyor ve haklı. Canlıda aynı kod farklı davranıyor. Bu bir yetenek sorunu değil, iki ortamın birbirinin aynısı olmamasının sonucudur.",
    "en": "The developer says 'it works on my machine' and they are correct. In production, identical code behaves differently. This is environment drift, not a developer competency flaw."
  },
  "logSatirlari": [
    "Undefined env variable / configuration missing",
    "Yalnız canlıda 500, testte 200",
    "Kütüphane sürümleri: kilit dosyası var mı, uyuşuyor mu?",
    "Permission denied — dosya izni veya yol hatası"
  ],
  "logNotu": {
    "tr": "Fark her zaman üç yerden birindedir: yapılandırma, sürüm, izin. Dördüncü bir yer aramak zaman kaybıdır.",
    "en": "Environment drift always lives in one of three places: configuration, dependency versions, or file permissions. Searching elsewhere wastes critical incident time."
  },
  "nedenler": [
    {
      "harf": "A",
      "ad": {
        "tr": "Yapılandırma farkı",
        "en": "Configuration drift"
      },
      "aciklama": {
        "tr": "Canlıda bir ortam değişkeni eksik ya da farklı. Kod aynı, girdisi değil.",
        "en": "Production environment variable missing or set to invalid endpoint. Same code, differing inputs."
      },
      "kanit": {
        "tr": "Canlıda eksik değişken → A",
        "en": "Missing .env in production → A"
      },
      "diyagramAd": {
        "tr": "Yapılandırma farkı",
        "en": "Config drift"
      },
      "diyagramTest": {
        "tr": [
          "Canlıda eksik",
          "ortam değişkeni",
          "var mı?"
        ],
        "en": [
          "Is an environment",
          "variable missing",
          "in production?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Değişken listesini",
          "eşitle + örnek",
          "dosya tut"
        ],
        "en": [
          "Sync .env schema",
          "+ track .env.example",
          "in git"
        ]
      }
    },
    {
      "harf": "B",
      "ad": {
        "tr": "Sürüm farkı",
        "en": "Dependency / runtime mismatch"
      },
      "aciklama": {
        "tr": "Kütüphane veya dil sürümü iki ortamda farklı. Bağımlılıklar sabitlenmemiş.",
        "en": "Language or package minor versions differ between environments. Unlocked package versions drifted."
      },
      "kanit": {
        "tr": "Sürümler uyuşmuyor → B",
        "en": "Version mismatch in lockfile → B"
      },
      "diyagramAd": {
        "tr": "Sürüm farkı",
        "en": "Version mismatch"
      },
      "diyagramTest": {
        "tr": [
          "Kilit dosyası var",
          "ve sürümler",
          "aynı mı?"
        ],
        "en": [
          "Are lockfile package",
          "versions identical",
          "across tiers?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Sürümleri sabitle",
          "· kilit dosyası"
        ],
        "en": [
          "Commit strict",
          "package-lock /",
          "composer.lock"
        ]
      }
    },
    {
      "harf": "C",
      "ad": {
        "tr": "İzin / yol farkı",
        "en": "Permissions / path discrepancy"
      },
      "aciklama": {
        "tr": "Canlıda yazma izni yok ya da dosya yolu farklı. Testte yerel klasör, canlıda kısıtlı dizin.",
        "en": "Target directory lacks write permissions on production web server, or hardcoded absolute path fails."
      },
      "kanit": {
        "tr": "Permission denied → C",
        "en": "Permission denied in production log → C"
      },
      "diyagramAd": {
        "tr": "İzin / yol farkı",
        "en": "Permissions / path"
      },
      "diyagramTest": {
        "tr": [
          "Log'da izin ya da",
          "yol hatası var mı?"
        ],
        "en": [
          "Does log show",
          "EACCES / permission",
          "denied errors?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "İzinleri ve yolu",
          "ortamdan oku"
        ],
        "en": [
          "Fix chmod permissions",
          "+ load dynamic",
          "paths"
        ]
      }
    }
  ],
  "kimCozer": {
    "tr": "Backend veya sistem tarafı. Kalıcı çözüm farkları tek tek kapatmak değil, iki ortamı aynı tarifle kurmaktır; aksi hâlde her teslimde yeni bir fark çıkar.",
    "en": "Backend / DevOps. Permanent stability comes from Infrastructure as Code and immutable container recipes; patching discrepancies ad-hoc leaves every future release vulnerable."
  },
  "cozulmezse": {
    "tr": "Her yayın bir kumar hâline gelir. Ekip canlıya çıkmaktan çekinir, teslimler birikir ve tek seferde çıkan büyük paketler riski daha da büyütür.",
    "en": "Every deployment becomes a high-stakes gamble. Teams dread pushing to prod, backlogs swell, and large batch deploys magnify catastrophic blast radiuses."
  },
  "ilgiliTerimler": [
    "staging-ortami",
    "ci-cd",
    "migration"
  ],
  "ilgiliHizmet": {
    "baslik": {
      "tr": "Devir Hazırlık Kontrolü",
      "en": "Handover Readiness Audit"
    },
    "link": "/devir-kontrolu/"
  }
};
