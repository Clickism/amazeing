import { useEffect, useState } from "react";
import { FALLBACK_LANGUAGE, type Language } from "../../../i18n/i18n.ts";
import { changeLanguage } from "i18next";
import { Button } from "../../Button/Button.tsx";
import { Tooltip } from "../../popup/Tooltip/Tooltip.tsx";
import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { t } = useTranslation();
  const [lang, setLang] = useState<Language>(
    (localStorage.getItem("i18nextLng") as Language) || FALLBACK_LANGUAGE,
  );

  useEffect(() => {
    changeLanguage(lang).then();
  }, [lang]);

  const handleClick = () => {
    const nextLang = lang === "en" ? "de" : "en";
    setLang(nextLang);
    localStorage.setItem("i18nextLng", nextLang);
  };

  return (
    <Tooltip content={t("language.toggle")}>
      <Button onClick={handleClick} shape="icon" variant="transparent">
        {lang === "en" ? "🇬🇧" : "🇩🇪"}
      </Button>
    </Tooltip>
  );
}
