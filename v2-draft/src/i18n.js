import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import trTranslation from './locales/tr.json';
import enTranslation from './locales/en.json';
import { getLangFromPath } from './utils/routes';

const pathLang = typeof window !== 'undefined' ? getLangFromPath(window.location.pathname) : null;
const raw = typeof window !== 'undefined' ? localStorage.getItem('tma_lang') : null;
const savedLang = pathLang || (raw ? (raw.toLowerCase().startsWith('en') ? 'en' : 'tr') : 'tr');

i18n
  .use(initReactI18next)
  .init({
    resources: {
      tr: { translation: trTranslation },
      en: { translation: enTranslation }
    },
    lng: savedLang,
    fallbackLng: "tr",
    interpolation: {
      escapeValue: false
    }
  });

if (typeof document !== 'undefined') {
  document.documentElement.lang = savedLang;
}

i18n.on('languageChanged', (lng) => {
  const normalized = lng?.toLowerCase().startsWith('en') ? 'en' : 'tr';
  if (typeof window !== 'undefined') {
    localStorage.setItem('tma_lang', normalized);
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = normalized;
  }
});

export const isTurkish = (i18nInstance) => {
  const lang = (i18nInstance?.resolvedLanguage || i18nInstance?.language || 'tr').toLowerCase();
  return !lang.startsWith('en');
};

export default i18n;
