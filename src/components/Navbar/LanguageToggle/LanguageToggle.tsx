import { useEffect, useState } from "react";
import styles from "./LanguageToggle.module.css";
import { FALLBACK_LANGUAGE, type Language } from "../../../i18n/i18n.ts";
import { changeLanguage } from "i18next";
import { Button } from "../../Button/Button.tsx";

export function LanguageToggle() {
  const [lang, setLang] = useState<Language>(
    (localStorage.getItem("i18nextLng") as Language) || FALLBACK_LANGUAGE,
  );

  useEffect(() => {
    changeLanguage(lang);
  }, [lang]);

  const handleClick = () => {
    const nextLang = lang === "en" ? "de" : "en";
    setLang(nextLang);
    localStorage.setItem("i18nextLng", nextLang);
  };

  return (
    <Button onClick={handleClick} className={styles.languageToggle}>
      {lang === "en" ? "EN" : "DE"}
    </Button>
  );
}
