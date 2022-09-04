import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { localeOptions } from "locales";

const fallbackLng = ["en"];
// let resources = {
//   en: { translation: localeOptions.en.messages },
//   "pt-BR": { translation: localeOptions.pt_br.messages }
// };

i18n
  .use(Backend) // load translations using http (default public/assets/locals/en/translations)
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // pass the i18n instance to react-i18next.
  .init({
    resources: localeOptions,
    fallbackLng, // fallback language is english.
    debug: false,
    interpolation: {
      escapeValue: false // no need for react. it escapes by default
    }
  });

export default i18n;

export const setCurrentLanguage = (langId: string) => {
  i18n.changeLanguage(langId);
};
