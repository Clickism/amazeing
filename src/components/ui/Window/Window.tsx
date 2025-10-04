import * as React from "react";
import styles from "./Window.module.css";

type Props = {
  children: React.ReactNode;
  title?: string;
};

export function Window({ children, title }: Props) {
  return (
    <div className={styles.window}>
      <div className={styles.background}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.foreground}>{children}</div>
      </div>
    </div>
  );
}
