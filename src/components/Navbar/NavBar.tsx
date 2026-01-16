import { PAGES } from "../../routes/pages.tsx";
import { NavBarLink } from "./NavbarLink/NavBarLink.tsx";
import styles from "./NavBar.module.css";
import { LanguageToggle } from "./LanguageToggle/LanguageToggle.tsx";
import ColorSchemeToggle from "./ThemeToggle/ColorSchemeToggle.tsx";
import { useTranslatable } from "../../i18n/i18n.ts";

export function NavBar() {
  const { t } = useTranslatable();
  return (
    <div className={styles.navbar}>
      <div className={styles.container}>
        {/*Main Links*/}
        <div className={styles.left}>
          <Logo />
          {PAGES.map(({ path, title }) => (
            <NavBarLink to={path} key={path}>
              {t(title)}
            </NavBarLink>
          ))}
        </div>
        {/*Right side links*/}
        <div className={styles.right}>
          <LanguageToggle />
          <ColorSchemeToggle />
        </div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <NavBarLink to="/" dontMatch>
      <div style={{ fontWeight: 700 }}>Amazeing</div>
    </NavBarLink>
  );
}
