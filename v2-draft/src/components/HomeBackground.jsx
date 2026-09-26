import React, { useState, useEffect, useRef } from 'react';

const SCENES = [
  { id: 1, name: 'sahne-1' },
  { id: 2, name: 'sahne-2' },
  { id: 3, name: 'sahne-3' },
  { id: 4, name: 'sahne-4' }
];

export const GECISLER = ['tarama', 'radar', 'derinlik'];

const ScenePicture = ({ scene, fetchPriority = 'auto', className = '', style = {} }) => (
  <picture className="w-full h-full block">
    <source
      media="(orientation: portrait)"
      type="image/avif"
      srcSet={`/arka-plan/${scene.name}-dikey-720.avif 720w, /arka-plan/${scene.name}-dikey-1080.avif 1080w, /arka-plan/${scene.name}-dikey-1440.avif 1440w`}
      sizes="100vw"
    />
    <source
      media="(orientation: portrait)"
      type="image/webp"
      srcSet={`/arka-plan/${scene.name}-dikey-720.webp 720w, /arka-plan/${scene.name}-dikey-1080.webp 1080w, /arka-plan/${scene.name}-dikey-1440.webp 1440w`}
      sizes="100vw"
    />
    <source
      type="image/avif"
      srcSet={`/arka-plan/${scene.name}-1280.avif 1280w, /arka-plan/${scene.name}-1920.avif 1920w, /arka-plan/${scene.name}-2560.avif 2560w`}
      sizes="100vw"
    />
    <source
      type="image/webp"
      srcSet={`/arka-plan/${scene.name}-1280.webp 1280w, /arka-plan/${scene.name}-1920.webp 1920w, /arka-plan/${scene.name}-2560.webp 2560w`}
      sizes="100vw"
    />
    <img
      src={`/arka-plan/${scene.name}-1920.webp`}
      alt=""
      fetchPriority={fetchPriority}
      decoding="async"
      className={`w-full h-full object-cover object-center select-none ${className}`}
      style={style}
    />
  </picture>
);

