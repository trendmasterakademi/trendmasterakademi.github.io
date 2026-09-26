import React, { useState, useEffect, useRef } from 'react';

const SCENES = [
  { id: 1, name: 'sahne-1' },
  { id: 2, name: 'sahne-2' },
  { id: 3, name: 'sahne-3' },
  { id: 4, name: 'sahne-4' }
];

const HomeBackground = () => {
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [prevSceneIdx, setPrevSceneIdx] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isReducedMotion = useRef(false);

  useEffect(() => {
    isReducedMotion.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReducedMotion.current) return;

    const SCENE_INTERVAL = 9000;
    let timer = null;
    let preloadTimer = null;
    let isTabHidden = false;

    const scheduleNext = () => {
      if (isTabHidden) return;

      // Preload next scene 3.5 seconds before switch
      preloadTimer = setTimeout(() => {
        if (isTabHidden) return;
        const nextIdx = (activeSceneIdx + 1) % SCENES.length;
        const nextScene = SCENES[nextIdx];
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'image';
        link.href = `/arka-plan/${nextScene.name}-1280.webp`;
        document.head.appendChild(link);
      }, SCENE_INTERVAL - 3500);

      timer = setTimeout(() => {
        if (isTabHidden) return;
        setPrevSceneIdx(activeSceneIdx);
        setIsTransitioning(true);
        setActiveSceneIdx(prev => (prev + 1) % SCENES.length);

        setTimeout(() => {
          setIsTransitioning(false);
          setPrevSceneIdx(null);
        }, 1200);
      }, SCENE_INTERVAL);
    };

    scheduleNext();

    const handleVisibility = () => {
      isTabHidden = document.hidden;
      if (isTabHidden) {
        if (timer) clearTimeout(timer);
        if (preloadTimer) clearTimeout(preloadTimer);
      } else {
        scheduleNext();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (timer) clearTimeout(timer);
      if (preloadTimer) clearTimeout(preloadTimer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [activeSceneIdx]);

  const activeScene = SCENES[activeSceneIdx];
  const prevScene = prevSceneIdx !== null ? SCENES[prevSceneIdx] : null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* Background layer */}
      <div className="absolute inset-0 bg-[var(--paper)]" />

      {/* Previous scene for smooth crossfade */}
      {prevScene && (
        <div
          className={`absolute inset-0 transition-opacity duration-1200 ease-in-out ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <picture className="w-full h-full block">
            <source
              type="image/avif"
              srcSet={`/arka-plan/${prevScene.name}-768.avif 768w, /arka-plan/${prevScene.name}-1280.avif 1280w, /arka-plan/${prevScene.name}-1920.avif 1920w`}
              sizes="100vw"
            />
            <source
              type="image/webp"
              srcSet={`/arka-plan/${prevScene.name}-768.webp 768w, /arka-plan/${prevScene.name}-1280.webp 1280w, /arka-plan/${prevScene.name}-1920.webp 1920w`}
              sizes="100vw"
            />
            <img
              src={`/arka-plan/${prevScene.name}-1280.webp`}
              alt=""
              decoding="async"
              className="w-full h-full object-cover object-center transform scale-104"
            />
          </picture>
        </div>
      )}

      {/* Active scene with subtle Ken Burns effect */}
      <div
        key={activeScene.id}
        className={`absolute inset-0 transition-opacity duration-1200 ease-in-out ${
          isTransitioning ? 'opacity-100 animate-in fade-in' : 'opacity-100'
        }`}
      >
        <picture className="w-full h-full block">
          <source
            type="image/avif"
            srcSet={`/arka-plan/${activeScene.name}-768.avif 768w, /arka-plan/${activeScene.name}-1280.avif 1280w, /arka-plan/${activeScene.name}-1920.avif 1920w`}
            sizes="100vw"
          />
          <source
            type="image/webp"
            srcSet={`/arka-plan/${activeScene.name}-768.webp 768w, /arka-plan/${activeScene.name}-1280.webp 1280w, /arka-plan/${activeScene.name}-1920.webp 1920w`}
            sizes="100vw"
          />
          <img
            src={`/arka-plan/${activeScene.name}-1280.webp`}
            alt=""
            fetchPriority={activeScene.id === 1 ? 'high' : 'auto'}
            decoding="async"
            className="w-full h-full object-cover object-center transform transition-transform duration-[9000ms] ease-out scale-106"
          />
        </picture>
      </div>
    </div>
  );
};

export default HomeBackground;
