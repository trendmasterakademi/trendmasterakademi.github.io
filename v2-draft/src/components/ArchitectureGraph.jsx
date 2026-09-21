import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Database, ShieldCheck, Zap, Activity, Cpu, ArrowRight, CheckCircle2, Lock, Radio, Layers, Server, Globe } from 'lucide-react';
import { isTurkish } from '../i18n';

const ArchitectureGraph = () => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);
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
      color: 'border-[var(--rule)] text-[var(--ink-2)] bg-[var(--surface)]'
    },
    {
      id: 1,
      title: { tr: 'Next.js Edge & CDN Katmanı', en: 'Next.js Edge & Global CDN' },
      badge: 'EDGE ROUTING',
      icon: Layers,
      desc: { 
        tr: 'SSR, ISR, küresel önbellek ve DDoS kalkanı.', 
        en: 'SSR, ISR, global caching and DDoS mitigation.' 
      },
      color: 'border-[var(--rule)] text-[var(--ink)] bg-[var(--surface)]'
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
      color: 'border-[var(--accent)]/30 text-[var(--accent)] bg-[var(--accent-wash)]'
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
      color: 'border-[var(--rule)] text-[var(--sev-ok)] bg-[var(--surface)]'
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
      color: 'border-[var(--rule)] text-[var(--sev-high)] bg-[var(--surface)]'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 md:px-12 bg-[var(--paper)] relative border-b border-[var(--rule)] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink-2)] text-xs font-mono font-medium uppercase tracking-wider mb-4">
            <Zap className="w-4 h-4 text-[var(--accent)]" /> {isTr ? 'GÖRSEL MİMARİ & VERİ AKIŞI' : 'VISUAL ARCHITECTURE & DATA FLOW'}
          </div>
          <h2 className="font-serif text-[26px] sm:text-[30px] font-semibold text-[var(--ink)] tracking-tight leading-tight">
            <span className="block">
              {isTr ? 'Kriz Geçirmez, Yüksek Hızlı' : 'Resilient, High-Speed'}
            </span>
            <span className="block text-[var(--ink)]">
              {isTr ? "Mühendislik Veri Pipeline'ı" : 'Engineering Data Pipeline'}
            </span>
          </h2>
          <p className="text-[var(--ink-2)] text-base sm:text-lg mt-4 leading-relaxed">
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
                  className={`p-4 sm:p-5 rounded-[var(--r-panel)] text-left border transition-all duration-200 cursor-pointer flex-1 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[var(--surface)] border-[var(--accent)] shadow-sm ring-1 ring-[var(--accent)]'
                      : 'bg-[var(--surface)] border-[var(--rule)] hover:border-[var(--rule-strong)]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="w-10 h-10 rounded-[var(--r-control)] flex items-center justify-center border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[12px] font-mono font-medium text-[var(--ink-3)] bg-[var(--paper)] px-2 py-0.5 rounded border border-[var(--rule)]">
                        {node.badge}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-semibold text-[var(--ink)] mb-1.5 leading-snug">
                      {node.title[isTr ? 'tr' : 'en']}
                    </h3>
                    <p className="text-xs text-[var(--ink-2)] leading-relaxed line-clamp-3">
                      {node.desc[isTr ? 'tr' : 'en']}
                    </p>
                  </div>
                </button>

                {/* Arrow Connector on desktop between columns */}
                {idx < nodes.length - 1 && (
                  <div className="hidden lg:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink-2)] items-center justify-center font-bold text-xs pointer-events-none">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Node Telemetry Detail Box */}
        <div className="p-6 sm:p-8 rounded-[var(--r-panel)] bg-[var(--surface)] border border-[var(--rule)] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]"></span>
              <span className="text-xs font-mono font-medium text-[var(--ink-3)] uppercase tracking-widest">
                {isTr ? 'SEÇİLİ KATMAN' : 'SELECTED LAYER'}
              </span>
            </div>
            <h4 className="text-xl sm:text-2xl font-semibold text-[var(--ink)] font-serif">
              {nodes[selectedNode].title[isTr ? 'tr' : 'en']}
            </h4>
            <p className="text-sm text-[var(--ink-2)] max-w-2xl leading-relaxed">
              {nodes[selectedNode].desc[isTr ? 'tr' : 'en']}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ArchitectureGraph;
