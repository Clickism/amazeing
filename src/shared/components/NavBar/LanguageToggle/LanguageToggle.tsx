import { useEffect, useState } from "react";
import { FALLBACK_LANGUAGE, type Language } from "../../../i18n/i18n.ts";
import { changeLanguage } from "i18next";
import { Tooltip } from "../../../floating/Tooltip/Tooltip.tsx";
import { useTranslation } from "react-i18next";
import { IoLanguageOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "motion/react";
import styles from "./LanguageToggle.module.css";

export function LanguageToggle() {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [lang, setLang] = useState<Language>(
    (localStorage.getItem("i18nextLng") as Language) || FALLBACK_LANGUAGE,
  );

  useEffect(() => {
    changeLanguage(lang).then();
  }, [lang]);

  const toggleLanguage = () => {
    const nextLang = lang === "en" ? "de" : "en";
    setLang(nextLang);
    localStorage.setItem("i18nextLng", nextLang);
  };

  const key = isHovered ? lang : "icon";
  return (
    <Tooltip content={t("language.toggle")}>
      <motion.button
        className={styles.container}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={toggleLanguage}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          color: isHovered ? "var(--clr-primary-a20)" : "var(--text-color)",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={key}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={styles.content}
          >
            {isHovered ? (
              <span className={styles.langText}>{lang.toUpperCase()}</span>
            ) : (
              <IoLanguageOutline size={20} />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </Tooltip>
  );
}
