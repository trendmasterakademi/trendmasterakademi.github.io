import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Code2, ArrowRight, CheckCircle2, AlertTriangle, Sparkles, Terminal, FileCode, Check } from 'lucide-react';

const diffCases = [
  {
    id: 'sql',
    title: { tr: 'Kilitlenen Yavaş SQL Sorgusu', en: 'Deadlocking Slow SQL Query' },
    badge: { tr: '1450ms ➔ 8ms (%99.4 Hızlanma)', en: '1450ms ➔ 8ms (99.4% Faster)' },
    filename: 'orders_query.sql',
    lang: 'sql',
    beforeCode: `-- ❌ [KRİZ: 1450ms Latency - Full Table Scan & Deadlock]
SELECT o.*, u.email, p.status, c.total_amount
FROM orders o
JOIN users u ON u.id = o.user_id
JOIN payments p ON p.order_id = o.id
JOIN cart_items c ON c.cart_id = o.cart_id
WHERE o.status = 'pending' AND o.created_at >= NOW() - INTERVAL '30 days'
ORDER BY o.created_at DESC;`,
    afterCode: `-- ✅ [TMA HOTFIX: 8ms - B-Tree Composite Index & CTE Stream]
WITH active_orders AS (
  SELECT id, user_id, cart_id, created_at
  FROM orders
  WHERE status = 'pending' AND created_at >= NOW() - INTERVAL '30 days'
  ORDER BY created_at DESC LIMIT 50
)
SELECT ao.*, u.email, p.status
FROM active_orders ao
JOIN users u USING (user_id)
LEFT JOIN payments p ON p.order_id = ao.id;`
  },
  {
    id: 'webhook',
    title: { tr: 'Kopuk Stripe / iyzico Webhook & Deadlock', en: 'Broken Stripe / iyzico Webhook' },
    badge: { tr: 'Sıfır Veri Kaybı · İdempotent', en: 'Zero Data Loss · Idempotent' },
    filename: 'stripe_webhook.ts',
    lang: 'typescript',
    beforeCode: `// ❌ [KRİZ: Unhandled Exception & Double-Charge Race Condition]
app.post("/webhook", async (req, res) => {
  const event = req.body;
  if (event.type === "payment_intent.succeeded") {
    // ⚠️ Hata: İmza doğrulaması yok, yinelenen event kontrolü yok!
    await db.orders.update({ status: "paid" });
    await sendInvoice(event.data.object);
  }
  res.json({ received: true });
});`,
    afterCode: `// ✅ [TMA HOTFIX: HMAC Verify & Idempotency Key Locked]
app.post("/webhook", async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]!;
  const event = stripe.webhooks.constructEvent(req.rawBody, sig, secret);
  
  // Redis Atomic Lock ile çift işlem ve deadlock engelleme
  const acquired = await redis.set(\`lock:\${event.id}\`, "1", "NX", "EX", 60);
  if (!acquired) return res.status(200).json({ duplicate: true });

  await db.$transaction(async (tx) => {
    await tx.orders.update({ where: { id }, data: { status: "PAID" } });
  });
  return res.status(200).json({ processed: true });
});`
  },
  {
    id: 'react',
    title: { tr: 'React Sonsuz Döngü & Bellek Sızıntısı', en: 'React Infinite Loop & Memory Leak' },
    badge: { tr: '0 FPS Drop · Stabil Render', en: '0 FPS Drop · Stable Render' },
    filename: 'DashboardTelemetry.tsx',
    lang: 'tsx',
    beforeCode: `// ❌ [KRİZ: Her renderda tetiklenen sonsuz socket bağlantısı]
export function Dashboard() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const ws = new WebSocket("wss://api.client.com/stream");
    ws.onmessage = (e) => setData([...data, JSON.parse(e.data)]);
    // ⚠️ Hata: Dependency array eksik, cleanup fonksiyonu yok (Memory Leak)!
  });
  return <DataGrid rows={data} />;
}`,
    afterCode: `// ✅ [TMA HOTFIX: Web Worker & Stable Clean Event Emitter]
export function Dashboard() {
  const [data, setData] = useState<Metric[]>([]);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onmessage = (e) => {
      const payload = JSON.parse(e.data);
      setData(prev => (prev.length > 500 ? [...prev.slice(1), payload] : [...prev, payload]));
    };
    return () => { ws.close(1000, "Clean unmount"); }; // ✅ Bellek sızıntısı önlendi
  }, []);

  return <MemoizedDataGrid rows={data} />;
}`
  }
];

