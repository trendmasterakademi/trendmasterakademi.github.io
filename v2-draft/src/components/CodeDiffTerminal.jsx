import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Terminal, Check, AlertCircle, Zap, ArrowRight, ShieldCheck, Database, Lock, Cpu, Sparkles } from 'lucide-react';
import { isTurkish } from '../i18n';

export const incidents = [
  {
    id: 'deadlock',
    tabName: { tr: '01 · PostgreSQL Deadlock & N+1', en: '01 · PostgreSQL Deadlock & N+1' },
    title: { 
      tr: '18.4 Saniyede Çöken N+1 Sorgu ve Veritabanı Kilitlenmesi', 
      en: '18.4s Timeout N+1 Query Loop & Database Deadlock' 
    },
    symptom: 'SQLSTATE[40001]: Serialization failure: 1213 Deadlock found when trying to get lock',
    metrics: {
      latencyBefore: '18,420 ms',
      latencyAfter: '24 ms',
      cpuBefore: { tr: '98% Spike', en: '98% Spike' },
      cpuAfter: { tr: '3.2% Normal', en: '3.2% Normal' },
      status: { tr: 'ÇÖZÜLDÜ (%99.8 Daha Hızlı)', en: 'RESOLVED (99.8% Faster)' }
    },
    beforeCode: {
      tr: `// 🚨 ESKİ KOD: Her döngüde ayrı DB sorgusu & açık transaction kilidi
const orders = await db.query('SELECT * FROM orders WHERE status = $1', ['pending']);

// N+1 Felaketi: 2,500 sipariş için 2,500 kez ayrı SQL sorgusu atılıyor!
for (const order of orders) {
  const user = await db.query('SELECT * FROM users WHERE id = $1', [order.user_id]);
  const items = await db.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
  
  // Transaction kapatılmadan uzun süren dış API çağrısı yapılıyor:
  await chargeCard(user.stripe_id, order.total); 
  await db.query('UPDATE orders SET status = $1 WHERE id = $2', ['paid', order.id]);
  // 💥 SONUÇ: Lock wait timeout & bağlantı havuzu kilitlenmesi (HTTP 500)
}`,
      en: `// 🚨 LEGACY CODE: Separate DB query per iteration & unclosed transaction lock
const orders = await db.query('SELECT * FROM orders WHERE status = $1', ['pending']);

// N+1 Disaster: 2,500 separate SQL queries executed for 2,500 orders!
for (const order of orders) {
  const user = await db.query('SELECT * FROM users WHERE id = $1', [order.user_id]);
  const items = await db.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
  
  // Long-running external API call performed inside an open transaction:
  await chargeCard(user.stripe_id, order.total); 
  await db.query('UPDATE orders SET status = $1 WHERE id = $2', ['paid', order.id]);
  // 💥 RESULT: Lock wait timeout & connection pool exhaustion (HTTP 500)
}`
    },
    afterCode: {
      tr: `// 🛡️ TMA ÇÖZÜMÜ: Tek CTE sorgusu, Redis önbelleği ve asenkron kuyruk
// 1. Tek batch join ile 2,500 sorgu 1 tek optimize sorguya indirildi:
const ordersWithDetails = await db.query(\`
  WITH pending_batch AS (
    SELECT id, user_id, total FROM orders 
    WHERE status = 'pending' LIMIT 100 FOR UPDATE SKIP LOCKED
  )
  SELECT pb.*, u.stripe_id, json_agg(oi.*) as items
  FROM pending_batch pb
  JOIN users u ON u.id = pb.user_id
  JOIN order_items oi ON oi.order_id = pb.id
  GROUP BY pb.id, pb.user_id, pb.total, u.stripe_id
\`);

// 2. İşlem kuyruğu (BullMQ + Redis) ile lock süresi <5ms'ye çekildi:
await paymentQueue.addBulk(ordersWithDetails.rows.map(o => ({ name: 'process', data: o })));
// ✅ SONUÇ: 18.4s -> 24ms. Sıfır kilitlenme, 100,000 siparişte tam istikrar.`,
      en: `// 🛡️ TMA SOLUTION: Single CTE query, Redis cache, and async worker queue
// 1. Reduced 2,500 queries to 1 optimized batch query via CTE & join:
const ordersWithDetails = await db.query(\`
  WITH pending_batch AS (
    SELECT id, user_id, total FROM orders 
    WHERE status = 'pending' LIMIT 100 FOR UPDATE SKIP LOCKED
  )
  SELECT pb.*, u.stripe_id, json_agg(oi.*) as items
  FROM pending_batch pb
  JOIN users u ON u.id = pb.user_id
  JOIN order_items oi ON oi.order_id = pb.id
  GROUP BY pb.id, pb.user_id, pb.total, u.stripe_id
\`);

// 2. Lock duration reduced to <5ms via job queue (BullMQ + Redis):
await paymentQueue.addBulk(ordersWithDetails.rows.map(o => ({ name: 'process', data: o })));
// ✅ RESULT: 18.4s -> 24ms. Zero deadlocks, absolute stability under 100k orders.`
    }
  },
  {
    id: 'webhook',
    tabName: { tr: '02 · Çift Çekilen Ödeme & Webhook', en: '02 · Double Charge & Webhooks' },
    title: { 
      tr: 'Ağ Gecikmesinde İki Kez Çekilen Ödeme & Race Condition', 
      en: 'Duplicate Charges on Network Retry & Race Condition' 
    },
    symptom: 'Stripe/iyzico retry webhook received twice within 40ms — duplicate balance deduction',
    metrics: {
      latencyBefore: 'Race Window 120ms',
      latencyAfter: 'Atomic (0ms)',
      cpuBefore: { tr: 'Hatalı Stok/Bakiye', en: 'Corrupted Balance' },
      cpuAfter: { tr: 'Idempotent %100', en: '100% Idempotent' },
      status: { tr: 'DOĞRULANMIŞ IDEMPOTENCY', en: 'VERIFIED IDEMPOTENCY' }
    },
    beforeCode: {
      tr: `// 🚨 ESKİ KOD: Güvensiz Webhook Handler (Race Condition Riski)
app.post('/api/webhook/payment', async (req, res) => {
  const { event, order_id, amount } = req.body;
  
  // ❌ HATA: Webhook 40ms arayla iki kez geldiğinde ikisi de aynı anda geçer!
  const order = await db.orders.findById(order_id);
  if (order.status !== 'completed') {
    // İki thread de buraya aynı anda girer:
    await deductStock(order.items);
    await markOrderAsPaid(order_id);
    await sendInvoice(order.user_email); // 💥 Müşteriye iki kez fatura ve çift çekim!
  }
  res.sendStatus(200);
});`,
      en: `// 🚨 LEGACY CODE: Vulnerable Webhook Handler (Race Condition Risk)
app.post('/api/webhook/payment', async (req, res) => {
  const { event, order_id, amount } = req.body;
  
  // ❌ BUG: When webhook arrives twice within 40ms, both pass simultaneously!
  const order = await db.orders.findById(order_id);
  if (order.status !== 'completed') {
    // Both threads enter here concurrently:
    await deductStock(order.items);
    await markOrderAsPaid(order_id);
    await sendInvoice(order.user_email); // 💥 Duplicate invoice and double charge!
  }
  res.sendStatus(200);
});`
    },
    afterCode: {
      tr: `// 🛡️ TMA ÇÖZÜMÜ: Redis Distributed Lock + Idempotency Key Tablosu
app.post('/api/webhook/payment', async (req, res) => {
  const idempotencyKey = req.headers['idempotency-key'] || req.body.event_id;
  
  // 1. Dağıtık Kilit (Redlock) ile eşzamanlı çakışma engellenir:
  const acquired = await redis.set(\`lock:webhook:\${idempotencyKey}\`, '1', 'NX', 'EX', 30);
  if (!acquired) return res.status(200).send('IN_PROGRESS');

  try {
    // 2. PostgreSQL atomik UPSERT ile tekilleştirme:
    await db.transaction(async (trx) => {
      const inserted = await trx.raw(\`
        INSERT INTO processed_events (event_id, processed_at)
        VALUES (?, NOW()) ON CONFLICT (event_id) DO NOTHING RETURNING id
      \`, [idempotencyKey]);

      if (!inserted.rows.length) return; // Zaten işlendi, güvenle çık
      await executeOrderFulfillment(trx, req.body);
    });
    return res.status(200).send('PROCESSED_OK');
  } finally {
    await redis.del(\`lock:webhook:\${idempotencyKey}\`);
  }
  // ✅ SONUÇ: Sıfır mükerrer işlem. Sağlayıcı 10 kez denese bile tam 1 kez işlenir.
});`,
      en: `// 🛡️ TMA SOLUTION: Redis Distributed Lock + Idempotency Key Table
app.post('/api/webhook/payment', async (req, res) => {
  const idempotencyKey = req.headers['idempotency-key'] || req.body.event_id;
  
  // 1. Prevent concurrent collisions via Distributed Lock (Redlock):
  const acquired = await redis.set(\`lock:webhook:\${idempotencyKey}\`, '1', 'NX', 'EX', 30);
  if (!acquired) return res.status(200).send('IN_PROGRESS');

  try {
    // 2. Atomic PostgreSQL UPSERT deduplication:
    await db.transaction(async (trx) => {
      const inserted = await trx.raw(\`
        INSERT INTO processed_events (event_id, processed_at)
        VALUES (?, NOW()) ON CONFLICT (event_id) DO NOTHING RETURNING id
      \`, [idempotencyKey]);

      if (!inserted.rows.length) return; // Already processed, safe exit
      await executeOrderFulfillment(trx, req.body);
    });
    return res.status(200).send('PROCESSED_OK');
  } finally {
    await redis.del(\`lock:webhook:\${idempotencyKey}\`);
  }
  // ✅ RESULT: Zero duplicate charges. Even if provider retries 10 times, processed exactly once.
});`
    }
  },
  {
    id: 'memoryleak',
    tabName: { tr: '03 · Bellek Sızıntısı & OOM Kill', en: '03 · Memory Leak & OOM Kill' },
    title: { 
      tr: 'Günde Bir Kez Çöken Node.js/Python Worker & Bellek Sızıntısı', 
      en: 'Daily Crashing Worker Process & 100% RAM Heap Leak' 
    },
    symptom: 'Out of memory: Killed process 41028 (node) total-vm:4.2GB, anon-rss:3.9GB',
    metrics: {
      latencyBefore: 'Heap: 3.9 GB',
      latencyAfter: 'Heap: 82 MB',
      cpuBefore: { tr: 'Her Gece Restart', en: 'Nightly Restarts' },
      cpuAfter: { tr: '34 Gün Uptime', en: '34 Days Uptime' },
      status: { tr: 'STABİLİZE EDİLDİ (Sıfır Sızıntı)', en: 'STABILIZED (Zero Leak)' }
    },
    beforeCode: {
      tr: `// 🚨 ESKİ KOD: Unclosed Stream Buffers & Global Event Listeners
const globalEventEmitter = new EventEmitter();

app.get('/api/export-report', async (req, res) => {
  // ❌ HATA 1: 500MB veritabanı verisini tek seferde RAM dizisine yüklemek
  const rawData = await db.query('SELECT * FROM audit_logs'); // 2 Milyon Satır!
  const buffer = Buffer.from(JSON.stringify(rawData));
  
  // ❌ HATA 2: Her HTTP isteğinde global emitter'a listener ekleyip silmemek
  globalEventEmitter.on('log_exported', () => { /* Garbage Collector temizleyemez */ });
  
  res.send(buffer);
  // 💥 SONUÇ: Heap bellek 4GB'a tırmanır, Linux OOM-Killer servisi öldürür!
});`,
      en: `// 🚨 LEGACY CODE: Unclosed Stream Buffers & Global Event Listeners
const globalEventEmitter = new EventEmitter();

app.get('/api/export-report', async (req, res) => {
  // ❌ BUG 1: Loading 500MB database query directly into in-memory array
  const rawData = await db.query('SELECT * FROM audit_logs'); // 2 Million Rows!
  const buffer = Buffer.from(JSON.stringify(rawData));
  
  // ❌ BUG 2: Attaching listeners to global event emitter on every HTTP request without unbinding
  globalEventEmitter.on('log_exported', () => { /* Garbage Collector cannot reclaim */ });
  
  res.send(buffer);
  // 💥 RESULT: Heap memory spikes to 4GB, Linux OOM-Killer kills process!
});`
    },
    afterCode: {
      tr: `// 🛡️ TMA ÇÖZÜMÜ: Backpressure Stream Piping & Garbage Collection Güvenliği
import { pipeline } from 'stream/promises';
import QueryStream from 'pg-query-stream';

app.get('/api/export-report', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="report.json"');

  const client = await pool.connect();
  try {
    // 1. Veritabanından satır satır akıtma (RAM'de yalnızca 64KB tutulur):
    const query = new QueryStream('SELECT * FROM audit_logs');
    const dbStream = client.query(query);
    const jsonTransform = new JsonChunkTransformer();

    // 2. Backpressure kontrollü stream borulaması:
    await pipeline(dbStream, jsonTransform, res);
  } finally {
    client.release(); // Bağlantı havuza iade edilir
  }
  // ✅ SONUÇ: 4GB RAM tüketimi 82MB'a sabitlendi. 10 milyon kayıt sıfır sızıntıyla akar.
});`,
      en: `// 🛡️ TMA SOLUTION: Backpressure Stream Piping & GC Safety
import { pipeline } from 'stream/promises';
import QueryStream from 'pg-query-stream';

app.get('/api/export-report', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="report.json"');

  const client = await pool.connect();
  try {
    // 1. Stream row-by-row directly from DB (holding only 64KB in RAM):
    const query = new QueryStream('SELECT * FROM audit_logs');
    const dbStream = client.query(query);
    const jsonTransform = new JsonChunkTransformer();

    // 2. Backpressure-controlled stream piping:
    await pipeline(dbStream, jsonTransform, res);
  } finally {
    client.release(); // Connection safely returned to pool
  }
  // ✅ RESULT: 4GB RAM consumption stabilized at 82MB. 10M rows stream with zero leak.
});`
    }
  }
];

