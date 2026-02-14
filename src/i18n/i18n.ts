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

export type Translatable = string | TranslationKey | PackagedTranslation;
export type TranslationKey = { key: string };
export type PackagedTranslation = Partial<Record<Language, string>>;

export function isTranslationKey(t: Translatable): t is TranslationKey {
  return typeof t === "object" && "key" in t;
}

export function isPackagedTranslation(
  t: Translatable,
): t is PackagedTranslation {
  return typeof t === "object" && SUPPORTED_LANGUAGES.some((lang) => lang in t);
}

/**
 * Hook that provides direct translation for {@link Translatable} types.
 */
export function useTranslatable() {
  const { t } = useTranslation();
  const translator: AutoTranslator = (
    translatable: Translatable,
    parameters: TranslationParameters = {},
  ) => {
    return tryTranslate(t, translatable, parameters);
  };
  return {
    t: translator,
  };
}

/**
 * Translates the given key or returns the original string.
 * @param t Translation function
 * @param translatable Raw string or translation key
 * @param parameters Optional parameters for translation interpolation
 */
export function tryTranslate(
  t: Translator,
  translatable: Translatable,
  parameters: TranslationParameters = {},
): string {
  if (isPackagedTranslation(translatable)) {
    const currentLanguage = i18n.language as Language;
    return (
      translatable[currentLanguage] ?? translatable[FALLBACK_LANGUAGE] ?? ""
    );
  }
  if (isTranslationKey(translatable)) {
    return t(translatable.key, parameters);
  }
  // If plain key, just translate it
  const isPlainKey = i18n.exists(translatable);
  if (isPlainKey) {
    return t(translatable, parameters);
  }
  return translatable;
}

export function packageTranslation(
  key: string,
  parameters: TranslationParameters = {},
): PackagedTranslation {
  const translation: PackagedTranslation = {};
  SUPPORTED_LANGUAGES.forEach((lang) => {
    translation[lang] = i18n.t(key, { ...parameters, lng: lang });
  });
  return translation;
}

export type DefaultTranslator = ReturnType<typeof useTranslation>["t"];
export type AutoTranslator = (
  translatable: Translatable,
  parameters?: TranslationParameters,
) => string;

export type Translator = DefaultTranslator | AutoTranslator;

export type TranslationParameters = Parameters<DefaultTranslator>[2];
