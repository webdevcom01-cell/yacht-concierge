import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ru from './locales/ru.json';
import it from './locales/it.json';

const LANG_KEY = 'yc-lang';

const savedLang = (() => {
  try { return localStorage.getItem(LANG_KEY) || 'en'; }
  catch { return 'en'; }
})();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      it: { translation: it },
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

i18n.on('languageChanged', (lng) => {
  try { localStorage.setItem(LANG_KEY, lng); } catch {}
});

export default i18n;
