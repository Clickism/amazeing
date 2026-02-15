import styles from "./Layout.module.css";
import clsx from "clsx";
import { ErrorBoundary } from "react-error-boundary";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  fullWidth?: boolean;
};

export function Layout({ children, fullWidth }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <main className={clsx(fullWidth && styles.fullWidth)}>
        <ErrorBoundary
          fallback={
            <>
              <h2>Something went wrong.</h2>
              <p>
                Please try refreshing the page, or contact support if the
                problem persists.
              </p>
            </>
          }
        >
          {children}
        </ErrorBoundary>
      </main>
    </div>
  );
}
