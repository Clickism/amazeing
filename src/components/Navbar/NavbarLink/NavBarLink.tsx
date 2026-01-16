import React from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import styles from "./NavBarLink.module.css";

type NavBarLinkProps = {
  to: string;
  regex?: RegExp;
  children: React.ReactNode;
  dontMatch?: boolean;
};

export function NavBarLink({
  to,
  regex,
  children,
  dontMatch,
}: NavBarLinkProps) {
  const location = useLocation();
  const isCurrent = regex
    ? regex.test(location.pathname)
    : location.pathname === to;
  return (
    <Link
      to={to}
      className={clsx(
        styles.link,
        isCurrent && !dontMatch && styles.active,
      )}
    >
      {children}
    </Link>
  );
}
