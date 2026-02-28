import React from "react";
import { Link, type LinkProps, useLocation } from "react-router-dom";
import clsx from "clsx";
import styles from "./NavBarLink.module.css";
import { motion } from "motion/react";
import { useCalculateLayout } from "../../../utils/useCalculateLayout.tsx";

type NavBarLinkProps = {
  to: string;
  regex?: RegExp;
  children: React.ReactNode;
  dontMatch?: boolean;
} & LinkProps;

export function NavBarLink({
  to,
  regex,
  children,
  dontMatch,
  ...props
}: NavBarLinkProps) {
  const location = useLocation();
  const isCurrent = regex
    ? regex.test(location.pathname)
    : location.pathname === to;
  const { isDesktop } = useCalculateLayout();
  const showIndicator = isCurrent && !dontMatch;
  return (
    <Link
      to={to}
      className={clsx(styles.link, showIndicator && styles.active)}
      {...props}
    >
      {children}
      {showIndicator && isDesktop && (
        <motion.div
          layoutId="navbar-indicator"
          className={styles.indicator}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 50,
          }}
        />
      )}
    </Link>
  );
}
