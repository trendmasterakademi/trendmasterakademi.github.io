export default {
  "slug": "deploy-sonrasi-site-bozuldu",
  "no": "10",
  "baslik": {
    "tr": "Deploy sonrası site bozuldu",
    "en": "Website Broke Immediately After Deployment"
  },
  "diyagramBaslik": {
    "tr": "Deploy sonrası bozuldu",
    "en": "Post-deploy break"
  },
  "kirinti": {
    "tr": "Canlı Arıza",
    "en": "Live Outage"
  },
  "aciliyet": {
    "seviye": "kritik",
    "etiket": {
      "tr": "Kritik · yayın hatası",
      "en": "Critical · deploy failure"
    }
  },
  "ozet": {
    "tr": "Yayın alındı ve site bozuldu. Geri almak isteniyor ama nasıl geri alınacağı belli değil. Asıl sorun bozulmanın kendisi değil, geri dönüşün planlanmamış olmasıdır.",
    "en": "A new release went live and the site broke. The team wants to rollback but has no documented rollback plan. The critical failure is not the bug itself, but the lack of an atomic rollback mechanism."
  },
  "logSatirlari": [
    "Yayın kaydı: hangi sürüm, ne zaman, kim tarafından?",
    "Yeni hata mesajları yayın saatinde mi başlıyor?",
    "Statik dosyalar eski sürümde kalmış (önbellek)",
    "Veritabanı göçü yayınla birlikte çalıştı mı?"
  ],
  "logNotu": {
    "tr": "Bozulmanın yayın saatiyle çakışması tek başına sebep kanıtı değildir ama aramayı doğru yere odaklar. İlk soru \"ne değişti\" değil, \"geri alabiliyor muyuz\"dur.",
    "en": "A crash coinciding with deployment timestamp pinpoints where to investigate. The primary question is never 'what changed', but 'can we immediately roll back'."
  },
  "nedenler": [
    {
      "harf": "A",
      "ad": {
        "tr": "Eksik dosya",
        "en": "Missing build asset / vendor"
      },
      "aciklama": {
        "tr": "Yayın paketinde bir şey eksik kaldı; yerelde var, sunucuda yok.",
        "en": "Artifact or composer/npm dependency omitted from build bundle. Present locally, missing on server."
      },
      "kanit": {
        "tr": "Log'da dosya veya modül bulunamadı → A",
        "en": "Class / file not found in logs → A"
      },
      "diyagramAd": {
        "tr": "Eksik dosya",
        "en": "Missing file"
      },
      "diyagramTest": {
        "tr": [
          "Log'da bulunamadı",
          "hatası var mı?"
        ],
        "en": [
          "Do logs show 404 /",
          "missing module",
          "fatal errors?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Paketi tam yayınla",
          "· geri alma hazır"
        ],
        "en": [
          "Deploy complete",
          "bundle · one-click",
          "rollback ready"
        ]
      }
    },
    {
      "harf": "B",
      "ad": {
        "tr": "Önbellek eskisi",
        "en": "Stale client / CDN cache"
      },
      "aciklama": {
        "tr": "Kod yeni, tarayıcı veya sunucu önbelleği eski. Kısmi bozulma tipik belirtisidir.",
        "en": "HTML references new JS bundles while CDN or browser serves cached legacy files, causing partial rendering crashes."
      },
      "kanit": {
        "tr": "Zorla yenilemede düzeliyor → B",
        "en": "Hard refresh resolves visual glitch → B"
      },
      "diyagramAd": {
        "tr": "Önbellek eskisi",
        "en": "Stale cache"
      },
      "diyagramTest": {
        "tr": [
          "Zorla yenilemede",
          "düzeliyor mu?"
        ],
        "en": [
          "Does Shift+F5 hard",
          "reload fix the",
          "page layout?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Sürümlü dosya adı",
          "+ önbellek temizle"
        ],
        "en": [
          "Content hashing +",
          "automated CDN cache",
          "purge on deploy"
        ]
      }
    },
    {
      "harf": "C",
      "ad": {
        "tr": "Şema uyuşmazlığı",
        "en": "Database schema desync"
      },
      "aciklama": {
        "tr": "Kod yeni şemayı bekliyor ama göç çalışmadı, ya da tersi. Geri alma tek başına yetmez.",
        "en": "Code expects newly added table columns but migration failed to run, or vice versa. Code rollback alone is insufficient."
      },
      "kanit": {
        "tr": "Kolon veya tablo hatası var → C",
        "en": "Column not found SQL errors → C"
      },
      "diyagramAd": {
        "tr": "Şema uyuşmazlığı",
        "en": "Schema mismatch"
      },
      "diyagramTest": {
        "tr": [
          "Kolon veya tablo",
          "hatası var mı?"
        ],
        "en": [
          "Are SQL schema /",
          "missing column",
          "errors present?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Kod ve göçü",
          "birlikte geri al"
        ],
        "en": [
          "Rollback schema +",
          "revert code",
          "synchronously"
        ]
      }
    }
  ],
  "kimCozer": {
    "tr": "Kalıcı çözüm daha dikkatli yayın yapmak değil, her yayının geri alınabilir olmasıdır: sürüm etiketi, ayrı statik dosya adları ve göçün koddan bağımsız geri alınabilmesi. Bu üçü kurulduğunda bozuk yayın bir kriz değil, dakikalık bir işlem olur.",
    "en": "Permanent reliability requires automated rollbacks: immutable git releases, content-hashed assets, and backward-compatible database migrations. When in place, a bad deploy is resolved in 60 seconds."
  },
  "cozulmezse": {
    "tr": "Geri alınamayan her yayın ekibi yayın yapmaktan korkutur. Korku teslimleri yavaşlatır ve biriken değişiklikler bir sonraki yayını daha da riskli yapar.",
    "en": "Un-rollbackable deployments breed release terror. Fear slows iteration cadence, causing massive batch releases that exponentially increase risk."
  },
  "ilgiliTerimler": [
    "ci-cd",
    "staging-ortami",
    "migration"
  ],
  "ilgiliHizmet": {
    "baslik": {
      "tr": "Acil Kriz Müdahalesi & Crash Test",
      "en": "Emergency Incident Triage & Crash Test"
    },
    "link": "/crash-test/"
  }
};
