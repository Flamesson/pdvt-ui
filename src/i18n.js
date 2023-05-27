import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        fallbackLng: "ru",
        interpolation: {
            escapeValue: false
        },
        react: {
            useSuspense: false
        },
        resources: {
            ru: {
                translations: require("./locales/ru/translations.json")
            },
            en: {
                translations: require("./locales/en/translations.json")
            }
        },
        ns: ["translations"],
        defaultNS: "translations",
    });

i18n.languages = ['ru', 'en', 'zh'];

export default i18n;