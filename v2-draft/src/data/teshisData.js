export const teshisData = [
  {
    slug: 'ayni-stok-iki-musteriye-satildi',
    no: '01',
    baslik: {
      tr: 'Aynı stok iki müşteriye satıldı',
      en: 'Same Inventory Sold to Multiple Customers'
    },
    kirinti: {
      tr: 'Sipariş & Ödeme',
      en: 'Orders & Payments'
    },
    aciliyet: {
      seviye: 'kritik',
      etiket: {
        tr: 'Kritik · ticari kayıp',
        en: 'Critical · revenue loss'
      }
    },
    ozet: {
      tr: 'Son kalan ürün iki ayrı siparişte çıktı, stok eksiye düştü. Birine iade yapmak zorundasınız. Bu belirtinin üç farklı nedeni var ve üçünün çözümü birbirinden tamamen ayrı — yanlış olanı düzeltmek sorunu geri getirir.',
      en: 'The last item in stock was checked out across two different orders, sending inventory negative. One customer requires a refund. This symptom stems from three distinct root causes, each demanding a completely different fix — addressing the wrong one will cause the defect to recur.'
    },
    logSatirlari: [
      'SQLSTATE[40001]: Serialization failure: 1213 Deadlock found',
      "Duplicate entry '...' for key 'orders_reference_unique'",
      'UPDATE products SET stock = stock - 1  ← kontrol ve yazma ayrı'
    ],
    logNotu: {
      tr: 'Bu satırlardan hangisinin göründüğü, hangi nedenle karşı karşıya olduğunuzu daha ilk bakışta daraltır.',
      en: 'Which of these lines appears in your error logs narrows down the exact root cause at first glance.'
    },
    nedenler: [
      {
        harf: 'A',
        ad: {
          tr: 'Race condition',
          en: 'Race condition'
        },
        aciklama: {
          tr: 'Aynı anda gelen iki istek stoğu eşzamanlı düşürdü. Kontrol ile yazma arasında boşluk var.',
          en: 'Two simultaneous requests decremented stock concurrently. There is an unisolated gap between check and write.'
        },
        kanit: {
          tr: 'created_at farkı < 1sn → A',
          en: 'created_at diff < 1s → A'
        },
        diyagramAd: {
          tr: 'Race condition',
          en: 'Race condition'
        },
        diyagramTest: {
          tr: ['İki siparişin', 'created_at', 'farkı < 1 sn mi?'],
          en: ['Are order', 'created_at diffs', '< 1 second?']
        },
        diyagramCozum: {
          tr: ['Atomik UPDATE +', 'etkilenen satır', 'kontrolü'],
          en: ['Atomic UPDATE +', 'affected rows', 'validation']
        }
      },
      {
        harf: 'B',
        ad: {
          tr: 'Idempotency yok',
          en: 'Missing idempotency'
        },
        aciklama: {
          tr: 'Tek bir ödeme iki kez işlendi; müşteri iki kez tıkladı ya da webhook tekrar geldi. Eşzamanlılık yok, tekrar var.',
          en: 'A single payment was processed twice; either the customer double-clicked or a webhook redelivered. No concurrency, just duplication.'
        },
        kanit: {
          tr: 'payment_reference aynı → B',
          en: 'payment_reference same → B'
        },
        diyagramAd: {
          tr: 'Idempotency yok',
          en: 'No idempotency'
        },
        diyagramTest: {
          tr: ['payment_reference', 'değerleri', 'aynı mı?'],
          en: ['Are payment', 'reference IDs', 'identical?']
        },
        diyagramCozum: {
          tr: ['unique index +', 'idempotency', 'anahtarı'],
          en: ['unique index +', 'idempotency key', 'lock']
        }
      },
      {
        harf: 'C',
        ad: {
          tr: 'Stok senkronu',
          en: 'Inventory sync lag'
        },
        aciklama: {
          tr: 'Stoğun kaynağı ERP veya pazaryeri. Yarış sitede değil, iki sistem arasındaki gecikmede.',
          en: 'Inventory master resides in an ERP or marketplace. The race is not on-site, but within sync lag intervals.'
        },
        kanit: {
          tr: 'Senkron satıştan eski → C',
          en: 'Sync older than sale → C'
        },
        diyagramAd: {
          tr: 'Stok senkronu',
          en: 'Inventory sync'
        },
        diyagramTest: {
          tr: ['Son ERP senkronu', 'satıştan', 'önce mi?'],
          en: ['Was last ERP', 'sync before', 'order timestamp?']
        },
        diyagramCozum: {
          tr: ['Rezervasyon', 'mantığı + senkron', 'sıklığı'],
          en: ['Reservation lock', '+ higher sync', 'frequency']
        }
      }
    ],
    kimCozer: {
      tr: 'Kıdemli backend mühendisi · 2–4 saat. Doğru neden belirlendikten sonra üçü de kalıcı olarak kapanır. Teşhis olmadan yapılan düzeltme belirtiyi bastırır, kaynağı bırakır.',
      en: 'Senior backend engineer · 2–4 hours. Once the exact cause is isolated, all three are permanently resolved. Fixes applied without proper diagnosis merely mask symptoms while leaving the root cause intact.'
    },
    cozulmezse: {
      tr: 'Her çift satış bir iade, bir kargo maliyeti ve bir olumsuz yorum riski. Kampanya günlerinde eşzamanlı trafik arttığı için sıklık katlanarak büyür.',
      en: 'Every oversold item triggers refund overhead, double logistics costs, and negative client feedback. Under high-traffic sales campaigns, frequency compounds exponentially.'
    },
    ilgiliTerimler: ['race-condition', 'idempotency', 'deadlock'],
    ilgiliHizmet: {
      baslik: {
        tr: 'Acil Kriz Müdahalesi & Crash Test',
        en: 'Emergency Incident Triage & Crash Test'
      },
      link: '/crash-test/'
    }
  },
  {
    slug: 'bulut-hesabi-askiya-alindi',
    no: '15',
    baslik: {
      tr: 'Bulut hesabı askıya alındı, site kapandı',
      en: 'Cloud Account Suspended, Site Down'
    },
    kirinti: {
      tr: 'Altyapı & Erişim',
      en: 'Infrastructure & Access'
    },
    aciliyet: {
      seviye: 'kritik',
      etiket: {
        tr: 'Kritik · site kapalı',
        en: 'Critical · outage'
      }
    },
    ozet: {
      tr: 'Site aniden tamamen erişilemez oldu. Kod değişmedi, deploy yapılmadı, kimse bir şeye dokunmadı. Bu tablonun nedeni çoğu zaman kodda değildir — ve doğru yere bakmadan geçen her saat veri kaybı riskini büyütür.',
      en: 'The application became completely unreachable out of nowhere. No code changes, no deployments, no manual changes. The root cause is almost never within code — and every hour spent looking in the wrong place increases catastrophic data loss risk.'
    },
    logSatirlari: [
      '403 Forbidden  /  sağlayıcının bakım veya askı sayfası',
      'E-posta kutusu: "Payment failed" · "Final notice" · "Account suspended"',
      'DNS çözülüyor ama: Connection refused / 502 Bad Gateway'
    ],
    logNotu: {
      tr: 'İlk bakılacak yer sunucu değil, hesabın kayıtlı olduğu e-posta kutusudur. Sağlayıcılar askıya almadan önce genellikle birden fazla uyarı gönderir.',
      en: 'The first place to inspect is not server logs, but the root billing email inbox. Cloud providers virtually always dispatch multiple pre-suspension notices.'
    },
    nedenler: [
      {
        harf: 'A',
        ad: {
          tr: 'Ödeme başarısız, hesap askıda',
          en: 'Billing failure / suspended'
        },
        aciklama: {
          tr: 'Kartın süresi doldu ya da tahsilat başarısız oldu. Sağlayıcı uyarıları gönderdi, kimse okumadı. Teknik bir arıza yok.',
          en: 'Card expired or bank transaction declined. Provider dispatched warnings that went unread. Zero technical defect.'
        },
        kanit: {
          tr: 'Kutuda "suspended" maili var → A',
          en: 'Suspension email in inbox → A'
        },
        diyagramAd: {
          tr: 'Ödeme / askı',
          en: 'Billing / suspended'
        },
        diyagramTest: {
          tr: ['Fatura adresine', "'suspended' maili", 'gelmiş mi?'],
          en: ['Was a suspended', 'email sent to', 'billing address?']
        },
        diyagramCozum: {
          tr: ['Ödeme + hesap', 'sahibi · saatler', 'içinde açılır'],
          en: ['Payment update +', 'account holder ·', 'fixed in hours']
        }
      },
      {
        harf: 'B',
        ad: {
          tr: 'Kaynak kotası doldu',
          en: 'Quota / resource limit'
        },
        aciklama: {
          tr: 'Bant genişliği, disk veya CPU limiti aşıldı. Hesap askıda değil, kota kilidinde. Ödeme sorunu değildir.',
          en: 'Bandwidth, disk volume, or CPU throttle limits reached. Account is not delinquent, but throttled by quotas.'
        },
        kanit: {
          tr: 'Panelde kullanım %100 → B',
          en: 'Dashboard usage 100% → B'
        },
        diyagramAd: {
          tr: 'Kota kilidi',
          en: 'Quota lock'
        },
        diyagramTest: {
          tr: ['Panelde disk /', 'bant genişliği', '%100 mü?'],
          en: ['Is disk or', 'bandwidth usage', 'at 100% cap?']
        },
        diyagramCozum: {
          tr: ['Plan yükseltme', 'veya kaynak', 'optimizasyonu'],
          en: ['Plan tier upgrade', 'or resource', 'optimization']
        }
      },
      {
        harf: 'C',
        ad: {
          tr: 'Kötüye kullanım bildirimi',
          en: 'Abuse notice / security lock'
        },
        aciklama: {
          tr: 'Site ele geçirilmiş, spam veya zararlı içerik dağıtıyor olabilir. Sağlayıcı güvenlik gerekçesiyle kapatmıştır.',
          en: 'Application was compromised, sending spam or malicious outbound traffic. Provider hard-locked access for policy violations.'
        },
        kanit: {
          tr: 'abuse bildirimi var → C',
          en: 'Abuse report in inbox → C'
        },
        diyagramAd: {
          tr: 'Abuse kapatması',
          en: 'Abuse lock'
        },
        diyagramTest: {
          tr: ['abuse@ adresine', 'bildirim', 'gelmiş mi?'],
          en: ['Was notice sent', 'to abuse / root', 'mailbox?']
        },
        diyagramCozum: {
          tr: ['ÖNCE güvenlik', 'temizliği, SONRA', 'askı kaldırma'],
          en: ['Security sanitize', 'FIRST, then', 'request unlock']
        }
      }
    ],
    kimCozer: {
      tr: 'A ise hesap sahibi ve muhasebe — kod işi değildir, saatler içinde açılır. B ise sistem yöneticisi. C ise güvenlik müdahalesi gerekir ve sıra bağlayıcıdır: temizlik yapılmadan askı kaldırılırsa hesap tekrar kapatılır.',
      en: 'For A: Account owner and accounting — zero coding required, restored in hours. For B: DevOps / Sysadmin. For C: Forensic security SWAT is required with strict sequencing: requesting unban prior to full cleanup triggers instant re-suspension.'
    },
    cozulmezse: {
      tr: 'Sağlayıcılar askıya alınan hesapların verisini belirli bir süre saklar, sonra kalıcı olarak siler. Bu pencerenin uzunluğu sağlayıcıya göre değişir ve kaçırılırsa yedek yoksa geri dönüş yoktur.',
      en: 'Cloud providers retain suspended account storage only for a specific grace window before permanent, unrecoverable disk sanitization. If no external backup exists, recovery is impossible.'
    },
    ilgiliTerimler: ['staging-ortami', 'ci-cd'],
    ilgiliHizmet: {
      baslik: {
        tr: 'Kesinti Maliyeti Hesabı',
        en: 'Downtime Cost Calculator'
      },
      link: '/kesinti-maliyeti/'
    }
  },
  {
    slug: 'yazilimci-gitti-koda-girilemiyor',
    no: '14',
    baslik: {
      tr: 'Yazılımcı gitti, kimse koda giremiyor',
      en: 'Developer Departed, Codebase Inaccessible'
    },
    kirinti: {
      tr: 'Devir & Süreklilik',
      en: 'Handover & Continuity'
    },
    aciliyet: {
      seviye: 'yuksek',
      etiket: {
        tr: 'Yüksek · süreklilik riski',
        en: 'High · continuity risk'
      }
    },
    ozet: {
      tr: 'Projeyi yapan kişi ayrıldı. Site çalışmaya devam ediyor ama değişiklik yapılamıyor: kodun nerede olduğu, sunucuya kimin girebildiği ya da hesapların kime kayıtlı olduğu belirsiz. Bu üç ayrı problemdir ve hangisiyle karşı karşıya olduğunuz ilk saatte belirlenebilir.',
      en: 'The developer who built the platform departed. The site continues running but cannot be modified: repository location, server SSH credentials, or account ownership remain unknown. These are three distinct bottlenecks, identifiable within hour one.'
    },
    logSatirlari: [
      'git log -1 --format=%cd            ← son commit ne zaman?',
      "git log --format='%an' | sort -u   ← koda kaç kişi dokunmuş?",
      '~/.ssh/authorized_keys             ← sunucuya kimin anahtarı var?',
      'WHOIS + hosting hesabı             ← hangi e-postaya kayıtlı?'
    ],
    logNotu: {
      tr: 'Bu dört satır, devrin teknik mi yoksa idari bir problem mi olduğunu ayırır. Çoğu vakada sorun kodda değil, hesap sahipliğindedir.',
      en: 'These four checkpoints determine whether handover failure is technical or administrative. In most cases, the bottleneck is account ownership rather than code.'
    },
    nedenler: [
      {
        harf: 'A',
        ad: {
          tr: 'Erişim kaybı',
          en: 'Loss of access'
        },
        aciklama: {
          tr: 'Domain, hosting ve depo kişinin şahsi e-postasına kayıtlı. Kod sağlam, altyapı çalışıyor; devredilmesi gereken şey hesaplar.',
          en: 'Domain registrar, host, and git repos are registered to personal emails. Code and infrastructure are sound; the bottleneck is credential handover.'
        },
        kanit: {
          tr: 'Hesaplar şahsi adreste → A',
          en: 'Accounts on personal mail → A'
        },
        diyagramAd: {
          tr: 'Erişim kaybı',
          en: 'Access loss'
        },
        diyagramTest: {
          tr: ['Hesaplar şirket', 'adresine mi', 'kayıtlı?'],
          en: ['Are accounts', 'tied to company', 'domain email?']
        },
        diyagramCozum: {
          tr: ['Hesap devri —', 'idari süreç,', 'kod işi değil'],
          en: ['Account transfer —', 'admin workflow,', 'no coding needed']
        }
      },
      {
        harf: 'B',
        ad: {
          tr: 'Kaynak kod kayıp',
          en: 'Missing source repository'
        },
        aciklama: {
          tr: 'Sürüm kontrolü hiç kurulmamış. Canlı sunucudaki dosyalar tek kopya. En kırılgan hâl budur.',
          en: 'Version control was never initialized. Live production server contains the sole surviving copy. The highest-risk state.'
        },
        kanit: {
          tr: 'Depo yok → B',
          en: 'No remote repo → B'
        },
        diyagramAd: {
          tr: 'Kod kayıp',
          en: 'Source lost'
        },
        diyagramTest: {
          tr: ['Sürüm kontrolü', '(git) var mı?'],
          en: ['Is version control', '(git remote)', 'present?']
        },
        diyagramCozum: {
          tr: ['ÖNCE canlıdan', 'tam yedek,', 'SONRA depo'],
          en: ['Full live image', 'FIRST, then git', 'init setup']
        }
      },
      {
        harf: 'C',
        ad: {
          tr: 'Ortam belgesiz',
          en: 'Undocumented environment'
        },
        aciklama: {
          tr: 'Kod var ama çalıştırılamıyor: kurulum adımları, ortam değişkenleri ve bağımlılık sürümleri yazılı değil.',
          en: 'Repository exists but cannot be booted: setup commands, environment variables, and lockfiles are absent.'
        },
        kanit: {
          tr: '.env.example / lock yok → C',
          en: 'Missing .env / lockfile → C'
        },
        diyagramAd: {
          tr: 'Ortam belgesiz',
          en: 'No docs / env'
        },
        diyagramTest: {
          tr: ['README ve', 'bağımlılık kilidi', 'var mı?'],
          en: ['Are README and', 'package lockfiles', 'available?']
        },
        diyagramCozum: {
          tr: ['Ortam yeniden', 'inşası +', 'belgeleme'],
          en: ['Environment', 'rebuild +', 'documentation']
        }
      }
    ],
    kimCozer: {
      tr: "A idari bir süreçtir, geliştirici gerekmez. B'de ilk iş kod yazmak değil, canlı sunucudan tam yedek almaktır — bu adım atlanırsa tek kopya risk altında kalır. C, devir teşhisinin ölçtüğü şeydir.",
      en: 'A is an administrative process, requiring zero coding. For B, the absolute first step is pulling a full live server image, not writing code. C is precisely what a handover code audit diagnoses.'
    },
    cozulmezse: {
      tr: 'Sürüm kontrolü olmayan bir projede canlı sunucu tek kopyadır. Sunucu çökerse veya hesap kapanırsa geri dönüş yoktur. Risk her gün büyür, çünkü kimse yedeğin gerçekten alındığını doğrulamamıştır.',
      en: 'Without version control, production is a single point of total failure. If the instance crashes, recovery is impossible. Risk compounds daily until full image verification is completed.'
    },
    ilgiliTerimler: ['teknik-borc', 'staging-ortami', 'migration'],
    ilgiliHizmet: {
      baslik: {
        tr: 'Devir Hazırlık Kontrolü',
        en: 'Handover Readiness Audit'
      },
      link: '/devir-kontrolu/'
    }
  }
];
