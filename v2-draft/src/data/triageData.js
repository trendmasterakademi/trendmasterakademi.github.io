/**
 * Emergency Triage & Incident Simulator Data
 * Canlı kriz anında ilk 15 dakikada yapılması ve KESİNLİKLE YAPILMAMASI gerekenler.
 */

export const triageScenarios = [
  {
    id: 'db-connection-pool-deadlock',
    category: { tr: 'Veritabanı & Eşzamanlılık', en: 'Database & Concurrency' },
    symptom: {
      tr: 'Veritabanı bağlantıları doldu (max_connections), API istekleri donuyor veya 504 Gateway Timeout veriyor.',
      en: 'Database connection pool exhausted (max_connections reached), API requests hanging or throwing 504 Gateway Timeout.'
    },
    severity: 'SEV-0 CRITICAL',
    firstResponseTime: { tr: '15 Dakika', en: '15 Minutes' },
    doNot: [
      {
        tr: 'Sunucuyu körlemesine yeniden başlatmayın (Restart etmeyin). Askıda kalan transactionlar veritabanı recovery sürecine girerek kesinti süresini 10 katına çıkarabilir.',
        en: 'Do NOT reboot the database server blindly. In-flight transactions entering crash recovery can turn a 10-minute deadlock into an hour-long recovery freeze.'
      },
      {
        tr: 'Canlı veritabanı üzerinde kontrolsüz "ALTER TABLE" veya indeks oluşturma çalıştırmayın. Zaten kilitlenmiş tablolarda DDL komutu tüm kuyruğu tamamen kilitler.',
        en: 'Do NOT run raw ALTER TABLE or index creation statements. In an already locked schema, DDL commands acquire AccessExclusiveLock and freeze all pending queries.'
      }
    ],
    diagnosticCommands: [
      {
        cmd: "SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state FROM pg_stat_activity WHERE state != 'idle' ORDER BY duration DESC LIMIT 10;",
        desc: {
          tr: 'En uzun süredir kilitli kalan veya bekleyen ilk 10 sorguyu tespit edin.',
          en: 'Identify the top 10 longest running or blocked transactions in PostgreSQL.'
        }
      },
      {
        cmd: "SELECT blocked_locks.pid AS blocked_pid, blocking_locks.pid AS blocking_pid, blocked_activity.query AS blocked_statement FROM pg_catalog.pg_locks blocked_locks JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation WHERE NOT blocked_locks.granted;",
        desc: {
          tr: 'Hangi transactionın diğerlerini kilitlediğini (blocking lock) ortaya çıkarın.',
          en: 'Uncover the root transaction causing cascading deadlocks across worker nodes.'
        }
      }
    ],
    immediateAction: {
      tr: '1. pg_cancel_backend() ile sadece kilitlenen sorguyu durdurmayı deneyin.\n2. Yanıt vermiyorsa pg_terminate_backend(blocking_pid) ile kilitleyen backend sürecini kontrollü sonlandırın.\n3. Uygulama ile veritabanı arasına PgBouncer gibi bir pooler yerleştirilene kadar gelen harici webhook/cron trafiğini geçici olarak kısın.',
      en: '1. Attempt soft cancellation with pg_cancel_backend().\n2. If unresponsive, safely terminate the blocking process with pg_terminate_backend(blocking_pid).\n3. Throttle inbound webhook/cron spikes until a connection pooler (PgBouncer) is engaged.'
    },
    tmaResolution: {
      tr: 'TMA SWAT masası canlıya bağlanarak deadlock döngüsünü 20 dakikada izole eder; eksik foreign-key indekslerini CONCURRENTLY olarak ekler ve PgBouncer transaction havuzunu yayına alır.',
      en: 'TMA SWAT connects to production, isolates the deadlock loop within 20 minutes, patches missing FK indexes concurrently, and activates PgBouncer transaction pooling.'
    },
    linkedTeshisSlug: 'islemler-kilitlendi-sayfa-donuyor'
  },
  {
    id: 'payment-webhook-race-condition',
    category: { tr: 'Ödeme & Çift Çekim', en: 'Payment & Double Charge' },
    symptom: {
      tr: 'Müşterilerden çift ödeme çekildi veya ödeme alındı ancak sipariş sistemde "Ödenmedi" görünüyor.',
      en: 'Customers charged multiple times or payment captured but orders stuck in "Pending" or failed state.'
    },
    severity: 'SEV-0 CRITICAL',
    firstResponseTime: { tr: '15 Dakika', en: '15 Minutes' },
    doNot: [
      {
        tr: 'Ödeme gateway panelinden panikle toplu otomatik iade (bulk refund) tetiklemeyin. Veritabanındaki gerçek durum doğrulanmadan yapılan iadeler çift zarar doğurur.',
        en: 'Do NOT trigger bulk refunds blindly from payment dashboards. Initiating refunds before verifying database ledger integrity results in double financial losses.'
      },
      {
        tr: 'Kullanıcının ödeme butonuna tekrar tekrar basmasına izin veren formu canlıda bırakmayın.',
        en: 'Do NOT leave the client-side checkout button enabled without optimistic lock or idempotency guards.'
      }
    ],
    diagnosticCommands: [
      {
        cmd: "SELECT user_id, amount, COUNT(*) FROM payments WHERE created_at > NOW() - INTERVAL '2 hours' GROUP BY user_id, amount HAVING COUNT(*) > 1;",
        desc: {
          tr: 'Son 2 saatte aynı tutarla birden fazla çekim yapılan kullanıcıları listeleyin.',
          en: 'List duplicate payment captures grouped by user and exact transaction amount within the last 2 hours.'
        }
      },
      {
        cmd: "tail -n 200 /var/log/nginx/access.log | grep -E '(/api/webhook|/checkout)'",
        desc: {
          tr: 'Webhook isteklerinin HTTP yanıt kodlarını (200 OK vs 500) ve tekrar sıklığını denetleyin.',
          en: 'Verify webhook ingestion status codes (200 OK vs 500) and delivery retry patterns.'
        }
      }
    ],
    immediateAction: {
      tr: '1. Webhook dinleyicisinde gelen istekleri doğrudan DB işlemine sokmak yerine Redis/Queue belleğine alın ve hemen HTTP 200 dönün.\n2. Backend tarafında ödeme tokenı veya sipariş ID bazlı Idempotency Key kontrolü uygulayın.\n3. Ödeme butonunu tek tıklamadan sonra frontend üzerinde devre dışı bırakın.',
      en: '1. Decouple webhook processing: accept the payload into Redis and immediately return HTTP 200.\n2. Enforce strict Idempotency Key validation keyed on checkout token / order ID.\n3. Disable the checkout submit button immediately upon first client click.'
    },
    tmaResolution: {
      tr: 'TMA mühendisleri 30 dakikada ödeme akışına Redis Redlock ve idempotency katmanı kurar; mükerrer çekimleri mutabakat tablosuyla eşleştirip müşteri bakiyesini düzeltir.',
      en: 'TMA engineers deploy Redis Redlock and idempotency safeguards within 30 minutes, reconciling duplicate charges against gateway ledgers.'
    },
    linkedTeshisSlug: 'odeme-iki-kez-alindi'
  },
  {
    id: 'memory-leak-pod-crash',
    category: { tr: 'Bellek & Konteyner', en: 'Memory & Node/Pod Crash' },
    symptom: {
      tr: 'Node.js/Python sunucusu her birkaç saatte bir OOM (Out of Memory) ile çöküyor; RAM tüketimi sürekli yükseliyor.',
      en: 'Node.js/Python service crashes periodically with OOM (Out of Memory); RAM usage steadily increases without dropping.'
    },
    severity: 'SEV-1 HIGH',
    firstResponseTime: { tr: '30 Dakika', en: '30 Minutes' },
    doNot: [
      {
        tr: 'Sunucu RAM limitini rastgele 2 katına çıkarıp sorunu çözdüm sanmayın. Bellek sızıntısı olan sistem 8 GB RAM\'i de aynı hızla tüketir, sadece çöküş süresini öteler.',
        en: 'Do NOT just double container RAM limits as a fix. Memory leaks will consume 8GB or 16GB just as readily, simply delaying the inevitable crash.'
      },
      {
        tr: 'Çöken podu bellek dökümü (Heap Snapshot) almadan yeniden başlatmayın. Kanıt olmadan sızıntıyı bulmak imkansızlaşır.',
        en: 'Do NOT kill or restart the degrading pod before capturing a heap profile or core snapshot.'
      }
    ],
    diagnosticCommands: [
      {
        cmd: "node --inspect --max-old-space-size=4096 server.js & \n# Veya canlı PID için:\nkill -USR2 <NODE_PID>",
        desc: {
          tr: 'Node.js çalışma zamanında canlı V8 heap snapshot dökümü oluşturun.',
          en: 'Trigger a live V8 heap snapshot for the active Node.js process.'
        }
      },
      {
        cmd: "dmesg -T | grep -E -i '(killed process|oom_reaper|out of memory)'",
        desc: {
          tr: 'Linux çekirdeğinin OOM Killer mekanizmasıyla hangi süreci öldürdüğünü doğrulayın.',
          en: 'Confirm kernel-level OOM Killer invocations and victim process IDs.'
        }
      }
    ],
    immediateAction: {
      tr: '1. Çöken podların yerine yedek bir instance ayağa kaldırıp trafiği paylaştırın.\n2. Sızıntı yapan podu canlı trafikten izole edin ancak kapatmayın; Chrome DevTools ile heap snapshot karşılaştırması yapın.\n3. Açık kalan veritabanı stream\'leri, temizlenmeyen event listener\'lar veya global cache array\'lerini tarayın.',
      en: '1. Spin up an extra worker replica to distribute load.\n2. Drain traffic from the leaking instance but keep it alive for snapshot comparison.\n3. Audit unclosed database streams, dangling event emitters, and unbounded in-memory caches.'
    },
    tmaResolution: {
      tr: 'TMA kıdemli masası heap dökümünü analiz ederek tutulan closure veya dinleyici referansını satır numarasına kadar bulur; sızıntıyı giderip memory profiling testini tamamlar.',
      en: 'TMA seniors profile the heap snapshot, isolate the retaining closure down to the exact source line, patch the leak, and verify memory stabilization.'
    },
    linkedTeshisSlug: 'sunucu-her-gun-yeniden-baslatiliyor'
  },
  {
    id: 'deploy-pipeline-env-failure',
    category: { tr: 'Deploy & CI/CD', en: 'Deploy & CI/CD' },
    symptom: {
      tr: 'Yeni sürüm canlıya alındı (deploy edildi) ve site anında HTTP 500 verdi veya sayfa boş beyaz ekran (White Screen of Death) gösteriyor.',
      en: 'New deployment shipped to production and immediately threw HTTP 500 or blank White Screen of Death.'
    },
    severity: 'SEV-0 CRITICAL',
    firstResponseTime: { tr: '15 Dakika', en: '15 Minutes' },
    doNot: [
      {
        tr: 'Aceleyle canlı sunucu üzerinde doğrudan kod dosyalarını (FTP/SSH ile) elle düzenlemeye çalışmayın. Git geçmişiyle senkronizasyon koparsa geri dönüş imkansızlaşır.',
        en: 'Do NOT hot-edit source files directly on live production servers via SSH/FTP. Diverging from Git history ruins rollback capability.'
      },
      {
        tr: 'Veritabanı migrasyonu çalışmış bir sürümde, veritabanını geriye almadan sadece kod sürümünü geriye almayın (Schema-code mismatch yaratır).',
        en: 'Do NOT roll back code without checking DB migrations. Reverting application code while schema changes remain creates severe structural mismatches.'
      }
    ],
    diagnosticCommands: [
      {
        cmd: "git log -n 3 --oneline && git diff HEAD~1 --stat",
        desc: {
          tr: 'Canlıya giren son commit\'te hangi dosyaların ve bağımlılıkların değiştiğini görün.',
          en: 'Inspect the exact commits and modified files in the failing release.'
        }
      },
      {
        cmd: "docker logs --tail 100 --timestamps <CONTAINER_ID> | grep -E -i '(fatal|uncaught|error)'",
        desc: {
          tr: 'Uygulama konteynerinin başlangıç anındaki ölümcül hata mesajını yakalayın.',
          en: 'Capture container bootstrap stack traces and fatal initialization errors.'
        }
      }
    ],
    immediateAction: {
      tr: '1. Son deploy edilen commit\'in eksik bir ortam değişkeni (.env) veya build artefact hatası olup olmadığını kontrol edin.\n2. Eğer sorun kod hatasıysa ve DB şeması değişmediyse, CI/CD üzerinden bir önceki stabil sürüme (Previous Green Release) anında rollback yapın.\n3. Rollback sonrası hata logunu staging ortamında simüle edin.',
      en: '1. Verify missing environment variables (.env) or unbuilt frontend asset chunks.\n2. If the bug is pure application logic with no breaking schema changes, trigger an instant rollback to the previous green release.\n3. Reproduce and patch the crash trace in a staging clone.'
    },
    tmaResolution: {
      tr: 'TMA SWAT masası 15 dakikada deploy pipeline\'ını önceki stabil sürüme döndürür, kilitlenen çevre değişkenlerini güvenli kasaya (Vault) alır ve hatasız build hattı kurar.',
      en: 'TMA SWAT executes zero-downtime rollback in 15 minutes, restores missing secret vaults, and fortifies the CI/CD deployment pipeline.'
    },
    linkedTeshisSlug: 'deploy-sonrasi-site-bozuldu'
  },
  {
    id: 'api-rate-limit-cascade',
    category: { tr: 'Entegrasyon & 429', en: 'Integrations & Rate Limits' },
    symptom: {
      tr: 'Dış API (Kargo, SMS, Pazaryeri, ERP) HTTP 429 Too Many Requests dönüyor; gelen tüm siparişler kuyrukta birikerek sistemi tıkıyor.',
      en: 'Third-party API (shipping, SMS, ERP, marketplace) returning HTTP 429 Too Many Requests; pending jobs blocking worker queues.'
    },
    severity: 'SEV-1 HIGH',
    firstResponseTime: { tr: '30 Dakika', en: '30 Minutes' },
    doNot: [
      {
        tr: 'Hata alan istekleri anında sıfır bekleme süresiyle (zero-delay retry) tekrar tekrar göndermeyin. Bu durum IP adresinizin kalıcı olarak engellenmesine yol açar.',
        en: 'Do NOT trigger aggressive zero-delay retries. Hammering an already rate-limited provider guarantees complete IP banishment.'
      },
      {
        tr: 'Kuyruğu temizlemek adına biriken işleri silmeyin (Müşteri siparişleri veya SMS bildirimleri kaybolur).',
        en: 'Do NOT purge pending queues to relieve pressure. You will discard valid customer orders or critical notifications.'
      }
    ],
    diagnosticCommands: [
      {
        cmd: "curl -I -X GET https://api.provider.com/v1/status -H 'Authorization: Bearer <TOKEN>'",
        desc: {
          tr: 'Sağlayıcının HTTP başlıklarındaki "Retry-After" ve "X-RateLimit-Remaining" değerlerini okuyun.',
          en: 'Inspect provider headers for Retry-After and X-RateLimit-Remaining limits.'
        }
      },
      {
        cmd: "redis-cli -u $REDIS_URL LLEN queue:shipping_orders",
        desc: {
          tr: 'Tıkanan kuyruktaki bekleyen iş hacmini ve büyüme hızını ölçün.',
          en: 'Measure queue backlog depth and inbound job ingestion rate.'
        }
      }
    ],
    immediateAction: {
      tr: '1. İstek kuyruğuna derhal "Exponential Backoff & Jitter" (üstel gecikme) mekanizması ekleyin.\n2. Sağlayıcının izin verdiği maksimum saniye başına istek (TPS) sınırına uygun bir token bucket rate limiter devreye alın.\n3. Acil olmayan bildirimleri (ör: promosyon SMS) durdurup çekirdek ödeme/sipariş akışına öncelik verin.',
      en: '1. Implement exponential backoff with randomized jitter immediately on retry loops.\n2. Configure token bucket rate limiters matching provider-approved TPS ceilings.\n3. Pause low-priority notifications (marketing) to preserve quota for checkout transactions.'
    },
    tmaResolution: {
      tr: 'TMA mühendisleri 45 dakikada dayanıklı kuyruk mimarisi (BullMQ/Redis) kurar, circuit breaker (devre kesici) modelini entegre eder ve 429 fırtınasını tamamen dindirir.',
      en: 'TMA engineers deploy BullMQ with resilient circuit breakers within 45 minutes, smoothing traffic spikes below provider rate thresholds.'
    },
    linkedTeshisSlug: 'entegrasyon-429-veriyor'
  },
  {
    id: 'ghost-developer-handover-lock',
    category: { tr: 'Devir & Kayıp Erişim', en: 'Handover & Locked Access' },
    symptom: {
      tr: 'Yazılımcı aniden ayrıldı; sunucu şifreleri, DNS paneli veya repo erişimleri kayıp, projede değişiklik yapılamıyor.',
      en: 'Developer abruptly left; root server credentials, DNS or repo access missing, project completely frozen.'
    },
    severity: 'SEV-2 MAJOR',
    firstResponseTime: { tr: '2 Saat', en: '2 Hours' },
    doNot: [
      {
        tr: 'Ayrılan yazılımcının yetkilerini kaba kuvvetle silmeye çalışırken aktif çalışan üretim servislerinin kimlik doğrulama anahtarlarını (Service Accounts) silmeyin.',
        en: 'Do NOT hastily delete user accounts without verifying whether background daemons or cron jobs rely on that user identity.'
      },
      {
        tr: 'Erişim yok diye sunucuyu kapatıp baştan kurmaya kalkışmayın. Çalışan sistemin belleğinde canlı konfigürasyon ve anahtarlar hala mevcuttur.',
        en: 'Do NOT reinstall the server in despair. Running memory and procfs frequently hold operational environment secrets.'
      }
    ],
    diagnosticCommands: [
      {
        cmd: "ps aux | grep -E '(node|python|gunicorn|dockerd)' && cat /proc/$(pgrep -f 'node' | head -1)/environ | tr '\\0' '\\n'",
        desc: {
          tr: 'Çalışan sürecin bellek alanından canlı çevre değişkenlerini (.env) kurtarın.',
          en: 'Extract live environment secrets and connection strings directly from /proc/environ.'
        }
      },
      {
        cmd: "who -u && last -n 10",
        desc: {
          tr: 'Sunucuya en son hangi IP ve kullanıcılarla bağlanıldığını denetleyin.',
          en: 'Audit active SSH sessions and recent remote login IP addresses.'
        }
      }
    ],
    immediateAction: {
      tr: '1. Mevcut çalışan servislerin çevre değişkenlerini `/proc/<pid>/environ` üzerinden güvenli bir yere yedekleyin.\n2. Sunucuya yeni bir SSH anahtarı tanımlayıp eski anahtarları `authorized_keys` dosyasından temizleyin.\n3. Bulut panelinde (AWS/DigitalOcean) yeni bir tam anlık görüntü (Snapshot) alın.',
      en: '1. Salvage live environment variables from active process memory before any reboot.\n2. Provision a new corporate SSH key and revoke departed engineer keys from authorized_keys.\n3. Capture full disk snapshots in cloud provider consoles immediately.'
    },
    tmaResolution: {
      tr: 'TMA çekirdek masası 12 kalemlik devir protokolünü çalıştırarak kayıp anahtarları kurtarır, yetkileri devralır ve ajans adına temiz bir teslim tutanağı hazırlar.',
      en: 'TMA executes our 12-checkpoint Handover Protocol, extracts missing secrets from memory, rotates keys, and restores full agency ownership.'
    },
    linkedTeshisSlug: 'yazilimci-gitti-koda-girilemiyor'
  }
];
