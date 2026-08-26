import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import trTranslation from './locales/tr.json';
import enTranslation from './locales/en.json';

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('tma_lang') || 'tr' : 'tr';

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

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tma_lang', lng);
  }
});

export default i18n;
