import {
  type ColorScheme,
  useColorScheme,
} from "../../../theme/ColorSchemeContext.tsx";
import { Tooltip } from "../../popup/Tooltip/Tooltip.tsx";
import { useTranslation } from "react-i18next";
import styles from "./ColorSchemeToggle.module.css";
import { motion } from "motion/react";
import clsx from "clsx";
import { ImSun } from "react-icons/im";
import { BiMoon } from "react-icons/bi";

const colorSchemes: ColorScheme[] = ["light", "dark"];

export function ColorSchemeToggle() {
  const { t } = useTranslation();
  const { colorScheme, setColorScheme } = useColorScheme();
  return (
    <Tooltip content={t("colorScheme.toggle")}>
      <motion.button
        className={styles.container}
        onClick={() => {
          const nextScheme = colorScheme === "light" ? "dark" : "light";
          setColorScheme(nextScheme);
        }}
        whileHover={{ scale: 1.05, borderColor: "var(--clr-primary-a0)" }}
        whileTap={{ scale: 0.95 }}
        style={{
          borderColor: "var(--clr-surface-a20)",
        }}
      >
        {colorSchemes.map((scheme) => (
          <motion.div key={scheme} className={clsx(styles.button)}>
            {colorScheme === scheme && (
              <motion.div
                layoutId="color-scheme-indicator"
                className={styles.indicator}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 50,
                }}
              >
                {scheme === "light" ? <ImSun /> : <BiMoon />}
              </motion.div>
            )}
            <div className={styles.placeholder} />
          </motion.div>
        ))}
      </motion.button>
    </Tooltip>
  );
}
