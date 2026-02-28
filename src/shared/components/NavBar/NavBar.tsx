import { PAGES } from "../../../routes/pages.tsx";
import { NavBarLink } from "./NavBarLink/NavBarLink.tsx";
import styles from "./NavBar.module.css";
import { useTranslatable } from "../../i18n/i18n.ts";
import { LanguageToggle } from "./LanguageToggle/LanguageToggle.tsx";
import { ColorSchemeToggle } from "./ThemeToggle/ColorSchemeToggle.tsx";
import { Logo } from "./Logo/Logo.tsx";
import { About } from "./About/About.tsx";
import { useCalculateLayout } from "../../utils/useCalculateLayout.tsx";
import { useState } from "react";
import { Button } from "../Button/Button.tsx";
import { RxHamburgerMenu } from "react-icons/rx";
import { AnimatePresence, motion } from "motion/react";

export function NavBar() {
  const { t } = useTranslatable();
  const { isDesktop } = useCalculateLayout();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className={styles.navbar}>
      <div className={styles.container}>
        {/*Main Links*/}
        <div className={styles.left}>
          {isDesktop && <Logo />}
          {isDesktop ? (
            PAGES.map(({ path, title }) => (
              <NavBarLink to={path} key={path}>
                {t(title)}
              </NavBarLink>
            ))
          ) : (
            <Button
              variant="linky"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <RxHamburgerMenu size={24} />
            </Button>
          )}
          {!isDesktop && <Logo />}
        </div>
        {/*Right side links*/}
        <div className={styles.right}>
          <About />
          <LanguageToggle />
          <ColorSchemeToggle />
        </div>
      </div>

      <AnimatePresence>
        {!isDesktop && menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {PAGES.map(({ path, title }) => (
              <NavBarLink to={path} key={path} onClick={() => setMenuOpen(false)}>
                {t(title)}
              </NavBarLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
