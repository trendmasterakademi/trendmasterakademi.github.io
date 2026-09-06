export default {
  "slug": "site-aramalarda-gorunmez-oldu",
  "no": "19",
  "baslik": {
    "tr": "Site aramalarda görünmez oldu",
    "en": "Website Dropped from Search Engine Results"
  },
  "diyagramBaslik": {
    "tr": "Aramalarda görünmüyor",
    "en": "De-indexed from search"
  },
  "kirinti": {
    "tr": "Görünürlük",
    "en": "Visibility"
  },
  "aciliyet": {
    "seviye": "yuksek",
    "etiket": {
      "tr": "Yüksek · trafik kaybı",
      "en": "High · traffic loss"
    }
  },
  "ozet": {
    "tr": "Site açılıyor, her şey normal görünüyor ama arama sonuçlarındaki yerini kaybetti. Bu belirtinin teknik nedenleri, içerik ya da rekabet nedenlerinden çok daha hızlı doğrulanır — önce onlar elenmelidir.",
    "en": "The site is accessible and looks normal, but organic search rankings plummeted. Technical causes can be verified far faster than content or algorithmic penalties — rule them out first."
  },
  "sahadaNasilGorunur": {
    "tr": "Web sitesi tarayıcıda sorunsuz açılmaktadır ve satış ekibi her şeyin yolunda olduğunu sanır. Ancak arama motorunda firma adı aratıldığında ana sayfa ilk sayfadan kaybolmuştur. Günlük organik ziyaretçi trafiği sıfıra yaklaşır ve gelen telefonlar kesilir.",
    "en": "The website loads normally in browsers, leading teams to assume all is well. Yet searching the brand on Google yields zero results on page one. Daily organic traffic drops toward zero and inbound inquiries abruptly cease."
  },
  "logSatirlari": [
    "robots.txt → Disallow: /",
    "<meta name=\"robots\" content=\"noindex\">",
    "Sunucu yanıtı: 5xx veya çok yavaş ilk bayt süresi",
    "Yönlendirme zinciri: 302 → 302 → 200"
  ],
  "logEslesme": [
    {
      "satir": 0,
      "harf": "B"
    },
    {
      "satir": 1,
      "harf": "A"
    }
  ],
  "logNotu": {
    "tr": "İlk iki satır tek başına tüm siteyi arama sonuçlarından çıkarır ve genellikle test ortamından canlıya yanlışlıkla taşınır. Kontrolü saniyeler sürer.",
    "en": "The first two directives wipe an entire domain from Google index within days, typically leaked accidentally during staging deployments. Takes seconds to verify."
  },
  "nedenler": [
    {
      "harf": "A",
      "ad": {
        "tr": "noindex kalmış",
        "en": "Staging noindex leaked"
      },
      "aciklama": {
        "tr": "Test ortamında arama motorlarını engellemek için konan etiket yayına da gitmiş.",
        "en": "Robots noindex tag used to hide staging was mistakenly deployed to production release."
      },
      "kanit": {
        "tr": "Sayfa kaynağında noindex → A",
        "en": "Meta noindex found in DOM → A"
      },
      "yanlisDuzeltme": {
        "tr": "Sıralama kazanmak için yeni metinler girilir; ancak HTML başlığındaki meta noindex etiketi kaldırılmadığı sürece arama motorları sayfayı dizine eklemez.",
        "en": "Publishing fresh content fails completely because search crawlers obey the meta noindex tag and refuse to index the URL."
      },
      "diyagramAd": {
        "tr": "noindex kalmış",
        "en": "noindex leaked"
      },
      "diyagramTest": {
        "tr": [
          "Sayfa kaynağında",
          "noindex var mı?"
        ],
        "en": [
          "Is <meta noindex>",
          "present in HTML",
          "source?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Etiketi kaldır +",
          "yeniden dizinleme",
          "iste"
        ],
        "en": [
          "Strip tag +",
          "request Google",
          "re-indexing"
        ]
      }
    },
    {
      "harf": "B",
      "ad": {
        "tr": "robots.txt kapalı",
        "en": "robots.txt blocked"
      },
      "aciklama": {
        "tr": "Dosya tüm siteyi tarayıcılara kapatmış durumda.",
        "en": "robots.txt file instructs all crawlers to disallow indexation across root."
      },
      "kanit": {
        "tr": "robots.txt Disallow: / → B",
        "en": "robots.txt Disallow: / → B"
      },
      "yanlisDuzeltme": {
        "tr": "Sayfa adresleri yeniden sitemap dosyasına yazılır; fakat kök dizindeki robots.txt dosyasında Disallow: / kuralı durduğu sürece Googlebot sayfaları tarayamaz.",
        "en": "Resubmitting XML sitemaps achieves nothing while a rogue Disallow: / rule in robots.txt instructs search engine crawlers to abandon indexation."
      },
      "diyagramAd": {
        "tr": "robots.txt kapalı",
        "en": "robots.txt blocked"
      },
      "diyagramTest": {
        "tr": [
          "/robots.txt",
          "Disallow: / mi?"
        ],
        "en": [
          "Does robots.txt",
          "contain Disallow:",
          "root slash?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Kuralı düzelt ·",
          "etki günler",
          "içinde"
        ],
        "en": [
          "Fix rule ·",
          "crawl recovery",
          "in days"
        ]
      }
    },
    {
      "harf": "C",
      "ad": {
        "tr": "Adresler değişti",
        "en": "Broken 301 migrations"
      },
      "aciklama": {
        "tr": "Sayfa adresleri yönlendirme kurulmadan değiştirildi. Eski adresler 404 veriyor, birikmiş değer kayboldu.",
        "en": "URL architecture was revamped without 301 redirects. Legacy URLs return 404, wiping historical domain authority."
      },
      "kanit": {
        "tr": "Eski adresler 404 veriyor → C",
        "en": "Legacy URLs return 404 → C"
      },
      "yanlisDuzeltme": {
        "tr": "Eski sayfalar ana sayfaya topluca yönlendirilir; URL bazlı 301 kalıcı eşleme yapılmadığı için Google eski sayfaların birikmiş sıralama otoritesini sıfırlar.",
        "en": "Wildcard-redirecting old URLs to the homepage fails to transfer accumulated page-level ranking authority, resulting in massive organic traffic erosion."
      },
      "diyagramAd": {
        "tr": "Adresler değişti",
        "en": "URLs changed"
      },
      "diyagramTest": {
        "tr": [
          "Eski adresler 301",
          "veriyor mu?"
        ],
        "en": [
          "Do legacy URLs",
          "return 301 to new",
          "counterparts?"
        ]
      },
      "diyagramCozum": {
        "tr": [
          "Eski → yeni 301",
          "haritası kur"
        ],
        "en": [
          "Deploy complete",
          "301 redirect map",
          "table"
        ]
      }
    }
  ],
  "kimCozer": {
    "tr": "A ve B dakikalar içinde düzeltilir; etkisi arama motoru siteyi yeniden tarayınca görünür ve bu günler alır. C daha ağırdır: eski adreslerin yenilerine eşleştiği bir yönlendirme haritası çıkarılmalıdır.",
    "en": "A and B are fixed in minutes; index restoration occurs when search engines re-crawl (days). C requires comprehensive URL mapping tables to preserve link equity."
  },
  "cozulmezse": {
    "tr": "Arama görünürlüğü kaybı bileşik büyür. Kaybı geri kazanmak, kaybın sürdüğü süreden uzun sürer — erken fark edilmesi doğrudan para kazandırır.",
    "en": "Organic visibility drop compounds over time. Re-ranking takes significantly longer than the downtime duration — early mitigation protects top-line revenue."
  },
  "ilgiliTerimler": [
    "staging-ortami",
    "ci-cd",
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
