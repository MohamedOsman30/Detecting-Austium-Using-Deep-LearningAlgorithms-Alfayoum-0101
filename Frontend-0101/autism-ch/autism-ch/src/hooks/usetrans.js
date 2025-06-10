import { useLanguage } from"../contexts/LanguageContext";

import { translations } from '../contexts/translation'; // استيراد كـ named import

export default function useTrans() {
  const { language } = useLanguage();

  const t = (key) => {
    const translated = translations[language]?.[key];
    if (!translated) {
      console.warn(`Missing translation for "${key}" in "${language}"`);
      return key;
    }
    return translated;
  };

  return t;
}