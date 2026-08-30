export default {
  "slug": "form-gonderiliyor-mail-gelmiyor",
  "no": "18",
  "baslik": {
    "tr": "Form gönderiliyor ama mail gelmiyor",
    "en": "Form Submits Successfully but No Email Delivered"
  },
  "diyagramBaslik": {
    "tr": "Mail gelmiyor",
    "en": "Form email missing"
  },
  "kirinti": {
    "tr": "İletişim & Entegrasyon",
    "en": "Contact & Integrations"
  },
  "aciliyet": {
    "seviye": "yuksek",
    "etiket": {
      "tr": "Yüksek · kayıp talep",
      "en": "High · lost leads"
    }
  },
  "ozet": {
    "tr": "İletişim veya teklif formu 'gönderildi' diyor ama kimseye mail ulaşmıyor. Bu belirtinin en tehlikeli yanı sessiz olmasıdır: kaç talebin kaybolduğu bilinmez.",
    "en": "Lead or quote forms display 'Submitted successfully' but notifications never arrive in the team inbox. The most insidious defect: silence leaves lost deals completely untracked."
  },
  "logSatirlari": [
    "SMTP error 535 Authentication failed",
    "550 5.7.1 Message rejected · SPF / DKIM",
    "Mail kuyruğu: deferred / stuck",
    "Uygulama log'u: 'mail sent'    ← ama teslim edilmedi"
  ],
  "logEslesme": [
    { "satir": 0, "harf": "A" },
    { "satir": 1, "harf": "B" },
    { "satir": 2, "harf": "B" }
  ],
  "logNotu": {
    "tr": "'Gönderildi' mesajı çoğu zaman uygulamanın kendi iddiasıdır, teslim kanıtı değildir. Gerçek cevap sunucunun mail kuyruğunda veya sağlayıcı panelindedir.",
    "en": "'Message sent' in UI only reflects dispatch, not inbox delivery. Truth resides in server mail queues (Postfix/Exim) or transactional ESP dashboards (SendGrid/Postmark)."
  },
  "nedenler": [
    {
      "harf": "A",
      "ad": {
        "tr": "SMTP kimliği",
        "en": "SMTP auth failure"
      },
      "aciklama": {
        "tr": "Parola değişti ya da sağlayıcı uygulama şifresi zorunlu kıldı. Mail hiç çıkmıyor.",
        "en": "Mailbox password expired or ESP enforced App Passwords/OAuth. Dispatch fails at origin."
      },
      "kanit": {
        "tr": "SMTP 535 hatası → A",
        "en": "SMTP 535 Authentication failed in log → A"
      },
      "diyagramAd": {
        "tr": "SMTP kimliği",
        "en": "SMTP auth"
      },
      "diyagramTest": {
        "tr": [
          "Log'da 535 auth",
          "hatası var mı?"
        ],
        "en": [
          "Is there an SMTP",
          "535 auth error",
          "in system logs?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Uygulama şifresi",
          "+ ayar güncelleme"
        ],
        "en": [
          "App Password +",
          "config update",
          "in .env"
        ]
      }
    },
    {
      "harf": "B",
      "ad": {
        "tr": "SPF / DKIM eksik",
        "en": "Missing SPF / DKIM"
      },
      "aciklama": {
        "tr": "Mail çıkıyor ama alıcı sunucu reddediyor veya spam'e atıyor. Alan adı doğrulama kayıtları yok.",
        "en": "Mail leaves server but destination MX rejects or junk-folders it due to missing SPF/DKIM/DMARC TXT records."
      },
      "kanit": {
        "tr": "550 SPF/DKIM reddi → B",
        "en": "550 5.7.1 SPF/DKIM rejected → B"
      },
      "diyagramAd": {
        "tr": "SPF / DKIM eksik",
        "en": "SPF / DKIM missing"
      },
      "diyagramTest": {
        "tr": [
          "DNS'te SPF ve",
          "DKIM kaydı var mı?"
        ],
        "en": [
          "Are SPF and",
          "DKIM TXT records",
          "active in DNS?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "DNS kayıtlarını",
          "ekle · teslimat",
          "düzelir"
        ],
        "en": [
          "Add DNS records ·",
          "deliverability",
          "restored"
        ]
      }
    },
    {
      "harf": "C",
      "ad": {
        "tr": "Form arkada hatalı",
        "en": "False positive frontend"
      },
      "aciklama": {
        "tr": "Gönderim isteği başarısız oluyor ama arayüz yine de başarı mesajı gösteriyor.",
        "en": "AJAX endpoint returns 4xx/5xx but frontend ignores HTTP status and shows optimistic success alert."
      },
      "kanit": {
        "tr": "Ağ sekmesinde 4xx/5xx → C",
        "en": "Network tab shows 4xx/5xx → C"
      },
      "diyagramAd": {
        "tr": "Form arkada hatalı",
        "en": "Frontend false OK"
      },
      "diyagramTest": {
        "tr": [
          "Ağ sekmesinde",
          "gönderim isteği",
          "başarılı mı?"
        ],
        "en": [
          "Does network tab",
          "show HTTP 200 on",
          "POST request?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Gerçek yanıtı",
          "kontrol et ·",
          "hata göster"
        ],
        "en": [
          "Handle status ·",
          "render error UI",
          "on failure"
        ]
      }
    }
  ],
  "kimCozer": {
    "tr": "A ve B sistem ve DNS tarafıdır. C bir yazılım hatasıdır ve önce o düzeltilmelidir: kullanıcıya yalan söyleyen bir başarı mesajı, sorunun aylarca fark edilmemesinin sebebidir.",
    "en": "A and B are DNS/Sysadmin issues. C is frontend defect that must be solved first: false-positive success toasts hide lead bleed for months."
  },
  "cozulmezse": {
    "tr": "Gelmeyen her form bir kayıp müşteridir ve kimse kaybettiğini bilmez. Bu arıza kendini göstermez; aranmadıkça bulunmaz.",
    "en": "Every lost form is a lost deal that nobody knows was missed. This defect never announces itself; it bleeds revenue in silence."
  },
  "ilgiliTerimler": [
    "webhook",
    "rate-limit",
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