const HomeBackground = () => {
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [prevSceneIdx, setPrevSceneIdx] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState('tarama');
  const [transitionProgress, setTransitionProgress] = useState(0); // 0 to 1
  const transitionCount = useRef(0);
  const isReducedMotion = useRef(false);
  const [overrideTransition, setOverrideTransition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__tmaSetTransition = (type, progress = 0.5, from = 0, to = 1) => {
        setOverrideTransition({ type, progress, from, to });
      };
      window.__tmaResetTransition = () => {
        setOverrideTransition(null);
      };
    }
  }, []);

  useEffect(() => {
    isReducedMotion.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReducedMotion.current) return;

    const SCENE_INTERVAL = 9000;
    let timer = null;
    let animFrame = null;
    let isTabHidden = false;

    const scheduleNext = () => {
      if (isTabHidden) return;

      timer = setTimeout(() => {
        if (isTabHidden) return;

        const nextTransition = GECISLER[transitionCount.current % GECISLER.length];
        transitionCount.current++;
        setTransitionType(nextTransition);

        const fromIdx = activeSceneIdx;
        const toIdx = (activeSceneIdx + 1) % SCENES.length;

        setPrevSceneIdx(fromIdx);
        setActiveSceneIdx(toIdx);
        setIsTransitioning(true);
        setTransitionProgress(0);

        const duration = nextTransition === 'tarama' ? 1400 : 1600;
        const startTime = performance.now();

        const animate = (now) => {
          const elapsed = now - startTime;
          const rawP = Math.min(1, elapsed / duration);
          // Easing: cubic-bezier(0.22, 1, 0.36, 1)
          const p = 1 - Math.pow(1 - rawP, 3);
          setTransitionProgress(p);

          if (rawP < 1) {
            animFrame = requestAnimationFrame(animate);
          } else {
            setIsTransitioning(false);
            setPrevSceneIdx(null);
            setTransitionProgress(0);
          }
        };

        animFrame = requestAnimationFrame(animate);
      }, SCENE_INTERVAL);
    };

    scheduleNext();

    const handleVisibility = () => {
      isTabHidden = document.hidden;
      if (isTabHidden) {
        if (timer) clearTimeout(timer);
        if (animFrame) cancelAnimationFrame(animFrame);
      } else {
        scheduleNext();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (timer) clearTimeout(timer);
      if (animFrame) cancelAnimationFrame(animFrame);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [activeSceneIdx]);

  const effectiveActiveIdx = overrideTransition ? overrideTransition.to : activeSceneIdx;
  const effectivePrevIdx = overrideTransition ? overrideTransition.from : prevSceneIdx;
  const effectiveIsTransitioning = overrideTransition ? true : isTransitioning;
  const effectiveTransitionType = overrideTransition ? overrideTransition.type : transitionType;
  const effectiveProgress = overrideTransition ? overrideTransition.progress : transitionProgress;

  const activeScene = SCENES[effectiveActiveIdx];
  const prevScene = effectivePrevIdx !== null ? SCENES[effectivePrevIdx] : null;

  // Geçiş stilleri
  let incomingStyle = {};
  let outgoingStyle = {};
  let showScanline = false;
  let scanlineTop = '0%';

  if (effectiveIsTransitioning) {
    if (effectiveTransitionType === 'tarama') {
      // 1. Tarama: Yeni fotoğraf yukarıdan aşağı maske ile açılır, parlak tarama çizgisi ilerler
      const pPercent = effectiveProgress * 100;
      incomingStyle = {
        WebkitMaskImage: `linear-gradient(to bottom, black calc(${pPercent}% - 6%), transparent calc(${pPercent}% + 6%))`,
        maskImage: `linear-gradient(to bottom, black calc(${pPercent}% - 6%), transparent calc(${pPercent}% + 6%))`
      };
      showScanline = effectiveProgress > 0.02 && effectiveProgress < 0.98;
      scanlineTop = `${pPercent}%`;
    } else if (effectiveTransitionType === 'radar') {
      // 2. Radar: Büyüyen yumuşak kenarlı daire ile açılma
      const rPercent = effectiveProgress * 125;
      incomingStyle = {
        clipPath: `circle(${rPercent}% at 50% 50%)`,
        WebkitClipPath: `circle(${rPercent}% at 50% 50%)`
      };
    } else if (effectiveTransitionType === 'derinlik') {
      // 3. Derinlik: Giden fotoğraf öne yaklaşır ve söner; gelen fotoğraf 1.12'den 1.04'e oturur
      outgoingStyle = {
        transform: `scale(${1.04 + effectiveProgress * 0.12})`,
        opacity: Math.max(0, 1 - effectiveProgress * 1.1)
      };
      incomingStyle = {
        transform: `scale(${1.12 - effectiveProgress * 0.08})`,
        opacity: effectiveProgress
      };
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* Koyu taban katman */}
      <div className="absolute inset-0 bg-[var(--paper)]" />

      {/* Önceki sahne (geçiş anında) */}
      {prevScene && (
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={outgoingStyle}
        >
          <ScenePicture
            scene={prevScene}
            className="transform scale-104 transition-transform duration-[9000ms] ease-out"
          />
        </div>
      )}

      {/* Aktif sahne */}
      <div
        key={activeScene.id}
        className="absolute inset-0"
        style={incomingStyle}
      >
        <ScenePicture
          scene={activeScene}
          fetchPriority={activeScene.id === 1 ? 'high' : 'auto'}
          className="transform scale-106 transition-transform duration-[9000ms] ease-out"
        />
      </div>

      {/* Tarama geçişi parlak tarama çizgisi (chromatic offset & accent glow) */}
      {showScanline && (
        <div
          className="absolute left-0 right-0 h-[2px] pointer-events-none z-10 transition-none"
          style={{
            top: scanlineTop,
            background: 'rgba(76, 178, 130, 0.85)',
            boxShadow: '0 0 12px rgba(76, 178, 130, 0.9), 0 -1px 3px rgba(235, 87, 87, 0.6), 0 1px 3px rgba(56, 189, 248, 0.6)'
          }}
        />
      )}
    </div>
  );
};

export default HomeBackground;