const CodeDiffShowcase = () => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';
  const [activeTab, setActiveTab] = useState('sql');
  const [viewMode, setViewMode] = useState('split'); // 'split' or 'fixed'

  const currentDiff = diffCases.find(c => c.id === activeTab) || diffCases[0];

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 md:px-12 bg-[#090d15] relative border-b border-white/10 overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <Code2 className="w-4 h-4" /> {isTr ? 'CANLI KOD MÜDAHALE & DIFF VİTRİNİ' : 'LIVE CODE DIFF & HOTFIX SHOWCASE'}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-white tracking-tight leading-tight">
              <span className="block">
                {isTr ? 'Spagetti Kodu Nasıl' : 'How We Turn Spaghetti Code Into'}
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                {isTr ? 'Yüksek Hızlı Mimarilere Dönüştürüyoruz?' : 'High-Performance Architecture.'}
              </span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {isTr 
                ? 'Gerçek kriz senaryolarından derlenmiş öncesi ve sonrası canlı kod örnekleri. Hataları dakikalar içinde izole edip temiz mühendislikle ayağa kaldırıyoruz.' 
                : 'Real-world before/after code transformations. We isolate bottlenecks within minutes and deploy robust clean engineering.'}
            </p>
          </div>
        </div>

        {/* Case Selection Tabs */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {diffCases.map((c) => {
            const isSelected = activeTab === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveTab(c.id)}
                className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(0,229,255,0.2)]'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>{c.title[isTr ? 'tr' : 'en']}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-emerald-400 border border-emerald-500/30 ml-1">
                  {c.badge[isTr ? 'tr' : 'en']}
                </span>
              </button>
            );
          })}
        </div>

        {/* IDE Diff Viewer Window */}
        <div className="rounded-3xl bg-[#0c1017] border border-white/15 shadow-2xl overflow-hidden">
          
          {/* Editor Header Bar */}
          <div className="bg-[#111622] px-5 py-3.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              </div>
              <span className="text-xs font-mono text-slate-400 ml-2">
                src/core/hotfix/<strong>{currentDiff.filename}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-red-500/15 text-red-400 border border-red-500/30 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {isTr ? 'Öncesi (Kriz)' : 'Before (Outage)'}
              </span>
              <span className="text-slate-500">➔</span>
              <span className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {isTr ? 'TMA Hotfix (Çözüm)' : 'TMA Hotfix (Fixed)'}
              </span>
            </div>
          </div>

          {/* Code Panels: Left (Before) vs Right (After) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10 font-mono text-xs sm:text-sm">
            
            {/* Left: Broken Code */}
            <div className="p-6 sm:p-7 bg-[#0b0e14] space-y-3 relative overflow-x-auto">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-red-500/20 text-red-400">
                <span className="font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  {isTr ? 'Mevcut Hatalı / Kilitlenen Kod' : 'Legacy / Broken Implementation'}
                </span>
                <span className="text-[11px] text-slate-500">STATUS: RECURRING_ERROR</span>
              </div>
              <pre className="text-red-300/90 leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-red-500 selection:text-white">
                <code>{currentDiff.beforeCode}</code>
              </pre>
            </div>

            {/* Right: TMA Hotfix Clean Code */}
            <div className="p-6 sm:p-7 bg-[#081216]/60 space-y-3 relative overflow-x-auto">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-500/20 text-emerald-400">
                <span className="font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  {isTr ? 'TMA Mühendisliği & Hotfix Sonrası' : 'TMA Clean Refactored Code'}
                </span>
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                  {currentDiff.badge[isTr ? 'tr' : 'en']}
                </span>
              </div>
              <pre className="text-emerald-300/95 leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-emerald-500 selection:text-black">
                <code>{currentDiff.afterCode}</code>
              </pre>
            </div>

          </div>

          {/* Footer Benchmark Bar */}
          <div className="bg-[#0e131d] px-6 py-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" /> Zero Deadlock Guaranteed
              </span>
              <span className="hidden sm:inline text-slate-600">|</span>
              <span className="hidden sm:inline text-slate-400">
                {isTr ? 'Developer Tarafından Doğrulandı' : 'Verified by Developer'}
              </span>
            </div>
            <a 
              href="#contact"
              className="text-cyan-400 hover:text-white font-bold flex items-center gap-1 transition-colors"
            >
              <span>{isTr ? 'Kodunuzu İncelememizi İsteyin' : 'Request Codebase Triage'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CodeDiffShowcase;
