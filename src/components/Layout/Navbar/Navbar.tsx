import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import ThemeToggle from "./ThemeToggle/ThemeToggle.tsx";
import { LanguageToggle } from "./LanguageToggle/LanguageToggle.tsx";
import React from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

function NavbarLink({
  to,
  regex,
  children,
  dontMatch
}: {
  to: string;
  regex?: RegExp;
  children: React.ReactNode;
  dontMatch?: boolean;
}) {
  const location = useLocation();
  const isCurrent = regex
    ? regex.test(location.pathname)
    : location.pathname === to;
  return (
    <Link
      to={to}
      className={clsx(styles.link, isCurrent && !dontMatch && styles.currentLink)}
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  const { t } = useTranslation();
  return (
    <div className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.left}>
          <NavbarLink to="/" dontMatch>
            <div style={{ fontWeight: 700 }}>
              Prog2 Precourse
            </div>
          </NavbarLink>
          <NavbarLink to="/">Home</NavbarLink>
          <NavbarLink to="/sandbox">{t("navbar.sandbox")}</NavbarLink>
        </div>
        <div className={styles.right}>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
