export const techStackData = {
  tr: {
    hero: {
      badge: "MÜHENDİSLİK KAPASİTE MATRİSİ",
      title: "Teknoloji Yığını & Kurtarma Matrisi",
      subtitle: "Sisteminizin dilleri, veritabanları ve bulut altyapısı ne olursa olsun; TMA'nın cerrahi müdahale derinliğini, bilinen kritik darboğazları ve hazırbulunuşluk sürelerini inceleyin.",
      notice: "Tüm müdahaleler müdahale öncesi snapshot ve rollback noktası kuralıyla yürütülür."
    },
    categories: [
      { id: "all", label: "Tüm Teknolojiler" },
      { id: "backend", label: "Backend & Mikroservisler" },
      { id: "frontend", label: "Frontend & Mobil" },
      { id: "database", label: "Veritabanı & Cache" },
      { id: "infra", label: "Bulut, DevOps & Kernel" }
    ],
    items: [
      {
        id: "nodejs",
        name: "Node.js (Nest / Express / Fastify)",
        category: "backend",
        readiness: "Anında SWAT Triyajı — İlk yanıt SEV-0 ≤ 15 dk · SEV-1 ≤ 30 dk",
        supportLevel: "SEV-0 / SEV-1",
        versionRange: "v14.x – v22.x LTS",
        commonIncidents: [
          "Event Loop blokajı & senkron CPU döngüleri",
          "Unhandled Promise Rejection kaynaklı sessiz çöküşler",
          "V8 Heap bellek sızıntıları (Memory Leak & OOM)",
          "Bağlantı havuzu (Connection Pool) sızıntısı ve socket tıkanması"
        ],
        rescueCapability: "V8 Heap snapshot analizi, Chrome DevTools CPU profiler, Clinic.js alev grafikleri (flamegraphs), libuv thread pool optimizasyonu ve kümeleme (clustering) cerrahisi.",
        riskLevel: "Yüksek Trafik Altında Kritik"
      },
      {
        id: "python",
        name: "Python (Django / FastAPI / Flask)",
        category: "backend",
        readiness: "Anında SWAT Triyajı — İlk yanıt SEV-0 ≤ 15 dk · SEV-1 ≤ 30 dk",
        supportLevel: "SEV-0 / SEV-1",
        versionRange: "3.8 – 3.12+",
        commonIncidents: [
          "ASGI/WSGI worker kilitlenmeleri & Gunicorn/Uvicorn timeout",
          "Django ORM n+1 sorgu felaketleri ve bellek şişmesi",
          "Asyncio event loop kilitlenmeleri & senkron I/O blokajı",
          "Celery / Redis kuyruk birikmesi ve task worker tıkanması"
        ],
        rescueCapability: "Py-Spy / cProfile ile canlı süreç profillemesi, async/await darboğaz eliminasyonu, Celery prefetch ve concurrency tuning, ORM sorgu optimizasyonu.",
        riskLevel: "Yoğun I/O ve Kuyruk Süreçlerinde Kritik"
      },
      {
        id: "go",
        name: "Go (Golang)",
        category: "backend",
        readiness: "Anında SWAT Triyajı — İlk yanıt SEV-0 ≤ 15 dk · SEV-1 ≤ 30 dk",
        supportLevel: "SEV-0 / SEV-1",
        versionRange: "1.18 – 1.23+",
        commonIncidents: [
          "Goroutine sızıntısı (Goroutine Leaks) ve bellek tükenmesi",
          "Race Condition (Eşzamanlı bellek erişim çatışmaları)",
          "Channel deadlock ve unbuffered kanal blokajı",
          "GC (Garbage Collector) duraklamaları ve CPU tavanı"
        ],
        rescueCapability: "pprof heap/goroutine/mutex dump analizi, Go race detector ile yarış koşulu tespiti, kanal mimarisi refactor'ı ve sync.Pool ile sıfır-tahsis bellek optimizasyonu.",
        riskLevel: "Mikroservis Eşzamanlılığında Yüksek"
      },
      {
        id: "php",
        name: "PHP (Laravel / Symfony)",
        category: "backend",
        readiness: "Anında SWAT Triyajı — İlk yanıt SEV-1 ≤ 30 dk · SEV-2 ≤ 2 saat",
        supportLevel: "SEV-1 / SEV-2",
        versionRange: "7.4 – 8.3+",
        commonIncidents: [
          "PHP-FPM worker havuzu tükenmesi ve 502/504 ağ geçidi hataları",
          "Eloquent ORM kontrolsüz hydrations ve RAM tüketimi",
          "Horizon / Queue worker çökmeleri ve Redis bellek dolması",
          "OpCache yetersizliği ve disk I/O darboğazları"
        ],
        rescueCapability: "PHP-FPM pm.max_children ve request_slowlog incelemesi, Laravel Octane (Swoole/RoadRunner) migrasyonu, query indexing ve cache katmanlaması.",
        riskLevel: "Yüksek Eşzamanlılıkta Orta-Yüksek"
      },
      {
        id: "java",
        name: "Java / Spring Boot",
        category: "backend",
        readiness: "Planlı SWAT — İlk yanıt SEV-1 ≤ 30 dk · SEV-2 ≤ 2 saat",
        supportLevel: "SEV-1 / SEV-2",
        versionRange: "Java 11 – 21 LTS",
        commonIncidents: [
          "JVM Metaspace / Heap OOM (OutOfMemoryError)",
          "Garbage Collection (Stop-The-World) duraklama krizleri",
          "HikariCP connection pool kilitlenmesi ve thread starvation",
          "Hibernate/JPA lazy loading ve cascade persistence çıkmazları"
        ],
        rescueCapability: "JProfiler / VisualVM heap dump & thread dump analizi, G1GC / ZGC tuning, HikariCP havuz optimizasyonu ve native sorgu izolasyonu.",
        riskLevel: "Kurumsal Sistemlerde Kritik"
      },
      {
        id: "react",
        name: "React / Next.js",
        category: "frontend",
        readiness: "Anında SWAT Triyajı — İlk yanıt SEV-0 ≤ 15 dk · SEV-1 ≤ 30 dk",
        supportLevel: "SEV-0 / SEV-1",
        versionRange: "React 17 – 19 / Next.js 12 – 15",
        commonIncidents: [
          "SSR hydration mismatch ve beyaz ekran (WSOD) krizleri",
          "Next.js App Router sunucu bileşeni bellek sızıntıları",
          "Büyük bundle boyutu ve TBT (Total Blocking Time) çöküşü",
          "Sonsuz re-render döngüleri ve client CPU kilitlenmesi"
        ],
        rescueCapability: "SSR/SSG/ISR hibrit mimari dönüşümü, Webpack/Turbopack chunk splitting, dynamic import optimizasyonu ve state re-render izolasyonu.",
        riskLevel: "Kullanıcı Deneyimi & SEO'da Kritik"
      },
      {
        id: "vue",
        name: "Vue / Nuxt",
        category: "frontend",
        readiness: "Anında SWAT Triyajı — İlk yanıt SEV-1 ≤ 30 dk · SEV-2 ≤ 2 saat",
        supportLevel: "SEV-1 / SEV-2",
        versionRange: "Vue 3 / Nuxt 3",
        commonIncidents: [
          "Universal rendering (Nitro engine) bellek şişmesi",
          "Reaktif veri modellerinde dairesel bağımlılık döngüleri",
          "Pinia / Vuex hydration senkronizasyon hataları"
        ],
        rescueCapability: "Nitro sunucu motoru bellek optimizasyonu, SSR data-fetching stratejileri ve composables refactor'ı.",
        riskLevel: "Frontend Teslimatında Orta"
      },
      {
        id: "mobile",
        name: "React Native & Flutter",
        category: "frontend",
        readiness: "Planlı SWAT — İlk yanıt SEV-1 ≤ 30 dk · SEV-2 ≤ 2 saat",
        supportLevel: "SEV-1 / SEV-2",
        versionRange: "RN 0.70+ / Flutter 3.x",
        commonIncidents: [
          "Native bridge kilitlenmesi ve frame drop (FPS çöküşü)",
          "iOS/Android arka plan görevlerinin işletim sistemi tarafından öldürülmesi",
          "Push notification token senkronizasyon kayıpları"
        ],
        rescueCapability: "Hermes engine bellek profillemesi, Native module köprü optimizasyonu ve offline-first SQLite senkronizasyonu.",
        riskLevel: "Mobil Canlı Yayınında Yüksek"
      },
      {
        id: "postgresql",
        name: "PostgreSQL",
        category: "database",
        readiness: "Anında SWAT Triyajı — İlk yanıt SEV-0 ≤ 15 dk · SEV-1 ≤ 30 dk",
        supportLevel: "SEV-0 / SEV-1",
        versionRange: "v12 – v16+",
        commonIncidents: [
          "Connection pool tükenmesi (max_connections tavanı)",
          "Tablo & indeks şişmesi (Table Bloat & Autovacuum gecikmesi)",
          "Exclusive lock ve transaction deadlock kilitlenmeleri",
          "Eksik indeksler sebebiyle CPU %100 Seq Scan felaketleri"
        ],
        rescueCapability: "PgBouncer havuzlama kurulumu, pg_stat_activity ve pg_stat_statements teşhisi, EXPLAIN ANALYZE ile sorgu cerrahisi ve sıfır kesinti indeksleme (CREATE INDEX CONCURRENTLY).",
        riskLevel: "Veri Katmanında En Yüksek Öncelik"
      },
      {
        id: "mysql",
        name: "MySQL / MariaDB",
        category: "database",
        readiness: "Anında SWAT Triyajı — İlk yanıt SEV-1 ≤ 30 dk · SEV-2 ≤ 2 saat",
        supportLevel: "SEV-1 / SEV-2",
        versionRange: "5.7 – 8.0+",
        commonIncidents: [
          "InnoDB buffer pool yetersizliği ve disk I/O patlaması",
          "Metadata lock kilitlenmeleri (ALTER TABLE blokajı)",
          "Replication lag ve master-slave senkronizasyon kopması"
        ],
        rescueCapability: "SHOW ENGINE INNODB STATUS analizi, slow query log cerrahisi, innodb_buffer_pool_size tuning ve read-replica yük dağıtımı.",
        riskLevel: "Veri Bütünlüğünde Yüksek"
      },
      {
        id: "redis",
        name: "Redis (Cache & Message Broker)",
        category: "database",
        readiness: "Anında SWAT Triyajı — İlk yanıt SEV-0 ≤ 15 dk · SEV-1 ≤ 30 dk",
        supportLevel: "SEV-0 / SEV-1",
        versionRange: "v6.x – v7.x",
        commonIncidents: [
          "Maxmemory dolması ve OOM command not allowed hataları",
          "Tek iş parçacığı (single-thread) blokajı: KEYS *, O(N) sorguları",
          "Fork kaynaklı bellek katlanması ve latency sıçramaları"
        ],
        rescueCapability: "Slowlog analizi, SCAN migrasyonu, memory policy (volatile-lru) optimizasyonu ve Sentinel/Cluster failover denetimi.",
        riskLevel: "Önbellek & Oturum Katmanında Kritik"
      },
      {
        id: "mongodb",
        name: "MongoDB",
        category: "database",
        readiness: "Anında SWAT Triyajı — İlk yanıt SEV-1 ≤ 30 dk · SEV-2 ≤ 2 saat",
        supportLevel: "SEV-1 / SEV-2",
        versionRange: "v4.4 – v7.0",
        commonIncidents: [
          "WiredTiger cache dolması ve write ticket tükenmesi",
          "Unindexed aggregation pipeline bellek aşımı (100MB limiti)",
          "Replica set seçim krizleri ve split-brain riskleri"
        ],
        rescueCapability: "CurrentOp incelemesi, compound index mimarisi, aggregation memory optimizasyonu ve replica set arbitrajı.",
        riskLevel: "Belge Katmanında Orta-Yüksek"
      },
      {
        id: "docker_k8s",
        name: "Docker & Kubernetes (K8s)",
        category: "infra",
        readiness: "Anında SWAT Triyajı — İlk yanıt SEV-0 ≤ 15 dk · SEV-1 ≤ 30 dk",
        supportLevel: "SEV-0 / SEV-1",
        versionRange: "K8s 1.24 – 1.30+",
        commonIncidents: [
          "CrashLoopBackOff & OOMKilled pod döngüleri",
          "Ingress Controller 502 / SSL sertifika yenileme krizleri",
          "Persistent Volume (PVC) lock ve mount hataları",
          "Node kaynak yetersizliği ve pod tahliye (Eviction) kaskadı"
        ],
        rescueCapability: "Kubectl event & describe analizi, cgroup limits/requests dengelenmesi, ingress routing onarımı ve zero-downtime rolling update kurtarması.",
        riskLevel: "Konteyner Orkestrasyonunda Kritik"
      },
      {
        id: "aws",
        name: "Amazon Web Services (AWS)",
        category: "infra",
        readiness: "Anında SWAT Triyajı — İlk yanıt SEV-0 ≤ 15 dk · SEV-1 ≤ 30 dk",
        supportLevel: "SEV-0 / SEV-1",
        versionRange: "ECS, Lambda, RDS, S3, CloudFront",
        commonIncidents: [
          "RDS CPU / IOPS kredisi tükenmesi ve veritabanı kilitlenmesi",
          "Lambda Cold Start ve VPC ENI bağlantı darboğazı",
          "ECS task çöküşleri ve target group unhealthy döngüleri",
          "CloudFront cache invalidation gecikmeleri ve 504 hataları"
        ],
        rescueCapability: "CloudWatch metrik/alarm analizi, RDS Performance Insights cerrahisi, ALB routing düzeltmesi ve IAM yetki kilidi açma.",
        riskLevel: "Bulut Altyapısında Kritik"
      },
      {
        id: "linux_nginx",
        name: "Linux Kernel, Nginx & Caddy",
        category: "infra",
        readiness: "Anında SWAT Triyajı — İlk yanıt SEV-0 ≤ 15 dk · SEV-1 ≤ 30 dk",
        supportLevel: "SEV-0 / SEV-1",
        versionRange: "Ubuntu, Debian, RHEL, Nginx 1.18+",
        commonIncidents: [
          "SYN flood, socket exhaustion ve TIME_WAIT patlamaları",
          "File descriptor (ulimit) tükenmesi: 'Too many open files'",
          "Nginx upstream timed out (110) ve buffer overflow hataları"
        ],
        rescueCapability: "sysctl.conf kernel socket tuning (somaxconn, tcp_tw_reuse), nofile ulimit artırımı, Nginx reverse proxy buffer yapılandırması.",
        riskLevel: "İşletim Sistemi & Ağ Katmanında Temel"
      }
    ],
    summaryBox: {
      title: "Seçilen Teknoloji Yığını Değerlendirmesi",
      emptyNotice: "Lütfen yukarıdaki listeden projenizde kullanılan teknolojileri seçin. TMA'nın bu kombinasyondaki kurtarma derinliği, potansiyel arıza riskleri ve müdahale süresi anında hesaplanacaktır.",
      rescueScore: "Kurtarma & SWAT Hazırlık Skoru",
      estimatedTtr: "Tahmini Masaya Oturma Süresi",
      keyRisks: "Kombinasyona Özel Kritik Riskler",
      actionCta: "Bu Stack İçin Triyaj Brifingi Al",
      copiedNotice: "Stack brifingi panoya kopyalandı! Kriz masasına veya e-postaya yapıştırabilirsiniz."
    }
  },
  en: {
    hero: {
      badge: "ENGINEERING CAPABILITY MATRIX",
      title: "Tech Stack Compatibility & Rescue Matrix",
      subtitle: "Regardless of your languages, databases, or cloud infrastructure: inspect TMA's surgical rescue depth, known mission-critical bottlenecks, and operational readiness times.",
      notice: "All interventions are performed with pre-intervention snapshot and rollback discipline to safeguard production."
    },
    categories: [
      { id: "all", label: "All Technologies" },
      { id: "backend", label: "Backend & Microservices" },
      { id: "frontend", label: "Frontend & Mobile" },
      { id: "database", label: "Databases & Cache" },
      { id: "infra", label: "Cloud, DevOps & Kernel" }
    ],
    items: [
      {
        id: "nodejs",
        name: "Node.js (Nest / Express / Fastify)",
        category: "backend",
        readiness: "Immediate SWAT Triage — First response SEV-0 ≤ 15 min · SEV-1 ≤ 30 min",
        supportLevel: "SEV-0 / SEV-1",
        versionRange: "v14.x – v22.x LTS",
        commonIncidents: [
          "Event Loop starvation & synchronous CPU blocking",
          "Unhandled Promise Rejection silent crash cascades",
          "V8 Heap memory leaks & out-of-memory crashes",
          "Connection pool exhaustion and socket file descriptor leaks"
        ],
        rescueCapability: "V8 Heap snapshot profiling, Chrome DevTools CPU analysis, Clinic.js flamegraphs, libuv thread pool tuning, and clustering surgery.",
        riskLevel: "Critical Under High Concurrency"
      },
      {
        id: "python",
        name: "Python (Django / FastAPI / Flask)",
        category: "backend",
        readiness: "Immediate SWAT Triage — First response SEV-0 ≤ 15 min · SEV-1 ≤ 30 min",
        supportLevel: "SEV-0 / SEV-1",
        versionRange: "3.8 – 3.12+",
        commonIncidents: [
          "ASGI/WSGI worker lockups & Gunicorn/Uvicorn timeouts",
          "Django ORM n+1 query disasters and runaway memory bloat",
          "Asyncio event loop deadlocks & synchronous I/O blocking",
          "Celery / Redis queue backpressure and unacknowledged worker stall"
        ],
        rescueCapability: "Py-Spy / cProfile live process tracing, async/await bottleneck eradication, Celery prefetch and concurrency tuning, raw SQL optimization.",
        riskLevel: "Critical in Heavy I/O & Background Workers"
      },
      {
        id: "go",
        name: "Go (Golang)",
        category: "backend",
        readiness: "Immediate SWAT Triage — First response SEV-0 ≤ 15 min · SEV-1 ≤ 30 min",
        supportLevel: "SEV-0 / SEV-1",
        versionRange: "1.18 – 1.23+",
        commonIncidents: [
          "Goroutine leaks and runaway memory consumption",
          "Data races (concurrent memory access conflicts)",
          "Channel deadlocks and unbuffered channel blocking",
          "Garbage collector latency spikes and CPU pegging"
        ],
        rescueCapability: "pprof heap/goroutine/mutex dump analysis, Go race detector diagnostics, channel architecture refactoring, and sync.Pool zero-allocation optimization.",
        riskLevel: "High in Microservice Concurrency"
      },
      {
        id: "php",
        name: "PHP (Laravel / Symfony)",
        category: "backend",
        readiness: "Immediate SWAT Triage — First response SEV-1 ≤ 30 min · SEV-2 ≤ 2 hours",
        supportLevel: "SEV-1 / SEV-2",
        versionRange: "7.4 – 8.3+",
        commonIncidents: [
          "PHP-FPM worker pool starvation & 502/504 gateway timeouts",
          "Eloquent ORM uncontrolled model hydrations & RAM exhaustion",
          "Horizon / Queue worker failures & Redis memory overflow",
          "OpCache misconfiguration & disk I/O bottlenecks"
        ],
        rescueCapability: "PHP-FPM pm.max_children tuning & slowlog dissection, Laravel Octane (Swoole/RoadRunner) migration, query indexing and layered caching.",
        riskLevel: "Medium-High in High Concurrency"
      },
      {
        id: "java",
        name: "Java / Spring Boot",
        category: "backend",
        readiness: "Scheduled SWAT — First response SEV-1 ≤ 30 min · SEV-2 ≤ 2 hours",
        supportLevel: "SEV-1 / SEV-2",
        versionRange: "Java 11 – 21 LTS",
        commonIncidents: [
          "JVM Metaspace / Heap OutOfMemoryError crashes",
          "Garbage Collection Stop-The-World pause freezes",
          "HikariCP connection pool deadlocks & thread starvation",
          "Hibernate/JPA lazy loading and cascade persistence lockups"
        ],
        rescueCapability: "JProfiler / VisualVM heap dump & thread dump forensics, G1GC / ZGC tuning, HikariCP pool optimization, and native query isolation.",
        riskLevel: "Critical in Enterprise Workloads"
      },
      {
        id: "react",
        name: "React / Next.js",
        category: "frontend",
        readiness: "Immediate SWAT Triage — First response SEV-0 ≤ 15 min · SEV-1 ≤ 30 min",
        supportLevel: "SEV-0 / SEV-1",
        versionRange: "React 17 – 19 / Next.js 12 – 15",
        commonIncidents: [
          "SSR hydration mismatch & White Screen of Death (WSOD)",
          "Next.js App Router server component memory leaks",
          "Huge bundle size & catastrophic Total Blocking Time (TBT)",
          "Infinite re-render loops & client CPU freezing"
        ],
        rescueCapability: "SSR/SSG/ISR hybrid architecture migration, Webpack/Turbopack chunk splitting, dynamic import optimization, and state re-render isolation.",
        riskLevel: "Critical for UX & Search Indexing"
      },
      {
        id: "vue",
        name: "Vue / Nuxt",
        category: "frontend",
        readiness: "Immediate SWAT Triage — First response SEV-1 ≤ 30 min · SEV-2 ≤ 2 hours",
        supportLevel: "SEV-1 / SEV-2",
        versionRange: "Vue 3 / Nuxt 3",
        commonIncidents: [
          "Universal rendering (Nitro engine) memory leaks",
          "Circular dependency loops in reactive state stores",
          "Pinia / Vuex hydration synchronization mismatches"
        ],
        rescueCapability: "Nitro server engine memory profiling, SSR data-fetching streamlining, and composables refactoring.",
        riskLevel: "Medium in Frontend Delivery"
      },
      {
        id: "mobile",
        name: "React Native & Flutter",
        category: "frontend",
        readiness: "Scheduled SWAT — First response SEV-1 ≤ 30 min · SEV-2 ≤ 2 hours",
        supportLevel: "SEV-1 / SEV-2",
        versionRange: "RN 0.70+ / Flutter 3.x",
        commonIncidents: [
          "Native bridge deadlocks and UI frame drops (FPS collapse)",
          "iOS/Android background task terminations by OS",
          "Push notification token desynchronization and payload drops"
        ],
        rescueCapability: "Hermes engine memory profiling, Native module bridge optimization, and offline-first SQLite sync.",
        riskLevel: "High in Live Mobile Apps"
      },
      {
        id: "postgresql",
        name: "PostgreSQL",
        category: "database",
        readiness: "Immediate SWAT Triage — First response SEV-0 ≤ 15 min · SEV-1 ≤ 30 min",
        supportLevel: "SEV-0 / SEV-1",
        versionRange: "v12 – v16+",
        commonIncidents: [
          "Connection pool exhaustion (max_connections ceiling)",
          "Table & index bloat causing autovacuum lag",
          "Exclusive locks and transaction deadlocks",
          "Missing composite indexes leading to 100% CPU Seq Scans"
        ],
        rescueCapability: "PgBouncer pool installation, pg_stat_activity & pg_stat_statements diagnostics, EXPLAIN ANALYZE query surgery, and zero-downtime concurrent indexing.",
        riskLevel: "Highest Priority in Data Tier"
      },
      {
        id: "mysql",
        name: "MySQL / MariaDB",
        category: "database",
        readiness: "Immediate SWAT Triage — First response SEV-1 ≤ 30 min · SEV-2 ≤ 2 hours",
        supportLevel: "SEV-1 / SEV-2",
        versionRange: "5.7 – 8.0+",
        commonIncidents: [
          "InnoDB buffer pool starvation and disk I/O thrashing",
          "Metadata locks blocking concurrent DDL/DML operations",
          "Replication lag and master-replica desync"
        ],
        rescueCapability: "SHOW ENGINE INNODB STATUS forensics, slow query log eradication, innodb_buffer_pool_size tuning, and read-replica offloading.",
        riskLevel: "High in Data Integrity"
      },
      {
        id: "redis",
        name: "Redis (Cache & Message Broker)",
        category: "database",
        readiness: "Immediate SWAT Triage — First response SEV-0 ≤ 15 min · SEV-1 ≤ 30 min",
        supportLevel: "SEV-0 / SEV-1",
        versionRange: "v6.x – v7.x",
        commonIncidents: [
          "Maxmemory limit reached: OOM command not allowed",
          "Single-thread blocking: KEYS * and expensive O(N) operations",
          "Fork latency spikes during memory snapshots (BGSAVE)"
        ],
        rescueCapability: "Slowlog analysis, non-blocking SCAN migration, eviction policy (volatile-lru) tuning, and Sentinel/Cluster failover inspection.",
        riskLevel: "Critical in Caching & Session Layer"
      },
      {
        id: "mongodb",
        name: "MongoDB",
        category: "database",
        readiness: "Immediate SWAT Triage — First response SEV-1 ≤ 30 min · SEV-2 ≤ 2 hours",
        supportLevel: "SEV-1 / SEV-2",
        versionRange: "v4.4 – v7.0",
        commonIncidents: [
          "WiredTiger cache pressure and write ticket exhaustion",
          "Unindexed aggregation pipelines exceeding 100MB RAM limit",
          "Replica set election flap and split-brain hazards"
        ],
        rescueCapability: "CurrentOp forensic auditing, compound index remodeling, aggregation memory optimization, and replica set arbitrage.",
        riskLevel: "Medium-High in Document Tier"
      },
      {
        id: "docker_k8s",
        name: "Docker & Kubernetes (K8s)",
        category: "infra",
        readiness: "Immediate SWAT Triage — First response SEV-0 ≤ 15 min · SEV-1 ≤ 30 min",
        supportLevel: "SEV-0 / SEV-1",
        versionRange: "K8s 1.24 – 1.30+",
        commonIncidents: [
          "CrashLoopBackOff & OOMKilled pod restart cascades",
          "Ingress Controller 502 / SSL certificate expiry outages",
          "Persistent Volume (PVC) lockups and mount failures",
          "Node resource starvation and pod eviction storms"
        ],
        rescueCapability: "Kubectl event & describe forensics, cgroup limits/requests rebalancing, ingress routing remediation, and zero-downtime rolling recovery.",
        riskLevel: "Critical in Container Orchestration"
      },
      {
        id: "aws",
        name: "Amazon Web Services (AWS)",
        category: "infra",
        readiness: "Immediate SWAT Triage — First response SEV-0 ≤ 15 min · SEV-1 ≤ 30 min",
        supportLevel: "SEV-0 / SEV-1",
        versionRange: "ECS, Lambda, RDS, S3, CloudFront",
        commonIncidents: [
          "RDS CPU / IOPS burst credit depletion & database freezes",
          "Lambda Cold Starts and VPC ENI attachment exhaustion",
          "ECS task crash loops and unhealthy target group churning",
          "CloudFront cache invalidation delays and 504 errors"
        ],
        rescueCapability: "CloudWatch metric/alarm diagnostics, RDS Performance Insights surgery, ALB routing remediation, and IAM permission unblocking.",
        riskLevel: "Critical in Cloud Infrastructure"
      },
      {
        id: "linux_nginx",
        name: "Linux Kernel, Nginx & Caddy",
        category: "infra",
        readiness: "Immediate SWAT Triage — First response SEV-0 ≤ 15 min · SEV-1 ≤ 30 min",
        supportLevel: "SEV-0 / SEV-1",
        versionRange: "Ubuntu, Debian, RHEL, Nginx 1.18+",
        commonIncidents: [
          "SYN flood, socket exhaustion and TIME_WAIT surges",
          "File descriptor (ulimit) exhaustion: 'Too many open files'",
          "Nginx upstream timed out (110) and buffer overflow errors"
        ],
        rescueCapability: "sysctl.conf kernel socket tuning (somaxconn, tcp_tw_reuse), nofile ulimit expansion, Nginx reverse proxy buffer optimization.",
        riskLevel: "Fundamental in OS & Network Tier"
      }
    ],
    summaryBox: {
      title: "Selected Tech Stack Assessment",
      emptyNotice: "Please select the technologies used in your project from the list above. TMA's rescue depth, potential architectural risks, and response time for this combination will be calculated instantly.",
      rescueScore: "Rescue & SWAT Readiness Score",
      estimatedTtr: "Estimated Time to Table",
      keyRisks: "Critical Risks Specific to Combination",
      actionCta: "Get Triage Brief for This Stack",
      copiedNotice: "Stack brief copied to clipboard! Ready to paste into your crisis channel or email."
    }
  }
};

export const techStackH1 = {
  tr: techStackData.tr.hero.title,
  en: techStackData.en.hero.title
};
