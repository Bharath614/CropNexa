import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { TRANSLATIONS } from '@/utils/i18n';

const resources = Object.keys(TRANSLATIONS).reduce((acc, lang) => {
  acc[lang] = {
    translation: TRANSLATIONS[lang as keyof typeof TRANSLATIONS],
  };
  return acc;
}, {} as Record<string, { translation: Record<string, string> }>);

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      supportedLngs: ['en', 'ta', 'hi', 'te', 'kn', 'ml', 'bn', 'gu', 'mr', 'pa', 'or'],
      load: 'languageOnly',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
}

export default i18n;
