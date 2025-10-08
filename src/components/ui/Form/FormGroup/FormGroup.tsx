import type { ReactNode } from "react";
import styles from "./FormGroup.module.css";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  stretch?: boolean;
};

export function FormGroup({ children, stretch }: Props) {
  return (
    <div className={clsx(styles.formGroup, stretch && styles.stretch)}>
      {children}
    </div>
  );
}
