import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, Zap, ArrowRight, ShieldCheck, Terminal, FileCode, 
  CheckCircle2, Play, Sparkles, Copy, Check, ShieldAlert, Cpu, Clock, Calendar
} from 'lucide-react';
import { getCalendlyUrl } from '../utils/calendly';

const ideFiles = [
  {
    name: 'incident_rescue_report.json',
    icon: '📄',
    lang: 'json',
    badge: 'Post-Mortem / Rescue',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    lines: [
      { num: 1, text: '{', color: 'text-slate-400' },
      { num: 2, text: '  "incident_id": "TMA-INC-2026-8842",', color: 'text-cyan-300 font-semibold' },
      { num: 3, text: '  "agency_tier": "B2B White-Label Solution Partner",', color: 'text-slate-300' },
      { num: 4, text: '  "client_industry": "E-Commerce / FinTech High-Scale MVP",', color: 'text-slate-300' },
      { num: 5, text: '  "deadline_status": "🚨 CRITICAL: T-36h Before Public Launch",', color: 'text-amber-300 font-semibold' },
      { num: 6, text: '  "sos_dispatched_at": "02:14 AM [UTC+3]",', color: 'text-slate-400' },
      { num: 7, text: '  "tma_squad_response": "02:22 AM (8 min triage)",', color: 'text-emerald-300 font-bold' },
      { num: 8, text: '', color: '' },
      { num: 9, text: '  "crisis_diagnosis": {', color: 'text-yellow-300' },
      { num: 10, text: '    "symptom": "504 Gateway Timeout & PostgreSQL Deadlock",', color: 'text-red-300' },
      { num: 11, text: '    "root_cause": "N+1 Cascade Query + Stripe Webhook Race Condition",', color: 'text-red-400' },
      { num: 12, text: '    "previous_state": "Developer disengaged from project without handover"', color: 'text-slate-400' },
      { num: 13, text: '  },', color: 'text-yellow-300' },
      { num: 14, text: '', color: '' },
      { num: 15, text: '  "rescue_actions_applied": [', color: 'text-cyan-300' },
      { num: 16, text: '    "✅ Isolated failing repository into container sandbox",', color: 'text-emerald-300' },
      { num: 17, text: '    "✅ Applied Redis distributed mutex (atomic idempotency lock)",', color: 'text-emerald-300' },
      { num: 18, text: '    "✅ Added PostgreSQL composite index (latency: 1450ms ➔ 3.8ms)",', color: 'text-emerald-300' },
      { num: 19, text: '    "✅ Ran chaos stress-test: 15,000 req/s @ 0.00% packet loss"', color: 'text-emerald-300' },
      { num: 20, text: '  ],', color: 'text-cyan-300' },
      { num: 21, text: '', color: '' },
      { num: 22, text: '  "post_mortem_verdict": {', color: 'text-cyan-400' },
      { num: 23, text: '    "launch_deadline": "🟢 SAVED ON SCHEDULE (12h headroom)",', color: 'text-emerald-300 font-bold' },
      { num: 24, text: '    "data_loss": 0,', color: 'text-blue-300' },
      { num: 25, text: '    "agency_reputation": "100% PROTECTED (Client unaware of crisis)",', color: 'text-emerald-400 font-bold' },
      { num: 26, text: '    "status": "INCIDENT_RESOLVED_PRODUCTION_LIVE"', color: 'text-cyan-300 font-semibold' },
      { num: 27, text: '  }', color: 'text-cyan-400' },
      { num: 28, text: '}', color: 'text-slate-400' }
    ]
  },
  {
    name: 'hotfix_atomic_patch.ts',
    icon: '⚡',
    lang: 'typescript',
    badge: 'Stripe / Idempotent Lock',
    badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    lines: [
      { num: 1, text: '// 🚀 TMA SWAT Production Hotfix: Atomic Webhook & Lock', color: 'text-slate-500 italic' },
      { num: 2, text: 'import { Request, Response } from "express";', color: 'text-purple-300' },
      { num: 3, text: 'import { redis, db, logger } from "@tma/agency-core";', color: 'text-purple-300' },
      { num: 4, text: '', color: '' },
      { num: 5, text: 'export async function handlePaymentWebhook(req: Request, res: Response) {', color: 'text-blue-300' },
      { num: 6, text: '  const eventId = req.headers["stripe-event-id"] as string;', color: 'text-slate-300' },
      { num: 7, text: '', color: '' },
      { num: 8, text: '  // [TMA FIX]: Distributed Mutex prevents race-condition double charge', color: 'text-emerald-400/80 italic' },
      { num: 9, text: '  const lock = await redis.set(`lock:${eventId}`, "1", "NX", "EX", 30);', color: 'text-cyan-300 font-semibold' },
      { num: 10, text: '  if (!lock) return res.status(200).json({ status: "ALREADY_HANDLED" });', color: 'text-amber-300' },
      { num: 11, text: '', color: '' },
      { num: 12, text: '  try {', color: 'text-purple-400' },
      { num: 13, text: '    const order = await db.transaction(async (tx) => {', color: 'text-slate-200' },
      { num: 14, text: '      return await tx.orders.update({', color: 'text-slate-300' },
      { num: 15, text: '        where: { id: eventId, status: "PENDING" },', color: 'text-slate-300' },
      { num: 16, text: '        data: { status: "PAID", rescuedAt: new Date() }', color: 'text-emerald-300 font-semibold' },
      { num: 17, text: '      });', color: 'text-slate-300' },
      { num: 18, text: '    }, { timeout: 3000 }); // strict 3s timeout avoids thread lock', color: 'text-slate-400' },
      { num: 19, text: '', color: '' },
      { num: 20, text: '    return res.status(200).json({ success: true, rescuedBy: "TMA_SWAT" });', color: 'text-emerald-300 font-bold' },
      { num: 21, text: '  } catch (err) {', color: 'text-purple-400' },
      { num: 22, text: '    logger.error("[TMA HOTFIX] Gracefully caught deadlock:", err);', color: 'text-red-400' },
      { num: 23, text: '    return res.status(500).json({ error: "SAFE_RETRY_SCHEDULED" });', color: 'text-amber-300' },
      { num: 24, text: '  }', color: 'text-purple-400' },
      { num: 25, text: '}', color: 'text-blue-300' }
    ]
  },
  {
    name: 'triage_audit.log',
    icon: '🔍',
    lang: 'log',
    badge: 'Audit Stream / Real-Time',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    lines: [
      { num: 1, text: '[02:14:02] [TMA-INGEST] 🚨 P1 Severity SOS received from Partner Agency', color: 'text-red-400 font-semibold' },
      { num: 2, text: '[02:16:45] [TRIAGE] 42,000 LOC analyzed with TMA AST Diagnostic Scanner', color: 'text-slate-400' },
      { num: 3, text: '[02:18:10] [ALERT] Deadlock detected in /api/checkout.ts:88 (Lock: 99.4%)', color: 'text-amber-300 font-semibold' },
      { num: 4, text: '[02:24:33] [SANDBOX] Reproduced deadlock under 200 concurrent simulated checkouts', color: 'text-cyan-300' },
      { num: 5, text: '[02:37:12] [PATCH] Hotfix #hotfix/tma-deadlock-cure compiled and verified', color: 'text-blue-300' },
      { num: 6, text: '[02:41:50] [CI/CD] 84 unit tests & 12 integration tests PASSED (0 failures)', color: 'text-emerald-300' },
      { num: 7, text: '[02:46:00] [STRESS_TEST] 15,000 req/s simulated -> 0 errors, p99 latency: 18ms', color: 'text-emerald-400 font-semibold' },
      { num: 8, text: '[02:48:15] [DEPLOY] Blue-Green Canary deployed to AWS ECS Cluster', color: 'text-purple-300' },
      { num: 9, text: '[02:50:00] [VERDICT] 🟢 INCIDENT CLOSED. Agency client launch saved on schedule.', color: 'text-emerald-400 font-bold' }
    ]
  },
  {
    name: 'agency_sla_cert.env',
    icon: '🛡️',
    lang: 'env',
    badge: '100% White-Label NDA',
    badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    lines: [
      { num: 1, text: '# 🛡️ TMA B2B White-Label & SLA Standards', color: 'text-slate-500 italic' },
      { num: 2, text: 'AGENCY_PARTNER_MODE=TRUE', color: 'text-cyan-300 font-semibold' },
      { num: 3, text: 'WHITE_LABEL_PROTECTION=STRICT_NDA', color: 'text-emerald-300 font-semibold' },
      { num: 4, text: 'CLIENT_FACING_COMMUNICATION=NEVER', color: 'text-emerald-400 font-bold' },
      { num: 5, text: 'TRIAGE_RESPONSE_SLA=0_TO_2_HOURS', color: 'text-amber-300 font-semibold' },
      { num: 6, text: 'ENGINEERING_CADRE=SENIOR_FULLSTACK_SWAT', color: 'text-purple-300' },
      { num: 7, text: 'CODE_QUALITY_TEST_COVERAGE=100%', color: 'text-blue-300 font-semibold' },
      { num: 8, text: 'DATA_LOSS_TOLERANCE=0.00%', color: 'text-emerald-300 font-semibold' },
      { num: 9, text: 'STATUS=READY_FOR_NEXT_DISPATCH', color: 'text-cyan-400 font-bold' }
    ]
  }
];

