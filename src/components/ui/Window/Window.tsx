import * as React from "react";
import styles from "./Window.module.css";

type Props = {
  children: React.ReactNode;
  title?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function Window({ children, title, ...props }: Props) {
  return (
    <div {...props}>
      <div className={styles.background}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.foreground}>{children}</div>
      </div>
    </div>
  );
}
