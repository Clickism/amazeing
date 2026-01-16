// src/i18n/i18n.ts
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
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

export type Translatable = string | TranslationKey;
export type TranslationKey = { key: string };

export function isTranslationKey(t: string | TranslationKey) {
  return typeof t === "object" && "key" in t;
}

/**
 * Hook that provides direct translation for {@link Translatable} types.
 */
export function useTranslatable() {
  const { t } = useTranslation();
  return {
    t(translatable: Translatable) {
      return tryTranslate(t, translatable);
    },
  };
}

/**
 * Translates the given key or returns the original string.
 * @param t Translation function
 * @param translatable Raw string or translation key
 */
export function tryTranslate(
  t: (s: string) => string,
  translatable: Translatable,
): string {
  return isTranslationKey(translatable) ? t(translatable.key) : translatable;
}
