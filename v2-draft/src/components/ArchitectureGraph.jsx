import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Database, ShieldCheck, Zap, Activity, Cpu, ArrowRight, CheckCircle2, Lock, Radio, Layers, Server, Globe } from 'lucide-react';

const ArchitectureGraph = () => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';
  const [selectedNode, setSelectedNode] = useState(2); // Default to TMA Core

  const nodes = [
    {
      id: 0,
      title: { tr: 'İstemci & Ajans Müşterileri', en: 'Client & User Traffic' },
      badge: 'TRAFFIC SOURCE',
      icon: Globe,
      desc: { 
        tr: 'Yüksek hacimli web, mobil (iOS/Android) ve 3. parti API istekleri.', 
        en: 'High-volume web, mobile (iOS/Android) and 3rd party API requests.' 
      },
      color: 'border-blue-500/40 text-blue-400 bg-blue-500/10'
    },
    {
      id: 1,
      title: { tr: 'Next.js Edge & CDN Katmanı', en: 'Next.js Edge & Global CDN' },
      badge: 'EDGE ROUTING',
      icon: Layers,
      desc: { 
        tr: 'SSR, ISR, küresel önbellek ve DDoS kalkanı ile ilk yükleme süresi 0.35s.', 
        en: 'SSR, ISR, global caching and DDoS mitigation with 0.35s first contentful paint.' 
      },
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10'
    },
    {
      id: 2,
      title: { tr: 'TMA SWAT & FastAPI Core', en: 'TMA SWAT & FastAPI Core' },
      badge: 'CORE ENGINE',
      icon: Cpu,
      desc: { 
        tr: 'Asenkron mikroservisler, yetkilendirme, iş mantığı ve acil hotfix koruması.', 
        en: 'Asynchronous microservices, authentication, business logic, and hotfix isolation.' 
      },
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 3,
      title: { tr: 'PostgreSQL & Redis DB Cluster', en: 'PostgreSQL & Redis DB Cluster' },
      badge: 'DATA INTEGRITY',
      icon: Database,
      desc: { 
        tr: 'B-Tree indeksleme, bağlantı havuzlama (Pooling) ve mikro-saniye caching.', 
        en: 'B-Tree indexed partitions, connection pooling, and sub-millisecond in-memory cache.' 
      },
      color: 'border-purple-500/40 text-purple-400 bg-purple-500/10'
    },
    {
      id: 4,
      title: { tr: 'AI Engine & Ödeme Webhookları', en: 'AI Engine & Payment Webhooks' },
      badge: 'ASYNC WORKERS',
      icon: Server,
      desc: { 
        tr: "OpenAI/LLM otomasyonları, Stripe/iyzico idempotent güvenli ödeme pipeline'ları.", 
        en: 'OpenAI/LLM pipelines, Stripe/iyzico idempotent atomic webhook queues.' 
      },
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/10'
    }
  ];

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 md:px-12 bg-[#080b11] relative border-b border-white/10 overflow-hidden">
      
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Zap className="w-4 h-4" /> {isTr ? 'GÖRSEL MİMARİ & VERİ AKIŞI' : 'VISUAL ARCHITECTURE & DATA FLOW'}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-white tracking-tight leading-tight">
            <span className="block">
              {isTr ? 'Kriz Geçirmez, Yüksek Hızlı' : 'Resilient, High-Speed'}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
              {isTr ? "Mühendislik Veri Pipeline'ı" : 'Engineering Data Pipeline'}
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
            {isTr 
              ? 'TMA olarak inşa ettiğimiz ve kurtardığımız sistemlerin arka plandaki canlı veri akışı ve mimari düğümleri.' 
              : 'The live architectural flow and resilient nodes behind the systems we engineer and rescue.'}
          </p>
        </div>

        {/* Interactive Architecture Flow Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-8">
          {nodes.map((node, idx) => {
            const Icon = node.icon;
            const isSelected = selectedNode === node.id;
            return (
              <div key={node.id} className="relative flex flex-col">
                <button
                  onClick={() => setSelectedNode(node.id)}
                  className={`p-4 sm:p-5 lg:p-4 xl:p-5 rounded-2xl sm:rounded-3xl text-left border transition-all duration-300 cursor-pointer flex-1 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#151f33] to-[#0c121e] border-cyan-400 shadow-[0_0_30px_rgba(0,229,255,0.25)] ring-1 ring-cyan-400/50'
                      : 'bg-[#111827]/80 border-white/10 hover:border-white/25 hover:bg-[#151f33]/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center border ${node.color}`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <span className="text-[9.5px] sm:text-[10px] font-mono font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        {node.badge}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 leading-snug">
                      {node.title[isTr ? 'tr' : 'en']}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {node.desc[isTr ? 'tr' : 'en']}
                    </p>
                  </div>
                </button>

                {/* Arrow Connector on desktop between columns */}
                {idx < nodes.length - 1 && (
                  <div className="hidden lg:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-cyan-500 text-bg-dark items-center justify-center font-bold text-xs shadow-lg shadow-cyan-500/50 pointer-events-none">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Node Telemetry Detail Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c121e] border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                TELEMETRY INSPECTOR // NODE_ID: 0{selectedNode + 1}
              </span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white">
              {nodes[selectedNode].title[isTr ? 'tr' : 'en']}
            </h4>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {nodes[selectedNode].desc[isTr ? 'tr' : 'en']}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ArchitectureGraph;
