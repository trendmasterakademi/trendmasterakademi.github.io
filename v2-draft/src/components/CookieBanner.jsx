import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, X, Check, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieBanner = () => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('tma_cookie_consent');
      if (!consent) {
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      } else if (consent === 'accepted' && window.enableAnalyticsConsent) {
        window.enableAnalyticsConsent();
      }
    } catch (e) {
      console.warn('Cookie consent read error:', e);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('tma_cookie_consent', 'accepted');
      if (window.enableAnalyticsConsent) {
        window.enableAnalyticsConsent();
      }
      if (window.trackEvent) {
        window.trackEvent('cookie_consent_accepted', { consent_type: 'all' });
      }
    } catch (e) {
      console.warn('Cookie consent save error:', e);
    }
    setIsVisible(false);
  };

  const handleReject = () => {
    try {
      localStorage.setItem('tma_cookie_consent', 'rejected');
      if (window.trackEvent) {
        window.trackEvent('cookie_consent_rejected', { consent_type: 'essential_only' });
      }
    } catch (e) {
      console.warn('Cookie consent reject error:', e);
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-lg z-50 p-5 rounded-2xl bg-[#0a0f18]/95 border border-cyan-500/30 text-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-2.5 text-xs leading-relaxed">
          <div className="font-bold text-white text-sm flex items-center gap-2">
            <span>{isTr ? 'Gizlilik & Analitik Tercihleri' : 'Privacy & Analytics Preferences'}</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono">%100 NDA</span>
          </div>
          <p className="text-slate-300">
            {isTr 
              ? 'Sitemizde deneyimi iyileştirmek amacıyla analitik (GA4) ve oturum ölçüm (Clarity) araçları kullanılmaktadır. Formlara yazılan tüm kriz ve kod detayları katı şekilde maskelenir.' 
              : 'We utilize analytics (GA4) and session telemetry (Clarity) for diagnostics. All private form inputs are strictly masked under mutual NDA.'}{' '}
            <Link to="/privacy/" className="text-cyan-400 underline hover:text-cyan-300">
              {isTr ? 'Ayrıntılı Gizlilik Politikası' : 'Privacy Policy'}
            </Link>
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleAccept}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-bg-dark font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer min-h-[36px]"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isTr ? 'Tümünü Kabul Et' : 'Accept All'}</span>
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer min-h-[36px]"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>{isTr ? 'Yalnızca Zorunlu Çerezler' : 'Essential Only'}</span>
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleReject}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors ml-auto cursor-pointer"
          aria-label={isTr ? 'Kapat' : 'Close'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
