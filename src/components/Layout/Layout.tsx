import * as React from "react";
import { Navbar } from "./Navbar/Navbar.tsx";
import styles from "./Layout.module.css";
import clsx from "clsx";
import { ErrorBoundary } from "react-error-boundary";

export function Layout({
  children,
  fullWidth,
}: {
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={clsx(fullWidth && styles.fullWidth)}>
        <ErrorBoundary fallback={<h1>Something went wrong.</h1>}>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  );
}
