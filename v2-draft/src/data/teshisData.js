export const teshisData = [
  {
    "slug": "ayni-stok-iki-musteriye-satildi",
    "no": "01",
    "baslik": {
      "tr": "Aynı stok iki müşteriye satıldı",
      "en": "Same Inventory Sold to Multiple Customers"
    },
    "diyagramBaslik": {
      "tr": "Aynı stok iki kez satıldı",
      "en": "Oversold inventory race"
    },
    "kirinti": {
      "tr": "Sipariş & Ödeme",
      "en": "Orders & Payments"
    },
    "aciliyet": {
      "seviye": "kritik",
      "etiket": {
        "tr": "Kritik · ticari kayıp",
        "en": "Critical · revenue loss"
      }
    },
    "ozet": {
      "tr": "Son kalan ürün iki ayrı siparişte çıktı, stok eksiye düştü. Birine iade yapmak zorundasınız. Bu belirtinin üç farklı nedeni var ve üçünün çözümü birbirinden tamamen ayrı — yanlış olanı düzeltmek sorunu geri getirir.",
      "en": "The last item in stock was checked out across two different orders, sending inventory negative. One customer requires a refund. This symptom stems from three distinct root causes, each demanding a completely different fix — addressing the wrong one will cause the defect to recur."
    },
    "logSatirlari": [
      "SQLSTATE[40001]: Serialization failure: 1213 Deadlock found",
      "Duplicate entry '...' for key 'orders_reference_unique'",
      "UPDATE products SET stock = stock - 1  ← kontrol ve yazma ayrı"
    ],
    "logNotu": {
      "tr": "Bu satırlardan hangisinin göründüğü, hangi nedenle karşı karşıya olduğunuzu daha ilk bakışta daraltır.",
      "en": "Which of these lines appears in your error logs narrows down the exact root cause at first glance."
    },
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Race condition",
          "en": "Race condition"
        },
        "aciklama": {
          "tr": "Aynı anda gelen iki istek stoğu eşzamanlı düşürdü. Kontrol ile yazma arasında boşluk var.",
          "en": "Two simultaneous requests decremented stock concurrently. There is an unisolated gap between check and write."
        },
        "kanit": {
          "tr": "created_at farkı < 1sn → A",
          "en": "created_at diff < 1s → A"
        },
        "diyagramAd": {
          "tr": "Race condition",
          "en": "Race condition"
        },
        "diyagramTest": {
          "tr": [
            "İki siparişin",
            "created_at",
            "farkı < 1 sn mi?"
          ],
          "en": [
            "Are order",
            "created_at diffs",
            "< 1 second?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Atomik UPDATE +",
            "etkilenen satır",
            "kontrolü"
          ],
          "en": [
            "Atomic UPDATE +",
            "affected rows",
            "validation"
          ]
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Idempotency yok",
          "en": "Missing idempotency"
        },
        "aciklama": {
          "tr": "Tek bir ödeme iki kez işlendi; müşteri iki kez tıkladı ya da webhook tekrar geldi. Eşzamanlılık yok, tekrar var.",
          "en": "A single payment was processed twice; either the customer double-clicked or a webhook redelivered. No concurrency, just duplication."
        },
        "kanit": {
          "tr": "payment_reference aynı → B",
          "en": "payment_reference same → B"
        },
        "diyagramAd": {
          "tr": "Idempotency yok",
          "en": "No idempotency"
        },
        "diyagramTest": {
          "tr": [
            "payment_reference",
            "değerleri",
            "aynı mı?"
          ],
          "en": [
            "Are payment",
            "reference IDs",
            "identical?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "unique index +",
            "idempotency",
            "anahtarı"
          ],
          "en": [
            "unique index +",
            "idempotency key",
            "lock"
          ]
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Stok senkronu",
          "en": "Inventory sync lag"
        },
        "aciklama": {
          "tr": "Stoğun kaynağı ERP veya pazaryeri. Yarış sitede değil, iki sistem arasındaki gecikmede.",
          "en": "Inventory master resides in an ERP or marketplace. The race is not on-site, but within sync lag intervals."
        },
        "kanit": {
          "tr": "Senkron satıştan eski → C",
          "en": "Sync older than sale → C"
        },
        "diyagramAd": {
          "tr": "Stok senkronu",
          "en": "Inventory sync"
        },
        "diyagramTest": {
          "tr": [
            "Son ERP senkronu",
            "satıştan",
            "önce mi?"
          ],
          "en": [
            "Was last ERP",
            "sync before",
            "order timestamp?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Rezervasyon",
            "mantığı + senkron",
            "sıklığı"
          ],
          "en": [
            "Reservation lock",
            "+ higher sync",
            "frequency"
          ]
        }
      }
    ],
    "kimCozer": {
      "tr": "Kıdemli backend mühendisi · 2–4 saat. Doğru neden belirlendikten sonra üçü de kalıcı olarak kapanır. Teşhis olmadan yapılan düzeltme belirtiyi bastırır, kaynağı bırakır.",
      "en": "Senior backend engineer · 2–4 hours. Once the exact cause is isolated, all three are permanently resolved. Fixes applied without proper diagnosis merely mask symptoms while leaving the root cause intact."
    },
    "cozulmezse": {
      "tr": "Her çift satış bir iade, bir kargo maliyeti ve bir olumsuz yorum riski. Kampanya günlerinde eşzamanlı trafik arttığı için sıklık katlanarak büyür.",
      "en": "Every oversold item triggers refund overhead, double logistics costs, and negative client feedback. Under high-traffic sales campaigns, frequency compounds exponentially."
    },
    "ilgiliTerimler": [
      "race-condition",
      "idempotency",
      "deadlock"
    ],
    "ilgiliHizmet": {
      "baslik": {
        "tr": "Acil Kriz Müdahalesi & Crash Test",
        "en": "Emergency Incident Triage & Crash Test"
      },
      "link": "/crash-test/"
    }
  },
  {
    "slug": "odeme-alindi-siparis-olusmadi",
    "no": "02",
    "baslik": {
      "tr": "Ödeme alındı, sipariş oluşmadı",
      "en": "Payment Charged but Order Not Created"
    },
    "diyagramBaslik": {
      "tr": "Ödeme var, sipariş yok",
      "en": "Payment without order"
    },
    "kirinti": {
      "tr": "Sipariş & Ödeme",
      "en": "Orders & Payments"
    },
    "aciliyet": {
      "seviye": "kritik",
      "etiket": {
        "tr": "Kritik · ticari kayıp",
        "en": "Critical · commercial loss"
      }
    },
    "ozet": {
      "tr": "Müşterinin kartından para çekildi ama sistemde sipariş yok. Müşteri arıyor, elinizde kayıt yok. Para bankada, sipariş ortada yok — ikisinin arasında kopmuş bir bildirim var.",
      "en": "Customer was charged successfully but no order appears in the system. The client contacts support with no reference on file. Funds are in the bank, order is missing — caused by a severed webhook callback between the two."
    },
    "logSatirlari": [
      "Webhook adresi: 404 / 500 / zaman aşımı",
      "Ödeme sağlayıcı paneli: callback failed · retry 3/3",
      "Uygulama log'unda ödeme referansı hiç geçmiyor",
      "HTTP 302 — bildirim yönlendirmeyi takip etmiyor"
    ],
    "logNotu": {
      "tr": "Ödeme sağlayıcısının panelinde her bildirim denemesinin kaydı vardır. Cevabı orada aramak kodda aramaktan hızlıdır: sağlayıcı size kaç kez denediğini ve ne cevap aldığını söyler.",
      "en": "Every webhook dispatch attempt is logged in the payment gateway dashboard. Checking provider logs is faster than codebase debugging: it reveals retry counts and HTTP response codes directly."
    },
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Bildirim ulaşmadı",
          "en": "Callback undelivered"
        },
        "aciklama": {
          "tr": "Sağlayıcı bildirimi gönderdi ama adres yanlış, kapalı ya da güvenlik duvarı engelledi.",
          "en": "Gateway sent webhook but endpoint URL was invalid, firewalled (WAF), or blocked."
        },
        "kanit": {
          "tr": "Sağlayıcı panelinde 404 / zaman aşımı → A",
          "en": "404 or timeout in gateway panel → A"
        },
        "diyagramAd": {
          "tr": "Bildirim ulaşmadı",
          "en": "Undelivered webhook"
        },
        "diyagramTest": {
          "tr": [
            "Sağlayıcı panelinde",
            "deneme kaydı",
            "var mı?"
          ],
          "en": [
            "Are webhook retry",
            "logs visible in",
            "gateway panel?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Adres ve güvenlik",
            "duvarı düzeltme"
          ],
          "en": [
            "Fix endpoint URL",
            "+ whitelist WAF"
          ]
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "İşlenemedi",
          "en": "Callback unhandled (500)"
        },
        "aciklama": {
          "tr": "Bildirim geldi, uygulama hata verdi. Sağlayıcı tekrar denedi, aynı hata tekrarlandı.",
          "en": "Webhook arrived but application threw unhandled exception. Retries repeated the crash."
        },
        "kanit": {
          "tr": "Log'da 500 + tekrar denemeler → B",
          "en": "HTTP 500 + retry loop in logs → B"
        },
        "diyagramAd": {
          "tr": "İşlenemedi",
          "en": "Handler crashed"
        },
        "diyagramTest": {
          "tr": [
            "Log'da bildirim",
            "geldi ama hata",
            "verdi mi?"
          ],
          "en": [
            "Did webhook arrive",
            "but throw 500",
            "fatal error?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Hatayı düzelt +",
            "kuyruğa al"
          ],
          "en": [
            "Patch exception +",
            "queue job buffer"
          ]
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Kaydedilmedi",
          "en": "Validation drop (Silent 200)"
        },
        "aciklama": {
          "tr": "Bildirim başarıyla döndü ama sipariş yazılmadı. Genellikle bir doğrulama hatası kayıt oluşturmayı sessizce engeller.",
          "en": "Webhook returned HTTP 200 but order insertion failed silently due to internal validation drops."
        },
        "kanit": {
          "tr": "200 dönmüş ama kayıt yok → C",
          "en": "HTTP 200 returned but no row → C"
        },
        "diyagramAd": {
          "tr": "Kaydedilmedi",
          "en": "Silent drop"
        },
        "diyagramTest": {
          "tr": [
            "Bildirime 200",
            "dönmüş ama kayıt",
            "yok mu?"
          ],
          "en": [
            "Was 200 returned",
            "without creating",
            "order record?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Doğrulama hatasını",
            "logla + kaydı",
            "garanti et"
          ],
          "en": [
            "Log validation +",
            "guarantee atomic",
            "insert"
          ]
        }
      }
    ],
    "kimCozer": {
      "tr": "Backend mühendisi. Kalıcı çözüm bildirimi doğrudan işlemek değil, önce kuyruğa yazıp sonra işlemektir; böylece uygulama hata verse bile bildirim kaybolmaz. Bu yapı kurulmadan aynı arıza her yoğun günde geri gelir.",
      "en": "Senior backend engineer. Permanent resilience requires decoupling ingestion from execution via message queues: ingest webhook payload to broker first, then process asynchronously."
    },
    "cozulmezse": {
      "tr": "Her kayıp bildirim, parası alınmış ama siparişi olmayan bir müşteri demektir. Bunlar genellikle müşteri şikâyet edene kadar fark edilmez — şikâyet etmeyenler hiç bilinmez.",
      "en": "Every dropped webhook is a charged client with an empty basket. These remain invisible until chargebacks and support escalations arrive."
    },
    "ilgiliTerimler": [
      "webhook",
      "idempotency",
      "rate-limit"
    ],
    "ilgiliHizmet": {
      "baslik": {
        "tr": "Acil Kriz Müdahalesi & Crash Test",
        "en": "Emergency Incident Triage & Crash Test"
      },
      "link": "/crash-test/"
    }
  },
  {
    "slug": "odeme-iki-kez-alindi",
    "no": "03",
    "baslik": {
      "tr": "Ödeme iki kez alındı",
      "en": "Payment Charged Twice for Single Order"
    },
    "diyagramBaslik": {
      "tr": "Ödeme iki kez alındı",
      "en": "Duplicate payment charge"
    },
    "kirinti": {
      "tr": "Sipariş & Ödeme",
      "en": "Orders & Payments"
    },
    "aciliyet": {
      "seviye": "kritik",
      "etiket": {
        "tr": "Kritik · iade riski",
        "en": "Critical · chargeback risk"
      }
    },
    "ozet": {
      "tr": "Müşteriden aynı tutar iki kez tahsil edildi. İade yapmak zorundasınız ama önce hangi katmanda çiftlendiğini bulmalısınız — yanlış katmanı düzeltmek sorunu geri getirir.",
      "en": "The client was billed twice for the same cart. A refund is mandatory, but isolating which tier duplicated the transaction is critical — patching the wrong layer allows duplicates to persist."
    },
    "logSatirlari": [
      "Aynı ödeme referansıyla iki başarılı işlem",
      "Bildirim log'u: aynı olay kimliği iki kez işlenmiş",
      "Uygulama log'u: iki gönderim, aynı saniye, aynı oturum",
      "Sağlayıcı panelinde 'duplicate transaction' uyarısı yok"
    ],
    "logNotu": {
      "tr": "Sağlayıcının işlem kimliği ile sizin sipariş referansınız farklı şeylerdir. Çiftlenmenin hangisinde olduğu, sorunun sizde mi sağlayıcıda mı olduğunu söyler.",
      "en": "Gateway transaction IDs and internal order tokens are distinct. Which one is duplicated indicates whether concurrency stems from client UI or webhook replays."
    },
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Çift gönderim",
          "en": "Client double submit"
        },
        "aciklama": {
          "tr": "Düğme kilitlenmedi, sayfa yavaş yanıt verdi, müşteri tekrar tıkladı.",
          "en": "Submit button was not disabled on click; slow response caused user double-click."
        },
        "kanit": {
          "tr": "İki gönderim, aynı oturum → A",
          "en": "Two posts, same session → A"
        },
        "diyagramAd": {
          "tr": "Çift gönderim",
          "en": "Double submit"
        },
        "diyagramTest": {
          "tr": [
            "İki istek aynı",
            "oturumdan mı",
            "geldi?"
          ],
          "en": [
            "Did both requests",
            "originate from",
            "same session?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Düğme kilidi +",
            "idempotency",
            "anahtarı"
          ],
          "en": [
            "Button lock +",
            "idempotency key",
            "header"
          ]
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Bildirim tekrarı",
          "en": "Webhook redelivery"
        },
        "aciklama": {
          "tr": "Sağlayıcı aynı bildirimi tekrar gönderdi; bu normaldir. Uygulama ikisini de yeni sanıp işledi.",
          "en": "Gateway redelivered standard retry callback. App treated both as novel transactions."
        },
        "kanit": {
          "tr": "Aynı olay kimliği iki kez → B",
          "en": "Same event ID processed twice → B"
        },
        "diyagramAd": {
          "tr": "Bildirim tekrarı",
          "en": "Webhook replay"
        },
        "diyagramTest": {
          "tr": [
            "Aynı olay kimliği",
            "iki kez işlenmiş",
            "mi?"
          ],
          "en": [
            "Was same event ID",
            "executed multiple",
            "times?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Olay kimliğini",
            "kaydet · tekrarı",
            "yok say"
          ],
          "en": [
            "Record event ID ·",
            "ignore duplicate",
            "callbacks"
          ]
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Yeniden deneme",
          "en": "Blind client retry"
        },
        "aciklama": {
          "tr": "Uygulama zaman aşımı aldı ve isteği tekrarladı. Oysa ilki de başarılıydı.",
          "en": "App got network timeout and blindly retried transaction, unaware first attempt succeeded."
        },
        "kanit": {
          "tr": "Zaman aşımı sonrası tekrar → C",
          "en": "Retry after timeout → C"
        },
        "diyagramAd": {
          "tr": "Yeniden deneme",
          "en": "Blind retry"
        },
        "diyagramTest": {
          "tr": [
            "İlk istek zaman",
            "aşımına mı uğradı?"
          ],
          "en": [
            "Did first attempt",
            "experience read",
            "timeout?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Tekrarı güvenli",
            "hâle getir ·",
            "aynı anahtar"
          ],
          "en": [
            "Safe retry logic ·",
            "reuse identical",
            "idempotency key"
          ]
        }
      }
    ],
    "kimCozer": {
      "tr": "Backend mühendisi · 2–4 saat. Üç nedenin ortak çözümü aynı ilkedir: her ödeme isteğinin tekrarlandığında aynı sonucu üretmesi. Bu sağlandığında üç senaryo da kendiliğinden kapanır.",
      "en": "Backend engineer · 2–4 hours. The root solution for all three is strict idempotency: ensuring identical payment attempts return identical cached results without multiple charges."
    },
    "cozulmezse": {
      "tr": "Çift tahsilat iadeyle kapanır ama iade komisyonu geri gelmez ve müşteri güveni birlikte gider. Ödeme kuruluşları yüksek iade oranını risk olarak işaretler.",
      "en": "Refunds settle double charges but merchant processing fees and customer trust are permanently lost. Gateway risk algorithms penalize high chargeback accounts."
    },
    "ilgiliTerimler": [
      "idempotency",
      "webhook",
      "race-condition"
    ],
    "ilgiliHizmet": {
      "baslik": {
        "tr": "Acil Kriz Müdahalesi & Crash Test",
        "en": "Emergency Incident Triage & Crash Test"
      },
      "link": "/crash-test/"
    }
  },
  {
    "slug": "islemler-kilitlendi-sayfa-donuyor",
    "no": "04",
    "baslik": {
      "tr": "İşlemler kilitlendi, sayfa dönüp duruyor",
      "en": "Transactions Deadlocked, Pages Spinning"
    },
    "diyagramBaslik": {
      "tr": "İşlemler kilitlendi",
      "en": "Transactions deadlocked"
    },
    "kirinti": {
      "tr": "Performans",
      "en": "Performance"
    },
    "aciliyet": {
      "seviye": "kritik",
      "etiket": {
        "tr": "Kritik · işlem durdu",
        "en": "Critical · transaction halt"
      }
    },
    "ozet": {
      "tr": "Belirli bir işlem — sipariş onayı, stok güncelleme, toplu güncelleme — sonsuza kadar dönüyor ve sonunda zaman aşımı veriyor. Sistem çökmedi; birbirini bekleyen iki işlem var.",
      "en": "Specific operations — checkout completion, stock updates, or batch imports — hang indefinitely until timeout. The server has not crashed; concurrent transactions are locked waiting for each other."
    },
    "logSatirlari": [
      "Deadlock found when trying to get lock; try restarting transaction",
      "Lock wait timeout exceeded; try restarting transaction",
      "Veritabanında uzun süredir açık işlem (idle in transaction)",
      "Uygulama log'u: aynı saniyede iki toplu güncelleme"
    ],
    "logNotu": {
      "tr": "'try restarting transaction' ifadesi veritabanının kendi teşhisidir. Bu satır göründüğünde neden tahmin edilmez, bilinir.",
      "en": "'try restarting transaction' is the database engine's explicit diagnosis. When logged, root cause is verified deadlock."
    },
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Ters sıralı kilit",
          "en": "Cross-ordered row locks"
        },
        "aciklama": {
          "tr": "İki işlem aynı iki tabloya farklı sırayla dokunuyor; her biri diğerinin bıraktığını bekliyor.",
          "en": "Two transactions update tables in reverse order; each blocks waiting for the other's release."
        },
        "kanit": {
          "tr": "Log'da deadlock kaydı var → A",
          "en": "Deadlock found in database log → A"
        },
        "diyagramAd": {
          "tr": "Ters sıralı kilit",
          "en": "Reverse lock order"
        },
        "diyagramTest": {
          "tr": [
            "Log'da deadlock",
            "kaydı var mı?"
          ],
          "en": [
            "Are deadlock /",
            "lock wait errors",
            "present in logs?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Tabloları sabit",
            "sırayla kilitle"
          ],
          "en": [
            "Enforce global",
            "consistent lock",
            "acquisition order"
          ]
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Uzun işlem",
          "en": "Long-running transaction"
        },
        "aciklama": {
          "tr": "Bir işlem içinde rapor üretimi veya harici çağrı yapılıyor; kilit gereğinden uzun tutuluyor.",
          "en": "Transaction wraps external API calls or PDF generation, holding database row locks for minutes."
        },
        "kanit": {
          "tr": "Açık işlem dakikalarca sürüyor → B",
          "en": "Idle in transaction > 60s → B"
        },
        "diyagramAd": {
          "tr": "Uzun işlem",
          "en": "Long transaction"
        },
        "diyagramTest": {
          "tr": [
            "Açık işlem süresi",
            "dakikalarca mı?"
          ],
          "en": [
            "Do open DB locks",
            "persist for",
            "multiple minutes?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Harici işi işlem",
            "dışına çıkar"
          ],
          "en": [
            "Move external I/O",
            "outside of SQL",
            "transactions"
          ]
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Toplu güncelleme",
          "en": "Broad table lock (Batch)"
        },
        "aciklama": {
          "tr": "Arka plan görevi geniş bir aralığı kilitliyor, canlı trafik onun bitmesini bekliyor.",
          "en": "Nightly batch import locks wide index ranges, starving real-time checkout threads."
        },
        "kanit": {
          "tr": "Kilitlenme toplu görevle çakışıyor → C",
          "en": "Deadlock coincides with cron batch → C"
        },
        "diyagramAd": {
          "tr": "Toplu güncelleme",
          "en": "Batch range lock"
        },
        "diyagramTest": {
          "tr": [
            "Kilitlenme arka",
            "plan göreviyle",
            "çakışıyor mu?"
          ],
          "en": [
            "Do lock spikes",
            "overlap with cron",
            "batch execution?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Parçalara böl +",
            "yoğun saat dışına",
            "al"
          ],
          "en": [
            "Chunk batch updates",
            "+ off-peak queue",
            "scheduling"
          ]
        }
      }
    ],
    "kimCozer": {
      "tr": "Kıdemli backend mühendisi. Veritabanı hangi işlemlerin çakıştığını log'da söylediği için teşhis hızlıdır; asıl iş kilit sırasını ve işlem sürelerini yeniden düzenlemektir.",
      "en": "Senior backend engineer. Database engine outputs the conflicting queries in crash logs; resolution requires re-ordering table mutations and scoping transaction lifecycles."
    },
    "cozulmezse": {
      "tr": "Kilitlenme yoğun saatlerde sıklaşır. En kötü tarafı seçiciliğidir: sistem genelinde çalışıyor görünür, yalnız para kazandıran işlem durur.",
      "en": "Deadlocks compound during peak traffic campaigns. Their insidious nature is selective failure: catalogs browse fine while core checkout operations grind to a halt."
    },
    "ilgiliTerimler": [
      "deadlock",
      "race-condition",
      "n-plus-1-sorgu"
    ],
    "ilgiliHizmet": {
      "baslik": {
        "tr": "Acil Kriz Müdahalesi & Crash Test",
        "en": "Emergency Incident Triage & Crash Test"
      },
      "link": "/crash-test/"
    }
  },
  {
    "slug": "guncelleme-sonrasi-veri-kayboldu",
    "no": "05",
    "baslik": {
      "tr": "Güncellemeden sonra veri kayboldu sanılıyor",
      "en": "Data Assumed Lost After System Update"
    },
    "diyagramBaslik": {
      "tr": "Veri kayboldu sanısı",
      "en": "Perceived data loss"
    },
    "kirinti": {
      "tr": "Veri & Devir",
      "en": "Data & Migration"
    },
    "aciliyet": {
      "seviye": "kritik",
      "etiket": {
        "tr": "Kritik · veri paniği",
        "en": "Critical · data panic"
      }
    },
    "ozet": {
      "tr": "Bir güncellemeden sonra kayıtlar görünmüyor ve panik \"veriler silindi\" diye başlıyor. Çoğu vakada veri yerindedir; onu okuyan sorgu değişmiştir. Ama bu doğrulanmadan yapılan her müdahale gerçek kaybı yaratabilir.",
      "en": "Records vanish after a release, triggering data deletion panic. In most incidents, data remains intact; the query reading it mutated. Attempting hasty fixes without proper diagnosis risks causing genuine data loss."
    },
    "logSatirlari": [
      "Göç log'u: rolled back veya yarıda kesilmiş",
      "Column not found / Unknown column in field list",
      "Kayıt sayısı: tablodaki satır sayısı hâlâ eski değerde mi?",
      "Durum veya silme alanı toplu güncellenmiş mi?"
    ],
    "logNotu": {
      "tr": "İlk yapılacak iş kayıt saymaktır. Tabloda satır duruyorsa veri kaybolmamıştır, görünürlüğü kaybolmuştur. Bu ayrım müdahalenin yönünü tamamen değiştirir.",
      "en": "The first step is counting table rows directly. If row counts match, data is not erased; its visibility is filtered out. This distinction fundamentally changes the incident response vector."
    },
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Filtre değişti",
          "en": "Default query filter changed"
        },
        "aciklama": {
          "tr": "Yeni bir durum alanı veya yumuşak silme kolonu eklendi; eski kayıtlar varsayılan filtrenin dışında kaldı.",
          "en": "A new status column or soft-delete flag was added; legacy rows fail the default WHERE clause."
        },
        "kanit": {
          "tr": "Satır sayısı eskisiyle aynı → A",
          "en": "Row count unchanged in DB → A"
        },
        "diyagramAd": {
          "tr": "Filtre değişti",
          "en": "Filter changed"
        },
        "diyagramTest": {
          "tr": [
            "Tablodaki satır",
            "sayısı eskisiyle",
            "aynı mı?"
          ],
          "en": [
            "Is database row",
            "count identical to",
            "baseline?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Varsayılan değeri",
            "geriye dönük ata"
          ],
          "en": [
            "Backfill default",
            "flag on legacy",
            "records"
          ]
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Göç yarıda kaldı",
          "en": "Interrupted schema migration"
        },
        "aciklama": {
          "tr": "Şema değişikliği kesildi; bazı tablolar yeni, bazıları eski hâlde. Uygulama ikisini birden okuyamıyor.",
          "en": "DDL migration halted mid-stream; half the tables are upgraded, causing joins to fail."
        },
        "kanit": {
          "tr": "Göç log'unda kesinti → B",
          "en": "Migration abort in deploy log → B"
        },
        "diyagramAd": {
          "tr": "Göç yarıda kaldı",
          "en": "Partial migration"
        },
        "diyagramTest": {
          "tr": [
            "Göç log'unda",
            "yarıda kesilme",
            "var mı?"
          ],
          "en": [
            "Did migration log",
            "terminate with an",
            "unhandled error?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Yedekten dön ·",
            "göçü baştan",
            "çalıştır"
          ],
          "en": [
            "Restore snapshot ·",
            "re-run clean",
            "migration script"
          ]
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Gerçek silme",
          "en": "Genuine bulk deletion"
        },
        "aciklama": {
          "tr": "Bir toplu işlem kayıtları gerçekten sildi. Üçü içinde en az görüleni ama tek gerçek kayıp hâli budur.",
          "en": "A runaway script or bad WHERE clause executed actual hard DELETE. Rare, but the only true data loss scenario."
        },
        "kanit": {
          "tr": "Satır sayısı gerçekten düşmüş → C",
          "en": "Row count decreased in DB → C"
        },
        "diyagramAd": {
          "tr": "Gerçek silme",
          "en": "Actual deletion"
        },
        "diyagramTest": {
          "tr": [
            "Satır sayısı",
            "gerçekten düştü",
            "mü?"
          ],
          "en": [
            "Did physical row",
            "count actually",
            "drop?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Yedekten geri",
            "yükleme · süre",
            "kritik"
          ],
          "en": [
            "Point-in-time",
            "backup restore ·",
            "time critical"
          ]
        }
      }
    ],
    "kimCozer": {
      "tr": "İlk adım geliştirici çağırmak değil, hiçbir şeye yazmamaktır. Yeni kayıt eklemek ve tablo değiştirmek geri dönüş seçeneklerini daraltır. A dakikalar içinde kapanır, B yedekten yürütülür, C'de her saat önemlidir.",
      "en": "The absolute first rule is freezing all writes. Writing new data or altering schemas destroys recovery options. A is resolved in minutes, B via atomic rollback, C requires immediate point-in-time snapshot recovery."
    },
    "cozulmezse": {
      "tr": "Gerçek silme hâlinde geri dönüş penceresi yedek politikanız kadardır. En sık yapılan hata, teşhis konmadan \"düzeltmeye\" başlamak ve kurtarılabilir veriyi üzerine yazmaktır.",
      "en": "Under true deletion, the recovery window equals snapshot retention. The most frequent catastrophe is attempting blind repairs that overwrite restorable blocks."
    },
    "ilgiliTerimler": [
      "migration",
      "staging-ortami",
      "teknik-borc"
    ],
    "ilgiliHizmet": {
      "baslik": {
        "tr": "Devir Hazırlık Kontrolü",
        "en": "Handover Readiness Audit"
      },
      "link": "/devir-kontrolu/"
    }
  },
  {
    "slug": "deploy-sonrasi-site-bozuldu",
    "no": "06",
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
  },
  {
    "slug": "site-500-veriyor-dun-calisiyordu",
    "no": "07",
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
  },
  {
    "slug": "bulut-hesabi-askiya-alindi",
    "no": "08",
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
  },
  {
    "slug": "yedek-var-sanildi-yedek-yok",
    "no": "09",
    "baslik": {
      "tr": "Yedek var sanılıyordu, yedek yok",
      "en": "Backup Assumed to Exist, No Valid Backup"
    },
    "diyagramBaslik": {
      "tr": "Yedek yok",
      "en": "No valid backup"
    },
    "kirinti": {
      "tr": "Devir & Süreklilik",
      "en": "Handover & Continuity"
    },
    "aciliyet": {
      "seviye": "kritik",
      "etiket": {
        "tr": "Kritik · veri riski",
        "en": "Critical · data loss risk"
      }
    },
    "ozet": {
      "tr": "Bir sorun çıktı, yedeğe dönülmek istendi ve yedeğin ya hiç alınmadığı ya da geri yüklenemediği görüldü. Yedeğin var olması ile geri yüklenebilir olması aynı şey değildir; ikincisi denenmeden bilinmez.",
      "en": "An outage occurred, a rollback to backup was requested, only to discover snapshots were never generated or are un-restorable. A backup file existing versus being restorable are entirely different; the latter is unknown until tested."
    },
    "logSatirlari": [
      "Yedek klasöründeki son dosyanın tarihi   ← aylar öncesi mi?",
      "cron log: backup job — exit status 1",
      "Yedek dosya boyutu 0 byte / birkaç KB",
      "Depolama sağlayıcısı: quota exceeded"
    ],
    "logNotu": {
      "tr": "Yedek işi çoğu zaman sessizce başarısız olur. Hata bir yere düşer ama kimse okumaz; klasörde dosya göründüğü için sorun fark edilmez.",
      "en": "Backup routines fail silently most of the time. Errors are emitted to unmonitored logs while stale files in the folder give a false sense of security."
    },
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Yedek alınmıyor",
          "en": "Backups not running"
        },
        "aciklama": {
          "tr": "Görev kurulmuş ama çalışmıyor: zamanlayıcı durmuş, kimlik değişmiş ya da hedef dolmuş.",
          "en": "Cron was configured but terminated: scheduler daemon died, auth expired, or target bucket filled up."
        },
        "kanit": {
          "tr": "Son yedek tarihi çok eski → A",
          "en": "Latest backup date is stale → A"
        },
        "diyagramAd": {
          "tr": "Yedek alınmıyor",
          "en": "Backups failing"
        },
        "diyagramTest": {
          "tr": [
            "Son yedek dosyası",
            "kaç günlük?"
          ],
          "en": [
            "How old is the",
            "latest backup file",
            "in storage?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Görev onarımı +",
            "başarısızlık",
            "bildirimi"
          ],
          "en": [
            "Cron repair +",
            "dead-man switch",
            "alerts"
          ]
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Yedek eksik alınıyor",
          "en": "Partial / incomplete dump"
        },
        "aciklama": {
          "tr": "Dosyalar var ama veritabanı yok, ya da tersi. Kısmi yedek olay anında tam geri dönüş sağlamaz.",
          "en": "Uploaded assets exist without SQL dumps, or vice versa. Partial snapshots prevent full recovery during disaster recovery."
        },
        "kanit": {
          "tr": "Yedekte veritabanı dökümü yok → B",
          "en": "Missing SQL dump in archive → B"
        },
        "diyagramAd": {
          "tr": "Yedek eksik",
          "en": "Incomplete dump"
        },
        "diyagramTest": {
          "tr": [
            "Yedekte veritabanı",
            "dökümü var mı?"
          ],
          "en": [
            "Does archive",
            "contain valid SQL",
            "dump file?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Kapsam genişletme",
            "+ boyut kontrolü"
          ],
          "en": [
            "Full scope dump",
            "+ file size",
            "threshold check"
          ]
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Geri yüklenemiyor",
          "en": "Un-restorable / corrupted"
        },
        "aciklama": {
          "tr": "Dosya bozuk, şifresi kayıp ya da sürüm uyumsuz. Hiç denenmediği için bugüne kadar bilinmiyordu.",
          "en": "Archive is corrupt, decryption key is missing, or schema versions clash. Never tested until live disaster hit."
        },
        "kanit": {
          "tr": "Test geri yükleme başarısız → C",
          "en": "Test sandbox restore failed → C"
        },
        "diyagramAd": {
          "tr": "Geri yüklenemiyor",
          "en": "Un-restorable"
        },
        "diyagramTest": {
          "tr": [
            "Boş ortama geri",
            "yükleme denendi mi?"
          ],
          "en": [
            "Was restore",
            "tested in clean",
            "sandbox env?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Düzenli geri",
            "yükleme provası"
          ],
          "en": [
            "Automated drill",
            "restoration in",
            "staging sandbox"
          ]
        }
      }
    ],
    "kimCozer": {
      "tr": "Sistem yöneticisi. Ama asıl çözüm teknik değil rutinseldir: yedek başarısız olduğunda haber veren bir bildirim ve düzenli aralıklarla yapılan geri yükleme provası. Denenmemiş yedek, yedek sayılmaz.",
      "en": "Sysadmin / DevOps. But the true solution is procedural: dead-man failure alerts and scheduled sandbox restoration drills. An untested backup is not a backup."
    },
    "cozulmezse": {
      "tr": "Yedeksiz geçen her gün, tek bir donanım arızasının ya da yanlış komutun projeyi tamamen bitirebileceği bir gündür. Bu riskin bedeli ancak gerçekleştiğinde görülür.",
      "en": "Every day operating without restorable backups is a single disk crash or rogue query away from total business termination."
    },
    "ilgiliTerimler": [
      "migration",
      "staging-ortami",
      "teknik-borc"
    ],
    "ilgiliHizmet": {
      "baslik": {
        "tr": "Devir Hazırlık Kontrolü",
        "en": "Handover Readiness Audit"
      },
      "link": "/devir-kontrolu/"
    }
  },
  {
    "slug": "ssl-suresi-doldu",
    "no": "10",
    "baslik": {
      "tr": "SSL süresi doldu, tarayıcı uyarı veriyor",
      "en": "SSL Certificate Expired, Security Warning Displayed"
    },
    "diyagramBaslik": {
      "tr": "SSL süresi doldu",
      "en": "SSL certificate expired"
    },
    "kirinti": {
      "tr": "Altyapı & Erişim",
      "en": "Infrastructure & Access"
    },
    "aciliyet": {
      "seviye": "kritik",
      "etiket": {
        "tr": "Kritik · güven kaybı",
        "en": "Critical · trust loss"
      }
    },
    "ozet": {
      "tr": "Ziyaretçiler siteye girerken 'bağlantınız gizli değil' uyarısı alıyor. Site aslında çalışıyor, araya giren tarayıcı. Müşteriniz bunu güvenlik ihlali sanır; teknik olarak çoğu zaman basit bir yenileme sorunudur.",
      "en": "Users are blocked by 'Your connection is not private' browser interstitials. The application is running fine, but the TLS handshake fails. Clients perceive a breach; technically it is usually a stalled renewal script."
    },
    "logSatirlari": [
      "NET::ERR_CERT_DATE_INVALID              ← süre doldu",
      "NET::ERR_CERT_COMMON_NAME_INVALID       ← alan adı eşleşmiyor",
      "SSL certificate problem: unable to get local issuer certificate",
      "certbot renew — hook command failed"
    ],
    "logNotu": {
      "tr": "Tarayıcının verdiği hata kodu nedeni doğrudan söyler. Uyarı ekranındaki 'Gelişmiş' bağlantısı hangi kodun geçerli olduğunu gösterir.",
      "en": "Browser error codes state the exact root cause directly. The 'Advanced' button reveals whether expiration, domain mismatch, or broken CA chain is at play."
    },
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Yenileme durdu",
          "en": "Auto-renewal stopped"
        },
        "aciklama": {
          "tr": "Kısa ömürlü sertifikalar otomatik yenilenir; yenileme görevi bir noktada sessizce durmuştur.",
          "en": "Automated 90-day certificates require active cron hooks; the renewal task failed silently without triggering alerts."
        },
        "kanit": {
          "tr": "Yenileme log'unda hata → A",
          "en": "Certbot renewal error in log → A"
        },
        "diyagramAd": {
          "tr": "Yenileme durdu",
          "en": "Renewal halted"
        },
        "diyagramTest": {
          "tr": [
            "Yenileme görevi",
            "çalışıyor mu?"
          ],
          "en": [
            "Is certbot / ACME",
            "cron executing",
            "cleanly?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Görev onarımı +",
            "süre bildirimi"
          ],
          "en": [
            "Certbot repair +",
            "expiry monitoring",
            "webhook"
          ]
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Kapsam eksik",
          "en": "Missing SAN / subdomains"
        },
        "aciklama": {
          "tr": "Sertifika ana alan adını kapsıyor ama `www` veya bir alt alan adını kapsamıyor.",
          "en": "Certificate covers apex domain but lacks SAN coverage for `www` or target subdomains."
        },
        "kanit": {
          "tr": "COMMON_NAME hatası → B",
          "en": "COMMON_NAME_INVALID error → B"
        },
        "diyagramAd": {
          "tr": "Kapsam eksik",
          "en": "Missing SAN"
        },
        "diyagramTest": {
          "tr": [
            "Hata kodu CN /",
            "alan adı hatası mı?"
          ],
          "en": [
            "Is error code",
            "COMMON_NAME",
            "mismatch?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Sertifikayı alt",
            "alan adlarıyla",
            "yeniden al"
          ],
          "en": [
            "Re-issue with",
            "all SAN / www",
            "subdomains"
          ]
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Zincir eksik",
          "en": "Incomplete CA chain"
        },
        "aciklama": {
          "tr": "Sertifika geçerli ama zincir tamamlanmamış. Bazı cihazlarda çalışır, bazılarında çalışmaz — en yanıltıcı hâl budur.",
          "en": "Leaf certificate is valid but intermediate CA bundle is missing. Works on modern desktops, fails on mobile — the most deceptive failure."
        },
        "kanit": {
          "tr": "unable to get local issuer → C",
          "en": "unable to get local issuer error → C"
        },
        "diyagramAd": {
          "tr": "Zincir eksik",
          "en": "Broken CA chain"
        },
        "diyagramTest": {
          "tr": [
            "Bazı cihazlarda",
            "çalışıp bazılarında",
            "çalışmıyor mu?"
          ],
          "en": [
            "Does it fail",
            "only on specific",
            "mobile clients?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Ara sertifikayı",
            "zincire ekle"
          ],
          "en": [
            "Install fullchain",
            "bundle to web",
            "server config"
          ]
        }
      }
    ],
    "kimCozer": {
      "tr": "Sistem yöneticisi · genellikle bir saatin altında. Asıl mesele tekrarını önlemektir: yenileme başarısız olduğunda haber veren bir bildirim kurulmadıkça aynı arıza sertifika ömrü kadar sonra geri gelir.",
      "en": "DevOps / Sysadmin · resolved in under one hour. The true goal is preventing recurrence: without automated cert expiration monitoring, the issue repeats every 90 days."
    },
    "cozulmezse": {
      "tr": "Tarayıcı uyarısı gören ziyaretçilerin büyük kısmı geri döner. Ödeme sayfasında bu uyarı, o günkü satışların durması demektir.",
      "en": "Over 90% of visitors bounce immediately upon seeing security interstitials. On e-commerce checkout flows, it halts revenue instantly."
    },
    "ilgiliTerimler": [
      "ci-cd",
      "staging-ortami"
    ],
    "ilgiliHizmet": {
      "baslik": {
        "tr": "Acil Kriz Müdahalesi & Crash Test",
        "en": "Emergency Incident Triage & Crash Test"
      },
      "link": "/crash-test/"
    }
  },
  {
    "slug": "site-yavasladi-sunucu-bos",
    "no": "11",
    "baslik": {
      "tr": "Site yavaşladı ama sunucu boş",
      "en": "Site Stalled Despite Idle Server Resources"
    },
    "diyagramBaslik": {
      "tr": "Yavaş ama sunucu boş",
      "en": "Slow with idle server"
    },
    "kirinti": {
      "tr": "Performans",
      "en": "Performance"
    },
    "aciliyet": {
      "seviye": "yuksek",
      "etiket": {
        "tr": "Yüksek · dönüşüm kaybı",
        "en": "High · conversion loss"
      }
    },
    "ozet": {
      "tr": "Sayfalar geç açılıyor ama sunucu kaynakları rahat görünüyor. 'Sunucu yetersiz' denip plan yükseltilir, hiçbir şey değişmez. Boş bir sunucuda yavaşlık kaynak sorunu değil, bekleme sorunudur.",
      "en": "Page latency surges while server CPU and RAM remain idle. Upgrading infrastructure tiers changes nothing. Sluggish performance on idle servers is a blocking I/O bottleneck, not a compute limitation."
    },
    "logSatirlari": [
      "Sayfa başına veritabanı sorgu sayısı: yüzlerce",
      "Yavaş sorgu log'u: aynı sorgu defalarca tekrarlıyor",
      "Harici servis çağrısı: 2–8 saniye bekleme",
      "İlk bayt süresi yüksek, indirme hızlı"
    ],
    "logNotu": {
      "tr": "Sunucu boşken yaşanan yavaşlık, sistemin çalışmadığını değil beklediğini gösterir. Aranacak şey işlemci kullanımı değil, isteğin nerede beklediğidir.",
      "en": "Latency with low CPU indicates blocking wait states. The metric to investigate is not CPU utilization, but where the thread is blocking."
    },
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Sorgu çoğalması",
          "en": "N+1 query explosion"
        },
        "aciklama": {
          "tr": "Listedeki her satır için ayrı sorgu atılıyor. 10 kayıtla fark edilmez, 500 kayıtla site durur.",
          "en": "Loop triggers separate SQL queries for each item. Unnoticeable with 10 items, catastrophic with 500."
        },
        "kanit": {
          "tr": "Aynı sorgu defalarca tekrarlıyor → A",
          "en": "Same query loops hundreds of times → A"
        },
        "diyagramAd": {
          "tr": "Sorgu çoğalması",
          "en": "N+1 queries"
        },
        "diyagramTest": {
          "tr": [
            "Aynı sorgu sayfa",
            "başına defalarca",
            "mı tekrarlıyor?"
          ],
          "en": [
            "Does same query",
            "execute hundreds",
            "of times per hit?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "İlişkileri toplu",
            "çek · saatler",
            "içinde biter"
          ],
          "en": [
            "Eager loading +",
            "batch SQL joins",
            "· resolved today"
          ]
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Dizin eksik",
          "en": "Missing database index"
        },
        "aciklama": {
          "tr": "Sorgu doğru ama tablo baştan sona taranıyor. Veri büyüdükçe süre doğrusal artar.",
          "en": "Query syntax is clean but triggers full table scans (Seq Scan). Duration grows linearly with table size."
        },
        "kanit": {
          "tr": "Yavaş sorgu tüm tabloyu tarıyor → B",
          "en": "Full table scan in EXPLAIN log → B"
        },
        "diyagramAd": {
          "tr": "Dizin eksik",
          "en": "Missing index"
        },
        "diyagramTest": {
          "tr": [
            "Yavaş sorgu tüm",
            "tabloyu mu",
            "tarıyor?"
          ],
          "en": [
            "Does EXPLAIN show",
            "full table scan",
            "on large tables?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Dizin ekle ·",
            "etki anında"
          ],
          "en": [
            "Add composite",
            "index · instant",
            "speedup"
          ]
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Harici bekleme",
          "en": "Synchronous third-party I/O"
        },
        "aciklama": {
          "tr": "Kargo, ödeme veya stok servisi yavaş yanıt veriyor ve sayfa onu bekliyor.",
          "en": "Outbound carrier, payment, or ERP API is slow and web process blocks execution."
        },
        "kanit": {
          "tr": "Yavaşlık harici çağrıda yoğunlaşıyor → C",
          "en": "Latency concentrated in external cURL → C"
        },
        "diyagramAd": {
          "tr": "Harici bekleme",
          "en": "Third-party wait"
        },
        "diyagramTest": {
          "tr": [
            "Yavaşlık harici",
            "çağrıda mı",
            "yoğunlaşıyor?"
          ],
          "en": [
            "Is TTFB spent on",
            "outbound 3rd-party",
            "HTTP requests?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Önbellek + zaman",
            "aşımı + arka",
            "plana al"
          ],
          "en": [
            "Redis cache +",
            "strict timeouts +",
            "async background"
          ]
        }
      }
    ],
    "kimCozer": {
      "tr": "Kıdemli backend mühendisi. A ve B çoğunlukla aynı gün kapanır ve etkisi anında görülür. C'de asıl mesele harici servisi hızlandırmak değil, sayfanın onu beklememesini sağlamaktır.",
      "en": "Senior backend engineer. A and B are resolved in hours with instant speedup. For C, the solution is asynchronous decoupling so pages never block on third parties."
    },
    "cozulmezse": {
      "tr": "Yavaşlık dönüşümü doğrudan düşürür ve arama sıralamasında da karşılığı vardır. Sunucu yükseltmek maliyeti artırır, belirtiyi bir süre örter, nedeni bırakır.",
      "en": "High latency degrades checkout conversion and organic Core Web Vitals. Server upgrades mask symptoms temporarily while increasing cloud spend without fixing root flaws."
    },
    "ilgiliTerimler": [
      "n-plus-1-sorgu",
      "teknik-borc",
      "rate-limit"
    ],
    "ilgiliHizmet": {
      "baslik": {
        "tr": "Kesinti Maliyeti Hesabı",
        "en": "Downtime Loss Calculator"
      },
      "link": "/kesinti-maliyeti/"
    }
  },
  {
    "slug": "entegrasyon-429-veriyor",
    "no": "12",
    "baslik": {
      "tr": "Entegrasyon aniden 429 vermeye başladı",
      "en": "Third-Party Integration Returning HTTP 429"
    },
    "diyagramBaslik": {
      "tr": "Entegrasyon 429 veriyor",
      "en": "Integration 429 rate limit"
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
      "tr": "Aylardır çalışan bir entegrasyon — kargo, pazaryeri, ödeme ya da e-posta — birden hata vermeye başladı ve kod değişmedi. Karşı taraf artık isteklerinizi reddediyor; sorun sizde değil, sizin hızınızda olabilir.",
      "en": "An integration running smoothly for months — carrier, marketplace, payment gateway, or transactional email — abruptly fails with HTTP 429. The remote host is throttling your traffic due to volumetric burst limits."
    },
    "logSatirlari": [
      "HTTP 429 Too Many Requests",
      "Retry-After: 60",
      "X-RateLimit-Remaining: 0",
      "Sağlayıcı paneli: quota exceeded for this period"
    ],
    "logNotu": {
      "tr": "Retry-After başlığı ne kadar beklemeniz gerektiğini söyler. Bu başlık okunmadan yapılan yeniden denemeler limiti daha da uzatır.",
      "en": "The Retry-After header indicates the mandatory cooldown interval. Retrying blindly without parsing backoff headers prolongs IP ban windows."
    },
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Hacim büyüdü",
          "en": "Natural volume growth"
        },
        "aciklama": {
          "tr": "İş büyüdü, istek sayısı sessizce limitin üstüne çıktı. Kod aynı, trafik değişti.",
          "en": "Order volume scaled naturally, exceeding baseline API tier quota without notice."
        },
        "kanit": {
          "tr": "İstek sayısı zamanla artmış → A",
          "en": "Request rate climbed over time → A"
        },
        "diyagramAd": {
          "tr": "Hacim büyüdü",
          "en": "Volume growth"
        },
        "diyagramTest": {
          "tr": [
            "İstek sayısı son",
            "aylarda arttı mı?"
          ],
          "en": [
            "Has API traffic",
            "grown steadily in",
            "recent months?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Toplu istek +",
            "paket yükseltme"
          ],
          "en": [
            "Batch payloads +",
            "upgrade API tier"
          ]
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Döngüsel tekrar",
          "en": "Retry storm (No backoff)"
        },
        "aciklama": {
          "tr": "Hata sonrası yeniden deneme mantığı beklemeden tekrarlıyor ve limiti kendi kendine dolduruyor.",
          "en": "Worker catches transient error and immediately hammers API in tight loop, exhausting rate limits."
        },
        "kanit": {
          "tr": "Aynı istek çok kısa aralıkla tekrarlıyor → B",
          "en": "Rapid repeated requests in log → B"
        },
        "diyagramAd": {
          "tr": "Döngüsel tekrar",
          "en": "Retry storm"
        },
        "diyagramTest": {
          "tr": [
            "Aynı istek çok",
            "kısa aralıkla mı",
            "tekrarlıyor?"
          ],
          "en": [
            "Are retry requests",
            "fired without",
            "backoff delays?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Artan bekleme",
            "süresi ekle"
          ],
          "en": [
            "Exponential",
            "backoff + jitter",
            "retry logic"
          ]
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Limit değişti",
          "en": "Provider quota downgrade"
        },
        "aciklama": {
          "tr": "Karşı taraf kotayı değiştirdi ya da fiyat planı düştü. Sizde hiçbir şey değişmedi.",
          "en": "Upstream provider tightened throttle policy or subscription plan lapsed to free tier."
        },
        "kanit": {
          "tr": "Limit başlığındaki değer düşmüş → C",
          "en": "X-RateLimit cap dropped in headers → C"
        },
        "diyagramAd": {
          "tr": "Limit değişti",
          "en": "Quota reduced"
        },
        "diyagramTest": {
          "tr": [
            "Limit başlığındaki",
            "değer düştü mü?"
          ],
          "en": [
            "Did rate limit",
            "header cap drop",
            "unexpectedly?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Sağlayıcıyla plan",
            "görüşmesi"
          ],
          "en": [
            "Negotiate higher",
            "tier with vendor"
          ]
        }
      }
    ],
    "kimCozer": {
      "tr": "Backend mühendisi. Kalıcı çözüm istek sayısını azaltmak ve artan bekleme süresiyle yeniden denemektir. Bu iki yapı kurulduğunda entegrasyon hacim büyüdükçe kendiliğinden uyum sağlar.",
      "en": "Backend engineer. Permanent resilience combines payload batching with exponential backoff and jitter algorithms. This enables integrations to scale gracefully with traffic spikes."
    },
    "cozulmezse": {
      "tr": "Reddedilen her istek eksik veri demektir: gönderilmeyen kargo bildirimi, güncellenmeyen stok, ulaşmayan e-posta. Sistem çalışıyor görünür ama içerik doğru değildir.",
      "en": "Throttled requests mean desynchronized operations: tracking numbers unsent, inventory un-updated, customer transactional emails lost in queue."
    },
    "ilgiliTerimler": [
      "rate-limit",
      "webhook",
      "idempotency"
    ],
    "ilgiliHizmet": {
      "baslik": {
        "tr": "B2B White-Label Mühendislik Masası",
        "en": "B2B White-Label Engineering Desk"
      },
      "link": "/agency/"
    }
  },
  {
    "slug": "sunucu-her-gun-yeniden-baslatiliyor",
    "no": "13",
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
  },
  {
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
  },
  {
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
  },
  {
    "slug": "yazilimci-gitti-koda-girilemiyor",
    "no": "16",
    "baslik": {
      "tr": "Yazılımcı gitti, kimse koda giremiyor",
      "en": "Developer Departed, Codebase Inaccessible"
    },
    "diyagramBaslik": {
      "tr": "Koda kimse giremiyor",
      "en": "Codebase inaccessible"
    },
    "kirinti": {
      "tr": "Devir & Süreklilik",
      "en": "Handover & Continuity"
    },
    "aciliyet": {
      "seviye": "yuksek",
      "etiket": {
        "tr": "Yüksek · süreklilik riski",
        "en": "High · continuity risk"
      }
    },
    "ozet": {
      "tr": "Projeyi yapan kişi ayrıldı. Site çalışmaya devam ediyor ama değişiklik yapılamıyor: kodun nerede olduğu, sunucuya kimin girebildiği ya da hesapların kime kayıtlı olduğu belirsiz. Bu üç ayrı problemdir ve hangisiyle karşı karşıya olduğunuz ilk saatte belirlenebilir.",
      "en": "The developer who built the platform departed. The site continues running but cannot be modified: repository location, server SSH credentials, or account ownership remain unknown. These are three distinct bottlenecks, identifiable within hour one."
    },
    "logSatirlari": [
      "git log -1 --format=%cd            ← son commit ne zaman?",
      "git log --format='%an' | sort -u   ← koda kaç kişi dokunmuş?",
      "~/.ssh/authorized_keys             ← sunucuya kimin anahtarı var?",
      "WHOIS + hosting hesabı             ← hangi e-postaya kayıtlı?"
    ],
    "logNotu": {
      "tr": "Bu dört satır, devrin teknik mi yoksa idari bir problem mi olduğunu ayırır. Çoğu vakada sorun kodda değil, hesap sahipliğindedir.",
      "en": "These four checkpoints determine whether handover failure is technical or administrative. In most cases, the bottleneck is account ownership rather than code."
    },
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Erişim kaybı",
          "en": "Loss of access"
        },
        "aciklama": {
          "tr": "Domain, hosting ve depo kişinin şahsi e-postasına kayıtlı. Kod sağlam, altyapı çalışıyor; devredilmesi gereken şey hesaplar.",
          "en": "Domain registrar, host, and git repos are registered to personal emails. Code and infrastructure are sound; the bottleneck is credential handover."
        },
        "kanit": {
          "tr": "Hesaplar şahsi adreste → A",
          "en": "Accounts on personal mail → A"
        },
        "diyagramAd": {
          "tr": "Erişim kaybı",
          "en": "Access loss"
        },
        "diyagramTest": {
          "tr": [
            "Hesaplar şirket",
            "adresine mi",
            "kayıtlı?"
          ],
          "en": [
            "Are accounts",
            "tied to company",
            "domain email?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Hesap devri —",
            "idari süreç,",
            "kod işi değil"
          ],
          "en": [
            "Account transfer —",
            "admin workflow,",
            "no coding needed"
          ]
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Kaynak kod kayıp",
          "en": "Missing source repository"
        },
        "aciklama": {
          "tr": "Sürüm kontrolü hiç kurulmamış. Canlı sunucudaki dosyalar tek kopya. En kırılgan hâl budur.",
          "en": "Version control was never initialized. Live production server contains the sole surviving copy. The highest-risk state."
        },
        "kanit": {
          "tr": "Depo yok → B",
          "en": "No remote repo → B"
        },
        "diyagramAd": {
          "tr": "Kod kayıp",
          "en": "Source lost"
        },
        "diyagramTest": {
          "tr": [
            "Sürüm kontrolü",
            "(git) var mı?"
          ],
          "en": [
            "Is version control",
            "(git remote)",
            "present?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "ÖNCE canlıdan",
            "tam yedek,",
            "SONRA depo"
          ],
          "en": [
            "Full live image",
            "FIRST, then git",
            "init setup"
          ]
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Ortam belgesiz",
          "en": "Undocumented environment"
        },
        "aciklama": {
          "tr": "Kod var ama çalıştırılamıyor: kurulum adımları, ortam değişkenleri ve bağımlılık sürümleri yazılı değil.",
          "en": "Repository exists but cannot be booted: setup commands, environment variables, and lockfiles are absent."
        },
        "kanit": {
          "tr": ".env.example / lock yok → C",
          "en": "Missing .env / lockfile → C"
        },
        "diyagramAd": {
          "tr": "Ortam belgesiz",
          "en": "No docs / env"
        },
        "diyagramTest": {
          "tr": [
            "README ve",
            "bağımlılık kilidi",
            "var mı?"
          ],
          "en": [
            "Are README and",
            "package lockfiles",
            "available?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Ortam yeniden",
            "inşası +",
            "belgeleme"
          ],
          "en": [
            "Environment",
            "rebuild +",
            "documentation"
          ]
        }
      }
    ],
    "kimCozer": {
      "tr": "A idari bir süreçtir, geliştirici gerekmez. B'de ilk iş kod yazmak değil, canlı sunucudan tam yedek almaktır — bu adım atlanırsa tek kopya risk altında kalır. C, devir teşhisinin ölçtüğü şeydir.",
      "en": "A is an administrative process, requiring zero coding. For B, the absolute first step is pulling a full live server image, not writing code. C is precisely what a handover code audit diagnoses."
    },
    "cozulmezse": {
      "tr": "Sürüm kontrolü olmayan bir projede canlı sunucu tek kopyadır. Sunucu çökerse veya hesap kapanırsa geri dönüş yoktur. Risk her gün büyür, çünkü kimse yedeğin gerçekten alındığını doğrulamamıştır.",
      "en": "Without version control, production is a single point of total failure. If the instance crashes, recovery is impossible. Risk compounds daily until full image verification is completed."
    },
    "ilgiliTerimler": [
      "teknik-borc",
      "staging-ortami",
      "migration"
    ],
    "ilgiliHizmet": {
      "baslik": {
        "tr": "Devir Hazırlık Kontrolü",
        "en": "Handover Readiness Audit"
      },
      "link": "/devir-kontrolu/"
    }
  },
  {
    "slug": "domain-hosting-erisimi-yok",
    "no": "17",
    "baslik": {
      "tr": "Domain ve hosting erişimi kimsede yok",
      "en": "Zero Access to Domain Registrar and Hosting"
    },
    "diyagramBaslik": {
      "tr": "Erişim kimsede yok",
      "en": "No root hosting access"
    },
    "kirinti": {
      "tr": "Devir & Süreklilik",
      "en": "Handover & Continuity"
    },
    "aciliyet": {
      "seviye": "yuksek",
      "etiket": {
        "tr": "Yüksek · mülkiyet riski",
        "en": "High · ownership risk"
      }
    },
    "ozet": {
      "tr": "Site çalışıyor ama kimse yönetim paneline giremiyor. Alan adının kime kayıtlı olduğu, hosting faturasının kime gittiği belirsiz. Bu bir yazılım sorunu değil, mülkiyet sorunudur — ve teknik ekip tek başına çözemez.",
      "en": "The website is online but no stakeholder has root panel access. Domain registrant identity and hosting billing recipients are unknown. This is an ownership dispute, not software, requiring administrative escalation."
    },
    "logSatirlari": [
      "WHOIS sorgusu → kayıt sahibi e-postası kim?",
      "Hosting / bulut faturası hangi adrese gidiyor?",
      "DNS kayıtları hangi sağlayıcıda tutuluyor?",
      "Alan adının son kullanma tarihi"
    ],
    "logNotu": {
      "tr": "Bu dört bilgi bir saat içinde toplanabilir ve devrin mümkün olup olmadığını doğrudan gösterir. Erişim kurtarma süreçleri günler sürdüğü için beklemek pahalıdır.",
      "en": "These four data points can be extracted within one hour, showing whether transfer is straightforward or requires registrar dispute arbitration."
    },
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Ayrılan kişide",
          "en": "Former employee holds auth"
        },
        "aciklama": {
          "tr": "Hesaplar eski geliştiricinin veya eski bir çalışanın şahsi adresine kayıtlı. İyi niyet varsa devir kolaydır.",
          "en": "Registrar accounts reside under a former freelancer or employee personal email. If cooperative, handover is simple."
        },
        "kanit": {
          "tr": "WHOIS'te şahsi adres → A",
          "en": "Personal email in WHOIS → A"
        },
        "diyagramAd": {
          "tr": "Ayrılan kişide",
          "en": "Former staff email"
        },
        "diyagramTest": {
          "tr": [
            "Kayıtlı e-posta",
            "şirkete mi ait?"
          ],
          "en": [
            "Is registrant email",
            "under corporate",
            "domain?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Devir talebi ·",
            "iletişim varsa",
            "hızlı"
          ],
          "en": [
            "Direct transfer ·",
            "fast if contact",
            "is open"
          ]
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Aracı firmada",
          "en": "Held by third-party agency"
        },
        "aciklama": {
          "tr": "Alan adını bir ajans ya da bayi kendi hesabından almış. Sizin adınıza değil, onun portföyünde duruyor.",
          "en": "Domain purchased via third-party agency reseller pool. Owned in their account rather than client direct legal entity."
        },
        "kanit": {
          "tr": "Kayıt sahibi bir firma → B",
          "en": "Registrant is reseller entity → B"
        },
        "diyagramAd": {
          "tr": "Aracı firmada",
          "en": "Reseller agency"
        },
        "diyagramTest": {
          "tr": [
            "Kayıt sahibi firma",
            "adına mı?"
          ],
          "en": [
            "Is registrar tied",
            "to reseller",
            "agency name?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Transfer kodu",
            "talebi + kayıt",
            "değişikliği"
          ],
          "en": [
            "EPP auth code +",
            "registrant",
            "transfer request"
          ]
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Ulaşılamıyor",
          "en": "Unreachable registrant"
        },
        "aciklama": {
          "tr": "Kayıtlı adres çalışmıyor, kişiye erişilemiyor. Sağlayıcının resmi erişim kurtarma sürecine girilmesi gerekir.",
          "en": "Registrant mailbox abandoned, account holder unresponsive. Official registrar legal escalation required."
        },
        "kanit": {
          "tr": "Kayıtlı adrese ulaşılamıyor → C",
          "en": "Bouncing mailbox / ghosted → C"
        },
        "diyagramAd": {
          "tr": "Ulaşılamıyor",
          "en": "Unreachable"
        },
        "diyagramTest": {
          "tr": [
            "Kayıtlı adrese",
            "mail ulaşıyor mu?"
          ],
          "en": [
            "Does registrant",
            "mailbox receive",
            "inbound mail?"
          ]
        },
        "diyagramCozum": {
          "tr": [
            "Sağlayıcı kurtarma",
            "süreci · belge",
            "gerekir"
          ],
          "en": [
            "Registrar recovery",
            "· corporate legal",
            "docs required"
          ]
        }
      }
    ],
    "kimCozer": {
      "tr": "Bu bir idare ve hukuk işidir; geliştirici gerekmez. Şirket belgeleri, fatura kayıtları ve marka sahipliği kanıtları süreci hızlandırır. Teknik ekibin katkısı ancak DNS ve barındırma taşınmasında başlar.",
      "en": "This is an administrative and legal challenge; developers are not required initially. Corporate tax registration, invoice trails, and trademark certificates accelerate registrar transfer."
    },
    "cozulmezse": {
      "tr": "Alan adının süresi dolduğunda site bir gecede kapanır ve ad üçüncü kişiler tarafından alınabilir. Geri kazanmak çoğu zaman mümkün olmaz.",
      "en": "When domain expiration hits, the website drops overnight and can be snapped up by domain squatters, permanently destroying brand equity."
    },
    "ilgiliTerimler": [
      "staging-ortami",
      "ci-cd",
      "teknik-borc"
    ],
    "ilgiliHizmet": {
      "baslik": {
        "tr": "Devir Hazırlık Kontrolü",
        "en": "Handover Readiness Audit"
      },
      "link": "/devir-kontrolu/"
    }
  },
  {
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
  },
  {
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
    "logSatirlari": [
      "robots.txt → Disallow: /",
      "<meta name=\"robots\" content=\"noindex\">",
      "Sunucu yanıtı: 5xx veya çok yavaş ilk bayt süresi",
      "Yönlendirme zinciri: 302 → 302 → 200"
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
  },
  {
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
  }
];
export const teshisSummaries = [
  {
    "slug": "ayni-stok-iki-musteriye-satildi",
    "no": "01",
    "baslik": {
      "tr": "Aynı stok iki müşteriye satıldı",
      "en": "Same Inventory Sold to Multiple Customers"
    },
    "diyagramBaslik": {
      "tr": "Aynı stok iki kez satıldı",
      "en": "Oversold inventory race"
    },
    "kirinti": {
      "tr": "Sipariş & Ödeme",
      "en": "Orders & Payments"
    },
    "aciliyet": {
      "seviye": "kritik",
      "etiket": {
        "tr": "Kritik · ticari kayıp",
        "en": "Critical · revenue loss"
      }
    },
    "ozet": {
      "tr": "Son kalan ürün iki ayrı siparişte çıktı, stok eksiye düştü. Birine iade yapmak zorundasınız. Bu belirtinin üç farklı nedeni var ve üçünün çözümü birbirinden tamamen ayrı — yanlış olanı düzeltmek sorunu geri getirir.",
      "en": "The last item in stock was checked out across two different orders, sending inventory negative. One customer requires a refund. This symptom stems from three distinct root causes, each demanding a completely different fix — addressing the wrong one will cause the defect to recur."
    },
    "ilgiliTerimler": [
      "race-condition",
      "idempotency",
      "deadlock"
    ],
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Race condition",
          "en": "Race condition"
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Idempotency yok",
          "en": "Missing idempotency"
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Stok senkronu",
          "en": "Inventory sync lag"
        }
      }
    ]
  },
  {
    "slug": "odeme-alindi-siparis-olusmadi",
    "no": "02",
    "baslik": {
      "tr": "Ödeme alındı, sipariş oluşmadı",
      "en": "Payment Charged but Order Not Created"
    },
    "diyagramBaslik": {
      "tr": "Ödeme var, sipariş yok",
      "en": "Payment without order"
    },
    "kirinti": {
      "tr": "Sipariş & Ödeme",
      "en": "Orders & Payments"
    },
    "aciliyet": {
      "seviye": "kritik",
      "etiket": {
        "tr": "Kritik · ticari kayıp",
        "en": "Critical · commercial loss"
      }
    },
    "ozet": {
      "tr": "Müşterinin kartından para çekildi ama sistemde sipariş yok. Müşteri arıyor, elinizde kayıt yok. Para bankada, sipariş ortada yok — ikisinin arasında kopmuş bir bildirim var.",
      "en": "Customer was charged successfully but no order appears in the system. The client contacts support with no reference on file. Funds are in the bank, order is missing — caused by a severed webhook callback between the two."
    },
    "ilgiliTerimler": [
      "webhook",
      "idempotency",
      "rate-limit"
    ],
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Bildirim ulaşmadı",
          "en": "Callback undelivered"
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "İşlenemedi",
          "en": "Callback unhandled (500)"
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Kaydedilmedi",
          "en": "Validation drop (Silent 200)"
        }
      }
    ]
  },
  {
    "slug": "odeme-iki-kez-alindi",
    "no": "03",
    "baslik": {
      "tr": "Ödeme iki kez alındı",
      "en": "Payment Charged Twice for Single Order"
    },
    "diyagramBaslik": {
      "tr": "Ödeme iki kez alındı",
      "en": "Duplicate payment charge"
    },
    "kirinti": {
      "tr": "Sipariş & Ödeme",
      "en": "Orders & Payments"
    },
    "aciliyet": {
      "seviye": "kritik",
      "etiket": {
        "tr": "Kritik · iade riski",
        "en": "Critical · chargeback risk"
      }
    },
    "ozet": {
      "tr": "Müşteriden aynı tutar iki kez tahsil edildi. İade yapmak zorundasınız ama önce hangi katmanda çiftlendiğini bulmalısınız — yanlış katmanı düzeltmek sorunu geri getirir.",
      "en": "The client was billed twice for the same cart. A refund is mandatory, but isolating which tier duplicated the transaction is critical — patching the wrong layer allows duplicates to persist."
    },
    "ilgiliTerimler": [
      "idempotency",
      "webhook",
      "race-condition"
    ],
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Çift gönderim",
          "en": "Client double submit"
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Bildirim tekrarı",
          "en": "Webhook redelivery"
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Yeniden deneme",
          "en": "Blind client retry"
        }
      }
    ]
  },
  {
    "slug": "islemler-kilitlendi-sayfa-donuyor",
    "no": "04",
    "baslik": {
      "tr": "İşlemler kilitlendi, sayfa dönüp duruyor",
      "en": "Transactions Deadlocked, Pages Spinning"
    },
    "diyagramBaslik": {
      "tr": "İşlemler kilitlendi",
      "en": "Transactions deadlocked"
    },
    "kirinti": {
      "tr": "Performans",
      "en": "Performance"
    },
    "aciliyet": {
      "seviye": "kritik",
      "etiket": {
        "tr": "Kritik · işlem durdu",
        "en": "Critical · transaction halt"
      }
    },
    "ozet": {
      "tr": "Belirli bir işlem — sipariş onayı, stok güncelleme, toplu güncelleme — sonsuza kadar dönüyor ve sonunda zaman aşımı veriyor. Sistem çökmedi; birbirini bekleyen iki işlem var.",
      "en": "Specific operations — checkout completion, stock updates, or batch imports — hang indefinitely until timeout. The server has not crashed; concurrent transactions are locked waiting for each other."
    },
    "ilgiliTerimler": [
      "deadlock",
      "race-condition",
      "n-plus-1-sorgu"
    ],
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Ters sıralı kilit",
          "en": "Cross-ordered row locks"
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Uzun işlem",
          "en": "Long-running transaction"
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Toplu güncelleme",
          "en": "Broad table lock (Batch)"
        }
      }
    ]
  },
  {
    "slug": "guncelleme-sonrasi-veri-kayboldu",
    "no": "05",
    "baslik": {
      "tr": "Güncellemeden sonra veri kayboldu sanılıyor",
      "en": "Data Assumed Lost After System Update"
    },
    "diyagramBaslik": {
      "tr": "Veri kayboldu sanısı",
      "en": "Perceived data loss"
    },
    "kirinti": {
      "tr": "Veri & Devir",
      "en": "Data & Migration"
    },
    "aciliyet": {
      "seviye": "kritik",
      "etiket": {
        "tr": "Kritik · veri paniği",
        "en": "Critical · data panic"
      }
    },
    "ozet": {
      "tr": "Bir güncellemeden sonra kayıtlar görünmüyor ve panik \"veriler silindi\" diye başlıyor. Çoğu vakada veri yerindedir; onu okuyan sorgu değişmiştir. Ama bu doğrulanmadan yapılan her müdahale gerçek kaybı yaratabilir.",
      "en": "Records vanish after a release, triggering data deletion panic. In most incidents, data remains intact; the query reading it mutated. Attempting hasty fixes without proper diagnosis risks causing genuine data loss."
    },
    "ilgiliTerimler": [
      "migration",
      "staging-ortami",
      "teknik-borc"
    ],
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Filtre değişti",
          "en": "Default query filter changed"
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Göç yarıda kaldı",
          "en": "Interrupted schema migration"
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Gerçek silme",
          "en": "Genuine bulk deletion"
        }
      }
    ]
  },
  {
    "slug": "deploy-sonrasi-site-bozuldu",
    "no": "06",
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
    "ilgiliTerimler": [
      "ci-cd",
      "staging-ortami",
      "migration"
    ],
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Eksik dosya",
          "en": "Missing build asset / vendor"
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Önbellek eskisi",
          "en": "Stale client / CDN cache"
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Şema uyuşmazlığı",
          "en": "Database schema desync"
        }
      }
    ]
  },
  {
    "slug": "site-500-veriyor-dun-calisiyordu",
    "no": "07",
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
    "ilgiliTerimler": [
      "ci-cd",
      "staging-ortami",
      "memory-leak"
    ],
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Kimlik süresi doldu",
          "en": "Expired credentials"
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Disk veya bellek doldu",
          "en": "Disk / memory exhausted"
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Otomatik güncelleme",
          "en": "Unattended OS update"
        }
      }
    ]
  },
  {
    "slug": "bulut-hesabi-askiya-alindi",
    "no": "08",
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
    "ilgiliTerimler": [
      "staging-ortami",
      "ci-cd"
    ],
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Ödeme başarısız, hesap askıda",
          "en": "Billing failure / suspended"
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Kaynak kotası doldu",
          "en": "Quota / resource limit"
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Kötüye kullanım bildirimi",
          "en": "Abuse notice / security lock"
        }
      }
    ]
  },
  {
    "slug": "yedek-var-sanildi-yedek-yok",
    "no": "09",
    "baslik": {
      "tr": "Yedek var sanılıyordu, yedek yok",
      "en": "Backup Assumed to Exist, No Valid Backup"
    },
    "diyagramBaslik": {
      "tr": "Yedek yok",
      "en": "No valid backup"
    },
    "kirinti": {
      "tr": "Devir & Süreklilik",
      "en": "Handover & Continuity"
    },
    "aciliyet": {
      "seviye": "kritik",
      "etiket": {
        "tr": "Kritik · veri riski",
        "en": "Critical · data loss risk"
      }
    },
    "ozet": {
      "tr": "Bir sorun çıktı, yedeğe dönülmek istendi ve yedeğin ya hiç alınmadığı ya da geri yüklenemediği görüldü. Yedeğin var olması ile geri yüklenebilir olması aynı şey değildir; ikincisi denenmeden bilinmez.",
      "en": "An outage occurred, a rollback to backup was requested, only to discover snapshots were never generated or are un-restorable. A backup file existing versus being restorable are entirely different; the latter is unknown until tested."
    },
    "ilgiliTerimler": [
      "migration",
      "staging-ortami",
      "teknik-borc"
    ],
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Yedek alınmıyor",
          "en": "Backups not running"
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Yedek eksik alınıyor",
          "en": "Partial / incomplete dump"
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Geri yüklenemiyor",
          "en": "Un-restorable / corrupted"
        }
      }
    ]
  },
  {
    "slug": "ssl-suresi-doldu",
    "no": "10",
    "baslik": {
      "tr": "SSL süresi doldu, tarayıcı uyarı veriyor",
      "en": "SSL Certificate Expired, Security Warning Displayed"
    },
    "diyagramBaslik": {
      "tr": "SSL süresi doldu",
      "en": "SSL certificate expired"
    },
    "kirinti": {
      "tr": "Altyapı & Erişim",
      "en": "Infrastructure & Access"
    },
    "aciliyet": {
      "seviye": "kritik",
      "etiket": {
        "tr": "Kritik · güven kaybı",
        "en": "Critical · trust loss"
      }
    },
    "ozet": {
      "tr": "Ziyaretçiler siteye girerken 'bağlantınız gizli değil' uyarısı alıyor. Site aslında çalışıyor, araya giren tarayıcı. Müşteriniz bunu güvenlik ihlali sanır; teknik olarak çoğu zaman basit bir yenileme sorunudur.",
      "en": "Users are blocked by 'Your connection is not private' browser interstitials. The application is running fine, but the TLS handshake fails. Clients perceive a breach; technically it is usually a stalled renewal script."
    },
    "ilgiliTerimler": [
      "ci-cd",
      "staging-ortami"
    ],
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Yenileme durdu",
          "en": "Auto-renewal stopped"
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Kapsam eksik",
          "en": "Missing SAN / subdomains"
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Zincir eksik",
          "en": "Incomplete CA chain"
        }
      }
    ]
  },
  {
    "slug": "site-yavasladi-sunucu-bos",
    "no": "11",
    "baslik": {
      "tr": "Site yavaşladı ama sunucu boş",
      "en": "Site Stalled Despite Idle Server Resources"
    },
    "diyagramBaslik": {
      "tr": "Yavaş ama sunucu boş",
      "en": "Slow with idle server"
    },
    "kirinti": {
      "tr": "Performans",
      "en": "Performance"
    },
    "aciliyet": {
      "seviye": "yuksek",
      "etiket": {
        "tr": "Yüksek · dönüşüm kaybı",
        "en": "High · conversion loss"
      }
    },
    "ozet": {
      "tr": "Sayfalar geç açılıyor ama sunucu kaynakları rahat görünüyor. 'Sunucu yetersiz' denip plan yükseltilir, hiçbir şey değişmez. Boş bir sunucuda yavaşlık kaynak sorunu değil, bekleme sorunudur.",
      "en": "Page latency surges while server CPU and RAM remain idle. Upgrading infrastructure tiers changes nothing. Sluggish performance on idle servers is a blocking I/O bottleneck, not a compute limitation."
    },
    "ilgiliTerimler": [
      "n-plus-1-sorgu",
      "teknik-borc",
      "rate-limit"
    ],
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Sorgu çoğalması",
          "en": "N+1 query explosion"
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Dizin eksik",
          "en": "Missing database index"
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Harici bekleme",
          "en": "Synchronous third-party I/O"
        }
      }
    ]
  },
  {
    "slug": "entegrasyon-429-veriyor",
    "no": "12",
    "baslik": {
      "tr": "Entegrasyon aniden 429 vermeye başladı",
      "en": "Third-Party Integration Returning HTTP 429"
    },
    "diyagramBaslik": {
      "tr": "Entegrasyon 429 veriyor",
      "en": "Integration 429 rate limit"
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
      "tr": "Aylardır çalışan bir entegrasyon — kargo, pazaryeri, ödeme ya da e-posta — birden hata vermeye başladı ve kod değişmedi. Karşı taraf artık isteklerinizi reddediyor; sorun sizde değil, sizin hızınızda olabilir.",
      "en": "An integration running smoothly for months — carrier, marketplace, payment gateway, or transactional email — abruptly fails with HTTP 429. The remote host is throttling your traffic due to volumetric burst limits."
    },
    "ilgiliTerimler": [
      "rate-limit",
      "webhook",
      "idempotency"
    ],
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Hacim büyüdü",
          "en": "Natural volume growth"
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Döngüsel tekrar",
          "en": "Retry storm (No backoff)"
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Limit değişti",
          "en": "Provider quota downgrade"
        }
      }
    ]
  },
  {
    "slug": "sunucu-her-gun-yeniden-baslatiliyor",
    "no": "13",
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
    "ilgiliTerimler": [
      "memory-leak",
      "teknik-borc",
      "ci-cd"
    ],
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Bellek sızıntısı",
          "en": "Application memory leak"
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Büyük veri yükü",
          "en": "Unbuffered export spike"
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Kaynak yetersiz",
          "en": "Genuine capacity ceiling"
        }
      }
    ]
  },
  {
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
    "ilgiliTerimler": [
      "staging-ortami",
      "ci-cd",
      "migration"
    ],
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Yapılandırma farkı",
          "en": "Configuration drift"
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Sürüm farkı",
          "en": "Dependency / runtime mismatch"
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "İzin / yol farkı",
          "en": "Permissions / path discrepancy"
        }
      }
    ]
  },
  {
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
    "ilgiliTerimler": [
      "teknik-borc",
      "refactor",
      "ci-cd"
    ],
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Kopyalanmış mantık",
          "en": "Duplicated business logic"
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Test yok",
          "en": "Missing regression test suite"
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Aşırı bağlılık",
          "en": "High module coupling"
        }
      }
    ]
  },
  {
    "slug": "yazilimci-gitti-koda-girilemiyor",
    "no": "16",
    "baslik": {
      "tr": "Yazılımcı gitti, kimse koda giremiyor",
      "en": "Developer Departed, Codebase Inaccessible"
    },
    "diyagramBaslik": {
      "tr": "Koda kimse giremiyor",
      "en": "Codebase inaccessible"
    },
    "kirinti": {
      "tr": "Devir & Süreklilik",
      "en": "Handover & Continuity"
    },
    "aciliyet": {
      "seviye": "yuksek",
      "etiket": {
        "tr": "Yüksek · süreklilik riski",
        "en": "High · continuity risk"
      }
    },
    "ozet": {
      "tr": "Projeyi yapan kişi ayrıldı. Site çalışmaya devam ediyor ama değişiklik yapılamıyor: kodun nerede olduğu, sunucuya kimin girebildiği ya da hesapların kime kayıtlı olduğu belirsiz. Bu üç ayrı problemdir ve hangisiyle karşı karşıya olduğunuz ilk saatte belirlenebilir.",
      "en": "The developer who built the platform departed. The site continues running but cannot be modified: repository location, server SSH credentials, or account ownership remain unknown. These are three distinct bottlenecks, identifiable within hour one."
    },
    "ilgiliTerimler": [
      "teknik-borc",
      "staging-ortami",
      "migration"
    ],
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Erişim kaybı",
          "en": "Loss of access"
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Kaynak kod kayıp",
          "en": "Missing source repository"
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Ortam belgesiz",
          "en": "Undocumented environment"
        }
      }
    ]
  },
  {
    "slug": "domain-hosting-erisimi-yok",
    "no": "17",
    "baslik": {
      "tr": "Domain ve hosting erişimi kimsede yok",
      "en": "Zero Access to Domain Registrar and Hosting"
    },
    "diyagramBaslik": {
      "tr": "Erişim kimsede yok",
      "en": "No root hosting access"
    },
    "kirinti": {
      "tr": "Devir & Süreklilik",
      "en": "Handover & Continuity"
    },
    "aciliyet": {
      "seviye": "yuksek",
      "etiket": {
        "tr": "Yüksek · mülkiyet riski",
        "en": "High · ownership risk"
      }
    },
    "ozet": {
      "tr": "Site çalışıyor ama kimse yönetim paneline giremiyor. Alan adının kime kayıtlı olduğu, hosting faturasının kime gittiği belirsiz. Bu bir yazılım sorunu değil, mülkiyet sorunudur — ve teknik ekip tek başına çözemez.",
      "en": "The website is online but no stakeholder has root panel access. Domain registrant identity and hosting billing recipients are unknown. This is an ownership dispute, not software, requiring administrative escalation."
    },
    "ilgiliTerimler": [
      "staging-ortami",
      "ci-cd",
      "teknik-borc"
    ],
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Ayrılan kişide",
          "en": "Former employee holds auth"
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Aracı firmada",
          "en": "Held by third-party agency"
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Ulaşılamıyor",
          "en": "Unreachable registrant"
        }
      }
    ]
  },
  {
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
    "ilgiliTerimler": [
      "webhook",
      "rate-limit",
      "idempotency"
    ],
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "SMTP kimliği",
          "en": "SMTP auth failure"
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "SPF / DKIM eksik",
          "en": "Missing SPF / DKIM"
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Form arkada hatalı",
          "en": "False positive frontend"
        }
      }
    ]
  },
  {
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
    "ilgiliTerimler": [
      "staging-ortami",
      "ci-cd",
      "migration"
    ],
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "noindex kalmış",
          "en": "Staging noindex leaked"
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "robots.txt kapalı",
          "en": "robots.txt blocked"
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Adresler değişti",
          "en": "Broken 301 migrations"
        }
      }
    ]
  },
  {
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
    "ilgiliTerimler": [
      "refactor",
      "teknik-borc",
      "ci-cd"
    ],
    "nedenler": [
      {
        "harf": "A",
        "ad": {
          "tr": "Belgesizlik",
          "en": "Zero developer documentation"
        }
      },
      {
        "harf": "B",
        "ad": {
          "tr": "Elle yayın",
          "en": "Manual deployment ceremony"
        }
      },
      {
        "harf": "C",
        "ad": {
          "tr": "Karışık yapı",
          "en": "Unstructured spaghetti architecture"
        }
      }
    ]
  }
];
