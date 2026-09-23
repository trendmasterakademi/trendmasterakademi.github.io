export const diagnosticLogEnMap = {
  // ayni-stok-iki-musteriye-satildi
  "UPDATE products SET stock = stock - 1  ← kontrol ve yazma ayrı": "UPDATE products SET stock = stock - 1  <- check and write separated",
  
  // odeme-alindi-siparis-olusmadi
  "Webhook adresi: 404 / 500 / zaman aşımı": "Webhook endpoint: 404 / 500 / timeout",
  "Ödeme sağlayıcı paneli: callback failed · retry 3/3": "Payment gateway panel: callback failed · retry 3/3",
  "Uygulama log'unda ödeme referansı hiç geçmiyor": "App logs contain no trace of payment reference",
  "HTTP 302 — bildirim yönlendirmeyi takip etmiyor": "HTTP 302 - notification fails to follow redirect",

  // odeme-iki-kez-alindi
  "Aynı ödeme referansıyla iki başarılı işlem": "Two successful charges with identical payment reference",
  "Bildirim log'u: aynı olay kimliği iki kez işlenmiş": "Webhook logs: identical event ID processed twice",
  "Uygulama log'u: iki gönderim, aynı saniye, aynı oturum": "App logs: two submissions, same second, same session",
  "Sağlayıcı panelinde 'duplicate transaction' uyarısı yok": "Payment gateway dashboard shows no duplicate transaction alert",

  // islemler-kilitlendi-sayfa-donuyor
  "Veritabanında uzun süredir açık işlem (idle in transaction)": "Database holds long-running idle in transaction locks",
  "Uygulama log'u: aynı saniyede iki toplu güncelleme": "App logs: two concurrent batch updates in same second",

  // guncelleme-sonrasi-veri-kayboldu
  "Göç log'u: rolled back veya yarıda kesilmiş": "Migration logs: rolled back or interrupted mid-execution",
  "Kayıt sayısı: tablodaki satır sayısı hâlâ eski değerde mi?": "Row count: does table row count still match previous value?",
  "Durum veya silme alanı toplu güncellenmiş mi?": "Were status or soft-delete flags updated in bulk?",

  // deploy-sonrasi-site-bozuldu
  "Yayın kaydı: hangi sürüm, ne zaman, kim tarafından?": "Deployment log: which version, timestamp, deployed by whom?",
  "Yeni hata mesajları yayın saatinde mi başlıyor?": "Do new error signatures correlate with deploy timestamp?",
  "Statik dosyalar eski sürümde kalmış (önbellek)": "Static assets served from stale cache version",
  "Veritabanı göçü yayınla birlikte çalıştı mı?": "Did database migrations execute alongside deploy?",

  // site-500-veriyor-dun-calisiyordu
  "PHP Fatal error / Uncaught Error        ← uygulama log'u": "PHP Fatal error / Uncaught Error        <- application logs",

  // bulut-hesabi-askiya-alindi
  "403 Forbidden  /  sağlayıcının bakım veya askı sayfası": "403 Forbidden / provider maintenance or suspension page",
  "E-posta kutusu: 'Payment failed' · 'Final notice' · 'Account suspended'": "Inbox: 'Payment failed' · 'Final notice' · 'Account suspended'",
  "DNS çözülüyor ama: Connection refused / 502 Bad Gateway": "DNS resolves but: Connection refused / 502 Bad Gateway",

  // yedek-var-sanildi-yedek-yok
  "Yedek klasöründeki son dosyanın tarihi   ← aylar öncesi mi?": "Last backup file timestamp in directory <- months outdated?",
  "Yedek dosya boyutu 0 byte / birkaç KB": "Backup archive size 0 bytes / empty archive",
  "Depolama sağlayıcısı: quota exceeded": "Storage provider: quota exceeded",

  // ssl-suresi-doldu
  "NET::ERR_CERT_DATE_INVALID              ← süre doldu": "NET::ERR_CERT_DATE_INVALID              <- certificate expired",
  "NET::ERR_CERT_COMMON_NAME_INVALID       ← alan adı eşleşmiyor": "NET::ERR_CERT_COMMON_NAME_INVALID       <- hostname mismatch",

  // site-yavasladi-sunucu-bos
  "Sayfa başına veritabanı sorgu sayısı: yüzlerce": "Database queries per page load: hundreds of queries",
  "Yavaş sorgu log'u: aynı sorgu defalarca tekrarlıyor": "Slow query log: identical query repeated dozens of times",
  "Harici servis çağrısı: 2–8 saniye bekleme": "External 3rd-party API call: 2-8s blocking latency",
  "İlk bayt süresi yüksek, indirme hızlı": "Time to First Byte (TTFB) high, download payload fast",

  // entegrasyon-429-veriyor
  "Sağlayıcı paneli: quota exceeded for this period": "Provider dashboard: quota exceeded for this period",

  // sunucu-her-gun-yeniden-baslatiliyor
  "Bellek kullanımı zamanla artıyor, hiç düşmüyor": "Memory consumption climbs steadily without dropping",
  "Süreç yöneticisi: yeniden başlatma sayısı her gün artıyor": "Process manager (PM2): daily restart count increasing",
  "Yanıt süreleri gün içinde giderek uzuyor": "Response latencies degrade progressively during peak hours",

  // testte-calisiyor-canlida-calismiyor
  "Yalnız canlıda 500, testte 200": "Fails with 500 only on production, passes 200 on staging",
  "Kütüphane sürümleri: kilit dosyası var mı, uyuşuyor mu?": "Dependency versions: lockfile present and synchronized?",
  "Permission denied — dosya izni veya yol hatası": "Permission denied - file permissions or path mismatch",

  // her-yeni-ozellik-oncekini-bozuyor
  "Aynı hata kaydının aylar içinde tekrar açılması": "Regression: identical bug ticket reopened across sprints",
  "Test yok, ya da var ama çalıştırılmıyor": "No automated test coverage, or tests skipped in CI",
  "Tek bir dosyanın binlerce satır olması": "God class anti-pattern: single source file spans thousands of lines",
  "Aynı mantığın üç ayrı yerde kopyalanmış olması": "Duplicate logic copy-pasted across multiple modules",

  // yazilimci-gitti-koda-girilemiyor
  "git log -1 --format=%cd            ← son commit ne zaman?": "git log -1 --format=%cd            <- timestamp of last commit?",
  "git log --format='%an' | sort -u   ← koda kaç kişi dokunmuş?": "git log --format='%an' | sort -u   <- how many contributors touched code?",
  "~/.ssh/authorized_keys             ← sunucuya kimin anahtarı var?": "~/.ssh/authorized_keys             <- who has SSH keys to production?",
  "WHOIS + hosting hesabı             ← hangi e-postaya kayıtlı?": "WHOIS + cloud account             <- registered to which email?",

  // domain-hosting-erisimi-yok
  "WHOIS sorgusu → kayıt sahibi e-postası kim?": "WHOIS lookup -> who is registrant contact email?",
  "Hosting / bulut faturası hangi adrese gidiyor?": "Hosting / cloud invoice billed to which address?",
  "DNS kayıtları hangi sağlayıcıda tutuluyor?": "DNS zone authoritative name servers and provider?",
  "Alan adının son kullanma tarihi": "Domain registration expiration date",

  // form-gonderiliyor-mail-gelmiyor
  "Mail kuyruğu: deferred / stuck": "Mail queue: deferred / stuck",
  "Uygulama log'u: 'mail sent'    ← ama teslim edilmedi": "App logs: 'mail sent'    <- but never delivered by MTA",

  // site-aramalarda-gorunmez-oldu
  "Sunucu yanıtı: 5xx veya çok yavaş ilk bayt süresi": "Server response: 5xx errors or excessively slow TTFB",
  "Yönlendirme zinciri: 302 → 302 → 200": "Redirect chain loop: 302 -> 302 -> 200",

  // kucuk-degisiklik-gunler-suruyor
  "Görev süresi: tahmin 2 saat, gerçekleşen 2 gün": "Task duration: 2h estimated, 2 days actual delivery",
  "Kurulum: yeni bir geliştirici projeyi kaç günde çalıştırıyor?": "Onboarding: how many days for new engineer to boot project?",
  "Belge var mı: kurulum notu, mimari şeması, karar kaydı": "Documentation exists: setup guide, architecture schema, ADRs?",
  "Yayın sıklığı: haftada kaç kez canlıya çıkılabiliyor?": "Deploy cadence: how many production releases per week?",

  // paytr-token-ve-bildirim-hatasi
  "get-token yanıtı: status success değil, reason alanı dolu": "get-token response: status is not success, reason field is filled",
  "İşlemler sayfası: ödeme alındı, durum «Devam Ediyor»": "Transactions page: payment taken, status 'In Progress'",
  "Bildirim URL erişim kaydı: aynı merchant_oid dakikada bir geliyor": "Notification URL access log: the same merchant_oid arrives every minute",
  "Aynı merchant_oid için iki kez stok düşümü ve iki onay e-postası": "Stock reduced twice and two confirmation emails for one merchant_oid",

  // iyzico-3d-secure-donusu-hata
  "Dönüş isteği (callbackUrl): status=failure, mdStatus 1 değil": "Return request (callbackUrl): status=failure, mdStatus is not 1",
  "Dönüş geldi ama 3DS Tamamlama isteği hiç gönderilmemiş": "Return arrived but the 3DS completion request was never sent",
  "3DS Tamamlama yanıtı: errorCode ve errorMessage dolu": "3DS completion response: errorCode and errorMessage are filled",
  "Dönüşte oturum yok: sepet boş, kullanıcı çıkış yapmış görünüyor": "No session on return: cart is empty, the user appears logged out",

  // woocommerce-odendi-siparis-bekliyor
  "Sağlayıcı paneli: ödeme başarılı · WooCommerce: «Ödeme bekliyor»": "Provider panel: payment successful · WooCommerce: 'Pending payment'",
  "Erişim kaydı: ?wc-api= ile biten bildirim adresine 403 / 503": "Access log: 403 / 503 on the notification URL ending in ?wc-api=",
  "fatal-errors kaydında ödeme eklentisi hatası": "Payment plugin error in the fatal-errors log",
  "Sipariş notu: durum eklenti tarafından «Beklemede» yapıldı": "Order note: status set to 'On hold' by the plugin"
};
