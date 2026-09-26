import React, { useEffect, useRef } from 'react';

const HomeCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Text data for scenes
    let logs = [
      '[KERNEL] High-Concurrency Connection Pool Alert',
      '[RESOLVED] Transaction deadlock cleared in 24ms',
      '[DB] Lock acquired: pg_catalog.pg_locks bypass applied',
      '[AUTH] 3D Secure Webhook Callback: idempotency validated',
      '[API] Rate limit queue backpressure: status=normal',
      '[CACHE] Memory leak isolated: buffer reference released',
      '[DNS] SSL certificate renew: auto-provisioned'
    ];
    let terms = [
      'Deadlock', 'Race Condition', 'Idempotency', 'N+1 Sorgu',
      'Webhook', 'Teknik Borç', 'Refactor', 'CI/CD',
      'Staging', 'Migration', 'Rate Limit', 'Memory Leak'
    ];

    // Load dynamic real text
    fetch('/arka-plan-metin.json')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.logs && data.logs.length) logs = data.logs;
        if (data && data.terms && data.terms.length) terms = data.terms;
      })
      .catch(() => {});

    // Resize handler
    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    // Scene management: 4 scenes, 8 seconds per scene
    const SCENE_DURATION = 8000;
    const FADE_DURATION = 1500;
    let startTime = performance.now();
    let isPaused = false;

    // Mesh nodes setup
    const nodeCount = 20;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1.5,
      pulse: Math.random() * Math.PI * 2,
      isError: Math.random() < 0.15
    }));

    // Log stream items
    const logItems = Array.from({ length: 14 }, (_, i) => ({
      text: logs[i % logs.length] || '',
      y: (i / 14) * height,
      speed: 0.3 + Math.random() * 0.2,
      isError: i % 4 === 1,
      resolved: false
    }));

    // Draw static frame for reduced motion
    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#15181E';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(76, 178, 130, 0.12)';
      ctx.fillStyle = 'rgba(231, 234, 239, 0.15)';
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    if (prefersReducedMotion) {
      drawStatic();
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }

    // Animation Loop
    const render = (now) => {
      if (isPaused) return;

      const elapsed = now - startTime;
      const sceneIndex = Math.floor(elapsed / SCENE_DURATION) % 4;
      const sceneProgress = (elapsed % SCENE_DURATION) / SCENE_DURATION;

      // Transition alpha calculation
      let sceneAlpha = 1;
      const timeInScene = elapsed % SCENE_DURATION;
      if (timeInScene < FADE_DURATION) {
        sceneAlpha = timeInScene / FADE_DURATION;
      } else if (timeInScene > SCENE_DURATION - FADE_DURATION) {
        sceneAlpha = (SCENE_DURATION - timeInScene) / FADE_DURATION;
      }

      ctx.clearRect(0, 0, width, height);

      // Background subtle gradient
      ctx.fillStyle = '#15181E';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.globalAlpha = Math.max(0.1, sceneAlpha * 0.45);

      // Scene 0: Log Stream
      if (sceneIndex === 0) {
        ctx.font = '12px "IBM Plex Mono", monospace';
        logItems.forEach((item, idx) => {
          item.y += item.speed;
          if (item.y > height + 20) {
            item.y = -20;
            item.text = logs[(idx + Math.floor(now / 1000)) % logs.length] || item.text;
            item.isError = Math.random() < 0.25;
            item.resolved = false;
          }
          if (item.isError && now % 3000 > 1500) {
            item.resolved = true;
          }

          if (item.isError && !item.resolved) {
            ctx.fillStyle = 'rgba(228, 99, 108, 0.85)';
          } else if (item.resolved) {
            ctx.fillStyle = 'rgba(76, 178, 130, 0.85)';
          } else {
            ctx.fillStyle = 'rgba(199, 206, 218, 0.45)';
          }
          ctx.fillText(`> ${item.text}`, 24 + (idx % 2) * (width * 0.45), item.y);
        });
      }

      // Scene 1: Architecture Mesh
      else if (sceneIndex === 1) {
        nodes.forEach(n => {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
        });

        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
              const alpha = (1 - dist / 180) * 0.3;
              ctx.strokeStyle = `rgba(142, 160, 185, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();

              const pulsePos = (sceneProgress * 3 + i * 0.1) % 1;
              const px = nodes[i].x + (nodes[j].x - nodes[i].x) * pulsePos;
              const py = nodes[i].y + (nodes[j].y - nodes[i].y) * pulsePos;
              ctx.fillStyle = nodes[i].isError ? 'rgba(228, 99, 108, 0.8)' : 'rgba(76, 178, 130, 0.8)';
              ctx.beginPath();
              ctx.arc(px, py, 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        nodes.forEach(n => {
          ctx.fillStyle = n.isError ? 'rgba(228, 99, 108, 0.7)' : 'rgba(231, 234, 239, 0.6)';
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Scene 2: Radar Pulse & Glossary Terms
      else if (sceneIndex === 2) {
        const cx = width / 2;
        const cy = height / 2;
        const maxR = Math.max(width, height) * 0.6;
        const angle = (now * 0.0008) % (Math.PI * 2);

        for (let r = 80; r < maxR; r += 120) {
          const waveRadius = (r + (now * 0.04) % 120);
          const alpha = (1 - waveRadius / maxR) * 0.2;
          ctx.strokeStyle = `rgba(76, 178, 130, ${alpha})`;
          ctx.beginPath();
          ctx.arc(cx, cy, waveRadius, 0, Math.PI * 2);
          ctx.stroke();
        }

        const sweepGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, maxR);
        sweepGrad.addColorStop(0, 'rgba(76, 178, 130, 0.15)');
        sweepGrad.addColorStop(1, 'rgba(76, 178, 130, 0)');
        ctx.fillStyle = sweepGrad;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxR, angle, angle + 0.35);
        ctx.closePath();
        ctx.fill();

        ctx.font = '11px "IBM Plex Mono", monospace';
        terms.slice(0, 8).forEach((term, i) => {
          const tAngle = (i / 8) * Math.PI * 2 + 0.3;
          const tr = 140 + (i % 3) * 80;
          const tx = cx + Math.cos(tAngle) * tr;
          const ty = cy + Math.sin(tAngle) * tr;
          const distAngle = Math.abs((angle - tAngle + Math.PI * 2) % (Math.PI * 2));
          const tAlpha = distAngle < 0.6 ? 0.7 : 0.25;

          ctx.fillStyle = `rgba(199, 206, 218, ${tAlpha})`;
          ctx.fillText(term, tx + 6, ty + 3);
          ctx.beginPath();
          ctx.arc(tx, ty, 2, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Scene 3: Code Diff
      else if (sceneIndex === 3) {
        ctx.font = '12px "IBM Plex Mono", monospace';
        const diffLines = [
          { type: 'ctx', text: '  async executeTransaction(client, payload) {' },
          { type: 'del', text: '-   const res = await client.query("SELECT * FROM inventory WHERE id = $1 FOR UPDATE NOWAIT", [payload.id]);' },
          { type: 'add', text: '+   const res = await client.query("SELECT * FROM inventory WHERE id = $1 FOR UPDATE SKIP LOCKED", [payload.id]);' },
          { type: 'ctx', text: '    if (!res.rows.length) throw new LockTimeoutError();' },
          { type: 'del', text: '-   await sendWebhookNotification(payload.orderId);' },
          { type: 'add', text: '+   await outboxQueue.publish("order.created", payload);' },
          { type: 'ctx', text: '    return { status: 200, success: true };' },
          { type: 'ctx', text: '  }' },
          { type: 'del', text: '- let pool = new Pool({ max: 100, idleTimeoutMillis: 30000 });' },
          { type: 'add', text: '+ let pool = new Pool({ max: 20, connectionTimeoutMillis: 2000, idleTimeoutMillis: 10000 });' }
        ];

        const baseY = height * 0.25 + (Math.sin(now * 0.0005) * 20);
        const colWidth = Math.min(width - 40, 720);
        const startX = Math.max(20, (width - colWidth) / 2);

        diffLines.forEach((line, i) => {
          const ly = baseY + i * 26;
          if (line.type === 'del') {
            ctx.fillStyle = 'rgba(228, 99, 108, 0.75)';
          } else if (line.type === 'add') {
            ctx.fillStyle = 'rgba(76, 178, 130, 0.85)';
          } else {
            ctx.fillStyle = 'rgba(126, 138, 155, 0.45)';
          }
          ctx.fillText(line.text, startX, ly);
        });
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const handleVisibility = () => {
      if (document.hidden) {
        isPaused = true;
        if (animId) cancelAnimationFrame(animId);
      } else {
        isPaused = false;
        startTime = performance.now();
        animId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default HomeCanvas;
