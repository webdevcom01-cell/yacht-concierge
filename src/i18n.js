import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';

// English ships in the main bundle (default language); RU and IT are
// code-split and fetched on demand — first paint carries one locale, not three.
const LAZY_LOCALES = {
  ru: () => import('./locales/ru.json'),
  it: () => import('./locales/it.json'),
};

const LANG_KEY = 'yc-lang';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

async function ensureLoaded(lng) {
  if (lng === 'en' || i18n.hasResourceBundle(lng, 'translation')) return;
  const loader = LAZY_LOCALES[lng];
  if (!loader) return;
  const mod = await loader();
  i18n.addResourceBundle(lng, 'translation', mod.default, true, true);
}

export async function setLanguage(lng) {
  await ensureLoaded(lng);
  await i18n.changeLanguage(lng);
  document.documentElement.lang = lng;
  try { localStorage.setItem(LANG_KEY, lng); } catch {}
}

export default i18n;
