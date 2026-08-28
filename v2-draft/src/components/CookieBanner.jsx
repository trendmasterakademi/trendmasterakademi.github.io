import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CookieBanner = () => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('tma_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('tma_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-40 p-4 sm:p-5 rounded-2xl bg-[#0a0f18]/95 border border-cyan-500/30 text-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-2 text-xs leading-relaxed">
            <p>
              {isTr 
                ? 'Sitemizde kullanıcı deneyimini ve dil tercihlerini hatırlamak amacıyla zorunlu çerezler kullanılmaktadır.' 
                : 'We use necessary cookies for navigation and language preference.'}{' '}
              <Link to="/privacy" className="text-cyan-400 underline hover:text-cyan-300">
                {isTr ? 'Gizlilik & KVKK Politikası' : 'Privacy Policy'}
              </Link>
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleAccept}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-bg-dark font-bold text-xs cursor-pointer transition-colors"
              >
                {isTr ? 'Kabul Et' : 'Accept'}
              </button>
              <button
                onClick={handleAccept}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs cursor-pointer transition-colors"
              >
                {isTr ? 'Kapat' : 'Dismiss'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieBanner;