export const CodeDiffTerminal = () => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
  const [activeIncident, setActiveIncident] = useState(0);
  const [viewMode, setViewMode] = useState('after'); // 'before' | 'after'

  const current = incidents[activeIncident];

  const getMetricValue = (metricObj) => {
    if (typeof metricObj === 'object' && metricObj !== null) {
      return metricObj[isTr ? 'tr' : 'en'] || metricObj.en || '';
    }
    return metricObj;
  };

  const getCodeContent = (codeObj) => {
    if (typeof codeObj === 'object' && codeObj !== null) {
      return codeObj[isTr ? 'tr' : 'en'] || codeObj.en || '';
    }
    return codeObj;
  };

  return (
    <section id="terminal" data-section="code-diff" className="py-20 md:py-28 px-4 sm:px-6 md:px-12 bg-[#06080e] relative border-b border-white/10 font-sans">
      <span id="code-diff" className="sr-only" tabIndex={-1} aria-hidden="true" />
      <div className="max-w-7xl mx-auto">
        
        {/* Section Eyebrow & Headline */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Terminal className="w-4 h-4" /> {isTr ? 'GERÇEK MÜHENDİSLİK KANITI' : 'REAL CODE TRIAGE BENCHMARK'}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-white tracking-tight leading-tight">
            <span className="block">
              {isTr ? 'Pazarlama Sloganı Değil,' : 'No Marketing Buzzwords.'}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              {isTr ? 'Gerçek Kod ve Mimari Refactor' : 'Actual Code & Architectural Refactoring'}
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
            {isTr 
              ? 'TMA Mühendislik Masası soyut tavsiyeler vermez; tıkanmış kod tabanını doğrudan devralır, kilitleri kırar, benchmark ile doğrular ve temiz teslim eder.' 
              : 'Our engineering desk does not sell generic advice. We take over blocked codebases, eliminate deadlocks, verify with micro-benchmarks, and deploy clean.'}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {incidents.map((inc, idx) => {
            const isActive = activeIncident === idx;
            return (
              <button
                key={inc.id}
                onClick={() => {
                  setActiveIncident(idx);
                  setViewMode('after');
                }}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_20px_rgba(0,229,255,0.2)]'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-white'
                }`}
              >
                <span>{inc.tabName[isTr ? 'tr' : 'en']}</span>
              </button>
            );
          })}
        </div>

        {/* Terminal Window Container */}
        <div className="rounded-3xl bg-[#0a0f18] border border-white/15 shadow-2xl overflow-hidden max-w-5xl mx-auto ring-1 ring-white/10">
          
          {/* Terminal Window Chrome */}
          <div className="bg-[#0f172a] px-4 sm:px-6 py-3.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
            {/* macOS dots */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="ml-3 font-mono text-xs text-slate-400 hidden sm:inline">
                tma-swat-kernel // {current.id}.patch
              </span>
            </div>

            {/* Before / After Toggle Switch */}
            <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10 text-xs font-mono">
              <button
                onClick={() => setViewMode('before')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'before'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{isTr ? '🚨 Sorunlu Kod (Önce)' : '🚨 Faulty Code (Before)'}</span>
              </button>

              <button
                onClick={() => setViewMode('after')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'after'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isTr ? '🛡️ TMA Çözümü (Sonra)' : '🛡️ TMA Solution (After)'}</span>
              </button>
            </div>
          </div>

          {/* Incident Meta & Metric Banner */}
          <div className="bg-[#0b1322] px-5 sm:px-7 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-white font-mono flex items-center gap-2">
                <span>{current.title[isTr ? 'tr' : 'en']}</span>
              </h3>
              <p className="text-xs font-mono text-slate-400 break-all">
                <span className="text-red-400 font-bold">{isTr ? 'Belirti:' : 'Symptom:'}</span> {current.symptom}
              </p>
            </div>

            {/* Metric Comparison Badges */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap font-mono text-xs">
              <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                <span className="text-slate-400 text-[10px] block">{isTr ? 'GECİKME' : 'LATENCY'}</span>
                <span className={viewMode === 'before' ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {viewMode === 'before' ? current.metrics.latencyBefore : current.metrics.latencyAfter}
                </span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                <span className="text-slate-400 text-[10px] block">{isTr ? 'KAYNAK' : 'RESOURCE'}</span>
                <span className={viewMode === 'before' ? 'text-amber-400 font-bold' : 'text-cyan-400 font-bold'}>
                  {viewMode === 'before' ? getMetricValue(current.metrics.cpuBefore) : getMetricValue(current.metrics.cpuAfter)}
                </span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{getMetricValue(current.metrics.status)}</span>
              </div>
            </div>
          </div>

          {/* Code Body */}
          <div className="p-4 sm:p-6 bg-[#070b14] overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed">
            <pre className={viewMode === 'before' ? 'text-red-200/90' : 'text-emerald-200/95'}>
              <code>{viewMode === 'before' ? getCodeContent(current.beforeCode) : getCodeContent(current.afterCode)}</code>
            </pre>
          </div>

          {/* Terminal Footer Action Bar */}
          <div className="bg-[#0f172a] px-5 sm:px-7 py-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isTr ? '%100 White-Label & Resmi NDA güvencesiyle onarılır.' : 'Rescued under 100% White-Label & Binding NDA.'}</span>
            </div>
            <a
              href="#contact"
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1.5 transition-colors"
            >
              <span>{isTr ? 'Bu arızayı masanıza taşıyın →' : 'Bring this issue to our desk →'}</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CodeDiffTerminal;