// Clean, non-intrusive floating technology badges contained strictly within the IDE perimeter
const floatingBadges = [
  { text: '{ async / await }', color: 'text-cyan-300 border-cyan-500/50 bg-cyan-500/20 shadow-cyan-500/30', pos: '-top-3.5 left-4 sm:left-6' },
  { text: 'PostgreSQL::DeadlockFixed', color: 'text-emerald-300 border-emerald-500/50 bg-emerald-500/20 shadow-emerald-500/30', pos: '-top-3.5 right-4 sm:right-6' },
  { text: 'FastAPI::HighConcurrency', color: 'text-teal-300 border-teal-500/50 bg-teal-500/20 shadow-teal-500/30', pos: '-bottom-3.5 left-4 sm:left-6' },
  { text: 'Redis::DistributedMutex', color: 'text-amber-300 border-amber-500/50 bg-amber-500/20 shadow-amber-500/30', pos: '-bottom-3.5 right-4 sm:right-6' }
];

const Hero = () => {
  const { t, i18n } = useTranslation();
  const isTr = i18n.language !== 'en';
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeFile = ideFiles[selectedFileIdx];

  const handleCopyCode = () => {
    const rawText = activeFile.lines.map(l => l.text).join('\n');
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="hero" className="relative pt-20 pb-14 sm:pt-28 md:pt-32 md:pb-24 lg:pt-32 overflow-hidden px-4 sm:px-6 md:px-12 w-full max-w-full">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] sm:max-w-[800px] h-[450px] sm:h-[700px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/12 to-purple-600/15 rounded-full blur-[110px] sm:blur-[140px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start w-full">
        
        {/* Left Column: Value Proposition */}
        <div 
          
          
          
          className="lg:col-span-6 flex flex-col gap-5 sm:gap-6 self-start"
        >
          {/* Studio & Availability Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs sm:text-sm font-mono font-bold shadow-[0_0_20px_rgba(0,229,255,0.15)]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>B2B Technical SWAT & White-Label Engineering</span>
            </div>
            <span className="text-xs font-mono text-slate-400">İzmir · Uzaktan (TR / EN)</span>
          </div>
          
          {/* Main Hook Headline: Static, Crisp, Zero Delay */}
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[2.6rem] xl:text-[3rem] font-black font-mono leading-[1.18] tracking-tight text-white">
            <span className="block text-slate-200">
              {isTr ? 'Yazılımcısı Projeden Çekilmiş' : 'For Agencies with Disengaged Developers:'}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">
              {isTr ? 'Ajanslar İçin:' : 'Code Taken Over & Rescued,'}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-300 to-amber-400 text-[0.88em]">
              {isTr ? 'Kodu Devralır, Ajansınız Adına Eksiksiz Teslim Ederiz.' : 'Delivered Flawlessly Under Your Agency Brand.'}
            </span>
          </h1>
          
          {/* Body Description */}
          <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
            {isTr 
              ? 'Bir projede teknik olarak tıkandığınızda, teslim tarihi yaklaştığında veya müşteriniz özel bir SaaS mimarisi istediğinde: %100 White-Label, resmi NDA ve doğrudan kıdemli mühendislik masası.' 
              : 'When you are technically blocked, facing tight delivery crunches, or building custom SaaS pipelines: 100% White-Label, binding NDA protection, and direct senior engineering execution.'}
          </p>

          {/* Above-the-fold Guarantees */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-mono text-slate-300 py-1">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> %100 White-Label
            </span>
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Resmi NDA Güvencesi
            </span>
            <span className="flex items-center gap-1.5 text-amber-300 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Tam Kod Mülkiyeti
            </span>
            <span className="flex items-center gap-1.5 text-purple-300 font-bold">
              <CheckCircle2 className="w-4 h-4" /> İlk Teşhis Ücretsiz
            </span>
          </div>
          
          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 w-full sm:w-auto">
            <Link
              to="/crash-test/"
              onClick={() => window.trackEvent && window.trackEvent('crash_test_clicked', { source: 'hero_cta' })}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-bg-dark px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl font-black text-sm sm:text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 min-h-[48px] w-full sm:w-auto text-center"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>{isTr ? 'Kodunuzu 60sn’de Değerlendirin' : 'Evaluate Code in 60s'}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href={getCalendlyUrl('hero')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => window.trackEvent && window.trackEvent('calendar_clicked', { source: 'hero' })}
              className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base border border-white/20 hover:bg-white/5 text-white transition-all flex items-center justify-center gap-2 min-h-[48px] w-full sm:w-auto text-center"
            >
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span>{isTr ? '30 Dakikalık Teknik Tanışma — Takvimden Seçin' : 'Book a 30-Minute Technical Intro'}</span>
            </a>
          </div>

          {/* Quick Trust Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-5 border-t border-white/10 max-w-xl text-center sm:text-left">
            <div>
              <strong className="block text-sm sm:text-lg lg:text-xl font-black text-white">14+ Yıl</strong>
              <span className="text-[10px] sm:text-xs text-slate-400">Yazılım & Mimari Deneyimi</span>
            </div>
            <div>
              <strong className="block text-sm sm:text-lg lg:text-xl font-black text-cyan-400">40+ Repo</strong>
              <span className="text-[10px] sm:text-xs text-slate-400">Devralınan & Çözülen Kod</span>
            </div>
            <div>
              <strong className="block text-sm sm:text-lg lg:text-xl font-black text-emerald-400">0 - 2 Saat</strong>
              <span className="text-[10px] sm:text-xs text-slate-400">Ortalama İlk Triyaj Hızı</span>
            </div>
          </div>
        </div>

        {/* Right Column: Anchored High-Tech Glowing IDE Window */}
        <div 
          
          
          
          className="lg:col-span-6 relative w-full self-start lg:sticky lg:top-28 z-20 mt-4 lg:mt-0"
        >
          {/* Floating High-Tech Holographic Tokens */}
          {floatingBadges.map((badge, idx) => (
            <div
              key={idx}
              
              
              className={`hidden md:inline-flex absolute ${badge.pos} z-30 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border backdrop-blur-2xl shadow-xl pointer-events-none transition-all ${badge.color}`}
            >
              {badge.text}
            </div>
          ))}

          {/* Premium Glowing Ambient Aura Frame */}
          <div className="p-[2px] rounded-2xl sm:rounded-3xl bg-gradient-to-br from-cyan-400/70 via-blue-500/40 via-purple-500/60 to-emerald-400/50 shadow-[0_0_60px_rgba(0,229,255,0.25),0_0_120px_rgba(59,130,246,0.18)] transition-all">
            
            {/* IDE Inner Window Container */}
            <div className="bg-[#080c16]/98 backdrop-blur-2xl rounded-[18px] sm:rounded-[22px] overflow-hidden relative border border-white/5">
              
              {/* Window Title Bar */}
              <div className="bg-[#0f172a]/90 backdrop-blur-md px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] flex-shrink-0"></span>
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)] flex-shrink-0"></span>
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] flex-shrink-0"></span>
                  <span className="text-[11px] sm:text-xs font-mono text-slate-300 ml-1.5 hidden sm:inline font-bold tracking-tight truncate">
                    tma-rescue-deck // incident-#8842
                  </span>
                  <span className="text-[11px] font-mono text-slate-300 ml-1.5 sm:hidden font-bold truncate">
                    tma-swat // ide
                  </span>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
                  <button
                    onClick={handleCopyCode}
                    title="Copy code payload"
                    className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-[11.5px] font-mono text-slate-300 hover:text-cyan-300 bg-white/5 hover:bg-white/10 px-2.5 sm:px-3 py-1 rounded-lg border border-white/15 transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold text-[10px] sm:text-[11.5px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                        <span className="text-[10px] sm:text-[11.5px]">Copy Code</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1 sm:gap-1.5 bg-emerald-500/15 px-2 sm:px-2.5 py-1 rounded-lg border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[9.5px] sm:text-[10.5px] font-mono font-black text-emerald-400">
                      RESOLVED: 200 OK
                    </span>
                  </div>
                </div>
              </div>

              {/* File Tabs */}
              <div className="flex items-center bg-[#0b101d] border-b border-white/10 overflow-x-auto no-scrollbar">
                {ideFiles.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedFileIdx(idx)}
                    className={`px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-mono font-semibold flex items-center gap-1.5 sm:gap-2 border-r border-white/10 transition-all whitespace-nowrap cursor-pointer ${
                      selectedFileIdx === idx
                        ? 'bg-[#080c16] text-cyan-300 border-t-2 border-t-cyan-400 shadow-[inset_0_1px_0_rgba(0,229,255,0.2)]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{file.icon}</span>
                    <span>{file.name}</span>
                  </button>
                ))}
              </div>

              {/* Breadcrumb Path Banner */}
              <div className="bg-[#050811] px-3.5 sm:px-4 py-1.5 border-b border-white/5 flex items-center justify-between text-[10.5px] sm:text-[11px] font-mono text-slate-500">
                <div className="flex items-center gap-1.5 truncate mr-2">
                  <span className="text-slate-600 hidden sm:inline">rescue_vault</span>
                  <span className="hidden sm:inline">/</span>
                  <span className="text-slate-400">incidents</span>
                  <span>/</span>
                  <span className="text-cyan-400 font-semibold truncate">{activeFile.name}</span>
                </div>
                <span className={`px-2 sm:px-2.5 py-0.5 rounded-md text-[9.5px] sm:text-[10.5px] font-mono font-bold border flex-shrink-0 ${activeFile.badgeColor}`}>
                  {activeFile.badge}
                </span>
              </div>

              {/* Code Body with Line Numbers */}
              <div className="font-mono text-[11px] sm:text-[12.5px] leading-relaxed text-slate-300 bg-[#050810] h-[310px] sm:h-[380px] md:h-[430px] lg:h-[440px] overflow-y-auto relative flex">
                
                {/* Line Numbers Column */}
                <div className="w-8 sm:w-10 sm:w-12 py-3 sm:py-4 select-none text-right pr-2 sm:pr-3 text-slate-600 border-r border-white/5 bg-[#04060d] flex-shrink-0 font-mono text-[10px] sm:text-[11px]">
                  {activeFile.lines.map((line, idx) => (
                    <div key={idx} className="h-5 leading-5">
                      {line.num}
                    </div>
                  ))}
                </div>

                {/* Code Lines Content */}
                <div className="p-3 sm:p-4 flex-1 overflow-x-auto">
                  <React.Fragment>
                    <div
                      key={activeFile.name}
                      
                      
                      
                      
                      className="space-y-0"
                    >
                      {activeFile.lines.map((line, idx) => (
                        <div key={idx} className="h-5 leading-5 whitespace-pre font-mono">
                          <span className={line.color || 'text-slate-300'}>{line.text}</span>
                          {idx === activeFile.lines.length - 1 && (
                            <span className="inline-block w-2 h-3.5 bg-cyan-400 animate-pulse ml-1 align-middle"></span>
                          )}
                        </div>
                      ))}
                    </div>
                  </React.Fragment>
                </div>

              </div>

              {/* Bottom Status Bar */}
              <div className="bg-[#0f172a]/95 px-3.5 sm:px-4 py-2 sm:py-2.5 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-emerald-400 flex items-center gap-1.5 text-[10.5px] sm:text-xs font-bold">
                    <CheckCircle2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" /> 100% Rescued
                  </span>
                  <span className="hidden sm:inline text-slate-600">|</span>
                  <span className="hidden sm:inline text-slate-300 text-[11px]">
                    TTR: <strong className="text-cyan-300 font-bold">42m</strong> · Zero Escalation
                  </span>
                </div>

                <Link
                  to="/crash-test/"
                  className="text-cyan-400 hover:text-white font-bold flex items-center gap-1 transition-colors text-[10.5px] sm:text-xs group"
                >
                  <span>Crash Test Simülatörü</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
