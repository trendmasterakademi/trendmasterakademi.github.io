export default {
  "slug": "bulut-hesabi-askiya-alindi",
  "no": "15",
  "baslik": {
    "tr": "Bulut hesabı askıya alındı, site kapandı",
    "en": "Cloud Account Suspended, Site Down"
  },
  "diyagramBaslik": {
    "tr": "Bulut hesabı askıda",
    "en": "Cloud account suspended"
  },
  "kirinti": {
    "tr": "Altyapı & Erişim",
    "en": "Infrastructure & Access"
  },
  "aciliyet": {
    "seviye": "kritik",
    "etiket": {
      "tr": "Kritik · site kapalı",
      "en": "Critical · outage"
    }
  },
  "ozet": {
    "tr": "Site aniden tamamen erişilemez oldu. Kod değişmedi, deploy yapılmadı, kimse bir şeye dokunmadı. Bu tablonun nedeni çoğu zaman kodda değildir — ve doğru yere bakmadan geçen her saat veri kaybı riskini büyütür.",
    "en": "The application became completely unreachable out of nowhere. No code changes, no deployments, no manual changes. The root cause is almost never within code — and every hour spent looking in the wrong place increases catastrophic data loss risk."
  },
  "logSatirlari": [
    "403 Forbidden  /  sağlayıcının bakım veya askı sayfası",
    "E-posta kutusu: 'Payment failed' · 'Final notice' · 'Account suspended'",
    "DNS çözülüyor ama: Connection refused / 502 Bad Gateway"
  ],
  "logNotu": {
    "tr": "İlk bakılacak yer sunucu değil, hesabın kayıtlı olduğu e-posta kutusudur. Sağlayıcılar askıya almadan önce genellikle birden fazla uyarı gönderir.",
    "en": "The first place to inspect is not server logs, but the root billing email inbox. Cloud providers virtually always dispatch multiple pre-suspension notices."
  },
  "nedenler": [
    {
      "harf": "A",
      "ad": {
        "tr": "Ödeme başarısız, hesap askıda",
        "en": "Billing failure / suspended"
      },
      "aciklama": {
        "tr": "Kartın süresi doldu ya da tahsilat başarısız oldu. Sağlayıcı uyarıları gönderdi, kimse okumadı. Teknik bir arıza yok.",
        "en": "Card expired or bank transaction declined. Provider dispatched warnings that went unread. Zero technical defect."
      },
      "kanit": {
        "tr": "Kutuda 'suspended' maili var → A",
        "en": "Suspension email in inbox → A"
      },
      "diyagramAd": {
        "tr": "Ödeme / askı",
        "en": "Billing / suspended"
      },
      "diyagramTest": {
        "tr": [
          "Fatura adresine",
          "'suspended' maili",
          "gelmiş mi?"
        ],
        "en": [
          "Was a suspended",
          "email sent to",
          "billing address?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Ödeme + hesap",
          "sahibi · saatler",
          "içinde açılır"
        ],
        "en": [
          "Payment update +",
          "account holder ·",
          "fixed in hours"
        ]
      }
    },
    {
      "harf": "B",
      "ad": {
        "tr": "Kaynak kotası doldu",
        "en": "Quota / resource limit"
      },
      "aciklama": {
        "tr": "Bant genişliği, disk veya CPU limiti aşıldı. Hesap askıda değil, kota kilidinde. Ödeme sorunu değildir.",
        "en": "Bandwidth, disk volume, or CPU throttle limits reached. Account is not delinquent, but throttled by quotas."
      },
      "kanit": {
        "tr": "Panelde kullanım %100 → B",
        "en": "Dashboard usage 100% → B"
      },
      "diyagramAd": {
        "tr": "Kota kilidi",
        "en": "Quota lock"
      },
      "diyagramTest": {
        "tr": [
          "Panelde disk /",
          "bant genişliği",
          "%100 mü?"
        ],
        "en": [
          "Is disk or",
          "bandwidth usage",
          "at 100% cap?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Plan yükseltme",
          "veya kaynak",
          "optimizasyonu"
        ],
        "en": [
          "Plan tier upgrade",
          "or resource",
          "optimization"
        ]
      }
    },
    {
      "harf": "C",
      "ad": {
        "tr": "Kötüye kullanım bildirimi",
        "en": "Abuse notice / security lock"
      },
      "aciklama": {
        "tr": "Site ele geçirilmiş, spam veya zararlı içerik dağıtıyor olabilir. Sağlayıcı güvenlik gerekçesiyle kapatmıştır.",
        "en": "Application was compromised, sending spam or malicious outbound traffic. Provider hard-locked access for policy violations."
      },
      "kanit": {
        "tr": "abuse bildirimi var → C",
        "en": "Abuse report in inbox → C"
      },
      "diyagramAd": {
        "tr": "Abuse kapatması",
        "en": "Abuse lock"
      },
      "diyagramTest": {
        "tr": [
          "abuse@ adresine",
          "bildirim",
          "gelmiş mi?"
        ],
        "en": [
          "Was notice sent",
          "to abuse / root",
          "mailbox?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "ÖNCE güvenlik",
          "temizliği, SONRA",
          "askı kaldırma"
        ],
        "en": [
          "Security sanitize",
          "FIRST, then",
          "request unlock"
        ]
      }
    }
  ],
  "kimCozer": {
    "tr": "A ise hesap sahibi ve muhasebe — kod işi değildir, saatler içinde açılır. B ise sistem yöneticisi. C ise güvenlik müdahalesi gerekir ve sıra bağlayıcıdır: temizlik yapılmadan askı kaldırılırsa hesap tekrar kapatılır.",
    "en": "For A: Account owner and accounting — zero coding required, restored in hours. For B: DevOps / Sysadmin. For C: Forensic security SWAT is required with strict sequencing: requesting unban prior to full cleanup triggers instant re-suspension."
  },
  "cozulmezse": {
    "tr": "Sağlayıcılar askıya alınan hesapların verisini belirli bir süre saklar, sonra kalıcı olarak siler. Bu pencerenin uzunluğu sağlayıcıya göre değişir ve kaçırılırsa yedek yoksa geri dönüş yoktur.",
    "en": "Cloud providers retain suspended account storage only for a specific grace window before permanent, unrecoverable disk sanitization. If no external backup exists, recovery is impossible."
  },
  "ilgiliTerimler": [
    "staging-ortami",
    "ci-cd"
  ],
  "ilgiliHizmet": {
    "baslik": {
      "tr": "Kesinti Maliyeti Hesabı",
      "en": "Downtime Cost Calculator"
    },
    "link": "/kesinti-maliyeti/"
  }
};
