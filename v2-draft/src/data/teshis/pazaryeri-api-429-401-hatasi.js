export default {
  "slug": "pazaryeri-api-429-401-hatasi",
  "no": "24",
  "baslik": {
    "tr": "Trendyol & Hepsiburada API: 429, 401",
    "en": "Trendyol & Hepsiburada API: 429, 401"
  },
  "diyagramBaslik": {
    "tr": "Pazaryeri API reddi",
    "en": "Marketplace API rejects"
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
    "tr": "Trendyol ya da Hepsiburada entegrasyonu çalışırken birden 429, 401 ya da 403 dönmeye başlıyor; stok, fiyat ve sipariş akışı duruyor. Üç kodun üç ayrı sebebi var: hız sınırı, kimlik bilgisi ve istek başlığı. Pazaryerinin kendi dokümanı her birini tanımlıyor.",
    "en": "The Trendyol or Hepsiburada integration suddenly starts returning 429, 401 or 403; stock, price and order sync stop. The three codes have three separate causes: the rate limit, the credentials and the request header. Each marketplace's own documentation defines them."
  },
  "sahadaNasilGorunur": {
    "tr": "Mağaza panelinde stoklar ve fiyatlar güncellenmez, yeni siparişler merkezi sisteme düşmez. Entegrasyonun kendi ekranında ya yalnız «başarısız» yazar ya da hiçbir uyarı görünmez; asıl bilgi pazaryerinin döndürdüğü HTTP kodundadır.",
    "en": "Stock and prices stop updating in the store panel, and new orders do not reach the central system. The integration's own screen either just says 'failed' or shows no warning at all; the real information is in the HTTP code the marketplace returns."
  },
  "hataMetinleri": [
    {
      "metin": {
        "tr": "HTTP 429 Too Many Requests",
        "en": "HTTP 429 Too Many Requests"
      },
      "nerede": {
        "tr": "Hız sınırı aşıldı — Hepsiburada: dakikada ortalama 240 istek; Trendyol: servis grubu bazında dakikalık sınır",
        "en": "Rate limit exceeded — Hepsiburada: about 240 requests per minute; Trendyol: per-minute limits by service group"
      }
    },
    {
      "metin": {
        "tr": "401 · ClientApiAuthenticationException",
        "en": "401 · ClientApiAuthenticationException"
      },
      "nerede": {
        "tr": "Trendyol — hatalı yetkilendirme",
        "en": "Trendyol — failed authorization"
      }
    },
    {
      "metin": {
        "tr": "401 Unauthorized: Password (Şifre) hatalı girilmiştir.",
        "en": "401 Unauthorized: password entered incorrectly"
      },
      "nerede": {
        "tr": "Hepsiburada — hatalı kimlik bilgisi",
        "en": "Hepsiburada — wrong credentials"
      }
    },
    {
      "metin": {
        "tr": "403",
        "en": "403"
      },
      "nerede": {
        "tr": "Trendyol — User-Agent başlığı olmayan istekler engellenir",
        "en": "Trendyol — requests without a User-Agent header are blocked"
      }
    }
  ],
  "logSatirlari": [
    "Toplu stok işi başladıktan sonra yanıtlar 429'a dönüyor",
    "Servis anahtarı yenilendi, aynı gün 401 başladı",
    "Trendyol yanıtı: 401 ClientApiAuthenticationException",
    "İstek başlıklarında User-Agent yok, yanıt 403"
  ],
  "logEslesme": [
    { "satir": 0, "harf": "A" },
    { "satir": 1, "harf": "B" },
    { "satir": 2, "harf": "B" },
    { "satir": 3, "harf": "C" }
  ],
  "logNotu": {
    "tr": "429, 401 ve 403 aynı ekranda «başarısız» diye görünür ama üç ayrı şey söyler. Entegrasyonun kayıtlarında her isteğin HTTP kodunu ve zamanını saklamak, sebebi ilk bakışta ayırır.",
    "en": "429, 401 and 403 all show up as 'failed' on the same screen, but they say three different things. Keeping the HTTP code and time of every request in the integration's logs separates the cause at a glance."
  },
  "nedenler": [
    {
      "harf": "A",
      "ad": {
        "tr": "Hız sınırı aşıldı",
        "en": "Rate limit exceeded"
      },
      "aciklama": {
        "tr": "Pazaryerleri dakikalık istek sınırı uygular. Hepsiburada dokümanına göre bir satıcı için dakikada ortalama 240 istek atılabilir, aşılırsa 429 döner. Trendyol sınırları servis grubu bazında tanımlar; sınır dolunca aynı dakika içinde o gruba yeni istek gönderilemez. Toplu stok ve fiyat işleri aynı anda başlatılınca sınır dakikalar içinde dolar.",
        "en": "Marketplaces apply per-minute request limits. According to Hepsiburada's documentation, a seller can send about 240 requests per minute, and exceeding that returns 429. Trendyol defines limits by service group; once a group's limit is reached, no new request to that group can be sent within the same minute. When bulk stock and price jobs start at the same time, the limit fills up within minutes."
      },
      "kanit": {
        "tr": "Yoğun işlerde 429 → A",
        "en": "429 during bulk jobs → A"
      },
      "yanlisDuzeltme": {
        "tr": "429 alınınca istekler beklemeden hemen yeniden gönderilir; tekrar denemeler sınırı daha da doldurur ve kuyruk hiç boşalmaz.",
        "en": "Requests are resent immediately after a 429 without waiting; the retries fill the limit further and the queue never drains."
      },
      "diyagramAd": {
        "tr": "Hız sınırı",
        "en": "Rate limited"
      },
      "diyagramTest": {
        "tr": ["Yanıtlar toplu", "işlerde mi 429'a", "dönüyor?"],
        "en": ["Do responses turn", "to 429 during", "bulk jobs?"]
      },
      "diyagramCozum": {
        "tr": ["İstekleri sınıra", "göre kuyruğa al"],
        "en": ["Queue requests", "within the limit"]
      }
    },
    {
      "harf": "B",
      "ad": {
        "tr": "Kimlik bilgisi değişti",
        "en": "Credentials changed"
      },
      "aciklama": {
        "tr": "Trendyol, hatalı yetkilendirmede 401 ve ClientApiAuthenticationException döndürür; bilgiler satıcı panelindeki Entegrasyon Bilgileri sayfasından alınır. Hepsiburada'da satıcı panelinden yeni servis anahtarı oluşturulduğunda, dokümana göre yeni anahtarın entegratör ekranlarında da güncellenmesi gerekir. Hepsiburada ayrıca servislerinin kimlik doğrulama yapısını değiştirdiğini duyurmuştur.",
        "en": "Trendyol returns 401 with ClientApiAuthenticationException on failed authorization; the credentials come from the Integration Information page in the seller panel. On Hepsiburada, when a new service key is created in the seller panel, the documentation says it must also be updated in the integrator's screens. Hepsiburada has also announced a change to the authentication structure of its services."
      },
      "kanit": {
        "tr": "Anahtar değişikliğinden sonra 401 → B",
        "en": "401 after a key change → B"
      },
      "yanlisDuzeltme": {
        "tr": "401 alınınca satıcı panelinden bir yeni anahtar daha üretilir ama entegrasyona girilmez; sorun anahtarda değil, anahtarın entegrasyonda güncellenmemesindedir ve hata sürer.",
        "en": "After a 401, yet another new key is generated in the seller panel but never entered into the integration; the problem is not the key but that it was not updated in the integration, so the error continues."
      },
      "diyagramAd": {
        "tr": "Kimlik değişti",
        "en": "Credentials changed"
      },
      "diyagramTest": {
        "tr": ["401, bir anahtar", "değişikliğinden", "sonra mı başladı?"],
        "en": ["Did 401 start", "after a key", "change?"]
      },
      "diyagramCozum": {
        "tr": ["Yeni anahtarı", "entegrasyona gir"],
        "en": ["Enter the new key", "in the integration"]
      }
    },
    {
      "harf": "C",
      "ad": {
        "tr": "User-Agent eksik",
        "en": "User-Agent missing"
      },
      "aciklama": {
        "tr": "Trendyol her istekte User-Agent başlığı ister: kendi yazdığınız entegrasyonda «Satıcı Id - SelfIntegration», bir entegratör kullanıyorsanız «Satıcı Id - Entegrasyon Firması İsmi». Dokümana göre User-Agent bilgisi olmayan istekler 403 hatasıyla engellenir. Sunucu, kütüphane ya da vekil sunucu değişikliği bu başlığı sessizce düşürebilir.",
        "en": "Trendyol requires a User-Agent header on every request: 'Seller Id - SelfIntegration' for an integration you built yourself, or 'Seller Id - Integrator Company Name' if you use an integrator. According to the documentation, requests without a User-Agent are blocked with a 403 error. A server, library or proxy change can silently drop this header."
      },
      "kanit": {
        "tr": "Başlıkta User-Agent yok, yanıt 403 → C",
        "en": "No User-Agent header, response 403 → C"
      },
      "yanlisDuzeltme": {
        "tr": "403 bir yetki hatası sanılıp API bilgileri değiştirilir; asıl eksik olan istek başlığıdır ve yeni bilgilerle de 403 sürer.",
        "en": "The 403 is taken for a permissions error and the API credentials are changed; what is actually missing is the request header, so the 403 continues with the new credentials too."
      },
      "diyagramAd": {
        "tr": "Başlık eksik",
        "en": "Header missing"
      },
      "diyagramTest": {
        "tr": ["İstek başlığında", "User-Agent", "var mı?"],
        "en": ["Is there a", "User-Agent", "header?"]
      },
      "diyagramCozum": {
        "tr": ["Başlığı doğru", "biçimde gönder"],
        "en": ["Send the header", "in the right format"]
      }
    }
  ],
  "kimCozer": {
    "tr": "Pazaryeri entegrasyonunu bilen backend mühendisi. İsteklerin sınıra göre kuyruğa alınması, kimlik bilgisi değişikliklerinin entegrasyona yansıtılması, User-Agent başlığının doğru biçimde gönderilmesi ve her isteğin HTTP kodunun kaydedilmesi gerekir.",
    "en": "A backend engineer who knows marketplace integrations. Requests must be queued within the limit, credential changes must reach the integration, the User-Agent header must be sent in the right format, and the HTTP code of every request must be logged."
  },
  "cozulmezse": {
    "tr": "Stok ve fiyat güncellenmediği sürece pazaryerinde eski bilgiyle satış devam eder; stokta olmayan ürün satılır ya da yanlış fiyattan satış yapılır. Siparişler çekilmediği için kargoya verme süreleri kaçar.",
    "en": "As long as stock and price are not updated, the marketplace keeps selling on stale data: out-of-stock items are sold, or items are sold at the wrong price. Since orders are not pulled, dispatch deadlines are missed."
  },
  "kontrolAdimlari": {
    "tr": [
      "Entegrasyonun kayıtlarında son saatlerdeki isteklerin HTTP kodlarını sayın: 429 mu, 401 mi, 403 mü?",
      "429 varsa bunların hangi işle (toplu stok, fiyat, sipariş çekme) ve hangi saatte başladığına bakın.",
      "401 varsa satıcı panelinde (Trendyol: Hesap Bilgilerim › Entegrasyon Bilgileri; Hepsiburada: Bilgilerim › Entegrasyon) bilgilerin ya da servis anahtarının yakın zamanda değişip değişmediğini kontrol edin.",
      "403 varsa Trendyol'a giden isteklerde User-Agent başlığının bulunduğunu ve «Satıcı Id - …» biçiminde olduğunu kontrol edin.",
      "Hazır bir entegratör kullanıyorsanız, sorunun entegratörün bütün mağazalarında mı yoksa yalnız sizde mi olduğunu entegratöre sorun."
    ],
    "en": [
      "Count the HTTP codes of the requests in the integration's logs for the last few hours: is it 429, 401 or 403?",
      "If there are 429s, check which job (bulk stock, price, order pull) they started with and at what time.",
      "If there are 401s, check in the seller panel (Trendyol: Integration Information; Hepsiburada: the Integration page) whether the credentials or the service key changed recently.",
      "If there are 403s, check that requests to Trendyol carry a User-Agent header in the 'Seller Id - ...' format.",
      "If you use a ready-made integrator, ask them whether the problem affects all of their stores or only yours."
    ]
  },
  "devirNoktasi": {
    "tr": "İstek kuyruğu ya da yeniden deneme mantığı kodda değiştirilecekse, entegrasyonun durduğu sürede biriken stok, fiyat ve sipariş farkları toplu düzeltilecekse ya da entegrasyon Hepsiburada'nın yeni kimlik doğrulama yapısına taşınacaksa devredin.",
    "en": "Hand it over if the request queue or retry logic has to change in code, if the stock, price and order gaps built up while the integration was down must be fixed in bulk, or if the integration must be moved to Hepsiburada's new authentication structure."
  },
  "resmiKaynaklar": [
    {
      "ad": {
        "tr": "Trendyol — 2. Authorization (API KEY, User-Agent)",
        "en": "Trendyol — 2. Authorization (API key, User-Agent; in Turkish)"
      },
      "url": {
        "tr": "https://developers.trendyol.com/docs/2-authorization",
        "en": "https://developers.trendyol.com/docs/2-authorization"
      }
    },
    {
      "ad": {
        "tr": "Trendyol — 1. Servis Limitleri",
        "en": "Trendyol — 1. Service limits (in Turkish)"
      },
      "url": {
        "tr": "https://developers.trendyol.com/docs/1-servis-limitleri",
        "en": "https://developers.trendyol.com/docs/1-servis-limitleri"
      }
    },
    {
      "ad": {
        "tr": "Hepsiburada — Entegratöre Servis Anahtarı Ekleme/Görüntüleme",
        "en": "Hepsiburada — Adding and viewing the integrator service key (in Turkish)"
      },
      "url": {
        "tr": "https://developers.hepsiburada.com/tr/companies/hepsiburada?category=baslangic&product=api-authentication&version=v1.0&guide=entegratore-servis-anahtari-eklemegoruntuleme&view=guide",
        "en": "https://developers.hepsiburada.com/tr/companies/hepsiburada?category=baslangic&product=api-authentication&version=v1.0&guide=entegratore-servis-anahtari-eklemegoruntuleme&view=guide"
      }
    },
    {
      "ad": {
        "tr": "Hepsiburada — Listeleme Entegrasyonu Önemli Bilgiler (istek sınırı)",
        "en": "Hepsiburada — Listing integration key information (request limit; in Turkish)"
      },
      "url": {
        "tr": "https://developers.hepsiburada.com/tr/companies/hepsiburada?category=listeleme&product=listeleme&version=v1&guide=listing-bilgilerini-guncelleme-1&view=guide",
        "en": "https://developers.hepsiburada.com/tr/companies/hepsiburada?category=listeleme&product=listeleme&version=v1&guide=listing-bilgilerini-guncelleme-1&view=guide"
      }
    },
    {
      "ad": {
        "tr": "MDN — 429 Too Many Requests (İngilizce)",
        "en": "MDN — 429 Too Many Requests"
      },
      "url": {
        "tr": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429",
        "en": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429"
      }
    }
  ],
  "ilgiliTerimler": [
    "rate-limit",
    "idempotency"
  ],
  "ilgiliTeshisler": [
    "entegrasyon-429-veriyor",
    "pazaryeri-stok-cift-satis",
    "e-arsiv-fatura-kesilmiyor"
  ],
  "ilgiliHizmet": {
    "baslik": {
      "tr": "B2B White-Label Mühendislik Masası",
      "en": "B2B White-Label Engineering Desk"
    },
    "link": "/agency/"
  }
};
