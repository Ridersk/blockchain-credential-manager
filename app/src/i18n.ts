import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import * as allLanguages from "locales";

const fallbackLng = ["en"];
let resources = {
  en: { translation: allLanguages.en },
  "pt-BR": { translation: allLanguages.pt_br }
};

i18n
  .use(Backend) // load translations using http (default public/assets/locals/en/translations)
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // pass the i18n instance to react-i18next.
  .init({
    resources,
    fallbackLng, // fallback language is english.
    debug: false,
    interpolation: {
      escapeValue: false // no need for react. it escapes by default
    }
  });

console.log("CURRENT LANGUAGE:", i18n.language);

export default i18n;
