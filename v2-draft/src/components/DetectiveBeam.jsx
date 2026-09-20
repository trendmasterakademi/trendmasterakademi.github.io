import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * DetectiveBeam
 *
 * TMA siber dedektif / B2B SWAT konseptine uygun sinematik 4 köşeli arama feneri (searchlight).
 * 
 * Dinamik Özellikler:
 * - 4 Köşe Desteği: Sağ-Üst, Sol-Üst, Sağ-Alt, Sol-Alt.
 * - Her sayfa açılışında / geçişinde (Route change) rastgele farklı bir köşe seçilir.
 * - Tab açıkken 10 dakikada bir (600.000 ms) yumuşak bir kararma/aydınlanma (fade) ile köşe değiştirir.
 * - Yansıtma matrisi (CSS scale transforms) sayesinde 4 köşe için tek bir optimize SVG katmanı kullanılır.
 * - 0% CPU Yükü: GPU hızlandırmalı CSS katmanları, sıfır ağır JavaScript döngüsü (borsa/terminal operasyonlarına tam dost).
 * - pointer-events-none ile tüm tıklama ve seçim etkileşimleri engelsiz kalır.
 */

const CORNERS = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];

const CORNER_TRANSFORMS = {
  'top-right': 'none',
  'top-left': 'scaleX(-1)',
  'bottom-right': 'scaleY(-1)',
  'bottom-left': 'scale(-1, -1)',
};

const getRandomDifferentCorner = (current) => {
  const candidates = CORNERS.filter(c => c !== current);
  return candidates[Math.floor(Math.random() * candidates.length)];
};

