import * as React from "react";
import { Navbar } from "./Navbar/Navbar.tsx";
import styles from "./Layout.module.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
