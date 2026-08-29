import React from 'react';
import { useTranslation } from 'react-i18next';

const DAL_COLORS = ['#f87171', '#fbbf24', '#a78bfa', '#22d3ee'];

const TeshisDiyagram = ({ baslik, diyagramBaslik, nedenler }) => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';
  const lang = isTr ? 'tr' : 'en';

  const N = (nedenler && nedenler.length) || 3;
  const totalWidth = 820;
  const totalHeight = 452;
  const margin = 30;
  const availableWidth = totalWidth - (2 * margin);
  const gap = N === 2 ? 80 : N === 3 ? 50 : 25;
  const boxWidth = (availableWidth - (N - 1) * gap) / N;

  const colPositions = (nedenler || []).map((_, i) => {
    const x = margin + i * (boxWidth + gap);
    const cx = x + boxWidth / 2;
    return { x, cx, width: boxWidth };
  });

  const firstCx = colPositions.length > 0 ? colPositions[0].cx : 140;
  const lastCx = colPositions.length > 0 ? colPositions[colPositions.length - 1].cx : 680;
  const centerCx = totalWidth / 2;

  const titleSource = diyagramBaslik || baslik;
  const symptomTitle = typeof titleSource === 'object' ? (titleSource[lang] || titleSource.tr) : titleSource;
  const ariaLabel = isTr
    ? `Belirtiden ${N} olası nedene, her nedenin ayırt edici testine ve çözüme giden teşhis akış diyagramı`
    : `Diagnostic flowchart from symptom to ${N} root causes, differential tests, and solutions`;

  return (
    <div className="diyagram-kutu border border-white/10 rounded-2xl bg-white/[0.02] p-2 sm:p-3 overflow-x-auto">
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        role="img"
        aria-label={ariaLabel}
        className="block w-full min-w-[660px] h-auto font-mono text-slate-300 select-none"
      >
        <defs>
          <marker
            id="teshis-ok"
            markerWidth="9"
            markerHeight="9"
            refX="7"
            refY="4.5"
            orient="auto"
          >
            <path d="M0,1 L7,4.5 L0,8 Z" fill="#64748b" />
          </marker>
        </defs>

        <g fontFamily="IBM Plex Mono, JetBrains Mono, monospace" fill="#cbd5e1">
          {/* Top Symptom (Belirti) Box */}
          <rect
            x={centerCx - 125}
            y={12}
            width={250}
            height={46}
            rx={11}
            fill="rgba(248,113,113,.10)"
            stroke="#f87171"
            strokeOpacity={0.45}
          />
          <text
            x={centerCx}
            y={31}
            textAnchor="middle"
            fontSize="9.5"
            fill="#f87171"
            letterSpacing="1.4"
          >
            {isTr ? 'BELİRTİ' : 'SYMPTOM'}
          </text>
          <text
            x={centerCx}
            y={48}
            textAnchor="middle"
            fontSize="13"
            fill="#f1f5f9"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="600"
          >
            {symptomTitle}
          </text>

          {/* Top Bus Lines */}
          <path d={`M${centerCx},58 L${centerCx},86`} stroke="#475569" strokeWidth="1.5" />
          <path d={`M${firstCx},86 L${lastCx},86`} stroke="#475569" strokeWidth="1.5" />
          {colPositions.map((col, idx) => (
            <path
              key={`bus-down-${idx}`}
              d={`M${col.cx},86 L${col.cx},110`}
              stroke="#475569"
              strokeWidth="1.5"
              markerEnd="url(#teshis-ok)"
            />
          ))}

          {/* Causes (Olası Nedenler) */}
          {colPositions.map((col, idx) => {
            const cause = nedenler[idx];
            const color = DAL_COLORS[idx % DAL_COLORS.length];
            const causeName = cause.diyagramAd ? (cause.diyagramAd[lang] || cause.diyagramAd.tr) : (cause.ad[lang] || cause.ad.tr);

            return (
              <g key={`cause-group-${idx}`}>
                <rect
                  x={col.x}
                  y={118}
                  width={col.width}
                  height={52}
                  rx={10}
                  fill={color}
                  fillOpacity={0.08}
                  stroke={color}
                  strokeOpacity={0.35}
                />
                <text
                  x={col.x + 16}
                  y={137}
                  fontSize="9.5"
                  fill={color}
                  letterSpacing="1.2"
                >
                  {cause.harf} · {isTr ? 'OLASI NEDEN' : 'ROOT CAUSE'}
                </text>
                <text
                  x={col.x + 16}
                  y={156}
                  fontSize="12.5"
                  fill="#f1f5f9"
                  fontFamily="Inter, system-ui, sans-serif"
                  fontWeight="600"
                >
                  {causeName}
                </text>

                {/* Line to Test Box */}
                <path
                  d={`M${col.cx},170 L${col.cx},196`}
                  stroke="#475569"
                  strokeWidth="1.5"
                  markerEnd="url(#teshis-ok)"
                />

                {/* Differential Test Box */}
                <rect
                  x={col.x}
                  y={204}
                  width={col.width}
                  height={88}
                  rx={10}
                  fill="rgba(255,255,255,.03)"
                  stroke="#334155"
                />
                <text
                  x={col.x + 16}
                  y={223}
                  fontSize="9.5"
                  fill="#64748b"
                  letterSpacing="1.2"
                >
                  {isTr ? 'AYIRT EDİCİ TEST' : 'DIFFERENTIAL TEST'}
                </text>
                
                {/* Test Text Lines */}
                {cause.diyagramTest && (cause.diyagramTest[lang] || cause.diyagramTest.tr || []).map((line, lineIdx) => {
                  const lineY = 244 + lineIdx * 17;
                  const isHighlight = lineIdx === 1; // Middle line highlighted in teal
                  return (
                    <text
                      key={`test-line-${idx}-${lineIdx}`}
                      x={col.x + 16}
                      y={lineY}
                      fontSize="11.5"
                      fill={isHighlight ? '#2dd4bf' : '#cbd5e1'}
                    >
                      {line}
                    </text>
                  );
                })}

                {/* Line from Test to Solution Bus */}
                <path
                  d={`M${col.cx},292 L${col.cx},326`}
                  stroke="#475569"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

          {/* Solution Bus Line */}
          <path d={`M${firstCx},326 L${lastCx},326`} stroke="#475569" strokeWidth="1.5" />
          {colPositions.map((col, idx) => (
            <path
              key={`sol-bus-down-${idx}`}
              d={`M${col.cx},326 L${col.cx},356`}
              stroke="#475569"
              strokeWidth="1.5"
              markerEnd="url(#teshis-ok)"
            />
          ))}

          {/* Solution Boxes */}
          {colPositions.map((col, idx) => {
            const cause = nedenler[idx];
            return (
              <g key={`solution-group-${idx}`}>
                <rect
                  x={col.x}
                  y={364}
                  width={col.width}
                  height={74}
                  rx={10}
                  fill="rgba(52,211,153,.06)"
                  stroke="#34d399"
                  strokeOpacity={0.30}
                />
                <text
                  x={col.x + 16}
                  y={383}
                  fontSize="9.5"
                  fill="#34d399"
                  letterSpacing="1.2"
                >
                  {cause.harf} {isTr ? 'İSE' : 'THEN'}
                </text>

                {/* Solution Text Lines */}
                {cause.diyagramCozum && (cause.diyagramCozum[lang] || cause.diyagramCozum.tr || []).map((line, lineIdx) => {
                  const lineY = 402 + lineIdx * 16;
                  return (
                    <text
                      key={`sol-line-${idx}-${lineIdx}`}
                      x={col.x + 16}
                      y={lineY}
                      fontSize="11.5"
                      fill="#cbd5e1"
                    >
                      {line}
                    </text>
                  );
                })}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default TeshisDiyagram;