const DetectiveBeam = ({ className = '', intervalMs = 10 * 60 * 1000 }) => {
  const location = useLocation();
  const [currentCorner, setCurrentCorner] = useState('top-right');
  const [isFading, setIsFading] = useState(false);
  const fadeTimeoutRef = useRef(null);
  const isFirstRender = useRef(true);

  // 1. İlk yüklemede rastgele bir köşe belirle (sessionStorage ile son köşeden farklı)
  useEffect(() => {
    try {
      const lastCorner = sessionStorage.getItem('tma_last_beam_corner');
      const initialCorner = lastCorner 
        ? getRandomDifferentCorner(lastCorner) 
        : CORNERS[Math.floor(Math.random() * CORNERS.length)];
      
      setCurrentCorner(initialCorner);
      sessionStorage.setItem('tma_last_beam_corner', initialCorner);
    } catch {
      // Storage erişim kısıtı durumunda varsayılan seçim
      setCurrentCorner(CORNERS[Math.floor(Math.random() * CORNERS.length)]);
    }
  }, []);

  // 2. Sayfa gezintilerinde (Route değişimi) yumuşak geçişle yeni bir köşeye geç
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Her sayfa geçişinde yeni bir köşe seç
    triggerCornerTransition();
  }, [location.pathname]);

  // 3. Tab açıkken 10 dakikada bir otomatik köşe rotasyonu
  useEffect(() => {
    const timer = setInterval(() => {
      triggerCornerTransition();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  // Yumuşak geçiş fonksiyonu (1 saniye karar, köşeyi değiştir, aydınlan)
  const triggerCornerTransition = (targetCorner = null) => {
    setIsFading(true);
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);

    fadeTimeoutRef.current = setTimeout(() => {
      setCurrentCorner(prev => {
        const next = targetCorner || getRandomDifferentCorner(prev);
        try {
          sessionStorage.setItem('tma_last_beam_corner', next);
        } catch {
          // ignore storage error
        }
        return next;
      });
      setIsFading(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, []);

  return (
    <div 
      className={`absolute top-0 left-0 w-full max-w-[100vw] h-[100vh] min-h-[640px] max-h-[960px] pointer-events-none overflow-hidden z-20 select-none transition-opacity duration-1000 ease-in-out ${
        isFading ? 'opacity-0' : 'opacity-100'
      } ${className}`}
      style={{
        maskImage: 'radial-gradient(circle at 50% 30%, black 50%, transparent 95%)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 30%, black 50%, transparent 95%)'
      }}
      aria-hidden="true"
    >
      {/* 4 Köşeye Yansıtılabilir Hacimsel Katman */}
      <div 
        className="w-full h-full relative origin-center"
        style={{ transform: CORNER_TRANSFORMS[currentCorner] || 'none' }}
      >
        {/* 1. Köşe Odak Işıltısı (Ambient Corner Flare) */}
        <div 
          className="absolute -top-12 -right-12 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br from-amber-200/30 via-amber-500/15 to-transparent blur-3xl mix-blend-screen animate-detective-pulse"
        />

        {/* 2. Ana Hacimsel Fener Demeti (Volumetric Beam with Sway Animation) */}
        <div className="absolute top-0 right-0 w-full h-full animate-detective-sweep mix-blend-screen opacity-70">
          <svg 
            viewBox="0 0 1200 900" 
            className="w-full h-full object-cover sm:object-fill origin-top-right" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Ana Işık Demeti Gradyanı */}
              <linearGradient id="detective-main-beam" x1="1200" y1="0" x2="250" y2="750" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
                <stop offset="12%" stopColor="#fbbf24" stopOpacity="0.55" />
                <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.30" />
                <stop offset="65%" stopColor="#d97706" stopOpacity="0.12" />
                <stop offset="90%" stopColor="#92400e" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
              </linearGradient>

              {/* İç Hüzme 1 Gradyanı (Merkez Yoğun Işık) */}
              <linearGradient id="detective-shaft-1" x1="1200" y1="0" x2="320" y2="620" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                <stop offset="15%" stopColor="#fef08a" stopOpacity="0.50" />
                <stop offset="45%" stopColor="#fbbf24" stopOpacity="0.25" />
                <stop offset="85%" stopColor="#f59e0b" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
              </linearGradient>

              {/* İç Hüzme 2 Gradyanı (Üst Yan Işık) */}
              <linearGradient id="detective-shaft-2" x1="1200" y1="0" x2="180" y2="460" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.60" />
                <stop offset="25%" stopColor="#fbbf24" stopOpacity="0.30" />
                <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
              </linearGradient>

              {/* İç Hüzme 3 Gradyanı (Alt Dağılan Işık) */}
              <linearGradient id="detective-shaft-3" x1="1200" y1="0" x2="520" y2="880" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.50" />
                <stop offset="30%" stopColor="#f59e0b" stopOpacity="0.22" />
                <stop offset="80%" stopColor="#d97706" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
              </linearGradient>

              {/* Fener Mercek / Odak Noktası Gradyanı */}
              <radialGradient id="detective-lens-core" cx="1200" cy="0" r="180" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
                <stop offset="15%" stopColor="#fef08a" stopOpacity="0.85" />
                <stop offset="40%" stopColor="#fbbf24" stopOpacity="0.50" />
                <stop offset="75%" stopColor="#f59e0b" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
              </radialGradient>

              {/* Kenar Yumuşatma Filtresi */}
              <filter id="detective-soft-blur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
              <filter id="detective-ambient-blur" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="16" />
              </filter>
            </defs>

            {/* Katman 1: Geniş Difüzyon / Ortam Aurası */}
            <path 
              d="M1200 0 L100 480 L350 900 L950 900 Z" 
              fill="url(#detective-main-beam)" 
              filter="url(#detective-ambient-blur)"
              opacity="0.85"
            />

            {/* Katman 2: Ana Konik Fener Demeti */}
            <path 
              d="M1200 0 L150 430 L380 900 L880 900 Z" 
              fill="url(#detective-main-beam)" 
              filter="url(#detective-soft-blur)"
            />

            {/* Katman 3: Keskin İç Işık Hüzmeleri (Ray Streaks) */}
            {/* Hüzme A - Merkez Ekseni */}
            <path 
              d="M1200 0 L280 520 L380 620 Z" 
              fill="url(#detective-shaft-1)" 
              filter="url(#detective-soft-blur)"
              opacity="0.9"
            />
            {/* Hüzme B - Üst Kenar Çizgisi */}
            <path 
              d="M1200 0 L160 380 L230 440 Z" 
              fill="url(#detective-shaft-2)" 
              filter="url(#detective-soft-blur)"
              opacity="0.7"
            />
            {/* Hüzme C - İnce Lazer / Odak Çizgisi */}
            <path 
              d="M1200 0 L210 460 L240 485 Z" 
              fill="url(#detective-shaft-1)" 
              opacity="0.85"
            />
            {/* Hüzme D - Alt Kanat */}
            <path 
              d="M1200 0 L480 780 L620 890 Z" 
              fill="url(#detective-shaft-3)" 
              filter="url(#detective-soft-blur)"
              opacity="0.75"
            />

            {/* Katman 4: Fener Çıkış Kaynağı / Projektör Merceği */}
            <circle 
              cx="1200" 
              cy="0" 
              r="160" 
              fill="url(#detective-lens-core)" 
            />
          </svg>
        </div>

        {/* 3. Havada Süzülen Mikro Toz / Hüzme Zerrecikleri (Ambient Dust Motes) */}
        <div className="absolute top-12 right-24 w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-dust-1" />
        <div className="absolute top-28 right-52 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.9)] animate-dust-2" />
        <div className="absolute top-44 right-36 w-1 h-1 rounded-full bg-amber-100 shadow-[0_0_6px_rgba(254,240,138,0.7)] animate-dust-3" />
        <div className="absolute top-64 right-72 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-dust-1" style={{ animationDelay: '4s' }} />
        <div className="absolute top-80 right-96 w-1 h-1 rounded-full bg-amber-200 shadow-[0_0_6px_rgba(245,158,11,0.8)] animate-dust-2" style={{ animationDelay: '7s' }} />
      </div>
    </div>
  );
};

export default DetectiveBeam;
