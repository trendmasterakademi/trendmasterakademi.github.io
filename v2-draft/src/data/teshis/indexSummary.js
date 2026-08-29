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
    "slug": "site-yavasladi-sunucu-bos",
    "no": "04",
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
    "slug": "islemler-kilitlendi-sayfa-donuyor",
    "no": "05",
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
    "slug": "entegrasyon-429-veriyor",
    "no": "06",
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
    "slug": "site-500-veriyor-dun-calisiyordu",
    "no": "13",
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
    "slug": "yazilimci-gitti-koda-girilemiyor",
    "no": "14",
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
    "no": "16",
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
    "slug": "ssl-suresi-doldu",
    "no": "18",
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
    "slug": "form-gonderiliyor-mail-gelmiyor",
    "no": "19",
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
    "no": "20",
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
  }
];
