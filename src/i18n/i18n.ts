// src/i18n/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en.json";
import de from "./de.json";

export type Language = "en" | "de";
export const SUPPORTED_LANGUAGES: Language[] = ["en", "de"];
export const FALLBACK_LANGUAGE: Language = "en";

await i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, de: { translation: de } },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
